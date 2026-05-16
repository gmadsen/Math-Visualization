# adeles-and-ideles — tier 3 functional verification (2026-05)

**Widgets:** 5 total, 2 responsive, 2 unresponsive, 1 static (no controls)

## Per-widget status

| ID | Title | Status | Controls tested | Controls that changed output |
|---|---|---|---:|---:|
| `w-places` | p-adic absolute value explorer | unresponsive | 2 | 0 |
| `w-adele` | Adele lattice diagram | static | 0 | 0 |
| `w-idele` | Idelic norm calculator | unresponsive | 1 | 0 |
| `w-crt` | CRT / strong approximation toy | responsive | 4 | 1 |
| `w-tate` | Local Euler factor visualizer | responsive | 1 | 1 |

## Unresponsive widgets

- `w-places` — **p-adic absolute value explorer** — 2 controls triggered, 0 changed output. Sample readout: `n = 1 (factored: 1)`
- `w-idele` — **Idelic norm calculator** — 1 controls triggered, 0 changed output. Sample readout: `q = 2/15 (simplified)`
