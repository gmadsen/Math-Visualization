# Coverage + type stats — widgets & quizzes

## Corpus totals

- Topics: **207**, concepts: **1422**
- Widgets: **1484** (registry-driven: 1484, inline: 0)
- Quizzes: **5458** (v1: 4222, hard: 1223, expert: 13)
- Quiz types: mcq: 3591, numeric: 1291, multi-select: 277, matching: 107, ordering: 85, spot-the-error: 53, complex: 29, proof-completion: 21, construction: 2, guess-my-rule: 2
- Concepts lacking a widget in their section: **117**
- Concepts lacking a hard-tier quiz: **984**

## Per-slug registry adoption

Every slug registered under `widgets/<slug>/`, with its current adoption
across `content/<topic>.json`. Slugs at **0 instances** are
infrastructure-only — they ship a renderer and a fixture, but no topic
page has wired one in yet.

| slug | family | gesture | dimension | instances | topics |
|---|---|---|---|---:|---|
| `button-stepper` | button-stepper | click | 2d | 343 | L-functions, additive-number-theory, adeles-and-ideles, algebra, algebraic-number-theory, algebraic-topology, analytic-continuation, bezout, bsd, category-theory, class-field-theory, complex-analysis, differential-geometry, dirichlet-series-euler-products, dynamical-systems, etale-cohomology, frobenius-and-reciprocity, functional-analysis, functor-of-points, galois, galois-representations, hecke-operators, homological, lie-groups, measure-theory, modular-forms, modularity-and-flt, moduli-spaces, moonshine, morphisms-fiber-products, naive-set-theory, operator-algebras, p-adic-numbers, partitions-generating-functions, point-set-topology, probability-theory, projective-plane, quadratic-forms-genus-theory, quadratic-reciprocity, representation-theory, riemann-surfaces, riemannian-geometry, sato-tate, schemes, sheaf-cohomology, sheaves, singular-cubics-reduction, smooth-manifolds, stacks, theta-functions, upper-half-plane-hyperbolic, zeta-values |
| `parametric-plot` | parametric-plot | slider | 2d | 107 | algebraic-combinatorics, analytic-continuation, analytic-number-theory, causal-inference, deep-learning-theory, diffusion-and-score-based-models, expanders, game-theory, graph-theory-fundamentals, information-geometry, kernel-methods-and-rkhs, markov-decision-processes, order-theory-and-lattices, polytopes-and-ehrhart, pomdps-and-belief-states, probabilistic-graphical-models, ramsey-theory, reinforcement-learning, statistical-learning-theory |
| `clickable-diagram` | clickable-diagram | click | 2d | 79 | algebra, algebraic-number-theory, algebraic-topology, bezout, category-theory, fixed-point-theorems, frobenius-and-reciprocity, functional-analysis, functor-of-points, galois, homological, measure-theory, morphisms-fiber-products, naive-set-theory, operator-algebras, quadratic-reciprocity, real-analysis, riemannian-geometry, schemes, sheaves, stacks, wavelets |
| `slider-svg-2d` | slider-readout | slider | 2d | 20 | kahler-geometry, spectral-methods-data, spectral-theory |
| `schrodinger-figure` | schrodinger-figure | slider | 2d | 7 | schrodinger-equation |
| `clickable-graph` | clickable-graph | click | 2d | 6 | adeles-and-ideles, riemannian-geometry, schemes, sheaves |
| `hamiltonians-figure` | hamiltonians-figure | interact | 2d | 6 | hamiltonians-classical-mechanics |
| `inline-code-cell` | inline-code-cell | edit | 2d | 6 | analytic-number-theory, convex-optimization, heights-arithmetic-geometry, mathematical-chaos, p-adic-numbers |
| `surface-viewer` | surface-viewer | drag | 3d | 6 | differential-geometry, lie-groups |
| `svg-illustration` | svg-illustration | static | 2d | 6 | L-functions, riemann-surfaces |
| `input-form` | input-form | input | 2d | 4 | additive-number-theory |
| `lattice-visualizer` | lattice-visualizer | slider | 2d | 4 | elliptic-curves, modular-forms, riemann-surfaces, theta-functions |
| `modular-arithmetic-clock` | modular-arithmetic-clock | slider | 2d | 4 | additive-number-theory, frobenius-and-reciprocity, p-adic-numbers, quadratic-reciprocity |
| `declarative-host` | declarative-host | interactive | 2d | 3 | additive-number-theory, category-theory |
| `proof-scrubber` | proof-scrubber | timeline | 2d | 3 | algebraic-topology, analytic-number-theory, mathematical-chaos |
| `counterexample-explorer` | counterexample-explorer | select | 2d | 2 | heights-arithmetic-geometry, point-set-topology |
| `recurrence-plotter` | recurrence-plotter | slider | 2d | 2 | dynamical-systems, mathematical-chaos |
| `abelian-varieties-w1` | verbatim | click | 2d | 1 | abelian-varieties |
| `abelian-varieties-w2` | verbatim | click | 2d | 1 | abelian-varieties |
| `abelian-varieties-w3` | verbatim | click | 2d | 1 | abelian-varieties |
| `abelian-varieties-w4` | verbatim | click | 2d | 1 | abelian-varieties |
| `abelian-varieties-w5` | verbatim | click | 2d | 1 | abelian-varieties |
| `abelian-varieties-w6` | verbatim | click | 2d | 1 | abelian-varieties |
| `aca-bergman-kernel-disk` | aca-figure | click | 2d | 1 | advanced-complex-analysis |
| `aca-bloch-disk` | aca-figure | slider | 2d | 1 | advanced-complex-analysis |
| `aca-hartogs-shell` | aca-figure | slider | 2d | 1 | advanced-complex-analysis |
| `aca-nevanlinna-characteristic` | aca-figure | slider | 2d | 1 | advanced-complex-analysis |
| `aca-quasiconformal-warp` | aca-figure | slider | 2d | 1 | advanced-complex-analysis |
| `advanced-complex-analysis-three-circles` | advanced-complex-analysis-three-circles | interact | 2d | 1 | advanced-complex-analysis |
| `advanced-complex-analysis-weierstrass` | advanced-complex-analysis-weierstrass | interact | 2d | 1 | advanced-complex-analysis |
| `ak-Q` | verbatim | click | 2d | 1 | algebraic-k-theory-foundations |
| `ak-apps` | verbatim | click | 2d | 1 | algebraic-k-theory-foundations |
| `ak-k0` | verbatim | click | 2d | 1 | algebraic-k-theory-foundations |
| `ak-k1` | verbatim | slider | 2d | 1 | algebraic-k-theory-foundations |
| `ak-k2` | verbatim | input | 2d | 1 | algebraic-k-theory-foundations |
| `ak-loc` | verbatim | slider | 2d | 1 | algebraic-k-theory-foundations |
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
| `ant-zero-free-region` | ant-zero-free-region | slider | 2d | 1 | analytic-number-theory |
| `as-w1` | verbatim | click | 2d | 1 | arithmetic-statistics |
| `as-w2` | verbatim | click | 2d | 1 | arithmetic-statistics |
| `as-w3` | verbatim | click | 2d | 1 | arithmetic-statistics |
| `as-w4` | verbatim | click | 2d | 1 | arithmetic-statistics |
| `as-w5` | verbatim | click | 2d | 1 | arithmetic-statistics |
| `as-w6` | verbatim | click | 2d | 1 | arithmetic-statistics |
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
| `bn-w1` | verbatim | click | 2d | 1 | brill-noether |
| `bn-w2` | verbatim | click | 2d | 1 | brill-noether |
| `bn-w3` | verbatim | click | 2d | 1 | brill-noether |
| `bn-w4` | verbatim | click | 2d | 1 | brill-noether |
| `bn-w5` | verbatim | click | 2d | 1 | brill-noether |
| `bn-w6` | verbatim | click | 2d | 1 | brill-noether |
| `bn-w7` | verbatim | click | 2d | 1 | brill-noether |
| `branching-proof-scrubber` | branching-proof-scrubber | branching-timeline | 2d | 1 | galois |
| `calabi-yau-canonical-degree` | calabi-yau-canonical-degree | slider | 2d | 1 | calabi-yau-manifolds |
| `calabi-yau-hodge-diamond` | calabi-yau-hodge-diamond | slider | 2d | 1 | calabi-yau-manifolds |
| `calabi-yau-hypersurface-zoo` | calabi-yau-hypersurface-zoo | click | 2d | 1 | calabi-yau-manifolds |
| `calabi-yau-mirror-swap` | calabi-yau-mirror-swap | slider | 2d | 1 | calabi-yau-manifolds |
| `calabi-yau-periods` | calabi-yau-periods | slider | 2d | 1 | calabi-yau-manifolds |
| `calabi-yau-syz-fibration` | calabi-yau-syz-fibration | slider | 2d | 1 | calabi-yau-manifolds |
| `ccr-w1` | verbatim | slider | 2d | 1 | conformal-and-cr-geometry |
| `ccr-w2` | verbatim | slider | 2d | 1 | conformal-and-cr-geometry |
| `ccr-w3` | verbatim | slider | 2d | 1 | conformal-and-cr-geometry |
| `ccr-w4` | verbatim | click | 2d | 1 | conformal-and-cr-geometry |
| `ccr-w5` | verbatim | slider | 2d | 1 | conformal-and-cr-geometry |
| `ccr-w6` | verbatim | slider | 2d | 1 | conformal-and-cr-geometry |
| `ccr-w7` | verbatim | interact | 2d | 1 | conformal-and-cr-geometry |
| `cg-bm` | verbatim | slider | 2d | 1 | convex-geometry |
| `cg-dvor` | verbatim | slider | 2d | 1 | convex-geometry |
| `cg-john` | verbatim | select | 2d | 1 | convex-geometry |
| `cg-mink` | verbatim | slider | 2d | 1 | convex-geometry |
| `cg-polar` | verbatim | slider | 2d | 1 | convex-geometry |
| `cg-poly` | verbatim | select | 2d | 1 | convex-geometry |
| `cg-support` | verbatim | slider | 2d | 1 | convex-geometry |
| `characteristic-classes-c1-clutching` | characteristic-classes-c1-clutching | slider | 2d | 1 | characteristic-classes |
| `characteristic-classes-classifying-map` | characteristic-classes-classifying-map | click | 2d | 1 | characteristic-classes |
| `characteristic-classes-cpn-localisation` | characteristic-classes-cpn-localisation | slider | 2d | 1 | characteristic-classes |
| `characteristic-classes-gauss-bonnet` | characteristic-classes-gauss-bonnet | click | 2d | 1 | characteristic-classes |
| `characteristic-classes-mobius-vs-cylinder` | characteristic-classes-mobius-vs-cylinder | slider | 2d | 1 | characteristic-classes |
| `characteristic-classes-poincare-hopf` | characteristic-classes-poincare-hopf | click | 2d | 1 | characteristic-classes |
| `characteristic-classes-pontryagin-formulas` | characteristic-classes-pontryagin-formulas | click | 2d | 1 | characteristic-classes |
| `characteristic-classes-signature-l-genus` | characteristic-classes-signature-l-genus | click | 2d | 1 | characteristic-classes |
| `characteristic-classes-w1-surfaces` | characteristic-classes-w1-surfaces | click | 2d | 1 | characteristic-classes |
| `class-field-theory-reciprocity-dictionary` | svg-illustration | read | 2d | 1 | class-field-theory |
| `cluster-w1` | verbatim | click | 2d | 1 | cluster-algebras |
| `cluster-w2` | verbatim | click | 2d | 1 | cluster-algebras |
| `cluster-w3` | verbatim | click | 2d | 1 | cluster-algebras |
| `cluster-w4` | verbatim | click | 2d | 1 | cluster-algebras |
| `cluster-w5` | verbatim | click | 2d | 1 | cluster-algebras |
| `cluster-w6` | verbatim | click | 2d | 1 | cluster-algebras |
| `cm-analytic-rings` | verbatim | click | 2d | 1 | condensed-mathematics |
| `cm-liquid-tensor` | verbatim | click | 2d | 1 | condensed-mathematics |
| `cm-lte` | verbatim | click | 2d | 1 | condensed-mathematics |
| `cm-snake` | verbatim | click | 2d | 1 | condensed-mathematics |
| `cm-solid-test` | verbatim | click | 2d | 1 | condensed-mathematics |
| `cm-yoneda` | verbatim | click | 2d | 1 | condensed-mathematics |
| `cmb-w1` | verbatim | slider | 2d | 1 | computational-molecular-biology |
| `cmb-w2` | verbatim | slider | 2d | 1 | computational-molecular-biology |
| `cmb-w3` | verbatim | slider | 2d | 1 | computational-molecular-biology |
| `cmb-w4` | verbatim | slider | 2d | 1 | computational-molecular-biology |
| `cmb-w5` | verbatim | slider | 2d | 1 | computational-molecular-biology |
| `cmb-w6` | verbatim | slider | 2d | 1 | computational-molecular-biology |
| `cmb-w7` | verbatim | slider | 2d | 1 | computational-molecular-biology |
| `cnt-bu` | verbatim | click | 2d | 1 | computational-number-theory |
| `cnt-exp` | verbatim | input | 2d | 1 | computational-number-theory |
| `cnt-lll` | verbatim | slider | 2d | 1 | computational-number-theory |
| `cnt-mr` | verbatim | input | 2d | 1 | computational-number-theory |
| `cnt-rho` | verbatim | input | 2d | 1 | computational-number-theory |
| `cnt-sch` | verbatim | input | 2d | 1 | computational-number-theory |
| `cobordism-w1` | verbatim | click | 2d | 1 | cobordism |
| `cobordism-w2` | verbatim | click | 2d | 1 | cobordism |
| `cobordism-w3` | verbatim | click | 2d | 1 | cobordism |
| `cobordism-w4` | verbatim | click | 2d | 1 | cobordism |
| `cobordism-w5` | verbatim | click | 2d | 1 | cobordism |
| `cobordism-w6` | verbatim | click | 2d | 1 | cobordism |
| `cocartesian-fibrations-edge-scrubber` | cocartesian-fibrations-edge-scrubber | interact | 2d | 1 | cocartesian-fibrations |
| `cocartesian-fibrations-examples-graph` | cocartesian-fibrations-examples-graph | interact | 2d | 1 | cocartesian-fibrations |
| `cocartesian-fibrations-fibration-clickable` | cocartesian-fibrations-fibration-clickable | interact | 2d | 1 | cocartesian-fibrations |
| `cocartesian-fibrations-grothendieck-codecell` | cocartesian-fibrations-grothendieck-codecell | interact | 2d | 1 | cocartesian-fibrations |
| `cocartesian-fibrations-grothendieck-scrubber` | cocartesian-fibrations-grothendieck-scrubber | interact | 2d | 1 | cocartesian-fibrations |
| `cocartesian-fibrations-leftright-scrubber` | cocartesian-fibrations-leftright-scrubber | interact | 2d | 1 | cocartesian-fibrations |
| `cocartesian-fibrations-transport-clickable` | cocartesian-fibrations-transport-clickable | interact | 2d | 1 | cocartesian-fibrations |
| `cocartesian-fibrations-universal-leftfib` | cocartesian-fibrations-universal-leftfib | interact | 2d | 1 | cocartesian-fibrations |
| `cohomology-and-duality-w1` | verbatim | click | 2d | 1 | cohomology-and-duality |
| `cohomology-and-duality-w2` | verbatim | click | 2d | 1 | cohomology-and-duality |
| `cohomology-and-duality-w3` | verbatim | click | 2d | 1 | cohomology-and-duality |
| `cohomology-and-duality-w4` | verbatim | click | 2d | 1 | cohomology-and-duality |
| `cohomology-and-duality-w5` | verbatim | click | 2d | 1 | cohomology-and-duality |
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
| `complex-multiplication-w1` | verbatim | drag | 2d | 1 | complex-multiplication |
| `complex-multiplication-w2` | verbatim | select | 2d | 1 | complex-multiplication |
| `complex-multiplication-w3` | verbatim | click | 2d | 1 | complex-multiplication |
| `complex-multiplication-w4` | verbatim | select | 2d | 1 | complex-multiplication |
| `complex-multiplication-w5` | verbatim | select | 2d | 1 | complex-multiplication |
| `complex-multiplication-w6` | verbatim | select | 2d | 1 | complex-multiplication |
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
| `continued-fractions-w2` | verbatim | click | 2d | 1 | continued-fractions |
| `continued-fractions-w3` | verbatim | click | 2d | 1 | continued-fractions |
| `continued-fractions-w4` | verbatim | click | 2d | 1 | continued-fractions |
| `continued-fractions-w5` | verbatim | click | 2d | 1 | continued-fractions |
| `continued-fractions-w6` | verbatim | click | 2d | 1 | continued-fractions |
| `copt-approx` | verbatim | select | 2d | 1 | combinatorial-optimization |
| `copt-duality` | verbatim | slider | 2d | 1 | combinatorial-optimization |
| `copt-flow` | verbatim | click | 2d | 1 | combinatorial-optimization |
| `copt-lp-poly` | verbatim | slider | 2d | 1 | combinatorial-optimization |
| `copt-matching` | verbatim | click | 2d | 1 | combinatorial-optimization |
| `copt-poly` | verbatim | click | 2d | 1 | combinatorial-optimization |
| `copt-tu` | verbatim | select | 2d | 1 | combinatorial-optimization |
| `crypto-diffie-hellman` | crypto-diffie-hellman | slider | 2d | 1 | mathematics-and-cryptography |
| `crypto-ecc-points` | crypto-ecc-points | slider | 2d | 1 | mathematics-and-cryptography |
| `crypto-lwe-samples` | crypto-lwe-samples | slider | 2d | 1 | mathematics-and-cryptography |
| `crypto-rsa-toy` | crypto-rsa-toy | slider | 2d | 1 | mathematics-and-cryptography |
| `crypto-schnorr-protocol` | crypto-schnorr-protocol | button | 2d | 1 | mathematics-and-cryptography |
| `crypto-totient-units` | crypto-totient-units | slider | 2d | 1 | mathematics-and-cryptography |
| `crystalline-cohomology-w1` | verbatim | click | 2d | 1 | crystalline-cohomology |
| `crystalline-cohomology-w2` | verbatim | click | 2d | 1 | crystalline-cohomology |
| `crystalline-cohomology-w3` | verbatim | click | 2d | 1 | crystalline-cohomology |
| `crystalline-cohomology-w4` | verbatim | click | 2d | 1 | crystalline-cohomology |
| `crystalline-cohomology-w5` | verbatim | click | 2d | 1 | crystalline-cohomology |
| `crystalline-cohomology-w6` | verbatim | click | 2d | 1 | crystalline-cohomology |
| `crystalline-cohomology-w7` | verbatim | click | 2d | 1 | crystalline-cohomology |
| `ct-w1` | verbatim | click | 2d | 1 | coding-theory |
| `ct-w2` | verbatim | click | 2d | 1 | coding-theory |
| `ct-w3` | verbatim | click | 2d | 1 | coding-theory |
| `ct-w4` | verbatim | click | 2d | 1 | coding-theory |
| `ct-w5` | verbatim | click | 2d | 1 | coding-theory |
| `ct-w6` | verbatim | click | 2d | 1 | coding-theory |
| `ct-w7` | verbatim | click | 2d | 1 | coding-theory |
| `cv-w-central` | verbatim | slider | 2d | 1 | convex-optimization |
| `cv-w-epigraph` | verbatim | slider | 2d | 1 | convex-optimization |
| `cv-w-gw` | verbatim | slider | 2d | 1 | convex-optimization |
| `cv-w-kkt` | verbatim | slider | 2d | 1 | convex-optimization |
| `cv-w-sgd` | verbatim | slider | 2d | 1 | convex-optimization |
| `cv-w-slater` | verbatim | slider | 2d | 1 | convex-optimization |
| `cv-w-subgrad` | verbatim | slider | 2d | 1 | convex-optimization |
| `d-modules-w1` | verbatim | click | 2d | 1 | d-modules |
| `d-modules-w2` | verbatim | click | 2d | 1 | d-modules |
| `d-modules-w3` | verbatim | click | 2d | 1 | d-modules |
| `d-modules-w4` | verbatim | click | 2d | 1 | d-modules |
| `d-modules-w5` | verbatim | click | 2d | 1 | d-modules |
| `d-modules-w6` | verbatim | click | 2d | 1 | d-modules |
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
| `dirac-clifford` | verbatim | click | 2d | 1 | dirac-equation |
| `dirac-current` | verbatim | slider | 2d | 1 | dirac-equation |
| `dirac-gamma-matrices` | verbatim | click | 2d | 1 | dirac-equation |
| `dirac-pauli` | verbatim | slider | 2d | 1 | dirac-equation |
| `dirac-sea` | verbatim | click | 2d | 1 | dirac-equation |
| `dirac-spin` | verbatim | slider | 2d | 1 | dirac-equation |
| `dirichlet-unit-theorem-w1` | verbatim | click | 2d | 1 | dirichlet-unit-theorem |
| `dirichlet-unit-theorem-w2` | verbatim | click | 2d | 1 | dirichlet-unit-theorem |
| `dirichlet-unit-theorem-w3` | verbatim | click | 2d | 1 | dirichlet-unit-theorem |
| `dirichlet-unit-theorem-w4` | verbatim | click | 2d | 1 | dirichlet-unit-theorem |
| `dirichlet-unit-theorem-w5` | verbatim | click | 2d | 1 | dirichlet-unit-theorem |
| `dirichlet-unit-theorem-w6` | verbatim | click | 2d | 1 | dirichlet-unit-theorem |
| `dtgw-w1` | verbatim | slider | 2d | 1 | donaldson-thomas-and-gw-invariants |
| `dtgw-w2` | verbatim | click | 2d | 1 | donaldson-thomas-and-gw-invariants |
| `dtgw-w3` | verbatim | slider | 2d | 1 | donaldson-thomas-and-gw-invariants |
| `dtgw-w4` | verbatim | click | 2d | 1 | donaldson-thomas-and-gw-invariants |
| `dtgw-w5` | verbatim | click | 2d | 1 | donaldson-thomas-and-gw-invariants |
| `dtgw-w6` | verbatim | click | 2d | 1 | donaldson-thomas-and-gw-invariants |
| `dtgw-w7` | verbatim | slider | 2d | 1 | donaldson-thomas-and-gw-invariants |
| `ec-disc` | verbatim | slider | 2d | 1 | elliptic-curves |
| `ec-gl` | verbatim | slider | 2d | 1 | elliptic-curves |
| `ec-j` | verbatim | slider | 2d | 1 | elliptic-curves |
| `ec-lat` | verbatim | interact | 2d | 1 | elliptic-curves |
| `ec-mw` | verbatim | select | 2d | 1 | elliptic-curves |
| `ec-rep` | verbatim | slider | 2d | 1 | elliptic-curves |
| `ec-tf` | verbatim | select | 2d | 1 | elliptic-curves |
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
| `forcing-cohen-real` | forcing-cohen-real | stepper | 2d | 1 | forcing-and-independence |
| `forcing-continuum-landing` | forcing-continuum-landing | toggle | 2d | 1 | forcing-and-independence |
| `forcing-dependency-map` | forcing-dependency-map | diagram | 2d | 1 | forcing-and-independence |
| `forcing-generic-filter` | forcing-generic-filter | stepper | 2d | 1 | forcing-and-independence |
| `forcing-poset` | forcing-poset | toggle | 2d | 1 | forcing-and-independence |
| `forcing-truth-table` | forcing-truth-table | table | 2d | 1 | forcing-and-independence |
| `fpt-bp` | verbatim | slider | 2d | 1 | fixed-point-theorems |
| `fpt-br` | verbatim | static | 2d | 1 | fixed-point-theorems |
| `fpt-kk` | verbatim | slider | 2d | 1 | fixed-point-theorems |
| `fpt-lf` | verbatim | select | 2d | 1 | fixed-point-theorems |
| `fpt-pl` | verbatim | slider | 2d | 1 | fixed-point-theorems |
| `fpt-sc` | verbatim | click | 2d | 1 | fixed-point-theorems |
| `fr-dict` | verbatim | interact | 2d | 1 | frobenius-and-reciprocity |
| `fr-tower` | verbatim | interact | 2d | 1 | frobenius-and-reciprocity |
| `gal-three-impossibilities` | verbatim | static | 2d | 1 | galois |
| `gb-buch` | verbatim | click | 2d | 1 | groebner-bases |
| `gb-elim` | verbatim | click | 2d | 1 | groebner-bases |
| `gb-monorder` | verbatim | select | 2d | 1 | groebner-bases |
| `gb-mvdiv` | verbatim | click | 2d | 1 | groebner-bases |
| `gb-reduce` | verbatim | click | 2d | 1 | groebner-bases |
| `gb-solve` | verbatim | click | 2d | 1 | groebner-bases |
| `gb-spoly` | verbatim | click | 2d | 1 | groebner-bases |
| `gb-staircase` | verbatim | select | 2d | 1 | groebner-bases |
| `gcb-central-extension-browser` | gcb-central-extension-browser | click | 2d | 1 | galois-cohomology-and-brauer |
| `gcb-cocycle-tester` | gcb-cocycle-tester | click | 2d | 1 | galois-cohomology-and-brauer |
| `gcb-cyclic-algebra-tester` | gcb-cyclic-algebra-tester | click | 2d | 1 | galois-cohomology-and-brauer |
| `gcb-hasse-counterexample-gallery` | gcb-hasse-counterexample-gallery | click | 2d | 1 | galois-cohomology-and-brauer |
| `gcb-mu2-torsor-visualizer` | gcb-mu2-torsor-visualizer | click | 2d | 1 | galois-cohomology-and-brauer |
| `gcb-tate-pairing-table` | gcb-tate-pairing-table | click | 2d | 1 | galois-cohomology-and-brauer |
| `gcg-cay` | verbatim | click | 2d | 1 | geometric-and-combinatorial-group-theory |
| `gcg-dec` | verbatim | click | 2d | 1 | geometric-and-combinatorial-group-theory |
| `gcg-grow` | verbatim | slider | 2d | 1 | geometric-and-combinatorial-group-theory |
| `gcg-hyp` | verbatim | slider | 2d | 1 | geometric-and-combinatorial-group-theory |
| `gcg-pres` | verbatim | select | 2d | 1 | geometric-and-combinatorial-group-theory |
| `gcg-qi` | verbatim | slider | 2d | 1 | geometric-and-combinatorial-group-theory |
| `general-relativity-cosmology` | general-relativity-cosmology | slider | 2d | 1 | general-relativity |
| `general-relativity-einstein` | general-relativity-einstein | click | 2d | 1 | general-relativity |
| `general-relativity-gw` | general-relativity-gw | slider | 2d | 1 | general-relativity |
| `general-relativity-kerr` | general-relativity-kerr | slider | 2d | 1 | general-relativity |
| `general-relativity-light-cones` | general-relativity-light-cones | drag | 2d | 1 | general-relativity |
| `general-relativity-schwarzschild` | general-relativity-schwarzschild | slider | 2d | 1 | general-relativity |
| `git-w1` | verbatim | click | 2d | 1 | geometric-invariant-theory |
| `git-w2` | verbatim | click | 2d | 1 | geometric-invariant-theory |
| `git-w3` | verbatim | click | 2d | 1 | geometric-invariant-theory |
| `git-w4` | verbatim | click | 2d | 1 | geometric-invariant-theory |
| `git-w5` | verbatim | click | 2d | 1 | geometric-invariant-theory |
| `git-w6` | verbatim | click | 2d | 1 | geometric-invariant-theory |
| `git-w7` | verbatim | click | 2d | 1 | geometric-invariant-theory |
| `gmt-bv` | verbatim | slider | 2d | 1 | geometric-measure-theory |
| `gmt-coarea` | verbatim | slider | 2d | 1 | geometric-measure-theory |
| `gmt-currents` | verbatim | click | 2d | 1 | geometric-measure-theory |
| `gmt-perim` | verbatim | slider | 2d | 1 | geometric-measure-theory |
| `gmt-plateau` | verbatim | drag | 2d | 1 | geometric-measure-theory |
| `gmt-rect` | verbatim | slider | 2d | 1 | geometric-measure-theory |
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
| `gt-bpst` | verbatim | slider | 2d | 1 | gauge-theory |
| `gt-cs` | verbatim | slider | 2d | 1 | gauge-theory |
| `gt-curv` | verbatim | select | 2d | 1 | gauge-theory |
| `gt-hopf` | verbatim | slider | 2d | 1 | gauge-theory |
| `gt-lattice` | verbatim | slider | 2d | 1 | gauge-theory |
| `gt-sw` | verbatim | click | 2d | 1 | gauge-theory |
| `gt-wilson` | verbatim | slider | 2d | 1 | gauge-theory |
| `half-integral-weight-forms-w1` | verbatim | click | 2d | 1 | half-integral-weight-forms |
| `half-integral-weight-forms-w2` | verbatim | click | 2d | 1 | half-integral-weight-forms |
| `half-integral-weight-forms-w3` | verbatim | click | 2d | 1 | half-integral-weight-forms |
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
| `hf-d-invariant` | verbatim | slider | 2d | 1 | heegaard-floer |
| `hf-knot-floer` | verbatim | select | 2d | 1 | heegaard-floer |
| `hf-lagrangian-floer` | verbatim | slider | 2d | 1 | heegaard-floer |
| `hf-splittings` | verbatim | select | 2d | 1 | heegaard-floer |
| `hf-surgery-triangle` | verbatim | click | 2d | 1 | heegaard-floer |
| `hf-variants` | verbatim | interact | 2d | 1 | heegaard-floer |
| `hodge-theory-filtration-scrubber` | hodge-theory-filtration-scrubber | interact | 2d | 1 | hodge-theory |
| `hodge-theory-hodge-class-cases` | hodge-theory-hodge-class-cases | interact | 2d | 1 | hodge-theory |
| `hodge-theory-hodge-diamond` | hodge-theory-hodge-diamond | interact | 2d | 1 | hodge-theory |
| `hodge-theory-mixed-weight` | hodge-theory-mixed-weight | step | 2d | 1 | hodge-theory |
| `hodge-theory-period-elliptic` | hodge-theory-period-elliptic | interact | 2d | 1 | hodge-theory |
| `homotopy-theory-w1` | verbatim | click | 2d | 1 | homotopy-theory |
| `homotopy-theory-w2` | verbatim | click | 2d | 1 | homotopy-theory |
| `homotopy-theory-w3` | verbatim | click | 2d | 1 | homotopy-theory |
| `homotopy-theory-w4` | verbatim | click | 2d | 1 | homotopy-theory |
| `homotopy-theory-w5` | verbatim | click | 2d | 1 | homotopy-theory |
| `homotopy-theory-w6` | verbatim | click | 2d | 1 | homotopy-theory |
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
| `iwasawa-theory-w1` | verbatim | click | 2d | 1 | iwasawa-theory |
| `iwasawa-theory-w2` | verbatim | click | 2d | 1 | iwasawa-theory |
| `iwasawa-theory-w3` | verbatim | click | 2d | 1 | iwasawa-theory |
| `iwasawa-theory-w4` | verbatim | click | 2d | 1 | iwasawa-theory |
| `iwasawa-theory-w5` | verbatim | click | 2d | 1 | iwasawa-theory |
| `iwasawa-theory-w6` | verbatim | click | 2d | 1 | iwasawa-theory |
| `julia-playground` | julia-playground | slider | 2d | 1 | dynamical-systems |
| `k-theory-bott-periodicity` | k-theory-bott-periodicity | slider | 2d | 1 | k-theory |
| `k-theory-chern-character` | k-theory-chern-character | slider | 2d | 1 | k-theory |
| `k-theory-grothendieck-builder` | k-theory-grothendieck-builder | click | 2d | 1 | k-theory |
| `k-theory-index-theorem` | k-theory-index-theorem | click | 2d | 1 | k-theory |
| `k-theory-low-k-groups` | k-theory-low-k-groups | click | 2d | 1 | k-theory |
| `k-theory-ses-relations` | k-theory-ses-relations | click | 2d | 1 | k-theory |
| `kf-cycle` | verbatim | slider | 2d | 1 | kalman-filtering-and-state-estimation |
| `kf-ellipse` | verbatim | slider | 2d | 1 | kalman-filtering-and-state-estimation |
| `kf-fusion` | verbatim | slider | 2d | 1 | kalman-filtering-and-state-estimation |
| `kf-gain` | verbatim | slider | 2d | 1 | kalman-filtering-and-state-estimation |
| `kf-setup` | verbatim | slider | 2d | 1 | kalman-filtering-and-state-estimation |
| `kf-track` | verbatim | slider | 2d | 1 | kalman-filtering-and-state-estimation |
| `kg-anti` | verbatim | click | 2d | 1 | klein-gordon-equation |
| `kg-curr` | verbatim | slider | 2d | 1 | klein-gordon-equation |
| `kg-deriv` | verbatim | slider | 2d | 1 | klein-gordon-equation |
| `kg-disp` | verbatim | slider | 2d | 1 | klein-gordon-equation |
| `kg-nrl` | verbatim | slider | 2d | 1 | klein-gordon-equation |
| `kg-wave` | verbatim | slider | 2d | 1 | klein-gordon-equation |
| `khov-w1` | verbatim | click | 2d | 1 | khovanov-homology |
| `khov-w2` | verbatim | click | 2d | 1 | khovanov-homology |
| `khov-w3` | verbatim | click | 2d | 1 | khovanov-homology |
| `khov-w4` | verbatim | click | 2d | 1 | khovanov-homology |
| `khov-w5` | verbatim | click | 2d | 1 | khovanov-homology |
| `khov-w6` | verbatim | click | 2d | 1 | khovanov-homology |
| `knot-polynomials-alexander` | knot-polynomials-alexander | click | 2d | 1 | knot-polynomials |
| `knot-polynomials-bracket` | knot-polynomials-bracket | step | 2d | 1 | knot-polynomials |
| `knot-polynomials-gallery` | knot-polynomials-gallery | click | 2d | 1 | knot-polynomials |
| `knot-polynomials-homfly` | knot-polynomials-homfly | step | 2d | 1 | knot-polynomials |
| `knot-polynomials-reidemeister` | knot-polynomials-reidemeister | click | 2d | 1 | knot-polynomials |
| `knot-polynomials-rmatrix` | knot-polynomials-rmatrix | slider | 2d | 1 | knot-polynomials |
| `langlands-euler-product` | langlands-euler-product | interact | 2d | 1 | langlands-program |
| `langlands-local-classification` | langlands-local-classification | interact | 2d | 1 | langlands-program |
| `langlands-reciprocity-dictionary` | langlands-reciprocity-dictionary | interact | 2d | 1 | langlands-program |
| `large-dev-cramer-tilt` | large-dev-cramer-tilt | slider | 2d | 1 | large-deviations |
| `large-dev-gartner-ar1` | large-dev-gartner-ar1 | slider | 2d | 1 | large-deviations |
| `large-dev-rate-gallery` | large-dev-rate-gallery | toggle | 2d | 1 | large-deviations |
| `large-dev-sanov-kl` | large-dev-sanov-kl | click | 2d | 1 | large-deviations |
| `large-dev-schilder-paths` | large-dev-schilder-paths | click | 2d | 1 | large-deviations |
| `lie-algebras-adjoint-vis` | lie-algebras-adjoint-vis | click | 2d | 1 | lie-algebras |
| `lie-algebras-bracket-table` | lie-algebras-bracket-table | click | 2d | 1 | lie-algebras |
| `lie-algebras-derived-series` | lie-algebras-derived-series | step | 2d | 1 | lie-algebras |
| `lie-algebras-dynkin-gallery` | lie-algebras-dynkin-gallery | click | 2d | 1 | lie-algebras |
| `lie-algebras-root-vis` | lie-algebras-root-vis | click | 2d | 1 | lie-algebras |
| `lie-algebras-weight-diagram` | lie-algebras-weight-diagram | slider | 2d | 1 | lie-algebras |
| `maass-forms-w1` | verbatim | click | 2d | 1 | maass-forms |
| `maass-forms-w2` | verbatim | click | 2d | 1 | maass-forms |
| `maass-forms-w3` | verbatim | click | 2d | 1 | maass-forms |
| `maass-forms-w4` | verbatim | click | 2d | 1 | maass-forms |
| `maass-forms-w5` | verbatim | click | 2d | 1 | maass-forms |
| `maass-forms-w6` | verbatim | click | 2d | 1 | maass-forms |
| `mathbio-w1` | verbatim | slider | 2d | 1 | mathematical-biology |
| `mathbio-w2` | verbatim | slider | 2d | 1 | mathematical-biology |
| `mathbio-w3` | verbatim | slider | 2d | 1 | mathematical-biology |
| `mathbio-w4` | verbatim | slider | 2d | 1 | mathematical-biology |
| `mathbio-w5` | verbatim | slider | 2d | 1 | mathematical-biology |
| `mathbio-w6` | verbatim | click | 2d | 1 | mathematical-biology |
| `mathbio-w7` | verbatim | slider | 2d | 1 | mathematical-biology |
| `matroid-axiom-checker` | matroid-axiom-checker | click | 2d | 1 | matroid-theory |
| `matroid-bases-rank-explorer` | matroid-bases-rank-explorer | slider | 2d | 1 | matroid-theory |
| `matroid-dual-explorer` | matroid-dual-explorer | click | 2d | 1 | matroid-theory |
| `matroid-flats-stepper` | matroid-flats-stepper | step | 2d | 1 | matroid-theory |
| `matroid-graph-forests` | matroid-graph-forests | click | 2d | 1 | matroid-theory |
| `matroid-greedy-vs-nonmatroid` | matroid-greedy-vs-nonmatroid | slider | 2d | 1 | matroid-theory |
| `matroid-tutte-polynomial` | matroid-tutte-polynomial | slider | 2d | 1 | matroid-theory |
| `mc-examples` | verbatim | select | 2d | 1 | model-categories |
| `mc-lift` | verbatim | click | 2d | 1 | model-categories |
| `mc-nerve` | verbatim | click | 2d | 1 | model-categories |
| `mc-pushout` | verbatim | select | 2d | 1 | model-categories |
| `mc-quillen` | verbatim | click | 2d | 1 | model-categories |
| `mc-replace` | verbatim | slider | 2d | 1 | model-categories |
| `mcg-w1` | verbatim | select | 2d | 1 | mapping-class-groups |
| `mcg-w2` | verbatim | drag | 2d | 1 | mapping-class-groups |
| `mcg-w3` | verbatim | drag | 2d | 1 | mapping-class-groups |
| `mcg-w4` | verbatim | drag | 2d | 1 | mapping-class-groups |
| `mcg-w5` | verbatim | input | 2d | 1 | mapping-class-groups |
| `mcg-w6` | verbatim | click | 2d | 1 | mapping-class-groups |
| `mchaos-w1` | verbatim | interactive | 2d | 1 | mathematical-chaos |
| `mchaos-w2` | verbatim | interactive | 2d | 1 | mathematical-chaos |
| `mchaos-w3` | verbatim | interactive | 2d | 1 | mathematical-chaos |
| `mchaos-w4` | verbatim | interactive | 2d | 1 | mathematical-chaos |
| `mchaos-w5` | verbatim | interactive | 2d | 1 | mathematical-chaos |
| `mchaos-w6` | verbatim | interactive | 2d | 1 | mathematical-chaos |
| `mf-w1` | verbatim | slider | 2d | 1 | mathematical-finance |
| `mf-w2` | verbatim | slider | 2d | 1 | mathematical-finance |
| `mf-w3` | verbatim | slider | 2d | 1 | mathematical-finance |
| `mf-w4` | verbatim | slider | 2d | 1 | mathematical-finance |
| `mf-w5` | verbatim | slider | 2d | 1 | mathematical-finance |
| `mf-w6` | verbatim | click | 2d | 1 | mathematical-finance |
| `mf-w7` | verbatim | click | 2d | 1 | mathematical-finance |
| `mirror-hms-pairing` | mirror-hms-pairing | click | 2d | 1 | mirror-symmetry |
| `mirror-hodge-diamond` | mirror-hodge-diamond | select | 2d | 1 | mirror-symmetry |
| `mirror-quintic-counts` | mirror-quintic-counts | click | 2d | 1 | mirror-symmetry |
| `mirror-quintic-periods` | mirror-quintic-periods | slider | 2d | 1 | mirror-symmetry |
| `mirror-stable-map` | mirror-stable-map | slider | 2d | 1 | mirror-symmetry |
| `mirror-syz-fibration` | mirror-syz-fibration | slider | 2d | 1 | mirror-symmetry |
| `ml-elliptic` | verbatim | slider | 2d | 1 | microlocal-analysis |
| `ml-fio-canon` | verbatim | slider | 2d | 1 | microlocal-analysis |
| `ml-prop` | verbatim | slider | 2d | 1 | microlocal-analysis |
| `ml-radon` | verbatim | slider | 2d | 1 | microlocal-analysis |
| `ml-symbol` | verbatim | slider | 2d | 1 | microlocal-analysis |
| `ml-wf` | verbatim | select | 2d | 1 | microlocal-analysis |
| `mmp-and-birational-geometry-w1` | verbatim | click | 2d | 1 | mmp-and-birational-geometry |
| `mmp-and-birational-geometry-w2` | verbatim | click | 2d | 1 | mmp-and-birational-geometry |
| `mmp-and-birational-geometry-w3` | verbatim | click | 2d | 1 | mmp-and-birational-geometry |
| `mmp-and-birational-geometry-w4` | verbatim | click | 2d | 1 | mmp-and-birational-geometry |
| `mmp-and-birational-geometry-w5` | verbatim | click | 2d | 1 | mmp-and-birational-geometry |
| `mmp-and-birational-geometry-w6` | verbatim | click | 2d | 1 | mmp-and-birational-geometry |
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
| `motives-realization-comparison` | motives-realization-comparison | interact | 2d | 1 | motives |
| `motives-standard-conjectures` | motives-standard-conjectures | interact | 2d | 1 | motives |
| `ms-beta-posterior` | ms-beta-posterior | slider | 2d | 1 | mathematical-statistics |
| `ms-bias-variance` | ms-bias-variance | slider | 2d | 1 | mathematical-statistics |
| `ms-crlb-envelope` | ms-crlb-envelope | slider | 2d | 1 | mathematical-statistics |
| `ms-likelihood-curve` | ms-likelihood-curve | slider | 2d | 1 | mathematical-statistics |
| `ms-neyman-pearson` | ms-neyman-pearson | slider | 2d | 1 | mathematical-statistics |
| `ms-wilks-theorem` | ms-wilks-theorem | slider | 2d | 1 | mathematical-statistics |
| `natural-transformation-explorer` | naturality-square | slider+click | 2d | 1 | category-theory |
| `numerical-fem-hat-basis` | numerical-fem-hat-basis | slider | 2d | 1 | numerical-analysis |
| `numerical-fp-cancellation` | numerical-fp-cancellation | slider | 2d | 1 | numerical-analysis |
| `numerical-ftcs-stability` | numerical-ftcs-stability | slider | 2d | 1 | numerical-analysis |
| `numerical-hilbert-conditioning` | numerical-hilbert-conditioning | slider | 2d | 1 | numerical-analysis |
| `numerical-newton-iteration` | numerical-newton-iteration | step | 2d | 1 | numerical-analysis |
| `numerical-quadrature-error` | numerical-quadrature-error | slider | 2d | 1 | numerical-analysis |
| `oc-bolza` | verbatim | slider | 2d | 1 | optimal-control-and-dynamic-programming |
| `oc-hjb` | verbatim | slider | 2d | 1 | optimal-control-and-dynamic-programming |
| `oc-lqr` | verbatim | slider | 2d | 1 | optimal-control-and-dynamic-programming |
| `oc-merton` | verbatim | slider | 2d | 1 | optimal-control-and-dynamic-programming |
| `oc-pmp` | verbatim | scrub | 2d | 1 | optimal-control-and-dynamic-programming |
| `oc-reach` | verbatim | slider | 2d | 1 | optimal-control-and-dynamic-programming |
| `oc-vi` | verbatim | click | 2d | 1 | optimal-control-and-dynamic-programming |
| `pchar-w1` | verbatim | interact | 2d | 1 | positive-characteristic-ag |
| `pchar-w2` | verbatim | slider | 2d | 1 | positive-characteristic-ag |
| `pchar-w3` | verbatim | slider | 2d | 1 | positive-characteristic-ag |
| `pchar-w4` | verbatim | select | 2d | 1 | positive-characteristic-ag |
| `pchar-w5` | verbatim | select | 2d | 1 | positive-characteristic-ag |
| `pchar-w6` | verbatim | select | 2d | 1 | positive-characteristic-ag |
| `pchar-w7` | verbatim | interact | 2d | 1 | positive-characteristic-ag |
| `pchar-w8` | verbatim | interact | 2d | 1 | positive-characteristic-ag |
| `pchar-w9` | verbatim | select | 2d | 1 | positive-characteristic-ag |
| `pde-classifier` | pde-classifier | slider | 2d | 1 | partial-differential-equations |
| `pde-heat-kernel` | pde-heat-kernel | slider | 2d | 1 | partial-differential-equations |
| `pde-poisson-disk` | pde-poisson-disk | drag | 2d | 1 | partial-differential-equations |
| `pde-sobolev-embedding` | pde-sobolev-embedding | slider | 2d | 1 | partial-differential-equations |
| `pde-wave-dalembert` | pde-wave-dalembert | slider | 2d | 1 | partial-differential-equations |
| `pde-weak-test` | pde-weak-test | slider | 2d | 1 | partial-differential-equations |
| `positivity-and-ample-line-bundles-w1` | verbatim | click | 2d | 1 | positivity-and-ample-line-bundles |
| `positivity-and-ample-line-bundles-w2` | verbatim | click | 2d | 1 | positivity-and-ample-line-bundles |
| `positivity-and-ample-line-bundles-w3` | verbatim | click | 2d | 1 | positivity-and-ample-line-bundles |
| `positivity-and-ample-line-bundles-w4` | verbatim | click | 2d | 1 | positivity-and-ample-line-bundles |
| `positivity-and-ample-line-bundles-w5` | verbatim | click | 2d | 1 | positivity-and-ample-line-bundles |
| `positivity-and-ample-line-bundles-w6` | verbatim | click | 2d | 1 | positivity-and-ample-line-bundles |
| `probabilistic-method-alterations` | probabilistic-method-alterations | click | 2d | 1 | probabilistic-method |
| `probabilistic-method-concentration` | probabilistic-method-concentration | slider | 2d | 1 | probabilistic-method |
| `probabilistic-method-existence` | probabilistic-method-existence | click | 2d | 1 | probabilistic-method |
| `probabilistic-method-linearity` | probabilistic-method-linearity | slider | 2d | 1 | probabilistic-method |
| `probabilistic-method-lll` | probabilistic-method-lll | slider | 2d | 1 | probabilistic-method |
| `probabilistic-method-ramsey` | probabilistic-method-ramsey | slider | 2d | 1 | probabilistic-method |
| `probabilistic-method-threshold` | probabilistic-method-threshold | slider | 2d | 1 | probabilistic-method |
| `qft-diagrams` | verbatim | slider | 2d | 1 | quantum-field-theory |
| `qft-fock` | verbatim | click | 2d | 1 | quantum-field-theory |
| `qft-modes` | verbatim | slider | 2d | 1 | quantum-field-theory |
| `qft-paths` | verbatim | slider | 2d | 1 | quantum-field-theory |
| `qft-rg-flow` | verbatim | slider | 2d | 1 | quantum-field-theory |
| `qft-sm-fields` | verbatim | click | 2d | 1 | quantum-field-theory |
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
| `resolution-ade-dynkin` | resolution-ade-dynkin | inspect | 2d | 1 | resolution-of-singularities |
| `resolution-curve-normalization` | resolution-curve-normalization | inspect | 2d | 1 | resolution-of-singularities |
| `resolution-cusp-node-visualizer` | resolution-cusp-node-visualizer | inspect | 2d | 1 | resolution-of-singularities |
| `resolution-cuspidal-blowup` | resolution-cuspidal-blowup | inspect | 2d | 1 | resolution-of-singularities |
| `resolution-tower-of-blowups` | resolution-tower-of-blowups | inspect | 2d | 1 | resolution-of-singularities |
| `ricci-blowup-rates` | ricci-blowup-rates | button-stepper | 2d | 1 | ricci-flow |
| `ricci-deturck-trick` | ricci-deturck-trick | button-stepper | 2d | 1 | ricci-flow |
| `ricci-einstein-flows` | ricci-einstein-flows | button-stepper | 2d | 1 | ricci-flow |
| `ricci-extinction-timeline` | ricci-extinction-timeline | button-stepper | 2d | 1 | ricci-flow |
| `ricci-neckpinch-surgery` | ricci-neckpinch-surgery | button-stepper | 2d | 1 | ricci-flow |
| `ricci-soliton-zoo` | ricci-soliton-zoo | button-stepper | 2d | 1 | ricci-flow |
| `rmt-w1` | verbatim | click | 2d | 1 | random-matrix-theory |
| `rmt-w2` | verbatim | click | 2d | 1 | random-matrix-theory |
| `rmt-w3` | verbatim | click | 2d | 1 | random-matrix-theory |
| `rmt-w4` | verbatim | click | 2d | 1 | random-matrix-theory |
| `rmt-w5` | verbatim | click | 2d | 1 | random-matrix-theory |
| `rmt-w6` | verbatim | click | 2d | 1 | random-matrix-theory |
| `rmt-w7` | verbatim | click | 2d | 1 | random-matrix-theory |
| `scv-w1` | verbatim | click | 2d | 1 | several-complex-variables |
| `scv-w2` | verbatim | click | 2d | 1 | several-complex-variables |
| `scv-w3` | verbatim | click | 2d | 1 | several-complex-variables |
| `scv-w4` | verbatim | click | 2d | 1 | several-complex-variables |
| `scv-w5` | verbatim | click | 2d | 1 | several-complex-variables |
| `sg-analytic` | verbatim | select | 2d | 1 | semigroup-theory-evolution-equations |
| `sg-c0` | verbatim | select | 2d | 1 | semigroup-theory-evolution-equations |
| `sg-cauchy` | verbatim | select | 2d | 1 | semigroup-theory-evolution-equations |
| `sg-control` | verbatim | select | 2d | 1 | semigroup-theory-evolution-equations |
| `sg-gen` | verbatim | select | 2d | 1 | semigroup-theory-evolution-equations |
| `sg-hy` | verbatim | select | 2d | 1 | semigroup-theory-evolution-equations |
| `shim-w1` | verbatim | click | 2d | 1 | shimura-varieties |
| `shim-w2` | verbatim | click | 2d | 1 | shimura-varieties |
| `shim-w3` | verbatim | click | 2d | 1 | shimura-varieties |
| `shim-w4` | verbatim | click | 2d | 1 | shimura-varieties |
| `shim-w5` | verbatim | click | 2d | 1 | shimura-varieties |
| `shim-w6` | verbatim | click | 2d | 1 | shimura-varieties |
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
| `sm-boltz` | verbatim | slider | 2d | 1 | statistical-mechanics |
| `sm-cramer` | verbatim | slider | 2d | 1 | statistical-mechanics |
| `sm-gibbs` | verbatim | slider | 2d | 1 | statistical-mechanics |
| `sm-ising` | verbatim | slider | 2d | 1 | statistical-mechanics |
| `sm-occ` | verbatim | slider | 2d | 1 | statistical-mechanics |
| `sm-phase` | verbatim | slider | 2d | 1 | statistical-mechanics |
| `sm-rg` | verbatim | click | 2d | 1 | statistical-mechanics |
| `sobolev-embedding-exponent` | sobolev-embedding-exponent | slider | 2d | 1 | sobolev-spaces-distributions |
| `sobolev-fractional-power` | sobolev-fractional-power | slider | 2d | 1 | sobolev-spaces-distributions |
| `sobolev-newtonian-potential` | sobolev-newtonian-potential | slider | 2d | 1 | sobolev-spaces-distributions |
| `sobolev-pairing` | sobolev-pairing | slider | 2d | 1 | sobolev-spaces-distributions |
| `sobolev-trace` | sobolev-trace | slider | 2d | 1 | sobolev-spaces-distributions |
| `sobolev-variational` | sobolev-variational | slider | 2d | 1 | sobolev-spaces-distributions |
| `sobolev-weak-derivative` | sobolev-weak-derivative | click | 2d | 1 | sobolev-spaces-distributions |
| `spec-herm` | verbatim | click | 2d | 1 | spectral-theory |
| `spec-op` | verbatim | click | 2d | 1 | spectral-theory |
| `spectral-graph-theory-adjacency` | spectral-graph-theory-adjacency | click | 2d | 1 | spectral-graph-theory |
| `spectral-graph-theory-bipartite` | spectral-graph-theory-bipartite | click | 2d | 1 | spectral-graph-theory |
| `spectral-graph-theory-cheeger` | spectral-graph-theory-cheeger | slider | 2d | 1 | spectral-graph-theory |
| `spectral-graph-theory-clustering` | spectral-graph-theory-clustering | step | 2d | 1 | spectral-graph-theory |
| `spectral-graph-theory-components` | spectral-graph-theory-components | click | 2d | 1 | spectral-graph-theory |
| `spectral-graph-theory-fiedler` | spectral-graph-theory-fiedler | click | 2d | 1 | spectral-graph-theory |
| `spectral-graph-theory-random-walk` | spectral-graph-theory-random-walk | step | 2d | 1 | spectral-graph-theory |
| `sr-boost` | verbatim | slider | 2d | 1 | special-relativity |
| `sr-cone` | verbatim | interact | 2d | 1 | special-relativity |
| `sr-em` | verbatim | slider | 2d | 1 | special-relativity |
| `sr-gamma` | verbatim | slider | 2d | 1 | special-relativity |
| `sr-sim` | verbatim | slider | 2d | 1 | special-relativity |
| `sr-vadd` | verbatim | slider | 2d | 1 | special-relativity |
| `st-critdim` | verbatim | slider | 2d | 1 | string-theory |
| `st-critdim-super` | verbatim | slider | 2d | 1 | string-theory |
| `st-cy-moduli` | verbatim | slider | 2d | 1 | string-theory |
| `st-string-math` | verbatim | click | 2d | 1 | string-theory |
| `st-tduality` | verbatim | slider | 2d | 1 | string-theory |
| `st-virasoro` | verbatim | slider | 2d | 1 | string-theory |
| `st-worldsheet` | verbatim | slider | 2d | 1 | string-theory |
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
| `surg-w1` | verbatim | select | 2d | 1 | surgery-theory |
| `surg-w2` | verbatim | select | 2d | 1 | surgery-theory |
| `surg-w3` | verbatim | select | 2d | 1 | surgery-theory |
| `surg-w4` | verbatim | select | 2d | 1 | surgery-theory |
| `surg-w5` | verbatim | select | 2d | 1 | surgery-theory |
| `surg-w6` | verbatim | select | 2d | 1 | surgery-theory |
| `symplectic-cotangent-lagrangians` | symplectic-cotangent-lagrangians | click | 2d | 1 | symplectic-manifolds |
| `symplectic-darboux-moser` | symplectic-darboux-moser | slider | 2d | 1 | symplectic-manifolds |
| `symplectic-dirac-ladder` | symplectic-dirac-ladder | click | 2d | 1 | symplectic-manifolds |
| `symplectic-floer-intersections` | symplectic-floer-intersections | drag | 2d | 1 | symplectic-manifolds |
| `symplectic-form-pairing` | symplectic-form-pairing | drag | 2d | 1 | symplectic-manifolds |
| `symplectic-harmonic-portrait` | symplectic-harmonic-portrait | slider | 2d | 1 | symplectic-manifolds |
| `tda-w1` | verbatim | slider | 2d | 1 | topological-data-analysis |
| `tda-w2` | verbatim | interact | 2d | 1 | topological-data-analysis |
| `tda-w3` | verbatim | slider | 2d | 1 | topological-data-analysis |
| `tda-w4` | verbatim | slider | 2d | 1 | topological-data-analysis |
| `tda-w5` | verbatim | slider | 2d | 1 | topological-data-analysis |
| `tda-w6` | verbatim | click | 2d | 1 | topological-data-analysis |
| `three-body-halo-orbits` | three-body-halo-orbits | click | 2d | 1 | three-body-problem |
| `three-body-horseshoe` | three-body-horseshoe | click | 2d | 1 | three-body-problem |
| `three-body-kam-tori` | three-body-kam-tori | slider | 2d | 1 | three-body-problem |
| `three-body-lagrange-points` | three-body-lagrange-points | slider | 2d | 1 | three-body-problem |
| `three-body-nbody-simulator` | three-body-nbody-simulator | click | 2d | 1 | three-body-problem |
| `three-body-special-solutions` | three-body-special-solutions | click | 2d | 1 | three-body-problem |
| `toric-varieties-w1` | verbatim | click | 2d | 1 | toric-varieties |
| `toric-varieties-w2` | verbatim | click | 2d | 1 | toric-varieties |
| `toric-varieties-w3` | verbatim | click | 2d | 1 | toric-varieties |
| `toric-varieties-w4` | verbatim | click | 2d | 1 | toric-varieties |
| `toric-varieties-w5` | verbatim | click | 2d | 1 | toric-varieties |
| `trop-w1` | verbatim | slider | 2d | 1 | tropical-geometry |
| `trop-w2` | verbatim | select | 2d | 1 | tropical-geometry |
| `trop-w3` | verbatim | slider | 2d | 1 | tropical-geometry |
| `trop-w4` | verbatim | slider | 2d | 1 | tropical-geometry |
| `trop-w5` | verbatim | select | 2d | 1 | tropical-geometry |
| `trop-w6` | verbatim | slider | 2d | 1 | tropical-geometry |
| `type-theory-circle-winding` | type-theory-circle-winding | click | 2d | 1 | type-theory-and-hott |
| `type-theory-context-builder` | type-theory-context-builder | click | 2d | 1 | type-theory-and-hott |
| `type-theory-infty-groupoid` | type-theory-infty-groupoid | click | 2d | 1 | type-theory-and-hott |
| `type-theory-lambda-reduction` | type-theory-lambda-reduction | click | 2d | 1 | type-theory-and-hott |
| `type-theory-path-space` | type-theory-path-space | drag | 2d | 1 | type-theory-and-hott |
| `type-theory-univalence-toggle` | type-theory-univalence-toggle | click | 2d | 1 | type-theory-and-hott |
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
| `wav-den` | verbatim | slider | 2d | 1 | wavelets |
| `wav-dwt` | verbatim | click | 2d | 1 | wavelets |
| `wav-haar` | verbatim | slider | 2d | 1 | wavelets |
| `wav-mra` | verbatim | slider | 2d | 1 | wavelets |
| `wav-tile` | verbatim | click | 2d | 1 | wavelets |
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
- Widgets: **48** (registry-driven: 48, inline: 0)
  - by family: clickable-diagram: 3, button-stepper: 1, fol-term-tree: 1, fol-model-checker: 1, fol-modus-ponens-closure: 1, fol-henkin-construction: 1, fol-compactness-finite-sat: 1, fol-skolem-paradox: 1, fol-dlo-quantifier-elimination: 1, zfc-cumulative-hierarchy: 1, zfc-ordinal-picket-fence: 1, zfc-ordinal-calculator: 1, zfc-aleph-ladder: 1, zfc-choice-picker: 1, zfc-continuum-locator: 1, zfc-large-cardinal-tower: 1, model-theory-signature-explorer: 1, model-theory-equivalence-prober: 1, model-theory-back-and-forth: 1, model-theory-types-explorer: 1, model-theory-ef-games: 1, model-theory-ax-grothendieck: 1, computability-turing-increment: 1, computability-recursion-tracer: 1, computability-halting-diagonal: 1, computability-rec-vs-re-venn: 1, computability-reduction-graph: 1, computability-godel-encoding: 1, complexity-growth-rates: 1, complexity-sat-verifier: 1, complexity-cook-levin-tableau: 1, complexity-karp-reduction: 1, complexity-savitch-recursion: 1, complexity-hierarchy-diagonal: 1, type-theory-context-builder: 1, type-theory-lambda-reduction: 1, type-theory-path-space: 1, type-theory-univalence-toggle: 1, type-theory-circle-winding: 1, type-theory-infty-groupoid: 1, forcing-poset: 1, forcing-generic-filter: 1, forcing-truth-table: 1, forcing-cohen-real: 1, forcing-continuum-landing: 1, forcing-dependency-map: 1
  - by dimension: 2d: 48
  - by gesture: click: 21, step: 13, slider: 3, toggle: 3, stepper: 2, type: 1, input: 1, graph-walk: 1, drag: 1, table: 1, diagram: 1
