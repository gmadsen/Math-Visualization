#!/usr/bin/env node
// Scaffold a new topic: HTML page + concept stub + quiz stub + index.json entry.
//
// Usage:
//   node scripts/new-topic.mjs <topic-slug> <section>
//
// Where:
//   <topic-slug> is kebab-case and becomes the filename (<slug>.html) and
//                the topic id used by MVQuiz.init, quizzes/<slug>.json, and
//                concepts/<slug>.json.
//   <section>    is one of the seven index-sections from AGENTS.md:
//                  Foundations, Algebra, Analysis, "Geometry & topology",
//                  "Number theory", "Modular forms & L-functions",
//                  "Algebraic geometry".
//
// Produces:
//   1. <slug>.html            — copy of category-theory.html with title, <h1>,
//                               top-nav, hero sub, sections, and MVQuiz.init
//                               reset to TODO placeholders.
//   2. concepts/<slug>.json   — stub { topic, title, page, concepts: [] }.
//   3. quizzes/<slug>.json    — stub { topic, quizzes: {} }.
//   4. concepts/index.json    — append <slug> under the matching section, in
//                               the existing formatted layout. Idempotent:
//                               bails non-zero if <slug> is already listed.
//   5. index.html             — append a draft <a class="card"> block under
//                               the matching <div class="sec"> header, in
//                               the trailing <div class="grid"> of that
//                               section. Idempotent: if a card with the same
//                               href already exists, or the section header
//                               can't be located, the scaffolder skips this
//                               step with a warning and does NOT abort the
//                               overall scaffold — the other four artifacts
//                               are still written.
//
// Refuses to overwrite any of 1–3 if present. Safely skips step 5 on
// unrecognized-section / malformed-markup; the user can hand-author the card.
//
// Zero dependencies.

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const scriptsDir = dirname(__filename);
const repoRoot = resolve(scriptsDir, '..');

// ----- Sections: canonical name -> ordered list of existing slugs it owns.
// These match the 7 groups in AGENTS.md § "Index sections" and the blank-line
// groupings inside concepts/index.json. Order within each section determines
// where a new slug lands on append.
const SECTIONS = [
  'Foundations',
  'Algebra',
  'Analysis',
  'Geometry & topology',
  'Number theory',
  'Modular forms & L-functions',
  'Algebraic geometry',
];

// Per-section default card color palette for the placeholder thumb. The
// authoring agent is free to swap to a different accent later; we just need a
// harmonious-by-default choice (see AGENTS.md § "Index sections" for the color
// hints in parentheses after each section name). Values are the one-letter
// suffix on `<a class="card X">` (y/b/g/p/v/c) and the matching CSS variable
// used inside the inline SVG.
const SECTION_PALETTE = new Map([
  ['Foundations',                  { klass: 'b', cssVar: '--blue'   }],
  ['Algebra',                      { klass: 'y', cssVar: '--yellow' }],
  ['Analysis',                     { klass: 'p', cssVar: '--pink'   }],
  ['Geometry & topology',          { klass: 'v', cssVar: '--violet' }],
  ['Number theory',                { klass: 'y', cssVar: '--yellow' }],
  ['Modular forms & L-functions',  { klass: 'c', cssVar: '--cyan'   }],
  ['Algebraic geometry',           { klass: 'g', cssVar: '--green'  }],
]);

// Accept shorthand aliases for convenience. Map them to the canonical name.
const SECTION_ALIASES = new Map([
  ['foundations', 'Foundations'],
  ['algebra', 'Algebra'],
  ['analysis', 'Analysis'],
  ['geometry', 'Geometry & topology'],
  ['geometry-topology', 'Geometry & topology'],
  ['geometry & topology', 'Geometry & topology'],
  ['number-theory', 'Number theory'],
  ['number theory', 'Number theory'],
  ['modular-forms', 'Modular forms & L-functions'],
  ['modular forms', 'Modular forms & L-functions'],
  ['modular-forms-l-functions', 'Modular forms & L-functions'],
  ['modular forms & l-functions', 'Modular forms & L-functions'],
  ['algebraic-geometry', 'Algebraic geometry'],
  ['algebraic geometry', 'Algebraic geometry'],
]);

