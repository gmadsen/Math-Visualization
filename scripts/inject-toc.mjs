#!/usr/bin/env node
// Auto-rebuild the <nav class="toc"> block at the top of each topic page from
// the section list in content/<topic>.json. Source-of-truth invariant: every
// <section id> in the topic JSON gets exactly one nav entry, in document order,
// with the link label derived from the section's <h2>.
//
// Why: TOCs were hand-authored and drifted out of sync as sections were added,
// renamed, or reordered. As of 2026-05-02, 44 of 132 topics had TOCs that
// under-counted their actual sections; complex-analysis was the worst case
// (8 TOC entries for 26 sections). Running this injector once snaps every TOC
// to match the page; future-section-added scenarios stay in sync because
// rebuild.mjs runs this with --fix.
//
// Architecture:
//   - The leading "<a href='./index.html'>← Notebook</a>" link and the
//     <!-- breadcrumb-nav-auto-{begin,end} --> block are preserved verbatim.
//   - Everything between the breadcrumb-end fence and "</nav>" is replaced
//     with auto-generated <a href="#section_id">N&nbsp;Title</a> entries.
//   - The TOC list is fenced with <!-- toc-auto-begin --> / <!-- toc-auto-end -->
//     so re-runs are idempotent and a future audit can verify the block has
//     not been hand-edited.
//
// Section labels are derived from the section's <h2>:
//   - Read the H2 text inside the section's first raw block.
//   - Strip leading "N. " numeric prefix.
//   - Strip <em>, <strong>, etc. (preserving inner text).
//   - Strip $...$ KaTeX (collapse to bare math source — readers see this in
//     mobile fallback nav, where KaTeX may not render in the top bar context).
//   - Replace spaces with &nbsp; per existing convention.
//   - The numeric prefix is reconstructed from section index (1-based).
//
// Flags:
//   --fix       Write JSON updates and rerender HTML via test-roundtrip.
//   (no flag)   Audit mode: report which topics would change, exit 0.
//
// Exits 0 on success, 1 on structural failures (no sections, no h2, etc.).
//
// Zero deps. Pure regex.

import { existsSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  loadTopicContent,
  saveTopicContent,
} from './lib/json-block-writer.mjs';

const __filename = fileURLToPath(import.meta.url);
const repoRoot = resolve(dirname(__filename), '..');

const argv = process.argv.slice(2);
const FIX = argv.includes('--fix');

// ----- Helpers -----

// Extract a clean text label from an H2 like "1. The symmetry of roots" or
// "5. Fundamental theorem and solvability". Returns just the title portion.
function extractH2Label(rawHtml) {
  const m = rawHtml.match(/<h2[^>]*>([\s\S]+?)<\/h2>/i);
  if (!m) return null;
  let label = m[1];
  // Strip leading numeric prefix "N." or "N. " etc.
  label = label.replace(/^\s*\d+\.\s*/, '');
  // Strip simple inline tags but keep their text.
  label = label.replace(/<\/?(?:em|strong|i|b|span|code)[^>]*>/gi, '');
  // Strip KaTeX math: keep the source after stripping $...$ delimiters.
  label = label.replace(/\$\$([\s\S]+?)\$\$/g, '$1');
  label = label.replace(/\$([^$]+)\$/g, '$1');
  // Collapse whitespace.
  label = label.replace(/\s+/g, ' ').trim();
  // HTML-decode common entities so they don't double-encode.
  label = label.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&nbsp;/g, ' ');
  return label || null;
}

// Extract a heading label from an Hn tag (n = 2 for primary sections, falls
// back to H3 for appendix-style sections like "Coda"). KaTeX delimiters are
// preserved so nav.toc renders math correctly via auto-render.min.js;
// test-topic-jsdom asserts that any backslash macro in nav.toc is wrapped
// in $...$ delimiters.
function extractHeadingLabel(rawHtml, level) {
  const re = new RegExp(`<h${level}[^>]*>([\\s\\S]+?)<\/h${level}>`, 'i');
  const m = rawHtml.match(re);
  if (!m) return null;
  let label = m[1];
  label = label.replace(/^\s*\d+\.\s*/, '');
  label = label.replace(/<\/?(?:em|strong|i|b|span|code)[^>]*>/gi, '');
  // Keep $...$ delimiters intact — KaTeX auto-render handles them at page
  // load. Stripping them would leave bare LaTeX macros, which test-topic-jsdom
  // (correctly) flags as a rendering bug in the nav.
  label = label.replace(/\s+/g, ' ').trim();
  label = label
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&nbsp;/g, ' ');
  return label || null;
}

// Find a section's display label: prefer H2, fall back to H3 (e.g. "Coda"
// appendices that don't get a numeric §N. prefix).
function getSectionLabel(section) {
  for (const block of section.blocks || []) {
    if (block.type !== 'raw') continue;
    const html = block.html || '';
    if (html.includes('<h2')) {
      const label = extractHeadingLabel(html, 2);
      if (label) return { label, isAppendix: false };
    }
  }
  // No H2 found — try H3 (appendix-style sections).
  for (const block of section.blocks || []) {
    if (block.type !== 'raw') continue;
    const html = block.html || '';
    if (html.includes('<h3')) {
      const label = extractHeadingLabel(html, 3);
      if (label) return { label, isAppendix: true };
    }
  }
  return null;
}

