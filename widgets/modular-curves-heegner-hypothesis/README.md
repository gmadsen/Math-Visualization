# modular-curves-heegner-hypothesis

Bespoke widget for the [`modular-curves`](../../modular-curves.html) topic.

See [`../README.md`](../README.md) for the registry contract.

## What it does

Bespoke Heegner-hypothesis checker on the modular-curves topic — selects pick a level N and a discriminant D < 0, and the SVG/readout reports whether N splits in ℚ(√D), and if so how many Heegner points (CM points on X₀(N) with discriminant D) result. The split-prime decision tree with Heegner-point count rendering is bespoke.

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
{ "type": "widget",        "slug": "modular-curves-heegner-hypothesis", "params": { ... } },
{ "type": "widget-script", "slug": "modular-curves-heegner-hypothesis", "params": { ... } }
```

Both blocks carry the same `params` object.
