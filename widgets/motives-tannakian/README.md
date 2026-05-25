# motives-tannakian

Bespoke widget for `motives.html` (§5 *Tannakian categories — representations of an invisible
group*, concept `tannakian-categories`). It makes the Tannakian formalism concrete on its
prototype, **Rep(G)** for a finite group $G$. Single module, not part of a shared family.

See [../README.md](../README.md) for the registry contract and the bespoke-vs-shared
distinction.

## What it does

A neutral Tannakian category is a $k$-linear **rigid abelian symmetric monoidal** category with a
faithful exact tensor functor $\omega$ (the **fiber functor**) to $\mathsf{Vect}_k$; Tannakian
reconstruction recovers the group as $G=\underline{\mathrm{Aut}}^{\otimes}(\omega)$. Buttons pick
a small group ($\mathbb{Z}/3$ or $S_3$); the widget draws the **Clebsch–Gordan fusion table** of
its irreducibles (each cell $V_i\otimes V_j$ decomposed into irreducibles), the fiber-functor
dimensions $\omega(V_i)=k^{\dim V_i}$, and states the reconstruction.

- $\mathbb{Z}/3$: the three 1-dimensional characters tensor by **adding indices mod 3** — the
  fusion table *is* the group table.
- $S_3$: the only non-abelian fusion is $\mathrm{std}\otimes\mathrm{std}=\mathrm{triv}\oplus
  \mathrm{sign}\oplus\mathrm{std}$ ($\dim 4=1+1+2$).

The readout explains the formalism, the reconstruction $G=\underline{\mathrm{Aut}}^{\otimes}
(\omega)$, and how this is the engine behind the **motivic Galois group** (the Tannakian group of
numerical motives, with the Betti realization as fiber functor).

## Params

See [`schema.json`](./schema.json). Required: `widgetId`, `title`; optional `hint`.

## Usage

```json
{ "type": "widget",        "slug": "motives-tannakian", "params": { "widgetId": "w-tann", "title": "Tannakian categories: Rep(G)'s fusion table remembers the group", "hint": "pick G; the tensor (Clebsch–Gordan) table + fiber functor recover G = Aut⊗(ω)" } },
{ "type": "widget-script", "ref": "w-tann" }
```

Then `node scripts/rebuild.mjs --only widget-params` and `node scripts/rebuild.mjs`.
