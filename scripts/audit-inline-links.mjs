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
//         anchors are skipped;
//       * at most one anchor inserted per concept per section;
//       * if the page already contains any link to the same target anchor
//         (anywhere), the concept is skipped entirely for that page.
//
// Idempotency fence: auto-inserted anchors carry data-auto-inline-link="1".
// --fix first strips every such anchor on the page (unwrapping to its text
// content), then re-inserts from scratch. Re-running --fix is a no-op after
// the first pass. Hand-authored anchors are never touched.
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
//
// Zero dependencies: regex + string checks, runs from stock node.

import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const repoRoot = resolve(dirname(__filename), '..');
const conceptsDir = join(repoRoot, 'concepts');

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
// Configuration.

// Titles of this length or shorter are always skipped — too many false
// positives in English prose.
const MIN_TITLE_LEN = 5;

// Explicit blocklist of concept titles (lowercased) that would collide with
// common English words or standalone math notation too often. Add sparingly.
const TITLE_BLOCKLIST = new Set([
  'sets',
  'rank',
  'limit',
  'limits',
  'functor',
  'functors',
  'group',
  'groups',
  'ring',
  'rings',
  'field',
  'fields',
  'space',
  'spaces',
  'map',
  'maps',
  'action',
  'order',
  'norm',
  'degree',
  'product',
  'products',
  'sum',
  'sums',
  'number',
  'numbers',
  'point',
  'points',
  'line',
  'lines',
  'curve',
  'curves',
  'surface',
  'surfaces',
  'trace',
  'root',
  'roots',
  'base',
  'basis',
  'image',
  'kernel',
  'range',
  'domain',
  'series',
  'form',
  'forms',
  'module',
  'modules',
  'ideal',
  'ideals',
  'genus',
  'class',
  'classes',
  'algebra',
  'algebras',
  'category',
  'scheme',
  'schemes',
  'sheaf',
  'sheaves',
  'topology',
  'manifold',
  'manifolds',
  'function',
  'functions',
  'measure',
  'measures',
  'operator',
  'operators',
  'set',
  'integral',
  'integrals',
  'derivative',
  'derivatives',
  'partition',
  'partitions',
  'period',
  'periods',
  'weight',
  'level',
  'index',
  'index.html',
  'residue',
  'residues',
]);

// ─────────────────────────────────────────────────────────────────────────
// Load concept vocabulary from concepts/bundle.js.

function loadConcepts() {
  const bundlePath = join(conceptsDir, 'bundle.js');
  const raw = readFileSync(bundlePath, 'utf8');
  const m = raw.match(/window\.__MVConcepts\s*=\s*(\{[\s\S]*?\})\s*;\s*$/);
  if (!m) {
    console.error('audit-inline-links: could not parse concepts/bundle.js');
    process.exit(2);
  }
  // Safe enough: bundle.js is auto-generated from JSON, no code inside.
  // eslint-disable-next-line no-new-func
  const obj = new Function('return ' + m[1])();
  return obj;
}

const __MV = loadConcepts();

// vocab = [{ title, titleLower, regex, id, topic, page, anchor }, …], sorted
// longest-first so multi-word titles beat shorter prefixes.
const vocab = [];
const ownerTopicById = new Map();

