# sobolev-weak-derivative

Bespoke widget for the sobolev-spaces-distributions topic.

See [`../README.md`](../README.md) for the registry contract.

## What it does

Bespoke weak-derivative visualizer: switch between functions with jumps or kinks (Heaviside, abs(x), sawtooth) and watch the green trace render the distributional derivative as a sum of classical pieces plus delta-spikes at jumps.

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
{ "type": "widget",        "slug": "sobolev-weak-derivative", "params": { ... } },
{ "type": "widget-script", "slug": "sobolev-weak-derivative", "params": { ... } }
```

Both blocks carry the same `params` object.
