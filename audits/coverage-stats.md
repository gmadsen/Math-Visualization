# Coverage + type stats — widgets & quizzes

## Corpus totals

- Topics: **130**, concepts: **896**
- Widgets: **921** (registry-driven: 667, inline: 254)
- Quizzes: **3855** (v1: 2619, hard: 1223, expert: 13)
- Quiz types: mcq: 2587, numeric: 1028, multi-select: 96, matching: 44, complex: 29, ordering: 28, spot-the-error: 22, proof-completion: 17, construction: 2, guess-my-rule: 2
- Concepts lacking a widget in their section: **139**
- Concepts lacking a hard-tier quiz: **458**

## Per-slug registry adoption

Every slug registered under `widgets/<slug>/`, with its current adoption
across `content/<topic>.json`. Slugs at **0 instances** are
infrastructure-only — they ship a renderer and a fixture, but no topic
page has wired one in yet.

| slug | family | gesture | dimension | instances | topics |
|---|---|---|---|---:|---|
| `button-stepper` | button-stepper | click | 2d | 339 | L-functions, additive-number-theory, adeles-and-ideles, algebra, algebraic-number-theory, algebraic-topology, analytic-continuation, bezout, bsd, category-theory, class-field-theory, complex-analysis, differential-geometry, dirichlet-series-euler-products, dynamical-systems, etale-cohomology, frobenius-and-reciprocity, functional-analysis, functor-of-points, galois, galois-representations, hecke-operators, homological, lie-groups, measure-theory, modular-forms, modularity-and-flt, moduli-spaces, moonshine, morphisms-fiber-products, naive-set-theory, operator-algebras, p-adic-numbers, partitions-generating-functions, point-set-topology, probability-theory, projective-plane, quadratic-forms-genus-theory, quadratic-reciprocity, representation-theory, riemann-surfaces, riemannian-geometry, sato-tate, schemes, sheaf-cohomology, sheaves, singular-cubics-reduction, smooth-manifolds, stacks, theta-functions, upper-half-plane-hyperbolic, zeta-values |
| `clickable-diagram` | clickable-diagram | click | 2d | 69 | algebra, algebraic-number-theory, algebraic-topology, bezout, category-theory, frobenius-and-reciprocity, functional-analysis, functor-of-points, galois, homological, measure-theory, morphisms-fiber-products, naive-set-theory, operator-algebras, quadratic-reciprocity, real-analysis, riemannian-geometry, schemes, sheaves, stacks |
| `parametric-plot` | parametric-plot | slider | 2d | 11 | analytic-continuation, analytic-number-theory, expanders |
| `schrodinger-figure` | schrodinger-figure | slider | 2d | 7 | schrodinger-equation |
| `clickable-graph` | clickable-graph | click | 2d | 6 | adeles-and-ideles, riemannian-geometry, schemes, sheaves |
| `hamiltonians-figure` | hamiltonians-figure | interact | 2d | 6 | hamiltonians-classical-mechanics |
| `surface-viewer` | surface-viewer | drag | 3d | 6 | differential-geometry, lie-groups |
| `svg-illustration` | svg-illustration | static | 2d | 6 | L-functions, riemann-surfaces |
| `inline-code-cell` | inline-code-cell | edit | 2d | 4 | analytic-number-theory, heights-arithmetic-geometry, p-adic-numbers |
| `input-form` | input-form | input | 2d | 4 | additive-number-theory |
| `lattice-visualizer` | lattice-visualizer | slider | 2d | 4 | elliptic-curves, modular-forms, riemann-surfaces, theta-functions |
| `modular-arithmetic-clock` | modular-arithmetic-clock | slider | 2d | 4 | additive-number-theory, frobenius-and-reciprocity, p-adic-numbers, quadratic-reciprocity |
| `declarative-host` | declarative-host | interactive | 2d | 3 | additive-number-theory, category-theory |
| `counterexample-explorer` | counterexample-explorer | select | 2d | 2 | heights-arithmetic-geometry, point-set-topology |
| `proof-scrubber` | proof-scrubber | timeline | 2d | 2 | algebraic-topology, analytic-number-theory |
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
| `branching-proof-scrubber` | branching-proof-scrubber | branching-timeline | 2d | 1 | galois |
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
| `designs-bibd-calculator` | designs-bibd-calculator | click | 2d | 1 | designs |
| `designs-fano-plane` | designs-fano-plane | click | 2d | 1 | designs |
| `designs-fisher-incidence` | designs-fisher-incidence | step | 2d | 1 | designs |
| `designs-hamming-fano` | designs-hamming-fano | step | 2d | 1 | designs |
| `designs-mols-construction` | designs-mols-construction | click | 2d | 1 | designs |
| `designs-round-robin` | designs-round-robin | step | 2d | 1 | designs |
| `diagram-editor` | diagram-editor | drag-and-toggle | 2d | 1 | homological |
| `elementary-topos-theory-axioms-scrub` | declarative-host | click | 2d | 1 | elementary-topos-theory |
| `elementary-topos-theory-chi-pullback` | declarative-host | click | 2d | 1 | elementary-topos-theory |
| `elementary-topos-theory-geom-graph` | declarative-host | click | 2d | 1 | elementary-topos-theory |
| `elementary-topos-theory-gset-graph` | declarative-host | click | 2d | 1 | elementary-topos-theory |
| `elementary-topos-theory-omega-scrub` | declarative-host | click | 2d | 1 | elementary-topos-theory |
| `elementary-topos-theory-power-scrub` | declarative-host | click | 2d | 1 | elementary-topos-theory |
| `elementary-topos-theory-sieves-graph` | declarative-host | click | 2d | 1 | elementary-topos-theory |
| `enumerative-combinatorics-bijection` | enumerative-combinatorics-bijection | step | 2d | 1 | enumerative-combinatorics |
| `enumerative-combinatorics-genfun` | enumerative-combinatorics-genfun | slider | 2d | 1 | enumerative-combinatorics |
| `enumerative-combinatorics-pascal` | enumerative-combinatorics-pascal | click | 2d | 1 | enumerative-combinatorics |
| `enumerative-combinatorics-perm` | enumerative-combinatorics-perm | click | 2d | 1 | enumerative-combinatorics |
| `enumerative-combinatorics-venn` | enumerative-combinatorics-venn | click | 2d | 1 | enumerative-combinatorics |
| `enumerative-combinatorics-young` | enumerative-combinatorics-young | click | 2d | 1 | enumerative-combinatorics |
| `etale-fundamental-group-cmp-square` | declarative-host | click | 2d | 1 | etale-fundamental-group |
| `etale-fundamental-group-fet-cover` | declarative-host | click | 2d | 1 | etale-fundamental-group |
| `etale-fundamental-group-fiber-functor` | declarative-host | click | 2d | 1 | etale-fundamental-group |
| `etale-fundamental-group-frob-clock` | declarative-host | click | 2d | 1 | etale-fundamental-group |
| `etale-fundamental-group-galois-equiv` | declarative-host | click | 2d | 1 | etale-fundamental-group |
| `etale-fundamental-group-pi1-construct` | declarative-host | click | 2d | 1 | etale-fundamental-group |
| `expanders-vertex-expansion` | expanders-vertex-expansion | click | 2d | 1 | expanders |
| `extremal-combinatorics-erdos-stone` | extremal-combinatorics-erdos-stone | step | 2d | 1 | extremal-combinatorics |
| `extremal-combinatorics-kst` | extremal-combinatorics-kst | slider | 2d | 1 | extremal-combinatorics |
| `extremal-combinatorics-ramsey` | extremal-combinatorics-ramsey | click | 2d | 1 | extremal-combinatorics |
| `extremal-combinatorics-removal` | extremal-combinatorics-removal | slider | 2d | 1 | extremal-combinatorics |
| `extremal-combinatorics-sperner` | extremal-combinatorics-sperner | click | 2d | 1 | extremal-combinatorics |
| `extremal-combinatorics-turan` | extremal-combinatorics-turan | slider | 2d | 1 | extremal-combinatorics |
| `general-relativity-cosmology` | general-relativity-cosmology | slider | 2d | 1 | general-relativity |
| `general-relativity-einstein` | general-relativity-einstein | click | 2d | 1 | general-relativity |
| `general-relativity-gw` | general-relativity-gw | slider | 2d | 1 | general-relativity |
| `general-relativity-kerr` | general-relativity-kerr | slider | 2d | 1 | general-relativity |
| `general-relativity-light-cones` | general-relativity-light-cones | drag | 2d | 1 | general-relativity |
| `general-relativity-schwarzschild` | general-relativity-schwarzschild | slider | 2d | 1 | general-relativity |
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
| `harmonic-convolution` | harmonic-convolution | slider | 2d | 1 | harmonic-analysis-fourier |
| `harmonic-heat-evolution` | harmonic-heat-evolution | slider | 2d | 1 | harmonic-analysis-fourier |
| `harmonic-partial-sum` | harmonic-partial-sum | slider | 2d | 1 | harmonic-analysis-fourier |
| `harmonic-tent-transform` | harmonic-tent-transform | slider | 2d | 1 | harmonic-analysis-fourier |
| `harmonic-uncertainty` | harmonic-uncertainty | slider | 2d | 1 | harmonic-analysis-fourier |
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
| `intersection-theory-chow-chern-multiplicativity` | parametric-plot | select | 2d | 1 | intersection-theory-chow |
| `intersection-theory-chow-cycles-rational-equivalence` | clickable-diagram | click | 2d | 1 | intersection-theory-chow |
| `intersection-theory-chow-grr-scrub` | proof-scrubber | scrub | 2d | 1 | intersection-theory-chow |
| `intersection-theory-chow-intersection-product` | clickable-diagram | click | 2d | 1 | intersection-theory-chow |
| `intersection-theory-chow-orbits` | parametric-plot | select | 2d | 1 | intersection-theory-chow |
| `intersection-theory-chow-pn-ring` | parametric-plot | select | 2d | 1 | intersection-theory-chow |
| `julia-playground` | julia-playground | slider | 2d | 1 | dynamical-systems |
| `matroid-axiom-checker` | matroid-axiom-checker | click | 2d | 1 | matroid-theory |
| `matroid-bases-rank-explorer` | matroid-bases-rank-explorer | slider | 2d | 1 | matroid-theory |
| `matroid-dual-explorer` | matroid-dual-explorer | click | 2d | 1 | matroid-theory |
| `matroid-flats-stepper` | matroid-flats-stepper | step | 2d | 1 | matroid-theory |
| `matroid-graph-forests` | matroid-graph-forests | click | 2d | 1 | matroid-theory |
| `matroid-greedy-vs-nonmatroid` | matroid-greedy-vs-nonmatroid | slider | 2d | 1 | matroid-theory |
| `matroid-tutte-polynomial` | matroid-tutte-polynomial | slider | 2d | 1 | matroid-theory |
| `natural-transformation-explorer` | naturality-square | slider+click | 2d | 1 | category-theory |
| `probabilistic-method-alterations` | probabilistic-method-alterations | click | 2d | 1 | probabilistic-method |
| `probabilistic-method-concentration` | probabilistic-method-concentration | slider | 2d | 1 | probabilistic-method |
| `probabilistic-method-existence` | probabilistic-method-existence | click | 2d | 1 | probabilistic-method |
| `probabilistic-method-linearity` | probabilistic-method-linearity | slider | 2d | 1 | probabilistic-method |
| `probabilistic-method-lll` | probabilistic-method-lll | slider | 2d | 1 | probabilistic-method |
| `probabilistic-method-ramsey` | probabilistic-method-ramsey | slider | 2d | 1 | probabilistic-method |
| `probabilistic-method-threshold` | probabilistic-method-threshold | slider | 2d | 1 | probabilistic-method |
| `recurrence-plotter` | recurrence-plotter | slider | 2d | 1 | dynamical-systems |
| `simplicial-complexes-combinatorial-faces` | simplicial-complexes-combinatorial-faces | click | 2d | 1 | simplicial-complexes-combinatorial |
| `simplicial-complexes-combinatorial-fh` | simplicial-complexes-combinatorial-fh | click | 2d | 1 | simplicial-complexes-combinatorial |
| `simplicial-complexes-combinatorial-nerve` | simplicial-complexes-combinatorial-nerve | slider | 2d | 1 | simplicial-complexes-combinatorial |
| `simplicial-complexes-combinatorial-persistence` | simplicial-complexes-combinatorial-persistence | slider | 2d | 1 | simplicial-complexes-combinatorial |
| `simplicial-complexes-combinatorial-shell` | simplicial-complexes-combinatorial-shell | click | 2d | 1 | simplicial-complexes-combinatorial |
| `simplicial-complexes-combinatorial-sr` | simplicial-complexes-combinatorial-sr | click | 2d | 1 | simplicial-complexes-combinatorial |
| `simplicial-sets-delta-generators` | clickable-diagram | click | 2d | 1 | simplicial-sets-and-nerve |
| `simplicial-sets-faces-degeneracies` | clickable-diagram | click | 2d | 1 | simplicial-sets-and-nerve |
| `simplicial-sets-horns-stepper` | button-stepper | step | 2d | 1 | simplicial-sets-and-nerve |
| `simplicial-sets-inner-horn-filler` | button-stepper | click | 2d | 1 | simplicial-sets-and-nerve |
| `simplicial-sets-nerve-2simplex` | clickable-diagram | click | 2d | 1 | simplicial-sets-and-nerve |
| `simplicial-sets-realization-stepper` | button-stepper | step | 2d | 1 | simplicial-sets-and-nerve |
| `sobolev-embedding-exponent` | sobolev-embedding-exponent | slider | 2d | 1 | sobolev-spaces-distributions |
| `sobolev-fractional-power` | sobolev-fractional-power | slider | 2d | 1 | sobolev-spaces-distributions |
| `sobolev-newtonian-potential` | sobolev-newtonian-potential | slider | 2d | 1 | sobolev-spaces-distributions |
| `sobolev-pairing` | sobolev-pairing | slider | 2d | 1 | sobolev-spaces-distributions |
| `sobolev-trace` | sobolev-trace | slider | 2d | 1 | sobolev-spaces-distributions |
| `sobolev-variational` | sobolev-variational | slider | 2d | 1 | sobolev-spaces-distributions |
| `sobolev-weak-derivative` | sobolev-weak-derivative | click | 2d | 1 | sobolev-spaces-distributions |
| `spectral-graph-theory-adjacency` | spectral-graph-theory-adjacency | click | 2d | 1 | spectral-graph-theory |
| `spectral-graph-theory-bipartite` | spectral-graph-theory-bipartite | click | 2d | 1 | spectral-graph-theory |
| `spectral-graph-theory-cheeger` | spectral-graph-theory-cheeger | slider | 2d | 1 | spectral-graph-theory |
| `spectral-graph-theory-clustering` | spectral-graph-theory-clustering | step | 2d | 1 | spectral-graph-theory |
| `spectral-graph-theory-components` | spectral-graph-theory-components | click | 2d | 1 | spectral-graph-theory |
| `spectral-graph-theory-fiedler` | spectral-graph-theory-fiedler | click | 2d | 1 | spectral-graph-theory |
| `spectral-graph-theory-random-walk` | spectral-graph-theory-random-walk | step | 2d | 1 | spectral-graph-theory |
| `three-body-halo-orbits` | three-body-halo-orbits | click | 2d | 1 | three-body-problem |
| `three-body-horseshoe` | three-body-horseshoe | click | 2d | 1 | three-body-problem |
| `three-body-kam-tori` | three-body-kam-tori | slider | 2d | 1 | three-body-problem |
| `three-body-lagrange-points` | three-body-lagrange-points | slider | 2d | 1 | three-body-problem |
| `three-body-nbody-simulator` | three-body-nbody-simulator | click | 2d | 1 | three-body-problem |
| `three-body-special-solutions` | three-body-special-solutions | click | 2d | 1 | three-body-problem |

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
- Widgets: **105** (registry-driven: 74, inline: 31)
  - by family: button-stepper: 38, unknown: 31, clickable-diagram: 21, parametric-plot: 9, proof-scrubber: 2, naturality-square: 1, declarative-host: 1, clickable-graph: 1, diagram-editor: 1
  - by dimension: 2d: 74, unknown: 31
  - by gesture: click: 60, unknown: 31, select: 9, scrub: 2, slider+click: 1, interactive: 1, drag-and-toggle: 1
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

