# sobolev-newtonian-potential

Bespoke widget for the sobolev-spaces-distributions topic.

See [`../README.md`](../README.md) for the registry contract.

## What it does

Bespoke Newtonian-potential illustrator: E_3 = -1/(4 pi r) for the Laplacian's fundamental solution. Drag radius slider; flux across the sphere remains 1 by Gauss's theorem regardless of the sphere's size.

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
{ "type": "widget",        "slug": "sobolev-newtonian-potential", "params": { ... } },
{ "type": "widget-script", "slug": "sobolev-newtonian-potential", "params": { ... } }
```

Both blocks carry the same `params` object.