- Quizzes: **162** (v1: 147, hard: 15, expert: 0)
  - by type: mcq: 128, numeric: 34

### Algebra & homological

- Topics: **17**, concepts: **148**
- Widgets: **147** (registry-driven: 147, inline: 0)
  - by family: button-stepper: 42, verbatim: 38, clickable-diagram: 21, parametric-plot: 9, proof-scrubber: 2, quantum-groups-hopf-axioms-inspector: 1, quantum-groups-qsl2-deformation-slider: 1, quantum-groups-yang-baxter-reidemeister: 1, quantum-groups-crystal-tensor-product: 1, quantum-groups-reshetikhin-turaev-knots: 1, quantum-groups-applications-map: 1, quaternions-multiplication-tester: 1, quaternions-rotation-visualizer: 1, quaternions-cayley-dickson-ladder: 1, quaternions-fano-plane-oracle: 1, quaternions-frobenius-case-tree: 1, quaternions-hurwitz-tower-bar: 1, naturality-square: 1, declarative-host: 1, clickable-graph: 1, diagram-editor: 1, group-cohomology-coboundary-calculator: 1, group-cohomology-fixed-points: 1, group-cohomology-hilbert-90: 1, group-cohomology-c2-extensions: 1, group-cohomology-tate-periodic-table: 1, group-cohomology-lhs-spectral: 1, group-cohomology-brauer-cheatsheet: 1, lie-algebras-bracket-table: 1, lie-algebras-adjoint-vis: 1, lie-algebras-derived-series: 1, lie-algebras-root-vis: 1, lie-algebras-weight-diagram: 1, lie-algebras-dynkin-gallery: 1, gcb-cocycle-tester: 1, gcb-mu2-torsor-visualizer: 1, gcb-central-extension-browser: 1, gcb-cyclic-algebra-tester: 1, gcb-tate-pairing-table: 1, gcb-hasse-counterexample-gallery: 1
  - by dimension: 2d: 146, 3d: 1
  - by gesture: click: 111, select: 14, slider: 9, inspect: 3, input: 2, toggle: 2, scrub: 2, slider+click: 1, interactive: 1, drag-and-toggle: 1, step: 1
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

