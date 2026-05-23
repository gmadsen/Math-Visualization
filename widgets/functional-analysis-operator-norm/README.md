# functional-analysis-operator-norm

Operator-norm explorer, introduced on `functional-analysis.html` §4. Bespoke
semantic module — the singular-value computation is intrinsic; params carry only
the initial matrix.

See [../README.md](../README.md) for the registry contract.

## What it does

Adjust the four entries of a $2\times2$ matrix $T$. The widget maps the unit
circle to its image **ellipse** and reports $\|T\|=\sup_{\|x\|\le1}\|Tx\|$, which
equals the largest singular value $\sigma_{\max}$ — the major semi-axis of the
ellipse. The unit vector $x^*$ achieving the sup (yellow) and its image $Tx^*$
(pink, of length $\|T\|$) are marked; the minor semi-axis $\sigma_{\min}$ and the
area scale $|\det T|=\sigma_{\max}\sigma_{\min}$ are reported, and a near
rank-deficient $T$ collapses the ellipse to a segment.

## Params

| field | type | purpose |
|---|---|---|
| `widgetId` | string | DOM id; script derives `-a/-b/-c/-d/-svg/-out`. |
| `title` | string | Header title. |
| `hint` | string (optional) | Short hint. |
| `m0` | array (optional) | Initial entries `[a,b,c,d]` (default `[1.4,0.5,0,0.9]`). |

## Usage

Add a `widget` block + ref-based `widget-script` block to
`content/functional-analysis.json`, then `node scripts/rebuild.mjs --only widget-params`
and `node scripts/rebuild.mjs`.
