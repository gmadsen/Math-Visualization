# Slice A — widget audit summary (2026-05)

**Topics audited:** 64 / 64
**Driver:** jsdom (per-topic, sequential) — bypassed chrome-devtools-mcp due to a shared-selection race with parallel slice agents.

**Aggregate:**
- Topics with structural issues: **3**
- Topics with console errors at load: **0**
- Total widgets exercised: **494**
- Total widgets flagged: **3**

The structural pass tags a widget when its visible readout contains literal `NaN` / `undefined` / `Infinity`, when the widget element renders empty, or when controls exist but produce no SVG / canvas / readout output.

## Topics with issues (worst first)

| Rank | Topic | Widgets | Issues | Notes |
|---:|---|---:|---:|---|
| 1 | real-analysis | 19 | 1 | `w-pseries` — power-series partial sums shows `R = Infinity` for `e^x` (literal Infinity in readout — likely `1/0` for the convergence-radius formula on the all-coefficients-nonzero case; cosmetic but should display `∞` or `+∞`). |
| 2 | representation-theory | 13 | 1 | `w-chartbl` — character table explorer has controls but renders no SVG/canvas/readout text on initial load (controls-no-output; user must interact before any output appears). |
| 3 | homological | 12 | 1 | `w-flat` — "Tensor a SES — watch exactness" has controls but no initial output (controls-no-output). |

The remaining 61 topics are clean under the structural pass.

## Top 5 worst offenders (by issue count)

1. **real-analysis** — 1 issue (Infinity in readout on `w-pseries`)
2. **representation-theory** — 1 issue (controls-no-output on `w-chartbl`)
3. **homological** — 1 issue (controls-no-output on `w-flat`)
4. _(tie — no other topics with issues)_
5. _(tie — no other topics with issues)_

## Caveats

- jsdom does not exercise canvas drawing (canvases are stubbed via Proxy noop); a widget that uses canvas as its only output device may show a `0`-length readout while being fine in a real browser. Spot-check the two `controls-no-output` findings in a real browser before treating them as bugs.
- KaTeX is stubbed (no math rendering); titles in the per-topic tables show raw `$…$` LaTeX.
- The `Infinity` finding in real-analysis is real (the literal string is in the page DOM); fix is a display formatter, not a logic bug.
- No console errors were detected at load on any of the 64 pages — the boot path is healthy across slice A.
