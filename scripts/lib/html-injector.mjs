// Shared helpers for the `inject-*` scripts.
//
// Every inject-* script that uses fenced blocks follows the same recipe:
//   1. Read an HTML file.
//   2. Locate a fenced block delimited by
//        <!-- <name>-auto-begin -->  ...  <!-- <name>-auto-end -->
//      (or, for CSS, /* <name>-auto-begin */ ... /* <name>-auto-end */).
//   3. Strip any existing fenced block — consuming whatever adjacent
//      whitespace is needed to keep re-insertion byte-stable.
//   4. Re-insert a freshly-built block at a target anchor.
//   5. Write only when bytes actually changed.
//
// This module owns (2), (3), (5) and a matching detector for audit reporting.
// Block *construction* and *where/how to splice* stay in callers — those
// decisions vary meaningfully per script. This module just removes the
// fence-regex / write-if-changed boilerplate.
//
// Zero external dependencies.

import { readFileSync, writeFileSync } from 'node:fs';

// ---------------------------------------------------------------------------
// Fence construction.
// ---------------------------------------------------------------------------

/**
 * Build the literal fence tokens for a given name + style.
 *
 *   makeFence('breadcrumb-head')
 *     → { begin: '<!-- breadcrumb-head-auto-begin -->',
 *         end:   '<!-- breadcrumb-head-auto-end -->' }
 *
 *   makeFence('display-prefs-css', 'css')
 *     → { begin: '/* display-prefs-css-auto-begin * /',
 *         end:   '/* display-prefs-css-auto-end * /' }
 *
 * `style`:
 *   'html'  (default) — HTML comment fences
 *   'css'             — CSS /* *\/ comment fences
 */
export function makeFence(name, style = 'html') {
  if (style === 'css') {
    return {
      begin: `/* ${name}-auto-begin */`,
      end: `/* ${name}-auto-end */`,
    };
  }
  return {
    begin: `<!-- ${name}-auto-begin -->`,
    end: `<!-- ${name}-auto-end -->`,
  };
}

// Escape a literal for use inside a regex.
function reEscape(s) {
  return s.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
}

// Build the regex that matches one fenced block. `trim` controls which
// surrounding whitespace the match also consumes — see `stripFence`.
function fenceRegex(name, { style = 'html', trim = {} } = {}) {
  const escName = reEscape(name);
  const openPat =
    style === 'css'
      ? `\\/\\*\\s*${escName}-auto-begin\\s*\\*\\/`
      : `<!--\\s*${escName}-auto-begin\\s*-->`;
  const closePat =
    style === 'css'
      ? `\\/\\*\\s*${escName}-auto-end\\s*\\*\\/`
      : `<!--\\s*${escName}-auto-end\\s*-->`;
  const leadNewline  = trim.leadingNewline   ? '\\n?'    : '';
  const leadIndent   = trim.leadingIndent    ? '[ \\t]*' : '';
  const trailInline  = trim.trailingInlineWs ? '[ \\t]*' : '';
  const trailNewline = trim.trailingNewline  ? '\\n?'    : '';
  const pat =
    `${leadNewline}${leadIndent}${openPat}[\\s\\S]*?${closePat}${trailInline}${trailNewline}`;
  return new RegExp(pat, 'g');
}

// ---------------------------------------------------------------------------
// Detection (for audit-mode callers).
// ---------------------------------------------------------------------------

/**
 * Locate one fenced block. Returns
 *   { start, end, content } — offsets of the fence tokens (begin-open and
 *                             end-close), plus the inner content string.
 *   null — if no block found.
 *
 * This is the "plain" locator — no surrounding-whitespace trim. Use
 * `stripFence` when you need to remove a block along with its leading/
 * trailing whitespace.
 */
export function detectBlock(html, name, { style = 'html' } = {}) {
  const { begin, end } = makeFence(name, style);
  const re = new RegExp(`(${reEscape(begin)})([\\s\\S]*?)(${reEscape(end)})`);
  const m = re.exec(html);
  if (!m) return null;
  const start = m.index;
  const blockEnd = start + m[0].length;
  const contentStart = start + m[1].length;
  const contentEnd = blockEnd - m[3].length;
  return {
    start,
    end: blockEnd,
    content: html.slice(contentStart, contentEnd),
  };
}

// ---------------------------------------------------------------------------
// Stripping.
// ---------------------------------------------------------------------------

