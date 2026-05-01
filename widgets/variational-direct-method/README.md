# variational-direct-method

Bespoke widget for the variational-methods topic.

See [`../README.md`](../README.md) for the registry contract.

## What it does

Direct method — minimising sequence in H¹₀(0,1); slider walks along a sequence whose energy decreases toward the infimum, illustrating coercivity + lower-semicontinuity yielding a minimiser.

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
{ "type": "widget",        "slug": "variational-direct-method", "params": { ... } },
{ "type": "widget-script", "slug": "variational-direct-method", "params": { ... } }
```

Both blocks carry the same `params` object.
