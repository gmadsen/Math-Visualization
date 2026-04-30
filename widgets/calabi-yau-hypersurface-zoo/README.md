# calabi-yau-hypersurface-zoo

Bespoke widget for the calabi-yau-manifolds topic.

See [`../README.md`](../README.md) for the registry contract.

## What it does

Tile gallery of canonical Calabi-Yau hypersurfaces (elliptic curve, K3, quintic 3-fold, mirror quintic, CICY) where clicking a tile reveals its Hodge data, Euler number, and moduli dimension. Bespoke because the tile layout, hover affordance, and CY-specific readout fields are tightly coupled to the curated example set.

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
{ "type": "widget",        "slug": "calabi-yau-hypersurface-zoo", "params": { ... } },
{ "type": "widget-script", "slug": "calabi-yau-hypersurface-zoo", "params": { ... } }
```

Both blocks carry the same `params` object.