- Topics: **15**, concepts: **149**
- Widgets: **107** (registry-driven: 83, inline: 24)
  - by family: button-stepper: 37, clickable-diagram: 31, unknown: 24, constraint-bifurcation-explorer: 1, recurrence-plotter: 1, julia-playground: 1, sobolev-pairing: 1, sobolev-weak-derivative: 1, sobolev-fractional-power: 1, sobolev-embedding-exponent: 1, sobolev-trace: 1, sobolev-newtonian-potential: 1, sobolev-variational: 1, harmonic-partial-sum: 1, harmonic-tent-transform: 1, harmonic-convolution: 1, harmonic-uncertainty: 1, harmonic-heat-evolution: 1
  - by dimension: 2d: 83, unknown: 24
  - by gesture: click: 69, unknown: 24, slider: 14
- Quizzes: **570** (v1: 385, hard: 185, expert: 0)
  - by type: mcq: 358, numeric: 142, multi-select: 15, complex: 14, matching: 14, ordering: 12, proof-completion: 9, spot-the-error: 4, construction: 1, guess-my-rule: 1

### Probability & statistics

- Topics: **8**, concepts: **53**
- Widgets: **51** (registry-driven: 10, inline: 41)
  - by family: unknown: 41, button-stepper: 10
  - by dimension: unknown: 41, 2d: 10
  - by gesture: unknown: 41, click: 10
