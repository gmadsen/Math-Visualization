#!/usr/bin/env node
/**
 * test-json-block-writer.mjs — unit tests for scripts/lib/json-block-writer.mjs.
 *
 * Operates on a deep-cloned in-memory copy of content/category-theory.json —
 * never writes to disk except via the temp-file round-trip case (which writes
 * to /tmp).  Exit 0 on all-pass, 1 on any failure.
 */

import { readFileSync, writeFileSync, unlinkSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  loadTopicContent,
  saveTopicContent,
  findSection,
  upsertFencedBlock,
  stripFencedBlock,
  ensureCss,
  updateCss,
} from './lib/json-block-writer.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const repoRoot = resolve(__dirname, '..');

const TOPIC = 'category-theory';
const TOPIC_PATH = resolve(repoRoot, 'content', `${TOPIC}.json`);

const failures = [];
function check(name, cond, detail) {
  if (cond) {
    console.log(`  ok  ${name}`);
  } else {
    failures.push(`${name}${detail ? ': ' + detail : ''}`);
    console.log(`  FAIL ${name}${detail ? ' — ' + detail : ''}`);
  }
}
function sha256(buf) {
  return createHash('sha256').update(buf).digest('hex');
}
function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

// ----- Test 1: round-trip neutrality (load + save with no edits) -----
//
// Save to a /tmp path so the live file is never touched, then sha-compare.

console.log('test 1: round-trip neutrality');
{
  const before = readFileSync(TOPIC_PATH, 'utf8');
  const beforeSha = sha256(before);

  const doc = loadTopicContent(TOPIC, repoRoot);

  // Save via saveTopicContent into a temp repoRoot copy.  The cleanest way
  // is to mimic `saveTopicContent(topic, doc, tmpRoot)` with a tmp dir, but
  // simpler is to inline the same bytes saveTopicContent produces and check
  // them against the original.
  const wouldBeBytes = JSON.stringify(doc, null, 2) + '\n';
  const afterSha = sha256(wouldBeBytes);

  check(
    'load + serialize is byte-identical to source',
    before === wouldBeBytes,
    before === wouldBeBytes
      ? null
      : `sha256 differ: ${beforeSha.slice(0, 12)} vs ${afterSha.slice(0, 12)}`,
  );

  // Also verify saveTopicContent reports `false` (no write) when nothing
  // changed.  We do this by writing the doc to a tmp file first (priming),
  // then calling saveTopicContent into a synthetic tmp repoRoot.
  const tmpDir = '/tmp/mv-jbw-test-' + process.pid;
  const tmpContentDir = resolve(tmpDir, 'content');
  // Build dirs.
  try {
    const { mkdirSync } = await import('node:fs');
    mkdirSync(tmpContentDir, { recursive: true });
  } catch {}
  const tmpPath = resolve(tmpContentDir, `${TOPIC}.json`);
  writeFileSync(tmpPath, before);
  const wrote = saveTopicContent(TOPIC, doc, tmpDir);
  check(
    'saveTopicContent returns false when content unchanged',
    wrote === false,
    `wrote=${wrote}`,
  );
  // Cleanup.
  try { unlinkSync(tmpPath); } catch {}
}

// ----- Test 2: insert new fence on a fresh section -----
//
// Mutate a deep clone — never save.

