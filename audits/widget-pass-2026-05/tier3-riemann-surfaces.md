# riemann-surfaces — tier 3 functional verification (2026-05)

**Widgets:** 7 total, 2 responsive, 1 unresponsive, 4 static (no controls)

## Per-widget status

| ID | Title | Status | Controls tested | Controls that changed output |
|---|---|---|---:|---:|
| `w-sphere` | Stereographic chart · sphere vs plane | static | 0 | 0 |
| `w-torus` | Lattice, parallelogram, and τ | static | 0 | 0 |
| `w-rs-lattice` | The torus C/Λ\mathbb{C}/\LambdaC/Λ as a Riemann surface | responsive | 2 | 2 |
| `w-branch` | Two-sheet cover and monodromy | responsive | 2 | 2 |
| `w-rh` | Riemann–Hurwitz calculator | unresponsive | 2 | 0 |
| `w-uniform` | The trichotomy | static | 0 | 0 |
| `w-div` | Place points, build a divisor | static | 0 | 0 |

## Unresponsive widgets

- **`w-rh`** — Riemann–Hurwitz calculator
  - sample readout: `n = 2   g(Y) = 0   ramification indices = [2, 2, 2, 2] Σ (e_p − 1) = 4 χ(X) = n·`
