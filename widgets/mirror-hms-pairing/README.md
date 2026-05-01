# mirror-hms-pairing

Bespoke widget for the mirror-symmetry topic.

See [`../README.md`](../README.md) for the registry contract.

## What it does

Homological-mirror-symmetry pairing widget: clicking a B-side coherent sheaf on a Calabi-Yau X reveals its conjectured A-side Lagrangian mirror on the dual Y, illustrating the equivalence D^bCoh(X) = Fuk(Y).

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
{ "type": "widget",        "slug": "mirror-hms-pairing", "params": { ... } },
{ "type": "widget-script", "slug": "mirror-hms-pairing", "params": { ... } }
```

Both blocks carry the same `params` object.
