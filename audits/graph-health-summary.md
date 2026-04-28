# Concept graph health — summary

- Total concepts: **873**
- Total prereq edges: **1528**
- Implicit prereq candidates (total across all concepts): **284**
- Multi-topic candidates (title appears in prose of ≥ 3 other topics): **35**
- Atomicity-split candidates (blurb ≥ 3 sentences AND > 200 chars): **130**
- Dangling proper-noun phrases (in ≥ 2 topics, no matching concept): **37**
- Orphan concepts (zero edges in or out): **0**

## Decision framework

- ✅ **implicit_prereqs ≥ 200** (284): edge enrichment first. The existing graph has too many missing dependencies to benefit from restructuring.

## Top 15 multi-topic candidates

- `compactness` (point-set-topology) — title appears in prose of **14** other topics
- `w-applications` (wavelets) — title appears in prose of **11** other topics
- `hdg-applications` (high-dimensional-geometry) — title appears in prose of **10** other topics
- `e-applications` (expanders) — title appears in prose of **10** other topics
- `open-sets` (point-set-topology) — title appears in prose of **10** other topics
- `fundamental-group` (algebraic-topology) — title appears in prose of **9** other topics
- `cc-vector-bundles` (characteristic-classes) — title appears in prose of **9** other topics
- `analytic-continuation` (complex-analysis) — title appears in prose of **7** other topics
- `holomorphic-function` (complex-analysis) — title appears in prose of **6** other topics
- `exact-sequences` (homological) — title appears in prose of **5** other topics
- `complex-numbers` (complex-analysis) — title appears in prose of **5** other topics
- `connectedness` (point-set-topology) — title appears in prose of **5** other topics
- `k-chern-character` (k-theory) — title appears in prose of **4** other topics
- `limits-colimits` (category-theory) — title appears in prose of **4** other topics
- `kan-complex` (simplicial-sets-and-nerve) — title appears in prose of **4** other topics

## Top 15 implicit-prereq flags

- `categories-morphisms` (category-theory) — 3 missing: open-sets, scheme-morphisms, reflexivity
- `geometric-morphisms-of-sites` (grothendieck-topologies-sites) — 3 missing: open-sets, sieves, fundamental-group
- `cstar-basics` (operator-algebras) — 3 missing: spectrum-of-element, positive-elements, gns-construction
- `chern-classes` (intersection-theory-chow) — 3 missing: cc-vector-bundles, k-chern-character, cc-euler-class
- `vm-direct-method` (variational-methods) — 2 missing: compactness, reflexivity
- `cy-hodge-numbers` (calabi-yau-manifolds) — 2 missing: connectedness, compactness
- `mr-statement` (mostow-rigidity) — 2 missing: hyperbolic-metric, conformal-map
- `hcm-phase-space` (hamiltonians-classical-mechanics) — 2 missing: exterior-derivative, liouville
- `sm-hamiltonian-flow` (symplectic-manifolds) — 2 missing: hcm-hamilton-equations, liouville
- `kp-jones-polynomial` (knot-polynomials) — 2 missing: open-sets, singular-homology
- `k-applications` (k-theory) — 2 missing: hdg-applications, cc-vector-bundles
- `yoneda-limits-adjunctions` (category-theory) — 2 missing: fundamental-group, yoneda-lemma
- `abelian-categories` (homological) — 2 missing: snake-lemma, five-lemma
- `infty-adjunctions` (infinity-categories) — 2 missing: quasi-category, kan-complex
- `left-right-fibrations` (cocartesian-fibrations) — 2 missing: cocartesian-fibration, kan-complex

## Top 20 dangling proper-noun phrases (by topic count)

- "Interactive Mathematics Notebook" — in **13** topics
- "The Euler" — in **8** topics
- "The Lie" — in **4** topics
- "The Fourier" — in **4** topics
- "Mac Lane" — in **4** topics
- "The CLT" — in **3** topics
- "The Gaussian" — in **3** topics
- "The Cayley" — in **3** topics
- "The Legendre" — in **3** topics
- "The  Euler" — in **3** topics
- "Fields Medal" — in **2** topics
- "The Bianchi" — in **2** topics
- "Type IIA" — in **2** topics
- "The Hodge" — in **2** topics
- "For Riemannian" — in **2** topics
- "By Cartan" — in **2** topics
- "The Poisson" — in **2** topics
- "The Haar" — in **2** topics
- "The Jacobi" — in **2** topics
- "Monster Lie" — in **2** topics

## Top 10 atomicity-split candidates

