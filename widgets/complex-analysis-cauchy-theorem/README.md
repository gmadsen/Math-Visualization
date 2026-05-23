# complex-analysis-cauchy-theorem

Cauchy's-theorem contour-integral explorer, introduced on `complex-analysis.html`
§9. Bespoke semantic module — the function eval and the numerical contour
integral are intrinsic (a `kind` enum); params carry only the case menu.

See [../README.md](../README.md) for the registry contract.

## What it does

Pick a function $f$ and drag the **deform** slider, which wobbles a closed
contour $C = (R + a\sin 5\theta)e^{i\theta}$ (always enclosing the origin). The
widget evaluates $\oint_C f\,dz$ by the periodic trapezoid rule (spectrally
accurate on the smooth contour, so the answer lands at machine precision) and
shows it (a) **vanishes** whenever $f$ is holomorphic inside $C$, and (b) is
**unchanged** as you deform $C$ — the integral depends only on what is enclosed,
not the path. Two cases bracket the hypothesis: $1/z$ (pole at $0$, enclosed)
gives $2\pi i$, while $1/(z-1.6)$ (pole outside $C$) still gives $0$.

## Params

| field | type | purpose |
|---|---|---|
| `widgetId` | string | DOM id; script derives `-sel/-d/-svg/-out`. |
| `title` | string | Header title. |
| `hint` | string (optional) | Short hint. |
| `functions` | array | Each: `id`, `label` (plain text), `kind` (`z`/`z2`/`ez`/`sinz`/`inv_z`/`inv_zm`), optional `note`. |

## Usage

Add a `widget` block + ref-based `widget-script` block to
`content/complex-analysis.json`, then `node scripts/rebuild.mjs --only widget-params`
and `node scripts/rebuild.mjs`.
