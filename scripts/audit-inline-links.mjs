#!/usr/bin/env node
// Audit (and optionally insert) inline prereq links in topic-page prose.
//
// Semantics:
//   - Every concept across the notebook has a human-readable `title` in
//     concepts/bundle.js. When a topic page's prose mentions another concept's
//     title in plain text, it is a missed cross-reference: the reader can't
//     click through. This script scans prose for such mentions and, in --fix
//     mode, wraps the first occurrence per section in an
//     <a href="<topic>.html#<anchor>" data-auto-inline-link="1">…</a>.
//
//   - Self-links are suppressed (don't link a concept to its own owner topic).
//
//   - False positives are worse than false negatives. The matcher is
//     deliberately conservative:
//       * whole-word case-insensitive match;
//       * longest-title-first ordering (so "direct limit" beats "limit");
//       * very short titles (≤ 4 chars) and an English-common-word blocklist
//         are suppressed entirely;
//       * matches inside <a>, <aside>, <code>, <pre>, heading tags, widgets,
//         KaTeX spans ($…$, $$…$$, \(…\), \[…\]), or already-fenced auto
//         anchors are skipped (delegated to forEachSectionProse + the
//         audit-utils skip mask);
//       * at most one anchor inserted per concept per section;
//       * if the page already contains any link to the same target anchor
//         (anywhere), the concept is skipped entirely for that page.
//
// Idempotency fence: auto-inserted anchors carry data-auto-inline-link="1".
// --fix first strips every such anchor on the page (unwrapping to its text
// content), then re-inserts from scratch. Re-running --fix is a no-op after
// the first pass. Hand-authored anchors are never touched.
//
// Injected anchors carry two extra data attributes consumed by the client-side
// glossary popover (js/glossary-popover.js):
//   data-concept-id="<id>"   canonical concept id (for MVProgress lookups and
//                             title lookup via window.__MVConcepts)
//   data-blurb="<blurb>"     HTML-escaped 1–2 sentence summary, rendered
//                             verbatim as text content in the popover body.
//
// CLI:
//   node scripts/audit-inline-links.mjs
//       Audit mode. Print candidates grouped by page/section. Exits 0
//       regardless (informational — not a CI gate yet).
//
//   node scripts/audit-inline-links.mjs --fix
//       Apply inserts to every topic page.
//
//   node scripts/audit-inline-links.mjs --page <topic.html>
//       Restrict to one page (combine with --fix for a pilot).

import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse } from 'node-html-parser';
import {
  loadContentModel,
  forEachSectionProse,
} from './lib/content-model.mjs';
import {
  TITLE_BLOCKLIST,
  MIN_TITLE_LEN,
  buildTitleRegex,
  buildSkipMask,
  buildSectionMap,
} from './lib/audit-utils.mjs';

const __filename = fileURLToPath(import.meta.url);
const repoRoot = resolve(dirname(__filename), '..');

// ─────────────────────────────────────────────────────────────────────────
// CLI.

const argv = process.argv.slice(2);
const FIX = argv.includes('--fix');
let PAGE_FILTER = null;
{
  const idx = argv.indexOf('--page');
  if (idx !== -1) {
    PAGE_FILTER = argv[idx + 1];
    if (!PAGE_FILTER || PAGE_FILTER.startsWith('--')) {
      console.error('audit-inline-links: --page requires a filename');
      process.exit(2);
    }
  }
}

// ─────────────────────────────────────────────────────────────────────────
// Load concept vocabulary via the shared content model.

const model = await loadContentModel();

// vocab = [{ title, titleLower, regex, id, topic, page, anchor, blurb }, …],
// sorted longest-first so multi-word titles beat shorter prefixes. Topic
// iteration order mirrors concepts/index.json (registeredTopics) which
// matches bundle.js key order — identical to the legacy path.
const vocab = [];