- `cx-space-complexity` (complexity-theory) — 6 sentences, 679 chars
- `crypto-lattice-based` (mathematics-and-cryptography) — 5 sentences, 668 chars
- `crypto-elliptic-curve` (mathematics-and-cryptography) — 6 sentences, 646 chars
- `crypto-zero-knowledge` (mathematics-and-cryptography) — 3 sentences, 644 chars
- `cx-hierarchy-theorems` (complexity-theory) — 5 sentences, 633 chars
- `cx-np-completeness` (complexity-theory) — 5 sentences, 601 chars
- `cx-reductions` (complexity-theory) — 4 sentences, 581 chars
- `cx-p-and-np` (complexity-theory) — 5 sentences, 566 chars
- `comp-recursive-functions` (computability-and-decidability) — 3 sentences, 545 chars
- `comp-godel-incompleteness` (computability-and-decidability) — 4 sentences, 538 chars

## Per-topic scorecard

Compact roll-up of the rows above. Bucket: 🟢 healthy (no implicit flags, ≤1 dead-end), 🟡 minor, 🔴 attention. Summary: 8 🟢 · 93 🟡 · 29 🔴.

| topic | concepts | dead-ends | orphans | implicit | multi-topic | bucket |
|---|---:|---:|---:|---:|---:|:---:|
| `additive-number-theory` | 15 | 4 | 0 | 2 | 0 | 🔴 |
| `atiyah-singer-index-theorem` | 6 | 3 | 0 | 5 | 0 | 🔴 |
| `calabi-yau-manifolds` | 6 | 2 | 0 | 5 | 0 | 🔴 |
| `category-theory` | 12 | 3 | 0 | 7 | 1 | 🔴 |
| `commutative-algebra` | 13 | 4 | 0 | 2 | 0 | 🔴 |
| `complex-analysis` | 26 | 3 | 0 | 8 | 5 | 🔴 |
| `dynamical-systems` | 13 | 4 | 0 | 2 | 0 | 🔴 |
| `etale-cohomology` | 5 | 2 | 0 | 5 | 0 | 🔴 |
| `group-schemes` | 6 | 4 | 0 | 3 | 0 | 🔴 |
| `hamiltonians-classical-mechanics` | 6 | 1 | 0 | 6 | 0 | 🔴 |
| `harmonic-functions` | 6 | 2 | 0 | 7 | 0 | 🔴 |
| `homological` | 12 | 1 | 0 | 5 | 1 | 🔴 |
| `infinity-categories` | 6 | 2 | 0 | 5 | 0 | 🔴 |
| `infinity-topoi` | 7 | 5 | 0 | 2 | 0 | 🔴 |
| `intersection-theory-chow` | 6 | 2 | 0 | 6 | 0 | 🔴 |
| `L-functions` | 5 | 2 | 0 | 5 | 0 | 🔴 |
| `large-deviations` | 5 | 1 | 0 | 7 | 0 | 🔴 |
| `mathematical-statistics` | 6 | 4 | 0 | 1 | 0 | 🔴 |
| `measure-theory` | 12 | 4 | 0 | 4 | 1 | 🔴 |
| `mirror-symmetry` | 6 | 4 | 0 | 1 | 0 | 🔴 |
| `operator-algebras` | 12 | 4 | 0 | 7 | 0 | 🔴 |
| `probabilistic-method` | 7 | 5 | 0 | 2 | 0 | 🔴 |
| `probability-theory` | 12 | 1 | 0 | 5 | 2 | 🔴 |
| `real-analysis` | 14 | 5 | 0 | 6 | 1 | 🔴 |
| `representation-theory` | 13 | 6 | 0 | 2 | 0 | 🔴 |
| `schrodinger-equation` | 6 | 4 | 0 | 1 | 0 | 🔴 |
| `sheaf-cohomology` | 5 | 2 | 0 | 5 | 0 | 🔴 |
| `sheaves` | 7 | 0 | 0 | 6 | 0 | 🔴 |
| `stochastic-calculus` | 6 | 1 | 0 | 5 | 0 | 🔴 |
| `algebra` | 12 | 2 | 0 | 2 | 0 | 🟡 |
| `algebraic-curves-higher-genus` | 6 | 3 | 0 | 0 | 0 | 🟡 |
| `algebraic-de-rham-cohomology` | 6 | 2 | 0 | 3 | 0 | 🟡 |
| `algebraic-spaces` | 6 | 3 | 0 | 2 | 0 | 🟡 |
| `analytic-continuation` | 5 | 3 | 0 | 4 | 0 | 🟡 |
| `analytic-number-theory` | 6 | 3 | 0 | 2 | 0 | 🟡 |
| `automorphic-forms-adelic` | 7 | 2 | 0 | 0 | 0 | 🟡 |
| `bezout` | 5 | 1 | 0 | 1 | 0 | 🟡 |
| `bsd` | 5 | 2 | 0 | 0 | 0 | 🟡 |
| `characteristic-classes` | 6 | 1 | 0 | 2 | 1 | 🟡 |
| `class-field-theory` | 6 | 2 | 0 | 2 | 0 | 🟡 |
| `cocartesian-fibrations` | 7 | 2 | 0 | 4 | 0 | 🟡 |
| `complexity-theory` | 6 | 2 | 0 | 0 | 0 | 🟡 |
| `computability-and-decidability` | 6 | 3 | 0 | 1 | 0 | 🟡 |
| `computational-number-theory` | 6 | 3 | 0 | 0 | 0 | 🟡 |
| `deformation-theory` | 6 | 3 | 0 | 2 | 0 | 🟡 |
| `derived-categories` | 7 | 1 | 0 | 1 | 0 | 🟡 |
| `designs` | 6 | 3 | 0 | 1 | 0 | 🟡 |
| `differential-forms` | 5 | 0 | 0 | 1 | 0 | 🟡 |
| `differential-geometry` | 5 | 1 | 0 | 1 | 0 | 🟡 |
| `dirichlet-series-euler-products` | 5 | 0 | 0 | 1 | 0 | 🟡 |
| `elementary-topos-theory` | 7 | 2 | 0 | 3 | 1 | 🟡 |
| `elliptic-curves` | 5 | 1 | 0 | 1 | 0 | 🟡 |
| `enumerative-combinatorics` | 6 | 2 | 0 | 0 | 0 | 🟡 |
| `etale-fundamental-group` | 6 | 2 | 0 | 4 | 0 | 🟡 |
| `expanders` | 6 | 3 | 0 | 1 | 1 | 🟡 |
| `extremal-combinatorics` | 6 | 3 | 0 | 0 | 0 | 🟡 |
| `first-order-logic-and-completeness` | 7 | 2 | 0 | 3 | 0 | 🟡 |
| `fixed-point-theorems` | 6 | 3 | 0 | 1 | 0 | 🟡 |
| `forcing-and-independence` | 6 | 1 | 0 | 1 | 0 | 🟡 |
| `functional-analysis` | 12 | 2 | 0 | 4 | 2 | 🟡 |
| `functor-of-points` | 5 | 2 | 0 | 1 | 0 | 🟡 |
| `galois` | 8 | 2 | 0 | 3 | 0 | 🟡 |
| `galois-representations` | 5 | 2 | 0 | 1 | 0 | 🟡 |
| `general-relativity` | 6 | 3 | 0 | 0 | 0 | 🟡 |
| `geometric-and-combinatorial-group-theory` | 6 | 1 | 0 | 1 | 0 | 🟡 |
| `grothendieck-topologies-sites` | 6 | 1 | 0 | 4 | 0 | 🟡 |
| `group-cohomology` | 7 | 3 | 0 | 1 | 0 | 🟡 |
| `harmonic-analysis-fourier` | 8 | 3 | 0 | 4 | 1 | 🟡 |
| `hecke-operators` | 5 | 1 | 0 | 1 | 0 | 🟡 |
| `heights-arithmetic-geometry` | 7 | 3 | 0 | 0 | 0 | 🟡 |
| `heyting-algebras-toposes` | 6 | 2 | 0 | 1 | 0 | 🟡 |
| `high-dimensional-geometry` | 6 | 3 | 0 | 2 | 1 | 🟡 |
| `information-theory` | 6 | 2 | 0 | 0 | 0 | 🟡 |
| `k-theory` | 6 | 0 | 0 | 4 | 1 | 🟡 |
| `knot-polynomials` | 6 | 2 | 0 | 4 | 0 | 🟡 |
| `lie-algebras` | 6 | 1 | 0 | 1 | 0 | 🟡 |
| `lie-groups` | 7 | 1 | 0 | 1 | 0 | 🟡 |
| `mathematics-and-cryptography` | 6 | 2 | 0 | 0 | 0 | 🟡 |
| `matroid-theory` | 7 | 3 | 0 | 2 | 0 | 🟡 |
| `model-theory-basics` | 6 | 3 | 0 | 2 | 0 | 🟡 |
| `modular-curves` | 6 | 3 | 0 | 1 | 0 | 🟡 |
| `modular-forms` | 6 | 0 | 0 | 3 | 1 | 🟡 |
| `modularity-and-flt` | 5 | 2 | 0 | 2 | 1 | 🟡 |
| `moduli-spaces` | 5 | 2 | 0 | 2 | 0 | 🟡 |
| `morphisms-fiber-products` | 5 | 0 | 0 | 2 | 1 | 🟡 |
| `morse-theory` | 6 | 1 | 0 | 3 | 0 | 🟡 |
| `mostow-rigidity` | 6 | 2 | 0 | 3 | 0 | 🟡 |
| `naive-set-theory` | 5 | 1 | 0 | 2 | 1 | 🟡 |
| `numerical-analysis` | 6 | 3 | 0 | 0 | 0 | 🟡 |
| `p-adic-numbers` | 5 | 2 | 0 | 0 | 0 | 🟡 |
| `partial-differential-equations` | 6 | 0 | 0 | 1 | 0 | 🟡 |
| `partitions-generating-functions` | 5 | 1 | 0 | 1 | 0 | 🟡 |
| `point-set-topology` | 6 | 1 | 0 | 3 | 3 | 🟡 |
| `projective-plane` | 5 | 2 | 0 | 0 | 0 | 🟡 |
| `quadratic-forms-genus-theory` | 5 | 1 | 0 | 3 | 0 | 🟡 |
| `quadratic-reciprocity` | 6 | 1 | 0 | 4 | 1 | 🟡 |
| `quantum-groups` | 6 | 1 | 0 | 2 | 0 | 🟡 |
| `quaternions-octonions-and-division-algebras` | 6 | 2 | 0 | 0 | 0 | 🟡 |
| `random-walks-and-mixing` | 6 | 2 | 0 | 4 | 0 | 🟡 |
| `resolution-of-singularities` | 6 | 2 | 0 | 1 | 0 | 🟡 |
| `ricci-flow` | 6 | 1 | 0 | 1 | 0 | 🟡 |
| `riemann-surfaces` | 5 | 1 | 0 | 1 | 0 | 🟡 |
| `riemannian-geometry` | 5 | 1 | 0 | 1 | 0 | 🟡 |
| `sato-tate` | 5 | 2 | 0 | 1 | 0 | 🟡 |
| `schemes` | 10 | 3 | 0 | 1 | 1 | 🟡 |
| `simplicial-complexes-combinatorial` | 6 | 3 | 0 | 2 | 0 | 🟡 |
| `simplicial-sets-and-nerve` | 6 | 1 | 0 | 4 | 1 | 🟡 |
| `singular-cubics-reduction` | 5 | 3 | 0 | 1 | 0 | 🟡 |
| `smooth-manifolds` | 10 | 3 | 0 | 4 | 2 | 🟡 |
| `sobolev-spaces-distributions` | 7 | 3 | 0 | 0 | 0 | 🟡 |
| `spectral-graph-theory` | 7 | 1 | 0 | 2 | 0 | 🟡 |
| `spectral-theory` | 6 | 1 | 0 | 1 | 0 | 🟡 |
| `stacks` | 5 | 0 | 0 | 1 | 0 | 🟡 |
| `stochastic-processes-and-martingales` | 6 | 1 | 0 | 3 | 0 | 🟡 |
| `symplectic-manifolds` | 6 | 2 | 0 | 3 | 1 | 🟡 |
| `three-body-problem` | 6 | 2 | 0 | 1 | 0 | 🟡 |
| `upper-half-plane-hyperbolic` | 5 | 1 | 0 | 3 | 0 | 🟡 |
| `variational-methods` | 6 | 3 | 0 | 3 | 0 | 🟡 |
| `vertex-operator-algebras` | 6 | 2 | 0 | 1 | 0 | 🟡 |
| `wavelets` | 6 | 1 | 0 | 1 | 1 | 🟡 |
| `zeta-values` | 5 | 2 | 0 | 1 | 0 | 🟡 |
| `zfc-and-ordinals` | 7 | 2 | 0 | 3 | 0 | 🟡 |
| `adeles-and-ideles` | 5 | 1 | 0 | 0 | 0 | 🟢 |
| `algebraic-number-theory` | 5 | 0 | 0 | 0 | 0 | 🟢 |
| `algebraic-topology` | 6 | 1 | 0 | 0 | 2 | 🟢 |
| `frobenius-and-reciprocity` | 5 | 1 | 0 | 0 | 0 | 🟢 |
| `galois-cohomology-and-brauer` | 6 | 1 | 0 | 0 | 0 | 🟢 |
| `moonshine` | 5 | 0 | 0 | 0 | 0 | 🟢 |
| `theta-functions` | 5 | 0 | 0 | 0 | 0 | 🟢 |
| `type-theory-and-hott` | 6 | 1 | 0 | 0 | 0 | 🟢 |
