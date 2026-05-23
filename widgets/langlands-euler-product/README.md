# langlands-euler-product

Euler-product bridge widget, introduced on `langlands-program.html` §2. Makes
"the L-functions match" concrete by point-counting. Bespoke semantic module —
the point-counting and Euler-factor assembly are intrinsic; params carry the
curve presets.

See [../README.md](../README.md) for the registry contract.

## What it does

Pick an elliptic curve $y^2 = x^3 + ax + b$. The widget point-counts
$\#E(\mathbb{F}_p)$ at the first several good primes, derives
$a_p = p+1-\#E(\mathbb{F}_p)$, and tabulates the local factor
$1 - a_p T + p T^2$ (with $T = p^{-s}$). The readout drives the point home: that
$a_p$ is simultaneously the Hecke eigenvalue (automorphic side) and the trace of
Frobenius (Galois side), so $L(E,s)=\prod_p(1-a_p p^{-s}+p^{1-2s})^{-1}$ equals
the Galois Euler product term by term — with Frobenius characteristic polynomial
$x^2 - a_p x + p$.

## Params

| field | type | purpose |
|---|---|---|
| `widgetId` | string | DOM id; script derives `-sel/-svg/-out`. |
| `title` | string | Header title. |
| `hint` | string (optional) | Short hint. |
| `maxPrimes` | integer (optional, default 7) | How many good primes ($p\ge5$, $p\nmid 4a^3+27b^2$) to tabulate. |
| `curves` | array | Presets $y^2=x^3+ax+b$: each `id`, `label` (plain text), `a`, `b` (integers). |

## Usage

Add a `widget` block + ref-based `widget-script` block to
`content/langlands-program.json`, then `node scripts/rebuild.mjs --only widget-params`
and `node scripts/rebuild.mjs`.
