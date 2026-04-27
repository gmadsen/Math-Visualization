# Coverage + type stats — widgets & quizzes

## Corpus totals

- Topics: **115**, concepts: **783**
- Widgets: **815** (registry-driven: 568, inline: 247)
- Quizzes: **3516** (v1: 2280, hard: 1223, expert: 13)
- Quiz types: mcq: 2300, numeric: 977, multi-select: 95, matching: 44, complex: 29, ordering: 28, spot-the-error: 22, proof-completion: 17, construction: 2, guess-my-rule: 2
- Concepts lacking a widget in their section: **129**
- Concepts lacking a hard-tier quiz: **345**

## Per-slug registry adoption

Every slug registered under `widgets/<slug>/`, with its current adoption
across `content/<topic>.json`. Slugs at **0 instances** are
infrastructure-only — they ship a renderer and a fixture, but no topic
page has wired one in yet.

| slug | family | gesture | dimension | instances | topics |
|---|---|---|---|---:|---|
| `button-stepper` | button-stepper | click | 2d | 336 | L-functions, additive-number-theory, adeles-and-ideles, algebra, algebraic-number-theory, algebraic-topology, analytic-continuation, bezout, bsd, category-theory, class-field-theory, complex-analysis, differential-geometry, dirichlet-series-euler-products, dynamical-systems, etale-cohomology, frobenius-and-reciprocity, functional-analysis, functor-of-points, galois, galois-representations, hecke-operators, homological, lie-groups, measure-theory, modular-forms, modularity-and-flt, moduli-spaces, moonshine, morphisms-fiber-products, naive-set-theory, operator-algebras, p-adic-numbers, partitions-generating-functions, point-set-topology, probability-theory, projective-plane, quadratic-forms-genus-theory, quadratic-reciprocity, representation-theory, riemann-surfaces, riemannian-geometry, sato-tate, schemes, sheaf-cohomology, sheaves, singular-cubics-reduction, smooth-manifolds, stacks, theta-functions, upper-half-plane-hyperbolic, zeta-values |
| `clickable-diagram` | clickable-diagram | click | 2d | 69 | algebra, algebraic-number-theory, algebraic-topology, bezout, category-theory, frobenius-and-reciprocity, functional-analysis, functor-of-points, galois, homological, measure-theory, morphisms-fiber-products, naive-set-theory, operator-algebras, quadratic-reciprocity, real-analysis, riemannian-geometry, schemes, sheaves, stacks |
| `clickable-graph` | clickable-graph | click | 2d | 6 | adeles-and-ideles, riemannian-geometry, schemes, sheaves |
| `surface-viewer` | surface-viewer | drag | 3d | 6 | differential-geometry, lie-groups |
| `svg-illustration` | svg-illustration | static | 2d | 6 | L-functions, riemann-surfaces |
| `parametric-plot` | parametric-plot | slider | 2d | 5 | analytic-continuation |
| `input-form` | input-form | input | 2d | 4 | additive-number-theory |
| `lattice-visualizer` | lattice-visualizer | slider | 2d | 4 | elliptic-curves, modular-forms, riemann-surfaces, theta-functions |
| `modular-arithmetic-clock` | modular-arithmetic-clock | slider | 2d | 4 | additive-number-theory, frobenius-and-reciprocity, p-adic-numbers, quadratic-reciprocity |
| `declarative-host` | declarative-host | interactive | 2d | 3 | additive-number-theory, category-theory |
| `algebraic-curves-canonical-embedding-scrubber` | algebraic-curves-canonical-embedding-scrubber | interact | 2d | 1 | algebraic-curves-higher-genus |
| `algebraic-curves-hyperelliptic-cover` | algebraic-curves-hyperelliptic-cover | interact | 2d | 1 | algebraic-curves-higher-genus |
| `algebraic-curves-jacobian-lattice` | algebraic-curves-jacobian-lattice | interact | 2d | 1 | algebraic-curves-higher-genus |
| `algebraic-curves-moduli-boundary` | algebraic-curves-moduli-boundary | interact | 2d | 1 | algebraic-curves-higher-genus |
| `algebraic-curves-riemann-hurwitz-cover` | algebraic-curves-riemann-hurwitz-cover | interact | 2d | 1 | algebraic-curves-higher-genus |
| `algebraic-curves-riemann-roch-scrubber` | algebraic-curves-riemann-roch-scrubber | interact | 2d | 1 | algebraic-curves-higher-genus |
| `algebraic-de-rham-betti-comparison-scrubber` | algebraic-de-rham-betti-comparison-scrubber | interact | 2d | 1 | algebraic-de-rham-cohomology |
| `algebraic-de-rham-complex-scrubber` | algebraic-de-rham-complex-scrubber | interact | 2d | 1 | algebraic-de-rham-cohomology |
| `algebraic-de-rham-curve-clickable` | algebraic-de-rham-curve-clickable | interact | 2d | 1 | algebraic-de-rham-cohomology |
| `algebraic-de-rham-hodge-diamond-clickgraph` | algebraic-de-rham-hodge-diamond-clickgraph | interact | 2d | 1 | algebraic-de-rham-cohomology |
| `algebraic-de-rham-hodge-filtration-scrubber` | algebraic-de-rham-hodge-filtration-scrubber | interact | 2d | 1 | algebraic-de-rham-cohomology |
| `algebraic-de-rham-hodge-pn-explorer` | algebraic-de-rham-hodge-pn-explorer | interact | 2d | 1 | algebraic-de-rham-cohomology |
| `algebraic-de-rham-hodge-sandbox` | algebraic-de-rham-hodge-sandbox | interact | 2d | 1 | algebraic-de-rham-cohomology |
| `algebraic-de-rham-kahler-scrubber` | algebraic-de-rham-kahler-scrubber | interact | 2d | 1 | algebraic-de-rham-cohomology |
| `algebraic-spaces-definition-diagram` | clickable-diagram | click | 2d | 1 | algebraic-spaces |
| `algebraic-spaces-etale-equivalence` | clickable-graph | click | 2d | 1 | algebraic-spaces |
| `algebraic-spaces-hironaka-scrubber` | proof-scrubber | scrub | 2d | 1 | algebraic-spaces |
| `algebraic-spaces-morphisms-diagram` | clickable-diagram | click | 2d | 1 | algebraic-spaces |
| `algebraic-spaces-scheme-stack-hierarchy` | clickable-diagram | click | 2d | 1 | algebraic-spaces |
| `algebraic-spaces-why-scrubber` | proof-scrubber | scrub | 2d | 1 | algebraic-spaces |
| `class-field-theory-reciprocity-dictionary` | svg-illustration | read | 2d | 1 | class-field-theory |
| `cocartesian-fibrations-edge-scrubber` | cocartesian-fibrations-edge-scrubber | interact | 2d | 1 | cocartesian-fibrations |
| `cocartesian-fibrations-examples-graph` | cocartesian-fibrations-examples-graph | interact | 2d | 1 | cocartesian-fibrations |
| `cocartesian-fibrations-fibration-clickable` | cocartesian-fibrations-fibration-clickable | interact | 2d | 1 | cocartesian-fibrations |
| `cocartesian-fibrations-grothendieck-codecell` | cocartesian-fibrations-grothendieck-codecell | interact | 2d | 1 | cocartesian-fibrations |
| `cocartesian-fibrations-grothendieck-scrubber` | cocartesian-fibrations-grothendieck-scrubber | interact | 2d | 1 | cocartesian-fibrations |
| `cocartesian-fibrations-leftright-scrubber` | cocartesian-fibrations-leftright-scrubber | interact | 2d | 1 | cocartesian-fibrations |
| `cocartesian-fibrations-transport-clickable` | cocartesian-fibrations-transport-clickable | interact | 2d | 1 | cocartesian-fibrations |
| `cocartesian-fibrations-universal-leftfib` | cocartesian-fibrations-universal-leftfib | interact | 2d | 1 | cocartesian-fibrations |
| `commutative-algebra-artinian-local` | parametric-plot | select | 2d | 1 | commutative-algebra |
| `commutative-algebra-flatness` | parametric-plot | select | 2d | 1 | commutative-algebra |
| `commutative-algebra-ideal-lattice` | clickable-graph | click | 2d | 1 | commutative-algebra |
| `commutative-algebra-integral-extensions` | parametric-plot | select | 2d | 1 | commutative-algebra |
| `commutative-algebra-krull-dimension` | parametric-plot | select | 2d | 1 | commutative-algebra |
| `commutative-algebra-localization` | parametric-plot | select | 2d | 1 | commutative-algebra |
| `commutative-algebra-nakayama` | parametric-plot | select | 2d | 1 | commutative-algebra |
| `commutative-algebra-noetherian` | parametric-plot | select | 2d | 1 | commutative-algebra |
| `commutative-algebra-prime-vs-maximal` | clickable-diagram | click | 2d | 1 | commutative-algebra |
| `commutative-algebra-radicals` | parametric-plot | select | 2d | 1 | commutative-algebra |
| `commutative-algebra-tensor` | clickable-diagram | click | 2d | 1 | commutative-algebra |
| `commutative-algebra-transcendence-degree` | parametric-plot | select | 2d | 1 | commutative-algebra |
| `commutative-algebra-zariski-spec` | clickable-diagram | click | 2d | 1 | commutative-algebra |
| `composition-explorer` | clickable-diagram | click | 2d | 1 | category-theory |
| `constraint-bifurcation-explorer` | constraint-bifurcation-explorer | slider | 2d | 1 | real-analysis |
| `counterexample-explorer` | counterexample-explorer | select | 2d | 1 | point-set-topology |
| `deformation-theory-cotangent-scrubber` | proof-scrubber | scrub | 2d | 1 | deformation-theory |
| `deformation-theory-curve-sandbox` | svg-illustration | interact | 2d | 1 | deformation-theory |
| `deformation-theory-first-order-scrubber` | proof-scrubber | scrub | 2d | 1 | deformation-theory |
| `deformation-theory-genus-tangent` | parametric-plot | slide | 2d | 1 | deformation-theory |
| `deformation-theory-obstruction-graph` | clickable-graph | click | 2d | 1 | deformation-theory |
| `deformation-theory-schlessinger-diagram` | svg-illustration | read | 2d | 1 | deformation-theory |
| `deformation-theory-tangent-clickable` | clickable-diagram | click | 2d | 1 | deformation-theory |
| `derived-categories-chain-homotopy` | clickable-diagram | click | 2d | 1 | derived-categories |
| `derived-categories-derived-functor-scrubber` | proof-scrubber | scrub | 2d | 1 | derived-categories |
| `derived-categories-fourier-mukai` | clickable-diagram | click | 2d | 1 | derived-categories |
| `derived-categories-qis-scrubber` | proof-scrubber | scrub | 2d | 1 | derived-categories |
| `derived-categories-roof` | clickable-diagram | click | 2d | 1 | derived-categories |
| `derived-categories-t-structure` | clickable-diagram | click | 2d | 1 | derived-categories |
| `derived-categories-triangle` | clickable-diagram | click | 2d | 1 | derived-categories |
| `elementary-topos-theory-axioms-scrub` | declarative-host | click | 2d | 1 | elementary-topos-theory |
| `elementary-topos-theory-chi-pullback` | declarative-host | click | 2d | 1 | elementary-topos-theory |
| `elementary-topos-theory-geom-graph` | declarative-host | click | 2d | 1 | elementary-topos-theory |
| `elementary-topos-theory-gset-graph` | declarative-host | click | 2d | 1 | elementary-topos-theory |
| `elementary-topos-theory-omega-scrub` | declarative-host | click | 2d | 1 | elementary-topos-theory |
| `elementary-topos-theory-power-scrub` | declarative-host | click | 2d | 1 | elementary-topos-theory |
| `elementary-topos-theory-sieves-graph` | declarative-host | click | 2d | 1 | elementary-topos-theory |
| `etale-fundamental-group-cmp-square` | declarative-host | click | 2d | 1 | etale-fundamental-group |
| `etale-fundamental-group-fet-cover` | declarative-host | click | 2d | 1 | etale-fundamental-group |
| `etale-fundamental-group-fiber-functor` | declarative-host | click | 2d | 1 | etale-fundamental-group |
| `etale-fundamental-group-frob-clock` | declarative-host | click | 2d | 1 | etale-fundamental-group |
| `etale-fundamental-group-galois-equiv` | declarative-host | click | 2d | 1 | etale-fundamental-group |
| `etale-fundamental-group-pi1-construct` | declarative-host | click | 2d | 1 | etale-fundamental-group |
| `galois-quintic-unsolvability` | proof-scrubber | scrub | 2d | 1 | galois |
| `grothendieck-topologies-sites-axioms-scrub` | declarative-host | click | 2d | 1 | grothendieck-topologies-sites |
| `grothendieck-topologies-sites-geom-comp` | declarative-host | click | 2d | 1 | grothendieck-topologies-sites |
| `grothendieck-topologies-sites-giraud` | declarative-host | click | 2d | 1 | grothendieck-topologies-sites |
| `grothendieck-topologies-sites-sheaf-cases` | declarative-host | click | 2d | 1 | grothendieck-topologies-sites |
| `grothendieck-topologies-sites-sieves-poset` | declarative-host | click | 2d | 1 | grothendieck-topologies-sites |
| `grothendieck-topologies-sites-sites-toggle` | declarative-host | click | 2d | 1 | grothendieck-topologies-sites |
| `group-schemes-axiom-diagrams` | clickable-diagram | click | 2d | 1 | group-schemes |
| `group-schemes-etale-connected-decomposition` | clickable-graph | click | 2d | 1 | group-schemes |
| `group-schemes-hopf-duality` | clickable-diagram | click | 2d | 1 | group-schemes |
| `group-schemes-hopf-scrubber` | proof-scrubber | scrub | 2d | 1 | group-schemes |
| `group-schemes-lie-algebra-scrubber` | proof-scrubber | scrub | 2d | 1 | group-schemes |
| `group-schemes-mu-n-add` | modular-arithmetic-clock | drag | 2d | 1 | group-schemes |
| `group-schemes-mu-n-clock` | modular-arithmetic-clock | drag | 2d | 1 | group-schemes |
| `group-schemes-torsor-cases` | counterexample-explorer | click | 2d | 1 | group-schemes |
| `heyting-algebras-toposes-geometric-composition` | clickable-diagram | click | 2d | 1 | heyting-algebras-toposes |
| `heyting-algebras-toposes-heyting-clickable` | clickable-diagram | click | 2d | 1 | heyting-algebras-toposes |
| `heyting-algebras-toposes-internal-language-dictionary` | clickable-diagram | click | 2d | 1 | heyting-algebras-toposes |
| `heyting-algebras-toposes-kripke-joyal-scrub` | proof-scrubber | scrub | 2d | 1 | heyting-algebras-toposes |
| `heyting-algebras-toposes-lem-cases` | clickable-diagram | click | 2d | 1 | heyting-algebras-toposes |
| `heyting-algebras-toposes-omega-heyting-scrub` | proof-scrubber | scrub | 2d | 1 | heyting-algebras-toposes |
| `infinity-categories-adjunction-triangles` | clickable-diagram | click | 2d | 1 | infinity-categories |
| `infinity-categories-cone` | clickable-diagram | click | 2d | 1 | infinity-categories |
| `infinity-categories-functor-levels` | clickable-diagram | click | 2d | 1 | infinity-categories |
| `infinity-categories-h-construction` | proof-scrubber | scrub | 2d | 1 | infinity-categories |
| `infinity-categories-homotopy-2simplex` | svg-illustration | read | 2d | 1 | infinity-categories |
| `infinity-categories-kan-pointwise` | proof-scrubber | scrub | 2d | 1 | infinity-categories |
| `infinity-categories-quasi-category-build` | proof-scrubber | scrub | 2d | 1 | infinity-categories |
| `infinity-topoi-etale-spec-z` | clickable-diagram | click | 2d | 1 | infinity-topoi |
| `infinity-topoi-geometric-morphism` | clickable-diagram | click | 2d | 1 | infinity-topoi |
| `infinity-topoi-giraud-axioms` | clickable-diagram | click | 2d | 1 | infinity-topoi |
| `infinity-topoi-hott-sandbox` | inline-code-cell | edit | 2d | 1 | infinity-topoi |
| `infinity-topoi-hypercompletion-cases` | counterexample-explorer | click | 2d | 1 | infinity-topoi |
| `infinity-topoi-lex-localization` | proof-scrubber | scrub | 2d | 1 | infinity-topoi |
| `infinity-topoi-presheaf-universal` | proof-scrubber | scrub | 2d | 1 | infinity-topoi |
| `infinity-topoi-univalent-universes` | clickable-diagram | click | 2d | 1 | infinity-topoi |
| `infinity-topoi-whitehead-internal` | proof-scrubber | scrub | 2d | 1 | infinity-topoi |
| `inline-code-cell` | inline-code-cell | edit | 2d | 1 | p-adic-numbers |
| `intersection-theory-chow-chern-multiplicativity` | parametric-plot | select | 2d | 1 | intersection-theory-chow |
| `intersection-theory-chow-cycles-rational-equivalence` | clickable-diagram | click | 2d | 1 | intersection-theory-chow |
| `intersection-theory-chow-grr-scrub` | proof-scrubber | scrub | 2d | 1 | intersection-theory-chow |
| `intersection-theory-chow-intersection-product` | clickable-diagram | click | 2d | 1 | intersection-theory-chow |
| `intersection-theory-chow-orbits` | parametric-plot | select | 2d | 1 | intersection-theory-chow |
| `intersection-theory-chow-pn-ring` | parametric-plot | select | 2d | 1 | intersection-theory-chow |
| `natural-transformation-explorer` | naturality-square | slider+click | 2d | 1 | category-theory |
| `proof-scrubber` | proof-scrubber | timeline | 2d | 1 | algebraic-topology |
| `recurrence-plotter` | recurrence-plotter | slider | 2d | 1 | dynamical-systems |
| `simplicial-sets-delta-generators` | clickable-diagram | click | 2d | 1 | simplicial-sets-and-nerve |
| `simplicial-sets-faces-degeneracies` | clickable-diagram | click | 2d | 1 | simplicial-sets-and-nerve |
| `simplicial-sets-horns-stepper` | button-stepper | step | 2d | 1 | simplicial-sets-and-nerve |
| `simplicial-sets-inner-horn-filler` | button-stepper | click | 2d | 1 | simplicial-sets-and-nerve |
| `simplicial-sets-nerve-2simplex` | clickable-diagram | click | 2d | 1 | simplicial-sets-and-nerve |
| `simplicial-sets-realization-stepper` | button-stepper | step | 2d | 1 | simplicial-sets-and-nerve |
| `branching-proof-scrubber` | branching-proof-scrubber | branching-timeline | 2d | 0 | _(none — fixture-only)_ |
| `diagram-editor` | diagram-editor | drag-and-toggle | 2d | 0 | _(none — fixture-only)_ |
| `julia-playground` | julia-playground | slider | 2d | 0 | _(none — fixture-only)_ |

