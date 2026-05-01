# sobolev-trace

Bespoke widget for the sobolev-spaces-distributions topic.

See [`../README.md`](../README.md) for the registry contract.

## What it does

Bespoke trace-norm balance for half-space H^s -> H^{s-1/2}: slide bulk smoothness s; boundary smoothness drops by exactly 1/2. Visualizes why the trace map loses half a derivative.

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
{ "type": "widget",        "slug": "sobolev-trace", "params": { ... } },
{ "type": "widget-script", "slug": "sobolev-trace", "params": { ... } }
```

Both blocks carry the same `params` object.
