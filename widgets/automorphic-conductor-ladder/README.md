# automorphic-conductor-ladder

Bespoke widget for the automorphic-forms-adelic topic.

See [`../README.md`](../README.md) for the registry contract.

## What it does

Bespoke local-conductor-exponent ladder for the automorphic-forms-adelic topic. Reader clicks a level on a vertical ladder labeled by p^j; the SVG highlights that rung and the readout reports the dimension of the K_0(p^j)-fixed subspace of pi_p. The clickable-rung shape and conductor-stratification semantics are specific to the local newform theorem and do not fit clickable-diagram.

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
{ "type": "widget",        "slug": "automorphic-conductor-ladder", "params": { ... } },
{ "type": "widget-script", "slug": "automorphic-conductor-ladder", "params": { ... } }
```

Both blocks carry the same `params` object.
