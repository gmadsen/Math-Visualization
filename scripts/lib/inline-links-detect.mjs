// Pure helpers extracted from scripts/audit-inline-links.mjs.
//
// The CLI script wires up vocab (from concepts/bundle.js) and blocklist
// (from audits/inline-links-blocklist.json) at top level, then calls
// findCandidatesInPage with them. This module exposes the same
// functions with vocab/blocklist as explicit parameters so unit tests
// can supply small synthetic vocabularies without re-loading the real
// corpus model.
//
// Why this exists: a synthetic test of the writability+dedupe
// interaction (PR #227 / silent-failure-hunter on PR #228) needs to
// call findCandidatesInPage directly. Importing audit-inline-links.mjs
// runs its top-level loadContentModel() — fine for production, slow
// for a unit test that just wants to test the algorithm.

import {
  forEachSectionProse,
} from './content-model.mjs';
import {
  buildSkipMask,
  buildSectionMap,
  parseTopicHtmlSafe,
  recoverDroppedNodes,
} from './audit-utils.mjs';

function sectionForOffset(sections, offset) {
  let best = null;
  for (const s of sections) {
    if (offset >= s.start && offset < s.end) {
      if (!s.id) continue;
      if (!best || s.start > best.start) best = s;
    }
  }
  return best ? best.id : null;
}

/**
 * Strip every `<a data-auto-inline-link="1" …>INNER</a>` from `html`,
 * leaving `INNER` in place. Idempotent — re-running on already-stripped
 * input is a no-op.
 */