## Per-subject

### Logic & Foundations

- Topics: **8**, concepts: **49**
- Widgets: **48** (registry-driven: 4, inline: 44)
  - by family: unknown: 44, clickable-diagram: 3, button-stepper: 1
  - by dimension: unknown: 44, 2d: 4
  - by gesture: unknown: 44, click: 4
- Quizzes: **162** (v1: 147, hard: 15, expert: 0)
  - by type: mcq: 128, numeric: 34

### Algebra & homological

- Topics: **12**, concepts: **106**
- Widgets: **104** (registry-driven: 73, inline: 31)
  - by family: button-stepper: 38, unknown: 31, clickable-diagram: 21, parametric-plot: 9, proof-scrubber: 2, naturality-square: 1, declarative-host: 1, clickable-graph: 1
  - by dimension: 2d: 73, unknown: 31
  - by gesture: click: 60, unknown: 31, select: 9, scrub: 2, slider+click: 1, interactive: 1
- Quizzes: **505** (v1: 319, hard: 186, expert: 0)
  - by type: mcq: 318, numeric: 145, multi-select: 20, ordering: 7, matching: 5, spot-the-error: 5, proof-completion: 4, complex: 1

### Higher categories & toposes

- Topics: **7**, concepts: **45**
- Widgets: **49** (registry-driven: 49, inline: 0)
  - by family: clickable-diagram: 14, declarative-host: 13, proof-scrubber: 8, button-stepper: 3, svg-illustration: 1, cocartesian-fibrations-leftright-scrubber: 1, cocartesian-fibrations-edge-scrubber: 1, cocartesian-fibrations-fibration-clickable: 1, cocartesian-fibrations-transport-clickable: 1, cocartesian-fibrations-grothendieck-scrubber: 1, cocartesian-fibrations-universal-leftfib: 1, cocartesian-fibrations-grothendieck-codecell: 1, cocartesian-fibrations-examples-graph: 1, counterexample-explorer: 1, inline-code-cell: 1
  - by dimension: 2d: 49
  - by gesture: click: 29, scrub: 8, interact: 8, step: 2, read: 1, edit: 1
