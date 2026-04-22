#!/usr/bin/env node
/**
 * extract-topic.mjs — phase 1 pilot of the portable data model.
 *
 * Reads ./<topic>.html from the repo root and writes content/<topic>.json, a
 * structured representation of the page that can round-trip back to the exact
 * same bytes via render-topic.mjs. See PLAN / portability plan for context.
 *
 * Usage: node scripts/extract-topic.mjs <topic-slug>
 *
 * Boundary rules (summary):
 *   - rawHead:         start of file .. end of </head> + trailing newline
 *   - rawBodyPrefix:   from there .. byte just before the FIRST top-level
 *                      <section id="..."> (hero <section class="hero"> is
 *                      inside this prefix, not a real section)
 *   - sections[i]:     bytes from <section id="X"> inclusive up to the byte
 *                      JUST BEFORE the next top-level <section id="Y"> (last
 *                      section ends just before </main>)
 *   - rawBodySuffix:   from the end of the last section to EOF
 *   - within a section, blocks are extracted by scanning for widget divs and
 *     quiz divs; every run of bytes in between becomes a `raw` block.
 *   - widget block: <div class="widget" id="X">...balanced...</div> PLUS the
 *     immediately-following <script>...</script> if only whitespace separates
 *     them. Otherwise script is null and the <script> (if any) falls into the
 *     next raw block.
 *   - quiz block:   <div class="quiz" data-concept="X"></div> (self-closing).
 *
 * Preserves bytes verbatim; no string normalization anywhere.
 */

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const repoRoot = resolve(__dirname, '..');

function findMatchingDivEnd(text, startAfterOpenTag) {
  // text[startAfterOpenTag] is the first byte AFTER the opening <div ...> tag.
  // Walk forward, counting nested <div ...> and </div>, return byte offset
  // of the byte JUST AFTER the matching </div>.
  let depth = 1;
  let i = startAfterOpenTag;
  const len = text.length;
  while (i < len && depth > 0) {
    // Search for the next <div or </div>
    const openIdx = text.indexOf('<div', i);
    const closeIdx = text.indexOf('</div>', i);
    if (closeIdx === -1) {
      throw new Error(`Unbalanced <div>: no closing </div> after byte ${i}`);
    }
    if (openIdx !== -1 && openIdx < closeIdx) {
      // Ensure it is actually a tag-open like "<div " or "<div>" (not "<divider" etc.)
      const next = text.charCodeAt(openIdx + 4);
      // 32=space, 62='>', 9=tab, 10=\n, 13=\r, 47='/'
      if (next === 32 || next === 62 || next === 9 || next === 10 || next === 13 || next === 47) {
        depth += 1;
      }
      i = openIdx + 4;
    } else {
      depth -= 1;
      i = closeIdx + 6; // length of "</div>"
      if (depth === 0) return i;
    }
  }
  throw new Error(`Failed to balance <div> starting at ${startAfterOpenTag}`);
}

function extractBlocksFromSectionBody(body, sectionId) {
  // body is a raw string containing the ENTIRE section bytes (from <section
  // id="..."> up to but not including the next section / </main>).
  //
  // Walk the body looking for widget and quiz anchors. Everything between
  // anchors becomes a raw block. A widget anchor consumes its balanced div
  // plus (optionally) an immediately-following <script>...</script>.
  const blocks = [];
  const widgetOpenRe = /<div class="widget" id="([^"]+)">/g;
  const quizOpenRe = /<div class="quiz" data-concept="([^"]+)"><\/div>/g;

  // Collect all anchor matches, then sort by position.
  const anchors = [];
  let m;
  widgetOpenRe.lastIndex = 0;
  while ((m = widgetOpenRe.exec(body)) !== null) {
    anchors.push({ type: 'widget', id: m[1], start: m.index, openEnd: m.index + m[0].length });
  }
  quizOpenRe.lastIndex = 0;
  while ((m = quizOpenRe.exec(body)) !== null) {
    anchors.push({ type: 'quiz', concept: m[1], start: m.index, end: m.index + m[0].length });
  }
  anchors.sort((a, b) => a.start - b.start);

  let cursor = 0;
  for (const a of anchors) {
    if (a.start < cursor) {
      // This happens if a widget div had a nested quiz or similar; skip the
      // anchor as it's already inside a previous block.
      continue;
    }
    // Emit any preceding raw bytes.
    if (a.start > cursor) {
      blocks.push({ type: 'raw', html: body.slice(cursor, a.start) });
    }
    if (a.type === 'widget') {
      const divEnd = findMatchingDivEnd(body, a.openEnd);
      // Look for an immediately-following <script>...</script> (only
      // whitespace between widget close and script open).
      let afterDiv = divEnd;
      let j = afterDiv;
      while (j < body.length) {
        const c = body.charCodeAt(j);
        if (c === 32 || c === 9 || c === 10 || c === 13) j += 1;
        else break;
      }
      let scriptHtml = null;
      let blockEnd = divEnd;
      if (body.startsWith('<script', j)) {
        // find matching </script>
        const sClose = body.indexOf('</script>', j);
        if (sClose !== -1) {
          const scriptEnd = sClose + '</script>'.length;
          // Include the whitespace that separated div and script as part of
          // the script slice so that render-topic.mjs can emit `widget.html
          // + widget.script` and reproduce the exact original bytes.
          scriptHtml = body.slice(divEnd, scriptEnd);
          blockEnd = scriptEnd;
        }
      }
      blocks.push({
        type: 'widget',
        id: a.id,
        html: body.slice(a.start, divEnd),
        script: scriptHtml,
      });
      cursor = blockEnd;
    } else {
      blocks.push({
        type: 'quiz',
        concept: a.concept,
        html: body.slice(a.start, a.end),
      });
      cursor = a.end;
    }
  }
  // Trailing raw block.
  if (cursor < body.length) {
    blocks.push({ type: 'raw', html: body.slice(cursor) });
  }
  return blocks;
}

