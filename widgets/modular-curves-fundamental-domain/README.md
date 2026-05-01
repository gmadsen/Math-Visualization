# modular-curves-fundamental-domain

Bespoke widget for the [`modular-curves`](../../modular-curves.html) topic.

See [`../README.md`](../README.md) for the registry contract.

## What it does

Bespoke fundamental-domain visualizer for Γ₀(N) on the modular-curves topic — a level selector picks prime N (2,3,5,7,11) and the SVG redraws the union of [SL₂(ℤ):Γ₀(N)] coset-tile copies of the canonical SL₂(ℤ) fundamental domain. The bespoke coset-tile rendering with index/cusp pills and the Cayley-graph layout of cosets don't fit any shared slug.

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
{ "type": "widget",        "slug": "modular-curves-fundamental-domain", "params": { ... } },
{ "type": "widget-script", "slug": "modular-curves-fundamental-domain", "params": { ... } }
```

Both blocks carry the same `params` object.
