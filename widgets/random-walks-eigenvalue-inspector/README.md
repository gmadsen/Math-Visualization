# random-walks-eigenvalue-inspector

Bespoke widget for the random-walks-and-mixing topic.

See [`../README.md`](../README.md) for the registry contract.

## What it does

Inspect the spectrum of a transition matrix; the second-largest eigenvalue controls the spectral gap and mixing rate.

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
{ "type": "widget",        "slug": "random-walks-eigenvalue-inspector", "params": { ... } },
{ "type": "widget-script", "slug": "random-walks-eigenvalue-inspector", "params": { ... } }
```

Both blocks carry the same `params` object.
