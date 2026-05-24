# operator-algebras-cstar

C*-algebra example gallery, introduced on `operator-algebras.html` §2 (*Banach
*-algebras and C*-algebras*). Bespoke semantic module — the examples are
intrinsic; params carry only chrome.

See [../README.md](../README.md) for the registry contract.

## What it does

Five buttons — $\mathbb C$, $C(X)$, $M_n(\mathbb C)$, $B(H)$, $\mathcal K(H)$ —
show, per example, the involution $a^*$, whether it is **commutative** and
**unital**, and the instance of the **C*-identity** $\lVert a^*a\rVert=\lVert
a\rVert^2$. The gallery spans the one-dimensional $\mathbb C$, the commutative
$C(X)$ (which Gelfand duality shows are *all* commutative unital C*-algebras),
the finite-dimensional $M_n(\mathbb C)$, the universal $B(H)$ (every C*-algebra
embeds in one via GNS), and the key **non-unital** $\mathcal K(H)$ (compact
operators, ideal in $B(H)$). The readout states the rigidity of the C*-identity.
SVG text uses plain `K(H)` to stay BMP-safe; the button label keeps KaTeX
$\mathcal K$.

## Params

| field | type | purpose |
|---|---|---|
| `widgetId` | string | DOM id; script derives `-svg/-out` and the five example-button ids. |
| `title` | string | Header title. |
| `hint` | string (optional) | Short hint. |

## Usage

Add a `widget` block + ref-based `widget-script` block to
`content/operator-algebras.json`, then `node scripts/rebuild.mjs --only widget-params`
and `node scripts/rebuild.mjs`.
