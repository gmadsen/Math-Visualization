# zeta-values-mahler-measure

Bespoke widget for `zeta-values.html` (§7 *Zeta values and Mahler measure*, concept
`zeta-mahler-measure`). It makes the (logarithmic) **Mahler measure** of one-variable
polynomials concrete and gestures at its bridge to zeta/$L$-values. Single module, not part of
a shared family.

See [../README.md](../README.md) for the registry contract (schema + pure render functions)
and the bespoke-vs-shared distinction.

## What it does

The Mahler measure is $m(P)=\int_0^1\log|P(e^{2\pi i\theta})|\,d\theta$. Buttons pick a
polynomial from a gallery — $2x$, the cyclotomic $x^2+1$, the golden $x^2-x-1$, and **Lehmer's**
degree-10 polynomial. The widget plots the integrand $\log|P(e^{2\pi i\theta})|$ over one period
(its signed area is $m(P)$) and computes $m$ two ways:

- **Jensen's formula** $m(P)=\log|a|+\sum_{|\alpha_j|>1}\log|\alpha_j|$ (leading coefficient $a$,
  roots $\alpha_j$; uses precomputed roots) — exact, purely a height.
- the **live trapezoidal torus integral** — shown to agree (with a note that roots *on* the
  circle make the integral converge slowly).

The readout states Jensen's formula, frames **Lehmer's problem** (Lehmer's number
$1.17628\dots$ is the smallest known *multiplicative* Mahler measure $M(P)=e^{m(P)}$ above $1$,
equivalently the smallest logarithmic $m(P)$ above $0$, $=0.16236\dots$; whether the infimum of
positive measures is bounded away is open), and gives Smyth's **multivariable bridge** $m(1+x+y+z)=\frac{7}{2\pi^2}\zeta(3)$
and $m(1+x+y)=\frac{3\sqrt3}{4\pi}L(\chi_{-3},2)$ — the Mahler measure of a simple polynomial is
a special zeta/$L$-value.

## Params

See [`schema.json`](./schema.json) for the authoritative shape. Required fields:

| field | type | purpose |
|---|---|---|
| `widgetId` | string | DOM id for the outer `<div class="widget">` wrapper (and the `-svg`/`-out`/`-btns` children). |
| `title`    | string | Display title rendered in the header. |
| `hint`     | string (optional) | Short hint rendered next to the title. |

The polynomial gallery (coefficients + precomputed roots) is fixed inside the renderer; the
buttons only pick which polynomial is shown.

## Usage

Add a `widget` block plus its `widget-script` block to `content/zeta-values.json`:

```json
{ "type": "widget",        "slug": "zeta-values-mahler-measure", "params": { "widgetId": "w-mahler", "title": "Mahler measure: Jensen, Lehmer, and the bridge to ζ", "hint": "pick a polynomial; compare Jensen's height with the torus integral" } },
{ "type": "widget-script", "ref": "w-mahler" }
```

Then run `node scripts/rebuild.mjs --only widget-params` to AJV-validate the params, and
`node scripts/rebuild.mjs` for the full chain.
