#!/usr/bin/env node
// Unit tests for widgets/slider-svg-2d/ — the shared chrome renderer for
// the standard "slider(s) + SVG + readout" widget pattern (introduced in
// PR #228 to replace ~140 per-page verbatim-renderer slugs).
//
// Two concerns:
//   1. Coupling: the schema names the bespoke draw block `bodyScript` so
//      it lands inside validate-widget-params.mjs's `XSS_LINT_SKIP_KEYS`
//      passthrough allowlist (otherwise the embedded `<script>` tag would
//      trip the lint and reject every migrated widget). If a future PR
//      renames the allowlist constant or removes `bodyScript` from it,
//      every slider-svg-2d widget silently breaks at validate time. This
//      test asserts the coupling so it can't drift unnoticed.
//   2. Renderer: spot-check that renderMarkup emits the standard chrome
//      shape (header, .row of controls, SVG with title, optional readout)
//      from a representative param object. Byte-identity vs the legacy
//      verbatim form is exercised by the migration script's safety guard
//      on every migration run — this test pins down a smaller, hand-
//      written fixture so a future refactor of the renderer is forced to
//      preserve the output format.

import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { renderMarkup, renderScript } from '../widgets/slider-svg-2d/index.mjs';

const __filename = fileURLToPath(import.meta.url);
const repoRoot = resolve(dirname(__filename), '..');

const failures = [];
function check(name, cond, detail) {
  if (cond) {
    console.log(`  ok  ${name}`);
  } else {
    failures.push(`${name}${detail ? ': ' + detail : ''}`);
    console.log(`  FAIL ${name}${detail ? ': ' + detail : ''}`);
  }
}

// ---------------------------------------------------------------------------
// (1) bodyScript ∈ XSS_LINT_SKIP_KEYS in validate-widget-params.mjs.
// ---------------------------------------------------------------------------

const validatorSrc = readFileSync(
  resolve(repoRoot, 'scripts', 'validate-widget-params.mjs'),
  'utf8',
);
check(
  'validate-widget-params.mjs declares XSS_LINT_SKIP_KEYS',
  /const XSS_LINT_SKIP_KEYS\s*=\s*new Set\(\[[\s\S]*?\]\);/.test(validatorSrc),
  'expected `const XSS_LINT_SKIP_KEYS = new Set([...]);` declaration',
);
const setMatch = validatorSrc.match(/const XSS_LINT_SKIP_KEYS\s*=\s*new Set\(\[([\s\S]*?)\]\);/);
const xssSkipKeys = setMatch
  ? [...setMatch[1].matchAll(/['"]([^'"]+)['"]/g)].map((m) => m[1])
  : [];
check(
  "XSS_LINT_SKIP_KEYS includes 'bodyScript'",
  xssSkipKeys.includes('bodyScript'),
  `parsed keys: [${xssSkipKeys.join(', ')}]`,
);

// ---------------------------------------------------------------------------
// (2) renderMarkup emits the standard chrome from typed params.
// ---------------------------------------------------------------------------

const sample = {
  widgetId: '',
  title: 'Sample $f(x)$',
  hint: 'Drag the slider $t$.',
  controls: [
    { type: 'slider', id: 'demo-t', label: 'time $t$', min: 0, max: 10, value: 5 },
    { type: 'span',   id: 'demo-stat' },
  ],
  svg:     { id: 'demo-svg', viewBox: '0 0 100 50', width: 100, height: 50 },
  readout: true,
  bodyScript: '<script>(function(){})();</script>',
};

const expected =
  '<div class="widget">\n' +
  '  <div class="hd"><div class="ttl">Sample $f(x)$</div><div class="hint">Drag the slider $t$.</div></div>\n' +
  '  <div class="row">\n' +
  '    <label>time $t$<input id="demo-t" type="range" min="0" max="10" value="5"></label>\n' +
  '    <span id="demo-stat" class="small"></span>\n' +
  '  </div>\n' +
  '  <svg id="demo-svg" viewBox="0 0 100 50" width="100" height="50"><title>Sample $f(x)$</title></svg>\n' +
  '  <div class="readout" id="demo-readout"></div>\n' +
  '</div>';

const got = renderMarkup(sample);
check(
  'renderMarkup output matches the expected chrome shape',
  got === expected,
  got === expected ? '' : `\n--- expected ---\n${expected}\n--- got ---\n${got}`,
);

// SVG <title> text gets HTML-escaped (covers apostrophe → &#39;).
const apostrophe = renderMarkup({ ...sample, title: "Green's-function" });
check(
  "renderMarkup escapes apostrophe inside SVG <title>",
  /<title>Green&#39;s-function<\/title>/.test(apostrophe),
  apostrophe.slice(apostrophe.indexOf('<svg'), apostrophe.indexOf('</svg>') + 6),
);
// ...and leaves the header .ttl apostrophe as-is.
check(
  "renderMarkup leaves apostrophe literal inside .ttl",
  /<div class="ttl">Green's-function<\/div>/.test(apostrophe),
  apostrophe.slice(0, apostrophe.indexOf('</div></div>') + 12),
);

// readout=true requires svg.id to end with -svg.
let threw = false;
try { renderMarkup({ ...sample, svg: { ...sample.svg, id: 'demo-canvas' } }); }
catch (_) { threw = true; }
check(
  'renderMarkup throws when readout=true and svg.id lacks -svg suffix',
  threw,
);

// readout=false omits the readout div entirely.
const noReadout = renderMarkup({ ...sample, readout: false });
check(
  'renderMarkup omits the readout div when readout=false',
  !/<div class="readout"/.test(noReadout),
);

// renderScript passes bodyScript through verbatim.
check(
  'renderScript returns bodyScript unchanged',
  renderScript(sample) === sample.bodyScript,
);

// renderScript throws when bodyScript is missing.
threw = false;
try { renderScript({ ...sample, bodyScript: undefined }); }
catch (_) { threw = true; }
check('renderScript throws when bodyScript is missing', threw);

// ---------------------------------------------------------------------------

if (failures.length > 0) {
  console.log('');
  console.log(`test-slider-svg-2d: ${failures.length} failure(s):`);
  for (const m of failures) console.log(`  - ${m}`);
  process.exit(1);
}
console.log('');
console.log('test-slider-svg-2d: all checks passed.');