- Quizzes: **183** (v1: 135, hard: 48, expert: 0)
  - by type: mcq: 139, multi-select: 24, numeric: 8, matching: 6, spot-the-error: 5, ordering: 1

### Analysis

- Topics: **13**, concepts: **134**
- Widgets: **94** (registry-driven: 70, inline: 24)
  - by family: button-stepper: 37, clickable-diagram: 31, unknown: 24, constraint-bifurcation-explorer: 1, recurrence-plotter: 1
  - by dimension: 2d: 70, unknown: 24
  - by gesture: click: 68, unknown: 24, slider: 2
- Quizzes: **525** (v1: 340, hard: 185, expert: 0)
  - by type: mcq: 321, numeric: 134, multi-select: 15, complex: 14, matching: 14, ordering: 12, proof-completion: 9, spot-the-error: 4, construction: 1, guess-my-rule: 1

### Probability & statistics

- Topics: **6**, concepts: **41**
- Widgets: **39** (registry-driven: 10, inline: 29)
  - by family: unknown: 29, button-stepper: 10
  - by dimension: unknown: 29, 2d: 10
  - by gesture: unknown: 29, click: 10
- Quizzes: **160** (v1: 123, hard: 24, expert: 13)
  - by type: mcq: 108, numeric: 42, multi-select: 2, matching: 2, proof-completion: 2, construction: 1, complex: 1, ordering: 1, spot-the-error: 1

