# characteristic-classes-cpn-localisation

Bespoke widget for the characteristic-classes topic.

See [`../README.md`](../README.md) for the registry contract.

## What it does

Bespoke equivariant-localisation widget for the characteristic-classes topic — a slider over $ updates the hmtBcfixed points of $\mathbb{CP}^n$ and their tangent-weight contributions, demonstrating that the Atiyah-Bott localisation sum equals $. The integer-$ slider tied to a fixed-point list and weight-sum readout doesn't fit parametric-plot or input-form.

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
{ "type": "widget",        "slug": "characteristic-classes-cpn-localisation", "params": { ... } },
{ "type": "widget-script", "slug": "characteristic-classes-cpn-localisation", "params": { ... } }
```

Both blocks carry the same `params` object.
