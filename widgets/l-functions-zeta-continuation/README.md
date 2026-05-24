# l-functions-zeta-continuation

Bespoke widget for `L-functions.html` (§8 *Analytic continuation of $L$-functions*, concept
`analytic-continuation-lfunc`). It makes "the half-plane of convergence is an artifact"
visible for the Riemann zeta function. Single module, not part of a shared family.

See [../README.md](../README.md) for the registry contract (schema + pure render functions)
and the bespoke-vs-shared distinction.

## What it does

A Dirichlet series $\sum a_n n^{-s}$ only converges in a half-plane ($\zeta$: $\mathrm{Re}\,s>1$).
The widget plots the **continued** $\zeta(s)$ for real $s\in[-6,5]$ — computed by the
Cohen–Villegas–Zagier accelerated $\eta$-series for $s>0$ ($\zeta=\eta/(1-2^{1-s})$) and by the
functional equation $\zeta(s)=2^s\pi^{s-1}\sin(\tfrac{\pi s}{2})\Gamma(1-s)\zeta(1-s)$ for $s<0$
(Lanczos $\Gamma$), with $\zeta(0)=-\tfrac12$ — and overlays the truncated Dirichlet partial sum
$\sum_{n\le N} n^{-s}$ (slider $N$). The partial sum tracks $\zeta$ only for $s>1$ and blows up
for $s\le1$, so the picture shows that $\zeta$ continues to a meromorphic function on
$\mathbb{C}$ with a simple pole at $s=1$, **trivial zeros** at $s=-2,-4,-6$, and the special
values $\zeta(0)=-\tfrac12$, $\zeta(-1)=-\tfrac1{12}$. The readout explains the Mellin/theta
mechanism and the functional equation $s\leftrightarrow1-s$.

## Params

See [`schema.json`](./schema.json) for the authoritative shape. Required fields:

| field | type | purpose |
|---|---|---|
| `widgetId` | string | DOM id for the outer `<div class="widget">` wrapper (and the `-svg`/`-out`/`-N` children). |
| `title`    | string | Display title rendered in the header. |
| `hint`     | string (optional) | Short hint rendered next to the title. |

The $\zeta$-curve and its evaluation are fixed inside the renderer; the slider only sets the
partial-sum truncation $N$.

## Usage

Add a `widget` block plus its `widget-script` block to `content/L-functions.json`:

```json
{ "type": "widget",        "slug": "l-functions-zeta-continuation", "params": { "widgetId": "w-lfn-cont", "title": "Analytic continuation: the half-plane is an artifact", "hint": "slide N; the Dirichlet partial sum diverges past s=1, but ζ continues" } },
{ "type": "widget-script", "ref": "w-lfn-cont" }
```

Then run `node scripts/rebuild.mjs --only widget-params` to AJV-validate the params, and
`node scripts/rebuild.mjs` for the full chain.
