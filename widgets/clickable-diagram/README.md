# clickable-diagram

A **shared** widget module that drives several topic widgets from one
registry entry. Dispatches on the `interaction` field between three modes:

- `"readout-only"` — a `<select>` dropdown over a small list of options, paired
  with a `<div class="readout">`. A DATA dictionary keyed by option value feeds
  a template-literal formatter. Absorbs:
  - **w-univ** (§ "Universal properties and representability") — construction
    → (representing object, represented functor, universal element,
    factoring property).
  - **w-mon** (§ "Monoidal categories") — ambient monoidal category → what a
    monoid object is in it.

- `"proof-stepper"` — a `<select>` of proof topics plus ◀ back / next ▶ /
  reset buttons, an SVG diagram showing the proof's nodes and arrows (given +
  derived, with identity loops where needed), and two readouts (step caption
  + "established equations" log). A PROOFS dictionary carries the full proof
  data per option. Absorbs:
  - **w-proof** (§ "Proof play") — three worked proofs
    (identity-uniqueness, initial-object uniqueness, product uniqueness).

- `"svg-diagram"` — the `select-diagram` family: one or more controls
  (typically a `<select>`, sometimes with range sliders or extra buttons)
  driving a bespoke `<svg>` redraw plus a `<div class="readout">`. The chrome
  (widget wrapper, header, row of controls, SVG attrs, readout) is
  reconstructed from structured fields; the inner-HTML of the controls row
  and the driving `<script>` body are carried verbatim as artifacts because
  each absorbed widget's draw/compute logic is unique. Absorbs:
  - **w-multcalc** (bezout § "Intersection multiplicity") — two selects pick
    two plane curves through the origin; the SVG plots both curves and the
    readout reports the intersection multiplicity $I_P(f,g)$.
  - **w-res** (bezout § "Resultants — a computational tool") — a select picks
    one of four sample univariate pairs; the SVG marks the resultant's roots
    (with multiplicity) on an $x$-axis and the readout spells out
    $\text{Res}_y(f,g)$.
  - **w-cubic** (bezout § "Worked examples") — two range sliders and two
    selects pick $P, Q$ on an elliptic curve; the SVG draws the curve,
    points, chord/tangent, and the Bézout-forced third point.

This demonstrates one renderer driving widgets that look structurally different
on the page: two of them have no SVG at all, three have a full interactive
diagram. The shared surface is "one selection (or control set) governs the
whole visualization, with portable `cases` data and artifact literals for
byte-identical legacy output."

## Params (see `schema.json`)

`renderMarkup` / `renderScript` both branch on `interaction`.

### `"readout-only"`

| field | purpose | kind |
| --- | --- | --- |
| `widgetId`, `pickId`, `outputId` | DOM ids on the widget wrapper, `<select>`, and readout `<div>` | fundamental |
| `title`, `hint`, `pickLabel` | widget-header strings + the `<label>` prefix | fundamental |
| `options: [{value, label, selected?}]` | `<option>` list | fundamental |
| `cases: { <value>: { <field>: string } }` | portable data — what each selected option renders | fundamental |
| `dataLiteral` | **artifact**. Verbatim JS text for the `const DATA = {…};` literal; preserves irregular source alignment (e.g. w-mon has `set:  {` vs `ab:   {` for manual column alignment). A portable renderer should regenerate this from `cases` and ignore the field. | artifact |
| `templateLiteral` | **artifact**. Verbatim JS text for the backtick-literal chain on the right of `out.textContent = …`. Preserves original newlines and `\n` escapes. | artifact |

### `"proof-stepper"`

| field | purpose | kind |
| --- | --- | --- |
| `widgetId`, `pickId`, `prevId`, `nextId`, `resetId`, `counterId`, `svgId`, `outputTextId`, `outputLogId` | DOM ids | fundamental |
| `title`, `hint`, `pickLabel` | widget-header strings | fundamental |
| `prevLabel`, `nextLabel`, `resetLabel` | button text | fundamental |
| `options: [{value, label, selected?}]` | `<option>` list for the proof picker | fundamental |
| `svgViewBox` | SVG viewBox (e.g. `"0 0 560 320"`) | fundamental |
| `svgWidthAttr`, `svgStyleAttr`, `outputLogStyleAttr` | **artifact**. The w-proof widget uses `width="100%" style="max-width:560px"` on the SVG and `style="margin-top:.4rem;min-height:1.6em"` on the log readout — unusual among the topic's widgets. Exposed as raw string params so the renderer can emit them verbatim. | artifact |
| `initialKey` | the option value the IIFE starts on (`let key = '…'`) | fundamental |
| `cases: { <key>: { title, intro, nodes, given, steps } }` | portable proof data | fundamental |
| `proofsLiteral` | **artifact**. Verbatim JS text for `const PROOFS = {…};`. The original source has irregular alignment (`x: 130, y:  80` with double space to align columns across proofs) and a `// arrows keyed by id` comment inside the `identity` entry — both preserved. A portable consumer should regenerate from `cases`. | artifact |

### `"svg-diagram"`

| field | purpose | kind |
| --- | --- | --- |
| `widgetId`, `svgId`, `outputId` | DOM ids on the widget wrapper, `<svg>`, and readout `<div>` | fundamental |
| `title`, `hint` | widget-header strings | fundamental |
| `svgViewBox` | SVG viewBox (e.g. `"0 0 620 320"`) | fundamental |
| `svgWidthAttr`, `svgHeightAttr` | **artifact**. Raw width/height attr values on the `<svg>` — typically px numbers like `"620"` / `"320"` but could be `"100%"`. | artifact |
| `svgTitle` | text inside the `<svg>`'s inner `<title>` — usually the widget title | fundamental |
| `layout` | `"controls-first"` (row above svg — the common case) or `"svg-first"` (svg above row — used by `w-cubic`) | fundamental |
| `controls: [{kind, id?, label?, options?, min?, max?, step?, value?, spanId?, …}]` | optional portable description of the controls row — a React consumer can build real inputs from this | fundamental (optional) |
| `controlsLiteral` | **artifact**. Verbatim inner HTML of the `<div class="row">` block — the full sequence of `<label>`s, `<select>`s, `<input type="range">`s, `<span>` readouts, and buttons with original whitespace and indentation. A portable consumer ignores this and uses `controls`. | artifact |
| `cases: { … }` | optional portable data dictionary keyed by select-value — shape varies per widget, present mostly as documentation for React consumers | fundamental (optional) |
| `scriptBodyLiteral` | **artifact**. Verbatim content of the driving `<script>` block (excluding the `<script>`/`</script>` tags themselves). Includes the leading `(function(){` and trailing `})();` plus all the bespoke `FNS` / `DATA` / `MULT` tables and draw/compute logic. A portable consumer drives its own renderer from `controls` + `cases` and ignores this. | artifact |

## Byte-identity

Both exports produce strings that match the original inline bytes for each
absorbed widget, so
`node scripts/render-topic.mjs category-theory | md5sum` continues to report
`d881aa187fc03464c93c5ae3cd155672`, and
`node scripts/render-topic.mjs bezout | md5sum` equals `md5sum bezout.html`.