### Geometry & topology

- Topics: **15**, concepts: **91**
- Widgets: **93** (registry-driven: 51, inline: 42)
  - by family: unknown: 42, button-stepper: 34, surface-viewer: 6, clickable-diagram: 4, clickable-graph: 2, svg-illustration: 2, counterexample-explorer: 1, proof-scrubber: 1, lattice-visualizer: 1
  - by dimension: 2d: 45, unknown: 42, 3d: 6
  - by gesture: unknown: 42, click: 40, drag: 6, static: 2, select: 1, timeline: 1, slider: 1
- Quizzes: **415** (v1: 273, hard: 142, expert: 0)
  - by type: mcq: 281, numeric: 118, complex: 7, multi-select: 4, matching: 3, ordering: 1, proof-completion: 1

### Number theory

- Topics: **13**, concepts: **84**
- Widgets: **103** (registry-driven: 84, inline: 19)
  - by family: button-stepper: 66, unknown: 19, clickable-diagram: 4, modular-arithmetic-clock: 4, input-form: 4, declarative-host: 2, proof-scrubber: 1, inline-code-cell: 1, clickable-graph: 1, svg-illustration: 1
  - by dimension: 2d: 84, unknown: 19
  - by gesture: click: 71, unknown: 19, slider: 4, input: 4, interactive: 2, scrub: 1, edit: 1, read: 1
