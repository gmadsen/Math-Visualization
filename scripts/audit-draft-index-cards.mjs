#!/usr/bin/env node
// Audit index.html for cards still in their `new-topic.mjs` placeholder state:
//   - SVG thumb containing the literal "draft" text token, OR
//   - .desc text equal to (or containing) the placeholder "Draft — fill in
//     once the page has real content." OR similar.
//
// Catches the case where a topic was scaffolded + deep-authored but the index
// card was never refreshed (the deep-author agents are told not to touch
// index.html, so the card stays in scaffolded form unless someone explicitly
// updates it).
//
// Exits non-zero when any card still has a placeholder thumb / desc — draft
// cards shipping to the live homepage was a real user-visible regression. The
// audit shifted from advisory to gating after that.
//
// Usage:
//   node scripts/audit-draft-index-cards.mjs

import { readFileSync, existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse as parseHtml } from 'node-html-parser';

const __filename = fileURLToPath(import.meta.url);
const repoRoot = resolve(dirname(__filename), '..');
const indexPath = join(repoRoot, 'index.html');

if (!existsSync(indexPath)) {
  console.log('audit-draft-index-cards: no index.html found, skipping.');
  process.exit(0);
}

const html = readFileSync(indexPath, 'utf8');
const root = parseHtml(html);

const PLACEHOLDER_DESC_PATTERNS = [
  /^Draft\s*[—-]\s*fill in once the page has real content\.?\s*$/i,
  /^Draft\s*$/i,
  /^TODO\s*[:.]/i,
];

const cards = root.querySelectorAll('a.card');
const drafts = [];
const misplacedLevels = [];

for (const card of cards) {
  const href = card.getAttribute('href') || '';
  if (!/\.html$/i.test(href)) continue;
  const slug = href.replace(/^\.\//, '').replace(/\.html$/i, '');

  // 1) Literal "draft" text inside the thumb SVG.
  const thumbText = (card.querySelector('.thumb')?.text || '').trim();
  const svgHasDraftText = /\bdraft\b/i.test(thumbText);

  // 2) Placeholder .desc.
  const descEl = card.querySelector('.desc');
  const descText = (descEl?.text || '').trim();
  const descIsPlaceholder = PLACEHOLDER_DESC_PATTERNS.some((re) => re.test(descText));

  // 3) Placeholder TODO comment in the SVG (kept by new-topic.mjs's stub).
  const thumbHtml = card.querySelector('.thumb')?.toString() || '';
  const hasTodoComment = /<!--\s*TODO:\s*replace this placeholder thumb/i.test(thumbHtml);

  if (svgHasDraftText || descIsPlaceholder || hasTodoComment) {
    drafts.push({
      slug,
      svgHasDraftText,
      descIsPlaceholder,
      hasTodoComment,
      desc: descText.slice(0, 80),
    });
  }

  // 4) Level badge placement: `<span class="level …">prereq|advanced|capstone</span>`
  //    must live inside the `<div class="tt">`, not inside `<div class="desc">`
  //    or `<span class="tag">`. Otherwise the badge appears in the wrong
  //    visual slot (sub-topic-box instead of next to the title), which
  //    happened on cluster-algebras and slipped past every other check.
  const levelBadges = card.querySelectorAll('.level');
  for (const lvl of levelBadges) {
    const inTitle = !!lvl.closest('.tt');
    if (!inTitle) {
      const parentClass = lvl.parentNode?.getAttribute?.('class') || '(unknown)';
      misplacedLevels.push({ slug, parentClass, text: lvl.text.trim() });
    }
  }
}

if (drafts.length === 0 && misplacedLevels.length === 0) {
  console.log(
    `audit-draft-index-cards: ${cards.length} card(s) checked; all look authored.`
  );
  process.exit(0);
}

if (drafts.length > 0) {
  console.log(
    `audit-draft-index-cards: ${drafts.length} card(s) still in placeholder state ` +
    `(out of ${cards.length} total):\n`
  );
  for (const d of drafts) {
    const flags = [
      d.svgHasDraftText ? 'svg-draft-text' : null,
      d.descIsPlaceholder ? 'placeholder-desc' : null,
      d.hasTodoComment ? 'todo-comment' : null,
    ].filter(Boolean).join(', ');
    console.log(`  ${d.slug.padEnd(40)} [${flags}]`);
    if (d.desc) console.log(`    desc: "${d.desc}${d.desc.length === 80 ? '…' : ''}"`);
  }
  console.log('\nFix: replace each draft card\'s .desc with a 1-2 sentence summary');
  console.log('     of the topic, replace the .tag content with a short bullet list of');
  console.log('     key concepts, and swap the placeholder rect SVG for a motif evocative');
  console.log('     of the topic. See an existing finished card (e.g. category-theory)');
  console.log('     for the template.');
}

if (misplacedLevels.length > 0) {
  if (drafts.length > 0) console.log('');
  console.log(
    `audit-draft-index-cards: ${misplacedLevels.length} level badge(s) placed outside .tt ` +
    `(should sit next to the title, not inside .desc / .tag):\n`
  );
  for (const m of misplacedLevels) {
    console.log(`  ${m.slug.padEnd(40)} <span class="level …">${m.text}</span> nested inside .${m.parentClass}`);
  }
  console.log('\nFix: move the level badge into the .tt block, e.g.');
  console.log('     <div class="tt">Topic title <span class="level advanced">advanced</span></div>');
}

process.exit(1);
