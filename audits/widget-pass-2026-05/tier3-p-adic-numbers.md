# p-adic-numbers — tier 3 functional verification (2026-05)

**Widgets:** 10 total, 2 responsive, 6 unresponsive, 2 static (no controls)

## Per-widget status

| ID | Title | Status | Controls tested | Controls that changed output |
|---|---|---|---:|---:|
| `w1` | W1 · vpv_pvp​ and ∣⋅∣p\|\cdot\|_p∣⋅∣p​ calculator | unresponsive | 2 | 0 |
| `w4` | W4 · Ultrametric triangle | unresponsive | 2 | 0 |
| `w2` | W2 · p-adic expansion | unresponsive | 2 | 0 |
| `w2b` | Inverse system view | static | 0 | 0 |
| `w3` | W3 · The p-adic tree | responsive | 2 | 2 |
| `w6` | W6 · Convergence comparison | unresponsive | 2 | 0 |
| `w-padic-mult-clock` | Multiplication mod 7 — the cyclic structure | responsive | 2 | 2 |
| `w5` | W5 · Hensel lift step-by-step | unresponsive | 2 | 0 |
| `w-hensel-sandbox` | Hensel-lift sandbox | static | 0 | 0 |
| `w7` | W7 · Local solvability check | unresponsive | 2 | 0 |

## Unresponsive widgets

- **`w1`** — W1 · vpv_pvp​ and ∣⋅∣p\|\cdot\|_p∣⋅∣p​ calculator
  - sample readout: `x = 98/3 v_7(98) = 2    v_7(3) = 0    v_7(x) = 2 \|x\|_7 = 7^(-2) = 0.0204082 \|`
- **`w4`** — W4 · Ultrametric triangle
  - sample readout: `\|a-b\|_2 = 0.2500 \|b-c\|_2 = 1.000 \|a-c\|_2 = 1.000 sorted: 1.000 ≥ 1.000 ≥ 0`
- **`w2`** — W2 · p-adic expansion
  - sample readout: `x = -1/1  in base 5 digits a_0 a_1 a_2 ... : 4 4 4 4 4 4 4 4 4 4  + O(5^10) x ≈`
- **`w6`** — W6 · Convergence comparison
  - sample readout: `N=12  p=3  series=pn \|S_N\|_∞ = 7.972e+5   \|S_N\|_3 = 1.000e+0 p-adically no s`
- **`w5`** — W5 · Hensel lift step-by-step
  - sample readout: `f(x)=x²-2,  p=7,  x_0=3  (seed mod 7) n=0   x_0 ≡ 3 (mod 7)   f(x_0) ≡ 0 (mod 7)`
- **`w7`** — W7 · Local solvability check
  - sample readout: `over ℝ: ax²+by² with (a,b)=(1,-2) reaches c=1 ✓ over ℚ_7: primitive solution mod`
