# sheaf-cohomology-serre-duality

Serre-duality reflection explorer, introduced on `sheaf-cohomology.html` §9
(*Serre duality and Kodaira vanishing*). Bespoke semantic module — the dimensions
are intrinsic (Serre's theorem); params carry only chrome.

See [../README.md](../README.md) for the registry contract.

## What it does

Sliders pick $n$ (so $X=\mathbb P^n$), the twist $d$, and a degree $i$. The
widget pairs the cell $(i,d)$ with its **Serre dual** $(n-i,\,-d-n-1)$ — using
$\omega_{\mathbb P^n}=\mathcal O(-(n+1))$ — and shows the two cohomology
dimensions agree, realizing
$H^i(\mathcal O(d))\cong H^{n-i}(\mathcal O(-d-n-1))^\vee$. A reflected
$d$-number-line marks $d$ and $d'=-d-n-1$ about the axis $d=-(n+1)/2$. The
dimension formula is self-dual ($h^0=\binom{n+d}{n}$ for $d\ge0$; $h^n=\binom{-d-1}{n}$
for $d\le-n-1$; $0$ in between), so the two cells always match.

Deliberately distinct from the §7 dimension-table widget: this one foregrounds
the **duality pairing** (the reflection symmetry), not the table.

## Params

| field | type | purpose |
|---|---|---|
| `widgetId` | string | DOM id; script derives `-n/-d/-i` sliders, their pills, `-svg`, `-out`. |
| `title` | string | Header title. |
| `hint` | string (optional) | Short hint. |

## Usage

Add a `widget` block + ref-based `widget-script` block to
`content/sheaf-cohomology.json`, then `node scripts/rebuild.mjs --only widget-params`
and `node scripts/rebuild.mjs`.
