# complexity-growth-rates

Bespoke widget for the complexity-theory topic.

See [`../README.md`](../README.md) for the registry contract.

## What it does

Plots common asymptotic growth rates on shared log-log axes so the reader can see how polynomial, exponential, and factorial curves separate. Bespoke because the visual emphasises class boundaries (P, EXP) by recoloring families of curves rather than treating them as generic plots.

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
{ "type": "widget",        "slug": "complexity-growth-rates", "params": { ... } },
{ "type": "widget-script", "slug": "complexity-growth-rates", "params": { ... } }
```

Both blocks carry the same `params` object.
