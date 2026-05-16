# hecke-operators — tier 3 functional verification (2026-05)

**Widgets:** 8 total, 3 responsive, 1 unresponsive, 4 static (no controls)

## Per-widget status

| ID | Title | Status | Controls tested | Controls that changed output |
|---|---|---|---:|---:|
| `w-motive` | The spectral decomposition of MkM_kMk​ | static | 0 | 0 |
| `w-sub` | Sublattices of index ppp | responsive | 2 | 2 |
| `w-qact` | TpT_pTp​ on the Fourier coefficients | responsive | 2 | 2 |
| `w-commute` | Hecke algebra commutativity | static | 0 | 0 |
| `w-eig` | Ramanujan τ\tauτ: eigenvalues of Δ\DeltaΔ | static | 0 | 0 |
| `w-mult` | Multiplicative relation check: aman=?amna_m a_n \stackrel{?}{=} a_{mn}am​an​=?am | unresponsive | 2 | 0 |
| `w-pet` | Petersson integral on the fundamental domain | static | 0 | 0 |
| `w-euler` | Euler factor of Δ\DeltaΔ at ppp | responsive | 1 | 1 |

## Unresponsive widgets

- **`w-mult`** — Multiplicative relation check: aman=?amna_m a_n \stackrel{?}{=} a_{mn}am​an​=?am
  - sample readout: `τ(2) = -24 τ(3) = 252 τ(2·3) = τ(6) = -6048 τ(2)·τ(3) = -6048 gcd(2,3) = 1, so w`
