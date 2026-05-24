# diff-geom-fundamental-forms

Bespoke module for **differential-geometry** §4 (The first fundamental form, and
the second). Reads the metric and the bending off a surface and turns them into
the Gaussian and mean curvatures.

See [../README.md](../README.md) for the registry contract (schema + pure
render functions) and the bespoke-vs-shared distinction.

## What it does

Pick a surface (sphere, cylinder, saddle, plane, torus). The widget sketches the
wireframe and, at a representative point, displays the **first fundamental form**
$I = \begin{bmatrix}E&F\\F&G\end{bmatrix}$ (the induced metric,
$E=\mathbf{x}_u\cdot\mathbf{x}_u$, etc.) and the **second fundamental form**
$II = \begin{bmatrix}L&M\\M&N\end{bmatrix}$ (the normal curvature,
$L=\mathbf{x}_{uu}\cdot\mathbf{n}$, etc.), then computes the **Gaussian
curvature** $K = (LN-M^2)/(EG-F^2)$ and the **mean curvature**
$H = (EN-2FM+GL)/(2(EG-F^2))$, classifying the point as elliptic ($K>0$),
hyperbolic ($K<0$), or parabolic/flat ($K=0$). The readout closes with Gauss's
*Theorema Egregium*: $K$ depends only on $I$ (it is intrinsic), even though $II$
is not.

The fundamental forms are given analytically per surface at the marked point;
$K$ and $H$ are computed live from $E,F,G,L,M,N$.

## Params

See [`schema.json`](./schema.json) for the authoritative shape.

| field | type | purpose |
|---|---|---|
| `widgetId` | string | DOM id for the outer `<div class="widget">` wrapper. |
| `title`    | string | Display title (prose — `.ttl` is uppercased). |
| `hint`     | string (optional) | Short hint rendered next to the title. |

## Usage

```json
{ "type": "widget", "slug": "diff-geom-fundamental-forms", "params": { "widgetId": "w-dg-forms", "title": "First and second fundamental forms" } },
{ "type": "widget-script", "ref": "w-dg-forms" }
```

Then `node scripts/rebuild.mjs --only widget-params` to AJV-validate, and
`node scripts/rebuild.mjs` for the full byte-identical round-trip gate.
