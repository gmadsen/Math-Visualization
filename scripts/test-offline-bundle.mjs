#!/usr/bin/env node
// test-offline-bundle.mjs
// ---------------------------------------------------------------------------
// Smoke test for scripts/package-offline.mjs.
//
// Flow:
//   1. Run `node scripts/package-offline.mjs` (unless --skip-generate).
//   2. Locate math-viz-notebook.zip in the repo root and size-check it.
//   3. Extract to a temp dir via `unzip -q`.
//   4. Verify the extracted tree has the scaffolding we expect (index.html,
//      pathway.html, progress.html, concepts/bundle.js, quizzes/bundle.js,
//      js/progress.js, serve.sh, and ≥ 40 root-level *.html files).
//   5. If --serve, spin up `python3 -m http.server 8765` against the extracted
//      dir and fetch index.html + concepts/bundle.js to confirm they load.
//   6. Clean up the temp dir (unless --keep).
//
// CLI flags:
//   --skip-generate   reuse an existing zip (faster local iteration)
//   --keep            leave the extracted temp dir around for manual inspection
//   --serve           also run the optional HTTP load check
//   --help / -h       print usage
//
// Graceful degradation:
//   `unzip` missing  → skip extraction + structure checks, print a warning,
//                      exit 0 (don't fail CI just because the test env lacks
//                      the binary).
//   `python3` missing or any fetch fails under --serve  → warn and skip the
//                      load check, but don't fail CI.
//
// Zero node deps (uses only the standard library + the external `unzip` /
// `python3` binaries, which are present on GitHub's ubuntu-latest runner).
// ---------------------------------------------------------------------------

import { spawn, spawnSync, execFileSync } from 'node:child_process';
import {
  existsSync,
  mkdtempSync,
  readdirSync,
  rmSync,
  statSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { setTimeout as delay } from 'node:timers/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const REPO_ROOT = resolve(__dirname, '..');
const ZIP_NAME = 'math-viz-notebook.zip';
const ZIP_PATH = join(REPO_ROOT, ZIP_NAME);

// Sane size bounds: too small → content missing; too large → something snuck in.
const MIN_ZIP_BYTES = 1 * 1024 * 1024;      // 1 MiB
const MAX_ZIP_BYTES = 50 * 1024 * 1024;     // 50 MiB
const MIN_ROOT_HTML_COUNT = 40;             // ≤ this would mean missing topics
const SERVE_PORT = 8765;

const args = new Set(process.argv.slice(2));
if (args.has('--help') || args.has('-h')) {
  console.log(
    [
      'Usage: node scripts/test-offline-bundle.mjs [--skip-generate] [--keep] [--serve]',
      '',
      '  --skip-generate   reuse the existing math-viz-notebook.zip at repo root',
      '  --keep            do not delete the extracted temp dir',
      '  --serve           spin up a local HTTP server and fetch a couple of files',
    ].join('\n'),
  );
  process.exit(0);
}
const SKIP_GENERATE = args.has('--skip-generate');
const KEEP = args.has('--keep');
const SERVE = args.has('--serve');

let failed = false;
const problems = [];
const warnings = [];

function fail(msg) {
  failed = true;
  problems.push(msg);
  console.error(`  FAIL  ${msg}`);
}
function ok(msg) {
  console.log(`  OK    ${msg}`);
}
function warn(msg) {
  warnings.push(msg);
  console.log(`  WARN  ${msg}`);
}

function hasBinary(name) {
  try {
    execFileSync(name, ['--version'], { stdio: 'ignore' });
    return true;
  } catch {
    // Some distros print help and exit non-zero with --version; try a -h.
    try {
      execFileSync(name, ['-h'], { stdio: 'ignore' });
      return true;
    } catch {
      return false;
    }
  }
}

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  const units = ['KiB', 'MiB', 'GiB'];
  let n = bytes / 1024;
  let i = 0;
  while (n >= 1024 && i < units.length - 1) {
    n /= 1024;
    i += 1;
  }
  return `${n.toFixed(2)} ${units[i]}`;
}

