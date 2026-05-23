# schemes-specialization

Generic-points / specialization explorer, introduced on `schemes.html` §8.
Bespoke semantic module — the poset (nodes + specialization edges) comes from
params.

See [../README.md](../README.md) for the registry contract.

## What it does

Draws an excerpt of $\operatorname{Spec}R$ as a poset by height — the generic
point at the top, curve generic points in the middle, closed points at the bottom
— with an edge $p\to q$ whenever $p\subsetneq q$ ($p$ **specializes to** $q$).
**Click a point** to highlight its closure $V(\mathfrak{p})=\{\mathfrak{q}:
\mathfrak{p}\subseteq\mathfrak{q}\}$ — the irreducible subvariety it is the
generic point of. The generic point's closure is the whole space; a closed
point's closure is just itself.

## Params

| field | type | purpose |
|---|---|---|
| `widgetId` | string | DOM id; script derives `-svg/-out`. |
| `title` | string | Header title. |
| `hint` | string (optional) | Short hint. |
| `nodes` | array | Each: `id`, `label` (plain text), `height` (0 = closed, higher = more generic), `geom` (meaning of $V(p)$). |
| `edges` | array | Specialization cover edges `[from, to]` with `from ⊊ to`. |

## Usage

Add a `widget` block + ref-based `widget-script` block to
`content/schemes.json`, then `node scripts/rebuild.mjs --only widget-params`
and `node scripts/rebuild.mjs`.
