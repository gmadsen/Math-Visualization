#!/usr/bin/env node
// Audit notation / terminology consistency across topics.
//
// House style (implicit across AGENTS.md + category-theory.html): KaTeX
// markup should be notationally consistent across topic pages. Mixing
// `\mathbb{Z}` on one page and `\Z` on another, or `\rightarrow` next to
// `\longrightarrow` next to `\to` for the same arrow role, makes the
// notebook feel stitched together. This script flags such splits.
//
// Scope: every topic HTML file (repo root *.html except index/pathway),
// plus the `q` / `explain` / `choices` / `items` / `hint` fields of each
// quiz bank (`quizzes/*.json`) and the `blurb` fields of each concept
// graph (`concepts/<topic>.json`).
//
// Two kinds of finding:
//
//   1. NOTATION PAIR SPLITS — for each pair of synonymous notations,
//      compute the total count of each variant across the corpus. If both
//      variants have a nonzero count, report the distribution and the top 5
//      files using each variant.
//
//   2. MACRO CANDIDATES — any `\operatorname{Foo}` string that appears
//      >= 5 times across >= 3 distinct topic slugs is flagged as a macro
//      candidate (consider defining `\Foo` in a KaTeX `macros` loader block).
//
//   3. UNUSED USER MACROS — read `validate-katex.mjs`'s `USER_MACROS` set;
//      if non-empty, any declared macro that never appears in the corpus
//      is reported.
//
// CLI:
//   node scripts/audit-notation.mjs             # summary report
//   node scripts/audit-notation.mjs --verbose   # per-file counts for each variant
//
// Always exits 0 — advisory audit, never a CI gate.
//
// Zero external dependencies.

import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadContentModel } from './lib/content-model.mjs';

const __filename = fileURLToPath(import.meta.url);
const repoRoot = resolve(dirname(__filename), '..');

const argv = process.argv.slice(2);
const VERBOSE = argv.includes('--verbose');

const model = await loadContentModel();

// ─────────────────────────────────────────────────────────────────────────
// Notation pairs. Each entry is a group of synonymous variants; we report
// when more than one variant has a nonzero count.
//
// `name` is the human-readable label in the report header.
// `variants` is an array of { label, re } — `re` MUST be a global-flag regex
// that matches exactly one "use" per match. When authoring, be paranoid:
//   - `\Z` must not eat `\Zeta` → use a non-letter / non-brace lookahead.
//   - `\to` must not eat `\top` → lookahead on `[A-Za-z]`.
//   - `\text{...}` and `\mathrm{...}` we count as opening occurrences, not
//     total characters.

