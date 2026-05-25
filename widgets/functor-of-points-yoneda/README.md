# functor-of-points-yoneda

Bespoke widget for `functor-of-points.html` (§8 *The Yoneda embedding for schemes*, concept
`yoneda-embedding-ag`). It makes concrete the slogan **a scheme is its functor of points**, by
tabulating $X(R)=\operatorname{Hom}(A,R)$ over a gallery of test rings. Single module, not part
of a shared family.

See [../README.md](../README.md) for the registry contract and the bespoke-vs-shared
distinction.

## What it does

Buttons pick an affine scheme $X=\operatorname{Spec}A$; the widget tabulates $X(R)$ over the
test rings $\mathbb{F}_2,\mathbb{F}_3,\mathbb{F}_5,\mathbb{F}_7$ (with explicit solution sets),
$\mathbb{Q}$, $\mathbb{C}$, and reads off $|X(R)|$:

| $X$ | $X(R)$ | $|X(\mathbb{F}_2,\mathbb{F}_3,\mathbb{F}_5,\mathbb{F}_7)|$ |
|---|---|---|
| $\mathbb{A}^1=\operatorname{Spec}\mathbb{Z}[x]$ | $R$ | $2,3,5,7$ |
| $\mu_3=\operatorname{Spec}\mathbb{Z}[x]/(x^3-1)$ | cube roots of $1$ | $1,1,1,3$ |
| $G_m=\operatorname{Spec}\mathbb{Z}[x,x^{-1}]$ | $R^\times$ | $1,2,4,6$ |
| $\operatorname{Spec}\mathbb{Z}[x]/(x^2+1)$ | $\{r:r^2=-1\}$ | $1,0,2,0$ |
| $\operatorname{Spec}\mathbb{Z}$ (terminal) | $\{*\}$ | $1,1,1,1$ |

The point the readout drives home: the assignment $R\mapsto X(R)$, natural in $R$, **is** the
scheme. The embedding $h_{(-)}:\mathsf{Sch}\to\mathrm{Fun}(\mathsf{Sch}^{\mathrm{op}},\mathsf{Set})$,
$X\mapsto\operatorname{Hom}(-,X)$, is **fully faithful** (the representable Yoneda lemma
$\mathrm{Nat}(h_X,F)\cong F(X)$), so $\mathrm{Nat}(h_X,h_Y)\cong\operatorname{Hom}(X,Y)$ and two
schemes with naturally isomorphic point functors are isomorphic.

## Params

See [`schema.json`](./schema.json). Required: `widgetId`, `title`; optional `hint`. The scheme
gallery and the point counts are fixed inside the renderer.

## Usage

```json
{ "type": "widget",        "slug": "functor-of-points-yoneda", "params": { "widgetId": "w-yoneda", "title": "A scheme is its functor of points: X ⤳ (R ↦ X(R))", "hint": "pick a scheme; its R-points over every ring determine it (Yoneda)" } },
{ "type": "widget-script", "ref": "w-yoneda" }
```

Then `node scripts/rebuild.mjs --only widget-params` and `node scripts/rebuild.mjs`.
