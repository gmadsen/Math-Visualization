# ant-sieve-truncation

Bespoke widget for the analytic-number-theory topic.

See [`../README.md`](../README.md) for the registry contract.

## What it does

Bespoke comparison of truncated inclusion–exclusion against the exact sieve count for the analytic-number-theory topic. The side-by-side bar visualization with parity-of-truncation explanation is purpose-built for sieve theory pedagogy.

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
{ "type": "widget",        "slug": "ant-sieve-truncation", "params": { ... } },
{ "type": "widget-script", "slug": "ant-sieve-truncation", "params": { ... } }
```

Both blocks carry the same `params` object.
