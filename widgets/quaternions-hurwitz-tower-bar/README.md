# quaternions-hurwitz-tower-bar

Bespoke widget for the quaternions-octonions-and-division-algebras topic.

See [`../README.md`](../README.md) for the registry contract.

## What it does

Click an algebra (R, C, H, O, M_2(R), ...) to see which classification (Frobenius, Hurwitz, Wedderburn, ...) it sits inside.

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
{ "type": "widget",        "slug": "quaternions-hurwitz-tower-bar", "params": { ... } },
{ "type": "widget-script", "slug": "quaternions-hurwitz-tower-bar", "params": { ... } }
```

Both blocks carry the same `params` object.