- Topics: **22**, concepts: **211**
- Widgets: **204** (registry-driven: 204, inline: 0)
  - by family: verbatim: 50, clickable-diagram: 41, button-stepper: 37, slider-readout: 7, aca-figure: 5, recurrence-plotter: 2, inline-code-cell: 1, proof-scrubber: 1, advanced-complex-analysis-weierstrass: 1, advanced-complex-analysis-three-circles: 1, numerical-fp-cancellation: 1, numerical-newton-iteration: 1, numerical-quadrature-error: 1, numerical-hilbert-conditioning: 1, numerical-ftcs-stability: 1, numerical-fem-hat-basis: 1, variational-fdiff: 1, variational-brachistochrone: 1, variational-direct-method: 1, variational-mountain-pass: 1, variational-isoperimetric: 1, variational-sphere-geodesic: 1, constraint-bifurcation-explorer: 1, complex-analysis-arithmetic: 1, complex-analysis-riemann-sphere: 1, complex-analysis-conformal-map: 1, complex-analysis-conformal-grid: 1, complex-analysis-cauchy-theorem: 1, complex-analysis-cauchy-formula: 1, complex-analysis-liouville: 1, complex-analysis-fta: 1, complex-analysis-max-modulus: 1, complex-analysis-open-mapping: 1, complex-analysis-schwarz-lemma: 1, complex-analysis-laurent: 1, complex-analysis-singularity-zoo: 1, complex-analysis-residue-real-integral: 1, complex-analysis-argument-principle: 1, complex-analysis-disk-automorphism: 1, complex-analysis-normal-families: 1, complex-analysis-riemann-mapping: 1, complex-analysis-harmonic: 1, complex-analysis-monodromy: 1, julia-playground: 1, sobolev-pairing: 1, sobolev-weak-derivative: 1, sobolev-fractional-power: 1, sobolev-embedding-exponent: 1, sobolev-trace: 1, sobolev-newtonian-potential: 1, sobolev-variational: 1, harmonic-partial-sum: 1, harmonic-tent-transform: 1, harmonic-convolution: 1, harmonic-uncertainty: 1, harmonic-heat-evolution: 1, pde-classifier: 1, pde-heat-kernel: 1, pde-wave-dalembert: 1, pde-poisson-disk: 1, pde-weak-test: 1, pde-sobolev-embedding: 1, harmonic-functions-laplacian-heatmap: 1, harmonic-functions-mvp-circle: 1, harmonic-functions-maximum-locator: 1, harmonic-functions-poisson-extension: 1, harmonic-functions-harnack-corridor: 1, harmonic-functions-perron-supremum: 1
  - by dimension: 2d: 203, 3d: 1
  - by gesture: click: 94, slider: 61, interact: 23, select: 10, interactive: 6, drag: 6, edit: 1, timeline: 1, step: 1, static: 1
