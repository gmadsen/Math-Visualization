# animated-svg-2d

Self-contained **play/pause animation** engine — the corpus's "play" gesture. The
renderer owns the clock (Play/Pause button, scrub slider, `requestAnimationFrame`
loop, looping); the author writes only a per-frame redraw.

Use it for any "press play, watch it evolve" toy: gradient-descent iterates
converging to a minimum, a Fourier partial sum building up a square wave, a random
walk's path growing, Newton's method homing in on a root, heat diffusing along a
bar, power iteration rotating onto the dominant eigenvector.

## Division of labor

- **Engine (this renderer):** a normalized time `t ∈ [0,1]`, advanced by rAF over
  `durationMs`, snapped to `steps` scrub positions. Owns Play/Pause, the scrub
  slider, looping, and the rAF lifecycle. Never started at module-eval time, so
  the renderer is jsdom-safe; a `setTimeout` shim covers environments without rAF.
- **Author (`params.bodyScript`):** defines `function frame(t){ ... }`. On every
  tick (and on load at `t=0`, and on every scrub) it clears + redraws the SVG
  group `G` and writes the readout `out`. It receives the page-global `$` / `SVG`
  helpers and the constant `STEPS`. It must **not** start its own timer — the
  engine drives it.

## Params

| param | required | default | meaning |
|---|---|---|---|
| `widgetId` | ✓ | — | outer `<div class="widget">` id; play/scrub ids derive from it |
| `svgId` | ✓ | — | `<svg>` canvas id the author draws into |
| `outputId` | ✓ | — | `.readout` id the author writes per-frame |
| `title` | ✓ | — | `.ttl` text |
| `bodyScript` | ✓ | — | author JS defining `frame(t)`, `t ∈ [0,1]` |
| `hint` | | — | `.hint` text |
| `svgTitle` | | `title` | accessible `<title>` inside the SVG |
| `viewBox` | | `0 0 640 380` | SVG viewBox |
| `svgWidth` / `svgHeight` | | `640` / `380` | SVG width/height attrs |
| `steps` | | `120` | scrub granularity (slider max) |
| `durationMs` | | `4000` | wall-clock for one full `t:0→1` pass |
| `loop` | | `true` | wrap from `t=1` back to `t=0` |
| `autoplay` | | `false` | start playing on load (only if rAF exists) |
| `playLabel` / `pauseLabel` | | `▶ Play` / `⏸ Pause` | control labels |
| `outputInitial` | | `&nbsp;` | readout HTML before first paint |

## Usage

Add a `widget` block (markup) and a paired `widget-script` block (the IIFE) to
`content/<topic>.json`, both carrying the same `params`:

```json
{ "type": "widget",        "slug": "animated-svg-2d", "params": { "widgetId": "w-foo", "svgId": "foo-svg", "outputId": "foo-out", "title": "…", "bodyScript": "function frame(t){ /* … */ }" } },
{ "type": "widget-script", "slug": "animated-svg-2d", "params": { "widgetId": "w-foo", "svgId": "foo-svg", "outputId": "foo-out", "title": "…", "bodyScript": "function frame(t){ /* … */ }" } }
```

Then `node scripts/rebuild.mjs --only widget-params` (AJV) and
`node scripts/rebuild.mjs` (full byte-identical round-trip).

## Authoring notes

- Map `t` to your domain inside `frame`: a discrete process uses
  `const k = Math.round(t*N); // 0..N`; a continuous one uses `t` directly.
- Build a tiny `x(...)`/`y(...)` data→pixel mapper at the top of `bodyScript`
  (the engine stays domain-agnostic — it draws no axes for you).
- Use color tokens (`var(--cyan)`, `var(--yellow)`, …), never hex.
- Keep `frame` allocation-light: it runs ~60×/s. Clearing `G` with
  `while(G.firstChild) G.removeChild(G.firstChild)` each frame is fine for the
  small meshes used here.
