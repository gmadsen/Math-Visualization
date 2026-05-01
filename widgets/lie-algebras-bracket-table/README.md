# lie-algebras-bracket-table

Bespoke widget for the lie-algebras topic.

See [`../README.md`](../README.md) for the registry contract.

## What it does

Bespoke 3x3 click-to-evaluate bracket table for the standard sl_2 basis {e,h,f}, displaying [X,Y] for the chosen pair next to a matrix-form reminder. Bespoke because no shared widget renders a Lie-bracket Cayley grid keyed to a fixed three-element basis.

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
{ "type": "widget",        "slug": "lie-algebras-bracket-table", "params": { ... } },
{ "type": "widget-script", "slug": "lie-algebras-bracket-table", "params": { ... } }
```

Both blocks carry the same `params` object.
