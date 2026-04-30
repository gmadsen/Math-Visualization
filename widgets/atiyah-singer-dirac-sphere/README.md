# atiyah-singer-dirac-sphere

Bespoke widget for the atiyah-singer-index-theorem topic.

See [`../README.md`](../README.md) for the registry contract.

## What it does

Plots the Dirac operator spectrum on the round sphere $S^n$, with eigenvalues $\pm(k+n/2)/r$ as the radius slides. Bespoke because the eigenvalue ladder, multiplicity dots, and band-gap shading are tuned to the round-sphere case and don't extend to a generic spectrum widget.

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
{ "type": "widget",        "slug": "atiyah-singer-dirac-sphere", "params": { ... } },
{ "type": "widget-script", "slug": "atiyah-singer-dirac-sphere", "params": { ... } }
```

Both blocks carry the same `params` object.
