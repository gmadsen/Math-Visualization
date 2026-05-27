// migrate-to-button-stepper — hoist verbatim "buttons + SVG + readout" slugs
// onto the shared `button-stepper` renderer (widgets/button-stepper/).
//
//   node scripts/migrate-to-button-stepper.mjs <topic> <verbatim-slug> [...]
//
// Unlike migrate-to-slider-svg-2d's --normalize path, this tool defaults to a
// STRICT byte-identity guard: it parses each verbatim `bodyMarkup` into typed
// button-stepper params, re-renders, and refuses to migrate unless the output
// is byte-for-byte identical to the original. button-stepper's renderer was
// built to round-trip faithfully (it preserves layout-block ORDER, readout
// content, span-vs-div headers, raw blocks), so byte-identity is achievable
// for well-formed inputs and means ZERO behavior change — no browser-verify
// needed. Any widget whose markup the parser can't reproduce exactly throws
// and is left verbatim (atomic per topic-call: any listed slug failing → none
// saved). That conservatism is the point — defer the odd shapes, never guess.
//
// Scope (what button-stepper can represent): a `<div class="widget" id>` with
// a `.hd` header (div OR span ttl/hint), then an ordered run of layout blocks —
// `<div class="row">` (label? + <button> list, id-keyed or data-*-keyed),
// `<svg id viewBox width height><title>>`, `<div class="readout" id>content`,
// and an optional trailing `<p class="small">`. Shapes outside that (responsive
// or styled <svg>, sliders/selects in the row, raw mid-body blocks) trip the
// byte-identity guard and defer.

import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  loadTopicContent,
  saveTopicContent,
} from './lib/json-block-writer.mjs';
import {
  renderMarkup as renderButtonStepper,
  renderScript as renderButtonStepperScript,
} from '../widgets/button-stepper/index.mjs';

const __filename = fileURLToPath(import.meta.url);
const repoRoot = resolve(dirname(__filename), '..');

const argv = process.argv.slice(2);
// --normalize: relax the STRICT byte-identity default for widgets that
// button-stepper's fixed output can't reproduce byte-for-byte but only with
// INVISIBLE deltas — a no-wrapper-id `<div class="widget">` (button-stepper
// adds the id) and an id-first readout `<div id=… class="readout">` (rendered
// class-first). Attr order doesn't render and an added DOM id is inert, so the
// page is visually/behaviourally unchanged; the SCRIPT byte-identity guard is
// still enforced (the driving script is untouched), and migrated widgets are
// browser-verified. Mirrors migrate-to-slider-svg-2d's --normalize.
const NORMALIZE = argv.includes('--normalize');
const positional = argv.filter((a) => !a.startsWith('--'));
if (positional.length < 2) {
  console.error('Usage: node scripts/migrate-to-button-stepper.mjs <topic> <verbatim-slug> [...]');
  process.exit(2);
}
const topicSlug = positional[0];
const wantSlugs = new Set(positional.slice(1));

// ---------------------------------------------------------------------------
// Parser. Reproduces button-stepper/index.mjs::renderMarkup output exactly,
// so the byte-identity guard in the main loop is the real correctness check.

// Find the matching close for a `<div …>` whose opening `<` is at openStart.
// Returns indices for the inner span and the position just past `</div>`.
// Depth-counts nested <div>/</div> so headers (ttl/hint inside .hd) and
// readouts with nested markup resolve to their true close, not the first one.
function matchDivClose(str, openStart) {
  let depth = 0;
  const tagRe = /<(\/?)div\b[^>]*>/g;
  tagRe.lastIndex = openStart;
  let m;
  while ((m = tagRe.exec(str))) {
    depth += m[1] ? -1 : 1;
    if (depth === 0) {
      const innerStart = openStart + str.slice(openStart).indexOf('>') + 1;
      return { innerStart, closeStart: m.index, end: tagRe.lastIndex };
    }
  }
  throw new Error('unbalanced <div>');
}

