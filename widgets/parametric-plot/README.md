# parametric-plot

A **shared** widget module covering the largest structural cluster in the
corpus: `slider-plot` (81), `slider-plot-actions` (~23), and
`select-slider-plot` (55) — combined 159 widgets across ~45 topics, ~35% of
the inline corpus (see [`../../audits/widget-families.md`](../../audits/widget-families.md)).

Dispatches on `interaction`:

- `"single-mode"` — `slider-plot` / `slider-plot-actions`. Header + SVG +
  one-or-more range sliders (each with a live echo `<span class="small">`) +
  optional action buttons + a readout div. First three absorbed widgets:
  **w-germ**, **w-chain**, **w-mono** on analytic-continuation.

- `"multi-mode"`  — `select-slider-plot`. Adds a `<select>` above the slider
  rows; each mode declares per-slider defaults and (optionally) a structured
  `draw` descriptor. No widgets migrated yet — schema is live for future
  pickups.

See [`../README.md`](../README.md) for the registry contract.

## Params (see `schema.json`)

### `"single-mode"`

| field | purpose | kind |
|---|---|---|
| `widgetId`, `svgId`, `outputId` | DOM ids | fundamental |
| `title`, `hint` | header strings | fundamental |
| `viewBox`, `svgWidth`, `svgHeight`, `svgTitle?` | SVG attrs (defaults `svgTitle = title`) | fundamental |
| `outputInitial?` | initial `innerHTML` of the readout (default `&nbsp;`) | fundamental |
| `sliders: [{id, label, min, max, step, init, outId?, initReadout?}]` | range controls + live-echo spans | fundamental |
| `buttons?: [{id, label}]` | optional action buttons (reset/apply/…) | fundamental |
| `sectionComment?` | **artifact**. Raw text for the `/* === Section N: … === */` banner above the IIFE. | artifact |
| `bodyScript` | **artifact**. Verbatim JS that runs inside `(function(){ … })();` — reads sliders, draws into SVG, writes the readout. Each absorbed widget has bespoke geometry; a portable consumer should ignore this and drive its own renderer. | artifact |

### `"multi-mode"`

Adds to the single-mode shape:

| field | purpose | kind |
|---|---|---|
| `pick: { id, label, options: [{value, label, selected?}] }` | `<select>` driving mode | fundamental |
| `modes: { <value>: { sliderDefaults?, draw?, … } }` | per-mode data | fundamental |
| `initialMode` | option value the IIFE starts on | fundamental |

## Byte-identity

`renderMarkup` + `renderScript` reproduce the original inline bytes for each
absorbed widget, so `node scripts/render-topic.mjs analytic-continuation | md5sum`
matches `md5sum analytic-continuation.html`. The rebuild chain's round-trip
gate enforces this on every run.

## Portability note

The `bodyScript` artifact is an intentional compromise: generalizing the 160
bespoke draw functions into a DSL is a larger design problem than this pass
wants to solve. The schema shape above is already rich enough for portable
consumers to render the *chrome* (slider rows, pick, buttons, readout) from
params — they just need a per-widget draw function of their own. Incremental
migration can replace the artifact string with a structured `draw` field as
each widget's geometry is ported.
