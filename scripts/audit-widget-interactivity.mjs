#!/usr/bin/env node
// Advisory audit: for every <div class="widget"> on a topic page, confirm
// there is a corresponding <script> block that attaches event handlers to
// something inside the widget.
//
// Semantics:
//   - The canonical pattern (see category-theory.html) is: each widget owns
//     a unique scope (usually an `id="..."` on the widget itself and/or
//     distinctive ids/classes on inner nodes like `<svg id="cat-svg">`,
//     `<button id="cat-reset">`), and one <script> block per section wires
//     listeners by selector.
//   - A widget is Interactive if at least one of its distinctive selectors
//     is referenced from any later <script> block in ways that look like an
//     event binding (addEventListener, on* inline, $('#…'), $('.…'),
//     getElementById, querySelector, make3DDraggable, etc.).
//   - Otherwise it is Static (worth noting; may be intentional SVG illus-
//     tration such as a waypoint diagram, or it may be an interactivity
//     backlog item).
//
// CLI:
//   node scripts/audit-widget-interactivity.mjs
//       Print one-line totals per page and a grand total.
//
//   node scripts/audit-widget-interactivity.mjs --only-static
//       Same, plus list every static widget individually (page:line :: id/snippet).
//
// Exit 0 always (advisory — not a CI gate). Zero dependencies.

