# lie-algebras-adjoint-vis

Bespoke widget for the lie-algebras topic.

See [`../README.md`](../README.md) for the registry contract.

## What it does

Bespoke visualization of the adjoint action ad(x) on sl_2: pick x in {e,h,f} from a select and watch arrows redraw to the basis images while the eigenvalues update. Bespoke because the diagram pairs three named basis vectors with a custom arrow-overlay no shared slug provides.

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
{ "type": "widget",        "slug": "lie-algebras-adjoint-vis", "params": { ... } },
{ "type": "widget-script", "slug": "lie-algebras-adjoint-vis", "params": { ... } }
```

Both blocks carry the same `params` object.