export function stripAutoLinks(html) {
  const re = /<a\b[^>]*\bdata-auto-inline-link=["']1["'][^>]*>([\s\S]*?)<\/a>/gi;
  return html.replace(re, (_m, inner) => inner);
}

/**
 * Escape a string for embedding inside an HTML double-quoted attribute
 * value. Blurbs from concepts/*.json routinely contain `<`, `>`, `&`,
 * apostrophes, etc.; this covers all five HTML special characters.
 */
export function escAttr(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Build the canonical anchor HTML for a wrapped concept mention.
 * The output is what stripAutoLinks expects to find and strip.
 */
export function buildAnchorHtml(concept, phrase) {
  const href = `./${concept.page}#${concept.anchor}`;
  const idAttr = ` data-concept-id="${escAttr(concept.id)}"`;
  const blurbAttr = concept.blurb
    ? ` data-blurb="${escAttr(concept.blurb)}"`
    : '';
  return (
    `<a href="${href}" data-auto-inline-link="1"` +
    idAttr +
    blurbAttr +
    `>${phrase}</a>`
  );
}

/**
 * Build the writability predicate the JSON-aware --fix path passes to
 * findCandidatesInPage. Returns `(globalIdx, length) => bool`.
 *
 * The predicate is true iff the byte range `[globalIdx, globalIdx+length)`
 * lies wholly inside a raw or quiz block (or the rawHead/rawBodyPrefix/
 * rawBodySuffix frames) — i.e., somewhere applyFixToJson can splice an
 * anchor without violating render-from-params byte-identity. Matches
 * inside widget/widget-script renders return false, which lets
 * findCandidatesInPage skip past them WITHOUT consuming the per-page
 * dedupe slot (so a later raw-block mention of the same concept can
 * still wrap).
 */
export function makeIsWritable(ranges, findRangeAt) {
  return function isWritable(globalIdx, length) {
    const r = findRangeAt(ranges, globalIdx);
    if (!r) return false;
    if (globalIdx + length > r.end) return false;
    if (r.kind === 'block') {
      const b = r.block;
      return (b.type === 'raw' || b.type === 'quiz') &&
             typeof b.html === 'string';
    }
    return true;
  };
}

/**
 * Find candidate concept-title mentions in `html` that would benefit
 * from a wrapping `<a>` link. Generator — yields one candidate at a
 * time so callers can splice in-place without materialising the full
 * list.
 *
 * Parameters:
 *   html        — the page's HTML bytes (must parse via parseTopicHtmlSafe)
 *   pageTopic   — topic slug of the page (used for self-link suppression)
 *   pageName    — page filename (used for blocklist lookup)
 *   vocab       — array of concept vocabulary entries, sorted
 *                 longest-title-first, each with {title, titleLower,
 *                 regex, id, topic, page, anchor, blurb}
 *   blocklist   — Map<page, Set<conceptId>> of per-page rejections
 *                 (PR #225 review). Pass `new Map()` to disable.
 *   isWritable  — optional `(globalIdx, length) => bool` predicate.
 *                 When provided, matches landing on non-writable bytes
 *                 are silently skipped WITHOUT consuming the per-page
 *                 dedupe slot — so a later writable mention of the
 *                 same concept can still wrap. Omit for HTML-direct
 *                 callers (everything is writable in hand-authored
 *                 HTML).
 *
 * Yields:
 *   { section, concept, phrase, globalIdx, length }
 */
export function* findCandidatesInPage(html, pageTopic, pageName, vocab, blocklist, isWritable) {
  const parseOptions = {
    blockTextElements: {
      script: true,
      noscript: true,
      style: true,
      pre: true,
    },
  };
  const parseResult = parseTopicHtmlSafe(html, parseOptions);
  const root = parseResult.root;
  if (parseResult.missingIds.length > 0) {
    console.warn(
      `  note: parser dropped ${parseResult.missingIds.length} section(s) ` +
      `(${parseResult.missingIds.join(', ')}); recovering via subtree re-parse.`
    );
  }
  const recoveredParagraphs = recoverDroppedNodes(parseResult, 'p', parseOptions);
  const { mask } = buildSkipMask(html);
  const sections = buildSectionMap(html);

  // Collect existing link targets on the whole page so we can suppress
  // concepts already linked by hand.
  const existingLinkTargets = new Set();
  {
    const linkRe = /<a\b[^>]*\bhref=["']([^"']+)["'][^>]*>/gi;
    let m;
    while ((m = linkRe.exec(html))) {
      const href = m[1];
      const cleaned = href.replace(/^\.\//, '').split('?')[0];
      existingLinkTargets.add(cleaned);
    }
  }

  const emittedConceptIds = new Set();
  const pageBlocks = (pageName && blocklist && blocklist.get(pageName)) || null;

  const paragraphs = [...root.querySelectorAll('p'), ...recoveredParagraphs]
    .filter((p) => p && p.range)
    .sort((a, b) => a.range[0] - b.range[0]);

  for (const p of paragraphs) {
    if (!p || !p.range) continue;
    const pStart = p.range[0];
    const pEnd = p.range[1];
    const sectionId = sectionForOffset(sections, pStart);

    const proseNodes = [];
    forEachSectionProse(p, (textNode, info) => {
      if (!textNode || !textNode.range) return;
      proseNodes.push({ node: textNode, text: info.text, masked: info.masked });
    });
    if (proseNodes.length === 0) continue;

    const localMask = new Uint8Array(pEnd - pStart);

    for (const v of vocab) {
      if (v.topic === pageTopic) continue;
      const anchorKey = `${v.page}#${v.anchor}`;
      if (existingLinkTargets.has(anchorKey)) continue;
      if (pageBlocks && pageBlocks.has(v.id)) continue;
      if (emittedConceptIds.has(v.id)) continue;

      let found = null;
      scan: for (const { node, masked } of proseNodes) {
        const nodeStart = node.range[0];
        const nodeEnd = node.range[1];
        let searchFrom = 0;
        while (searchFrom < masked.length) {
          const re = new RegExp(v.regex.source, 'i');
          const m = masked.slice(searchFrom).match(re);
          if (!m) break;
          const localIdxInNode = searchFrom + m.index;
          const globalIdx = nodeStart + localIdxInNode;
          const len = m[0].length;
          let skip = false;
          if (globalIdx + len > nodeEnd) skip = true;
          if (!skip) {
            for (let k = 0; k < len; k++) {
              if (mask[globalIdx + k]) { skip = true; break; }
            }
          }
          if (!skip) {
            const pLocal = globalIdx - pStart;
            for (let k = 0; k < len; k++) {
              if (localMask[pLocal + k]) { skip = true; break; }
            }
          }
          if (!skip) {
            const preCh = globalIdx > 0 ? html[globalIdx - 1] : '';
            const postCh = html[globalIdx + len] || '';
            if (preCh === '$' || postCh === '$') skip = true;
          }
          if (!skip && typeof isWritable === 'function' &&
              !isWritable(globalIdx, len)) {
            skip = true;
          }
          if (skip) {
            searchFrom = localIdxInNode + Math.max(1, len);
            continue;
          }
          found = { globalIdx, len, text: m[0] };
          break scan;
        }
      }

      if (!found) continue;

      const pLocal = found.globalIdx - pStart;
      for (let k = 0; k < found.len; k++) localMask[pLocal + k] = 1;

      emittedConceptIds.add(v.id);

      yield {
        section: sectionId,
        concept: v,
        phrase: found.text,
        globalIdx: found.globalIdx,
        length: found.len,
      };
    }
  }
}
