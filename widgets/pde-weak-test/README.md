# pde-weak-test

Bespoke widget for the partial-differential-equations topic.

See [`../README.md`](../README.md) for the registry contract.

## What it does

Bespoke weak-solution illustration for the §5 weak solutions section on the partial-differential-equations topic — slider-controlled test function phi is integrated against a candidate solution u, with classical-vs-weak comparison readouts. The test-function picker + classical/weak comparison panel doesn't fit a shared slug.

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
{ "type": "widget",        "slug": "pde-weak-test", "params": { ... } },
{ "type": "widget-script", "slug": "pde-weak-test", "params": { ... } }
```

Both blocks carry the same `params` object.
