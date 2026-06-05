# sketch-curve-2d

Self-contained **"draw the input"** engine — the corpus's `draw` gesture. The
reader sketches a function `y = f(x)` by dragging the pointer across the plot;
the curve is stored as `samples` evenly spaced y-values and a live transform of
it updates as they draw.

Use it whenever the lesson is *"pick your own function and watch X respond"*:
draw `f` and see its derivative `f'`, its running integral `∫f` (FTC), its
total variation `Σ|Δf|`, its running max/sup, a smoothing/convolution, etc.

## Division of labor

- **Engine (this renderer):** owns the sketch gesture — pointer → nearest of the
  `samples` x-columns, with linear interpolation across columns skipped during a
  fast drag — plus a **Reset** button and the data↔pixel helpers. It exposes
  `X(i)` (pixel x of sample `i`), `xv(i)` (data x), `Y(v)` (pixel y of value
  `v`), `Yinv(py)` (data value of a pixel y), and the constant `M` (=`samples`).
  jsdom-safe: `createSVGPoint`/`getScreenCTM` run only inside the pointer
  handler, never at init.
- **Author (`params.bodyScript`):** defines `function draw(ys){ … }`. On init,
  on every pointer edit, and on Reset it clears + redraws the SVG group `G`
  (typically the input curve plus a derived curve) and writes the readout
  `out`. It receives the helpers above and the page-global `$`/`SVG`. It must
  **not** start a timer.

## Params

| param | required | default | meaning |
|---|---|---|---|
| `widgetId` | ✓ | — | outer `<div class="widget">` id; the Reset button id derives from it |
| `svgId` | ✓ | — | drawing-surface `<svg>` id |
| `outputId` | ✓ | — | `.readout` id |
| `title` | ✓ | — | `.ttl` text |
| `bodyScript` | ✓ | — | author JS defining `draw(ys)` |
| `hint` / `svgTitle` | | — / `title` | hint text / accessible SVG title |
| `viewBox` / `svgWidth` / `svgHeight` | | `0 0 640 380` / 640 / 380 | SVG geometry |
| `padL` / `padR` / `padT` / `padB` | | 48 / 24 / 24 / 40 | plot padding (px) |
| `x0` / `x1` | | 0 / 1 | data x at the left / right plot edge |
| `ymin` / `ymax` | | -1 / 1 | data y at the bottom / top plot edge |
| `samples` | | 60 | number of stored x sample points |
| `initialY` | | flat 0 | initial/Reset sample values (length `samples`) |
| `resetLabel` | | `↺ Reset` | Reset control label |
| `outputInitial` | | `&nbsp;` | readout HTML before first draw |

## Usage

Add a `widget` block plus a `widget-script` block referencing it **by `ref`**
(not slug+params — a ref-less `widget-script` renders nothing):

```json
{ "type": "widget",        "slug": "sketch-curve-2d", "params": { "widgetId": "w-foo", "svgId": "foo-svg", "outputId": "foo-out", "title": "…", "bodyScript": "function draw(ys){ /* … */ }" } },
{ "type": "widget-script", "ref": "w-foo" }
```

Then `node scripts/rebuild.mjs --only widget-params` (AJV) and
`node scripts/rebuild.mjs` (byte-identical round-trip).

## Authoring notes

- Plot the input with `let d=''; for(let i=0;i<M;i++) d+=(i?'L':'M')+X(i)+' '+Y(ys[i])+' ';`.
- Differentiation amplifies hand-drawing jitter; cumulative transforms
  (integral, total variation) are smoother and more legible for sketched input.
- Color tokens only (`var(--cyan)`, `var(--yellow)`, …), never hex.
- A second derived curve on a different scale reads best with a one-line
  in-SVG legend distinguishing it from the input.
