# group-cohomology-lhs-spectral

Bespoke widget for the group-cohomology topic.

See [`../README.md`](../README.md) for the registry contract.

## What it does

Bespoke hmtBcpage browser for the Lyndon-Hochschild-Serre spectral sequence of \to H\to G\to G/H\to 1$. The page is hand-tuned to a fixed family of small examples and would not migrate to a generic spectral-sequence widget.

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
{ "type": "widget",        "slug": "group-cohomology-lhs-spectral", "params": { ... } },
{ "type": "widget-script", "slug": "group-cohomology-lhs-spectral", "params": { ... } }
```

Both blocks carry the same `params` object.
