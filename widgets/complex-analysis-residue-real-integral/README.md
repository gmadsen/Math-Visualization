# complex-analysis-residue-real-integral

Real-integrals-by-residues widget, introduced on `complex-analysis.html` §19
(residue theorem). Complements the section's draggable contour widget by showing
the upper-half-plane closing technique for real integrals. Bespoke semantic
module — the $2\pi i\cdot\Sigma$ arithmetic and contour drawing are intrinsic;
params carry each integrand's poles, residues, and answer.

See [../README.md](../README.md) for the registry contract.

## What it does

Pick an integrand ($1/(x^2+1)$, $1/(x^2+1)^2$, $1/(x^4+1)$, $\cos x/(x^2+1)$).
The widget draws the upper-half-plane semicircular contour (real axis + a large
arc whose contribution $\to0$), plots the poles (those with $\operatorname{Im}>0$
are enclosed and highlighted yellow), and computes
$\int_{-\infty}^{\infty}f\,dx = 2\pi i\sum\operatorname{Res}$ over the enclosed
poles — matching the closed form ($\pi$, $\pi/2$, $\pi/\sqrt2$, $\pi/e$).

## Params

| field | type | purpose |
|---|---|---|
| `widgetId` | string | DOM id; script derives `-sel/-svg/-out`. |
| `title` | string | Header title. |
| `hint` | string (optional) | Short hint. |
| `integrands` | array | Each: `id`, `label` (plain text), `result` (closed form), optional `note`, and `poles` — a list of `{re, im, resRe, resIm, label}` (the widget encloses those with `im > 0`). |

## Usage

Add a `widget` block + ref-based `widget-script` block to
`content/complex-analysis.json`, then `node scripts/rebuild.mjs --only widget-params`
and `node scripts/rebuild.mjs`.
