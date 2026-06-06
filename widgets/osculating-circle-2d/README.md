# osculating-circle-2d

Self-contained **"drag a point along a curve, watch the osculating circle"**
engine — the corpus's `drag-along-curve` gesture. The author supplies a
parametric plane curve `function curve(t){ return [x,y]; }`. The reader drags a
point $P$ along the curve; the engine computes the curvature $\kappa(t)$ by
central finite differences and draws the **osculating circle** — the circle of
radius $1/|\kappa|$ centred at the centre of curvature that matches the curve's
position, tangent, and curvature at $P$ — plus the tangent line. The readout
gives $\kappa$ and the **radius of curvature** $\rho = 1/|\kappa|$: tiny where
the curve bends sharply, large where it flattens, $\infty$ on a straight line.
First home: `differential-geometry §osculating`.

Use it to make curvature tactile: the radius of curvature, the centre of
curvature (whose locus is the evolute), tangent/normal frames, the
second-order contact of the best-fit circle.

## The gesture

- **Drag the point $P$** (cyan) along the curve — the pointer projects to the
  nearest point on the curve. The pink osculating circle resizes with the local
  curvature. **Reset** restores the starting parameter.

## Division of labor

- **Engine (this renderer):** owns the curve sampling, the drag-to-nearest-$t$
  projection, the curvature + osculating-circle geometry (centre of curvature =
  $P + \tfrac{1}{\kappa}\,N$), the tangent, the $\kappa$/$\rho$ readout, and Reset.
  Uses an **isotropic** mapping so the osculating circle renders as a true circle.
  jsdom-safe: `createSVGPoint`/`getScreenCTM` run only inside the pointer handlers.
- **Author (`params.bodyScript`):** defines `function curve(t){ return [x,y]; }`
  over $t\in[t_0,t_1]$. It must **not** start a timer.

## Params

| param | required | default | meaning |
|---|---|---|---|
| `widgetId` / `svgId` / `outputId` / `title` | ✓ | — | DOM ids + title |
| `bodyScript` | ✓ | — | author JS defining `curve(t)` |
| `hint` / `svgTitle` | | — / `title` | hint / accessible SVG title |
| `viewBox` / `svgWidth` / `svgHeight` | | `0 0 600 460` / 600 / 460 | SVG geometry |
| `x0` / `x1` / `y0` / `y1` | | -3.2 / 3.2 / -2.6 / 2.6 | data window (the engine fits it isotropically) |
| `t0` / `t1` | | 0 / 2π | curve parameter range |
| `closed` | | true | whether to close the drawn curve path |
| `initialT` | | 0.6 | initial parameter of the draggable point |
| `showEvolute` | | false | trace the evolute (locus of centres of curvature) as a faint violet dashed curve, broken near inflections |
| `resetLabel` | | `↺ Reset` | Reset control label |

## Usage

```json
{ "type": "widget",        "slug": "osculating-circle-2d", "params": { "widgetId": "w-foo", "svgId": "foo-svg", "outputId": "foo-out", "title": "…", "bodyScript": "function curve(t){ return [2*Math.cos(t), 1.2*Math.sin(t)]; }" } },
{ "type": "widget-script", "ref": "w-foo" }
```

Then `node scripts/rebuild.mjs --only widget-params` (AJV) and
`node scripts/rebuild.mjs` (byte-identical round-trip).

## Authoring notes

- Pick a curve with *varying* curvature (an ellipse, a parabola, a spiral) so the
  osculating circle visibly grows and shrinks — a circle would be a constant
  (and boring) radius.
- The engine clamps the drawn circle when $\rho$ is huge (near-straight) and the
  readout shows `∞ (straight)`.
- Colour tokens only (`var(--green)` curve, `var(--cyan)` $P$ + tangent,
  `var(--pink)` osculating circle + centre of curvature), never hex.
- The readout is plain text (no raw `$`); put LaTeX in the `.hint`.
