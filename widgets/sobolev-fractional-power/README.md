# sobolev-fractional-power

Bespoke widget for the sobolev-spaces-distributions topic.

See [`../README.md`](../README.md) for the registry contract.

## What it does

Bespoke W^{1,p} membership probe for u(x) = x^alpha on (0,1): sliding alpha and p moves the boundary alpha > 1 - 1/p; the verdict badge (in/out) flips at the threshold. Concrete touchpoint for the integrability bookkeeping in the Sobolev definition.

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
{ "type": "widget",        "slug": "sobolev-fractional-power", "params": { ... } },
{ "type": "widget-script", "slug": "sobolev-fractional-power", "params": { ... } }
```

Both blocks carry the same `params` object.
