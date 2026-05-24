# modular-forms-petersson-convergence

Bespoke widget for `modular-forms.html` (§9 *The Petersson inner product*, concept
`petersson-inner-product`). It makes the convergence half of the section — *why* the Petersson
pairing is defined on cusp forms but not on all of $M_k$ — concrete and computable. Single
module, not part of a shared family.

See [../README.md](../README.md) for the registry contract (schema + pure render functions)
and the bespoke-vs-shared distinction.

## What it does

The Petersson product is $\langle f,g\rangle=\int_{\Gamma\backslash\mathbb{H}} f\bar g\,y^{k-2}\,dx\,dy$.
All the convergence action is at the cusp $i\infty$, where the fundamental domain is the strip
$|x|\le\tfrac12$. By Parseval the $x$-integral of $|f|^2$ over the strip is
$\sum_{n\ge0}|a_n|^2 e^{-4\pi n y}$, so the cusp-neighborhood contribution to $\|f\|^2$ is

$$\int^{\infty} H(y)\,dy, \qquad H(y) = \Big(\sum_{n\ge0}|a_n|^2 e^{-4\pi n y}\Big)\,y^{k-2}.$$

At weight $k=12$ the widget plots $\log_{10}H(y)$ for the cusp form $\Delta$ (constant term
$a_0=0$) against the Eisenstein series $E_{12}$ ($a_0=1$) over the fundamental-domain spine
$y\in[\sqrt3/2,\,5]$. A slider sets the cutoff $Y$; the widget shows the running integral
$\int_{\sqrt3/2}^{Y}H$ for each. $\Delta$'s integrand decays like $e^{-4\pi y}y^{k-2}$ — the
exponential beats the polynomial — so its integral **plateaus** ($\langle\Delta,\Delta\rangle$
is finite). $E_{12}$'s integrand grows like $y^{k-2}$ because $a_0\ne0$, so its integral
**diverges** — which is exactly why $E_{12}$ is not a cusp form and the pairing lives on $S_k$.
The readout also records the $\mathrm{SL}_2(\mathbb{Z})$-invariance of $|f|^2y^k$ and of the
measure $y^{-2}\,dx\,dy$ that makes $\langle\cdot,\cdot\rangle$ well-defined, and that Hecke
operators are self-adjoint for it.

## Params

See [`schema.json`](./schema.json) for the authoritative shape. Required fields:

| field | type | purpose |
|---|---|---|
| `widgetId` | string | DOM id for the outer `<div class="widget">` wrapper (and the `-svg`/`-out`/`-Y` children). |
| `title`    | string | Display title rendered in the header. |
| `hint`     | string (optional) | Short hint rendered next to the title. |

The two forms ($\Delta$, $E_{12}$), the weight, and the $q$-expansion coefficients are fixed
inside the renderer; the slider only moves the cutoff $Y$.

## Usage

Add a `widget` block plus its `widget-script` block to `content/modular-forms.json`:

```json
{ "type": "widget",        "slug": "modular-forms-petersson-convergence", "params": { "widgetId": "w-petersson", "title": "Why the Petersson product converges on cusp forms", "hint": "slide the cutoff Y; watch Δ's integral converge while E₁₂'s diverges" } },
{ "type": "widget-script", "ref": "w-petersson" }
```

Then run `node scripts/rebuild.mjs --only widget-params` to AJV-validate the params, and
`node scripts/rebuild.mjs` for the full chain (including the byte-identical round-trip gate).
