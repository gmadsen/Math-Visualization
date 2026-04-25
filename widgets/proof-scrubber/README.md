# proof-scrubber

Timeline-style walkthrough of a multi-step proof. The widget emits an empty
host div; at runtime the page-global library
[`js/widget-proof-scrubber.js`](../../js/widget-proof-scrubber.js) builds the
chrome (header, step chips, slider + play/pause, optional SVG diagram, and a
text readout) by calling `MVProofScrubber.init('#widgetId', config)`.

## When to reach for it

Use `proof-scrubber` when a topic is best taught as an ordered sequence of
states with prose narration and (optional) per-step diagrams — e.g.

- Geometric proofs that animate intermediate constructions (Pythagoras,
  Pappus, Desargues).
- Algebraic manipulations where each step transforms an equation displayed
  alongside.
- Group-theory arguments tracking elements through a cosets/normalizers
  lattice.

If the diagram changes continuously rather than in discrete steps, use a
slider widget (`parametric-plot` / `surface-viewer`) instead.

## Params

See [`schema.json`](./schema.json) for the authoritative definition. Summary:

| field          | required | type / shape                                                |
|----------------|----------|-------------------------------------------------------------|
| `widgetId`     | yes      | DOM id for the host `<div class="widget">`.                 |
| `title`        | yes      | Header title shown in `.hd > .ttl`.                          |
| `hint`         | no       | Header hint shown in `.hd > .hint` (default: library hint). |
| `viewBox`      | no       | SVG viewBox for the diagram (default `'0 0 320 160'`).      |
| `autoplayMs`   | no       | Per-step dwell during play, in ms (default 2000, min 400).  |
| `steps`        | yes      | Ordered array of `{ title, body, svgInner? }`.              |
| `sectionComment` | no     | ARTIFACT — banner comment preserved when migrating sources. |

### Step shape

```json
{
  "title": "Step title",
  "body":  "HTML body. Supports KaTeX: $a^2 + b^2 = c^2$.",
  "svgInner": "<rect x='40' y='40' width='40' height='40' fill='var(--blue)'/>"
}
```

`body` is rendered as HTML inside a `.readout` block, then KaTeX
auto-render walks it for `$…$` / `$$…$$` / `\(…\)` / `\[…\]`. `svgInner`
is appended verbatim to the diagram SVG on step change — use SVG element
tags directly (no `xmlns` needed). Omit `svgInner` for text-only steps.

## Alternate frontends

`steps` is pure data — a React / SSR consumer can ignore `renderScript`
entirely and walk the `steps` array, rendering its own player chrome and
mounting `svgInner` into a React-managed SVG.

## Example

A canonical instance lives at [`example.json`](./example.json) (a 5-step
geometric proof of the Pythagorean theorem) and is consumed by
`scripts/test-widget-renderers.mjs` as the test fixture for this slug.
