# characteristic-classes-signature-l-genus

Bespoke widget for the characteristic-classes topic.

See [`../README.md`](../README.md) for the registry contract.

## What it does

Bespoke signature comparator for the characteristic-classes topic — preset khmtBcmanifold buttons display the intersection-form signature $\sigma(M)$ alongside the hmtBcgenus pairing $\langle L_k,[M]\rangle$ to illustrate Hirzebruch's theorem. The manifold preset trio plus dual-formula readout is too domain-specific for any shared slug.

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
{ "type": "widget",        "slug": "characteristic-classes-signature-l-genus", "params": { ... } },
{ "type": "widget-script", "slug": "characteristic-classes-signature-l-genus", "params": { ... } }
```

Both blocks carry the same `params` object.
