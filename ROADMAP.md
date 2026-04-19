# Roadmap

Planned expansion of the Interactive Mathematics Notebook, drawing topic coverage from three books: **Fearless Symmetry**, **Summing It Up**, and **Elliptic Tales** (all Ash & Gross). The existing 25 pages cover algebra, geometry, analysis, and algebraic geometry up through stacks. This roadmap fills the **arithmetic / automorphic** side of the story — the Langlands-program arc those three books collectively tell.

## Current state

25 topic pages live at [github.com/gmadsen/Math-Visualization](https://github.com/gmadsen/Math-Visualization). Six sections: Algebra, Analysis, Geometry & topology, Number theory, Modular forms & L-functions, Algebraic geometry. See [`README.md`](./README.md) for the full index.

## Source books

| Book | Chapters | Main contribution to roadmap |
|---|---|---|
| Fearless Symmetry | 1–23 | Galois → Frobenius → reciprocity → modular forms → FLT; sets the narrative arc |
| Summing It Up | 1–17 | Sums of squares, zeta & Bernoulli, the upper half-plane, modular forms, Hecke, moonshine, Sato–Tate |
| Elliptic Tales | 1–15 | Projective geometry, Bézout, reduction types, Dirichlet series, L-functions, BSD |

Two of the three books converge on modular forms; Elliptic Tales and Fearless Symmetry both converge on BSD / modularity. The roadmap treats each topic once and cross-references the multiple sources.

## Build plan

Four waves. Each wave can be built in parallel (3–5 subagents at once). Later waves depend on earlier ones for cross-linking; pages within a wave are self-contained enough to build simultaneously.

### Wave 1 — Classical gateways

Foundational pages with no new prerequisites beyond what's already in the notebook.

| Page | Books | Notes |
|---|---|---|
| `quadratic-reciprocity.html` | FS Ch 7 · Summing Ch 1 | Legendre symbol, Gauss's lemma, the reciprocity law, supplementary laws for −1 and 2 |
| `sums-of-squares.html` | Summing Ch 2–3 | Fermat's two-squares, Lagrange's four-squares, Gaussian integers, hint at theta functions |
| `projective-plane.html` | Elliptic Tales Ch 3 | Points at infinity, homogeneous coordinates, coordinate patches, projective curves |
| `p-adic-numbers.html` | FS (implicit) | $\mathbb{Z}_p$ as inverse limit, p-adic tree, Hensel's lemma, $\mathbb{Q}_p$ vs $\mathbb{R}$ |
| `upper-half-plane-hyperbolic.html` | Summing Ch 11 | Hyperbolic geometry, $\mathrm{SL}_2(\mathbb{R})$ isometries, Möbius transformations on $\mathbb{H}$ |

### Wave 2 — Core machinery

Builds on Wave 1 for cross-references.

| Page | Depends on | Books | Notes |
|---|---|---|---|
| `bezout.html` | projective-plane | Elliptic Tales Ch 4–5 | Intersection multiplicities, Bézout's theorem with worked examples |
| `modular-forms.html` | upper-half-plane | Summing Ch 12–14 · FS Ch 21 | $\mathrm{SL}_2(\mathbb{Z})$ action, fundamental domain, weight-$k$ forms, Eisenstein, q-expansions |
| `singular-cubics-reduction.html` | p-adics, elliptic-curves | Elliptic Tales Ch 9 | Additive, split/nonsplit multiplicative reduction; $E$ over $\mathbb{F}_p$ |
| `frobenius-and-reciprocity.html` | quadratic-reciprocity | FS Ch 16–19 | Frobenius as conjugacy class, factoring $f(x) \bmod p$, weak/strong reciprocity dictionary |
| `dirichlet-series-euler-products.html` | complex-analysis | Elliptic Tales Ch 11 · Summing Ch 9 | $\zeta(s)$, Euler products, functional equation, Dirichlet characters |

### Wave 3 — Representations and analysis

The Galois/automorphic synthesis.

| Page | Depends on | Books | Notes |
|---|---|---|---|
| `galois-representations.html` | frobenius-and-reciprocity, representation-theory | FS Ch 18–20 · Summing Ch 17 | $\ell$-adic reps, Tate module $T_\ell(E)$, unramified primes, trace of Frobenius |
| `hecke-operators.html` | modular-forms | Summing Ch 16 · FS Ch 21 | $T_p$, eigenforms, $a_p$, the Hecke algebra |
| `theta-functions.html` | modular-forms, sums-of-squares | Summing Ch 15 | $\theta(\tau)$, $r_k(n)$ via modular forms, Jacobi triple product |
| `L-functions.html` | dirichlet-series, modular-forms, elliptic-curves | Elliptic Tales Ch 13–14 · FS Ch 21 | $L(E,s)$, $L(f,s)$ for modular forms, analytic continuation, functional equation |
| `class-field-theory.html` | algebraic-number-theory, galois | FS (background) | Artin reciprocity, Hilbert class field, abelian Langlands |

### Wave 4 — Capstone

The grand narrative.

| Page | Depends on | Books | Notes |
|---|---|---|---|
| `etale-cohomology.html` | sheaf-cohomology, galois-representations | FS Ch 20 | Étale site, $\ell$-adic cohomology, Weil conjectures, "the machine" |
| `modularity-and-flt.html` | modular-forms, galois-representations, elliptic-curves | FS Ch 22 | Frey curves, level-lowering, Wiles/Taylor–Wiles, FLT |
| `bsd.html` | L-functions, elliptic-curves | Elliptic Tales Ch 15 · FS Ch 23 | Rank of $E(\mathbb{Q})$, $L(E,1)$, refined conjecture with $\mathrm{Sha}$, congruent number problem |
| `sato-tate.html` | galois-representations, L-functions | Summing Ch 17 | Equidistribution of Frobenius angles, semicircle law |

### Optional / side quests

Ideas from the books that don't sit on the critical path. Build if interested, skip freely.

| Page | Source | Why it's optional |
|---|---|---|
| `power-sums-bernoulli.html` | Summing Ch 5–6 | Bernoulli numbers, Euler–Maclaurin — beautiful, but Bernoulli numbers will also appear in L-functions |
| `waring.html` | Summing Ch 4 | $g(k)$, $G(k)$ — classical but disconnected from the Langlands spine |
| `partitions-generating-functions.html` | Summing Ch 10 · Elliptic Tales Ch 11 | Hardy–Ramanujan, $\eta$-function connection — self-contained beauty |
| `moonshine.html` | Summing Ch 17 | $j$-invariant coefficients and the Monster — capstone curiosity |
| `analytic-continuation.html` | Summing Ch 7 · Elliptic Tales Ch 12 | Could be folded into `complex-analysis.html` or `L-functions.html` instead |

## Proposed index restructure

The index is now organized into six sections that better reflect prerequisites and advanced arcs:

- **Algebra** — algebra, category-theory, representation-theory, commutative-algebra, homological
- **Analysis** — real-analysis, complex-analysis, functional-analysis, operator-algebras
- **Geometry & topology** — topology, smooth-manifolds, differential-forms, differential-geometry, riemannian-geometry, lie-groups, riemann-surfaces
- **Number theory** — galois, quadratic-reciprocity, sums-of-squares, algebraic-number-theory, p-adic-numbers, frobenius-and-reciprocity, class-field-theory
- **Modular forms & L-functions** — upper-half-plane-hyperbolic, modular-forms, theta-functions, hecke-operators, dirichlet-series-euler-products, L-functions, galois-representations
- **Algebraic geometry** — projective-plane, bezout, schemes, sheaves, morphisms-fiber-products, functor-of-points, elliptic-curves, singular-cubics-reduction, moduli-spaces, sheaf-cohomology, stacks

This structure keeps prerequisite-friendly material discoverable while isolating the automorphic/capstone sequence into a dedicated track.

## Cross-reference matrix

Which book's chapter maps to which (planned or existing) page. Useful when reading alongside the notebook.

| Topic | Fearless Symmetry | Summing It Up | Elliptic Tales | Notebook page |
|---|---|---|---|---|
| Modular arithmetic, Legendre | Ch 4, 7 | Ch 1 | Ch 2 §5–6 | `algebra.html`, + `quadratic-reciprocity.html` |
| Complex numbers | Ch 5 | Ch 7 §4–7 | Ch 2 §1–4 | `complex-analysis.html` |
| Equations & varieties | Ch 6 | — | Ch 1, 4 | `schemes.html`, `algebra.html` |
| Quadratic reciprocity | Ch 7, 19 | Ch 1 §5 | — | + `quadratic-reciprocity.html` |
| Galois theory | Ch 8, 13 | — | — | `galois.html` |
| Elliptic curves | Ch 9, 18 | Ch 17 §2 | Ch 6–10 | `elliptic-curves.html` |
| Projective plane | — | — | Ch 3 | + `projective-plane.html` |
| Bézout / intersections | — | — | Ch 4–5 | + `bezout.html` |
| Matrices, rep theory | Ch 10–12, 15 | Ch 11 §6 | Ch 7 | `representation-theory.html`, `algebra.html` |
| Frobenius | Ch 16 | — | — | + `frobenius-and-reciprocity.html` |
| Reciprocity laws | Ch 17, 21 | — | — | + `frobenius-and-reciprocity.html` |
| Sums of squares / Waring | — | Ch 2–4 | — | + `sums-of-squares.html` |
| Sums of powers / Bernoulli | — | Ch 5–6, 9 | — | *(optional)* `power-sums-bernoulli.html` |
| Infinite series / analytic cont. | — | Ch 7 | Ch 12 | folds into `complex-analysis.html` or `L-functions.html` |
| Upper half-plane | — | Ch 11 | — | + `upper-half-plane-hyperbolic.html` |
| Modular forms | Ch 21 | Ch 12–14 | — | + `modular-forms.html` |
| Hecke operators | — | Ch 16 §1 | — | + `hecke-operators.html` |
| Theta functions / partitions | — | Ch 15 · Ch 10 | — | + `theta-functions.html` |
| Singular cubics / reduction | — | — | Ch 9 | + `singular-cubics-reduction.html` |
| p-adic numbers | implicit | — | — | + `p-adic-numbers.html` |
| Galois representations | Ch 18, 20 | Ch 17 §1 | — | + `galois-representations.html` |
| Étale cohomology | Ch 20 | — | — | + `etale-cohomology.html` |
| Class field theory | implicit | — | — | + `class-field-theory.html` |
| Dirichlet series / Euler products | — | Ch 9 | Ch 11 | + `dirichlet-series-euler-products.html` |
| L-functions | Ch 21 | Ch 16 §3 | Ch 13–14 | + `L-functions.html` |
| Modularity / FLT | Ch 22 | Ch 17 §2 | — | + `modularity-and-flt.html` |
| BSD / congruent number | Ch 23 | — | Ch 15 | + `bsd.html` |
| Sato–Tate | — | Ch 17 §4 | — | + `sato-tate.html` |
| Moonshine | — | Ch 17 §3 | — | *(optional)* `moonshine.html` |

## Notes

- **Wave sizing.** Each wave is 4–5 pages, matched to the parallelization that's worked well before (5 pages built simultaneously by subagents, all passing jsdom on first attempt).
- **Commit cadence.** Ship one git commit per wave once all pages in it pass verification: `git add . && git commit -m "Wave N: <summary>" && git push`.
- **Dependencies are advisory.** A page that "depends on" another just means it will link to and reference that page. Nothing breaks if built out of order — links will simply 404 until the target exists.
- **Optional pages can be interleaved** with capstones if the mood strikes. Moonshine is a particularly fun side quest once modular forms is done.
- **Page style.** All new pages follow the existing template (see `category-theory.html`): dark 3b1b palette, KaTeX math, sticky sidebar TOC, 6+ SVG widgets per page, `← Notebook` back-link, standard public-repo footer.
