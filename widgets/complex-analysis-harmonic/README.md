# complex-analysis-harmonic

Harmonic-function mean-value explorer, introduced on `complex-analysis.html` §26.
Bespoke semantic module — the harmonic function eval is intrinsic (a `kind`
enum); params carry only the case menu.

See [../README.md](../README.md) for the registry contract.

## What it does

Pick a harmonic $u=\operatorname{Re} f$ and slide the circle's center $c_x$ (on
the real axis) and radius $r$. The left panel draws the circle $|z-c|=r$ with its
boundary points colored by whether $u$ there exceeds (cyan) or trails (pink) the
value at the center; the right panel plots $u$ along the circle against $\theta$,
with a dashed line at the boundary average. The readout computes the average and
$u(c)$ and shows they coincide — the **mean-value property** — so the center is
neither a maximum nor a minimum: a harmonic function has no interior extrema (the
**maximum principle**). The $\operatorname{Re}(1/z)$ case demonstrates the
hypothesis: enclosing the singularity at $0$ breaks the equality.

## Params

| field | type | purpose |
|---|---|---|
| `widgetId` | string | DOM id; script derives `-sel/-cx/-r/-svg/-out`. |
| `title` | string | Header title. |
| `hint` | string (optional) | Short hint. |
| `cases` | array | Each: `id`, `label` (plain text), `kind` (`re_z2`/`re_z3`/`re_exp`/`re_inv`/`re_z`), optional `note`. |

## Usage

Add a `widget` block + ref-based `widget-script` block to
`content/complex-analysis.json`, then `node scripts/rebuild.mjs --only widget-params`
and `node scripts/rebuild.mjs`.
