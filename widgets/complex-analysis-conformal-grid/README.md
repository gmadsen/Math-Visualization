# complex-analysis-conformal-grid

Conformality explorer, introduced on `complex-analysis.html` §6. Bespoke semantic
module — the function eval is intrinsic (a `kind` enum); params carry only the
case menu.

See [../README.md](../README.md) for the registry contract.

## What it does

A rectangular grid in the $z$-plane is shown beside its image under $f$, with one
vertical and one horizontal gridline highlighted through a movable sample point.
For a **holomorphic** $f$ ($z^2$, $e^z$, $1/z$) the image gridlines still cross at
$+90°$ — the map is **conformal**: locally a rotation by $\arg f'$ and a scaling
by $|f'|$ (the amplitwist), which is the geometric content of the Cauchy–Riemann
equations. Conjugation $\bar z$ crosses at $-90°$ (angle size preserved,
orientation reversed — anti-conformal, not holomorphic); $2\,\mathrm{Re}(z)$
collapses the grid to a line. The widget measures the image crossing angle
numerically.

## Params

| field | type | purpose |
|---|---|---|
| `widgetId` | string | DOM id; script derives `-sel/-t/-svg/-out`. |
| `title` | string | Header title. |
| `hint` | string (optional) | Short hint. |
| `functions` | array | Each: `id`, `label` (plain text), `kind` (`z2`/`ez`/`inv_z`/`conj`/`redouble`), optional `note`. |

## Usage

Add a `widget` block + ref-based `widget-script` block to
`content/complex-analysis.json`, then `node scripts/rebuild.mjs --only widget-params`
and `node scripts/rebuild.mjs`.
