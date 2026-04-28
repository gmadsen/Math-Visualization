# three-body-special-solutions

Bespoke widget for the §3 special-solutions choreography demo on the
[`three-body-problem`](../../three-body-problem.html#special) topic.

See [`../README.md`](../README.md) for the registry contract.

## What it does

Three preset buttons select among the three classes of explicit special
solutions to the planar three-body problem with equal masses: Lagrange's
equilateral relative equilibrium, Euler's collinear relative equilibrium,
and the Chenciner–Montgomery figure-eight choreography (2000). The SVG
animates the chosen choreography forward in time with all three masses
chasing each other at equal phase spacing; a readout names the current
solution and tracks elapsed time. A trailing `<p class="small">` notes that
the figure-eight is the only known choreography of three equal masses on a
single curve in the plane that is not a relative equilibrium.

## Params

See [`schema.json`](./schema.json) for the authoritative shape. Summary:

| field            | kind        | purpose |
|---|---|---|
| `widgetId`       | fundamental | DOM id for the outer `<div class="widget">`. |
| `title`          | fundamental | Header title. |
| `hint`           | fundamental | Header hint. |
| `bodyMarkup`     | *artifact*  | Verbatim inner-body HTML (preset row, SVG, readout div, trailing `<p class="small">`). |
| `sectionComment` | *artifact*  | Optional `/* ... */` banner above the IIFE. |
| `bodyScript`     | *artifact*  | Verbatim IIFE body — wires preset buttons, animates the chosen choreography. |

## Usage

```json
{ "type": "widget",        "slug": "three-body-special-solutions", "params": { ... } },
{ "type": "widget-script", "slug": "three-body-special-solutions", "params": { ... } }
```

Both blocks carry the same `params` object.
