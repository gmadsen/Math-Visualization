# linear-transform-2d

Self-contained **"drag the basis vectors"** engine — the corpus's `drag-basis`
gesture. The reader drags the two coloured handles, which are the tips of where
the standard basis vectors $\hat\imath, \hat\jmath$ land. The $2\times2$ matrix
$M=\bigl(\begin{smallmatrix}a&b\\c&d\end{smallmatrix}\bigr)$ whose **columns are
those images** carries the whole integer grid to a sheared lattice of
parallelograms; the readout reports $M$, $\det M = ad-bc$ (the signed-area
scaling factor — the value of $dx\wedge dy$ on the two image vectors),
orientation, and invertibility. First home: `differential-forms §wedge` (the
$2$-form as signed area = determinant).

Use it wherever a $2\times2$ matrix should be felt as a transformation of the
plane: linear maps, the determinant as area scaling, change of basis, the
Jacobian, orientation/handedness, singular vs invertible, the wedge product.

## The gesture

- **Drag a handle** — the cyan handle is the image of $\hat\imath$ (first column
  of $M$), the yellow handle the image of $\hat\jmath$ (second column). Dragging
  either rebuilds $M$ and re-warps the grid live.
- **Reset** — restores the initial matrix.

Drag the unit square's area to zero (singular), past zero (orientation flips,
the fill turns pink), or watch every area scale by exactly $|\det M|$.

## Division of labor

- **Engine (this renderer):** owns the drag gesture (hit-testing the two
  handles), the data↔pixel mapping, the reference + transformed grids, the basis
  arrows, the transformed unit square (and optional shape), the det / orientation
  / invertibility readout, and Reset. jsdom-safe: `createSVGPoint`/`getScreenCTM`
  run only inside the pointer handlers.
- **Author:** the widget is **param-driven** — usually no code, just
  `initialMatrix` and an optional `shapePoints` polygon. For extras (eigenvectors,
  annotations) an optional `bodyScript` may define
  `function decorate(m, helpers){ … }`, where `m = {a,b,c,d,det}` and `helpers`
  exposes `G` (the SVG group, redrawn each frame), `PX`/`PY` (data→pixel), and
  `ap(x,y)` (apply $M$). It must **not** start a timer.

## Params

| param | required | default | meaning |
|---|---|---|---|
| `widgetId` | ✓ | — | outer `<div class="widget">` id; Reset id derives from it |
| `svgId` | ✓ | — | drawing-surface `<svg>` id |
| `outputId` | ✓ | — | `.readout` id |
| `title` | ✓ | — | `.ttl` text |
| `hint` / `svgTitle` | | — / `title` | hint text / accessible SVG title |
| `viewBox` / `svgWidth` / `svgHeight` | | `0 0 560 560` / 560 / 560 | SVG geometry (square works best) |
| `range` | | 5 | axes span `[-range, range]` |
| `gridExtent` | | 6 | integer grid lines from `-gridExtent` to `+gridExtent` |
| `initialMatrix` | | `[[1,0],[0,1]]` | `[[a,b],[c,d]]`, columns = images of î and ĵ; Reset restores it |
| `shapePoints` | | — | optional polygon `[[x,y],…]` transformed alongside the unit square |
| `resetLabel` | | `↺ Reset` | Reset control label |
| `bodyScript` | | — | optional author JS defining `decorate(m, helpers)` |

## Usage

Add a `widget` block plus a paired `widget-script` block referencing it **by
`ref`**:

```json
{ "type": "widget",        "slug": "linear-transform-2d", "params": { "widgetId": "w-foo", "svgId": "foo-svg", "outputId": "foo-out", "title": "…", "initialMatrix": [[1,0.5],[0,1]] } },
{ "type": "widget-script", "ref": "w-foo" }
```

Then `node scripts/rebuild.mjs --only widget-params` (AJV) and
`node scripts/rebuild.mjs` (byte-identical round-trip).

## Authoring notes

- A square `viewBox` keeps the unit square square; the engine centres the origin
  and scales so `[-range, range]` fits.
- Colour tokens only (`var(--cyan)` = î/first column, `var(--yellow)` = ĵ/second
  column, `var(--pink)` = flipped/singular), never hex.
- The readout is plain text (no raw `$`); put any LaTeX in the `.hint`.
- A non-zero off-diagonal `initialMatrix` (a small shear/rotation) makes the
  opening state read as a transformation rather than the identity.
