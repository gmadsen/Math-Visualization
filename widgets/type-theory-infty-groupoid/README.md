# type-theory-infty-groupoid

Bespoke widget for the type-theory-and-hott topic.

See [`../README.md`](../README.md) for the registry contract.

## What it does

Bespoke widget for the §6 type ↦ ∞-groupoid figure on the type-theory-and-hott topic. Reader cycles through dimensions: 0-cells (points), 1-cells (paths), 2-cells (homotopies); the SVG accumulates higher cells with each click. The dimension-stepper + layered SVG cell rendering doesn't fit a shared slug.

## Params

See [`schema.json`](./schema.json) for the authoritative shape. Summary:

| field            | kind        | purpose |
|---|---|---|
| `widgetId`       | fundamental | DOM id for the outer `<div class="widget">`. |
| `title`          | fundamental | Header title. |
| `hint`           | fundamental | Header hint. |
| `bodyMarkup`     | *artifact*  | Verbatim inner-body HTML (controls, SVG, readouts). |
| `sectionComment` | *artifact*  | Optional `/* ... */` banner above the IIFE. |
| `bodyScript`     | *artifact*  | Verbatim IIFE body. |

## Usage

```json
{ "type": "widget",        "slug": "type-theory-infty-groupoid", "params": { ... } },
{ "type": "widget-script", "slug": "type-theory-infty-groupoid", "params": { ... } }
```

Both blocks carry the same `params` object.