// concepts/index.json layout: blank-line-separated groups. The first 7
// correspond to the 7 index-sections in SECTIONS above; the 8th, trailing
// group is Capstones (sato-tate, bsd, modularity-and-flt, etale-cohomology…).
// Capstones are not pickable via --section: the scaffolder places a new topic
// in one of the 7 regular sections, and if the topic is also a capstone the
// authoring agent manually migrates it to the capstones group + adds an
// entry to concepts/capstones.json.
const CAPSTONES_GROUP_INDEX = 7; // 0-based, immediately after the 7 SECTIONS

function usage() {
  console.error('usage: node scripts/new-topic.mjs <topic-slug> <section>');
  console.error('  <section> is one of:');
  for (const s of SECTIONS) console.error(`    - ${s}`);
  console.error('  (aliases like "geometry", "number-theory", "algebraic-geometry" also work)');
}

// ----- Parse args -----
const argv = process.argv.slice(2);
if (argv.length < 2) {
  usage();
  process.exit(2);
}
const slug = argv[0];
const sectionArg = argv.slice(1).join(' ');

if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)) {
  console.error(`new-topic: invalid slug "${slug}". Use kebab-case: lower-case, digits, hyphens.`);
  process.exit(2);
}

const sectionKey = sectionArg.toLowerCase();
const sectionName = SECTION_ALIASES.get(sectionKey)
  ?? (SECTIONS.includes(sectionArg) ? sectionArg : null);
if (!sectionName) {
  console.error(`new-topic: unknown section "${sectionArg}".`);
  usage();
  process.exit(2);
}

// ----- Target paths -----
const htmlPath = join(repoRoot, `${slug}.html`);
const conceptPath = join(repoRoot, 'concepts', `${slug}.json`);
const quizPath = join(repoRoot, 'quizzes', `${slug}.json`);
const indexPath = join(repoRoot, 'concepts', 'index.json');
const indexHtmlPath = join(repoRoot, 'index.html');
const templatePath = join(repoRoot, 'category-theory.html');

// ----- Preflight: refuse to overwrite -----
for (const p of [htmlPath, conceptPath, quizPath]) {
  if (existsSync(p)) {
    console.error(`new-topic: refusing to overwrite existing file: ${p}`);
    process.exit(1);
  }
}
if (!existsSync(templatePath)) {
  console.error(`new-topic: template not found at ${templatePath}`);
  process.exit(1);
}
if (!existsSync(indexPath)) {
  console.error(`new-topic: concepts/index.json not found at ${indexPath}`);
  process.exit(1);
}

// ----- Check slug not already registered -----
const indexRaw = readFileSync(indexPath, 'utf8');
const indexData = JSON.parse(indexRaw);
if (!Array.isArray(indexData.topics)) {
  console.error('new-topic: concepts/index.json is missing a "topics" array.');
  process.exit(1);
}
if (indexData.topics.includes(slug)) {
  console.error(`new-topic: slug "${slug}" is already registered in concepts/index.json.`);
  process.exit(1);
}

// ----- Derive human-friendly title from slug -----
function slugToTitle(s) {
  // my-new-topic -> My new topic
  const first = s[0].toUpperCase() + s.slice(1);
  return first.replace(/-/g, ' ');
}
const humanTitle = slugToTitle(slug);

// ----- Build HTML from template -----
let html = readFileSync(templatePath, 'utf8');

// <title>...</title>
html = html.replace(
  /<title>[^<]*<\/title>/,
  `<title>${humanTitle}</title>`
);

// <body data-section="..." ...> — set data-section so the home-page filter
// (see index.html) knows which group the page belongs to. Keep data-level alone.
html = html.replace(
  /<body\s+data-section="[^"]*"([^>]*)>/,
  `<body data-section="${sectionName}"$1>`
);

