# schrodinger-figure

Bespoke widget for the **schrodinger-equation** topic. Absorbs all six
inline interactives on that page — wave-packet spreading, eigenstate
superposition + animate, harmonic-oscillator energy ladder, hydrogen
spectrum series picker, rectangular-barrier tunneling, and stationary-phase
classical-limit explorer.

See [`../README.md`](../README.md) for the registry contract and the
bespoke-vs-shared distinction. This module is on the bespoke side: every
schrodinger widget uses an idless `<div class="widget">` wrapper (no other
topic does that), and the row-of-controls shape varies (slider+span,
slider+span+button, three buttons, two slider rows, no row at all) in ways
that don't match any existing shared slug.

## What it does

Emits the standard widget chrome:

```
<div class="widget"[ id="…"]>
  <div class="hd"><div class="ttl">{title}</div>[<div class="hint">{hint}</div>]</div>
{bodyMarkup}  <svg id="…" viewBox="…" width="…" height="…"><title>…</title></svg>
  <div class="readout" id="…">[{readoutInitial}]</div>
</div>
```

`bodyMarkup` is the only freeform field — typically zero, one, or two
`<div class="row">…</div>` blocks each indented by two spaces, with a
trailing newline. It is dropped in verbatim. The driving `<script>` block
is `bodyScript` wrapped in `(function(){ … })();`.

## When to reach for it

You shouldn't, in general. This slug is scoped to schrodinger-equation —
it preserves byte-identity for that topic's six idless widgets. New
topics should reach for `parametric-plot`, `button-stepper`,
`clickable-diagram`, etc. If a future page genuinely needs an idless
`<div class="widget">` shape, generalize this module and rename it; do not
copy-paste.

## Params

See [`schema.json`](./schema.json) for the authoritative shape. Summary:

| field             | required | type / shape                                                |
|-------------------|----------|-------------------------------------------------------------|
| `widgetId`        | no       | DOM id for the outer `<div class="widget">`. Omit to emit `<div class="widget">` with no id. |
| `title`           | yes      | Header title (also default `<svg><title>` text).            |
| `hint`            | no       | Header hint shown in `.hd > .hint`.                         |
| `svg.id`          | yes      | `<svg id=…>`                                                 |
| `svg.viewBox`     | yes      | `<svg viewBox=…>`                                            |
| `svg.width`       | yes      | `<svg width=…>`                                              |
| `svg.height`      | yes      | `<svg height=…>`                                             |
| `svg.titleText`   | no       | `<title>` inner text (default `title`).                     |
| `readoutId`       | yes      | DOM id for the trailing `<div class="readout">`.            |
| `readoutInitial`  | no       | Initial inner HTML of the readout (default `""`).           |
| `bodyMarkup`      | yes (artifact) | Verbatim middle bytes between `.hd` line and `<svg>`. |
| `bodyScript`      | yes (artifact) | Verbatim JS body inside `(function(){ … })();`.       |
| `sectionComment`  | no (artifact)  | Optional `/* … */` banner above the IIFE.             |

`bodyMarkup` and `bodyScript` are *artifacts* — preserved byte-for-byte so
the vanilla-HTML site's round-trip stays exact. Portable consumers ignore
both and drive their own UI from a future structured `controls` + `draw`
field.

## Usage

Embed by adding two blocks to `content/schrodinger-equation.json`:

```json
{ "type": "widget",        "slug": "schrodinger-figure", "params": { … } },
{ "type": "widget-script", "slug": "schrodinger-figure", "params": { … } }
```

Both blocks carry the **same** `params` object.

Then run `node scripts/validate-widget-params.mjs` to AJV-validate, and
`node scripts/rebuild.mjs` for the full byte-identical round-trip gate.
