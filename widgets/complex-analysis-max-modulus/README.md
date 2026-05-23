# complex-analysis-max-modulus

Maximum-modulus-principle heatmap, introduced on `complex-analysis.html` §14.
Bespoke semantic module — the |f| sampling and heatmap are intrinsic (a `kind`
enum); params carry the function menu.

See [../README.md](../README.md) for the registry contract.

## What it does

Pick a holomorphic $f$ ($z^2$, $e^z$, $z^3-z$, $\sin z$, $z^2+z+1$). The widget
shades the closed unit disk by $|f(z)|$ (brighter = larger) and marks where
$|f|$ is largest — always on the boundary. The readout compares the boundary
maximum with the largest interior value (over $|z|\le0.92$), confirming that a
non-constant holomorphic function has no interior local maximum of $|f|$: the
supremum sits on $\partial\mathbb{D}$.

## Params

| field | type | purpose |
|---|---|---|
| `widgetId` | string | DOM id; script derives `-sel/-svg/-out`. |
| `title` | string | Header title. |
| `hint` | string (optional) | Short hint. |
| `functions` | array | Each: `id`, `label` (plain text), `kind` (`sq`/`exp`/`cube_m_z`/`sinz`/`poly211`). |

## Usage

Add a `widget` block + ref-based `widget-script` block to
`content/complex-analysis.json`, then `node scripts/rebuild.mjs --only widget-params`
and `node scripts/rebuild.mjs`.
