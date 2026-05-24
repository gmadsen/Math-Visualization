# uhp-parallel-postulate

Bespoke module for **upper-half-plane-hyperbolic** §1 (ℍ, the upper half-plane).
Demonstrates the failure of Euclid's parallel postulate — the defining feature
of hyperbolic geometry.

See [../README.md](../README.md) for the registry contract (schema + pure
render functions) and the bespoke-vs-shared distinction.

## What it does

In the upper half-plane $\mathbb{H}=\{x+iy:y>0\}$ (constant curvature $-1$),
hyperbolic lines are semicircles meeting the real axis at right angles. A line
$\ell$ (cyan) and a point $P$ not on it are fixed. The widget draws a fan of
geodesics through $P$ coloured by whether they **meet** $\ell$ (green) or
**miss** it (pink), highlights the two **limiting parallels** (yellow dashed,
asymptotic to $\ell$'s ideal endpoints on the boundary), and a slider rotates
one test line through $P$ so you can watch it flip between crossing and missing
$\ell$. Every direction in the wedge between the two limiting parallels misses
$\ell$ — so **infinitely many** lines through $P$ are parallel to $\ell$, and
Euclid's parallel postulate fails. A toggle hides/shows the fan.

## Params

See [`schema.json`](./schema.json) for the authoritative shape.

| field | type | purpose |
|---|---|---|
| `widgetId` | string | DOM id for the outer `<div class="widget">` wrapper. |
| `title`    | string | Display title (prose — `.ttl` is uppercased). |
| `hint`     | string (optional) | Short hint rendered next to the title. |

## Usage

```json
{ "type": "widget", "slug": "uhp-parallel-postulate", "params": { "widgetId": "w-uhp-parallel", "title": "The parallel postulate fails in $\\mathbb{H}$" } },
{ "type": "widget-script", "ref": "w-uhp-parallel" }
```

Then `node scripts/rebuild.mjs --only widget-params` to AJV-validate, and
`node scripts/rebuild.mjs` for the full byte-identical round-trip gate.
