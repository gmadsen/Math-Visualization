# xy-parameter-pad

Self-contained **"two-parameter scrub"** engine — the corpus's `two-param-scrub`
gesture. The reader drags **one puck** across a labeled 2D pad that drives two
coupled parameters at once over an author-defined **regime map**. The engine
grid-samples the author's `classify(x,y)` to paint the discrete regime regions,
so the codim-1 *walls* between regimes — which two sequential sliders can never
land on — are visible at a glance and reachable by a single diagonal drag. First
home: `statistical-mechanics §ising-phase-transitions` (the mean-field
$(T,h)$ phase diagram).

Use it anywhere a phenomenon is governed by **two coupled knobs** with
qualitatively distinct regions: phase diagrams, stability $(\mathrm{tr},\det)$
planes, discriminant planes, option-Greek surfaces, two-parameter bifurcation
unfoldings.

## The gesture

- **Drag the puck** anywhere on the pad — both parameters move together; the
  shaded region under the puck names the current regime, and the readout reports
  $(x,y)$, the regime, and any author-supplied derived quantity. **Reset**
  restores the start point.

## Division of labor

- **Engine (this renderer):** owns the grid shading, the axis frame / ticks /
  labels, the regime legend, the overlay host, the drag gesture, the puck +
  crosshair, and the readout. The shaded map + overlays are a **static layer**
  built once; only the puck + readout redraw on drag. jsdom-safe.
- **Author (`params.bodyScript`):** must define `function classify(x,y){ return
  regimeIndex; }` (an integer index into `regimes`). May also define
  `value(x,y)` (a derived scalar for the readout — closed form *or* iteration),
  `readout(x,y)` (a custom HTML readout fragment), and `decorate(D)` to draw
  static overlays (critical points, phase boundaries) where `D = { add, SVG, PX,
  PY, x0, x1, y0, y1 }`.

## Params

| param | required | default | meaning |
|---|---|---|---|
| `widgetId` / `svgId` / `outputId` / `title` | ✓ | — | DOM ids + title |
| `regimes` | ✓ | — | `[{label, color}]`, indexed by `classify`'s return |
| `bodyScript` | ✓ | — | author JS: `classify` (+ optional `value`/`readout`/`decorate`) |
| `x0` / `x1` / `y0` / `y1` | ✓ | — | parameter ranges (pad edges) |
| `xLabel` / `yLabel` | | `x` / `y` | axis labels |
| `xInit` / `yInit` | | midpoints | initial puck position |
| `grid` | | 56 | shading cells along the longer axis |
| `hint` / `svgTitle` | | — / `title` | hint / accessible SVG title |
| `viewBox` / `svgWidth` / `svgHeight` | | `0 0 560 440` / 560 / 440 | SVG geometry |
| `resetLabel` | | `↺ Reset` | Reset control label |

## Usage

```json
{ "type": "widget", "slug": "xy-parameter-pad", "params": {
  "widgetId": "w-pad", "svgId": "pad-svg", "outputId": "pad-out",
  "title": "…", "xLabel": "T / Tc", "yLabel": "h",
  "x0": 0.15, "x1": 2.5, "y0": -1.2, "y1": 1.2, "xInit": 0.6, "yInit": 0.0,
  "regimes": [
    { "label": "disordered", "color": "var(--mute)" },
    { "label": "ordered ↑",  "color": "var(--pink)" },
    { "label": "ordered ↓",  "color": "var(--cyan)" }
  ],
  "bodyScript": "function classify(T,h){ if(T>=1) return 0; return h>=0?1:2; } function value(T,h){ var m=h>=0?0.9:-0.9; for(var i=0;i<200;i++) m=Math.tanh((m+h)/T); return m; } function readout(T,h){ return 'magnetization m \\u2248 <b>'+(value(T,h)).toFixed(2)+'</b>'; }"
} },
{ "type": "widget-script", "ref": "w-pad" }
```

Then `node scripts/rebuild.mjs --only widget-params` (AJV) and
`node scripts/rebuild.mjs` (byte-identical round-trip).

## Authoring notes

- `classify` must be cheap — it's evaluated on every grid cell (≈ `grid²`) at
  build time. `value` runs only at the puck, so iteration there is fine.
- Colour tokens only (`var(--cyan)`, `var(--pink)`, `var(--mute)`, …), never hex.
- Keep `regimes` to a handful of visually distinct colours; the legend lists them.
- For a *continuous* field rather than discrete regimes, give every cell the same
  regime colour and lean on `value`/`readout`, or bucket the field inside
  `classify`.
