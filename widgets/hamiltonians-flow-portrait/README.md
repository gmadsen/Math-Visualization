# hamiltonians-flow-portrait

Bespoke widget for the §2 Hamiltonian flow portrait on the
[`hamiltonians-classical-mechanics`](../../hamiltonians-classical-mechanics.html#hamilton-eq)
topic — the topic's signature interactive.

See [`../README.md`](../README.md) for the registry contract.

## What it does

Pick a Hamiltonian from the `<select>` (harmonic oscillator, pendulum, double
well, free particle) and the SVG redraws to show that Hamiltonian's vector
field. Click anywhere in the field to drop an initial condition; the
trajectory integrates forward in time and accumulates as a polyline. **Step**
advances the active trajectory by one chunk; **Clear** wipes all trajectories
and lets you start over.

The combination of select + click-on-SVG + step/clear buttons + an inline
`<span class="small">` carrying the click affordance doesn't fit any shared
slug — `clickable-graph` rejects form controls in markup, `parametric-plot`
has no click-on-SVG semantics — so this slug captures the gesture as one
unit.

## Params

See [`schema.json`](./schema.json) for the authoritative shape. Summary:

| field             | kind        | purpose |
|---|---|---|
| `svgId`           | fundamental | DOM id for the host `<svg>`. |
| `outputId`        | fundamental | DOM id for the readout div. |
| `title`           | fundamental | Header title. |
| `hint`            | fundamental | Hint shown next to the title. |
| `viewBox`         | fundamental | SVG `viewBox`. |
| `svgWidth`        | fundamental | SVG `width` attr. |
| `svgHeight`       | fundamental | SVG `height` attr. |
| `ariaLabel`       | fundamental | `aria-label` on the `<svg>`. |
| `pick`            | fundamental | `{id, label, options:[{value, label, selected?}]}` Hamiltonian-family picker. |
| `buttons`         | fundamental | `[{id, label}]` action buttons (Step, Clear). |
| `buttonsTrailing` | fundamental | Inline HTML appended to the buttons row — typically a `<span class="small">` carrying the click hint. |
| `outputInitial`   | fundamental | Initial inner HTML of the readout. |
| `sectionComment`  | *artifact*  | Optional `/* ... */` banner above the IIFE. |
| `bodyScript`      | *artifact*  | Verbatim IIFE body — wires the select, the click handler, and the step/clear buttons; draws the field and trajectories. |

## Usage

```json
{ "type": "widget",        "slug": "hamiltonians-flow-portrait", "params": { ... } },
{ "type": "widget-script", "slug": "hamiltonians-flow-portrait", "params": { ... } }
```

Both blocks carry the same `params` object.
