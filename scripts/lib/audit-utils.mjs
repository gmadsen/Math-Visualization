// scripts/lib/audit-utils.mjs
//
// Shared helpers for the audit scripts. Zero runtime dependencies beyond
// `node:` built-ins.
//
// Consolidates the following previously-duplicated pieces:
//   - escapeRe(s)
//   - buildTitleRegex(title, { global } = {})
//   - TITLE_BLOCKLIST
//   - maskRegion(mask, start, end)
//   - buildSkipMask(html)
//   - buildSectionMap(html)
//
// Goal: zero behavior change on extraction day. When the four originating
// audits (audit-callbacks, audit-cross-topic-prereqs, audit-inline-links,
// audit-backlink-strength) had minor variations, this module picks the most
// general version; see the per-helper **Why:** notes.

// ─────────────────────────────────────────────────────────────────────────
// Regex escape.

/**
 * Escape a string for safe embedding inside `new RegExp(...)`.
 *
 * **Why:** audit-callbacks.mjs uses the most complete metachar set — it also
 * escapes `-`, `/`, `{`, `}` in addition to the standard
 * `. * + ? ^ $ ( ) | [ ] \`. The other three audits use the shorter standard
 * set. Over a valid concept title or anchor (the only inputs in practice),
 * both produce an identical regex: `-`, `/`, `{`, `}` outside a character
 * class are literal to `RegExp`, so escaping them is a no-op for the
 * resulting pattern semantics. We pick the more defensive superset so any
 * future caller that passes arbitrary user-controlled text still gets a
 * literal match.
 */
export function escapeRe(s) {
  return String(s).replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
}

// ─────────────────────────────────────────────────────────────────────────
// Title-in-prose regex.

/**
 * Build a case-insensitive, whole-word regex that matches a concept title in
 * prose. Whitespace between words is flexible (`\s+`). Unicode hyphens are
 * treated as interchangeable so "Sato–Tate measure" matches "Sato-Tate
 * measure" and variants.
 *
 * Pass `{ global: true }` for a `/gi` regex suitable for `.match()` counting;
 * default is `/i` (first match only), matching the plain call sites.
 *
 * **Why:** audit-backlink-strength.mjs already parameterized this with a
 * `{ global }` option; audit-cross-topic-prereqs.mjs always returned `/gi`
 * (and its callers re-constructed per-use); audit-inline-links.mjs inlined
 * the same pattern and stored `/i` on the vocab entry. Exposing `{ global }`
 * lets every caller's original intent survive with no behavior change.
 */
export function buildTitleRegex(title, { global = false } = {}) {
  const pattern =
    '\\b' +
    String(title)
      .split(/\s+/)
      .map((w) =>
        w
          .replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
          .replace(/[-‐-―]/g, '[-\\u2010-\\u2015]')
      )
      .join('\\s+') +
    '\\b';
  return new RegExp(pattern, global ? 'gi' : 'i');
}

// ─────────────────────────────────────────────────────────────────────────
// Title blocklist.

/**
 * Concept titles (lowercased) too short or too generic to match reliably
 * against English prose. Kept verbatim from audit-inline-links.mjs /
 * audit-cross-topic-prereqs.mjs, which carried identical sets.
 *
 * **Why:** both audits defined the same Set — so there is no variation to
 * reconcile. Shared here so future audits don't need to re-declare it.
 */
export const TITLE_BLOCKLIST = new Set([
  'sets', 'rank', 'limit', 'limits', 'functor', 'functors', 'group', 'groups',
  'ring', 'rings', 'field', 'fields', 'space', 'spaces', 'map', 'maps',
  'action', 'order', 'norm', 'degree', 'product', 'products', 'sum', 'sums',
  'number', 'numbers', 'point', 'points', 'line', 'lines', 'curve', 'curves',
  'surface', 'surfaces', 'trace', 'root', 'roots', 'base', 'basis', 'image',
  'kernel', 'range', 'domain', 'series', 'form', 'forms', 'module', 'modules',
  'ideal', 'ideals', 'genus', 'class', 'classes', 'algebra', 'algebras',
  'category', 'scheme', 'schemes', 'sheaf', 'sheaves', 'topology', 'manifold',
  'manifolds', 'function', 'functions', 'measure', 'measures', 'operator',
  'operators', 'set', 'integral', 'integrals', 'derivative', 'derivatives',
  'partition', 'partitions', 'period', 'periods', 'weight', 'level', 'index',
  'index.html', 'residue', 'residues',
]);

