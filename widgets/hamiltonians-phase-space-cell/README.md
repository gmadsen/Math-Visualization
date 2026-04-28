# hamiltonians-phase-space-cell

Bespoke widget for the §1 phase-space cell on the
[`hamiltonians-classical-mechanics`](../../hamiltonians-classical-mechanics.html#phase-space)
topic.

See [`../README.md`](../README.md) for the registry contract (schema + pure
render functions) and the bespoke-vs-shared distinction. This module is on the
bespoke side — buttons-only widgets (no slider, no select) don't fit any
shared slug.

## What it does

A unit square is drawn in the $(q, p)$ plane on top of level-set ellipses for
$H = (p^2 + q^2)/2$. Two action buttons drive it:

- **Evolve** — rotates / sheers the cell forward under the harmonic-oscillator
  flow, animating one period.
- **Reset** — restores the original square.

The readout reports area, centroid, and current shape — area stays at 1.000
all the way around the orbit, which is Liouville's theorem made visible.

## Params

See [`schema.json`](./schema.json) for the authoritative shape. Summary:

| field            | kind        | purpose |
|---|---|---|
| `svgId`          | fundamental | DOM id for the host `<svg>`. |
| `outputId`       | fundamental | DOM id for the `<div class="readout">` companion. |
| `title`          | fundamental | Header title rendered in `.hd > .ttl`. |
| `hint`           | fundamental | Short hint rendered next to the title. |
| `viewBox`        | fundamental | SVG `viewBox` attr (e.g. `"-220 -160 440 320"`). |
| `svgWidth`       | fundamental | SVG `width` attr. |
| `svgHeight`      | fundamental | SVG `height` attr. |
| `ariaLabel`      | fundamental | `aria-label` on the `<svg>` (source uses this rather than a `<title>` child — preserved for byte-identity). |
| `buttons`        | fundamental | `[{id, label}]` action buttons rendered in a single `.row`. |
| `outputInitial`  | fundamental | Initial inner HTML of the readout. |
| `sectionComment` | *artifact*  | Optional `/* ... */` banner above the IIFE. |
| `bodyScript`     | *artifact*  | Verbatim IIFE body — sets up the SVG, draws the cell, integrates the harmonic-oscillator flow, and writes area/centroid to the readout. |

Fields marked *artifact* are source-byte preservation aids; portable consumers
ignore them and regenerate behavior from the structured fields alone.

## Usage

Embed the widget by adding two blocks to `content/<topic>.json`:

```json
{ "type": "widget",        "slug": "hamiltonians-phase-space-cell", "params": { ... } },
{ "type": "widget-script", "slug": "hamiltonians-phase-space-cell", "params": { ... } }
```

Both blocks carry the **same** `params` object.

Then run `node scripts/rebuild.mjs --only widget-params` to AJV-validate, and
`node scripts/rebuild.mjs` for the full chain (including the byte-identical
round-trip gate).