// Parse the .hd header → { title, hint, titleTag, hintTag }. Accepts the
// canonical `<div class="hd"><(div|span) class="ttl">…</…>[<(div|span)
// class="hint">…</…>]</div>` shape the renderer emits. Throws otherwise
// (e.g. a hand-authored hd carrying extra markup → defer via byte guard).
function parseHd(hdInner) {
  const ttlMatch = hdInner.match(/^<(div|span) class="ttl">([\s\S]*?)<\/\1>/);
  if (!ttlMatch) throw new Error('could not parse .hd > .ttl');
  const titleTag = ttlMatch[1];
  const title = ttlMatch[2];
  let rest = hdInner.slice(ttlMatch[0].length);
  let hint, hintTag;
  if (rest.length > 0) {
    const hintMatch = rest.match(/^<(div|span) class="hint">([\s\S]*?)<\/\1>$/);
    if (!hintMatch) throw new Error('unexpected trailing content in .hd after .ttl');
    hintTag = hintMatch[1];
    hint = hintMatch[2];
  }
  return { title, titleTag, hint, hintTag };
}

// Parse one <button …>label</button> into a button-stepper button object.
// Emits the same attr model the renderer consumes: { id?, dataAttr?, className?,
// label }. Refuses (throws) anything but the id/data-*/class attribute set, so
// onclick= handlers or unexpected attrs defer rather than silently drop.
function parseButton(openAttrs, label) {
  const btn = {};
  const attrRe = /\s+([a-zA-Z][a-zA-Z0-9_-]*)="([^"]*)"/g;
  let m;
  let sawData = false;
  while ((m = attrRe.exec(openAttrs))) {
    const name = m[1].toLowerCase();
    const value = m[2];
    if (name === 'id') btn.id = value;
    else if (name === 'class') btn.className = value;
    else if (name === 'type') btn.type = value;
    else if (name.startsWith('data-')) {
      if (sawData) throw new Error(`button has multiple data-* attrs (only one supported): ${openAttrs}`);
      btn.dataAttr = { name, value };
      sawData = true;
    } else {
      throw new Error(`button has unsupported attribute "${name}" (only id, type, class, single data-*): ${openAttrs}`);
    }
  }
  btn.label = label;
  return btn;
}

// Allowlist for verbatim <span> attribute strings (status/counter spans in
// stepper rows). Cosmetic + a11y attrs accepted; event handlers (on*=) and
// anything else throw rather than silently propagate (cf. slider labelAttrs).
const SPAN_ATTR_ALLOW = /^(?:id|class|style|title|data-[a-z][a-z0-9_-]*|aria-[a-z]+)$/;
// Validate a verbatim <span> attribute string before it's spliced back into
// `<span${attrs}>`. The string must consist ENTIRELY of allowlisted
// double-quoted attributes — we strip each `name="…"` in turn and require the
// residue to be blank. This closes the gap a name-only scan would leave: a
// single-quoted/unquoted/boolean attribute (e.g. `onclick='…'`) matches no
// `name="…"` token, so it survives in the residue and trips the throw rather
// than slipping through to the verbatim splice. (Codex + review flagged this on
// PR #376; source is trusted corpus but this is cheap defense-in-depth.)
function assertSpanAttrsSafe(attrs) {
  if (!attrs) return;
  let residual = attrs;
  const attrRe = /\s+([a-zA-Z][a-zA-Z0-9_-]*)="[^"]*"/;
  let m;
  while ((m = residual.match(attrRe))) {
    const name = m[1].toLowerCase();
    if (!SPAN_ATTR_ALLOW.test(name)) {
      throw new Error(`span has disallowed attribute "${name}" (allow id/class/style/title/data-*/aria-*): "${attrs}"`);
    }
    residual = residual.slice(0, m.index) + residual.slice(m.index + m[0].length);
  }
  if (residual.trim() !== '') {
    throw new Error(
      `span has a non-double-quoted or unparseable attribute (refusing verbatim splice): "${attrs}" — residual "${residual.trim()}"`
    );
  }
}

