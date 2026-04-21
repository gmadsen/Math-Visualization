#!/usr/bin/env node
// test-mobile-perf.mjs
// ---------------------------------------------------------------------------
// Advisory mobile-performance smoke test. Drives a headless Chromium via
// Playwright against a local HTTP server and measures:
//
//   1. 3D rotation FPS on differential-geometry.html
//      (finds the first widget wired up with make3DDraggable, simulates a
//      2-second continuous pointer drag sweeping ~360° of yaw, counts
//      rAF ticks, reports fps). Target: ≥ 30 fps in decimated-drag mode.
//   2. SVG drag FPS on complex-analysis.html (finds a draggable <circle>
//      inside a Möbius/contour widget, simulates a 2-second drag along an
//      arc, reports fps). Target: ≥ 45 fps.
//   3. Page-load timing on index.html, pathway.html, progress.html on a
//      mobile viewport (time-to-interactive ≈ domContentLoaded, plus total
//      blocking time approximated from Long Task entries). Informational.
//   4. Bundle size on the wire for concepts/bundle.js and quizzes/bundle.js
//      (Content-Length as served). Heuristic warn threshold: > 500 KiB each.
//
// All results are advisory — exit code is always 0 unless the script itself
// crashes. Targets are printed so a reader can eyeball regressions.
//
// CLI:
//   node scripts/test-mobile-perf.mjs          run the suite, print a report
//   node scripts/test-mobile-perf.mjs --list   list test targets, don't run
//   node scripts/test-mobile-perf.mjs --help   usage
//
// Graceful degradation:
//   If the `playwright` npm module cannot be resolved, OR if a Chromium
//   browser binary is not installed on this machine, the script prints a
//   clear "skipped" message with install instructions and exits 0. It
//   mirrors the style of test-offline-bundle.mjs (which similarly skips
//   when `unzip` / `python3` are absent).
//
// Playwright is otherwise a one-off exception to the zero-deps convention:
// it is NOT added to a package.json. Run `npx playwright install chromium`
// locally to enable the tests; CI is expected to skip this script.
// ---------------------------------------------------------------------------

