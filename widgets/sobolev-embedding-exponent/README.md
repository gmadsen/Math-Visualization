# sobolev-embedding-exponent

Bespoke widget for the sobolev-spaces-distributions topic.

See [`../README.md`](../README.md) for the registry contract.

## What it does

Bespoke Sobolev-exponent calculator p* = np/(n-kp): vary n, k, p with sliders; verdict (subcritical / critical / supercritical) and the Hölder regularity index appear live. Captures the kp = n threshold as something the reader manipulates.

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
{ "type": "widget",        "slug": "sobolev-embedding-exponent", "params": { ... } },
{ "type": "widget-script", "slug": "sobolev-embedding-exponent", "params": { ... } }
```

Both blocks carry the same `params` object.
