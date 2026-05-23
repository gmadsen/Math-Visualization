# complex-analysis-cauchy-formula

Cauchy-integral-formula explorer, introduced on `complex-analysis.html` §10.
Bespoke semantic module — the function eval and the numerical Cauchy integral are
intrinsic (a `kind` enum); params carry only the case menu.

See [../README.md](../README.md) for the registry contract.

## What it does

Pick a holomorphic $f$ and slide a base point $a$ along the real axis across a
fixed circle $C:|z|=1.3$. The widget evaluates $\frac{1}{2\pi i}\oint_C
\frac{f(z)}{z-a}\,dz$ by the periodic trapezoid rule and shows it equals $f(a)$
when $a$ is **inside** $C$ and $0$ when $a$ is **outside** — the contour integral
literally reads off the value of $f$ at any enclosed point. As $a$ approaches the
contour the integrand becomes nearly singular, which the widget flags rather than
reporting a garbage value.

## Params

| field | type | purpose |
|---|---|---|
| `widgetId` | string | DOM id; script derives `-sel/-a/-svg/-out`. |
| `title` | string | Header title. |
| `hint` | string (optional) | Short hint. |
| `functions` | array | Each: `id`, `label` (plain text), `kind` (`z`/`z2`/`ez`/`cosz`), optional `note`. |

## Usage

Add a `widget` block + ref-based `widget-script` block to
`content/complex-analysis.json`, then `node scripts/rebuild.mjs --only widget-params`
and `node scripts/rebuild.mjs`.
