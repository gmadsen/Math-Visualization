# sobolev-pairing

Bespoke widget for the sobolev-spaces-distributions topic.

See [`../README.md`](../README.md) for the registry contract.

## What it does

Bespoke distributional-pairing visualizer for sobolev-spaces-distributions: pick a distribution T (delta, derivative-of-delta, principal value 1/x, etc.) and slide a test function phi; the readout reports the pairing <T, phi>. The combination of pick-from-curated-list + slider over phi + live integral readout is bespoke.

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
{ "type": "widget",        "slug": "sobolev-pairing", "params": { ... } },
{ "type": "widget-script", "slug": "sobolev-pairing", "params": { ... } }
```

Both blocks carry the same `params` object.
