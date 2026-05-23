# complex-analysis-argument-principle

Argument-principle / winding-number visualizer, introduced on
`complex-analysis.html` §rouche. Bespoke semantic module — polynomial evaluation
and the winding count are intrinsic; params carry the root data.

See [../README.md](../README.md) for the registry contract.

## What it does

Pick a polynomial (given by its roots) and a contour radius $R$. The left panel
shows the circle $|z|=R$ with the roots marked (those inside highlighted); the
right panel shows the image curve $p(|z|=R)$ in the $w$-plane, which winds around
$0$ exactly (number of enclosed zeros, counting multiplicity) times. Sliding $R$
past a root's modulus makes the winding jump by that root's multiplicity — the
argument principle ($\text{winding} = \#\text{zeros} - \#\text{poles}$ enclosed),
and the mechanism behind Rouché's theorem.

## Params

| field | type | purpose |
|---|---|---|
| `widgetId` | string | DOM id; script derives `-sel/-r/-svg/-out`. |
| `title` | string | Header title. |
| `hint` | string (optional) | Short hint. |
| `functions` | array | Each: `id`, `label` (plain text), `roots` — a list of `{re, im, mult}` (the polynomial is $\prod (z-\text{root})^{\text{mult}}$). |

## Usage

Add a `widget` block + ref-based `widget-script` block to
`content/complex-analysis.json`, then `node scripts/rebuild.mjs --only widget-params`
and `node scripts/rebuild.mjs`.
