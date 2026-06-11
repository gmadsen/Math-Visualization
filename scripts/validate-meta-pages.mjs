#!/usr/bin/env node
// Validator: meta pages must stay in sync with concepts/sections.json.
//
// Motivation (PR #512): adding section 13 left index.html's hardcoded
// fallback map, the jump-to bar, and pathway/progress section maps silently
// stale — the "added a section, some page didn't notice" class. Each surface
// failed soft (uncolored header, missing jump link, 'Other' bucket), so
// nothing gated it. This script makes every known per-section surface a CI
// failure when it drifts.
//
// Checks, per section in concepts/sections.json:
//   1. sections/<slug>.html exists — and sections/ contains no orphan pages
//      whose basename matches no section (pre-rename leftovers). NOTE the
//      file naming convention is slugify(TITLE), not section id — they only
//      coincide for most sections ("Algebra & homological" has id 'algebra'
//      but lives at sections/algebra-and-homological.html). Mirrors
//      build-section-indexes.mjs.
//   2. index.html section-links footer has a ./sections/<slug>.html link.
//   3. index.html jump-to bar (.section-jump) has a #<id> link.
//   4. index.html fallback map (computeSectionMeta) carries the section's
//      exact title with the canonical id and accent letter.
//   5. index.html has a matching `.sec` header (titles HTML-encode & as &amp;).
// Plus a stale-title scan: meta pages must not use the pre-rename section
// titles ('Foundations', 'Algebra') as JS map keys or string fallbacks.
//
// Bespoke raw-byte reader by design (like inject-index-stats): the surfaces
// validated here are index.html internals the content model doesn't expose.
//
// Exit 0 clean, 1 on drift, 2 on schema/shape surprises.

import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), '..');
const issues = [];

// ----- canonical sections -----
let sections;
try {
  const raw = JSON.parse(readFileSync(join(repoRoot, 'concepts/sections.json'), 'utf8'));
  sections = raw.sections;
  if (!Array.isArray(sections) || sections.length === 0) throw new Error('empty sections array');
  for (const s of sections) {
    if (!s.id || !s.title || !s.color) throw new Error(`section missing id/title/color: ${JSON.stringify(s).slice(0, 80)}`);
  }
} catch (e) {
  console.error(`validate-meta-pages: SCHEMA DRIFT — cannot read concepts/sections.json (${e.message})`);
  process.exit(2);
}

const indexHtml = readFileSync(join(repoRoot, 'index.html'), 'utf8');
const enc = (t) => t.replace(/&/g, '&amp;');