console.log('test 2: insert new fenced block');
{
  const orig = loadTopicContent(TOPIC, repoRoot);
  const doc = deepClone(orig);

  // Pick a section that has a quiz block (so 'before-quiz' resolves) and
  // does NOT yet contain a 'test-fence' marker.
  const targetAnchor = 'cat'; // verified to have type sequence raw,widget,raw,widget-script,raw,quiz,raw
  const found = findSection(doc, targetAnchor);
  check(
    'findSection locates the cat section',
    found !== null && found.section.id === targetAnchor,
  );
  const blocksBefore = found.section.blocks.length;
  check(
    'cat section has no test-fence marker initially',
    !found.section.blocks.some(
      (b) => b.type === 'raw' && b.html && b.html.includes('test-fence-auto-begin'),
    ),
  );

  const result = upsertFencedBlock(
    doc,
    targetAnchor,
    'test-fence',
    '<aside class="callback"><p>cross-page link goes here</p></aside>',
    { position: 'before-quiz' },
  );
  check(
    'upsertFencedBlock(insert) returns { changed: true, action: "inserted" }',
    result.changed === true && result.action === 'inserted',
    JSON.stringify(result),
  );

  const blocksAfter = found.section.blocks.length;
  check(
    'block count grew by exactly 1',
    blocksAfter === blocksBefore + 1,
    `before=${blocksBefore} after=${blocksAfter}`,
  );

  // Find the inserted block — should be immediately before the quiz block.
  const quizIdx = found.section.blocks.findIndex((b) => b.type === 'quiz');
  const inserted = found.section.blocks[quizIdx - 1];
  check(
    'inserted block sits immediately before the quiz block',
    inserted && inserted.type === 'raw' && inserted.html.includes('test-fence-auto-begin'),
  );
  check(
    'inserted block carries both fence tokens',
    inserted.html.includes('<!-- test-fence-auto-begin -->') &&
      inserted.html.includes('<!-- test-fence-auto-end -->'),
  );
  check(
    'inserted block carries the supplied content',
    inserted.html.includes('cross-page link goes here'),
  );

  // Sanity: live file is untouched.  Reload from disk and confirm the
  // marker is absent.
  const reloaded = loadTopicContent(TOPIC, repoRoot);
  const reloadedCat = findSection(reloaded, targetAnchor).section;
  check(
    'live disk file untouched (re-read shows no test-fence marker)',
    !reloadedCat.blocks.some(
      (b) => b.type === 'raw' && b.html.includes('test-fence-auto-begin'),
    ),
  );
}

// ----- Test 3: re-insert is idempotent -----

console.log('test 3: re-insert is idempotent');
{
  const doc = deepClone(loadTopicContent(TOPIC, repoRoot));
  const anchor = 'cat';
  const html = '<aside class="callback"><p>same content twice</p></aside>';

  const r1 = upsertFencedBlock(doc, anchor, 'test-fence', html, {
    position: 'before-quiz',
  });
  check('first call inserts', r1.action === 'inserted' && r1.changed === true);

  // Snapshot the section bytes.
  const before = JSON.stringify(findSection(doc, anchor).section);

  const r2 = upsertFencedBlock(doc, anchor, 'test-fence', html, {
    position: 'before-quiz',
  });
  check(
    'second call returns noop (changed:false, action:"noop")',
    r2.changed === false && r2.action === 'noop',
    JSON.stringify(r2),
  );

  const after = JSON.stringify(findSection(doc, anchor).section);
  check('section bytes unchanged after second call', before === after);

  // Different content under same fence → 'replaced' with byte change.
  const r3 = upsertFencedBlock(
    doc,
    anchor,
    'test-fence',
    '<aside class="callback"><p>now different</p></aside>',
    { position: 'before-quiz' },
  );
  check(
    'changed content under same fence returns action "replaced"',
    r3.action === 'replaced' && r3.changed === true,
    JSON.stringify(r3),
  );

  const r4 = upsertFencedBlock(
    doc,
    anchor,
    'test-fence',
    '<aside class="callback"><p>now different</p></aside>',
    { position: 'before-quiz' },
  );
  check(
    'replaying the replacement returns noop',
    r4.action === 'noop' && r4.changed === false,
    JSON.stringify(r4),
  );
}

// ----- Test 4: strip removes the inserted block -----

