# variational-fdiff

Bespoke widget for the variational-methods topic.

See [`../README.md`](../README.md) for the registry contract.

## What it does

Functional derivative — slider over exponent p shows variation of the integral functional ∫u^p, illustrating how the Euler–Lagrange formula extracts pu^{p-1} from arbitrary perturbations.

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
{ "type": "widget",        "slug": "variational-fdiff", "params": { ... } },
{ "type": "widget-script", "slug": "variational-fdiff", "params": { ... } }
```

Both blocks carry the same `params` object.
