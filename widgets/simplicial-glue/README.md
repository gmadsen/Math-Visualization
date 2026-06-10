# simplicial-glue

The **glue** gesture: build an abstract simplicial complex by clicking on a
hexagon-plus-hub vertex set (7 vertices, 12 candidate edges, 6 candidate
wedge triangles). Click a vertex to toggle it, a dashed edge to glue it, a
triangle interior to fill it. The **downward-closure axiom is enforced
live**: gluing a 2-simplex demands its three boundary edges (refusal message
otherwise), and deleting a vertex sweeps away every face above it (with a
note counting what fell). The readout tracks

$$f = (f_0, f_1, f_2),\qquad \chi = f_0 - f_1 + f_2,\qquad
\beta_0,\ \beta_1 \ (\text{GF}(2)),$$

and checks the Euler–Poincaré identity $\chi = \beta_0 - \beta_1$ at every
click ($\beta_2 = 0$ for every subcomplex of this planar cone — the six wedge
boundaries are linearly independent). Preset buttons: **○ Cycle** (hexagon,
$\beta_1 = 1$), **● Disk** (everything, $\beta_1 = 0$), **∞ Wedge** (two
cycles through the hub, $\beta_1 = 2$), **✕ Empty** (vertices only,
$\beta_0 = 7$).

Homology = boundary-matrix ranks over GF(2) by bitmask Gaussian elimination —
verified standalone (cycle $(1,1)$, disk $(1,0)$, wedge $(1,2)$, full
1-skeleton $\beta_1 = E - V + 1 = 6$) before this renderer was written.

jsdom-safe: no `getScreenCTM`/`createSVGPoint` (clicks land on per-simplex
hit shapes), no `Math.random`, no rAF.

## Params

| param | type | required | description |
|---|---|---|---|
| `widgetId` | string | ✓ | outer `<div class="widget">` id |
| `svgId` | string | ✓ | `<svg>` id |
| `outputId` | string | ✓ | `.readout` id |
| `title` | string | ✓ | header title |
| `hint` | string | | header hint (HTML + KaTeX) |
| `svgTitle` | string | | accessible `<title>`; defaults to `title` |
| `preset` | `"cycle"`\|`"disk"`\|`"wedge"`\|`"empty"` | | boot complex (default `cycle`) |
| `viewBox` | string | | default `0 0 560 500` |
| `svgWidth` / `svgHeight` | number | | default 560 / 500 |

## Home

- `simplicial-complexes-combinatorial.html` §complex — the downward-closure
  axiom as a thing the widget refuses to violate; $f$-vector, $\chi$, and
  Betti numbers as live consequences of each glue.