- Quizzes: **427** (v1: 244, hard: 183, expert: 0)
  - by type: mcq: 285, numeric: 135, complex: 3, matching: 2, ordering: 1, guess-my-rule: 1

### Modular forms & L-functions

- Topics: **16**, concepts: **85**
- Widgets: **119** (registry-driven: 100, inline: 19)
  - by family: button-stepper: 89, unknown: 19, parametric-plot: 5, svg-illustration: 4, lattice-visualizer: 2
  - by dimension: 2d: 100, unknown: 19
  - by gesture: click: 89, unknown: 19, slider: 7, static: 4
- Quizzes: **450** (v1: 255, hard: 195, expert: 0)
  - by type: mcq: 296, numeric: 148, multi-select: 4, matching: 1, ordering: 1

### Algebraic geometry

- Topics: **19**, concepts: **109**
- Widgets: **127** (registry-driven: 127, inline: 0)
  - by family: button-stepper: 61, clickable-diagram: 23, proof-scrubber: 7, clickable-graph: 6, declarative-host: 6, parametric-plot: 4, modular-arithmetic-clock: 2, svg-illustration: 2, lattice-visualizer: 1, algebraic-curves-riemann-hurwitz-cover: 1, algebraic-curves-jacobian-lattice: 1, algebraic-curves-riemann-roch-scrubber: 1, algebraic-curves-canonical-embedding-scrubber: 1, algebraic-curves-hyperelliptic-cover: 1, algebraic-curves-moduli-boundary: 1, algebraic-de-rham-kahler-scrubber: 1, algebraic-de-rham-complex-scrubber: 1, algebraic-de-rham-betti-comparison-scrubber: 1, algebraic-de-rham-hodge-filtration-scrubber: 1, algebraic-de-rham-hodge-diamond-clickgraph: 1, algebraic-de-rham-hodge-pn-explorer: 1, algebraic-de-rham-curve-clickable: 1, algebraic-de-rham-hodge-sandbox: 1, counterexample-explorer: 1
  - by dimension: 2d: 127
  - by gesture: click: 97, interact: 15, scrub: 7, select: 3, drag: 2, slider: 1, read: 1, slide: 1
- Quizzes: **572** (v1: 327, hard: 245, expert: 0)
  - by type: mcq: 344, numeric: 186, multi-select: 16, matching: 11, spot-the-error: 7, ordering: 4, complex: 3, proof-completion: 1

### Combinatorics & graph theory

- Topics: **6**, concepts: **39**
- Widgets: **39** (registry-driven: 0, inline: 39)
  - by family: unknown: 39
  - by dimension: unknown: 39
  - by gesture: unknown: 39
- Quizzes: **117** (v1: 117, hard: 0, expert: 0)
  - by type: mcq: 80, numeric: 27, multi-select: 10

## Per-topic

