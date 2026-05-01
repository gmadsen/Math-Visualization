# harmonic-functions-poisson-extension

Bespoke widget for the harmonic-functions topic.

See [`../README.md`](../README.md) for the registry contract.

## What it does

Disk with a draggable boundary point sourcing a Poisson kernel; the kernel and its harmonic extension on the disk are plotted side by side. Builds intuition that the Poisson formula reproduces boundary values smoothly inside.

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
{ "type": "widget",        "slug": "harmonic-functions-poisson-extension", "params": { ... } },
{ "type": "widget-script", "slug": "harmonic-functions-poisson-extension", "params": { ... } }
```

Both blocks carry the same `params` object.
