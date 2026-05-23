# schemes-dimension

Krull-dimension explorer, introduced on `schemes.html` §13. Bespoke semantic
module — the chain and geometry come from params.

See [../README.md](../README.md) for the registry contract.

## What it does

Pick a ring $R$. The widget draws a **maximal chain** of prime ideals
$\mathfrak{p}_0\subsetneq\cdots\subsetneq\mathfrak{p}_d$ as a ladder, with each
prime's geometric meaning ($V(\mathfrak{p}_i)$ is a closed subscheme whose
dimension drops by one as you descend). The **Krull dimension** is the length $d$
of the longest chain: the generic point $(0)$ at the top carries dimension $d$;
the maximal ideal at the bottom is a dimension-$0$ point. Stepping through
$k$ (dim 0), $k[x]$ and $\mathbb{Z}$ (dim 1), $k[x,y]$ (dim 2), $k[x,y,z]$
(dim 3) shows the algebra (chain length) and the geometry (point ⊂ line ⊂
plane ⊂ space) move in lockstep.

## Params

| field | type | purpose |
|---|---|---|
| `widgetId` | string | DOM id; script derives `-sel/-svg/-out`. |
| `title` | string | Header title. |
| `hint` | string (optional) | Short hint. |
| `rings` | array | Each: `id`, `label` (plain text), `steps` (the chain top→bottom; each step pairs `ideal` with the `geom` of $V(\mathfrak{p}_i)$, so they can't desync), optional `note`. |

## Usage

Add a `widget` block + ref-based `widget-script` block to
`content/schemes.json`, then `node scripts/rebuild.mjs --only widget-params`
and `node scripts/rebuild.mjs`.
