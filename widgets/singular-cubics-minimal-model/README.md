# singular-cubics-minimal-model

Bespoke widget for `singular-cubics-reduction.html` (§8 *Minimal Weierstrass models and the
conductor*, concept `minimal-weierstrass-model`). It makes the **`u¹²` scaling** of the
discriminant — and therefore the notion of a *minimal* model — concrete. Single module, not
part of a shared family.

See [../README.md](../README.md) for the registry contract (schema + pure render functions)
and the bespoke-vs-shared distinction.

## What it does

Buttons pick a globally minimal short Weierstrass curve $y^2 = x^3 + Ax + B$ (e.g.
$y^2=x^3-x$, $y^2=x^3+1$, $y^2=x^3-x+1$). A slider sets a scaling factor $u$; the admissible
change of variables $(x,y)\mapsto(u^2x,\,u^3y)$ produces another integer model of the **same**
curve,

$$y^2 = x^3 + A u^4\, x + B u^6, \qquad (c_4,c_6,\Delta)\ \longmapsto\ (u^4c_4,\ u^6c_6,\ u^{12}\Delta).$$

The widget factors $\Delta = u^{12}\,\Delta_0$ and draws a per-prime **stacked bar** of
$v_p(\Delta)$: the intrinsic part $v_p(\Delta_0)$ (cyan) and the spurious part $12\,v_p(u)$
(pink) the scaling adds at each prime $p\mid u$. The readout gives the minimality verdict —
$u=1$ is the global minimal model with $\Delta_{\min}=\Delta_0$; for $u>1$ the model is
non-minimal exactly at the primes dividing $u$, where Tate's algorithm scales back down by $u$
to clear the spurious $12\,v_p(u)$ — and notes that the conductor depends only on the reduction
*types* at the genuine bad primes, so it is unchanged by $u$.

## Params

See [`schema.json`](./schema.json) for the authoritative shape. Required fields:

| field | type | purpose |
|---|---|---|
| `widgetId` | string | DOM id for the outer `<div class="widget">` wrapper (and the `-svg`/`-out`/`-u`/`-btns` children). |
| `title`    | string | Display title rendered in the header. |
| `hint`     | string (optional) | Short hint rendered next to the title. |

The curve gallery, the invariants $(c_4,c_6,\Delta)$, and the scaling are fixed inside the
renderer; the controls only pick the curve and the scaling factor $u$.

## Usage

Add a `widget` block plus its `widget-script` block to `content/singular-cubics-reduction.json`:

```json
{ "type": "widget",        "slug": "singular-cubics-minimal-model", "params": { "widgetId": "w-minmodel", "title": "Minimal models and the u¹² scaling", "hint": "pick a curve and a scaling u; watch Δ = u¹²·Δ₀ and the spurious bad primes" } },
{ "type": "widget-script", "ref": "w-minmodel" }
```

Then run `node scripts/rebuild.mjs --only widget-params` to AJV-validate the params, and
`node scripts/rebuild.mjs` for the full chain (including the byte-identical round-trip gate).
