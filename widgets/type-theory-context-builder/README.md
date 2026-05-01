# type-theory-context-builder

Bespoke widget for the type-theory-and-hott topic.

See [`../README.md`](../README.md) for the registry contract.

## What it does

Bespoke widget for the §1 context builder on the type-theory-and-hott topic. Reader clicks 'Add variable' / 'Pop' to extend or shrink a typing context Γ; readout shows the rendered judgment Γ ⊢ A type as variables and dependencies accumulate. The buttons + readout + dynamic LaTeX-rendered context shape doesn't fit a shared slug.

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
{ "type": "widget",        "slug": "type-theory-context-builder", "params": { ... } },
{ "type": "widget-script", "slug": "type-theory-context-builder", "params": { ... } }
```

Both blocks carry the same `params` object.
