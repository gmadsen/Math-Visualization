# k-theory-ses-relations

Bespoke widget for the k-theory topic.

See [`../README.md`](../README.md) for the registry contract.

## What it does

Pick a short exact sequence of bundles on P^1 and watch the K_0 relation [B] = [A] + [C] play out, illustrating how SES define the Grothendieck group.

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
{ "type": "widget",        "slug": "k-theory-ses-relations", "params": { ... } },
{ "type": "widget-script", "slug": "k-theory-ses-relations", "params": { ... } }
```

Both blocks carry the same `params` object.
