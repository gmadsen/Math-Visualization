# Coverage + type stats — widgets & quizzes

## Corpus totals

- Topics: **58**, concepts: **407**
- Widgets: **457** (registry-driven: 455, inline: 2)
- Quizzes: **2298** (v1: 1160, hard: 1125, expert: 13)
- Quiz types: mcq: 1397, numeric: 795, complex: 29, multi-select: 25, ordering: 15, matching: 14, proof-completion: 13, spot-the-error: 6, construction: 2, guess-my-rule: 2
- Concepts lacking a widget in their section: **100**
- Concepts lacking a hard-tier quiz: **21**

## Per-slug registry adoption

Every slug registered under `widgets/<slug>/`, with its current adoption
across `content/<topic>.json`. Slugs at **0 instances** are
infrastructure-only — they ship a renderer and a fixture, but no topic
page has wired one in yet.

| slug | family | gesture | dimension | instances | topics |
|---|---|---|---|---:|---|
| `button-stepper` | button-stepper | click | 2d | 349 | L-functions, adeles-and-ideles, algebra, algebraic-number-theory, algebraic-topology, analytic-continuation, bezout, bsd, category-theory, class-field-theory, commutative-algebra, complex-analysis, differential-geometry, dirichlet-series-euler-products, dynamical-systems, etale-cohomology, frobenius-and-reciprocity, functional-analysis, functor-of-points, galois, galois-representations, hecke-operators, homological, lie-groups, measure-theory, modular-forms, modularity-and-flt, moduli-spaces, moonshine, morphisms-fiber-products, naive-set-theory, operator-algebras, p-adic-numbers, partitions-generating-functions, point-set-topology, power-sums-bernoulli, probability-theory, projective-plane, quadratic-forms-genus-theory, quadratic-reciprocity, representation-theory, riemann-surfaces, riemannian-geometry, sato-tate, schemes, sheaf-cohomology, sheaves, singular-cubics-reduction, smooth-manifolds, stacks, sums-of-squares, theta-functions, upper-half-plane-hyperbolic, waring, zeta-values |
| `clickable-diagram` | clickable-diagram | click | 2d | 69 | algebra, algebraic-number-theory, algebraic-topology, bezout, category-theory, frobenius-and-reciprocity, functional-analysis, functor-of-points, galois, homological, measure-theory, morphisms-fiber-products, naive-set-theory, operator-algebras, quadratic-reciprocity, real-analysis, riemannian-geometry, schemes, sheaves, stacks |
| `clickable-graph` | clickable-graph | click | 2d | 6 | adeles-and-ideles, riemannian-geometry, schemes, sheaves |
| `surface-viewer` | surface-viewer | drag | 3d | 6 | differential-geometry, lie-groups |
| `svg-illustration` | svg-illustration | static | 2d | 6 | L-functions, riemann-surfaces |
| `parametric-plot` | parametric-plot | slider | 2d | 5 | analytic-continuation |
| `input-form` | input-form | input | 2d | 4 | sums-of-squares |
| `declarative-host` | declarative-host | interactive | 2d | 3 | category-theory, power-sums-bernoulli |
| `composition-explorer` | clickable-diagram | click | 2d | 1 | category-theory |
| `counterexample-explorer` | counterexample-explorer | select | 2d | 1 | point-set-topology |
| `inline-code-cell` | inline-code-cell | edit | 2d | 1 | p-adic-numbers |
| `lattice-visualizer` | lattice-visualizer | slider | 2d | 1 | modular-forms |
| `modular-arithmetic-clock` | modular-arithmetic-clock | slider | 2d | 1 | quadratic-reciprocity |
| `natural-transformation-explorer` | naturality-square | slider+click | 2d | 1 | category-theory |
| `recurrence-plotter` | recurrence-plotter | slider | 2d | 1 | dynamical-systems |
| `constraint-bifurcation-explorer` | constraint-bifurcation-explorer | slider | 2d | 0 | _(none — fixture-only)_ |
| `proof-scrubber` | proof-scrubber | timeline | 2d | 0 | _(none — fixture-only)_ |

## Per-subject

### Foundations

- Topics: **1**, concepts: **5**
- Widgets: **4** (registry-driven: 4, inline: 0)
  - by family: clickable-diagram: 3, button-stepper: 1
  - by dimension: 2d: 4
  - by gesture: click: 4
- Quizzes: **30** (v1: 15, hard: 15, expert: 0)
  - by type: mcq: 19, numeric: 11

### Algebra

