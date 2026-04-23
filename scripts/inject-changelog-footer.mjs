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

import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';

const AUDIT = process.argv.slice(2).includes('--audit');

const __filename = fileURLToPath(import.meta.url);
const repoRoot = resolve(dirname(__filename), '..');

const SKIP = new Set(['index.html', 'pathway.html']);

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
  details.changelog td:first-child{color:var(--mute,#8c9aa6);white-space:nowrap;font-variant-numeric:tabular-nums}`;

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
  const lines = [];
  lines.push('<details class="changelog">');
  lines.push('  <summary>changelog</summary>');
  lines.push('  <table>');
  lines.push('    <tbody>');
  for (const r of rows) {
    lines.push(`      <tr><td>${htmlEscape(r.date)}</td><td>${htmlEscape(r.message)}</td></tr>`);
  }
  lines.push('    </tbody>');
  lines.push('  </table>');
  lines.push('</details>');
  return lines.join('\n');
}

function ensureChangelogCss(html) {
  if (/details\.changelog\s*\{/.test(html)) return html;
  const m = /<\/style>/i.exec(html);
  if (!m) return html;
  return html.slice(0, m.index) + CHANGELOG_CSS + '\n' + html.slice(m.index);
}

function insertOrReplaceBlock(html, block) {
  const detailsRe = /<details\s+class=["']changelog["'][\s\S]*?<\/details>/i;
  if (detailsRe.test(html)) {
    return html.replace(detailsRe, block);
  }
  // Insert right before </body>
  const bodyCloseRe = /<\/body>/i;
  if (!bodyCloseRe.test(html)) {
    // Append as a last resort
    return html + '\n' + block + '\n';
  }
  return html.replace(bodyCloseRe, block + '\n\n</body>');
}

// ----- Main -----
const files = readdirSync(repoRoot)
  .filter((f) => f.endsWith('.html') && !SKIP.has(f))
  .sort();

let pagesTouched = 0;
let seededRows = 0;
let placeholderPages = 0;
const stalePages = [];

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

  html = ensureChangelogCss(html);
  html = insertOrReplaceBlock(html, buildBlock(rows));

  if (html !== before) {
    if (AUDIT) stalePages.push(f);
    else {
      writeFileSync(p, html);
      pagesTouched++;
    }
  }
}

if (AUDIT) {
  if (stalePages.length) {
    for (const f of stalePages) console.error(`  ${f}: changelog stale vs git log`);
    console.error(
      `insert-changelog-footer: ${stalePages.length} page(s) have stale changelog footers — re-run without --audit to refresh`
    );
    process.exit(1);
  }
  console.log(`insert-changelog-footer: ${files.length} page(s) — all changelog footers in sync`);
  process.exit(0);
}

console.log(`insert-changelog-footer: ${files.length} page(s)`);
console.log(`  pages touched: ${pagesTouched}`);
console.log(`  rows seeded: ${seededRows}`);
console.log(`  placeholder rows (no git history): ${placeholderPages}`);