const PAIRS = [
  {
    name: 'Integers (\\Z vs \\mathbb{Z})',
    variants: [
      { label: '\\Z',         re: /\\Z(?![A-Za-z])/g },
      { label: '\\mathbb{Z}', re: /\\mathbb\{Z\}/g },
    ],
  },
  {
    name: 'Rationals (\\Q vs \\mathbb{Q})',
    variants: [
      { label: '\\Q',         re: /\\Q(?![A-Za-z])/g },
      { label: '\\mathbb{Q}', re: /\\mathbb\{Q\}/g },
    ],
  },
  {
    name: 'Reals (\\R vs \\mathbb{R})',
    variants: [
      { label: '\\R',         re: /\\R(?![A-Za-z])/g },
      { label: '\\mathbb{R}', re: /\\mathbb\{R\}/g },
    ],
  },
  {
    name: 'Complex (\\C vs \\mathbb{C})',
    variants: [
      { label: '\\C',         re: /\\C(?![A-Za-z])/g },
      { label: '\\mathbb{C}', re: /\\mathbb\{C\}/g },
    ],
  },
  {
    name: 'Finite field (\\F vs \\mathbb{F})',
    variants: [
      { label: '\\F',         re: /\\F(?![A-Za-z])/g },
      { label: '\\mathbb{F}', re: /\\mathbb\{F\}/g },
    ],
  },
  {
    name: 'Prime ideal (\\p vs \\mathfrak{p})',
    variants: [
      { label: '\\p',           re: /\\p(?![A-Za-z])/g },
      { label: '\\mathfrak{p}', re: /\\mathfrak\{p\}/g },
    ],
  },
  {
    name: 'Automorphism group (\\Aut vs \\operatorname{Aut})',
    variants: [
      { label: '\\Aut',              re: /\\Aut(?![A-Za-z])/g },
      { label: '\\operatorname{Aut}', re: /\\operatorname\{Aut\}/g },
    ],
  },
  {
    name: 'Endomorphism ring (\\End vs \\operatorname{End})',
    variants: [
      { label: '\\End',              re: /\\End(?![A-Za-z])/g },
      { label: '\\operatorname{End}', re: /\\operatorname\{End\}/g },
    ],
  },
  {
    name: 'Hom functor (\\Hom vs \\operatorname{Hom})',
    variants: [
      { label: '\\Hom',              re: /\\Hom(?![A-Za-z])/g },
      { label: '\\operatorname{Hom}', re: /\\operatorname\{Hom\}/g },
    ],
  },
  {
    name: 'Galois group (\\Gal vs \\operatorname{Gal})',
    variants: [
      { label: '\\Gal',              re: /\\Gal(?![A-Za-z])/g },
      { label: '\\operatorname{Gal}', re: /\\operatorname\{Gal\}/g },
    ],
  },
  {
    name: 'Spec (\\Spec vs \\operatorname{Spec} vs \\mathrm{Spec})',
    variants: [
      { label: '\\Spec',                re: /\\Spec(?![A-Za-z])/g },
      { label: '\\operatorname{Spec}',  re: /\\operatorname\{Spec\}/g },
      { label: '\\mathrm{Spec}',        re: /\\mathrm\{Spec\}/g },
    ],
  },
  {
    name: 'Text-mode roman (\\text{...} vs \\mathrm{...})',
    variants: [
      { label: '\\text{...}',   re: /\\text\{/g },
      { label: '\\mathrm{...}', re: /\\mathrm\{/g },
    ],
  },
  {
    name: 'Map arrow (\\to vs \\rightarrow vs \\longrightarrow)',
    variants: [
      { label: '\\to',            re: /\\to(?![A-Za-z])/g },
      { label: '\\rightarrow',    re: /\\rightarrow(?![A-Za-z])/g },
      { label: '\\longrightarrow', re: /\\longrightarrow(?![A-Za-z])/g },
    ],
  },
  {
    name: 'Iff (\\iff vs \\Leftrightarrow)',
    variants: [
      { label: '\\iff',           re: /\\iff(?![A-Za-z])/g },
      { label: '\\Leftrightarrow', re: /\\Leftrightarrow(?![A-Za-z])/g },
    ],
  },
];

// ─────────────────────────────────────────────────────────────────────────
// Gather the text corpus.
//
// Each "source" entry is a logical file path used for reporting, paired
// with the text to scan. HTML pages scan the whole file (we don't try to
// exclude <script>/<style> — macro strings almost never appear there, and
// when they do it's still notationally visible). JSON sources scan only
// the string fields that render to the learner.

const sources = []; // { file, text }

// Topic HTMLs.
const SPECIAL = new Set(['index.html', 'pathway.html', 'progress.html']);
for (const f of readdirSync(repoRoot).sort()) {
  if (!f.endsWith('.html')) continue;
  if (SPECIAL.has(f)) continue;
  sources.push({ file: f, text: readFileSync(join(repoRoot, f), 'utf8') });
}
// Include index.html and pathway.html too — they have no KaTeX, but if
// they ever grow some we want to catch it. Scanning costs nothing.
for (const f of ['index.html', 'pathway.html']) {
  const p = join(repoRoot, f);
  if (existsSync(p)) {
    sources.push({ file: f, text: readFileSync(p, 'utf8') });
  }
}

// Quiz banks: extract q / explain / hint / choices / items strings.
// Iterate in filename-sorted order to match the legacy readdir path.
const quizTopics = [...model.quizBanks.keys()]
  .filter((t) => model.quizBanks.get(t))
  .sort();
for (const topicId of quizTopics) {
  const bankDoc = model.quizBanks.get(topicId);
  const parts = [];
  for (const bank of Object.values(bankDoc.quizzes || {})) {
    for (const tier of ['questions', 'hard', 'expert']) {
      const qs = bank[tier];
      if (!Array.isArray(qs)) continue;
      for (const q of qs) {
        if (q.q) parts.push(q.q);
        if (q.explain) parts.push(q.explain);
        if (q.hint) parts.push(q.hint);
        if (Array.isArray(q.choices)) parts.push(q.choices.join('\n'));
        if (Array.isArray(q.items))   parts.push(q.items.join('\n'));
      }
    }
  }
  if (parts.length) {
    sources.push({ file: `quizzes/${topicId}.json`, text: parts.join('\n') });
  }
}

// Concept graphs: extract blurb + title strings. Group by owning topic in
// filename-sorted order to match the legacy readdir path.
const conceptTopics = [...model.topicIds].sort();
for (const topicId of conceptTopics) {
  const topic = model.topics.get(topicId);
  if (!topic) continue;
  const parts = [];
  for (const cid of topic.conceptIds) {
    const c = model.concepts.get(cid);
    if (!c) continue;
    if (c.topic !== topicId) continue; // first-writer-wins ownership
    if (c.blurb) parts.push(c.blurb);
    if (c.title) parts.push(c.title);
  }
  if (parts.length) {
    sources.push({ file: `concepts/${topicId}.json`, text: parts.join('\n') });
  }
}

// ─────────────────────────────────────────────────────────────────────────
// Count each variant per source file.

function countMatches(text, re) {
  // Clone the regex to reset lastIndex between calls.
  const r = new RegExp(re.source, re.flags);
  return (text.match(r) || []).length;
}

// pair idx -> variant label -> { total, perFile: Map<file, count> }
const pairStats = PAIRS.map(() => new Map());

for (const { file, text } of sources) {
  PAIRS.forEach((pair, pi) => {
    const stats = pairStats[pi];
    for (const v of pair.variants) {
      const n = countMatches(text, v.re);
      if (n <= 0) continue;
      let rec = stats.get(v.label);
      if (!rec) { rec = { total: 0, perFile: new Map() }; stats.set(v.label, rec); }
      rec.total += n;
      rec.perFile.set(file, (rec.perFile.get(file) || 0) + n);
    }
  });
}

// ─────────────────────────────────────────────────────────────────────────
// Macro candidates: \operatorname{Foo} appearing >= 5 times across >= 3 topics.

const OPNAME_RE = /\\operatorname\{([A-Za-z]+)\}/g;
// name -> { total, topics: Set<topicSlug> }
const opnameStats = new Map();

function topicSlugOf(file) {
  // "foo.html" -> "foo"; "quizzes/foo.json" -> "foo"; "concepts/foo.json" -> "foo".
  let base = file.replace(/^quizzes\//, '').replace(/^concepts\//, '');
  base = base.replace(/\.html$/, '').replace(/\.json$/, '');
  return base;
}

for (const { file, text } of sources) {
  const slug = topicSlugOf(file);
  let m;
  const re = new RegExp(OPNAME_RE.source, OPNAME_RE.flags);
  while ((m = re.exec(text))) {
    const name = m[1];
    let rec = opnameStats.get(name);
    if (!rec) { rec = { total: 0, topics: new Set(), perFile: new Map() }; opnameStats.set(name, rec); }
    rec.total++;
    rec.topics.add(slug);
    rec.perFile.set(file, (rec.perFile.get(file) || 0) + 1);
  }
}

const MACRO_MIN_USES = 5;
const MACRO_MIN_TOPICS = 3;
const macroCandidates = [];
for (const [name, rec] of opnameStats) {
  if (rec.total >= MACRO_MIN_USES && rec.topics.size >= MACRO_MIN_TOPICS) {
    macroCandidates.push({ name, total: rec.total, topics: rec.topics.size, perFile: rec.perFile });
  }
}
macroCandidates.sort((a, b) => b.total - a.total || a.name.localeCompare(b.name));

// ─────────────────────────────────────────────────────────────────────────
// Unused user macros: read validate-katex.mjs, parse USER_MACROS, report any
// declared macro that never appears in the corpus.

const unusedMacros = [];
try {
  const vk = readFileSync(join(repoRoot, 'scripts', 'validate-katex.mjs'), 'utf8');
  const m = vk.match(/USER_MACROS\s*=\s*new\s+Set\(\[([\s\S]*?)\]\)/);
  if (m) {
    const body = m[1];
    const names = [];
    for (const lit of body.matchAll(/['"]([A-Za-z]+)['"]/g)) {
      names.push(lit[1]);
    }
    for (const name of names) {
      const useRe = new RegExp(`\\\\${name}(?![A-Za-z])`, 'g');
      let total = 0;
      for (const { text } of sources) total += countMatches(text, useRe);
      if (total === 0) unusedMacros.push(name);
    }
  }
} catch (_) { /* missing validate-katex.mjs — skip */ }

// ─────────────────────────────────────────────────────────────────────────
// Report.

const inconsistencies = []; // one per pair that has >1 variant nonzero
for (let i = 0; i < PAIRS.length; i++) {
  const stats = pairStats[i];
  if (stats.size < 2) continue;
  inconsistencies.push({ pair: PAIRS[i], stats });
}

console.log(
  `audit-notation: ${inconsistencies.length} inconsistenc${inconsistencies.length === 1 ? 'y' : 'ies'}, ${macroCandidates.length} macro suggestion${macroCandidates.length === 1 ? '' : 's'}`
    + (unusedMacros.length ? `, ${unusedMacros.length} unused macro${unusedMacros.length === 1 ? '' : 's'}` : ''),
);
console.log(`(scanned ${sources.length} source${sources.length === 1 ? '' : 's'})`);
console.log('');

function topFiles(perFile, k = 5) {
  return [...perFile.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, k);
}

if (inconsistencies.length > 0) {
  console.log('Inconsistencies:');
  for (const { pair, stats } of inconsistencies) {
    // Header line: each variant label with its total.
    const summary = [...stats.entries()]
      .sort((a, b) => b[1].total - a[1].total)
      .map(([label, rec]) => `${label} (${rec.total})`)
      .join(' vs ');
    console.log(`  ${pair.name}`);
    console.log(`    ${summary} — split usage`);
    for (const [label, rec] of [...stats.entries()].sort((a, b) => b[1].total - a[1].total)) {
      const top = topFiles(rec.perFile, VERBOSE ? rec.perFile.size : 5);
      const tops = top.map(([f, n]) => `${f} (${n})`).join(', ');
      console.log(`      top ${label} files: ${tops}`);
    }
  }
  console.log('');
}

if (macroCandidates.length > 0) {
  console.log('Macro suggestions:');
  for (const c of macroCandidates) {
    console.log(
      `  \\operatorname{${c.name}} used ${c.total} times across ${c.topics} topics — consider defining \\${c.name}`,
    );
    if (VERBOSE) {
      const top = topFiles(c.perFile, 5);
      console.log(`      top files: ${top.map(([f, n]) => `${f} (${n})`).join(', ')}`);
    }
  }
  console.log('');
}

if (unusedMacros.length > 0) {
  console.log('Unused user macros (declared in validate-katex.mjs but never used):');
  for (const name of unusedMacros) console.log(`  \\${name}`);
  console.log('');
}

if (inconsistencies.length === 0 && macroCandidates.length === 0 && unusedMacros.length === 0) {
  console.log('No notation inconsistencies detected.');
}

console.log('Advisory — no CI gate. Review splits; decide on a canonical variant and migrate.');
process.exit(0);
