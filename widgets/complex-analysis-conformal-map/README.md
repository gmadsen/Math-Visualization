# complex-analysis-conformal-map

Conformal-map visualizer, introduced on `complex-analysis.html` §5
(Cauchy–Riemann). Bespoke semantic module — the function evaluation and grid
plotting are intrinsic (selected by a `kind` enum); params carry the map menu.

See [../README.md](../README.md) for the registry contract.

## What it does

A grid of horizontal (yellow) and vertical (cyan) lines in the $z$-plane (left
panel) is mapped by a chosen holomorphic function — $z^2$, $z^3$, $e^z$, $1/z$,
the Möbius map $(z-1)/(z+1)$, or the Joukowski map $\tfrac12(z+1/z)$ — to its
image (right panel, auto-scaled). Because holomorphic maps are conformal, the
image curves still cross at right angles everywhere $f'\neq0$; the readout names
$f'$ and the critical points where conformality fails (e.g. $z=0$ for $z^2$).

## Params

| field | type | purpose |
|---|---|---|
| `widgetId` | string | DOM id; script derives `-sel/-svg/-out`. |
| `title` | string | Header title. |
| `hint` | string (optional) | Short hint. |
| `maps` | array | Each: `id`, `label` (plain text), `kind` (`sq`/`cube`/`exp`/`inv`/`mobius`/`joukowski`), optional `deriv` and `critical` strings for the readout. |

## Usage

Add a `widget` block + ref-based `widget-script` block to
`content/complex-analysis.json`, then `node scripts/rebuild.mjs --only widget-params`
and `node scripts/rebuild.mjs`.
