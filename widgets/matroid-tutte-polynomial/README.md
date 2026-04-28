# matroid-tutte-polynomial

Bespoke widget for the §7 Tutte polynomial on the
[`matroid-theory`](../../matroid-theory.html#tutte) topic.

See [`../README.md`](../README.md) for the registry contract.

## What it does

Bespoke widget for the §7 Tutte-polynomial calculator on the matroid-theory topic — three preset buttons choose the matroid ($U_{2,4}$ / $M(K_3)$ / $M(K_4)$), two sliders set $(x,y)$, and the readout reports $T_M(x,y)$ computed directly from $\sum_S (x-1)^{r(E)-r(S)}(y-1)^{|S|-r(S)}$ over all $2^{|E|}$ subsets, plus a table of canonical evaluations ($T(1,1)$ = number of bases, $T(2,1)$ = number of independent sets, etc.). The shape (preset row + slider row + readout) is bespoke; this slug captures it as one unit and keeps the rank-generating sum and the evaluation table opaque in the bodyScript artifact.

## Params

See [`schema.json`](./schema.json) for the authoritative shape. Summary:

| field            | kind        | purpose |
|---|---|---|
| `widgetId`       | fundamental | DOM id for the outer `<div class="widget">`. |
| `title`          | fundamental | Header title. |
| `hint`           | fundamental | Header hint. |
| `bodyMarkup`     | *artifact*  | Verbatim inner-body HTML (preset row, $(x,y)$ slider row, readout, trailing <div class="small"> note on the rank-generating sum). |
| `sectionComment` | *artifact*  | Optional `/* ... */` banner above the IIFE. |
| `bodyScript`     | *artifact*  | Verbatim IIFE body — maintains the current preset, sums the rank-generating expression over $2^{|E|}$ subsets, evaluates at the slider $(x,y)$, builds the canonical-evaluation table, updates the readout. |

## Usage

```json
{ "type": "widget",        "slug": "matroid-tutte-polynomial", "params": { ... } },
{ "type": "widget-script", "slug": "matroid-tutte-polynomial", "params": { ... } }
```

Both blocks carry the same `params` object.
