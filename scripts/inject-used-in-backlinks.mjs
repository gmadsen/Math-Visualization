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
// Placement:
//   1. After an existing <aside class="callback"> (the established forward
//      block), if present.
//   2. Otherwise after the section's <div class="quiz" data-concept=…>
//      placeholder, if present.
//   3. Otherwise just before the section's closing </section>.
//
// Idempotency: inserted blocks are wrapped in a comment fence
//   <!-- backlinks-auto-begin -->…<!-- backlinks-auto-end -->
// so re-running strips the old block and re-inserts fresh content. Any
// hand-edited <aside class="related"> without the fence is left alone on
// audit, but the fix mode rewrites any fenced block in place.
//
// Modes:
//   default      Audit-only. Prints a per-page report, exits 1 if any
//                page is missing an expected backlink aside.
//   --fix        Insert/update <aside class="related"> blocks in place.
//                Exit 0 on success.
//   --dry-run    Alias for default.
//
// Zero external dependencies.

import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  makeFence,
  stripFence,
  ensureCss,
  writeIfChanged,
} from './lib/html-injector.mjs';

const __filename = fileURLToPath(import.meta.url);
const repoRoot = resolve(dirname(__filename), '..');
const conceptsDir = join(repoRoot, 'concepts');

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

// Find the block owned by a concept anchor. Same logic as audit-callbacks.mjs.
function findSection(html, anchor) {
  const idRe = new RegExp(
    `<([a-zA-Z][a-zA-Z0-9]*)([^>]*\\sid=["']${escapeRe(anchor)}["'][^>]*)>`,
    'i'
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

const BACKLINKS_FENCE = makeFence('backlinks');

function buildRelatedBlock(consumers) {
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
    `${BACKLINKS_FENCE.begin}\n` +
    `<aside class="related">\n` +
    `  <div class="ttl">Used in</div>\n` +
    lines.join('\n') + '\n' +
    `</aside>\n` +
    `${BACKLINKS_FENCE.end}`
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

function ensureRelatedCss(html) {
  return ensureCss(html, /aside\.related\s*\{/, RELATED_CSS);
}

// Strip any existing fenced backlinks block inside [innerStart, innerEnd).
// Consumes the single leading newline we inject (so re-runs don't add blank-
// line drift) plus any trailing blank lines directly after the fence.
function stripFencedBlock(html, innerStart, innerEnd) {
  const body = html.slice(innerStart, innerEnd);
  const { html: newBody, removed } = stripFence(body, 'backlinks', {
    trim: {
      leadingNewline: true,
      leadingIndent: true,
      trailingInlineWs: true,
      trailingNewline: true,
    },
  });
  if (removed === 0) return { html, removedCount: 0, delta: 0 };
  const newHtml = html.slice(0, innerStart) + newBody + html.slice(innerEnd);
  return { html: newHtml, removedCount: removed, delta: newBody.length - body.length };
}

// Decide insertion offset inside the (post-strip) section body.
// Returns an absolute offset into `html`.
function pickInsertOffset(html, anchor) {
  const sec = findSection(html, anchor);
  if (!sec) return null;
  const body = sec.body;

  // 1. After existing <aside class="callback">…</aside>
  const cbRe = /<aside\s+class=["']callback["'][^>]*>[\s\S]*?<\/aside>/i;
  const cbM = body.match(cbRe);
  if (cbM) {
    return { sec, at: sec.innerStart + cbM.index + cbM[0].length };
  }

  // 2. After the section's quiz placeholder
  const quizRe =
    /<div[^>]*class=["'][^"']*\bquiz\b[^"']*["'][^>]*\bdata-concept=["'][^"']+["'][^>]*>[^<]*<\/div>/;
  const qM = body.match(quizRe);
  if (qM) {
    return { sec, at: sec.innerStart + qM.index + qM[0].length };
  }

  // 3. End of section (before </section>)
  return { sec, at: sec.innerEnd };
}

// ----- Main pass -----
let pagesTouched = 0;
let pagesSkipped = 0; // pages with no concepts that have downstream consumers
let backlinksInserted = 0;
let sectionsUpdated = 0;
const missingReport = [];
const pagesWithIssues = new Set();

for (const [hostTopic, d] of topicData) {
  const page = d.page || `${hostTopic}.html`;
  const pagePath = join(repoRoot, page);
  if (!existsSync(pagePath)) {
    missingReport.push(`${page}: file missing`);
    continue;
  }

  // Sections on this page that should host a backlink aside.
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

  let html = readFileSync(pagePath, 'utf8');
  const origHtml = html;

  if (FIX) {
    // Ensure CSS present.
    html = ensureRelatedCss(html);

    // Process in reverse document order so earlier offsets aren't shifted.
    const orderedJobs = jobs
      .map((j) => {
        const sec = findSection(html, j.anchor);
        return { ...j, secStart: sec ? sec.innerStart : -1 };
      })
      .filter((j) => j.secStart >= 0)
      .sort((a, b) => b.secStart - a.secStart);

    for (const job of orderedJobs) {
      // Strip existing fenced block from this section (if any).
      const sec0 = findSection(html, job.anchor);
      if (!sec0) continue;
      const stripped = stripFencedBlock(html, sec0.innerStart, sec0.innerEnd);
      html = stripped.html;

      // Recompute insertion point.
      const picked = pickInsertOffset(html, job.anchor);
      if (!picked) continue;

      const block = buildRelatedBlock(job.consumers);
      html =
        html.slice(0, picked.at) + '\n' + block + '\n' + html.slice(picked.at);
      backlinksInserted += Math.min(job.consumers.length, MAX_ITEMS);
      sectionsUpdated++;
    }

    if (writeIfChanged(pagePath, origHtml, html)) {
      pagesTouched++;
    }
  } else {
    // Audit: check each section carries a (current) backlinks-auto block.
    const pageIssues = [];
    for (const job of jobs) {
      const sec = findSection(html, job.anchor);
      if (!sec) {
        pageIssues.push(`section #${job.anchor} (concept "${job.id}") not found`);
        continue;
      }
      const body = sec.body;
      // Accept either a fenced block or a hand-written aside.related.
      const hasFenced = /<!--\s*backlinks-auto-begin\s*-->[\s\S]*?<aside\s+class=["']related["'][\s\S]*?<!--\s*backlinks-auto-end\s*-->/.test(
        body
      );
      const hasPlain = /<aside\s+class=["']related["'][^>]*>/i.test(body);
      if (!hasFenced && !hasPlain) {
        pageIssues.push(
          `section #${job.anchor} (concept "${job.id}") missing <aside class="related"> (expected ${job.consumers.length} downstream consumer(s))`
        );
      }
    }
    if (pageIssues.length > 0) {
      pagesWithIssues.add(page);
      missingReport.push(`${page}:\n  ${pageIssues.join('\n  ')}`);
    }
  }
}

// ----- Report -----
const totalDownstreamPairs = [...reverse.entries()].reduce(
  (n, [, arr]) => n + arr.length,
  0
);
console.log(
  `inject-used-in-backlinks: ${topicData.size} topic(s), ${reverse.size} concept(s) with downstream consumers, ${totalDownstreamPairs} edge(s) total`
);

if (FIX) {
  console.log(`  pages touched:        ${pagesTouched}`);
  console.log(`  sections updated:     ${sectionsUpdated}`);
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
    'OK: every concept with downstream consumers carries an <aside class="related"> block.'
  );
  process.exit(0);
}

console.log(`MISSING (${pagesWithIssues.size} page(s)):`);
for (const line of missingReport) console.log(`  - ${line}`);
console.log('');
console.log(
  `FAIL: ${pagesWithIssues.size} page(s) missing backlink asides. Re-run with --fix to insert.`
);
process.exit(1);
