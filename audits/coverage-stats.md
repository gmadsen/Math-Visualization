# Coverage + type stats — widgets & quizzes

## Corpus totals

- Topics: **211**, concepts: **1446**
- Widgets: **1684** (registry-driven: 1684, inline: 0)
- Quizzes: **5530** (v1: 4294, hard: 1223, expert: 13)
- Quiz types: mcq: 3648, numeric: 1305, multi-select: 277, matching: 107, ordering: 86, spot-the-error: 53, complex: 29, proof-completion: 21, construction: 2, guess-my-rule: 2
- Concepts lacking a widget in their span: **5** (anchor→next-anchor reading-order span; see "Coverage gaps" for the list)
- Concepts lacking a hard-tier quiz: **1008**
- Topics offering a direct-manipulation gesture: **68** of **211** with widgets (32%); the rest are scrub/pick only — see "Gesture-variety watchlist"

## Per-slug registry adoption

Every slug registered under `widgets/<slug>/`, with its current adoption
across `content/<topic>.json`. Slugs at **0 instances** are
infrastructure-only — they ship a renderer and a fixture, but no topic
page has wired one in yet.

| slug | family | gesture | dimension | instances | topics |
|---|---|---|---|---:|---|
| `button-stepper` | button-stepper | click | 2d | 393 | L-functions, additive-number-theory, adeles-and-ideles, algebra, algebraic-k-theory-foundations, algebraic-number-theory, algebraic-topology, analytic-continuation, bezout, brill-noether, bsd, category-theory, class-field-theory, cluster-algebras, cohomology-and-duality, combinatorial-optimization, complex-analysis, condensed-mathematics, conformal-and-cr-geometry, differential-geometry, dirac-equation, dirichlet-series-euler-products, donaldson-thomas-and-gw-invariants, dynamical-systems, etale-cohomology, frobenius-and-reciprocity, functional-analysis, functor-of-points, galois, galois-representations, gauge-theory, geometric-invariant-theory, hecke-operators, homological, klein-gordon-equation, lie-groups, mathematical-biology, mathematical-chaos, mathematical-finance, measure-theory, mmp-and-birational-geometry, model-categories, modular-forms, modularity-and-flt, moduli-spaces, moonshine, morphisms-fiber-products, naive-set-theory, operator-algebras, p-adic-numbers, partitions-generating-functions, point-set-topology, positivity-and-ample-line-bundles, probability-theory, projective-plane, quadratic-forms-genus-theory, quadratic-reciprocity, quantum-field-theory, random-matrix-theory, representation-theory, riemann-surfaces, riemannian-geometry, sato-tate, schemes, several-complex-variables, sheaf-cohomology, sheaves, singular-cubics-reduction, smooth-manifolds, spectral-theory, stacks, statistical-mechanics, theta-functions, toric-varieties, upper-half-plane-hyperbolic, zeta-values |
| `slider-svg-2d` | slider-readout | slider | 2d | 274 | abelian-varieties, algebraic-k-theory-foundations, algebraic-number-theory, algebraic-topology, arithmetic-statistics, brill-noether, cluster-algebras, cobordism, coding-theory, cohomology-and-duality, combinatorial-optimization, complex-multiplication, computational-molecular-biology, computational-number-theory, condensed-mathematics, conformal-and-cr-geometry, continued-fractions, convex-geometry, convex-optimization, crystalline-cohomology, d-modules, dirac-equation, dirichlet-unit-theorem, donaldson-thomas-and-gw-invariants, elliptic-curves, fixed-point-theorems, gauge-theory, geometric-and-combinatorial-group-theory, geometric-invariant-theory, geometric-measure-theory, groebner-bases, half-integral-weight-forms, heegaard-floer, homotopy-theory, iwasawa-theory, kahler-geometry, kalman-filtering-and-state-estimation, khovanov-homology, klein-gordon-equation, maass-forms, mapping-class-groups, mathematical-biology, mathematical-chaos, mathematical-finance, microlocal-analysis, mmp-and-birational-geometry, model-categories, optimal-control-and-dynamic-programming, positive-characteristic-ag, positivity-and-ample-line-bundles, quantum-field-theory, random-matrix-theory, semigroup-theory-evolution-equations, several-complex-variables, shimura-varieties, special-relativity, spectral-methods-data, spectral-theory, statistical-mechanics, string-theory, surgery-theory, topological-data-analysis, tropical-geometry, wavelets |
| `parametric-plot` | parametric-plot | slider | 2d | 131 | algebraic-combinatorics, analytic-continuation, analytic-number-theory, causal-inference, deep-learning-theory, diffusion-and-score-based-models, ergodic-theory, expanders, game-theory, graph-theory-fundamentals, information-geometry, integrable-systems, kernel-methods-and-rkhs, markov-decision-processes, optimal-transport, order-theory-and-lattices, polytopes-and-ehrhart, pomdps-and-belief-states, probabilistic-graphical-models, quantum-information, ramsey-theory, reinforcement-learning, statistical-learning-theory |
| `clickable-diagram` | clickable-diagram | click | 2d | 100 | abelian-varieties, algebra, algebraic-number-theory, algebraic-topology, bezout, category-theory, cluster-algebras, conformal-and-cr-geometry, fixed-point-theorems, frobenius-and-reciprocity, functional-analysis, functor-of-points, galois, gauge-theory, geometric-invariant-theory, homological, kalman-filtering-and-state-estimation, mapping-class-groups, measure-theory, morphisms-fiber-products, naive-set-theory, operator-algebras, positive-characteristic-ag, positivity-and-ample-line-bundles, quadratic-reciprocity, real-analysis, riemannian-geometry, schemes, sheaves, stacks, string-theory, topological-data-analysis, toric-varieties, tropical-geometry, wavelets |
| `draggable-points-2d` | draggable-points-2d | drag | 2d | 11 | complex-analysis, convex-geometry, information-geometry, kalman-filtering-and-state-estimation, kernel-methods-and-rkhs, mathematical-statistics, numerical-analysis, optimal-transport, projective-plane, spectral-methods-data, topological-data-analysis |
| `vector-field-flow-2d` | vector-field-flow-2d | click-seed | 2d | 8 | deep-learning-theory, diffusion-and-score-based-models, dynamical-systems, mathematical-biology |
| `schrodinger-figure` | schrodinger-figure | slider | 2d | 7 | schrodinger-equation |
| `clickable-graph` | clickable-graph | click | 2d | 6 | adeles-and-ideles, riemannian-geometry, schemes, sheaves |
| `hamiltonians-figure` | hamiltonians-figure | interact | 2d | 6 | hamiltonians-classical-mechanics |
| `inline-code-cell` | inline-code-cell | edit | 2d | 6 | analytic-number-theory, convex-optimization, heights-arithmetic-geometry, mathematical-chaos, p-adic-numbers |
| `surface-viewer` | surface-viewer | drag | 3d | 6 | differential-geometry, lie-groups |
| `svg-illustration` | svg-illustration | static | 2d | 6 | L-functions, riemann-surfaces |
| `animated-svg-2d` | animated-svg-2d | play | 2d | 5 | combinatorial-optimization, convex-optimization, markov-decision-processes, numerical-analysis, probability-theory |
| `graph-edit-2d` | graph-edit-2d | graph-edit | 2d | 5 | expanders, extremal-combinatorics, graph-theory-fundamentals, spectral-graph-theory |
| `surface-3d` | surface-3d | drag | 3d | 5 | general-relativity, harmonic-functions, riemannian-geometry, smooth-manifolds, variational-methods |
| `input-form` | input-form | input | 2d | 4 | additive-number-theory |
| `lattice-visualizer` | lattice-visualizer | slider | 2d | 4 | elliptic-curves, modular-forms, riemann-surfaces, theta-functions |
| `modular-arithmetic-clock` | modular-arithmetic-clock | slider | 2d | 4 | additive-number-theory, frobenius-and-reciprocity, p-adic-numbers, quadratic-reciprocity |
| `sketch-curve-2d` | sketch-curve-2d | draw | 2d | 4 | convex-optimization, real-analysis |
| `declarative-host` | declarative-host | interactive | 2d | 3 | additive-number-theory, category-theory |
| `proof-scrubber` | proof-scrubber | timeline | 2d | 3 | algebraic-topology, analytic-number-theory, mathematical-chaos |
| `advanced-complex-analysis-picard` | advanced-complex-analysis-picard | interact | 2d | 2 | advanced-complex-analysis |
| `algorithm-stepper` | algorithm-stepper | step-state | 2d | 2 | computational-number-theory, continued-fractions |
| `counterexample-explorer` | counterexample-explorer | select | 2d | 2 | heights-arithmetic-geometry, point-set-topology |
| `eigenvector-explorer-2d` | eigenvector-explorer-2d | drag-direction | 2d | 2 | differential-geometry, dynamical-systems |
| `recurrence-plotter` | recurrence-plotter | slider | 2d | 2 | dynamical-systems, mathematical-chaos |
| `sampling-box` | sampling-box | shake-sample | 2d | 2 | probability-theory |
| `xy-parameter-pad` | xy-parameter-pad | two-param-scrub | 2d | 2 | dynamical-systems, statistical-mechanics |
| `aca-bergman-kernel-disk` | aca-figure | click | 2d | 1 | advanced-complex-analysis |
| `aca-bloch-disk` | aca-figure | slider | 2d | 1 | advanced-complex-analysis |
| `aca-hartogs-shell` | aca-figure | slider | 2d | 1 | advanced-complex-analysis |
| `aca-nevanlinna-characteristic` | aca-figure | slider | 2d | 1 | advanced-complex-analysis |
| `aca-quasiconformal-warp` | aca-figure | slider | 2d | 1 | advanced-complex-analysis |
| `advanced-complex-analysis-hardy-spaces` | advanced-complex-analysis-hardy-spaces | interact | 2d | 1 | advanced-complex-analysis |
| `advanced-complex-analysis-landscape` | advanced-complex-analysis-landscape | interact | 2d | 1 | advanced-complex-analysis |
| `advanced-complex-analysis-mittag-leffler` | advanced-complex-analysis-mittag-leffler | interact | 2d | 1 | advanced-complex-analysis |
| `advanced-complex-analysis-phragmen-lindelof` | advanced-complex-analysis-phragmen-lindelof | interact | 2d | 1 | advanced-complex-analysis |
| `advanced-complex-analysis-three-circles` | advanced-complex-analysis-three-circles | interact | 2d | 1 | advanced-complex-analysis |
| `advanced-complex-analysis-weierstrass` | advanced-complex-analysis-weierstrass | interact | 2d | 1 | advanced-complex-analysis |
| `algebra-field-tower` | algebra-field-tower | select | 2d | 1 | algebra |
| `algebra-ring-ideals` | algebra-ring-ideals | interact | 2d | 1 | algebra |
| `algebra-structures` | algebra-structures | select | 2d | 1 | algebra |
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
| `ant-bombieri-vinogradov` | ant-bombieri-vinogradov | slider | 2d | 1 | analytic-number-theory |
| `ant-dirichlet-residue-wheel` | ant-dirichlet-residue-wheel | slider | 2d | 1 | analytic-number-theory |
| `ant-explicit-formula` | ant-explicit-formula | slider | 2d | 1 | analytic-number-theory |
| `ant-pnt-comparison` | ant-pnt-comparison | slider | 2d | 1 | analytic-number-theory |
| `ant-sieve-truncation` | ant-sieve-truncation | slider | 2d | 1 | analytic-number-theory |
| `ant-waring-finiteness` | ant-waring-finiteness | click | 2d | 1 | additive-number-theory |
| `ant-zero-free-region` | ant-zero-free-region | slider | 2d | 1 | analytic-number-theory |
| `atiyah-singer-anomaly` | atiyah-singer-anomaly | slider | 2d | 1 | atiyah-singer-index-theorem |
| `atiyah-singer-cases` | atiyah-singer-cases | pick | 2d | 1 | atiyah-singer-index-theorem |
| `atiyah-singer-ch-td` | atiyah-singer-ch-td | slider | 2d | 1 | atiyah-singer-index-theorem |
| `atiyah-singer-dirac-sphere` | atiyah-singer-dirac-sphere | slider | 2d | 1 | atiyah-singer-index-theorem |
| `atiyah-singer-index-family` | atiyah-singer-index-family | slider | 2d | 1 | atiyah-singer-index-theorem |
| `atiyah-singer-symbol` | atiyah-singer-symbol | pick | 2d | 1 | atiyah-singer-index-theorem |
| `automorphic-conductor-ladder` | automorphic-conductor-ladder | click | 2d | 1 | automorphic-forms-adelic |
| `automorphic-dictionary` | automorphic-dictionary | step | 2d | 1 | automorphic-forms-adelic |
| `automorphic-eisenstein-residue` | automorphic-eisenstein-residue | slider | 2d | 1 | automorphic-forms-adelic |
| `automorphic-functoriality-transfers` | automorphic-functoriality-transfers | click | 2d | 1 | automorphic-forms-adelic |
| `automorphic-local-factor-builder` | automorphic-local-factor-builder | slider | 2d | 1 | automorphic-forms-adelic |
| `automorphic-restricted-product` | automorphic-restricted-product | step | 2d | 1 | automorphic-forms-adelic |
| `automorphic-satake-parameters` | automorphic-satake-parameters | slider | 2d | 1 | automorphic-forms-adelic |
| `automorphic-strong-approximation` | automorphic-strong-approximation | step | 2d | 1 | automorphic-forms-adelic |
| `automorphic-three-conditions` | automorphic-three-conditions | click | 2d | 1 | automorphic-forms-adelic |
| `bayes-mass-updater` | bayes-mass-updater | pour-update | 2d | 1 | probability-theory |
| `belief-grid-localization` | belief-grid-localization | edit-grid | 2d | 1 | pomdps-and-belief-states |
| `best-response-explorer-2d` | best-response-explorer-2d | drag | 2d | 1 | game-theory |
| `bezout-cayley-bacharach` | bezout-cayley-bacharach | click | 2d | 1 | bezout |
| `bezout-higherdim` | bezout-higherdim | slider | 2d | 1 | bezout |
| `bezout-statement` | bezout-statement | click | 2d | 1 | bezout |
| `bifurcation-1d` | bifurcation-1d | dial | 2d | 1 | dynamical-systems |
| `branching-proof-scrubber` | branching-proof-scrubber | branching-timeline | 2d | 1 | galois |
| `build-a-formula` | build-a-formula | compose-evaluate | 2d | 1 | first-order-logic-and-completeness |
| `calabi-yau-canonical-degree` | calabi-yau-canonical-degree | slider | 2d | 1 | calabi-yau-manifolds |
| `calabi-yau-hodge-diamond` | calabi-yau-hodge-diamond | slider | 2d | 1 | calabi-yau-manifolds |
| `calabi-yau-hypersurface-zoo` | calabi-yau-hypersurface-zoo | click | 2d | 1 | calabi-yau-manifolds |
| `calabi-yau-mirror-swap` | calabi-yau-mirror-swap | slider | 2d | 1 | calabi-yau-manifolds |
| `calabi-yau-periods` | calabi-yau-periods | slider | 2d | 1 | calabi-yau-manifolds |
| `calabi-yau-syz-fibration` | calabi-yau-syz-fibration | slider | 2d | 1 | calabi-yau-manifolds |
| `characteristic-classes-c1-clutching` | characteristic-classes-c1-clutching | slider | 2d | 1 | characteristic-classes |
| `characteristic-classes-classifying-map` | characteristic-classes-classifying-map | click | 2d | 1 | characteristic-classes |
| `characteristic-classes-cpn-localisation` | characteristic-classes-cpn-localisation | slider | 2d | 1 | characteristic-classes |
| `characteristic-classes-gauss-bonnet` | characteristic-classes-gauss-bonnet | click | 2d | 1 | characteristic-classes |
| `characteristic-classes-mobius-vs-cylinder` | characteristic-classes-mobius-vs-cylinder | slider | 2d | 1 | characteristic-classes |
| `characteristic-classes-poincare-hopf` | characteristic-classes-poincare-hopf | click | 2d | 1 | characteristic-classes |
| `characteristic-classes-pontryagin-formulas` | characteristic-classes-pontryagin-formulas | click | 2d | 1 | characteristic-classes |
| `characteristic-classes-signature-l-genus` | characteristic-classes-signature-l-genus | click | 2d | 1 | characteristic-classes |
| `characteristic-classes-w1-surfaces` | characteristic-classes-w1-surfaces | click | 2d | 1 | characteristic-classes |
| `class-field-theory-conductor-discriminant` | class-field-theory-conductor-discriminant | click | 2d | 1 | class-field-theory |
| `class-field-theory-existence` | class-field-theory-existence | click | 2d | 1 | class-field-theory |
| `class-field-theory-reciprocity-dictionary` | svg-illustration | read | 2d | 1 | class-field-theory |
| `cnt-bu` | verbatim | click | 2d | 1 | computational-number-theory |
| `cnt-sch` | verbatim | input | 2d | 1 | computational-number-theory |
| `cocartesian-fibrations-edge-scrubber` | cocartesian-fibrations-edge-scrubber | interact | 2d | 1 | cocartesian-fibrations |
| `cocartesian-fibrations-examples-graph` | cocartesian-fibrations-examples-graph | interact | 2d | 1 | cocartesian-fibrations |
| `cocartesian-fibrations-fibration-clickable` | cocartesian-fibrations-fibration-clickable | interact | 2d | 1 | cocartesian-fibrations |
| `cocartesian-fibrations-grothendieck-codecell` | cocartesian-fibrations-grothendieck-codecell | interact | 2d | 1 | cocartesian-fibrations |
| `cocartesian-fibrations-grothendieck-scrubber` | cocartesian-fibrations-grothendieck-scrubber | interact | 2d | 1 | cocartesian-fibrations |
| `cocartesian-fibrations-leftright-scrubber` | cocartesian-fibrations-leftright-scrubber | interact | 2d | 1 | cocartesian-fibrations |
| `cocartesian-fibrations-transport-clickable` | cocartesian-fibrations-transport-clickable | interact | 2d | 1 | cocartesian-fibrations |
| `cocartesian-fibrations-universal-leftfib` | cocartesian-fibrations-universal-leftfib | interact | 2d | 1 | cocartesian-fibrations |
| `cohomology-stiefel-whitney-rpn` | cohomology-stiefel-whitney-rpn | slider | 2d | 1 | cohomology-and-duality |
| `commutative-algebra-artinian-local` | parametric-plot | select | 2d | 1 | commutative-algebra |
| `commutative-algebra-completion` | commutative-algebra-completion | interact | 2d | 1 | commutative-algebra |
| `commutative-algebra-dedekind` | commutative-algebra-dedekind | select | 2d | 1 | commutative-algebra |
| `commutative-algebra-flatness` | parametric-plot | select | 2d | 1 | commutative-algebra |
| `commutative-algebra-ideal-lattice` | clickable-graph | click | 2d | 1 | commutative-algebra |
| `commutative-algebra-integral-extensions` | parametric-plot | select | 2d | 1 | commutative-algebra |
| `commutative-algebra-koszul` | commutative-algebra-koszul | interact | 2d | 1 | commutative-algebra |
| `commutative-algebra-krull-dimension` | parametric-plot | select | 2d | 1 | commutative-algebra |
| `commutative-algebra-localization` | parametric-plot | select | 2d | 1 | commutative-algebra |
| `commutative-algebra-nakayama` | parametric-plot | select | 2d | 1 | commutative-algebra |
| `commutative-algebra-noetherian` | parametric-plot | select | 2d | 1 | commutative-algebra |
| `commutative-algebra-prime-vs-maximal` | clickable-diagram | click | 2d | 1 | commutative-algebra |
| `commutative-algebra-radicals` | parametric-plot | select | 2d | 1 | commutative-algebra |
| `commutative-algebra-tensor` | clickable-diagram | click | 2d | 1 | commutative-algebra |
| `commutative-algebra-transcendence-degree` | parametric-plot | select | 2d | 1 | commutative-algebra |
| `commutative-algebra-zariski-spec` | clickable-diagram | click | 2d | 1 | commutative-algebra |
| `complex-analysis-argument-principle` | complex-analysis-argument-principle | interact | 2d | 1 | complex-analysis |
| `complex-analysis-arithmetic` | complex-analysis-arithmetic | interact | 2d | 1 | complex-analysis |
| `complex-analysis-cauchy-formula` | complex-analysis-cauchy-formula | interact | 2d | 1 | complex-analysis |
| `complex-analysis-cauchy-theorem` | complex-analysis-cauchy-theorem | interact | 2d | 1 | complex-analysis |
| `complex-analysis-conformal-grid` | complex-analysis-conformal-grid | interact | 2d | 1 | complex-analysis |
| `complex-analysis-conformal-map` | complex-analysis-conformal-map | interact | 2d | 1 | complex-analysis |
| `complex-analysis-disk-automorphism` | complex-analysis-disk-automorphism | interact | 2d | 1 | complex-analysis |
| `complex-analysis-fta` | complex-analysis-fta | interact | 2d | 1 | complex-analysis |
| `complex-analysis-harmonic` | complex-analysis-harmonic | interact | 2d | 1 | complex-analysis |
| `complex-analysis-laurent` | complex-analysis-laurent | interact | 2d | 1 | complex-analysis |
| `complex-analysis-liouville` | complex-analysis-liouville | interact | 2d | 1 | complex-analysis |
| `complex-analysis-max-modulus` | complex-analysis-max-modulus | interact | 2d | 1 | complex-analysis |
| `complex-analysis-monodromy` | complex-analysis-monodromy | interact | 2d | 1 | complex-analysis |
| `complex-analysis-normal-families` | complex-analysis-normal-families | interact | 2d | 1 | complex-analysis |
| `complex-analysis-open-mapping` | complex-analysis-open-mapping | interact | 2d | 1 | complex-analysis |
| `complex-analysis-residue-real-integral` | complex-analysis-residue-real-integral | interact | 2d | 1 | complex-analysis |
| `complex-analysis-riemann-mapping` | complex-analysis-riemann-mapping | interact | 2d | 1 | complex-analysis |
| `complex-analysis-riemann-sphere` | complex-analysis-riemann-sphere | interact | 2d | 1 | complex-analysis |
| `complex-analysis-schwarz-lemma` | complex-analysis-schwarz-lemma | interact | 2d | 1 | complex-analysis |
| `complex-analysis-singularity-zoo` | complex-analysis-singularity-zoo | interact | 2d | 1 | complex-analysis |
| `complex-map-2d` | complex-map-2d | drag-probe | 2d | 1 | complex-analysis |
| `complex-multiplication-w1` | verbatim | drag | 2d | 1 | complex-multiplication |
| `complexity-cook-levin-tableau` | complexity-cook-levin-tableau | step | 2d | 1 | complexity-theory |
| `complexity-growth-rates` | complexity-growth-rates | slider | 2d | 1 | complexity-theory |
| `complexity-hierarchy-diagonal` | complexity-hierarchy-diagonal | toggle | 2d | 1 | complexity-theory |
| `complexity-karp-reduction` | complexity-karp-reduction | graph-walk | 2d | 1 | complexity-theory |
| `complexity-sat-verifier` | complexity-sat-verifier | input | 2d | 1 | complexity-theory |
| `complexity-savitch-recursion` | complexity-savitch-recursion | step | 2d | 1 | complexity-theory |
| `composition-explorer` | clickable-diagram | click | 2d | 1 | category-theory |
| `computability-godel-encoding` | computability-godel-encoding | type | 2d | 1 | computability-and-decidability |
| `computability-halting-diagonal` | computability-halting-diagonal | click | 2d | 1 | computability-and-decidability |
| `computability-rec-vs-re-venn` | computability-rec-vs-re-venn | click | 2d | 1 | computability-and-decidability |
| `computability-recursion-tracer` | computability-recursion-tracer | step | 2d | 1 | computability-and-decidability |
| `computability-reduction-graph` | computability-reduction-graph | click | 2d | 1 | computability-and-decidability |
| `computability-turing-increment` | computability-turing-increment | step | 2d | 1 | computability-and-decidability |
| `constraint-bifurcation-explorer` | constraint-bifurcation-explorer | slider | 2d | 1 | real-analysis |
| `continued-fractions-w1` | verbatim | click | 2d | 1 | continued-fractions |
| `continued-fractions-w3` | verbatim | click | 2d | 1 | continued-fractions |
| `continued-fractions-w5` | verbatim | click | 2d | 1 | continued-fractions |
| `continuity-band-2d` | continuity-band-2d | slide-band | 2d | 1 | real-analysis |
| `contour-residue-2d` | contour-residue-2d | drag-contour | 2d | 1 | complex-analysis |
| `crypto-diffie-hellman` | crypto-diffie-hellman | slider | 2d | 1 | mathematics-and-cryptography |
| `crypto-ecc-points` | crypto-ecc-points | slider | 2d | 1 | mathematics-and-cryptography |
| `crypto-lwe-samples` | crypto-lwe-samples | slider | 2d | 1 | mathematics-and-cryptography |
| `crypto-rsa-toy` | crypto-rsa-toy | slider | 2d | 1 | mathematics-and-cryptography |
| `crypto-schnorr-protocol` | crypto-schnorr-protocol | button | 2d | 1 | mathematics-and-cryptography |
| `crypto-totient-units` | crypto-totient-units | slider | 2d | 1 | mathematics-and-cryptography |
| `crystalline-cohomology-w3` | verbatim | click | 2d | 1 | crystalline-cohomology |
| `crystalline-cohomology-w4` | verbatim | click | 2d | 1 | crystalline-cohomology |
| `ct-w2` | verbatim | click | 2d | 1 | coding-theory |
| `ct-w3` | verbatim | click | 2d | 1 | coding-theory |
| `ct-w4` | verbatim | click | 2d | 1 | coding-theory |
| `ct-w5` | verbatim | click | 2d | 1 | coding-theory |
| `ct-w6` | verbatim | click | 2d | 1 | coding-theory |
| `cup-product-grid` | cup-product-grid | click-multiply | 2d | 1 | cohomology-and-duality |
| `cv-w-slater` | verbatim | slider | 2d | 1 | convex-optimization |
| `d-modules-w1` | verbatim | click | 2d | 1 | d-modules |
| `d-modules-w2` | verbatim | click | 2d | 1 | d-modules |
| `d-modules-w3` | verbatim | click | 2d | 1 | d-modules |
| `deformation-theory-cotangent-scrubber` | proof-scrubber | scrub | 2d | 1 | deformation-theory |
| `deformation-theory-curve-sandbox` | svg-illustration | interact | 2d | 1 | deformation-theory |
| `deformation-theory-first-order-scrubber` | proof-scrubber | scrub | 2d | 1 | deformation-theory |
| `deformation-theory-genus-tangent` | parametric-plot | slide | 2d | 1 | deformation-theory |
| `deformation-theory-obstruction-graph` | clickable-graph | click | 2d | 1 | deformation-theory |
| `deformation-theory-schlessinger-diagram` | svg-illustration | click | 2d | 1 | deformation-theory |
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
| `df-closed-not-exact` | verbatim | slider | 2d | 1 | differential-forms |
| `df-exterior-derivative` | verbatim | select | 2d | 1 | differential-forms |
| `df-one-form-evaluator` | verbatim | slider | 2d | 1 | differential-forms |
| `df-stokes-disk` | verbatim | slider | 2d | 1 | differential-forms |
| `df-two-form-parallelogram` | verbatim | select | 2d | 1 | differential-forms |
| `diagram-editor` | diagram-editor | drag-and-toggle | 2d | 1 | homological |
| `diff-forms-integration` | diff-forms-integration | click | 2d | 1 | differential-forms |
| `diff-forms-pullback` | diff-forms-pullback | slider | 2d | 1 | differential-forms |
| `diff-geom-fundamental-forms` | diff-geom-fundamental-forms | click | 2d | 1 | differential-geometry |
| `diff-geom-surface-patch` | diff-geom-surface-patch | click | 3d | 1 | differential-geometry |
| `dirac-clifford` | verbatim | click | 2d | 1 | dirac-equation |
| `dirac-gamma-matrices` | verbatim | click | 2d | 1 | dirac-equation |
| `dirac-spin` | verbatim | slider | 2d | 1 | dirac-equation |
| `ec-disc` | ec-disc | slider | 2d | 1 | elliptic-curves |
| `ec-j` | ec-j | slider | 2d | 1 | elliptic-curves |
| `ec-lat` | verbatim | interact | 2d | 1 | elliptic-curves |
| `ec-mw` | ec-mw | select | 2d | 1 | elliptic-curves |
| `elementary-topos-theory-axioms-scrub` | declarative-host | click | 2d | 1 | elementary-topos-theory |
| `elementary-topos-theory-chi-pullback` | declarative-host | click | 2d | 1 | elementary-topos-theory |
| `elementary-topos-theory-geom-graph` | declarative-host | click | 2d | 1 | elementary-topos-theory |
| `elementary-topos-theory-gset-graph` | declarative-host | click | 2d | 1 | elementary-topos-theory |
| `elementary-topos-theory-omega-scrub` | declarative-host | click | 2d | 1 | elementary-topos-theory |
| `elementary-topos-theory-power-scrub` | declarative-host | click | 2d | 1 | elementary-topos-theory |
| `elementary-topos-theory-sieves-graph` | declarative-host | click | 2d | 1 | elementary-topos-theory |
| `elliptic-group-law-2d` | elliptic-group-law-2d | drag-on-curve | 2d | 1 | elliptic-curves |
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
| `expanders-zigzag-product` | expanders-zigzag-product | click | 2d | 1 | expanders |
| `extremal-combinatorics-erdos-stone` | extremal-combinatorics-erdos-stone | step | 2d | 1 | extremal-combinatorics |
| `extremal-combinatorics-kst` | extremal-combinatorics-kst | slider | 2d | 1 | extremal-combinatorics |
| `extremal-combinatorics-ramsey` | extremal-combinatorics-ramsey | click | 2d | 1 | extremal-combinatorics |
| `extremal-combinatorics-removal` | extremal-combinatorics-removal | slider | 2d | 1 | extremal-combinatorics |
| `extremal-combinatorics-sperner` | extremal-combinatorics-sperner | click | 2d | 1 | extremal-combinatorics |
| `extremal-combinatorics-turan` | extremal-combinatorics-turan | slider | 2d | 1 | extremal-combinatorics |
| `fol-compactness-finite-sat` | fol-compactness-finite-sat | step | 2d | 1 | first-order-logic-and-completeness |
| `fol-dlo-quantifier-elimination` | fol-dlo-quantifier-elimination | step | 2d | 1 | first-order-logic-and-completeness |
| `fol-henkin-construction` | fol-henkin-construction | step | 2d | 1 | first-order-logic-and-completeness |
| `fol-model-checker` | fol-model-checker | click | 2d | 1 | first-order-logic-and-completeness |
| `fol-modus-ponens-closure` | fol-modus-ponens-closure | step | 2d | 1 | first-order-logic-and-completeness |
| `fol-skolem-paradox` | fol-skolem-paradox | click | 2d | 1 | first-order-logic-and-completeness |
| `fol-term-tree` | fol-term-tree | click | 2d | 1 | first-order-logic-and-completeness |
| `fold-the-polygon` | fold-the-polygon | fold-glue | 2d | 1 | riemann-surfaces |
| `forcing-cohen-real` | forcing-cohen-real | stepper | 2d | 1 | forcing-and-independence |
| `forcing-continuum-landing` | forcing-continuum-landing | toggle | 2d | 1 | forcing-and-independence |
| `forcing-dependency-map` | forcing-dependency-map | diagram | 2d | 1 | forcing-and-independence |
| `forcing-generic-filter` | forcing-generic-filter | stepper | 2d | 1 | forcing-and-independence |
| `forcing-poset` | forcing-poset | toggle | 2d | 1 | forcing-and-independence |
| `forcing-truth-table` | forcing-truth-table | table | 2d | 1 | forcing-and-independence |
| `fpt-br` | verbatim | static | 2d | 1 | fixed-point-theorems |
| `fpt-sc` | verbatim | click | 2d | 1 | fixed-point-theorems |
| `fr-decomposition` | fr-decomposition | slider | 2d | 1 | frobenius-and-reciprocity |
| `fr-dict` | verbatim | interact | 2d | 1 | frobenius-and-reciprocity |
| `fr-splitting-types` | fr-splitting-types | click | 2d | 1 | frobenius-and-reciprocity |
| `fr-tower` | verbatim | interact | 2d | 1 | frobenius-and-reciprocity |
| `functional-analysis-banach-alaoglu` | functional-analysis-banach-alaoglu | interact | 2d | 1 | functional-analysis |
| `functional-analysis-bigfour` | functional-analysis-bigfour | interact | 2d | 1 | functional-analysis |
| `functional-analysis-bounded-continuous` | functional-analysis-bounded-continuous | interact | 2d | 1 | functional-analysis |
| `functional-analysis-krein-milman` | functional-analysis-krein-milman | interact | 2d | 1 | functional-analysis |
| `functional-analysis-riesz` | functional-analysis-riesz | interact | 2d | 1 | functional-analysis |
| `functional-analysis-weak-convergence` | functional-analysis-weak-convergence | interact | 2d | 1 | functional-analysis |
| `functional-equation-mirror` | functional-equation-mirror | drag-reflect | 2d | 1 | analytic-continuation |
| `functor-of-points-base-change` | functor-of-points-base-change | click | 2d | 1 | functor-of-points |
| `functor-of-points-groupoid-target` | functor-of-points-groupoid-target | click | 2d | 1 | functor-of-points |
| `functor-of-points-yoneda` | functor-of-points-yoneda | click | 2d | 1 | functor-of-points |
| `gal-three-impossibilities` | verbatim | static | 2d | 1 | galois |
| `galois-normal-separable` | galois-normal-separable | click | 2d | 1 | galois |
| `galois-primitive-element` | galois-primitive-element | slider | 2d | 1 | galois |
| `galois-representations-conductor` | galois-representations-conductor | click | 2d | 1 | galois-representations |
| `galois-representations-semisimplification` | galois-representations-semisimplification | slider | 2d | 1 | galois-representations |
| `gb-buch` | verbatim | click | 2d | 1 | groebner-bases |
| `gb-elim` | verbatim | click | 2d | 1 | groebner-bases |
| `gb-monorder` | verbatim | select | 2d | 1 | groebner-bases |
| `gb-mvdiv` | verbatim | click | 2d | 1 | groebner-bases |
| `gb-reduce` | verbatim | click | 2d | 1 | groebner-bases |
| `gb-solve` | verbatim | click | 2d | 1 | groebner-bases |
| `gb-spoly` | verbatim | click | 2d | 1 | groebner-bases |
| `gcb-central-extension-browser` | gcb-central-extension-browser | click | 2d | 1 | galois-cohomology-and-brauer |
| `gcb-cocycle-tester` | gcb-cocycle-tester | click | 2d | 1 | galois-cohomology-and-brauer |
| `gcb-cyclic-algebra-tester` | gcb-cyclic-algebra-tester | click | 2d | 1 | galois-cohomology-and-brauer |
| `gcb-hasse-counterexample-gallery` | gcb-hasse-counterexample-gallery | click | 2d | 1 | galois-cohomology-and-brauer |
| `gcb-mu2-torsor-visualizer` | gcb-mu2-torsor-visualizer | click | 2d | 1 | galois-cohomology-and-brauer |
| `gcb-tate-pairing-table` | gcb-tate-pairing-table | click | 2d | 1 | galois-cohomology-and-brauer |
| `gcg-cay` | verbatim | click | 2d | 1 | geometric-and-combinatorial-group-theory |
| `gcg-dec` | verbatim | click | 2d | 1 | geometric-and-combinatorial-group-theory |
| `general-relativity-cosmology` | general-relativity-cosmology | slider | 2d | 1 | general-relativity |
| `general-relativity-einstein` | general-relativity-einstein | click | 2d | 1 | general-relativity |
| `general-relativity-gw` | general-relativity-gw | slider | 2d | 1 | general-relativity |
| `general-relativity-kerr` | general-relativity-kerr | slider | 2d | 1 | general-relativity |
| `general-relativity-light-cones` | general-relativity-light-cones | drag | 2d | 1 | general-relativity |
| `general-relativity-schwarzschild` | general-relativity-schwarzschild | slider | 2d | 1 | general-relativity |
| `gmt-currents` | verbatim | click | 2d | 1 | geometric-measure-theory |
| `grid-world-mdp` | grid-world-mdp | edit-grid | 2d | 1 | markov-decision-processes |
| `grothendieck-topologies-sites-axioms-scrub` | declarative-host | click | 2d | 1 | grothendieck-topologies-sites |
| `grothendieck-topologies-sites-geom-comp` | declarative-host | click | 2d | 1 | grothendieck-topologies-sites |
| `grothendieck-topologies-sites-giraud` | declarative-host | click | 2d | 1 | grothendieck-topologies-sites |
| `grothendieck-topologies-sites-sheaf-cases` | declarative-host | click | 2d | 1 | grothendieck-topologies-sites |
| `grothendieck-topologies-sites-sieves-poset` | declarative-host | click | 2d | 1 | grothendieck-topologies-sites |
| `grothendieck-topologies-sites-sites-toggle` | declarative-host | click | 2d | 1 | grothendieck-topologies-sites |
| `group-cohomology-brauer-cheatsheet` | group-cohomology-brauer-cheatsheet | click | 2d | 1 | group-cohomology |
| `group-cohomology-c2-extensions` | group-cohomology-c2-extensions | click | 2d | 1 | group-cohomology |
| `group-cohomology-coboundary-calculator` | group-cohomology-coboundary-calculator | click | 2d | 1 | group-cohomology |
| `group-cohomology-fixed-points` | group-cohomology-fixed-points | click | 2d | 1 | group-cohomology |
| `group-cohomology-hilbert-90` | group-cohomology-hilbert-90 | click | 2d | 1 | group-cohomology |
| `group-cohomology-lhs-spectral` | group-cohomology-lhs-spectral | click | 2d | 1 | group-cohomology |
| `group-cohomology-tate-periodic-table` | group-cohomology-tate-periodic-table | click | 2d | 1 | group-cohomology |
| `group-schemes-axiom-diagrams` | clickable-diagram | click | 2d | 1 | group-schemes |
| `group-schemes-etale-connected-decomposition` | clickable-graph | click | 2d | 1 | group-schemes |
| `group-schemes-hopf-duality` | clickable-diagram | click | 2d | 1 | group-schemes |
| `group-schemes-hopf-scrubber` | proof-scrubber | scrub | 2d | 1 | group-schemes |
| `group-schemes-lie-algebra-scrubber` | proof-scrubber | scrub | 2d | 1 | group-schemes |
| `group-schemes-mu-n-add` | modular-arithmetic-clock | drag | 2d | 1 | group-schemes |
| `group-schemes-mu-n-clock` | modular-arithmetic-clock | drag | 2d | 1 | group-schemes |
| `group-schemes-torsor-cases` | counterexample-explorer | click | 2d | 1 | group-schemes |
| `half-integral-weight-forms-w1` | verbatim | click | 2d | 1 | half-integral-weight-forms |
| `half-integral-weight-forms-w4` | verbatim | click | 2d | 1 | half-integral-weight-forms |
| `half-integral-weight-forms-w5` | verbatim | click | 2d | 1 | half-integral-weight-forms |
| `half-integral-weight-forms-w6` | verbatim | click | 2d | 1 | half-integral-weight-forms |
| `harmonic-convolution` | harmonic-convolution | slider | 2d | 1 | harmonic-analysis-fourier |
| `harmonic-functions-harnack-corridor` | harmonic-functions-harnack-corridor | slider | 2d | 1 | harmonic-functions |
| `harmonic-functions-laplacian-heatmap` | harmonic-functions-laplacian-heatmap | select | 2d | 1 | harmonic-functions |
| `harmonic-functions-maximum-locator` | harmonic-functions-maximum-locator | slider | 2d | 1 | harmonic-functions |
| `harmonic-functions-mvp-circle` | harmonic-functions-mvp-circle | drag | 2d | 1 | harmonic-functions |
| `harmonic-functions-perron-supremum` | harmonic-functions-perron-supremum | select | 2d | 1 | harmonic-functions |
| `harmonic-functions-poisson-extension` | harmonic-functions-poisson-extension | drag | 2d | 1 | harmonic-functions |
| `harmonic-heat-evolution` | harmonic-heat-evolution | slider | 2d | 1 | harmonic-analysis-fourier |
| `harmonic-partial-sum` | harmonic-partial-sum | slider | 2d | 1 | harmonic-analysis-fourier |
| `harmonic-poisson` | harmonic-poisson | interact | 2d | 1 | harmonic-analysis-fourier |
| `harmonic-pontryagin` | harmonic-pontryagin | select | 2d | 1 | harmonic-analysis-fourier |
| `harmonic-schwartz` | harmonic-schwartz | select | 2d | 1 | harmonic-analysis-fourier |
| `harmonic-tent-transform` | harmonic-tent-transform | slider | 2d | 1 | harmonic-analysis-fourier |
| `harmonic-uncertainty` | harmonic-uncertainty | slider | 2d | 1 | harmonic-analysis-fourier |
| `hdg-dvoretzky-section` | hdg-dvoretzky-section | slider | 2d | 1 | high-dimensional-geometry |
| `hdg-isoperimetry-tail` | hdg-isoperimetry-tail | slider | 2d | 1 | high-dimensional-geometry |
| `hdg-jl-distortion-histogram` | hdg-jl-distortion-histogram | slider | 2d | 1 | high-dimensional-geometry |
| `hdg-marchenko-pastur` | hdg-marchenko-pastur | slider | 2d | 1 | high-dimensional-geometry |
| `hdg-sphere-concentration-band` | hdg-sphere-concentration-band | slider | 2d | 1 | high-dimensional-geometry |
| `hdg-talagrand-deviation` | hdg-talagrand-deviation | slider | 2d | 1 | high-dimensional-geometry |
| `heights-arakelov-decomposition` | heights-arakelov-decomposition | click | 2d | 1 | heights-arithmetic-geometry |
| `heights-genus-growth` | heights-genus-growth | slider | 2d | 1 | heights-arithmetic-geometry |
| `heights-mahler-measure` | heights-mahler-measure | click | 2d | 1 | heights-arithmetic-geometry |
| `heights-naive-calculator` | heights-naive-calculator | click | 2d | 1 | heights-arithmetic-geometry |
| `heights-northcott-enumerator` | heights-northcott-enumerator | slider | 2d | 1 | heights-arithmetic-geometry |
| `heights-tate-averaging` | heights-tate-averaging | slider | 2d | 1 | heights-arithmetic-geometry |
| `heights-weil-pullback` | heights-weil-pullback | slider | 2d | 1 | heights-arithmetic-geometry |
| `heyting-algebras-toposes-geometric-composition` | clickable-diagram | click | 2d | 1 | heyting-algebras-toposes |
| `heyting-algebras-toposes-heyting-clickable` | clickable-diagram | click | 2d | 1 | heyting-algebras-toposes |
| `heyting-algebras-toposes-internal-language-dictionary` | clickable-diagram | click | 2d | 1 | heyting-algebras-toposes |
| `heyting-algebras-toposes-kripke-joyal-scrub` | proof-scrubber | scrub | 2d | 1 | heyting-algebras-toposes |
| `heyting-algebras-toposes-lem-cases` | clickable-diagram | click | 2d | 1 | heyting-algebras-toposes |
| `heyting-algebras-toposes-omega-heyting-scrub` | proof-scrubber | scrub | 2d | 1 | heyting-algebras-toposes |
| `hf-applications` | verbatim | click | 2d | 1 | heegaard-floer |
| `hf-surgery-triangle` | verbatim | click | 2d | 1 | heegaard-floer |
| `hf-variants` | verbatim | interact | 2d | 1 | heegaard-floer |
| `hodge-theory-filtration-scrubber` | hodge-theory-filtration-scrubber | interact | 2d | 1 | hodge-theory |
| `hodge-theory-hodge-class-cases` | hodge-theory-hodge-class-cases | interact | 2d | 1 | hodge-theory |
| `hodge-theory-hodge-diamond` | hodge-theory-hodge-diamond | interact | 2d | 1 | hodge-theory |
| `hodge-theory-mixed-weight` | hodge-theory-mixed-weight | step | 2d | 1 | hodge-theory |
| `hodge-theory-period-elliptic` | hodge-theory-period-elliptic | interact | 2d | 1 | hodge-theory |
| `hodge-theory-pure-structure` | hodge-theory-pure-structure | slider | 2d | 1 | hodge-theory |
| `hodge-theory-why-refinement` | hodge-theory-why-refinement | click | 2d | 1 | hodge-theory |
| `homological-cartan-eilenberg` | homological-cartan-eilenberg | select | 2d | 1 | homological |
| `homological-double-complex` | homological-double-complex | interact | 2d | 1 | homological |
| `homological-les-sphere` | homological-les-sphere | interact | 2d | 1 | homological |
| `homological-tor-symmetry` | homological-tor-symmetry | interact | 2d | 1 | homological |
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
| `info-aep-typical-set` | info-aep-typical-set | slider | 2d | 1 | information-theory |
| `info-cramer-rao` | info-cramer-rao | slider | 2d | 1 | information-theory |
| `information-bsc-capacity` | information-bsc-capacity | slider | 2d | 1 | information-theory |
| `information-entropy` | information-entropy | slider | 2d | 1 | information-theory |
| `information-huffman-builder` | information-huffman-builder | click | 2d | 1 | information-theory |
| `information-kl-simplex` | information-kl-simplex | click | 2d | 1 | information-theory |
| `information-mutual-info-venn` | information-mutual-info-venn | slider | 2d | 1 | information-theory |
| `information-rate-distortion` | information-rate-distortion | slider | 2d | 1 | information-theory |
| `intersection-theory-chow-chern-multiplicativity` | parametric-plot | select | 2d | 1 | intersection-theory-chow |
| `intersection-theory-chow-cycles-rational-equivalence` | clickable-diagram | click | 2d | 1 | intersection-theory-chow |
| `intersection-theory-chow-grr-scrub` | proof-scrubber | scrub | 2d | 1 | intersection-theory-chow |
| `intersection-theory-chow-intersection-product` | clickable-diagram | click | 2d | 1 | intersection-theory-chow |
| `intersection-theory-chow-orbits` | parametric-plot | select | 2d | 1 | intersection-theory-chow |
| `intersection-theory-chow-pn-ring` | parametric-plot | select | 2d | 1 | intersection-theory-chow |
| `iwasawa-theory-w2` | verbatim | click | 2d | 1 | iwasawa-theory |
| `iwasawa-theory-w3` | verbatim | click | 2d | 1 | iwasawa-theory |
| `iwasawa-theory-w4` | verbatim | click | 2d | 1 | iwasawa-theory |
| `julia-playground` | julia-playground | slider | 2d | 1 | dynamical-systems |
| `k-theory-bott-periodicity` | k-theory-bott-periodicity | slider | 2d | 1 | k-theory |
| `k-theory-chern-character` | k-theory-chern-character | slider | 2d | 1 | k-theory |
| `k-theory-grothendieck-builder` | k-theory-grothendieck-builder | click | 2d | 1 | k-theory |
| `k-theory-index-theorem` | k-theory-index-theorem | click | 2d | 1 | k-theory |
| `k-theory-low-k-groups` | k-theory-low-k-groups | click | 2d | 1 | k-theory |
| `k-theory-ses-relations` | k-theory-ses-relations | click | 2d | 1 | k-theory |
| `khov-w6` | verbatim | click | 2d | 1 | khovanov-homology |
| `knot-polynomials-alexander` | knot-polynomials-alexander | click | 2d | 1 | knot-polynomials |
| `knot-polynomials-bracket` | knot-polynomials-bracket | step | 2d | 1 | knot-polynomials |
| `knot-polynomials-gallery` | knot-polynomials-gallery | click | 2d | 1 | knot-polynomials |
| `knot-polynomials-homfly` | knot-polynomials-homfly | step | 2d | 1 | knot-polynomials |
| `knot-polynomials-khovanov` | knot-polynomials-khovanov | click | 2d | 1 | knot-polynomials |
| `knot-polynomials-reidemeister` | knot-polynomials-reidemeister | click | 2d | 1 | knot-polynomials |
| `knot-polynomials-rmatrix` | knot-polynomials-rmatrix | slider | 2d | 1 | knot-polynomials |
| `knot-polynomials-vassiliev` | knot-polynomials-vassiliev | click | 2d | 1 | knot-polynomials |
| `l-functions-class-number` | l-functions-class-number | click | 2d | 1 | L-functions |
| `l-functions-zeta-continuation` | l-functions-zeta-continuation | slider | 2d | 1 | L-functions |
| `langlands-cft-gl1` | langlands-cft-gl1 | click | 2d | 1 | langlands-program |
| `langlands-euler-product` | langlands-euler-product | interact | 2d | 1 | langlands-program |
| `langlands-gl2-modularity` | langlands-gl2-modularity | click | 2d | 1 | langlands-program |
| `langlands-local-classification` | langlands-local-classification | interact | 2d | 1 | langlands-program |
| `langlands-reciprocity-dictionary` | langlands-reciprocity-dictionary | interact | 2d | 1 | langlands-program |
| `large-dev-cramer-tilt` | large-dev-cramer-tilt | slider | 2d | 1 | large-deviations |
| `large-dev-gartner-ar1` | large-dev-gartner-ar1 | slider | 2d | 1 | large-deviations |
| `large-dev-rate-gallery` | large-dev-rate-gallery | toggle | 2d | 1 | large-deviations |
| `large-dev-sanov-kl` | large-dev-sanov-kl | click | 2d | 1 | large-deviations |
| `large-dev-schilder-paths` | large-dev-schilder-paths | click | 2d | 1 | large-deviations |
| `lie-adjoint-killing` | lie-adjoint-killing | click | 2d | 1 | lie-groups |
| `lie-algebra-tangent` | lie-algebra-tangent | click | 2d | 1 | lie-groups |
| `lie-algebras-adjoint-vis` | lie-algebras-adjoint-vis | click | 2d | 1 | lie-algebras |
| `lie-algebras-bracket-table` | lie-algebras-bracket-table | click | 2d | 1 | lie-algebras |
| `lie-algebras-derived-series` | lie-algebras-derived-series | step | 2d | 1 | lie-algebras |
| `lie-algebras-dynkin-gallery` | lie-algebras-dynkin-gallery | click | 2d | 1 | lie-algebras |
| `lie-algebras-root-vis` | lie-algebras-root-vis | click | 2d | 1 | lie-algebras |
| `lie-algebras-weight-diagram` | lie-algebras-weight-diagram | slider | 2d | 1 | lie-algebras |
| `linear-transform-2d` | linear-transform-2d | drag-basis | 2d | 1 | differential-forms |
| `maass-forms-w2` | verbatim | click | 2d | 1 | maass-forms |
| `matroid-axiom-checker` | matroid-axiom-checker | click | 2d | 1 | matroid-theory |
| `matroid-bases-rank-explorer` | matroid-bases-rank-explorer | slider | 2d | 1 | matroid-theory |
| `matroid-dual-explorer` | matroid-dual-explorer | click | 2d | 1 | matroid-theory |
| `matroid-flats-stepper` | matroid-flats-stepper | step | 2d | 1 | matroid-theory |
| `matroid-graph-forests` | matroid-graph-forests | click | 2d | 1 | matroid-theory |
| `matroid-greedy-vs-nonmatroid` | matroid-greedy-vs-nonmatroid | slider | 2d | 1 | matroid-theory |
| `matroid-tutte-polynomial` | matroid-tutte-polynomial | slider | 2d | 1 | matroid-theory |
| `mc-examples` | verbatim | select | 2d | 1 | model-categories |
| `mirror-hms-pairing` | mirror-hms-pairing | click | 2d | 1 | mirror-symmetry |
| `mirror-hodge-diamond` | mirror-hodge-diamond | select | 2d | 1 | mirror-symmetry |
| `mirror-quintic-counts` | mirror-quintic-counts | click | 2d | 1 | mirror-symmetry |
| `mirror-quintic-periods` | mirror-quintic-periods | slider | 2d | 1 | mirror-symmetry |
| `mirror-stable-map` | mirror-stable-map | slider | 2d | 1 | mirror-symmetry |
| `mirror-syz-fibration` | mirror-syz-fibration | slider | 2d | 1 | mirror-symmetry |
| `model-theory-ax-grothendieck` | model-theory-ax-grothendieck | step | 2d | 1 | model-theory-basics |
| `model-theory-back-and-forth` | model-theory-back-and-forth | step | 2d | 1 | model-theory-basics |
| `model-theory-ef-games` | model-theory-ef-games | step | 2d | 1 | model-theory-basics |
| `model-theory-equivalence-prober` | model-theory-equivalence-prober | step | 2d | 1 | model-theory-basics |
| `model-theory-signature-explorer` | model-theory-signature-explorer | click | 2d | 1 | model-theory-basics |
| `model-theory-types-explorer` | model-theory-types-explorer | click | 2d | 1 | model-theory-basics |
| `modular-curves-atkin-lehner-newforms` | modular-curves-atkin-lehner-newforms | click | 2d | 1 | modular-curves |
| `modular-curves-cusps-and-wn` | modular-curves-cusps-and-wn | click | 2d | 1 | modular-curves |
| `modular-curves-eichler-shimura` | modular-curves-eichler-shimura | click | 2d | 1 | modular-curves |
| `modular-curves-fundamental-domain` | modular-curves-fundamental-domain | step | 2d | 1 | modular-curves |
| `modular-curves-genus-growth` | modular-curves-genus-growth | slider | 2d | 1 | modular-curves |
| `modular-curves-hecke-summands` | modular-curves-hecke-summands | step | 2d | 1 | modular-curves |
| `modular-curves-heegner-hypothesis` | modular-curves-heegner-hypothesis | step | 2d | 1 | modular-curves |
| `modular-curves-lattice-cyclic-subgroup` | modular-curves-lattice-cyclic-subgroup | slider | 2d | 1 | modular-curves |
| `modular-curves-mazur-torsion` | modular-curves-mazur-torsion | click | 2d | 1 | modular-curves |
| `modular-forms-petersson-convergence` | modular-forms-petersson-convergence | slider | 2d | 1 | modular-forms |
| `moduli-spaces-triangle-similarity` | moduli-spaces-triangle-similarity | slider | 2d | 1 | moduli-spaces |
| `morphisms-scheme-morphism` | morphisms-scheme-morphism | slider | 2d | 1 | morphisms-fiber-products |
| `morphisms-separated-proper` | morphisms-separated-proper | slider | 2d | 1 | morphisms-fiber-products |
| `morse-betti-counts` | morse-betti-counts | slider | 2d | 1 | morse-theory |
| `morse-cerf-birth-death` | morse-cerf-birth-death | slider | 2d | 1 | morse-theory |
| `morse-cw-cells` | morse-cw-cells | click | 2d | 1 | morse-theory |
| `morse-gradient-flow` | morse-gradient-flow | click | 2d | 1 | morse-theory |
| `morse-handle-decomp` | morse-handle-decomp | slider | 2d | 1 | morse-theory |
| `morse-smale-saddle` | morse-smale-saddle | click | 2d | 1 | morse-theory |
| `morse-sphere-vs-rp2` | morse-sphere-vs-rp2 | click | 2d | 1 | morse-theory |
| `morse-torus-height` | morse-torus-height | slider | 2d | 1 | morse-theory |
| `mostow-boundary-extension` | mostow-boundary-extension | slider | 2d | 1 | mostow-rigidity |
| `mostow-boundary-orbit` | mostow-boundary-orbit | step | 2d | 1 | mostow-rigidity |
| `mostow-h3-fundamental-domain` | mostow-h3-fundamental-domain | slider | 2d | 1 | mostow-rigidity |
| `mostow-rank-tower` | mostow-rank-tower | click | 2d | 1 | mostow-rigidity |
| `mostow-rigidity-dial` | mostow-rigidity-dial | slider | 2d | 1 | mostow-rigidity |
| `mostow-volume-spectrum` | mostow-volume-spectrum | click | 2d | 1 | mostow-rigidity |
| `motives-chow-decomposition` | motives-chow-decomposition | interact | 2d | 1 | motives |
| `motives-correspondences` | motives-correspondences | click | 2d | 1 | motives |
| `motives-motivic-galois` | motives-motivic-galois | click | 2d | 1 | motives |
| `motives-realization-comparison` | motives-realization-comparison | interact | 2d | 1 | motives |
| `motives-standard-conjectures` | motives-standard-conjectures | interact | 2d | 1 | motives |
| `motives-tannakian` | motives-tannakian | click | 2d | 1 | motives |
| `motives-tate-twist` | motives-tate-twist | slider | 2d | 1 | motives |
| `ms-beta-posterior` | ms-beta-posterior | slider | 2d | 1 | mathematical-statistics |
| `ms-bias-variance` | ms-bias-variance | slider | 2d | 1 | mathematical-statistics |
| `ms-crlb-envelope` | ms-crlb-envelope | slider | 2d | 1 | mathematical-statistics |
| `ms-likelihood-curve` | ms-likelihood-curve | slider | 2d | 1 | mathematical-statistics |
| `ms-neyman-pearson` | ms-neyman-pearson | slider | 2d | 1 | mathematical-statistics |
| `ms-wilks-theorem` | ms-wilks-theorem | slider | 2d | 1 | mathematical-statistics |
| `mt-sigma-algebra` | mt-sigma-algebra | click | 2d | 1 | measure-theory |
| `natural-transformation-explorer` | naturality-square | slider+click | 2d | 1 | category-theory |
| `nst-axiom-of-choice` | nst-axiom-of-choice | click | 2d | 1 | naive-set-theory |
| `nst-product-powerset` | nst-product-powerset | click | 2d | 1 | naive-set-theory |
| `numerical-fem-hat-basis` | numerical-fem-hat-basis | slider | 2d | 1 | numerical-analysis |
| `numerical-fp-cancellation` | numerical-fp-cancellation | slider | 2d | 1 | numerical-analysis |
| `numerical-ftcs-stability` | numerical-ftcs-stability | slider | 2d | 1 | numerical-analysis |
| `numerical-hilbert-conditioning` | numerical-hilbert-conditioning | slider | 2d | 1 | numerical-analysis |
| `numerical-newton-iteration` | numerical-newton-iteration | step | 2d | 1 | numerical-analysis |
| `numerical-quadrature-error` | numerical-quadrature-error | slider | 2d | 1 | numerical-analysis |
| `oc-bolza` | verbatim | slider | 2d | 1 | optimal-control-and-dynamic-programming |
| `oc-pmp` | verbatim | scrub | 2d | 1 | optimal-control-and-dynamic-programming |
| `operator-algebras-cstar` | operator-algebras-cstar | select | 2d | 1 | operator-algebras |
| `operator-algebras-funccalc` | operator-algebras-funccalc | select | 2d | 1 | operator-algebras |
| `operator-algebras-positive` | operator-algebras-positive | slider | 2d | 1 | operator-algebras |
| `osculating-circle-2d` | osculating-circle-2d | drag-along-curve | 2d | 1 | differential-geometry |
| `padic-newton-polygon` | padic-newton-polygon | click | 2d | 1 | p-adic-numbers |
| `padic-ramification-tower` | padic-ramification-tower | slider | 2d | 1 | p-adic-numbers |
| `pchar-w7` | verbatim | interact | 2d | 1 | positive-characteristic-ag |
| `pde-classifier` | pde-classifier | slider | 2d | 1 | partial-differential-equations |
| `pde-heat-kernel` | pde-heat-kernel | slider | 2d | 1 | partial-differential-equations |
| `pde-poisson-disk` | pde-poisson-disk | drag | 2d | 1 | partial-differential-equations |
| `pde-sobolev-embedding` | pde-sobolev-embedding | slider | 2d | 1 | partial-differential-equations |
| `pde-wave-dalembert` | pde-wave-dalembert | slider | 2d | 1 | partial-differential-equations |
| `pde-weak-test` | pde-weak-test | slider | 2d | 1 | partial-differential-equations |
| `pp-cross-ratio` | pp-cross-ratio | slider | 2d | 1 | projective-plane |
| `pp-duality` | pp-duality | drag | 2d | 1 | projective-plane |
| `prob-convergence-modes` | prob-convergence-modes | click | 2d | 1 | probability-theory |
| `prob-martingale-stopping` | prob-martingale-stopping | click | 2d | 1 | probability-theory |
| `probabilistic-method-alterations` | probabilistic-method-alterations | click | 2d | 1 | probabilistic-method |
| `probabilistic-method-concentration` | probabilistic-method-concentration | slider | 2d | 1 | probabilistic-method |
| `probabilistic-method-existence` | probabilistic-method-existence | click | 2d | 1 | probabilistic-method |
| `probabilistic-method-linearity` | probabilistic-method-linearity | slider | 2d | 1 | probabilistic-method |
| `probabilistic-method-lll` | probabilistic-method-lll | slider | 2d | 1 | probabilistic-method |
| `probabilistic-method-ramsey` | probabilistic-method-ramsey | slider | 2d | 1 | probabilistic-method |
| `probabilistic-method-threshold` | probabilistic-method-threshold | slider | 2d | 1 | probabilistic-method |
| `q-learning-grid-world` | q-learning-grid-world | edit-grid | 2d | 1 | reinforcement-learning |
| `quad-recip-jacobi` | quad-recip-jacobi | click | 2d | 1 | quadratic-reciprocity |
| `quad-recip-supplementary` | quad-recip-supplementary | slider | 2d | 1 | quadratic-reciprocity |
| `quantum-groups-applications-map` | quantum-groups-applications-map | inspect | 2d | 1 | quantum-groups |
| `quantum-groups-crystal-tensor-product` | quantum-groups-crystal-tensor-product | inspect | 2d | 1 | quantum-groups |
| `quantum-groups-hopf-axioms-inspector` | quantum-groups-hopf-axioms-inspector | inspect | 2d | 1 | quantum-groups |
| `quantum-groups-qsl2-deformation-slider` | quantum-groups-qsl2-deformation-slider | slider | 2d | 1 | quantum-groups |
| `quantum-groups-reshetikhin-turaev-knots` | quantum-groups-reshetikhin-turaev-knots | toggle | 2d | 1 | quantum-groups |
| `quantum-groups-yang-baxter-reidemeister` | quantum-groups-yang-baxter-reidemeister | toggle | 2d | 1 | quantum-groups |
| `quaternions-cayley-dickson-ladder` | quaternions-cayley-dickson-ladder | click | 2d | 1 | quaternions-octonions-and-division-algebras |
| `quaternions-fano-plane-oracle` | quaternions-fano-plane-oracle | click | 2d | 1 | quaternions-octonions-and-division-algebras |
| `quaternions-frobenius-case-tree` | quaternions-frobenius-case-tree | click | 2d | 1 | quaternions-octonions-and-division-algebras |
| `quaternions-hurwitz-tower-bar` | quaternions-hurwitz-tower-bar | click | 2d | 1 | quaternions-octonions-and-division-algebras |
| `quaternions-multiplication-tester` | quaternions-multiplication-tester | input | 2d | 1 | quaternions-octonions-and-division-algebras |
| `quaternions-rotation-visualizer` | quaternions-rotation-visualizer | slider | 3d | 1 | quaternions-octonions-and-division-algebras |
| `random-walks-cycle-coupling` | random-walks-cycle-coupling | step | 2d | 1 | random-walks-and-mixing |
| `random-walks-eigenvalue-inspector` | random-walks-eigenvalue-inspector | click | 2d | 1 | random-walks-and-mixing |
| `random-walks-graph-step` | random-walks-graph-step | step | 2d | 1 | random-walks-and-mixing |
| `random-walks-matrix-power` | random-walks-matrix-power | step | 2d | 1 | random-walks-and-mixing |
| `random-walks-metropolis-hastings` | random-walks-metropolis-hastings | slider | 2d | 1 | random-walks-and-mixing |
| `random-walks-tv-distance` | random-walks-tv-distance | slider | 2d | 1 | random-walks-and-mixing |
| `rep-theory-homomorphism` | rep-theory-homomorphism | click | 2d | 1 | representation-theory |
| `rep-theory-orthogonality` | rep-theory-orthogonality | click | 2d | 1 | representation-theory |
| `resolution-ade-dynkin` | resolution-ade-dynkin | inspect | 2d | 1 | resolution-of-singularities |
| `resolution-applications-map` | resolution-applications-map | click | 2d | 1 | resolution-of-singularities |
| `resolution-curve-normalization` | resolution-curve-normalization | inspect | 2d | 1 | resolution-of-singularities |
| `resolution-cusp-node-visualizer` | resolution-cusp-node-visualizer | inspect | 2d | 1 | resolution-of-singularities |
| `resolution-cuspidal-blowup` | resolution-cuspidal-blowup | inspect | 2d | 1 | resolution-of-singularities |
| `resolution-tower-of-blowups` | resolution-tower-of-blowups | inspect | 2d | 1 | resolution-of-singularities |
| `rg-ricci-curvature` | rg-ricci-curvature | slider | 2d | 1 | riemannian-geometry |
| `rg-volume-form` | rg-volume-form | click | 2d | 1 | riemannian-geometry |
| `ricci-blowup-rates` | ricci-blowup-rates | button-stepper | 2d | 1 | ricci-flow |
| `ricci-deturck-trick` | ricci-deturck-trick | button-stepper | 2d | 1 | ricci-flow |
| `ricci-einstein-flows` | ricci-einstein-flows | button-stepper | 2d | 1 | ricci-flow |
| `ricci-extinction-timeline` | ricci-extinction-timeline | button-stepper | 2d | 1 | ricci-flow |
| `ricci-neckpinch-surgery` | ricci-neckpinch-surgery | button-stepper | 2d | 1 | ricci-flow |
| `ricci-soliton-zoo` | ricci-soliton-zoo | button-stepper | 2d | 1 | ricci-flow |
| `riemann-surfaces-chart-atlas` | riemann-surfaces-chart-atlas | slider | 2d | 1 | riemann-surfaces |
| `schemes-dimension` | schemes-dimension | interact | 2d | 1 | schemes |
| `schemes-proj` | schemes-proj | interact | 2d | 1 | schemes |
| `schemes-residue-field` | schemes-residue-field | interact | 2d | 1 | schemes |
| `schemes-spec` | schemes-spec | interact | 2d | 1 | schemes |
| `schemes-specialization` | schemes-specialization | interact | 2d | 1 | schemes |
| `schemes-stalk` | schemes-stalk | interact | 2d | 1 | schemes |
| `several-complex-variables-reinhardt-pseudoconvex` | several-complex-variables-reinhardt-pseudoconvex | slider | 2d | 1 | several-complex-variables |
| `shatter-arena` | shatter-arena | construct-to-break | 2d | 1 | statistical-learning-theory |
| `sheaf-cohomology-acyclic` | sheaf-cohomology-acyclic | select | 2d | 1 | sheaf-cohomology |
| `sheaf-cohomology-leray` | sheaf-cohomology-leray | select | 2d | 1 | sheaf-cohomology |
| `sheaf-cohomology-nerve` | sheaf-cohomology-nerve | interact | 2d | 1 | sheaf-cohomology |
| `sheaf-cohomology-serre-duality` | sheaf-cohomology-serre-duality | interact | 2d | 1 | sheaf-cohomology |
| `sheaves-ox-module` | sheaves-ox-module | click | 2d | 1 | sheaves |
| `sheaves-presheaf-restriction` | sheaves-presheaf-restriction | slider | 2d | 1 | sheaves |
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
| `singular-cubics-minimal-model` | singular-cubics-minimal-model | slider | 2d | 1 | singular-cubics-reduction |
| `sm-manifold-gallery` | sm-manifold-gallery | click | 2d | 1 | smooth-manifolds |
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
| `sr-cone` | verbatim | interact | 2d | 1 | special-relativity |
| `stacks-dm-vs-artin` | stacks-dm-vs-artin | click | 2d | 1 | stacks |
| `stacks-quotient-stack` | stacks-quotient-stack | click | 2d | 1 | stacks |
| `stoch-proc-brownian-quadratic-variation` | stoch-proc-brownian-quadratic-variation | slider | 2d | 1 | stochastic-processes-and-martingales |
| `stoch-proc-convergence-regimes` | stoch-proc-convergence-regimes | slider | 2d | 1 | stochastic-processes-and-martingales |
| `stoch-proc-doob-decomposition` | stoch-proc-doob-decomposition | step | 2d | 1 | stochastic-processes-and-martingales |
| `stoch-proc-filtration-stopping` | stoch-proc-filtration-stopping | slider | 2d | 1 | stochastic-processes-and-martingales |
| `stoch-proc-gamblers-ruin` | stoch-proc-gamblers-ruin | slider | 2d | 1 | stochastic-processes-and-martingales |
| `stoch-proc-random-walk-martingale` | stoch-proc-random-walk-martingale | step | 2d | 1 | stochastic-processes-and-martingales |
| `stochastic-calc-binomial-black-scholes` | stochastic-calc-binomial-black-scholes | slider | 2d | 1 | stochastic-calculus |
| `stochastic-calc-feynman-kac-heat` | stochastic-calc-feynman-kac-heat | button | 2d | 1 | stochastic-calculus |
| `stochastic-calc-geometric-brownian-motion` | stochastic-calc-geometric-brownian-motion | slider | 2d | 1 | stochastic-calculus |
| `stochastic-calc-girsanov-density` | stochastic-calc-girsanov-density | slider | 2d | 1 | stochastic-calculus |
| `stochastic-calc-ito-formula-bsq` | stochastic-calc-ito-formula-bsq | button | 2d | 1 | stochastic-calculus |
| `stochastic-calc-ito-riemann-sums` | stochastic-calc-ito-riemann-sums | slider | 2d | 1 | stochastic-calculus |
| `surg-w2` | verbatim | select | 2d | 1 | surgery-theory |
| `surg-w4` | verbatim | select | 2d | 1 | surgery-theory |
| `surg-w5` | verbatim | select | 2d | 1 | surgery-theory |
| `symplectic-cotangent-lagrangians` | symplectic-cotangent-lagrangians | click | 2d | 1 | symplectic-manifolds |
| `symplectic-darboux-moser` | symplectic-darboux-moser | slider | 2d | 1 | symplectic-manifolds |
| `symplectic-dirac-ladder` | symplectic-dirac-ladder | click | 2d | 1 | symplectic-manifolds |
| `symplectic-floer-intersections` | symplectic-floer-intersections | drag | 2d | 1 | symplectic-manifolds |
| `symplectic-form-pairing` | symplectic-form-pairing | drag | 2d | 1 | symplectic-manifolds |
| `symplectic-harmonic-portrait` | symplectic-harmonic-portrait | slider | 2d | 1 | symplectic-manifolds |
| `tda-interval-decomposition` | tda-interval-decomposition | slider | 2d | 1 | topological-data-analysis |
| `tda-w6` | verbatim | click | 2d | 1 | topological-data-analysis |
| `three-body-halo-orbits` | three-body-halo-orbits | click | 2d | 1 | three-body-problem |
| `three-body-horseshoe` | three-body-horseshoe | click | 2d | 1 | three-body-problem |
| `three-body-kam-tori` | three-body-kam-tori | slider | 2d | 1 | three-body-problem |
| `three-body-lagrange-points` | three-body-lagrange-points | slider | 2d | 1 | three-body-problem |
| `three-body-nbody-simulator` | three-body-nbody-simulator | click | 2d | 1 | three-body-problem |
| `three-body-special-solutions` | three-body-special-solutions | click | 2d | 1 | three-body-problem |
| `toric-varieties-reflexive-duality` | toric-varieties-reflexive-duality | click | 2d | 1 | toric-varieties |
| `toric-varieties-w5` | verbatim | click | 2d | 1 | toric-varieties |
| `torus-orbit-explorer` | torus-orbit-explorer | click-seed | 2d | 1 | ergodic-theory |
| `type-theory-circle-winding` | type-theory-circle-winding | click | 2d | 1 | type-theory-and-hott |
| `type-theory-context-builder` | type-theory-context-builder | click | 2d | 1 | type-theory-and-hott |
| `type-theory-infty-groupoid` | type-theory-infty-groupoid | click | 2d | 1 | type-theory-and-hott |
| `type-theory-lambda-reduction` | type-theory-lambda-reduction | click | 2d | 1 | type-theory-and-hott |
| `type-theory-path-space` | type-theory-path-space | drag | 2d | 1 | type-theory-and-hott |
| `type-theory-univalence-toggle` | type-theory-univalence-toggle | click | 2d | 1 | type-theory-and-hott |
| `uhp-parallel-postulate` | uhp-parallel-postulate | slider | 2d | 1 | upper-half-plane-hyperbolic |
| `unroll-the-cover` | unroll-the-cover | wind-loop | 2d | 1 | algebraic-topology |
| `variational-brachistochrone` | variational-brachistochrone | click | 2d | 1 | variational-methods |
| `variational-direct-method` | variational-direct-method | slider | 2d | 1 | variational-methods |
| `variational-fdiff` | variational-fdiff | slider | 2d | 1 | variational-methods |
| `variational-isoperimetric` | variational-isoperimetric | slider | 2d | 1 | variational-methods |
| `variational-mountain-pass` | variational-mountain-pass | drag | 2d | 1 | variational-methods |
| `variational-sphere-geodesic` | variational-sphere-geodesic | drag | 3d | 1 | variational-methods |
| `voa-axiom-map` | voa-axiom-map | click | 2d | 1 | vertex-operator-algebras |
| `voa-character-coeffs` | voa-character-coeffs | step | 2d | 1 | vertex-operator-algebras |
| `voa-construction-zoo` | voa-construction-zoo | select | 2d | 1 | vertex-operator-algebras |
| `voa-mckay-thompson` | voa-mckay-thompson | select | 2d | 1 | vertex-operator-algebras |
| `voa-mode-bookkeeping` | voa-mode-bookkeeping | slider | 2d | 1 | vertex-operator-algebras |
| `voa-virasoro-bracket` | voa-virasoro-bracket | step | 2d | 1 | vertex-operator-algebras |
| `wav-db` | verbatim | click | 2d | 1 | wavelets |
| `wav-dwt` | verbatim | click | 2d | 1 | wavelets |
| `wav-tile` | verbatim | click | 2d | 1 | wavelets |
| `weight-ladder-sl2` | weight-ladder-sl2 | ladder-op | 2d | 1 | lie-algebras |
| `zeta-values-mahler-measure` | zeta-values-mahler-measure | click | 2d | 1 | zeta-values |
| `zeta-values-multiple-zeta` | zeta-values-multiple-zeta | slider | 2d | 1 | zeta-values |
| `zfc-aleph-ladder` | zfc-aleph-ladder | slider | 2d | 1 | zfc-and-ordinals |
| `zfc-choice-picker` | zfc-choice-picker | click | 2d | 1 | zfc-and-ordinals |
| `zfc-continuum-locator` | zfc-continuum-locator | click | 2d | 1 | zfc-and-ordinals |
| `zfc-cumulative-hierarchy` | zfc-cumulative-hierarchy | step | 2d | 1 | zfc-and-ordinals |
| `zfc-large-cardinal-tower` | zfc-large-cardinal-tower | click | 2d | 1 | zfc-and-ordinals |
| `zfc-ordinal-calculator` | zfc-ordinal-calculator | click | 2d | 1 | zfc-and-ordinals |
| `zfc-ordinal-picket-fence` | zfc-ordinal-picket-fence | slider | 2d | 1 | zfc-and-ordinals |

