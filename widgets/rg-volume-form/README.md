# rg-volume-form

Bespoke module for **riemannian-geometry** §10 (Riemannian volume form and
divergence). Shows $\sqrt{\det g}$ as the local area density and integrates it
to the total area.

See [../README.md](../README.md) for the registry contract (schema + pure
render functions) and the bespoke-vs-shared distinction.

## What it does

Pick a surface metric — round sphere ($\sqrt{\det g}=\sin\theta$), flat plane,
embedded torus ($\sqrt{\det g}=2+\cos v$), or hyperbolic band
($\sqrt{\det g}=1/y^2$). The widget shades the coordinate domain by the area
density $\sqrt{\det g}$ (darker = more area per coordinate cell), marks the
density at the domain centre, and integrates it to the total area — recovering
e.g. $\int\sin\theta = 4\pi$ on the sphere, $8\pi^2$ on the torus. The readout
ties the same $\sqrt{\det g}$ factor to the divergence
$\operatorname{div}_g X=\tfrac1{\sqrt{\det g}}\partial_i(\sqrt{\det g}\,X^i)$ and
the Laplace–Beltrami operator
$\Delta_g f=\tfrac1{\sqrt{\det g}}\partial_i(\sqrt{\det g}\,g^{ij}\partial_j f)$.

## Params

See [`schema.json`](./schema.json) for the authoritative shape.

| field | type | purpose |
|---|---|---|
| `widgetId` | string | DOM id for the outer `<div class="widget">` wrapper. |
| `title`    | string | Display title (prose — `.ttl` is uppercased). |
| `hint`     | string (optional) | Short hint rendered next to the title. |

## Usage

```json
{ "type": "widget", "slug": "rg-volume-form", "params": { "widgetId": "w-rg-volume", "title": "The Riemannian volume form √det g" } },
{ "type": "widget-script", "ref": "w-rg-volume" }
```

Then `node scripts/rebuild.mjs --only widget-params` to AJV-validate, and
`node scripts/rebuild.mjs` for the full byte-identical round-trip gate.
