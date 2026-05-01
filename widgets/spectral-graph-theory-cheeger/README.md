# spectral-graph-theory-cheeger

Bespoke widget for the spectral-graph-theory topic.

See [`../README.md`](../README.md) for the registry contract.

## What it does

Bespoke sweep-cut explorer for Cheeger's inequality: scan a threshold over the Fiedler vector; the cut conductance phi(S) is plotted, demonstrating the sweep-cut bound phi <= sqrt(2 lambda_2).

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
{ "type": "widget",        "slug": "spectral-graph-theory-cheeger", "params": { ... } },
{ "type": "widget-script", "slug": "spectral-graph-theory-cheeger", "params": { ... } }
```

Both blocks carry the same `params` object.
