# schemes-residue-field

Residue-field / evaluation explorer over $\operatorname{Spec}\mathbb{Z}$,
introduced on `schemes.html` §9. Bespoke semantic module — the arithmetic is
intrinsic; params carry only chrome.

See [../README.md](../README.md) for the registry contract.

## What it does

Slide an integer $f=n$. The widget shows its value at every point of
$\operatorname{Spec}\mathbb{Z}$: at a prime $(p)$ the residue field is
$\kappa((p))=\mathbb{F}_p$ and the value is $n\bmod p$; at the generic point
$(0)$ the residue field is $\kappa((0))=\mathbb{Q}$ and the value is $n$ itself.
So the *same* function takes values in **different fields** at different points —
the resolution of "how do you evaluate $f\in R$ when $R$ isn't an algebra over one
field." And $f$ vanishes at $(p)$ exactly when $p\mid n$, recovering $V(n)$.

## Params

| field | type | purpose |
|---|---|---|
| `widgetId` | string | DOM id; script derives `-n/-svg/-out`. |
| `title` | string | Header title. |
| `hint` | string (optional) | Short hint. |

## Usage

Add a `widget` block + ref-based `widget-script` block to
`content/schemes.json`, then `node scripts/rebuild.mjs --only widget-params`
and `node scripts/rebuild.mjs`.