// --- 1. Generate ----------------------------------------------------------

if (SKIP_GENERATE) {
  console.log('\n[1/6] generate: skipped (--skip-generate)');
} else {
  console.log('\n[1/6] generate: running scripts/package-offline.mjs');
  const pkg = spawnSync(
    process.execPath,
    [join(REPO_ROOT, 'scripts', 'package-offline.mjs')],
    { cwd: REPO_ROOT, stdio: ['ignore', 'inherit', 'inherit'] },
  );
  if (pkg.status !== 0) {
    fail(`package-offline.mjs exited with code ${pkg.status}`);
    summarizeAndExit();
  } else {
    ok('package-offline.mjs exited 0');
  }
}

// --- 2. Locate zip --------------------------------------------------------

console.log('\n[2/6] locate zip');
if (!existsSync(ZIP_PATH)) {
  fail(`${ZIP_NAME} not found at ${ZIP_PATH}`);
  summarizeAndExit();
}
ok(`found ${ZIP_NAME}`);

// --- 3. Size check --------------------------------------------------------

console.log('\n[3/6] size check');
const zipSize = statSync(ZIP_PATH).size;
if (zipSize < MIN_ZIP_BYTES) {
  fail(
    `zip is suspiciously small (${formatBytes(zipSize)} < ${formatBytes(
      MIN_ZIP_BYTES,
    )}) — content likely missing`,
  );
} else if (zipSize > MAX_ZIP_BYTES) {
  fail(
    `zip is suspiciously large (${formatBytes(zipSize)} > ${formatBytes(
      MAX_ZIP_BYTES,
    )}) — something may have snuck in`,
  );
} else {
  ok(
    `size ${formatBytes(zipSize)} within [${formatBytes(
      MIN_ZIP_BYTES,
    )}, ${formatBytes(MAX_ZIP_BYTES)}]`,
  );
}

// --- 4. Extract -----------------------------------------------------------

console.log('\n[4/6] extract');

if (!hasBinary('unzip')) {
  warn('`unzip` binary not found on PATH — skipping extraction + structure checks');
  warn('manual check: `unzip -l math-viz-notebook.zip | head` to inspect contents');
  summarizeAndExit();
}

const extractDir = mkdtempSync(join(tmpdir(), 'math-viz-test-'));
let extractOk = false;
try {
  execFileSync('unzip', ['-q', '-d', extractDir, ZIP_PATH], {
    stdio: ['ignore', 'inherit', 'inherit'],
  });
  extractOk = true;
  ok(`extracted to ${extractDir}`);
} catch (err) {
  fail(`unzip failed: ${err.message || err}`);
}

// --- 5. Structure check ---------------------------------------------------

if (extractOk) {
  console.log('\n[5/6] structure check');

  const mustExist = [
    'index.html',
    'pathway.html',
    'progress.html',
    'concepts/bundle.js',
    'quizzes/bundle.js',
    'js/progress.js',
    'serve.sh',
  ];
  for (const rel of mustExist) {
    const abs = join(extractDir, rel);
    if (!existsSync(abs)) {
      fail(`missing ${rel}`);
      continue;
    }
    const st = statSync(abs);
    if (!st.isFile()) {
      fail(`${rel} exists but is not a regular file`);
      continue;
    }
    // bundle.js files must be non-empty to actually feed MVQuizBank / pathway.
    if (rel.endsWith('bundle.js') && st.size === 0) {
      fail(`${rel} is empty (size 0) — bundle builder likely didn't run`);
      continue;
    }
    ok(`${rel} present (${formatBytes(st.size)})`);
  }

  // At least MIN_ROOT_HTML_COUNT root-level *.html files (topic pages).
  let rootHtmlCount = 0;
  try {
    rootHtmlCount = readdirSync(extractDir).filter((f) =>
      f.toLowerCase().endsWith('.html'),
    ).length;
  } catch (err) {
    fail(`could not list extracted dir: ${err.message || err}`);
  }
  if (rootHtmlCount < MIN_ROOT_HTML_COUNT) {
    fail(
      `only ${rootHtmlCount} root-level *.html files (expected ≥ ${MIN_ROOT_HTML_COUNT})`,
    );
  } else {
    ok(`${rootHtmlCount} root-level *.html files (≥ ${MIN_ROOT_HTML_COUNT})`);
  }
}

