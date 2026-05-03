#!/usr/bin/env node
// Seed / rebuild per-page <details class="changelog"> footers.
//
// For every topic HTML in repo root (excluding index.html / pathway.html):
//   1. Run  git log --follow --pretty=format:"%ad\t%s" --date=short -- <page>
//   2. Build a <details class="changelog"><summary>changelog</summary>
//      <table>...</table></details> block, newest commit first.
//   3. Ensure the .changelog CSS rule is present in the page's <style>.
//   4. If a <details class="changelog"> already exists on the page, replace its
//      contents with the freshly built block (idempotent rebuild).
//      Otherwise insert right before </body>.
//   5. Empty git history (fresh page) → single placeholder row with today's date.
//
// Re-runnable, safe to invoke after new commits land. Zero dependencies beyond git.
//
// Flags:
//   (none) | --fix   Rewrite changelog footers in place.
//   --audit          Read-only; exit 1 if any page's changelog block is stale
//                    (rebuilt block differs from the one currently on disk).
//                    Used by CI and `rebuild.mjs --no-fix`.

import { readFileSync, readdirSync, existsSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';
import { ensureCss, writeIfChanged } from './lib/html-injector.mjs';

const AUDIT = process.argv.slice(2).includes('--audit');

const __filename = fileURLToPath(import.meta.url);
const repoRoot = resolve(dirname(__filename), '..');

const SKIP = new Set(['index.html', 'pathway.html']);

// Visible rows in the top-level changelog block; the rest go behind a
// "Show full history" nested <details>. Audit feedback: 14+ rows × 131 pages
// of internal commit messages was constant dead weight.
const VISIBLE_ROWS = 5;

const CHANGELOG_CSS = `  details.changelog{
    margin:2rem 0 1rem;padding:.6rem .9rem;
    background:rgba(0,0,0,0.22);
    border-radius:6px;
    font-size:.85rem;
  }
  details.changelog summary{
    cursor:pointer;letter-spacing:.1em;text-transform:uppercase;
    font-size:.7rem;color:var(--mute,#8c9aa6);
  }
  details.changelog table{margin-top:.5rem;border-collapse:collapse;width:100%;font-size:.82rem}
  details.changelog td{padding:.2rem .6rem;border-bottom:1px dashed rgba(255,255,255,0.07);vertical-align:top}
  details.changelog td:first-child{color:var(--mute,#8c9aa6);white-space:nowrap;font-variant-numeric:tabular-nums}
  details.changelog details.changelog-rest{margin:.4rem 0 0;padding:0;background:transparent}
  details.changelog details.changelog-rest > summary{font-size:.66rem;letter-spacing:.14em;
    text-transform:uppercase;color:var(--mute,#8c9aa6);padding:.25rem 0;list-style:none}
  details.changelog details.changelog-rest > summary::-webkit-details-marker{display:none}
  details.changelog details.changelog-rest > summary::before{content:"▸ ";display:inline-block;
    transition:transform 150ms ease}
  details.changelog details.changelog-rest[open] > summary::before{transform:rotate(90deg);content:"▸ "}`;

function htmlEscape(s) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function gitLogRows(file) {
  let out = '';
  try {
    out = execSync(
      `git log --follow --pretty=format:"%ad%x09%s" --date=short -- ${JSON.stringify(file)}`,
      { cwd: repoRoot, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }
    );
  } catch {
    return [];
  }
  if (!out) return [];
  const rows = [];
  for (const line of out.split(/\r?\n/)) {
    if (!line.trim()) continue;
    const [date, ...rest] = line.split('\t');
    rows.push({ date: date.trim(), message: rest.join('\t').trim() });
  }
  return rows;
}

function todayIso() {
  const d = new Date();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${mm}-${dd}`;
}

function buildBlock(rows) {
  const visible = rows.slice(0, VISIBLE_ROWS);
  const rest = rows.slice(VISIBLE_ROWS);
  const lines = [];
  lines.push('<details class="changelog">');
  lines.push('  <summary>changelog</summary>');
  lines.push('  <table>');
  lines.push('    <tbody>');
  for (const r of visible) {
    lines.push(`      <tr><td>${htmlEscape(r.date)}</td><td>${htmlEscape(r.message)}</td></tr>`);
  }
  lines.push('    </tbody>');
  lines.push('  </table>');
  if (rest.length > 0) {
    lines.push(`  <details class="changelog-rest">`);
    lines.push(`    <summary>Show ${rest.length} earlier ${rest.length === 1 ? 'commit' : 'commits'}</summary>`);
    lines.push('    <table>');
    lines.push('      <tbody>');
    for (const r of rest) {
      lines.push(`        <tr><td>${htmlEscape(r.date)}</td><td>${htmlEscape(r.message)}</td></tr>`);
    }
    lines.push('      </tbody>');
    lines.push('    </table>');
    lines.push('  </details>');
  }
  lines.push('</details>');
  return lines.join('\n');
}

function ensureChangelogCss(html) {
  return ensureCss(html, /details\.changelog\s*\{/, CHANGELOG_CSS);
}

// Find the FIRST <details class="changelog"> block, returning [start, end)
// indices into `s`. Counts nested <details> correctly — the new buildBlock
// embeds a `<details class="changelog-rest">` inside the outer block, and a
// non-greedy regex match would stop at the inner closing tag.
//
// Both the open and close scans use word-boundary regexes (rather than bare
// substring search) so a stray `<details>` literal sitting inside an attribute
// value or JS template string can't desync the depth counter — the close
// regex requires `</details>` followed by `>` or whitespace, and the open
// regex requires `<details` to be followed by `>` or whitespace too.
function findChangelogBlock(s) {
  const startRe = /<details\s+class=["']changelog["'][^>]*>/i;
  const m = startRe.exec(s);
  if (!m) return null;
  const start = m.index;
  const openRe = /<details(?=[\s/>])/gi;
  const closeRe = /<\/details(?=[\s/>])/gi;
  let i = start + m[0].length;
  let depth = 1;
  while (i < s.length && depth > 0) {
    openRe.lastIndex = i;
    closeRe.lastIndex = i;
    const nextOpen = openRe.exec(s);
    const nextClose = closeRe.exec(s);
    if (!nextClose) return null;
    if (nextOpen && nextOpen.index < nextClose.index) {
      depth++;
      i = nextOpen.index + nextOpen[0].length;
    } else {
      depth--;
      // Advance past the literal `</details>` (closeRe matches up through
      // the `s` of `</details`, so push past the closing `>` plus any
      // trailing whitespace).
      const tagEnd = s.indexOf('>', nextClose.index);
      i = tagEnd === -1 ? s.length : tagEnd + 1;
    }
  }
  if (depth !== 0) return null;
  return { start, end: i };
}

function insertOrReplaceBlock(html, block) {
  const found = findChangelogBlock(html);
  if (found) {
    return html.slice(0, found.start) + block + html.slice(found.end);
  }
  // Insert right before </body>
  const bodyCloseRe = /<\/body>/i;
  if (!bodyCloseRe.test(html)) {
    // Append as a last resort
    return html + '\n' + block + '\n';
  }
  return html.replace(bodyCloseRe, block + '\n\n</body>');
}

// Topic pages have a content/<slug>.json source-of-truth. The changelog
// usually lives in `rawBodySuffix`, but on a handful of topics it sits inside
// the last section's trailing `raw` block — wherever extract-topic happened
// to land it. Patch whichever container holds it; otherwise no-op.
function syncJsonChangelog(slug, block) {
  const jsonPath = join(repoRoot, 'content', `${slug}.json`);
  if (!existsSync(jsonPath)) return false;
  let data;
  try {
    data = JSON.parse(readFileSync(jsonPath, 'utf8'));
  } catch {
    return false;
  }

  // 1. rawBodySuffix path — most topics + nav pages.
  if (typeof data.rawBodySuffix === 'string') {
    const found = findChangelogBlock(data.rawBodySuffix);
    if (found) {
      const next =
        data.rawBodySuffix.slice(0, found.start) + block + data.rawBodySuffix.slice(found.end);
      if (next !== data.rawBodySuffix) {
        data.rawBodySuffix = next;
        writeFileSync(jsonPath, JSON.stringify(data, null, 2));
        return true;
      }
      return false;
    }
  }

  // 2. Sections path — scan each block.html, swap in place when found.
  if (Array.isArray(data.sections)) {
    for (const section of data.sections) {
      if (!Array.isArray(section.blocks)) continue;
      for (const blk of section.blocks) {
        if (typeof blk.html !== 'string') continue;
        const found = findChangelogBlock(blk.html);
        if (!found) continue;
        const next = blk.html.slice(0, found.start) + block + blk.html.slice(found.end);
        if (next === blk.html) return false;
        blk.html = next;
        writeFileSync(jsonPath, JSON.stringify(data, null, 2));
        return true;
      }
    }
  }

  return false;
}

// Audit-mode helper: would syncJsonChangelog write anything? Mirrors the
// container-search logic without mutating disk.
function jsonChangelogIsStale(slug, block) {
  const jsonPath = join(repoRoot, 'content', `${slug}.json`);
  if (!existsSync(jsonPath)) return false;
  let data;
  try {
    data = JSON.parse(readFileSync(jsonPath, 'utf8'));
  } catch {
    return false;
  }
  if (typeof data.rawBodySuffix === 'string') {
    const found = findChangelogBlock(data.rawBodySuffix);
    if (found) {
      const next =
        data.rawBodySuffix.slice(0, found.start) + block + data.rawBodySuffix.slice(found.end);
      return next !== data.rawBodySuffix;
    }
  }
  if (Array.isArray(data.sections)) {
    for (const section of data.sections) {
      if (!Array.isArray(section.blocks)) continue;
      for (const blk of section.blocks) {
        if (typeof blk.html !== 'string') continue;
        const found = findChangelogBlock(blk.html);
        if (!found) continue;
        const next = blk.html.slice(0, found.start) + block + blk.html.slice(found.end);
        return next !== blk.html;
      }
    }
  }
  return false;
}

// ----- Main -----
const files = readdirSync(repoRoot)
  .filter((f) => f.endsWith('.html') && !SKIP.has(f))
  .sort();

let pagesTouched = 0;
let jsonsTouched = 0;
let seededRows = 0;
let placeholderPages = 0;
const stalePages = [];
const staleJsons = [];

for (const f of files) {
  const p = join(repoRoot, f);
  const before = readFileSync(p, 'utf8');
  let html = before;

  let rows = gitLogRows(f);
  if (rows.length === 0) {
    rows = [{ date: todayIso(), message: 'initial version' }];
    placeholderPages++;
  }
  seededRows += rows.length;

  const block = buildBlock(rows);
  html = ensureChangelogCss(html);
  html = insertOrReplaceBlock(html, block);

  const slug = f.replace(/\.html$/, '');
  if (html !== before) {
    if (AUDIT) stalePages.push(f);
    else if (writeIfChanged(p, before, html)) {
      pagesTouched++;
    }
  }

  if (AUDIT) {
    if (jsonChangelogIsStale(slug, block)) staleJsons.push(`content/${slug}.json`);
  } else {
    if (syncJsonChangelog(slug, block)) jsonsTouched++;
  }
}

if (AUDIT) {
  if (stalePages.length || staleJsons.length) {
    for (const f of stalePages) console.error(`  ${f}: changelog stale vs git log`);
    for (const j of staleJsons) console.error(`  ${j}: changelog stale vs git log (content JSON)`);
    console.error(
      `insert-changelog-footer: ${stalePages.length} HTML + ${staleJsons.length} JSON page(s) have stale changelog footers — re-run without --audit to refresh`
    );
    process.exit(1);
  }
  console.log(`insert-changelog-footer: ${files.length} page(s) (HTML + JSON) — all changelog footers in sync`);
  process.exit(0);
}

console.log(`insert-changelog-footer: ${files.length} page(s)`);
console.log(`  pages touched: ${pagesTouched}`);
console.log(`  content/json synced: ${jsonsTouched}`);
console.log(`  rows seeded: ${seededRows}`);
console.log(`  placeholder rows (no git history): ${placeholderPages}`);
