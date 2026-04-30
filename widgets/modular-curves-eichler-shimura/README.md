# modular-curves-eichler-shimura

Bespoke widget for the [`modular-curves`](../../modular-curves.html) topic.

See [`../README.md`](../README.md) for the registry contract.

## What it does

Bespoke Eichler–Shimura visualizer on the modular-curves topic — buttons select a level N (11, 17, 23, 37) and the SVG diagrams the equivalence S₂(Γ₀(N)) ↔ Ω¹(X₀(N)) ↔ J₀(N), with matched dimensions g, dim S_2, and dim J_0(N) reported in the readout. The three-column correspondence diagram with paired dimension counts is bespoke.

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
{ "type": "widget",        "slug": "modular-curves-eichler-shimura", "params": { ... } },
{ "type": "widget-script", "slug": "modular-curves-eichler-shimura", "params": { ... } }
```

Both blocks carry the same `params` object.
