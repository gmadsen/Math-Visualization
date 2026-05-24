# rg-ricci-curvature

Bespoke module for **riemannian-geometry** §9 (Ricci curvature and Einstein
manifolds). Shows Ricci as average sectional curvature and as the control on
geodesic-ball volume.

See [../README.md](../README.md) for the registry contract (schema + pure
render functions) and the bespoke-vs-shared distinction.

## What it does

Sliders set the (constant) sectional curvature $K$, the dimension $n$, and a
geodesic radius $r$. The widget draws the geodesic $n$-ball against the Euclidean
ball of the same radius — the depicted disk area equals the computed $n$-ball
volume ratio, so **positive $K$ visibly shrinks the ball and negative $K$ grows
it**. The panel reports $\operatorname{Ric}(v,v)=(n-1)K$ (the average of the
$n-1$ sectional curvatures through $v$), the scalar curvature $S=n(n-1)K$, the
Einstein constant $\lambda=\operatorname{Ric}/g=(n-1)K=S/n$, and the
normal-coordinate expansion $\sqrt{\det g}\approx 1-\tfrac16\operatorname{Ric}_{ij}x^ix^j$.
This is the link behind Bishop–Gromov comparison and Bonnet–Myers; $\operatorname{Ric}=0$
is the source-free Einstein equation.

## Params

See [`schema.json`](./schema.json) for the authoritative shape.

| field | type | purpose |
|---|---|---|
| `widgetId` | string | DOM id for the outer `<div class="widget">` wrapper. |
| `title`    | string | Display title (prose — `.ttl` is uppercased). |
| `hint`     | string (optional) | Short hint rendered next to the title. |

## Usage

```json
{ "type": "widget", "slug": "rg-ricci-curvature", "params": { "widgetId": "w-rg-ricci", "title": "Ricci curvature, geodesic balls, and Einstein manifolds" } },
{ "type": "widget-script", "ref": "w-rg-ricci" }
```

Then `node scripts/rebuild.mjs --only widget-params` to AJV-validate, and
`node scripts/rebuild.mjs` for the full byte-identical round-trip gate.