- Quizzes: **777** (v1: 592, hard: 185, expert: 0)
  - by type: mcq: 487, numeric: 162, multi-select: 40, matching: 29, ordering: 22, complex: 14, spot-the-error: 11, proof-completion: 10, construction: 1, guess-my-rule: 1

### Probability & statistics

- Topics: **11**, concepts: **76**
- Widgets: **72** (registry-driven: 72, inline: 0)
  - by family: verbatim: 21, button-stepper: 10, ms-bias-variance: 1, ms-likelihood-curve: 1, ms-crlb-envelope: 1, ms-neyman-pearson: 1, ms-beta-posterior: 1, ms-wilks-theorem: 1, hdg-sphere-concentration-band: 1, hdg-dvoretzky-section: 1, hdg-jl-distortion-histogram: 1, hdg-talagrand-deviation: 1, hdg-isoperimetry-tail: 1, hdg-marchenko-pastur: 1, stoch-proc-filtration-stopping: 1, stoch-proc-random-walk-martingale: 1, stoch-proc-gamblers-ruin: 1, stoch-proc-doob-decomposition: 1, stoch-proc-convergence-regimes: 1, stoch-proc-brownian-quadratic-variation: 1, stochastic-calc-ito-riemann-sums: 1, stochastic-calc-ito-formula-bsq: 1, stochastic-calc-geometric-brownian-motion: 1, stochastic-calc-girsanov-density: 1, stochastic-calc-feynman-kac-heat: 1, stochastic-calc-binomial-black-scholes: 1, random-walks-graph-step: 1, random-walks-matrix-power: 1, random-walks-tv-distance: 1, random-walks-eigenvalue-inspector: 1, random-walks-cycle-coupling: 1, random-walks-metropolis-hastings: 1, information-entropy: 1, information-mutual-info-venn: 1, information-kl-simplex: 1, information-huffman-builder: 1, information-bsc-capacity: 1, information-rate-distortion: 1, large-dev-cramer-tilt: 1, large-dev-rate-gallery: 1, large-dev-sanov-kl: 1, large-dev-gartner-ar1: 1, large-dev-schilder-paths: 1
  - by dimension: 2d: 72
  - by gesture: slider: 41, click: 23, step: 5, button: 2, toggle: 1
