# complexity-savitch-recursion

Bespoke widget for the complexity-theory topic.

See [`../README.md`](../README.md) for the registry contract.

## What it does

Visualises Savitch's theorem by recursively halving a path-existence query into midpoint subqueries, showing how NL's reachability fits into PSPACE via O(log^2 n) space. Bespoke because the recursion tree's midpoint splitting is the conceptual core of NL ⊆ PSPACE and not a general algorithm visualizer.

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
{ "type": "widget",        "slug": "complexity-savitch-recursion", "params": { ... } },
{ "type": "widget-script", "slug": "complexity-savitch-recursion", "params": { ... } }
```

Both blocks carry the same `params` object.
