# vector-field-flow-2d

Self-contained **"click to seed a trajectory"** engine — the corpus's
`click-seed` gesture. The reader clicks anywhere in the plane to release a
trajectory of a 2D autonomous flow $\dot x = f(x,y)$; the engine integrates the
streamline (RK4, forward *and* backward through the seed) and draws it, so a
phase portrait builds up click by click over a faint direction field. First
home: `dynamical-systems §phase` (a bistable flow whose two basins of attraction
are separated by the $y$-axis).

Use it whenever the lesson is *"drop a particle and watch where the flow takes
it"*: phase portraits, basins of attraction, fixed-point stability, limit
cycles, separatrices, gradient/Hamiltonian flows, nullcline geometry.

## The gesture

- **Release a trajectory** — click anywhere inside the plot.
- **Clear** — the button removes your trajectories and restores the initial
  seeds.

A faint normalised **direction field** is drawn under everything so the flow is
legible before the first click.

## Division of labor

- **Engine (this renderer):** owns the click→data mapping, RK4 integration
  (stops at a fixed point or the window edge), the direction-field grid,
  trajectory drawing, the readout's seed→fate report, and Clear. jsdom-safe:
  `createSVGPoint`/`getScreenCTM` run only inside the click handler; init draws
  axes + field + initial seeds from the viewBox numbers alone.
- **Author (`params.bodyScript`):** defines `function field(x,y){ return {dx,dy}; }`
  — the vector field in **data** coordinates — and, optionally,
  `function decorate(BG){ … }` to draw static overlays (fixed points, nullclines,
  labels) into the background group `BG`. It may use the engine helpers `PX(x)` /
  `PY(y)` (data→pixel) and the page-global `$`/`SVG`. It must **not** start a timer.

## Params

| param | required | default | meaning |
|---|---|---|---|
| `widgetId` | ✓ | — | outer `<div class="widget">` id; Clear id derives from it |
| `svgId` | ✓ | — | drawing-surface `<svg>` id |
| `outputId` | ✓ | — | `.readout` id |
| `title` | ✓ | — | `.ttl` text |
| `bodyScript` | ✓ | — | author JS defining `field(x,y)` (+ optional `decorate(BG)`) |
| `hint` / `svgTitle` | | — / `title` | hint text / accessible SVG title |
| `viewBox` / `svgWidth` / `svgHeight` | | `0 0 640 420` / 640 / 420 | SVG geometry |
| `x0` / `x1` / `y0` / `y1` | | -2 / 2 / -1.5 / 1.5 | data window (left/right/bottom/top) |
| `padL` / `padR` / `padT` / `padB` | | 40 / 20 / 20 / 36 | plot padding (px) |
| `dt` / `steps` | | 0.02 / 600 | RK4 step size / max steps per direction |
| `gridNX` / `gridNY` | | 21 / 13 | direction-field columns / rows (0 disables) |
| `initialSeeds` | | `[]` | `[[x,y], …]` trajectories drawn at load and on Clear |
| `resetLabel` | | `↺ Clear` | Clear control label |
| `outputInitial` | | `&nbsp;` | readout HTML before first click |

## Usage

Add a `widget` block plus a `widget-script` block referencing it **by `ref`**:

```json
{ "type": "widget",        "slug": "vector-field-flow-2d", "params": { "widgetId": "w-foo", "svgId": "foo-svg", "outputId": "foo-out", "title": "…", "bodyScript": "function field(x,y){ return {dx:y, dy:-x}; }" } },
{ "type": "widget-script", "ref": "w-foo" }
```

Then `node scripts/rebuild.mjs --only widget-params` (AJV) and
`node scripts/rebuild.mjs` (byte-identical round-trip).

## Authoring notes

- Return the field in **data** units; the engine handles the data↔pixel flip
  (screen y points down, data y points up).
- Keep `field` cheap — it's called ~`4·steps` times per click plus once per
  direction-field cell.
- For a stiff or fast field, lower `dt`; for a slow field, raise `steps` so
  trajectories reach their attractor inside the window.
- In `decorate`, mark stable fixed points with a filled dot and saddles with an
  open ring at `PX(x)`,`PY(y)`. Colour tokens only (`var(--cyan)`, …), never hex.
