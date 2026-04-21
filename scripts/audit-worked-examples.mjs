#!/usr/bin/env node
// Audit: flag concept sections that lack a "worked example" block (or
// equivalent concrete calculation prose).
//
// Advisory only — never gates CI, always exits 0. Pairs with
// `audit-stale-blurbs.mjs` and `audit-inline-links.mjs` conceptually:
// prose-level quality checks that a maintainer can scan periodically to
// find pedagogy gaps.
//
// Motivation
// ──────────
// Every concept section is supposed to carry a concrete instance the reader
// can hold in their head — a "worked example". Some sections drift into
// definition-only mode: statement of a theorem, maybe a widget, no numbered
// walk-through. This script flags sections missing any concrete-computation
// signal so the maintainer can decide whether to add one.
//
// Detection rules (any ONE is enough to exempt a section)
// ──────────────────────────────────────────────────────────
//
// Strong positive signals:
//   1. Inline tag: `<strong>Example` / `<b>Example` / `<strong>Worked` /
//                  `<b>Worked` anywhere in the section body.
//   2. Heading text containing "Example" or "Worked" (case-insensitive) in
//      an <h2>/<h3>/<h4> inside the section.
//   3. A phrase matching /\bexample\b[.:]/i inside an early paragraph (the
//      first N paragraphs in the section — guards against "for example,"
//      buried in a ramble).
//   4. Presence of a widget with a `.readout` (heuristic: the widget does a
//      live computation the reader can poke — that is itself a worked
//      example, just interactive).
//
// Weak-but-countable signal (both halves required together):
//   5. Numeric values inside KaTeX math ($…$, $$…$$) — e.g. "$p = 37$" or
//      "$e(P) = 2$" — AND at least two consecutive paragraphs that each
//      contain either such a numeric math span or an inline '=' sign
//      (signalling calculation flow).
//
// A section fires if NONE of the above triggers.
//
// Output
// ──────
//   audit-worked-examples: N concepts missing worked examples / 324 total
//
//   foundations:
//     naive-set-theory/sets-functions — no example block detected
//   algebra:
//     commutative-algebra/flatness-ca — no example block detected
//   ...
//
// Groups by index.html section ("Foundations", "Algebra", …) derived via the
// same mechanism as `scripts/inject-page-metadata.mjs`. Within a section,
// entries are sorted by `<topic-slug>/<concept-id>` for stable diffs.
//
// CLI
// ────
//   node scripts/audit-worked-examples.mjs
//       Default report.
//
//   node scripts/audit-worked-examples.mjs --verbose
//       Also print the section prose length (chars, after stripping widgets
//       and KaTeX) so the maintainer can decide if the section is
//       substantial enough to deserve a worked example.
//
// Zero dependencies — regex + string checks, stock node ≥ 18.

