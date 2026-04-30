# general-relativity-cosmology

Bespoke widget for the general-relativity topic.

See [`../README.md`](../README.md) for the registry contract.

## What it does

Bespoke FRW cosmology demonstrator: slide curvature k and dark-energy fraction Omega_Lambda; watch a(t) evolve as a Big Bang model with or without acceleration. Concrete entry into the Friedmann equations.

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
{ "type": "widget",        "slug": "general-relativity-cosmology", "params": { ... } },
{ "type": "widget-script", "slug": "general-relativity-cosmology", "params": { ... } }
```

Both blocks carry the same `params` object.
