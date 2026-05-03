// Heuristics for deriving widget metadata from a verbatim widget's bodyMarkup
// and bodyScript strings. Used by `migrate-inline-widgets-{typea,typeb}.mjs`
// (initial scaffolding) and by `fixup-verbatim-widget-meta.mjs` (post-PR-#70
// review-comment patch). Centralised here so the heuristic stays consistent
// across both code paths.

// Detect title and hint, allowing both `<div>` and `<span>` containers.  The
// corpus is split: most topics use `<div class="ttl">…</div>`, a few (e.g.
// differential-forms) use `<span class="ttl">…</span>` inside the `.hd` row.
export function extractTitleAndHint(html) {
  const ttl = html.match(/<(?:div|span) class="ttl">([\s\S]*?)<\/(?:div|span)>/);
  const hint = html.match(/<(?:div|span) class="hint">([\s\S]*?)<\/(?:div|span)>/);
  return {
    title: ttl ? ttl[1].trim() : '',
    hint: hint ? hint[1].trim() : '',
  };
}

// Decide the meta tuple (family, dimension, gesture, role) from the widget's
// markup + script. `family` is fixed at `"verbatim"` for slugs migrated from
// inline widgets. The heuristic table below is intentionally simple — enough
// to reflect each widget's real shape without speculating about behaviour the
// markup doesn't reveal. The output is deterministic given the inputs.
export function deriveMeta(bodyMarkup, bodyScript = '') {
  const m = String(bodyMarkup || '');
  const s = String(bodyScript || '');

  // Dimension: 3D widgets use either rotation drag (make3DDraggable) or a
  // <canvas> with explicit 3D content.  Without that we treat the widget as 2D.
  const dimension = /make3DDraggable|three\.js|three-mod|3d-drag/i.test(s)
    ? '3d'
    : '2d';

  // Static / illustrative widgets have no driving script and no interactive
  // controls.  Examples: gal-w1 is a `<table>` lookup; some svg-illustration-
  // shaped widgets too.
  const hasInputs = /<(input|select|button|textarea)\b/i.test(m);
  const hasScript = s.trim().length > 0;
  const hasMake3D = /make3DDraggable|drag3d/i.test(s);

  if (!hasInputs && !hasScript) {
    return {
      family: 'verbatim',
      dimension,
      gesture: 'static',
      role: 'illustration',
    };
  }

  // Gesture: check inputs in priority order.  A widget with a slider AND a
  // button is reported as `slider` (the more specific gesture), since the
  // slider tends to be the dominant interaction.
  let gesture = 'interact';
  if (hasMake3D || /\.dragging|pointermove[^"]*drag/i.test(s)) {
    gesture = 'drag';
  } else if (/<input[^>]*type="range"/i.test(m)) {
    gesture = 'slider';
  } else if (/<input[^>]*type="(?:number|text)"/i.test(m)) {
    gesture = 'input';
  } else if (/<select\b/i.test(m)) {
    gesture = 'select';
  } else if (/<button\b/i.test(m)) {
    gesture = 'click';
  }

  // Role: scripts that compute & display readouts are interactive computation;
  // pure visual tweaks (move a vector, watch curves redraw) are illustrative.
  // Without a clean signal we default to `interactive`.
  const role = 'interactive';

  return { family: 'verbatim', dimension, gesture, role };
}
