# counterexample-explorer

Pedagogical "which-hypotheses-fail" inspector. The author declares a list of
**hypotheses** (e.g. "continuous on [0,1]", "differentiable on (0,1)",
"monotonic") and a list of **candidate objects** (functions, sequences, sets);
for each candidate, the widget shows which hypotheses pass (green check) and
which fail (pink cross), with a short explanatory note per cell.

The widget emits an empty host div; the page-global library
[`js/widget-counterexample-explorer.js`](../../js/widget-counterexample-explorer.js)
builds chrome (header, dropdown, illustration area, hypothesis checklist) at
runtime via `MVCounterexampleExplorer.init('#widgetId', config)`.

## When to reach for it

Use `counterexample-explorer` when a topic is best taught by **enumerating
counterexamples** — ordered tours that ask "which hypothesis fails for this
object?" Examples:

- Continuous-but-not-differentiable: `f(x) = x` vs `|x|` vs `sin(1/x)` vs
  the Weierstrass function on a real-analysis page.
- Monotone-but-not-continuous: step functions vs strictly increasing curves
  on a measure-theory page.
- Group-theory: which subgroup is normal? which is abelian? — a row per
  candidate subgroup, columns for each property.

Pure declarative: the library does **not** evaluate functions or check
hypotheses dynamically. The author writes the pass/fail table by hand as
data, which keeps the widget honest about what's being asserted.

## Params

See [`schema.json`](./schema.json) for the authoritative definition.

| field | required | type / shape |
|---|---|---|
| `widgetId` | yes | DOM id for the host `<div class="widget">`. |
| `title` | yes | Header title. |
| `hint` | no | Header hint (default: library hint). |
| `viewBox` | no | SVG viewBox for the illustration (default `'0 0 320 160'`). |
| `hypotheses` | yes | Array of `{ id, label }` — one row per hypothesis in the checklist. |
| `cases` | yes | Array of `{ name, latex?, displayLabel?, svgInner?, hypotheses: { <id>: { pass, note? } } }`. |
| `sectionComment` | no | ARTIFACT — banner comment preserved when migrating sources. |

### Case shape

```json
{
  "name": "f(x) = |x|",
  "latex": "f(x) = |x|",
  "hypotheses": {
    "continuous":     { "pass": true },
    "differentiable": { "pass": false, "note": "corner at $x = 0$" },
    "monotonic":      { "pass": false },
    "bounded":        { "pass": true,  "note": "on $[-1, 1]$" }
  }
}
```

`latex` and `displayLabel` are alternative ways to render the candidate in
the illustration area; `svgInner` (raw SVG fragment) takes precedence when
present. `note` text supports KaTeX `$…$` delimiters.

## Alternate frontends

`hypotheses` and `cases` are pure data — a React / SSR consumer can ignore
`renderScript` entirely and walk the same arrays, rendering its own dropdown
and checklist. The pass/fail booleans are part of the contract, not derived
at runtime.

## Example

A canonical instance lives at [`example.json`](./example.json) (the
continuous-vs-differentiable family with `f(x) = x`, `|x|`, `sin(1/x)`, and
the Weierstrass function) and is consumed by
`scripts/test-widget-renderers.mjs` as the test fixture for this slug.
