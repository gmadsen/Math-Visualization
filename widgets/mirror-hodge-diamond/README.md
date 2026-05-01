# mirror-hodge-diamond

Bespoke widget for the mirror-symmetry topic.

See [`../README.md`](../README.md) for the registry contract.

## What it does

Side-by-side Hodge-diamond renderer for a Calabi-Yau threefold and its mirror; selecting a CY example swaps h^{1,1} with h^{2,1} on the right-hand diamond and updates Euler-characteristic readouts.

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
{ "type": "widget",        "slug": "mirror-hodge-diamond", "params": { ... } },
{ "type": "widget-script", "slug": "mirror-hodge-diamond", "params": { ... } }
```

Both blocks carry the same `params` object.
