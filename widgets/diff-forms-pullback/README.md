# diff-forms-pullback

Bespoke module for **differential-forms** §6 (Pullback of forms). Visualizes the
single most useful fact about pullback: pulling back a top form picks up the
Jacobian determinant.

See [../README.md](../README.md) for the registry contract (schema + pure
render functions) and the bespoke-vs-shared distinction.

## What it does

Pick a map $\varphi: (u,v) \mapsto (x,y)$ (a scaling, a shear, or a
position-dependent stretch) and a base point via two sliders. The widget draws,
side by side, the unit $du{\wedge}dv$ square in the source plane (area 1) and its
image in the target plane — the parallelogram spanned by the columns of the
Jacobian $D\varphi$, whose signed area is exactly $\det(D\varphi)$. Pulling back
the area form $\omega = dx{\wedge}dy$ gives $\varphi^*\omega = \det(D\varphi)\,du{\wedge}dv$,
shown numerically. The shear has $\det = 1$ (area-preserving); the stretch has
$\det = 1 + \tfrac12 u$, so the area changes as you slide the base point. This is
why a change of coordinates in an integral picks up the Jacobian exactly once.

## Params

See [`schema.json`](./schema.json) for the authoritative shape.

| field | type | purpose |
|---|---|---|
| `widgetId` | string | DOM id for the outer `<div class="widget">` wrapper. |
| `title`    | string | Display title (prose — `.ttl` is uppercased). |
| `hint`     | string (optional) | Short hint rendered next to the title. |

## Usage

```json
{ "type": "widget", "slug": "diff-forms-pullback", "params": { "widgetId": "w-df-pullback", "title": "Pullback picks up the Jacobian determinant" } },
{ "type": "widget-script", "ref": "w-df-pullback" }
```

Then `node scripts/rebuild.mjs --only widget-params` to AJV-validate, and
`node scripts/rebuild.mjs` for the full byte-identical round-trip gate.
