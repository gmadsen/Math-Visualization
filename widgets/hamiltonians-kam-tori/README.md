# hamiltonians-kam-tori

Bespoke widget for the §5 KAM-tori illustration on the
[`hamiltonians-classical-mechanics`](../../hamiltonians-classical-mechanics.html#integrable)
topic.

See [`../README.md`](../README.md) for the registry contract.

## What it does

Three sliders ($\omega_1$, $\omega_2$, $\varepsilon$) all share a single
`.row` above an SVG host showing a 2-torus orbit:

- Rational frequency ratio $\omega_2/\omega_1 = p/q$ → orbit closes after $q$
  windings.
- Irrational ratio → orbit fills the torus densely.
- Non-zero perturbation $\varepsilon$ deforms the linear winding into a KAM-style
  perturbed flow; resonant tori shatter, Diophantine ones survive.

The all-sliders-in-one-row layout is bespoke; `parametric-plot` puts each
slider in its own row.

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
| `sliders`        | fundamental | Array of `{id, label, min, max, value}` sliders rendered side-by-side in a single `.row`. |
| `outputInitial`  | fundamental | Initial readout HTML. |
| `sectionComment` | *artifact*  | Optional `/* ... */` banner above the IIFE. |
| `bodyScript`     | *artifact*  | Verbatim IIFE body — wires the three sliders, draws the winding, applies the perturbation, and reports the frequency ratio. |

## Usage

```json
{ "type": "widget",        "slug": "hamiltonians-kam-tori", "params": { ... } },
{ "type": "widget-script", "slug": "hamiltonians-kam-tori", "params": { ... } }
```