// Replace the top-nav block (keep the ← Notebook backlink; drop the per-section
// anchor list — the authoring agent adds these as sections land).
html = html.replace(
  /<nav class="toc">[\s\S]*?<\/nav>/,
  `<nav class="toc"><a href="./index.html" style="color:var(--violet);font-weight:500">← Notebook</a>
  <!-- TODO: per-section anchor links (e.g. <a href="#intro">1&nbsp;Intro</a>) -->
</nav>`
);

// Replace the hero section (first <section class="hero">).
html = html.replace(
  /<section class="hero">[\s\S]*?<\/section>/,
  `<section class="hero">
  <h1>${humanTitle}</h1>
  <p class="sub"><!-- TODO: one-sentence tagline. --></p>
</section>`
);

// Replace the content sections (everything between the hero and the closing
// </main>). We rebuild from scratch with a single TODO section — the authoring
// agent fills in numbered sections as they go.
// To locate the span, anchor on the hero close and the first </main>.
{
  const heroCloseIdx = html.indexOf('</section>', html.indexOf('<section class="hero">'));
  const mainCloseIdx = html.indexOf('</main>', heroCloseIdx);
  if (heroCloseIdx === -1 || mainCloseIdx === -1) {
    console.error('new-topic: template structure changed — could not locate hero/main bounds.');
    process.exit(1);
  }
  const before = html.slice(0, heroCloseIdx + '</section>'.length);
  const after = html.slice(mainCloseIdx);
  const stubSections = `

<section id="intro">
<h2>1. Intro</h2>
<!-- TODO: content goes here — prose, widgets, and a quiz placeholder:
     <div class="quiz" data-concept="<concept-id>"></div>
-->
</section>

`;
  html = before + stubSections + after;
}

// Reset MVQuiz.init('<topic>') to the new slug.
html = html.replace(
  /MVQuiz\.init\(\s*['"][^'"]+['"]\s*\)/,
  `MVQuiz.init('${slug}')`
);

// Reset the changelog footer to a single placeholder row. The real changelog
// is rebuilt from `git log --follow` by scripts/insert-changelog-footer.mjs
// once the page has commit history.
html = html.replace(
  /<details class="changelog">[\s\S]*?<\/details>/,
  `<details class="changelog">
  <summary>changelog</summary>
  <table>
    <tbody>
      <tr><td>${new Date().toISOString().slice(0, 10)}</td><td>initial version</td></tr>
    </tbody>
  </table>
</details>`
);

// ----- Concept + quiz stubs -----
const conceptStub = {
  topic: slug,
  title: humanTitle,
  page: `${slug}.html`,
  concepts: [],
};
const quizStub = {
  topic: slug,
  quizzes: {},
};