function extract(topicSlug) {
  const srcPath = resolve(repoRoot, `${topicSlug}.html`);
  const text = readFileSync(srcPath, 'utf8');

  // rawHead: everything up to and including the first "</head>\n" (keep exact
  // byte after </head> — just one newline if present, else nothing).
  const headCloseIdx = text.indexOf('</head>');
  if (headCloseIdx === -1) throw new Error(`No </head> found in ${srcPath}`);
  let rawHeadEnd = headCloseIdx + '</head>'.length;
  // include the single newline following </head> if present (it is in the source)
  if (text.charCodeAt(rawHeadEnd) === 10) rawHeadEnd += 1;
  const rawHead = text.slice(0, rawHeadEnd);

  // Find first top-level <section id="..."> (line-start occurrence).
  const topSectionRe = /(^|\n)<section id="([^"]+)">/g;
  const sectionStarts = [];
  let sm;
  while ((sm = topSectionRe.exec(text)) !== null) {
    // match.index points at the preceding \n or 0. The actual "<section" starts
    // at match.index + match[1].length.
    const tagStart = sm.index + sm[1].length;
    sectionStarts.push({ tagStart, id: sm[2] });
  }
  if (sectionStarts.length === 0) {
    throw new Error('No top-level <section id="..."> found');
  }

  const firstSectionStart = sectionStarts[0].tagStart;
  const rawBodyPrefix = text.slice(rawHeadEnd, firstSectionStart);

  // The last section ends at </main> (first occurrence after the last section start).
  const lastStart = sectionStarts[sectionStarts.length - 1].tagStart;
  const mainCloseIdx = text.indexOf('</main>', lastStart);
  if (mainCloseIdx === -1) throw new Error('No </main> found after last section');

  const sections = [];
  for (let i = 0; i < sectionStarts.length; i++) {
    const { tagStart, id } = sectionStarts[i];
    const end = i + 1 < sectionStarts.length
      ? sectionStarts[i + 1].tagStart
      : mainCloseIdx;
    const body = text.slice(tagStart, end);
    const blocks = extractBlocksFromSectionBody(body, id);
    sections.push({ id, blocks });
  }

  const rawBodySuffix = text.slice(mainCloseIdx);

  return {
    topic: topicSlug,
    rawHead,
    rawBodyPrefix,
    sections,
    rawBodySuffix,
  };
}

function main() {
  const slug = process.argv[2];
  if (!slug) {
    console.error('Usage: node scripts/extract-topic.mjs <topic-slug>');
    process.exit(2);
  }
  const t0 = Date.now();
  const doc = extract(slug);
  const outDir = resolve(repoRoot, 'content');
  mkdirSync(outDir, { recursive: true });
  const outPath = resolve(outDir, `${slug}.json`);
  writeFileSync(outPath, JSON.stringify(doc, null, 2));
  const ms = Date.now() - t0;
  const widgets = doc.sections.flatMap(s => s.blocks).filter(b => b.type === 'widget').length;
  const quizzes = doc.sections.flatMap(s => s.blocks).filter(b => b.type === 'quiz').length;
  console.error(
    `extracted ${slug}: ${doc.sections.length} sections, ${widgets} widgets, ${quizzes} quizzes -> ${outPath} (${ms} ms)`
  );
}

main();
