# type-theory-univalence-toggle

Bespoke widget for the type-theory-and-hott topic.

See [`../README.md`](../README.md) for the registry contract.

## What it does

Bespoke widget for the §4 univalence toggle on the type-theory-and-hott topic. Reader cycles between two equivalences B → B (identity vs swap) to see two distinct identifications B = B materialize as different paths in the universe. The two-state cycle plus dual-path SVG rendering doesn't fit a shared slug.

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
{ "type": "widget",        "slug": "type-theory-univalence-toggle", "params": { ... } },
{ "type": "widget-script", "slug": "type-theory-univalence-toggle", "params": { ... } }
```

Both blocks carry the same `params` object.