## Per-subject

### Logic & Foundations

- Topics: **8**, concepts: **49**
- Widgets: **51** (registry-driven: 51, inline: 0)
  - by family: clickable-diagram: 3, button-stepper: 1, nst-product-powerset: 1, nst-axiom-of-choice: 1, fol-term-tree: 1, fol-model-checker: 1, build-a-formula: 1, fol-modus-ponens-closure: 1, fol-henkin-construction: 1, fol-compactness-finite-sat: 1, fol-skolem-paradox: 1, fol-dlo-quantifier-elimination: 1, zfc-cumulative-hierarchy: 1, zfc-ordinal-picket-fence: 1, zfc-ordinal-calculator: 1, zfc-aleph-ladder: 1, zfc-choice-picker: 1, zfc-continuum-locator: 1, zfc-large-cardinal-tower: 1, model-theory-signature-explorer: 1, model-theory-equivalence-prober: 1, model-theory-back-and-forth: 1, model-theory-types-explorer: 1, model-theory-ef-games: 1, model-theory-ax-grothendieck: 1, computability-turing-increment: 1, computability-recursion-tracer: 1, computability-halting-diagonal: 1, computability-rec-vs-re-venn: 1, computability-reduction-graph: 1, computability-godel-encoding: 1, complexity-growth-rates: 1, complexity-sat-verifier: 1, complexity-cook-levin-tableau: 1, complexity-karp-reduction: 1, complexity-savitch-recursion: 1, complexity-hierarchy-diagonal: 1, type-theory-context-builder: 1, type-theory-lambda-reduction: 1, type-theory-path-space: 1, type-theory-univalence-toggle: 1, type-theory-circle-winding: 1, type-theory-infty-groupoid: 1, forcing-poset: 1, forcing-generic-filter: 1, forcing-truth-table: 1, forcing-cohen-real: 1, forcing-continuum-landing: 1, forcing-dependency-map: 1
  - by dimension: 2d: 51
  - by gesture: click: 23, step: 13, slider: 3, toggle: 3, stepper: 2, compose-evaluate: 1, type: 1, input: 1, graph-walk: 1, drag: 1, table: 1, diagram: 1