console.log('test 4: strip removes the inserted block');
{
  const doc = deepClone(loadTopicContent(TOPIC, repoRoot));
  const anchor = 'cat';
  const blocksBefore = findSection(doc, anchor).section.blocks.length;

  upsertFencedBlock(doc, anchor, 'test-fence', '<p>x</p>', {
    position: 'before-quiz',
  });
  check(
    'after insert, block count = before+1',
    findSection(doc, anchor).section.blocks.length === blocksBefore + 1,
  );

  const stripResult = stripFencedBlock(doc, anchor, 'test-fence');
  check(
    'strip returns { changed: true }',
    stripResult.changed === true,
    JSON.stringify(stripResult),
  );
  check(
    'after strip, block count returns to original',
    findSection(doc, anchor).section.blocks.length === blocksBefore,
  );

  // Strip again — no-op.
  const stripAgain = stripFencedBlock(doc, anchor, 'test-fence');
  check(
    'strip on absent fence returns { changed: false }',
    stripAgain.changed === false,
  );
}

// ----- Test 5: ensureCss noop on existing selector -----

console.log('test 5: ensureCss');
{
  const doc = deepClone(loadTopicContent(TOPIC, repoRoot));
  const headBefore = doc.rawHead;

  const r1 = ensureCss(doc, /aside\.callback\s*\{/, '  aside.callback{}\n');
  check(
    'ensureCss with existing selector returns { changed: false }',
    r1.changed === false,
    JSON.stringify(r1),
  );
  check('rawHead unchanged after no-op ensureCss', doc.rawHead === headBefore);

  // Inject a fresh selector.
  const novelSelector = 'aside.mv-jbw-test-marker-xyz';
  const novelRegex = /aside\.mv-jbw-test-marker-xyz\s*\{/;
  const cssText = '  aside.mv-jbw-test-marker-xyz{display:none}';

  const r2 = ensureCss(doc, novelRegex, cssText);
  check(
    'ensureCss with novel selector returns { changed: true }',
    r2.changed === true,
    JSON.stringify(r2),
  );
  check('rawHead now contains the new rule', doc.rawHead.includes(cssText));

  // Re-run — should be noop now.
  const r3 = ensureCss(doc, novelRegex, cssText);
  check(
    'second ensureCss call (now matching) returns { changed: false }',
    r3.changed === false,
  );

  // Live disk untouched.
  const reloaded = loadTopicContent(TOPIC, repoRoot);
  check(
    'live disk file rawHead untouched',
    !reloaded.rawHead.includes('mv-jbw-test-marker-xyz'),
  );
}

// ----- Test 6: position resolution -----

console.log('test 6: position resolution');
{
  const doc = deepClone(loadTopicContent(TOPIC, repoRoot));

  // 'after-quiz' — block lands AFTER the quiz block.
  const r1 = upsertFencedBlock(doc, 'cat', 'pos-test', '<p>after-quiz</p>', {
    position: 'after-quiz',
  });
  check('after-quiz insert succeeds', r1.action === 'inserted');
  const blocks = findSection(doc, 'cat').section.blocks;
  const quizIdx = blocks.findIndex((b) => b.type === 'quiz');
  check(
    'after-quiz block sits right after the quiz block',
    blocks[quizIdx + 1] && blocks[quizIdx + 1].html.includes('pos-test-auto-begin'),
  );

  // 'after-fence:pos-test' — second fence lands right after the first.
  const r2 = upsertFencedBlock(doc, 'cat', 'pos-test-2', '<p>chained</p>', {
    position: 'after-fence:pos-test',
  });
  check('after-fence:<other> insert succeeds', r2.action === 'inserted');
  const blocks2 = findSection(doc, 'cat').section.blocks;
  const firstFenceIdx = blocks2.findIndex(
    (b) => b.type === 'raw' && b.html.includes('pos-test-auto-begin'),
  );
  check(
    'second fence lands directly after first fence',
    blocks2[firstFenceIdx + 1] &&
      blocks2[firstFenceIdx + 1].html.includes('pos-test-2-auto-begin'),
  );

  // 'before-section-end' — clean fresh doc, fence lands as last block.
  const doc2 = deepClone(loadTopicContent(TOPIC, repoRoot));
  upsertFencedBlock(doc2, 'cat', 'tail-test', '<p>tail</p>', {
    position: 'before-section-end',
  });
  const tailBlocks = findSection(doc2, 'cat').section.blocks;
  check(
    'before-section-end inserts as last block',
    tailBlocks[tailBlocks.length - 1].html.includes('tail-test-auto-begin'),
  );
}

// ----- Test 7: position resolution — before-fence:<other> symmetry -----

console.log('test 7: before-fence:<other> position');
{
  const doc = deepClone(loadTopicContent(TOPIC, repoRoot));

  // Seed a base fence so we have a target to position relative to.
  upsertFencedBlock(doc, 'cat', 'sym-base', '<p>base</p>', {
    position: 'before-quiz',
  });

  // Insert a sibling fence BEFORE the base fence using the symmetric form.
  const r = upsertFencedBlock(doc, 'cat', 'sym-leader', '<p>leader</p>', {
    position: 'before-fence:sym-base',
  });
  check('before-fence:<other> insert succeeds', r.action === 'inserted');

  const blocks = findSection(doc, 'cat').section.blocks;
  const baseIdx = blocks.findIndex(
    (b) => b.type === 'raw' && b.html.includes('sym-base-auto-begin'),
  );
  check(
    'before-fence sibling lands in the slot immediately before the target',
    baseIdx >= 1 &&
      blocks[baseIdx - 1] &&
      blocks[baseIdx - 1].type === 'raw' &&
      blocks[baseIdx - 1].html.includes('sym-leader-auto-begin'),
    `baseIdx=${baseIdx}, prev=${JSON.stringify(blocks[baseIdx - 1])}`,
  );
}

// ----- Test 8: throw paths -----
//
// Cover the validation throws that production callers rely on for fail-fast
// behaviour:  unknown anchor, before-quiz with no quiz block, malformed
// position, missing </style> in rawHead.

console.log('test 8: throw paths');
{
  const doc = deepClone(loadTopicContent(TOPIC, repoRoot));

  // Unknown anchor.
  let threw = false;
  let msg = '';
  try {
    upsertFencedBlock(doc, 'no-such-anchor-xyz', 'oops', '<p>x</p>', {
      position: 'before-quiz',
    });
  } catch (e) {
    threw = true;
    msg = e.message;
  }
  check(
    'upsertFencedBlock on unknown anchor throws',
    threw && /no section with id/.test(msg),
    msg,
  );

  // Section that genuinely lacks a quiz block (synthetic).
  const noQuizDoc = deepClone(loadTopicContent(TOPIC, repoRoot));
  const synthAnchor = '__test_no_quiz_section__';
  noQuizDoc.sections.push({
    id: synthAnchor,
    blocks: [{ type: 'raw', html: '<p>just prose</p>' }],
  });
  threw = false;
  msg = '';
  try {
    upsertFencedBlock(noQuizDoc, synthAnchor, 'oops', '<p>x</p>', {
      position: 'before-quiz',
    });
  } catch (e) {
    threw = true;
    msg = e.message;
  }
  check(
    'before-quiz on a section with no quiz block throws',
    threw && /has no quiz block/.test(msg),
    msg,
  );

  // Malformed position string (empty fence target).
  threw = false;
  msg = '';
  try {
    upsertFencedBlock(doc, 'cat', 'oops', '<p>x</p>', {
      position: 'after-fence:',
    });
  } catch (e) {
    threw = true;
    msg = e.message;
  }
  check(
    'after-fence: with empty target throws "malformed position"',
    threw && /malformed position/.test(msg),
    msg,
  );

  // Unknown position spec.
  threw = false;
  msg = '';
  try {
    upsertFencedBlock(doc, 'cat', 'oops', '<p>x</p>', {
      position: 'middle-of-nowhere',
    });
  } catch (e) {
    threw = true;
    msg = e.message;
  }
  check(
    'unknown position spec throws',
    threw && /unknown position spec/.test(msg),
    msg,
  );

  // Missing options.position.
  threw = false;
  try {
    upsertFencedBlock(doc, 'cat', 'oops', '<p>x</p>', {});
  } catch (e) {
    threw = true;
    msg = e.message;
  }
  check(
    'missing options.position throws',
    threw && /options\.position is required/.test(msg),
    msg,
  );

  // ensureCss — missing </style> in rawHead.
  const noStyleDoc = { rawHead: '<head><title>x</title></head>' };
  threw = false;
  msg = '';
  try {
    ensureCss(noStyleDoc, /aside\.x\s*\{/, 'aside.x{}');
  } catch (e) {
    threw = true;
    msg = e.message;
  }
  check(
    'ensureCss on rawHead with no </style> throws',
    threw && /has no <\/style>/.test(msg),
    msg,
  );

  // updateCss — missing </style> in rawHead, on the insert path (no fence).
  threw = false;
  msg = '';
  try {
    updateCss(noStyleDoc, 'no-style-fence', 'aside.x{}');
  } catch (e) {
    threw = true;
    msg = e.message;
  }
  check(
    'updateCss on rawHead with no </style> throws when fence absent',
    threw && /has no <\/style>/.test(msg),
    msg,
  );
}

// ----- Test 9: existing un-fenced aside contract -----
//
// upsertFencedBlock targets a section that contains a hand-authored
// (non-bracketed) <aside class="callback">.  The expected handover behaviour
// is: the new fenced block is INSERTED alongside the un-fenced aside — the
// un-fenced one is neither destroyed nor wrapped.

console.log('test 9: un-fenced aside coexists with fenced upsert');
{
  const doc = deepClone(loadTopicContent(TOPIC, repoRoot));
  const anchor = 'cat';
  const section = findSection(doc, anchor).section;
  const blocksBefore = section.blocks.length;

  // Inject a hand-authored un-fenced aside as a fresh raw block.
  const handAside =
    '<aside class="callback"><p>hand-authored, not in a fence</p></aside>';
  // Insert it just before the quiz so the section stays well-formed.
  const quizIdx = section.blocks.findIndex((b) => b.type === 'quiz');
  section.blocks.splice(quizIdx, 0, { type: 'raw', html: handAside });

  // Now upsert a fenced block under a distinct fence name (so we're testing
  // the fresh-insert contract, not the auto-explode of a preexisting fence).
  const r = upsertFencedBlock(
    doc,
    anchor,
    'unfenced-coexist-test',
    '<aside class="callback"><p>fenced auto-generated</p></aside>',
    { position: 'before-quiz' },
  );
  check(
    'upsertFencedBlock inserts even when an un-fenced aside exists',
    r.action === 'inserted' && r.changed === true,
    JSON.stringify(r),
  );

  const after = findSection(doc, anchor).section.blocks;
  const handAlive = after.some(
    (b) => b.type === 'raw' && b.html === handAside,
  );
  const fencedAlive = after.some(
    (b) =>
      b.type === 'raw' &&
      b.html.includes('unfenced-coexist-test-auto-begin') &&
      b.html.includes('fenced auto-generated'),
  );
  check('un-fenced aside still present after upsert', handAlive);
  check('fenced block also present after upsert', fencedAlive);
  check(
    'block count grew by exactly 2 (un-fenced + fenced)',
    after.length === blocksBefore + 2,
    `before=${blocksBefore} after=${after.length}`,
  );
}

// ----- Test 10: auto-explode when fence is surrounded by other bytes -----
//
// Steady state for ~110 of 243 callback fences in the corpus: the fence sits
// inside a host raw block that ALSO contains surrounding bytes (a `</section>`
// close, an adjacent backlinks fence, inter-fence prose).  Naive wholesale
// replacement would silently drop those surrounding bytes.  upsertFencedBlock
// must auto-explode the host block, preserving every byte outside the fence
// region.

console.log('test 10: auto-explode preserves surrounding bytes');
{
  const doc = deepClone(loadTopicContent(TOPIC, repoRoot));
  const anchor = 'cat';
  const section = findSection(doc, anchor).section;

  // Build a synthetic host raw block: fence wedged between a leading prose
  // chunk and a trailing structural close.
  const fenced =
    '<!-- exp-test-auto-begin -->\n<aside class="callback"><p>old</p></aside>\n<!-- exp-test-auto-end -->';
  const lead = '<p>leading prose that must survive</p>\n';
  const tail = '\n<!-- backlinks-auto-begin -->\n<aside class="related"></aside>\n<!-- backlinks-auto-end -->\n</section>';
  const host = lead + fenced + tail;

  // Inject the host block before the quiz so the rest of the section parses.
  const quizIdx = section.blocks.findIndex((b) => b.type === 'quiz');
  section.blocks.splice(quizIdx, 0, { type: 'raw', html: host });
  const blocksBefore = section.blocks.length;

  // Upsert a fresh callback under the same fence name.
  const r = upsertFencedBlock(
    doc,
    anchor,
    'exp-test',
    '<aside class="callback"><p>NEW content</p></aside>',
    { position: 'before-quiz' },
  );
  check(
    'auto-explode upsert returns action "replaced"',
    r.action === 'replaced' && r.changed === true,
    JSON.stringify(r),
  );

  const after = findSection(doc, anchor).section.blocks;
  // Block count grew by 2: original host became { lead, fence, tail }.
  check(
    'host block exploded into 3 sibling raw blocks (count grew by 2)',
    after.length === blocksBefore + 2,
    `before=${blocksBefore} after=${after.length}`,
  );

  // The leading prose, the new fence content, and the trailing structural
  // bytes all live on, in order.
  const allHtml = after
    .filter((b) => b.type === 'raw')
    .map((b) => b.html)
    .join('');
  check(
    'leading prose preserved',
    allHtml.includes('leading prose that must survive'),
  );
  check(
    'trailing </section> close preserved',
    allHtml.includes('</section>'),
  );
  check(
    'trailing backlinks fence preserved verbatim',
    allHtml.includes('<!-- backlinks-auto-begin -->') &&
      allHtml.includes('<!-- backlinks-auto-end -->'),
  );
  check(
    'old fence content gone',
    !allHtml.includes('<aside class="callback"><p>old</p></aside>'),
  );
  check(
    'new fence content present',
    allHtml.includes('<aside class="callback"><p>NEW content</p></aside>'),
  );

  // Re-running with the same content is idempotent (noop on the new
  // standalone fence block).
  const r2 = upsertFencedBlock(
    doc,
    anchor,
    'exp-test',
    '<aside class="callback"><p>NEW content</p></aside>',
    { position: 'before-quiz' },
  );
  check(
    'auto-exploded fence is idempotent on re-run',
    r2.action === 'noop' && r2.changed === false,
    JSON.stringify(r2),
  );
}

// ----- Test 11: blockHasFence regex anchor (false-positive guard) -----
//
// A topic page that documents the fence syntax in a code example would
// embed text like `&lt;!-- callback-auto-begin --&gt;` inside its HTML.
// The old substring-based blockHasFence would treat that prose as a live
// fence.  The regex-anchored version must NOT.

console.log('test 11: blockHasFence regex anchors on HTML comment form');
{
  const doc = deepClone(loadTopicContent(TOPIC, repoRoot));
  const anchor = 'cat';
  const section = findSection(doc, anchor).section;

  // A raw block with the fence token as escaped/encoded text content.  Use
  // a fresh fence name (no preexisting live fence in the section) so we are
  // testing the regex-anchor contract in isolation.
  const escaped =
    '<p>The fence token looks like <code>&lt;!-- regex-anchor-test-auto-begin --&gt;</code> in the source.</p>';
  const quizIdx = section.blocks.findIndex((b) => b.type === 'quiz');
  section.blocks.splice(quizIdx, 0, { type: 'raw', html: escaped });

  // Now upsert a real fence under that name.  If blockHasFence false-positived
  // on the escaped text, this would WHOLESALE-REPLACE the escaped block (or
  // in the auto-explode world, mangle it) — destroying the prose.
  const r = upsertFencedBlock(
    doc,
    anchor,
    'regex-anchor-test',
    '<aside class="callback"><p>real callback</p></aside>',
    { position: 'before-quiz' },
  );
  check(
    'upsert on a section with HTML-encoded fence prose acts as a fresh insert',
    r.action === 'inserted' && r.changed === true,
    JSON.stringify(r),
  );

  // The escaped prose block still exists verbatim.
  const after = findSection(doc, anchor).section.blocks;
  const escapedAlive = after.some(
    (b) => b.type === 'raw' && b.html === escaped,
  );
  check('HTML-encoded fence prose left untouched', escapedAlive);
}

// ----- Test 12: updateCss — fenced CSS region -----

console.log('test 12: updateCss');
{
  const doc = deepClone(loadTopicContent(TOPIC, repoRoot));

  // Happy path: fence absent → insert.
  const fenceName = 'jbw-test-css';
  const r1 = updateCss(doc, fenceName, 'aside.jbw-test{display:none}');
  check(
    'updateCss insert path returns { changed: true, action: "inserted" }',
    r1.changed === true && r1.action === 'inserted',
    JSON.stringify(r1),
  );
  check(
    'rawHead now contains the begin fence comment',
    doc.rawHead.includes('/* jbw-test-css-auto-begin */'),
  );
  check(
    'rawHead now contains the end fence comment',
    doc.rawHead.includes('/* jbw-test-css-auto-end */'),
  );
  check(
    'rawHead now contains the wrapped CSS body',
    doc.rawHead.includes('aside.jbw-test{display:none}'),
  );

  // Idempotent re-run: same body → noop.
  const r2 = updateCss(doc, fenceName, 'aside.jbw-test{display:none}');
  check(
    'updateCss re-run with same body returns { changed: false, action: "noop" }',
    r2.changed === false && r2.action === 'noop',
    JSON.stringify(r2),
  );

  // Update path: fence present, body changes → action "updated".
  const r3 = updateCss(doc, fenceName, 'aside.jbw-test{display:block;color:red}');
  check(
    'updateCss with new body returns { changed: true, action: "updated" }',
    r3.changed === true && r3.action === 'updated',
    JSON.stringify(r3),
  );
  check(
    'rawHead reflects the updated CSS body',
    doc.rawHead.includes('aside.jbw-test{display:block;color:red}'),
  );
  check(
    'rawHead no longer contains the previous CSS body',
    !doc.rawHead.includes('aside.jbw-test{display:none}'),
  );

  // Re-run after update: noop.
  const r4 = updateCss(doc, fenceName, 'aside.jbw-test{display:block;color:red}');
  check(
    'updateCss re-run after update is noop',
    r4.changed === false && r4.action === 'noop',
    JSON.stringify(r4),
  );

  // Confirm the fence appears exactly once (i.e. updates replace, not append).
  const beginCount = (doc.rawHead.match(/jbw-test-css-auto-begin/g) || []).length;
  const endCount = (doc.rawHead.match(/jbw-test-css-auto-end/g) || []).length;
  check('fence begin token appears exactly once', beginCount === 1, `count=${beginCount}`);
  check('fence end token appears exactly once', endCount === 1, `count=${endCount}`);

  // Live disk untouched.
  const reloaded = loadTopicContent(TOPIC, repoRoot);
  check(
    'live disk file rawHead untouched by updateCss',
    !reloaded.rawHead.includes('jbw-test-css-auto-begin'),
  );

  // Throw on bad inputs.
  let threw = false;
  try {
    updateCss(doc, '', 'foo');
  } catch {
    threw = true;
  }
  check('updateCss empty fenceName throws', threw);

  threw = false;
  try {
    updateCss({ rawHead: 42 }, 'name', 'foo');
  } catch {
    threw = true;
  }
  check('updateCss non-string rawHead throws', threw);

  threw = false;
  try {
    updateCss(doc, 'name', 42);
  } catch {
    threw = true;
  }
  check('updateCss non-string cssText throws', threw);
}

// ----- Done -----

if (failures.length > 0) {
  console.error(`\nFAILED: ${failures.length} test(s)`);
  for (const f of failures) console.error(`  - ${f}`);
  process.exit(1);
}
console.log(`\nAll tests passed.`);
process.exit(0);
