# diff-forms-integration

Bespoke module for **differential-forms** §5 (Integration of forms over chains).
Shows that integrating a 1-form over an oriented curve is defined by pullback to
the parameter interval, and that orientation contributes a sign.

See [../README.md](../README.md) for the registry contract (schema + pure
render functions) and the bespoke-vs-shared distinction.

## What it does

Pick a 1-form $\omega = P\,dx + Q\,dy$ ($dx$, $x\,dy$, or the angle form
$(-y\,dx + x\,dy)/(x^2+y^2)$) and an oriented curve $\gamma$ (segment, upper
semicircle, full circle). The widget draws $\gamma$ with orientation arrows and
computes
$$\int_\gamma \omega = \int_0^1 \gamma^*\omega = \int_0^1 \bigl[P(\gamma)\,x' + Q(\gamma)\,y'\bigr]\,dt$$
as a Riemann sum, drawing the tangent $\gamma'(t)$ at sample points coloured by
the sign of the pairing $\omega(\gamma')$ (green $\ge 0$, pink $< 0$). A
"reverse orientation" button negates the integral — the $\pm 1$ coefficient on
the chain. The angle form is closed but not exact, so its integral around a loop
enclosing the origin is $2\pi$, not $0$ — a first glimpse of de Rham cohomology.

## Params

See [`schema.json`](./schema.json) for the authoritative shape.

| field | type | purpose |
|---|---|---|
| `widgetId` | string | DOM id for the outer `<div class="widget">` wrapper. |
| `title`    | string | Display title (prose — `.ttl` is uppercased). |
| `hint`     | string (optional) | Short hint rendered next to the title. |

## Usage

```json
{ "type": "widget", "slug": "diff-forms-integration", "params": { "widgetId": "w-df-integration", "title": "Integrating a 1-form over an oriented curve" } },
{ "type": "widget-script", "ref": "w-df-integration" }
```

Then `node scripts/rebuild.mjs --only widget-params` to AJV-validate, and
`node scripts/rebuild.mjs` for the full byte-identical round-trip gate.
