# Concept graph health — summary

- Total concepts: **1292**
- Total prereq edges: **2373**
- Implicit prereq candidates (total across all concepts): **524**
- Multi-topic candidates (title appears in prose of ≥ 3 other topics): **54**
- Atomicity-split candidates (blurb ≥ 3 sentences AND > 200 chars): **370**
- Dangling proper-noun phrases (in ≥ 2 topics, no matching concept): **90**
- Orphan concepts (zero edges in or out): **1**

## Decision framework

- ✅ **implicit_prereqs ≥ 200** (524): edge enrichment first. The existing graph has too many missing dependencies to benefit from restructuring.
- ✅ **dangling_terms ≥ 50** (90): add nodes before restructuring. The graph has identifiable gaps — proper-noun phrases that recur across topics without being defined as concepts.

## Top 15 multi-topic candidates

- `compactness` (point-set-topology) — title appears in prose of **19** other topics
- `w-applications` (wavelets) — title appears in prose of **17** other topics
- `hdg-applications` (high-dimensional-geometry) — title appears in prose of **16** other topics
- `e-applications` (expanders) — title appears in prose of **16** other topics
- `completion-ca` (commutative-algebra) — title appears in prose of **16** other topics
- `fundamental-group` (algebraic-topology) — title appears in prose of **15** other topics
- `open-sets` (point-set-topology) — title appears in prose of **14** other topics
- `cc-vector-bundles` (characteristic-classes) — title appears in prose of **13** other topics
- `analytic-continuation` (complex-analysis) — title appears in prose of **11** other topics
- `exact-sequences` (homological) — title appears in prose of **10** other topics
- `real-differentiation` (real-analysis) — title appears in prose of **8** other topics
- `holomorphic-function` (complex-analysis) — title appears in prose of **8** other topics
- `brownian-motion` (probability-theory) — title appears in prose of **8** other topics
- `sm-symplectic-form` (symplectic-manifolds) — title appears in prose of **7** other topics
- `limits-colimits` (category-theory) — title appears in prose of **6** other topics

## Top 15 implicit-prereq flags

- `sg-applications` (semigroup-theory-evolution-equations) — 4 missing: measurable-functions, sc-ito-formula, brownian-motion, sc-feynman-kac
- `aca-several-complex-variables` (advanced-complex-analysis) — 4 missing: riemann-mapping, laurent-series, scv-hartogs, atiyah-singer-statement
- `rmt-free-probability` (random-matrix-theory) — 3 missing: random-variables, sc-ito-integral, brownian-motion
- `ht-stable` (homotopy-theory) — 3 missing: spectral-sequences-ha, exact-sequences, cc-vector-bundles
- `cm-solid-abelian` (condensed-mathematics) — 3 missing: limits-colimits, exact-sequences, completion-ca
- `cm-liquid-vector-spaces` (condensed-mathematics) — 3 missing: completion-ca, limits-colimits, exact-sequences
- `cd-characteristic-preview` (cohomology-and-duality) — 3 missing: cc-vector-bundles, hdg-applications, cc-chern-classes
- `aca-overview` (advanced-complex-analysis) — 3 missing: cauchy-theorem, aca-bloch-theorem, maximum-modulus
- `cy-applications` (calabi-yau-manifolds) — 3 missing: k-chern-character, dtgw-virtual-fundamental-class, dtgw-gw-invariants
- `kp-jones-polynomial` (knot-polynomials) — 3 missing: kp-khovanov-homology, open-sets, singular-homology
- `categories-morphisms` (category-theory) — 3 missing: open-sets, scheme-morphisms, reflexivity
- `yoneda-limits-adjunctions` (category-theory) — 3 missing: completion-ca, fundamental-group, yoneda-lemma
- `geometric-morphisms-of-sites` (grothendieck-topologies-sites) — 3 missing: open-sets, sieves, fundamental-group
- `vitali-covering` (real-analysis) — 3 missing: compactness, real-differentiation, lebesgue-differentiation
- `singularity-classification` (complex-analysis) — 3 missing: hcm-applications, argument-principle, residue-theorem

