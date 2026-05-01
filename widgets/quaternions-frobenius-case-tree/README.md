# quaternions-frobenius-case-tree

Bespoke widget for the quaternions-octonions-and-division-algebras topic.

See [`../README.md`](../README.md) for the registry contract.

## What it does

Click-through case tree for Frobenius's classification of finite-dimensional real division algebras: each leaf names the obstruction that rules out a fourth unit imaginary.

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
{ "type": "widget",        "slug": "quaternions-frobenius-case-tree", "params": { ... } },
{ "type": "widget-script", "slug": "quaternions-frobenius-case-tree", "params": { ... } }
```

Both blocks carry the same `params` object.
