# Concept graph health — summary

- Total concepts: **928**
- Total prereq edges: **1659**
- Implicit prereq candidates (total across all concepts): **328**
- Multi-topic candidates (title appears in prose of ≥ 3 other topics): **37**
- Atomicity-split candidates (blurb ≥ 3 sentences AND > 200 chars): **145**
- Dangling proper-noun phrases (in ≥ 2 topics, no matching concept): **42**
- Orphan concepts (zero edges in or out): **1**

## Decision framework

- ✅ **implicit_prereqs ≥ 200** (328): edge enrichment first. The existing graph has too many missing dependencies to benefit from restructuring.

## Top 15 multi-topic candidates

- `compactness` (point-set-topology) — title appears in prose of **15** other topics
- `w-applications` (wavelets) — title appears in prose of **12** other topics
- `hdg-applications` (high-dimensional-geometry) — title appears in prose of **11** other topics
- `e-applications` (expanders) — title appears in prose of **11** other topics
- `open-sets` (point-set-topology) — title appears in prose of **10** other topics
- `fundamental-group` (algebraic-topology) — title appears in prose of **10** other topics
- `cc-vector-bundles` (characteristic-classes) — title appears in prose of **9** other topics
- `analytic-continuation` (complex-analysis) — title appears in prose of **8** other topics
- `holomorphic-function` (complex-analysis) — title appears in prose of **7** other topics
- `exact-sequences` (homological) — title appears in prose of **5** other topics
- `complex-numbers` (complex-analysis) — title appears in prose of **5** other topics
- `connectedness` (point-set-topology) — title appears in prose of **5** other topics
- `hcm-applications` (hamiltonians-classical-mechanics) — title appears in prose of **4** other topics
- `k-chern-character` (k-theory) — title appears in prose of **4** other topics
- `limits-colimits` (category-theory) — title appears in prose of **4** other topics

## Top 15 implicit-prereq flags

- `aca-overview` (advanced-complex-analysis) — 3 missing: cauchy-theorem, aca-bloch-theorem, maximum-modulus
- `aca-several-complex-variables` (advanced-complex-analysis) — 3 missing: riemann-mapping, laurent-series, atiyah-singer-statement
- `kp-jones-polynomial` (knot-polynomials) — 3 missing: kp-khovanov-homology, open-sets, singular-homology
- `categories-morphisms` (category-theory) — 3 missing: open-sets, scheme-morphisms, reflexivity
- `geometric-morphisms-of-sites` (grothendieck-topologies-sites) — 3 missing: open-sets, sieves, fundamental-group
- `vitali-covering` (real-analysis) — 3 missing: compactness, real-differentiation, lebesgue-differentiation
- `singularity-classification` (complex-analysis) — 3 missing: hcm-applications, argument-principle, residue-theorem
- `cstar-basics` (operator-algebras) — 3 missing: spectrum-of-element, positive-elements, gns-construction
- `chern-classes` (intersection-theory-chow) — 3 missing: cc-vector-bundles, k-chern-character, cc-euler-class
- `aca-hadamard-three-circles` (advanced-complex-analysis) — 2 missing: holomorphic-function, harmonic-functions
- `aca-hardy-spaces` (advanced-complex-analysis) — 2 missing: holomorphic-function, analytic-continuation
- `aca-bergman-kernel` (advanced-complex-analysis) — 2 missing: holomorphic-function, hyperbolic-metric
- `aca-quasiconformal-beltrami` (advanced-complex-analysis) — 2 missing: riemann-mapping, mr-hyperbolic-3-mflds
- `vm-direct-method` (variational-methods) — 2 missing: compactness, reflexivity
- `fpt-kkm` (fixed-point-theorems) — 2 missing: compactness, singular-homology

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
- `aca-bergman-kernel` (advanced-complex-analysis) — 3 sentences, 670 chars
- `crypto-lattice-based` (mathematics-and-cryptography) — 5 sentences, 668 chars
- `aca-several-complex-variables` (advanced-complex-analysis) — 4 sentences, 663 chars
- `crypto-elliptic-curve` (mathematics-and-cryptography) — 6 sentences, 646 chars
- `crypto-zero-knowledge` (mathematics-and-cryptography) — 3 sentences, 644 chars
- `aca-quasiconformal-beltrami` (advanced-complex-analysis) — 3 sentences, 633 chars
- `cx-hierarchy-theorems` (complexity-theory) — 5 sentences, 633 chars
- `eisenstein-spectral-decomposition` (automorphic-forms-adelic) — 3 sentences, 607 chars
- `cx-np-completeness` (complexity-theory) — 5 sentences, 601 chars

## Per-topic scorecard

Compact roll-up of the rows above. Bucket: 🟢 healthy (no implicit flags, ≤1 dead-end), 🟡 minor, 🔴 attention. Summary: 7 🟢 · 89 🟡 · 35 🔴.

