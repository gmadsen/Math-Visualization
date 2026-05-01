# complexity-hierarchy-diagonal

Bespoke widget for the complexity-theory topic.

See [`../README.md`](../README.md) for the registry contract.

## What it does

Walks through the diagonalisation argument behind the time-hierarchy theorem, showing how a faster-machine-simulator forces a strict separation between time classes. Bespoke because the table-flip animation and self-reference highlight are specific to hierarchy proofs.

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
{ "type": "widget",        "slug": "complexity-hierarchy-diagonal", "params": { ... } },
{ "type": "widget-script", "slug": "complexity-hierarchy-diagonal", "params": { ... } }
```

Both blocks carry the same `params` object.
