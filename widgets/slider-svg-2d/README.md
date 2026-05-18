# slider-svg-2d

Shared chrome renderer for the standard interactive widget pattern:

```
<div class="widget">
  <div class="hd"><div class="ttl">{title}</div><div class="hint">{hint}</div></div>
  <div class="row">{N sliders / buttons / status spans}</div>
  <svg id="…-svg" viewBox="…">…</svg>
  <div class="readout" id="…-readout"></div>
</div>
```

Replaces the per-page verbatim-renderer slugs (where chrome and bespoke
draw script were both opaque strings) by pulling the slider config, SVG
sizing, and readout id into typed params. The driving script stays as
a `script` param because each widget's draw logic is genuinely bespoke.

## Why a single shared slug

Before: 140+ verbatim-renderer slugs corpus-wide (`spec-frd`, `spec-lap`,
`oc-w1`, `mathbio-w3`, …), each its own `widgets/<slug>/` directory with
an identical `renderMarkup` re-export and a per-widget schema that
accepts only `bodyMarkup`/`bodyScript` opaque strings. AJV can verify
"the strings are non-empty", nothing more. Alt frontends can render
the verbatim HTML but get no structured handle on sliders, colors,
or geometry.

After: one shared slug, typed params. AJV checks slider ranges, SVG
viewBox format, readout id pattern. Alt frontends read `params.controls`
as a structured list and can render real React controls (the bespoke
draw logic still has to be re-implemented per widget, but at least the
chrome is no longer a stringly-typed cliff).

## Params

```json
{
  "widgetId": "",
  "title": "Truncating compact $K$ to rank $r$",
  "hint": "Compact $\\Leftrightarrow$ approximated in norm by finite-rank.",
  "controls": [
    { "type": "slider", "id": "frd-r",     "label": "truncation rank $r$", "min": 1, "max": 20, "value": 5 },
    { "type": "slider", "id": "frd-alpha", "label": "decay $\\sigma_n = n^{-\\alpha}$", "min": 5, "max": 25, "value": 10 },
    { "type": "span",   "id": "frd-stat" }
  ],
  "svg":     { "id": "frd-svg", "viewBox": "0 0 640 280", "width": 640, "height": 280 },
  "readout": true,
  "bodyScript": "<script>(function(){ … bespoke draw logic … })();</script>"
}
```

### controls

Ordered array of control items rendered inside `.row` in source order.
One of:

- `{ "type": "slider", "id", "label", "min", "max", "value", "step"? }` —
  renders `<label>{label}<input id="{id}" type="range" min=… max=… value=…></label>`.
  `label` may contain KaTeX `$...$`.
- `{ "type": "button", "id", "text" }` — renders `<button id="{id}">{text}</button>`.
- `{ "type": "span", "id", "class"?, "text"? }` — renders
  `<span id="{id}" class="{class|small}">{text|''}</span>`. The driving
  script usually fills the text on first draw.

### readout

- `true` — emit `<div class="readout" id="{svg-prefix}-readout"></div>`
  where the svg-prefix is `svg.id` minus the trailing `-svg`. The
  driving script writes to `document.getElementById(...)`.
- `false` — omit the readout div entirely.
- `{ "id": "...", "class"? }` — explicit id (e.g. when the SVG id is
  `kernel-svg` but the readout id is `kernel-readout` and you want
  the renderer to use that exact id rather than deriving it).

### bodyScript

Verbatim `<script>(function(){ ... })();</script>` block. Held opaque
intentionally — each widget's draw logic is bespoke (axes, bars, level
lines, curve sampling, …) and the chrome migration is independent of
any future declarative-render rewrite. Named `bodyScript` (not `script`)
so the XSS lint in `validate-widget-params.mjs` accepts the embedded
`<script>` tag via its passthrough allowlist.

## Migration

`scripts/migrate-to-slider-svg-2d.mjs` converts a topic's verbatim slider
slugs in place:

```bash
node scripts/migrate-to-slider-svg-2d.mjs <topic> <verbatim-slug> [...]
```

It parses each verbatim block's `bodyMarkup`, builds the typed params,
verifies the new renderer's output is **byte-identical** to the
original `bodyMarkup` before saving, and writes the new block to
`content/<topic>.json`. After running, delete the now-unused
`widgets/<verbatim-slug>/` directories and re-run `node scripts/rebuild.mjs`.

## Audit classification

`audit-widget-interactivity.mjs` classifies slider-svg-2d widgets as
**interactive** (they have `<input type="range">`), so the migration is
neutral on the static-widgets baseline.