- Quizzes: **196** (v1: 159, hard: 24, expert: 13)
  - by type: mcq: 137, numeric: 49, multi-select: 2, matching: 2, proof-completion: 2, construction: 1, complex: 1, ordering: 1, spot-the-error: 1

### Geometry & topology

- Topics: **16**, concepts: **102**
- Widgets: **104** (registry-driven: 51, inline: 53)
  - by family: unknown: 53, button-stepper: 34, surface-viewer: 6, clickable-diagram: 4, clickable-graph: 2, svg-illustration: 2, counterexample-explorer: 1, proof-scrubber: 1, lattice-visualizer: 1
  - by dimension: unknown: 53, 2d: 45, 3d: 6
  - by gesture: unknown: 53, click: 40, drag: 6, static: 2, select: 1, timeline: 1, slider: 1
- Quizzes: **448** (v1: 306, hard: 142, expert: 0)
  - by type: mcq: 310, numeric: 122, complex: 7, multi-select: 4, matching: 3, ordering: 1, proof-completion: 1

### Number theory

- Topics: **14**, concepts: **97**
- Widgets: **110** (registry-driven: 91, inline: 19)
  - by family: button-stepper: 66, unknown: 19, clickable-diagram: 4, modular-arithmetic-clock: 4, input-form: 4, inline-code-cell: 4, declarative-host: 2, parametric-plot: 2, branching-proof-scrubber: 1, clickable-graph: 1, svg-illustration: 1, counterexample-explorer: 1, proof-scrubber: 1
  - by dimension: 2d: 91, unknown: 19
  - by gesture: click: 71, unknown: 19, slider: 6, input: 4, edit: 4, interactive: 2, branching-timeline: 1, read: 1, select: 1, timeline: 1
