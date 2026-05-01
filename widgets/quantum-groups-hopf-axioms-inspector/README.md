# quantum-groups-hopf-axioms-inspector

Bespoke widget for the quantum-groups topic.

See [`../README.md`](../README.md) for the registry contract.

## What it does

Hopf axiom inspector for quantum groups

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
{ "type": "widget",        "slug": "quantum-groups-hopf-axioms-inspector", "params": { ... } },
{ "type": "widget-script", "slug": "quantum-groups-hopf-axioms-inspector", "params": { ... } }
```

Both blocks carry the same `params` object.
