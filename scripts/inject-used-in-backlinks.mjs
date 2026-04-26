#!/usr/bin/env node
// Insert (or audit) bidirectional "used in" backlinks on topic pages.
//
// Semantics:
//   - For each concept C owned by a topic page, compute the set of concepts
//     across the notebook that list C.id in their `prereqs`. That is the
//     reverse of the callback graph (which lists each section's prereqs).
//   - Render the reverse as an <aside class="related">…</aside> block inside
//     C's section. It complements (does not replace) the forward-looking
//     <aside class="callback"> block.
//   - If the reverse set is empty, omit the block entirely.
//   - Cap the list at 6 items; show "… and N more." when overflowing.
//
// Placement (when inserting fresh):
//   1. Immediately after an existing fenced callback block, if present.
//   2. Otherwise after the section's quiz block, if present.
//   3. Otherwise as the last block in the section.
//
//   When the section already carries a fenced backlinks block, the new
//   content replaces the old in-place — placement rules are not consulted.
//
// Source-of-truth split:
//   - Audit mode (no flag) reads <topic>.html and verifies presence.
//   - --fix mode mutates content/<topic>.json (the JSON SoT) so test-
//     roundtrip.mjs --fix can propagate to <topic>.html. Direct HTML
//     mutation is intentionally avoided — the rebuild chain would clobber
//     it via `test-roundtrip --fix`.
//
// Idempotency: inserted blocks are wrapped in a comment fence
//   <!-- backlinks-auto-begin -->…<!-- backlinks-auto-end -->
// inside a dedicated `raw` block. Re-running --fix is a no-op when nothing
// has changed.
//
// Zero external dependencies.

import { readFileSync, existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  loadTopicContent,
  saveTopicContent,
  upsertFencedBlock,
  stripFencedBlock,
  ensureCss,
} from './lib/json-block-writer.mjs';

const __filename = fileURLToPath(import.meta.url);
const repoRoot = resolve(dirname(__filename), '..');
const conceptsDir = join(repoRoot, 'concepts');
const contentDir = join(repoRoot, 'content');

const argv = process.argv.slice(2);
const FIX = argv.includes('--fix');

const MAX_ITEMS = 6;

// ----- Load concept graph -----
const indexPath = join(conceptsDir, 'index.json');
const topics = JSON.parse(readFileSync(indexPath, 'utf8')).topics;

// conceptId -> { topic, title, anchor, page }
const ownerOf = new Map();
// topic -> parsed file { page, title, concepts }
const topicData = new Map();
// topic -> topic title (from topic.json `title` field, else derived)
const topicTitle = new Map();

for (const topic of topics) {
  const p = join(conceptsDir, `${topic}.json`);
  if (!existsSync(p)) continue;
  const d = JSON.parse(readFileSync(p, 'utf8'));
  topicData.set(topic, d);
  topicTitle.set(topic, d.title || topic);
  for (const c of d.concepts || []) {
    if (ownerOf.has(c.id)) continue;
    ownerOf.set(c.id, {
      topic,
      title: c.title,
      anchor: c.anchor,
      page: d.page || `${topic}.html`,
    });
  }
}

// ----- Build reverse adjacency: conceptId -> Array of downstream consumers -----
// reverse.get(id) = [{ id: consumerId, topic, title, anchor, page }, …]
const reverse = new Map();
for (const [hostTopic, d] of topicData) {
  for (const c of d.concepts || []) {
    for (const p of c.prereqs || []) {
      if (!ownerOf.has(p)) continue;
      if (!reverse.has(p)) reverse.set(p, []);
      reverse.get(p).push({
        id: c.id,
        topic: hostTopic,
        title: c.title,
        anchor: c.anchor,
        page: d.page || `${hostTopic}.html`,
      });
    }
  }
}

// Sort each reverse list deterministically: by topic, then consumer title.
for (const arr of reverse.values()) {
  arr.sort((a, b) => {
    const ta = a.topic.localeCompare(b.topic);
    if (ta !== 0) return ta;
    return a.title.localeCompare(b.title);
  });
}

// ----- HTML helpers -----
function escapeRe(s) {
  return s.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
}

function escHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ----- Inner-content builder (used by --fix mode) -----
//
// Returns just the inner HTML — the fence wrap is added by upsertFencedBlock.
function renderRelatedInner(consumers) {
  const shown = consumers.slice(0, MAX_ITEMS);
  const overflow = consumers.length - shown.length;
  const lines = shown.map((c) => {
    const href = `./${c.page}#${c.anchor}`;
    const topicT = escHtml(topicTitle.get(c.topic) || c.topic);
    const conceptT = escHtml(c.title);
    return `    <div><a href="${href}">${topicT}</a> · ${conceptT}</div>`;
  });
  if (overflow > 0) {
    lines.push(`    <div class="more">… and ${overflow} more.</div>`);
  }
  return (
    `<aside class="related">\n` +
    `  <div class="ttl">Used in</div>\n` +
    lines.join('\n') + '\n' +
    `</aside>`
  );
}

// CSS rule injected once per page if absent. Uses --mute via color-mix so it
// sits visually beside aside.callback (which is cyan) without colliding.
const RELATED_CSS = `  aside.related{
    margin:1.2rem 0;padding:.7rem 1rem;
    background:color-mix(in srgb, var(--mute) 6%, transparent);
    border-left:3px solid color-mix(in srgb, var(--mute) 55%, transparent);
    border-radius:0 6px 6px 0;
    font-size:.93rem;
  }
  aside.related .ttl{
    font-size:.68rem;letter-spacing:.14em;text-transform:uppercase;
    color:var(--mute,#8c9aa6);margin-bottom:.3rem;font-weight:600;
  }
  aside.related > div{margin:.15rem 0}
  aside.related .more{color:var(--mute);font-style:italic}
  aside.related a{color:inherit}`;

// ----- Find section in HTML (audit-only) -----
function findHtmlSection(html, anchor) {
  const idRe = new RegExp(
    `<([a-zA-Z][a-zA-Z0-9]*)([^>]*\\sid=["']${escapeRe(anchor)}["'][^>]*)>`,
    'i',
  );
  const m = idRe.exec(html);
  if (!m) return null;
  const innerStart = m.index + m[0].length;

  const nextBoundaryRe = /<(?:section|h2|h3|h4)\b[^>]*\sid=["'][^"']+["']/gi;
  nextBoundaryRe.lastIndex = innerStart;
  const nextBoundaryM = nextBoundaryRe.exec(html);

  const nextCloseRe = /<\/section>/gi;
  nextCloseRe.lastIndex = innerStart;
  const nextCloseM = nextCloseRe.exec(html);

  let innerEnd;
  if (nextBoundaryM && (!nextCloseM || nextBoundaryM.index < nextCloseM.index)) {
    innerEnd = nextBoundaryM.index;
  } else if (nextCloseM) {
    innerEnd = nextCloseM.index;
  } else {
    innerEnd = html.length;
  }

  return { innerStart, innerEnd, body: html.slice(innerStart, innerEnd) };
}

// ----- JSON pre-pass: extract embedded fenced backlinks blocks -----
//
// Existing content/<topic>.json files were extracted from HTML before this
// refactor existed, so the fenced backlinks region currently lives INSIDE a
// raw block whose other bytes (callback aside, <p>, </section>, surrounding
// whitespace) belong to the section, not the fence. upsertFencedBlock /
// stripFencedBlock work on whole `raw` blocks — they cannot surgically
// rewrite a slice of one. Pre-splitting moves every existing fenced
// backlinks region into its own dedicated raw block, after which the writer
// helpers can replace/strip it cleanly.
//
// The split is byte-stable: render-topic.mjs concatenates raw block html
// fields with no separator, so splitting "ABC<!-- begin -->X<!-- end -->DE"
// into ["ABC", "<!-- begin -->X<!-- end -->", "DE"] reproduces the same
// bytes when rendered.
const BACKLINKS_RE =
  /<!--\s*backlinks-auto-begin\s*-->[\s\S]*?<!--\s*backlinks-auto-end\s*-->/;

function explodeFencedBacklinks(doc) {
  if (!Array.isArray(doc.sections)) return;
  for (const section of doc.sections) {
    if (!Array.isArray(section.blocks)) continue;
    const newBlocks = [];
    for (const block of section.blocks) {
      if (
        block && block.type === 'raw' && typeof block.html === 'string' &&
        BACKLINKS_RE.test(block.html)
      ) {
        const m = BACKLINKS_RE.exec(block.html);
        const before = block.html.slice(0, m.index);
        const fence = m[0];
        const after = block.html.slice(m.index + fence.length);
        // Only split when the fence is mixed with other bytes; a pure fence
        // block is left as-is.
        if (before.length === 0 && after.length === 0) {
          newBlocks.push(block);
          continue;
        }
        if (before.length > 0) {
          newBlocks.push({ type: 'raw', html: before });
        }
        newBlocks.push({ type: 'raw', html: fence });
        if (after.length > 0) {
          newBlocks.push({ type: 'raw', html: after });
        }
      } else {
        newBlocks.push(block);
      }
    }
    section.blocks = newBlocks;
  }
}

