# k-theory-chern-character

Bespoke widget for the k-theory topic.

See [`../README.md`](../README.md) for the registry contract.

## What it does

Slide d and n to read off the Chern character ch(O(d)) on CP^n, showing the ring isomorphism K(CP^n) tensor Q ≅ H^*(CP^n; Q).

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
{ "type": "widget",        "slug": "k-theory-chern-character", "params": { ... } },
{ "type": "widget-script", "slug": "k-theory-chern-character", "params": { ... } }
```

Both blocks carry the same `params` object.
