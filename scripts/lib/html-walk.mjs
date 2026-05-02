// Depth-balanced HTML element walking. Shared by fix-a11y, audit-callbacks,
// audit-widget-interactivity, audit-utils, and read-prose — five places that
// each carried their own subtly-different copy of "given an open tag, find
// its matching close, account for same-name nesting".
//
// Why one helper: the variants disagree only on (a) whether to advance
// `lastIndex` paranoically (`Math.max(saved, c.end)`) vs simply (`c.end`),
// (b) whether to bail safety-counter at 100k iterations, (c) what shape to
// return. Convergence to one helper kills future drift.

const SAFETY_LIMIT = 100000;

// Find the matching close tag for an already-located opening tag.
//
// Inputs:
//   `html`     — full document text.
//   `openEnd`  — byte offset just past the opening tag's `>` (i.e. start of
//                the inner body). Caller has already matched the opener.
//   `tagName`  — unqualified element name ('div', 'section', 'svg').
//
// Returns { closeStart, closeEnd } where `closeStart` is the offset of the
// `<` of the matching `</tag>` and `closeEnd` is one past its `>`. Returns
// `null` on runaway (no close found, or > 100k iterations).
//
// Same-name children are tracked via depth counting. The `\b` boundary in
// the open regex prevents `<div` from matching `<divider`. Self-closing tags
// are not handled — none of the use sites need them.
export function matchClose(html, openEnd, tagName) {
  const openRe = new RegExp(`<${tagName}\\b[^>]*>`, 'gi');
  const closeRe = new RegExp(`</${tagName}\\s*>`, 'gi');
  openRe.lastIndex = openEnd;
  closeRe.lastIndex = openEnd;
  let depth = 1;
  let safety = 0;
  while (depth > 0) {
    if (++safety > SAFETY_LIMIT) return null;
    const savedOpen = openRe.lastIndex;
    const savedClose = closeRe.lastIndex;
    const o = openRe.exec(html);
    const c = closeRe.exec(html);
    if (!c) return null;
    if (o && o.index < c.index) {
      depth++;
      closeRe.lastIndex = Math.max(savedClose, o.index + o[0].length);
    } else {
      depth--;
      if (depth === 0) {
        return { closeStart: c.index, closeEnd: closeRe.lastIndex };
      }
      openRe.lastIndex = Math.max(savedOpen, c.index + c[0].length);
    }
  }
  return null;
}

// Convenience: given the start offset of an opening tag (the `<`), find the
// half-open range [outerStart, outerEnd) covering the entire element. Returns
// null if no opener actually starts at `openStart` or no close is found.
export function balancedRange(html, openStart, tagName) {
  const openRe = new RegExp(`<${tagName}\\b[^>]*>`, 'gi');
  openRe.lastIndex = openStart;
  const m = openRe.exec(html);
  if (!m || m.index !== openStart) return null;
  const openEnd = m.index + m[0].length;
  const close = matchClose(html, openEnd, tagName);
  if (!close) return null;
  return { outerStart: openStart, openEnd, closeStart: close.closeStart, outerEnd: close.closeEnd };
}
