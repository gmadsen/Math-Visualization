# advanced-complex-analysis-three-circles

Hadamard three-circles explorer, introduced on `advanced-complex-analysis.html`
§7. Bespoke semantic module — the function eval and $M(r)=\max_{|z|=r}|f|$ are
intrinsic (a `kind` enum); params carry only the case menu.

See [../README.md](../README.md) for the registry contract.

## What it does

Pick a holomorphic $f$ and slide the inner/outer radii $r_1<r_3$. The widget
computes $M(r)=\max_{|z|=r}|f|$ numerically and plots $\log M(r)$ against
$\log r$, which is **convex** (Hadamard's three-circles theorem). It draws the
chord between $r_1$ and $r_3$ and, at the log-midpoint $r_2=\sqrt{r_1 r_3}$,
checks $\log M(r_2)\le\tfrac12(\log M(r_1)+\log M(r_3))$ — equivalently
$M(r_2)^2\le M(r_1)M(r_3)$. Monomials $z^a$ give $\log M=a\log r$ (linear, the
equality case); $e^z$ and the polynomials bow strictly below the chord.

## Params

| field | type | purpose |
|---|---|---|
| `widgetId` | string | DOM id; script derives `-sel/-r1/-r3/-svg/-out`. |
| `title` | string | Header title. |
| `hint` | string (optional) | Short hint. |
| `functions` | array | Each: `id`, `label` (plain text), `kind` (`z2`/`ez`/`poly3`/`expz2`), optional `note`. |

## Usage

Add a `widget` block + ref-based `widget-script` block to
`content/advanced-complex-analysis.json`, then `node scripts/rebuild.mjs --only widget-params`
and `node scripts/rebuild.mjs`.
