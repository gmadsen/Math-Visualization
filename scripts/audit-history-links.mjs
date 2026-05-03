#!/usr/bin/env node
// audit-history-links.mjs
//
// Advisory audit for the cross-link map between history.html and the rest
// of the technical corpus. The history page is a hub — it links *outward*
// to topic pages by both narrative `<a href="./*.html">` and structured
// `events[].topicAnchor` fields. As topic pages get added, removed, or
// renamed, those links silently rot. This script reports:
//
//   1. **Broken anchors** — `./galois.html#solvability` where galois.html
//      doesn't have any element with `id="solvability"`.
//   2. **Dead slugs** — `./missing-page.html` where the file doesn't exist.
//   3. **Zero-inbound topics** — topic pages on disk that have no link
//      from history at all. Surfaces missed cross-link opportunities.
//
// Output: stdout summary + `audits/history-link-coverage.md`. Always
// exit 0 (advisory).

import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const REPO = resolve(__dirname, '..');

function loadHistory() {
  const html = readFileSync(join(REPO, 'history.html'), 'utf8');
  // Extract events[].topicAnchor from the inline JSON block.
  const m = html.match(/<script id="history-data" type="application\/json">([\s\S]*?)<\/script>/);
  if (!m) throw new Error('history-data JSON block not found');
  const data = JSON.parse(m[1]);
  // Extract narrative <a href="./...html..."> from history.html.
  // Skip the JSON block (we already have the structured anchors there).
  const html_no_json = html.replace(/<script id="history-data"[\s\S]*?<\/script>/, '');
  const linkRe = /href="(\.\/[^"]+\.html(?:#[^"]+)?)"/g;
  const narrativeLinks = [];
  let lm;
  while ((lm = linkRe.exec(html_no_json)) !== null) {
    narrativeLinks.push(lm[1]);
  }
  return { data, narrativeLinks };
}

function loadTopicAnchors() {
  // Map: slug → Set<id>
  const anchorsBySlug = new Map();
  const slugs = readdirSync(REPO).filter(f => f.endsWith('.html')).map(f => f.slice(0, -5));
  for (const slug of slugs) {
    try {
      const html = readFileSync(join(REPO, slug + '.html'), 'utf8');
      const ids = new Set();
      const re = /id="([^"]+)"/g;
      let m;
      while ((m = re.exec(html)) !== null) ids.add(m[1]);
      anchorsBySlug.set(slug, ids);
    } catch {
      // skip read errors
    }
  }
  return anchorsBySlug;
}

function parseHref(href) {
  // "./galois.html#solvability" → { slug:"galois", anchor:"solvability" }
  const m = href.match(/^\.\/([^#]+)\.html(?:#(.+))?$/);
  if (!m) return null;
  return { slug: m[1], anchor: m[2] || null };
}

function main() {
  const { data, narrativeLinks } = loadHistory();
  const anchors = loadTopicAnchors();

  // Aggregate every outbound link: from narrative + topicAnchor.
  const allLinks = [];
  for (const href of narrativeLinks) {
    const p = parseHref(href);
    if (p) allLinks.push({ href, source: 'narrative', ...p });
  }
  for (const ev of data.events || []) {
    if (ev.topicAnchor && typeof ev.topicAnchor === 'string') {
      const p = parseHref(ev.topicAnchor);
      if (p) allLinks.push({ href: ev.topicAnchor, source: `event:${ev.title}`, ...p });
    }
  }

  // 1. Dead slugs.
  const deadSlugs = [];
  // 2. Broken anchors.
  const brokenAnchors = [];
  for (const link of allLinks) {
    if (!anchors.has(link.slug)) {
      deadSlugs.push(link);
      continue;
    }
    if (link.anchor && !anchors.get(link.slug).has(link.anchor)) {
      brokenAnchors.push(link);
    }
  }

  // 3. Zero-inbound topics. "Topic-like" = exists on disk, not history.html
  // itself, not non-topic pages we know about.
  const NON_TOPIC = new Set([
    'history', 'pathway', 'mindmap', 'tours', 'index', 'tags', 'search',
    'progress', 'review', 'widgets', 'foundations',
    'capstone-bsd-story', 'capstone-flt-story', 'capstone-satotate-story',
    'capstone-flt-modularity-story', 'capstone-langlands-story', 'capstone-hodge-story',
    'capstone-yoneda-story', 'capstone-modularity-story',
    'latex-cheatsheet'
  ]);
  const inboundCount = new Map();
  for (const link of allLinks) {
    if (anchors.has(link.slug)) {
      inboundCount.set(link.slug, (inboundCount.get(link.slug) || 0) + 1);
    }
  }
  const zeroInbound = [];
  for (const slug of anchors.keys()) {
    if (NON_TOPIC.has(slug)) continue;
    if (slug.startsWith('capstone-')) continue;
    if (slug.startsWith('aca-')) continue;
    if (!inboundCount.has(slug)) zeroInbound.push(slug);
  }
  zeroInbound.sort();

  // ----- emit report -----
  const lines = [];
  lines.push('# History page cross-link audit');
  lines.push('');
  lines.push(`Total outbound links: **${allLinks.length}** (${narrativeLinks.length} narrative + ${allLinks.length - narrativeLinks.length} structured \`topicAnchor\`).`);
  lines.push(`Distinct topic slugs linked: **${inboundCount.size}**.`);
  lines.push(`Topic pages on disk with zero inbound from history: **${zeroInbound.length}**.`);
  lines.push('');

  lines.push('## Broken anchors');
  if (!brokenAnchors.length) lines.push('_None_');
  else {
    for (const link of brokenAnchors) {
      lines.push(`- \`${link.href}\` — \`${link.slug}.html\` exists but has no \`id="${link.anchor}"\` (source: ${link.source})`);
    }
  }
  lines.push('');

  lines.push('## Dead slugs');
  if (!deadSlugs.length) lines.push('_None_');
  else {
    for (const link of deadSlugs) {
      lines.push(`- \`${link.href}\` — \`${link.slug}.html\` does not exist (source: ${link.source})`);
    }
  }
  lines.push('');

  lines.push('## Topic pages with zero inbound from history');
  lines.push('_Cross-link opportunities. Consider adding an event or narrative link in a relevant era._');
  lines.push('');
  if (!zeroInbound.length) lines.push('_None — every topic page has at least one inbound link._');
  else {
    for (const slug of zeroInbound) lines.push(`- \`${slug}.html\``);
  }
  lines.push('');

  const report = lines.join('\n');
  const outDir = join(REPO, 'audits');
  if (!existsSync(outDir)) {
    // intentionally fail loudly if audits/ doesn't exist (it always should)
    console.error('audits/ directory missing — aborting.');
    process.exit(1);
  }
  writeFileSync(join(outDir, 'history-link-coverage.md'), report + '\n');

  // ----- stdout summary -----
  const ok = brokenAnchors.length === 0 && deadSlugs.length === 0;
  console.log(`audit-history-links: ${ok ? 'OK' : 'issues'} — ${brokenAnchors.length} broken anchor(s), ${deadSlugs.length} dead slug(s), ${zeroInbound.length} zero-inbound topic(s).`);
  console.log(`Report written to audits/history-link-coverage.md`);
  // Advisory: always exit 0.
}

main();
