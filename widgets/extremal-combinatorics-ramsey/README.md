# extremal-combinatorics-ramsey

Bespoke widget for the extremal-combinatorics topic.

See [`../README.md`](../README.md) for the registry contract.

## What it does

Bespoke R(3, 3) = 6 edge-coloring puzzle: click edges of K_5 or K_6 to flip their colors; verify R(3,3) <= 6 by exhibiting a monochromatic K_3 in every K_6 coloring and a coloring of K_5 without one.

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
{ "type": "widget",        "slug": "extremal-combinatorics-ramsey", "params": { ... } },
{ "type": "widget-script", "slug": "extremal-combinatorics-ramsey", "params": { ... } }
```

Both blocks carry the same `params` object.
