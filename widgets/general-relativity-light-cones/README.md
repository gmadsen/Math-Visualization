# general-relativity-light-cones

Bespoke widget for the general-relativity topic.

See [`../README.md`](../README.md) for the registry contract.

## What it does

Bespoke light-cones + vector-classification visualizer for general-relativity: drag the orange tip of a 4-vector and watch its causal class (timelike / null / spacelike) flip live. Concrete tactile entry into the Lorentzian quadratic form's signature.

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
{ "type": "widget",        "slug": "general-relativity-light-cones", "params": { ... } },
{ "type": "widget-script", "slug": "general-relativity-light-cones", "params": { ... } }
```

Both blocks carry the same `params` object.
