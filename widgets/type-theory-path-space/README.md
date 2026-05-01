# type-theory-path-space

Bespoke widget for the type-theory-and-hott topic.

See [`../README.md`](../README.md) for the registry contract.

## What it does

Bespoke widget for the §3 path space Id_A(a,b) figure on the type-theory-and-hott topic. Reader drags endpoints a or b on a 2D canvas; the displayed path stretches between them and the refl loop appears when a = b. The drag-on-svg gesture combined with the special-case refl rendering doesn't fit a shared slug.

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
{ "type": "widget",        "slug": "type-theory-path-space", "params": { ... } },
{ "type": "widget-script", "slug": "type-theory-path-space", "params": { ... } }
```

Both blocks carry the same `params` object.