import { readFileSync, existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const repoRoot = resolve(dirname(__filename), '..');
const conceptsDir = join(repoRoot, 'concepts');

const argv = process.argv.slice(2);
const VERBOSE = argv.includes('--verbose');

// ────────────────────────────────────────────────────────────────────────
// Load concept graph.

const indexJson = JSON.parse(
  readFileSync(join(conceptsDir, 'index.json'), 'utf8'),
);
const topics = indexJson.topics;

const topicData = new Map(); // topic-slug -> parsed JSON
for (const topic of topics) {
  const p = join(conceptsDir, `${topic}.json`);
  if (!existsSync(p)) continue;
  topicData.set(topic, JSON.parse(readFileSync(p, 'utf8')));
}

// ────────────────────────────────────────────────────────────────────────
// Derive topic -> section slug from index.html.
//
// Mirrors the mechanism in scripts/inject-page-metadata.mjs so section
// groupings match data-section attributes elsewhere in the pipeline.

function kebabSection(raw) {
  const decoded = raw.replace(/&amp;/g, '&');
  return decoded
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function decodeEntities(s) {
  return s.replace(/&amp;/g, '&');
}

const indexHtmlPath = join(repoRoot, 'index.html');
const indexHtml = existsSync(indexHtmlPath)
  ? readFileSync(indexHtmlPath, 'utf8')
  : '';

const slugSection = new Map();   // topic slug -> section kebab
const slugSectionLabel = new Map(); // topic slug -> section display label
{
  const secRe = /<div\s+class=["']sec["'][^>]*>([\s\S]*?)<\/div>/g;
  const cardRe =
    /<a\s+class=["'][^"']*\bcard\b[^"']*["']\s+href=["']\.\/([^"']+)\.html["']/g;
  const events = [];
  let m;
  while ((m = secRe.exec(indexHtml)) !== null) {
    events.push({ pos: m.index, kind: 'sec', raw: m[1].trim() });
  }
  while ((m = cardRe.exec(indexHtml)) !== null) {
    events.push({ pos: m.index, kind: 'card', slug: m[1] });
  }
  events.sort((a, b) => a.pos - b.pos);
  let currentLabel = null;
  let currentSlug = null;
  for (const ev of events) {
    if (ev.kind === 'sec') {
      currentLabel = decodeEntities(ev.raw);
      currentSlug = kebabSection(ev.raw);
    } else if (currentSlug) {
      slugSection.set(ev.slug, currentSlug);
      slugSectionLabel.set(ev.slug, currentLabel);
    }
  }
}

// ────────────────────────────────────────────────────────────────────────
// Section extraction — same anchor-boundary trick as audit-callbacks.mjs
// and audit-stale-blurbs.mjs. An `anchor` can sit on either a
// <section id="…"> or a sub-heading (<h3 id="…">) inside a section; we
// scan until the next id= on section/h2/h3/h4 or the enclosing </section>.

function escapeRe(s) {
  return s.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
}

function findSectionBody(html, anchor) {
  const idRe = new RegExp(
    `<([a-zA-Z][a-zA-Z0-9]*)([^>]*\\sid=["']${escapeRe(anchor)}["'][^>]*)>`,
    'i',
  );
  const m = idRe.exec(html);
  if (!m) return null;
  const innerStart = m.index + m[0].length;

  const nextBoundaryRe = /<(?:section|h2|h3|h4)\b[^>]*\sid=["'][^"']+["']/gi;
  nextBoundaryRe.lastIndex = innerStart;
  const nb = nextBoundaryRe.exec(html);

  const nextCloseRe = /<\/section>/gi;
  nextCloseRe.lastIndex = innerStart;
  const nc = nextCloseRe.exec(html);

  let innerEnd;
  if (nb && (!nc || nb.index < nc.index)) innerEnd = nb.index;
  else if (nc) innerEnd = nc.index;
  else innerEnd = html.length;

  return html.slice(innerStart, innerEnd);
}

// ────────────────────────────────────────────────────────────────────────
// Section analysis.

// Strip a balanced tag pair from body (conservative: non-nesting tags).
function stripTag(body, tag) {
  const re = new RegExp(`<${tag}\\b[^>]*>[\\s\\S]*?</${tag}\\s*>`, 'gi');
  return body.replace(re, ' ');
}

// Balanced <div class="widget" …>…</div> stripper.
function stripWidgets(body) {
  const openRe =
    /<div\b[^>]*\bclass=["'][^"']*\bwidget\b[^"']*["'][^>]*>/gi;
  let out = '';
  let cursor = 0;
  let m;
  while ((m = openRe.exec(body))) {
    out += body.slice(cursor, m.index);
    let depth = 1;
    const divO = /<div\b[^>]*>/gi;
    const divC = /<\/div\s*>/gi;
    divO.lastIndex = m.index + m[0].length;
    divC.lastIndex = m.index + m[0].length;
    let end = body.length;
    while (depth > 0) {
      divO.lastIndex = Math.max(divO.lastIndex, divC.lastIndex - 1);
      const o = divO.exec(body);
      const c = divC.exec(body);
      if (!c) break;
      if (o && o.index < c.index) {
        depth++;
        divC.lastIndex = o.index + o[0].length;
      } else {
        depth--;
        if (depth === 0) {
          end = c.index + c[0].length;
          break;
        }
        divO.lastIndex = c.index + c[0].length;
      }
    }
    cursor = end;
    openRe.lastIndex = end;
  }
  out += body.slice(cursor);
  return out;
}

// Return true if the section body contains at least one widget with a
// `.readout` element (either class attribute containing "readout" or an
// explicit `<div class="readout" …>` / `<span class="readout" …>`).
function sectionHasReadoutWidget(body) {
  // Fast path: any element whose class attribute mentions "readout".
  return /\bclass=["'][^"']*\breadout\b[^"']*["']/.test(body);
}

// Pull the first N paragraphs out of the section body in order. Only
// counts <p>…</p> nodes that live at the section's top level or inside
// <div class="note"> blocks (both are typical narrative containers); skips
// content inside widgets, asides, and headings.
function earlyParagraphs(body, N = 4) {
  let b = body;
  for (const t of ['script', 'style', 'svg', 'aside', 'pre', 'code']) {
    b = stripTag(b, t);
  }
  b = stripWidgets(b);
  const paras = [];
  const pRe = /<p\b[^>]*>([\s\S]*?)<\/p\s*>/gi;
  let m;
  while ((m = pRe.exec(b)) && paras.length < N) {
    paras.push(m[1]);
  }
  return paras;
}

// Same stripping as earlyParagraphs, plus KaTeX removal, then return a
// cleaned-prose string (used to compute --verbose prose length).
function prosePlainText(body) {
  let b = body;
  for (const t of ['script', 'style', 'svg', 'aside', 'pre', 'code']) {
    b = stripTag(b, t);
  }
  b = stripWidgets(b);
  b = b.replace(/\$\$[\s\S]*?\$\$/g, ' ');
  b = b.replace(/(^|[^\\])\$[^$\n]*?\$/g, '$1 ');
  b = b.replace(/\\\([\s\S]*?\\\)/g, ' ');
  b = b.replace(/\\\[[\s\S]*?\\\]/g, ' ');
  return b.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

// Main decision procedure per concept section.
function classify(body) {
  const reasons = [];

  // (1) Inline emphatic example/worked tag.
  if (/<(?:strong|b)\b[^>]*>\s*(?:Example|Worked)\b/i.test(body)) {
    reasons.push('strong-example-tag');
  }

  // (2) Heading with "example" or "worked".
  if (/<h[234]\b[^>]*>[^<]*\b(?:example|worked)\b[^<]*<\/h[234]>/i.test(body)) {
    reasons.push('example-heading');
  }

  // (3) /\bexamples?\b[.:]/ in an early paragraph. Plural "examples:" is the
  // common list-introducer ("Key examples:", "Two small examples:") and
  // should count.
  const early = earlyParagraphs(body, 4);
  for (const p of early) {
    const text = p.replace(/<[^>]+>/g, ' ');
    if (/\bexamples?\b[.:]/i.test(text)) {
      reasons.push('early-paragraph-example');
      break;
    }
  }

  // (4) Widget with readout.
  if (sectionHasReadoutWidget(body)) {
    reasons.push('widget-readout');
  }

  // (5) Weak signal: at least two "lines computing something" — a line is
  // either a <p>/<li> block with a numeric-equality math span, OR a single
  // paragraph that contains two or more such spans (multi-step arithmetic
  // inside one paragraph still reads as worked computation). Scans <p>
  // and <li> in document order since narrative prose sometimes switches
  // between them.
  {
    const blocks = [];
    {
      let b = body;
      for (const t of ['script', 'style', 'svg', 'aside', 'pre', 'code']) {
        b = stripTag(b, t);
      }
      b = stripWidgets(b);
      const blockRe = /<(p|li)\b[^>]*>([\s\S]*?)<\/\1\s*>/gi;
      let m;
      while ((m = blockRe.exec(b))) blocks.push(m[2]);
    }
    // Count numeric-equality math spans per block.
    function numericEqSpanCount(html) {
      const text = html.replace(/<[^>]+>/g, ' ');
      let n = 0;
      for (const m of text.matchAll(/\$([^$\n]{1,200})\$/g)) {
        if (/\d/.test(m[1]) && /=/.test(m[1])) n++;
      }
      for (const m of text.matchAll(/\$\$([\s\S]{1,400}?)\$\$/g)) {
        if (/\d/.test(m[1]) && /=/.test(m[1])) n++;
      }
      return n;
    }
    let totalEqSpans = 0;
    let run = 0;
    for (const blk of blocks) {
      const c = numericEqSpanCount(blk);
      totalEqSpans += c;
      if (c > 0) {
        run++;
        if (run >= 2) {
          reasons.push('consecutive-computational-paragraphs');
          break;
        }
      } else {
        run = 0;
      }
    }
    // Single paragraph with ≥2 numeric equalities is itself a worked line.
    if (!reasons.includes('consecutive-computational-paragraphs') && totalEqSpans >= 2) {
      // Require the equalities to live in blocks (already counted); if
      // we hit this branch we had numeric equalities but no two adjacent
      // computational blocks. Still count it — multi-step arithmetic
      // inside one paragraph is a worked line.
      reasons.push('multi-equality-paragraph');
    }
  }

  return { hasExample: reasons.length > 0, reasons };
}

// ────────────────────────────────────────────────────────────────────────
// Walk every concept and classify.

const flagged = []; // { topic, conceptId, sectionSlug, sectionLabel, proseLen }
let totalConcepts = 0;
let missingPage = 0;
let missingAnchor = 0;

for (const topic of topics) {
  const d = topicData.get(topic);
  if (!d) continue;
  const page = d.page || `${topic}.html`;
  const pagePath = join(repoRoot, page);
  if (!existsSync(pagePath)) {
    missingPage++;
    continue;
  }
  const html = readFileSync(pagePath, 'utf8');
  for (const c of d.concepts || []) {
    totalConcepts++;
    if (!c.anchor) continue;
    const body = findSectionBody(html, c.anchor);
    if (body === null) {
      missingAnchor++;
      continue;
    }
    const { hasExample } = classify(body);
    if (hasExample) continue;
    flagged.push({
      topic,
      conceptId: c.id,
      sectionSlug: slugSection.get(topic) || '<unsectioned>',
      sectionLabel: slugSectionLabel.get(topic) || '<unsectioned>',
      proseLen: prosePlainText(body).length,
    });
  }
}

// ────────────────────────────────────────────────────────────────────────
// Report.

console.log(
  `audit-worked-examples: ${flagged.length} concepts missing worked examples / ${totalConcepts} total`,
);
if (missingPage > 0) {
  console.log(`  (skipped ${missingPage} topic page${missingPage === 1 ? '' : 's'} — file missing)`);
}
if (missingAnchor > 0) {
  console.log(`  (skipped ${missingAnchor} concept${missingAnchor === 1 ? '' : 's'} — anchor not found on page; see smoke-test.mjs)`);
}
console.log('');

// Group by section slug, sorted in index.html section order.
const sectionOrder = [];
{
  const seen = new Set();
  for (const topic of topics) {
    const s = slugSection.get(topic);
    if (s && !seen.has(s)) {
      seen.add(s);
      sectionOrder.push(s);
    }
  }
  // Append any unsectioned bucket last, if any.
  if (flagged.some((f) => f.sectionSlug === '<unsectioned>')) {
    sectionOrder.push('<unsectioned>');
  }
}

const bySection = new Map();
for (const f of flagged) {
  if (!bySection.has(f.sectionSlug)) bySection.set(f.sectionSlug, []);
  bySection.get(f.sectionSlug).push(f);
}

for (const sec of sectionOrder) {
  const arr = bySection.get(sec);
  if (!arr || arr.length === 0) continue;
  arr.sort((a, b) =>
    (a.topic + '/' + a.conceptId).localeCompare(b.topic + '/' + b.conceptId),
  );
  console.log(`${sec}:`);
  for (const f of arr) {
    const tail = VERBOSE ? `  [prose ${f.proseLen} chars]` : '';
    console.log(
      `  ${f.topic}/${f.conceptId} — no example block detected${tail}`,
    );
  }
}

// Always exit 0 — advisory only.
process.exit(0);