// Minimum title length: titles shorter than this are always skipped for
// prose-matching purposes (too many false positives in English).
export const MIN_TITLE_LEN = 5;

// ─────────────────────────────────────────────────────────────────────────
// Skip-zone masking.

/**
 * Mark `mask[i] = 1` for every `i` in `[start, end)`, clamped to mask length.
 * Works on both `Uint8Array` and plain boolean arrays (assignment to `1`
 * coerces identically in both).
 */
export function maskRegion(mask, start, end) {
  for (let i = start; i < end && i < mask.length; i++) mask[i] = 1;
}

/**
 * Build two parallel `Uint8Array(html.length)` masks over an HTML document:
 *
 *   - `mask`:          "match-ineligible" — used to veto candidate matches.
 *                      Includes container interiors, every HTML tag interior,
 *                      and KaTeX math spans ($…$, $$…$$, \(…\), \[…\]).
 *   - `containerMask`: "container interior" — used to decide whether an
 *                      opener (e.g. `<p class="…">`) sits inside a skip
 *                      container. Does NOT include arbitrary tag interiors,
 *                      so a `<p>` opener isn't itself considered masked just
 *                      because every HTML tag is technically a tag.
 *
 * Skip zones covered:
 *   - everything before `<body>`
 *   - balanced `<script> <style> <head> <svg> <pre> <code> <aside>` regions
 *   - balanced `<h1>` through `<h6>`
 *   - balanced `<a>` regions
 *   - `<div class="widget">…</div>` blocks (balanced-div scan)
 *   - KaTeX math spans: `$…$`, `$$…$$`, `\(…\)`, `\[…\]`
 *   - every HTML tag interior (so attribute values can't match)
 *
 * **Why:** audit-inline-links.mjs, audit-cross-topic-prereqs.mjs, and
 * audit-backlink-strength.mjs each carried a byte-for-byte equivalent copy.
 * The only non-comment variation was whether `mask[i]` was set to `true` or
 * `1`; both coerce identically for `Uint8Array`. This version unifies them.
 */
