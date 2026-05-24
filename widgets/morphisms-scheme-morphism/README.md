# morphisms-scheme-morphism

Bespoke widget for `morphisms-fiber-products.html` (§1 *What is a morphism of schemes?*,
concept `scheme-morphisms`). It makes the defining **local-on-stalks** condition of a scheme
morphism concrete on a polynomial map of affine lines. Single module, not part of a shared
family.

See [../README.md](../README.md) for the registry contract (schema + pure render functions)
and the bespoke-vs-shared distinction.

## What it does

A morphism of schemes $f\colon X\to Y$ is a continuous map $|X|\to|Y|$ **plus** a sheaf map
$f^\#\colon\mathcal{O}_Y\to f_*\mathcal{O}_X$ ("pull back regular functions") whose stalk maps
$f^\#_x\colon\mathcal{O}_{Y,y}\to\mathcal{O}_{X,x}$ are **local** ring homomorphisms
(sending $\mathfrak{m}_y$ into $\mathfrak{m}_x$).

The widget realizes this on $f\colon\mathbb{A}^1\to\mathbb{A}^1$ given by a ring map
$\varphi\colon k[y]\to k[x]$, $y\mapsto f(x)$. A slider moves a point $a$ in the source; it maps
to $b=f(a)$. The widget plots $f$, marks $a\mapsto b$, picks a function $g(y)$ on the target,
pulls it back to $\varphi(g)=g(f(x))$, and verifies the local condition: $g$ vanishing at $b$
pulls back to a function vanishing at $a$ — so $\mathcal{O}_{Y,b}\to\mathcal{O}_{X,a}$ is a
local homomorphism. The readout defines a scheme morphism and explains that this local
condition upgrades a ringed-space map to a *locally* ringed-space map (the affine
anti-equivalence $\operatorname{Spec}A\to\operatorname{Spec}B \leftrightarrow$ ring maps
$B\to A$).

## Params

See [`schema.json`](./schema.json) for the authoritative shape. Required fields:

| field | type | purpose |
|---|---|---|
| `widgetId` | string | DOM id for the outer `<div class="widget">` wrapper (and the `-svg`/`-out`/`-a` children). |
| `title`    | string | Display title rendered in the header. |
| `hint`     | string (optional) | Short hint rendered next to the title. |

The map $f$, the test function $g$, and the lines are fixed inside the renderer; the slider
only moves the source point $a$.

## Usage

Add a `widget` block plus its `widget-script` block to `content/morphisms-fiber-products.json`:

```json
{ "type": "widget",        "slug": "morphisms-scheme-morphism", "params": { "widgetId": "w-schmor", "title": "Scheme morphism: the local-on-stalks condition", "hint": "drag a; watch b = f(a), the pullback g(f(x)), and m_b → m_a" } },
{ "type": "widget-script", "ref": "w-schmor" }
```

Then run `node scripts/rebuild.mjs --only widget-params` to AJV-validate the params, and
`node scripts/rebuild.mjs` for the full chain.
