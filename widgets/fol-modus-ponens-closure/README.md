# fol-modus-ponens-closure

Bespoke widget for the first-order-logic-and-completeness topic.

See [`../README.md`](../README.md) for the registry contract.

## What it does

Bespoke modus-ponens closure stepper for the first-order-logic-and-completeness topic. Walks the deductive closure of a small axiom set under MP, which doesn't fit any shared step-driven slug.

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
{ "type": "widget",        "slug": "fol-modus-ponens-closure", "params": { ... } },
{ "type": "widget-script", "slug": "fol-modus-ponens-closure", "params": { ... } }
```

Both blocks carry the same `params` object.
