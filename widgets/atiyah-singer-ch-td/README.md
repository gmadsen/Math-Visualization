# atiyah-singer-ch-td

Bespoke widget for the atiyah-singer-index-theorem topic.

See [`../README.md`](../README.md) for the registry contract.

## What it does

Bar-chart breakdown of $\mathrm{ch}(E)\cdot\mathrm{Td}(TM_\mathbb{C})$ by degree as the manifold dimension and bundle rank slide, isolating the top-degree contribution that integrates to the index. Bespoke because the bars carry symbolic numerator/denominator labels tied to specific Todd-class coefficients, not a generic histogram.

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
{ "type": "widget",        "slug": "atiyah-singer-ch-td", "params": { ... } },
{ "type": "widget-script", "slug": "atiyah-singer-ch-td", "params": { ... } }
```

Both blocks carry the same `params` object.
