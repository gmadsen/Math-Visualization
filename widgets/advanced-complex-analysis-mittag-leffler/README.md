# advanced-complex-analysis-mittag-leffler

Mittag-Leffler explorer, introduced on `advanced-complex-analysis.html` §5. The
meromorphic dual of the Weierstrass-factorization widget. Bespoke semantic module
— the partial-sum eval is intrinsic (a `kind` enum); params carry only the case
menu.

See [../README.md](../README.md) for the registry contract.

## What it does

Pick a meromorphic function with a known principal-part expansion and step the
number of pole-terms $N$. The widget plots the partial sum $S_N$ along the real
axis against the target, so the prescribed poles appear one pair at a time and
$S_N$ converges to the function. The classic examples are $\pi\cot(\pi z)=
\frac1z+\sum 2z/(z^2-n^2)$ (simple poles at the integers) and
$\pi^2/\sin^2(\pi z)=\sum 1/(z-n)^2$ (double poles at the integers). Where
Weierstrass builds an entire function from its zeros, Mittag-Leffler builds a
meromorphic function from its poles.

## Params

| field | type | purpose |
|---|---|---|
| `widgetId` | string | DOM id; script derives `-sel/-n/-svg/-out`. |
| `title` | string | Header title. |
| `hint` | string (optional) | Short hint. |
| `functions` | array | Each: `id`, `label` (plain text), `kind` (`cot`/`csc2`), optional `note`. |

## Usage

Add a `widget` block + ref-based `widget-script` block to
`content/advanced-complex-analysis.json`, then `node scripts/rebuild.mjs --only widget-params`
and `node scripts/rebuild.mjs`.