- Quizzes: **466** (v1: 283, hard: 183, expert: 0)
  - by type: mcq: 315, numeric: 144, complex: 3, matching: 2, ordering: 1, guess-my-rule: 1

### Modular forms & L-functions

- Topics: **16**, concepts: **93**
- Widgets: **127** (registry-driven: 103, inline: 24)
  - by family: button-stepper: 92, unknown: 24, parametric-plot: 5, svg-illustration: 4, lattice-visualizer: 2
  - by dimension: 2d: 103, unknown: 24
  - by gesture: click: 92, unknown: 24, slider: 7, static: 4
- Quizzes: **474** (v1: 279, hard: 195, expert: 0)
  - by type: mcq: 312, numeric: 156, multi-select: 4, matching: 1, ordering: 1

### Algebraic geometry

- Topics: **22**, concepts: **127**
- Widgets: **144** (registry-driven: 127, inline: 17)
  - by family: button-stepper: 61, clickable-diagram: 23, unknown: 17, proof-scrubber: 7, clickable-graph: 6, declarative-host: 6, parametric-plot: 4, modular-arithmetic-clock: 2, svg-illustration: 2, lattice-visualizer: 1, algebraic-curves-riemann-hurwitz-cover: 1, algebraic-curves-jacobian-lattice: 1, algebraic-curves-riemann-roch-scrubber: 1, algebraic-curves-canonical-embedding-scrubber: 1, algebraic-curves-hyperelliptic-cover: 1, algebraic-curves-moduli-boundary: 1, algebraic-de-rham-kahler-scrubber: 1, algebraic-de-rham-complex-scrubber: 1, algebraic-de-rham-betti-comparison-scrubber: 1, algebraic-de-rham-hodge-filtration-scrubber: 1, algebraic-de-rham-hodge-diamond-clickgraph: 1, algebraic-de-rham-hodge-pn-explorer: 1, algebraic-de-rham-curve-clickable: 1, algebraic-de-rham-hodge-sandbox: 1, counterexample-explorer: 1
  - by dimension: 2d: 127, unknown: 17
  - by gesture: click: 97, unknown: 17, interact: 15, scrub: 7, select: 3, drag: 2, slider: 1, read: 1, slide: 1