- Quizzes: **162** (v1: 147, hard: 15, expert: 0)
  - by type: mcq: 128, numeric: 34

### Algebra & homological

- Topics: **17**, concepts: **148**
- Widgets: **160** (registry-driven: 160, inline: 0)
  - by family: button-stepper: 53, clickable-diagram: 23, slider-readout: 15, verbatim: 10, parametric-plot: 9, proof-scrubber: 2, quantum-groups-hopf-axioms-inspector: 1, quantum-groups-qsl2-deformation-slider: 1, quantum-groups-yang-baxter-reidemeister: 1, quantum-groups-crystal-tensor-product: 1, quantum-groups-reshetikhin-turaev-knots: 1, quantum-groups-applications-map: 1, quaternions-multiplication-tester: 1, quaternions-rotation-visualizer: 1, quaternions-cayley-dickson-ladder: 1, quaternions-fano-plane-oracle: 1, quaternions-frobenius-case-tree: 1, quaternions-hurwitz-tower-bar: 1, algebra-structures: 1, algebra-ring-ideals: 1, algebra-field-tower: 1, naturality-square: 1, declarative-host: 1, rep-theory-homomorphism: 1, rep-theory-orthogonality: 1, clickable-graph: 1, commutative-algebra-completion: 1, commutative-algebra-dedekind: 1, commutative-algebra-koszul: 1, diagram-editor: 1, homological-les-sphere: 1, homological-double-complex: 1, homological-tor-symmetry: 1, homological-cartan-eilenberg: 1, group-cohomology-coboundary-calculator: 1, group-cohomology-fixed-points: 1, group-cohomology-hilbert-90: 1, group-cohomology-c2-extensions: 1, group-cohomology-tate-periodic-table: 1, group-cohomology-lhs-spectral: 1, group-cohomology-brauer-cheatsheet: 1, lie-algebras-bracket-table: 1, lie-algebras-adjoint-vis: 1, lie-algebras-derived-series: 1, lie-algebras-root-vis: 1, lie-algebras-weight-diagram: 1, weight-ladder-sl2: 1, lie-algebras-dynkin-gallery: 1, gcb-cocycle-tester: 1, gcb-mu2-torsor-visualizer: 1, gcb-central-extension-browser: 1, gcb-cyclic-algebra-tester: 1, gcb-tate-pairing-table: 1, gcb-hasse-counterexample-gallery: 1
  - by dimension: 2d: 159, 3d: 1
  - by gesture: click: 108, select: 22, slider: 10, interact: 6, inspect: 3, input: 2, toggle: 2, scrub: 2, slider+click: 1, interactive: 1, drag-and-toggle: 1, step: 1, ladder-op: 1
