#!/usr/bin/env node
// Unit tests for scripts/validate-tour-anchors.mjs.
//
// Why a dedicated test: rebuild.mjs --no-fix only ever runs the validator
// against the live, currently-clean tours.html, so the failure paths (missing
// file, missing anchor) are never exercised in CI. This test drives the pure
// core (findUnresolvedLinks) with synthetic input + a stub id-resolver, so the
// rot-detection logic the gate exists for is actually verified.

import { findUnresolvedLinks, extractIds } from './validate-tour-anchors.mjs';

const failures = [];
function check(name, cond, detail) {
  if (!cond) failures.push(`${name}${detail ? ': ' + detail : ''}`);
}

// A stub resolver: pages 'a.html' and 'b.html' exist with known ids; anything
// else is missing (null).
const PAGES = {
  'a.html': new Set(['intro', 'group', 'theorem']),
  'b.html': new Set(['forms', 'hecke']),
};
const idsFor = (page) => (page in PAGES ? PAGES[page] : null);

// 1. All links resolve → no issues.
{
  const src = `
    <a href="./a.html#intro">x</a>
    <a href="./b.html#hecke">y</a>
    <a href="./a.html">no anchor, just file</a>`;
  const { issues, checked } = findUnresolvedLinks(src, idsFor);
  check('all-resolve issues', issues.length === 0, JSON.stringify(issues));
  check('all-resolve checked', checked === 3, `got ${checked}`);
}

// 2. A link to a non-existent file is flagged.
{
  const src = `<a href="./ghost.html#whatever">dead</a>`;
  const { issues } = findUnresolvedLinks(src, idsFor);
  check('missing-file flagged', issues.length === 1 && /does not exist/.test(issues[0]), JSON.stringify(issues));
}

// 3. A link whose anchor has no matching id is flagged (the silent rot).
{
  const src = `<a href="./a.html#elliptic">rotted stop</a>`;
  const { issues } = findUnresolvedLinks(src, idsFor);
  check('missing-anchor flagged', issues.length === 1 && /no matching id="elliptic"/.test(issues[0]), JSON.stringify(issues));
}

// 4. A valid file with no anchor is fine (file-existence only).
{
  const src = `<a href="./b.html">overview</a>`;
  const { issues } = findUnresolvedLinks(src, idsFor);
  check('no-anchor-valid', issues.length === 0, JSON.stringify(issues));
}

// 5. Duplicate links are de-duped (counted + reported once).
{
  const src = `<a href="./a.html#gone">1</a> <a href="./a.html#gone">2</a>`;
  const { issues, checked } = findUnresolvedLinks(src, idsFor);
  check('dedupe checked', checked === 1, `got ${checked}`);
  check('dedupe issues', issues.length === 1, JSON.stringify(issues));
}

// 6. External / CDN links are ignored (not anchored to ./).
{
  const src = `<a href="https://cdn.jsdelivr.net/x.html#frag">ext</a> <a href="./a.html#intro">ok</a>`;
  const { checked } = findUnresolvedLinks(src, idsFor);
  check('external-ignored', checked === 1, `got ${checked}`);
}

// 7. extractIds picks up id="..." AND id='...' attributes (both quote styles).
{
  const ids = extractIds(`<section id="one"><div id='two'></div></section><svg id="three">`);
  check('extractIds', ids.has('one') && ids.has('two') && ids.has('three') && ids.size === 3, [...ids].join(','));
}

// 8. A page that EXISTS but has zero ids (empty Set, not null) with an anchored
//    link is flagged as a missing anchor — not misreported as a missing file.
{
  const idsForEmpty = (page) => (page === 'empty.html' ? new Set() : null);
  const src = `<a href="./empty.html#anything">x</a>`;
  const { issues } = findUnresolvedLinks(src, idsForEmpty);
  check('empty-page anchor flagged', issues.length === 1 && /no matching id="anything"/.test(issues[0]), JSON.stringify(issues));
}

// 9. Multiple distinct issues in one source are ALL reported (not just first).
{
  const src = `<a href="./a.html#gone">1</a> <a href="./ghost.html#x">2</a> <a href="./b.html#missing">3</a>`;
  const { issues, checked } = findUnresolvedLinks(src, idsFor);
  check('batch checked', checked === 3, `got ${checked}`);
  check('batch all reported', issues.length === 3, JSON.stringify(issues));
}

// 10. A query string before the fragment doesn't hide the anchor (?tour= forward-compat).
{
  const src = `<a href="./a.html?tour=galois#group">q</a> <a href="./a.html?tour=x#gone">bad</a>`;
  const { issues, checked } = findUnresolvedLinks(src, idsFor);
  check('query-string anchor parsed', checked === 2, `got ${checked}`);
  check('query-string rot flagged', issues.length === 1 && /#gone/.test(issues[0]), JSON.stringify(issues));
}

if (failures.length) {
  console.error(`test-validate-tour-anchors: ${failures.length} failure(s)`);
  for (const f of failures) console.error(`  [x] ${f}`);
  process.exit(1);
}
console.log('test-validate-tour-anchors: all 10 suites passed');
process.exit(0);
