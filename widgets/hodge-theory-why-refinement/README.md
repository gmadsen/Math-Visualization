# hodge-theory-why-refinement

Bespoke widget for `hodge-theory.html` (§1 *Why Hodge structures?*, concept `why-hodge`). It
makes the **motivation** concrete: the complex structure refines the topological Betti numbers
into Hodge numbers. Single module, not part of a shared family.

See [../README.md](../README.md) for the registry contract and the bespoke-vs-shared
distinction.

## What it does

A topologist sees only $H^n(X)$ as a $\mathbb{Q}$-vector space of dimension $b_n$. But $X$ is a
complex manifold, so $H^n(X;\mathbb{C})=\bigoplus_{p+q=n}H^{p,q}$ with
$H^{p,q}=H^q(X,\Omega^p_X)$ of dimension $h^{p,q}$, and $b_n=\sum_{p+q=n}h^{p,q}$.

Buttons pick a variety; a **topological / Hodge** toggle draws, for each degree $n$, a
fixed-width bar:

| variety | Betti | Hodge highlights |
|---|---|---|
| elliptic curve $E$ | $1,2,1$ | $h^{1,0}=h^{0,1}=1$ |
| genus-2 curve | $1,4,1$ | $h^{1,0}=h^{0,1}=2$ |
| $\mathbb{P}^2$ | $1,0,1,0,1$ | all $(p,p)$ |
| K3 surface | $1,0,22,0,1$ | $h^{2,0}=1,h^{1,1}=20,h^{0,2}=1$ |

In **topological** mode the bar is one block labelled $b_n$; in **Hodge** mode it splits into
coloured segments proportional to the $h^{p,q}$, with the $(p,q)$ breakdown. The same space
$H^n$ acquires an internal $(p,q)$ grading from the complex structure that $b_n$ alone cannot
see. The readout gives the Betti-vs-Dolbeault contrast, $b_n=\sum h^{p,q}$, the conjugation
symmetry, and that this extra grading carries arithmetic/geometric information.

## Params

See [`schema.json`](./schema.json). Required: `widgetId`, `title`; optional `hint`. The variety
gallery and its Betti/Hodge numbers are fixed inside the renderer.

## Usage

```json
{ "type": "widget",        "slug": "hodge-theory-why-refinement", "params": { "widgetId": "w-whyhodge", "title": "Why Hodge structures? The complex structure refines the Betti numbers into Hodge numbers", "hint": "toggle topological ↔ Hodge: each Betti number b_n splits into a sum of h^{p,q}" } },
{ "type": "widget-script", "ref": "w-whyhodge" }
```

Then `node scripts/rebuild.mjs --only widget-params` and `node scripts/rebuild.mjs`.