- Quizzes: **265** (v1: 228, hard: 24, expert: 13)
  - by type: mcq: 167, numeric: 70, multi-select: 10, matching: 5, spot-the-error: 5, ordering: 3, proof-completion: 3, construction: 1, complex: 1

### Geometry & topology

- Topics: **25**, concepts: **160**
- Widgets: **164** (registry-driven: 164, inline: 0)
  - by family: verbatim: 54, button-stepper: 34, slider-readout: 6, surface-viewer: 6, clickable-diagram: 4, clickable-graph: 2, svg-illustration: 2, mostow-rigidity-dial: 1, mostow-h3-fundamental-domain: 1, mostow-boundary-extension: 1, mostow-boundary-orbit: 1, mostow-rank-tower: 1, mostow-volume-spectrum: 1, symplectic-form-pairing: 1, symplectic-darboux-moser: 1, symplectic-harmonic-portrait: 1, symplectic-dirac-ladder: 1, symplectic-cotangent-lagrangians: 1, symplectic-floer-intersections: 1, knot-polynomials-gallery: 1, knot-polynomials-reidemeister: 1, knot-polynomials-alexander: 1, knot-polynomials-bracket: 1, knot-polynomials-homfly: 1, knot-polynomials-rmatrix: 1, ricci-einstein-flows: 1, ricci-deturck-trick: 1, ricci-blowup-rates: 1, ricci-soliton-zoo: 1, ricci-neckpinch-surgery: 1, ricci-extinction-timeline: 1, k-theory-grothendieck-builder: 1, k-theory-ses-relations: 1, k-theory-bott-periodicity: 1, k-theory-chern-character: 1, k-theory-low-k-groups: 1, k-theory-index-theorem: 1, atiyah-singer-index-family: 1, atiyah-singer-symbol: 1, atiyah-singer-ch-td: 1, atiyah-singer-cases: 1, atiyah-singer-dirac-sphere: 1, atiyah-singer-anomaly: 1, counterexample-explorer: 1, proof-scrubber: 1, lattice-visualizer: 1, characteristic-classes-mobius-vs-cylinder: 1, characteristic-classes-w1-surfaces: 1, characteristic-classes-c1-clutching: 1, characteristic-classes-pontryagin-formulas: 1, characteristic-classes-poincare-hopf: 1, characteristic-classes-gauss-bonnet: 1, characteristic-classes-classifying-map: 1, characteristic-classes-signature-l-genus: 1, characteristic-classes-cpn-localisation: 1, morse-torus-height: 1, morse-handle-decomp: 1, morse-cw-cells: 1, morse-betti-counts: 1, morse-gradient-flow: 1, morse-sphere-vs-rp2: 1, morse-smale-saddle: 1, morse-cerf-birth-death: 1
  - by dimension: 2d: 158, 3d: 6
  - by gesture: click: 87, slider: 36, select: 14, drag: 11, button-stepper: 6, step: 3, pick: 2, static: 2, interact: 1, input: 1, timeline: 1
