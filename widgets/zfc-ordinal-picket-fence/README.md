# zfc-ordinal-picket-fence

Bespoke widget for the zfc-and-ordinals topic.

See [`../README.md`](../README.md) for the registry contract.

## What it does

Bespoke ordinal picket-fence visualization showing successor and limit ordinals up through omega^2 for the zfc-and-ordinals topic. The two-tier picket-fence layout is unique to ordinal pedagogy.

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
{ "type": "widget",        "slug": "zfc-ordinal-picket-fence", "params": { ... } },
{ "type": "widget-script", "slug": "zfc-ordinal-picket-fence", "params": { ... } }
```

Both blocks carry the same `params` object.