for (const topic of Object.keys(__MV.topics)) {
  const t = __MV.topics[topic];
  const page = t.page || `${topic}.html`;
  for (const c of t.concepts || []) {
    if (!c.title || !c.anchor) continue;
    ownerTopicById.set(c.id, topic);
    const title = c.title.trim();
    const titleLower = title.toLowerCase();
    if (title.length < MIN_TITLE_LEN) continue;
    if (TITLE_BLOCKLIST.has(titleLower)) continue;
    // Word-boundary regex, case-insensitive, on the title as-is. We escape
    // regex metacharacters in the title; whitespace is matched flexibly with
    // \s+ so "Sato–Tate measure" or "Sato-Tate measure" written with varied
    // whitespace still matches.
    const pattern =
      '\\b' +
      title
        .split(/\s+/)
        .map((w) =>
          w
            .replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
            // treat unicode hyphens as interchangeable
            .replace(/[-‐-―]/g, '[-\\u2010-\\u2015]')
        )
        .join('\\s+') +
      '\\b';
    vocab.push({
      title,
      titleLower,
      regex: new RegExp(pattern, 'i'),
      id: c.id,
      topic,
      page,
      anchor: c.anchor,
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
// Skip-zone masking.
//
// We want to restrict matching to text that lives inside <p>…</p> nodes that
// are NOT nested inside a skip container. Rather than a full HTML parse, we
// build a boolean "masked" array of length === html.length: masked[i] is true
// iff position i is NOT eligible for matching.
//
// Skip zones:
//   - <head>…</head>
//   - <script>…</script>
//   - <style>…</style>
//   - <svg>…</svg>  (widgets are all SVG)
//   - <pre>…</pre>, <code>…</code>
//   - <aside …>…</aside>
//   - <h1…</h1> through <h6…</h6>
//   - <div class="widget" …>…</div>  (with balanced-div scanning)
//   - <a …>…</a>  (already-linked text)
//   - KaTeX math spans: $…$, $$…$$, \(…\), \[…\]
//   - HTML tag interiors (angle-bracket contents) are always skipped since
//     we only match inside <p> text (see below).
//
// We ALSO pre-compute, for each offset, which <section id="…"> it lives
// under — so we can emit reports keyed by section.

function maskRegion(mask, start, end) {
  for (let i = start; i < end && i < mask.length; i++) mask[i] = true;
}

function buildSkipMask(html) {
  // `mask`:          "match-ineligible" — used to veto candidate matches.
  //                  Includes container interiors, tag innards, math spans.
  // `containerMask`: "container interior" — used to decide whether a <p>
  //                  opener sits inside a skip container. Does NOT include
  //                  arbitrary tags (so that a <p class="…"> opener is NOT
  //                  itself considered masked just because it is an HTML tag).
  const mask = new Uint8Array(html.length);
  const containerMask = new Uint8Array(html.length);

  // Everything before <body> is outside our interest — mark it all.
  const bodyM = html.match(/<body\b[^>]*>/i);
  if (bodyM) {
    maskRegion(mask, 0, bodyM.index + bodyM[0].length);
    maskRegion(containerMask, 0, bodyM.index + bodyM[0].length);
  }

  // Simple "balanced-by-name" scanner for tags with plain bodies. We just
  // walk open/close pairs by name. For nested same-name tags we count depth.
  function maskBalanced(tagName) {
    const openRe = new RegExp(`<${tagName}\\b[^>]*?>`, 'gi');
    const closeRe = new RegExp(`</${tagName}\\s*>`, 'gi');
    // Walk through both openers and closers interleaved.
    const opens = [];
    let m;
    while ((m = openRe.exec(html))) opens.push(m.index + m[0].length);
    const closes = [];
    while ((m = closeRe.exec(html))) closes.push(m.index);
    // Pair them simply: every open consumes the next close that's > it.
    // This is correct for balanced HTML (which our pages are — they come
    // from templates and pass smoke tests).
    const stack = [];
    const events = [];
    for (const o of opens) events.push({ at: o, kind: 'open' });
    for (const c of closes) events.push({ at: c, kind: 'close' });
    events.sort((a, b) => a.at - b.at);
    // We store the outermost open position on the stack when depth goes
    // 0→1, so that nested same-name tags mask the full outer range.
    const outerStack = [];
    let depth = 0;
    for (const ev of events) {
      if (ev.kind === 'open') {
        if (depth === 0) outerStack.push(ev.at);
        depth++;
      } else {
        depth--;
        if (depth === 0) {
          const start = outerStack.pop();
          if (start !== undefined) {
            maskRegion(mask, start, ev.at);
            maskRegion(containerMask, start, ev.at);
          }
        }
        if (depth < 0) depth = 0; // defensive
      }
    }
  }

  for (const t of ['script', 'style', 'head', 'svg', 'pre', 'code', 'aside']) {
    maskBalanced(t);
  }
  for (let i = 1; i <= 6; i++) maskBalanced('h' + i);

  // <a …>…</a> (but we want to skip only the INTERIOR text, not the opening
  // tag itself — offsets inside the tag are already tag-interior and not
  // matched anyway). Same balanced treatment.
  maskBalanced('a');

  // <div class="widget"> — only widgets, not every div. We find the opening
  // match and then balance-scan divs from there.
  {
    const widgetOpenRe = /<div\b[^>]*\bclass=["'][^"']*\bwidget\b[^"']*["'][^>]*>/gi;
    let m;
    while ((m = widgetOpenRe.exec(html))) {
      const start = m.index;
      // scan forward matching <div> and </div> to find the close at depth 0.
      let depth = 1;
      const divOpenRe = /<div\b[^>]*>/gi;
      const divCloseRe = /<\/div\s*>/gi;
      divOpenRe.lastIndex = m.index + m[0].length;
      divCloseRe.lastIndex = m.index + m[0].length;
      let end = html.length;
      while (depth > 0) {
        divOpenRe.lastIndex = Math.max(divOpenRe.lastIndex, divCloseRe.lastIndex - 1);
        const o = divOpenRe.exec(html);
        const c = divCloseRe.exec(html);
        if (!c) break;
        if (o && o.index < c.index) {
          depth++;
          divCloseRe.lastIndex = o.index + o[0].length;
        } else {
          depth--;
          if (depth === 0) {
            end = c.index + c[0].length;
            break;
          }
          divOpenRe.lastIndex = c.index + c[0].length;
        }
      }
      maskRegion(mask, start, end);
      maskRegion(containerMask, start, end);
    }
  }

  // KaTeX math spans. Greedy for $$…$$ then $…$ then \(…\) then \[…\].
  function escapedAt(s, i) {
    let n = 0;
    for (let j = i - 1; j >= 0 && s[j] === '\\'; j--) n++;
    return n % 2 === 1;
  }
  // $$…$$
  {
    let i = 0;
    while (i < html.length - 1) {
      if (html[i] === '$' && html[i + 1] === '$' && !escapedAt(html, i)) {
        const start = i;
        let j = i + 2;
        while (j < html.length - 1) {
          if (html[j] === '$' && html[j + 1] === '$' && !escapedAt(html, j)) {
            maskRegion(mask, start, j + 2);
            i = j + 2;
            break;
          }
          j++;
        }
        if (j >= html.length - 1) break;
      } else {
        i++;
      }
    }
  }
  // $…$ (single-dollar) — but masking is idempotent so running over already-
  // masked $$ regions is harmless.
  {
    let i = 0;
    while (i < html.length) {
      if (
        html[i] === '$' &&
        html[i + 1] !== '$' &&
        !escapedAt(html, i) &&
        !mask[i]
      ) {
        const start = i;
        let j = i + 1;
        while (j < html.length) {
          if (html[j] === '$' && html[j + 1] !== '$' && !escapedAt(html, j)) {
            maskRegion(mask, start, j + 1);
            i = j + 1;
            break;
          }
          j++;
        }
        if (j >= html.length) break;
      } else {
        i++;
      }
    }
  }
  // \(…\) and \[…\]
  for (const [openL, openR, closeL, closeR] of [
    ['\\', '(', '\\', ')'],
    ['\\', '[', '\\', ']'],
  ]) {
    let i = 0;
    while (i < html.length - 1) {
      if (html[i] === openL && html[i + 1] === openR) {
        const start = i;
        let j = i + 2;
        while (j < html.length - 1) {
          if (html[j] === closeL && html[j + 1] === closeR) {
            maskRegion(mask, start, j + 2);
            i = j + 2;
            break;
          }
          j++;
        }
        if (j >= html.length - 1) break;
      } else {
        i++;
      }
    }
  }

  // Mask every HTML tag interior (between '<' and '>') so matches cannot
  // happen inside attributes.
  {
    const tagRe = /<[^>]*>/g;
    let m;
    while ((m = tagRe.exec(html))) {
      maskRegion(mask, m.index, m.index + m[0].length);
    }
  }

  return { mask, containerMask };
}

// ─────────────────────────────────────────────────────────────────────────
// Section discovery.
//
// We want the current "section id" for any offset. A section is any
// <section id="…">…</section> block. Nested <section> is handled by stacking.

function buildSectionMap(html) {
  // Return list of { id, start, end }.
  const sections = [];
  const openRe = /<section\b([^>]*)>/gi;
  const closeRe = /<\/section\s*>/gi;
  const tokens = [];
  let m;
  while ((m = openRe.exec(html))) {
    const attrs = m[1];
    const idM = attrs.match(/\bid=["']([^"']+)["']/);
    tokens.push({ at: m.index, kind: 'open', id: idM ? idM[1] : null, endTag: m.index + m[0].length });
  }
  while ((m = closeRe.exec(html))) {
    tokens.push({ at: m.index, kind: 'close', endTag: m.index + m[0].length });
  }
  tokens.sort((a, b) => a.at - b.at);
  const stack = [];
  for (const t of tokens) {
    if (t.kind === 'open') {
      stack.push({ id: t.id, start: t.endTag });
    } else {
      const top = stack.pop();
      if (top) sections.push({ id: top.id, start: top.start, end: t.at });
    }
  }
  return sections;
}

function sectionForOffset(sections, offset) {
  // Innermost section whose range covers `offset`, preferring the one with
  // an id.
  let best = null;
  for (const s of sections) {
    if (offset >= s.start && offset < s.end) {
      if (!s.id) continue;
      if (!best || s.start > best.start) best = s;
    }
  }
  return best ? best.id : null;
}

// ─────────────────────────────────────────────────────────────────────────
// Find <p>…</p> spans in the body that are not inside a skip zone.

function findParagraphSpans(html, mask, containerMask) {
  const spans = [];
  const openRe = /<p\b[^>]*>/gi;
  let m;
  while ((m = openRe.exec(html))) {
    const innerStart = m.index + m[0].length;
    // If this <p> lives inside a skip container (widget, aside, heading,
    // script, etc.) skip it. `containerMask` marks container interiors
    // *without* touching individual tag characters, so it's safe to test
    // at the opener's start index.
    if (containerMask[m.index]) continue;
    // Find closing </p>.
    const closeRe = /<\/p\s*>/gi;
    closeRe.lastIndex = innerStart;
    const cm = closeRe.exec(html);
    if (!cm) continue;
    const innerEnd = cm.index;
    spans.push({ start: innerStart, end: innerEnd });
  }
  return spans;
}

// ─────────────────────────────────────────────────────────────────────────
// Candidate detection.
//
// For each <p> span, scan vocab (longest-first) and look for unmasked matches.
// Constraints:
//   - Skip self-links: concept's owner topic === current page topic.
//   - Skip if the page already contains any <a href> pointing to the target
//     anchor (regardless of section) — the author already linked it once,
//     further mentions are intentional.
//   - At most one candidate per (section, concept-id).

function* findCandidatesInPage(html, pageTopic) {
  const { mask, containerMask } = buildSkipMask(html);
  const sections = buildSectionMap(html);
  const pSpans = findParagraphSpans(html, mask, containerMask);

  // Collect existing link targets on the whole page so we can suppress
  // concepts already linked by hand.
  const existingLinkTargets = new Set();
  {
    const linkRe = /<a\b[^>]*\bhref=["']([^"']+)["'][^>]*>/gi;
    let m;
    while ((m = linkRe.exec(html))) {
      const href = m[1];
      // normalize: keep `<page>#<anchor>` form (strip leading ./ and any
      // query string, keep anchor).
      const cleaned = href.replace(/^\.\//, '').split('?')[0];
      existingLinkTargets.add(cleaned);
    }
  }

  // Track (section -> concept-id) dedupe.
  const emittedPerSection = new Map();

  for (const span of pSpans) {
    const body = html.slice(span.start, span.end);
    const bodyOffset = span.start;
    const sectionId = sectionForOffset(sections, bodyOffset);

    // For each concept, try one match in this paragraph. We re-scan with
    // vocab ordered longest-first, and on success mark the matched range in
    // a *local* mask so a later (shorter) vocab entry won't re-match inside.
    const localMask = new Uint8Array(body.length);

    for (const v of vocab) {
      if (v.topic === pageTopic) continue; // self-link suppression
      const targetPage = v.page;
      const anchorKey = `${targetPage}#${v.anchor}`;
      if (existingLinkTargets.has(anchorKey)) continue;

      const sectionKey = sectionId ? `${sectionId}::${v.id}` : null;
      if (sectionKey && emittedPerSection.get(sectionKey)) continue;

      // Walk the body for matches. Find first unmasked, non-skipzone match.
      let searchFrom = 0;
      let found = null;
      while (searchFrom < body.length) {
        const re = new RegExp(v.regex.source, 'i');
        const m = body.slice(searchFrom).match(re);
        if (!m) break;
        const localIdx = searchFrom + m.index;
        const globalIdx = bodyOffset + localIdx;
        const len = m[0].length;
        // Verify no character in the match range is in the global skip
        // mask nor in the local (already-wrapped) mask.
        let skip = false;
        for (let k = 0; k < len; k++) {
          if (mask[globalIdx + k] || localMask[localIdx + k]) {
            skip = true;
            break;
          }
        }
        // Extra guard: don't match immediately adjacent to a `$` (math-prose
        // neighborhood is very noisy — e.g. "$X$ is a scheme").
        if (!skip) {
          const preCh = body[localIdx - 1] || '';
          const postCh = body[localIdx + len] || '';
          if (preCh === '$' || postCh === '$') skip = true;
        }
        if (skip) {
          searchFrom = localIdx + Math.max(1, len);
          continue;
        }
        found = { localIdx, globalIdx, len, text: m[0] };
        break;
      }

      if (!found) continue;

      // Mark the matched range in localMask so shorter vocab entries don't
      // also wrap text inside the same span.
      for (let k = 0; k < found.len; k++) localMask[found.localIdx + k] = 1;

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

function applyFixToHtml(html, pageTopic) {
  // Strip first so candidate detection sees "clean" prose.
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
    const anchor = `<a href="${href}" data-auto-inline-link="1">${phrase}</a>`;
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
