# simplicial-complexes-combinatorial-sr

Bespoke widget for the simplicial-complexes-combinatorial topic.

See [`../README.md`](../README.md) for the registry contract.

## What it does

Bespoke Stanley-Reisner ring constructor: pick facets to see I_K (the ideal of non-faces) and the surviving squarefree monomials. Bridges combinatorial complexes to commutative algebra.

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
{ "type": "widget",        "slug": "simplicial-complexes-combinatorial-sr", "params": { ... } },
{ "type": "widget-script", "slug": "simplicial-complexes-combinatorial-sr", "params": { ... } }
```

Both blocks carry the same `params` object.
