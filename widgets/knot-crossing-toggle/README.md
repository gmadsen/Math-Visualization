# knot-crossing-toggle

The **toggle-crossing** gesture: click any crossing of a knot diagram to flip
which strand passes over, and the Kauffman bracket state sum, writhe, and
Jones polynomial recompute live,

$$\langle K\rangle = \sum_{\text{states}} A^{\#A-\#B}\,(-A^2-A^{-2})^{|s|-1},
\qquad V(t) = \left.(-A^3)^{-w}\langle K\rangle\right|_{t=A^{-4}}.$$

The readout names the resulting knot. The diagram is a fixed closed parametric
curve; its crossings, arcs, and PD code are *derived from the curve's
self-intersections at init*, so the picture and the algebra cannot drift
apart. Buttons mirror the whole diagram (flip every crossing — watch
$V(t)\mapsto V(t^{-1})$) and reset.

Templates:

- `four` (default) — a 4-crossing curve $(1.2+\cos 2t)(\cos 3t,\sin 3t)/2.2$ whose
  16 over/under states reach the **figure-eight** $4_1$ (boot state;
  palindromic $V$, amphichiral), **both trefoil chiralities**, and 12 unknot
  states.
- `trefoil` — the 3-crossing curve $(\sin t + 2\sin 2t, \cos t - 2\cos 2t)/3$:
  the two alternating states are the two trefoils; everything else unravels.

Conventions were validated standalone against $3_1$ (both chiralities), $4_1$,
and the unknot before the renderer was written.

jsdom-safe: no `getScreenCTM`/`createSVGPoint` (clicks land on per-crossing
hit circles, so no coordinate transforms are needed), no `Math.random`, no
rAF. The init self-intersection scan is ~30 ms.

## Params

| param | type | required | description |
|---|---|---|---|
| `widgetId` | string | ✓ | outer `<div class="widget">` id |
| `svgId` | string | ✓ | `<svg>` id |
| `outputId` | string | ✓ | `.readout` id |
| `title` | string | ✓ | header title |
| `hint` | string | | header hint (HTML + KaTeX) |
| `svgTitle` | string | | accessible `<title>`; defaults to `title` |
| `template` | `"trefoil"`\|`"four"` | | diagram template (default `four`) |
| `initialOver` | boolean[] | | boot over/under bits (defaults: fig-8 state for `four`, alternating for `trefoil`) |
| `viewBox` | string | | default `0 0 560 480` |
| `svgWidth` / `svgHeight` | number | | default 560 / 480 |

## Home

- `knot-polynomials.html` §jones — the bracket as a function of the diagram,
  the Jones polynomial as the writhe-corrected invariant; chirality and
  amphichirality made clickable.
