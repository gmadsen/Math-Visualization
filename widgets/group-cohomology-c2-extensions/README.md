# group-cohomology-c2-extensions

Bespoke widget for the group-cohomology topic.

See [`../README.md`](../README.md) for the registry contract.

## What it does

Bespoke explorer of the two extensions of $ by $ that realize ^2(C_2,\mathbb{Z}/2)=\mathbb{Z}/2$. The split-vs-nonsplit toggle is hardwired to this small example and is not factor-able into a shared widget.

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
{ "type": "widget",        "slug": "group-cohomology-c2-extensions", "params": { ... } },
{ "type": "widget-script", "slug": "group-cohomology-c2-extensions", "params": { ... } }
```

Both blocks carry the same `params` object.