import { readFileSync, readdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const repoRoot = resolve(dirname(__filename), '..');

const argv = process.argv.slice(2);
const ONLY_STATIC = argv.includes('--only-static');

const SPECIAL = new Set(['index.html', 'pathway.html']);

// ─────────────────────────────────────────────────────────────────────────
// Widget extraction — depth-balanced <div class="widget"> scan.
//
// Walks <div …> / </div> token stream starting at each widget-open match,
// counts depth, records the widget's outer span. Returns [{ start, end, body }].

function extractWidgets(html) {
  const widgets = [];
  const widgetOpenRe =
    /<div\b[^>]*\bclass=["'][^"']*\bwidget\b[^"']*["'][^>]*>/gi;
  let om;
  while ((om = widgetOpenRe.exec(html))) {
    const openStart = om.index;
    const openEnd = om.index + om[0].length;
    // Tokenize remaining html for <div …> and </div>.
    const divOpenRe = /<div\b[^>]*>/gi;
    const divCloseRe = /<\/div\s*>/gi;
    divOpenRe.lastIndex = openEnd;
    divCloseRe.lastIndex = openEnd;
    let depth = 1;
    let end = html.length;
    let safety = 0;
    while (depth > 0) {
      if (++safety > 100000) break;
      const savedOpen = divOpenRe.lastIndex;
      const savedClose = divCloseRe.lastIndex;
      const o = divOpenRe.exec(html);
      const c = divCloseRe.exec(html);
      if (!c) break;
      if (o && o.index < c.index) {
        depth++;
        // don't let close re lag behind new open
        divCloseRe.lastIndex = Math.max(savedClose, o.index + o[0].length);
      } else {
        depth--;
        if (depth === 0) {
          end = c.index + c[0].length;
          break;
        }
        // consumed close — realign openRe to keep scanning
        divOpenRe.lastIndex = Math.max(savedOpen, c.index + c[0].length);
      }
    }
    widgets.push({
      outerStart: openStart,
      outerEnd: end,
      openEnd,
      innerEnd: end - '</div>'.length,
      headerTag: om[0],
    });
    // Skip past this widget's close so outer widget-open loop resumes after it.
    widgetOpenRe.lastIndex = end;
  }
  return widgets;
}

// ─────────────────────────────────────────────────────────────────────────
// Selector extraction — distinctive ids and class names inside a widget body.

const COMMON_CLASSES = new Set([
  'widget',
  'hd',
  'ttl',
  'hint',
  'readout',
  'row',
  'note',
  'ok',
  'bad',
  'small',
  'quiz',
  'callback',
  'related',
  'changelog',
  'sub',
  'hero',
  'toc',
  'sidetoc',
  'card',
  'tt',
  'desc',
  'tag',
  'level',
  'prereq',
  'advanced',
  'capstone',
  'ink',
  'mute',
  'line',
  'panel',
  'panel2',
  'yellow',
  'blue',
  'green',
  'pink',
  'violet',
  'cyan',
  'active',
  // common SVG helper classes (rarely used for JS hooks)
  'axis',
  'grid',
  'tick',
  'label',
]);

function extractSelectors(widgetHtml) {
  const ids = new Set();
  const classes = new Set();

  // id="..." — any id on any element inside the widget (including the widget
  // itself; we strip the outer opener separately for reporting).
  const idRe = /\bid=["']([a-zA-Z0-9_\-:.]+)["']/g;
  let m;
  while ((m = idRe.exec(widgetHtml))) ids.add(m[1]);

  // class="..." — split on whitespace, filter out chrome / palette tokens.
  const classRe = /\bclass=["']([^"']+)["']/g;
  while ((m = classRe.exec(widgetHtml))) {
    for (const name of m[1].trim().split(/\s+/)) {
      if (!name) continue;
      if (COMMON_CLASSES.has(name)) continue;
      classes.add(name);
    }
  }

  return { ids: [...ids], classes: [...classes] };
}

// ─────────────────────────────────────────────────────────────────────────
// Event-binding detection — does the script text wire a handler to a
// selector belonging to the widget?
//
// Triggers (any one of these counts as "interactive"):
//   - the widget tree itself contains an inline on* handler (onclick, oninput,
//     onpointerdown, onchange, onpointermove, onpointerup, onmouseover, …)
//   - a later <script> block references the widget's id or class AND uses
//     one of the event-binding verbs (addEventListener, make3DDraggable, …),
//     OR it references the selector through $(' #id ') / $('.class') /
//     document.getElementById('id') / document.querySelector('…') — these
//     are almost always followed by a handler in this codebase.
//
// We deliberately err on the side of classifying as Interactive: the goal
// is to surface suspiciously-idle widgets, so a few false negatives on the
// "static" list beat a noisy false-positive tide.

const EVENT_VERBS_RE =
  /\b(addEventListener|removeEventListener|make3DDraggable|requestAnimationFrame)\b/;
const INLINE_HANDLER_ATTR_RE =
  /\bon(?:click|input|change|pointerdown|pointermove|pointerup|pointercancel|mousedown|mousemove|mouseup|mouseover|mouseout|mouseenter|mouseleave|keydown|keyup|keypress|wheel|touchstart|touchmove|touchend|focus|blur|submit|dblclick|contextmenu)\s*=\s*["']/i;

function escapeForRegex(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function widgetHasInlineHandler(widgetHtml) {
  return INLINE_HANDLER_ATTR_RE.test(widgetHtml);
}

// Extract every <script>…</script> body on the page (inline, no src).
function extractScriptBodies(html) {
  const bodies = [];
  const re = /<script\b([^>]*)>([\s\S]*?)<\/script\s*>/gi;
  let m;
  while ((m = re.exec(html))) {
    const attrs = m[1];
    if (/\bsrc\s*=/.test(attrs)) continue; // external; we can't see it
    bodies.push({ start: m.index, end: m.index + m[0].length, body: m[2] });
  }
  return bodies;
}

// For a given selector, returns true if `scriptText` looks like it wires a
// handler to it. We accept any of:
//   - $('#id')     $("#id")      $('.class')
//   - document.getElementById('id')
//   - document.querySelector[All]('#id' | '.class')
//   - a bare string/template literal containing '#id' or '.class' appearing
//     in the same script block that also names an event-binding verb
//   - identifier-looking references (for ids only): the id used as a JS
//     variable name inside the same script block that uses event verbs
//     (e.g. `const btn = $('#cat-reset'); btn.addEventListener(...)`)
function scriptReferencesSelector(scriptText, selector, kind) {
  // kind: 'id' | 'class'
  const sel = selector;
  const selEsc = escapeForRegex(sel);

  // $('#id'), $("#id") — or $('.class')
  const prefix = kind === 'id' ? '#' : '.';
  const dollarRe = new RegExp(
    `\\$\\(\\s*["'\`]\\s*${escapeForRegex(prefix)}${selEsc}\\b`
  );
  if (dollarRe.test(scriptText)) return true;

  // document.getElementById('id') / getElementById("id")
  if (kind === 'id') {
    const gbiRe = new RegExp(
      `getElementById\\(\\s*["'\`]${selEsc}["'\`]\\s*\\)`
    );
    if (gbiRe.test(scriptText)) return true;
  }

  // document.querySelector / querySelectorAll with '#id' / '.class'
  const qsRe = new RegExp(
    `querySelector(?:All)?\\(\\s*["'\`][^"'\`]*${escapeForRegex(
      prefix
    )}${selEsc}\\b[^"'\`]*["'\`]\\s*\\)`
  );
  if (qsRe.test(scriptText)) return true;

  // getElementsByClassName('class') — rarer but still valid
  if (kind === 'class') {
    const gcRe = new RegExp(
      `getElementsByClassName\\(\\s*["'\`]${selEsc}["'\`]\\s*\\)`
    );
    if (gcRe.test(scriptText)) return true;
  }

  // Bare quoted '#id' / '.class' anywhere, provided the script block also
  // names an event-binding verb or inline handler assignment. This catches
  // patterns like  const btn = $(s); s being a variable holding the selector,
  // or `make3DDraggable(svg, ...)` after `const svg = $('#...')`.
  const bareRe = new RegExp(
    `["'\`]\\s*${escapeForRegex(prefix)}${selEsc}\\b`
  );
  if (bareRe.test(scriptText) && EVENT_VERBS_RE.test(scriptText)) return true;

  return false;
}

// ─────────────────────────────────────────────────────────────────────────
// Line lookup for reporting.

function lineOf(html, offset) {
  let n = 1;
  for (let i = 0; i < offset && i < html.length; i++) {
    if (html.charCodeAt(i) === 10) n++;
  }
  return n;
}

// ─────────────────────────────────────────────────────────────────────────
// Per-page classification.

function classifyPage(html) {
  const widgets = extractWidgets(html);
  const scripts = extractScriptBodies(html);

  const results = [];
  for (const w of widgets) {
    const body = html.slice(w.outerStart, w.outerEnd);
    const inner = html.slice(w.openEnd, w.innerEnd);

    // Prefer the widget's own id as the "label" for reports.
    const ownIdM = w.headerTag.match(/\bid=["']([^"']+)["']/);
    const ownId = ownIdM ? ownIdM[1] : null;

    const { ids, classes } = extractSelectors(body);

    // Fast path: inline handler attribute anywhere in the widget tree.
    if (widgetHasInlineHandler(body)) {
      results.push({
        ...w,
        id: ownId,
        ids,
        classes,
        interactive: true,
        via: 'inline-on*',
      });
      continue;
    }

    // Check all scripts for any selector reference.
    let interactive = false;
    let via = null;
    for (const s of scripts) {
      // Only scripts AFTER the widget are meaningful in practice (the helper
      // block at the top of <body> doesn't name widget-specific selectors),
      // but we accept any script on the page — occasional pages put their
      // wiring above the markup. Cost is negligible.
      for (const id of ids) {
        if (scriptReferencesSelector(s.body, id, 'id')) {
          interactive = true;
          via = `#${id}`;
          break;
        }
      }
      if (interactive) break;
      for (const cls of classes) {
        if (scriptReferencesSelector(s.body, cls, 'class')) {
          interactive = true;
          via = `.${cls}`;
          break;
        }
      }
      if (interactive) break;
    }

    results.push({
      ...w,
      id: ownId,
      ids,
      classes,
      interactive,
      via,
    });
  }
  return results;
}

// ─────────────────────────────────────────────────────────────────────────
// Main.

const htmlFiles = readdirSync(repoRoot)
  .filter((f) => f.endsWith('.html') && !SPECIAL.has(f))
  .sort();

let totalInteractive = 0;
let totalStatic = 0;
let pagesWithStatic = 0;

const perPage = []; // { file, interactive, static, widgets: [{...}] }

for (const file of htmlFiles) {
  const abs = join(repoRoot, file);
  const html = readFileSync(abs, 'utf8');
  const results = classifyPage(html);
  const interactiveN = results.filter((r) => r.interactive).length;
  const staticN = results.length - interactiveN;
  totalInteractive += interactiveN;
  totalStatic += staticN;
  if (staticN > 0) pagesWithStatic++;
  perPage.push({ file, interactive: interactiveN, static: staticN, results, html });
}

// Header.
console.log(
  `audit-widget-interactivity: ${htmlFiles.length} page(s), ` +
    `${totalInteractive} interactive, ${totalStatic} static ` +
    `(across ${pagesWithStatic} page(s) with ≥1 static).`
);
console.log('');

// Per-page summary table.
const nameW = Math.max(...htmlFiles.map((f) => f.length), 10);
console.log(
  '  ' +
    'page'.padEnd(nameW) +
    '  ' +
    'total'.padStart(5) +
    '  ' +
    'interactive'.padStart(11) +
    '  ' +
    'static'.padStart(6)
);
console.log('  ' + '-'.repeat(nameW) + '  -----  -----------  ------');
for (const p of perPage) {
  const total = p.interactive + p.static;
  console.log(
    '  ' +
      p.file.padEnd(nameW) +
      '  ' +
      String(total).padStart(5) +
      '  ' +
      String(p.interactive).padStart(11) +
      '  ' +
      String(p.static).padStart(6)
  );
}
console.log('');

if (ONLY_STATIC) {
  console.log('STATIC WIDGETS (candidates for interactivity backfill):');
  console.log('');
  for (const p of perPage) {
    const staticWidgets = p.results.filter((r) => !r.interactive);
    if (staticWidgets.length === 0) continue;
    console.log(`${p.file}  (${staticWidgets.length} static)`);
    for (const w of staticWidgets) {
      const line = lineOf(p.html, w.outerStart);
      const idLabel = w.id ? `#${w.id}` : '(no id)';
      // pull widget title if available (inside .ttl)
      const ttlM = /<div\s+class=["']ttl["']\s*>([^<]*)<\/div>/i.exec(
        p.html.slice(w.outerStart, w.outerEnd)
      );
      const title = ttlM ? ttlM[1].trim() : '';
      const preview = title ? `"${title}"` : '';
      console.log(
        `  L${String(line).padStart(5)}  ${idLabel.padEnd(24)} ${preview}`
      );
    }
  }
  console.log('');
}

// Top-10 static pages — always shown (advisory; shows where the backfill
// targets are densest).
const topStatic = [...perPage]
  .filter((p) => p.static > 0)
  .sort((a, b) => b.static - a.static || a.file.localeCompare(b.file))
  .slice(0, 10);
if (topStatic.length > 0) {
  console.log('Top pages by static-widget count:');
  for (const p of topStatic) {
    console.log(`  ${p.static.toString().padStart(3)}  ${p.file}`);
  }
  console.log('');
}

// Advisory — always exit 0.
process.exit(0);
