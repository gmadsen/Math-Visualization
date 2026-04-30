# automorphic-restricted-product

Bespoke widget for the automorphic-forms-adelic topic.

See [`../README.md`](../README.md) for the registry contract.

## What it does

Bespoke restricted-product membership tester for the automorphic-forms-adelic topic. Reader sets a determinant at the archimedean place and integer entries at finite places; the widget reports whether the resulting tuple lies in GL_2 of the adeles by checking that almost all entries are in GL_2(Z_p). The adelic-place-form-plus-rule-checker shape is one-off and does not fit a shared input-form slug.

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
{ "type": "widget",        "slug": "automorphic-restricted-product", "params": { ... } },
{ "type": "widget-script", "slug": "automorphic-restricted-product", "params": { ... } }
```

Both blocks carry the same `params` object.