- Topics: **5**, concepts: **61**
- Widgets: **65** (registry-driven: 65, inline: 0)
  - by family: button-stepper: 50, clickable-diagram: 13, naturality-square: 1, declarative-host: 1
  - by dimension: 2d: 65
  - by gesture: click: 63, slider+click: 1, interactive: 1
- Quizzes: **363** (v1: 183, hard: 180, expert: 0)
  - by type: mcq: 209, numeric: 134, multi-select: 11, ordering: 3, proof-completion: 2, matching: 2, complex: 1, spot-the-error: 1

### Analysis

- Topics: **7**, concepts: **100**
- Widgets: **79** (registry-driven: 79, inline: 0)
  - by family: button-stepper: 47, clickable-diagram: 31, recurrence-plotter: 1
  - by dimension: 2d: 79
  - by gesture: click: 78, slider: 1
- Quizzes: **460** (v1: 238, hard: 209, expert: 13)
  - by type: mcq: 257, numeric: 132, complex: 15, multi-select: 14, matching: 12, ordering: 11, proof-completion: 11, spot-the-error: 5, construction: 2, guess-my-rule: 1

### Geometry & topology

- Topics: **8**, concepts: **48**
- Widgets: **49** (registry-driven: 49, inline: 0)
  - by family: button-stepper: 34, surface-viewer: 6, clickable-diagram: 4, clickable-graph: 2, svg-illustration: 2, counterexample-explorer: 1
  - by dimension: 2d: 43, 3d: 6
  - by gesture: click: 40, drag: 6, static: 2, select: 1
- Quizzes: **286** (v1: 144, hard: 142, expert: 0)
  - by type: mcq: 168, numeric: 111, complex: 7

### Number theory

- Topics: **11**, concepts: **56**
- Widgets: **73** (registry-driven: 71, inline: 2)
  - by family: button-stepper: 58, clickable-diagram: 4, input-form: 4, unknown: 2, declarative-host: 2, modular-arithmetic-clock: 1, inline-code-cell: 1, clickable-graph: 1
  - by dimension: 2d: 71, unknown: 2
  - by gesture: click: 63, input: 4, unknown: 2, interactive: 2, slider: 1, edit: 1
- Quizzes: **337** (v1: 169, hard: 168, expert: 0)
  - by type: mcq: 219, numeric: 114, complex: 3, guess-my-rule: 1

### Modular forms & L-functions

- Topics: **14**, concepts: **70**
- Widgets: **108** (registry-driven: 108, inline: 0)
  - by family: button-stepper: 98, parametric-plot: 5, svg-illustration: 4, lattice-visualizer: 1
  - by dimension: 2d: 108
  - by gesture: click: 98, slider: 6, static: 4
- Quizzes: **420** (v1: 210, hard: 210, expert: 0)
  - by type: mcq: 269, numeric: 150, ordering: 1

### Algebraic geometry

- Topics: **12**, concepts: **67**
- Widgets: **79** (registry-driven: 79, inline: 0)
  - by family: button-stepper: 61, clickable-diagram: 15, clickable-graph: 3
  - by dimension: 2d: 79
  - by gesture: click: 79
- Quizzes: **402** (v1: 201, hard: 201, expert: 0)
  - by type: mcq: 256, numeric: 143, complex: 3

## Per-topic

