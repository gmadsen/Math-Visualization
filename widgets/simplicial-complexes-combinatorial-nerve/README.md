# simplicial-complexes-combinatorial-nerve

Bespoke widget for the simplicial-complexes-combinatorial topic.

See [`../README.md`](../README.md) for the registry contract.

## What it does

Bespoke disk-cover nerve visualizer: slide r to grow disks over the plane; the nerve simplicial complex updates at the bottom. Concrete instance of the nerve theorem and a precursor to Cech complexes in topology.

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
{ "type": "widget",        "slug": "simplicial-complexes-combinatorial-nerve", "params": { ... } },
{ "type": "widget-script", "slug": "simplicial-complexes-combinatorial-nerve", "params": { ... } }
```

Both blocks carry the same `params` object.