## Top 20 dangling proper-noun phrases (by topic count)

- "Interactive Mathematics Notebook" — in **13** topics
- "The Euler" — in **10** topics
- "The Hodge" — in **7** topics
- "Fields Medal" — in **6** topics
- "The Fourier" — in **6** topics
- "The Riemann" — in **5** topics
- "Monte Carlo" — in **5** topics
- "The CLT" — in **4** topics
- "The Whitehead" — in **4** topics
- "The Hopf" — in **4** topics
- "The Picard" — in **4** topics
- "Standard Model" — in **4** topics
- "The Gaussian" — in **4** topics
- "The Lie" — in **4** topics
- "Mac Lane" — in **4** topics
- "The Frobenius" — in **3** topics
- "The PDE" — in **3** topics
- "The Hilbert" — in **3** topics
- "By Cartan" — in **3** topics
- "Every Riemann" — in **3** topics

## Top 10 atomicity-split candidates

- `qft-renormalization` (quantum-field-theory) — 4 sentences, 1186 chars
- `mc-bridge-infinity` (model-categories) — 4 sentences, 1118 chars
- `gmt-currents` (geometric-measure-theory) — 5 sentences, 1002 chars
- `mc-examples` (model-categories) — 5 sentences, 997 chars
- `mc-quillen-functors` (model-categories) — 4 sentences, 995 chars
- `gmt-applications` (geometric-measure-theory) — 4 sentences, 967 chars
- `gmt-bv-functions` (geometric-measure-theory) — 3 sentences, 964 chars
- `gmt-area-coarea` (geometric-measure-theory) — 4 sentences, 955 chars
- `mc-monoidal` (model-categories) — 4 sentences, 953 chars
- `ak-q-construction` (algebraic-k-theory-foundations) — 5 sentences, 946 chars

## Per-topic scorecard

Compact roll-up of the rows above. Bucket: 🟢 healthy (no implicit flags, ≤1 dead-end), 🟡 minor, 🔴 attention. Summary: 8 🟢 · 127 🟡 · 51 🔴.

