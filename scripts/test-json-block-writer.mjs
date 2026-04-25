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

// ----- Done -----

if (failures.length > 0) {
  console.error(`\nFAILED: ${failures.length} test(s)`);
  for (const f of failures) console.error(`  - ${f}`);
  process.exit(1);
}
console.log(`\nAll tests passed.`);
process.exit(0);