/**
 * Remove every occurrence of the named fenced block, optionally consuming
 * surrounding whitespace so that re-insertion at the same spot is
 * byte-stable.
 *
 * `trim` keys (all default false):
 *   leadingNewline    — also consume one '\n' immediately before the fence
 *   leadingIndent     — also consume [ \t]* immediately before the fence
 *   trailingInlineWs  — also consume [ \t]* immediately after the fence
 *   trailingNewline   — also consume one '\n' immediately after the fence
 *
 * Returns { html, removed }.
 */
export function stripFence(html, name, { style = 'html', trim = {} } = {}) {
  const re = fenceRegex(name, { style, trim });
  let removed = 0;
  const out = html.replace(re, () => {
    removed++;
    return '';
  });
  return { html: out, removed };
}

// ---------------------------------------------------------------------------
// Block wrapping.
// ---------------------------------------------------------------------------

/**
 * Wrap `content` in the named fence. Default layout:
 *
 *   begin\ncontent\nend
 *
 * Pass `sep: ''` for inline layout (begin + content + end with no newlines
 * — the shape used by breadcrumb's nav block).
 */
export function wrapBlock(name, content, { style = 'html', sep = '\n' } = {}) {
  const { begin, end } = makeFence(name, style);
  return begin + sep + content + sep + end;
}

// ---------------------------------------------------------------------------
// Insertion helpers.
// ---------------------------------------------------------------------------

/**
 * Splice `block` into `html` immediately before the match of `anchorRe`,
 * placing it on its own line. Walks back over any leading [ \t]* on the
 * anchor's line and prepends a '\n' if the fence would not otherwise be at
 * column 0. Matches the indent-aware layout used by several inject scripts.
 *
 * Returns the new HTML, or null if `anchorRe` did not match.
 */
export function insertBeforeAnchor(html, anchorRe, block) {
  const m = anchorRe.exec(html);
  if (!m) return null;
  const insertAt = m.index;
  let lineStart = insertAt;
  while (
    lineStart > 0 &&
    (html[lineStart - 1] === ' ' || html[lineStart - 1] === '\t')
  ) {
    lineStart--;
  }
  const needsLeadingNewline = lineStart > 0 && html[lineStart - 1] !== '\n';
  const pre = needsLeadingNewline ? '\n' : '';
  return html.slice(0, lineStart) + pre + block + '\n' + html.slice(lineStart);
}

/**
 * Splice `block` into `html` immediately before the match of `anchorRe`,
 * preserving the anchor line's existing indent. The caller supplies its own
 * indent prefix (e.g. '  ') for the block; we re-emit the original indent
 * after the block so the anchor line stays put. Mirrors the "CSS-fence
 * inside <style>" layout.
 *
 * Returns the new HTML, or null if `anchorRe` did not match.
 */
export function insertBeforeAnchorKeepingIndent(html, anchorRe, block, blockIndent = '') {
  const m = anchorRe.exec(html);
  if (!m) return null;
  const insertAt = m.index;
  let lineStart = insertAt;
  while (
    lineStart > 0 &&
    (html[lineStart - 1] === ' ' || html[lineStart - 1] === '\t')
  ) {
    lineStart--;
  }
  const indent = html.slice(lineStart, insertAt);
  const needsLeadingNewline = lineStart > 0 && html[lineStart - 1] !== '\n';
  const pre = needsLeadingNewline ? '\n' : '';
  return (
    html.slice(0, lineStart) +
    pre + blockIndent + block + '\n' + indent +
    html.slice(insertAt)
  );
}

/**
 * If `html`'s <style> block already contains text matching `presenceRe`,
 * return `html` unchanged. Otherwise splice `cssRules` in just before the
 * first </style>, followed by a single newline. Returns the new HTML.
 *
 * Used by inject-* scripts that each ship their own scoped CSS block and
 * want to ensure it's present exactly once.
 */
export function ensureCss(html, presenceRe, cssRules) {
  if (presenceRe.test(html)) return html;
  const m = /<\/style>/i.exec(html);
  if (!m) return html;
  return html.slice(0, m.index) + cssRules + '\n' + html.slice(m.index);
}

// ---------------------------------------------------------------------------
// Disk I/O.
// ---------------------------------------------------------------------------

/**
 * Write `newHtml` to `path` only when it differs from `oldHtml`. Returns
 * `true` when bytes were written, `false` otherwise. Emits nothing — the
 * caller owns the user-facing report.
 */
export function writeIfChanged(path, oldHtml, newHtml) {
  if (newHtml === oldHtml) return false;
  writeFileSync(path, newHtml);
  return true;
}

/**
 * Convenience: read a file as UTF-8.
 */
export function readHtml(path) {
  return readFileSync(path, 'utf8');
}