- `naive-set-theory` (Foundations) — concepts=5, widgets=4 (slug=4), quiz=30 (v1=15, hard=15, expert=0)
- `algebra` (Algebra) — concepts=12, widgets=12 (slug=12), quiz=73 (v1=36, hard=37, expert=0)
- `category-theory` (Algebra) — concepts=12, widgets=17 (slug=17), quiz=72 (v1=36, hard=36, expert=0)
- `representation-theory` (Algebra) — concepts=13, widgets=13 (slug=13), quiz=74 (v1=39, hard=35, expert=0)
- `commutative-algebra` (Algebra) — concepts=12, widgets=12 (slug=12), quiz=71 (v1=36, hard=35, expert=0)
- `homological` (Algebra) — concepts=12, widgets=11 (slug=11), quiz=73 (v1=36, hard=37, expert=0)
- `real-analysis` (Analysis) — concepts=14, widgets=14 (slug=14), quiz=71 (v1=42, hard=29, expert=0)
- `measure-theory` (Analysis) — concepts=12, widgets=12 (slug=12), quiz=72 (v1=36, hard=36, expert=0)
- `complex-analysis` (Analysis) — concepts=26, widgets=7 (slug=7), quiz=28 (v1=16, hard=12, expert=0)
- `functional-analysis` (Analysis) — concepts=12, widgets=11 (slug=11), quiz=72 (v1=36, hard=36, expert=0)
- `operator-algebras` (Analysis) — concepts=12, widgets=12 (slug=12), quiz=72 (v1=36, hard=36, expert=0)
- `dynamical-systems` (Analysis) — concepts=12, widgets=13 (slug=13), quiz=72 (v1=36, hard=36, expert=0)
- `probability-theory` (Analysis) — concepts=12, widgets=10 (slug=10), quiz=73 (v1=36, hard=24, expert=13)
- `point-set-topology` (Geometry & topology) — concepts=6, widgets=7 (slug=7), quiz=36 (v1=18, hard=18, expert=0)
- `algebraic-topology` (Geometry & topology) — concepts=5, widgets=5 (slug=5), quiz=29 (v1=15, hard=14, expert=0)
- `smooth-manifolds` (Geometry & topology) — concepts=10, widgets=9 (slug=9), quiz=59 (v1=30, hard=29, expert=0)
- `differential-forms` (Geometry & topology) — concepts=5, widgets=0 (slug=0), quiz=30 (v1=15, hard=15, expert=0)
- `differential-geometry` (Geometry & topology) — concepts=5, widgets=9 (slug=9), quiz=30 (v1=15, hard=15, expert=0)
- `riemannian-geometry` (Geometry & topology) — concepts=5, widgets=7 (slug=7), quiz=30 (v1=15, hard=15, expert=0)
- `lie-groups` (Geometry & topology) — concepts=7, widgets=6 (slug=6), quiz=42 (v1=21, hard=21, expert=0)
- `riemann-surfaces` (Geometry & topology) — concepts=5, widgets=6 (slug=6), quiz=30 (v1=15, hard=15, expert=0)
- `galois` (Number theory) — concepts=5, widgets=6 (slug=5), quiz=30 (v1=15, hard=15, expert=0)
- `quadratic-reciprocity` (Number theory) — concepts=5, widgets=7 (slug=7), quiz=30 (v1=15, hard=15, expert=0)
- `quadratic-forms-genus-theory` (Number theory) — concepts=5, widgets=6 (slug=6), quiz=30 (v1=15, hard=15, expert=0)
- `sums-of-squares` (Number theory) — concepts=5, widgets=8 (slug=8), quiz=30 (v1=15, hard=15, expert=0)
- `power-sums-bernoulli` (Number theory) — concepts=5, widgets=8 (slug=8), quiz=31 (v1=16, hard=15, expert=0)
- `waring` (Number theory) — concepts=5, widgets=4 (slug=4), quiz=30 (v1=15, hard=15, expert=0)
- `algebraic-number-theory` (Number theory) — concepts=5, widgets=6 (slug=6), quiz=30 (v1=15, hard=15, expert=0)
- `p-adic-numbers` (Number theory) — concepts=5, widgets=9 (slug=9), quiz=30 (v1=15, hard=15, expert=0)
- `adeles-and-ideles` (Number theory) — concepts=5, widgets=5 (slug=5), quiz=30 (v1=15, hard=15, expert=0)
- `frobenius-and-reciprocity` (Number theory) — concepts=5, widgets=6 (slug=6), quiz=30 (v1=15, hard=15, expert=0)
- `class-field-theory` (Number theory) — concepts=6, widgets=8 (slug=7), quiz=36 (v1=18, hard=18, expert=0)
- `upper-half-plane-hyperbolic` (Modular forms & L-functions) — concepts=5, widgets=7 (slug=7), quiz=30 (v1=15, hard=15, expert=0)
- `modular-forms` (Modular forms & L-functions) — concepts=5, widgets=8 (slug=8), quiz=30 (v1=15, hard=15, expert=0)
- `theta-functions` (Modular forms & L-functions) — concepts=5, widgets=7 (slug=7), quiz=30 (v1=15, hard=15, expert=0)
- `partitions-generating-functions` (Modular forms & L-functions) — concepts=5, widgets=7 (slug=7), quiz=30 (v1=15, hard=15, expert=0)
- `hecke-operators` (Modular forms & L-functions) — concepts=5, widgets=8 (slug=8), quiz=30 (v1=15, hard=15, expert=0)
- `dirichlet-series-euler-products` (Modular forms & L-functions) — concepts=5, widgets=10 (slug=10), quiz=30 (v1=15, hard=15, expert=0)
- `analytic-continuation` (Modular forms & L-functions) — concepts=5, widgets=6 (slug=6), quiz=30 (v1=15, hard=15, expert=0)
- `zeta-values` (Modular forms & L-functions) — concepts=5, widgets=5 (slug=5), quiz=30 (v1=15, hard=15, expert=0)
- `L-functions` (Modular forms & L-functions) — concepts=5, widgets=9 (slug=9), quiz=30 (v1=15, hard=15, expert=0)
- `galois-representations` (Modular forms & L-functions) — concepts=5, widgets=9 (slug=9), quiz=30 (v1=15, hard=15, expert=0)
- `moonshine` (Modular forms & L-functions) — concepts=5, widgets=5 (slug=5), quiz=30 (v1=15, hard=15, expert=0)
- `projective-plane` (Algebraic geometry) — concepts=5, widgets=7 (slug=7), quiz=30 (v1=15, hard=15, expert=0)
- `bezout` (Algebraic geometry) — concepts=5, widgets=7 (slug=7), quiz=30 (v1=15, hard=15, expert=0)
- `schemes` (Algebraic geometry) — concepts=10, widgets=8 (slug=8), quiz=60 (v1=30, hard=30, expert=0)
- `sheaves` (Algebraic geometry) — concepts=7, widgets=7 (slug=7), quiz=42 (v1=21, hard=21, expert=0)
- `morphisms-fiber-products` (Algebraic geometry) — concepts=5, widgets=7 (slug=7), quiz=30 (v1=15, hard=15, expert=0)
- `functor-of-points` (Algebraic geometry) — concepts=5, widgets=7 (slug=7), quiz=30 (v1=15, hard=15, expert=0)
- `elliptic-curves` (Algebraic geometry) — concepts=5, widgets=0 (slug=0), quiz=30 (v1=15, hard=15, expert=0)
- `singular-cubics-reduction` (Algebraic geometry) — concepts=5, widgets=8 (slug=8), quiz=30 (v1=15, hard=15, expert=0)
- `moduli-spaces` (Algebraic geometry) — concepts=5, widgets=6 (slug=6), quiz=30 (v1=15, hard=15, expert=0)
- `sheaf-cohomology` (Algebraic geometry) — concepts=5, widgets=6 (slug=6), quiz=30 (v1=15, hard=15, expert=0)
- `stacks` (Algebraic geometry) — concepts=5, widgets=7 (slug=7), quiz=30 (v1=15, hard=15, expert=0)
- `sato-tate` (Modular forms & L-functions) — concepts=5, widgets=9 (slug=9), quiz=30 (v1=15, hard=15, expert=0)
- `bsd` (Modular forms & L-functions) — concepts=5, widgets=9 (slug=9), quiz=30 (v1=15, hard=15, expert=0)
- `modularity-and-flt` (Modular forms & L-functions) — concepts=5, widgets=9 (slug=9), quiz=30 (v1=15, hard=15, expert=0)
- `etale-cohomology` (Algebraic geometry) — concepts=5, widgets=9 (slug=9), quiz=30 (v1=15, hard=15, expert=0)

