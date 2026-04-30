# harmonic-uncertainty

Bespoke widget for the harmonic-analysis-fourier topic.

See [`../README.md`](../README.md) for the registry contract.

## What it does

Bespoke Gaussian-uncertainty illustrator: the dual gaussians f_a and f-hat-a satisfy sigma_f * sigma_fhat = 1/(4 pi). Sliding a narrows f and widens f-hat in lockstep — visualizing the uncertainty principle via the family of dilations of one Gaussian.

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
{ "type": "widget",        "slug": "harmonic-uncertainty", "params": { ... } },
{ "type": "widget-script", "slug": "harmonic-uncertainty", "params": { ... } }
```

Both blocks carry the same `params` object.
