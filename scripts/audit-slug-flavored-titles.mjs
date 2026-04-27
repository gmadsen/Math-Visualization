#!/usr/bin/env node
// Detect slug-flavored <title> + <h1> on topic pages.
//
// new-topic.mjs auto-derives a draft title from the slug ("naive-set-theory"
// -> "Naive set theory"), and authoring agents have shipped that draft as the
// final title several times — "Algebraic de rham cohomology", "Heyting
// algebras toposes", "Grothendieck topologies sites", "Algebraic curves
// higher genus" all reached production before consistency-review caught them.
// This audit guards against regression by detecting the pattern at CI time.
//
// Heuristic: a title is slug-flavored if (a) it is 3+ words, (b) the first
// word is title-cased and every subsequent word is plain lowercase, and
// (c) it contains NO connecting words ("and", "of", "the", "in", "to",
// "with", "for", "as", "via", "by"). The sentence-cased technical-term
// pattern ("Naive set theory") slips through this filter — that's
// intentional; it's the canonical name for the topic. Multi-noun
// concatenations ("Heyting algebras toposes") trip it.
//
// Exit 0 if clean, 1 on any hits. Zero dependencies.

import { readFileSync, readdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const repoRoot = resolve(dirname(__filename), '..');

// Pages we don't audit (navigation pages, capstone story pages, special).
const SKIP = new Set([
  'index.html', 'pathway.html', 'mindmap.html', 'tags.html', 'search.html',
  'progress.html', 'review.html', 'widgets.html', 'latex-cheatsheet.html',
  'capstone-bsd-story.html', 'capstone-flt-story.html',
  'capstone-satotate-story.html',
]);

// Words that, when present, signal the title is grammatical English not a
// slug-by-substitution. Title is OK if it contains any of these.
const CONNECTING = new Set([
  'and', 'of', 'the', 'in', 'to', 'with', 'for', 'as', 'via', 'by',
  'a', 'an', 'on', 'over', 'under', 'beyond', 'into', 'from', 'between',
  '&', '—', '-',
]);

// Sentence-cased single-noun-phrase whitelist: these read fine even though
// they technically match the heuristic ("Naive set theory" is canonical).
// Keep small and curated.
const WHITELIST = new Set([
  'Naive set theory',
  'Class field theory',
  'Elementary topos theory',
  'Algebraic number theory',
  'Algebraic topology',
  'Spectral graph theory',
  'Probability theory',
  'Galois theory and constructions',
  'Spectral theory',
  'Galois theory',
  'Information theory',
  'Computability theory',
  'Complexity theory',
  'Model theory',
  'Type theory',
  'Forcing and independence',
  'Stochastic calculus',
  'Stochastic processes',
  'Real analysis',
  'Complex analysis',
  'Functional analysis',
  'Harmonic analysis',
  'Operator algebras',
  'Smooth manifolds',
  'Differential forms',
  'Differential geometry',
  'Riemannian geometry',
  'Riemann surfaces',
  'Quadratic reciprocity',
  'Quadratic forms genus theory',
  'Sums of squares',
  'Power sums Bernoulli',
  'Hecke operators',
  'Theta functions',
  'Modular forms',
  'Modular curves',
  'Projective plane',
  'Sheaf cohomology',
  'Etale cohomology',
  'Group cohomology',
  'Galois cohomology',
  'Lie groups',
  'Lie algebras',
  'Group schemes',
  'Algebraic spaces',
  'Moduli spaces',
  'Matroid theory',
  'Probabilistic method',
  'Extremal combinatorics',
  'Enumerative combinatorics',
  'Characteristic classes',
  'Morse theory',
  'Random walks and mixing',
  'Large deviations',
  'Harmonic functions',
  'Analytic number theory',
  'Partial differential equations',
  'Adèles & idèles',
  'Bézout',
  'Bezout',
  'Galois',
  'Sheaves',
  'Schemes',
  'Stacks',
  'Moonshine',
  'Waring',
  'The projective plane',
  'Model theory basics',
]);

function looksSlugFlavored(title) {
  if (!title) return false;
  if (WHITELIST.has(title)) return false;
  // Strip a trailing em-dash + subtitle if present (e.g. "Topic — subtitle").
  const m = title.match(/^([^—:-]+?)\s*[—:-]\s+/);
  const head = m ? m[1] : title;
  if (WHITELIST.has(head)) return false;

  const words = head.trim().split(/\s+/);
  if (words.length < 3) return false;
  // First word title-cased? (Capital + lowercase rest)
  if (!/^[A-Z][a-z]+$/.test(words[0])) return false;
  // Every subsequent word lowercase letters only? (no connecting tokens, no
  // punctuation, no all-caps acronyms).
  for (let i = 1; i < words.length; i++) {
    const w = words[i];
    if (CONNECTING.has(w.toLowerCase())) return false;
    if (!/^[a-z][a-z0-9]*$/.test(w)) return false;
  }
  return true;
}

const errors = [];
const files = readdirSync(repoRoot)
  .filter((f) => f.endsWith('.html') && !SKIP.has(f))
  .sort();

for (const f of files) {
  const html = readFileSync(join(repoRoot, f), 'utf8');
  const titleMatch = html.match(/<title>([^<]+)<\/title>/);
  const h1Match = html.match(/<h1>([^<]+?)(?:\s*<span class="level[^"]*">[^<]*<\/span>)?\s*<\/h1>/);

  const title = titleMatch?.[1].trim();
  const h1 = h1Match?.[1].trim();

  if (title && looksSlugFlavored(title)) {
    errors.push(`${f}: <title> looks slug-flavored: "${title}"`);
  }
  if (h1 && h1 !== title && looksSlugFlavored(h1)) {
    errors.push(`${f}: <h1> looks slug-flavored: "${h1}"`);
  }
}

if (errors.length === 0) {
  console.log(`audit-slug-flavored-titles: ${files.length} topic page(s) scanned, no slug-flavored titles found.`);
  process.exit(0);
}

console.log(`audit-slug-flavored-titles: ${errors.length} hit(s):`);
for (const e of errors) console.log(`  - ${e}`);
console.log(`FAIL: rewrite the title(s) above to a sentence-style phrase or add to the WHITELIST in this script if it's a canonical term.`);
process.exit(1);