// Parse the inner of a <div class="row">…</div> into a row layout block.
// Tokenises into an ordered run of <label>/<button>/<span>. A row that is only
// (optional) label + buttons emits the legacy `{ label?, buttons[] }` form
// (byte-identical to existing button-stepper widgets); a row that also carries
// a <span> (a status/counter display in a stepper) emits the ordered `children`
// form so the span round-trips in place. Anything else (sliders/selects/inputs)
// throws and the widget defers.
function parseRow(rowOpenAttrs, rowInner) {
  const block = { kind: 'row' };
  const idMatch = rowOpenAttrs.match(/\bid="([^"]+)"/);
  if (idMatch) block.id = idMatch[1];
  // Reject any row attribute other than id (class="row" is the tag selector,
  // already consumed by the caller's match).
  const otherAttr = rowOpenAttrs.replace(/\s*class="row"/, '').replace(/\s*id="[^"]*"/, '').trim();
  if (otherAttr) throw new Error(`row has unsupported attribute(s): "${otherAttr}"`);

  const trimmed = rowInner.trim();
  if (trimmed === '') return block; // empty row (id-only)

  const children = [];
  let rest = trimmed;
  while (rest.length > 0) {
    let mm;
    if ((mm = rest.match(/^<label>([\s\S]*?)<\/label>\s*/))) {
      children.push({ kind: 'label', text: mm[1] });
    } else if ((mm = rest.match(/^<button([^>]*)>([\s\S]*?)<\/button>\s*/))) {
      children.push({ kind: 'button', ...parseButton(mm[1], mm[2]) });
    } else if ((mm = rest.match(/^<span([^>]*)>([\s\S]*?)<\/span>\s*/))) {
      assertSpanAttrsSafe(mm[1]);
      const span = { kind: 'span' };
      if (mm[1]) span.attrs = mm[1];     // verbatim attr string (incl. leading space)
      if (mm[2] !== '') span.content = mm[2];
      children.push(span);
    } else {
      throw new Error(`row contains unsupported content (sliders/selects/inputs defer): "${rest.slice(0, 60)}"`);
    }
    rest = rest.slice(mm[0].length);
  }

  if (children.some((c) => c.kind === 'span')) {
    block.children = children;            // ordered form (span present)
  } else {
    const label = children.find((c) => c.kind === 'label');
    const buttons = children.filter((c) => c.kind === 'button').map(({ kind, ...b }) => b);
    if (label) block.label = label.text;
    if (buttons.length) block.buttons = buttons;
  }
  return block;
}

// Parse an <svg …><title>…</title></svg> opener into an svg layout block.
// button-stepper emits exactly `id viewBox width height` then a single
// <title>. Anything else (style/role/aria attrs, missing width/height,
// extra children) won't byte-match and defers.
function parseSvg(svgTag, svgInner) {
  const attr = (name) => {
    const m = svgTag.match(new RegExp(`\\b${name}="([^"]*)"`));
    return m ? m[1] : undefined;
  };
  const id = attr('id'), viewBox = attr('viewBox'), width = attr('width'), height = attr('height');
  if (!id || !viewBox || width === undefined || height === undefined) {
    throw new Error('svg missing one of id/viewBox/width/height (responsive/styled svgs defer)');
  }
  const num = (s) => (/^\d+$/.test(s) ? Number(s) : s);
  const block = { kind: 'svg', id, viewBox, width: num(width), height: num(height) };
  const ariaLabel = attr('aria-label');
  if (ariaLabel !== undefined) block.ariaLabel = ariaLabel;
  const titleMatch = svgInner.match(/^<title>([\s\S]*?)<\/title>$/);
  if (!titleMatch) throw new Error('svg inner is not exactly a single <title> (extra children defer)');
  block.titleText = titleMatch[1];
  return block;
}

