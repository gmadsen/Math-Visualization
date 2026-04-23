#!/usr/bin/env node
// Inject data-section / data-level attributes onto each topic page's <body> tag.
//
// Source of truth:
//   - `index.html` at repo root. Each `.sec` div names a section ("Number theory",
//     "Modular forms & L-functions", ...). The sibling `.grid` contains `a.card`
//     entries whose `href` points to a topic page and whose `.tt` optionally
//     contains a `<span class="level prereq|advanced|capstone">` badge.
//   - `concepts/index.json` enumerates topic slugs.
//
// For each slug in `concepts/index.json`, we:
//   1. Look up its section + level from the `index.html` map (kebab-cased
//      section, lowercase level, default `intermediate` if no badge).
//   2. Read `<slug>.html`, locate the `<body ...>` opening tag, and set
//      `data-section` / `data-level` attributes, replacing existing values if
//      present and preserving any other attributes. Idempotent.
//   3. Write back only if content changed.
//
// Flags:
//   --dry-run   Print what would change, don't write.
//
// Exits:
//   0 on success (even if some topics were skipped with warnings).
//   1 on structural failures (e.g. index.html can't be parsed, no sections).
//
// Zero dependencies. Pure regex — the markup is well-formed and hand-written.

import { readFileSync, existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { writeIfChanged } from './lib/html-injector.mjs';

const __filename = fileURLToPath(import.meta.url);
const repoRoot = resolve(dirname(__filename), '..');

const argv = process.argv.slice(2);
const DRY_RUN = argv.includes('--dry-run');

// ----- Helpers -----
function kebabSection(raw) {
  // Decode the most common HTML entity we expect in a section label: &amp;
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

// ----- Parse index.html -----
const indexPath = join(repoRoot, 'index.html');
if (!existsSync(indexPath)) {
  console.error('FAIL: index.html not found at repo root.');
  process.exit(1);
}
const indexHtml = readFileSync(indexPath, 'utf8');

// Collect all .sec divs and all a.card entries in document order, then group
// each card under the most recent preceding .sec.
const secRe = /<div\s+class=["']sec["'][^>]*>([\s\S]*?)<\/div>/g;
const cardRe = /<a\s+class=["'][^"']*\bcard\b[^"']*["']\s+href=["']\.\/([^"']+)\.html["'][\s\S]*?<div\s+class=["']tt["'][^>]*>([\s\S]*?)<\/div>/g;

const events = []; // { pos, kind, data }
let m;
while ((m = secRe.exec(indexHtml)) !== null) {
  events.push({ pos: m.index, kind: 'sec', raw: m[1].trim() });
}
while ((m = cardRe.exec(indexHtml)) !== null) {
  events.push({ pos: m.index, kind: 'card', slug: m[1], tt: m[2] });
}
events.sort((a, b) => a.pos - b.pos);

if (!events.some((e) => e.kind === 'sec')) {
  console.error('FAIL: no <div class="sec"> entries found in index.html.');
  process.exit(1);
}

// slug -> { section, level }
const slugMeta = new Map();
// section label -> section slug (for the report)
const sectionSlugMap = new Map();
let currentSection = null;

for (const ev of events) {
  if (ev.kind === 'sec') {
    currentSection = decodeEntities(ev.raw);
    if (!sectionSlugMap.has(currentSection)) {
      sectionSlugMap.set(currentSection, kebabSection(ev.raw));
    }
  } else if (ev.kind === 'card') {
    if (!currentSection) continue; // card before any .sec — shouldn't happen
    // Level: look for <span class="level <tier>">…</span> inside the .tt
    const levelM = ev.tt.match(/<span\s+class=["']level\s+(prereq|advanced|capstone)["'][^>]*>/i);
    const level = levelM ? levelM[1].toLowerCase() : 'intermediate';
    slugMeta.set(ev.slug, {
      section: sectionSlugMap.get(currentSection),
      level,
    });
  }
}

// ----- Load topic list -----
const topicsPath = join(repoRoot, 'concepts', 'index.json');
if (!existsSync(topicsPath)) {
  console.error('FAIL: concepts/index.json not found.');
  process.exit(1);
}
const topics = JSON.parse(readFileSync(topicsPath, 'utf8')).topics;

// ----- Inject attributes on each topic page -----
function setBodyAttrs(html, section, level) {
  const bodyRe = /<body\b([^>]*)>/i;
  const match = bodyRe.exec(html);
  if (!match) return { html, changed: false, error: 'no <body> tag found' };

  let attrs = match[1]; // e.g. ' data-section="foo" data-level="bar"' or ''

  // Strip any existing data-section / data-level attributes (double or single quoted).
  attrs = attrs.replace(/\s+data-section\s*=\s*"[^"]*"/gi, '');
  attrs = attrs.replace(/\s+data-section\s*=\s*'[^']*'/gi, '');
  attrs = attrs.replace(/\s+data-level\s*=\s*"[^"]*"/gi, '');
  attrs = attrs.replace(/\s+data-level\s*=\s*'[^']*'/gi, '');

  // Normalize whitespace in remaining attrs
  attrs = attrs.replace(/\s+$/, '');

  const newOpen = `<body${attrs} data-section="${section}" data-level="${level}">`;
  const newHtml = html.slice(0, match.index) + newOpen + html.slice(match.index + match[0].length);
  return { html: newHtml, changed: newHtml !== html };
}

let touched = 0;
let skipped = 0;
const missingFromIndex = [];
const warnings = [];
const byLevel = { prereq: 0, intermediate: 0, advanced: 0, capstone: 0 };

for (const slug of topics) {
  const pagePath = join(repoRoot, `${slug}.html`);
  if (!existsSync(pagePath)) {
    warnings.push(`page missing: ${slug}.html`);
    continue;
  }
  const meta = slugMeta.get(slug);
  if (!meta) {
    missingFromIndex.push(slug);
    warnings.push(`no card in index.html for slug: ${slug}`);
    continue;
  }
  byLevel[meta.level] = (byLevel[meta.level] || 0) + 1;

  const html = readFileSync(pagePath, 'utf8');
  const result = setBodyAttrs(html, meta.section, meta.level);
  if (result.error) {
    warnings.push(`${slug}.html: ${result.error}`);
    continue;
  }
  if (result.changed) {
    if (!DRY_RUN) writeIfChanged(pagePath, html, result.html);
    touched++;
  } else {
    skipped++;
  }
}

// ----- Report -----
console.log(`inject-page-metadata: ${topics.length} topic(s) processed${DRY_RUN ? ' (dry-run)' : ''}`);
console.log(`  pages touched: ${touched}`);
console.log(`  pages skipped (no change): ${skipped}`);
console.log(`  pages missing from index.html: ${missingFromIndex.length}`);
if (missingFromIndex.length) {
  for (const s of missingFromIndex) console.log(`    - ${s}`);
}
console.log(`  section slug map (${sectionSlugMap.size}):`);
for (const [label, slug] of sectionSlugMap) {
  console.log(`    ${label}  ->  ${slug}`);
}
console.log(`  level counts:`);
for (const k of Object.keys(byLevel)) {
  console.log(`    ${k}: ${byLevel[k]}`);
}
if (warnings.length) {
  console.log(`  warnings (${warnings.length}):`);
  for (const w of warnings) console.log(`    - ${w}`);
}

process.exit(0);