- Quizzes: **631** (v1: 445, hard: 186, expert: 0)
  - by type: mcq: 380, numeric: 156, multi-select: 45, ordering: 19, matching: 17, spot-the-error: 9, proof-completion: 4, complex: 1

### Higher categories & toposes

- Topics: **7**, concepts: **45**
- Widgets: **49** (registry-driven: 49, inline: 0)
  - by family: clickable-diagram: 14, declarative-host: 13, proof-scrubber: 8, button-stepper: 3, svg-illustration: 1, cocartesian-fibrations-leftright-scrubber: 1, cocartesian-fibrations-edge-scrubber: 1, cocartesian-fibrations-fibration-clickable: 1, cocartesian-fibrations-transport-clickable: 1, cocartesian-fibrations-grothendieck-scrubber: 1, cocartesian-fibrations-universal-leftfib: 1, cocartesian-fibrations-grothendieck-codecell: 1, cocartesian-fibrations-examples-graph: 1, counterexample-explorer: 1, inline-code-cell: 1
  - by dimension: 2d: 49
  - by gesture: click: 29, scrub: 8, interact: 8, step: 2, read: 1, edit: 1
- Quizzes: **183** (v1: 135, hard: 48, expert: 0)
  - by type: mcq: 139, multi-select: 24, numeric: 8, matching: 6, spot-the-error: 5, ordering: 1

