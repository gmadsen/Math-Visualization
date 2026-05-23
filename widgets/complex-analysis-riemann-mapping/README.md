# complex-analysis-riemann-mapping

Riemann-mapping-theorem explorer, introduced on `complex-analysis.html` §25.
Bespoke semantic module — the conformal-map eval is intrinsic (a `kind` enum);
params carry only the case menu.

See [../README.md](../README.md) for the registry contract.

## What it does

Pick a canonical simply-connected region (upper/right half-plane, first quadrant,
horizontal strip). The widget draws the region's grid beside its image under an
explicit conformal map onto the unit disk: $(z-i)/(z+i)$ for the upper half-plane,
$(z-1)/(z+1)$ for the right half-plane, $z^2$ then Cayley for the quadrant, $e^z$
then Cayley for the strip. The grid stays orthogonal (the maps are conformal), the
region fills the disk, and the marked base point $z_0$ maps to the centre $0$ — a
concrete instance of the **Riemann mapping theorem**: every simply-connected
proper open $U\subsetneq\mathbb{C}$ is conformally equivalent to the disk.

## Params

| field | type | purpose |
|---|---|---|
| `widgetId` | string | DOM id; script derives `-sel/-svg/-out`. |
| `title` | string | Header title. |
| `hint` | string (optional) | Short hint. |
| `regions` | array | Each: `id`, `label` (plain text), `kind` (`uhp`/`rhp`/`quarter`/`strip`), optional `note`. |

## Usage

Add a `widget` block + ref-based `widget-script` block to
`content/complex-analysis.json`, then `node scripts/rebuild.mjs --only widget-params`
and `node scripts/rebuild.mjs`.
