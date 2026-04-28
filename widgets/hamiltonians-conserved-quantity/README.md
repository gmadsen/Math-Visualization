# hamiltonians-conserved-quantity

Bespoke widget for the §4 conserved-quantity tracker on the
[`hamiltonians-classical-mechanics`](../../hamiltonians-classical-mechanics.html#noether)
topic.

See [`../README.md`](../README.md) for the registry contract.

## What it does

Two `<select>` pickers share a single `.row`:

- **System** chooses one of three Hamiltonians: harmonic oscillator, central
  potential in 2D, uniform gravity.
- **Track** chooses what to plot along the flow: energy $H$, linear momentum
  $p$, or angular momentum $L$ (only meaningful in the central-potential
  case).

The SVG plots the chosen quantity against time; the readout calls out which
quantities are conserved for the chosen system (Noether's theorem in
Hamiltonian dress).

The two-pickers-on-one-row layout is bespoke; no shared slug exposes a
multi-pick row.

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
| `picks`          | fundamental | Two-element array of pickers `[{id, label, options:[...]}]`, both rendered in the same `.row`. |
| `outputInitial`  | fundamental | Initial readout HTML. |
| `sectionComment` | *artifact*  | Optional `/* ... */` banner above the IIFE. |
| `bodyScript`     | *artifact*  | Verbatim IIFE body — wires the two selects, integrates the chosen Hamiltonian, plots the tracked quantity, and updates the readout. |

## Usage

```json
{ "type": "widget",        "slug": "hamiltonians-conserved-quantity", "params": { ... } },
{ "type": "widget-script", "slug": "hamiltonians-conserved-quantity", "params": { ... } }
```