### Analysis

- Topics: **24**, concepts: **223**
- Widgets: **257** (registry-driven: 257, inline: 0)
  - by family: slider-readout: 44, button-stepper: 43, clickable-diagram: 42, parametric-plot: 12, verbatim: 6, aca-figure: 5, vector-field-flow-2d: 5, draggable-points-2d: 3, sketch-curve-2d: 3, recurrence-plotter: 2, advanced-complex-analysis-picard: 2, surface-3d: 2, torus-orbit-explorer: 1, inline-code-cell: 1, proof-scrubber: 1, several-complex-variables-reinhardt-pseudoconvex: 1, advanced-complex-analysis-landscape: 1, advanced-complex-analysis-weierstrass: 1, advanced-complex-analysis-mittag-leffler: 1, advanced-complex-analysis-phragmen-lindelof: 1, advanced-complex-analysis-three-circles: 1, advanced-complex-analysis-hardy-spaces: 1, numerical-fp-cancellation: 1, numerical-newton-iteration: 1, numerical-quadrature-error: 1, animated-svg-2d: 1, numerical-hilbert-conditioning: 1, numerical-ftcs-stability: 1, numerical-fem-hat-basis: 1, variational-fdiff: 1, variational-brachistochrone: 1, variational-direct-method: 1, variational-mountain-pass: 1, variational-isoperimetric: 1, variational-sphere-geodesic: 1, continuity-band-2d: 1, constraint-bifurcation-explorer: 1, mt-sigma-algebra: 1, complex-analysis-arithmetic: 1, complex-analysis-riemann-sphere: 1, complex-map-2d: 1, complex-analysis-conformal-map: 1, complex-analysis-conformal-grid: 1, complex-analysis-cauchy-theorem: 1, complex-analysis-cauchy-formula: 1, complex-analysis-liouville: 1, complex-analysis-fta: 1, complex-analysis-max-modulus: 1, complex-analysis-open-mapping: 1, complex-analysis-schwarz-lemma: 1, complex-analysis-laurent: 1, complex-analysis-singularity-zoo: 1, complex-analysis-residue-real-integral: 1, contour-residue-2d: 1, complex-analysis-argument-principle: 1, complex-analysis-disk-automorphism: 1, complex-analysis-normal-families: 1, complex-analysis-riemann-mapping: 1, complex-analysis-harmonic: 1, complex-analysis-monodromy: 1, functional-analysis-bounded-continuous: 1, functional-analysis-bigfour: 1, functional-analysis-riesz: 1, functional-analysis-weak-convergence: 1, functional-analysis-banach-alaoglu: 1, functional-analysis-krein-milman: 1, operator-algebras-cstar: 1, operator-algebras-funccalc: 1, operator-algebras-positive: 1, eigenvector-explorer-2d: 1, xy-parameter-pad: 1, julia-playground: 1, bifurcation-1d: 1, sobolev-pairing: 1, sobolev-weak-derivative: 1, sobolev-fractional-power: 1, sobolev-embedding-exponent: 1, sobolev-trace: 1, sobolev-newtonian-potential: 1, sobolev-variational: 1, harmonic-partial-sum: 1, harmonic-tent-transform: 1, harmonic-convolution: 1, harmonic-schwartz: 1, harmonic-uncertainty: 1, harmonic-poisson: 1, harmonic-heat-evolution: 1, harmonic-pontryagin: 1, pde-classifier: 1, pde-heat-kernel: 1, pde-wave-dalembert: 1, pde-poisson-disk: 1, pde-weak-test: 1, pde-sobolev-embedding: 1, harmonic-functions-laplacian-heatmap: 1, harmonic-functions-mvp-circle: 1, harmonic-functions-maximum-locator: 1, harmonic-functions-poisson-extension: 1, harmonic-functions-harnack-corridor: 1, harmonic-functions-perron-supremum: 1
  - by dimension: 2d: 254, 3d: 3
  - by gesture: click: 94, slider: 90, interact: 35, drag: 10, select: 8, click-seed: 6, draw: 3, edit: 1, timeline: 1, step: 1, play: 1, static: 1, slide-band: 1, drag-probe: 1, drag-contour: 1, drag-direction: 1, two-param-scrub: 1, dial: 1
- Quizzes: **813** (v1: 628, hard: 185, expert: 0)
  - by type: mcq: 514, numeric: 170, multi-select: 40, matching: 29, ordering: 23, complex: 14, spot-the-error: 11, proof-completion: 10, construction: 1, guess-my-rule: 1

### Probability & statistics

- Topics: **11**, concepts: **76**
- Widgets: **82** (registry-driven: 82, inline: 0)
  - by family: slider-readout: 16, button-stepper: 15, sampling-box: 2, vector-field-flow-2d: 1, ms-bias-variance: 1, ms-likelihood-curve: 1, draggable-points-2d: 1, ms-crlb-envelope: 1, ms-neyman-pearson: 1, ms-beta-posterior: 1, ms-wilks-theorem: 1, hdg-sphere-concentration-band: 1, hdg-dvoretzky-section: 1, hdg-jl-distortion-histogram: 1, hdg-talagrand-deviation: 1, hdg-isoperimetry-tail: 1, hdg-marchenko-pastur: 1, bayes-mass-updater: 1, prob-convergence-modes: 1, animated-svg-2d: 1, prob-martingale-stopping: 1, stoch-proc-filtration-stopping: 1, stoch-proc-random-walk-martingale: 1, stoch-proc-gamblers-ruin: 1, stoch-proc-doob-decomposition: 1, stoch-proc-convergence-regimes: 1, stoch-proc-brownian-quadratic-variation: 1, stochastic-calc-ito-riemann-sums: 1, stochastic-calc-ito-formula-bsq: 1, stochastic-calc-geometric-brownian-motion: 1, stochastic-calc-girsanov-density: 1, stochastic-calc-feynman-kac-heat: 1, stochastic-calc-binomial-black-scholes: 1, random-walks-graph-step: 1, random-walks-matrix-power: 1, random-walks-tv-distance: 1, random-walks-eigenvalue-inspector: 1, random-walks-cycle-coupling: 1, random-walks-metropolis-hastings: 1, information-entropy: 1, information-mutual-info-venn: 1, information-kl-simplex: 1, information-huffman-builder: 1, information-bsc-capacity: 1, information-rate-distortion: 1, info-aep-typical-set: 1, info-cramer-rao: 1, large-dev-cramer-tilt: 1, large-dev-rate-gallery: 1, large-dev-sanov-kl: 1, large-dev-gartner-ar1: 1, large-dev-schilder-paths: 1
  - by dimension: 2d: 82
  - by gesture: slider: 44, click: 22, step: 5, input: 2, shake-sample: 2, button: 2, click-seed: 1, drag: 1, pour-update: 1, play: 1, toggle: 1
- Quizzes: **265** (v1: 228, hard: 24, expert: 13)
  - by type: mcq: 167, numeric: 70, multi-select: 10, matching: 5, spot-the-error: 5, ordering: 3, proof-completion: 3, construction: 1, complex: 1

### Geometry & topology

- Topics: **25**, concepts: **160**
- Widgets: **188** (registry-driven: 188, inline: 0)
  - by family: slider-readout: 46, button-stepper: 36, verbatim: 12, clickable-diagram: 6, surface-viewer: 6, surface-3d: 2, clickable-graph: 2, svg-illustration: 2, draggable-points-2d: 1, cup-product-grid: 1, cohomology-stiefel-whitney-rpn: 1, mostow-rigidity-dial: 1, mostow-h3-fundamental-domain: 1, mostow-boundary-extension: 1, mostow-boundary-orbit: 1, mostow-rank-tower: 1, mostow-volume-spectrum: 1, symplectic-form-pairing: 1, symplectic-darboux-moser: 1, symplectic-harmonic-portrait: 1, symplectic-dirac-ladder: 1, symplectic-cotangent-lagrangians: 1, symplectic-floer-intersections: 1, knot-polynomials-gallery: 1, knot-polynomials-reidemeister: 1, knot-polynomials-alexander: 1, knot-polynomials-bracket: 1, knot-polynomials-homfly: 1, knot-polynomials-rmatrix: 1, knot-polynomials-vassiliev: 1, knot-polynomials-khovanov: 1, ricci-einstein-flows: 1, ricci-deturck-trick: 1, ricci-blowup-rates: 1, ricci-soliton-zoo: 1, ricci-neckpinch-surgery: 1, ricci-extinction-timeline: 1, k-theory-grothendieck-builder: 1, k-theory-ses-relations: 1, k-theory-bott-periodicity: 1, k-theory-chern-character: 1, k-theory-low-k-groups: 1, k-theory-index-theorem: 1, atiyah-singer-index-family: 1, atiyah-singer-symbol: 1, atiyah-singer-ch-td: 1, atiyah-singer-cases: 1, atiyah-singer-dirac-sphere: 1, atiyah-singer-anomaly: 1, counterexample-explorer: 1, proof-scrubber: 1, unroll-the-cover: 1, sm-manifold-gallery: 1, linear-transform-2d: 1, diff-forms-integration: 1, diff-forms-pullback: 1, osculating-circle-2d: 1, diff-geom-surface-patch: 1, diff-geom-fundamental-forms: 1, eigenvector-explorer-2d: 1, rg-ricci-curvature: 1, rg-volume-form: 1, lie-algebra-tangent: 1, lie-adjoint-killing: 1, riemann-surfaces-chart-atlas: 1, lattice-visualizer: 1, fold-the-polygon: 1, characteristic-classes-mobius-vs-cylinder: 1, characteristic-classes-w1-surfaces: 1, characteristic-classes-c1-clutching: 1, characteristic-classes-pontryagin-formulas: 1, characteristic-classes-poincare-hopf: 1, characteristic-classes-gauss-bonnet: 1, characteristic-classes-classifying-map: 1, characteristic-classes-signature-l-genus: 1, characteristic-classes-cpn-localisation: 1, morse-torus-height: 1, morse-handle-decomp: 1, morse-cw-cells: 1, morse-betti-counts: 1, morse-gradient-flow: 1, morse-sphere-vs-rp2: 1, morse-smale-saddle: 1, morse-cerf-birth-death: 1
  - by dimension: 2d: 179, 3d: 9
  - by gesture: click: 77, slider: 54, select: 25, drag: 11, button-stepper: 6, step: 3, pick: 2, static: 2, interact: 1, click-multiply: 1, timeline: 1, wind-loop: 1, drag-basis: 1, drag-along-curve: 1, drag-direction: 1, fold-glue: 1
- Quizzes: **622** (v1: 480, hard: 142, expert: 0)
  - by type: mcq: 410, numeric: 160, multi-select: 22, matching: 10, ordering: 7, complex: 7, spot-the-error: 3, proof-completion: 3

### Number theory

- Topics: **19**, concepts: **128**
- Widgets: **165** (registry-driven: 165, inline: 0)
  - by family: button-stepper: 66, slider-readout: 28, verbatim: 12, clickable-diagram: 4, modular-arithmetic-clock: 4, input-form: 4, inline-code-cell: 4, algorithm-stepper: 2, declarative-host: 2, parametric-plot: 2, crypto-totient-units: 1, crypto-rsa-toy: 1, crypto-diffie-hellman: 1, crypto-ecc-points: 1, crypto-lwe-samples: 1, crypto-schnorr-protocol: 1, branching-proof-scrubber: 1, galois-normal-separable: 1, galois-primitive-element: 1, quad-recip-supplementary: 1, quad-recip-jacobi: 1, ant-waring-finiteness: 1, padic-newton-polygon: 1, padic-ramification-tower: 1, clickable-graph: 1, fr-splitting-types: 1, fr-decomposition: 1, class-field-theory-existence: 1, class-field-theory-conductor-discriminant: 1, svg-illustration: 1, heights-naive-calculator: 1, heights-northcott-enumerator: 1, heights-weil-pullback: 1, heights-tate-averaging: 1, heights-mahler-measure: 1, heights-genus-growth: 1, heights-arakelov-decomposition: 1, counterexample-explorer: 1, ant-pnt-comparison: 1, ant-explicit-formula: 1, ant-zero-free-region: 1, ant-dirichlet-residue-wheel: 1, ant-sieve-truncation: 1, ant-bombieri-vinogradov: 1, proof-scrubber: 1, galois-representations-semisimplification: 1, galois-representations-conductor: 1
  - by dimension: 2d: 165
  - by gesture: click: 89, slider: 32, select: 16, input: 12, edit: 4, step-state: 2, interactive: 2, interact: 2, drag: 1, button: 1, static: 1, branching-timeline: 1, read: 1, timeline: 1
- Quizzes: **564** (v1: 381, hard: 183, expert: 0)
  - by type: mcq: 375, numeric: 164, multi-select: 11, matching: 5, ordering: 4, complex: 3, spot-the-error: 1, guess-my-rule: 1

### Modular forms & L-functions

- Topics: **19**, concepts: **116**
- Widgets: **150** (registry-driven: 150, inline: 0)
  - by family: button-stepper: 85, slider-readout: 13, verbatim: 5, parametric-plot: 5, svg-illustration: 4, lattice-visualizer: 2, langlands-reciprocity-dictionary: 1, langlands-euler-product: 1, langlands-local-classification: 1, langlands-cft-gl1: 1, langlands-gl2-modularity: 1, voa-mode-bookkeeping: 1, voa-axiom-map: 1, voa-virasoro-bracket: 1, voa-character-coeffs: 1, voa-mckay-thompson: 1, voa-construction-zoo: 1, uhp-parallel-postulate: 1, modular-forms-petersson-convergence: 1, functional-equation-mirror: 1, zeta-values-multiple-zeta: 1, zeta-values-mahler-measure: 1, l-functions-zeta-continuation: 1, l-functions-class-number: 1, automorphic-restricted-product: 1, automorphic-strong-approximation: 1, automorphic-three-conditions: 1, automorphic-dictionary: 1, automorphic-satake-parameters: 1, automorphic-conductor-ladder: 1, automorphic-local-factor-builder: 1, automorphic-eisenstein-residue: 1, automorphic-functoriality-transfers: 1, modular-curves-fundamental-domain: 1, modular-curves-lattice-cyclic-subgroup: 1, modular-curves-hecke-summands: 1, modular-curves-eichler-shimura: 1, modular-curves-genus-growth: 1, modular-curves-cusps-and-wn: 1, modular-curves-atkin-lehner-newforms: 1, modular-curves-heegner-hypothesis: 1, modular-curves-mazur-torsion: 1
  - by dimension: 2d: 150
  - by gesture: click: 102, slider: 22, select: 9, step: 8, static: 4, interact: 3, input: 1, drag-reflect: 1
- Quizzes: **528** (v1: 348, hard: 180, expert: 0)
  - by type: mcq: 351, numeric: 158, multi-select: 12, matching: 4, ordering: 2, spot-the-error: 1

### Algebraic geometry

- Topics: **35**, concepts: **213**
- Widgets: **267** (registry-driven: 267, inline: 0)
  - by family: button-stepper: 76, slider-readout: 43, clickable-diagram: 33, verbatim: 8, proof-scrubber: 7, clickable-graph: 6, declarative-host: 6, parametric-plot: 4, modular-arithmetic-clock: 2, svg-illustration: 2, motives-realization-comparison: 1, motives-correspondences: 1, motives-chow-decomposition: 1, motives-tate-twist: 1, motives-tannakian: 1, motives-motivic-galois: 1, motives-standard-conjectures: 1, hodge-theory-why-refinement: 1, hodge-theory-hodge-diamond: 1, hodge-theory-filtration-scrubber: 1, hodge-theory-pure-structure: 1, hodge-theory-mixed-weight: 1, hodge-theory-hodge-class-cases: 1, hodge-theory-period-elliptic: 1, toric-varieties-reflexive-duality: 1, calabi-yau-canonical-degree: 1, calabi-yau-hodge-diamond: 1, calabi-yau-hypersurface-zoo: 1, calabi-yau-periods: 1, calabi-yau-mirror-swap: 1, calabi-yau-syz-fibration: 1, mirror-hodge-diamond: 1, mirror-quintic-counts: 1, mirror-stable-map: 1, mirror-quintic-periods: 1, mirror-hms-pairing: 1, mirror-syz-fibration: 1, resolution-cusp-node-visualizer: 1, resolution-cuspidal-blowup: 1, resolution-tower-of-blowups: 1, resolution-curve-normalization: 1, resolution-ade-dynkin: 1, resolution-applications-map: 1, pp-duality: 1, pp-cross-ratio: 1, draggable-points-2d: 1, bezout-statement: 1, bezout-cayley-bacharach: 1, bezout-higherdim: 1, schemes-spec: 1, schemes-specialization: 1, schemes-residue-field: 1, schemes-stalk: 1, schemes-proj: 1, schemes-dimension: 1, sheaves-presheaf-restriction: 1, sheaves-ox-module: 1, morphisms-scheme-morphism: 1, morphisms-separated-proper: 1, functor-of-points-groupoid-target: 1, functor-of-points-yoneda: 1, functor-of-points-base-change: 1, ec-disc: 1, elliptic-group-law-2d: 1, ec-j: 1, lattice-visualizer: 1, ec-mw: 1, singular-cubics-minimal-model: 1, algebraic-curves-riemann-hurwitz-cover: 1, algebraic-curves-jacobian-lattice: 1, algebraic-curves-riemann-roch-scrubber: 1, algebraic-curves-canonical-embedding-scrubber: 1, algebraic-curves-hyperelliptic-cover: 1, algebraic-curves-moduli-boundary: 1, sheaf-cohomology-nerve: 1, sheaf-cohomology-acyclic: 1, sheaf-cohomology-leray: 1, sheaf-cohomology-serre-duality: 1, algebraic-de-rham-kahler-scrubber: 1, algebraic-de-rham-complex-scrubber: 1, algebraic-de-rham-betti-comparison-scrubber: 1, algebraic-de-rham-hodge-filtration-scrubber: 1, algebraic-de-rham-hodge-diamond-clickgraph: 1, algebraic-de-rham-hodge-pn-explorer: 1, algebraic-de-rham-curve-clickable: 1, algebraic-de-rham-hodge-sandbox: 1, moduli-spaces-triangle-similarity: 1, stacks-quotient-stack: 1, stacks-dm-vs-artin: 1, counterexample-explorer: 1
  - by dimension: 2d: 267
  - by gesture: click: 146, slider: 50, interact: 32, select: 20, scrub: 7, inspect: 5, drag: 4, step: 1, drag-on-curve: 1, slide: 1
