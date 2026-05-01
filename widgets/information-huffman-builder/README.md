# information-huffman-builder

Bespoke widget for the information-theory topic.

See [`../README.md`](../README.md) for the registry contract.

## What it does

Interactive Huffman coding tree builder with merge-step controls.

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
{ "type": "widget",        "slug": "information-huffman-builder", "params": { ... } },
{ "type": "widget-script", "slug": "information-huffman-builder", "params": { ... } }
```

Both blocks carry the same `params` object.
