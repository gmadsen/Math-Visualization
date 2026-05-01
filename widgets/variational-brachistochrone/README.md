# variational-brachistochrone

Bespoke widget for the variational-methods topic.

See [`../README.md`](../README.md) for the registry contract.

## What it does

Brachistochrone race — animates a bead descending the cycloid, a straight line, and a parabola, showing the cycloid wins because it is the Euler–Lagrange minimiser of the descent-time functional.

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
{ "type": "widget",        "slug": "variational-brachistochrone", "params": { ... } },
{ "type": "widget-script", "slug": "variational-brachistochrone", "params": { ... } }
```

Both blocks carry the same `params` object.
