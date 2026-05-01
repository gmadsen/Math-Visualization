# modular-curves-mazur-torsion

Bespoke widget for the [`modular-curves`](../../modular-curves.html) topic.

See [`../README.md`](../README.md) for the registry contract.

## What it does

Bespoke Mazur-torsion viewer on the modular-curves topic — buttons step through orders N from 1 to 16, and the SVG/readout classifies each as occurs / excluded / cuspidal-only, summarising Mazur's torsion theorem and the role of X₁(N). The order-by-order decision pane is bespoke.

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
{ "type": "widget",        "slug": "modular-curves-mazur-torsion", "params": { ... } },
{ "type": "widget-script", "slug": "modular-curves-mazur-torsion", "params": { ... } }
```

Both blocks carry the same `params` object.
