# characteristic-classes-poincare-hopf

Bespoke widget for the characteristic-classes topic.

See [`../README.md`](../README.md) for the registry contract.

## What it does

Bespoke Poincaré-Hopf demonstrator for the characteristic-classes topic that toggles between ^2$ and ^2$ tangent vector fields, drawing zeros with their indices and totaling them against the Euler characteristic. The surface-toggle plus index-annotated zero markers on a custom SVG layout doesn't reduce to a shared clickable-diagram.

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
{ "type": "widget",        "slug": "characteristic-classes-poincare-hopf", "params": { ... } },
{ "type": "widget-script", "slug": "characteristic-classes-poincare-hopf", "params": { ... } }
```

Both blocks carry the same `params` object.
