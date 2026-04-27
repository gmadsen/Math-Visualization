# Concept graph health — summary

- Total concepts: **642**
- Total prereq edges: **1049**
- Implicit prereq candidates (total across all concepts): **169**
- Multi-topic candidates (title appears in prose of ≥ 3 other topics): **22**
- Atomicity-split candidates (blurb ≥ 3 sentences AND > 200 chars): **57**
- Dangling proper-noun phrases (in ≥ 2 topics, no matching concept): **22**
- Orphan concepts (zero edges in or out): **14**

## Decision framework

- All three signals are below their thresholds. Current architecture is adequate; expand by decomposing under-built topics (41 of 58 still at the 5-concept scaffolding default).

## Top 15 multi-topic candidates

- `open-sets` (point-set-topology) — title appears in prose of **9** other topics
- `analytic-continuation` (complex-analysis) — title appears in prose of **7** other topics
- `fundamental-group` (algebraic-topology) — title appears in prose of **7** other topics
- `compactness` (point-set-topology) — title appears in prose of **6** other topics
- `complex-numbers` (complex-analysis) — title appears in prose of **5** other topics
- `limits-colimits` (category-theory) — title appears in prose of **4** other topics
- `exact-sequences` (homological) — title appears in prose of **4** other topics
- `kan-complex` (simplicial-sets-and-nerve) — title appears in prose of **4** other topics
- `countability` (naive-set-theory) — title appears in prose of **3** other topics
- `geometric-morphisms-intro` (elementary-topos-theory) — title appears in prose of **3** other topics
- `real-differentiation` (real-analysis) — title appears in prose of **3** other topics
- `mobius-transformations` (complex-analysis) — title appears in prose of **3** other topics
- `holomorphic-function` (complex-analysis) — title appears in prose of **3** other topics
- `reflexivity` (functional-analysis) — title appears in prose of **3** other topics
- `poisson-summation` (harmonic-analysis-fourier) — title appears in prose of **3** other topics

## Top 15 implicit-prereq flags

- `categories-morphisms` (category-theory) — 3 missing: open-sets, scheme-morphisms, reflexivity
- `geometric-morphisms-of-sites` (grothendieck-topologies-sites) — 3 missing: open-sets, sieves, fundamental-group
- `cstar-basics` (operator-algebras) — 3 missing: spectrum-of-element, positive-elements, gns-construction
- `abelian-categories` (homological) — 2 missing: snake-lemma, five-lemma
- `infty-adjunctions` (infinity-categories) — 2 missing: quasi-category, kan-complex
- `left-right-fibrations` (cocartesian-fibrations) — 2 missing: cocartesian-fibration, kan-complex
- `complex-numbers` (complex-analysis) — 2 missing: riemann-sphere, mobius-transformations
- `continuity-topology` (point-set-topology) — 2 missing: compactness, connectedness
- `smooth-manifold-definition` (smooth-manifolds) — 2 missing: countability, partition-of-unity
- `upper-half-plane-model` (upper-half-plane-hyperbolic) — 2 missing: mobius-transformations, holomorphic-function
- `q-expansions-mf` (modular-forms) — 2 missing: petersson-inner-product, modularity-theorem
- `zeta-functional-equation` (analytic-continuation) — 2 missing: analytic-continuation, poisson-summation
- `arithmetic-data-lfunctions` (L-functions) — 2 missing: modularity-theorem, analytic-continuation
- `analytic-continuation-lfunc` (L-functions) — 2 missing: analytic-continuation, modularity-theorem
- `presheaf-functor` (sheaves) — 2 missing: holomorphic-function, limits-colimits

## Top 20 dangling proper-noun phrases (by topic count)

