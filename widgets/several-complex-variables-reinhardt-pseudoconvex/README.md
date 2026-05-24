# several-complex-variables-reinhardt-pseudoconvex

Bespoke widget for `several-complex-variables.html` (§4 *Domains of holomorphy and Levi
pseudoconvexity*, concept `scv-pseudoconvex`). It makes the equivalence **domain of holomorphy
⟺ holomorphically convex ⟺ pseudoconvex** concrete on **Reinhardt domains**, where all three
reduce to plane convexity. Single module, not part of a shared family.

See [../README.md](../README.md) for the registry contract (schema + pure render functions)
and the bespoke-vs-shared distinction.

## What it does

A Reinhardt domain $\Omega\subset\mathbb{C}^2$ is drawn through its **log image**
$\omega=\{(\log|z_1|,\log|z_2|)\}$ in the $(s,t)$ plane. A slider raises or lowers the middle
of $\omega$'s upper boundary:

- **Bulged up** → $\omega$ is **convex** → $\Omega$ is pseudoconvex = a domain of holomorphy
  (it is its own holomorphic hull).
- **Dented down** → $\omega$ is **non-convex**. The holomorphic hull is the *log-convex hull*,
  so it fills the dented triangle: every $f\in\mathcal{O}(\Omega)$ is a convergent Laurent
  series $\sum c_\alpha z^\alpha$, whose domain of convergence is automatically logarithmically
  convex, so $f$ extends across the dent. Hence $\Omega$ is **not** a domain of holomorphy.

The widget shades $\omega$ and, in the dented case, the filled hull (the forced-extension
region). The readout states the equivalence (domain of holomorphy ⟺ holomorphically convex,
Cartan–Thullen ⟺ pseudoconvex, Oka), the Reinhardt log-convex characterization, and the
Laurent-series argument.

## Params

See [`schema.json`](./schema.json) for the authoritative shape. Required fields:

| field | type | purpose |
|---|---|---|
| `widgetId` | string | DOM id for the outer `<div class="widget">` wrapper (and the `-svg`/`-out`/`-m` children). |
| `title`    | string | Display title rendered in the header. |
| `hint`     | string (optional) | Short hint rendered next to the title. |

The domain geometry and the convex-hull computation are fixed inside the renderer; the slider
only sets the height of the boundary's middle control point.

## Usage

Add a `widget` block plus its `widget-script` block to `content/several-complex-variables.json`:

```json
{ "type": "widget",        "slug": "several-complex-variables-reinhardt-pseudoconvex", "params": { "widgetId": "w-scv-reinhardt", "title": "Reinhardt domains: pseudoconvex ⟺ log-convex", "hint": "raise/lower the boundary; a dent is filled by the holomorphic hull" } },
{ "type": "widget-script", "ref": "w-scv-reinhardt" }
```

Then run `node scripts/rebuild.mjs --only widget-params` to AJV-validate the params, and
`node scripts/rebuild.mjs` for the full chain (including the byte-identical round-trip gate).
