# atiyah-singer-index-family

Bespoke widget for the atiyah-singer-index-theorem topic.

See [`../README.md`](../README.md) for the registry contract.

## What it does

Plots the eigenvalue spectrum of a 1-parameter family of $1\times 1$ chiral operators on $S^1$, illustrating how the index counts net spectral flow across zero. Bespoke because the figure renders a discrete eigenvalue lattice on a continuous parameter axis with a custom crossing-counter readout, not a pattern reusable across the corpus.

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
{ "type": "widget",        "slug": "atiyah-singer-index-family", "params": { ... } },
{ "type": "widget-script", "slug": "atiyah-singer-index-family", "params": { ... } }
```

Both blocks carry the same `params` object.
