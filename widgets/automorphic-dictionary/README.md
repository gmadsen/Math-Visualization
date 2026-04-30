# automorphic-dictionary

Bespoke widget for the automorphic-forms-adelic topic.

See [`../README.md`](../README.md) for the registry contract.

## What it does

Bespoke classical-to-adelic dictionary translator for the automorphic-forms-adelic topic. A single select dropdown lets the reader pick a classical object (modular form, Hecke operator, level structure) and the readout displays its adelic counterpart. The select-only-no-svg single-translator-card shape is one-off and does not fit any existing form or input slug.

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
{ "type": "widget",        "slug": "automorphic-dictionary", "params": { ... } },
{ "type": "widget-script", "slug": "automorphic-dictionary", "params": { ... } }
```

Both blocks carry the same `params` object.
