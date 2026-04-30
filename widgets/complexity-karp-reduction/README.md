# complexity-karp-reduction

Bespoke widget for the complexity-theory topic.

See [`../README.md`](../README.md) for the registry contract.

## What it does

Draws a directed graph of Karp reductions between canonical NP-complete problems (3-SAT, Clique, Vertex Cover, Hamiltonian Cycle, Subset Sum, ...) and lets the reader trace polynomial-time chains. Bespoke because the node set and edge labels are specific to NP-completeness pedagogy and not generic graph data.

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
{ "type": "widget",        "slug": "complexity-karp-reduction", "params": { ... } },
{ "type": "widget-script", "slug": "complexity-karp-reduction", "params": { ... } }
```

Both blocks carry the same `params` object.
