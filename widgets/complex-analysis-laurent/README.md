# complex-analysis-laurent

Laurent-series annulus explorer, introduced on `complex-analysis.html` §17.
Bespoke semantic module — the function eval and Laurent partial sums are
intrinsic (kind/seriesKind enums); params carry the case menu + series text.

See [../README.md](../README.md) for the registry contract.

## What it does

Pick a (function, annulus) case. The headline point is that the *same* function
has *different* Laurent series on different annuli — $1/(z(z-1))$ expands as
$-1/z-1-z-\cdots$ on $0<|z|<1$ but as $z^{-2}+z^{-3}+\cdots$ on $|z|>1$. The
widget shades the chosen annulus, places a test point in it, and (with a slider
for the number of terms $N$) shows the partial Laurent sum $S_N$ converging to
$f$ there — $|f-S_N|\to0$ on the annulus, diverging outside.

## Params

| field | type | purpose |
|---|---|---|
| `widgetId` | string | DOM id; script derives `-sel/-n/-svg/-out`. |
| `title` | string | Header title. |
| `hint` | string (optional) | Short hint. |
| `cases` | array | Each: `id`, `label`, `kind` (`inv_zzm1`/`exp_invz`, for direct eval), `seriesKind` (`inner_zzm1`/`outer_zzm1`/`exp_invz`, the partial-sum rule), `rIn`, `rOut` (annulus radii; finite `rOut` for display), `series` (plain-text Laurent series). |

## Usage

Add a `widget` block + ref-based `widget-script` block to
`content/complex-analysis.json`, then `node scripts/rebuild.mjs --only widget-params`
and `node scripts/rebuild.mjs`.
