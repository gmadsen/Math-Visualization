# hodge-theory-pure-structure

Bespoke widget for `hodge-theory.html` (§4 *Pure Hodge structures as a category*, concept
`pure-hodge-structure`). It presents a pure Hodge structure as an abstract object and makes the
**Tate twist** the central interaction — the categorical operation absent from the §2
variety-diamond widget. Single module, not part of a shared family.

See [../README.md](../README.md) for the registry contract and the bespoke-vs-shared
distinction.

## What it does

A pure $\mathbb{Q}$-Hodge structure of weight $n$ is a $\mathbb{Q}$-vector space $V_\mathbb{Q}$
with $V_\mathbb{C}=\bigoplus_{p+q=n}V^{p,q}$ and $\overline{V^{p,q}}=V^{q,p}$. Buttons pick an
object:

| object | weight | Hodge numbers |
|---|---|---|
| $\mathbb{Q}(0)$ (unit) | $0$ | $h^{0,0}=1$ |
| $\mathbb{Q}(1)$ (Tate) | $-2$ | $h^{-1,-1}=1$ |
| $H^1(E)$ elliptic curve | $1$ | $h^{1,0}=h^{0,1}=1$ |
| $H^2(\mathrm{K3})$ | $2$ | $h^{2,0}=1,\ h^{1,1}=20,\ h^{0,2}=1$ |

A slider applies the **Tate twist** $V\mapsto V(m)$: every piece shifts $(p,q)\mapsto(p-m,q-m)$
and the weight $n\mapsto n-2m$, Hodge numbers unchanged. The pieces are plotted on the $(p,q)$
lattice (dots labelled $h^{p,q}$), with the conjugation diagonal $p=q$ and the weight antidiagonal
$p+q=n$ marked. The readout covers the category structure (morphisms respect the decomposition;
tensor/dual stay pure; unit $\mathbb{Q}(0)$), the Tate twist ($\mathbb{Q}(1)$ has weight $-2$,
Hodge realization $2\pi i\,\mathbb{Q}$), polarisability $\Rightarrow$ semisimplicity, and the
neutral Tannakian framing (Mumford–Tate group).

## Params

See [`schema.json`](./schema.json). Required: `widgetId`, `title`; optional `hint`. The gallery
and the twist are fixed inside the renderer.

## Usage

```json
{ "type": "widget",        "slug": "hodge-theory-pure-structure", "params": { "widgetId": "w-purehs", "title": "Pure Hodge structures: the category, and the Tate twist V ↦ V(m)", "hint": "pick an object; the Tate twist shifts (p,q)↦(p−m,q−m) and weight n↦n−2m" } },
{ "type": "widget-script", "ref": "w-purehs" }
```

Then `node scripts/rebuild.mjs --only widget-params` and `node scripts/rebuild.mjs`.
