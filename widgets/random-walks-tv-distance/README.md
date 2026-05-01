# random-walks-tv-distance

Bespoke widget for the random-walks-and-mixing topic.

See [`../README.md`](../README.md) for the registry contract.

## What it does

Plot total-variation distance from the stationary distribution as a function of step count to see exponential decay.

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
{ "type": "widget",        "slug": "random-walks-tv-distance", "params": { ... } },
{ "type": "widget-script", "slug": "random-walks-tv-distance", "params": { ... } }
```

Both blocks carry the same `params` object.
