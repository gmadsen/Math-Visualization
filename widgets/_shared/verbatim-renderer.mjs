// Shared verbatim renderer for slugs whose markup and driving script were
// migrated from inline `<div class="widget">` HTML (or from unstructured
// `type:"widget"` blocks without a slug) to a registry entry as part of the
// inline-widget zero-baseline sweep.
//
// The slug carries the widget's full markup and script as opaque strings
// (`params.bodyMarkup`, `params.bodyScript`) so byte-identical round-trip
// is preserved without rebuilding the markup/script generators per widget.
// Per-slug schemas constrain the strings minimally — the *registry membership*
// is what `audit-no-inline-widgets.mjs` and `stats-coverage.mjs` count, and
// per-slug schemas leave room for a future deeper migration that hoists each
// widget's actual semantic params (slider ranges, color tokens, etc.) out
// of the opaque body strings.
//
// The two functions are exported by name *and* module identity so that
// `scripts/test-widget-renderers.mjs` can detect verbatim slugs by reference
// (`mod.renderMarkup === verbatim.renderMarkup`) rather than by trusting the
// self-attested `meta.family` string in each schema.

export function renderMarkup(params) {
  if (typeof params?.bodyMarkup !== 'string') {
    throw new TypeError(
      'verbatim-renderer: params.bodyMarkup must be a string, got ' +
      (params?.bodyMarkup === undefined ? 'undefined' : typeof params.bodyMarkup),
    );
  }
  return params.bodyMarkup;
}

export function renderScript(params) {
  if (params?.bodyScript === undefined) {
    throw new TypeError('verbatim-renderer: params.bodyScript is missing');
  }
  if (typeof params.bodyScript !== 'string') {
    throw new TypeError(
      'verbatim-renderer: params.bodyScript must be a string, got ' +
      typeof params.bodyScript,
    );
  }
  return params.bodyScript;
}
