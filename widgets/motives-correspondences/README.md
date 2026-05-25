# motives-correspondences

Bespoke widget for `motives.html` (§2 *Correspondences as morphisms*, concept
`algebraic-correspondences`). It makes the morphisms of $\mathsf{Mot}_k$ concrete on
0-dimensional varieties, where a correspondence is a **matrix** and composition is
**matrix multiplication / path-counting**. Single module, not part of a shared family.

See [../README.md](../README.md) for the registry contract and the bespoke-vs-shared
distinction.

## What it does

A correspondence $X\vdash Y$ is a $\mathbb{Q}$-cycle on $X\times Y$ (an element of
$\mathrm{CH}^{d_X+r}(X\times Y)\otimes\mathbb{Q}$); composition is the pushforward–pullback
$\beta\circ\alpha=(p_{XZ})_*\bigl((p_{XY})^*\alpha\cdot(p_{YZ})^*\beta\bigr)$ on the triple
product. For **finite point sets** this is exactly the weighted count of paths through $Y$ —
the product of the multiplicity matrices.

Buttons pick a scenario on columns $X,Y,Z$ of points:

- **graphs of maps $f,g$** — $\beta\circ\alpha=\mathrm{graph}(g\circ f)$; ordinary composition is
  the special case (a map embeds as its graph).
- **a multivalued (Hecke-type) correspondence** — composition produces multiplicities by counting
  paths (e.g. $\beta\circ\alpha$ has a $2$ where two paths exist).
- **the diagonal $\Delta_X$ as identity** — $\beta\circ\Delta=\beta$.

The bipartite diagrams show edge multiplicities; the composite $X\to Z$ edges are labelled by
their path counts. The readout explains that morphisms in $\mathsf{Mot}_k$ are correspondences,
not maps; the composition law; the transpose ${}^t\alpha$; and the diagonal as the identity.

## Params

See [`schema.json`](./schema.json). Required: `widgetId`, `title`; optional `hint`.

## Usage

```json
{ "type": "widget",        "slug": "motives-correspondences", "params": { "widgetId": "w-corr", "title": "Correspondences are the morphisms: composition = counting paths (matrix product)", "hint": "pick a scenario; β∘α counts weighted paths through Y" } },
{ "type": "widget-script", "ref": "w-corr" }
```

Then `node scripts/rebuild.mjs --only widget-params` and `node scripts/rebuild.mjs`.