- `symplectic-manifolds` (Geometry & topology) — concepts=6, widgets=6 (slug=0), quiz=18 (v1=18, hard=0, expert=0)
- `quantum-groups` (Algebra & homological) — concepts=6, widgets=6 (slug=0), quiz=18 (v1=18, hard=0, expert=0)
- `quaternions-octonions-and-division-algebras` (Algebra & homological) — concepts=6, widgets=6 (slug=0), quiz=18 (v1=18, hard=0, expert=0)
- `geometric-and-combinatorial-group-theory` (Algebra & homological) — concepts=6, widgets=0 (slug=0), quiz=18 (v1=18, hard=0, expert=0)
- `wavelets` (Analysis) — concepts=6, widgets=0 (slug=0), quiz=18 (v1=18, hard=0, expert=0)
- `vertex-operator-algebras` (Modular forms & L-functions) — concepts=6, widgets=6 (slug=0), quiz=18 (v1=18, hard=0, expert=0)
- `schrodinger-equation` (Analysis) — concepts=6, widgets=0 (slug=0), quiz=18 (v1=18, hard=0, expert=0)
- `mathematics-and-cryptography` (Number theory) — concepts=6, widgets=6 (slug=0), quiz=18 (v1=18, hard=0, expert=0)
- `knot-polynomials` (Geometry & topology) — concepts=6, widgets=6 (slug=0), quiz=18 (v1=18, hard=0, expert=0)
- `ricci-flow` (Geometry & topology) — concepts=6, widgets=6 (slug=0), quiz=18 (v1=18, hard=0, expert=0)
- `k-theory` (Geometry & topology) — concepts=6, widgets=6 (slug=0), quiz=18 (v1=18, hard=0, expert=0)
- `atiyah-singer-index-theorem` (Geometry & topology) — concepts=6, widgets=6 (slug=0), quiz=18 (v1=18, hard=0, expert=0)
- `naive-set-theory` (Logic & Foundations) — concepts=5, widgets=4 (slug=4), quiz=30 (v1=15, hard=15, expert=0)
- `first-order-logic-and-completeness` (Logic & Foundations) — concepts=7, widgets=7 (slug=0), quiz=21 (v1=21, hard=0, expert=0)
- `zfc-and-ordinals` (Logic & Foundations) — concepts=7, widgets=7 (slug=0), quiz=21 (v1=21, hard=0, expert=0)
- `model-theory-basics` (Logic & Foundations) — concepts=6, widgets=6 (slug=0), quiz=18 (v1=18, hard=0, expert=0)
- `computability-and-decidability` (Logic & Foundations) — concepts=6, widgets=6 (slug=0), quiz=18 (v1=18, hard=0, expert=0)
- `complexity-theory` (Logic & Foundations) — concepts=6, widgets=6 (slug=0), quiz=18 (v1=18, hard=0, expert=0)
- `type-theory-and-hott` (Logic & Foundations) — concepts=6, widgets=6 (slug=0), quiz=18 (v1=18, hard=0, expert=0)
- `forcing-and-independence` (Logic & Foundations) — concepts=6, widgets=6 (slug=0), quiz=18 (v1=18, hard=0, expert=0)
- `algebra` (Algebra & homological) — concepts=12, widgets=12 (slug=12), quiz=73 (v1=36, hard=37, expert=0)
- `category-theory` (Algebra & homological) — concepts=12, widgets=17 (slug=17), quiz=72 (v1=36, hard=36, expert=0)
- `representation-theory` (Algebra & homological) — concepts=13, widgets=13 (slug=13), quiz=74 (v1=39, hard=35, expert=0)
- `commutative-algebra` (Algebra & homological) — concepts=13, widgets=13 (slug=13), quiz=75 (v1=40, hard=35, expert=0)
- `homological` (Algebra & homological) — concepts=12, widgets=11 (slug=11), quiz=73 (v1=36, hard=37, expert=0)
- `derived-categories` (Algebra & homological) — concepts=7, widgets=7 (slug=7), quiz=27 (v1=21, hard=6, expert=0)
- `group-cohomology` (Algebra & homological) — concepts=7, widgets=7 (slug=0), quiz=21 (v1=21, hard=0, expert=0)
- `lie-algebras` (Algebra & homological) — concepts=6, widgets=6 (slug=0), quiz=18 (v1=18, hard=0, expert=0)
- `galois-cohomology-and-brauer` (Algebra & homological) — concepts=6, widgets=6 (slug=0), quiz=18 (v1=18, hard=0, expert=0)
- `elementary-topos-theory` (Higher categories & toposes) — concepts=7, widgets=7 (slug=7), quiz=27 (v1=21, hard=6, expert=0)
- `heyting-algebras-toposes` (Higher categories & toposes) — concepts=6, widgets=6 (slug=6), quiz=24 (v1=18, hard=6, expert=0)
- `grothendieck-topologies-sites` (Higher categories & toposes) — concepts=6, widgets=6 (slug=6), quiz=24 (v1=18, hard=6, expert=0)
- `simplicial-sets-and-nerve` (Higher categories & toposes) — concepts=6, widgets=6 (slug=6), quiz=24 (v1=18, hard=6, expert=0)
- `infinity-categories` (Higher categories & toposes) — concepts=6, widgets=7 (slug=7), quiz=24 (v1=18, hard=6, expert=0)
- `cocartesian-fibrations` (Higher categories & toposes) — concepts=7, widgets=8 (slug=8), quiz=31 (v1=21, hard=10, expert=0)
- `infinity-topoi` (Higher categories & toposes) — concepts=7, widgets=9 (slug=9), quiz=29 (v1=21, hard=8, expert=0)
- `real-analysis` (Analysis) — concepts=14, widgets=15 (slug=15), quiz=71 (v1=42, hard=29, expert=0)
- `measure-theory` (Analysis) — concepts=12, widgets=12 (slug=12), quiz=72 (v1=36, hard=36, expert=0)
- `complex-analysis` (Analysis) — concepts=26, widgets=7 (slug=7), quiz=28 (v1=16, hard=12, expert=0)
- `functional-analysis` (Analysis) — concepts=12, widgets=11 (slug=11), quiz=72 (v1=36, hard=36, expert=0)
- `operator-algebras` (Analysis) — concepts=12, widgets=12 (slug=12), quiz=72 (v1=36, hard=36, expert=0)
- `dynamical-systems` (Analysis) — concepts=13, widgets=13 (slug=13), quiz=75 (v1=39, hard=36, expert=0)
- `sobolev-spaces-distributions` (Analysis) — concepts=7, widgets=7 (slug=0), quiz=21 (v1=21, hard=0, expert=0)
- `harmonic-analysis-fourier` (Analysis) — concepts=8, widgets=5 (slug=0), quiz=24 (v1=24, hard=0, expert=0)
- `partial-differential-equations` (Analysis) — concepts=6, widgets=6 (slug=0), quiz=18 (v1=18, hard=0, expert=0)
- `harmonic-functions` (Analysis) — concepts=6, widgets=6 (slug=0), quiz=18 (v1=18, hard=0, expert=0)
- `spectral-theory` (Analysis) — concepts=6, widgets=0 (slug=0), quiz=18 (v1=18, hard=0, expert=0)
- `probability-theory` (Probability & statistics) — concepts=12, widgets=10 (slug=10), quiz=73 (v1=36, hard=24, expert=13)
- `stochastic-processes-and-martingales` (Probability & statistics) — concepts=6, widgets=6 (slug=0), quiz=18 (v1=18, hard=0, expert=0)
- `stochastic-calculus` (Probability & statistics) — concepts=6, widgets=6 (slug=0), quiz=18 (v1=18, hard=0, expert=0)
- `random-walks-and-mixing` (Probability & statistics) — concepts=6, widgets=6 (slug=0), quiz=18 (v1=18, hard=0, expert=0)
- `information-theory` (Probability & statistics) — concepts=6, widgets=6 (slug=0), quiz=18 (v1=18, hard=0, expert=0)
- `large-deviations` (Probability & statistics) — concepts=5, widgets=5 (slug=0), quiz=15 (v1=15, hard=0, expert=0)
- `point-set-topology` (Geometry & topology) — concepts=6, widgets=7 (slug=7), quiz=36 (v1=18, hard=18, expert=0)
- `algebraic-topology` (Geometry & topology) — concepts=6, widgets=6 (slug=6), quiz=32 (v1=18, hard=14, expert=0)
- `smooth-manifolds` (Geometry & topology) — concepts=10, widgets=9 (slug=9), quiz=59 (v1=30, hard=29, expert=0)
- `differential-forms` (Geometry & topology) — concepts=5, widgets=0 (slug=0), quiz=30 (v1=15, hard=15, expert=0)
- `differential-geometry` (Geometry & topology) — concepts=5, widgets=9 (slug=9), quiz=30 (v1=15, hard=15, expert=0)
- `riemannian-geometry` (Geometry & topology) — concepts=5, widgets=7 (slug=7), quiz=30 (v1=15, hard=15, expert=0)
- `lie-groups` (Geometry & topology) — concepts=7, widgets=6 (slug=6), quiz=42 (v1=21, hard=21, expert=0)
- `riemann-surfaces` (Geometry & topology) — concepts=5, widgets=7 (slug=7), quiz=30 (v1=15, hard=15, expert=0)
- `characteristic-classes` (Geometry & topology) — concepts=6, widgets=6 (slug=0), quiz=18 (v1=18, hard=0, expert=0)
- `morse-theory` (Geometry & topology) — concepts=6, widgets=6 (slug=0), quiz=18 (v1=18, hard=0, expert=0)
- `galois` (Number theory) — concepts=8, widgets=6 (slug=6), quiz=30 (v1=15, hard=15, expert=0)
- `quadratic-reciprocity` (Number theory) — concepts=6, widgets=7 (slug=7), quiz=33 (v1=18, hard=15, expert=0)
- `quadratic-forms-genus-theory` (Number theory) — concepts=5, widgets=6 (slug=6), quiz=30 (v1=15, hard=15, expert=0)
- `additive-number-theory` (Number theory) — concepts=15, widgets=20 (slug=20), quiz=91 (v1=46, hard=45, expert=0)
- `algebraic-number-theory` (Number theory) — concepts=5, widgets=6 (slug=6), quiz=30 (v1=15, hard=15, expert=0)
- `p-adic-numbers` (Number theory) — concepts=5, widgets=10 (slug=10), quiz=30 (v1=15, hard=15, expert=0)
- `adeles-and-ideles` (Number theory) — concepts=5, widgets=5 (slug=5), quiz=30 (v1=15, hard=15, expert=0)
- `frobenius-and-reciprocity` (Number theory) — concepts=5, widgets=7 (slug=7), quiz=30 (v1=15, hard=15, expert=0)
- `class-field-theory` (Number theory) — concepts=6, widgets=8 (slug=8), quiz=36 (v1=18, hard=18, expert=0)
- `heights-arithmetic-geometry` (Number theory) — concepts=7, widgets=7 (slug=0), quiz=21 (v1=21, hard=0, expert=0)
- `analytic-number-theory` (Number theory) — concepts=6, widgets=6 (slug=0), quiz=18 (v1=18, hard=0, expert=0)
- `upper-half-plane-hyperbolic` (Modular forms & L-functions) — concepts=5, widgets=7 (slug=7), quiz=30 (v1=15, hard=15, expert=0)
- `modular-forms` (Modular forms & L-functions) — concepts=6, widgets=8 (slug=8), quiz=33 (v1=18, hard=15, expert=0)
- `theta-functions` (Modular forms & L-functions) — concepts=5, widgets=8 (slug=8), quiz=30 (v1=15, hard=15, expert=0)
- `partitions-generating-functions` (Modular forms & L-functions) — concepts=5, widgets=7 (slug=7), quiz=30 (v1=15, hard=15, expert=0)
- `hecke-operators` (Modular forms & L-functions) — concepts=5, widgets=8 (slug=8), quiz=30 (v1=15, hard=15, expert=0)
- `dirichlet-series-euler-products` (Modular forms & L-functions) — concepts=5, widgets=10 (slug=10), quiz=30 (v1=15, hard=15, expert=0)
- `analytic-continuation` (Modular forms & L-functions) — concepts=5, widgets=6 (slug=6), quiz=30 (v1=15, hard=15, expert=0)
- `zeta-values` (Modular forms & L-functions) — concepts=5, widgets=5 (slug=5), quiz=30 (v1=15, hard=15, expert=0)
- `L-functions` (Modular forms & L-functions) — concepts=5, widgets=9 (slug=9), quiz=30 (v1=15, hard=15, expert=0)
- `galois-representations` (Number theory) — concepts=5, widgets=9 (slug=9), quiz=30 (v1=15, hard=15, expert=0)
- `moonshine` (Modular forms & L-functions) — concepts=5, widgets=5 (slug=5), quiz=30 (v1=15, hard=15, expert=0)
- `automorphic-forms-adelic` (Modular forms & L-functions) — concepts=7, widgets=7 (slug=0), quiz=21 (v1=21, hard=0, expert=0)
- `modular-curves` (Modular forms & L-functions) — concepts=6, widgets=6 (slug=0), quiz=18 (v1=18, hard=0, expert=0)
- `projective-plane` (Algebraic geometry) — concepts=5, widgets=7 (slug=7), quiz=30 (v1=15, hard=15, expert=0)
- `bezout` (Algebraic geometry) — concepts=5, widgets=7 (slug=7), quiz=30 (v1=15, hard=15, expert=0)
- `schemes` (Algebraic geometry) — concepts=10, widgets=8 (slug=8), quiz=60 (v1=30, hard=30, expert=0)
- `sheaves` (Algebraic geometry) — concepts=7, widgets=7 (slug=7), quiz=42 (v1=21, hard=21, expert=0)
- `morphisms-fiber-products` (Algebraic geometry) — concepts=5, widgets=7 (slug=7), quiz=30 (v1=15, hard=15, expert=0)
- `functor-of-points` (Algebraic geometry) — concepts=5, widgets=7 (slug=7), quiz=30 (v1=15, hard=15, expert=0)
- `elliptic-curves` (Algebraic geometry) — concepts=5, widgets=1 (slug=1), quiz=30 (v1=15, hard=15, expert=0)
- `singular-cubics-reduction` (Algebraic geometry) — concepts=5, widgets=8 (slug=8), quiz=30 (v1=15, hard=15, expert=0)
- `algebraic-curves-higher-genus` (Algebraic geometry) — concepts=6, widgets=6 (slug=6), quiz=25 (v1=18, hard=7, expert=0)
- `sheaf-cohomology` (Algebraic geometry) — concepts=5, widgets=6 (slug=6), quiz=30 (v1=15, hard=15, expert=0)
- `algebraic-de-rham-cohomology` (Algebraic geometry) — concepts=6, widgets=8 (slug=8), quiz=24 (v1=18, hard=6, expert=0)
- `moduli-spaces` (Algebraic geometry) — concepts=5, widgets=6 (slug=6), quiz=30 (v1=15, hard=15, expert=0)
- `algebraic-spaces` (Algebraic geometry) — concepts=6, widgets=6 (slug=6), quiz=24 (v1=18, hard=6, expert=0)
- `stacks` (Algebraic geometry) — concepts=5, widgets=7 (slug=7), quiz=30 (v1=15, hard=15, expert=0)
- `intersection-theory-chow` (Algebraic geometry) — concepts=6, widgets=6 (slug=6), quiz=25 (v1=18, hard=7, expert=0)
- `group-schemes` (Algebraic geometry) — concepts=6, widgets=8 (slug=8), quiz=24 (v1=18, hard=6, expert=0)
- `etale-fundamental-group` (Algebraic geometry) — concepts=6, widgets=6 (slug=6), quiz=24 (v1=18, hard=6, expert=0)
- `deformation-theory` (Algebraic geometry) — concepts=6, widgets=7 (slug=7), quiz=24 (v1=18, hard=6, expert=0)
- `spectral-graph-theory` (Combinatorics & graph theory) — concepts=7, widgets=7 (slug=0), quiz=21 (v1=21, hard=0, expert=0)
- `matroid-theory` (Combinatorics & graph theory) — concepts=7, widgets=7 (slug=0), quiz=21 (v1=21, hard=0, expert=0)
- `probabilistic-method` (Combinatorics & graph theory) — concepts=7, widgets=7 (slug=0), quiz=21 (v1=21, hard=0, expert=0)
- `extremal-combinatorics` (Combinatorics & graph theory) — concepts=6, widgets=6 (slug=0), quiz=18 (v1=18, hard=0, expert=0)
- `simplicial-complexes-combinatorial` (Combinatorics & graph theory) — concepts=6, widgets=6 (slug=0), quiz=18 (v1=18, hard=0, expert=0)
- `enumerative-combinatorics` (Combinatorics & graph theory) — concepts=6, widgets=6 (slug=0), quiz=18 (v1=18, hard=0, expert=0)
- `sato-tate` (Modular forms & L-functions) — concepts=5, widgets=9 (slug=9), quiz=30 (v1=15, hard=15, expert=0)
- `bsd` (Modular forms & L-functions) — concepts=5, widgets=9 (slug=9), quiz=30 (v1=15, hard=15, expert=0)
- `modularity-and-flt` (Modular forms & L-functions) — concepts=5, widgets=9 (slug=9), quiz=30 (v1=15, hard=15, expert=0)
- `etale-cohomology` (Algebraic geometry) — concepts=5, widgets=9 (slug=9), quiz=30 (v1=15, hard=15, expert=0)

