# hamiltonians-kepler-orbits

Bespoke widget for the §6 Kepler-orbits sweep on the
[`hamiltonians-classical-mechanics`](../../hamiltonians-classical-mechanics.html#applications)
topic.

See [`../README.md`](../README.md) for the registry contract.

## What it does

Two sliders ($E$, $L$) share a single `.row` above an SVG host showing the
conic orbit (ellipse, parabola, or hyperbola) of a particle moving in a
$1/r$ gravitational potential. The readout reports the orbit kind,
eccentricity, and period.

Sweeping $E$ from negative to positive carries the orbit through the bound
ellipses, the marginally bound parabola, and into unbound hyperbolae;
sweeping $L$ at fixed $E$ changes eccentricity within each regime.

The all-sliders-in-one-row layout matches `hamiltonians-kam-tori` (3 sliders)
but is distinct from `parametric-plot`'s per-row layout — hence a bespoke
slug.

## Params

See [`schema.json`](./schema.json) for the authoritative shape. Summary:

| field            | kind        | purpose |
|---|---|---|
| `svgId`          | fundamental | DOM id for the host `<svg>`. |
| `outputId`       | fundamental | DOM id for the readout. |
| `title`          | fundamental | Header title. |
| `hint`           | fundamental | Hint. |
| `viewBox`        | fundamental | SVG `viewBox`. |
| `svgWidth`       | fundamental | SVG `width` attr. |
| `svgHeight`      | fundamental | SVG `height` attr. |
| `ariaLabel`      | fundamental | `aria-label` on the `<svg>`. |
| `sliders`        | fundamental | Array of `{id, label, min, max, value}` sliders rendered side-by-side. |
| `outputInitial`  | fundamental | Initial readout HTML. |
| `sectionComment` | *artifact*  | Optional `/* ... */` banner above the IIFE. |
| `bodyScript`     | *artifact*  | Verbatim IIFE body — wires the two sliders, classifies the conic, and draws the orbit. |

## Usage

```json
{ "type": "widget",        "slug": "hamiltonians-kepler-orbits", "params": { ... } },
{ "type": "widget-script", "slug": "hamiltonians-kepler-orbits", "params": { ... } }
```
