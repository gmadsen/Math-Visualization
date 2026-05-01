# group-cohomology-hilbert-90

Bespoke widget for the group-cohomology topic.

See [`../README.md`](../README.md) for the registry contract.

## What it does

Bespoke Hilbert 90 demonstrator that factors a chosen norm-one element of $\mathbb{Q}(i)^\times$ as $\sigma(\alpha)/\alpha$. The arithmetic is field-extension-specific to this topic and would not transfer to a shared widget.

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
{ "type": "widget",        "slug": "group-cohomology-hilbert-90", "params": { ... } },
{ "type": "widget-script", "slug": "group-cohomology-hilbert-90", "params": { ... } }
```

Both blocks carry the same `params` object.
