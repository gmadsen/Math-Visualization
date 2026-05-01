# pde-sobolev-embedding

Bespoke widget for the partial-differential-equations topic.

See [`../README.md`](../README.md) for the registry contract.

## What it does

Bespoke Sobolev-embedding chart for the §6 regularity section on the partial-differential-equations topic — k, p, n sliders drive a chart locating W^{k,p}(R^n) inside continuous / Holder / L^q regimes per the embedding theorems. The exponent-slider trio plus regime-coloring chart doesn't fit a shared slug.

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
{ "type": "widget",        "slug": "pde-sobolev-embedding", "params": { ... } },
{ "type": "widget-script", "slug": "pde-sobolev-embedding", "params": { ... } }
```

Both blocks carry the same `params` object.
