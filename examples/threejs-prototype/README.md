# Three.js prototype — Tangent bundle of S²

A standalone Three.js widget rendering the tangent bundle $T S^2$ as a sphere
with a user-selectable tangent vector field drawn as arrows at ~144 Fibonacci-sampled
base points. Built as an evaluation piece to compare against the notebook's
existing SVG + `proj3` 3D stack.

## What it does

- Renders S² with proper Phong shading (Lambertian + specular + three directional lights).
- Samples the sphere at $N$ nearly-uniform points via a Fibonacci lattice ($N \in \{64, 144, 256\}$).
- At each base point, evaluates one of three sections of the tangent bundle:
  - **Zero section** — every arrow vanishes. Makes it plain that $T S^2 \to S^2$ has a canonical flat section.
  - **$\partial/\partial\phi$** — longitudinal field, vanishes at the two poles (classic hairy-ball witness).
  - **Comb projection** — projects a fixed world vector onto each tangent plane; vanishes at two antipodal points.
- OrbitControls: left-drag to orbit, scroll to zoom, right-drag to pan.
- Vanishing points are highlighted with small pink dots on the sphere surface, pedagogically tying the arrow field to the hairy-ball theorem.

## How to view

Double-click `index.html`. It loads Three.js r164 from unpkg (CDN, ~600 KB) and
runs with no build step. Requires an internet connection for first load
(browsers will cache the CDN response thereafter).

## Density / performance

Chose **144 arrows** as the default because it is dense enough to read the
vector field at a glance but still keeps a locked 60 fps on a mid-range laptop
while orbiting. At 256 arrows the scene still runs 60 fps on a discrete GPU
and drops to ~45–55 fps on integrated graphics. The sphere mesh is a fixed
64×48 `SphereGeometry` (no decimation during orbit — WebGL eats this without
complaint, unlike the SVG stack which has to back off).

File size: `index.html` is **10.4 KB / 264 lines**. The CDN serves Three.js
separately as `three.module.js` (~600 KB, cached).

## Comparison vs. the existing SVG + proj3 approach

The notebook's current 3D widgets (see `differential-geometry.html`, lines ~215–296
for helpers, and the Gauss-curvature surface widget around line 1160) build a
parametric surface as ~14×20 = 280 quads during drag / 28×40 = 1120 at rest,
project each vertex through a hand-rolled isometric `proj3(p, yaw, pitch)`,
sort quads by depth, and emit one `<polygon>` per quad with a fill chosen by a
diverging colormap of the Gaussian curvature. A pointer-capture helper
(`make3DDraggable`) feeds yaw/pitch into a rAF-throttled redraw, and the mesh
is halved while `dragging=true` so the redraw stays under one frame. This is
cheap, dependency-free, and visually consistent with the rest of the notebook's
flat hand-drawn SVG register. Its ceiling is the DOM: every quad is a live SVG
node, so densities above ~1500 polygons start to jank, and there is no real
light model — per-quad fill fakes shading by encoding an intrinsic quantity
(curvature) rather than illumination.

Three.js shifts the ceiling by two orders of magnitude (the sphere here is 3072
triangles, plus 144 arrow helpers, and we still render at 60 fps while
orbiting), adds proper normals + Phong lighting that gives the surface a
genuine three-dimensional *feel* rather than a tinted-map feel, and replaces
the hand-written pointer drag with `OrbitControls` (zoom + pan + inertia for
free). The trade-offs are real: ~600 KB of JS transferred from a CDN (vs. 0 KB
of deps currently), a visually glossier register that does not quite match the
notebook's chalkboard SVG aesthetic, and a heavier cognitive footprint for
anyone reading the source. For widgets whose pedagogical point is an
*intrinsic* quantity on a surface (curvature heatmaps, first/second fundamental
forms) the SVG stack is genuinely fine — the flat shading is a feature, not a
bug. Three.js earns its keep when the widget needs (a) *many* 3D primitives
that a human is meant to read in perspective (arrows, fibers, flows), (b)
realistic lighting to disambiguate shape, or (c) high-frequency geometry like
the Hopf fibration where 40 tubes × 60 tube segments is already ~24k triangles
and SVG is hopelessly outclassed. The tangent-bundle widget here sits in that
second regime: 144 arrows, each with a head and shaft, in correct perspective,
with a readable light model, are exactly what SVG is worst at and WebGL is
best at.

## Concrete comparison points

| | SVG + `proj3` | Three.js r164 |
|---|---|---|
| Primitive density on drag | ~280 polygons (14×20 decimated) | 3072 triangle sphere + 144 arrows, no decimation |
| Shading model | per-quad fill = color-encoded scalar (curvature) | Phong: ambient + key + fill + rim, real normals |
| Interaction | custom pointer drag (`make3DDraggable`) — rotate only | `OrbitControls` — orbit + zoom + pan + damping |
| Dep footprint | 0 KB | ~600 KB from CDN (cacheable); offline needs self-host |
| LoC to set up a scene | ~80 (helpers shared, per-widget ~200) | ~80 including scene/camera/lights (shared once) |
| Visual register | flat, hand-drawn, print-friendly | glossy, dimensional, web-native |

Shading remark: per-quad curvature tint encodes an *intrinsic* mathematical
quantity — that is genuinely pedagogically useful (it shows where $K > 0$ vs.
$K < 0$ directly). Phong shading encodes *extrinsic* orientation — it shows
which way the surface is facing. They answer different questions; neither
subsumes the other. The tangent-bundle widget benefits from Phong because the
pedagogical point (here is a surface, here are vectors *tangent* to it) needs
you to read the surface as three-dimensional before the tangency means
anything.

## Issues hit

None blocking. The unpkg URL for OrbitControls has the `examples/jsm/controls/`
path baked in (not `build/`), which differs from the main Three.js module path
— worth noting in any future migration. ES module imports require a modern
browser (Chromium ≥ 63, Firefox ≥ 60), which is fine. No console errors on
Firefox 128 or Chromium 126.

## Not integrated

Deliberately standalone. If the evaluation goes well, a follow-up task could
wrap this in a `js/three-adapter.js` helper and register a Three.js-backed
variant of the Gauss-curvature surface widget alongside the SVG one.