- Quizzes: **626** (v1: 381, hard: 245, expert: 0)
  - by type: mcq: 396, numeric: 187, multi-select: 17, matching: 11, spot-the-error: 7, ordering: 4, complex: 3, proof-completion: 1

### Combinatorics & graph theory

- Topics: **8**, concepts: **51**
- Widgets: **51** (registry-driven: 50, inline: 1)
  - by family: parametric-plot: 4, designs-bibd-calculator: 1, designs-fisher-incidence: 1, designs-fano-plane: 1, designs-mols-construction: 1, designs-hamming-fano: 1, designs-round-robin: 1, expanders-vertex-expansion: 1, unknown: 1, spectral-graph-theory-adjacency: 1, spectral-graph-theory-components: 1, spectral-graph-theory-fiedler: 1, spectral-graph-theory-cheeger: 1, spectral-graph-theory-random-walk: 1, spectral-graph-theory-bipartite: 1, spectral-graph-theory-clustering: 1, matroid-axiom-checker: 1, matroid-bases-rank-explorer: 1, matroid-graph-forests: 1, matroid-flats-stepper: 1, matroid-dual-explorer: 1, matroid-greedy-vs-nonmatroid: 1, matroid-tutte-polynomial: 1, probabilistic-method-existence: 1, probabilistic-method-ramsey: 1, probabilistic-method-linearity: 1, probabilistic-method-alterations: 1, probabilistic-method-lll: 1, probabilistic-method-threshold: 1, probabilistic-method-concentration: 1, extremal-combinatorics-turan: 1, extremal-combinatorics-kst: 1, extremal-combinatorics-erdos-stone: 1, extremal-combinatorics-ramsey: 1, extremal-combinatorics-sperner: 1, extremal-combinatorics-removal: 1, simplicial-complexes-combinatorial-faces: 1, simplicial-complexes-combinatorial-fh: 1, simplicial-complexes-combinatorial-nerve: 1, simplicial-complexes-combinatorial-shell: 1, simplicial-complexes-combinatorial-sr: 1, simplicial-complexes-combinatorial-persistence: 1, enumerative-combinatorics-pascal: 1, enumerative-combinatorics-venn: 1, enumerative-combinatorics-genfun: 1, enumerative-combinatorics-perm: 1, enumerative-combinatorics-young: 1, enumerative-combinatorics-bijection: 1
  - by dimension: 2d: 50, unknown: 1
  - by gesture: click: 23, slider: 19, step: 8, unknown: 1