- "Mac Lane" — in **4** topics
- "The Euler" — in **4** topics
- "The Lie" — in **3** topics
- "The Fourier" — in **3** topics
- "The  Euler" — in **3** topics
- "If ZFC" — in **2** topics
- "By Yoneda" — in **2** topics
- "The Yoneda" — in **2** topics
- "The Grothendieck" — in **2** topics
- "So Grothendieck" — in **2** topics
- "Lurie HTT" — in **2** topics
- "Every Riemann" — in **2** topics
- "The Riesz" — in **2** topics
- "By Fourier" — in **2** topics
- "The Gaussian" — in **2** topics
- "The  Lie" — in **2** topics
- "The Legendre" — in **2** topics
- "The Bernoulli" — in **2** topics
- "Hecke Gr" — in **2** topics
- "Its Fourier" — in **2** topics

## Top 10 atomicity-split candidates

- `cx-space-complexity` (complexity-theory) — 6 sentences, 679 chars
- `cx-hierarchy-theorems` (complexity-theory) — 5 sentences, 633 chars
- `cx-np-completeness` (complexity-theory) — 5 sentences, 601 chars
- `cx-reductions` (complexity-theory) — 4 sentences, 581 chars
- `cx-p-and-np` (complexity-theory) — 5 sentences, 566 chars
- `comp-recursive-functions` (computability-and-decidability) — 3 sentences, 545 chars
- `comp-godel-incompleteness` (computability-and-decidability) — 4 sentences, 538 chars
- `comp-turing-machines` (computability-and-decidability) — 4 sentences, 509 chars
- `cx-time-complexity` (complexity-theory) — 5 sentences, 498 chars
- `mt-isomorphism-vs-equivalence` (model-theory-basics) — 3 sentences, 486 chars

## Per-topic scorecard

Compact roll-up of the rows above. Bucket: 🟢 healthy (no implicit flags, ≤1 dead-end), 🟡 minor, 🔴 attention. Summary: 24 🟢 · 66 🟡 · 15 🔴.

