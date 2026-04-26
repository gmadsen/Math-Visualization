# julia-playground

Bespoke canvas-based fractal explorer for the **Mandelbrot set** and the
**filled-in Julia sets** $J_c$. Iterates

$$
z_{n+1} = z_n^2 + c
$$

per pixel. In `mandelbrot` mode the canvas plane is the $c$-plane and
$z_0 = 0$. In `julia` mode the canvas plane is the $z$-plane and $c$ is
held fixed at `(cReal, cImag)` — adjustable at runtime via two sliders, or
shift-click on the canvas to pin $c$ at the clicked point.

The widget paints into an HTML5 `<canvas>` (rather than SVG) because
escape-time rendering touches one entry per pixel — at the default
480x320 that's ~150k samples, well past the cost where SVG `<rect>`
grids stop being reasonable. The render loop is sliced into rows yielded
through `requestAnimationFrame`, so panning, zooming, and slider drags
remain responsive.

See [`../README.md`](../README.md) for the registry contract.

## When to reach for it

Pages that visualize iteration of a quadratic complex map: dynamical
systems (period-doubling on the real axis sits inside the Mandelbrot
boundary), complex analysis (filled Julia sets are where holomorphic
dynamics gets visual), holomorphic dynamics, or any aside connecting
Julia/Mandelbrot to the larger story (Misiurewicz points, the Mandelbrot
set parameterizing Julia sets, etc.).

## Interactions

| gesture                         | effect                                                                  |
|---------------------------------|-------------------------------------------------------------------------|
| drag canvas                     | pan the view in the complex plane                                       |
| wheel                           | zoom in / out, anchored at the cursor                                   |
| `Re(c)` / `Im(c)` sliders       | (julia mode only) vary the parameter $c$                                  |
| shift-click canvas              | (julia mode only) pin $c$ to the clicked point                          |
| iterations slider               | raise / lower the escape-time cap (16-400)                              |
| reset view                      | restore initial window + iteration cap + $c$ from the schema defaults    |

The view is bounded by `minZoomSpan` and `maxZoomSpan` to keep the
rendering visually meaningful given the iteration cap.

## Params

See [`schema.json`](./schema.json) for the authoritative shape.

| field           | required | default        | purpose                                                                                                     |
|-----------------|----------|----------------|-------------------------------------------------------------------------------------------------------------|
| `widgetId`      | yes      | -              | DOM id for the outer `<div class="widget">` wrapper. All inner ids are derived from this so multiple instances coexist. |
| `title`         | yes      | -              | Header title (may contain `$…$` LaTeX).                                                                     |
| `hint`          | no       | -              | Optional short hint in the header.                                                                          |
| `mode`          | no       | `"mandelbrot"` | `"mandelbrot"` (axes are $c$, $z_0 = 0$) or `"julia"` (axes are $z$, $c$ fixed).                                |
| `cReal`, `cImag`| no       | `-0.7, 0.27015`| Initial $c$ in julia mode; ignored in mandelbrot.                                                            |
| `xmin`, `xmax`, `ymin`, `ymax` | no | window around fractal | Initial complex-plane window.                                                          |
| `maxIterations` | no       | `80`           | Escape-time cap (16-400).                                                                                   |
| `width`, `height` | no     | `480, 320`     | Canvas pixel size; CSS caps the rendered size at the container width.                                       |
| `palette`       | no       | `"cyan"`       | Project accent for the warm end of the gradient: `cyan` / `violet` / `yellow` / `pink`.                     |
| `minZoomSpan`, `maxZoomSpan` | no | `0.01 / 8.0` | Bounds on `xmax - xmin` to keep zoom visually meaningful.                                                  |
| `sectionComment`| no       | -              | **Artifact.** Optional `/* … */` banner emitted between `<script>` and the IIFE opener.                     |

## Theme awareness

The palette is resolved from CSS custom properties (`--bg`, `--mute`,
`--ink`, and the chosen accent) at render time. A `MutationObserver` on
`document.documentElement`'s `data-theme` attribute triggers a repaint
when the page-wide theme toggle flips, so the fractal recolors without
a reload.

## Performance notes

- The render loop slices into ~rowsPerSlice rows per `requestAnimationFrame`
  tick. A render token guards against stale slices completing on top of a
  newer parameter change.
- Smooth-iteration coloring (continuous escape time) plus a `sqrt` ramp
  gives a visually rich gradient with only ~80 iterations by default.
- Zoom is bounded by `minZoomSpan` (~0.01 by default) so the iteration
  cap stays adequate for the visible region.

## Alternate frontends

A React / SSR renderer can ignore `renderScript` entirely and re-implement
the iteration from the schema: the iteration rule is the canonical
$z \mapsto z^2 + c$, the per-pixel sample count is `width * height`, the
window is `(xmin, xmax, ymin, ymax)`, and the per-pixel $z_0$ depends on
`mode`. Smooth-iteration coloring and the palette ramp are described in
the index module's `colorize` and `paletteRGB` helpers.

## Example

A canonical Mandelbrot fixture lives at [`example.json`](./example.json).
It is the test instance picked up by `scripts/test-widget-renderers.mjs`
when no topic page has adopted the widget yet.
