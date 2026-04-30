# atiyah-singer-symbol

Bespoke widget for the atiyah-singer-index-theorem topic.

See [`../README.md`](../README.md) for the registry contract.

## What it does

Visualises the principal symbol of canonical operators (Laplacian, Dirac, $\bar\partial$, signature) on $\mathbb{R}^2$, with selectable operator and zero-set overlay. Bespoke because the SVG draws operator-specific level curves and zero loci that don't generalise to a shared symbol-plotter widget.

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
{ "type": "widget",        "slug": "atiyah-singer-symbol", "params": { ... } },
{ "type": "widget-script", "slug": "atiyah-singer-symbol", "params": { ... } }
```

Both blocks carry the same `params` object.
