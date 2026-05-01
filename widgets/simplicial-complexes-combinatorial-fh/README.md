# simplicial-complexes-combinatorial-fh

Bespoke widget for the simplicial-complexes-combinatorial topic.

See [`../README.md`](../README.md) for the registry contract.

## What it does

Bespoke f-vector to h-vector converter: pick a complex and read the h-vector. The Dehn-Sommerville symmetry h_i = h_{d-i} is the visible test for the underlying complex being a sphere.

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
{ "type": "widget",        "slug": "simplicial-complexes-combinatorial-fh", "params": { ... } },
{ "type": "widget-script", "slug": "simplicial-complexes-combinatorial-fh", "params": { ... } }
```

Both blocks carry the same `params` object.
