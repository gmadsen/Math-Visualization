# characteristic-classes-c1-clutching

Bespoke widget for the characteristic-classes topic.

See [`../README.md`](../README.md) for the registry contract.

## What it does

Bespoke clutching-map demo for the characteristic-classes topic that visualizes line bundles on ^2$ via an integer winding number $, drawing the (1)hmtBcvalued clutching map ^1\to U(1)$ as a winding loop. The integer-only slider tied to a winding-curve SVG plus the =d$ readout is too narrow for parametric-plot.

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
{ "type": "widget",        "slug": "characteristic-classes-c1-clutching", "params": { ... } },
{ "type": "widget-script", "slug": "characteristic-classes-c1-clutching", "params": { ... } }
```

Both blocks carry the same `params` object.
