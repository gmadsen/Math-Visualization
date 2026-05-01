# model-theory-ax-grothendieck

Bespoke widget for the model-theory-basics topic.

See [`../README.md`](../README.md) for the registry contract.

## What it does

Ax–Grothendieck transfer widget for the model-theory-basics topic: shows the model-theoretic transfer principle from finite fields to algebraically closed fields of characteristic 0, with the reader stepping through the elementarily-equivalent ACF chain that drives the proof.

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
{ "type": "widget",        "slug": "model-theory-ax-grothendieck", "params": { ... } },
{ "type": "widget-script", "slug": "model-theory-ax-grothendieck", "params": { ... } }
```

Both blocks carry the same `params` object.