import { spawn, execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { setTimeout as delay } from 'node:timers/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const REPO_ROOT = resolve(__dirname, '..');

const MOBILE_VIEWPORT = { width: 390, height: 844 };
const MOBILE_UA =
  'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) ' +
  'AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 ' +
  'Mobile/15E148 Safari/604.1';

const SERVE_PORT = 8766;
const BASE = `http://127.0.0.1:${SERVE_PORT}`;

const FPS_3D_TARGET = 30;
const FPS_SVG_TARGET = 45;
const BUNDLE_WARN_BYTES = 500 * 1024;

const TARGETS = [
  {
    name: '3D rotation FPS',
    page: 'differential-geometry.html',
    kind: 'fps3d',
    target: `≥ ${FPS_3D_TARGET} fps (decimated drag)`,
  },
  {
    name: 'SVG drag FPS',
    page: 'complex-analysis.html',
    kind: 'fpsSvg',
    target: `≥ ${FPS_SVG_TARGET} fps`,
  },
  {
    name: 'Page load: index.html',
    page: 'index.html',
    kind: 'load',
    target: 'informational (TTI, TBT)',
  },
  {
    name: 'Page load: pathway.html',
    page: 'pathway.html',
    kind: 'load',
    target: 'informational (TTI, TBT)',
  },
  {
    name: 'Page load: progress.html',
    page: 'progress.html',
    kind: 'load',
    target: 'informational (TTI, TBT)',
  },
  {
    name: 'Wire size: concepts/bundle.js',
    page: 'concepts/bundle.js',
    kind: 'bundle',
    target: `warn if > ${Math.round(BUNDLE_WARN_BYTES / 1024)} KiB`,
  },
  {
    name: 'Wire size: quizzes/bundle.js',
    page: 'quizzes/bundle.js',
    kind: 'bundle',
    target: `warn if > ${Math.round(BUNDLE_WARN_BYTES / 1024)} KiB`,
  },
];

// --- CLI ------------------------------------------------------------------

const args = new Set(process.argv.slice(2));
if (args.has('--help') || args.has('-h')) {
  console.log(
    [
      'Usage: node scripts/test-mobile-perf.mjs [--list]',
      '',
      '  --list            print the test targets without running them',
      '  --help, -h        show this help',
      '',
      'Advisory only — always exits 0.',
      'Requires Playwright: run `npx playwright install chromium` once,',
      'then `npm i --no-save playwright` (or similar) so the module resolves.',
    ].join('\n'),
  );
  process.exit(0);
}
if (args.has('--list')) {
  console.log('test-mobile-perf targets:\n');
  for (const t of TARGETS) {
    console.log(`  - ${t.name.padEnd(34)}  [${t.page}]  target: ${t.target}`);
  }
  process.exit(0);
}

// --- Playwright availability probe ----------------------------------------

function locatePlaywright() {
  // Try repo-local node_modules first, then the user's global install, then
  // the fallback npx cache the `npx playwright` driver unpacks into. If we
  // can resolve the module, we can drive a browser from this script. The
  // separate CLI-only path (`npx playwright` with no module) doesn't let
  // us run Node-side code in-process, so treat it as "not installed".
  const require = createRequire(import.meta.url);
  const candidates = [
    () => require.resolve('playwright', { paths: [REPO_ROOT] }),
    () => require.resolve('playwright'),
  ];
  for (const probe of candidates) {
    try {
      return probe();
    } catch {
      /* keep trying */
    }
  }
  return null;
}

const playwrightPath = locatePlaywright();
if (!playwrightPath) {
  console.log(
    'test-mobile-perf: skipped — Playwright not installed. ' +
      'Run `npx playwright install chromium` first (and make the `playwright` ' +
      'npm module resolvable, e.g. via `npm i --no-save playwright`).',
  );
  process.exit(0);
}

let chromium;
try {
  ({ chromium } = await import(playwrightPath));
} catch (err) {
  console.log(
    `test-mobile-perf: skipped — could not import Playwright at ${playwrightPath}: ${err.message || err}`,
  );
  process.exit(0);
}

// --- HTTP server ----------------------------------------------------------

function hasBinary(name) {
  try {
    execFileSync(name, ['--version'], { stdio: 'ignore' });
    return true;
  } catch {
    try {
      execFileSync(name, ['-h'], { stdio: 'ignore' });
      return true;
    } catch {
      return false;
    }
  }
}

if (!hasBinary('python3')) {
  console.log(
    'test-mobile-perf: skipped — `python3` not on PATH (needed to serve files over http).',
  );
  process.exit(0);
}

for (const f of ['index.html', 'pathway.html', 'progress.html']) {
  if (!existsSync(join(REPO_ROOT, f))) {
    console.log(`test-mobile-perf: skipped — missing ${f} at repo root`);
    process.exit(0);
  }
}

console.log(
  `test-mobile-perf: starting http.server on :${SERVE_PORT} serving ${REPO_ROOT}`,
);
const server = spawn('python3', ['-m', 'http.server', String(SERVE_PORT)], {
  cwd: REPO_ROOT,
  stdio: ['ignore', 'ignore', 'pipe'],
});
let serverDied = false;
server.on('exit', () => {
  serverDied = true;
});

async function waitForServer() {
  for (let i = 0; i < 25; i += 1) {
    if (serverDied) return false;
    try {
      const r = await fetch(`${BASE}/index.html`, { method: 'HEAD' });
      if (r.ok || r.status === 200) return true;
    } catch {
      /* not yet */
    }
    await delay(200);
  }
  return false;
}

function stopServer() {
  if (serverDied) return;
  try {
    server.kill('SIGTERM');
  } catch {
    /* already gone */
  }
}

process.on('exit', stopServer);
process.on('SIGINT', () => {
  stopServer();
  process.exit(130);
});

if (!(await waitForServer())) {
  console.log('test-mobile-perf: skipped — local server never came up');
  stopServer();
  process.exit(0);
}

// --- Launch browser -------------------------------------------------------

let browser;
try {
  browser = await chromium.launch({ headless: true });
} catch (err) {
  console.log(
    'test-mobile-perf: skipped — could not launch Chromium: ' +
      `${err.message || err}`,
  );
  console.log('  Run `npx playwright install chromium` to install the browser.');
  stopServer();
  process.exit(0);
}

const context = await browser.newContext({
  viewport: MOBILE_VIEWPORT,
  userAgent: MOBILE_UA,
  deviceScaleFactor: 3,
  isMobile: true,
  hasTouch: true,
});

const report = [];

// --- Test helpers ---------------------------------------------------------

async function measure3dFps() {
  const page = await context.newPage();
  const url = `${BASE}/differential-geometry.html`;
  await page.goto(url, { waitUntil: 'domcontentloaded' });

  // Give the page helper scripts a beat to wire up widgets.
  await page.waitForLoadState('load');
  await delay(300);

  // Find an SVG whose parent widget uses make3DDraggable. In differential-
  // geometry.html every such svg has cursor:'grab' set as inline style via
  // make3DDraggable. Fall back to the first .widget svg.
  const box = await page.evaluate(() => {
    const svgs = Array.from(document.querySelectorAll('.widget svg'));
    const pick =
      svgs.find((s) => (s.style && s.style.cursor) === 'grab') || svgs[0];
    if (!pick) return null;
    pick.scrollIntoView({ block: 'center' });
    const r = pick.getBoundingClientRect();
    return {
      x: r.left + r.width / 2,
      y: r.top + r.height / 2,
      w: r.width,
      h: r.height,
    };
  });
  if (!box) {
    await page.close();
    return { fps: null, note: 'no .widget svg found' };
  }

  // Install an rAF counter before we start the drag.
  await page.evaluate(() => {
    window.__mvFrames = 0;
    let running = true;
    window.__mvStopFrameCount = () => {
      running = false;
    };
    const tick = () => {
      if (!running) return;
      window.__mvFrames += 1;
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });

  // Simulate a 2-second continuous drag sweeping ~360° of yaw. The svg is
  // small (maybe ~360 px wide); yaw sensitivity defaults to 0.01, so we
  // need ~628 px of horizontal travel for a full 2π turn. We loop a short
  // back-and-forth path to stay inside the viewport.
  const steps = 60;
  const durationMs = 2000;
  const radius = Math.min(box.w, box.h) * 0.4;

  await page.mouse.move(box.x, box.y);
  await page.mouse.down();
  const start = Date.now();
  for (let i = 0; i < steps; i += 1) {
    const t = (i + 1) / steps;
    const theta = t * 2 * Math.PI;
    const x = box.x + Math.cos(theta) * radius;
    const y = box.y + Math.sin(theta) * radius * 0.4;
    // eslint-disable-next-line no-await-in-loop
    await page.mouse.move(x, y, { steps: 3 });
    // eslint-disable-next-line no-await-in-loop
    await delay(Math.max(0, durationMs / steps - 2));
  }
  await page.mouse.up();
  const elapsed = (Date.now() - start) / 1000;

  const frames = await page.evaluate(() => {
    window.__mvStopFrameCount();
    return window.__mvFrames;
  });
  await page.close();
  const fps = elapsed > 0 ? frames / elapsed : 0;
  return { fps, frames, elapsed };
}

async function measureSvgDragFps() {
  const page = await context.newPage();
  const url = `${BASE}/complex-analysis.html`;
  await page.goto(url, { waitUntil: 'domcontentloaded' });
  await page.waitForLoadState('load');
  await delay(300);

  // Find a draggable handle. complex-analysis.html uses <circle
  // data-i="N"> with mousedown listeners inside the Möbius widget. Fall
  // back to any <circle> in a widget svg.
  const box = await page.evaluate(() => {
    let handle =
      document.querySelector('.widget svg circle[data-i]') ||
      document.querySelector('.widget svg circle');
    if (!handle) return null;
    handle.scrollIntoView({ block: 'center' });
    const r = handle.getBoundingClientRect();
    return {
      x: r.left + r.width / 2,
      y: r.top + r.height / 2,
    };
  });
  if (!box) {
    await page.close();
    return { fps: null, note: 'no draggable circle found' };
  }

  await page.evaluate(() => {
    window.__mvFrames = 0;
    let running = true;
    window.__mvStopFrameCount = () => {
      running = false;
    };
    const tick = () => {
      if (!running) return;
      window.__mvFrames += 1;
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });

  // 2-second arc around the handle's starting position.
  const steps = 60;
  const durationMs = 2000;
  const radius = 40;

  await page.mouse.move(box.x, box.y);
  await page.mouse.down();
  const start = Date.now();
  for (let i = 0; i < steps; i += 1) {
    const t = (i + 1) / steps;
    const theta = t * 2 * Math.PI;
    const x = box.x + Math.cos(theta) * radius;
    const y = box.y + Math.sin(theta) * radius;
    // eslint-disable-next-line no-await-in-loop
    await page.mouse.move(x, y, { steps: 3 });
    // eslint-disable-next-line no-await-in-loop
    await delay(Math.max(0, durationMs / steps - 2));
  }
  await page.mouse.up();
  const elapsed = (Date.now() - start) / 1000;

  const frames = await page.evaluate(() => {
    window.__mvStopFrameCount();
    return window.__mvFrames;
  });
  await page.close();
  const fps = elapsed > 0 ? frames / elapsed : 0;
  return { fps, frames, elapsed };
}

async function measurePageLoad(pagePath) {
  const page = await context.newPage();
  // Observe Long Tasks to approximate total-blocking-time.
  await page.addInitScript(() => {
    window.__mvLongTasks = [];
    try {
      const obs = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          window.__mvLongTasks.push({
            start: entry.startTime,
            duration: entry.duration,
          });
        }
      });
      obs.observe({ entryTypes: ['longtask'] });
    } catch {
      /* browser doesn't support it */
    }
  });

  const start = Date.now();
  await page.goto(`${BASE}/${pagePath}`, { waitUntil: 'domcontentloaded' });
  const domContentLoadedMs = Date.now() - start;
  await page.waitForLoadState('load');
  const loadMs = Date.now() - start;
  // Give it a moment for long-task entries to fire.
  await delay(500);

  const tbt = await page.evaluate(() => {
    const tasks = window.__mvLongTasks || [];
    // Total blocking time = sum over long tasks of (duration - 50ms).
    return tasks.reduce((acc, t) => acc + Math.max(0, t.duration - 50), 0);
  });

  await page.close();
  return { domContentLoadedMs, loadMs, tbtMs: Math.round(tbt) };
}