// ----- Update concepts/index.json idempotently, preserving its formatting -----
// The file is a JSON object with a "topics" array, laid out one slug per line
// with blank lines separating the 7 sections. We want to append the new slug
// at the end of the matching section. We do this via text-level insertion so
// the existing formatting (indentation, blank-line section gutters) is
// preserved exactly.
function appendToIndexJson(raw, targetSection, newSlug) {
  // Find the bounds of the topics array in the source text.
  const openIdx = raw.indexOf('"topics"');
  if (openIdx === -1) throw new Error('no "topics" key in index.json');
  const bracketIdx = raw.indexOf('[', openIdx);
  const closeIdx = raw.indexOf(']', bracketIdx);
  if (bracketIdx === -1 || closeIdx === -1) throw new Error('malformed topics array');

  const inner = raw.slice(bracketIdx + 1, closeIdx);
  // Split into "groups" on blank lines — these are the 7 sections in the
  // declared order, same as SECTIONS.
  const groups = inner.split(/\n\s*\n/); // each group keeps its leading/trailing whitespace
  // Expect 7 section groups + 1 trailing capstones group = 8.
  const EXPECTED = SECTIONS.length + 1;
  if (groups.length !== EXPECTED) {
    throw new Error(
      `concepts/index.json has ${groups.length} section group(s); expected ${EXPECTED} ` +
      `(${SECTIONS.length} sections + capstones). Has the layout drifted? ` +
      `Update new-topic.mjs alongside.`
    );
  }
  const sectionIdx = SECTIONS.indexOf(targetSection);
  if (sectionIdx === -1) throw new Error(`unknown section "${targetSection}"`);

  // Append a new line inside the target group. Each existing line in the
  // groups looks like:    `    "<slug>",`
  // (four-space indent, trailing comma). We match that style exactly.
  const group = groups[sectionIdx];

  // Strip trailing newline/whitespace off this group so we can cleanly append.
  const trailingWsMatch = group.match(/\s*$/);
  const trailing = trailingWsMatch ? trailingWsMatch[0] : '';
  const groupContent = group.slice(0, group.length - trailing.length);

  // Each existing line is `    "slug",` (indent 4, trailing comma). The
  // *last* slug in the array currently has no trailing comma — but since we
  // always insert into a non-final group or add one inside an existing group,
  // we just ensure the previous line ends with a comma before appending.
  // However: the absolute last slug in the file (last group, last line) has
  // no trailing comma. If we're appending to that last group, we need to add
  // a comma to the current last line.
  // All of the 7 section groups currently end with a trailing comma (because
  // the capstones group follows them). So we always append with a trailing
  // comma. The final capstones group is not a valid sectionIdx here.
  const updatedGroup = groupContent + `\n    "${newSlug}",` + trailing;

  groups[sectionIdx] = updatedGroup;
  const newInner = groups.join('\n\n');
  return raw.slice(0, bracketIdx + 1) + newInner + raw.slice(closeIdx);
}

let newIndexRaw;
try {
  newIndexRaw = appendToIndexJson(indexRaw, sectionName, slug);
} catch (e) {
  console.error(`new-topic: failed to update concepts/index.json: ${e.message}`);
  process.exit(1);
}

