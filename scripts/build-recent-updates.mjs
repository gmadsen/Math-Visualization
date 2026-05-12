#!/usr/bin/env node
// Generates `recent-updates.js` (and a sibling `.json` mirror) by inspecting
// git log on `quizzes/<slug>.json`. Quiz banks are touched only by real
// content edits — no injector script writes them — so their git timestamp is
// a faithful proxy for "last meaningful update to this topic".
//
// The browser consumes `recent-updates.js`, which exposes
//   window.MV_RECENT_UPDATES = { generated, entries: [...] };
// so the home page works under file:// (where fetch() of a local JSON file is
// blocked by browsers). The JSON sibling is for non-browser consumers.
//
// Per-entry metadata (title, color, tag) is scraped from each topic's index
// card so the home page can render compact `.ru-card` chips with the right
// section accent without a second round-trip.

import { execSync } from 'node:child_process';
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const repoRoot = resolve(dirname(__filename), '..');

// Decode the handful of HTML entities that show up in card titles/tags
// (`&amp;`, `&nbsp;`, `&lt;`, `&gt;`, `&quot;`, numeric refs). The manifest
// is consumed via `textContent`, which does NOT decode entities — without
// this pass titles like "Conformal & CR geometry" render literally as
// "Conformal &amp; CR geometry".
function decodeHtmlEntities(s) {
  return s
    .replace(/&amp;/g, '&')
    .replace(/&nbsp;/g, ' ')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x27;/gi, "'")
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(parseInt(n, 10)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)));
}

function loadCardMeta() {
  const html = readFileSync(join(repoRoot, 'index.html'), 'utf8');
  // Topic cards: <a class="card <color>" href="./<slug>.html"> ... <div class="tt">Title</div> ... <div class="tag">tag1 · tag2</div>
  // [A-Za-z0-9-]+ instead of [a-z0-9-]+ so capitalised slugs like
  // "L-functions" don't silently fall out of the manifest.
  const re = /<a\s+class="card\s+([ybgpvco])"[^>]*href="\.\/([A-Za-z0-9-]+)\.html[^"]*"[^>]*>([\s\S]*?)<\/a>/g;
  const map = new Map();
  let m;
  while ((m = re.exec(html))) {
    const color = m[1];
    const slug = m[2];
    const inner = m[3];
    const ttMatch = inner.match(/<div class="tt"[^>]*>([\s\S]*?)<\/div>/);
    const tagMatch = inner.match(/<div class="tag"[^>]*>([\s\S]*?)<\/div>/);
    const title = ttMatch
      ? decodeHtmlEntities(ttMatch[1].replace(/<span class="level[^"]*"[^>]*>[^<]*<\/span>/g, '').replace(/<[^>]*>/g, '').trim())
      : '';
    const tag = tagMatch ? decodeHtmlEntities(tagMatch[1].replace(/<[^>]*>/g, '').trim()) : '';
    if (!map.has(slug)) {
      map.set(slug, { color, tag, title });
    }
  }
  return map;
}

function lastCommitFor(file) {
  // git log -1 --format='%ad\t%s' --date=short -- <file>
  // Empty stdout (no history yet for this file) is normal — return null. A
  // non-zero git exit (corrupt repo, not a git checkout, permissions) is
  // not — log a warning so we don't quietly emit an empty manifest. Throws
  // are also surfaced for the same reason.
  try {
    const out = execSync(
      `git log -1 --format=%ad%x09%s --date=short -- "${file}"`,
      { cwd: repoRoot, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }
    ).trim();
    if (!out) return null;
    const tab = out.indexOf('\t');
    if (tab < 0) return { date: out, message: '' };
    return { date: out.slice(0, tab), message: out.slice(tab + 1) };
  } catch (err) {
    console.warn(`build-recent-updates: git log failed for ${file}: ${err.message}`);
    return null;
  }
}

function main() {
  // Up-front sanity: confirm we're inside a real git checkout. Without this,
  // tarball / release-archive consumers would silently emit an empty manifest
  // and the home page would render an empty "Recently updated" strip with
  // no clue what went wrong.
  try {
    execSync('git rev-parse --is-inside-work-tree', {
      cwd: repoRoot, stdio: ['ignore', 'ignore', 'pipe'],
    });
  } catch (err) {
    console.error(
      'build-recent-updates: not in a git checkout — cannot derive timestamps. ' +
        'Aborting. (' + err.message.split('\n')[0] + ')'
    );
    process.exit(1);
  }
  const cardMeta = loadCardMeta();
  const quizDir = join(repoRoot, 'quizzes');
  const files = readdirSync(quizDir).filter((f) => f.endsWith('.json') && f !== 'bundle.js');
  const entries = [];
  for (const f of files) {
    const slug = f.replace(/\.json$/, '');
    const meta = cardMeta.get(slug);
    if (!meta) continue; // topics without an index card are not surfaced
    const log = lastCommitFor(`quizzes/${f}`);
    if (!log) continue;
    entries.push({
      slug,
      title: meta.title,
      color: meta.color,
      tag: meta.tag,
      date: log.date,
      message: log.message,
    });
  }
  entries.sort((a, b) => {
    if (a.date !== b.date) return a.date < b.date ? 1 : -1;
    return a.title.localeCompare(b.title);
  });
  const payload = {
    generated: new Date().toISOString(),
    entries,
  };
  const json = JSON.stringify(payload, null, 2) + '\n';
  writeFileSync(join(repoRoot, 'recent-updates.json'), json);
  // Browser bundle: a top-level assignment so file:// pages can load it via
  // <script> without needing fetch().
  const js =
    '// Auto-generated by scripts/build-recent-updates.mjs. Do not edit.\n' +
    'window.MV_RECENT_UPDATES = ' +
    JSON.stringify(payload) +
    ';\n';
  writeFileSync(join(repoRoot, 'recent-updates.js'), js);
  console.log(
    `build-recent-updates: wrote recent-updates.{json,js} with ${entries.length} entries`
  );
}

main();
