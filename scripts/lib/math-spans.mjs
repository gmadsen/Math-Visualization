// Shared math-span extraction for KaTeX delimiters used across the notebook.
//
// KaTeX delimiters in this project (per AGENTS.md § House conventions):
//   $…$    inline
//   $$…$$  display
//   \(…\)  inline
//   \[…\]  display
//
// `extractSpans(s)` walks a string left-to-right and returns every math span
// it finds plus any structural errors (unclosed / orphaned delimiters). At each
// position it tries, in order: `$$` (greedy, beats `$`), `$`, `\(`, `\[`. A `\`
// immediately before a `$` escapes it (`\$` is a literal dollar, not a delim).
//
// Originally lived inside validate-katex.mjs; lifted here so audits that need
// to reason about "what's inside the math vs. outside it" (e.g.
// audit-math-rendering-leaks.mjs) share one battle-tested extractor rather than
// re-deriving the escaping / greedy-`$$` rules.

export function escapedAt(s, i) {
  // Is the character at s[i] escaped by an odd number of preceding backslashes?
  let n = 0;
  for (let j = i - 1; j >= 0 && s[j] === '\\'; j--) n++;
  return n % 2 === 1;
}

export function findDelimClose(s, startInside, opener) {
  // Search for the closing counterpart of `opener`, starting from index
  // `startInside` (just after the opener). Return the index of the close
  // token's first character, or -1 if not found. Honors backslash escaping
  // for the dollar closes.
  if (opener === '$$') {
    for (let i = startInside; i < s.length - 1; i++) {
      if (s[i] === '$' && s[i + 1] === '$' && !escapedAt(s, i)) return i;
    }
    return -1;
  }
  if (opener === '$') {
    for (let i = startInside; i < s.length; i++) {
      // Don't match a `$$` as a single-`$` close.
      if (s[i] === '$' && s[i + 1] !== '$' && !escapedAt(s, i)) return i;
    }
    return -1;
  }
  if (opener === '\\(') {
    for (let i = startInside; i < s.length - 1; i++) {
      if (s[i] === '\\' && s[i + 1] === ')') return i;
    }
    return -1;
  }
  if (opener === '\\[') {
    for (let i = startInside; i < s.length - 1; i++) {
      if (s[i] === '\\' && s[i + 1] === ']') return i;
    }
    return -1;
  }
  return -1;
}

// Returns { spans, errors } where each span is
//   { kind, open, close, body, startIdx, endIdx }
// `body` is the inner text (delimiters excluded); `startIdx`/`endIdx` bracket
// the whole span including delimiters.
export function extractSpans(s) {
  const spans = [];
  const localErrors = [];
  let i = 0;
  while (i < s.length) {
    const c = s[i];
    const next = s[i + 1];

    // Try `$$` first (greedy beats `$`).
    if (c === '$' && next === '$' && !escapedAt(s, i)) {
      const openAt = i;
      const innerStart = i + 2;
      const closeAt = findDelimClose(s, innerStart, '$$');
      if (closeAt === -1) {
        localErrors.push(`unclosed $$…$$ opened at offset ${openAt}`);
        i = s.length;
        break;
      }
      spans.push({
        kind: '$$', open: '$$', close: '$$',
        body: s.slice(innerStart, closeAt),
        startIdx: openAt,
        endIdx: closeAt + 2,
      });
      i = closeAt + 2;
      continue;
    }

    if (c === '$' && !escapedAt(s, i)) {
      const openAt = i;
      const innerStart = i + 1;
      const closeAt = findDelimClose(s, innerStart, '$');
      if (closeAt === -1) {
        localErrors.push(`unclosed $…$ opened at offset ${openAt}`);
        i = s.length;
        break;
      }
      spans.push({
        kind: '$', open: '$', close: '$',
        body: s.slice(innerStart, closeAt),
        startIdx: openAt,
        endIdx: closeAt + 1,
      });
      i = closeAt + 1;
      continue;
    }

    if (c === '\\' && next === '(') {
      const openAt = i;
      const innerStart = i + 2;
      const closeAt = findDelimClose(s, innerStart, '\\(');
      if (closeAt === -1) {
        localErrors.push(`unclosed \\(…\\) opened at offset ${openAt}`);
        i = s.length;
        break;
      }
      spans.push({
        kind: '\\(', open: '\\(', close: '\\)',
        body: s.slice(innerStart, closeAt),
        startIdx: openAt,
        endIdx: closeAt + 2,
      });
      i = closeAt + 2;
      continue;
    }

    if (c === '\\' && next === '[') {
      const openAt = i;
      const innerStart = i + 2;
      const closeAt = findDelimClose(s, innerStart, '\\[');
      if (closeAt === -1) {
        localErrors.push(`unclosed \\[…\\] opened at offset ${openAt}`);
        i = s.length;
        break;
      }
      spans.push({
        kind: '\\[', open: '\\[', close: '\\]',
        body: s.slice(innerStart, closeAt),
        startIdx: openAt,
        endIdx: closeAt + 2,
      });
      i = closeAt + 2;
      continue;
    }

    // Stray `\)` or `\]` outside any open span is an orphan close.
    if (c === '\\' && (next === ')' || next === ']')) {
      localErrors.push(`orphan \\${next} close at offset ${i}`);
      i += 2;
      continue;
    }

    i++;
  }
  return { spans, errors: localErrors };
}
