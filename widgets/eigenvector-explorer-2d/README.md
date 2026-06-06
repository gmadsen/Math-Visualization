# eigenvector-explorer-2d

Self-contained **"find the eigenvectors by dragging"** engine — the corpus's
`drag-direction` gesture. The reader drags a unit vector $v$ around the unit
circle and watches its image $Av$; the **eigenvectors reveal themselves** as the
directions where $Av$ stays parallel to $v$ (i.e. $Av = \lambda v$ — the handle
turns yellow and the readout reports $\lambda$). The real eigendirections are
drawn as faint guide lines; a matrix with complex eigenvalues has **no real
eigenvector** (the readout says so — the map is a rotation). First home:
`differential-geometry §gauss`, where $A$ is the **shape operator**: its
eigenvectors are the principal directions and its eigenvalues the principal
curvatures $\kappa_1,\kappa_2$ (with $K=\det = \kappa_1\kappa_2$).

Use it wherever the eigenstructure of a $2\times2$ matrix should be *felt*:
eigenvectors as invariant directions, eigenvalues as stretch factors, the
symmetric (orthogonal eigenvectors) vs rotational (complex) dichotomy, principal
curvatures, principal axes of a quadratic form.

## The gesture

- **Drag the handle** (cyan) around the unit circle — $v$ rotates and $Av$ (pink)
  follows. When $v$ lines up with a dashed guide line, $Av$ becomes parallel to
  $v$: $v$ is an eigenvector, and the readout shows $Av = \lambda\,v$.
- **Reset** restores the initial direction.

## Division of labor

- **Engine (this renderer):** owns the drag gesture (handle pinned to the unit
  circle), the data↔pixel mapping, the $v$/$Av$ arrows, the real eigendirection
  guide lines, the closed-form eigenvalue/eigenvector computation, the alignment
  detection, the readout, and Reset. jsdom-safe: `createSVGPoint`/`getScreenCTM`
  run only inside the pointer handlers.
- **Author:** fully param-driven — the `matrix`, the `range`, the initial angle,
  and an optional `eigenLabel` noun (e.g. `"principal curvature"`). No code.

## Params

| param | required | default | meaning |
|---|---|---|---|
| `widgetId` / `svgId` / `outputId` / `title` | ✓ | — | DOM ids + title |
| `hint` / `svgTitle` | | — / `title` | hint / accessible SVG title |
| `viewBox` / `svgWidth` / `svgHeight` | | `0 0 520 520` / 520 / 520 | SVG geometry (square) |
| `range` | | 2.6 | axes span `[-range, range]` |
| `matrix` | | `[[1.6,0.5],[0.5,0.7]]` | the 2×2 matrix `[[a,b],[c,d]]` |
| `initialAngleDeg` | | 25 | initial direction of `v` in degrees |
| `eigenLabel` | | `''` | optional noun for the eigenvalues (e.g. `"principal curvature"`) |
| `resetLabel` | | `↺ Reset` | Reset control label |

## Usage

```json
{ "type": "widget",        "slug": "eigenvector-explorer-2d", "params": { "widgetId": "w-foo", "svgId": "foo-svg", "outputId": "foo-out", "title": "…", "matrix": [[2,1],[1,2]] } },
{ "type": "widget-script", "ref": "w-foo" }
```

Then `node scripts/rebuild.mjs --only widget-params` (AJV) and
`node scripts/rebuild.mjs` (byte-identical round-trip).

## Authoring notes

- A **symmetric** matrix gives two orthogonal real eigendirections (a clean
  "principal axes" picture). A matrix with $\mathrm{tr}^2 < 4\det$ has a complex
  conjugate eigenvalue pair and **no** real eigenvector — the engine draws no
  guide lines and the readout says "a rotation".
- Colour tokens only (`var(--cyan)` = $v$, `var(--yellow)` = $v$ when it is an
  eigenvector, `var(--pink)` = $Av$, `var(--green)`/`var(--violet)` = the two
  eigendirection lines), never hex.
- The readout is plain text (no raw `$`); put LaTeX in the `.hint`.
