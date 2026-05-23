# functional-analysis-riesz

Riesz-representation explorer, introduced on `functional-analysis.html` §11.
Bespoke semantic module — the geometry is intrinsic; params carry only the
initial representing vector.

See [../README.md](../README.md) for the registry contract.

## What it does

Set a representing vector $v$ (two sliders) and move a test point $x$. The bounded
linear functional $\ell(x)=\langle x,v\rangle$ is drawn by its parallel **level
lines** (perpendicular to $v$), with the kernel $\ell=0$ through the origin
(pink). The readout reports $\ell(x)=\langle x,v\rangle$ as the signed projection
of $x$ onto $v$ scaled by $\|v\|$, and $\|\ell\|=\|v\|$ — the isometry
$H\cong H^*$ that the Riesz representation theorem provides: every bounded
functional is an inner product with a unique vector.

## Params

| field | type | purpose |
|---|---|---|
| `widgetId` | string | DOM id; script derives `-vx/-vy/-th/-svg/-out`. |
| `title` | string | Header title. |
| `hint` | string (optional) | Short hint. |
| `v0` | array (optional) | Initial representing vector `[vx,vy]` (default `[1.3,0.8]`). |

## Usage

Add a `widget` block + ref-based `widget-script` block to
`content/functional-analysis.json`, then `node scripts/rebuild.mjs --only widget-params`
and `node scripts/rebuild.mjs`.
