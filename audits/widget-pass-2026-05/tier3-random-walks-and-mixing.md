# random-walks-and-mixing — tier 3 functional verification (2026-05)

**Widgets:** 6 total, 4 responsive, 1 unresponsive, 1 static (no controls)

## Per-widget status

| ID | Title | Status | Controls tested | Controls that changed output |
|---|---|---|---:|---:|
| `w-walk-step` | Random walk on a small graph | static | 0 | 0 |
| `w-power` | Matrix power animator | responsive | 1 | 1 |
| `w-tv` | Total-variation distance vs.\ time | responsive | 2 | 2 |
| `w-eig` | Eigenvalue inspector | responsive | 1 | 1 |
| `w-couple` | Coupling on the cycle | unresponsive | 1 | 0 |
| `w-mh` | Metropolis–Hastings on a bimodal target | responsive | 1 | 1 |

## Unresponsive widgets

- **`w-couple`** — Coupling on the cycle
  - sample readout: `n = 10 · steps t = 0 X = 0, Y = 5, gap = 5 not met yet · mirror coupling: gap pe`
