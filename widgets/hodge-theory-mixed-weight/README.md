# hodge-theory-mixed-weight

Explorer for Deligne's mixed Hodge structures, introduced on
`hodge-theory.html` §5 (replacing the section's static "stack of pure pieces"
SVG with an interactive one). Bespoke semantic module — each example carries its
weight-graded pieces in params.

See [../README.md](../README.md) for the registry contract.

## What it does

Pick an example and see the weight-graded pieces $\mathrm{gr}^W_n = W_n/W_{n-1}$
of its cohomology, stacked by weight (highest on top), each pure of weight $n$.
The library contrasts a smooth curve (pure, weight = degree), $\mathbb{C}^*$ and
a nodal cubic (pure but weight ≠ degree), and an open elliptic curve
$E\setminus\{p\}$ (genuinely mixed — a weight-1 piece extended by a weight-2
quotient). The readout flags pure vs. mixed and explains the extension.

## Params

| field | type | purpose |
|---|---|---|
| `widgetId` | string | DOM id; script derives `-sel/-svg/-out`. |
| `title` | string | Header title. |
| `hint` | string (optional) | Short hint. |
| `examples` | array | Each: `id`, `label` (plain text), `space` (which cohomology group), optional `note`, and `pieces` — a list of `{weight, dim, label}` graded pieces (the widget sorts by weight). |

## Usage

Add a `widget` block + ref-based `widget-script` block to
`content/hodge-theory.json`, then `node scripts/rebuild.mjs --only widget-params`
and `node scripts/rebuild.mjs`.
