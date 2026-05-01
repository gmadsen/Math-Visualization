# modular-curves-cusps-and-wn

Bespoke widget for the [`modular-curves`](../../modular-curves.html) topic.

See [`../README.md`](../README.md) for the registry contract.

## What it does

Bespoke cusps-and-Atkin–Lehner viewer on the modular-curves topic — buttons pick a level N (12, 14, 15, 30, 36) and the SVG enumerates all cusps of X₀(N) as a/d pairs, drawing arrows for the Atkin–Lehner involution w_N's action on them. The cusp-list plus involution-arrow rendering is bespoke.

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
{ "type": "widget",        "slug": "modular-curves-cusps-and-wn", "params": { ... } },
{ "type": "widget-script", "slug": "modular-curves-cusps-and-wn", "params": { ... } }
```

Both blocks carry the same `params` object.
