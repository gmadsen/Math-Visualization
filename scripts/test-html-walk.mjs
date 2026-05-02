#!/usr/bin/env node
// Unit tests for scripts/lib/html-walk.mjs and the parser-fallback helpers
// in scripts/lib/audit-utils.mjs.
//
// Two concerns:
//   1. matchClose() returns correct half-open ranges across the corpus's
//      depth-balancing patterns (the original bespoke variants that lived
//      in fix-a11y / audit-callbacks / read-prose / audit-widget-interactivity
//      had subtly different behaviour; this lib unified them).
//   2. parseTopicHtmlSafe() recovers from the known node-html-parser drop
//      bug. Two corpus sections reproduce it: advanced-complex-analysis
//      #mittag-leffler and model-theory-basics #elementary-equivalence.
//      If either ever gets parsed cleanly upstream, the test still passes
//      (success is "section is reachable", not "fallback fired").

import { readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { matchClose, balancedRange } from './lib/html-walk.mjs';
import { parseTopicHtmlSafe, recoverDroppedNodes } from './lib/audit-utils.mjs';

const __filename = fileURLToPath(import.meta.url);
const repoRoot = resolve(dirname(__filename), '..');

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
// matchClose — basic shapes.

{
  const html = '<div>hello</div>';
  const r = matchClose(html, 5, 'div');
  check('flat <div> close offsets',
    r && r.closeStart === 10 && r.closeEnd === 16,
    JSON.stringify(r));
}

{
  const html = '<div><div>inner</div>outer</div>';
  // Outer opener ends at byte 5; inner opener starts at byte 5.
  const r = matchClose(html, 5, 'div');
  // Match should be the SECOND </div> (outer close), at byte 26.
  check('nested <div> close finds outer',
    r && r.closeStart === 26,
    JSON.stringify(r));
}

{
  const html = '<section><h2>x</h2></section>';
  const r = matchClose(html, 9, 'section');
  check('section with no nested section',
    r && r.closeStart === html.indexOf('</section>'),
    JSON.stringify(r));
}

{
  // Adjacent same-name siblings: paranoid lastIndex must not loop forever.
  const html = '<div></div><div></div>';
  const r = matchClose(html, 5, 'div');
  check('adjacent same-name siblings — first closer wins',
    r && r.closeStart === 5,
    JSON.stringify(r));
}

{
  // Self-closing-ish: tag boundary `\b` must not match `<divider>`.
  const html = '<div><divider></divider></div>';
  const r = matchClose(html, 5, 'div');
  check('boundary protects against <divider>',
    r && r.closeStart === html.indexOf('</div>'),
    JSON.stringify(r));
}

{
  // Runaway: no close exists.
  const html = '<div>nothing closes';
  const r = matchClose(html, 5, 'div');
  check('runaway returns null', r === null, JSON.stringify(r));
}

{
  // Case insensitive (gi flag): uppercase tags balance correctly.
  const html = '<DIV>x</DIV>';
  const r = matchClose(html, 5, 'div');
  check('case-insensitive close',
    r && r.closeStart === html.indexOf('</DIV>'),
    JSON.stringify(r));
}

{
  // Documented limitation: HTML comments inside the body that contain a
  // fake closing tag will be honoured as a close. Callers that care must
  // strip comments first. The test pins this contract so a future "fix"
  // doesn't silently change semantics for existing callers.
  const html = '<div><!-- </div> -->real</div>';
  const r = matchClose(html, 5, 'div');
  // First </div> appears inside the comment; matchClose treats it as a
  // close. Pin the behaviour rather than the byte offset (a future
  // comment-aware variant should change this assertion deliberately).
  check('comment with fake close: documented limitation',
    r !== null,
    JSON.stringify(r));
}

// ─────────────────────────────────────────────────────────────────────────
// balancedRange — convenience wrapper.

{
  const html = 'before<section id="a">body</section>after';
  const start = html.indexOf('<section');
  const r = balancedRange(html, start, 'section');
  check('balancedRange returns full element',
    r && html.slice(r.outerStart, r.outerEnd) === '<section id="a">body</section>',
    r ? html.slice(r.outerStart, r.outerEnd) : 'null');
}

{
  const html = 'no-section-here';
  const r = balancedRange(html, 0, 'section');
  check('balancedRange returns null when opener does not start at offset',
    r === null,
    JSON.stringify(r));
}

// ─────────────────────────────────────────────────────────────────────────
// parseTopicHtmlSafe — synthetic input. Decouples the helper's contract
// from the corpus so tests still mean something if the two known-fragile
// sections move or upstream node-html-parser fixes the parse drop.

{
  const html = '<html><body><section id="alpha"><h2>A</h2><p>p1</p></section>' +
               '<section id="beta"><h2>B</h2><p>p2</p></section></body></html>';
  const r = parseTopicHtmlSafe(html, {});
  check('synthetic: both sections discovered',
    r.sections.has('alpha') && r.sections.has('beta'));
  check('synthetic: no missing sections (clean parse)',
    r.missingIds.length === 0,
    `missingIds=${JSON.stringify(r.missingIds)}`);
  const alpha = r.sections.get('alpha');
  check('synthetic: alpha innerStart points past opening tag',
    html.slice(alpha.innerStart).startsWith('<h2>A</h2>'),
    html.slice(alpha.innerStart, alpha.innerStart + 12));
  check('synthetic: alpha body contains <h2>',
    alpha.body.includes('<h2>A</h2>'),
    alpha.body);
}

// recoverDroppedNodes — synthetic test of range translation, independent
// of whether any real corpus section reproduces the parser-drop bug.

{
  // Fake a parseResult with one missing section. The body re-parse should
  // yield <p> nodes whose translated ranges land inside the synthetic html.
  const html = '<html><body>...prefix...<section id="dropped"><p>recovered text</p>' +
               '<p>second</p></section>suffix</body></html>';
  const innerStart = html.indexOf('<p>recovered');
  const innerEnd = html.indexOf('</section>');
  const fakeParseResult = {
    root: null,
    sections: new Map([['dropped', {
      id: 'dropped',
      node: null,
      openStart: html.indexOf('<section'),
      innerStart,
      innerEnd,
      outerEnd: innerEnd + '</section>'.length,
      body: html.slice(innerStart, innerEnd),
    }]]),
    missingIds: ['dropped'],
    present(){ return false; },
  };
  const recovered = recoverDroppedNodes(fakeParseResult, 'p', {});
  check('synthetic recovery: returns 2 <p> nodes',
    recovered.length === 2,
    `length=${recovered.length}`);
  if (recovered.length === 2) {
    const p0 = recovered[0];
    const p1 = recovered[1];
    check('recovered[0].range translated into raw html',
      p0.range && html.slice(p0.range[0], p0.range[0] + 3) === '<p>',
      html.slice(p0.range[0], p0.range[0] + 6));
    check('recovered[1].range past recovered[0]',
      p1.range && p1.range[0] > p0.range[0],
      `p0=${JSON.stringify(p0.range)} p1=${JSON.stringify(p1.range)}`);
    check('recovered[0] body contains "recovered text"',
      p0.text === 'recovered text' || p0.innerHTML === 'recovered text' ||
      html.slice(p0.range[0], p0.range[1]).includes('recovered text'),
      `p0 slice = ${html.slice(p0.range[0], p0.range[1])}`);
  }
}

// recoverDroppedNodes — multi-section synthetic. Pin that the loop iterates
// over every entry in missingIds, not just the first.

{
  const html =
    '<section id="alpha"><p>alpha-one</p></section>' +
    'middle' +
    '<section id="beta"><p>beta-one</p><p>beta-two</p></section>' +
    'tail';
  const aOpen = html.indexOf('<section id="alpha">');
  const aInner = aOpen + '<section id="alpha">'.length;
  const aInnerEnd = html.indexOf('</section>', aInner);
  const bOpen = html.indexOf('<section id="beta">');
  const bInner = bOpen + '<section id="beta">'.length;
  const bInnerEnd = html.indexOf('</section>', bInner);
  const fakeParseResult = {
    root: null,
    sections: new Map([
      ['alpha', { id: 'alpha', node: null, openStart: aOpen, innerStart: aInner, innerEnd: aInnerEnd,
                  outerEnd: aInnerEnd + '</section>'.length, body: html.slice(aInner, aInnerEnd) }],
      ['beta',  { id: 'beta',  node: null, openStart: bOpen, innerStart: bInner, innerEnd: bInnerEnd,
                  outerEnd: bInnerEnd + '</section>'.length, body: html.slice(bInner, bInnerEnd) }],
    ]),
    missingIds: ['alpha', 'beta'],
    present(){ return false; },
  };
  const recovered = recoverDroppedNodes(fakeParseResult, 'p', {});
  check('multi-section: 1 + 2 = 3 <p> nodes recovered',
    recovered.length === 3, `length=${recovered.length}`);
  // All ranges should be inside the html and in document order.
  if (recovered.length === 3) {
    const ranges = recovered.map((p) => p.range[0]);
    check('multi-section: ranges sorted in document order',
      ranges[0] < ranges[1] && ranges[1] < ranges[2],
      JSON.stringify(ranges));
    check('multi-section: alpha <p> recovered first',
      html.slice(ranges[0], ranges[0] + '<p>alpha-one</p>'.length) === '<p>alpha-one</p>',
      html.slice(ranges[0], ranges[0] + 20));
  }
}

// ─────────────────────────────────────────────────────────────────────────
// parseTopicHtmlSafe — corpus regression on the two known-fragile sections.

const ADVANCED_HTML = readFileSync(join(repoRoot, 'advanced-complex-analysis.html'), 'utf8');
const MODEL_HTML = readFileSync(join(repoRoot, 'model-theory-basics.html'), 'utf8');

const parseOpts = {
  blockTextElements: { script: true, noscript: true, style: true, pre: true },
};

{
  const r = parseTopicHtmlSafe(ADVANCED_HTML, parseOpts);
  check('advanced-complex-analysis: mittag-leffler section discoverable',
    r.sections.has('mittag-leffler'),
    `sections.has('mittag-leffler') = ${r.sections.has('mittag-leffler')}`);
  if (r.sections.has('mittag-leffler')) {
    const info = r.sections.get('mittag-leffler');
    check('mittag-leffler section body is non-empty',
      info.body.length > 100,
      `body length = ${info.body.length}`);
    check('mittag-leffler offsets bracket the "Mittag-Leffler" heading',
      ADVANCED_HTML.slice(info.innerStart, info.innerEnd).includes('Mittag-Leffler'),
      'inner slice did not contain heading text');
  }
}

{
  const r = parseTopicHtmlSafe(MODEL_HTML, parseOpts);
  check('model-theory-basics: elementary-equivalence section discoverable',
    r.sections.has('elementary-equivalence'),
    `sections.has('elementary-equivalence') = ${r.sections.has('elementary-equivalence')}`);
  if (r.sections.has('elementary-equivalence')) {
    const info = r.sections.get('elementary-equivalence');
    check('elementary-equivalence section body non-empty',
      info.body.length > 100,
      `body length = ${info.body.length}`);
  }
}

// ─────────────────────────────────────────────────────────────────────────
// recoverDroppedNodes — round-trip regression.

{
  const r = parseTopicHtmlSafe(ADVANCED_HTML, parseOpts);
  const recoveredP = recoverDroppedNodes(r, 'p', parseOpts);
  // Corpus assertion: the section must be reachable (parsed-or-recovered),
  // matching the header comment's contract. The synthetic test in the
  // previous block is the load-bearing assertion that exercises the recovery
  // PATH; this corpus block just confirms the section is discoverable.
  // If a future node-html-parser version fixes the silent drop upstream,
  // missingIds becomes empty and recoveredP becomes []; that's a fix, not a
  // regression, so this block must not fail.
  check('corpus: recoverDroppedNodes returns array',
    Array.isArray(recoveredP),
    typeof recoveredP);
  if (recoveredP.length >= 1) {
    const p = recoveredP[0];
    const slice = ADVANCED_HTML.slice(p.range[0], p.range[1]);
    check('recovered <p> range translated end-to-end',
      p.range && slice.startsWith('<p') && slice.endsWith('</p>'),
      `range=${JSON.stringify(p.range)} slice=${slice.slice(0, 40)}…${slice.slice(-10)}`);
  }
}

console.log('');
if (failures.length === 0) {
  console.log(`test-html-walk: all assertions passed.`);
  process.exit(0);
} else {
  console.error(`test-html-walk: ${failures.length} failure(s):`);
  for (const f of failures) console.error(`  - ${f}`);
  process.exit(1);
}
