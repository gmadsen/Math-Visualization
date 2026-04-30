# designs-hamming-fano

Bespoke widget for the designs topic.

See [`../README.md`](../README.md) for the registry contract.

## What it does

Bespoke [7,4,3] Hamming code <-> Fano lines bijection stepper: step through the seven minimum-weight codewords; each is a Fano line. Concrete coding-theory anchor for the abstract design-code correspondence.

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
{ "type": "widget",        "slug": "designs-hamming-fano", "params": { ... } },
{ "type": "widget-script", "slug": "designs-hamming-fano", "params": { ... } }
```

Both blocks carry the same `params` object.
