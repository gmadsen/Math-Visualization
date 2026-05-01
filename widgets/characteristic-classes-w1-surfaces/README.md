# characteristic-classes-w1-surfaces

Bespoke widget for the characteristic-classes topic.

See [`../README.md`](../README.md) for the registry contract.

## What it does

Bespoke surface-selector for the characteristic-classes topic that compares $ of the tangent bundle on the four canonical surfaces (^2$, torus, $\mathbb{RP}^2$, Klein bottle), with diagnostic readout per choice. The combined surface-button strip + custom SVG layout + orientability readout doesn't fit the shared button-stepper or clickable-diagram families.

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
{ "type": "widget",        "slug": "characteristic-classes-w1-surfaces", "params": { ... } },
{ "type": "widget-script", "slug": "characteristic-classes-w1-surfaces", "params": { ... } }
```

Both blocks carry the same `params` object.
