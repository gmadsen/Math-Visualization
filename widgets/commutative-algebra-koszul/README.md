# commutative-algebra-koszul

Koszul-complex explorer, introduced on `commutative-algebra.html` §16
(*Koszul complex*). Bespoke semantic module — the combinatorics are intrinsic;
params carry only chrome.

See [../README.md](../README.md) for the registry contract.

## What it does

A slider $n$ (1–4) draws the Koszul complex
$K_\bullet(a_1,\ldots,a_n)=\Lambda^\bullet R^n$ as the chain
$0\to K_n\to\cdots\to K_1\to K_0\to 0$ with free-module ranks
$K_k=\Lambda^k R^n=R^{\binom{n}{k}}$ (the binomials sum to $2^n$), the
alternating-sum Euler characteristic $\sum_k(-1)^k\binom{n}{k}=0$, and the
theorem: $a_1,\ldots,a_n$ is a **regular sequence** $\iff$ the complex is exact
in positive degrees with $H_0=R/(a_1,\ldots,a_n)$. The readout gives the
contraction differential, why $d^2=0$ (commutativity), the explicit $n=1$ and
$n=2$ cases, and the uses (finite free resolutions for $\mathrm{Tor}/\mathrm{Ext}$,
detecting depth).

## Params

| field | type | purpose |
|---|---|---|
| `widgetId` | string | DOM id; script derives `-n` (slider), `-nval` (pill), `-svg`, `-out`. |
| `title` | string | Header title. |
| `hint` | string (optional) | Short hint. |

## Usage

Add a `widget` block + ref-based `widget-script` block to
`content/commutative-algebra.json`, then
`node scripts/rebuild.mjs --only widget-params` and `node scripts/rebuild.mjs`.