| topic | concepts | dead-ends | orphans | implicit | multi-topic | bucket |
|---|---:|---:|---:|---:|---:|:---:|
| `category-theory` | 12 | 3 | 0 | 5 | 1 | 🔴 |
| `commutative-algebra` | 13 | 4 | 0 | 1 | 0 | 🔴 |
| `complex-analysis` | 26 | 3 | 0 | 7 | 4 | 🔴 |
| `dynamical-systems` | 13 | 5 | 0 | 1 | 0 | 🔴 |
| `functional-analysis` | 12 | 4 | 0 | 3 | 1 | 🔴 |
| `group-schemes` | 6 | 4 | 0 | 1 | 0 | 🔴 |
| `homological` | 12 | 1 | 0 | 5 | 1 | 🔴 |
| `infinity-topoi` | 7 | 5 | 0 | 2 | 0 | 🔴 |
| `L-functions` | 5 | 2 | 0 | 5 | 0 | 🔴 |
| `measure-theory` | 12 | 4 | 0 | 4 | 0 | 🔴 |
| `operator-algebras` | 12 | 4 | 0 | 6 | 0 | 🔴 |
| `probabilistic-method` | 7 | 5 | 0 | 1 | 0 | 🔴 |
| `real-analysis` | 14 | 5 | 0 | 6 | 1 | 🔴 |
| `representation-theory` | 13 | 7 | 0 | 2 | 0 | 🔴 |
| `sheaves` | 7 | 0 | 0 | 5 | 0 | 🔴 |
| `algebra` | 12 | 2 | 0 | 2 | 0 | 🟡 |
| `algebraic-curves-higher-genus` | 6 | 3 | 0 | 0 | 0 | 🟡 |
| `algebraic-de-rham-cohomology` | 6 | 3 | 0 | 2 | 0 | 🟡 |
| `algebraic-spaces` | 6 | 3 | 0 | 1 | 0 | 🟡 |
| `analytic-continuation` | 5 | 3 | 0 | 4 | 0 | 🟡 |
| `automorphic-forms-adelic` | 7 | 2 | 0 | 0 | 0 | 🟡 |
| `bezout` | 5 | 2 | 0 | 1 | 0 | 🟡 |
| `bsd` | 5 | 2 | 0 | 0 | 0 | 🟡 |
| `class-field-theory` | 6 | 2 | 0 | 2 | 0 | 🟡 |
| `cocartesian-fibrations` | 7 | 2 | 0 | 3 | 0 | 🟡 |
| `complexity-theory` | 6 | 2 | 0 | 0 | 0 | 🟡 |
| `computability-and-decidability` | 6 | 3 | 0 | 1 | 0 | 🟡 |
| `deformation-theory` | 6 | 3 | 0 | 2 | 0 | 🟡 |
| `derived-categories` | 7 | 2 | 0 | 1 | 0 | 🟡 |
| `differential-forms` | 5 | 0 | 0 | 1 | 0 | 🟡 |
| `dirichlet-series-euler-products` | 5 | 1 | 0 | 1 | 0 | 🟡 |
| `elementary-topos-theory` | 7 | 2 | 0 | 3 | 1 | 🟡 |
| `elliptic-curves` | 5 | 1 | 0 | 1 | 0 | 🟡 |
| `etale-cohomology` | 5 | 2 | 0 | 4 | 0 | 🟡 |
| `etale-fundamental-group` | 6 | 2 | 0 | 4 | 0 | 🟡 |
| `extremal-combinatorics` | 6 | 3 | 0 | 0 | 0 | 🟡 |
| `first-order-logic-and-completeness` | 7 | 2 | 0 | 1 | 0 | 🟡 |
| `forcing-and-independence` | 6 | 1 | 0 | 1 | 0 | 🟡 |
| `functor-of-points` | 5 | 2 | 0 | 0 | 0 | 🟡 |
| `galois` | 8 | 2 | 0 | 3 | 0 | 🟡 |
| `galois-representations` | 5 | 2 | 0 | 1 | 0 | 🟡 |
| `grothendieck-topologies-sites` | 6 | 1 | 0 | 4 | 0 | 🟡 |
| `group-cohomology` | 7 | 3 | 0 | 1 | 0 | 🟡 |
| `harmonic-analysis-fourier` | 8 | 3 | 0 | 4 | 1 | 🟡 |
| `hecke-operators` | 5 | 1 | 0 | 1 | 0 | 🟡 |
| `heights-arithmetic-geometry` | 7 | 3 | 0 | 0 | 0 | 🟡 |
| `heyting-algebras-toposes` | 6 | 2 | 0 | 1 | 0 | 🟡 |
| `infinity-categories` | 6 | 2 | 0 | 4 | 0 | 🟡 |
| `intersection-theory-chow` | 6 | 2 | 0 | 2 | 0 | 🟡 |
| `lie-groups` | 7 | 1 | 0 | 1 | 0 | 🟡 |
| `matroid-theory` | 7 | 3 | 0 | 2 | 0 | 🟡 |
| `model-theory-basics` | 6 | 3 | 0 | 2 | 0 | 🟡 |
| `modular-forms` | 6 | 0 | 0 | 3 | 0 | 🟡 |
| `modularity-and-flt` | 5 | 2 | 0 | 2 | 1 | 🟡 |
| `moduli-spaces` | 5 | 2 | 0 | 2 | 0 | 🟡 |
| `morphisms-fiber-products` | 5 | 2 | 0 | 2 | 1 | 🟡 |
| `naive-set-theory` | 5 | 1 | 0 | 2 | 1 | 🟡 |
| `p-adic-numbers` | 5 | 2 | 0 | 0 | 0 | 🟡 |
| `partitions-generating-functions` | 5 | 1 | 0 | 1 | 0 | 🟡 |
| `point-set-topology` | 6 | 2 | 0 | 3 | 3 | 🟡 |
| `probability-theory` | 12 | 3 | 0 | 1 | 0 | 🟡 |
| `projective-plane` | 5 | 2 | 0 | 0 | 0 | 🟡 |
| `quadratic-forms-genus-theory` | 5 | 1 | 0 | 3 | 0 | 🟡 |
| `quadratic-reciprocity` | 6 | 1 | 0 | 3 | 1 | 🟡 |
| `random-walks-and-mixing` | 6 | 2 | 0 | 4 | 0 | 🟡 |
| `riemann-surfaces` | 5 | 1 | 0 | 1 | 0 | 🟡 |
| `riemannian-geometry` | 5 | 2 | 0 | 1 | 0 | 🟡 |
| `sato-tate` | 5 | 2 | 0 | 1 | 0 | 🟡 |
| `schemes` | 10 | 3 | 0 | 1 | 1 | 🟡 |
| `sheaf-cohomology` | 5 | 2 | 0 | 3 | 0 | 🟡 |
| `simplicial-complexes-combinatorial` | 6 | 3 | 0 | 2 | 0 | 🟡 |
| `simplicial-sets-and-nerve` | 6 | 1 | 0 | 4 | 1 | 🟡 |
| `singular-cubics-reduction` | 5 | 3 | 0 | 1 | 0 | 🟡 |
| `smooth-manifolds` | 10 | 3 | 0 | 4 | 2 | 🟡 |
| `sobolev-spaces-distributions` | 7 | 3 | 0 | 0 | 0 | 🟡 |
| `spectral-graph-theory` | 7 | 2 | 0 | 1 | 0 | 🟡 |
| `sums-of-squares` | 5 | 1 | 0 | 2 | 0 | 🟡 |
| `upper-half-plane-hyperbolic` | 5 | 1 | 0 | 3 | 0 | 🟡 |
| `waring` | 5 | 2 | 0 | 0 | 0 | 🟡 |
| `zeta-values` | 5 | 2 | 0 | 1 | 0 | 🟡 |
| `zfc-and-ordinals` | 7 | 2 | 0 | 3 | 0 | 🟡 |
| `adeles-and-ideles` | 5 | 1 | 0 | 0 | 0 | 🟢 |
| `algebraic-number-theory` | 5 | 0 | 0 | 0 | 0 | 🟢 |
| `algebraic-topology` | 6 | 1 | 0 | 0 | 1 | 🟢 |
| `analytic-number-theory` | 1 | 1 | 1 | 0 | 0 | 🟢 |
| `characteristic-classes` | 1 | 1 | 1 | 0 | 0 | 🟢 |
| `differential-geometry` | 5 | 1 | 0 | 0 | 0 | 🟢 |
| `enumerative-combinatorics` | 1 | 1 | 1 | 0 | 0 | 🟢 |
| `frobenius-and-reciprocity` | 5 | 1 | 0 | 0 | 0 | 🟢 |
| `galois-cohomology-and-brauer` | 1 | 1 | 1 | 0 | 0 | 🟢 |
| `harmonic-functions` | 1 | 1 | 1 | 0 | 0 | 🟢 |
| `information-theory` | 1 | 1 | 1 | 0 | 0 | 🟢 |
| `large-deviations` | 1 | 1 | 1 | 0 | 0 | 🟢 |
| `lie-algebras` | 1 | 1 | 1 | 0 | 0 | 🟢 |
| `modular-curves` | 1 | 1 | 1 | 0 | 0 | 🟢 |
| `moonshine` | 5 | 1 | 0 | 0 | 0 | 🟢 |
| `morse-theory` | 1 | 1 | 1 | 0 | 0 | 🟢 |
| `partial-differential-equations` | 1 | 1 | 1 | 0 | 0 | 🟢 |
| `power-sums-bernoulli` | 5 | 1 | 0 | 0 | 0 | 🟢 |
| `spectral-theory` | 1 | 1 | 1 | 0 | 0 | 🟢 |
| `stacks` | 5 | 0 | 0 | 0 | 0 | 🟢 |
| `stochastic-calculus` | 1 | 1 | 1 | 0 | 0 | 🟢 |
| `stochastic-processes-and-martingales` | 1 | 1 | 1 | 0 | 0 | 🟢 |
| `theta-functions` | 5 | 0 | 0 | 0 | 0 | 🟢 |
| `type-theory-and-hott` | 6 | 1 | 0 | 0 | 0 | 🟢 |
