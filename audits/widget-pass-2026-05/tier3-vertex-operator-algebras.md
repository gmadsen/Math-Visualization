# vertex-operator-algebras — tier 3 functional verification (2026-05)

**Widgets:** 6 total, 3 responsive, 2 unresponsive, 1 static (no controls)

## Per-widget status

| ID | Title | Status | Controls tested | Controls that changed output |
|---|---|---|---:|---:|
| `w-vop` | Widget 1 · Mode bookkeeping | responsive | 1 | 1 |
| `w-ax` | Widget 2 · Axiom dependency map | static | 0 | 0 |
| `w-vir` | Widget 3 · Virasoro bracket calculator | unresponsive | 2 | 0 |
| `w-zhu` | Widget 4 · Character of V♮V^\naturalV♮ — leading qqq-coefficients | unresponsive | 1 | 0 |
| `w-moon` | Widget 5 · McKay–Thompson series viewer | responsive | 1 | 1 |
| `w-app` | Widget 6 · VOA construction zoo | responsive | 1 | 1 |

## Unresponsive widgets

- **`w-vir`** — Widget 3 · Virasoro bracket calculator
  - sample readout: `[L_0, L_-1]  =  1 · L_-1  structure constant  (m − n)            = 1 m^3 − m`
- **`w-zhu`** — Widget 4 · Character of V♮V^\naturalV♮ — leading qqq-coefficients
  - sample readout: `ch_{V^natural}(tau)  =  tr q^{L_0 − c/24}    (c = 24, so c/24 = 1) FLM grading:`
