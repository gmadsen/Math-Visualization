# k-theory-bott-periodicity

Bespoke widget for the k-theory topic.

See [`../README.md`](../README.md) for the registry contract.

## What it does

Scrub n through the period-2 pattern of homotopy groups pi_n(U) and period-8 pattern of pi_n(O), making Bott periodicity tactile.

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
{ "type": "widget",        "slug": "k-theory-bott-periodicity", "params": { ... } },
{ "type": "widget-script", "slug": "k-theory-bott-periodicity", "params": { ... } }
```

Both blocks carry the same `params` object.
