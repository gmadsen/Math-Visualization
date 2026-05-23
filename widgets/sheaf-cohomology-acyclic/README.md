# sheaf-cohomology-acyclic

Acyclic-resolution explorer for derived-functor cohomology, introduced on
`sheaf-cohomology.html` §4 (*Derived functor cohomology*). Bespoke semantic
module — a structural diagram; params carry only chrome.

See [../README.md](../README.md) for the registry contract.

## What it does

Three tabs show three flavours of $\Gamma$-acyclic resolution that all compute
the same $H^i(X,\mathcal F)=R^i\Gamma$:

1. **Godement (flabby)** — $G^k(\mathcal F)=\prod_x \mathcal F_x$, flabby hence
   acyclic; the canonical $R^i\Gamma$ construction.
2. **de Rham (fine)** — $0\to\mathbb R\to\Omega^0\to\Omega^1\to\cdots$ on a smooth
   manifold; fine hence acyclic; gives $H^p_{\mathrm{dR}}=H^p(X,\mathbb R)$.
3. **Čech (affine)** — an affine cover is acyclic for quasi-coherent $\mathcal F$
   (Serre); the Čech complex is the resolution (Leray) — how you actually compute.

Each tab draws the resolution chain $\mathcal F\to A^0\to A^1\to A^2\to\cdots$,
the apply-$\Gamma$ step (left exact, exactness lost), and what taking cohomology
computes. The readout notes $R^0\Gamma=\Gamma(\mathcal F)$ and that $R^{>0}\Gamma$
measures the failure of right-exactness (§1's exponential sequence).

## Params

| field | type | purpose |
|---|---|---|
| `widgetId` | string | DOM id; script derives `-svg/-out` and the three resolution-tab button ids. |
| `title` | string | Header title. |
| `hint` | string (optional) | Short hint. |

## Usage

Add a `widget` block + ref-based `widget-script` block to
`content/sheaf-cohomology.json`, then `node scripts/rebuild.mjs --only widget-params`
and `node scripts/rebuild.mjs`.