// Build the auto-TOC entries for a list of sections.
// Returns the rendered string (one <a> per section, separated by newlines).
// Numbered sections (with H2) get §N prefix; appendix sections (H3-only) get
// no number, just a leading "·" separator visually.
function buildTocEntries(sections) {
  const entries = [];
  let n = 0;
  const errors = [];
  for (const section of sections) {
    if (!section.id) continue;
    const found = getSectionLabel(section);
    if (!found) {
      errors.push(`section #${section.id} has no <h2> or <h3> heading`);
      continue;
    }
    const { label, isAppendix } = found;
    // Re-encode the label for HTML output. We keep $...$ KaTeX intact
    // since auto-render runs on the nav at load time. Spaces -> &nbsp; per
    // existing convention; ampersands -> &amp;.
    const safeLabel = label
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
    const nbspLabel = safeLabel.replace(/ /g, '&nbsp;');
    if (isAppendix) {
      // Appendix-style entry: no number, just a "·" prefix.
      entries.push(`  <a href="#${section.id}">·&nbsp;${nbspLabel}</a>`);
    } else {
      n++;
      entries.push(`  <a href="#${section.id}">${n}&nbsp;${nbspLabel}</a>`);
    }
  }
  return { rendered: entries.join('\n'), errors };
}

// Replace the body of <nav class="toc"> with the auto-generated entries,
// preserving the leading "← Notebook" link and the breadcrumb-nav-auto block.
// The auto-generated section list is fenced with toc-auto-{begin,end} comments.
function rewriteNavToc(rawBodyPrefix, sections) {
  const navMatch = rawBodyPrefix.match(/<nav class="toc">([\s\S]*?)<\/nav>/);
  if (!navMatch) return { rawBodyPrefix, changed: false, error: 'no <nav class="toc"> found' };

  const navInner = navMatch[1];

  // Preserve the leading "← Notebook" link and the breadcrumb-nav-auto block.
  // Find where the breadcrumb-nav-auto-end is (or, failing that, where the
  // first "← Notebook" anchor ends).
  const breadcrumbEndIdx = navInner.indexOf('<!-- breadcrumb-nav-auto-end -->');
  let preserved;
  if (breadcrumbEndIdx >= 0) {
    const preservedEnd = breadcrumbEndIdx + '<!-- breadcrumb-nav-auto-end -->'.length;
    preserved = navInner.slice(0, preservedEnd);
  } else {
    // Fall back: keep through the closing </a> of the first link.
    const firstAnchorClose = navInner.indexOf('</a>');
    if (firstAnchorClose < 0) return { rawBodyPrefix, changed: false, error: 'no closing </a> for ← Notebook' };
    preserved = navInner.slice(0, firstAnchorClose + '</a>'.length);
  }

  const { rendered, errors } = buildTocEntries(sections);
  if (errors.length) return { rawBodyPrefix, changed: false, error: errors.join('; ') };

  const newNavInner =
    preserved + '\n' +
    '<!-- toc-auto-begin -->\n' +
    rendered + '\n' +
    '<!-- toc-auto-end -->\n';
  const newNav = `<nav class="toc">${newNavInner}</nav>`;

  if (newNav === navMatch[0]) return { rawBodyPrefix, changed: false };

  const newPrefix =
    rawBodyPrefix.slice(0, navMatch.index) +
    newNav +
    rawBodyPrefix.slice(navMatch.index + navMatch[0].length);
  return { rawBodyPrefix: newPrefix, changed: true };
}

// ----- Load topic list -----
const topicsPath = join(repoRoot, 'concepts', 'index.json');
if (!existsSync(topicsPath)) {
  console.error('FAIL: concepts/index.json not found.');
  process.exit(1);
}
const topics = JSON.parse(readFileSync(topicsPath, 'utf8')).topics;

// ----- Process each topic -----
let touched = 0;
let skipped = 0;
const warnings = [];
const errors = [];

for (const slug of topics) {
  const jsonPath = join(repoRoot, 'content', `${slug}.json`);
  if (!existsSync(jsonPath)) {
    warnings.push(`content JSON missing: content/${slug}.json`);
    continue;
  }
  const doc = loadTopicContent(slug, repoRoot);
  if (!Array.isArray(doc.sections) || !doc.sections.length) {
    warnings.push(`${slug}: no sections`);
    continue;
  }
  const result = rewriteNavToc(doc.rawBodyPrefix, doc.sections);
  if (result.error) {
    errors.push(`${slug}: ${result.error}`);
    continue;
  }
  if (result.changed) {
    if (FIX) {
      doc.rawBodyPrefix = result.rawBodyPrefix;
      saveTopicContent(slug, doc, repoRoot);
    }
    touched++;
  } else {
    skipped++;
  }
}

// ----- Report -----
console.log(`inject-toc: ${topics.length} topic(s) processed${FIX ? '' : ' (audit mode — pass --fix to write)'}`);
console.log(`  TOCs ${FIX ? 'rewritten' : 'that would be rewritten'}: ${touched}`);
console.log(`  TOCs already correct (no change): ${skipped}`);
if (warnings.length) {
  console.log(`  warnings (${warnings.length}):`);
  for (const w of warnings) console.log(`    - ${w}`);
}
if (errors.length) {
  console.log(`  errors (${errors.length}):`);
  for (const e of errors) console.log(`    - ${e}`);
  process.exit(1);
}

// Strict audit mode: any drift between current TOC and the auto-generated form
// is a CI failure. The whole point of this injector is to make TOC drift
// impossible, so without --fix we exit non-zero the moment a topic would need
// rewriting. Run `node scripts/rebuild.mjs` (or `node scripts/inject-toc.mjs --fix`)
// to repair, then re-run --no-fix to verify clean.
if (!FIX && touched > 0) {
  console.error(
    `FAIL: ${touched} topic(s) have hand-edited TOCs that diverge from the ` +
    `auto-generated form. Re-run with --fix (or via rebuild.mjs) to repair.`
  );
  process.exit(1);
}
process.exit(0);
