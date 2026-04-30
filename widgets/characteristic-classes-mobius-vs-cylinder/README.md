# characteristic-classes-mobius-vs-cylinder

Bespoke widget for the characteristic-classes topic.

See [`../README.md`](../README.md) for the registry contract.

## What it does

Bespoke side-by-side cylinder vs Möbius band figure for the characteristic-classes topic, walking a non-vanishing section around the base circle to expose orientation reversal. The dual-SVG layout with synchronized slider, two readouts, and an orientation toggle button doesn't reduce to a shared parametric-plot or stepper shape.

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
{ "type": "widget",        "slug": "characteristic-classes-mobius-vs-cylinder", "params": { ... } },
{ "type": "widget-script", "slug": "characteristic-classes-mobius-vs-cylinder", "params": { ... } }
```

Both blocks carry the same `params` object.
