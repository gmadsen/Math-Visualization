# sm-manifold-gallery

Bespoke module for **smooth-manifolds** §2 (Examples: spheres, projective
spaces, matrix groups). A zoo of the canonical smooth manifolds with their
dimensions and properties.

See [../README.md](../README.md) for the registry contract (schema + pure
render functions) and the bespoke-vs-shared distinction.

## What it does

Pick a family — $S^n$, $\mathbb{RP}^n$, $\mathbb{CP}^n$, $T^n$, $\mathrm{GL}_n$,
$\mathrm{SL}_n$, $\mathrm{O}(n)$, $\mathrm{SO}(n)$, $\mathrm{U}(n)$,
$\mathrm{SU}(n)$, or $\mathrm{Gr}(k,n)$ — and slide $n$ (and $k$ for the
Grassmannian). The widget reports the dimension as a formula and value, plots
how the dimension grows with $n$ (linear for spheres/projective spaces/tori,
quadratic for the matrix groups), and lists the standard atlas or defining
equations along with whether the manifold is **compact**, **connected**, and
**orientable** — including the conditions ($\mathbb{RP}^n$ orientable iff $n$
odd; $\mathrm{Gr}(k,n)$ iff $n$ even; $\mathrm{GL}_n,\mathrm{O}(n)$ have two
components). These examples plus products, quotients, and regular preimages
generate essentially every manifold met in geometry and physics.

## Params

See [`schema.json`](./schema.json) for the authoritative shape.

| field | type | purpose |
|---|---|---|
| `widgetId` | string | DOM id for the outer `<div class="widget">` wrapper. |
| `title`    | string | Display title (prose — `.ttl` is uppercased). |
| `hint`     | string (optional) | Short hint rendered next to the title. |

## Usage

```json
{ "type": "widget", "slug": "sm-manifold-gallery", "params": { "widgetId": "w-sm-gallery", "title": "A zoo of canonical smooth manifolds" } },
{ "type": "widget-script", "ref": "w-sm-gallery" }
```

Then `node scripts/rebuild.mjs --only widget-params` to AJV-validate, and
`node scripts/rebuild.mjs` for the full byte-identical round-trip gate.
