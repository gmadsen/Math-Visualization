# type-theory-lambda-reduction

Bespoke widget for the type-theory-and-hott topic.

See [`../README.md`](../README.md) for the registry contract.

## What it does

Bespoke widget for the §2 λ-reduction stepper on the type-theory-and-hott topic. Reader clicks Step / Reset to advance β-reduction in a small λ-term, with a free-variables readout updating each step. The bespoke term selector + step button + free-variable badge readout doesn't fit a shared slug.

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
{ "type": "widget",        "slug": "type-theory-lambda-reduction", "params": { ... } },
{ "type": "widget-script", "slug": "type-theory-lambda-reduction", "params": { ... } }
```

Both blocks carry the same `params` object.
