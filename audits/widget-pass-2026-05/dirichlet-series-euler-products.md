# dirichlet-series-euler-products — widget audit (2026-05)

**Widgets:** 9 total, 1 with structural issues
**Console errors at load:** 0

## Widgets

| ID | Title | SVG | Canvas | Inputs | Readout chars | Issues |
|---|---|---:|---:|---:|---:|---|
| w-halfplane | Half-plane of convergence | 1 | 0 | 1 | 9 | — |
| w-zeta | ζ(σ)\zeta(\sigma)ζ(σ) on the real axis | 1 | 0 | 1 | 38 | — |
| w-sieve | Sieve: ζ(s)⋅(1−2−s)⋅(1−3−s)⋯→1\zeta(s)\cdot(1-2^{-s})\cdot(1-3^{-s})\cdots \to 1 | 1 | 0 | 11 | 55 | — |
| w-euler | Euler product vs. partial sum for ζ(s)\zeta(s)ζ(s) | 1 | 0 | 2 | 78 | — |
| w-chartab | Character table (Z/N)×(\mathbb{Z}/N)^\times(Z/N)× | 0 | 0 | 1 | 0 | controls-no-output |
| w-lchi | L(s,χ4)L(s,\chi_4)L(s,χ4​) — non-trivial character mod 4 | 1 | 0 | 1 | 21 | — |
| w-funceq | Reflection s↔1−ss \leftrightarrow 1-ss↔1−s | 1 | 0 | 1 | 18 | — |
| w-mellin | Gamma integral ∫0∞xs−1e−nx dx=Γ(s) n−s\int_0^\infty x^{s-1} e^{-nx}\,dx = \Gamma | 1 | 0 | 2 | 110 | — |
| w-apprimes | π(x;4,1)\pi(x;4,1)π(x;4,1) vs. π(x;4,3)\pi(x;4,3)π(x;4,3) | 1 | 0 | 1 | 71 | — |

## Issues found

- **w-chartab** — _Character table (Z/N)×(\mathbb{Z}/N)^\times(Z/N)×_ — controls-no-output

## Console errors

none