## Coverage gaps

### Concepts missing a widget in their owning section (top 20)

- `gcgt-presentations` (geometric-and-combinatorial-group-theory)
- `gcgt-cayley-graph` (geometric-and-combinatorial-group-theory)
- `gcgt-quasi-isometry` (geometric-and-combinatorial-group-theory)
- `gcgt-growth` (geometric-and-combinatorial-group-theory)
- `gcgt-hyperbolic-groups` (geometric-and-combinatorial-group-theory)
- `gcgt-applications` (geometric-and-combinatorial-group-theory)
- `w-multiresolution` (wavelets)
- `w-haar-wavelet` (wavelets)
- `w-daubechies` (wavelets)
- `w-discrete-transform` (wavelets)
- `w-wavelet-vs-fourier` (wavelets)
- `w-applications` (wavelets)
- `se-time-dependent` (schrodinger-equation)
- `se-stationary` (schrodinger-equation)
- `se-harmonic-oscillator` (schrodinger-equation)
- `se-hydrogen` (schrodinger-equation)
- `se-scattering` (schrodinger-equation)
- `se-path-integral-preview` (schrodinger-equation)
- `cartesian-product-powerset` (naive-set-theory)
- `axiom-of-choice-intuition` (naive-set-theory)

### Concepts missing a hard-tier quiz (top 20)

