# riemann-surfaces-chart-atlas

Bespoke widget for `riemann-surfaces.html` (§1 *What is a Riemann surface?*, concept
`riemann-surface-definition`). It makes the **definition** tangible — a Riemann surface is a
space with a holomorphic atlas whose transition maps are biholomorphic — on the smallest
non-trivial example, the Riemann sphere $\mathbb{CP}^1$. Single module, not part of a shared
family.

See [../README.md](../README.md) for the registry contract (schema + pure render functions)
and the bespoke-vs-shared distinction.

## What it does

The Riemann sphere $\mathbb{CP}^1 = \mathbb{C}\cup\{\infty\}$ is covered by two charts:

- $U_0$ with coordinate $z$ — everything except the north pole $\infty$,
- $U_\infty$ with coordinate $w = 1/z$ — everything except the south pole $0$.

Two sliders set a point on the overlap $U_0\cap U_\infty = \mathbb{C}^\ast$ by its modulus
$r=|z|$ and argument $\theta=\arg z$. The widget draws **both** coordinate planes side by
side: the point at $z = re^{i\theta}$ in the left ($U_0$) plane and at $w = 1/z =
r^{-1}e^{-i\theta}$ in the right ($U_\infty$) plane, with the unit circle $|z|=1\leftrightarrow|w|=1$
and the shared overlap marked. The readout reports the **transition map**
$\varphi_\infty\circ\varphi_0^{-1}(z) = 1/z$, its derivative $\tfrac{dw}{dz} = -1/z^2 \ne 0$ on
$\mathbb{C}^\ast$ (so it is biholomorphic), the inversion relations $|z||w| = 1$ and $\arg z +
\arg w = 0$, and the fact that the two poles each live in exactly one chart. The takeaway: a
holomorphic atlas with biholomorphic transitions is *all* the data of a Riemann surface, and
$\mathbb{CP}^1$ is the genus-0 model.

## Params

See [`schema.json`](./schema.json) for the authoritative shape. Required fields:

| field | type | purpose |
|---|---|---|
| `widgetId` | string | DOM id for the outer `<div class="widget">` wrapper (and the `-svg`/`-out`/`-r`/`-th` children). |
| `title`    | string | Display title rendered in the header. |
| `hint`     | string (optional) | Short hint rendered next to the title. |

The atlas (charts, transition map, plot window) is fixed inside the renderer; the sliders only
move the chosen point on the overlap.

## Usage

Add a `widget` block plus its `widget-script` block to `content/riemann-surfaces.json`:

```json
{ "type": "widget",        "slug": "riemann-surfaces-chart-atlas", "params": { "widgetId": "w-rs-atlas", "title": "Two-chart atlas of the Riemann sphere", "hint": "slide |z| and arg z; watch the point in both charts and the transition w = 1/z" } },
{ "type": "widget-script", "ref": "w-rs-atlas" }
```

Then run `node scripts/rebuild.mjs --only widget-params` to AJV-validate the params, and
`node scripts/rebuild.mjs` for the full chain (including the byte-identical round-trip gate).
