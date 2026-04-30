# modular-curves-lattice-cyclic-subgroup

Bespoke widget for the [`modular-curves`](../../modular-curves.html) topic.

See [`../README.md`](../README.md) for the registry contract.

## What it does

Bespoke modular-lattice viewer on the modular-curves topic — sliders drag τ around the upper half-plane while a select switches the level N, and the SVG redraws the lattice Λ_τ together with its order-N cyclic subgroup ⟨1/N⟩ inside the torus ℂ/Λ_τ. The dual lattice/torus side-by-side rendering with cyclic-subgroup highlighting is too specific to fit a shared slug.

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
{ "type": "widget",        "slug": "modular-curves-lattice-cyclic-subgroup", "params": { ... } },
{ "type": "widget-script", "slug": "modular-curves-lattice-cyclic-subgroup", "params": { ... } }
```

Both blocks carry the same `params` object.