| topic | concepts | dead-ends | orphans | implicit | multi-topic | bucket |
|---|---:|---:|---:|---:|---:|:---:|
| `additive-number-theory` | 15 | 4 | 0 | 2 | 0 | 🔴 |
| `advanced-complex-analysis` | 13 | 7 | 1 | 16 | 0 | 🔴 |
| `atiyah-singer-index-theorem` | 6 | 3 | 0 | 5 | 0 | 🔴 |
| `calabi-yau-manifolds` | 6 | 2 | 0 | 5 | 0 | 🔴 |
| `category-theory` | 12 | 3 | 0 | 7 | 1 | 🔴 |
| `characteristic-classes` | 9 | 3 | 0 | 5 | 1 | 🔴 |
| `commutative-algebra` | 13 | 4 | 0 | 2 | 0 | 🔴 |
| `complex-analysis` | 26 | 3 | 0 | 16 | 5 | 🔴 |
| `dynamical-systems` | 13 | 4 | 0 | 2 | 0 | 🔴 |
| `etale-cohomology` | 5 | 2 | 0 | 5 | 0 | 🔴 |
| `fixed-point-theorems` | 8 | 5 | 0 | 3 | 0 | 🔴 |
| `group-schemes` | 6 | 4 | 0 | 3 | 0 | 🔴 |
| `hamiltonians-classical-mechanics` | 6 | 1 | 0 | 6 | 1 | 🔴 |
| `harmonic-functions` | 6 | 1 | 0 | 7 | 0 | 🔴 |
| `heights-arithmetic-geometry` | 10 | 4 | 0 | 0 | 0 | 🔴 |
| `homological` | 12 | 1 | 0 | 5 | 1 | 🔴 |
| `infinity-categories` | 6 | 2 | 0 | 5 | 0 | 🔴 |
| `infinity-topoi` | 7 | 5 | 0 | 2 | 0 | 🔴 |
| `information-theory` | 8 | 4 | 0 | 3 | 0 | 🔴 |
| `intersection-theory-chow` | 6 | 2 | 0 | 6 | 0 | 🔴 |
| `knot-polynomials` | 8 | 3 | 0 | 6 | 0 | 🔴 |
| `L-functions` | 5 | 1 | 0 | 5 | 0 | 🔴 |
| `large-deviations` | 5 | 1 | 0 | 7 | 0 | 🔴 |
| `measure-theory` | 12 | 4 | 0 | 5 | 1 | 🔴 |
| `mirror-symmetry` | 6 | 4 | 0 | 2 | 0 | 🔴 |
| `modular-curves` | 9 | 4 | 0 | 2 | 0 | 🔴 |
| `operator-algebras` | 12 | 4 | 0 | 7 | 0 | 🔴 |
| `probabilistic-method` | 7 | 5 | 0 | 2 | 0 | 🔴 |
| `probability-theory` | 12 | 1 | 0 | 5 | 2 | 🔴 |
| `real-analysis` | 18 | 5 | 0 | 10 | 1 | 🔴 |
| `representation-theory` | 13 | 6 | 0 | 2 | 0 | 🔴 |
| `schrodinger-equation` | 6 | 4 | 0 | 1 | 0 | 🔴 |
| `sheaf-cohomology` | 5 | 2 | 0 | 5 | 0 | 🔴 |
| `sheaves` | 7 | 0 | 0 | 6 | 0 | 🔴 |
| `stochastic-calculus` | 6 | 1 | 0 | 5 | 0 | 🔴 |
| `algebra` | 16 | 3 | 0 | 2 | 0 | 🟡 |
| `algebraic-curves-higher-genus` | 6 | 3 | 0 | 0 | 0 | 🟡 |
| `algebraic-de-rham-cohomology` | 6 | 2 | 0 | 3 | 0 | 🟡 |
| `algebraic-spaces` | 6 | 3 | 0 | 2 | 0 | 🟡 |
| `analytic-continuation` | 5 | 3 | 0 | 4 | 0 | 🟡 |
| `analytic-number-theory` | 10 | 3 | 0 | 3 | 0 | 🟡 |
| `automorphic-forms-adelic` | 9 | 3 | 0 | 0 | 0 | 🟡 |
| `bezout` | 5 | 1 | 0 | 1 | 0 | 🟡 |
| `bsd` | 5 | 2 | 0 | 0 | 0 | 🟡 |
| `class-field-theory` | 6 | 2 | 0 | 2 | 1 | 🟡 |
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
| `forcing-and-independence` | 6 | 1 | 0 | 1 | 0 | 🟡 |
| `functional-analysis` | 12 | 2 | 0 | 4 | 2 | 🟡 |
| `functor-of-points` | 5 | 2 | 0 | 1 | 0 | 🟡 |
| `galois` | 7 | 2 | 0 | 3 | 0 | 🟡 |
| `galois-representations` | 5 | 2 | 0 | 1 | 0 | 🟡 |
| `general-relativity` | 6 | 3 | 0 | 0 | 0 | 🟡 |
| `geometric-and-combinatorial-group-theory` | 6 | 1 | 0 | 1 | 0 | 🟡 |
| `grothendieck-topologies-sites` | 6 | 1 | 0 | 4 | 0 | 🟡 |
| `group-cohomology` | 7 | 3 | 0 | 1 | 0 | 🟡 |
| `harmonic-analysis-fourier` | 8 | 3 | 0 | 4 | 1 | 🟡 |
| `hecke-operators` | 5 | 1 | 0 | 1 | 0 | 🟡 |
| `heyting-algebras-toposes` | 6 | 2 | 0 | 1 | 0 | 🟡 |
| `high-dimensional-geometry` | 6 | 3 | 0 | 2 | 1 | 🟡 |
| `k-theory` | 6 | 0 | 0 | 4 | 1 | 🟡 |
| `lie-algebras` | 6 | 1 | 0 | 1 | 0 | 🟡 |
| `lie-groups` | 7 | 1 | 0 | 1 | 0 | 🟡 |
| `mathematical-statistics` | 6 | 3 | 0 | 1 | 0 | 🟡 |
| `mathematics-and-cryptography` | 6 | 2 | 0 | 0 | 0 | 🟡 |
| `matroid-theory` | 7 | 3 | 0 | 2 | 0 | 🟡 |
| `model-theory-basics` | 6 | 3 | 0 | 2 | 0 | 🟡 |
| `modular-forms` | 6 | 0 | 0 | 3 | 1 | 🟡 |
| `modularity-and-flt` | 5 | 2 | 0 | 2 | 1 | 🟡 |
| `moduli-spaces` | 5 | 2 | 0 | 2 | 0 | 🟡 |
| `moonshine` | 8 | 3 | 0 | 0 | 0 | 🟡 |
| `morphisms-fiber-products` | 5 | 0 | 0 | 2 | 1 | 🟡 |
| `morse-theory` | 8 | 3 | 0 | 4 | 0 | 🟡 |
| `mostow-rigidity` | 6 | 2 | 0 | 1 | 0 | 🟡 |
| `naive-set-theory` | 5 | 1 | 0 | 2 | 1 | 🟡 |
| `numerical-analysis` | 6 | 3 | 0 | 0 | 0 | 🟡 |
| `p-adic-numbers` | 7 | 3 | 0 | 0 | 0 | 🟡 |
| `partial-differential-equations` | 6 | 0 | 0 | 1 | 0 | 🟡 |
| `partitions-generating-functions` | 5 | 1 | 0 | 1 | 0 | 🟡 |
| `point-set-topology` | 6 | 1 | 0 | 3 | 3 | 🟡 |
| `projective-plane` | 5 | 2 | 0 | 0 | 0 | 🟡 |
| `quadratic-forms-genus-theory` | 5 | 1 | 0 | 3 | 0 | 🟡 |
| `quadratic-reciprocity` | 6 | 1 | 0 | 4 | 1 | 🟡 |
| `quantum-groups` | 6 | 1 | 0 | 3 | 0 | 🟡 |
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
| `spectral-theory` | 9 | 3 | 0 | 2 | 0 | 🟡 |
| `stacks` | 5 | 0 | 0 | 1 | 0 | 🟡 |
| `stochastic-processes-and-martingales` | 6 | 1 | 0 | 3 | 0 | 🟡 |
| `symplectic-manifolds` | 6 | 1 | 0 | 3 | 1 | 🟡 |
| `three-body-problem` | 6 | 2 | 0 | 0 | 0 | 🟡 |
| `upper-half-plane-hyperbolic` | 5 | 1 | 0 | 3 | 0 | 🟡 |
| `variational-methods` | 6 | 3 | 0 | 3 | 0 | 🟡 |
| `vertex-operator-algebras` | 6 | 1 | 0 | 1 | 0 | 🟡 |
| `wavelets` | 8 | 3 | 0 | 3 | 1 | 🟡 |
| `zeta-values` | 7 | 3 | 0 | 1 | 0 | 🟡 |
| `zfc-and-ordinals` | 7 | 2 | 0 | 3 | 0 | 🟡 |
| `adeles-and-ideles` | 5 | 1 | 0 | 0 | 0 | 🟢 |
| `algebraic-number-theory` | 5 | 0 | 0 | 0 | 0 | 🟢 |
| `algebraic-topology` | 6 | 1 | 0 | 0 | 2 | 🟢 |
| `frobenius-and-reciprocity` | 5 | 1 | 0 | 0 | 0 | 🟢 |
| `galois-cohomology-and-brauer` | 6 | 1 | 0 | 0 | 0 | 🟢 |
| `theta-functions` | 5 | 0 | 0 | 0 | 0 | 🟢 |
| `type-theory-and-hott` | 6 | 1 | 0 | 0 | 0 | 🟢 |