// Walk the wrapper's inner body (everything after the .hd line) into an ordered
// layout[] array plus an optional trailingExplainer. Each iteration matches the
// next top-level element by its opening tag; div blocks use a depth counter to
// find their matching close (readout/raw inner may contain nested elements).
function parseBody(body, { normalize = false } = {}) {
  const layout = [];
  let trailingExplainer;
  let i = 0;
  const n = body.length;

  while (i < n) {
    // skip inter-block whitespace (the renderer joins blocks with '\n')
    while (i < n && /\s/.test(body[i])) i++;
    if (i >= n) break;
    const slice = body.slice(i);

    let mm;
    if ((mm = slice.match(/^<div class="row"([^>]*)>/))) {
      const openAttrs = mm[1];
      const { innerStart, closeStart, end } = matchDivClose(body, i);
      layout.push(parseRow(openAttrs, body.slice(innerStart, closeStart)));
      i = end;
    } else if ((mm = slice.match(/^<svg\b([^>]*)>/))) {
      const svgTag = mm[0];
      const closeIdx = slice.indexOf('</svg>');
      if (closeIdx < 0) throw new Error('unterminated <svg>');
      layout.push(parseSvg(svgTag, slice.slice(mm[0].length, closeIdx)));
      i += closeIdx + '</svg>'.length;
    } else if ((mm = slice.match(/^<div class="(readout(?:\s[^"]*)?)" id="([^"]+)"( style="[^"]*")?>/))) {
      // Class-first readout (button-stepper's canonical order). Captures the
      // full class (so "readout small" round-trips via className) and an
      // optional inline style. id-first readouts (`<div id=… class="readout">`)
      // don't match here and defer — button-stepper emits class-first.
      const cls = mm[1];
      const id = mm[2];
      const styleAttr = mm[3]; // ` style="…"` or undefined
      const { innerStart, closeStart, end } = matchDivClose(body, i);
      const block = { kind: 'readout', id };
      if (cls !== 'readout') block.className = cls;
      if (styleAttr) block.style = styleAttr.match(/ style="([^"]*)"/)[1];
      const content = body.slice(innerStart, closeStart);
      if (content !== '') block.content = content;
      layout.push(block);
      i = end;
    } else if (normalize && (mm = slice.match(/^<div id="([^"]+)" class="(readout(?:\s[^"]*)?)"( style="[^"]*")?>/))) {
      // id-FIRST readout (`<div id=… class="readout">`) — only in --normalize.
      // button-stepper emits class-first, so this re-renders with attrs reordered
      // (invisible — attr order doesn't render). Captures id + full class + style.
      const id = mm[1];
      const cls = mm[2];
      const styleAttr = mm[3];
      const { innerStart, closeStart, end } = matchDivClose(body, i);
      const block = { kind: 'readout', id };
      if (cls !== 'readout') block.className = cls;
      if (styleAttr) block.style = styleAttr.match(/ style="([^"]*)"/)[1];
      const content = body.slice(innerStart, closeStart);
      if (content !== '') block.content = content;
      layout.push(block);
      i = end;
    } else if ((mm = slice.match(/^<p class="small">([\s\S]*?)<\/p>\s*$/))) {
      // trailing explainer — must be the LAST thing in the body
      trailingExplainer = mm[1];
      i = n;
    } else {
      throw new Error(`unrecognised top-level block (raw/other defers): "${slice.slice(0, 70)}"`);
    }
  }
  return { layout, trailingExplainer };
}

// Parse a full verbatim bodyMarkup → button-stepper params (sans bodyScript,
// which the caller copies from the verbatim block). Throws on any shape it
// can't reproduce; the main loop's byte-identity guard is the final check.
function parseVerbatimMarkup(bodyMarkup, { normalize = false, fallbackWidgetId } = {}) {
  let widgetId, inner, synthesizedWidgetId = false;
  const wrapMatch = bodyMarkup.match(/^<div class="widget" id="([^"]+)">\n([\s\S]*)\n<\/div>$/);
  if (wrapMatch) {
    widgetId = wrapMatch[1];
    inner = wrapMatch[2];
  } else {
    // No wrapper id. button-stepper requires one — in --normalize, synthesize
    // it from the verbatim block's own widgetId param (the value already used as
    // the widget-script `ref`). The caller collision-checks before committing.
    const noIdMatch = bodyMarkup.match(/^<div class="widget">\n([\s\S]*)\n<\/div>$/);
    if (!noIdMatch || !normalize) {
      throw new Error('wrapper is not `<div class="widget" id="…">…</div>` (button-stepper requires a wrapper id; pass --normalize to synthesize one)');
    }
    if (!fallbackWidgetId) throw new Error('no-wrapper-id widget has no fallbackWidgetId to synthesize from');
    widgetId = fallbackWidgetId;
    inner = noIdMatch[1];
    synthesizedWidgetId = true;
  }

  // hd line: `  <div class="hd">…</div>` as the first line. The hd div nests
  // the ttl/hint divs, so find its balanced close (not the first </div>).
  if (!inner.startsWith('  <div class="hd">')) {
    throw new Error('first line is not `  <div class="hd">…</div>`');
  }
  const hdOpenStart = 2; // after the two-space indent
  const { innerStart: hdInnerStart, closeStart: hdCloseStart, end: hdEnd } = matchDivClose(inner, hdOpenStart);
  const hd = parseHd(inner.slice(hdInnerStart, hdCloseStart));
  // Skip the single '\n' the renderer emits after the hd line.
  let body = inner.slice(hdEnd);
  if (body.startsWith('\n')) body = body.slice(1);

  const { layout, trailingExplainer } = parseBody(body, { normalize });

  const params = { widgetId, title: hd.title, layout };
  if (hd.titleTag === 'span') params.titleTag = 'span';
  if (hd.hint !== undefined) {
    params.hint = hd.hint;
    if (hd.hintTag === 'span') params.hintTag = 'span';
  }
  if (trailingExplainer !== undefined) params.trailingExplainer = trailingExplainer;
  return { params, synthesizedWidgetId };
}

// Parse a verbatim bodyScript into the pieces button-stepper's renderScript
// consumes. Verbatim slugs store the FULL driving script —
// `<leadSep><script>\n[/* sectionComment */\n](function(){\n BODY \n})();\n
// </script>` — where leadSep is the inter-block separator (usually "\n") baked
// in because render-doc joins blocks with '' and the widget-script block sits
// adjacent to the widget. button-stepper.renderScript emits only the `<script>…`
// part and re-wraps BODY in the IIFE, so extract { leadSep, sectionComment,
// body } and (a) feed body+comment to the renderer, (b) relocate leadSep into
// an inserted raw block. Throws on any shape that doesn't fit (defer).
function parseVerbatimScript(bodyScript) {
  const m = bodyScript.match(
    /^(\s*)<script>\n(?:\/\* ([\s\S]*?) \*\/\n)?\(function\(\)\{\n([\s\S]*)\n\}\)\(\);\n<\/script>$/
  );
  if (!m) {
    throw new Error('bodyScript is not the canonical `<script>\\n(function(){\\n…\\n})();\\n</script>` IIFE shape');
  }
  return { leadSep: m[1], sectionComment: m[2], body: m[3] };
}

// ---------------------------------------------------------------------------

const doc = loadTopicContent(topicSlug, repoRoot);

let migrated = 0;
let failed = 0;

for (const section of doc.sections) {
  // Index-based: migrating a widget may splice a separator raw block before
  // its (adjacent) widget-script block, shifting later indices.
  for (let i = 0; i < section.blocks.length; i++) {
    const block = section.blocks[i];
    if (block.type !== 'widget' || !wantSlugs.has(block.slug)) continue;
    const old = block.params;
    if (typeof old.bodyMarkup !== 'string') {
      console.warn(`  ${block.slug}: not a verbatim slug (no bodyMarkup), skipping`);
      continue;
    }

    let params, synthesizedWidgetId, scriptParts;
    try {
      ({ params, synthesizedWidgetId } = parseVerbatimMarkup(old.bodyMarkup, {
        normalize: NORMALIZE,
        fallbackWidgetId: old.widgetId,
      }));
      scriptParts = parseVerbatimScript(old.bodyScript || '');
    } catch (e) {
      console.error(
        `  ${topicSlug} § ${section.id} slug=${block.slug}: parse error — ${e.message}\n` +
        `    markup head: ${(old.bodyMarkup || '').replace(/\s+/g, ' ').slice(0, 160)}…`
      );
      failed++;
      continue;
    }

    const newParams = { ...params, bodyScript: scriptParts.body };
    if (scriptParts.sectionComment !== undefined) newParams.sectionComment = scriptParts.sectionComment;

    const renderedMarkup = renderButtonStepper(newParams);
    const renderedScript = renderButtonStepperScript(newParams);

    // MARKUP guard. Default: strict byte-identity (renderMarkup === original).
    // --normalize: still PROVABLY invisible — build `expected` by applying ONLY
    // the two known invisible transforms to the original (add the synthesized
    // wrapper id; reorder id-first readouts to button-stepper's class-first),
    // then require renderMarkup === expected. Attr order doesn't render and an
    // added DOM id is inert, so a match proves the rendered page is visually/
    // behaviourally identical. Anything that re-renders DIFFERENTLY from those
    // two transforms (an unexpected, possibly-visible delta) defers — no
    // blind skip, no browser-verify needed.
    let expectedMarkup = old.bodyMarkup;
    if (NORMALIZE) {
      if (synthesizedWidgetId) {
        expectedMarkup = expectedMarkup.replace('<div class="widget">', `<div class="widget" id="${params.widgetId}">`);
      }
      expectedMarkup = expectedMarkup.replace(
        /<div id="([A-Za-z][\w-]*)" class="(readout(?:\s[^"]*)?)"( style="[^"]*")?>/g,
        '<div class="$2" id="$1"$3>'
      );
    }
    if (renderedMarkup !== expectedMarkup) {
      console.error(`  ${block.slug}: MARKUP guard FAILED${NORMALIZE ? ' (--normalize: unexpected non-invisible delta)' : ''} — refusing to migrate`);
      console.error('--- expected ---'); console.error(JSON.stringify(expectedMarkup));
      console.error('--- actual ---');   console.error(JSON.stringify(renderedMarkup));
      failed++;
      continue;
    }
    // SCRIPT guard: ALWAYS enforced. The driving script is untouched by either
    // mode, so leadSep + renderScript must reproduce the verbatim bodyScript
    // exactly — proves the IIFE body / sectionComment / separator are intact.
    if (scriptParts.leadSep + renderedScript !== old.bodyScript) {
      console.error(`  ${block.slug}: SCRIPT byte-identity FAILED — refusing to migrate`);
      console.error('--- expected ---'); console.error(JSON.stringify(old.bodyScript));
      console.error('--- actual ---');   console.error(JSON.stringify(scriptParts.leadSep + renderedScript));
      failed++;
      continue;
    }

    // Synthesized wrapper id (no-wrapper-id + --normalize): refuse if that id
    // already appears as an `id="…"` anywhere in the topic — adding it would
    // create a duplicate id / `<section id>` anchor collision (the ec-j bug).
    if (synthesizedWidgetId) {
      const idTok = `id="${params.widgetId}"`;
      let hits = 0;
      const scan = (s) => {
        if (typeof s !== 'string') return;
        let idx = 0;
        while ((idx = s.indexOf(idTok, idx)) !== -1) { hits++; idx += idTok.length; }
      };
      scan(doc.rawHead); scan(doc.rawBodyPrefix); scan(doc.rawBodySuffix);
      for (const sec of doc.sections) for (const b of sec.blocks) {
        scan(b.html);
        // Cover bodyScript too: a verbatim driver may build `<div id="X">` via
        // innerHTML, which would collide with a synthesized wrapper id at runtime.
        if (b.params) { scan(b.params.bodyMarkup); scan(b.params.bodyScript); }
      }
      if (hits > 0) {
        console.error(`  ${block.slug}: synthesized wrapper id "${params.widgetId}" already appears as id="…" (${hits}×) — collision, defer`);
        failed++;
        continue;
      }
    }

    // Find the widget-script block referencing this widget ANYWHERE in the
    // section (not necessarily the immediate sibling — some topics group their
    // scripts). The leadSep that preceded the script in the verbatim bodyScript
    // is relocated into a raw block immediately before that widget-script block,
    // so the page reproduces the original regardless of adjacency.
    const scriptIdx = section.blocks.findIndex((b) => b.type === 'widget-script' && b.ref === params.widgetId);
    if (scriptIdx < 0) {
      console.error(`  ${block.slug}: no widget-script ref="${params.widgetId}" found in section — defer`);
      failed++;
      continue;
    }

    const origSlug = block.slug;
    block.slug = 'button-stepper';
    block.params = newParams;
    if (scriptParts.leadSep !== '') {
      section.blocks.splice(scriptIdx, 0, { type: 'raw', html: scriptParts.leadSep });
      if (scriptIdx <= i) i++; // inserted at/before our cursor → keep alignment
    }
    migrated++;
    const how = NORMALIZE && (synthesizedWidgetId || renderedMarkup !== old.bodyMarkup) ? 'normalized' : 'byte-identical';
    console.log(`  ${origSlug}→button-stepper: migrated (${how}; ${old.bodyMarkup.length}B markup; leadSep ${JSON.stringify(scriptParts.leadSep)} relocated)`);
  }
}

if (failed > 0) {
  console.error(`migrate-to-button-stepper: ${failed} failure(s); refusing to save`);
  process.exit(1);
}
if (migrated === 0) {
  console.log('migrate-to-button-stepper: nothing to migrate');
  process.exit(0);
}

saveTopicContent(topicSlug, doc, repoRoot);
console.log(`migrate-to-button-stepper: migrated ${migrated} widget(s) in ${topicSlug}`);
