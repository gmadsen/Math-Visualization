# three-body-kam-tori

Bespoke widget for the §5 KAM tori-vs-perturbation illustration on the
[`three-body-problem`](../../three-body-problem.html#kam) topic.

See [`../README.md`](../README.md) for the registry contract.

## What it does

A single perturbation slider $\varepsilon$ drives an SVG of nested invariant
tori. Each torus is indexed by its rotation number $\rho$; rationally-resonant
rings shatter first into Birkhoff chains of islands as $\varepsilon$ grows,
while strongly Diophantine rings survive longer. The golden-mean torus
$\rho = (\sqrt 5 - 1)/2$ is highlighted as the most-robust survivor (Greene's
residue criterion).

This is distinct from [`hamiltonians-kam-tori`](../hamiltonians-kam-tori/),
which visualizes a single 2-torus winding driven by three frequency sliders.

## Params

See [`schema.json`](./schema.json) for the authoritative shape. Summary:

| field            | kind        | purpose |
|---|---|---|
| `widgetId`       | fundamental | DOM id for the outer `<div class="widget">`. |
| `title`          | fundamental | Header title. |
| `hint`           | fundamental | Header hint. |
| `bodyMarkup`     | *artifact*  | Verbatim inner-body HTML (slider row + span readout, SVG, readout div, trailing `<p class="small">`). |
| `sectionComment` | *artifact*  | Optional `/* ... */` banner above the IIFE. |
| `bodyScript`     | *artifact*  | Verbatim IIFE body — wires $\varepsilon$ slider, walks indexed tori, breaks resonant ones into islands. |

## Usage

```json
{ "type": "widget",        "slug": "three-body-kam-tori", "params": { ... } },
{ "type": "widget-script", "slug": "three-body-kam-tori", "params": { ... } }
```

Both blocks carry the same `params` object.
