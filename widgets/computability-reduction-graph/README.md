# computability-reduction-graph

Bespoke widget for the computability-and-decidability topic.

See [`../README.md`](../README.md) for the registry contract.

## What it does

Graph of many-one reductions between decision problems, with selectable source/target showing direction of reducibility. Bespoke because the node set and edge labels enumerate a fixed catalogue of reduction-theory examples particular to this section.

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
{ "type": "widget",        "slug": "computability-reduction-graph", "params": { ... } },
{ "type": "widget-script", "slug": "computability-reduction-graph", "params": { ... } }
```

Both blocks carry the same `params` object.
