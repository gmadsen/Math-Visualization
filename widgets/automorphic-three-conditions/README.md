# automorphic-three-conditions

Bespoke widget for the automorphic-forms-adelic topic.

See [`../README.md`](../README.md) for the registry contract.

## What it does

Bespoke conditions-on-phi clickable-list illustration for the automorphic-forms-adelic topic. Reader clicks one of the three conditions defining an automorphic form (left-GL_2(Q)-invariance, right-K-finiteness, moderate growth); the readout reports the consequence of dropping that hypothesis. The single-purpose diagrammed-conditions-list shape is a one-off and does not fit clickable-diagram or counterexample-explorer.

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
{ "type": "widget",        "slug": "automorphic-three-conditions", "params": { ... } },
{ "type": "widget-script", "slug": "automorphic-three-conditions", "params": { ... } }
```

Both blocks carry the same `params` object.
