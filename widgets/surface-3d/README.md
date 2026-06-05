# surface-3d

A **self-contained shared** renderer for drag-to-rotate 3D parametric surfaces.
It is the registry's answer to the *dimension* monoculture (the corpus was
~99% 2D): any topic can drop in a rotatable surface without the page-global
`make3DDraggable`/`proj3` helpers that the older `surface-viewer` slug requires.

The renderer owns the whole 3D engine; the author supplies only the surface.

## What the renderer supplies

- A `surf(u,v)` mesh of `nu × nv` quads over `uRange × vRange`.
- Rotation (yaw/pitch) by **raw pointer-delta drag** — no `getScreenCTM`, so it
  is jsdom-safe and needs no SVG-coordinate mapping.
- Orthographic projection, **painter's-algorithm** back-to-front sort, and
  **Lambert shading via `fill-opacity`** (stays palette-token-only).
- **Auto-fit** scaling and **mesh decimation** while dragging (half resolution),
  full resolution on release.

## What the author supplies (`bodyScript`)

- `function surf(u,v){ return [x,y,z]; }` — **required**, model coordinates
  (auto-fit handles pixels). May read slider values via `$('#id').value`.
- `function colorOf(u,v,p){ return 'var(--token)'; }` — optional per-face fill.
- `function readoutText(){ return '...'; }` — optional readout.

In scope: `$`, `SVG`, and the slider elements by id.

## Params

See [`schema.json`](./schema.json). Required: `widgetId`, `svgId`, `outputId`,
`title`, `viewBox`, `svgWidth`, `svgHeight`, `uRange`, `vRange`, `nu`, `nv`,
`bodyScript`. Optional: `sliders`, `initialYaw`, `initialPitch`, `color`.

## Portability

`renderScript` is the HTML/SVG engine; a react-three-fiber consumer can ignore
it and rebuild the surface from `surf` + the structural params. `bodyScript` is
an author artifact (the surface formula), like `parametric-plot`/`surface-viewer`.
