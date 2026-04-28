# three-body-nbody-simulator

Bespoke widget for the §1 Newton-equations N-body simulator on the
[`three-body-problem`](../../three-body-problem.html#newton-eq) topic.

See [`../README.md`](../README.md) for the registry contract.

## What it does

Four preset buttons (2-body Kepler, Lagrange equilateral, figure-eight, generic
3-body) sit above a row of pause / reset / speed controls. Below them, an SVG
canvas accumulates orbit traces as a leapfrog integrator advances, and a
readout reports the relative drift of total energy $E$ and angular momentum
$L_z$ — both conserved exactly by the equations, only approximately by the
numerical scheme. The trailing `<p class="small">` carries provenance prose
for the Chenciner–Montgomery figure-eight initial conditions.

The shape (preset row + control row + SVG + readout + trailing prose with no
aria-label and an inline-styled SVG) does not fit any shared slug; this slug
captures it as one unit.

## Params

See [`schema.json`](./schema.json) for the authoritative shape. Summary:

| field            | kind        | purpose |
|---|---|---|
| `widgetId`       | fundamental | DOM id for the outer `<div class="widget">`. |
| `title`          | fundamental | Header title. |
| `hint`           | fundamental | Header hint. |
| `bodyMarkup`     | *artifact*  | Verbatim inner-body HTML (preset row, control row, SVG, readout, trailing `<p class="small">`). |
| `sectionComment` | *artifact*  | Optional `/* ... */` banner above the IIFE. |
| `bodyScript`     | *artifact*  | Verbatim IIFE body — wires presets, controls, runs the leapfrog integrator, updates the readout. |

## Usage

```json
{ "type": "widget",        "slug": "three-body-nbody-simulator", "params": { ... } },
{ "type": "widget-script", "slug": "three-body-nbody-simulator", "params": { ... } }
```

Both blocks carry the same `params` object.
