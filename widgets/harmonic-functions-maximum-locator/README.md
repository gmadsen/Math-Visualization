# harmonic-functions-maximum-locator

Bespoke widget for the harmonic-functions topic.

See [`../README.md`](../README.md) for the registry contract.

## What it does

Heatmap inside a disk of radius R with running boundary-max and interior-max markers. Confirms that harmonic functions attain their max on ∂B while non-harmonic candidates can have interior maxima.

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
{ "type": "widget",        "slug": "harmonic-functions-maximum-locator", "params": { ... } },
{ "type": "widget-script", "slug": "harmonic-functions-maximum-locator", "params": { ... } }
```

Both blocks carry the same `params` object.
