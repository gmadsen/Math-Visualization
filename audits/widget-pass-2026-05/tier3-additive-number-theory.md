# additive-number-theory — tier 3 functional verification (2026-05)

**Widgets:** 20 total, 15 responsive, 2 unresponsive, 3 static (no controls)

## Per-widget status

| ID | Title | Status | Controls tested | Controls that changed output |
|---|---|---|---:|---:|
| `w-table` | r_k(n) for small n,k | static | 0 | 0 |
| `w-desc` | Brahmagupta–Fibonacci multiplier | responsive | 5 | 1 |
| `w-lattice` | Gaussian integer lattice | responsive | 1 | 1 |
| `w-twosq` | Two-squares checker | responsive | 2 | 1 |
| `w-2sq-mult-clock` | Squares modulo 13 — when is -1 a square? | responsive | 2 | 2 |
| `w-three` | Three-squares: excluded integers | responsive | 2 | 1 |
| `w-four` | Four-squares decomposer | responsive | 2 | 1 |
| `w-waring` | Waring constants | static | 0 | 0 |
| `w-decomp` | Waring decomposition — greedy backtracking | responsive | 3 | 3 |
| `w-table-2` | g(k) and G(k) lookup | static | 0 | 0 |
| `w-circle` | \|f(α)\| on [0,1] — the fingerprint | responsive | 2 | 2 |
| `w-gauss` | Gauss sum S(a,q) | responsive | 3 | 3 |
| `w-faul` | Faulhaber polynomial generator | responsive | 2 | 2 |
| `w-faul-triangular` | Induce the rule: 1+2+...+n | unresponsive | 1 | 0 |
| `w-faul-cubic` | Induce the rule: 1^3+2^3+...+n^3 | unresponsive | 1 | 0 |
| `w-bern` | Bernoulli generating function | responsive | 2 | 2 |
| `w-zeta` | zeta(2n) and zeta(-n) from Bernoulli | responsive | 1 | 1 |
| `w-em` | Harmonic partial sum H_n via Euler-Maclaurin | responsive | 2 | 2 |
| `w-fe` | xi(s)=xi(1-s) consistency check | responsive | 1 | 1 |
| `w-app` | Naive vs Euler-Maclaurin zeta(s) | responsive | 3 | 3 |

## Unresponsive widgets

- `w-faul-triangular` — **Induce the rule: 1+2+...+n** — 1 controls triggered, 0 changed output. Sample readout: `Outputs for the hidden test inputs`
- `w-faul-cubic` — **Induce the rule: 1^3+2^3+...+n^3** — 1 controls triggered, 0 changed output. Sample readout: `Outputs for the hidden test inputs`
