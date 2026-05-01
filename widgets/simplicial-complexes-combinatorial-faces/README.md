# simplicial-complexes-combinatorial-faces

Bespoke widget for the simplicial-complexes-combinatorial topic.

See [`../README.md`](../README.md) for the registry contract.

## What it does

Bespoke face explorer for simplicial complexes: click a facet to toggle it; the complex closes downward automatically (every subset of a face is a face). Hands-on entry into the face-set definition.

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
{ "type": "widget",        "slug": "simplicial-complexes-combinatorial-faces", "params": { ... } },
{ "type": "widget-script", "slug": "simplicial-complexes-combinatorial-faces", "params": { ... } }
```

Both blocks carry the same `params` object.