// ----- Insert a draft <a class="card"> into index.html under the target
// section. Soft-fails: on any structural surprise, logs a warning and returns
// the original text so the overall scaffold still succeeds. Idempotent: if a
// card with the same href already exists in the section, returns the text
// unchanged with an explanatory note.
//
// The section headers in index.html look like:
//
//     <div class="sec">Algebra</div>
//     <div class="grid">
//
//       <a class="card y" href="./algebra.html">
//         ...
//       </a>
//
//       ... more cards ...
//
//     </div>
//
// We locate the matching `<div class="sec">`, then the *next* `<div class="grid">`
// after it, then scan forward counting <div>/</div> depth to find the grid's
// closing `</div>`. The new card goes just before that closing tag.
//
// Returns { text, status, message } where status is one of:
//   'inserted'   — new card appended; `text` is the updated document.
//   'duplicate'  — card with this href already present; `text` === original.
//   'skipped'    — section header not found or markup unexpected; `text` === original.
function insertCardIntoIndexHtml(raw, sectionName, newSlug, title, blurb) {
  const palette = SECTION_PALETTE.get(sectionName);
  if (!palette) {
    return { text: raw, status: 'skipped',
             message: `no palette mapping for section "${sectionName}"` };
  }

  // Section headers in index.html HTML-escape '&' → '&amp;'. Build the exact
  // literal to search for.
  const sectionLabelHtml = sectionName.replace(/&/g, '&amp;');
  const secMarker = `<div class="sec">${sectionLabelHtml}</div>`;
  const secIdx = raw.indexOf(secMarker);
  if (secIdx === -1) {
    return { text: raw, status: 'skipped',
             message: `could not find <div class="sec">${sectionLabelHtml}</div> in index.html` };
  }

  // Find the next `<div class="grid">` after the section header.
  const gridOpenMarker = '<div class="grid">';
  const gridOpenIdx = raw.indexOf(gridOpenMarker, secIdx);
  if (gridOpenIdx === -1) {
    return { text: raw, status: 'skipped',
             message: `could not find <div class="grid"> after section "${sectionName}"` };
  }
  // Sanity-check the grid really belongs to this section: nothing between the
  // two other than whitespace/newlines/comments should contain another `<div class="sec">`.
  const preamble = raw.slice(secIdx + secMarker.length, gridOpenIdx);
  if (/<div class="sec">/.test(preamble)) {
    return { text: raw, status: 'skipped',
             message: `no grid immediately follows section "${sectionName}"` };
  }

  // Walk forward from gridOpenIdx counting <div>/</div> to find the matching
  // closing `</div>` of the grid container. Only raw `<div` and `</div>` tokens
  // count — SVG self-closing tags never look like `<div`. We start at depth 1
  // (the grid's opening <div> itself).
  const divRe = /<div\b|<\/div>/g;
  divRe.lastIndex = gridOpenIdx + gridOpenMarker.length;
  let depth = 1;
  let gridCloseIdx = -1;
  let m;
  while ((m = divRe.exec(raw)) !== null) {
    if (m[0] === '</div>') {
      depth--;
      if (depth === 0) {
        gridCloseIdx = m.index;
        break;
      }
    } else {
      depth++;
    }
  }
  if (gridCloseIdx === -1) {
    return { text: raw, status: 'skipped',
             message: `unbalanced <div> in grid under section "${sectionName}"` };
  }

  const gridInner = raw.slice(gridOpenIdx + gridOpenMarker.length, gridCloseIdx);

  // Idempotency: if a card with this href already exists in the grid, skip.
  if (gridInner.includes(`href="./${newSlug}.html"`)) {
    return { text: raw, status: 'duplicate',
             message: `a card with href="./${newSlug}.html" already exists under "${sectionName}"` };
  }

  // Build the new card. Match neighbor indentation: cards live at 4-space
  // indent inside the grid, with inner content at 6-space indent. Use a
  // placeholder thumb (a simple outlined rounded rectangle with the section
  // color) — the authoring agent will replace it with something evocative.
  const safeTitle = escapeHtml(title);
  const safeBlurb = escapeHtml(blurb);
  const safeSection = escapeHtml(sectionName);
  const card =
`    <a class="card ${palette.klass}" href="./${newSlug}.html">
      <div class="thumb"><svg viewBox="0 0 100 80" width="90" height="74">
        <!-- TODO: replace this placeholder thumb with a motif evocative of the topic. -->
        <rect x="18" y="18" width="64" height="44" rx="6" fill="none" stroke="var(${palette.cssVar})" stroke-width="1.4"/>
        <text x="50" y="46" text-anchor="middle" font-size="10" fill="var(${palette.cssVar})" font-style="italic" font-family="serif">draft</text>
      </svg></div>
      <div class="body">
        <div class="tt">${safeTitle}</div>
        <div class="desc">${safeBlurb}</div>
        <span class="tag">${safeSection}</span>
      </div>
    </a>
`;

  // The grid's trailing-whitespace convention is: final card's `</a>` line,
  // one blank line, then the grid's closing `  </div>` at 2-space indent. We
  // want to insert our new card *before* that trailing blank/close, preserving
  // the convention. Strip the existing trailing whitespace from gridInner, add
  // the two-blank-line separator used between cards, append our card, and put
  // back a single trailing blank line.
  const trailWsMatch = gridInner.match(/[ \t]*\n?\s*$/); // everything from last non-whitespace to end
  const trail = trailWsMatch ? trailWsMatch[0] : '';
  const body = gridInner.slice(0, gridInner.length - trail.length);

  // If `body` is empty, the grid has no cards yet — emit a leading blank line
  // to match the open-grid convention and then the card.
  let newInner;
  if (body.trim() === '') {
    newInner = '\n\n' + card + '\n  ';
  } else {
    newInner = body + '\n\n\n' + card + '\n  ';
  }

  const newRaw =
    raw.slice(0, gridOpenIdx + gridOpenMarker.length) +
    newInner +
    raw.slice(gridCloseIdx);

  return { text: newRaw, status: 'inserted',
           message: `card inserted under section "${sectionName}"` };
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// Attempt the index.html insertion. Any surprise → warn and continue; never
// abort the overall scaffold on this step.
let indexHtmlResult = { status: 'skipped', message: 'index.html not present' };
let newIndexHtmlRaw = null;
if (existsSync(indexHtmlPath)) {
  try {
    const origIndexHtml = readFileSync(indexHtmlPath, 'utf8');
    const placeholderBlurb = 'Draft — fill in once the page has real content.';
    indexHtmlResult = insertCardIntoIndexHtml(
      origIndexHtml, sectionName, slug, humanTitle, placeholderBlurb
    );
    if (indexHtmlResult.status === 'inserted') {
      newIndexHtmlRaw = indexHtmlResult.text;
    }
  } catch (e) {
    indexHtmlResult = { status: 'skipped',
                        message: `unexpected error: ${e.message}` };
  }
}

// Parse-check the result so we never leave a broken index.json behind.
try {
  const parsed = JSON.parse(newIndexRaw);
  if (!Array.isArray(parsed.topics) || !parsed.topics.includes(slug)) {
    throw new Error('post-edit index.json did not contain new slug');
  }
} catch (e) {
  console.error(`new-topic: post-edit index.json failed to parse: ${e.message}`);
  process.exit(1);
}

// ----- Write everything -----
writeFileSync(htmlPath, html);
writeFileSync(conceptPath, JSON.stringify(conceptStub, null, 2) + '\n');
writeFileSync(quizPath, JSON.stringify(quizStub, null, 2) + '\n');
writeFileSync(indexPath, newIndexRaw);
if (newIndexHtmlRaw !== null) {
  writeFileSync(indexHtmlPath, newIndexHtmlRaw);
}

// ----- Report -----
console.log(`new-topic: scaffolded "${slug}" in section "${sectionName}".`);
console.log('  wrote:');
console.log(`    ${htmlPath.replace(repoRoot + '/', '')}`);
console.log(`    concepts/${slug}.json`);
console.log(`    quizzes/${slug}.json`);
console.log(`    concepts/index.json  (appended "${slug}" under ${sectionName})`);
if (indexHtmlResult.status === 'inserted') {
  console.log(`    index.html           (card inserted under ${sectionName})`);
} else if (indexHtmlResult.status === 'duplicate') {
  console.log(`    index.html           (skipped — ${indexHtmlResult.message})`);
} else {
  console.log(`    index.html           (skipped — ${indexHtmlResult.message})`);
}
console.log('');
console.log('Next steps:');
if (indexHtmlResult.status === 'inserted') {
  console.log(`  1. Refine the draft card in index.html (thumb SVG, .desc copy).`);
} else {
  console.log(`  1. Add a card to index.html under the "${sectionName}" section header`);
  console.log(`     (match the <a class="card"> shape of a neighbor).`);
}
console.log(`  2. Draft concept sections in ${slug}.html — replace the "TODO" markers`);
console.log('     with numbered sections, widgets, and quiz placeholders:');
console.log('       <div class="quiz" data-concept="<concept-id>"></div>');
console.log(`  3. Populate concepts/${slug}.json with concept entries`);
console.log(`     (id, title, anchor, prereqs, blurb) and quizzes/${slug}.json`);
console.log('     with the matching quiz banks.');
console.log('  4. If this is a capstone, add an entry (with "section") to concepts/capstones.json.');
console.log('  5. Run:  node scripts/rebuild.mjs');
console.log('     (bundles + validates + audits + smoke-tests everything.)');

// Non-fatal warning prefix on stderr for the skip case so it's visible in CI
// logs even when stdout is muted. The script still exits 0 in this case.
if (indexHtmlResult.status === 'skipped' && indexHtmlResult.message !== 'index.html not present') {
  console.warn(`new-topic: warning — index.html card insertion skipped (${indexHtmlResult.message}); add the card by hand.`);
}
