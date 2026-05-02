// Shared script-scanning helpers for the content pipeline.
//
// Used by extract-topic.mjs (initial HTML → JSON conversion) and
// repair-widget-scripts.mjs (post-hoc script-block repair). Both need:
//   1. Locate every <script>…</script> tag in a string of HTML.
//   2. Determine which DOM ids a script's body references, so each script
//      can be paired with its driving widget.
//
// Keeping these in one module avoids the prior drift risk between the two
// callsites.

// Locate every <script>…</script> in `html`.
//
// Returns [{ start, end, tagEnd, full, inner }, …]:
//   start     byte index of '<script…>' opener
//   end       byte index just past '</script>' closer
//   tagEnd    byte index of the opener's closing '>'
//   full      the whole match (opener + body + closer)
//   inner     just the body between opener and closer
//
// Robust against substring traps like "<scriptish" by checking that the
// character following "<script" is whitespace or '>'.
export function findScripts(html) {
  const out = [];
  const OPEN = '<script';
  const OPEN_CLOSE = '</script>';
  let i = 0;
  while (i < html.length) {
    const o = html.indexOf(OPEN, i);
    if (o === -1) break;
    const after = html.charCodeAt(o + OPEN.length);
    if (!(after === 32 || after === 9 || after === 10 || after === 13 || after === 62)) {
      i = o + OPEN.length;
      continue;
    }
    const tagEnd = html.indexOf('>', o);
    if (tagEnd === -1) break;
    const close = html.indexOf(OPEN_CLOSE, tagEnd + 1);
    if (close === -1) break;
    const end = close + OPEN_CLOSE.length;
    out.push({
      start: o,
      end,
      tagEnd,
      full: html.slice(o, end),
      inner: html.slice(tagEnd + 1, close),
    });
    i = end;
  }
  return out;
}

// Scan a script body for id selectors and return the set of referenced ids.
// Handles `$('#id')`, `$("#id")`, `document.getElementById('id')`,
// `querySelector('#id')`, `querySelectorAll('#id')`.
export function referencedIdsInScript(scriptInner) {
  const ids = new Set();
  const dollarRe = /\$\(\s*['"]#([A-Za-z_][\w-]*)['"]/g;
  const gebRe = /getElementById\(\s*['"]([A-Za-z_][\w-]*)['"]/g;
  const qsRe = /querySelector(?:All)?\(\s*['"]#([A-Za-z_][\w-]*)/g;
  let m;
  while ((m = dollarRe.exec(scriptInner)) !== null) ids.add(m[1]);
  while ((m = gebRe.exec(scriptInner)) !== null) ids.add(m[1]);
  while ((m = qsRe.exec(scriptInner)) !== null) ids.add(m[1]);
  return ids;
}
