# variational-isoperimetric

Bespoke widget for the variational-methods topic.

See [`../README.md`](../README.md) for the registry contract.

## What it does

Isoperimetric tradeoff — perturb a disk by a Fourier mode; the readout tracks how area shrinks faster than perimeter under any non-trivial deformation, isolating the disk as the unique minimiser.

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
{ "type": "widget",        "slug": "variational-isoperimetric", "params": { ... } },
{ "type": "widget-script", "slug": "variational-isoperimetric", "params": { ... } }
```

Both blocks carry the same `params` object.
