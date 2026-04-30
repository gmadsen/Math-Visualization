# extremal-combinatorics-removal

Bespoke widget for the extremal-combinatorics topic.

See [`../README.md`](../README.md) for the registry contract.

## What it does

Bespoke triangle-removal-lemma toy: slide epsilon to see the implied delta frontier; toggle 'robust' to see how supersaturation strengthens the lemma. Visualises the existential statement that delta n^3 triangles cannot all be erased by removing fewer than epsilon n^2 edges.

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
{ "type": "widget",        "slug": "extremal-combinatorics-removal", "params": { ... } },
{ "type": "widget-script", "slug": "extremal-combinatorics-removal", "params": { ... } }
```

Both blocks carry the same `params` object.
