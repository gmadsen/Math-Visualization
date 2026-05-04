#!/usr/bin/env node
// Runtime widget audit: load each topic page in jsdom, exercise every
// .widget's controls (sliders / buttons / selects), and report widgets
// where:
//   - boot threw a script error
//   - the widget has no children after boot (markup didn't render)
//   - a slider/button/select fired no observable state change in the
//     widget's readout / SVG / .out element after a synthetic interaction
//   - a console error fired during interaction
//
// Output is a triage list: one line per finding, sorted by topic. Always
// exits 0 (advisory). For deep behavioural correctness this is necessary
// but not sufficient — it catches dead controls, render failures, and
// crashes, but not wrong-formula or wrong-sign math bugs.
//
// CLI:
//   node scripts/audit-widget-runtime.mjs                   # all topics
//   node scripts/audit-widget-runtime.mjs --only foo,bar    # subset
//   node scripts/audit-widget-runtime.mjs --json            # JSON output
//   node scripts/audit-widget-runtime.mjs --quiet           # only show broken
//
// Reuses the inline-local-scripts + KaTeX/canvas/observer stubs pattern
// from test-topic-jsdom.mjs. Single-process sequential — running ~140
// JSDOM instances takes ~10 minutes but avoids subprocess overhead.

import { readFileSync, readdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { JSDOM, VirtualConsole } from 'jsdom';

const __filename = fileURLToPath(import.meta.url);
const repoRoot = resolve(dirname(__filename), '..');

const argv = process.argv.slice(2);
const ONLY = (() => {
  const i = argv.indexOf('--only');
  if (i >= 0 && argv[i + 1]) return new Set(argv[i + 1].split(',').map(s => s.trim()));
  return null;
})();
const JSON_OUT = argv.includes('--json');
const QUIET = argv.includes('--quiet');

// ─── topic discovery ────────────────────────────────────────────────────

const topicSlugs = (() => {
  const contentDir = join(repoRoot, 'content');
  const slugs = readdirSync(contentDir)
    .filter((f) => f.endsWith('.json'))
    .map((f) => f.slice(0, -'.json'.length));
  return ONLY ? slugs.filter((s) => ONLY.has(s)) : slugs;
})();

// ─── inline local scripts (same as test-topic-jsdom) ────────────────────

const LOCAL_SRC_RE = /<script\b[^>]*\bsrc=["'](\.\/?[^"']+)["'][^>]*>\s*<\/script>/gi;
const CDN_SRC_RE = /<script\b[^>]*\bsrc=["']https?:\/\/[^"']+["'][^>]*>\s*<\/script>/gi;
const CDN_LINK_RE = /<link\b[^>]*\bhref=["']https?:\/\/[^"']+["'][^>]*>/gi;

const fileCache = new Map();
function readUtf8(absPath) {
  if (!fileCache.has(absPath)) {
    try {
      fileCache.set(absPath, readFileSync(absPath, 'utf8'));
    } catch {
      fileCache.set(absPath, null);
    }
  }
  return fileCache.get(absPath);
}

function inlineLocalScripts(html) {
  let out = html.replace(LOCAL_SRC_RE, (full, src) => {
    const clean = src.replace(/^\.\//, '');
    const abs = join(repoRoot, clean);
    const body = readUtf8(abs);
    if (body == null) return `<!-- missing local script: ${src} -->`;
    return `<script>${body}</script>`;
  });
  out = out.replace(CDN_SRC_RE, '<!-- cdn script dropped -->');
  out = out.replace(CDN_LINK_RE, '<!-- cdn link dropped -->');
  return out;
}

// ─── jsdom beforeParse stubs (KaTeX + canvas + observers) ───────────────

function beforeParseStubs(window) {
  window.katex = { render: () => {}, renderToString: () => '' };
  window.renderMathInElement = () => {};
  try { window.localStorage.clear(); } catch {}

  if (typeof window.IntersectionObserver !== 'function') {
    window.IntersectionObserver = class {
      constructor() {} observe() {} unobserve() {} disconnect() {} takeRecords() { return []; }
    };
  }
  if (typeof window.ResizeObserver !== 'function') {
    window.ResizeObserver = class { constructor() {} observe() {} unobserve() {} disconnect() {} };
  }
  if (window.HTMLCanvasElement) {
    const noop = () => {};
    const mkImg = (w, h) => ({ data: new Uint8ClampedArray(w * h * 4), width: w, height: h });
    window.HTMLCanvasElement.prototype.getContext = function (kind) {
      if (kind !== '2d') return null;
      const target = {
        canvas: this, fillStyle: '#000', strokeStyle: '#000', lineWidth: 1,
        font: '10px sans-serif', textAlign: 'left', textBaseline: 'top', globalAlpha: 1,
        fillRect: noop, strokeRect: noop, clearRect: noop,
        beginPath: noop, closePath: noop, moveTo: noop, lineTo: noop,
        arc: noop, rect: noop, fill: noop, stroke: noop,
        fillText: noop, strokeText: noop,
        measureText: () => ({ width: 0 }),
        createLinearGradient: () => ({ addColorStop: noop }),
        createRadialGradient: () => ({ addColorStop: noop }),
        save: noop, restore: noop, translate: noop, scale: noop, rotate: noop,
        transform: noop, setTransform: noop, resetTransform: noop,
        drawImage: noop,
        getImageData: (x, y, w, h) => mkImg(w, h),
        putImageData: noop,
        createImageData: (w, h) => mkImg(w, h),
      };
      return new Proxy(target, {
        get(t, key) { return key in t ? t[key] : noop; },
        set(t, key, v) { t[key] = v; return true; },
      });
    };
  }
  if (typeof window.matchMedia !== 'function') {
    window.matchMedia = (q) => ({
      matches: false, media: q, onchange: null,
      addListener: () => {}, removeListener: () => {},
      addEventListener: () => {}, removeEventListener: () => {}, dispatchEvent: () => false,
    });
  }
}

// ─── widget exercise ────────────────────────────────────────────────────

function svgFingerprint(svg) {
  // Stable, change-sensitive fingerprint of an SVG's mutable state. Counting
  // innerHTML length collapses every meaningful redraw into a single integer
  // and produced ~57 false-positive "inert-controls" findings (every widget
  // whose redraw kept the same number of elements registered as no-change).
  // Sample every element's tag, key visual attributes, and text content; hash
  // each into a small string and join. Two redraws with different geometry
  // will differ on this fingerprint even when the element count is identical.
  const parts = [];
  for (const el of svg.querySelectorAll('*')) {
    const tag = el.tagName.toLowerCase();
    // Visual attributes that change on redraw. d/points dominate paths and
    // polylines; cx/cy/r dominate circles; x/x1/x2/y/y1/y2 dominate
    // lines/rects; fill/stroke change palette swaps; transform catches g.
    const attrs = ['d','points','cx','cy','r','x','x1','x2','y','y1','y2','width','height','fill','stroke','transform'];
    const sig = attrs.map(a => el.getAttribute(a) || '').join('|');
    const text = (el.textContent || '').slice(0, 32);
    parts.push(`${tag}:${sig}:${text}`);
  }
  return parts.join('\n');
}

function snapshotWidget(widget) {
  // Capture a string fingerprint of the widget's mutable state: SVG geometry
  // (per-element attribute fingerprint, not just length), readout text,
  // and child count.
  const readoutEls = widget.querySelectorAll('.readout, .out, [id$="-out"]');
  const readoutText = [...readoutEls].map(e => e.textContent || '').join('|');
  const svgs = widget.querySelectorAll('svg');
  const svgFp = [...svgs].map(svgFingerprint).join('\n---\n');
  const childCount = widget.children.length;
  return { readoutText, svgFp, childCount };
}

function snapshotEqual(a, b) {
  return a.readoutText === b.readoutText && a.svgFp === b.svgFp;
}

function exerciseControl(window, widget, control) {
  // Exercise one control. Returns true if dispatching succeeded without
  // throwing (errors are captured separately by the virtual console).
  try {
    const tag = control.tagName.toLowerCase();
    const type = (control.type || '').toLowerCase();
    if (tag === 'input' && type === 'range') {
      // Set to a step-aligned position ~75% of range. Browsers snap range
      // inputs to step in the UI, but jsdom stores whatever string you
      // assign — so we have to snap manually or scripts that floor/round
      // value to an integer index will see a non-integer and either NaN
      // out or throw RangeError on Array(n) constructions.
      const min = parseFloat(control.min);
      const max = parseFloat(control.max);
      const step = parseFloat(control.step) || 1;
      const lo = Number.isFinite(min) ? min : 0;
      const hi = Number.isFinite(max) ? max : 1;
      const stepCount = Math.max(1, Math.floor((hi - lo) / step));
      const cur = parseFloat(control.value);
      const targetIdx = Math.floor(stepCount * 0.75);
      let newVal = lo + targetIdx * step;
      // If we landed on the default, try 25% position instead.
      if (Math.abs(newVal - cur) < 1e-9) {
        newVal = lo + Math.floor(stepCount * 0.25) * step;
      }
      control.value = String(newVal);
      control.dispatchEvent(new window.Event('input', { bubbles: true }));
      control.dispatchEvent(new window.Event('change', { bubbles: true }));
    } else if (tag === 'input' && (type === 'number' || type === 'text')) {
      // Skip — typed inputs need contextual values
    } else if (tag === 'select') {
      const opts = [...control.options];
      if (opts.length > 1) {
        const next = opts.find(o => !o.selected) || opts[0];
        control.value = next.value;
        control.dispatchEvent(new window.Event('change', { bubbles: true }));
      }
    } else if (tag === 'button') {
      control.click();
    }
    return true;
  } catch {
    return false;
  }
}

// ─── per-topic audit ────────────────────────────────────────────────────

async function auditTopic(slug) {
  const file = `${slug}.html`;
  const abs = join(repoRoot, file);
  const html = readFileSync(abs, 'utf8');
  const inlined = inlineLocalScripts(html);

  const errors = [];
  const vc = new VirtualConsole();
  vc.on('jsdomError', (e) => errors.push(e?.message || String(e)));

  const dom = new JSDOM(inlined, {
    runScripts: 'dangerously',
    pretendToBeVisual: true,
    virtualConsole: vc,
    url: `file://${abs}`,
    beforeParse: beforeParseStubs,
  });

  // Allow async boot (DOMContentLoaded handlers etc.)
  await new Promise((r) => setTimeout(r, 200));

  const findings = [];
  const window = dom.window;

  try {
    const widgets = [...window.document.querySelectorAll('.widget')];

    if (errors.length) {
      findings.push({ widget: '(page boot)', kind: 'boot-error', detail: errors.slice(0, 3).join(' || ') });
    }

    for (const widget of widgets) {
      const wid = widget.id || '(no-id)';

      // Skip quiz widgets — they have their own test path
      if (widget.classList.contains('quiz')) continue;

      if (widget.children.length === 0) {
        findings.push({ widget: wid, kind: 'empty-widget', detail: 'no children after boot' });
        continue;
      }

      // Find controls inside this widget
      const controls = [...widget.querySelectorAll('input[type=range], select, button:not(.quiz-submit):not(.quiz-next)')];

      if (controls.length === 0) {
        // Widget might be a static illustration — not a finding by itself
        continue;
      }

      let anyChange = false;
      let preErrCount = errors.length;
      // Re-baseline before each control. If we sample once at the start, a
      // control that DOES cause a change masks every subsequent inert sibling
      // (the post-snapshot stays "different from initial baseline" even when
      // a sibling click triggered no redraw of its own).
      let before = snapshotWidget(widget);

      for (const control of controls) {
        const ok = exerciseControl(window, widget, control);
        if (!ok) {
          const cid = control.id || control.tagName.toLowerCase();
          findings.push({ widget: wid, kind: 'control-throw', detail: `dispatch failed on ${cid}` });
          continue;
        }
        // Wait briefly for any async re-render
        await new Promise((r) => setTimeout(r, 10));

        const after = snapshotWidget(widget);
        if (!snapshotEqual(before, after)) anyChange = true;
        before = after;  // re-baseline so the next control is judged on its own
      }

      const postErrs = errors.slice(preErrCount);
      if (postErrs.length) {
        findings.push({ widget: wid, kind: 'interaction-error', detail: postErrs.slice(0, 2).join(' || ').slice(0, 200) });
      }

      if (!anyChange && controls.length > 0 && postErrs.length === 0) {
        const ids = controls.map(c => c.id || c.tagName.toLowerCase()).slice(0, 3).join(',');
        findings.push({ widget: wid, kind: 'inert-controls', detail: `${controls.length} control(s) [${ids}] caused no readout/SVG change` });
      }
    }

    return { slug, findings, widgetCount: widgets.length };
  } finally {
    // Always close the JSDOM, even on a thrown audit. JSDOMs are heavy
    // (background timers, Proxy stubs); leaking one per topic exhausts
    // memory and timer budget on a 138-topic run.
    window.close();
  }
}

// ─── main ───────────────────────────────────────────────────────────────

const allFindings = [];
let totalWidgets = 0;
let totalTopics = 0;

for (const slug of topicSlugs) {
  try {
    const r = await auditTopic(slug);
    totalTopics++;
    totalWidgets += r.widgetCount;
    if (r.findings.length) {
      for (const f of r.findings) {
        allFindings.push({ topic: slug, ...f });
      }
      if (!QUIET && !JSON_OUT) {
        for (const f of r.findings) {
          console.log(`  ${slug}#${f.widget}: ${f.kind} — ${f.detail}`);
        }
      }
    } else if (!QUIET && !JSON_OUT) {
      // tick line — comment out for less verbose output
      // console.log(`  ${slug}: clean (${r.widgetCount} widgets)`);
    }
  } catch (err) {
    allFindings.push({ topic: slug, widget: '(driver)', kind: 'driver-error', detail: err?.message || String(err) });
    if (!JSON_OUT) console.log(`  ${slug}: DRIVER ERROR — ${err?.message || err}`);
  }
}

// ─── report ─────────────────────────────────────────────────────────────

if (JSON_OUT) {
  console.log(JSON.stringify({
    summary: {
      topicsScanned: totalTopics,
      widgetsExercised: totalWidgets,
      findings: allFindings.length,
    },
    byKind: allFindings.reduce((acc, f) => { acc[f.kind] = (acc[f.kind] || 0) + 1; return acc; }, {}),
    findings: allFindings,
  }, null, 2));
} else {
  console.log('');
  console.log(`audit-widget-runtime: ${totalTopics} topic(s), ${totalWidgets} widget(s), ${allFindings.length} finding(s)`);
  if (allFindings.length) {
    const byKind = allFindings.reduce((acc, f) => { acc[f.kind] = (acc[f.kind] || 0) + 1; return acc; }, {});
    const kinds = Object.entries(byKind).sort((a, b) => b[1] - a[1]);
    console.log('  by kind:');
    for (const [k, n] of kinds) console.log(`    ${n}× ${k}`);
  }
  console.log('');
  console.log('(advisory — exits 0)');
}

process.exit(0);
