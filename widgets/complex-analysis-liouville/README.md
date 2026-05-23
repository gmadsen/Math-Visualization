# complex-analysis-liouville

Liouville's-theorem / Cauchy-estimate explorer, introduced on
`complex-analysis.html` §12. Bespoke semantic module — the function eval and
$M_R = \max_{|z|=R}|f|$ are intrinsic (a `kind` enum); params carry the case menu
and each $f$'s $|f'(0)|$.

See [../README.md](../README.md) for the registry contract.

## What it does

Pick an entire $f$ and drag the radius $R$. The widget plots the **Cauchy
estimate** bound $M_R/R$ against $R$ (where $M_R=\max_{|z|=R}|f|$, computed
numerically) and draws the actual $|f'(0)|$ as a reference line. Since
$|f'(0)|\le M_R/R$ for every $R$, a **bounded** entire function ($M_R\le M$)
forces the bound $\to 0$, hence $f'=0$ and $f$ constant — Liouville's theorem.
The constant case shows the bound decaying to $0$; $z$ holds it at $1$;
$2z+1\to2$; $z^2\to\infty$; $e^z\to\infty$ explosively — none of the non-constant
entire functions let the bound collapse, because none are bounded.

## Params

| field | type | purpose |
|---|---|---|
| `widgetId` | string | DOM id; script derives `-sel/-r/-svg/-out`. |
| `title` | string | Header title. |
| `hint` | string (optional) | Short hint. |
| `functions` | array | Each: `id`, `label` (plain text), `kind` (`const`/`z`/`affine`/`z2`/`ez`), `fp0` (actual $|f'(0)|$), optional `note`. |

## Usage

Add a `widget` block + ref-based `widget-script` block to
`content/complex-analysis.json`, then `node scripts/rebuild.mjs --only widget-params`
and `node scripts/rebuild.mjs`.
