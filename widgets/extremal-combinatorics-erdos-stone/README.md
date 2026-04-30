# extremal-combinatorics-erdos-stone

Bespoke widget for the extremal-combinatorics topic.

See [`../README.md`](../README.md) for the registry contract.

## What it does

Bespoke Turan density vs chromatic number stepper for the Erdos-Stone theorem: step chi(H) and read off the density curve ex(n, H)/binom(n,2) -> 1 - 1/(chi(H)-1). Demonstrates that asymptotic Turan density depends only on chromatic number.

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
{ "type": "widget",        "slug": "extremal-combinatorics-erdos-stone", "params": { ... } },
{ "type": "widget-script", "slug": "extremal-combinatorics-erdos-stone", "params": { ... } }
```

Both blocks carry the same `params` object.
