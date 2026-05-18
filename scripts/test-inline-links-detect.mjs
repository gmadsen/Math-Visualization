#!/usr/bin/env node
// Unit tests for scripts/lib/inline-links-detect.mjs.
//
// The headline check is the `isWritable`-dedupe interaction (the regression
// PR #227 fixed and pr-test-analyzer/silent-failure-hunter flagged on PRs
// #226/#228 as the highest-leverage thing to lock in):
//
//   When a concept's first match in document order lands on bytes that
//   `isWritable` marks non-writable (i.e. inside a widget-block render
//   the JSON-aware fix path can't back-port to), detection must skip
//   past that position WITHOUT consuming the per-page dedupe slot, so a
//   later writable mention of the same concept can still be wrapped.
//
//   Without isWritable, the per-page dedupe locks the concept out
//   permanently and the later writable mention is silently lost.
//
// Plus a handful of property checks for the support helpers:
//   - escAttr covers all five HTML special chars
//   - stripAutoLinks is idempotent and only touches data-auto-inline-link="1"
//   - buildAnchorHtml output round-trips through stripAutoLinks
//   - findCandidatesInPage with no isWritable behaves as the HTML-direct
//     path expects (first-match-wins, dedupe by concept-id)

import { strict as assert } from 'node:assert';
import {
  findCandidatesInPage,
  stripAutoLinks,
  escAttr,
  buildAnchorHtml,
  makeIsWritable,
} from './lib/inline-links-detect.mjs';
import { buildTitleRegex } from './lib/audit-utils.mjs';

const failures = [];
function check(name, fn) {
  try {
    fn();
    console.log(`  ok  ${name}`);
  } catch (e) {
    failures.push(`${name}: ${e.message}`);
    console.log(`  FAIL ${name}: ${e.message}`);
  }
}

// ---------------------------------------------------------------------------
// Helpers: build a synthetic vocabulary entry + an HTML page.
// ---------------------------------------------------------------------------

function vocabEntry({ id, title, topic, page, anchor, blurb = '' }) {
  return {
    id, title, topic, page, anchor, blurb,
    titleLower: title.toLowerCase(),
    regex: buildTitleRegex(title),
  };
}

// A two-paragraph page where the SAME concept ("Quasi-categories") is
// mentioned twice — once in a widget-block region and once in a raw block.
const PAGE_HTML = [
  '<!doctype html>',
  '<html><head><title>test</title></head><body>',
  '<section id="alpha">',
  '<h2>Alpha</h2>',
  '<p>Some intro prose about Quasi-categories that lives in widget bytes.</p>',
  '<p>Later, real prose mentions Quasi-categories again in a raw block.</p>',
  '</section>',
  '</body></html>',
].join('\n');

// Pre-compute the byte offsets of the two phrase occurrences for the
// writability predicate below.
const FIRST_OFFSET  = PAGE_HTML.indexOf('Quasi-categories that lives');
const SECOND_OFFSET = PAGE_HTML.indexOf('Quasi-categories again');
const PHRASE_LEN = 'Quasi-categories'.length;
assert.ok(FIRST_OFFSET > 0, 'fixture: first Quasi-categories occurrence not found');
assert.ok(SECOND_OFFSET > FIRST_OFFSET, 'fixture: second occurrence must come after first');

const QC_VOCAB = [vocabEntry({
  id: 'quasi-category',
  title: 'Quasi-categories',
  topic: 'infinity-categories',
  page: 'infinity-categories.html',
  anchor: 'quasi-category',
  blurb: 'The $\\infty$-category model used in this notebook.',
})];

const EMPTY_BLOCKLIST = new Map();

// ---------------------------------------------------------------------------
// (1) Headline test: isWritable rescues the second mention.
// ---------------------------------------------------------------------------

check('isWritable skips widget-byte match WITHOUT consuming dedupe', () => {
  // First mention is non-writable (simulating widget bytes); second
  // mention is writable. Reject only the precise byte span of the first
  // occurrence — a too-wide rejection window would also catch the
  // second occurrence (the two paragraphs are adjacent).
  const isWritable = (offset, len) => {
    const overlapsFirst = (offset < FIRST_OFFSET + PHRASE_LEN) &&
                          (offset + len > FIRST_OFFSET);
    return !overlapsFirst;
  };
  const cands = [...findCandidatesInPage(
    PAGE_HTML, 'test-topic', 'test.html', QC_VOCAB, EMPTY_BLOCKLIST, isWritable,
  )];
  assert.equal(cands.length, 1, `expected 1 candidate (the second mention), got ${cands.length}`);
  assert.equal(cands[0].concept.id, 'quasi-category');
  assert.equal(cands[0].globalIdx, SECOND_OFFSET,
    `expected wrap at the second occurrence (offset ${SECOND_OFFSET}), got ${cands[0].globalIdx}`);
});

check('without isWritable, dedupe locks the concept after the first match', () => {
  const cands = [...findCandidatesInPage(
    PAGE_HTML, 'test-topic', 'test.html', QC_VOCAB, EMPTY_BLOCKLIST, /* no isWritable */
  )];
  assert.equal(cands.length, 1, `expected 1 candidate, got ${cands.length}`);
  assert.equal(cands[0].globalIdx, FIRST_OFFSET,
    `without isWritable, the FIRST occurrence wins; got ${cands[0].globalIdx} vs first=${FIRST_OFFSET}`);
});

