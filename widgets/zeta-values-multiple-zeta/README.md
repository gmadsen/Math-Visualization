# zeta-values-multiple-zeta

Bespoke widget for `zeta-values.html` (§6 *Multiple zeta values and their algebra*, concept
`multiple-zeta-values`). It demonstrates the **double-shuffle relations** among multiple zeta
values numerically. Single module, not part of a shared family.

See [../README.md](../README.md) for the registry contract (schema + pure render functions)
and the bespoke-vs-shared distinction.

## What it does

A multiple zeta value is the nested sum
$\zeta(s_1,\dots,s_k)=\sum_{n_1>\cdots>n_k\ge1} n_1^{-s_1}\cdots n_k^{-s_k}$ (depth $k$,
weight $w=\sum s_i$). A truncation slider $N$ computes $\zeta(2),\zeta(3),\zeta(5)$ and the
weight-5 MZVs $\zeta(2,1),\zeta(2,3),\zeta(3,2),\zeta(4,1)$ by direct summation, bars the
values, and checks four identities live:

- **Euler:** $\zeta(2,1)=\zeta(3)$.
- **Stuffle** (nested-sum product): $\zeta(2)\zeta(3)=\zeta(2,3)+\zeta(3,2)+\zeta(5)$ —
  an exact partial-sum identity at every $N$.
- **Shuffle** (iterated-integral product): $\zeta(2)\zeta(3)=\zeta(2,3)+3\zeta(3,2)+6\zeta(4,1)$.
- **Double-shuffle:** subtracting the two products kills $\zeta(2)\zeta(3)$ and leaves
  $2\zeta(3,2)+6\zeta(4,1)=\zeta(5)$.

A side panel shows Zagier's dimension conjecture $d_n=d_{n-2}+d_{n-3}$ for
$\dim_{\mathbb{Q}}\mathcal{Z}_n$ against the naive $2^{n-2}$ count.

## Params

See [`schema.json`](./schema.json) for the authoritative shape. Required fields:

| field | type | purpose |
|---|---|---|
| `widgetId` | string | DOM id for the outer `<div class="widget">` wrapper (and the `-svg`/`-out`/`-N` children). |
| `title`    | string | Display title rendered in the header. |
| `hint`     | string (optional) | Short hint rendered next to the title. |

The MZV indices and relations are fixed inside the renderer; the slider only sets the
truncation $N$.

## Usage

Add a `widget` block plus its `widget-script` block to `content/zeta-values.json`:

```json
{ "type": "widget",        "slug": "zeta-values-multiple-zeta", "params": { "widgetId": "w-mzv", "title": "Multiple zeta values and the double-shuffle relations", "hint": "slide the truncation N; watch the stuffle and shuffle products force a relation" } },
{ "type": "widget-script", "ref": "w-mzv" }
```

Then run `node scripts/rebuild.mjs --only widget-params` to AJV-validate the params, and
`node scripts/rebuild.mjs` for the full chain.
