# complex-analysis-riemann-sphere

Stereographic-projection visualizer for the Riemann sphere, introduced on
`complex-analysis.html` §2. Bespoke semantic module — stereographic projection
and the fixed oblique 3-D drawing are intrinsic; params carry only optional
presets.

See [../README.md](../README.md) for the registry contract.

## What it does

The unit-diameter sphere sits tangent to the plane at the origin (so the south
pole is $0$, the north pole $N=\infty$). The reader sets $|z|$ and $\arg z$ (or
picks a preset); the widget projects $z$ from $N$ to its image
$P(z)=(x,y,|z|^2)/(1+|z|^2)$ on the sphere, drawing the tangent plane, a sphere
wireframe (equator highlighted), and the projection ray $N\to z$ in a fixed
oblique view. $|z|<1$ lands in the southern hemisphere, $|z|=1$ on the equator,
$|z|\to\infty$ at the north pole. The readout notes that the projection is
conformal and sends circles ↔ circles.

## Params

| field | type | purpose |
|---|---|---|
| `widgetId` | string | DOM id; script derives `-mod/-arg/-preset/-svg/-out`. |
| `title` | string | Header title. |
| `hint` | string (optional) | Short hint. |
| `presets` | array (optional) | Jump targets: each `id`, `label` (plain text), `mod` (|z|), `arg` (radians). |

## Usage

Add a `widget` block + ref-based `widget-script` block to
`content/complex-analysis.json`, then `node scripts/rebuild.mjs --only widget-params`
and `node scripts/rebuild.mjs`.
