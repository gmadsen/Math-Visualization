// Shared HTML-escape helper for widget renderers.
//
// Author-controlled string fields (`title`, `hint`, etc.) are interpolated
// into renderMarkup output. The corpus convention is that those fields can
// carry KaTeX delimiters ($…$) but not raw HTML — a stray `<` should not be
// rendered as an opening tag. This helper does the minimal escape: `&`, `<`,
// `>`, `"`, `'`. KaTeX delimiters and backslashes pass through untouched
// because they're not HTML-special.
//
// Used by the `<topic>-*` bespoke slug families (hamiltonians-*, three-body-*,
// matroid-*, schrodinger-figure) where renderMarkup interpolates `title` and
// `hint` directly into HTML and a corpus-wide escape pass is otherwise
// inconsistent. The shared registry slugs (parametric-plot, etc.) already
// escape inline.

const HTML_ESC = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
};

export function escapeHtml(s) {
  if (s == null) return '';
  return String(s).replace(/[&<>"']/g, (c) => HTML_ESC[c]);
}
