# modular-curves-hecke-summands

Bespoke widget for the [`modular-curves`](../../modular-curves.html) topic.

See [`../README.md`](../README.md) for the registry contract.

## What it does

Bespoke Hecke-correspondence visualizer on the modular-curves topic — a prime selector picks p (2,3,5,7) and the SVG renders the p+1 order-p subgroups of E[p] together with the resulting quotient elliptic curves whose sum gives T_p[E]. The p-torsion-subgroup grid plus quotient-curve rendering is bespoke and doesn't generalize.

## Params

See [`schema.json`](./schema.json) for the authoritative shape. Summary:

| field            | kind        | purpose |
|---|---|---|
| `widgetId`       | fundamental | DOM id for the outer `<div class="widget">`. |
| `title`          | fundamental | Header title (rendered inside a `<span class="ttl">`). |
| `hint`           | fundamental | Header hint (rendered inside a `<span class="hint">`). |
| `bodyMarkup`     | *artifact*  | Verbatim inner-body HTML (controls, SVG, readouts). |
| `sectionComment` | *artifact*  | Optional `/* ... */` banner above the IIFE. |
| `bodyScript`     | *artifact*  | Verbatim IIFE body. |

## Usage

```json
{ "type": "widget",        "slug": "modular-curves-hecke-summands", "params": { ... } },
{ "type": "widget-script", "slug": "modular-curves-hecke-summands", "params": { ... } }
```

Both blocks carry the same `params` object.
