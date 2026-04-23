# Concept graph health — summary

- Total concepts: **407**
- Total prereq edges: **613**
- Implicit prereq candidates (total across all concepts): **129**
- Multi-topic candidates (title appears in prose of ≥ 3 other topics): **10**
- Atomicity-split candidates (blurb ≥ 3 sentences AND > 200 chars): **1**
- Dangling proper-noun phrases (in ≥ 2 topics, no matching concept): **13**
- Orphan concepts (zero edges in or out): **0**

## Decision framework

- All three signals are below their thresholds. Current architecture is adequate; expand by decomposing under-built topics (41 of 58 still at the 5-concept scaffolding default).

## Top 15 multi-topic candidates

- `complex-numbers` (complex-analysis) — title appears in prose of **5** other topics
- `analytic-continuation` (complex-analysis) — title appears in prose of **5** other topics
- `fundamental-group` (algebraic-topology) — title appears in prose of **5** other topics
- `open-sets` (point-set-topology) — title appears in prose of **4** other topics
- `mobius-transformations` (complex-analysis) — title appears in prose of **3** other topics
- `holomorphic-function` (complex-analysis) — title appears in prose of **3** other topics
- `compactness` (point-set-topology) — title appears in prose of **3** other topics
- `legendre-symbol` (quadratic-reciprocity) — title appears in prose of **3** other topics
- `scheme-morphisms` (morphisms-fiber-products) — title appears in prose of **3** other topics
- `modularity-theorem` (modularity-and-flt) — title appears in prose of **3** other topics

## Top 15 implicit-prereq flags

- `harmonic-functions` (complex-analysis) — 4 missing: holomorphic-function, conformal-map, analytic-continuation, contour-integral
- `categories-morphisms` (category-theory) — 3 missing: open-sets, scheme-morphisms, reflexivity
- `analyticity` (complex-analysis) — 3 missing: liouville, fta, schwarz-lemma
- `cstar-basics` (operator-algebras) — 3 missing: spectrum-of-element, positive-elements, gns-construction
- `continuity-topology` (point-set-topology) — 3 missing: metric-spaces, compactness, connectedness
- `abelian-categories` (homological) — 2 missing: snake-lemma, five-lemma
- `riemann-integral` (real-analysis) — 2 missing: lebesgue-measure, real-differentiation
- `convergence-theorems` (measure-theory) — 2 missing: measurable-functions, lebesgue-measure
- `complex-numbers` (complex-analysis) — 2 missing: riemann-sphere, mobius-transformations
- `contour-integral` (complex-analysis) — 2 missing: cauchy-riemann, cauchy-theorem
- `conformal-map` (complex-analysis) — 2 missing: riemann-mapping, mobius-transformations
- `adjoint-hilbert` (functional-analysis) — 2 missing: riesz-representation, complex-numbers
- `compactness` (point-set-topology) — 2 missing: metric-spaces, axiom-of-choice-intuition
- `smooth-manifold-definition` (smooth-manifolds) — 2 missing: countability, partition-of-unity
- `ideals-vs-forms` (quadratic-forms-genus-theory) — 2 missing: form-class-group, hilbert-class-field

## Top 20 dangling proper-noun phrases (by topic count)

- "The Euler" — in **3** topics
- "The Yoneda" — in **2** topics
- "The Lie" — in **2** topics
- "Every Riemann" — in **2** topics
- "The Riesz" — in **2** topics
- "The Fourier" — in **2** topics
- "The Legendre" — in **2** topics
- "The Bernoulli" — in **2** topics
- "Hecke Gr" — in **2** topics
- "The  Euler" — in **2** topics
- "Its Fourier" — in **2** topics
- "Stacks Project" — in **2** topics
- "The Hasse" — in **2** topics

## Top 10 atomicity-split candidates

- `dyn-ergodicity` (dynamical-systems) — 3 sentences, 209 chars

## Per-topic scorecard

Compact roll-up of the rows above. Bucket: 🟢 healthy (no implicit flags, ≤1 dead-end), 🟡 minor, 🔴 attention. Summary: 8 🟢 · 33 🟡 · 17 🔴.

