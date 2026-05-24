# sheaves-ox-module

Bespoke widget for `sheaves.html` (§8 *Sheaves of modules and $\mathcal{O}_X$-modules*, concept
`ox-modules`). It makes an $\mathcal{O}_X$-module concrete through its defining structure: the
module action of functions on sections, compatible with restriction. Single module, not part of
a shared family.

See [../README.md](../README.md) for the registry contract (schema + pure render functions)
and the bespoke-vs-shared distinction.

## What it does

On a line $X$ with structure sheaf $\mathcal{O}_X=C^0_X$ (continuous functions), buttons pick a
function $g\in\mathcal{O}_X(U)$, and the widget multiplies it into a section $s$ of an
$\mathcal{O}_X$-module $\mathcal{F}$ (here the free rank-1 module $\mathcal{O}_X$ itself),
plotting $g$, $s$, and the product $g\cdot s$ over the open $U$ and a sub-open $V$. It then
checks the **compatibility square**

$$(g\cdot s)|_V \;=\; g|_V\cdot s|_V$$

— the module action commutes with restriction. The readout defines a **ringed space**
$(X,\mathcal{O}_X)$ and an $\mathcal{O}_X$-module (a sheaf of abelian groups with each
$\mathcal{F}(U)$ an $\mathcal{O}_X(U)$-module, the square commuting for $V\subseteq U$), and
lists that $\mathsf{Mod}(\mathcal{O}_X)$ is abelian with tensor products
$\mathcal{F}\otimes_{\mathcal{O}_X}\mathcal{G}$, plus the standard examples $\mathcal{O}_X$,
$\mathcal{O}_X^n$, ideal sheaves, and the twisting sheaves $\mathcal{O}(n)$.

## Params

See [`schema.json`](./schema.json) for the authoritative shape. Required fields:

| field | type | purpose |
|---|---|---|
| `widgetId` | string | DOM id for the outer `<div class="widget">` wrapper (and the `-svg`/`-out`/`-btns` children). |
| `title`    | string | Display title rendered in the header. |
| `hint`     | string (optional) | Short hint rendered next to the title. |

The space, structure sheaf, module, and section are fixed inside the renderer; the buttons only
pick the multiplier $g$.

## Usage

Add a `widget` block plus its `widget-script` block to `content/sheaves.json`:

```json
{ "type": "widget",        "slug": "sheaves-ox-module", "params": { "widgetId": "w-oxmod", "title": "O_X-modules: multiply a section by a function", "hint": "pick g ∈ O_X(U); compare (g·s)|_V with g|_V·s|_V" } },
{ "type": "widget-script", "ref": "w-oxmod" }
```

Then run `node scripts/rebuild.mjs --only widget-params` to AJV-validate the params, and
`node scripts/rebuild.mjs` for the full chain.
