# commutative-algebra-completion

p-adic completion explorer, introduced on `commutative-algebra.html` §9
(*Completion*). Bespoke semantic module — the arithmetic is intrinsic; params
carry only chrome.

See [../README.md](../README.md) for the registry contract.

## What it does

Realizes the $I$-adic completion $\hat{\mathbb Z}_{(p)}=\mathbb Z_p=\varprojlim
\mathbb Z/p^n$. Pick a prime $p\in\{2,3,5,7\}$ and an element ($-1$, $13$, or
$1/(1-p)$); the widget shows the **p-adic digit expansion** $\sum_k d_k p^k$ and
the tower of **coherent residues** $r_n=\text{element}\bmod p^n$ with
$r_{n+1}\equiv r_n\pmod{p^n}$. The eye-openers: $-1=\ldots(p{-}1)(p{-}1)(p{-}1)$
(every digit $p-1$) and $1/(1-p)=1+p+p^2+\cdots$ (every digit $1$), while $13$ is
an ordinary integer whose tower stabilizes once $p^n>13$. The readout covers
faithful flatness, Krull's intersection theorem, and Hensel's lemma.

## Params

| field | type | purpose |
|---|---|---|
| `widgetId` | string | DOM id; script derives `-svg/-out` and the prime/element button ids. |
| `title` | string | Header title. |
| `hint` | string (optional) | Short hint. |

## Usage

Add a `widget` block + ref-based `widget-script` block to
`content/commutative-algebra.json`, then
`node scripts/rebuild.mjs --only widget-params` and `node scripts/rebuild.mjs`.
