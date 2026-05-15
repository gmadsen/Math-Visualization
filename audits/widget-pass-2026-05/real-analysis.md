# real-analysis — widget audit (2026-05)

**Widgets:** 19 total, 1 with structural issues
**Console errors at load:** 0

## Widgets

| ID | Title | SVG | Canvas | Inputs | Readout chars | Issues |
|---|---|---:|---:|---:|---:|---|
| w-sqrt2 | Rational approximations to $\sqrt 2$ | 1 | 0 | 1 | 224 |  |
| w-eps | $\varepsilon$–$\delta$ on $f(x)=x^2$ at $a=1$ | 1 | 0 | 2 | 223 |  |
| w-mvt | Best linear approximation & mean value theorem | 1 | 0 | 2 | 201 |  |
| w-unif | Pointwise vs uniform convergence | 1 | 0 | 2 | 182 |  |
| w-riem | Riemann upper/lower sums | 1 | 0 | 2 | 204 |  |
| w-grad | Gradient field of $f(x,y)$ | 1 | 0 | 1 | 196 |  |
| w-jac | Area scaling by $\|\det J_\varphi\|$ | 1 | 0 | 3 | 300 |  |
| w-ift | Solving $F(x,y)=0$ locally | 1 | 0 | 3 | 205 |  |
| w-saddle-pitchfork | Sublevel set bifurcation: y² ≤ a·x² − x⁴ | 1 | 0 | 1 | 89 |  |
| w-ratio | Ratio-test explorer | 1 | 0 | 4 | 174 |  |
| w-pseries | Power-series partial sums | 1 | 0 | 3 | 105 | Infinity |
| w-baire | Baire demo: rationals vs. complete spaces | 1 | 0 | 2 | 239 |  |
| w-ftc | FTC diagram: area(left) ↔ $F(x)$(right) | 1 | 0 | 3 | 194 |  |
| w-bump | Bump explorer & mollification | 1 | 0 | 2 | 184 |  |
| w-arz | Arzelà–Ascoli: equicontinuous vs not | 1 | 0 | 3 | 288 |  |
| w-bv | Total variation: refining the partition | 1 | 0 | 3 | 153 |  |
| w-cantor | Cantor function: continuous + BV, NOT absolutely continuous | 1 | 0 | 2 | 300 |  |
| w-vitali | Greedy Vitali extraction | 1 | 0 | 4 | 300 |  |
| w-ldt | Averages converge: Lebesgue differentiation theorem | 1 | 0 | 3 | 258 |  |

## Issues found

- **w-pseries** — _Power-series partial sums_ — Infinity
  - readout sample: `series : e^x R = Infinity at x = 1:   S_4(x) = 2.708333   ,   f(x) = 2.718282 error  |S_N − f| = 9.948e-3`

## Console errors

none
