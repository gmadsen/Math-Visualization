# elliptic-group-law-2d

Self-contained **"feel the group law"** engine — the corpus's `drag-on-curve`
gesture. The reader drags two points $P$ and $Q$ pinned to a real elliptic curve
$y^2 = x^3 + ax + b$; the engine draws the **chord** through them (the **tangent**
when $P=Q$), finds its third intersection $R$ with the cubic, **reflects $R$ across
the $x$-axis** to give $P+Q$, and reports the coordinates of $P$, $Q$, $P+Q$.
A vertical chord ($Q=-P$, including the 2-torsion case $y=0$) gives the point at
infinity $\mathcal O$ — the identity. First home: `elliptic-curves §group`.

Use it to make the chord–tangent group law tactile: associativity intuition,
doubling $2P$, inverses $-P$, 2-torsion, the role of $\mathcal O$.

## The gesture

- **Drag $P$ (cyan) or $Q$ (yellow)** — each stays pinned to the curve (the
  pointer's $x$ snaps to the nearest curve point; above/below the $x$-axis picks
  the branch). The violet chord, the third point $R$, the pink reflection, and
  $P+Q$ update live.
- Drag $Q$ onto $P$ to see the **tangent** (doubling, $2P$); drag $Q$ to the
  mirror of $P$ to send $P+Q \to \mathcal O$.
- **Reset** restores the starting points.

## Division of labor

- **Engine (this renderer):** owns the curve sampling (both branches, pen-up
  across gaps), the on-curve drag + branch selection, the chord/tangent
  construction, the exact group-law arithmetic ($x_3 = m^2 - x_P - x_Q$, reflect),
  the $P/Q/P+Q$ readout, and Reset. jsdom-safe: `createSVGPoint`/`getScreenCTM`
  run only inside the pointer handlers.
- **Author:** fully param-driven — just the curve `a`, `b`, the window, and the
  initial point $x$-coordinates. No code.

## Params

| param | required | default | meaning |
|---|---|---|---|
| `widgetId` / `svgId` / `outputId` / `title` | ✓ | — | DOM ids + title |
| `hint` / `svgTitle` | | — / `title` | hint / accessible SVG title |
| `viewBox` / `svgWidth` / `svgHeight` | | `0 0 600 460` / 600 / 460 | SVG geometry |
| `a` / `b` | | -1 / 1 | curve $y^2 = x^3 + ax + b$ |
| `x0` / `x1` / `y0` / `y1` | | -2.2 / 3 / -3.6 / 3.6 | data window |
| `initialP` / `initialQ` | | -0.6 / 1.4 | initial $x$-coords of $P$, $Q$ (upper branch) |
| `resetLabel` | | `↺ Reset` | Reset control label |

## Usage

```json
{ "type": "widget",        "slug": "elliptic-group-law-2d", "params": { "widgetId": "w-foo", "svgId": "foo-svg", "outputId": "foo-out", "title": "…", "a": -1, "b": 1 } },
{ "type": "widget-script", "ref": "w-foo" }
```

Then `node scripts/rebuild.mjs --only widget-params` (AJV) and
`node scripts/rebuild.mjs` (byte-identical round-trip).

## Authoring notes

- Pick `a`, `b` with non-zero discriminant $-16(4a^3+27b^2)$ (a smooth curve).
  A single real root (e.g. `a=-1, b=1`) gives a connected curve that is easiest
  to drag along; three real roots give an oval + unbounded branch (the engine
  handles the gap, but points cannot be dragged across it).
- Size the window so both branches and the constructed $P+Q$ stay in view.
- Colour tokens only (`var(--green)` curve, `var(--cyan)` $P$, `var(--yellow)`
  $Q$, `var(--violet)` chord, `var(--pink)` $P+Q$), never hex.
- The readout is plain text (no raw `$`); put LaTeX in the `.hint`.
