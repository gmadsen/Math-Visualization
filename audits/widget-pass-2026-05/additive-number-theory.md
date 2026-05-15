# additive-number-theory — widget audit (2026-05)

**Widgets:** 20 total, 1 with structural issues
**Console errors at load:** 0

## Widgets

| ID | Title | SVG | Canvas | Inputs | Readout chars | Issues |
|---|---|---:|---:|---:|---:|---|
| w-table | rk(n)r_k(n)rk​(n) for small n, kn,\,kn,k | 0 | 0 | 0 | 0 | empty-widget |
| w-desc | Brahmagupta–Fibonacci multiplier | 0 | 0 | 5 | 133 | — |
| w-lattice | Gaussian integer lattice | 1 | 0 | 1 | 0 | — |
| w-twosq | Two-squares checker | 0 | 0 | 2 | 159 | — |
| w-2sq-mult-clock | Squares modulo 13 — when is −1-1−1 a square? | 1 | 0 | 2 | 171 | — |
| w-three | Three-squares: excluded integers | 1 | 0 | 2 | 43 | — |
| w-four | Four-squares decomposer | 0 | 0 | 2 | 138 | — |
| w-waring | Waring constants | 0 | 0 | 0 | 12 | — |
| w-decomp | Waring decomposition — greedy backtracking | 0 | 0 | 3 | 148 | — |
| w-table-2 | g(k)g(k)g(k) and G(k)G(k)G(k) lookup | 1 | 0 | 0 | 125 | — |
| w-circle | ∣f(α)∣\|f(\alpha)\|∣f(α)∣ on [0,1][0,1][0,1] — the fingerprint | 1 | 0 | 2 | 300 | — |
| w-gauss | Gauss sum S(a,q)=∑r=1qe(ark/q)S(a,q)=\sum_{r=1}^q e(a r^k/q)S(a,q)=∑r=1q​e(ark/q | 0 | 0 | 3 | 199 | — |
| w-faul | Faulhaber polynomial generator | 1 | 0 | 2 | 177 | — |
| w-faul-triangular | Induce the rule: 1+2+⋯+n1+2+\cdots+n1+2+⋯+n | 0 | 0 | 6 | 291 | — |
| w-faul-cubic | Induce the rule: 13+23+⋯+n31^3+2^3+\cdots+n^313+23+⋯+n3 | 0 | 0 | 6 | 291 | — |
| w-bern | Bernoulli generating function | 0 | 0 | 2 | 196 | — |
| w-zeta | ζ(2n)\zeta(2n)ζ(2n) and ζ(−n)\zeta(-n)ζ(−n) from Bernoulli | 0 | 0 | 1 | 201 | — |
| w-em | Harmonic partial sum HnH_nHn​ via Euler-Maclaurin | 1 | 0 | 2 | 244 | — |
| w-fe | ξ(s)=ξ(1−s)\xi(s)=\xi(1-s)ξ(s)=ξ(1−s) consistency check | 1 | 0 | 1 | 182 | — |
| w-app | Naïve vs Euler-Maclaurin ζ(s) | 0 | 0 | 3 | 300 | — |

## Issues found

- **w-table** — _rk(n)r_k(n)rk​(n) for small n, kn,\,kn,k_ — empty-widget

## Console errors

none