- Quizzes: **153** (v1: 153, hard: 0, expert: 0)
  - by type: mcq: 112, numeric: 31, multi-select: 10

### Mathematical physics

- Topics: **4**, concepts: **24**
- Widgets: **25** (registry-driven: 25, inline: 0)
  - by family: schrodinger-figure: 7, hamiltonians-figure: 6, general-relativity-light-cones: 1, general-relativity-einstein: 1, general-relativity-schwarzschild: 1, general-relativity-kerr: 1, general-relativity-cosmology: 1, general-relativity-gw: 1, three-body-nbody-simulator: 1, three-body-lagrange-points: 1, three-body-special-solutions: 1, three-body-horseshoe: 1, three-body-kam-tori: 1, three-body-halo-orbits: 1
  - by dimension: 2d: 25
  - by gesture: slider: 13, interact: 6, click: 5, drag: 1
- Quizzes: **72** (v1: 72, hard: 0, expert: 0)
  - by type: mcq: 62, numeric: 10

## Per-topic

- `mathematical-statistics` (Probability & statistics) — concepts=6, widgets=6 (slug=0), quiz=18 (v1=18, hard=0, expert=0)
- `numerical-analysis` (Analysis) — concepts=6, widgets=6 (slug=0), quiz=18 (v1=18, hard=0, expert=0)
- `computational-number-theory` (Number theory) — concepts=6, widgets=0 (slug=0), quiz=18 (v1=18, hard=0, expert=0)
- `variational-methods` (Analysis) — concepts=6, widgets=6 (slug=0), quiz=18 (v1=18, hard=0, expert=0)
- `fixed-point-theorems` (Analysis) — concepts=6, widgets=0 (slug=0), quiz=18 (v1=18, hard=0, expert=0)
- `calabi-yau-manifolds` (Algebraic geometry) — concepts=6, widgets=6 (slug=0), quiz=18 (v1=18, hard=0, expert=0)
- `high-dimensional-geometry` (Probability & statistics) — concepts=6, widgets=6 (slug=0), quiz=18 (v1=18, hard=0, expert=0)
- `mirror-symmetry` (Algebraic geometry) — concepts=6, widgets=6 (slug=0), quiz=18 (v1=18, hard=0, expert=0)
- `mostow-rigidity` (Geometry & topology) — concepts=6, widgets=6 (slug=0), quiz=18 (v1=18, hard=0, expert=0)
- `resolution-of-singularities` (Algebraic geometry) — concepts=6, widgets=5 (slug=0), quiz=18 (v1=18, hard=0, expert=0)
- `hamiltonians-classical-mechanics` (Mathematical physics) — concepts=6, widgets=6 (slug=6), quiz=18 (v1=18, hard=0, expert=0)
- `general-relativity` (Mathematical physics) — concepts=6, widgets=6 (slug=6), quiz=18 (v1=18, hard=0, expert=0)
- `three-body-problem` (Mathematical physics) — concepts=6, widgets=6 (slug=6), quiz=18 (v1=18, hard=0, expert=0)
- `designs` (Combinatorics & graph theory) — concepts=6, widgets=6 (slug=6), quiz=18 (v1=18, hard=0, expert=0)
- `expanders` (Combinatorics & graph theory) — concepts=6, widgets=6 (slug=5), quiz=18 (v1=18, hard=0, expert=0)
- `symplectic-manifolds` (Geometry & topology) — concepts=6, widgets=6 (slug=0), quiz=18 (v1=18, hard=0, expert=0)
- `quantum-groups` (Algebra & homological) — concepts=6, widgets=6 (slug=0), quiz=18 (v1=18, hard=0, expert=0)
- `quaternions-octonions-and-division-algebras` (Algebra & homological) — concepts=6, widgets=6 (slug=0), quiz=18 (v1=18, hard=0, expert=0)
- `geometric-and-combinatorial-group-theory` (Algebra & homological) — concepts=6, widgets=0 (slug=0), quiz=18 (v1=18, hard=0, expert=0)
- `wavelets` (Analysis) — concepts=6, widgets=0 (slug=0), quiz=18 (v1=18, hard=0, expert=0)
- `vertex-operator-algebras` (Modular forms & L-functions) — concepts=6, widgets=6 (slug=0), quiz=18 (v1=18, hard=0, expert=0)
- `schrodinger-equation` (Mathematical physics) — concepts=6, widgets=7 (slug=7), quiz=18 (v1=18, hard=0, expert=0)
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
- `homological` (Algebra & homological) — concepts=12, widgets=12 (slug=12), quiz=73 (v1=36, hard=37, expert=0)
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
- `dynamical-systems` (Analysis) — concepts=13, widgets=14 (slug=14), quiz=75 (v1=39, hard=36, expert=0)
- `sobolev-spaces-distributions` (Analysis) — concepts=7, widgets=7 (slug=7), quiz=21 (v1=21, hard=0, expert=0)
- `harmonic-analysis-fourier` (Analysis) — concepts=8, widgets=5 (slug=5), quiz=24 (v1=24, hard=0, expert=0)
- `partial-differential-equations` (Analysis) — concepts=6, widgets=6 (slug=0), quiz=18 (v1=18, hard=0, expert=0)
- `harmonic-functions` (Analysis) — concepts=6, widgets=6 (slug=0), quiz=18 (v1=18, hard=0, expert=0)
- `spectral-theory` (Analysis) — concepts=9, widgets=0 (slug=0), quiz=27 (v1=27, hard=0, expert=0)
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
- `characteristic-classes` (Geometry & topology) — concepts=9, widgets=9 (slug=0), quiz=27 (v1=27, hard=0, expert=0)
- `morse-theory` (Geometry & topology) — concepts=8, widgets=8 (slug=0), quiz=24 (v1=24, hard=0, expert=0)
- `galois` (Number theory) — concepts=8, widgets=6 (slug=6), quiz=30 (v1=15, hard=15, expert=0)
- `quadratic-reciprocity` (Number theory) — concepts=6, widgets=7 (slug=7), quiz=33 (v1=18, hard=15, expert=0)
- `quadratic-forms-genus-theory` (Number theory) — concepts=5, widgets=6 (slug=6), quiz=30 (v1=15, hard=15, expert=0)
- `additive-number-theory` (Number theory) — concepts=15, widgets=20 (slug=20), quiz=91 (v1=46, hard=45, expert=0)
- `algebraic-number-theory` (Number theory) — concepts=5, widgets=6 (slug=6), quiz=30 (v1=15, hard=15, expert=0)
- `p-adic-numbers` (Number theory) — concepts=5, widgets=10 (slug=10), quiz=30 (v1=15, hard=15, expert=0)
- `adeles-and-ideles` (Number theory) — concepts=5, widgets=5 (slug=5), quiz=30 (v1=15, hard=15, expert=0)
- `frobenius-and-reciprocity` (Number theory) — concepts=5, widgets=7 (slug=7), quiz=30 (v1=15, hard=15, expert=0)
- `class-field-theory` (Number theory) — concepts=6, widgets=8 (slug=8), quiz=36 (v1=18, hard=18, expert=0)
- `heights-arithmetic-geometry` (Number theory) — concepts=10, widgets=10 (slug=3), quiz=30 (v1=30, hard=0, expert=0)
- `analytic-number-theory` (Number theory) — concepts=10, widgets=10 (slug=4), quiz=30 (v1=30, hard=0, expert=0)
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
- `moonshine` (Modular forms & L-functions) — concepts=8, widgets=8 (slug=8), quiz=39 (v1=24, hard=15, expert=0)
- `automorphic-forms-adelic` (Modular forms & L-functions) — concepts=9, widgets=9 (slug=0), quiz=27 (v1=27, hard=0, expert=0)
- `modular-curves` (Modular forms & L-functions) — concepts=9, widgets=9 (slug=0), quiz=27 (v1=27, hard=0, expert=0)
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
- `spectral-graph-theory` (Combinatorics & graph theory) — concepts=7, widgets=7 (slug=7), quiz=21 (v1=21, hard=0, expert=0)
- `matroid-theory` (Combinatorics & graph theory) — concepts=7, widgets=7 (slug=7), quiz=21 (v1=21, hard=0, expert=0)
- `probabilistic-method` (Combinatorics & graph theory) — concepts=7, widgets=7 (slug=7), quiz=21 (v1=21, hard=0, expert=0)
- `extremal-combinatorics` (Combinatorics & graph theory) — concepts=6, widgets=6 (slug=6), quiz=18 (v1=18, hard=0, expert=0)
- `simplicial-complexes-combinatorial` (Combinatorics & graph theory) — concepts=6, widgets=6 (slug=6), quiz=18 (v1=18, hard=0, expert=0)
- `enumerative-combinatorics` (Combinatorics & graph theory) — concepts=6, widgets=6 (slug=6), quiz=18 (v1=18, hard=0, expert=0)
- `sato-tate` (Modular forms & L-functions) — concepts=5, widgets=9 (slug=9), quiz=30 (v1=15, hard=15, expert=0)
- `bsd` (Modular forms & L-functions) — concepts=5, widgets=9 (slug=9), quiz=30 (v1=15, hard=15, expert=0)
- `modularity-and-flt` (Modular forms & L-functions) — concepts=5, widgets=9 (slug=9), quiz=30 (v1=15, hard=15, expert=0)
- `etale-cohomology` (Algebraic geometry) — concepts=5, widgets=9 (slug=9), quiz=30 (v1=15, hard=15, expert=0)