## Coverage gaps

### Concepts missing a widget in their owning section (top 20)

- `cartesian-product-powerset` (naive-set-theory)
- `axiom-of-choice-intuition` (naive-set-theory)
- `algebraic-structures` (algebra)
- `ring-ideals` (algebra)
- `field-extensions-basics` (algebra)
- `group-representations` (representation-theory)
- `characters-orthogonality` (representation-theory)
- `long-exact-sequence` (homological)
- `sigma-algebras` (measure-theory)
- `riemann-sphere` (complex-analysis)
- `mobius-transformations` (complex-analysis)
- `cauchy-riemann` (complex-analysis)
- `holomorphic-function` (complex-analysis)
- `domain-coloring` (complex-analysis)
- `cauchy-theorem` (complex-analysis)
- `cauchy-integral-formula` (complex-analysis)
- `liouville` (complex-analysis)
- `fta` (complex-analysis)
- `maximum-modulus` (complex-analysis)
- `schwarz-lemma` (complex-analysis)

### Concepts missing a hard-tier quiz (top 20)

- `riemann-sphere` (complex-analysis)
- `holomorphic-function` (complex-analysis)
- `domain-coloring` (complex-analysis)
- `contour-integral` (complex-analysis)
- `cauchy-theorem` (complex-analysis)
- `cauchy-integral-formula` (complex-analysis)
- `analyticity` (complex-analysis)
- `liouville` (complex-analysis)
- `fta` (complex-analysis)
- `maximum-modulus` (complex-analysis)
- `schwarz-lemma` (complex-analysis)
- `laurent-series` (complex-analysis)
- `singularity-classification` (complex-analysis)
- `argument-principle` (complex-analysis)
- `rouche` (complex-analysis)
- `conformal-map` (complex-analysis)
- `disk-automorphisms` (complex-analysis)
- `normal-families` (complex-analysis)
- `riemann-mapping` (complex-analysis)
- `harmonic-functions` (complex-analysis)
