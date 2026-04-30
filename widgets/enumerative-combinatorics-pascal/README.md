# enumerative-combinatorics-pascal

Bespoke widget for the enumerative-combinatorics topic.

See [`../README.md`](../README.md) for the registry contract.

## What it does

Bespoke clickable Pascal's triangle for enumerative-combinatorics: clicking any cell highlights its two parents and shows the recursive sum C(n,k) = C(n-1,k-1) + C(n-1,k). Concrete entry into the recursion + explicit formula combination at the heart of binomial coefficients.

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
{ "type": "widget",        "slug": "enumerative-combinatorics-pascal", "params": { ... } },
{ "type": "widget-script", "slug": "enumerative-combinatorics-pascal", "params": { ... } }
```

Both blocks carry the same `params` object.