check('isWritable that rejects EVERYTHING produces zero candidates', () => {
  const cands = [...findCandidatesInPage(
    PAGE_HTML, 'test-topic', 'test.html', QC_VOCAB, EMPTY_BLOCKLIST,
    () => false,
  )];
  assert.equal(cands.length, 0);
});

// ---------------------------------------------------------------------------
// (2) Self-link + existing-link suppressions.
// ---------------------------------------------------------------------------

check('self-link suppression: concept owned by the page itself is skipped', () => {
  // Same vocab, but pretend we're rendering on the page that owns it.
  const cands = [...findCandidatesInPage(
    PAGE_HTML, 'infinity-categories', 'infinity-categories.html',
    QC_VOCAB, EMPTY_BLOCKLIST,
  )];
  assert.equal(cands.length, 0);
});

check('existing-link suppression: any hand-authored <a href> to the target skips the concept', () => {
  const html = PAGE_HTML.replace(
    'real prose mentions Quasi-categories',
    'real prose mentions <a href="./infinity-categories.html#quasi-category">Quasi-categories</a>',
  );
  const cands = [...findCandidatesInPage(
    html, 'test-topic', 'test.html', QC_VOCAB, EMPTY_BLOCKLIST,
  )];
  assert.equal(cands.length, 0,
    'an existing href to the target anywhere on the page should suppress all auto-wraps for that concept');
});

// ---------------------------------------------------------------------------
// (3) Per-page blocklist.
// ---------------------------------------------------------------------------

check('per-page blocklist suppresses a concept on the named page', () => {
  const blocklist = new Map([['test.html', new Set(['quasi-category'])]]);
  const cands = [...findCandidatesInPage(
    PAGE_HTML, 'test-topic', 'test.html', QC_VOCAB, blocklist,
  )];
  assert.equal(cands.length, 0);
});

check('blocklist only applies to its named page, not others', () => {
  const blocklist = new Map([['other.html', new Set(['quasi-category'])]]);
  const cands = [...findCandidatesInPage(
    PAGE_HTML, 'test-topic', 'test.html', QC_VOCAB, blocklist,
  )];
  assert.equal(cands.length, 1, 'the blocklist entry is for other.html, not test.html');
});

// ---------------------------------------------------------------------------
// (4) Support helpers: escAttr / stripAutoLinks / buildAnchorHtml.
// ---------------------------------------------------------------------------

check('escAttr covers all five HTML specials', () => {
  assert.equal(escAttr('&'), '&amp;');
  assert.equal(escAttr('<'), '&lt;');
  assert.equal(escAttr('>'), '&gt;');
  assert.equal(escAttr('"'), '&quot;');
  assert.equal(escAttr("'"), '&#39;');
  assert.equal(escAttr('a & "b" <c>'), 'a &amp; &quot;b&quot; &lt;c&gt;');
});

check('stripAutoLinks is idempotent', () => {
  const html = 'before <a href="./x.html#y" data-auto-inline-link="1" data-concept-id="y">X</a> after';
  const once = stripAutoLinks(html);
  const twice = stripAutoLinks(once);
  assert.equal(once, 'before X after');
  assert.equal(twice, once, 'second strip should be a no-op');
});

check('stripAutoLinks only touches data-auto-inline-link="1" anchors', () => {
  const html = '<a href="./x.html">manual</a> and <a href="./y.html" data-auto-inline-link="1">auto</a>';
  const out = stripAutoLinks(html);
  assert.equal(out, '<a href="./x.html">manual</a> and auto');
});

check('buildAnchorHtml output round-trips through stripAutoLinks', () => {
  const concept = {
    id: 'foo', page: 'foo-topic.html', anchor: 'foo',
    blurb: 'A foo. With "quotes" & <html>.',
  };
  const phrase = 'foo';
  const html = `before ${buildAnchorHtml(concept, phrase)} after`;
  const stripped = stripAutoLinks(html);
  assert.equal(stripped, 'before foo after');
});

check('makeIsWritable returns false for offsets outside every range', () => {
  const ranges = [
    { kind: 'rawHead', start: 0, end: 10 },
    { kind: 'block', start: 10, end: 30, block: { type: 'raw', html: 'x'.repeat(20) } },
  ];
  const findRangeAt = (rs, idx) => rs.find(r => idx >= r.start && idx < r.end) || null;
  const iw = makeIsWritable(ranges, findRangeAt);
  assert.equal(iw(0, 5), true,  'rawHead is writable');
  assert.equal(iw(15, 5), true, 'raw block is writable');
  assert.equal(iw(40, 1), false, 'offset past every range is non-writable');
  assert.equal(iw(28, 5), false, 'span across range boundary is non-writable');
});

check('makeIsWritable returns false for widget-block matches', () => {
  const ranges = [
    { kind: 'block', start: 0, end: 50, block: { type: 'widget', slug: 'foo' } },
    { kind: 'block', start: 50, end: 100, block: { type: 'raw', html: 'x'.repeat(50) } },
  ];
  const findRangeAt = (rs, idx) => rs.find(r => idx >= r.start && idx < r.end) || null;
  const iw = makeIsWritable(ranges, findRangeAt);
  assert.equal(iw(10, 5), false, 'widget block cannot be back-ported');
  assert.equal(iw(60, 5), true,  'raw block is writable');
});

// ---------------------------------------------------------------------------

if (failures.length > 0) {
  console.log('');
  console.log(`test-inline-links-detect: ${failures.length} failure(s):`);
  for (const m of failures) console.log(`  - ${m}`);
  process.exit(1);
}
console.log('');
console.log('test-inline-links-detect: all checks passed.');
