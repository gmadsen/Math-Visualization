# moonshine — tier 3 functional verification (2026-05)

**Widgets:** 8 total, 4 responsive, 3 unresponsive, 1 static (no controls)

## Per-widget status

| ID | Title | Status | Controls tested | Controls that changed output |
|---|---|---|---:|---:|
| `w-j` | Widget 1 · j-coefficient table | unresponsive | 1 | 0 |
| `w-mon` | Widget 2 · Monster irreducible dimensions | static | 0 | 0 |
| `w-mck` | Widget 3 · McKay decomposition calculator | responsive | 1 | 1 |
| `w-t` | Widget 4 · Thompson-series selector | responsive | 1 | 1 |
| `w-rep` | Widget 5 · Replication formula for J | unresponsive | 1 | 0 |
| `w-rep-rec` | Widget 6 · Faber-polynomial recursion for c(N)c(N)c(N) | responsive | 1 | 1 |
| `w-gz` | Widget 7 · Genus of X0(N)X_0(N)X0​(N) and X0(N)+X_0(N)+X0​(N)+ | unresponsive | 1 | 0 |
| `w-gen` | Widget 8 · Twisted series Z(g,h;τ)Z(g,h;\tau)Z(g,h;τ) on commuting pairs | responsive | 1 | 1 |

## Unresponsive widgets

- **`w-j`** — Widget 1 · j-coefficient table
  - sample readout: `n      c_n  (Fourier coefficient of q^n in j) ---    ---------------------------`
- **`w-rep`** — Widget 5 · Replication formula for J
  - sample readout: `denominator identity:    p^{-1} · ∏_{m>0, n∈Z} (1 − p^m q^n)^{c(mn)}  =  J(p) −`
- **`w-gz`** — Widget 7 · Genus of X0(N)X_0(N)X0​(N) and X0(N)+X_0(N)+X0​(N)+
  - sample readout: `level     genus X_0(N)     genus X_0(N)+    Atkin–Lehner drop?     Ogg / \|𝕄\|? `