for (const topicId of model.topicIds) {
  const topic = model.topics.get(topicId);
  if (!topic) continue;
  const page = topic.page || `${topicId}.html`;
  for (const conceptId of topic.conceptIds) {
    const c = model.concepts.get(conceptId);
    if (!c || !c.title || !c.anchor) continue;
    // Each concept lives in exactly one topic in the model; iterating a
    // topic's conceptIds in order walks every concept once.
    if (c.topic !== topicId) continue;
    const title = c.title.trim();
    const titleLower = title.toLowerCase();
    if (title.length < MIN_TITLE_LEN) continue;
    if (TITLE_BLOCKLIST.has(titleLower)) continue;
    vocab.push({
      title,
      titleLower,
      regex: buildTitleRegex(title),
      id: c.id,
      topic: topicId,
      page,
      anchor: c.anchor,
      blurb: typeof c.blurb === 'string' ? c.blurb : '',
    });
  }
}
vocab.sort((a, b) => b.title.length - a.title.length);

// ─────────────────────────────────────────────────────────────────────────
// Page discovery.

const SPECIAL = new Set(['index.html', 'pathway.html']);
function listTopicPages() {
  return readdirSync(repoRoot)
    .filter((f) => f.endsWith('.html') && !SPECIAL.has(f))
    .sort();
}

// Map each page back to its topic slug (so we can self-link-skip).
function topicOfPage(page) {
  return page.replace(/\.html$/, '');
}

// ─────────────────────────────────────────────────────────────────────────
// Candidate detection.
//
// For each <p> in the page's parsed DOM, walk its prose TextNodes via the
// shared forEachSectionProse helper — which prunes widget/katex classes plus
// <script>/<style>/<svg>/<code>/<pre>/<aside>, headings, and <a> subtrees
// for us. Inside each TextNode, run the vocab regex against the math-masked
// text; byte offsets come from the parser's per-node `.range` so --fix splices
// land at exactly the same source positions the previous regex path used.
//
// We still consult the audit-utils `buildSkipMask` as a defensive double
// check: the tag-interior and container masks veto candidates that would
// cross an HTML tag. In practice a TextNode's range never overlaps markup,
// but the double check is cheap and closes any parser edge case.
//
// Constraints:
//   - Skip self-links: concept's owner topic === current page topic.
//   - Skip if the page already contains any <a href> pointing to the target
//     anchor (regardless of section) — the author already linked it once,
//     further mentions are intentional.
//   - At most one candidate per (section, concept-id).
//   - Don't match immediately adjacent to `$` (math-prose neighborhood noise).

function sectionForOffset(sections, offset) {
  let best = null;
  for (const s of sections) {
    if (offset >= s.start && offset < s.end) {
      if (!s.id) continue;
      if (!best || s.start > best.start) best = s;
    }
  }
  return best ? best.id : null;
}

