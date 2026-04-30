# computability-halting-diagonal

Bespoke widget for the computability-and-decidability topic.

See [`../README.md`](../README.md) for the registry contract.

## What it does

Diagonal table illustrating the undecidability of the halting problem by toggling cells along the diagonal. Bespoke because the highlighted-row/diagonal-cell rendering encodes the specific Cantor-style argument and isn't a generic table widget.

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
{ "type": "widget",        "slug": "computability-halting-diagonal", "params": { ... } },
{ "type": "widget-script", "slug": "computability-halting-diagonal", "params": { ... } }
```

Both blocks carry the same `params` object.
