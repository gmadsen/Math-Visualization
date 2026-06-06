# contour-residue-2d

Self-contained **"drag the contour"** engine — the corpus's `drag-contour`
gesture, for the **residue theorem**. A meromorphic function is represented by
its simple poles, each marked with its residue. The reader drags a circular
contour (move its centre, drag the yellow rim handle to resize); the poles it
encloses glow pink, and the readout evaluates
$\oint_C f\,dz = 2\pi i \sum_{\text{poles inside } C} \operatorname{Res}(f)$.
Slide the contour across a pole and the integral jumps by $2\pi i$ times that
residue. First home: `complex-analysis §residue-theorem`.

Use it to make the residue theorem tactile: which poles a contour catches, the
$2\pi i$ jumps, winding/enclosure, deforming a contour without crossing a pole
(the integral is unchanged).

## The gesture

- **Move the contour** — drag inside it (the cyan centre handle).
- **Resize the contour** — drag the yellow handle on the rim.
- Enclosed poles turn pink; the readout sums their residues and shows the
  integral. **Reset** restores the starting contour.

## Division of labor

- **Engine (this renderer):** owns the two-handle drag gesture (centre + rim),
  the data↔pixel mapping, the inside/outside test, the pole highlight, the
  $2\pi i \cdot \sum$ readout, and Reset. jsdom-safe: `createSVGPoint`/
  `getScreenCTM` run only inside the pointer handlers.
- **Author:** fully param-driven — the `poles` (each `{x, y, res, label}`) and
  the initial `contour` `{cx, cy, r}`. No code.

## Params

| param | required | default | meaning |
|---|---|---|---|
| `widgetId` / `svgId` / `outputId` / `title` | ✓ | — | DOM ids + title |
| `poles` | ✓ | — | array of `{x, y, res, label?}` — the simple poles and their (real) residues |
| `hint` / `svgTitle` | | — / `title` | hint / accessible SVG title |
| `viewBox` / `svgWidth` / `svgHeight` | | `0 0 560 520` / 560 / 520 | SVG geometry |
| `range` | | 2.6 | axes span `[-range, range]` |
| `contour` | | `{cx:0, cy:0, r:1.5}` | initial contour circle; Reset restores it |
| `resetLabel` | | `↺ Reset` | Reset control label |

## Usage

```json
{ "type": "widget",        "slug": "contour-residue-2d", "params": { "widgetId": "w-foo", "svgId": "foo-svg", "outputId": "foo-out", "title": "…", "poles": [{"x":1,"y":0,"res":1,"label":"a"}] } },
{ "type": "widget-script", "ref": "w-foo" }
```

Then `node scripts/rebuild.mjs --only widget-params` (AJV) and
`node scripts/rebuild.mjs` (byte-identical round-trip).

## Authoring notes

- Residues here are **real** numbers, so the integral $2\pi i\sum\mathrm{Res}$ is
  purely imaginary — the readout shows it as `…i`. (For a function with complex
  residues, model each as the real value you want summed.)
- Place poles so the default contour catches a couple of them and dragging
  changes the set — that's where the "jump by $2\pi i\,\mathrm{Res}$" insight lands.
- Colour tokens only (`var(--cyan)` contour, `var(--yellow)` rim handle,
  `var(--pink)` enclosed poles, `var(--mute)` poles outside), never hex.
- The readout is plain text (no raw `$`); put LaTeX in the `.hint`.