// ----- Main pass -----
let pagesTouched = 0;
let pagesSkipped = 0; // pages with no concepts that have downstream consumers
let backlinksInserted = 0;
let sectionsUpdated = 0;
let sectionsStripped = 0;
const missingReport = [];
const pagesWithIssues = new Set();

for (const [hostTopic, d] of topicData) {
  const page = d.page || `${hostTopic}.html`;
  const pagePath = join(repoRoot, page);

  if (FIX) {
    // ---- JSON-side fix path ----
    const jsonPath = join(contentDir, `${hostTopic}.json`);
    if (!existsSync(jsonPath)) {
      missingReport.push(`content/${hostTopic}.json: file missing`);
      continue;
    }

    const doc = loadTopicContent(hostTopic, repoRoot);

    // Pre-split any existing fenced regions out into dedicated raw blocks
    // so upsertFencedBlock / stripFencedBlock can target them precisely.
    // (Byte-stable by construction; render-topic concatenates raw blocks.)
    explodeFencedBacklinks(doc);

    // Map each concept's anchor to its parent section's id. For 408/411
    // concepts the anchor IS the section.id; for the few <h3>-anchored
    // ones we walk blocks and find the section whose raw blocks contain
    // the literal `id="<anchor>"` string.
    const sectionsBySectionId = new Map();
    for (const section of doc.sections || []) {
      if (section && section.id) sectionsBySectionId.set(section.id, section);
    }
    function parentSectionIdFor(anchor) {
      if (!anchor) return null;
      if (sectionsBySectionId.has(anchor)) return anchor;
      // Anchored regex match instead of substring `.includes('id="X"')` — the
      // substring form would false-match `id="paths"` inside `id="paths-derived"`
      // because there's no boundary check between the captured anchor and the
      // closing quote. The regex form requires the matching quote character
      // (single or double) to immediately follow `escapeRe(anchor)`, eliminating
      // the latent collision risk flagged by PR review.
      const idRe = new RegExp(`\\bid=("${escapeRe(anchor)}"|'${escapeRe(anchor)}')`);
      for (const section of doc.sections || []) {
        if (!Array.isArray(section.blocks)) continue;
        for (const block of section.blocks) {
          if (
            block && block.type === 'raw' && typeof block.html === 'string' &&
            idRe.test(block.html)
          ) {
            return section.id || null;
          }
        }
      }
      return null;
    }

    let pageHadJobs = false;
    const handledSectionIds = new Set();

    // Iterate concepts in JSON order. For shared section anchors, the
    // last writer wins — matching the legacy HTML script's behaviour for
    // sections like complex-analysis#sphere where multiple concepts share
    // a parent section but only one fenced backlinks block is rendered.
    for (const c of d.concepts || []) {
      if (!c.anchor) continue;
      const consumers = reverse.get(c.id);
      if (!consumers || consumers.length === 0) continue;

      pageHadJobs = true;
      const parentId = parentSectionIdFor(c.anchor);
      if (!parentId) {
        missingReport.push(
          `content/${hostTopic}.json: concept "${c.id}" anchor "${c.anchor}" — no parent section in JSON; skipping`,
        );
        continue;
      }

      const section = sectionsBySectionId.get(parentId);
      // Pick a position only used when no fence currently exists.
      // Precedence:
      //   1. after the fenced callback block (sibling agent A's writes)
      //   2. after the quiz block
      //   3. before the section's last block (i.e. before </section>)
      // A non-fenced <aside class="callback"> in the JSON is treated as
      // not-found here — the writer cannot anchor against it. The
      // round-trip flip is in progress; anchoring on the quiz is a stable
      // fallback while agent A's fences propagate.
      const hasCallbackFence = (section.blocks || []).some(
        (b) =>
          b && b.type === 'raw' && typeof b.html === 'string' &&
          b.html.includes('<!-- callback-auto-begin -->'),
      );
      const hasQuiz = (section.blocks || []).some(
        (b) => b && b.type === 'quiz',
      );
      const position = hasCallbackFence
        ? 'after-fence:callback'
        : hasQuiz
          ? 'after-quiz'
          : 'before-section-end';

      const inner = renderRelatedInner(consumers);
      const result = upsertFencedBlock(doc, parentId, 'backlinks', inner, {
        position,
      });
      handledSectionIds.add(parentId);
      if (result.changed) {
        if (result.action === 'inserted' || result.action === 'replaced') {
          sectionsUpdated++;
          backlinksInserted += Math.min(consumers.length, MAX_ITEMS);
        }
      }
    }

    // Strip stale fenced blocks from any section we didn't touch this pass
    // (i.e. no concept in that section has downstream consumers any more).
    for (const section of doc.sections || []) {
      if (!section || !section.id) continue;
      if (handledSectionIds.has(section.id)) continue;
      const stripResult = stripFencedBlock(doc, section.id, 'backlinks');
      if (stripResult.changed) sectionsStripped++;
    }

    if (!pageHadJobs) pagesSkipped++;

    // Ensure aside.related CSS lives in rawHead, but only when the page
    // currently carries at least one fenced block.
    const pageHasRelated = (doc.sections || []).some(
      (s) =>
        (s.blocks || []).some(
          (b) =>
            b && b.type === 'raw' && typeof b.html === 'string' &&
            b.html.includes('<!-- backlinks-auto-begin -->'),
        ),
    );
    if (pageHasRelated) {
      ensureCss(doc, /aside\.related\s*\{/, RELATED_CSS);
    }

    // saveTopicContent byte-compares before writing.
    const wrote = saveTopicContent(hostTopic, doc, repoRoot);
    if (wrote) pagesTouched++;
    continue;
  }

  // ---- Audit mode (HTML-side, unchanged behaviour) ----
  if (!existsSync(pagePath)) {
    missingReport.push(`${page}: file missing`);
    continue;
  }

  const jobs = [];
  for (const c of d.concepts || []) {
    if (!c.anchor) continue;
    const consumers = reverse.get(c.id);
    if (!consumers || consumers.length === 0) continue;
    jobs.push({ anchor: c.anchor, id: c.id, consumers });
  }

  if (jobs.length === 0) {
    pagesSkipped++;
    continue;
  }

  const html = readFileSync(pagePath, 'utf8');
  const pageIssues = [];
  for (const job of jobs) {
    const sec = findHtmlSection(html, job.anchor);
    if (!sec) {
      pageIssues.push(`section #${job.anchor} (concept "${job.id}") not found`);
      continue;
    }
    const body = sec.body;
    const hasFenced =
      /<!--\s*backlinks-auto-begin\s*-->[\s\S]*?<aside\s+class=["']related["'][\s\S]*?<!--\s*backlinks-auto-end\s*-->/.test(
        body,
      );
    const hasPlain = /<aside\s+class=["']related["'][^>]*>/i.test(body);
    if (!hasFenced && !hasPlain) {
      pageIssues.push(
        `section #${job.anchor} (concept "${job.id}") missing <aside class="related"> (expected ${job.consumers.length} downstream consumer(s))`,
      );
    }
  }
  if (pageIssues.length > 0) {
    pagesWithIssues.add(page);
    missingReport.push(`${page}:\n  ${pageIssues.join('\n  ')}`);
  }
}

// ----- Report -----
const totalDownstreamPairs = [...reverse.entries()].reduce(
  (n, [, arr]) => n + arr.length,
  0,
);
console.log(
  `inject-used-in-backlinks: ${topicData.size} topic(s), ${reverse.size} concept(s) with downstream consumers, ${totalDownstreamPairs} edge(s) total`,
);

if (FIX) {
  console.log(`  pages touched:        ${pagesTouched}`);
  console.log(`  sections updated:     ${sectionsUpdated}`);
  console.log(`  sections stripped:    ${sectionsStripped}`);
  console.log(`  backlinks inserted:   ${backlinksInserted}`);
  console.log(`  pages skipped (leaf): ${pagesSkipped}`);
  if (missingReport.length > 0) {
    console.log('');
    console.log('WARNINGS:');
    for (const line of missingReport) console.log(`  - ${line}`);
  }
  console.log('');
  console.log('OK: backlink insertion complete.');
  process.exit(0);
}

// Audit mode.
console.log(`  pages skipped (leaf): ${pagesSkipped}`);
console.log('');
if (missingReport.length === 0) {
  console.log(
    'OK: every concept with downstream consumers carries an <aside class="related"> block.',
  );
  process.exit(0);
}

console.log(`MISSING (${pagesWithIssues.size} page(s)):`);
for (const line of missingReport) console.log(`  - ${line}`);
console.log('');
console.log(
  `FAIL: ${pagesWithIssues.size} page(s) missing backlink asides. Re-run with --fix to insert.`,
);
process.exit(1);
