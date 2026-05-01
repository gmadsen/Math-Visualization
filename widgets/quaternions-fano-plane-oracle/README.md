# quaternions-fano-plane-oracle

Bespoke widget for the quaternions-octonions-and-division-algebras topic.

See [`../README.md`](../README.md) for the registry contract.

## What it does

Fano plane multiplication oracle: click two basis vectors among e1..e7; the oracle highlights the unique line through them and reads off the product (with sign).

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
{ "type": "widget",        "slug": "quaternions-fano-plane-oracle", "params": { ... } },
{ "type": "widget-script", "slug": "quaternions-fano-plane-oracle", "params": { ... } }
```

Both blocks carry the same `params` object.
