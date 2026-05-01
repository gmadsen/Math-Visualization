# mirror-quintic-counts

Bespoke widget for the mirror-symmetry topic.

See [`../README.md`](../README.md) for the registry contract.

## What it does

Clickable table of low-degree rational-curve counts on the quintic threefold (CdGP predictions); each row reveals provenance prose and a toggle exposes the generating-function form.

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
{ "type": "widget",        "slug": "mirror-quintic-counts", "params": { ... } },
{ "type": "widget-script", "slug": "mirror-quintic-counts", "params": { ... } }
```

Both blocks carry the same `params` object.
