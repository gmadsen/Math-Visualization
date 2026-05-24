# l-functions-class-number

Bespoke widget for `L-functions.html` (§9 *Special values and arithmetic*, concept
`special-values-lfunc`). It shows the **analytic class number formula** holding numerically:
the special value $L(1,\chi_d)$ of a Dirichlet $L$-function reads off the class number of an
imaginary quadratic field. Single module, not part of a shared family.

See [../README.md](../README.md) for the registry contract (schema + pure render functions)
and the bespoke-vs-shared distinction.

## What it does

Buttons pick a negative fundamental discriminant $d$ (e.g. $-3,-4,-7,-8,-11,-15,-20,-23,-24,-47$).
The widget builds the **Kronecker character** $\chi_d$ (period $|d|$, via the Kronecker symbol
$(d/\cdot)$), draws its values as a $\pm1/0$ strip, sums the Dirichlet $L$-series
$L(1,\chi_d)=\sum_n \chi_d(n)/n$, and compares it with the closed form

$$L(1,\chi_d) = \frac{2\pi h}{w\sqrt{|d|}}$$

using the field's known class number $h$ and number of roots of unity $w$ (the regulator is
$1$ since the unit group is finite). The two agree, so the purely analytic $L$-value reads off
the arithmetic class number $h = \mathrm{round}\!\big(L(1,\chi_d)\,w\sqrt{|d|}/2\pi\big)$. The
readout frames this as the shape of all special values — a transcendental **period** times an
**arithmetic invariant** — alongside Euler's $\zeta(2k)=$ rational $\times\,\pi^{2k}$ and
$\zeta(1-n)=-B_n/n$.

## Params

See [`schema.json`](./schema.json) for the authoritative shape. Required fields:

| field | type | purpose |
|---|---|---|
| `widgetId` | string | DOM id for the outer `<div class="widget">` wrapper (and the `-svg`/`-out`/`-btns` children). |
| `title`    | string | Display title rendered in the header. |
| `hint`     | string (optional) | Short hint rendered next to the title. |

The discriminant gallery (with $h,w$) and the Kronecker-character / $L$-series computation are
fixed inside the renderer; the buttons only pick the field.

## Usage

Add a `widget` block plus its `widget-script` block to `content/L-functions.json`:

```json
{ "type": "widget",        "slug": "l-functions-class-number", "params": { "widgetId": "w-lfn-cnf", "title": "The class number formula: L(1,χ_d) = 2πh / (w√|d|)", "hint": "pick an imaginary quadratic field; the L-value reads off its class number h" } },
{ "type": "widget-script", "ref": "w-lfn-cnf" }
```

Then run `node scripts/rebuild.mjs --only widget-params` to AJV-validate the params, and
`node scripts/rebuild.mjs` for the full chain.
