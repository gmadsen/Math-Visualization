# atiyah-singer-cases

Bespoke widget for the atiyah-singer-index-theorem topic.

See [`../README.md`](../README.md) for the registry contract.

## What it does

Dictionary-style switcher across the four classical specialisations of the index theorem (Gauss-Bonnet, Hirzebruch signature, Riemann-Roch, Dirac), revealing the operator, index formula, and topological side per case. Bespoke because each case has hand-formatted equation rows that don't fit a generic case-table widget.

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
{ "type": "widget",        "slug": "atiyah-singer-cases", "params": { ... } },
{ "type": "widget-script", "slug": "atiyah-singer-cases", "params": { ... } }
```

Both blocks carry the same `params` object.