| topic | concepts | dead-ends | orphans | implicit | multi-topic | bucket |
|---|---:|---:|---:|---:|---:|:---:|
| `additive-number-theory` | 15 | 4 | 0 | 2 | 0 | 🔴 |
| `advanced-complex-analysis` | 13 | 7 | 1 | 17 | 0 | 🔴 |
| `algebraic-k-theory-foundations` | 6 | 2 | 0 | 7 | 0 | 🔴 |
| `atiyah-singer-index-theorem` | 6 | 2 | 0 | 5 | 0 | 🔴 |
| `calabi-yau-manifolds` | 6 | 2 | 0 | 8 | 1 | 🔴 |
| `category-theory` | 12 | 3 | 0 | 8 | 1 | 🔴 |
| `characteristic-classes` | 9 | 1 | 0 | 7 | 3 | 🔴 |
| `coding-theory` | 7 | 4 | 0 | 2 | 0 | 🔴 |
| `cohomology-and-duality` | 6 | 1 | 0 | 12 | 1 | 🔴 |
| `commutative-algebra` | 16 | 5 | 0 | 3 | 1 | 🔴 |
| `complex-analysis` | 27 | 4 | 0 | 18 | 7 | 🔴 |
| `computational-molecular-biology` | 7 | 4 | 0 | 0 | 0 | 🔴 |
| `condensed-mathematics` | 6 | 2 | 0 | 10 | 0 | 🔴 |
| `conformal-and-cr-geometry` | 7 | 2 | 0 | 6 | 0 | 🔴 |
| `d-modules` | 6 | 2 | 0 | 8 | 0 | 🔴 |
| `dirac-equation` | 6 | 4 | 0 | 0 | 0 | 🔴 |
| `dynamical-systems` | 13 | 4 | 0 | 2 | 0 | 🔴 |
| `etale-cohomology` | 5 | 0 | 0 | 9 | 0 | 🔴 |
| `etale-fundamental-group` | 6 | 2 | 0 | 6 | 0 | 🔴 |
| `fixed-point-theorems` | 8 | 5 | 0 | 3 | 0 | 🔴 |
| `functional-analysis` | 14 | 3 | 0 | 9 | 2 | 🔴 |
| `geometric-measure-theory` | 6 | 1 | 0 | 6 | 0 | 🔴 |
| `group-schemes` | 6 | 4 | 0 | 3 | 0 | 🔴 |
| `hamiltonians-classical-mechanics` | 6 | 1 | 0 | 6 | 1 | 🔴 |
| `harmonic-functions` | 6 | 1 | 0 | 7 | 1 | 🔴 |
| `heights-arithmetic-geometry` | 10 | 4 | 0 | 0 | 0 | 🔴 |
| `homological` | 15 | 4 | 0 | 7 | 2 | 🔴 |
| `homotopy-theory` | 6 | 2 | 0 | 5 | 0 | 🔴 |
| `infinity-categories` | 6 | 2 | 0 | 6 | 0 | 🔴 |
| `infinity-topoi` | 7 | 5 | 0 | 2 | 0 | 🔴 |
| `intersection-theory-chow` | 6 | 2 | 0 | 6 | 1 | 🔴 |
| `k-theory` | 6 | 0 | 0 | 5 | 1 | 🔴 |
| `knot-polynomials` | 8 | 1 | 0 | 7 | 1 | 🔴 |
| `L-functions` | 5 | 0 | 0 | 6 | 0 | 🔴 |
| `large-deviations` | 5 | 1 | 0 | 7 | 0 | 🔴 |
| `measure-theory` | 12 | 3 | 0 | 5 | 2 | 🔴 |
| `motives` | 8 | 1 | 0 | 6 | 0 | 🔴 |
| `operator-algebras` | 12 | 4 | 0 | 8 | 0 | 🔴 |
| `probabilistic-method` | 7 | 5 | 0 | 2 | 0 | 🔴 |
| `probability-theory` | 12 | 1 | 0 | 5 | 3 | 🔴 |
| `random-matrix-theory` | 7 | 3 | 0 | 5 | 0 | 🔴 |
| `real-analysis` | 18 | 5 | 0 | 11 | 1 | 🔴 |
| `representation-theory` | 13 | 6 | 0 | 2 | 0 | 🔴 |
| `schrodinger-equation` | 6 | 4 | 0 | 1 | 0 | 🔴 |
| `semigroup-theory-evolution-equations` | 6 | 1 | 0 | 5 | 0 | 🔴 |
| `several-complex-variables` | 6 | 1 | 0 | 7 | 0 | 🔴 |
| `sheaf-cohomology` | 5 | 1 | 0 | 6 | 0 | 🔴 |
| `sheaves` | 7 | 0 | 0 | 6 | 0 | 🔴 |
| `spectral-methods-data` | 7 | 5 | 0 | 1 | 0 | 🔴 |
| `statistical-mechanics` | 7 | 4 | 0 | 4 | 0 | 🔴 |
| `stochastic-calculus` | 6 | 1 | 0 | 6 | 1 | 🔴 |
| `abelian-varieties` | 6 | 2 | 0 | 2 | 0 | 🟡 |
| `adeles-and-ideles` | 5 | 1 | 0 | 2 | 0 | 🟡 |
| `algebra` | 16 | 3 | 0 | 2 | 0 | 🟡 |
| `algebraic-de-rham-cohomology` | 6 | 1 | 0 | 3 | 0 | 🟡 |
| `algebraic-spaces` | 6 | 3 | 0 | 2 | 0 | 🟡 |
| `analytic-continuation` | 5 | 3 | 0 | 4 | 0 | 🟡 |
| `analytic-number-theory` | 10 | 3 | 0 | 3 | 0 | 🟡 |
| `arithmetic-statistics` | 6 | 1 | 0 | 1 | 0 | 🟡 |
| `automorphic-forms-adelic` | 9 | 3 | 0 | 0 | 0 | 🟡 |
| `bezout` | 5 | 1 | 0 | 1 | 0 | 🟡 |
| `brill-noether` | 7 | 1 | 0 | 4 | 0 | 🟡 |
| `bsd` | 5 | 2 | 0 | 0 | 0 | 🟡 |
| `class-field-theory` | 6 | 2 | 0 | 2 | 1 | 🟡 |
| `cluster-algebras` | 6 | 1 | 0 | 1 | 0 | 🟡 |
| `cobordism` | 6 | 3 | 0 | 3 | 0 | 🟡 |
| `cocartesian-fibrations` | 7 | 2 | 0 | 4 | 0 | 🟡 |
| `complex-multiplication` | 6 | 2 | 0 | 2 | 0 | 🟡 |
| `complexity-theory` | 6 | 2 | 0 | 0 | 0 | 🟡 |
| `computability-and-decidability` | 6 | 2 | 0 | 1 | 0 | 🟡 |
| `computational-number-theory` | 6 | 3 | 0 | 0 | 0 | 🟡 |
| `continued-fractions` | 6 | 2 | 0 | 2 | 0 | 🟡 |
| `crystalline-cohomology` | 6 | 1 | 0 | 1 | 0 | 🟡 |
| `deformation-theory` | 6 | 2 | 0 | 2 | 0 | 🟡 |
| `derived-categories` | 7 | 1 | 0 | 3 | 0 | 🟡 |
| `designs` | 6 | 3 | 0 | 1 | 0 | 🟡 |
| `differential-forms` | 5 | 0 | 0 | 1 | 1 | 🟡 |
| `differential-geometry` | 5 | 1 | 0 | 1 | 0 | 🟡 |
| `dirichlet-series-euler-products` | 5 | 0 | 0 | 1 | 0 | 🟡 |
| `dirichlet-unit-theorem` | 6 | 3 | 0 | 1 | 0 | 🟡 |
| `donaldson-thomas-and-gw-invariants` | 7 | 2 | 0 | 3 | 1 | 🟡 |
| `elementary-topos-theory` | 7 | 2 | 0 | 3 | 1 | 🟡 |
| `elliptic-curves` | 5 | 0 | 0 | 1 | 0 | 🟡 |
| `enumerative-combinatorics` | 6 | 2 | 0 | 0 | 0 | 🟡 |
| `expanders` | 6 | 3 | 0 | 1 | 1 | 🟡 |
| `extremal-combinatorics` | 6 | 3 | 0 | 1 | 0 | 🟡 |
| `first-order-logic-and-completeness` | 7 | 1 | 0 | 3 | 0 | 🟡 |
| `forcing-and-independence` | 6 | 1 | 0 | 1 | 0 | 🟡 |
| `functor-of-points` | 5 | 2 | 0 | 1 | 0 | 🟡 |
| `galois` | 7 | 2 | 0 | 3 | 0 | 🟡 |
| `galois-representations` | 5 | 2 | 0 | 1 | 0 | 🟡 |
| `gauge-theory` | 7 | 3 | 0 | 3 | 0 | 🟡 |
| `general-relativity` | 6 | 3 | 0 | 0 | 0 | 🟡 |
| `geometric-and-combinatorial-group-theory` | 6 | 1 | 0 | 1 | 0 | 🟡 |
| `geometric-invariant-theory` | 7 | 2 | 0 | 3 | 0 | 🟡 |
| `groebner-bases` | 8 | 1 | 0 | 1 | 0 | 🟡 |
| `grothendieck-topologies-sites` | 6 | 1 | 0 | 4 | 0 | 🟡 |
| `group-cohomology` | 7 | 3 | 0 | 1 | 0 | 🟡 |
| `half-integral-weight-forms` | 6 | 1 | 0 | 2 | 0 | 🟡 |
| `harmonic-analysis-fourier` | 8 | 3 | 0 | 4 | 1 | 🟡 |
| `hecke-operators` | 5 | 0 | 0 | 1 | 0 | 🟡 |
| `heegaard-floer` | 7 | 3 | 0 | 1 | 0 | 🟡 |
| `heyting-algebras-toposes` | 6 | 2 | 0 | 1 | 0 | 🟡 |
| `high-dimensional-geometry` | 6 | 3 | 0 | 2 | 1 | 🟡 |
| `hodge-theory` | 8 | 2 | 0 | 2 | 0 | 🟡 |
| `information-theory` | 8 | 3 | 0 | 3 | 0 | 🟡 |
| `iwasawa-theory` | 6 | 1 | 0 | 2 | 0 | 🟡 |
| `kahler-geometry` | 6 | 2 | 0 | 3 | 0 | 🟡 |
| `khovanov-homology` | 6 | 1 | 0 | 3 | 0 | 🟡 |
| `klein-gordon-equation` | 6 | 2 | 0 | 1 | 0 | 🟡 |
| `langlands-program` | 8 | 1 | 0 | 4 | 0 | 🟡 |
| `lie-algebras` | 6 | 1 | 0 | 1 | 0 | 🟡 |
| `lie-groups` | 7 | 1 | 0 | 1 | 0 | 🟡 |
| `maass-forms` | 6 | 3 | 0 | 4 | 0 | 🟡 |
| `mapping-class-groups` | 6 | 2 | 0 | 2 | 0 | 🟡 |
| `mathematical-biology` | 7 | 3 | 0 | 1 | 0 | 🟡 |
| `mathematical-finance` | 7 | 3 | 0 | 3 | 0 | 🟡 |
| `mathematical-statistics` | 6 | 3 | 0 | 1 | 0 | 🟡 |
| `mathematics-and-cryptography` | 6 | 2 | 0 | 0 | 0 | 🟡 |
| `matroid-theory` | 7 | 3 | 0 | 2 | 0 | 🟡 |
| `microlocal-analysis` | 6 | 2 | 0 | 1 | 0 | 🟡 |
| `mirror-symmetry` | 6 | 2 | 0 | 4 | 0 | 🟡 |
| `mmp-and-birational-geometry` | 6 | 3 | 0 | 0 | 0 | 🟡 |
| `model-categories` | 6 | 3 | 0 | 4 | 0 | 🟡 |
| `model-theory-basics` | 6 | 3 | 0 | 2 | 0 | 🟡 |
| `modular-curves` | 9 | 3 | 0 | 2 | 0 | 🟡 |
| `modular-forms` | 6 | 0 | 0 | 3 | 1 | 🟡 |
| `modularity-and-flt` | 5 | 2 | 0 | 2 | 1 | 🟡 |
| `moduli-spaces` | 5 | 1 | 0 | 2 | 0 | 🟡 |
| `moonshine` | 8 | 3 | 0 | 0 | 0 | 🟡 |
| `morphisms-fiber-products` | 5 | 0 | 0 | 2 | 1 | 🟡 |
| `morse-theory` | 8 | 2 | 0 | 4 | 0 | 🟡 |
| `mostow-rigidity` | 6 | 2 | 0 | 1 | 0 | 🟡 |
| `naive-set-theory` | 5 | 1 | 0 | 2 | 1 | 🟡 |
| `numerical-analysis` | 6 | 3 | 0 | 0 | 0 | 🟡 |
| `optimal-control-and-dynamic-programming` | 7 | 3 | 0 | 3 | 0 | 🟡 |
| `p-adic-numbers` | 7 | 2 | 0 | 1 | 0 | 🟡 |
| `partial-differential-equations` | 6 | 0 | 0 | 1 | 0 | 🟡 |
| `partitions-generating-functions` | 5 | 1 | 0 | 1 | 0 | 🟡 |
| `point-set-topology` | 6 | 1 | 0 | 4 | 3 | 🟡 |
| `positive-characteristic-ag` | 7 | 3 | 0 | 1 | 0 | 🟡 |
| `positivity-and-ample-line-bundles` | 6 | 2 | 0 | 1 | 0 | 🟡 |
| `projective-plane` | 5 | 2 | 0 | 0 | 0 | 🟡 |
| `quadratic-forms-genus-theory` | 5 | 1 | 0 | 3 | 0 | 🟡 |
| `quadratic-reciprocity` | 6 | 1 | 0 | 4 | 1 | 🟡 |
| `quantum-field-theory` | 6 | 2 | 0 | 1 | 0 | 🟡 |
| `quantum-groups` | 6 | 1 | 0 | 3 | 0 | 🟡 |
| `quaternions-octonions-and-division-algebras` | 6 | 2 | 0 | 0 | 0 | 🟡 |
| `random-walks-and-mixing` | 6 | 2 | 0 | 4 | 0 | 🟡 |
| `resolution-of-singularities` | 6 | 2 | 0 | 1 | 0 | 🟡 |
| `ricci-flow` | 6 | 1 | 0 | 1 | 0 | 🟡 |
| `riemann-surfaces` | 5 | 1 | 0 | 1 | 0 | 🟡 |
| `riemannian-geometry` | 5 | 1 | 0 | 1 | 1 | 🟡 |
| `sato-tate` | 5 | 1 | 0 | 1 | 0 | 🟡 |
| `schemes` | 10 | 3 | 0 | 1 | 1 | 🟡 |
| `shimura-varieties` | 6 | 1 | 0 | 1 | 0 | 🟡 |
| `simplicial-complexes-combinatorial` | 6 | 3 | 0 | 2 | 0 | 🟡 |
| `simplicial-sets-and-nerve` | 6 | 1 | 0 | 4 | 1 | 🟡 |
| `singular-cubics-reduction` | 5 | 3 | 0 | 1 | 0 | 🟡 |
| `smooth-manifolds` | 10 | 2 | 0 | 4 | 2 | 🟡 |
| `sobolev-spaces-distributions` | 7 | 3 | 0 | 0 | 0 | 🟡 |
| `special-relativity` | 6 | 2 | 0 | 0 | 0 | 🟡 |
| `spectral-graph-theory` | 7 | 1 | 0 | 2 | 0 | 🟡 |
| `spectral-theory` | 9 | 3 | 0 | 2 | 0 | 🟡 |
| `stacks` | 5 | 0 | 0 | 1 | 0 | 🟡 |
| `stochastic-processes-and-martingales` | 6 | 1 | 0 | 3 | 0 | 🟡 |
| `string-theory` | 7 | 1 | 0 | 1 | 0 | 🟡 |
| `surgery-theory` | 6 | 2 | 0 | 1 | 0 | 🟡 |
| `symplectic-manifolds` | 6 | 1 | 0 | 3 | 1 | 🟡 |
| `three-body-problem` | 6 | 2 | 0 | 0 | 0 | 🟡 |
| `toric-varieties` | 6 | 1 | 0 | 1 | 0 | 🟡 |
| `tropical-geometry` | 6 | 3 | 0 | 2 | 0 | 🟡 |
| `upper-half-plane-hyperbolic` | 5 | 1 | 0 | 3 | 0 | 🟡 |
| `variational-methods` | 6 | 3 | 0 | 3 | 0 | 🟡 |
| `vertex-operator-algebras` | 6 | 1 | 0 | 1 | 0 | 🟡 |
| `wavelets` | 8 | 3 | 0 | 3 | 1 | 🟡 |
| `zeta-values` | 7 | 3 | 0 | 1 | 0 | 🟡 |
| `zfc-and-ordinals` | 7 | 2 | 0 | 3 | 0 | 🟡 |
| `algebraic-curves-higher-genus` | 6 | 1 | 0 | 0 | 0 | 🟢 |
| `algebraic-number-theory` | 5 | 0 | 0 | 0 | 0 | 🟢 |
| `algebraic-topology` | 6 | 1 | 0 | 0 | 2 | 🟢 |
| `combinatorial-optimization` | 7 | 1 | 0 | 0 | 0 | 🟢 |
| `frobenius-and-reciprocity` | 5 | 1 | 0 | 0 | 0 | 🟢 |
| `galois-cohomology-and-brauer` | 6 | 1 | 0 | 0 | 0 | 🟢 |
| `theta-functions` | 5 | 0 | 0 | 0 | 0 | 🟢 |
| `type-theory-and-hott` | 6 | 0 | 0 | 0 | 0 | 🟢 |
