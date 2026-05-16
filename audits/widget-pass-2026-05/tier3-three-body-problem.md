# three-body-problem — tier 3 functional verification (2026-05)

**Widgets:** 6 total, 4 responsive, 1 unresponsive, 1 static (no controls)

## Per-widget status

| ID | Title | Status | Controls tested | Controls that changed output |
|---|---|---|---:|---:|
| `w-tbp-sim` | Two-body & three-body simulator | unresponsive | 1 | 0 |
| `w-tbp-l` | Effective potential & Lagrange points | responsive | 2 | 2 |
| `w-tbp-sp` | Three special solutions | static | 0 | 0 |
| `w-tbp-h` | Smale horseshoe — symbolic itinerary | responsive | 1 | 1 |
| `w-tbp-k` | KAM: tori vs. perturbation | responsive | 1 | 1 |
| `w-tbp-h2` | Halo orbit at L1L_1L1​ / L2L_2L2​ | responsive | 1 | 1 |

## Unresponsive widgets

- **`w-tbp-sim`** — Two-body & three-body simulator
  - sample readout: `preset=2body  E=-0.5000 (ΔE/E=3.8e-7)  L_z=0.6124 (ΔL/L=2.5e-15)`