- Quizzes: **622** (v1: 480, hard: 142, expert: 0)
  - by type: mcq: 410, numeric: 160, multi-select: 22, matching: 10, ordering: 7, complex: 7, spot-the-error: 3, proof-completion: 3

### Number theory

- Topics: **19**, concepts: **128**
- Widgets: **149** (registry-driven: 149, inline: 0)
  - by family: button-stepper: 66, verbatim: 39, clickable-diagram: 4, modular-arithmetic-clock: 4, input-form: 4, inline-code-cell: 4, declarative-host: 2, parametric-plot: 2, crypto-totient-units: 1, crypto-rsa-toy: 1, crypto-diffie-hellman: 1, crypto-ecc-points: 1, crypto-lwe-samples: 1, crypto-schnorr-protocol: 1, branching-proof-scrubber: 1, clickable-graph: 1, svg-illustration: 1, heights-naive-calculator: 1, heights-northcott-enumerator: 1, heights-weil-pullback: 1, heights-tate-averaging: 1, heights-mahler-measure: 1, heights-genus-growth: 1, heights-arakelov-decomposition: 1, counterexample-explorer: 1, ant-pnt-comparison: 1, ant-explicit-formula: 1, ant-zero-free-region: 1, ant-dirichlet-residue-wheel: 1, ant-sieve-truncation: 1, ant-bombieri-vinogradov: 1, proof-scrubber: 1
  - by dimension: 2d: 149
  - by gesture: click: 100, slider: 22, input: 8, select: 5, edit: 4, interactive: 2, interact: 2, drag: 1, button: 1, static: 1, branching-timeline: 1, read: 1, timeline: 1
- Quizzes: **564** (v1: 381, hard: 183, expert: 0)
  - by type: mcq: 375, numeric: 164, multi-select: 11, matching: 5, ordering: 4, complex: 3, spot-the-error: 1, guess-my-rule: 1

### Modular forms & L-functions

- Topics: **19**, concepts: **116**
- Widgets: **141** (registry-driven: 141, inline: 0)
  - by family: button-stepper: 85, verbatim: 18, parametric-plot: 5, svg-illustration: 4, lattice-visualizer: 2, langlands-reciprocity-dictionary: 1, langlands-euler-product: 1, langlands-local-classification: 1, voa-mode-bookkeeping: 1, voa-axiom-map: 1, voa-virasoro-bracket: 1, voa-character-coeffs: 1, voa-mckay-thompson: 1, voa-construction-zoo: 1, automorphic-restricted-product: 1, automorphic-strong-approximation: 1, automorphic-three-conditions: 1, automorphic-dictionary: 1, automorphic-satake-parameters: 1, automorphic-conductor-ladder: 1, automorphic-local-factor-builder: 1, automorphic-eisenstein-residue: 1, automorphic-functoriality-transfers: 1, modular-curves-fundamental-domain: 1, modular-curves-lattice-cyclic-subgroup: 1, modular-curves-hecke-summands: 1, modular-curves-eichler-shimura: 1, modular-curves-genus-growth: 1, modular-curves-cusps-and-wn: 1, modular-curves-atkin-lehner-newforms: 1, modular-curves-heegner-hypothesis: 1, modular-curves-mazur-torsion: 1
  - by dimension: 2d: 141
  - by gesture: click: 111, slider: 13, step: 8, static: 4, interact: 3, select: 2
- Quizzes: **528** (v1: 348, hard: 180, expert: 0)
  - by type: mcq: 351, numeric: 158, multi-select: 12, matching: 4, ordering: 2, spot-the-error: 1

### Algebraic geometry

- Topics: **35**, concepts: **213**
- Widgets: **231** (registry-driven: 231, inline: 0)
  - by family: verbatim: 79, button-stepper: 61, clickable-diagram: 23, proof-scrubber: 7, clickable-graph: 6, declarative-host: 6, parametric-plot: 4, modular-arithmetic-clock: 2, svg-illustration: 2, motives-realization-comparison: 1, motives-chow-decomposition: 1, motives-standard-conjectures: 1, hodge-theory-hodge-diamond: 1, hodge-theory-filtration-scrubber: 1, hodge-theory-mixed-weight: 1, hodge-theory-hodge-class-cases: 1, hodge-theory-period-elliptic: 1, calabi-yau-canonical-degree: 1, calabi-yau-hodge-diamond: 1, calabi-yau-hypersurface-zoo: 1, calabi-yau-periods: 1, calabi-yau-mirror-swap: 1, calabi-yau-syz-fibration: 1, mirror-hodge-diamond: 1, mirror-quintic-counts: 1, mirror-stable-map: 1, mirror-quintic-periods: 1, mirror-hms-pairing: 1, mirror-syz-fibration: 1, resolution-cusp-node-visualizer: 1, resolution-cuspidal-blowup: 1, resolution-tower-of-blowups: 1, resolution-curve-normalization: 1, resolution-ade-dynkin: 1, lattice-visualizer: 1, algebraic-curves-riemann-hurwitz-cover: 1, algebraic-curves-jacobian-lattice: 1, algebraic-curves-riemann-roch-scrubber: 1, algebraic-curves-canonical-embedding-scrubber: 1, algebraic-curves-hyperelliptic-cover: 1, algebraic-curves-moduli-boundary: 1, algebraic-de-rham-kahler-scrubber: 1, algebraic-de-rham-complex-scrubber: 1, algebraic-de-rham-betti-comparison-scrubber: 1, algebraic-de-rham-hodge-filtration-scrubber: 1, algebraic-de-rham-hodge-diamond-clickgraph: 1, algebraic-de-rham-hodge-pn-explorer: 1, algebraic-de-rham-curve-clickable: 1, algebraic-de-rham-hodge-sandbox: 1, counterexample-explorer: 1
  - by dimension: 2d: 231
  - by gesture: click: 155, interact: 26, slider: 22, select: 12, scrub: 7, inspect: 5, drag: 2, step: 1, slide: 1
- Quizzes: **884** (v1: 639, hard: 245, expert: 0)
  - by type: mcq: 591, numeric: 221, multi-select: 36, matching: 18, ordering: 7, spot-the-error: 7, complex: 3, proof-completion: 1

### Combinatorics & graph theory

- Topics: **15**, concepts: **93**
- Widgets: **95** (registry-driven: 95, inline: 0)
  - by family: parametric-plot: 34, verbatim: 7, button-stepper: 7, designs-bibd-calculator: 1, designs-fisher-incidence: 1, designs-fano-plane: 1, designs-mols-construction: 1, designs-hamming-fano: 1, designs-round-robin: 1, expanders-vertex-expansion: 1, expanders-zigzag-product: 1, spectral-graph-theory-adjacency: 1, spectral-graph-theory-components: 1, spectral-graph-theory-fiedler: 1, spectral-graph-theory-cheeger: 1, spectral-graph-theory-random-walk: 1, spectral-graph-theory-bipartite: 1, spectral-graph-theory-clustering: 1, matroid-axiom-checker: 1, matroid-bases-rank-explorer: 1, matroid-graph-forests: 1, matroid-flats-stepper: 1, matroid-dual-explorer: 1, matroid-greedy-vs-nonmatroid: 1, matroid-tutte-polynomial: 1, probabilistic-method-existence: 1, probabilistic-method-ramsey: 1, probabilistic-method-linearity: 1, probabilistic-method-alterations: 1, probabilistic-method-lll: 1, probabilistic-method-threshold: 1, probabilistic-method-concentration: 1, extremal-combinatorics-turan: 1, extremal-combinatorics-kst: 1, extremal-combinatorics-erdos-stone: 1, extremal-combinatorics-ramsey: 1, extremal-combinatorics-sperner: 1, extremal-combinatorics-removal: 1, simplicial-complexes-combinatorial-faces: 1, simplicial-complexes-combinatorial-fh: 1, simplicial-complexes-combinatorial-nerve: 1, simplicial-complexes-combinatorial-shell: 1, simplicial-complexes-combinatorial-sr: 1, simplicial-complexes-combinatorial-persistence: 1, enumerative-combinatorics-pascal: 1, enumerative-combinatorics-venn: 1, enumerative-combinatorics-genfun: 1, enumerative-combinatorics-perm: 1, enumerative-combinatorics-young: 1, enumerative-combinatorics-bijection: 1
  - by dimension: 2d: 95
  - by gesture: slider: 49, click: 38, step: 8
- Quizzes: **294** (v1: 279, hard: 15, expert: 0)
  - by type: mcq: 196, numeric: 71, multi-select: 23, matching: 2, spot-the-error: 1, ordering: 1

### Mathematical physics

- Topics: **11**, concepts: **69**
- Widgets: **70** (registry-driven: 70, inline: 0)
  - by family: verbatim: 45, schrodinger-figure: 7, hamiltonians-figure: 6, general-relativity-light-cones: 1, general-relativity-einstein: 1, general-relativity-schwarzschild: 1, general-relativity-kerr: 1, general-relativity-cosmology: 1, general-relativity-gw: 1, three-body-nbody-simulator: 1, three-body-lagrange-points: 1, three-body-special-solutions: 1, three-body-horseshoe: 1, three-body-kam-tori: 1, three-body-halo-orbits: 1
  - by dimension: 2d: 70
  - by gesture: slider: 47, click: 14, interact: 7, drag: 1, select: 1
- Quizzes: **208** (v1: 208, hard: 0, expert: 0)
  - by type: mcq: 134, numeric: 26, multi-select: 23, ordering: 11, spot-the-error: 8, matching: 6

### Control theory & optimization

- Topics: **9**, concepts: **58**
- Widgets: **59** (registry-driven: 59, inline: 0)
  - by family: verbatim: 34, parametric-plot: 24, inline-code-cell: 1
  - by dimension: 2d: 59
  - by gesture: slider: 49, click: 6, select: 2, scrub: 1, edit: 1
- Quizzes: **174** (v1: 174, hard: 0, expert: 0)
  - by type: mcq: 116, numeric: 36, multi-select: 14, matching: 4, spot-the-error: 2, ordering: 2

### Learning theory & data science

- Topics: **9**, concepts: **56**
- Widgets: **55** (registry-driven: 55, inline: 0)
  - by family: parametric-plot: 42, slider-readout: 7, verbatim: 6
  - by dimension: 2d: 55
  - by gesture: slider: 53, interact: 1, click: 1
- Quizzes: **166** (v1: 166, hard: 0, expert: 0)
  - by type: mcq: 117, numeric: 25, multi-select: 17, ordering: 6, matching: 1

## Per-topic

