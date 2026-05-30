#!/usr/bin/env node
// Unit tests for the SVG viewBox check that landed in audit-accessibility
// (formerly part of the deleted audit-responsive.mjs).
//
// The check has three skip-zones: <defs>...</defs> (arrow-marker SVGs),
// <div class="thumb">...</div> (decorative landing-page thumbs), and a
// pairing-loop-built skip range covering <!-- -->, <script>, <pre>. The
// pairing loop uses indexOf (not regex), so an unbalanced pair triggers a
// `break` — pin the contract here so a regression doesn't silently let
// later legitimate violations get suppressed.

import { checkSvgViewbox, checkSvgLabeling, checkImages } from './audit-accessibility.mjs';

const failures = [];
function check(name, cond, detail) {
  if (cond) {
    console.log(`  ok  ${name}`);
  } else {
    failures.push(`${name}${detail ? ': ' + detail : ''}`);
    console.log(`  FAIL ${name}${detail ? ' — ' + detail : ''}`);
  }
}

// ─────────────────────────────────────────────────────────────────────────
// Bare <svg> without viewBox: violation.

{
  const html = '<svg width="200" height="200"><circle r="50"/></svg>';
  const v = checkSvgViewbox(html);
  check('bare svg without viewBox: 1 violation', v.length === 1, `got ${v.length}`);
}

// ─────────────────────────────────────────────────────────────────────────
// <svg viewBox=...>: no violation.

{
  const html = '<svg viewBox="0 0 100 100" width="200" height="200"><circle r="50"/></svg>';
  const v = checkSvgViewbox(html);
  check('svg with viewBox: no violation', v.length === 0, `got ${v.length}`);
}

// ─────────────────────────────────────────────────────────────────────────
// Tiny icon SVG (w + h ≤ 24): no violation.

{
  const html = '<svg width="16" height="16"><circle r="4"/></svg>';
  const v = checkSvgViewbox(html);
  check('tiny-icon svg without viewBox: skipped', v.length === 0, `got ${v.length}`);
}

// ─────────────────────────────────────────────────────────────────────────
// SVG inside <defs>: no violation (arrow-marker convention).

{
  const html = '<svg viewBox="0 0 10 10"><defs><svg width="100" height="100"><polyline/></svg></defs></svg>';
  const v = checkSvgViewbox(html);
  check('svg inside <defs>: skipped',
    v.length === 0, `got ${v.length}`);
}

// ─────────────────────────────────────────────────────────────────────────
// SVG inside <div class="thumb">: no violation (decorative landing thumb).

{
  const html = '<div class="thumb"><svg width="60" height="60"><rect/></svg></div>';
  const v = checkSvgViewbox(html);
  check('svg inside <div class="thumb">: skipped',
    v.length === 0, `got ${v.length}`);
}

// ─────────────────────────────────────────────────────────────────────────
// SVG mention inside <script>, <pre>, HTML comment: no violation.

{
  const html =
    '<script>const s = "<svg width=300 height=300></svg>";</script>' +
    '<pre><svg width=300 height=300></svg></pre>' +
    '<!-- <svg width=300 height=300></svg> -->';
  const v = checkSvgViewbox(html);
  check('svg inside <script>/<pre>/comment: all skipped',
    v.length === 0, `got ${v.length}`);
}

// ─────────────────────────────────────────────────────────────────────────
// Mixed: one legitimate violation outside skip zones, several inside.

{
  const html =
    '<script>"<svg width=300 height=300></svg>"</script>' +
    '<svg width="500" height="500"><circle/></svg>' +
    '<!-- <svg width=300 height=300></svg> -->';
  const v = checkSvgViewbox(html);
  check('mixed: exactly one violation surfaces',
    v.length === 1, `got ${v.length}`);
}

// ─────────────────────────────────────────────────────────────────────────
// Unbalanced <script> (no </script>): the pair loop's `break` should not
// suppress a legitimate downstream violation. This pins the boundary
// behaviour so a regression that drops every later skip range surfaces.

{
  const html = '<script>let x = "broken;<svg width="500" height="500"><circle/></svg>';
  const v = checkSvgViewbox(html);
  // The unclosed <script> means everything from its opening tag onward is
  // outside the skip range (because indexOf for </script> returned -1 and
  // the pairing loop broke). The bare SVG is consequently flagged.
  // Pin the contract; if a future implementation handles unclosed pairs
  // differently, this assertion documents the change.
  check('unbalanced <script>: bare svg still flagged',
    v.length === 1, `got ${v.length}`);
}

// ─────────────────────────────────────────────────────────────────────────
// checkSvgLabeling shares the same non-rendered skip zones (a decorative icon
// built in a `return \`<svg viewBox=…>…\`` template inside <script> is JS
// source, not a real a11y gap). Pin that it skips <script>/<pre>/comment SVGs
// while still flagging a real unlabeled live-DOM SVG.

{
  const html =
    '<script>const icon = "<svg viewBox=\'0 0 24 24\'><path d=\'M3 12h6\'/></svg>";</script>' +
    '<pre><svg viewBox="0 0 24 24"><circle/></svg></pre>' +
    '<!-- <svg viewBox="0 0 24 24"><rect/></svg> -->';
  const v = checkSvgLabeling(html);
  check('svg-labeling: <script>/<pre>/comment svgs skipped',
    v.length === 0, `got ${v.length}`);
}

{
  const html = '<svg viewBox="0 0 360 180" width="360" height="180"><text x="70" y="40">G</text></svg>';
  const v = checkSvgLabeling(html);
  check('svg-labeling: real unlabeled live svg flagged', v.length === 1, `got ${v.length}`);
}

{
  const titled = '<svg viewBox="0 0 360 180"><title>Gauss map</title><text>G</text></svg>';
  const labelled = '<svg viewBox="0 0 360 180" aria-label="Gauss map"><text>G</text></svg>';
  const roled = '<svg viewBox="0 0 360 180" role="img"><text>G</text></svg>';
  const v = checkSvgLabeling(titled + labelled + roled);
  check('svg-labeling: <title>/aria-label/role=img all satisfy', v.length === 0, `got ${v.length}`);
}

// ─────────────────────────────────────────────────────────────────────────
// checkImages must not match the `<img` substring of a `j<img.length` JS
// comparison inside <script>, while still flagging a real <img> with no alt.

{
  const html = '<script>for(var j=0;j<img.length;j++){ var w=img[j]; }</script>';
  const v = checkImages(html);
  check('images: `j<img.length` in <script> not flagged', v.length === 0, `got ${v.length}`);
}

{
  const withAlt = '<img src="x.png" alt="a plot">';
  const noAlt = '<img src="y.png">';
  check('images: real <img> missing alt flagged', checkImages(noAlt).length === 1, `got ${checkImages(noAlt).length}`);
  check('images: <img> with alt not flagged', checkImages(withAlt).length === 0, `got ${checkImages(withAlt).length}`);
}

console.log('');
if (failures.length === 0) {
  console.log(`test-audit-accessibility: all assertions passed.`);
  process.exit(0);
} else {
  console.error(`test-audit-accessibility: ${failures.length} failure(s):`);
  for (const f of failures) console.error(`  - ${f}`);
  process.exit(1);
}
