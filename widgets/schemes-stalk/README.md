# schemes-stalk

Local-ring / stalk explorer on the affine line, introduced on `schemes.html` §10.
Bespoke semantic module — the polynomial eval is intrinsic; params carry the
sample functions.

See [../README.md](../README.md) for the registry contract.

## What it does

Slide a point $a$ on $\mathbb{A}^1$. The stalk $\mathcal{O}_a=k[x]_{(x-a)}$ — germs
of functions defined near $a$ — is a **local ring**, and the widget shows for each
sample function $f$ whether it is a **unit** ($f(a)\neq0$) or lies in the unique
**maximal ideal** $\mathfrak{m}_a$ ($f(a)=0$). As $a$ slides past a root of $f$,
that function flips from unit to non-unit. The residue field $\mathcal{O}_a/
\mathfrak{m}_a=k$ via $f\mapsto f(a)$ — exactly what makes a scheme a *locally*
ringed space.

## Params

| field | type | purpose |
|---|---|---|
| `widgetId` | string | DOM id; script derives `-a/-svg/-out`. |
| `title` | string | Header title. |
| `hint` | string (optional) | Short hint. |
| `functions` | array | Each: `id`, `label` (plain text), `coeffs` (real, ascending $a_0,a_1,\dots$). |

## Usage

Add a `widget` block + ref-based `widget-script` block to
`content/schemes.json`, then `node scripts/rebuild.mjs --only widget-params`
and `node scripts/rebuild.mjs`.
