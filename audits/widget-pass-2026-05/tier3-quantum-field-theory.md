# quantum-field-theory — tier 3 functional verification (2026-05)

**Widgets:** 6 total, 3 responsive, 1 unresponsive, 2 static (no controls)

## Per-widget status

| ID | Title | Status | Controls tested | Controls that changed output |
|---|---|---|---:|---:|
| `qft-modes` | Quantum field as a stack of harmonic oscillators | unresponsive | 1 | 0 |
| `qft-fock` | Spin-statistics on display: drag particles to swap | static | 0 | 0 |
| `qft-paths` | Sum over paths: classical limit by stationary phase | responsive | 2 | 2 |
| `qft-diagrams` | Feynman amplitude assembly: e+e−→μ+μ−e^+e^- \to \mu^+\mu^-e+e−→μ+μ− tree, plus a | responsive | 1 | 1 |
| `qft-rg-flow` | RG running: αQED\alpha_{\mathrm{QED}}αQED​ grows, αs\alpha_sαs​ shrinks with ene | responsive | 1 | 1 |
| `qft-sm-fields` | Standard Model gauge group: SU(3)×SU(2)×U(1) | static | 0 | 0 |

## Unresponsive widgets

- **`qft-modes`** — Quantum field as a stack of harmonic oscillators
  - sample readout: `statistics: bosonic (any occupation; display caps at 5/mode)    N = 0    Σp = 0`
