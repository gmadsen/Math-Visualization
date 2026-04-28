# matroid-greedy-vs-nonmatroid

Bespoke widget for the §6 greedy success/failure on the
[`matroid-theory`](../../matroid-theory.html#greedy) topic.

See [`../README.md`](../README.md) for the registry contract.

## What it does

Bespoke widget for the §6 greedy-on-matroid-vs-non-matroid demonstration on the matroid-theory topic — six edge-weight sliders feed a comparison: greedy on $M(K_4)$ (which exhaustively matches the optimum spanning tree) vs. greedy on a curated non-matroid family $\mathcal{F}$ (where greedy commits early and misses the bigger triple). The shape (six sliders + SVG + readout + non-matroid family annotation) is bespoke; this slug captures it as one unit and keeps the spanning-tree search and the non-matroid greedy run opaque in the bodyScript artifact.

## Params

See [`schema.json`](./schema.json) for the authoritative shape. Summary:

| field            | kind        | purpose |
|---|---|---|
| `widgetId`       | fundamental | DOM id for the outer `<div class="widget">`. |
| `title`          | fundamental | Header title. |
| `hint`           | fundamental | Header hint. |
| `bodyMarkup`     | *artifact*  | Verbatim inner-body HTML (two slider rows (six edges total), SVG host for the comparison, readout, trailing <div class="small"> annotation of the non-matroid family). |
| `sectionComment` | *artifact*  | Optional `/* ... */` banner above the IIFE. |
| `bodyScript`     | *artifact*  | Verbatim IIFE body — reads the six weights, runs greedy + brute-force on $M(K_4)$, runs greedy on the non-matroid $\mathcal{F}$, draws both side by side, updates the readout. |

## Usage

```json
{ "type": "widget",        "slug": "matroid-greedy-vs-nonmatroid", "params": { ... } },
{ "type": "widget-script", "slug": "matroid-greedy-vs-nonmatroid", "params": { ... } }
```

Both blocks carry the same `params` object.
