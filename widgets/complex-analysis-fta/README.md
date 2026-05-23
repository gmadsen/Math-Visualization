# complex-analysis-fta

Fundamental-theorem-of-algebra winding-number explorer, introduced on
`complex-analysis.html` §13. Bespoke semantic module — polynomial evaluation and
the winding-number count are intrinsic; params carry only the case menu.

See [../README.md](../README.md) for the registry contract.

## What it does

Pick a monic polynomial $p$ and drag the radius slider $R$. The left panel shows
the circle $|z|=R$ in the $z$-plane with $p$'s roots marked (filled once they
fall inside the circle); the right panel shows the image curve $p(Re^{i\theta})$
in the $w$-plane. The readout reports the **winding number** of that image around
$0$, which equals the number of roots enclosed. Sweeping $R$ from $0$ outward,
the winding climbs $0\to\deg p$ — and since it can only change when the image
sweeps across $0$, $p$ must have a root. That is the fundamental theorem of
algebra, made visible.

## Params

| field | type | purpose |
|---|---|---|
| `widgetId` | string | DOM id; script derives `-sel/-r/-svg/-out`. |
| `title` | string | Header title. |
| `hint` | string (optional) | Short hint. |
| `cases` | array | Each: `id`, `label` (plain text), `coeffs` (real, **ascending** $a_0,\dots,a_n$), `roots` (`{re,im}` list, plotted + counted), optional `note`. |

## Usage

Add a `widget` block + ref-based `widget-script` block to
`content/complex-analysis.json`, then `node scripts/rebuild.mjs --only widget-params`
and `node scripts/rebuild.mjs`.
