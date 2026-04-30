# simplicial-complexes-combinatorial-persistence

Bespoke widget for the simplicial-complexes-combinatorial topic.

See [`../README.md`](../README.md) for the registry contract.

## What it does

Bespoke Vietoris-Rips persistence demo: slide r to fire faces; the H_1 persistence bar tracks the birth and death of a loop. Concrete entry into persistent homology as a multi-scale topological invariant.

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
{ "type": "widget",        "slug": "simplicial-complexes-combinatorial-persistence", "params": { ... } },
{ "type": "widget-script", "slug": "simplicial-complexes-combinatorial-persistence", "params": { ... } }
```

Both blocks carry the same `params` object.
