# type-theory-circle-winding

Bespoke widget for the type-theory-and-hott topic.

See [`../README.md`](../README.md) for the registry contract.

## What it does

Bespoke widget for the §5 circle as a HIT figure on the type-theory-and-hott topic. Reader clicks +/− to wind around the higher inductive S¹; readout shows the resulting element of π₁(S¹) ≅ ℤ. The winding-counter button pair + π₁ readout + animated arc doesn't fit a shared slug.

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
{ "type": "widget",        "slug": "type-theory-circle-winding", "params": { ... } },
{ "type": "widget-script", "slug": "type-theory-circle-winding", "params": { ... } }
```

Both blocks carry the same `params` object.
