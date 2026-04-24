// declarative-host widget — SHARED renderer for widgets that ship as an empty
// `<div class="widget" id="…"></div>` host and delegate all DOM construction
// to a well-known page-global library (`MVPatternInduction`, `MVDiagramEditor`).
//
// The widget contributes NO bespoke script: the only work done per-widget is a
// single `<library>.init('#widgetId', config)` call. That makes the `config`
// object the entire data surface — a portable (React / SSR / whatever)
// frontend can ignore renderScript and drive its own component directly from
// `library` + `config`.
//
// Exports two pure string-returning functions:
//
//   renderMarkup(params)  -> <div class="widget" id="..."> ... </div>
//   renderScript(params)  -> <script> ... </script>
//
// Both are pure functions of params (no I/O). See ./schema.json for the
// authoritative params shape and ./README.md for the porting story.

// -- Markup helpers -----------------------------------------------------------

function renderTitleTag(title, titleTag) {
  const tag = titleTag === 'span' ? 'span' : 'div';
  return `<${tag} class="ttl">${title}</${tag}>`;
}

function renderHintTag(hint, hintTag) {
  if (typeof hint !== 'string' || hint.length === 0) return '';
  const tag = hintTag === 'span' ? 'span' : 'div';
  return `<${tag} class="hint">${hint}</${tag}>`;
}

// -- Public API ---------------------------------------------------------------

export function renderMarkup(params) {
  const { widgetId, title, hint, titleTag, hintTag } = params;

  // The common case: an empty host div. The shared library builds its own
  // header, body, and controls at init-time, so we don't emit a `.hd` block.
  if (typeof title !== 'string' || title.length === 0) {
    return `<div class="widget" id="${widgetId}"></div>`;
  }

  // Rare case: the caller asked for a pre-rendered `.hd` header on the host
  // div (some libraries respect existing children). We emit it in the same
  // shape as button-stepper for visual consistency.
  const hintHtml = renderHintTag(hint, hintTag);
  const hdLine = `  <div class="hd">${renderTitleTag(title, titleTag)}${hintHtml}</div>\n`;
  return (
    `<div class="widget" id="${widgetId}">\n` +
    hdLine +
    `</div>`
  );
}

// Emit the config object as JS source. Output is valid JSON (which is also
// valid JS for the library's `init` consumer); objects expand one key per
// line, but arrays whose elements are all primitives or all primitive-arrays
// stay on one line — so `examples: [[1,1],[2,3]]` survives intact instead of
// blowing up into 9 lines of nested brackets.
//
// Indented two spaces past the `.init(` call, which sits at col 2 inside the
// IIFE — matching the button-stepper indentation convention.
function isLeafPrimitive(v) {
  return v === null || typeof v !== 'object';
}

function isPrimitiveArray(arr) {
  return Array.isArray(arr) && arr.every(isLeafPrimitive);
}

function formatValue(value, indent) {
  if (isLeafPrimitive(value)) return JSON.stringify(value);
  if (Array.isArray(value)) {
    if (value.length === 0) return '[]';
    // Leaf primitives on one line: [1, 2, "x"].
    if (isPrimitiveArray(value)) {
      return '[' + value.map((v) => JSON.stringify(v)).join(', ') + ']';
    }
    // Array of primitive-arrays on one line: [[1,1],[2,3]].
    if (value.every(isPrimitiveArray)) {
      return (
        '[' +
        value
          .map((row) => '[' + row.map((v) => JSON.stringify(v)).join(',') + ']')
          .join(', ') +
        ']'
      );
    }
    // Heterogeneous / nested-object arrays: expand one item per line.
    const inner = indent + '  ';
    const parts = value.map((v) => inner + formatValue(v, inner));
    return '[\n' + parts.join(',\n') + '\n' + indent + ']';
  }
  // Plain object — one key per line.
  const keys = Object.keys(value);
  if (keys.length === 0) return '{}';
  const inner = indent + '  ';
  const parts = keys.map(
    (k) => inner + JSON.stringify(k) + ': ' + formatValue(value[k], inner),
  );
  return '{\n' + parts.join(',\n') + '\n' + indent + '}';
}

function formatConfig(config) {
  // Initial indent is two spaces (the IIFE body level); the opening `{` sits
  // after `.init('#id', `, same line as the call.
  return formatValue(config, '  ');
}

export function renderScript(params) {
  const { widgetId, library, config, sectionComment } = params;

  const commentLine = typeof sectionComment === 'string' && sectionComment.length > 0
    ? `/* ${sectionComment} */\n`
    : '';

  return (
    `<script>\n` +
    commentLine +
    `(function(){\n` +
    `  if(!window.${library}) return;\n` +
    `  ${library}.init('#${widgetId}', ${formatConfig(config)});\n` +
    `})();\n` +
    `</script>`
  );
}
