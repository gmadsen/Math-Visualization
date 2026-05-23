# complex-analysis-singularity-zoo

Isolated-singularity classifier, introduced on `complex-analysis.html` §18.
Bespoke semantic module — complex evaluation + plotting are intrinsic (a `kind`
enum); params carry the function menu and the classification text.

See [../README.md](../README.md) for the registry contract.

## What it does

Pick a function with a singularity at $0$ — $\sin(z)/z$ (removable),
$1/z$ (simple pole), $1/(z^3-z^2)$ (pole of order 2), $e^{1/z}$ (essential) —
and shrink the radius $r$ of a small circle $|z|=r$. The widget plots the image
$f(|z|=r)$ in the $w$-plane and tracks $\max|f|$. Removable stays bounded; a pole
grows like $r^{-k}$; the essential singularity sweeps a wild, ever-widening curve
(Casorati–Weierstrass / Picard). A colour-coded badge names the type and the
readout shows the principal part.

## Params

| field | type | purpose |
|---|---|---|
| `widgetId` | string | DOM id; script derives `-sel/-r/-svg/-out`. |
| `title` | string | Header title. |
| `hint` | string (optional) | Short hint. |
| `functions` | array | Each: `id`, `label` (plain text), `kind` (`sinz_z`/`inv_z`/`inv_z2z`/`exp_invz`), `type` (`removable`/`pole`/`essential`), `laurent` (principal part), optional `behavior`. |

## Usage

Add a `widget` block + ref-based `widget-script` block to
`content/complex-analysis.json`, then `node scripts/rebuild.mjs --only widget-params`
and `node scripts/rebuild.mjs`.