export function buildSkipMask(html) {
  const mask = new Uint8Array(html.length);
  const containerMask = new Uint8Array(html.length);

  // Everything before <body> is outside our interest — mark it all.
  const bodyM = html.match(/<body\b[^>]*>/i);
  if (bodyM) {
    maskRegion(mask, 0, bodyM.index + bodyM[0].length);
    maskRegion(containerMask, 0, bodyM.index + bodyM[0].length);
  }

  // Simple "balanced-by-name" scanner for tags with plain bodies. We walk
  // open/close pairs by name. For nested same-name tags we count depth, and
  // mask the outermost range.
  function maskBalanced(tagName) {
    const openRe = new RegExp(`<${tagName}\\b[^>]*?>`, 'gi');
    const closeRe = new RegExp(`</${tagName}\\s*>`, 'gi');
    const opens = [];
    let m;
    while ((m = openRe.exec(html))) opens.push(m.index + m[0].length);
    const closes = [];
    while ((m = closeRe.exec(html))) closes.push(m.index);
    const events = [];
    for (const o of opens) events.push({ at: o, kind: 'open' });
    for (const c of closes) events.push({ at: c, kind: 'close' });
    events.sort((a, b) => a.at - b.at);
    const outerStack = [];
    let depth = 0;
    for (const ev of events) {
      if (ev.kind === 'open') {
        if (depth === 0) outerStack.push(ev.at);
        depth++;
      } else {
        depth--;
        if (depth === 0) {
          const start = outerStack.pop();
          if (start !== undefined) {
            maskRegion(mask, start, ev.at);
            maskRegion(containerMask, start, ev.at);
          }
        }
        if (depth < 0) depth = 0; // defensive
      }
    }
  }

  for (const t of ['script', 'style', 'head', 'svg', 'pre', 'code', 'aside']) {
    maskBalanced(t);
  }
  for (let i = 1; i <= 6; i++) maskBalanced('h' + i);
  // <a …>…</a> — skip already-linked text.
  maskBalanced('a');

  // <div class="widget"> — only widgets, not every div.
  {
    const widgetOpenRe = /<div\b[^>]*\bclass=["'][^"']*\bwidget\b[^"']*["'][^>]*>/gi;
    let m;
    while ((m = widgetOpenRe.exec(html))) {
      const start = m.index;
      let depth = 1;
      const divOpenRe = /<div\b[^>]*>/gi;
      const divCloseRe = /<\/div\s*>/gi;
      divOpenRe.lastIndex = m.index + m[0].length;
      divCloseRe.lastIndex = m.index + m[0].length;
      let end = html.length;
      while (depth > 0) {
        divOpenRe.lastIndex = Math.max(divOpenRe.lastIndex, divCloseRe.lastIndex - 1);
        const o = divOpenRe.exec(html);
        const c = divCloseRe.exec(html);
        if (!c) break;
        if (o && o.index < c.index) {
          depth++;
          divCloseRe.lastIndex = o.index + o[0].length;
        } else {
          depth--;
          if (depth === 0) {
            end = c.index + c[0].length;
            break;
          }
          divOpenRe.lastIndex = c.index + c[0].length;
        }
      }
      maskRegion(mask, start, end);
      maskRegion(containerMask, start, end);
    }
  }

  // KaTeX math spans. Greedy for $$…$$ then $…$ then \(…\) then \[…\].
  function escapedAt(s, i) {
    let n = 0;
    for (let j = i - 1; j >= 0 && s[j] === '\\'; j--) n++;
    return n % 2 === 1;
  }
  // $$…$$
  {
    let i = 0;
    while (i < html.length - 1) {
      if (html[i] === '$' && html[i + 1] === '$' && !escapedAt(html, i)) {
        const start = i;
        let j = i + 2;
        while (j < html.length - 1) {
          if (html[j] === '$' && html[j + 1] === '$' && !escapedAt(html, j)) {
            maskRegion(mask, start, j + 2);
            i = j + 2;
            break;
          }
          j++;
        }
        if (j >= html.length - 1) break;
      } else {
        i++;
      }
    }
  }
  // $…$ (single-dollar)
  {
    let i = 0;
    while (i < html.length) {
      if (
        html[i] === '$' &&
        html[i + 1] !== '$' &&
        !escapedAt(html, i) &&
        !mask[i]
      ) {
        const start = i;
        let j = i + 1;
        while (j < html.length) {
          if (html[j] === '$' && html[j + 1] !== '$' && !escapedAt(html, j)) {
            maskRegion(mask, start, j + 1);
            i = j + 1;
            break;
          }
          j++;
        }
        if (j >= html.length) break;
      } else {
        i++;
      }
    }
  }
  // \(…\) and \[…\]
  for (const [openL, openR, closeL, closeR] of [
    ['\\', '(', '\\', ')'],
    ['\\', '[', '\\', ']'],
  ]) {
    let i = 0;
    while (i < html.length - 1) {
      if (html[i] === openL && html[i + 1] === openR) {
        const start = i;
        let j = i + 2;
        while (j < html.length - 1) {
          if (html[j] === closeL && html[j + 1] === closeR) {
            maskRegion(mask, start, j + 2);
            i = j + 2;
            break;
          }
          j++;
        }
        if (j >= html.length - 1) break;
      } else {
        i++;
      }
    }
  }

  // Mask every HTML tag interior so matches can't land inside attributes.
  {
    const tagRe = /<[^>]*>/g;
    let m;
    while ((m = tagRe.exec(html))) {
      maskRegion(mask, m.index, m.index + m[0].length);
    }
  }

  return { mask, containerMask };
}

// ─────────────────────────────────────────────────────────────────────────
// Section map.

/**
 * Return `[{ id, start, end }]` for every `<section id="…">…</section>` in
 * the document. Nested sections are handled by stacking; each entry's range
 * is `[open-tag-end, close-tag-start)`.
 *
 * Audit-inline-links.mjs and audit-backlink-strength.mjs carried identical
 * implementations.
 */
export function buildSectionMap(html) {
  const sections = [];
  const openRe = /<section\b([^>]*)>/gi;
  const closeRe = /<\/section\s*>/gi;
  const tokens = [];
  let m;
  while ((m = openRe.exec(html))) {
    const attrs = m[1];
    const idM = attrs.match(/\bid=["']([^"']+)["']/);
    tokens.push({
      at: m.index,
      kind: 'open',
      id: idM ? idM[1] : null,
      endTag: m.index + m[0].length,
    });
  }
  while ((m = closeRe.exec(html))) {
    tokens.push({ at: m.index, kind: 'close', endTag: m.index + m[0].length });
  }
  tokens.sort((a, b) => a.at - b.at);
  const stack = [];
  for (const t of tokens) {
    if (t.kind === 'open') {
      stack.push({ id: t.id, start: t.endTag });
    } else {
      const top = stack.pop();
      if (top) sections.push({ id: top.id, start: top.start, end: t.at });
    }
  }
  return sections;
}
