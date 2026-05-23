# schemes-proj

Proj / projective-line explorer, introduced on `schemes.html` §11. Bespoke
semantic module — the geometry is intrinsic; params carry only chrome.

See [../README.md](../README.md) for the registry contract.

## What it does

$\mathbb{P}^1=\operatorname{Proj}k[x_0,x_1]$ is covered by two affine charts
$U_0=\{x_0\neq0\}$ with coordinate $t=x_1/x_0$ and $U_1=\{x_1\neq0\}$ with
$s=x_0/x_1=1/t$. Sweep the point $[x_0:x_1]=[\cos\theta:\sin\theta]$ around
$\mathbb{P}^1$; the widget shows its coordinate in each chart and the transition
$t=1/s$ on the overlap, including the two points each chart misses ($[1:0]$ is the
origin of $U_0$ but $s=\infty$ in $U_1$, and $[0:1]$ is the origin of $U_1$ but the
"point at infinity" $t=\infty$ of $U_0$). Gluing the two affine lines at their ends
gives the whole projective line.

## Params

| field | type | purpose |
|---|---|---|
| `widgetId` | string | DOM id; script derives `-th/-svg/-out`. |
| `title` | string | Header title. |
| `hint` | string (optional) | Short hint. |

## Usage

Add a `widget` block + ref-based `widget-script` block to
`content/schemes.json`, then `node scripts/rebuild.mjs --only widget-params`
and `node scripts/rebuild.mjs`.