| topic | concepts | dead-ends | orphans | implicit | multi-topic | bucket |
|---|---:|---:|---:|---:|---:|:---:|
| `algebra` | 12 | 4 | 0 | 1 | 0 | 🔴 |
| `category-theory` | 12 | 4 | 0 | 5 | 0 | 🔴 |
| `commutative-algebra` | 12 | 4 | 0 | 1 | 0 | 🔴 |
| `complex-analysis` | 26 | 5 | 0 | 16 | 4 | 🔴 |
| `dynamical-systems` | 12 | 4 | 0 | 1 | 0 | 🔴 |
| `functional-analysis` | 12 | 5 | 0 | 4 | 0 | 🔴 |
| `homological` | 12 | 4 | 0 | 5 | 0 | 🔴 |
| `L-functions` | 5 | 2 | 0 | 5 | 0 | 🔴 |
| `measure-theory` | 12 | 4 | 0 | 6 | 0 | 🔴 |
| `operator-algebras` | 12 | 4 | 0 | 6 | 0 | 🔴 |
| `point-set-topology` | 6 | 2 | 0 | 5 | 2 | 🔴 |
| `probability-theory` | 12 | 4 | 0 | 0 | 0 | 🔴 |
| `real-analysis` | 14 | 6 | 0 | 7 | 0 | 🔴 |
| `representation-theory` | 13 | 7 | 0 | 2 | 0 | 🔴 |
| `schemes` | 10 | 6 | 0 | 1 | 0 | 🔴 |
| `sheaves` | 7 | 1 | 0 | 6 | 0 | 🔴 |
| `smooth-manifolds` | 10 | 4 | 0 | 4 | 0 | 🔴 |
| `adeles-and-ideles` | 5 | 2 | 0 | 0 | 0 | 🟡 |
| `analytic-continuation` | 5 | 3 | 0 | 4 | 0 | 🟡 |
| `bezout` | 5 | 2 | 0 | 1 | 0 | 🟡 |
| `bsd` | 5 | 2 | 0 | 0 | 0 | 🟡 |
| `class-field-theory` | 6 | 3 | 0 | 3 | 0 | 🟡 |
| `differential-forms` | 5 | 0 | 0 | 1 | 0 | 🟡 |
| `dirichlet-series-euler-products` | 5 | 1 | 0 | 1 | 0 | 🟡 |
| `elliptic-curves` | 5 | 1 | 0 | 3 | 0 | 🟡 |
| `etale-cohomology` | 5 | 2 | 0 | 3 | 0 | 🟡 |
| `functor-of-points` | 5 | 2 | 0 | 2 | 0 | 🟡 |
| `galois` | 5 | 2 | 0 | 1 | 0 | 🟡 |
| `galois-representations` | 5 | 2 | 0 | 1 | 0 | 🟡 |
| `hecke-operators` | 5 | 1 | 0 | 1 | 0 | 🟡 |
| `lie-groups` | 7 | 1 | 0 | 1 | 0 | 🟡 |
| `modular-forms` | 5 | 0 | 0 | 3 | 0 | 🟡 |
| `modularity-and-flt` | 5 | 2 | 0 | 2 | 1 | 🟡 |
| `moduli-spaces` | 5 | 2 | 0 | 1 | 0 | 🟡 |
| `morphisms-fiber-products` | 5 | 2 | 0 | 2 | 1 | 🟡 |
| `naive-set-theory` | 5 | 1 | 0 | 2 | 0 | 🟡 |
| `p-adic-numbers` | 5 | 2 | 0 | 0 | 0 | 🟡 |
| `partitions-generating-functions` | 5 | 1 | 0 | 1 | 0 | 🟡 |
| `projective-plane` | 5 | 2 | 0 | 0 | 0 | 🟡 |
| `quadratic-forms-genus-theory` | 5 | 1 | 0 | 4 | 0 | 🟡 |
| `quadratic-reciprocity` | 5 | 1 | 0 | 2 | 1 | 🟡 |
| `riemann-surfaces` | 5 | 1 | 0 | 1 | 0 | 🟡 |
| `riemannian-geometry` | 5 | 2 | 0 | 1 | 0 | 🟡 |
| `sato-tate` | 5 | 2 | 0 | 2 | 0 | 🟡 |
| `sheaf-cohomology` | 5 | 3 | 0 | 3 | 0 | 🟡 |
| `singular-cubics-reduction` | 5 | 3 | 0 | 1 | 0 | 🟡 |
| `sums-of-squares` | 5 | 1 | 0 | 3 | 0 | 🟡 |
| `upper-half-plane-hyperbolic` | 5 | 1 | 0 | 3 | 0 | 🟡 |
| `waring` | 5 | 2 | 0 | 0 | 0 | 🟡 |
| `zeta-values` | 5 | 2 | 0 | 1 | 0 | 🟡 |
| `algebraic-number-theory` | 5 | 0 | 0 | 0 | 0 | 🟢 |
| `algebraic-topology` | 5 | 0 | 0 | 0 | 1 | 🟢 |
| `differential-geometry` | 5 | 1 | 0 | 0 | 0 | 🟢 |
| `frobenius-and-reciprocity` | 5 | 1 | 0 | 0 | 0 | 🟢 |
| `moonshine` | 5 | 1 | 0 | 0 | 0 | 🟢 |
| `power-sums-bernoulli` | 5 | 1 | 0 | 0 | 0 | 🟢 |
| `stacks` | 5 | 1 | 0 | 0 | 0 | 🟢 |
| `theta-functions` | 5 | 0 | 0 | 0 | 0 | 🟢 |
