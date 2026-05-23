# homological-double-complex

Double-complex / total-complex explorer, introduced on `homological.html` §12.
Bespoke semantic module — the grid geometry is intrinsic; params carry the grid
size and chrome.

See [../README.md](../README.md) for the registry contract.

## What it does

Draws a grid of objects $C^{p,q}$ with a horizontal differential $d^h$ (→ $p+1$)
and a vertical $d^v$ (→ $q+1$), where $d^h{}^2=d^v{}^2=0$ and $d^h d^v + d^v
d^h=0$. Slide the **total degree** $n$ and the widget highlights the anti-diagonal
$p+q=n$ whose direct sum is the **total complex** $\mathrm{Tot}^n=\bigoplus_{p+q=n}
C^{p,q}$, with total differential $D=d^h+(-1)^p d^v$ (the sign plus anticommutativity
give $D^2=0$). This is the construction behind Tor symmetry and spectral sequences.

## Params

| field | type | purpose |
|---|---|---|
| `widgetId` | string | DOM id; script derives `-n/-svg/-out`. |
| `title` | string | Header title. |
| `hint` | string (optional) | Short hint. |
| `size` | integer (optional) | Grid is `size×size` (default 4). |

## Usage

Add a `widget` block + ref-based `widget-script` block to
`content/homological.json`, then `node scripts/rebuild.mjs --only widget-params`
and `node scripts/rebuild.mjs`.
