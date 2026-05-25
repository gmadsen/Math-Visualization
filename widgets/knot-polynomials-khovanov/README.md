# knot-polynomials-khovanov

Bespoke widget for `knot-polynomials.html` (§8 *Khovanov homology*, concept
`kp-khovanov-homology`). Single module, not part of a shared family.

See [../README.md](../README.md) for the registry contract and the bespoke-vs-shared
distinction.

## What it does

Khovanov homology $\mathrm{Kh}^{i,j}(K)$ as a **bigraded table** — homological degree $i$ across,
quantum degree $j$ up — for the **unknot**, the **right-handed trefoil $3_1$**, and the
**figure-eight $4_1$**. Rational unreduced coefficients ($A=\mathbb{Q}\langle 1,X\rangle$), so each
cell is a dimension.

The widget computes the **graded Euler characteristic** $\sum_{i,j}(-1)^i q^j \dim\mathrm{Kh}^{i,j}$
live from the table and shows it equals $(q+q^{-1})\,V_L(q^2)$, the unnormalised Jones polynomial —
**decategorification**. The table and the polynomial below it are two independent computations
shown to agree (a ✓), matching the page's stated relation. The readout explains the construction
(each Kauffman-smoothing circle gets $A$; merges = multiplication with $X^2=0$, splits =
comultiplication; $d^2=0$; Reidemeister-invariant up to chain homotopy), and that Khovanov homology
is strictly stronger and functorial (Rasmussen's $s$-invariant; Kronheimer–Mrowka unknot detection).

Distinct from the seven existing knot-polynomials widgets (bracket = Kauffman state sum, rmatrix,
homfly, alexander, vassiliev, reidemeister, gallery): this is the only one showing the **categorified**
bigraded invariant and its decategorification.

The rational ranks are the standard Knot Atlas / Bar-Natan tables; all three were verified in node
against $(q+q^{-1})V_L(q^2)$ before authoring.

## Params

See [`schema.json`](./schema.json). Required: `widgetId`, `title`; optional `hint`. All knot data is
internal.

## Usage

```json
{ "type": "widget",        "slug": "knot-polynomials-khovanov", "params": { "widgetId": "w-khovanov", "title": "Khovanov homology: the table whose Euler characteristic is Jones", "hint": "pick a knot — the alternating sum of the bigraded table recovers the Jones polynomial" } },
{ "type": "widget-script", "ref": "w-khovanov" }
```

Then `node scripts/rebuild.mjs --only widget-params` and `node scripts/rebuild.mjs`.
