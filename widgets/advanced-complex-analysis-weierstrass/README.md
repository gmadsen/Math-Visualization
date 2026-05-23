# advanced-complex-analysis-weierstrass

Weierstrass-factorization explorer, introduced on `advanced-complex-analysis.html`
§4. Bespoke semantic module — the partial-product eval is intrinsic (a `kind`
enum); params carry only the case menu.

See [../README.md](../README.md) for the registry contract.

## What it does

Pick an entire function with a known canonical product and step the number of
factors $N$. The widget plots the partial product $P_N$ along the real axis
against the target function, so the prescribed zeros lock in one at a time and
$P_N$ converges to the function on wider and wider intervals. The classic genus-0
examples are $\sin(\pi z)/(\pi z)=\prod(1-z^2/n^2)$ (zeros at the nonzero
integers) and $\cos(\pi z)=\prod\!\big(1-\tfrac{4z^2}{(2n-1)^2}\big)$ (zeros at
the half-integers).

## Params

| field | type | purpose |
|---|---|---|
| `widgetId` | string | DOM id; script derives `-sel/-n/-svg/-out`. |
| `title` | string | Header title. |
| `hint` | string (optional) | Short hint. |
| `functions` | array | Each: `id`, `label` (plain text), `kind` (`sinc`/`cosp`), optional `note`. |

## Usage

Add a `widget` block + ref-based `widget-script` block to
`content/advanced-complex-analysis.json`, then `node scripts/rebuild.mjs --only widget-params`
and `node scripts/rebuild.mjs`.
