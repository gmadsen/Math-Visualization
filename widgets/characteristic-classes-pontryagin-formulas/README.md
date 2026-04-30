# characteristic-classes-pontryagin-formulas

Bespoke widget for the characteristic-classes topic.

See [`../README.md`](../README.md) for the registry contract.

## What it does

Bespoke formula-card stepper for the characteristic-classes topic that builds (E)$ from formal Chern roots of \otimes_\mathbb{R}\mathbb{C}$, cycling through $, $, and the total class via preset buttons. The katex-heavy formula display tied to a button-trio doesn't fit the shared button-stepper schema's prev/next contract.

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
{ "type": "widget",        "slug": "characteristic-classes-pontryagin-formulas", "params": { ... } },
{ "type": "widget-script", "slug": "characteristic-classes-pontryagin-formulas", "params": { ... } }
```

Both blocks carry the same `params` object.
