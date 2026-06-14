#!/usr/bin/env node
// Injector: a "Featured in guided tours" aside on each topic page that is a
// stop in one or more tours (tours.html).
//
// Tours are a sequence of deep links INTO topic pages, but the topic pages
// themselves give no hint that they sit on a curated path. This adds the
// reverse signal: a reader who lands on (say) elliptic-curves.html sees that
// it's stop on "The road to BSD" and "Sato–Tate", with links into tours.html.
//
//   - Audit mode (no flag): reads <topic>.html and verifies the aside is
//     present for every topic that is a tour stop (and absent otherwise).
//     Exits 1 on any mismatch — a CI guard so a new/edited tour stays in sync.
//   - --fix: mutates content/<topic>.json (the JSON source of truth) so
//     test-roundtrip.mjs --fix propagates to <topic>.html. The aside lives in
//     a fenced region in rawBodyPrefix (right after the hero), and the CSS is
//     injected once at the TOP of rawHead's first <style> block (ensureCssTop,
//     deliberately not the library's before-</style> ensureCss). Idempotent:
//     the fenced region is stripped and rewritten, so nothing accumulates and
//     a removed tour stop drops its aside.
//
// Source of truth for the tour↔stop mapping is tours.html itself (parsed
// here), so there is no second data file to drift. validate-tour-anchors.mjs
// already guarantees every stop link resolves.

import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadTopicContent, saveTopicContent } from './lib/json-block-writer.mjs';

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), '..');
const FIX = process.argv.includes('--fix');

const BEGIN = '<!-- tours-featured-auto-begin -->';
const END = '<!-- tours-featured-auto-end -->';

// CSS is self-contained (inline-safe color vars defined on every topic page).
const CSS = `  aside.tours-featured{margin:1.2rem 0;padding:.55rem .9rem;border:1px solid var(--line);border-left:3px solid var(--cyan);border-radius:8px;background:var(--panel);color:var(--mute);font-size:.9rem}
  aside.tours-featured .ttl{color:var(--cyan);font-weight:600;margin-right:.35rem}
  aside.tours-featured a{color:var(--cyan);text-decoration:none}
  aside.tours-featured a:hover{text-decoration:underline}`;
const CSS_SELECTOR = /aside\.tours-featured\b/;

// Insert our CSS at the TOP of the first <style> block (right after the opening
// tag), not before </style>. inject-display-prefs.mjs owns the slot immediately
// before </style> and enforces byte-exact adjacency there, so competing for it
// would desync its audit. Idempotent: no-op once our selector is present.
function ensureCssTop(doc) {
  if (typeof doc.rawHead !== 'string') throw new Error('ensureCssTop: no rawHead');
  if (CSS_SELECTOR.test(doc.rawHead)) return false;
  const m = doc.rawHead.match(/<style[^>]*>/i);
  if (!m) throw new Error('ensureCssTop: no <style> in rawHead');
  const at = m.index + m[0].length;
  doc.rawHead = doc.rawHead.slice(0, at) + '\n' + CSS + doc.rawHead.slice(at);
  return true;
}

// ---- parse tours.html → page → [{id,title}] ---------------------------------
function buildPageToTours() {
  const src = readFileSync(join(repoRoot, 'tours.html'), 'utf8');
  const secRe = /<section class="tour" id="([^"]+)"[^>]*>([\s\S]*?)<\/section>/g;
  const pageToTours = new Map();
  let m;
  while ((m = secRe.exec(src))) {
    const id = m[1];
    const body = m[2];
    const rawTitle = (body.match(/<h2>([\s\S]*?)<\/h2>/) || [])[1] || id;
    const title = rawTitle.replace(/<[^>]+>/g, '').replace(/^\d+\.\s*/, '').trim();
    const stopRe = /<span class="stop-title"><a href="\.\/([a-zA-Z0-9_-]+\.html)(?:#[a-zA-Z0-9_:.-]+)?"/g;
    const seenOnThisTour = new Set();
    let s;
    while ((s = stopRe.exec(body))) {
      const page = s[1];
      if (seenOnThisTour.has(page)) continue; // a tour visiting a page twice still lists once
      seenOnThisTour.add(page);
      if (!pageToTours.has(page)) pageToTours.set(page, []);
      pageToTours.get(page).push({ id, title });
    }
  }
  return pageToTours;
}

