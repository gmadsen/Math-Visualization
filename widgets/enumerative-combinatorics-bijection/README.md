# enumerative-combinatorics-bijection

Bespoke widget for the enumerative-combinatorics topic.

See [`../README.md`](../README.md) for the registry contract.

## What it does

Bespoke Catalan-path <-> triangulation bijection stepper: step through the C_n pairs and watch the bijection synchronise. Concrete exhibition of one of many famous bijections enumerating the Catalan numbers.

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
{ "type": "widget",        "slug": "enumerative-combinatorics-bijection", "params": { ... } },
{ "type": "widget-script", "slug": "enumerative-combinatorics-bijection", "params": { ... } }
```

Both blocks carry the same `params` object.
