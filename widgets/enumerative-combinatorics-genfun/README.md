# enumerative-combinatorics-genfun

Bespoke widget for the enumerative-combinatorics topic.

See [`../README.md`](../README.md) for the registry contract.

## What it does

Bespoke generating-function coefficient extractor: pick a series (e.g. 1/(1-x), exp(x), x/(1-x-x^2)) and read off [x^n] as n varies. Surfaces the dual view: closed-form generating function vs. its sequence of coefficients.

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
{ "type": "widget",        "slug": "enumerative-combinatorics-genfun", "params": { ... } },
{ "type": "widget-script", "slug": "enumerative-combinatorics-genfun", "params": { ... } }
```

Both blocks carry the same `params` object.
