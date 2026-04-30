# atiyah-singer-anomaly

Bespoke widget for the atiyah-singer-index-theorem topic.

See [`../README.md`](../README.md) for the registry contract.

## What it does

Two-column zero-mode diagram for $D_A^\pm$ in an instanton background of charge $k$, illustrating how the index equals the topological charge $\int c_2(V)$ via the chiral anomaly. Bespoke because the layout pairs explicit zero-mode boxes with an imbalance arrow and a hand-typeset anomaly equation specific to this physics narrative.

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
{ "type": "widget",        "slug": "atiyah-singer-anomaly", "params": { ... } },
{ "type": "widget-script", "slug": "atiyah-singer-anomaly", "params": { ... } }
```

Both blocks carry the same `params` object.