- `random-matrix-theory` (Probability & statistics) — concepts=7, widgets=7 (slug=7), quiz=21 (v1=21, hard=0, expert=0)
- `geometric-invariant-theory` (Algebraic geometry) — concepts=7, widgets=7 (slug=7), quiz=21 (v1=21, hard=0, expert=0)
- `heegaard-floer` (Geometry & topology) — concepts=7, widgets=7 (slug=7), quiz=21 (v1=21, hard=0, expert=0)
- `brill-noether` (Algebraic geometry) — concepts=7, widgets=7 (slug=7), quiz=21 (v1=21, hard=0, expert=0)
- `coding-theory` (Combinatorics & graph theory) — concepts=7, widgets=7 (slug=7), quiz=21 (v1=21, hard=0, expert=0)
- `conformal-and-cr-geometry` (Analysis) — concepts=7, widgets=7 (slug=7), quiz=21 (v1=21, hard=0, expert=0)
- `mathematical-biology` (Probability & statistics) — concepts=7, widgets=7 (slug=7), quiz=21 (v1=21, hard=0, expert=0)
- `spectral-methods-data` (Learning theory & data science) — concepts=7, widgets=7 (slug=7), quiz=21 (v1=21, hard=0, expert=0)
- `computational-molecular-biology` (Probability & statistics) — concepts=7, widgets=7 (slug=7), quiz=21 (v1=21, hard=0, expert=0)
- `optimal-control-and-dynamic-programming` (Control theory & optimization) — concepts=7, widgets=7 (slug=7), quiz=21 (v1=21, hard=0, expert=0)
- `combinatorial-optimization` (Control theory & optimization) — concepts=7, widgets=7 (slug=7), quiz=21 (v1=21, hard=0, expert=0)
- `mathematical-finance` (Control theory & optimization) — concepts=7, widgets=7 (slug=7), quiz=21 (v1=21, hard=0, expert=0)
- `donaldson-thomas-and-gw-invariants` (Algebraic geometry) — concepts=7, widgets=7 (slug=7), quiz=21 (v1=21, hard=0, expert=0)
- `positive-characteristic-ag` (Algebraic geometry) — concepts=7, widgets=9 (slug=9), quiz=21 (v1=21, hard=0, expert=0)
- `convex-optimization` (Control theory & optimization) — concepts=7, widgets=8 (slug=8), quiz=21 (v1=21, hard=0, expert=0)
- `convex-geometry` (Geometry & topology) — concepts=7, widgets=7 (slug=7), quiz=21 (v1=21, hard=0, expert=0)
- `topological-data-analysis` (Learning theory & data science) — concepts=7, widgets=6 (slug=6), quiz=21 (v1=21, hard=0, expert=0)
- `mathematical-chaos` (Analysis) — concepts=7, widgets=9 (slug=9), quiz=21 (v1=21, hard=0, expert=0)
- `kalman-filtering-and-state-estimation` (Control theory & optimization) — concepts=6, widgets=6 (slug=6), quiz=18 (v1=18, hard=0, expert=0)
- `statistical-learning-theory` (Learning theory & data science) — concepts=6, widgets=6 (slug=6), quiz=18 (v1=18, hard=0, expert=0)
- `markov-decision-processes` (Control theory & optimization) — concepts=6, widgets=6 (slug=6), quiz=18 (v1=18, hard=0, expert=0)
- `ramsey-theory` (Combinatorics & graph theory) — concepts=6, widgets=6 (slug=6), quiz=18 (v1=18, hard=0, expert=0)
- `order-theory-and-lattices` (Combinatorics & graph theory) — concepts=6, widgets=6 (slug=6), quiz=18 (v1=18, hard=0, expert=0)
- `algebraic-combinatorics` (Combinatorics & graph theory) — concepts=6, widgets=6 (slug=6), quiz=18 (v1=18, hard=0, expert=0)
- `polytopes-and-ehrhart` (Combinatorics & graph theory) — concepts=6, widgets=6 (slug=6), quiz=18 (v1=18, hard=0, expert=0)
- `game-theory` (Control theory & optimization) — concepts=6, widgets=6 (slug=6), quiz=18 (v1=18, hard=0, expert=0)
- `kernel-methods-and-rkhs` (Learning theory & data science) — concepts=6, widgets=6 (slug=6), quiz=18 (v1=18, hard=0, expert=0)
- `reinforcement-learning` (Control theory & optimization) — concepts=6, widgets=6 (slug=6), quiz=18 (v1=18, hard=0, expert=0)
- `pomdps-and-belief-states` (Control theory & optimization) — concepts=6, widgets=6 (slug=6), quiz=18 (v1=18, hard=0, expert=0)
- `probabilistic-graphical-models` (Learning theory & data science) — concepts=6, widgets=6 (slug=6), quiz=16 (v1=16, hard=0, expert=0)
- `deep-learning-theory` (Learning theory & data science) — concepts=6, widgets=6 (slug=6), quiz=18 (v1=18, hard=0, expert=0)
- `information-geometry` (Learning theory & data science) — concepts=6, widgets=6 (slug=6), quiz=18 (v1=18, hard=0, expert=0)
- `diffusion-and-score-based-models` (Learning theory & data science) — concepts=6, widgets=6 (slug=6), quiz=18 (v1=18, hard=0, expert=0)
- `causal-inference` (Learning theory & data science) — concepts=6, widgets=6 (slug=6), quiz=18 (v1=18, hard=0, expert=0)
- `several-complex-variables` (Analysis) — concepts=6, widgets=5 (slug=5), quiz=18 (v1=18, hard=0, expert=0)
- `khovanov-homology` (Geometry & topology) — concepts=6, widgets=6 (slug=6), quiz=18 (v1=18, hard=0, expert=0)
- `shimura-varieties` (Modular forms & L-functions) — concepts=6, widgets=6 (slug=6), quiz=18 (v1=18, hard=0, expert=0)
- `arithmetic-statistics` (Number theory) — concepts=6, widgets=6 (slug=6), quiz=18 (v1=18, hard=0, expert=0)
- `complex-multiplication` (Number theory) — concepts=6, widgets=6 (slug=6), quiz=18 (v1=18, hard=0, expert=0)
- `tropical-geometry` (Algebraic geometry) — concepts=6, widgets=6 (slug=6), quiz=18 (v1=18, hard=0, expert=0)
- `surgery-theory` (Geometry & topology) — concepts=6, widgets=6 (slug=6), quiz=18 (v1=18, hard=0, expert=0)
- `kahler-geometry` (Geometry & topology) — concepts=6, widgets=6 (slug=6), quiz=18 (v1=18, hard=0, expert=0)
- `mapping-class-groups` (Geometry & topology) — concepts=6, widgets=6 (slug=6), quiz=18 (v1=18, hard=0, expert=0)
- `half-integral-weight-forms` (Modular forms & L-functions) — concepts=6, widgets=6 (slug=6), quiz=18 (v1=18, hard=0, expert=0)
- `crystalline-cohomology` (Algebraic geometry) — concepts=6, widgets=7 (slug=7), quiz=18 (v1=18, hard=0, expert=0)
- `homotopy-theory` (Geometry & topology) — concepts=6, widgets=6 (slug=6), quiz=18 (v1=18, hard=0, expert=0)
- `maass-forms` (Modular forms & L-functions) — concepts=6, widgets=6 (slug=6), quiz=18 (v1=18, hard=0, expert=0)
- `d-modules` (Algebraic geometry) — concepts=6, widgets=6 (slug=6), quiz=18 (v1=18, hard=0, expert=0)
- `dirichlet-unit-theorem` (Number theory) — concepts=6, widgets=6 (slug=6), quiz=18 (v1=18, hard=0, expert=0)
- `cobordism` (Geometry & topology) — concepts=6, widgets=6 (slug=6), quiz=18 (v1=18, hard=0, expert=0)
- `mmp-and-birational-geometry` (Algebraic geometry) — concepts=6, widgets=6 (slug=6), quiz=18 (v1=18, hard=0, expert=0)
- `continued-fractions` (Number theory) — concepts=6, widgets=6 (slug=6), quiz=18 (v1=18, hard=0, expert=0)
- `abelian-varieties` (Algebraic geometry) — concepts=6, widgets=6 (slug=6), quiz=18 (v1=18, hard=0, expert=0)
- `positivity-and-ample-line-bundles` (Algebraic geometry) — concepts=6, widgets=6 (slug=6), quiz=18 (v1=18, hard=0, expert=0)
- `motives` (Algebraic geometry) — concepts=8, widgets=3 (slug=3), quiz=24 (v1=24, hard=0, expert=0)
- `algebraic-k-theory-foundations` (Algebra & homological) — concepts=6, widgets=6 (slug=6), quiz=18 (v1=18, hard=0, expert=0)
- `model-categories` (Algebra & homological) — concepts=6, widgets=6 (slug=6), quiz=18 (v1=18, hard=0, expert=0)
- `condensed-mathematics` (Algebra & homological) — concepts=6, widgets=6 (slug=6), quiz=18 (v1=18, hard=0, expert=0)
- `hodge-theory` (Algebraic geometry) — concepts=8, widgets=5 (slug=5), quiz=24 (v1=24, hard=0, expert=0)
- `langlands-program` (Modular forms & L-functions) — concepts=8, widgets=3 (slug=3), quiz=24 (v1=24, hard=0, expert=0)
- `microlocal-analysis` (Analysis) — concepts=6, widgets=6 (slug=6), quiz=18 (v1=18, hard=0, expert=0)
- `geometric-measure-theory` (Analysis) — concepts=6, widgets=6 (slug=6), quiz=18 (v1=18, hard=0, expert=0)
- `semigroup-theory-evolution-equations` (Analysis) — concepts=6, widgets=6 (slug=6), quiz=18 (v1=18, hard=0, expert=0)
- `special-relativity` (Mathematical physics) — concepts=6, widgets=6 (slug=6), quiz=19 (v1=19, hard=0, expert=0)
- `klein-gordon-equation` (Mathematical physics) — concepts=6, widgets=6 (slug=6), quiz=18 (v1=18, hard=0, expert=0)
- `cohomology-and-duality` (Geometry & topology) — concepts=6, widgets=5 (slug=5), quiz=18 (v1=18, hard=0, expert=0)
- `dirac-equation` (Mathematical physics) — concepts=6, widgets=6 (slug=6), quiz=18 (v1=18, hard=0, expert=0)
- `iwasawa-theory` (Number theory) — concepts=6, widgets=6 (slug=6), quiz=18 (v1=18, hard=0, expert=0)
- `quantum-field-theory` (Mathematical physics) — concepts=6, widgets=6 (slug=6), quiz=18 (v1=18, hard=0, expert=0)
- `toric-varieties` (Algebraic geometry) — concepts=6, widgets=5 (slug=5), quiz=18 (v1=18, hard=0, expert=0)
- `statistical-mechanics` (Mathematical physics) — concepts=7, widgets=7 (slug=7), quiz=21 (v1=21, hard=0, expert=0)
- `advanced-complex-analysis` (Analysis) — concepts=13, widgets=7 (slug=7), quiz=39 (v1=39, hard=0, expert=0)
- `groebner-bases` (Algebra & homological) — concepts=8, widgets=8 (slug=8), quiz=24 (v1=24, hard=0, expert=0)
- `mathematical-statistics` (Probability & statistics) — concepts=6, widgets=6 (slug=6), quiz=18 (v1=18, hard=0, expert=0)
- `numerical-analysis` (Analysis) — concepts=6, widgets=6 (slug=6), quiz=18 (v1=18, hard=0, expert=0)
- `computational-number-theory` (Number theory) — concepts=6, widgets=6 (slug=6), quiz=18 (v1=18, hard=0, expert=0)
- `variational-methods` (Analysis) — concepts=6, widgets=6 (slug=6), quiz=18 (v1=18, hard=0, expert=0)
- `fixed-point-theorems` (Analysis) — concepts=8, widgets=9 (slug=9), quiz=24 (v1=24, hard=0, expert=0)
- `calabi-yau-manifolds` (Algebraic geometry) — concepts=6, widgets=6 (slug=6), quiz=18 (v1=18, hard=0, expert=0)
- `high-dimensional-geometry` (Probability & statistics) — concepts=6, widgets=6 (slug=6), quiz=18 (v1=18, hard=0, expert=0)
- `mirror-symmetry` (Algebraic geometry) — concepts=6, widgets=6 (slug=6), quiz=18 (v1=18, hard=0, expert=0)
- `mostow-rigidity` (Geometry & topology) — concepts=6, widgets=6 (slug=6), quiz=18 (v1=18, hard=0, expert=0)
- `resolution-of-singularities` (Algebraic geometry) — concepts=6, widgets=5 (slug=5), quiz=18 (v1=18, hard=0, expert=0)
- `hamiltonians-classical-mechanics` (Mathematical physics) — concepts=6, widgets=6 (slug=6), quiz=18 (v1=18, hard=0, expert=0)
- `general-relativity` (Mathematical physics) — concepts=6, widgets=6 (slug=6), quiz=18 (v1=18, hard=0, expert=0)
- `three-body-problem` (Mathematical physics) — concepts=6, widgets=6 (slug=6), quiz=18 (v1=18, hard=0, expert=0)
- `designs` (Combinatorics & graph theory) — concepts=6, widgets=6 (slug=6), quiz=18 (v1=18, hard=0, expert=0)
- `expanders` (Combinatorics & graph theory) — concepts=6, widgets=6 (slug=6), quiz=18 (v1=18, hard=0, expert=0)
- `symplectic-manifolds` (Geometry & topology) — concepts=6, widgets=6 (slug=6), quiz=18 (v1=18, hard=0, expert=0)
- `quantum-groups` (Algebra & homological) — concepts=6, widgets=6 (slug=6), quiz=18 (v1=18, hard=0, expert=0)
- `quaternions-octonions-and-division-algebras` (Algebra & homological) — concepts=6, widgets=6 (slug=6), quiz=18 (v1=18, hard=0, expert=0)
- `geometric-and-combinatorial-group-theory` (Algebra & homological) — concepts=6, widgets=6 (slug=6), quiz=18 (v1=18, hard=0, expert=0)
- `cluster-algebras` (Algebra & homological) — concepts=6, widgets=6 (slug=6), quiz=18 (v1=18, hard=0, expert=0)
- `wavelets` (Analysis) — concepts=8, widgets=9 (slug=9), quiz=24 (v1=24, hard=0, expert=0)
- `vertex-operator-algebras` (Modular forms & L-functions) — concepts=6, widgets=6 (slug=6), quiz=18 (v1=18, hard=0, expert=0)
- `schrodinger-equation` (Mathematical physics) — concepts=6, widgets=7 (slug=7), quiz=18 (v1=18, hard=0, expert=0)
- `mathematics-and-cryptography` (Number theory) — concepts=6, widgets=6 (slug=6), quiz=18 (v1=18, hard=0, expert=0)
- `knot-polynomials` (Geometry & topology) — concepts=8, widgets=6 (slug=6), quiz=24 (v1=24, hard=0, expert=0)
- `ricci-flow` (Geometry & topology) — concepts=6, widgets=6 (slug=6), quiz=18 (v1=18, hard=0, expert=0)
- `k-theory` (Geometry & topology) — concepts=6, widgets=6 (slug=6), quiz=18 (v1=18, hard=0, expert=0)
- `atiyah-singer-index-theorem` (Geometry & topology) — concepts=6, widgets=6 (slug=6), quiz=18 (v1=18, hard=0, expert=0)
- `naive-set-theory` (Logic & Foundations) — concepts=5, widgets=4 (slug=4), quiz=30 (v1=15, hard=15, expert=0)
- `first-order-logic-and-completeness` (Logic & Foundations) — concepts=7, widgets=7 (slug=7), quiz=21 (v1=21, hard=0, expert=0)
- `zfc-and-ordinals` (Logic & Foundations) — concepts=7, widgets=7 (slug=7), quiz=21 (v1=21, hard=0, expert=0)
- `model-theory-basics` (Logic & Foundations) — concepts=6, widgets=6 (slug=6), quiz=18 (v1=18, hard=0, expert=0)
- `computability-and-decidability` (Logic & Foundations) — concepts=6, widgets=6 (slug=6), quiz=18 (v1=18, hard=0, expert=0)
- `complexity-theory` (Logic & Foundations) — concepts=6, widgets=6 (slug=6), quiz=18 (v1=18, hard=0, expert=0)
- `type-theory-and-hott` (Logic & Foundations) — concepts=6, widgets=6 (slug=6), quiz=18 (v1=18, hard=0, expert=0)
- `forcing-and-independence` (Logic & Foundations) — concepts=6, widgets=6 (slug=6), quiz=18 (v1=18, hard=0, expert=0)
- `algebra` (Algebra & homological) — concepts=16, widgets=16 (slug=16), quiz=85 (v1=48, hard=37, expert=0)
- `category-theory` (Algebra & homological) — concepts=12, widgets=17 (slug=17), quiz=72 (v1=36, hard=36, expert=0)
- `representation-theory` (Algebra & homological) — concepts=13, widgets=13 (slug=13), quiz=74 (v1=39, hard=35, expert=0)
- `commutative-algebra` (Algebra & homological) — concepts=16, widgets=13 (slug=13), quiz=84 (v1=49, hard=35, expert=0)
- `homological` (Algebra & homological) — concepts=15, widgets=12 (slug=12), quiz=82 (v1=45, hard=37, expert=0)
- `derived-categories` (Algebra & homological) — concepts=7, widgets=7 (slug=7), quiz=27 (v1=21, hard=6, expert=0)
- `group-cohomology` (Algebra & homological) — concepts=7, widgets=7 (slug=7), quiz=21 (v1=21, hard=0, expert=0)
- `lie-algebras` (Algebra & homological) — concepts=6, widgets=6 (slug=6), quiz=18 (v1=18, hard=0, expert=0)
- `galois-cohomology-and-brauer` (Algebra & homological) — concepts=6, widgets=6 (slug=6), quiz=18 (v1=18, hard=0, expert=0)
- `elementary-topos-theory` (Higher categories & toposes) — concepts=7, widgets=7 (slug=7), quiz=27 (v1=21, hard=6, expert=0)
- `heyting-algebras-toposes` (Higher categories & toposes) — concepts=6, widgets=6 (slug=6), quiz=24 (v1=18, hard=6, expert=0)
- `grothendieck-topologies-sites` (Higher categories & toposes) — concepts=6, widgets=6 (slug=6), quiz=24 (v1=18, hard=6, expert=0)
- `simplicial-sets-and-nerve` (Higher categories & toposes) — concepts=6, widgets=6 (slug=6), quiz=24 (v1=18, hard=6, expert=0)
- `infinity-categories` (Higher categories & toposes) — concepts=6, widgets=7 (slug=7), quiz=24 (v1=18, hard=6, expert=0)
- `cocartesian-fibrations` (Higher categories & toposes) — concepts=7, widgets=8 (slug=8), quiz=31 (v1=21, hard=10, expert=0)
- `infinity-topoi` (Higher categories & toposes) — concepts=7, widgets=9 (slug=9), quiz=29 (v1=21, hard=8, expert=0)
- `real-analysis` (Analysis) — concepts=18, widgets=19 (slug=19), quiz=83 (v1=54, hard=29, expert=0)
- `measure-theory` (Analysis) — concepts=12, widgets=12 (slug=12), quiz=72 (v1=36, hard=36, expert=0)
- `complex-analysis` (Analysis) — concepts=27, widgets=27 (slug=27), quiz=52 (v1=40, hard=12, expert=0)
- `functional-analysis` (Analysis) — concepts=14, widgets=11 (slug=11), quiz=78 (v1=42, hard=36, expert=0)
- `operator-algebras` (Analysis) — concepts=12, widgets=12 (slug=12), quiz=72 (v1=36, hard=36, expert=0)
- `dynamical-systems` (Analysis) — concepts=13, widgets=14 (slug=14), quiz=75 (v1=39, hard=36, expert=0)
- `sobolev-spaces-distributions` (Analysis) — concepts=7, widgets=7 (slug=7), quiz=21 (v1=21, hard=0, expert=0)
- `harmonic-analysis-fourier` (Analysis) — concepts=8, widgets=5 (slug=5), quiz=24 (v1=24, hard=0, expert=0)
- `partial-differential-equations` (Analysis) — concepts=6, widgets=6 (slug=6), quiz=18 (v1=18, hard=0, expert=0)
- `harmonic-functions` (Analysis) — concepts=6, widgets=6 (slug=6), quiz=18 (v1=18, hard=0, expert=0)
- `spectral-theory` (Analysis) — concepts=9, widgets=9 (slug=9), quiz=27 (v1=27, hard=0, expert=0)
- `probability-theory` (Probability & statistics) — concepts=12, widgets=10 (slug=10), quiz=73 (v1=36, hard=24, expert=13)
- `stochastic-processes-and-martingales` (Probability & statistics) — concepts=6, widgets=6 (slug=6), quiz=18 (v1=18, hard=0, expert=0)
- `stochastic-calculus` (Probability & statistics) — concepts=6, widgets=6 (slug=6), quiz=18 (v1=18, hard=0, expert=0)
- `random-walks-and-mixing` (Probability & statistics) — concepts=6, widgets=6 (slug=6), quiz=18 (v1=18, hard=0, expert=0)
- `information-theory` (Probability & statistics) — concepts=8, widgets=6 (slug=6), quiz=24 (v1=24, hard=0, expert=0)
- `large-deviations` (Probability & statistics) — concepts=5, widgets=5 (slug=5), quiz=15 (v1=15, hard=0, expert=0)
- `point-set-topology` (Geometry & topology) — concepts=6, widgets=7 (slug=7), quiz=36 (v1=18, hard=18, expert=0)
- `algebraic-topology` (Geometry & topology) — concepts=6, widgets=6 (slug=6), quiz=32 (v1=18, hard=14, expert=0)
- `smooth-manifolds` (Geometry & topology) — concepts=10, widgets=9 (slug=9), quiz=59 (v1=30, hard=29, expert=0)
- `differential-forms` (Geometry & topology) — concepts=5, widgets=5 (slug=5), quiz=30 (v1=15, hard=15, expert=0)
- `differential-geometry` (Geometry & topology) — concepts=5, widgets=9 (slug=9), quiz=30 (v1=15, hard=15, expert=0)
- `riemannian-geometry` (Geometry & topology) — concepts=5, widgets=7 (slug=7), quiz=30 (v1=15, hard=15, expert=0)
- `lie-groups` (Geometry & topology) — concepts=7, widgets=6 (slug=6), quiz=42 (v1=21, hard=21, expert=0)
- `riemann-surfaces` (Geometry & topology) — concepts=5, widgets=7 (slug=7), quiz=30 (v1=15, hard=15, expert=0)
- `characteristic-classes` (Geometry & topology) — concepts=9, widgets=9 (slug=9), quiz=27 (v1=27, hard=0, expert=0)
- `morse-theory` (Geometry & topology) — concepts=8, widgets=8 (slug=8), quiz=24 (v1=24, hard=0, expert=0)
- `galois` (Number theory) — concepts=7, widgets=7 (slug=7), quiz=32 (v1=17, hard=15, expert=0)
- `quadratic-reciprocity` (Number theory) — concepts=6, widgets=7 (slug=7), quiz=33 (v1=18, hard=15, expert=0)
- `quadratic-forms-genus-theory` (Number theory) — concepts=5, widgets=6 (slug=6), quiz=30 (v1=15, hard=15, expert=0)
- `additive-number-theory` (Number theory) — concepts=15, widgets=20 (slug=20), quiz=91 (v1=46, hard=45, expert=0)
- `algebraic-number-theory` (Number theory) — concepts=5, widgets=6 (slug=6), quiz=30 (v1=15, hard=15, expert=0)
- `p-adic-numbers` (Number theory) — concepts=7, widgets=10 (slug=10), quiz=36 (v1=21, hard=15, expert=0)
- `adeles-and-ideles` (Number theory) — concepts=5, widgets=5 (slug=5), quiz=30 (v1=15, hard=15, expert=0)
- `frobenius-and-reciprocity` (Number theory) — concepts=5, widgets=9 (slug=9), quiz=30 (v1=15, hard=15, expert=0)
- `class-field-theory` (Number theory) — concepts=6, widgets=8 (slug=8), quiz=36 (v1=18, hard=18, expert=0)
- `heights-arithmetic-geometry` (Number theory) — concepts=10, widgets=10 (slug=10), quiz=30 (v1=30, hard=0, expert=0)
- `analytic-number-theory` (Number theory) — concepts=10, widgets=10 (slug=10), quiz=30 (v1=30, hard=0, expert=0)
- `upper-half-plane-hyperbolic` (Modular forms & L-functions) — concepts=5, widgets=7 (slug=7), quiz=30 (v1=15, hard=15, expert=0)
- `modular-forms` (Modular forms & L-functions) — concepts=6, widgets=8 (slug=8), quiz=33 (v1=18, hard=15, expert=0)
- `theta-functions` (Modular forms & L-functions) — concepts=5, widgets=8 (slug=8), quiz=30 (v1=15, hard=15, expert=0)
- `partitions-generating-functions` (Combinatorics & graph theory) — concepts=5, widgets=7 (slug=7), quiz=30 (v1=15, hard=15, expert=0)
- `hecke-operators` (Modular forms & L-functions) — concepts=5, widgets=8 (slug=8), quiz=30 (v1=15, hard=15, expert=0)
- `dirichlet-series-euler-products` (Modular forms & L-functions) — concepts=5, widgets=10 (slug=10), quiz=30 (v1=15, hard=15, expert=0)
- `analytic-continuation` (Modular forms & L-functions) — concepts=5, widgets=6 (slug=6), quiz=30 (v1=15, hard=15, expert=0)
- `zeta-values` (Modular forms & L-functions) — concepts=7, widgets=5 (slug=5), quiz=36 (v1=21, hard=15, expert=0)
- `L-functions` (Modular forms & L-functions) — concepts=5, widgets=9 (slug=9), quiz=30 (v1=15, hard=15, expert=0)
- `galois-representations` (Number theory) — concepts=5, widgets=9 (slug=9), quiz=30 (v1=15, hard=15, expert=0)
- `moonshine` (Modular forms & L-functions) — concepts=8, widgets=8 (slug=8), quiz=39 (v1=24, hard=15, expert=0)
- `automorphic-forms-adelic` (Modular forms & L-functions) — concepts=9, widgets=9 (slug=9), quiz=27 (v1=27, hard=0, expert=0)
- `modular-curves` (Modular forms & L-functions) — concepts=9, widgets=9 (slug=9), quiz=27 (v1=27, hard=0, expert=0)
- `projective-plane` (Algebraic geometry) — concepts=5, widgets=7 (slug=7), quiz=30 (v1=15, hard=15, expert=0)
- `bezout` (Algebraic geometry) — concepts=5, widgets=7 (slug=7), quiz=30 (v1=15, hard=15, expert=0)
- `schemes` (Algebraic geometry) — concepts=10, widgets=8 (slug=8), quiz=60 (v1=30, hard=30, expert=0)
- `sheaves` (Algebraic geometry) — concepts=7, widgets=7 (slug=7), quiz=42 (v1=21, hard=21, expert=0)
- `morphisms-fiber-products` (Algebraic geometry) — concepts=5, widgets=7 (slug=7), quiz=30 (v1=15, hard=15, expert=0)
- `functor-of-points` (Algebraic geometry) — concepts=5, widgets=7 (slug=7), quiz=30 (v1=15, hard=15, expert=0)
- `elliptic-curves` (Algebraic geometry) — concepts=5, widgets=8 (slug=8), quiz=30 (v1=15, hard=15, expert=0)
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
- `graph-theory-fundamentals` (Combinatorics & graph theory) — concepts=6, widgets=6 (slug=6), quiz=18 (v1=18, hard=0, expert=0)
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
- `gauge-theory` (Mathematical physics) — concepts=7, widgets=7 (slug=7), quiz=21 (v1=21, hard=0, expert=0)
- `string-theory` (Mathematical physics) — concepts=7, widgets=7 (slug=7), quiz=21 (v1=21, hard=0, expert=0)

## Coverage gaps

### Concepts missing a widget in their owning section (top 20)

- `structure-theorem-decomposition` (topological-data-analysis)
- `scv-pseudoconvex` (several-complex-variables)
- `algebraic-correspondences` (motives)
- `tate-twist` (motives)
- `tannakian-categories` (motives)
- `motivic-galois-group` (motives)
- `realization-functors` (motives)
- `why-hodge` (hodge-theory)
- `pure-hodge-structure` (hodge-theory)
- `hodge-as-realization` (hodge-theory)
- `global-langlands-gl-n` (langlands-program)
- `cft-as-langlands` (langlands-program)
- `gl2-modularity` (langlands-program)
- `functoriality-langlands-group` (langlands-program)
- `universal-reciprocity` (langlands-program)
- `cd-characteristic-preview` (cohomology-and-duality)
- `tv-mirror` (toric-varieties)
- `aca-overview` (advanced-complex-analysis)
- `aca-picard-little` (advanced-complex-analysis)
- `aca-picard-great` (advanced-complex-analysis)

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
