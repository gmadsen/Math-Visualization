# ant-bombieri-vinogradov

Bespoke widget for the analytic-number-theory topic.

See [`../README.md`](../README.md) for the registry contract.

## What it does

Bespoke histogram of $|E(x;q,a)|$ over moduli $q$ illustrating Bombieri–Vinogradov's mean-value bound for the analytic-number-theory topic. The shaded admissible-$Q$ band against per-modulus error magnitudes is specific to BV and not a generic histogram widget.

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
{ "type": "widget",        "slug": "ant-bombieri-vinogradov", "params": { ... } },
{ "type": "widget-script", "slug": "ant-bombieri-vinogradov", "params": { ... } }
```

Both blocks carry the same `params` object.
