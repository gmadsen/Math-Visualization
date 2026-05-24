# sheaves-presheaf-restriction

Bespoke widget for `sheaves.html` (§2 *Presheaves*, concept `presheaf-functor`). It makes a
presheaf — a contravariant functor on the poset of opens — concrete through the restriction of
a section. Single module, not part of a shared family.

See [../README.md](../README.md) for the registry contract (schema + pure render functions)
and the bespoke-vs-shared distinction.

## What it does

On a line $X$ the widget fixes a continuous section $s\in F(U)$ (the presheaf $F=C^0_X$ of
continuous functions) and a chain of nested opens $U\supseteq V\supseteq W$; two sliders move
the endpoints of $V$ and $W$. It plots $s$ over $X$, highlights the portions over $V$ and $W$
as the **restrictions** $s|_V$ and $s|_W$, and draws the poset diagram $U\to V\to W$ with the
restriction maps $\rho$, illustrating the functor laws

$$\rho^U_U=\mathrm{id},\qquad \rho^V_W\circ\rho^U_V=\rho^U_W$$

— the two paths $U\to V\to W$ and $U\to W$ give the same $s|_W$. The readout defines a presheaf
$F\colon\mathrm{Open}(X)^{\mathrm{op}}\to\mathsf{Set}$, sections and global sections, the
examples ($C^0$, holomorphic $\mathcal{O}_X$ — both in fact sheaves), and notes the **constant
presheaf** as one that fails gluing, motivating the sheaf axiom (§3).

## Params

See [`schema.json`](./schema.json) for the authoritative shape. Required fields:

| field | type | purpose |
|---|---|---|
| `widgetId` | string | DOM id for the outer `<div class="widget">` wrapper (and the `-svg`/`-out`/`-v`/`-w` children). |
| `title`    | string | Display title rendered in the header. |
| `hint`     | string (optional) | Short hint rendered next to the title. |

The space, section, and presheaf are fixed inside the renderer; the sliders only move the
endpoints of the sub-opens $V$ and $W$.

## Usage

Add a `widget` block plus its `widget-script` block to `content/sheaves.json`:

```json
{ "type": "widget",        "slug": "sheaves-presheaf-restriction", "params": { "widgetId": "w-presheaf", "title": "Presheaf = contravariant functor: restriction and functoriality", "hint": "shrink V and W; the section restricts, and the two paths to W agree" } },
{ "type": "widget-script", "ref": "w-presheaf" }
```

Then run `node scripts/rebuild.mjs --only widget-params` to AJV-validate the params, and
`node scripts/rebuild.mjs` for the full chain.
