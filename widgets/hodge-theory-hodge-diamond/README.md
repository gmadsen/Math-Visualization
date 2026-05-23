# hodge-theory-hodge-diamond

Interactive Hodge-diamond explorer, introduced on `hodge-theory.html` §2 (the
Hodge decomposition theorem) to replace the section's static illustrative
diamond with a live, data-driven one. Bespoke semantic module — the diamond
geometry, Betti/Euler arithmetic, and the two symmetry-law checks are all
computed from the per-variety Hodge matrix in `params`, so a non-HTML frontend
can rebuild it from the schema alone.

See [../README.md](../README.md) for the registry contract.

## What it does

The reader picks a variety from a dropdown (ℙ¹, a genus-2 curve, ℙ², a K3
surface, an abelian surface, a quintic Calabi–Yau 3-fold, …). Its Hodge numbers
$h^{p,q}$ fill a rotated diamond grid (degree $n = p+q$ increases downward;
$q-p$ runs left→right). Clicking an entry lights up its **Hodge-conjugate**
$(q,p)$ partner in green and its **Poincaré-dual** $(d-p,d-q)$ partner in cyan.
The readout reports the Betti numbers as row sums $b_n=\sum_{p+q=n}h^{p,q}$, the
total dimension, the Euler characteristic $\sum(-1)^n b_n$, and a live check
that both symmetry laws hold.

## Params

See [`schema.json`](./schema.json) for the authoritative shape. Required fields:

| field | type | purpose |
|---|---|---|
| `widgetId` | string | DOM id for the outer `<div class="widget">`; the script derives `${widgetId}-sel/-svg/-out`. |
| `title`    | string | Header title. |
| `hint`     | string (optional) | Short hint next to the title. |
| `varieties` | array | Case library. Each item: `id` (option value), `label` (plain-text dropdown label — no LaTeX), `h` (a square matrix `h[p][q]`; the complex dimension `d` is derived as `h.length - 1`), optional `note` (one-line fact shown in the readout). |

## Usage

Add a `widget` block plus a ref-based `widget-script` block to
`content/<topic>.json`:

```json
{ "type": "widget", "slug": "hodge-theory-hodge-diamond", "params": {
    "widgetId": "w-hodge-diamond",
    "title": "Hodge diamonds — pick a variety",
    "hint": "rows are degree n = p+q; click an entry for its symmetry partners",
    "varieties": [
      { "id": "p1", "label": "ℙ¹ — projective line (d = 1)", "h": [[1,0],[0,1]], "note": "All cohomology is (p,p)-type — pure Tate." }
    ] } },
{ "type": "widget-script", "ref": "w-hodge-diamond" }
```

Then `node scripts/rebuild.mjs --only widget-params` to AJV-validate, and
`node scripts/rebuild.mjs` for the full byte-identical round-trip gate.
