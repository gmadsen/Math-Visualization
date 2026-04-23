# surface-viewer

Shared widget module for the **3d-viewer** family — rotatable SVG views of
parametric surfaces, polyhedra, and 3-space trajectories. Absorbs widgets
from `differential-geometry`, `lie-groups`, and (subsequent passes)
`smooth-manifolds`, `riemannian-geometry`, and `dynamical-systems`.

A "3d viewer" in this notebook is an SVG where the draw loop projects 3-space
points to screen via the page-global `proj3(x, y, z, yaw, pitch)` helper and
registers drag-to-rotate via the page-global `make3DDraggable(svg, draw, {
yaw, pitch })` helper. The renderer emits the chrome; the per-widget math
(integrating geodesics, computing holonomy, building Sym(n) lattices,
wireframing a surface) lives in the `bodyScript` artifact string.

## Why this is its own family

The 3d viewers share enough markup shape (`.widget` > `.hd` + one `.row` of
controls + `<svg>` + `.readout`) to deserve their own renderer, and their
metadata (`dimension: "3d"`, `gesture: "drag"`) is distinct enough that
`scripts/stats-coverage.mjs` and the widget-family audits want them as a
separate bucket. The `bodyScript` artifact is explicitly labelled — a
portable React / react-three-fiber consumer discards it and rebuilds the
draw loop in its own renderer, reading structural params (`controls`,
`initialYaw`, `initialPitch`, `meshDensity`, `svgId`) and bespoke math
separately.

## Interactions

The schema dispatches via `oneOf` on `interaction`:

- **`standard`** — the canonical shape. Header + one `.row` of mixed
  sliders + selects + `<svg>` + `.readout`. Used by `w-defect`, `w-geo`,
  `w-gb`, `w-poly`, `w-hol` on `differential-geometry`.
- **`bare`** — whole widget inner HTML carried as `bodyMarkup` artifact.
  Used for widgets whose layout the structured form can't cover (e.g.
  `w-su2path` on `lie-groups` has a nested SVG + matrix readout row).
  Portable consumers still get the structural metadata (`dimension`,
  `gesture`, `role`) and the `bodyScript`; they rebuild the markup
  themselves.

## Chrome produced by `renderMarkup` (standard interaction)

```
<div class="widget" id="{widgetId}">
  <div class="hd"><div class="ttl">{title}</div>{optional .hint}</div>
  <div class="row">
    {sliders and selects, in order}
  </div>
  <svg id="{svgId}" viewBox="{viewBox}" width="{svgWidth}" style="{svgStyle}"><title>{svgTitle ?? title}</title></svg>
  <div class="readout" id="{outputId}">{readoutInitial}</div>
</div>
```

Every absorbed widget round-trips byte-identical to its original inline
source under `node scripts/render-topic.mjs <topic> | diff - <topic>.html`.

## Params (see `schema.json`)

Structural:

| field | purpose |
| --- | --- |
| `widgetId`, `svgId`, `outputId` | DOM ids on the wrapper, `<svg>`, readout |
| `viewBox` | SVG `viewBox` attribute, e.g. `-240 -180 480 360` |
| `svgWidth`, `svgStyle` | `width` and `style` attributes on `<svg>`, usually `"100%"` and `"max-width:640px;height:auto"` |
| `title`, `svgTitle`, `hint` | Header title, SVG `<title>` child (defaults to `title`), optional `.hint` line |
| `controls` | Ordered array of sliders/selects inside the single `.row` |
| `readoutInitial` | Initial inner HTML of the readout `<div>` — usually empty, filled by the draw loop |

Portable 3D params (consumed by `make3DDraggable` and `proj3` equivalents):

| field | purpose |
| --- | --- |
| `initialYaw`, `initialPitch` | Starting camera angles (radians) |
| `meshDensity.dragging`, `.static` | Wireframe density while rotating vs at rest |

Artifacts (opaque strings preserved for byte-identity; alternate frontends
ignore):

| field | what it carries |
| --- | --- |
| `sectionComment` | `/* … */` banner between `<script>` and the IIFE opener |
| `bodyScript` | Verbatim JS inside `(function(){ … })();` |
| `bodyMarkup` (bare only) | Full inner HTML of the widget wrapper |

## Porting to an alternate frontend

1. Read `controls`, `viewBox`, `initialYaw`, `initialPitch`, `meshDensity`
   as structural props.
2. Reimplement each widget's math against your renderer's 3D primitives
   (three.js scene, react-three-fiber mesh, custom SVG projection).
3. Discard `bodyScript` / `bodyMarkup` / `sectionComment` — they exist
   only for byte-identical reproduction of the hand-authored HTML source.

The `x-artifact` annotations inside `schema.json` flag every artifact
field explicitly so consumer tooling can skip them without guesswork.
