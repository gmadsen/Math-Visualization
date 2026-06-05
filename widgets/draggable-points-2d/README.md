# draggable-points-2d

A **shared** renderer for direct-manipulation widgets: the reader grabs one or
more handle points on an SVG and the diagram + readout update live. This is the
registry's answer to the gesture gap — most corpus widgets are click/slider, and
this slug supplies genuine *drag the object itself* interaction.

The renderer owns the drag engine; the author owns only the math.

## What the renderer supplies

- One handle `<circle>` per `points[]` entry, in a top layer (always above the drawing).
- Pointer-capture drag (`pointerdown`/`move`/`up`), so a drag keeps tracking
  outside the handle.
- Clamping to the viewBox (minus the handle radius), or to per-point
  `minX/maxX/minY/maxY`; `lockX`/`lockY` restrict a handle to vertical/horizontal motion.
- A base group `G` for the author's drawing, and a live `pts` array.

## What the author supplies (`bodyScript`)

A JS body that **defines `function draw()`**. It runs inside the IIFE with these
in scope:

- `svg`, `out` — the SVG element and the `.readout` div.
- `G` — the base `<g>` to draw into; clear it with `G.innerHTML=''` at the top of `draw()`.
- `pts` — the live handle array `[{id,x,y,...}]`, also `pts.byId[id]`. Coordinates
  are SVG/pixel coordinates within the viewBox.
- page globals `$`, `SVG`.

The engine calls `draw()` once on init and after every drag, then syncs the
handle positions. Do **not** draw the handles yourself — the engine does.

## Params

See [`schema.json`](./schema.json). Required: `widgetId`, `svgId`, `outputId`,
`title`, `viewBox`, `svgWidth`, `svgHeight`, `points` (≥1), `bodyScript`.
Each point: `{id, x, y, color?, label?, r?, lockX?, lockY?, minX?, maxX?, minY?, maxY?}`.

## Live instances

- `projective-plane` — four collinear points whose cross-ratio is invariant (`lockY`).
- `complex-analysis` — drag `z`, watch the Möbius image `w=f(z)` move in the disk.
- `convex-geometry` — drag points, watch the convex hull update.

## Portability

`renderScript` is the HTML drag engine; a non-HTML frontend can ignore it and
drive its own handles from `points` (positions) and re-run its own draw. The
`bodyScript` is an author artifact (per-widget draw logic), like `parametric-plot`.
