# functional-analysis-krein-milman

Krein–Milman / extreme-points explorer, introduced on `functional-analysis.html`
§15. Bespoke semantic module — the point geometry is intrinsic (a `kind` enum);
params carry only the shape menu.

See [../README.md](../README.md) for the registry contract.

## What it does

Pick a compact convex set $K$ and slide a probe point around its boundary. The
widget highlights $\mathrm{ext}(K)$ in pink — a polygon's vertices, a disk's whole
boundary circle, a half-disk's curved arc (plus its two corners) — illustrating
**Krein–Milman**: $K$ is the closed convex hull of its extreme points. When the
probe lands on a non-extreme boundary point (the interior of a flat edge), the
widget draws the segment witnessing it as the midpoint $\tfrac12(x+y)$ of two
other points $x\neq y$ of $K$ — exactly the failure of the extreme-point
condition.

## Params

| field | type | purpose |
|---|---|---|
| `widgetId` | string | DOM id; script derives `-sel/-t/-svg/-out`. |
| `title` | string | Header title. |
| `hint` | string (optional) | Short hint. |
| `shapes` | array | Each: `id`, `label` (plain text), `kind` (`polygon`/`disk`/`halfdisk`), `n` (vertex count for `polygon`), optional `note`. |

## Usage

Add a `widget` block + ref-based `widget-script` block to
`content/functional-analysis.json`, then `node scripts/rebuild.mjs --only widget-params`
and `node scripts/rebuild.mjs`.
