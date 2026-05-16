# group-cohomology — tier 3 functional verification (2026-05)

**Widgets:** 7 total, 3 responsive, 3 unresponsive, 1 static (no controls)

## Per-widget status

| ID | Title | Status | Controls tested | Controls that changed output |
|---|---|---|---:|---:|
| `w-bar` | Coboundary calculator | responsive | 2 | 1 |
| `w-fix` | Fixed-points calculator | unresponsive | 2 | 0 |
| `w-h90` | Hilbert 90 in Q(i)/Q\mathbb{Q}(i)/\mathbb{Q}Q(i)/Q | unresponsive | 1 | 0 |
| `w-h2` | Extensions of C2C_2C2​ by C2C_2C2​ | static | 0 | 0 |
| `w-tate` | Periodic table | unresponsive | 2 | 0 |
| `w-lhs` | E2E_2E2​-page browser | responsive | 2 | 2 |
| `w-brauer` | Brauer group cheat sheet | responsive | 1 | 1 |

## Unresponsive widgets

- **`w-fix`** — Fixed-points calculator
  - sample readout: `G = C_3 = ⟨σ⟩, σ acts on M = ℤ/6 as multiplication by 2. (σ acts faithfully iff`
- **`w-h90`** — Hilbert 90 in Q(i)/Q\mathbb{Q}(i)/\mathbb{Q}Q(i)/Q
  - sample readout: `β = (5 + 12·i)/13 Norm: N(β) = β·σβ = (5+12i)(5−12i)/13² = 169/169 = 1. Norm = 1`
- **`w-tate`** — Periodic table
  - sample readout: `G = C_3,  M = ℤ/6,  σ acts as ·1. σ−1 acts as ·0;  N = 1+a+…+a^{m−1} ≡ 3 (mod 6)`
