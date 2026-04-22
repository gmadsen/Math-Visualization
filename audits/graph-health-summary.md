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
