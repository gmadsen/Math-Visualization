# automorphic-strong-approximation

Bespoke widget for the automorphic-forms-adelic topic.

See [`../README.md`](../README.md) for the registry contract.

## What it does

Bespoke strong-approximation factorisation stepper for the automorphic-forms-adelic topic. Three buttons step through writing an adelic GL_2 element as a product of a rational matrix, an archimedean factor, and an open-compact subgroup factor; an SVG visualises the decomposition. The button-trio plus diagram-of-double-cosets layout is specific to strong approximation and does not fit a shared button-stepper slug.

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
{ "type": "widget",        "slug": "automorphic-strong-approximation", "params": { ... } },
{ "type": "widget-script", "slug": "automorphic-strong-approximation", "params": { ... } }
```

Both blocks carry the same `params` object.
