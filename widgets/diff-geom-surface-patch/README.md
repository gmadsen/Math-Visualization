# diff-geom-surface-patch

Bespoke module for **differential-geometry** §3 (Surfaces in ℝ³). Shows what a
regular parametrized surface is, and how its tangent plane and normal arise.

See [../README.md](../README.md) for the registry contract (schema + pure
render functions) and the bespoke-vs-shared distinction.

## What it does

Pick a surface (sphere, cylinder, saddle, torus). The widget draws the wireframe
$\mathbf{x}(u,v)$ via a light oblique projection and, at a marked point, the
partial-derivative tangent vectors $\mathbf{x}_u$ (green) and $\mathbf{x}_v$
(yellow), the tangent plane they span (shaded), and the unit normal
$\mathbf{n} = \mathbf{x}_u\times\mathbf{x}_v / |\mathbf{x}_u\times\mathbf{x}_v|$
(pink). The partials are computed by central differences from the
parametrization. It reports $|\mathbf{x}_u\times\mathbf{x}_v|$ and notes that its
non-vanishing is exactly **regularity** ($d\mathbf{x}$ injective), the condition
for the tangent plane to be 2-dimensional and the normal to be defined — and
that this length equals the area element $\sqrt{EG-F^2}$, bridging to the first
fundamental form.

## Params

See [`schema.json`](./schema.json) for the authoritative shape.

| field | type | purpose |
|---|---|---|
| `widgetId` | string | DOM id for the outer `<div class="widget">` wrapper. |
| `title`    | string | Display title (prose — `.ttl` is uppercased). |
| `hint`     | string (optional) | Short hint rendered next to the title. |

## Usage

```json
{ "type": "widget", "slug": "diff-geom-surface-patch", "params": { "widgetId": "w-dg-surface", "title": "A regular surface patch and its tangent plane" } },
{ "type": "widget-script", "ref": "w-dg-surface" }
```

Then `node scripts/rebuild.mjs --only widget-params` to AJV-validate, and
`node scripts/rebuild.mjs` for the full byte-identical round-trip gate.