// Section landing pages are named slugify(title), NOT <id>.html — keep this
// in lockstep with build-section-indexes.mjs § slugify (the generator).
function slugify(title) {
  return title
    .toLowerCase()
    .replace(/&amp;/g, 'and')
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// ----- 1. sections/<slug>.html present; no orphans -----
const sectionsDir = join(repoRoot, 'sections');
let onDisk;
try {
  onDisk = readdirSync(sectionsDir).filter(f => f.endsWith('.html'));
} catch (e) {
  console.error(`validate-meta-pages: SCHEMA DRIFT — cannot read sections/ directory (${e.message}); run node scripts/build-section-indexes.mjs`);
  process.exit(2);
}
const wantFiles = new Set(sections.map(s => `${slugify(s.title)}.html`));
for (const s of sections) {
  if (!existsSync(join(sectionsDir, `${slugify(s.title)}.html`))) {
    issues.push(`sections/${slugify(s.title)}.html missing (section "${s.title}")`);
  }
}
for (const f of onDisk) {
  if (!wantFiles.has(f)) {
    issues.push(`sections/${f} is an orphan — no section in sections.json slugifies to "${f.replace(/\.html$/, '')}" (pre-rename leftover?)`);
  }
}

// ----- 2. section-links footer -----
const footerMatch = indexHtml.match(/<!-- section-links-auto-begin -->([\s\S]*?)<!-- section-links-auto-end -->/);
if (!footerMatch) {
  issues.push('index.html: section-links-auto fences not found');
} else {
  for (const s of sections) {
    if (!footerMatch[1].includes(`./sections/${slugify(s.title)}.html`)) {
      issues.push(`index.html section-links footer: no link to ./sections/${slugify(s.title)}.html ("${s.title}")`);
    }
  }
}

// ----- 3. jump-to bar -----
const jumpMatch = indexHtml.match(/<nav class="section-jump"[\s\S]*?<\/nav>/);
if (!jumpMatch) {
  issues.push('index.html: <nav class="section-jump"> not found');
} else {
  for (const s of sections) {
    if (!jumpMatch[0].includes(`href="#${s.id}"`)) {
      issues.push(`index.html jump-to bar: no link to #${s.id} ("${s.title}")`);
    }
  }
}

// ----- 4. fallback map in computeSectionMeta -----
// The map is plain JS object literal: '<title>': { id: '<id>', color: '<letter>' }
// (titles contain a literal & in JS strings, not &amp;). Scope the search to
// the computeSectionMeta function body so a second section-shaped literal
// elsewhere on the page can't satisfy (or confuse) the check.
const metaFnStart = indexHtml.indexOf('function computeSectionMeta');
const metaRegion = metaFnStart === -1
  ? '' // missing function reported per-section below
  : indexHtml.slice(metaFnStart, indexHtml.indexOf('function init', metaFnStart));
for (const s of sections) {
  const re = new RegExp(
    `'${s.title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}'\\s*:\\s*\\{\\s*id:\\s*'([^']+)'\\s*,\\s*color:\\s*'([^']+)'`
  );
  const m = metaRegion.match(re);
  if (!m) {
    issues.push(`index.html fallback map: no entry for "${s.title}"`);
  } else {
    if (m[1] !== s.id) issues.push(`index.html fallback map: "${s.title}" has id '${m[1]}', sections.json says '${s.id}'`);
    if (m[2] !== s.color) issues.push(`index.html fallback map: "${s.title}" has color '${m[2]}', sections.json says '${s.color}'`);
  }
}

// ----- 5. .sec header per section -----
for (const s of sections) {
  if (!indexHtml.includes(`>${enc(s.title)}</div>`)) {
    issues.push(`index.html: no <div class="sec"> header for "${s.title}"`);
  }
}

// ----- 6. stale pre-rename titles used as code keys/fallbacks -----
// 'Foundations' → 'Logic & Foundations' and 'Algebra' → 'Algebra & homological'
// were renamed long ago; any meta page still keying logic off the old titles
// is reading dead names (progress.html carried one for 7 weeks).
const META_PAGES = [
  'index.html', 'pathway.html', 'mindmap.html', 'tours.html', 'history.html',
  'search.html', 'tags.html', 'progress.html', 'review.html', 'updates.html',
  'widgets.html', 'latex-cheatsheet.html',
];
const STALE = [
  /'(Foundations|Algebra)'\s*:/,        // object key
  /\|\|\s*'(Foundations|Algebra)'/,     // string fallback
];
for (const page of META_PAGES) {
  const p = join(repoRoot, page);
  if (!existsSync(p)) continue;
  const html = readFileSync(p, 'utf8');
  for (const re of STALE) {
    const m = html.match(re);
    if (m) {
      const line = html.slice(0, m.index).split('\n').length;
      issues.push(`${page}:${line}: stale pre-rename section title ${m[0].trim()} — use the canonical title from sections.json`);
    }
  }
}

// ----- report -----
if (issues.length) {
  console.error(`validate-meta-pages: ${issues.length} issue(s)`);
  for (const i of issues) console.error(`  [!] ${i}`);
  process.exit(1);
}
console.log(`validate-meta-pages: ok (${sections.length} sections × 5 index surfaces + ${META_PAGES.length} pages scanned for stale titles)`);