function* findCandidatesInPage(html, pageTopic) {
  const root = parse(html, {
    blockTextElements: {
      script: true,
      noscript: true,
      style: true,
      pre: true,
    },
  });
  const { mask } = buildSkipMask(html);
  const sections = buildSectionMap(html);

  // Collect existing link targets on the whole page so we can suppress
  // concepts already linked by hand.
  const existingLinkTargets = new Set();
  {
    const linkRe = /<a\b[^>]*\bhref=["']([^"']+)["'][^>]*>/gi;
    let m;
    while ((m = linkRe.exec(html))) {
      const href = m[1];
      const cleaned = href.replace(/^\.\//, '').split('?')[0];
      existingLinkTargets.add(cleaned);
    }
  }

  // Track (section -> concept-id) dedupe.
  const emittedPerSection = new Map();

  // Enumerate <p> elements in document order. Each <p>'s TextNodes are
  // visited via forEachSectionProse (which prunes skip-class and skip-tag
  // subtrees). We keep a per-<p> local mask so a shorter title cannot wrap
  // text already claimed by a longer title in the same paragraph.
  const paragraphs = root.querySelectorAll('p');

  for (const p of paragraphs) {
    if (!p || !p.range) continue;
    const pStart = p.range[0];
    const pEnd = p.range[1];
    const sectionId = sectionForOffset(sections, pStart);

    // Collect prose TextNodes inside this paragraph, in source order.
    const proseNodes = [];
    forEachSectionProse(p, (textNode, info) => {
      if (!textNode || !textNode.range) return;
      proseNodes.push({ node: textNode, text: info.text, masked: info.masked });
    });
    if (proseNodes.length === 0) continue;

    const localMask = new Uint8Array(pEnd - pStart);

    for (const v of vocab) {
      if (v.topic === pageTopic) continue; // self-link suppression
      const anchorKey = `${v.page}#${v.anchor}`;
      if (existingLinkTargets.has(anchorKey)) continue;

      const sectionKey = sectionId ? `${sectionId}::${v.id}` : null;
      if (sectionKey && emittedPerSection.get(sectionKey)) continue;

      // Walk each TextNode in this paragraph; first admissible match wins.
      let found = null;
      scan: for (const { node, masked } of proseNodes) {
        const nodeStart = node.range[0];
        const nodeEnd = node.range[1];
        let searchFrom = 0;
        while (searchFrom < masked.length) {
          const re = new RegExp(v.regex.source, 'i');
          const m = masked.slice(searchFrom).match(re);
          if (!m) break;
          const localIdxInNode = searchFrom + m.index;
          const globalIdx = nodeStart + localIdxInNode;
          const len = m[0].length;
          // Defensive: the match must lie entirely inside this TextNode and
          // must not cross any bytes the audit-utils skip mask flags.
          let skip = false;
          if (globalIdx + len > nodeEnd) skip = true;
          if (!skip) {
            for (let k = 0; k < len; k++) {
              if (mask[globalIdx + k]) {
                skip = true;
                break;
              }
            }
          }
          // Don't overlap a prior (longer-title) wrap in this same paragraph.
          if (!skip) {
            const pLocal = globalIdx - pStart;
            for (let k = 0; k < len; k++) {
              if (localMask[pLocal + k]) {
                skip = true;
                break;
              }
            }
          }
          // Neighborhood guard: "$X$ is a scheme" style — don't link right
          // next to a dollar-sign.
          if (!skip) {
            const preCh = globalIdx > 0 ? html[globalIdx - 1] : '';
            const postCh = html[globalIdx + len] || '';
            if (preCh === '$' || postCh === '$') skip = true;
          }
          if (skip) {
            searchFrom = localIdxInNode + Math.max(1, len);
            continue;
          }
          found = { globalIdx, len, text: m[0] };
          break scan;
        }
      }

      if (!found) continue;

      // Reserve this range in the paragraph-local mask so shorter vocab
      // entries can't re-wrap inside it.
      const pLocal = found.globalIdx - pStart;
      for (let k = 0; k < found.len; k++) localMask[pLocal + k] = 1;

      if (sectionKey) emittedPerSection.set(sectionKey, true);

      yield {
        section: sectionId,
        concept: v,
        phrase: found.text,
        globalIdx: found.globalIdx,
        length: found.len,
      };
    }
  }
}

// ─────────────────────────────────────────────────────────────────────────
// --fix: strip + re-insert.

function stripAutoLinks(html) {
  // <a … data-auto-inline-link="1" …>INNER</a> → INNER
  // Allow any attribute order, any quoting.
  const re = /<a\b[^>]*\bdata-auto-inline-link=["']1["'][^>]*>([\s\S]*?)<\/a>/gi;
  return html.replace(re, (_m, inner) => inner);
}

// Escape a string for embedding inside an HTML double-quoted attribute value.
// We cover &, <, >, " and ' for safety; blurbs come from concepts/*.json and
// routinely contain e.g. "<", apostrophes, and ampersands.
function escAttr(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function applyFixToHtml(html, pageTopic) {
  // Strip first so candidate detection sees "clean" prose. All DOM node
  // ranges below are taken from the parsed `working` string, not the input.
  let working = stripAutoLinks(html);

  const inserts = [];
  for (const cand of findCandidatesInPage(working, pageTopic)) {
    inserts.push(cand);
  }
  // Sort descending by offset so splicing doesn't shift later offsets.
  inserts.sort((a, b) => b.globalIdx - a.globalIdx);
  for (const ins of inserts) {
    const { concept, globalIdx, length, phrase } = ins;
    const href = `./${concept.page}#${concept.anchor}`;
    const idAttr = ` data-concept-id="${escAttr(concept.id)}"`;
    const blurbAttr = concept.blurb
      ? ` data-blurb="${escAttr(concept.blurb)}"`
      : '';
    const anchor =
      `<a href="${href}" data-auto-inline-link="1"` +
      idAttr +
      blurbAttr +
      `>${phrase}</a>`;
    working =
      working.slice(0, globalIdx) + anchor + working.slice(globalIdx + length);
  }
  return { html: working, inserts: inserts.length };
}

// ─────────────────────────────────────────────────────────────────────────
// Main.

const pages = listTopicPages().filter(
  (p) => !PAGE_FILTER || p === PAGE_FILTER
);
if (PAGE_FILTER && pages.length === 0) {
  console.error(`audit-inline-links: --page "${PAGE_FILTER}" not found`);
  process.exit(2);
}

const perPage = new Map(); // page -> Array<candidate>
const conceptsSeen = new Set();
let pagesTouched = 0;
let totalInserted = 0;

for (const page of pages) {
  const pagePath = join(repoRoot, page);
  if (!existsSync(pagePath)) continue;
  const pageTopic = topicOfPage(page);
  const html = readFileSync(pagePath, 'utf8');

  if (FIX) {
    const { html: newHtml, inserts } = applyFixToHtml(html, pageTopic);
    if (newHtml !== html) {
      writeFileSync(pagePath, newHtml);
      pagesTouched++;
    }
    totalInserted += inserts;
    // Also record the candidates for the final report.
    const working = stripAutoLinks(html);
    const cands = [...findCandidatesInPage(working, pageTopic)];
    if (cands.length > 0) perPage.set(page, cands);
    for (const c of cands) conceptsSeen.add(c.concept.id);
  } else {
    const cands = [...findCandidatesInPage(html, pageTopic)];
    if (cands.length > 0) perPage.set(page, cands);
    for (const c of cands) conceptsSeen.add(c.concept.id);
  }
}

// ─────────────────────────────────────────────────────────────────────────
// Report.

let totalCandidates = 0;
const sortedPages = [...perPage.keys()].sort();

for (const page of sortedPages) {
  const cands = perPage.get(page);
  console.log(`${page}  (${cands.length} candidate${cands.length === 1 ? '' : 's'})`);
  // Group by section.
  const bySection = new Map();
  for (const c of cands) {
    const sec = c.section || '<no-section>';
    if (!bySection.has(sec)) bySection.set(sec, []);
    bySection.get(sec).push(c);
  }
  const sectionKeys = [...bySection.keys()].sort();
  for (const sec of sectionKeys) {
    console.log(`  #${sec}`);
    for (const c of bySection.get(sec)) {
      totalCandidates++;
      console.log(
        `    "${c.phrase}" → ${c.concept.page}#${c.concept.anchor}   (concept: ${c.concept.id})`
      );
    }
  }
}

console.log('');
console.log(
  `audit-inline-links: ${totalCandidates} candidate(s) across ${sortedPages.length} page(s), ${conceptsSeen.size} unique concept(s)`
);
if (FIX) {
  console.log(`  pages touched: ${pagesTouched}`);
  console.log(`  anchors inserted: ${totalInserted}`);
}

// Per the plan: audit mode is informational — exit 0 regardless. --fix also
// exits 0 on success.
process.exit(0);
