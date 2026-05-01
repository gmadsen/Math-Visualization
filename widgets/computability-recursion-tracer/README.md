# computability-recursion-tracer

Bespoke widget for the computability-and-decidability topic.

See [`../README.md`](../README.md) for the registry contract.

## What it does

Traces evaluation of primitive recursive schemes (composition, primitive recursion) with a step-controlled call tree. Bespoke because the call-tree layout and scheme palette are specific to recursion theory pedagogy and not reused elsewhere.

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
{ "type": "widget",        "slug": "computability-recursion-tracer", "params": { ... } },
{ "type": "widget-script", "slug": "computability-recursion-tracer", "params": { ... } }
```

Both blocks carry the same `params` object.
