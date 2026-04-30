# characteristic-classes-gauss-bonnet

Bespoke widget for the characteristic-classes topic.

See [`../README.md`](../README.md) for the registry contract.

## What it does

Bespoke Gauss-Bonnet integrand visualizer for the characteristic-classes topic that lets readers swap among curvature-tinted surface presets and reports $\int K\,dA$ vs \pi\chi$ for each. The surface preset switcher with curvature-color SVG and twin readout isn't covered by surface-viewer's standard interaction.

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
{ "type": "widget",        "slug": "characteristic-classes-gauss-bonnet", "params": { ... } },
{ "type": "widget-script", "slug": "characteristic-classes-gauss-bonnet", "params": { ... } }
```

Both blocks carry the same `params` object.