function asideHtml(tours) {
  const links = tours
    .map((t) => `<a href="./tours.html#${t.id}">${t.title}</a>`)
    .join(' · ');
  const n = tours.length;
  return `${BEGIN}\n<aside class="tours-featured"><span class="ttl">Featured in ${n} guided tour${n === 1 ? '' : 's'}:</span> ${links}</aside>\n${END}`;
}

// Replace any existing fenced region in rawBodyPrefix, else append after hero.
function setAside(prefix, html) {
  const stripped = prefix.replace(
    new RegExp(`\\n*${BEGIN}[\\s\\S]*?${END}\\n*`, 'g'),
    '\n',
  );
  // Append after the trailing hero/content, keeping a single blank-line gap.
  return stripped.replace(/\s*$/, '') + '\n\n' + html + '\n\n';
}

// ---- run --------------------------------------------------------------------
const pageToTours = buildPageToTours();
const issues = [];
let changed = 0;

// Every topic that has a content file. We act only on stop pages but audit all
// so a stray aside on a non-stop page is also caught.
const indexPath = join(repoRoot, 'concepts', 'index.json');
const topics = JSON.parse(readFileSync(indexPath, 'utf8')).topics || [];

for (const topic of topics) {
  const page = `${topic}.html`;
  const tours = pageToTours.get(page) || null;
  const contentPath = join(repoRoot, 'content', `${topic}.json`);
  const htmlPath = join(repoRoot, page);

  if (FIX) {
    if (!existsSync(contentPath)) {
      if (tours) issues.push(`content/${topic}.json: missing but ${page} is a tour stop`);
      continue;
    }
    const doc = loadTopicContent(topic, repoRoot);
    if (typeof doc.rawBodyPrefix !== 'string') { issues.push(`content/${topic}.json: no rawBodyPrefix`); continue; }
    const hadAside = new RegExp(BEGIN).test(doc.rawBodyPrefix);
    if (tours) {
      const before = doc.rawBodyPrefix;
      doc.rawBodyPrefix = setAside(doc.rawBodyPrefix, asideHtml(tours));
      const cssChanged = ensureCssTop(doc);
      if (doc.rawBodyPrefix !== before || cssChanged) { saveTopicContent(topic, doc, repoRoot); changed++; }
    } else if (hadAside) {
      // No longer a stop — strip the aside (leave the CSS; harmless, unused).
      doc.rawBodyPrefix = setAside(doc.rawBodyPrefix, '').replace(/\n{3,}$/, '\n\n');
      saveTopicContent(topic, doc, repoRoot);
      changed++;
    }
  } else {
    // Audit against the rendered HTML.
    if (!existsSync(htmlPath)) {
      if (tours) issues.push(`${page}: a tour stop but the page does not exist`);
      continue;
    }
    const html = readFileSync(htmlPath, 'utf8');
    const rendered = (html.match(new RegExp(`${BEGIN}[\\s\\S]*?${END}`)) || [])[0] || null;
    if (tours && !rendered) {
      issues.push(`${page}: a tour stop but no "Featured in tours" aside (run --fix)`);
    } else if (!tours && rendered) {
      issues.push(`${page}: has a "Featured in tours" aside but is not a tour stop (run --fix)`);
    } else if (tours && rendered && rendered.trim() !== asideHtml(tours).trim()) {
      // Present but STALE: the tour set/order/titles changed in tours.html
      // without regenerating. Compare content, not just presence — otherwise a
      // re-tagged stop ships a wrong reverse list past this CI guard.
      issues.push(`${page}: "Featured in tours" aside is stale — expected tours [${tours.map((t) => t.id).join(', ')}] (run --fix)`);
    }
  }
}

if (FIX) {
  console.log(`inject-featured-in-tours: ${changed} topic file(s) updated (${pageToTours.size} stop pages across ${[...new Set([...pageToTours.values()].flat().map((t) => t.id))].length} tours)`);
  if (issues.length) { for (const i of issues) console.error(`  [!] ${i}`); process.exit(1); }
} else if (issues.length) {
  console.error(`inject-featured-in-tours: ${issues.length} issue(s)`);
  for (const i of issues) console.error(`  [!] ${i}`);
  console.error('  Fix: node scripts/inject-featured-in-tours.mjs --fix && node scripts/rebuild.mjs');
  process.exit(1);
} else {
  console.log(`inject-featured-in-tours: ok (${pageToTours.size} stop pages all carry the aside)`);
}
