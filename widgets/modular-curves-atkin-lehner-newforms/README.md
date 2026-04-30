# modular-curves-atkin-lehner-newforms

Bespoke widget for the [`modular-curves`](../../modular-curves.html) topic.

See [`../README.md`](../README.md) for the registry contract.

## What it does

Bespoke Atkin–Lehner / old-new decomposition viewer on the modular-curves topic — buttons pick a composite N (33, 55, 66, 77) and the SVG diagrams |W_N| = 2^ω(N) along with the dimension counts dim S_2^old vs dim S_2^new for the corresponding newform decomposition. The factor-pair decomposition with old/new dimension stacked-bar rendering is bespoke.

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
{ "type": "widget",        "slug": "modular-curves-atkin-lehner-newforms", "params": { ... } },
{ "type": "widget-script", "slug": "modular-curves-atkin-lehner-newforms", "params": { ... } }
```

Both blocks carry the same `params` object.
