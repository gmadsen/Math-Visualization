# composition-explorer

A small interactive category-theory widget: displays a finite category as an SVG
diagram (objects as nodes, morphisms as arrows with identity loops), lets the
reader click two composable morphisms, and prints the composite per a fixed
composition table. First introduced on `category-theory.html` section `#cat`
as `w-cat`.

The `schema.json` describes the params: DOM ids for the widget container, SVG,
readout, and reset button; titles / hints / legends; `objects` (id, x, y);
`morphisms` (id, src, tgt, label, optional `loop` and `curve`); `composition`
(keyed by `"left.right"` — right applied first); and `compositionLines`, an
optional array-of-arrays grouping the composition table into visual rows so the
embedded script can be pretty-printed. Example `objects` entry:
`{ "id": "A", "x": 120, "y": 200 }`. A React consumer reads params from
`content/<topic>.json`, validates against `schema.json`, and renders however it
likes — the embedded `<script>` block is a browser-side convenience, not a
contract.

`index.mjs` exports two pure string-returning functions: `renderMarkup(params)`
emits the `<div class="widget">…</div>` HTML, and `renderScript(params)` emits
the `<script>…</script>` IIFE. Both outputs are byte-identical to the original
inline source on category-theory.html for the w-cat params, which is how the
round-trip test gate (`diff /tmp/ct-rendered.html category-theory.html`) stays
green.
