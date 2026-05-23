# commutative-algebra-dedekind

Dedekind ideal-factorization explorer, introduced on `commutative-algebra.html`
§14 (*Discrete valuation rings and Dedekind domains*). Bespoke semantic module —
the arithmetic is intrinsic; params carry only chrome.

See [../README.md](../README.md) for the registry contract.

## What it does

In $R=\mathbb Z[\sqrt{-5}]$ the element $6$ factors two genuinely different ways
into irreducibles: $6=2\cdot 3=(1+\sqrt{-5})(1-\sqrt{-5})$ — so $R$ is **not a
UFD**. Two buttons expand each element factorization into **prime ideals**, and
both refine to the *same* factorization
$(6)=\mathfrak p_2^2\,\mathfrak p_3\,\mathfrak p_3'$, with
$\mathfrak p_2=(2,1+\sqrt{-5})$, $\mathfrak p_3=(3,1+\sqrt{-5})$,
$\mathfrak p_3'=(3,1-\sqrt{-5})$ — unique factorization **restored at the level of
ideals**, the defining property of a Dedekind domain. The readout covers the
ramify/split behavior, the class group $\mathrm{Cl}(R)=\mathbb Z/2$ measuring the
gap to a UFD, and the fact that localizing at each prime yields a DVR (uniformizer
$\pi$, valuation $v_\mathfrak p$). Prime ideals are written `p₂/p₃/p₃′` (plain
subscripts) to stay BMP-safe in SVG text.

## Params

| field | type | purpose |
|---|---|---|
| `widgetId` | string | DOM id; script derives `-svg/-out` and the two factorization-button ids. |
| `title` | string | Header title. |
| `hint` | string (optional) | Short hint. |

## Usage

Add a `widget` block + ref-based `widget-script` block to
`content/commutative-algebra.json`, then
`node scripts/rebuild.mjs --only widget-params` and `node scripts/rebuild.mjs`.
