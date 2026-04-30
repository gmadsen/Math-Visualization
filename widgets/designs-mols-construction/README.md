# designs-mols-construction

Bespoke widget for the designs topic.

See [`../README.md`](../README.md) for the registry contract.

## What it does

Bespoke MOLS-over-F_p constructor: for a prime p, two squares L_a(i,j) = i + a j (mod p) are mutually orthogonal whenever a_1 != a_2. The widget displays a chosen pair side by side and verifies the orthogonality count is p^2.

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
{ "type": "widget",        "slug": "designs-mols-construction", "params": { ... } },
{ "type": "widget-script", "slug": "designs-mols-construction", "params": { ... } }
```

Both blocks carry the same `params` object.
