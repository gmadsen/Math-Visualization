# complex-map-2d

Self-contained **"drag the probe through a complex map"** engine — the corpus's
`drag-probe` gesture. The author supplies a complex function
`function f(x,y){ return [u,v]; }` ($z=x+iy \mapsto w=u+iv$); the engine draws the
**image of the coordinate grid** under $f$ (the warped conformal grid) and a
draggable probe point $z$. As the reader drags $z$, the image $w=f(z)$, a small
**image-of-a-cross** at $z$ (showing the local rotation + scaling), and the
readout — $z$, $w$, $|f'(z)|$ (local stretch), $\arg f'(z)$ (local rotation),
and whether angles are preserved — all update live. First home:
`complex-analysis §cauchy-riemann` (CR ⟺ the map is conformal).

Use it wherever a holomorphic map should be *felt*: conformality, the
Cauchy–Riemann equations, $z^2$ doubling angles, Möbius / disk automorphisms,
critical points ($f'=0$, where conformality breaks).

## The gesture

- **Drag the probe** $z$ (cyan handle) — its image $w=f(z)$ (pink) and the local
  image-cross update live. Move $z$ to a critical point ($f'=0$) and watch the
  cross collapse — angles stop being preserved.
- **Reset** — restores the initial probe position.

## Division of labor

- **Engine (this renderer):** owns the drag gesture (hit-testing the probe), the
  data↔pixel mapping, the image-grid sampling, the probe/image markers, the local
  cross, the $z$ / $w$ / $|f'|$ / $\arg f'$ readout (central finite difference),
  and Reset. jsdom-safe: `createSVGPoint`/`getScreenCTM` run only inside the
  pointer handlers; the outer `<svg>` clips the image grid to the viewport.
- **Author (`params.bodyScript`):** defines `function f(x,y){ return [u,v]; }` —
  the complex map in data coordinates. It must **not** start a timer.

## Params

| param | required | default | meaning |
|---|---|---|---|
| `widgetId` / `svgId` / `outputId` / `title` | ✓ | — | DOM ids + title |
| `bodyScript` | ✓ | — | author JS defining `f(x,y)` |
| `hint` / `svgTitle` | | — / `title` | hint / accessible SVG title |
| `viewBox` / `svgWidth` / `svgHeight` | | `0 0 560 560` / 560 / 560 | SVG geometry (square works best) |
| `range` | | 2.5 | axes span `[-range, range]` |
| `gridExtent` | | 3 | coordinate grid lines from `-gridExtent` to `+gridExtent` |
| `initialZ` | | `[1, 0.6]` | initial probe `[x, y]`; Reset restores it |
| `resetLabel` | | `↺ Reset` | Reset control label |

## Usage

Add a `widget` block plus a paired `widget-script` block referencing it **by
`ref`**:

```json
{ "type": "widget",        "slug": "complex-map-2d", "params": { "widgetId": "w-foo", "svgId": "foo-svg", "outputId": "foo-out", "title": "…", "bodyScript": "function f(x,y){ return [x*x-y*y, 2*x*y]; }" } },
{ "type": "widget-script", "ref": "w-foo" }
```

Then `node scripts/rebuild.mjs --only widget-params` (AJV) and
`node scripts/rebuild.mjs` (byte-identical round-trip).

## Authoring notes

- Return the map in **data** units as `[u, v]`. The image grid samples 64 points
  per line; keep `f` cheap.
- Pick `range` so the probe's image stays mostly in view for the region the
  reader will explore (e.g. `z^2` with `range` ≈ 2.5 keeps central images visible;
  far grid lines clip harmlessly).
- Colour tokens only (`var(--cyan)` = vertical-line images / probe, `var(--yellow)`
  = horizontal-line images, `var(--pink)` = image point + local cross), never hex.
- The readout is plain text (no raw `$`); put LaTeX in the `.hint`.
