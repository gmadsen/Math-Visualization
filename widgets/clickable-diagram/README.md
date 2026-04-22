# clickable-diagram

A **shared** widget module that drives several category-theory widgets from one
registry entry. Dispatches on the `interaction` field between two modes:

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

This demonstrates one renderer driving widgets that look structurally different
on the page: two of them have no SVG at all, the third has a full interactive
diagram. The shared surface is "one selection from a dictionary governs the
whole visualization."

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

## Byte-identity

Both exports produce strings that match the original inline bytes on
`category-theory.html` for each absorbed widget, so
`node scripts/render-topic.mjs category-theory | md5sum` continues to report
`d881aa187fc03464c93c5ae3cd155672`.