- `sm-symplectic-form` (symplectic-manifolds)
- `sm-darboux` (symplectic-manifolds)
- `sm-hamiltonian-flow` (symplectic-manifolds)
- `sm-poisson-bracket` (symplectic-manifolds)
- `sm-lagrangian-submanifolds` (symplectic-manifolds)
- `sm-floer-homology-preview` (symplectic-manifolds)
- `qg-hopf-algebras` (quantum-groups)
- `qg-uq-sl2` (quantum-groups)
- `qg-r-matrix` (quantum-groups)
- `qg-representations` (quantum-groups)
- `qg-knot-invariants` (quantum-groups)
- `qg-applications` (quantum-groups)
- `qoda-quaternions` (quaternions-octonions-and-division-algebras)
- `qoda-rotations` (quaternions-octonions-and-division-algebras)
- `qoda-cayley-dickson` (quaternions-octonions-and-division-algebras)
- `qoda-octonions` (quaternions-octonions-and-division-algebras)
- `qoda-frobenius-theorem` (quaternions-octonions-and-division-algebras)
- `qoda-hurwitz-theorem` (quaternions-octonions-and-division-algebras)
- `gcgt-presentations` (geometric-and-combinatorial-group-theory)
- `gcgt-cayley-graph` (geometric-and-combinatorial-group-theory)