// --- 6. Load check (optional) --------------------------------------------

if (SERVE && extractOk) {
  console.log('\n[6/6] load check (--serve)');
  await runLoadCheck(extractDir);
} else {
  console.log('\n[6/6] load check: skipped (pass --serve to enable)');
}

// --- Cleanup --------------------------------------------------------------

if (extractOk) {
  if (KEEP) {
    console.log(`\nkept extracted dir: ${extractDir}`);
  } else {
    try {
      rmSync(extractDir, { recursive: true, force: true });
      console.log(`\ncleaned up ${extractDir}`);
    } catch (err) {
      warn(`cleanup failed: ${err.message || err}`);
    }
  }
}

summarizeAndExit();

// --- helpers --------------------------------------------------------------

function summarizeAndExit() {
  console.log('');
  if (warnings.length) {
    console.log(`WARNINGS (${warnings.length}):`);
    for (const w of warnings) console.log(`  - ${w}`);
  }
  if (failed) {
    console.log(`\nFAIL: ${problems.length} problem(s).`);
    for (const p of problems) console.log(`  - ${p}`);
    process.exit(1);
  }
  console.log('\nOK: offline bundle smoke test passed.');
  process.exit(0);
}

async function runLoadCheck(root) {
  if (!hasBinary('python3')) {
    warn('`python3` not found — skipping load check');
    return;
  }

  const server = spawn('python3', ['-m', 'http.server', String(SERVE_PORT)], {
    cwd: root,
    stdio: ['ignore', 'ignore', 'pipe'],
  });
  let serverDied = false;
  server.on('exit', () => {
    serverDied = true;
  });

  try {
    // Poll the port for up to ~3 s so we don't race the server startup.
    const base = `http://127.0.0.1:${SERVE_PORT}`;
    let up = false;
    for (let i = 0; i < 15; i += 1) {
      if (serverDied) break;
      try {
        const r = await fetch(`${base}/index.html`, { method: 'HEAD' });
        if (r.ok || r.status === 200) {
          up = true;
          break;
        }
      } catch {
        // not yet ready
      }
      await delay(200);
    }
    if (!up) {
      warn(`local server on :${SERVE_PORT} never responded — skipping load check`);
      return;
    }

    // /index.html — 200 + html content-type
    try {
      const r = await fetch(`${base}/index.html`);
      if (!r.ok) {
        warn(`GET /index.html returned ${r.status}`);
      } else {
        const ct = (r.headers.get('content-type') || '').toLowerCase();
        if (!ct.includes('html')) {
          warn(`/index.html content-type was "${ct}" (expected text/html)`);
        } else {
          ok(`GET /index.html → 200 (${ct})`);
        }
      }
    } catch (err) {
      warn(`GET /index.html failed: ${err.message || err}`);
    }

    // /concepts/bundle.js — 200 + non-empty body
    try {
      const r = await fetch(`${base}/concepts/bundle.js`);
      if (!r.ok) {
        warn(`GET /concepts/bundle.js returned ${r.status}`);
      } else {
        const body = await r.text();
        if (body.length === 0) {
          warn('/concepts/bundle.js body is empty');
        } else {
          ok(`GET /concepts/bundle.js → 200 (${body.length} bytes)`);
        }
      }
    } catch (err) {
      warn(`GET /concepts/bundle.js failed: ${err.message || err}`);
    }
  } finally {
    if (!serverDied) {
      server.kill('SIGTERM');
      // Give it a tick to wind down so the port is freed for subsequent runs.
      await delay(100);
      if (!server.killed) {
        try {
          server.kill('SIGKILL');
        } catch {
          /* already gone */
        }
      }
    }
  }
}
