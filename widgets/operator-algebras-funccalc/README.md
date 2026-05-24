# operator-algebras-funccalc

Continuous-functional-calculus explorer, introduced on `operator-algebras.html`
§4 (*Continuous functional calculus*). Bespoke semantic module — the spectrum is
intrinsic; params carry only chrome.

See [../README.md](../README.md) for the registry contract.

## What it does

For a self-adjoint element $a$ with fixed spectrum $\sigma(a)=\{0.5,1,2,3\}$,
four buttons — $\sqrt t$, $t^2$, $1/t$, $e^t$ — apply a continuous $f$ via the
calculus $\Phi_a\colon C(\sigma(a))\to A$, $f\mapsto f(a)$. The widget draws
$\sigma(a)$ and $\sigma(f(a))=f(\sigma(a))$ on two auto-scaled number lines with
arrows $\lambda\mapsto f(\lambda)$ — the **spectral mapping theorem**. The
readout explains $\Phi_a$ as the unique isometric $*$-homomorphism onto
$C^*(a,1)\cong C(\sigma(a))$, and the payoffs: $\sqrt a$ for $a\ge0$,
$|a|=\sqrt{a^*a}$, and polar decomposition $a=v|a|$.

## Params

| field | type | purpose |
|---|---|---|
| `widgetId` | string | DOM id; script derives `-svg/-out` and the four function-button ids. |
| `title` | string | Header title. |
| `hint` | string (optional) | Short hint. |

## Usage

Add a `widget` block + ref-based `widget-script` block to
`content/operator-algebras.json`, then `node scripts/rebuild.mjs --only widget-params`
and `node scripts/rebuild.mjs`.