## Coverage gaps

### Concepts missing a widget in their owning section (top 20)

- `cnt-primality` (computational-number-theory)
- `cnt-factoring` (computational-number-theory)
- `cnt-lattice-reduction` (computational-number-theory)
- `cnt-modular-arithmetic-algorithms` (computational-number-theory)
- `cnt-elliptic-curves-computation` (computational-number-theory)
- `cnt-class-group-computation` (computational-number-theory)
- `fpt-banach` (fixed-point-theorems)
- `fpt-brouwer` (fixed-point-theorems)
- `fpt-schauder` (fixed-point-theorems)
- `fpt-lefschetz` (fixed-point-theorems)
- `fpt-kakutani` (fixed-point-theorems)
- `fpt-applications` (fixed-point-theorems)
- `ros-applications` (resolution-of-singularities)
- `gcgt-presentations` (geometric-and-combinatorial-group-theory)
- `gcgt-cayley-graph` (geometric-and-combinatorial-group-theory)
- `gcgt-quasi-isometry` (geometric-and-combinatorial-group-theory)
- `gcgt-growth` (geometric-and-combinatorial-group-theory)
- `gcgt-hyperbolic-groups` (geometric-and-combinatorial-group-theory)
- `gcgt-applications` (geometric-and-combinatorial-group-theory)
- `w-multiresolution` (wavelets)

### Concepts missing a hard-tier quiz (top 20)

- `ms-estimators` (mathematical-statistics)
- `ms-mle` (mathematical-statistics)
- `ms-cramer-rao` (mathematical-statistics)
- `ms-hypothesis-testing` (mathematical-statistics)
- `ms-bayesian` (mathematical-statistics)
- `ms-asymptotics` (mathematical-statistics)
- `na-floating-point` (numerical-analysis)
- `na-rootfinding` (numerical-analysis)
- `na-quadrature` (numerical-analysis)
- `na-linear-systems` (numerical-analysis)
- `na-finite-differences` (numerical-analysis)
- `na-finite-elements` (numerical-analysis)
- `cnt-primality` (computational-number-theory)
- `cnt-factoring` (computational-number-theory)
- `cnt-lattice-reduction` (computational-number-theory)
- `cnt-modular-arithmetic-algorithms` (computational-number-theory)
- `cnt-elliptic-curves-computation` (computational-number-theory)
- `cnt-class-group-computation` (computational-number-theory)
- `vm-functional-derivative` (variational-methods)
- `vm-euler-lagrange` (variational-methods)
