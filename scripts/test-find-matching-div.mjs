#!/usr/bin/env node
// Unit tests for findMatchingDivEnd() in scripts/extract-topic.mjs.
//
// findMatchingDivEnd is the depth-balanced <div> matcher used by extract-
// topic during the JSON regeneration. The bespoke byte-class checks at
// the source's `if (next === 32 || next === 62 || ...)` guard against
// `<divider>`-style false positives. Tested only transitively via
// test-roundtrip.mjs today; this file exercises the boundary cases
// directly so a regression surfaces here rather than in a 131-topic round-
// trip diff.

import { findMatchingDivEnd } from './extract-topic.mjs';

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
// Fixture 1 — flat <div>: returns offset just past </div>.

{
  const html = '<div>hello</div>';
  // The "open tag" is `<div>` (5 bytes). startAfterOpenTag = 5.
  const r = findMatchingDivEnd(html, 5);
  check('flat <div> returns one past </div>', r === html.length, `got ${r}`);
}

// ─────────────────────────────────────────────────────────────────────────
// Fixture 2 — nested <div> with attributes.

{
  const html = '<div class="a"><div class="b">inner</div>outer</div>';
  // First open tag ends at index 15 (just after `<div class="a">`).
  const r = findMatchingDivEnd(html, 15);
  check('nested <div> finds outer end', r === html.length, `got ${r}`);
}

// ─────────────────────────────────────────────────────────────────────────
// Fixture 3 — boundary: <divider> must NOT count as a nested <div>.
// This is the contract the byte-class checks exist for; they reject open-
// tag candidates whose 5th byte isn't space/>/tab/CR/LF/'/'.

{
  const html = '<div><divider>x</divider></div>';
  const r = findMatchingDivEnd(html, 5);
  check('<divider> does not bump depth', r === html.length, `got ${r}`);
}

// ─────────────────────────────────────────────────────────────────────────
// Fixture 4 — <div\n on a new line (whitespace = LF, byte 10).

{
  const html = '<div\n  class="x">body</div>';
  const openEnd = html.indexOf('>') + 1;
  const r = findMatchingDivEnd(html, openEnd);
  check('<div\\n at byte 10 closes correctly', r === html.length, `got ${r}`);
}

// ─────────────────────────────────────────────────────────────────────────
// Fixture 5 — <div\t (whitespace = tab, byte 9).

{
  const html = '<div\tclass="x">body</div>';
  const openEnd = html.indexOf('>') + 1;
  const r = findMatchingDivEnd(html, openEnd);
  check('<div\\t at byte 9 closes correctly', r === html.length, `got ${r}`);
}

// ─────────────────────────────────────────────────────────────────────────
// Fixture 6 — self-closing-style `<div/>` byte 47 ('/'). HTML5 doesn't
// honour self-closing div, but the byte-class check accepts '/' so a
// nested `<div/>` would (incorrectly?) bump depth on the open and never
// find a matching close. Pin the contract: the function expects every
// open to have a matching </div>.

{
  // Outer <div> contains a hand-rolled self-closing `<div/>`. Per HTML5
  // semantics, the inner `<div/>` is treated as a non-closing <div>, so
  // there are TWO opens but only ONE </div>. findMatchingDivEnd should
  // throw (not silently mis-balance).
  const html = '<div><div/>x</div>';
  let threw = null;
  try { findMatchingDivEnd(html, 5); } catch (e) { threw = e; }
  check('unbalanced <div/> sentinel throws',
    threw !== null && /Unbalanced|Failed to balance/.test(threw.message),
    threw ? threw.message : 'no throw');
}

// ─────────────────────────────────────────────────────────────────────────
// Fixture 7 — runaway: no </div> at all.

{
  const html = '<div>nothing closes';
  let threw = null;
  try { findMatchingDivEnd(html, 5); } catch (e) { threw = e; }
  check('runaway throws "Unbalanced"',
    threw !== null && threw.message.includes('Unbalanced'),
    threw ? threw.message : 'no throw');
}

// ─────────────────────────────────────────────────────────────────────────
// Fixture 8 — multiple siblings: only the matching close is consumed.

{
  const html = '<div>a</div><div>b</div>';
  // First open ends at 5, matching close ends at 12.
  const r = findMatchingDivEnd(html, 5);
  check('first sibling stops at first </div>', r === 12, `got ${r}`);
}

console.log('');
if (failures.length === 0) {
  console.log(`test-find-matching-div: all assertions passed.`);
  process.exit(0);
} else {
  console.error(`test-find-matching-div: ${failures.length} failure(s):`);
  for (const f of failures) console.error(`  - ${f}`);
  process.exit(1);
}
