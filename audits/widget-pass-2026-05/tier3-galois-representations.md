# galois-representations — tier 3 functional verification (2026-05)

**Widgets:** 9 total, 6 responsive, 1 unresponsive, 2 static (no controls)

## Per-widget status

| ID | Title | Status | Controls tested | Controls that changed output |
|---|---|---|---:|---:|
| `w-profinite` | Widget 1 · Profinite cartoon of GQG_\mathbb{Q}GQ​ | static | 0 | 0 |
| `w-diagram` | Widget 2 · The representation map | static | 0 | 0 |
| `w-cyclo` | Widget 3 · Cyclotomic action on μℓn\mu_{\ell^n}μℓn​ | responsive | 2 | 2 |
| `w-tate` | Widget 4 · The Tate-module tower ⋯→E[ℓ3]→E[ℓ2]→E[ℓ]\cdots \to E[\ell^3] \to E[\e | responsive | 1 | 1 |
| `w-matrix` | Widget 5 · The Frobenius matrix dial | responsive | 2 | 2 |
| `w-apbar` | Widget 6 · apa_pap​ bar chart for E:y2=x3−xE: y^2 = x^3 - xE:y2=x3−x, primes p≤1 | responsive | 2 | 2 |
| `w-hasse` | Widget 7 · Hasse disk — eigenvalues of Frobp\mathrm{Frob}_pFrobp​ | unresponsive | 2 | 0 |
| `w-lfac` | Widget 8 · Local LLL-factor from Frobenius characteristic polynomial | responsive | 2 | 2 |
| `w-deligne` | Widget 9 · Eigenform →\to→ Galois representation | responsive | 1 | 1 |

## Unresponsive widgets

- **`w-hasse`** — Widget 7 · Hasse disk — eigenvalues of Frobp\mathrm{Frob}_pFrobp​
  - sample readout: `The two Frobenius eigenvalues sit on the circle of radius √p in C. They are comp`