- Quizzes: **884** (v1: 639, hard: 245, expert: 0)
  - by type: mcq: 591, numeric: 221, multi-select: 36, matching: 18, ordering: 7, spot-the-error: 7, complex: 3, proof-completion: 1

### Combinatorics & graph theory

- Topics: **15**, concepts: **93**
- Widgets: **100** (registry-driven: 100, inline: 0)
  - by family: parametric-plot: 34, button-stepper: 7, verbatim: 5, graph-edit-2d: 5, slider-readout: 2, designs-bibd-calculator: 1, designs-fisher-incidence: 1, designs-fano-plane: 1, designs-mols-construction: 1, designs-hamming-fano: 1, designs-round-robin: 1, expanders-vertex-expansion: 1, expanders-zigzag-product: 1, spectral-graph-theory-adjacency: 1, spectral-graph-theory-components: 1, spectral-graph-theory-fiedler: 1, spectral-graph-theory-cheeger: 1, spectral-graph-theory-random-walk: 1, spectral-graph-theory-bipartite: 1, spectral-graph-theory-clustering: 1, matroid-axiom-checker: 1, matroid-bases-rank-explorer: 1, matroid-graph-forests: 1, matroid-flats-stepper: 1, matroid-dual-explorer: 1, matroid-greedy-vs-nonmatroid: 1, matroid-tutte-polynomial: 1, probabilistic-method-existence: 1, probabilistic-method-ramsey: 1, probabilistic-method-linearity: 1, probabilistic-method-alterations: 1, probabilistic-method-lll: 1, probabilistic-method-threshold: 1, probabilistic-method-concentration: 1, extremal-combinatorics-turan: 1, extremal-combinatorics-kst: 1, extremal-combinatorics-erdos-stone: 1, extremal-combinatorics-ramsey: 1, extremal-combinatorics-sperner: 1, extremal-combinatorics-removal: 1, simplicial-complexes-combinatorial-faces: 1, simplicial-complexes-combinatorial-fh: 1, simplicial-complexes-combinatorial-nerve: 1, simplicial-complexes-combinatorial-shell: 1, simplicial-complexes-combinatorial-sr: 1, simplicial-complexes-combinatorial-persistence: 1, enumerative-combinatorics-pascal: 1, enumerative-combinatorics-venn: 1, enumerative-combinatorics-genfun: 1, enumerative-combinatorics-perm: 1, enumerative-combinatorics-young: 1, enumerative-combinatorics-bijection: 1
  - by dimension: 2d: 100
  - by gesture: slider: 51, click: 36, step: 8, graph-edit: 5
- Quizzes: **294** (v1: 279, hard: 15, expert: 0)
  - by type: mcq: 196, numeric: 71, multi-select: 23, matching: 2, spot-the-error: 1, ordering: 1

### Mathematical physics

- Topics: **13**, concepts: **81**
- Widgets: **84** (registry-driven: 84, inline: 0)
  - by family: slider-readout: 32, parametric-plot: 12, schrodinger-figure: 7, button-stepper: 6, hamiltonians-figure: 6, verbatim: 4, clickable-diagram: 3, xy-parameter-pad: 1, general-relativity-light-cones: 1, general-relativity-einstein: 1, general-relativity-schwarzschild: 1, surface-3d: 1, general-relativity-kerr: 1, general-relativity-cosmology: 1, general-relativity-gw: 1, three-body-nbody-simulator: 1, three-body-lagrange-points: 1, three-body-special-solutions: 1, three-body-horseshoe: 1, three-body-kam-tori: 1, three-body-halo-orbits: 1
  - by dimension: 2d: 83, 3d: 1
  - by gesture: slider: 57, click: 16, interact: 7, drag: 2, two-param-scrub: 1, select: 1
- Quizzes: **244** (v1: 244, hard: 0, expert: 0)
  - by type: mcq: 164, numeric: 32, multi-select: 23, ordering: 11, spot-the-error: 8, matching: 6

### Control theory & optimization

- Topics: **9**, concepts: **58**
- Widgets: **68** (registry-driven: 68, inline: 0)
  - by family: slider-readout: 25, parametric-plot: 24, button-stepper: 5, verbatim: 3, animated-svg-2d: 3, sketch-curve-2d: 1, inline-code-cell: 1, clickable-diagram: 1, draggable-points-2d: 1, grid-world-mdp: 1, best-response-explorer-2d: 1, q-learning-grid-world: 1, belief-grid-localization: 1
  - by dimension: 2d: 68
  - by gesture: slider: 49, click: 6, play: 3, edit-grid: 3, select: 2, drag: 2, scrub: 1, draw: 1, edit: 1
- Quizzes: **174** (v1: 174, hard: 0, expert: 0)
  - by type: mcq: 116, numeric: 36, multi-select: 14, matching: 4, spot-the-error: 2, ordering: 2

### Learning theory & data science

- Topics: **9**, concepts: **56**
- Widgets: **63** (registry-driven: 63, inline: 0)
  - by family: parametric-plot: 42, slider-readout: 10, draggable-points-2d: 4, clickable-diagram: 2, vector-field-flow-2d: 2, tda-interval-decomposition: 1, verbatim: 1, shatter-arena: 1
  - by dimension: 2d: 63
  - by gesture: slider: 53, drag: 4, click: 3, click-seed: 2, construct-to-break: 1
- Quizzes: **166** (v1: 166, hard: 0, expert: 0)
  - by type: mcq: 117, numeric: 25, multi-select: 17, ordering: 6, matching: 1

## Gesture-variety watchlist

Topics with **≥4 concepts** but **no direct-manipulation gesture** — every toy on
the page is a passive *scrub* (slide/play/step) or a discrete *pick* (click/select),
nothing is built by hand. A topic here is a candidate for a new *gesture*, not a new
widget: it already has toys, they all move the same way. Ranked by concept count
(most under-served first). This is the surface that flags reinforcement-learning /
pomdps-and-belief-states without a human eyeballing the corpus.

| topic | section | concepts | widgets | modes | gesture mix |
|---|---|---:|---:|---|---|
| `algebra` | Algebra & homological | 16 | 19 | pick: 18, other: 1 | click: 16, select: 2, interact: 1 |
| `commutative-algebra` | Algebra & homological | 16 | 16 | pick: 14, other: 2 | select: 10, click: 4, interact: 2 |
| `additive-number-theory` | Number theory | 15 | 21 | pick: 18, other: 2, scrub: 1 | click: 14, input: 4, interactive: 2, slider: 1 |
| `advanced-complex-analysis` | Analysis | 13 | 13 | other: 8, scrub: 4, pick: 1 | interact: 8, slider: 4, click: 1 |
| `representation-theory` | Algebra & homological | 13 | 15 | pick: 15 | click: 15 |
| `measure-theory` | Analysis | 12 | 13 | pick: 13 | click: 13 |
| `operator-algebras` | Analysis | 12 | 15 | pick: 14, scrub: 1 | click: 12, select: 2, slider: 1 |
| `automorphic-forms-adelic` | Modular forms & L-functions | 9 | 9 | scrub: 6, pick: 3 | step: 3, click: 3, slider: 3 |
| `characteristic-classes` | Geometry & topology | 9 | 9 | pick: 6, scrub: 3 | click: 6, slider: 3 |
| `modular-curves` | Modular forms & L-functions | 9 | 9 | scrub: 5, pick: 4 | click: 4, step: 3, slider: 2 |
| `spectral-theory` | Analysis | 9 | 9 | scrub: 7, pick: 2 | slider: 7, click: 2 |
| `groebner-bases` | Algebra & homological | 8 | 8 | pick: 8 | click: 6, select: 2 |
| `harmonic-analysis-fourier` | Analysis | 8 | 8 | scrub: 5, pick: 2, other: 1 | slider: 5, select: 2, interact: 1 |
| `hodge-theory` | Algebraic geometry | 8 | 7 | other: 4, scrub: 2, pick: 1 | interact: 4, click: 1, slider: 1, step: 1 |
| `information-theory` | Probability & statistics | 8 | 8 | scrub: 6, pick: 2 | slider: 6, click: 2 |
| `knot-polynomials` | Geometry & topology | 8 | 8 | pick: 5, scrub: 3 | click: 5, step: 2, slider: 1 |
| `langlands-program` | Modular forms & L-functions | 8 | 5 | other: 3, pick: 2 | interact: 3, click: 2 |
| `moonshine` | Modular forms & L-functions | 8 | 8 | pick: 8 | click: 8 |
| `morse-theory` | Geometry & topology | 8 | 8 | scrub: 4, pick: 4 | slider: 4, click: 4 |
| `motives` | Algebraic geometry | 8 | 7 | other: 3, pick: 3, scrub: 1 | interact: 3, click: 3, slider: 1 |
| `wavelets` | Analysis | 8 | 9 | pick: 6, scrub: 3 | click: 6, slider: 3 |
| `brill-noether` | Algebraic geometry | 7 | 7 | scrub: 5, pick: 2 | slider: 5, click: 2 |
| `cocartesian-fibrations` | Higher categories & toposes | 7 | 8 | other: 8 | interact: 8 |
| `coding-theory` | Combinatorics & graph theory | 7 | 7 | pick: 5, scrub: 2 | click: 5, slider: 2 |
| `combinatorial-optimization` | Control theory & optimization | 7 | 8 | pick: 5, scrub: 3 | click: 3, slider: 2, select: 2, play: 1 |
| `computational-molecular-biology` | Probability & statistics | 7 | 7 | scrub: 5, pick: 2 | slider: 5, input: 2 |
| `conformal-and-cr-geometry` | Analysis | 7 | 7 | scrub: 5, pick: 2 | slider: 5, click: 2 |
| `derived-categories` | Algebra & homological | 7 | 7 | pick: 5, scrub: 2 | click: 5, scrub: 2 |
| `donaldson-thomas-and-gw-invariants` | Algebraic geometry | 7 | 7 | pick: 4, scrub: 3 | click: 4, slider: 3 |
| `elementary-topos-theory` | Higher categories & toposes | 7 | 7 | pick: 7 | click: 7 |
| `galois` | Number theory | 7 | 9 | pick: 6, other: 2, scrub: 1 | click: 6, static: 1, branching-timeline: 1, slider: 1 |
| `gauge-theory` | Mathematical physics | 7 | 7 | scrub: 4, pick: 3 | slider: 4, click: 2, select: 1 |
| `group-cohomology` | Algebra & homological | 7 | 7 | pick: 7 | click: 7 |
| `heegaard-floer` | Geometry & topology | 7 | 7 | pick: 4, scrub: 2, other: 1 | select: 2, slider: 2, click: 2, interact: 1 |
| `mathematical-finance` | Control theory & optimization | 7 | 7 | scrub: 5, pick: 2 | slider: 5, click: 2 |
| `matroid-theory` | Combinatorics & graph theory | 7 | 7 | scrub: 4, pick: 3 | click: 3, slider: 3, step: 1 |
| `optimal-control-and-dynamic-programming` | Control theory & optimization | 7 | 7 | scrub: 7 | slider: 6, scrub: 1 |
| `positive-characteristic-ag` | Algebraic geometry | 7 | 9 | pick: 6, scrub: 2, other: 1 | select: 4, click: 2, slider: 2, interact: 1 |
| `probabilistic-method` | Combinatorics & graph theory | 7 | 7 | scrub: 5, pick: 2 | slider: 5, click: 2 |
| `random-matrix-theory` | Probability & statistics | 7 | 7 | pick: 4, scrub: 3 | click: 4, slider: 3 |
| `sheaves` | Algebraic geometry | 7 | 9 | pick: 8, scrub: 1 | click: 8, slider: 1 |
| `sobolev-spaces-distributions` | Analysis | 7 | 7 | scrub: 6, pick: 1 | slider: 6, click: 1 |
| `string-theory` | Mathematical physics | 7 | 7 | scrub: 5, pick: 2 | slider: 5, click: 2 |
| `zeta-values` | Modular forms & L-functions | 7 | 7 | pick: 6, scrub: 1 | click: 6, slider: 1 |
| `zfc-and-ordinals` | Logic & Foundations | 7 | 7 | pick: 4, scrub: 3 | click: 4, slider: 2, step: 1 |
| `abelian-varieties` | Algebraic geometry | 6 | 6 | pick: 4, scrub: 2 | click: 3, slider: 2, select: 1 |
| `algebraic-combinatorics` | Combinatorics & graph theory | 6 | 6 | scrub: 6 | slider: 6 |
| `algebraic-curves-higher-genus` | Algebraic geometry | 6 | 6 | other: 6 | interact: 6 |
| `algebraic-de-rham-cohomology` | Algebraic geometry | 6 | 8 | other: 8 | interact: 8 |
| `algebraic-k-theory-foundations` | Algebra & homological | 6 | 6 | pick: 4, scrub: 2 | click: 3, slider: 2, input: 1 |
| `algebraic-spaces` | Algebraic geometry | 6 | 6 | pick: 4, scrub: 2 | click: 4, scrub: 2 |
| `arithmetic-statistics` | Number theory | 6 | 6 | pick: 4, scrub: 2 | select: 3, slider: 2, input: 1 |
| `atiyah-singer-index-theorem` | Geometry & topology | 6 | 6 | scrub: 4, pick: 2 | slider: 4, pick: 2 |
| `calabi-yau-manifolds` | Algebraic geometry | 6 | 6 | scrub: 5, pick: 1 | slider: 5, click: 1 |
| `causal-inference` | Learning theory & data science | 6 | 6 | scrub: 6 | slider: 6 |
| `class-field-theory` | Number theory | 6 | 10 | pick: 10 | click: 9, read: 1 |
| `cluster-algebras` | Algebra & homological | 6 | 6 | pick: 6 | click: 4, select: 2 |
| `cobordism` | Geometry & topology | 6 | 6 | pick: 3, scrub: 3 | select: 3, slider: 3 |
| `cohomology-and-duality` | Geometry & topology | 6 | 7 | pick: 5, other: 1, scrub: 1 | select: 3, click: 2, click-multiply: 1, slider: 1 |
| `complexity-theory` | Logic & Foundations | 6 | 6 | scrub: 3, other: 2, pick: 1 | step: 2, slider: 1, input: 1, graph-walk: 1, toggle: 1 |
| `computational-number-theory` | Number theory | 6 | 7 | pick: 5, scrub: 2 | input: 4, slider: 1, step-state: 1, click: 1 |
| `condensed-mathematics` | Algebra & homological | 6 | 6 | pick: 5, scrub: 1 | click: 3, select: 2, slider: 1 |
| `continued-fractions` | Number theory | 6 | 7 | pick: 4, scrub: 3 | click: 3, slider: 2, step-state: 1, select: 1 |
| `crystalline-cohomology` | Algebraic geometry | 6 | 7 | pick: 6, scrub: 1 | select: 4, click: 2, slider: 1 |
| `d-modules` | Algebraic geometry | 6 | 6 | pick: 4, scrub: 2 | click: 3, slider: 2, select: 1 |
| `deformation-theory` | Algebraic geometry | 6 | 7 | pick: 3, scrub: 2, other: 2 | click: 3, scrub: 2, slide: 1, interact: 1 |
| `designs` | Combinatorics & graph theory | 6 | 6 | pick: 3, scrub: 3 | click: 3, step: 3 |
| `dirichlet-unit-theorem` | Number theory | 6 | 6 | pick: 6 | select: 3, input: 3 |
| `enumerative-combinatorics` | Combinatorics & graph theory | 6 | 6 | pick: 4, scrub: 2 | click: 4, slider: 1, step: 1 |
| `etale-fundamental-group` | Algebraic geometry | 6 | 6 | pick: 6 | click: 6 |
| `forcing-and-independence` | Logic & Foundations | 6 | 6 | other: 6 | toggle: 2, stepper: 2, table: 1, diagram: 1 |
| `galois-cohomology-and-brauer` | Algebra & homological | 6 | 6 | pick: 6 | click: 6 |
| `geometric-and-combinatorial-group-theory` | Algebra & homological | 6 | 6 | pick: 3, scrub: 3 | slider: 3, click: 2, select: 1 |
| `grothendieck-topologies-sites` | Higher categories & toposes | 6 | 6 | pick: 6 | click: 6 |
| `half-integral-weight-forms` | Modular forms & L-functions | 6 | 6 | pick: 6 | click: 4, input: 1, select: 1 |
| `hamiltonians-classical-mechanics` | Mathematical physics | 6 | 6 | other: 6 | interact: 6 |
| `heyting-algebras-toposes` | Higher categories & toposes | 6 | 6 | pick: 4, scrub: 2 | click: 4, scrub: 2 |
| `high-dimensional-geometry` | Probability & statistics | 6 | 6 | scrub: 6 | slider: 6 |
| `homotopy-theory` | Geometry & topology | 6 | 6 | scrub: 5, pick: 1 | slider: 5, select: 1 |
| `infinity-categories` | Higher categories & toposes | 6 | 7 | pick: 4, scrub: 3 | scrub: 3, click: 3, read: 1 |
| `integrable-systems` | Mathematical physics | 6 | 6 | scrub: 6 | slider: 6 |
| `intersection-theory-chow` | Algebraic geometry | 6 | 6 | pick: 5, scrub: 1 | select: 3, click: 2, scrub: 1 |
| `iwasawa-theory` | Number theory | 6 | 6 | pick: 5, scrub: 1 | click: 3, select: 2, slider: 1 |
| `k-theory` | Geometry & topology | 6 | 6 | pick: 4, scrub: 2 | click: 4, slider: 2 |
| `kahler-geometry` | Geometry & topology | 6 | 6 | scrub: 6 | slider: 6 |
| `khovanov-homology` | Geometry & topology | 6 | 6 | pick: 6 | select: 5, click: 1 |
| `klein-gordon-equation` | Mathematical physics | 6 | 6 | scrub: 5, pick: 1 | slider: 5, click: 1 |
| `lie-algebras` | Algebra & homological | 6 | 7 | pick: 4, scrub: 2, other: 1 | click: 4, step: 1, slider: 1, ladder-op: 1 |
| `maass-forms` | Modular forms & L-functions | 6 | 6 | scrub: 4, pick: 2 | slider: 4, click: 1, select: 1 |
| `mapping-class-groups` | Geometry & topology | 6 | 6 | pick: 3, scrub: 3 | slider: 3, click: 2, select: 1 |
| `mathematics-and-cryptography` | Number theory | 6 | 6 | scrub: 5, pick: 1 | slider: 5, button: 1 |
| `microlocal-analysis` | Analysis | 6 | 6 | scrub: 5, pick: 1 | slider: 5, select: 1 |
| `mirror-symmetry` | Algebraic geometry | 6 | 6 | pick: 3, scrub: 3 | slider: 3, click: 2, select: 1 |
| `mmp-and-birational-geometry` | Algebraic geometry | 6 | 6 | scrub: 3, pick: 3 | slider: 3, click: 2, select: 1 |
| `model-categories` | Algebra & homological | 6 | 6 | pick: 5, scrub: 1 | click: 3, select: 2, slider: 1 |
| `modular-forms` | Modular forms & L-functions | 6 | 9 | pick: 7, scrub: 2 | click: 7, slider: 2 |
| `mostow-rigidity` | Geometry & topology | 6 | 6 | scrub: 4, pick: 2 | slider: 3, click: 2, step: 1 |
| `order-theory-and-lattices` | Combinatorics & graph theory | 6 | 6 | scrub: 6 | slider: 6 |
| `probabilistic-graphical-models` | Learning theory & data science | 6 | 6 | scrub: 6 | slider: 6 |
| `quadratic-reciprocity` | Number theory | 6 | 9 | pick: 7, scrub: 2 | click: 7, slider: 2 |
| `quantum-field-theory` | Mathematical physics | 6 | 6 | scrub: 4, pick: 2 | slider: 4, click: 2 |
| `quantum-groups` | Algebra & homological | 6 | 6 | pick: 3, other: 2, scrub: 1 | inspect: 3, toggle: 2, slider: 1 |
| `quantum-information` | Mathematical physics | 6 | 6 | scrub: 6 | slider: 6 |
| `quaternions-octonions-and-division-algebras` | Algebra & homological | 6 | 6 | pick: 5, scrub: 1 | click: 4, input: 1, slider: 1 |
| `ramsey-theory` | Combinatorics & graph theory | 6 | 6 | scrub: 6 | slider: 6 |
| `random-walks-and-mixing` | Probability & statistics | 6 | 6 | scrub: 5, pick: 1 | step: 3, slider: 2, click: 1 |
| `resolution-of-singularities` | Algebraic geometry | 6 | 6 | pick: 6 | inspect: 5, click: 1 |
| `ricci-flow` | Geometry & topology | 6 | 6 | other: 6 | button-stepper: 6 |
| `schrodinger-equation` | Mathematical physics | 6 | 7 | scrub: 7 | slider: 7 |
| `semigroup-theory-evolution-equations` | Analysis | 6 | 6 | scrub: 6 | slider: 6 |
| `several-complex-variables` | Analysis | 6 | 6 | scrub: 5, pick: 1 | slider: 5, click: 1 |
| `shimura-varieties` | Modular forms & L-functions | 6 | 6 | pick: 5, scrub: 1 | select: 5, slider: 1 |
| `simplicial-complexes-combinatorial` | Combinatorics & graph theory | 6 | 6 | pick: 4, scrub: 2 | click: 4, slider: 2 |
| `simplicial-sets-and-nerve` | Higher categories & toposes | 6 | 6 | pick: 4, scrub: 2 | click: 4, step: 2 |
| `stochastic-calculus` | Probability & statistics | 6 | 6 | scrub: 4, pick: 2 | slider: 4, button: 2 |
| `stochastic-processes-and-martingales` | Probability & statistics | 6 | 6 | scrub: 6 | slider: 4, step: 2 |
| `surgery-theory` | Geometry & topology | 6 | 6 | pick: 5, scrub: 1 | select: 5, slider: 1 |
| `three-body-problem` | Mathematical physics | 6 | 6 | pick: 4, scrub: 2 | click: 4, slider: 2 |
| `tropical-geometry` | Algebraic geometry | 6 | 6 | scrub: 4, pick: 2 | slider: 4, select: 1, click: 1 |
| `vertex-operator-algebras` | Modular forms & L-functions | 6 | 6 | scrub: 3, pick: 3 | step: 2, select: 2, slider: 1, click: 1 |
| `adeles-and-ideles` | Number theory | 5 | 5 | pick: 5 | click: 5 |
| `algebraic-number-theory` | Number theory | 5 | 7 | pick: 7 | click: 6, select: 1 |
| `bezout` | Algebraic geometry | 5 | 10 | pick: 9, scrub: 1 | click: 9, slider: 1 |
| `bsd` | Modular forms & L-functions | 5 | 9 | pick: 9 | click: 9 |
| `dirichlet-series-euler-products` | Modular forms & L-functions | 5 | 10 | pick: 10 | click: 10 |
| `etale-cohomology` | Algebraic geometry | 5 | 9 | pick: 9 | click: 9 |
| `frobenius-and-reciprocity` | Number theory | 5 | 11 | pick: 7, other: 2, scrub: 2 | click: 7, interact: 2, slider: 2 |
| `functor-of-points` | Algebraic geometry | 5 | 10 | pick: 10 | click: 10 |
| `galois-representations` | Number theory | 5 | 11 | pick: 10, scrub: 1 | click: 10, slider: 1 |
| `hecke-operators` | Modular forms & L-functions | 5 | 8 | pick: 8 | click: 8 |
| `L-functions` | Modular forms & L-functions | 5 | 11 | pick: 6, other: 4, scrub: 1 | click: 6, static: 4, slider: 1 |
| `large-deviations` | Probability & statistics | 5 | 5 | scrub: 2, pick: 2, other: 1 | slider: 2, click: 2, toggle: 1 |
| `modularity-and-flt` | Modular forms & L-functions | 5 | 9 | pick: 9 | click: 9 |
| `moduli-spaces` | Algebraic geometry | 5 | 7 | pick: 6, scrub: 1 | click: 6, slider: 1 |
| `morphisms-fiber-products` | Algebraic geometry | 5 | 9 | pick: 7, scrub: 2 | click: 7, slider: 2 |
| `naive-set-theory` | Logic & Foundations | 5 | 6 | pick: 6 | click: 6 |
| `partitions-generating-functions` | Combinatorics & graph theory | 5 | 7 | pick: 7 | click: 7 |
| `quadratic-forms-genus-theory` | Number theory | 5 | 6 | pick: 6 | click: 6 |
| `sato-tate` | Modular forms & L-functions | 5 | 9 | pick: 9 | click: 9 |
| `sheaf-cohomology` | Algebraic geometry | 5 | 10 | pick: 8, other: 2 | click: 6, interact: 2, select: 2 |
| `singular-cubics-reduction` | Algebraic geometry | 5 | 9 | pick: 8, scrub: 1 | click: 8, slider: 1 |
| `stacks` | Algebraic geometry | 5 | 9 | pick: 9 | click: 9 |
| `theta-functions` | Modular forms & L-functions | 5 | 8 | pick: 7, scrub: 1 | click: 7, slider: 1 |