async function measureBundleSize(pagePath) {
  try {
    const r = await fetch(`${BASE}/${pagePath}`);
    if (!r.ok) {
      return { bytes: null, note: `HTTP ${r.status}` };
    }
    const body = await r.arrayBuffer();
    return { bytes: body.byteLength };
  } catch (err) {
    return { bytes: null, note: err.message || String(err) };
  }
}

// --- Run suite ------------------------------------------------------------

function fmtBytes(b) {
  if (b == null) return '—';
  if (b < 1024) return `${b} B`;
  const units = ['KiB', 'MiB'];
  let n = b / 1024;
  let i = 0;
  while (n >= 1024 && i < units.length - 1) {
    n /= 1024;
    i += 1;
  }
  return `${n.toFixed(2)} ${units[i]}`;
}

try {
  console.log('\n[1] 3D rotation FPS (differential-geometry.html)');
  try {
    const r = await measure3dFps();
    if (r.fps == null) {
      report.push({ name: '3D rotation FPS', status: 'skip', detail: r.note });
      console.log(`  SKIP  ${r.note}`);
    } else {
      const pass = r.fps >= FPS_3D_TARGET;
      const tag = pass ? 'OK   ' : 'WARN ';
      report.push({
        name: '3D rotation FPS',
        status: pass ? 'ok' : 'warn',
        detail: `${r.fps.toFixed(1)} fps (${r.frames} frames / ${r.elapsed.toFixed(2)}s)`,
      });
      console.log(
        `  ${tag} ${r.fps.toFixed(1)} fps over ${r.elapsed.toFixed(2)}s ` +
          `(target ≥ ${FPS_3D_TARGET})`,
      );
    }
  } catch (err) {
    console.log(`  ERR   ${err.message || err}`);
    report.push({
      name: '3D rotation FPS',
      status: 'err',
      detail: err.message || String(err),
    });
  }

  console.log('\n[2] SVG drag FPS (complex-analysis.html)');
  try {
    const r = await measureSvgDragFps();
    if (r.fps == null) {
      report.push({ name: 'SVG drag FPS', status: 'skip', detail: r.note });
      console.log(`  SKIP  ${r.note}`);
    } else {
      const pass = r.fps >= FPS_SVG_TARGET;
      const tag = pass ? 'OK   ' : 'WARN ';
      report.push({
        name: 'SVG drag FPS',
        status: pass ? 'ok' : 'warn',
        detail: `${r.fps.toFixed(1)} fps (${r.frames} frames / ${r.elapsed.toFixed(2)}s)`,
      });
      console.log(
        `  ${tag} ${r.fps.toFixed(1)} fps over ${r.elapsed.toFixed(2)}s ` +
          `(target ≥ ${FPS_SVG_TARGET})`,
      );
    }
  } catch (err) {
    console.log(`  ERR   ${err.message || err}`);
    report.push({
      name: 'SVG drag FPS',
      status: 'err',
      detail: err.message || String(err),
    });
  }

  console.log('\n[3] Page-load timing (mobile viewport, informational)');
  for (const p of ['index.html', 'pathway.html', 'progress.html']) {
    try {
      // eslint-disable-next-line no-await-in-loop
      const r = await measurePageLoad(p);
      console.log(
        `  INFO  ${p.padEnd(16)} ` +
          `DCL ${r.domContentLoadedMs} ms · ` +
          `load ${r.loadMs} ms · ` +
          `TBT ~${r.tbtMs} ms`,
      );
      report.push({
        name: `Load ${p}`,
        status: 'info',
        detail: `DCL ${r.domContentLoadedMs}ms, load ${r.loadMs}ms, TBT ~${r.tbtMs}ms`,
      });
    } catch (err) {
      console.log(`  ERR   ${p}: ${err.message || err}`);
      report.push({
        name: `Load ${p}`,
        status: 'err',
        detail: err.message || String(err),
      });
    }
  }

  console.log('\n[4] Bundle size on the wire');
  for (const p of ['concepts/bundle.js', 'quizzes/bundle.js']) {
    // eslint-disable-next-line no-await-in-loop
    const r = await measureBundleSize(p);
    if (r.bytes == null) {
      console.log(`  SKIP  ${p}: ${r.note}`);
      report.push({ name: `Size ${p}`, status: 'skip', detail: r.note });
    } else {
      const over = r.bytes > BUNDLE_WARN_BYTES;
      const tag = over ? 'WARN ' : 'OK   ';
      console.log(
        `  ${tag} ${p.padEnd(20)} ${fmtBytes(r.bytes)} ` +
          `(threshold ${fmtBytes(BUNDLE_WARN_BYTES)})`,
      );
      report.push({
        name: `Size ${p}`,
        status: over ? 'warn' : 'ok',
        detail: fmtBytes(r.bytes),
      });
    }
  }
} finally {
  await context.close();
  await browser.close();
  stopServer();
}

// --- Summary --------------------------------------------------------------

console.log('\n--- summary (advisory; always exits 0) ---');
for (const row of report) {
  const tag =
    row.status === 'ok'
      ? 'OK  '
      : row.status === 'warn'
        ? 'WARN'
        : row.status === 'err'
          ? 'ERR '
          : row.status === 'skip'
            ? 'SKIP'
            : 'INFO';
  console.log(`  ${tag}  ${row.name.padEnd(28)}  ${row.detail}`);
}

process.exit(0);
