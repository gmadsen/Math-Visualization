# hamiltonians-canonical-transform

Bespoke widget for the §3 canonical-transformations preview on the
[`hamiltonians-classical-mechanics`](../../hamiltonians-classical-mechanics.html#canonical)
topic.

See [`../README.md`](../README.md) for the registry contract.

## What it does

A unit square in the $(q, p)$ plane is transported by a chosen 2x2 linear
map; the readout reports $|\det J|$.

- The `<select>` picks the map family: rotation $R_\theta$, shear
  $(q,p)\mapsto(q, p+aq)$, squeeze $(q,p)\mapsto(\lambda q, p/\lambda)$, plus
  a non-canonical control case $(q,p)\mapsto(\lambda q, p)$.
- The `<input type="range">` sets the parameter ($\theta$, $a$, or $\lambda$).
- Three of the four maps preserve $|\det J| = 1$ — area-preserving, hence
  symplectic — while the control case stretches and the readout flags it.

Both controls share a single `.row`. That layout is bespoke; `parametric-plot`
puts each control in its own row and so doesn't reproduce these bytes.

## Params

See [`schema.json`](./schema.json) for the authoritative shape. Summary:

| field            | kind        | purpose |
|---|---|---|
| `svgId`          | fundamental | DOM id for the host `<svg>`. |
| `outputId`       | fundamental | DOM id for the readout. |
| `title`          | fundamental | Header title. |
| `hint`           | fundamental | Hint next to the title. |
| `viewBox`        | fundamental | SVG `viewBox`. |
| `svgWidth`       | fundamental | SVG `width` attr. |
| `svgHeight`      | fundamental | SVG `height` attr. |
| `ariaLabel`      | fundamental | `aria-label` on the `<svg>`. |
| `pick`           | fundamental | Map-family picker; supports an `option.trailing` artifact (whitespace-only) to preserve a stray space in the source HTML. |
| `slider`         | fundamental | Single `<input type="range">` carrying the map parameter. |
| `outputInitial`  | fundamental | Initial inner HTML of the readout. |
| `sectionComment` | *artifact*  | Optional `/* ... */` banner above the IIFE. |
| `bodyScript`     | *artifact*  | Verbatim IIFE body — applies the chosen 2x2 map to the unit square and updates the $|\det J|$ readout. |

## Usage

```json
{ "type": "widget",        "slug": "hamiltonians-canonical-transform", "params": { ... } },
{ "type": "widget-script", "slug": "hamiltonians-canonical-transform", "params": { ... } }
```