## Per-topic

The **manip** column marks topics with at least one direct-manipulation gesture
(✓), only scrub/pick (·), or no widgets (—). It is **body-evidence based**: a topic
is ✓ if its rendered HTML carries a real drag handler (make3DDraggable, getScreenCTM
pointer-mapping, cursor:grab, pointermove, mousedown+mousemove) OR it uses a
dedicated manipulation slug (e.g. grid-world-mdp's click-to-edit). Native
range-slider "drags" (dragging a slider thumb) do NOT count — the **gesture mix**
column is the coarser per-slug registry view and can over-report sliders.

| topic | section | concepts | widgets | concepts w/o widget | distinct gestures | 3D | manip | gesture mix | quizzes |
|---|---|---:|---:|---:|---:|---:|:---:|---|---:|
| `random-matrix-theory` | Probability & statistics | 7 | 7 | 0 | 2 | 0 | · | click: 4, slider: 3 | 21 |
| `geometric-invariant-theory` | Algebraic geometry | 7 | 7 | 0 | 2 | 0 | ✓ | click: 5, slider: 2 | 21 |
| `heegaard-floer` | Geometry & topology | 7 | 7 | 0 | 4 | 0 | · | select: 2, slider: 2, click: 2, interact: 1 | 21 |
| `optimal-transport` | Analysis | 6 | 7 | 0 | 2 | 0 | ✓ | slider: 6, drag: 1 | 18 |
| `ergodic-theory` | Analysis | 6 | 7 | 0 | 2 | 0 | ✓ | slider: 6, click-seed: 1 | 18 |
| `brill-noether` | Algebraic geometry | 7 | 7 | 0 | 2 | 0 | · | slider: 5, click: 2 | 21 |
| `coding-theory` | Combinatorics & graph theory | 7 | 7 | 0 | 2 | 0 | · | click: 5, slider: 2 | 21 |
| `conformal-and-cr-geometry` | Analysis | 7 | 7 | 0 | 2 | 0 | · | slider: 5, click: 2 | 21 |
| `mathematical-biology` | Probability & statistics | 7 | 8 | 0 | 3 | 0 | ✓ | slider: 6, click-seed: 1, click: 1 | 21 |
| `spectral-methods-data` | Learning theory & data science | 7 | 8 | 0 | 2 | 0 | ✓ | slider: 7, drag: 1 | 21 |
| `computational-molecular-biology` | Probability & statistics | 7 | 7 | 0 | 2 | 0 | · | slider: 5, input: 2 | 21 |
| `optimal-control-and-dynamic-programming` | Control theory & optimization | 7 | 7 | 0 | 2 | 0 | · | slider: 6, scrub: 1 | 21 |
| `combinatorial-optimization` | Control theory & optimization | 7 | 8 | 0 | 4 | 0 | · | click: 3, slider: 2, select: 2, play: 1 | 21 |
| `mathematical-finance` | Control theory & optimization | 7 | 7 | 0 | 2 | 0 | · | slider: 5, click: 2 | 21 |
| `donaldson-thomas-and-gw-invariants` | Algebraic geometry | 7 | 7 | 0 | 2 | 0 | · | click: 4, slider: 3 | 21 |
| `positive-characteristic-ag` | Algebraic geometry | 7 | 9 | 0 | 4 | 0 | · | select: 4, click: 2, slider: 2, interact: 1 | 21 |
| `convex-optimization` | Control theory & optimization | 7 | 10 | 0 | 4 | 0 | ✓ | slider: 7, draw: 1, edit: 1, play: 1 | 21 |
| `convex-geometry` | Geometry & topology | 7 | 8 | 0 | 3 | 0 | ✓ | slider: 5, select: 2, drag: 1 | 21 |
| `topological-data-analysis` | Learning theory & data science | 7 | 8 | 0 | 3 | 0 | ✓ | slider: 4, click: 3, drag: 1 | 21 |
| `mathematical-chaos` | Analysis | 7 | 9 | 0 | 4 | 0 | ✓ | slider: 5, click: 2, edit: 1, timeline: 1 | 21 |
| `kalman-filtering-and-state-estimation` | Control theory & optimization | 6 | 7 | 0 | 3 | 0 | ✓ | slider: 5, click: 1, drag: 1 | 18 |
| `statistical-learning-theory` | Learning theory & data science | 6 | 7 | 0 | 2 | 0 | ✓ | slider: 6, construct-to-break: 1 | 18 |
| `markov-decision-processes` | Control theory & optimization | 6 | 8 | 0 | 3 | 0 | ✓ | slider: 6, edit-grid: 1, play: 1 | 18 |
| `ramsey-theory` | Combinatorics & graph theory | 6 | 6 | 0 | 1 | 0 | · | slider: 6 | 18 |
| `order-theory-and-lattices` | Combinatorics & graph theory | 6 | 6 | 0 | 1 | 0 | · | slider: 6 | 18 |
| `algebraic-combinatorics` | Combinatorics & graph theory | 6 | 6 | 0 | 1 | 0 | · | slider: 6 | 18 |
| `polytopes-and-ehrhart` | Combinatorics & graph theory | 6 | 6 | 0 | 1 | 0 | ✓ | slider: 6 | 18 |
| `game-theory` | Control theory & optimization | 6 | 7 | 0 | 2 | 0 | ✓ | slider: 6, drag: 1 | 18 |
| `quantum-information` | Mathematical physics | 6 | 6 | 0 | 1 | 0 | · | slider: 6 | 18 |
| `integrable-systems` | Mathematical physics | 6 | 6 | 0 | 1 | 0 | · | slider: 6 | 18 |
| `kernel-methods-and-rkhs` | Learning theory & data science | 6 | 7 | 0 | 2 | 0 | ✓ | slider: 6, drag: 1 | 18 |
| `reinforcement-learning` | Control theory & optimization | 6 | 7 | 0 | 2 | 0 | ✓ | slider: 6, edit-grid: 1 | 18 |
| `pomdps-and-belief-states` | Control theory & optimization | 6 | 7 | 0 | 2 | 0 | ✓ | slider: 6, edit-grid: 1 | 18 |
| `probabilistic-graphical-models` | Learning theory & data science | 6 | 6 | 0 | 1 | 0 | · | slider: 6 | 16 |
| `deep-learning-theory` | Learning theory & data science | 6 | 7 | 0 | 2 | 0 | ✓ | slider: 6, click-seed: 1 | 18 |
| `information-geometry` | Learning theory & data science | 6 | 7 | 0 | 2 | 0 | ✓ | slider: 6, drag: 1 | 18 |
| `diffusion-and-score-based-models` | Learning theory & data science | 6 | 7 | 0 | 2 | 0 | ✓ | slider: 6, click-seed: 1 | 18 |
| `causal-inference` | Learning theory & data science | 6 | 6 | 0 | 1 | 0 | · | slider: 6 | 18 |
| `several-complex-variables` | Analysis | 6 | 6 | 0 | 2 | 0 | · | slider: 5, click: 1 | 18 |
| `khovanov-homology` | Geometry & topology | 6 | 6 | 0 | 2 | 0 | · | select: 5, click: 1 | 18 |
| `shimura-varieties` | Modular forms & L-functions | 6 | 6 | 0 | 2 | 0 | · | select: 5, slider: 1 | 18 |
| `arithmetic-statistics` | Number theory | 6 | 6 | 0 | 3 | 0 | · | select: 3, slider: 2, input: 1 | 18 |
| `complex-multiplication` | Number theory | 6 | 6 | 0 | 2 | 0 | ✓ | select: 5, drag: 1 | 18 |
| `tropical-geometry` | Algebraic geometry | 6 | 6 | 0 | 3 | 0 | · | slider: 4, select: 1, click: 1 | 18 |
| `surgery-theory` | Geometry & topology | 6 | 6 | 0 | 2 | 0 | · | select: 5, slider: 1 | 18 |
| `kahler-geometry` | Geometry & topology | 6 | 6 | 0 | 1 | 0 | · | slider: 6 | 18 |
| `mapping-class-groups` | Geometry & topology | 6 | 6 | 0 | 3 | 0 | · | slider: 3, click: 2, select: 1 | 18 |
| `half-integral-weight-forms` | Modular forms & L-functions | 6 | 6 | 0 | 3 | 0 | · | click: 4, input: 1, select: 1 | 18 |
| `crystalline-cohomology` | Algebraic geometry | 6 | 7 | 0 | 3 | 0 | · | select: 4, click: 2, slider: 1 | 18 |
| `homotopy-theory` | Geometry & topology | 6 | 6 | 0 | 2 | 0 | · | slider: 5, select: 1 | 18 |
| `maass-forms` | Modular forms & L-functions | 6 | 6 | 0 | 3 | 0 | · | slider: 4, click: 1, select: 1 | 18 |
| `d-modules` | Algebraic geometry | 6 | 6 | 0 | 3 | 0 | · | click: 3, slider: 2, select: 1 | 18 |
| `dirichlet-unit-theorem` | Number theory | 6 | 6 | 0 | 2 | 0 | · | select: 3, input: 3 | 18 |
| `cobordism` | Geometry & topology | 6 | 6 | 0 | 2 | 0 | · | select: 3, slider: 3 | 18 |
| `mmp-and-birational-geometry` | Algebraic geometry | 6 | 6 | 0 | 3 | 0 | · | slider: 3, click: 2, select: 1 | 18 |
| `continued-fractions` | Number theory | 6 | 7 | 0 | 4 | 0 | · | click: 3, slider: 2, step-state: 1, select: 1 | 18 |
| `abelian-varieties` | Algebraic geometry | 6 | 6 | 0 | 3 | 0 | · | click: 3, slider: 2, select: 1 | 18 |
| `positivity-and-ample-line-bundles` | Algebraic geometry | 6 | 6 | 0 | 2 | 0 | ✓ | slider: 4, click: 2 | 18 |
| `motives` | Algebraic geometry | 8 | 7 | 1 | 3 | 0 | · | interact: 3, click: 3, slider: 1 | 24 |
| `algebraic-k-theory-foundations` | Algebra & homological | 6 | 6 | 0 | 3 | 0 | · | click: 3, slider: 2, input: 1 | 18 |
| `model-categories` | Algebra & homological | 6 | 6 | 0 | 3 | 0 | · | click: 3, select: 2, slider: 1 | 18 |
| `condensed-mathematics` | Algebra & homological | 6 | 6 | 0 | 3 | 0 | · | click: 3, select: 2, slider: 1 | 18 |
| `hodge-theory` | Algebraic geometry | 8 | 7 | 1 | 4 | 0 | · | interact: 4, click: 1, slider: 1, step: 1 | 24 |
| `langlands-program` | Modular forms & L-functions | 8 | 5 | 3 | 2 | 0 | · | interact: 3, click: 2 | 24 |
| `microlocal-analysis` | Analysis | 6 | 6 | 0 | 2 | 0 | · | slider: 5, select: 1 | 18 |
| `geometric-measure-theory` | Analysis | 6 | 6 | 0 | 2 | 0 | ✓ | slider: 5, click: 1 | 18 |
| `semigroup-theory-evolution-equations` | Analysis | 6 | 6 | 0 | 1 | 0 | · | slider: 6 | 18 |
| `special-relativity` | Mathematical physics | 6 | 6 | 0 | 2 | 0 | ✓ | slider: 5, interact: 1 | 19 |
| `klein-gordon-equation` | Mathematical physics | 6 | 6 | 0 | 2 | 0 | · | slider: 5, click: 1 | 18 |
| `cohomology-and-duality` | Geometry & topology | 6 | 7 | 0 | 4 | 0 | · | select: 3, click: 2, click-multiply: 1, slider: 1 | 18 |
| `dirac-equation` | Mathematical physics | 6 | 6 | 0 | 2 | 0 | ✓ | click: 3, slider: 3 | 18 |
| `iwasawa-theory` | Number theory | 6 | 6 | 0 | 3 | 0 | · | click: 3, select: 2, slider: 1 | 18 |
| `quantum-field-theory` | Mathematical physics | 6 | 6 | 0 | 2 | 0 | · | slider: 4, click: 2 | 18 |
| `toric-varieties` | Algebraic geometry | 6 | 6 | 0 | 1 | 0 | ✓ | click: 6 | 18 |
| `statistical-mechanics` | Mathematical physics | 7 | 8 | 0 | 3 | 0 | ✓ | slider: 6, two-param-scrub: 1, click: 1 | 21 |
| `advanced-complex-analysis` | Analysis | 13 | 13 | 0 | 3 | 0 | · | interact: 8, slider: 4, click: 1 | 39 |
| `groebner-bases` | Algebra & homological | 8 | 8 | 0 | 2 | 0 | · | click: 6, select: 2 | 24 |
| `mathematical-statistics` | Probability & statistics | 6 | 7 | 0 | 2 | 0 | ✓ | slider: 6, drag: 1 | 18 |
| `numerical-analysis` | Analysis | 6 | 8 | 0 | 4 | 0 | ✓ | slider: 5, step: 1, play: 1, drag: 1 | 18 |
| `computational-number-theory` | Number theory | 6 | 7 | 0 | 4 | 0 | · | input: 4, slider: 1, step-state: 1, click: 1 | 18 |
| `variational-methods` | Analysis | 6 | 7 | 0 | 3 | 2 | ✓ | slider: 3, drag: 3, click: 1 | 18 |
| `fixed-point-theorems` | Analysis | 8 | 9 | 0 | 4 | 0 | ✓ | click: 4, slider: 3, static: 1, select: 1 | 24 |
| `calabi-yau-manifolds` | Algebraic geometry | 6 | 6 | 0 | 2 | 0 | · | slider: 5, click: 1 | 18 |
| `high-dimensional-geometry` | Probability & statistics | 6 | 6 | 0 | 1 | 0 | · | slider: 6 | 18 |
| `mirror-symmetry` | Algebraic geometry | 6 | 6 | 0 | 3 | 0 | · | slider: 3, click: 2, select: 1 | 18 |
| `mostow-rigidity` | Geometry & topology | 6 | 6 | 0 | 3 | 0 | · | slider: 3, click: 2, step: 1 | 18 |
| `resolution-of-singularities` | Algebraic geometry | 6 | 6 | 0 | 2 | 0 | · | inspect: 5, click: 1 | 18 |
| `hamiltonians-classical-mechanics` | Mathematical physics | 6 | 6 | 0 | 1 | 0 | · | interact: 6 | 18 |
| `general-relativity` | Mathematical physics | 6 | 7 | 0 | 3 | 1 | ✓ | slider: 4, drag: 2, click: 1 | 18 |
| `three-body-problem` | Mathematical physics | 6 | 6 | 0 | 2 | 0 | · | click: 4, slider: 2 | 18 |
| `designs` | Combinatorics & graph theory | 6 | 6 | 0 | 2 | 0 | · | click: 3, step: 3 | 18 |
| `expanders` | Combinatorics & graph theory | 6 | 7 | 0 | 3 | 0 | ✓ | slider: 4, click: 2, graph-edit: 1 | 18 |
| `symplectic-manifolds` | Geometry & topology | 6 | 6 | 0 | 3 | 0 | ✓ | drag: 2, slider: 2, click: 2 | 18 |
| `quantum-groups` | Algebra & homological | 6 | 6 | 0 | 3 | 0 | · | inspect: 3, toggle: 2, slider: 1 | 18 |
| `quaternions-octonions-and-division-algebras` | Algebra & homological | 6 | 6 | 0 | 3 | 1 | · | click: 4, input: 1, slider: 1 | 18 |
| `geometric-and-combinatorial-group-theory` | Algebra & homological | 6 | 6 | 0 | 3 | 0 | · | slider: 3, click: 2, select: 1 | 18 |
| `cluster-algebras` | Algebra & homological | 6 | 6 | 0 | 2 | 0 | · | click: 4, select: 2 | 18 |
| `wavelets` | Analysis | 8 | 9 | 0 | 2 | 0 | · | click: 6, slider: 3 | 24 |
| `vertex-operator-algebras` | Modular forms & L-functions | 6 | 6 | 0 | 4 | 0 | · | step: 2, select: 2, slider: 1, click: 1 | 18 |
| `schrodinger-equation` | Mathematical physics | 6 | 7 | 0 | 1 | 0 | · | slider: 7 | 18 |
| `mathematics-and-cryptography` | Number theory | 6 | 6 | 0 | 2 | 0 | · | slider: 5, button: 1 | 18 |
| `knot-polynomials` | Geometry & topology | 8 | 8 | 0 | 3 | 0 | · | click: 5, step: 2, slider: 1 | 24 |
| `ricci-flow` | Geometry & topology | 6 | 6 | 0 | 1 | 0 | · | button-stepper: 6 | 18 |
| `k-theory` | Geometry & topology | 6 | 6 | 0 | 2 | 0 | · | click: 4, slider: 2 | 18 |
| `atiyah-singer-index-theorem` | Geometry & topology | 6 | 6 | 0 | 2 | 0 | · | slider: 4, pick: 2 | 18 |
| `naive-set-theory` | Logic & Foundations | 5 | 6 | 0 | 1 | 0 | · | click: 6 | 30 |
| `first-order-logic-and-completeness` | Logic & Foundations | 7 | 8 | 0 | 3 | 0 | ✓ | step: 4, click: 3, compose-evaluate: 1 | 21 |
| `zfc-and-ordinals` | Logic & Foundations | 7 | 7 | 0 | 3 | 0 | · | click: 4, slider: 2, step: 1 | 21 |
| `model-theory-basics` | Logic & Foundations | 6 | 6 | 0 | 2 | 0 | ✓ | step: 4, click: 2 | 18 |
| `computability-and-decidability` | Logic & Foundations | 6 | 6 | 0 | 3 | 0 | ✓ | click: 3, step: 2, type: 1 | 18 |
| `complexity-theory` | Logic & Foundations | 6 | 6 | 0 | 5 | 0 | · | step: 2, slider: 1, input: 1, graph-walk: 1, toggle: 1 | 18 |
| `type-theory-and-hott` | Logic & Foundations | 6 | 6 | 0 | 2 | 0 | ✓ | click: 5, drag: 1 | 18 |
| `forcing-and-independence` | Logic & Foundations | 6 | 6 | 0 | 4 | 0 | · | toggle: 2, stepper: 2, table: 1, diagram: 1 | 18 |
| `algebra` | Algebra & homological | 16 | 19 | 0 | 3 | 0 | · | click: 16, select: 2, interact: 1 | 85 |
| `category-theory` | Algebra & homological | 12 | 17 | 0 | 3 | 0 | ✓ | click: 15, slider+click: 1, interactive: 1 | 72 |
| `representation-theory` | Algebra & homological | 13 | 15 | 0 | 1 | 0 | · | click: 15 | 74 |
| `commutative-algebra` | Algebra & homological | 16 | 16 | 0 | 3 | 0 | · | select: 10, click: 4, interact: 2 | 84 |
| `homological` | Algebra & homological | 15 | 16 | 0 | 4 | 0 | ✓ | click: 11, interact: 3, drag-and-toggle: 1, select: 1 | 82 |
| `derived-categories` | Algebra & homological | 7 | 7 | 0 | 2 | 0 | · | click: 5, scrub: 2 | 27 |
| `group-cohomology` | Algebra & homological | 7 | 7 | 0 | 1 | 0 | · | click: 7 | 21 |
| `lie-algebras` | Algebra & homological | 6 | 7 | 0 | 4 | 0 | · | click: 4, step: 1, slider: 1, ladder-op: 1 | 18 |
| `galois-cohomology-and-brauer` | Algebra & homological | 6 | 6 | 0 | 1 | 0 | · | click: 6 | 18 |
| `elementary-topos-theory` | Higher categories & toposes | 7 | 7 | 0 | 1 | 0 | · | click: 7 | 27 |
| `heyting-algebras-toposes` | Higher categories & toposes | 6 | 6 | 0 | 2 | 0 | · | click: 4, scrub: 2 | 24 |
| `grothendieck-topologies-sites` | Higher categories & toposes | 6 | 6 | 0 | 1 | 0 | · | click: 6 | 24 |
| `simplicial-sets-and-nerve` | Higher categories & toposes | 6 | 6 | 0 | 2 | 0 | · | click: 4, step: 2 | 24 |
| `infinity-categories` | Higher categories & toposes | 6 | 7 | 0 | 3 | 0 | · | scrub: 3, click: 3, read: 1 | 24 |
| `cocartesian-fibrations` | Higher categories & toposes | 7 | 8 | 0 | 1 | 0 | · | interact: 8 | 31 |
| `infinity-topoi` | Higher categories & toposes | 7 | 9 | 0 | 3 | 0 | ✓ | click: 5, scrub: 3, edit: 1 | 29 |
| `real-analysis` | Analysis | 18 | 23 | 0 | 4 | 0 | ✓ | click: 18, draw: 3, slide-band: 1, slider: 1 | 83 |
| `measure-theory` | Analysis | 12 | 13 | 0 | 1 | 0 | · | click: 13 | 72 |
| `complex-analysis` | Analysis | 27 | 30 | 0 | 5 | 0 | ✓ | interact: 20, click: 7, drag: 1, drag-probe: 1, drag-contour: 1 | 52 |
| `functional-analysis` | Analysis | 14 | 17 | 0 | 2 | 0 | ✓ | click: 11, interact: 6 | 78 |
| `operator-algebras` | Analysis | 12 | 15 | 0 | 3 | 0 | · | click: 12, select: 2, slider: 1 | 72 |
| `dynamical-systems` | Analysis | 13 | 22 | 0 | 6 | 0 | ✓ | click: 12, click-seed: 5, slider: 2, drag-direction: 1, two-param-scrub: 1, dial: 1 | 75 |
| `sobolev-spaces-distributions` | Analysis | 7 | 7 | 0 | 2 | 0 | · | slider: 6, click: 1 | 21 |
| `harmonic-analysis-fourier` | Analysis | 8 | 8 | 0 | 3 | 0 | · | slider: 5, select: 2, interact: 1 | 24 |
| `partial-differential-equations` | Analysis | 6 | 6 | 0 | 2 | 0 | ✓ | slider: 5, drag: 1 | 18 |
| `harmonic-functions` | Analysis | 6 | 7 | 0 | 3 | 1 | ✓ | drag: 3, select: 2, slider: 2 | 18 |
| `spectral-theory` | Analysis | 9 | 9 | 0 | 2 | 0 | · | slider: 7, click: 2 | 27 |
| `probability-theory` | Probability & statistics | 12 | 16 | 0 | 4 | 0 | ✓ | click: 12, shake-sample: 2, pour-update: 1, play: 1 | 73 |
| `stochastic-processes-and-martingales` | Probability & statistics | 6 | 6 | 0 | 2 | 0 | · | slider: 4, step: 2 | 18 |
| `stochastic-calculus` | Probability & statistics | 6 | 6 | 0 | 2 | 0 | · | slider: 4, button: 2 | 18 |
| `random-walks-and-mixing` | Probability & statistics | 6 | 6 | 0 | 3 | 0 | · | step: 3, slider: 2, click: 1 | 18 |
| `information-theory` | Probability & statistics | 8 | 8 | 0 | 2 | 0 | · | slider: 6, click: 2 | 24 |
| `large-deviations` | Probability & statistics | 5 | 5 | 0 | 3 | 0 | · | slider: 2, click: 2, toggle: 1 | 15 |
| `point-set-topology` | Geometry & topology | 6 | 7 | 0 | 2 | 0 | ✓ | click: 6, select: 1 | 36 |
| `algebraic-topology` | Geometry & topology | 6 | 9 | 0 | 4 | 0 | ✓ | click: 5, slider: 2, timeline: 1, wind-loop: 1 | 32 |
| `smooth-manifolds` | Geometry & topology | 10 | 11 | 0 | 2 | 1 | ✓ | click: 10, drag: 1 | 59 |
| `differential-forms` | Geometry & topology | 5 | 8 | 0 | 4 | 0 | ✓ | slider: 4, select: 2, drag-basis: 1, click: 1 | 30 |
| `differential-geometry` | Geometry & topology | 5 | 13 | 0 | 4 | 6 | ✓ | click: 6, drag: 5, drag-along-curve: 1, drag-direction: 1 | 30 |
| `riemannian-geometry` | Geometry & topology | 5 | 10 | 0 | 3 | 1 | ✓ | click: 8, drag: 1, slider: 1 | 30 |
| `lie-groups` | Geometry & topology | 7 | 8 | 0 | 2 | 1 | ✓ | click: 7, drag: 1 | 42 |
| `riemann-surfaces` | Geometry & topology | 5 | 9 | 0 | 4 | 0 | ✓ | click: 4, slider: 2, static: 2, fold-glue: 1 | 30 |
| `characteristic-classes` | Geometry & topology | 9 | 9 | 0 | 2 | 0 | · | click: 6, slider: 3 | 27 |
| `morse-theory` | Geometry & topology | 8 | 8 | 0 | 2 | 0 | · | slider: 4, click: 4 | 24 |
| `galois` | Number theory | 7 | 9 | 0 | 4 | 0 | · | click: 6, static: 1, branching-timeline: 1, slider: 1 | 32 |
| `quadratic-reciprocity` | Number theory | 6 | 9 | 0 | 2 | 0 | · | click: 7, slider: 2 | 33 |
| `quadratic-forms-genus-theory` | Number theory | 5 | 6 | 0 | 1 | 0 | · | click: 6 | 30 |
| `additive-number-theory` | Number theory | 15 | 21 | 0 | 4 | 0 | · | click: 14, input: 4, interactive: 2, slider: 1 | 91 |
| `algebraic-number-theory` | Number theory | 5 | 7 | 0 | 2 | 0 | · | click: 6, select: 1 | 30 |
| `p-adic-numbers` | Number theory | 7 | 12 | 0 | 3 | 0 | ✓ | click: 9, slider: 2, edit: 1 | 36 |
| `adeles-and-ideles` | Number theory | 5 | 5 | 0 | 1 | 0 | · | click: 5 | 30 |
| `frobenius-and-reciprocity` | Number theory | 5 | 11 | 0 | 3 | 0 | · | click: 7, interact: 2, slider: 2 | 30 |
| `class-field-theory` | Number theory | 6 | 10 | 0 | 2 | 0 | · | click: 9, read: 1 | 36 |
| `heights-arithmetic-geometry` | Number theory | 10 | 10 | 0 | 4 | 0 | ✓ | slider: 4, click: 3, edit: 2, select: 1 | 30 |
| `analytic-number-theory` | Number theory | 10 | 10 | 0 | 3 | 0 | ✓ | slider: 8, edit: 1, timeline: 1 | 30 |
| `upper-half-plane-hyperbolic` | Modular forms & L-functions | 5 | 8 | 0 | 2 | 0 | ✓ | click: 7, slider: 1 | 30 |
| `modular-forms` | Modular forms & L-functions | 6 | 9 | 0 | 2 | 0 | · | click: 7, slider: 2 | 33 |
| `theta-functions` | Modular forms & L-functions | 5 | 8 | 0 | 2 | 0 | · | click: 7, slider: 1 | 30 |
| `partitions-generating-functions` | Combinatorics & graph theory | 5 | 7 | 0 | 1 | 0 | · | click: 7 | 30 |
| `hecke-operators` | Modular forms & L-functions | 5 | 8 | 0 | 1 | 0 | · | click: 8 | 30 |
| `dirichlet-series-euler-products` | Modular forms & L-functions | 5 | 10 | 0 | 1 | 0 | · | click: 10 | 30 |
| `analytic-continuation` | Modular forms & L-functions | 5 | 7 | 0 | 3 | 0 | ✓ | slider: 5, click: 1, drag-reflect: 1 | 30 |
| `zeta-values` | Modular forms & L-functions | 7 | 7 | 0 | 2 | 0 | · | click: 6, slider: 1 | 36 |
| `L-functions` | Modular forms & L-functions | 5 | 11 | 0 | 3 | 0 | · | click: 6, static: 4, slider: 1 | 30 |
| `galois-representations` | Number theory | 5 | 11 | 0 | 2 | 0 | · | click: 10, slider: 1 | 30 |
| `moonshine` | Modular forms & L-functions | 8 | 8 | 0 | 1 | 0 | · | click: 8 | 39 |
| `automorphic-forms-adelic` | Modular forms & L-functions | 9 | 9 | 0 | 3 | 0 | · | step: 3, click: 3, slider: 3 | 27 |
| `modular-curves` | Modular forms & L-functions | 9 | 9 | 0 | 3 | 0 | · | click: 4, step: 3, slider: 2 | 27 |
| `projective-plane` | Algebraic geometry | 5 | 10 | 0 | 3 | 0 | ✓ | click: 7, drag: 2, slider: 1 | 30 |
| `bezout` | Algebraic geometry | 5 | 10 | 0 | 2 | 0 | · | click: 9, slider: 1 | 30 |
| `schemes` | Algebraic geometry | 10 | 14 | 0 | 2 | 0 | ✓ | click: 8, interact: 6 | 60 |
| `sheaves` | Algebraic geometry | 7 | 9 | 0 | 2 | 0 | · | click: 8, slider: 1 | 42 |
| `morphisms-fiber-products` | Algebraic geometry | 5 | 9 | 0 | 2 | 0 | · | click: 7, slider: 2 | 30 |
| `functor-of-points` | Algebraic geometry | 5 | 10 | 0 | 1 | 0 | · | click: 10 | 30 |
| `elliptic-curves` | Algebraic geometry | 5 | 9 | 0 | 4 | 0 | ✓ | slider: 5, select: 2, drag-on-curve: 1, interact: 1 | 30 |
| `singular-cubics-reduction` | Algebraic geometry | 5 | 9 | 0 | 2 | 0 | · | click: 8, slider: 1 | 30 |
| `algebraic-curves-higher-genus` | Algebraic geometry | 6 | 6 | 0 | 1 | 0 | · | interact: 6 | 25 |
| `sheaf-cohomology` | Algebraic geometry | 5 | 10 | 0 | 3 | 0 | · | click: 6, interact: 2, select: 2 | 30 |
| `algebraic-de-rham-cohomology` | Algebraic geometry | 6 | 8 | 0 | 1 | 0 | · | interact: 8 | 24 |
| `moduli-spaces` | Algebraic geometry | 5 | 7 | 0 | 2 | 0 | · | click: 6, slider: 1 | 30 |
| `algebraic-spaces` | Algebraic geometry | 6 | 6 | 0 | 2 | 0 | · | click: 4, scrub: 2 | 24 |
| `stacks` | Algebraic geometry | 5 | 9 | 0 | 1 | 0 | · | click: 9 | 30 |
| `intersection-theory-chow` | Algebraic geometry | 6 | 6 | 0 | 3 | 0 | · | select: 3, click: 2, scrub: 1 | 25 |
| `group-schemes` | Algebraic geometry | 6 | 8 | 0 | 3 | 0 | ✓ | click: 4, drag: 2, scrub: 2 | 24 |
| `etale-fundamental-group` | Algebraic geometry | 6 | 6 | 0 | 1 | 0 | · | click: 6 | 24 |
| `deformation-theory` | Algebraic geometry | 6 | 7 | 0 | 4 | 0 | · | click: 3, scrub: 2, slide: 1, interact: 1 | 24 |
| `graph-theory-fundamentals` | Combinatorics & graph theory | 6 | 7 | 0 | 2 | 0 | ✓ | slider: 6, graph-edit: 1 | 18 |
| `spectral-graph-theory` | Combinatorics & graph theory | 7 | 9 | 0 | 4 | 0 | ✓ | click: 4, graph-edit: 2, step: 2, slider: 1 | 21 |
| `matroid-theory` | Combinatorics & graph theory | 7 | 7 | 0 | 3 | 0 | · | click: 3, slider: 3, step: 1 | 21 |
| `probabilistic-method` | Combinatorics & graph theory | 7 | 7 | 0 | 2 | 0 | · | slider: 5, click: 2 | 21 |
| `extremal-combinatorics` | Combinatorics & graph theory | 6 | 7 | 0 | 4 | 0 | ✓ | slider: 3, click: 2, graph-edit: 1, step: 1 | 18 |
| `simplicial-complexes-combinatorial` | Combinatorics & graph theory | 6 | 6 | 0 | 2 | 0 | · | click: 4, slider: 2 | 18 |
| `enumerative-combinatorics` | Combinatorics & graph theory | 6 | 6 | 0 | 3 | 0 | · | click: 4, slider: 1, step: 1 | 18 |
| `sato-tate` | Modular forms & L-functions | 5 | 9 | 0 | 1 | 0 | · | click: 9 | 30 |
| `bsd` | Modular forms & L-functions | 5 | 9 | 0 | 1 | 0 | · | click: 9 | 30 |
| `modularity-and-flt` | Modular forms & L-functions | 5 | 9 | 0 | 1 | 0 | · | click: 9 | 30 |
| `etale-cohomology` | Algebraic geometry | 5 | 9 | 0 | 1 | 0 | · | click: 9 | 30 |
| `gauge-theory` | Mathematical physics | 7 | 7 | 0 | 3 | 0 | · | slider: 4, click: 2, select: 1 | 21 |
| `string-theory` | Mathematical physics | 7 | 7 | 0 | 2 | 0 | · | slider: 5, click: 2 | 21 |

## Coverage gaps

### Concepts missing a widget in their span (top 20)

- `realization-functors` (motives)
- `hodge-as-realization` (hodge-theory)
- `global-langlands-gl-n` (langlands-program)
- `functoriality-langlands-group` (langlands-program)
- `universal-reciprocity` (langlands-program)

### Concepts missing a hard-tier quiz (top 20)

- `rmt-ensembles` (random-matrix-theory)
- `rmt-wigner-semicircle` (random-matrix-theory)
- `rmt-marchenko-pastur` (random-matrix-theory)
- `rmt-tracy-widom` (random-matrix-theory)
- `rmt-free-probability` (random-matrix-theory)
- `rmt-universality` (random-matrix-theory)
- `rmt-katz-sarnak` (random-matrix-theory)
- `git-invariants` (geometric-invariant-theory)
- `git-reductive` (geometric-invariant-theory)
- `git-quotient` (geometric-invariant-theory)
- `git-hilbert-mumford` (geometric-invariant-theory)
- `git-kempf-ness` (geometric-invariant-theory)
- `git-vgit` (geometric-invariant-theory)
- `git-moduli-applications` (geometric-invariant-theory)
- `hf-splittings` (heegaard-floer)
- `hf-lagrangian-floer` (heegaard-floer)
- `hf-variants` (heegaard-floer)
- `hf-knot-floer` (heegaard-floer)
- `hf-d-invariant` (heegaard-floer)
- `hf-surgery-triangle` (heegaard-floer)
