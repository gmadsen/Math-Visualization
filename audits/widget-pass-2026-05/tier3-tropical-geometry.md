# tropical-geometry — tier 3 functional verification (2026-05)

**Widgets:** 6 total, 5 responsive, 1 unresponsive, 0 static (no controls)

## Per-widget status

| ID | Title | Status | Controls tested | Controls that changed output |
|---|---|---|---:|---:|
| `w-trop-poly` | Tropical polynomial plotter | responsive | 2 | 2 |
| `w-trop-balance` | Balancing checker | responsive | 1 | 1 |
| `w-newton-dual` | Newton polytope ↔ tropical curve | responsive | 2 | 2 |
| `w-trop-bezout` | Tropical Bézout calculator | responsive | 2 | 2 |
| `w-chipfire` | Baker–Norine chip-firing | unresponsive | 1 | 0 |
| `w-mikhalkin` | Mikhalkin counts NdN_dNd​ | responsive | 1 | 1 |

## Unresponsive widgets

- **`w-chipfire`** — Baker–Norine chip-firing
  - sample readout: `Divisor D: a→4, b→0.   deg D = 4.Genus g = 2.   deg K_Γ = 2g − 2 = 2.Riemann–Roc`
