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

import { checkSvgViewbox } from './audit-accessibility.mjs';

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

console.log('');
if (failures.length === 0) {
  console.log(`test-audit-accessibility: all assertions passed.`);
  process.exit(0);
} else {
  console.error(`test-audit-accessibility: ${failures.length} failure(s):`);
  for (const f of failures) console.error(`  - ${f}`);
  process.exit(1);
}
