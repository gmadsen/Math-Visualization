# quaternions-cayley-dickson-ladder

Bespoke widget for the quaternions-octonions-and-division-algebras topic.

See [`../README.md`](../README.md) for the registry contract.

## What it does

Click-through ladder of the Cayley-Dickson tower (R, C, H, O, S, ...) showing which algebraic property each step sacrifices.

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
{ "type": "widget",        "slug": "quaternions-cayley-dickson-ladder", "params": { ... } },
{ "type": "widget-script", "slug": "quaternions-cayley-dickson-ladder", "params": { ... } }
```

Both blocks carry the same `params` object.
