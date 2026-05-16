# sato-tate — tier 3 functional verification (2026-05)

**Widgets:** 9 total, 7 responsive, 1 unresponsive, 1 static (no controls)

## Per-widget status

| ID | Title | Status | Controls tested | Controls that changed output |
|---|---|---|---:|---:|
| `w-angle` | Frobenius eigenvalues on the Hasse circle | responsive | 2 | 2 |
| `w-weyl` | Weyl test function tracker | unresponsive | 2 | 0 |
| `w-hist` | Sato–Tate histogram (4000 samples) | static | 0 | 0 |
| `w-cdf` | CDF gap tester | responsive | 1 | 1 |
| `w-frob` | Frobenius-angle histogram from actual primes | responsive | 2 | 2 |
| `w-cm` | Four curves on the same histogram axes | responsive | 2 | 2 |
| `w-symn` | Chebyshev UnU_nUn​ and SU(2)\mathrm{SU}(2)SU(2) characters | responsive | 2 | 2 |
| `w-moments` | Symmetric-power moment tracker | responsive | 2 | 2 |
| `w-symstrip` | Symn^nn Euler-factor strip visualizer | responsive | 2 | 2 |

## Unresponsive widgets

- **`w-weyl`** — Weyl test function tracker
  - sample readout: `target μ: semicircle test f: u1 ∫ f dμ = -0.0000   running avg = 0.0052   \|gap\`
