# Coverage + type stats — widgets & quizzes

## Corpus totals

- Topics: **131**, concepts: **921**
- Widgets: **926** (registry-driven: 926, inline: 0)
- Quizzes: **3954** (v1: 2718, hard: 1223, expert: 13)
- Quiz types: mcq: 2661, numeric: 1041, multi-select: 101, matching: 50, ordering: 29, complex: 29, spot-the-error: 22, proof-completion: 17, construction: 2, guess-my-rule: 2
- Concepts lacking a widget in their section: **158**
- Concepts lacking a hard-tier quiz: **483**

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
| `aca-bergman-kernel-disk` | aca-bergman-kernel-disk | click | 2d | 1 | advanced-complex-analysis |
| `aca-bloch-disk` | aca-bloch-disk | slider | 2d | 1 | advanced-complex-analysis |
| `aca-hartogs-shell` | aca-hartogs-shell | slider | 2d | 1 | advanced-complex-analysis |
| `aca-nevanlinna-characteristic` | aca-nevanlinna-characteristic | slider | 2d | 1 | advanced-complex-analysis |
| `aca-quasiconformal-warp` | aca-quasiconformal-warp | slider | 2d | 1 | advanced-complex-analysis |
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
| `branching-proof-scrubber` | branching-proof-scrubber | branching-timeline | 2d | 1 | galois |
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
| `crypto-diffie-hellman` | crypto-diffie-hellman | slider | 2d | 1 | mathematics-and-cryptography |
| `crypto-ecc-points` | crypto-ecc-points | slider | 2d | 1 | mathematics-and-cryptography |
| `crypto-lwe-samples` | crypto-lwe-samples | slider | 2d | 1 | mathematics-and-cryptography |
| `crypto-rsa-toy` | crypto-rsa-toy | slider | 2d | 1 | mathematics-and-cryptography |
| `crypto-schnorr-protocol` | crypto-schnorr-protocol | button | 2d | 1 | mathematics-and-cryptography |
| `crypto-totient-units` | crypto-totient-units | slider | 2d | 1 | mathematics-and-cryptography |
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
| `gcb-central-extension-browser` | gcb-central-extension-browser | click | 2d | 1 | galois-cohomology-and-brauer |
| `gcb-cocycle-tester` | gcb-cocycle-tester | click | 2d | 1 | galois-cohomology-and-brauer |
| `gcb-cyclic-algebra-tester` | gcb-cyclic-algebra-tester | click | 2d | 1 | galois-cohomology-and-brauer |
| `gcb-hasse-counterexample-gallery` | gcb-hasse-counterexample-gallery | click | 2d | 1 | galois-cohomology-and-brauer |
| `gcb-mu2-torsor-visualizer` | gcb-mu2-torsor-visualizer | click | 2d | 1 | galois-cohomology-and-brauer |
| `gcb-tate-pairing-table` | gcb-tate-pairing-table | click | 2d | 1 | galois-cohomology-and-brauer |
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
| `julia-playground` | julia-playground | slider | 2d | 1 | dynamical-systems |
| `k-theory-bott-periodicity` | k-theory-bott-periodicity | slider | 2d | 1 | k-theory |
| `k-theory-chern-character` | k-theory-chern-character | slider | 2d | 1 | k-theory |
| `k-theory-grothendieck-builder` | k-theory-grothendieck-builder | click | 2d | 1 | k-theory |
| `k-theory-index-theorem` | k-theory-index-theorem | click | 2d | 1 | k-theory |
| `k-theory-low-k-groups` | k-theory-low-k-groups | click | 2d | 1 | k-theory |
| `k-theory-ses-relations` | k-theory-ses-relations | click | 2d | 1 | k-theory |
| `knot-polynomials-alexander` | knot-polynomials-alexander | click | 2d | 1 | knot-polynomials |
| `knot-polynomials-bracket` | knot-polynomials-bracket | step | 2d | 1 | knot-polynomials |
| `knot-polynomials-gallery` | knot-polynomials-gallery | click | 2d | 1 | knot-polynomials |
| `knot-polynomials-homfly` | knot-polynomials-homfly | step | 2d | 1 | knot-polynomials |
| `knot-polynomials-reidemeister` | knot-polynomials-reidemeister | click | 2d | 1 | knot-polynomials |
| `knot-polynomials-rmatrix` | knot-polynomials-rmatrix | slider | 2d | 1 | knot-polynomials |
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
| `matroid-axiom-checker` | matroid-axiom-checker | click | 2d | 1 | matroid-theory |
| `matroid-bases-rank-explorer` | matroid-bases-rank-explorer | slider | 2d | 1 | matroid-theory |
| `matroid-dual-explorer` | matroid-dual-explorer | click | 2d | 1 | matroid-theory |
| `matroid-flats-stepper` | matroid-flats-stepper | step | 2d | 1 | matroid-theory |
| `matroid-graph-forests` | matroid-graph-forests | click | 2d | 1 | matroid-theory |
| `matroid-greedy-vs-nonmatroid` | matroid-greedy-vs-nonmatroid | slider | 2d | 1 | matroid-theory |
| `matroid-tutte-polynomial` | matroid-tutte-polynomial | slider | 2d | 1 | matroid-theory |
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
| `pde-classifier` | pde-classifier | slider | 2d | 1 | partial-differential-equations |
| `pde-heat-kernel` | pde-heat-kernel | slider | 2d | 1 | partial-differential-equations |
| `pde-poisson-disk` | pde-poisson-disk | drag | 2d | 1 | partial-differential-equations |
| `pde-sobolev-embedding` | pde-sobolev-embedding | slider | 2d | 1 | partial-differential-equations |
| `pde-wave-dalembert` | pde-wave-dalembert | slider | 2d | 1 | partial-differential-equations |
| `pde-weak-test` | pde-weak-test | slider | 2d | 1 | partial-differential-equations |
| `probabilistic-method-alterations` | probabilistic-method-alterations | click | 2d | 1 | probabilistic-method |
| `probabilistic-method-concentration` | probabilistic-method-concentration | slider | 2d | 1 | probabilistic-method |
| `probabilistic-method-existence` | probabilistic-method-existence | click | 2d | 1 | probabilistic-method |
| `probabilistic-method-linearity` | probabilistic-method-linearity | slider | 2d | 1 | probabilistic-method |
| `probabilistic-method-lll` | probabilistic-method-lll | slider | 2d | 1 | probabilistic-method |
| `probabilistic-method-ramsey` | probabilistic-method-ramsey | slider | 2d | 1 | probabilistic-method |
| `probabilistic-method-threshold` | probabilistic-method-threshold | slider | 2d | 1 | probabilistic-method |
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
| `recurrence-plotter` | recurrence-plotter | slider | 2d | 1 | dynamical-systems |
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
| `symplectic-cotangent-lagrangians` | symplectic-cotangent-lagrangians | click | 2d | 1 | symplectic-manifolds |
| `symplectic-darboux-moser` | symplectic-darboux-moser | slider | 2d | 1 | symplectic-manifolds |
| `symplectic-dirac-ladder` | symplectic-dirac-ladder | click | 2d | 1 | symplectic-manifolds |
| `symplectic-floer-intersections` | symplectic-floer-intersections | drag | 2d | 1 | symplectic-manifolds |
| `symplectic-form-pairing` | symplectic-form-pairing | drag | 2d | 1 | symplectic-manifolds |
| `symplectic-harmonic-portrait` | symplectic-harmonic-portrait | slider | 2d | 1 | symplectic-manifolds |
| `three-body-halo-orbits` | three-body-halo-orbits | click | 2d | 1 | three-body-problem |
| `three-body-horseshoe` | three-body-horseshoe | click | 2d | 1 | three-body-problem |
| `three-body-kam-tori` | three-body-kam-tori | slider | 2d | 1 | three-body-problem |
| `three-body-lagrange-points` | three-body-lagrange-points | slider | 2d | 1 | three-body-problem |
| `three-body-nbody-simulator` | three-body-nbody-simulator | click | 2d | 1 | three-body-problem |
| `three-body-special-solutions` | three-body-special-solutions | click | 2d | 1 | three-body-problem |
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

- Topics: **12**, concepts: **106**
- Widgets: **105** (registry-driven: 105, inline: 0)
  - by family: button-stepper: 38, clickable-diagram: 21, parametric-plot: 9, proof-scrubber: 2, quantum-groups-hopf-axioms-inspector: 1, quantum-groups-qsl2-deformation-slider: 1, quantum-groups-yang-baxter-reidemeister: 1, quantum-groups-crystal-tensor-product: 1, quantum-groups-reshetikhin-turaev-knots: 1, quantum-groups-applications-map: 1, quaternions-multiplication-tester: 1, quaternions-rotation-visualizer: 1, quaternions-cayley-dickson-ladder: 1, quaternions-fano-plane-oracle: 1, quaternions-frobenius-case-tree: 1, quaternions-hurwitz-tower-bar: 1, naturality-square: 1, declarative-host: 1, clickable-graph: 1, diagram-editor: 1, group-cohomology-coboundary-calculator: 1, group-cohomology-fixed-points: 1, group-cohomology-hilbert-90: 1, group-cohomology-c2-extensions: 1, group-cohomology-tate-periodic-table: 1, group-cohomology-lhs-spectral: 1, group-cohomology-brauer-cheatsheet: 1, lie-algebras-bracket-table: 1, lie-algebras-adjoint-vis: 1, lie-algebras-derived-series: 1, lie-algebras-root-vis: 1, lie-algebras-weight-diagram: 1, lie-algebras-dynkin-gallery: 1, gcb-cocycle-tester: 1, gcb-mu2-torsor-visualizer: 1, gcb-central-extension-browser: 1, gcb-cyclic-algebra-tester: 1, gcb-tate-pairing-table: 1, gcb-hasse-counterexample-gallery: 1
  - by dimension: 2d: 104, 3d: 1
  - by gesture: click: 81, select: 9, inspect: 3, slider: 3, toggle: 2, scrub: 2, input: 1, slider+click: 1, interactive: 1, drag-and-toggle: 1, step: 1
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

- Topics: **16**, concepts: **166**
- Widgets: **112** (registry-driven: 112, inline: 0)
  - by family: button-stepper: 37, clickable-diagram: 31, aca-bloch-disk: 1, aca-nevanlinna-characteristic: 1, aca-bergman-kernel-disk: 1, aca-quasiconformal-warp: 1, aca-hartogs-shell: 1, numerical-fp-cancellation: 1, numerical-newton-iteration: 1, numerical-quadrature-error: 1, numerical-hilbert-conditioning: 1, numerical-ftcs-stability: 1, numerical-fem-hat-basis: 1, variational-fdiff: 1, variational-brachistochrone: 1, variational-direct-method: 1, variational-mountain-pass: 1, variational-isoperimetric: 1, variational-sphere-geodesic: 1, constraint-bifurcation-explorer: 1, recurrence-plotter: 1, julia-playground: 1, sobolev-pairing: 1, sobolev-weak-derivative: 1, sobolev-fractional-power: 1, sobolev-embedding-exponent: 1, sobolev-trace: 1, sobolev-newtonian-potential: 1, sobolev-variational: 1, harmonic-partial-sum: 1, harmonic-tent-transform: 1, harmonic-convolution: 1, harmonic-uncertainty: 1, harmonic-heat-evolution: 1, pde-classifier: 1, pde-heat-kernel: 1, pde-wave-dalembert: 1, pde-poisson-disk: 1, pde-weak-test: 1, pde-sobolev-embedding: 1, harmonic-functions-laplacian-heatmap: 1, harmonic-functions-mvp-circle: 1, harmonic-functions-maximum-locator: 1, harmonic-functions-poisson-extension: 1, harmonic-functions-harnack-corridor: 1, harmonic-functions-perron-supremum: 1
  - by dimension: 2d: 111, 3d: 1
  - by gesture: click: 71, slider: 33, drag: 5, select: 2, step: 1
- Quizzes: **642** (v1: 457, hard: 185, expert: 0)
  - by type: mcq: 417, numeric: 148, multi-select: 19, matching: 16, complex: 14, ordering: 13, proof-completion: 9, spot-the-error: 4, construction: 1, guess-my-rule: 1

### Probability & statistics

- Topics: **8**, concepts: **55**
- Widgets: **51** (registry-driven: 51, inline: 0)
  - by family: button-stepper: 10, ms-bias-variance: 1, ms-likelihood-curve: 1, ms-crlb-envelope: 1, ms-neyman-pearson: 1, ms-beta-posterior: 1, ms-wilks-theorem: 1, hdg-sphere-concentration-band: 1, hdg-dvoretzky-section: 1, hdg-jl-distortion-histogram: 1, hdg-talagrand-deviation: 1, hdg-isoperimetry-tail: 1, hdg-marchenko-pastur: 1, stoch-proc-filtration-stopping: 1, stoch-proc-random-walk-martingale: 1, stoch-proc-gamblers-ruin: 1, stoch-proc-doob-decomposition: 1, stoch-proc-convergence-regimes: 1, stoch-proc-brownian-quadratic-variation: 1, stochastic-calc-ito-riemann-sums: 1, stochastic-calc-ito-formula-bsq: 1, stochastic-calc-geometric-brownian-motion: 1, stochastic-calc-girsanov-density: 1, stochastic-calc-feynman-kac-heat: 1, stochastic-calc-binomial-black-scholes: 1, random-walks-graph-step: 1, random-walks-matrix-power: 1, random-walks-tv-distance: 1, random-walks-eigenvalue-inspector: 1, random-walks-cycle-coupling: 1, random-walks-metropolis-hastings: 1, information-entropy: 1, information-mutual-info-venn: 1, information-kl-simplex: 1, information-huffman-builder: 1, information-bsc-capacity: 1, information-rate-distortion: 1, large-dev-cramer-tilt: 1, large-dev-rate-gallery: 1, large-dev-sanov-kl: 1, large-dev-gartner-ar1: 1, large-dev-schilder-paths: 1
  - by dimension: 2d: 51
  - by gesture: slider: 28, click: 15, step: 5, button: 2, toggle: 1
- Quizzes: **202** (v1: 165, hard: 24, expert: 13)
  - by type: mcq: 140, numeric: 51, matching: 3, multi-select: 2, proof-completion: 2, construction: 1, complex: 1, ordering: 1, spot-the-error: 1

### Geometry & topology

- Topics: **16**, concepts: **104**
- Widgets: **104** (registry-driven: 104, inline: 0)
  - by family: button-stepper: 34, surface-viewer: 6, clickable-diagram: 4, clickable-graph: 2, svg-illustration: 2, mostow-rigidity-dial: 1, mostow-h3-fundamental-domain: 1, mostow-boundary-extension: 1, mostow-boundary-orbit: 1, mostow-rank-tower: 1, mostow-volume-spectrum: 1, symplectic-form-pairing: 1, symplectic-darboux-moser: 1, symplectic-harmonic-portrait: 1, symplectic-dirac-ladder: 1, symplectic-cotangent-lagrangians: 1, symplectic-floer-intersections: 1, knot-polynomials-gallery: 1, knot-polynomials-reidemeister: 1, knot-polynomials-alexander: 1, knot-polynomials-bracket: 1, knot-polynomials-homfly: 1, knot-polynomials-rmatrix: 1, ricci-einstein-flows: 1, ricci-deturck-trick: 1, ricci-blowup-rates: 1, ricci-soliton-zoo: 1, ricci-neckpinch-surgery: 1, ricci-extinction-timeline: 1, k-theory-grothendieck-builder: 1, k-theory-ses-relations: 1, k-theory-bott-periodicity: 1, k-theory-chern-character: 1, k-theory-low-k-groups: 1, k-theory-index-theorem: 1, atiyah-singer-index-family: 1, atiyah-singer-symbol: 1, atiyah-singer-ch-td: 1, atiyah-singer-cases: 1, atiyah-singer-dirac-sphere: 1, atiyah-singer-anomaly: 1, counterexample-explorer: 1, proof-scrubber: 1, lattice-visualizer: 1, characteristic-classes-mobius-vs-cylinder: 1, characteristic-classes-w1-surfaces: 1, characteristic-classes-c1-clutching: 1, characteristic-classes-pontryagin-formulas: 1, characteristic-classes-poincare-hopf: 1, characteristic-classes-gauss-bonnet: 1, characteristic-classes-classifying-map: 1, characteristic-classes-signature-l-genus: 1, characteristic-classes-cpn-localisation: 1, morse-torus-height: 1, morse-handle-decomp: 1, morse-cw-cells: 1, morse-betti-counts: 1, morse-gradient-flow: 1, morse-sphere-vs-rp2: 1, morse-smale-saddle: 1, morse-cerf-birth-death: 1
  - by dimension: 2d: 98, 3d: 6
  - by gesture: click: 61, slider: 20, drag: 8, button-stepper: 6, step: 3, pick: 2, static: 2, select: 1, timeline: 1
- Quizzes: **454** (v1: 312, hard: 142, expert: 0)
  - by type: mcq: 313, numeric: 123, complex: 7, multi-select: 5, matching: 4, ordering: 1, proof-completion: 1

### Number theory

- Topics: **14**, concepts: **99**
- Widgets: **110** (registry-driven: 110, inline: 0)
  - by family: button-stepper: 66, clickable-diagram: 4, modular-arithmetic-clock: 4, input-form: 4, inline-code-cell: 4, declarative-host: 2, parametric-plot: 2, crypto-totient-units: 1, crypto-rsa-toy: 1, crypto-diffie-hellman: 1, crypto-ecc-points: 1, crypto-lwe-samples: 1, crypto-schnorr-protocol: 1, branching-proof-scrubber: 1, clickable-graph: 1, svg-illustration: 1, heights-naive-calculator: 1, heights-northcott-enumerator: 1, heights-weil-pullback: 1, heights-tate-averaging: 1, heights-mahler-measure: 1, heights-genus-growth: 1, heights-arakelov-decomposition: 1, counterexample-explorer: 1, ant-pnt-comparison: 1, ant-explicit-formula: 1, ant-zero-free-region: 1, ant-dirichlet-residue-wheel: 1, ant-sieve-truncation: 1, ant-bombieri-vinogradov: 1, proof-scrubber: 1
  - by dimension: 2d: 110
  - by gesture: click: 74, slider: 21, input: 4, edit: 4, interactive: 2, button: 1, branching-timeline: 1, read: 1, select: 1, timeline: 1
- Quizzes: **475** (v1: 292, hard: 183, expert: 0)
  - by type: mcq: 321, numeric: 146, complex: 3, matching: 3, ordering: 1, guess-my-rule: 1

### Modular forms & L-functions

- Topics: **16**, concepts: **95**
- Widgets: **127** (registry-driven: 127, inline: 0)
  - by family: button-stepper: 92, parametric-plot: 5, svg-illustration: 4, lattice-visualizer: 2, voa-mode-bookkeeping: 1, voa-axiom-map: 1, voa-virasoro-bracket: 1, voa-character-coeffs: 1, voa-mckay-thompson: 1, voa-construction-zoo: 1, automorphic-restricted-product: 1, automorphic-strong-approximation: 1, automorphic-three-conditions: 1, automorphic-dictionary: 1, automorphic-satake-parameters: 1, automorphic-conductor-ladder: 1, automorphic-local-factor-builder: 1, automorphic-eisenstein-residue: 1, automorphic-functoriality-transfers: 1, modular-curves-fundamental-domain: 1, modular-curves-lattice-cyclic-subgroup: 1, modular-curves-hecke-summands: 1, modular-curves-eichler-shimura: 1, modular-curves-genus-growth: 1, modular-curves-cusps-and-wn: 1, modular-curves-atkin-lehner-newforms: 1, modular-curves-heegner-hypothesis: 1, modular-curves-mazur-torsion: 1
  - by dimension: 2d: 127
  - by gesture: click: 100, slider: 13, step: 8, static: 4, select: 2
- Quizzes: **480** (v1: 285, hard: 195, expert: 0)
  - by type: mcq: 315, numeric: 158, multi-select: 4, matching: 2, ordering: 1

### Algebraic geometry

- Topics: **22**, concepts: **127**
- Widgets: **144** (registry-driven: 144, inline: 0)
  - by family: button-stepper: 61, clickable-diagram: 23, proof-scrubber: 7, clickable-graph: 6, declarative-host: 6, parametric-plot: 4, modular-arithmetic-clock: 2, svg-illustration: 2, calabi-yau-canonical-degree: 1, calabi-yau-hodge-diamond: 1, calabi-yau-hypersurface-zoo: 1, calabi-yau-periods: 1, calabi-yau-mirror-swap: 1, calabi-yau-syz-fibration: 1, mirror-hodge-diamond: 1, mirror-quintic-counts: 1, mirror-stable-map: 1, mirror-quintic-periods: 1, mirror-hms-pairing: 1, mirror-syz-fibration: 1, resolution-cusp-node-visualizer: 1, resolution-cuspidal-blowup: 1, resolution-tower-of-blowups: 1, resolution-curve-normalization: 1, resolution-ade-dynkin: 1, lattice-visualizer: 1, algebraic-curves-riemann-hurwitz-cover: 1, algebraic-curves-jacobian-lattice: 1, algebraic-curves-riemann-roch-scrubber: 1, algebraic-curves-canonical-embedding-scrubber: 1, algebraic-curves-hyperelliptic-cover: 1, algebraic-curves-moduli-boundary: 1, algebraic-de-rham-kahler-scrubber: 1, algebraic-de-rham-complex-scrubber: 1, algebraic-de-rham-betti-comparison-scrubber: 1, algebraic-de-rham-hodge-filtration-scrubber: 1, algebraic-de-rham-hodge-diamond-clickgraph: 1, algebraic-de-rham-hodge-pn-explorer: 1, algebraic-de-rham-curve-clickable: 1, algebraic-de-rham-hodge-sandbox: 1, counterexample-explorer: 1
  - by dimension: 2d: 144
  - by gesture: click: 100, interact: 15, slider: 9, scrub: 7, inspect: 5, select: 4, drag: 2, read: 1, slide: 1
- Quizzes: **626** (v1: 381, hard: 245, expert: 0)
  - by type: mcq: 396, numeric: 187, multi-select: 17, matching: 11, spot-the-error: 7, ordering: 4, complex: 3, proof-completion: 1

### Combinatorics & graph theory

- Topics: **8**, concepts: **51**
- Widgets: **51** (registry-driven: 51, inline: 0)
  - by family: parametric-plot: 4, designs-bibd-calculator: 1, designs-fisher-incidence: 1, designs-fano-plane: 1, designs-mols-construction: 1, designs-hamming-fano: 1, designs-round-robin: 1, expanders-vertex-expansion: 1, expanders-zigzag-product: 1, spectral-graph-theory-adjacency: 1, spectral-graph-theory-components: 1, spectral-graph-theory-fiedler: 1, spectral-graph-theory-cheeger: 1, spectral-graph-theory-random-walk: 1, spectral-graph-theory-bipartite: 1, spectral-graph-theory-clustering: 1, matroid-axiom-checker: 1, matroid-bases-rank-explorer: 1, matroid-graph-forests: 1, matroid-flats-stepper: 1, matroid-dual-explorer: 1, matroid-greedy-vs-nonmatroid: 1, matroid-tutte-polynomial: 1, probabilistic-method-existence: 1, probabilistic-method-ramsey: 1, probabilistic-method-linearity: 1, probabilistic-method-alterations: 1, probabilistic-method-lll: 1, probabilistic-method-threshold: 1, probabilistic-method-concentration: 1, extremal-combinatorics-turan: 1, extremal-combinatorics-kst: 1, extremal-combinatorics-erdos-stone: 1, extremal-combinatorics-ramsey: 1, extremal-combinatorics-sperner: 1, extremal-combinatorics-removal: 1, simplicial-complexes-combinatorial-faces: 1, simplicial-complexes-combinatorial-fh: 1, simplicial-complexes-combinatorial-nerve: 1, simplicial-complexes-combinatorial-shell: 1, simplicial-complexes-combinatorial-sr: 1, simplicial-complexes-combinatorial-persistence: 1, enumerative-combinatorics-pascal: 1, enumerative-combinatorics-venn: 1, enumerative-combinatorics-genfun: 1, enumerative-combinatorics-perm: 1, enumerative-combinatorics-young: 1, enumerative-combinatorics-bijection: 1
  - by dimension: 2d: 51
  - by gesture: click: 24, slider: 19, step: 8
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

- `advanced-complex-analysis` (Analysis) — concepts=13, widgets=5 (slug=5), quiz=39 (v1=39, hard=0, expert=0)
- `mathematical-statistics` (Probability & statistics) — concepts=6, widgets=6 (slug=6), quiz=18 (v1=18, hard=0, expert=0)
- `numerical-analysis` (Analysis) — concepts=6, widgets=6 (slug=6), quiz=18 (v1=18, hard=0, expert=0)
- `computational-number-theory` (Number theory) — concepts=6, widgets=0 (slug=0), quiz=18 (v1=18, hard=0, expert=0)
- `variational-methods` (Analysis) — concepts=6, widgets=6 (slug=6), quiz=18 (v1=18, hard=0, expert=0)
- `fixed-point-theorems` (Analysis) — concepts=8, widgets=0 (slug=0), quiz=24 (v1=24, hard=0, expert=0)
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
- `geometric-and-combinatorial-group-theory` (Algebra & homological) — concepts=6, widgets=0 (slug=0), quiz=18 (v1=18, hard=0, expert=0)
- `wavelets` (Analysis) — concepts=8, widgets=0 (slug=0), quiz=24 (v1=24, hard=0, expert=0)
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
- `algebra` (Algebra & homological) — concepts=12, widgets=12 (slug=12), quiz=73 (v1=36, hard=37, expert=0)
- `category-theory` (Algebra & homological) — concepts=12, widgets=17 (slug=17), quiz=72 (v1=36, hard=36, expert=0)
- `representation-theory` (Algebra & homological) — concepts=13, widgets=13 (slug=13), quiz=74 (v1=39, hard=35, expert=0)
- `commutative-algebra` (Algebra & homological) — concepts=13, widgets=13 (slug=13), quiz=75 (v1=40, hard=35, expert=0)
- `homological` (Algebra & homological) — concepts=12, widgets=12 (slug=12), quiz=73 (v1=36, hard=37, expert=0)
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
- `real-analysis` (Analysis) — concepts=14, widgets=15 (slug=15), quiz=71 (v1=42, hard=29, expert=0)
- `measure-theory` (Analysis) — concepts=12, widgets=12 (slug=12), quiz=72 (v1=36, hard=36, expert=0)
- `complex-analysis` (Analysis) — concepts=26, widgets=7 (slug=7), quiz=49 (v1=37, hard=12, expert=0)
- `functional-analysis` (Analysis) — concepts=12, widgets=11 (slug=11), quiz=72 (v1=36, hard=36, expert=0)
- `operator-algebras` (Analysis) — concepts=12, widgets=12 (slug=12), quiz=72 (v1=36, hard=36, expert=0)
- `dynamical-systems` (Analysis) — concepts=13, widgets=14 (slug=14), quiz=75 (v1=39, hard=36, expert=0)
- `sobolev-spaces-distributions` (Analysis) — concepts=7, widgets=7 (slug=7), quiz=21 (v1=21, hard=0, expert=0)
- `harmonic-analysis-fourier` (Analysis) — concepts=8, widgets=5 (slug=5), quiz=24 (v1=24, hard=0, expert=0)
- `partial-differential-equations` (Analysis) — concepts=6, widgets=6 (slug=6), quiz=18 (v1=18, hard=0, expert=0)
- `harmonic-functions` (Analysis) — concepts=6, widgets=6 (slug=6), quiz=18 (v1=18, hard=0, expert=0)
- `spectral-theory` (Analysis) — concepts=9, widgets=0 (slug=0), quiz=27 (v1=27, hard=0, expert=0)
- `probability-theory` (Probability & statistics) — concepts=12, widgets=10 (slug=10), quiz=73 (v1=36, hard=24, expert=13)
- `stochastic-processes-and-martingales` (Probability & statistics) — concepts=6, widgets=6 (slug=6), quiz=18 (v1=18, hard=0, expert=0)
- `stochastic-calculus` (Probability & statistics) — concepts=6, widgets=6 (slug=6), quiz=18 (v1=18, hard=0, expert=0)
- `random-walks-and-mixing` (Probability & statistics) — concepts=6, widgets=6 (slug=6), quiz=18 (v1=18, hard=0, expert=0)
- `information-theory` (Probability & statistics) — concepts=8, widgets=6 (slug=6), quiz=24 (v1=24, hard=0, expert=0)
- `large-deviations` (Probability & statistics) — concepts=5, widgets=5 (slug=5), quiz=15 (v1=15, hard=0, expert=0)
- `point-set-topology` (Geometry & topology) — concepts=6, widgets=7 (slug=7), quiz=36 (v1=18, hard=18, expert=0)
- `algebraic-topology` (Geometry & topology) — concepts=6, widgets=6 (slug=6), quiz=32 (v1=18, hard=14, expert=0)
- `smooth-manifolds` (Geometry & topology) — concepts=10, widgets=9 (slug=9), quiz=59 (v1=30, hard=29, expert=0)
- `differential-forms` (Geometry & topology) — concepts=5, widgets=0 (slug=0), quiz=30 (v1=15, hard=15, expert=0)
- `differential-geometry` (Geometry & topology) — concepts=5, widgets=9 (slug=9), quiz=30 (v1=15, hard=15, expert=0)
- `riemannian-geometry` (Geometry & topology) — concepts=5, widgets=7 (slug=7), quiz=30 (v1=15, hard=15, expert=0)
- `lie-groups` (Geometry & topology) — concepts=7, widgets=6 (slug=6), quiz=42 (v1=21, hard=21, expert=0)
- `riemann-surfaces` (Geometry & topology) — concepts=5, widgets=7 (slug=7), quiz=30 (v1=15, hard=15, expert=0)
- `characteristic-classes` (Geometry & topology) — concepts=9, widgets=9 (slug=9), quiz=27 (v1=27, hard=0, expert=0)
- `morse-theory` (Geometry & topology) — concepts=8, widgets=8 (slug=8), quiz=24 (v1=24, hard=0, expert=0)
- `galois` (Number theory) — concepts=8, widgets=6 (slug=6), quiz=33 (v1=18, hard=15, expert=0)
- `quadratic-reciprocity` (Number theory) — concepts=6, widgets=7 (slug=7), quiz=33 (v1=18, hard=15, expert=0)
- `quadratic-forms-genus-theory` (Number theory) — concepts=5, widgets=6 (slug=6), quiz=30 (v1=15, hard=15, expert=0)
- `additive-number-theory` (Number theory) — concepts=15, widgets=20 (slug=20), quiz=91 (v1=46, hard=45, expert=0)
- `algebraic-number-theory` (Number theory) — concepts=5, widgets=6 (slug=6), quiz=30 (v1=15, hard=15, expert=0)
- `p-adic-numbers` (Number theory) — concepts=7, widgets=10 (slug=10), quiz=36 (v1=21, hard=15, expert=0)
- `adeles-and-ideles` (Number theory) — concepts=5, widgets=5 (slug=5), quiz=30 (v1=15, hard=15, expert=0)
- `frobenius-and-reciprocity` (Number theory) — concepts=5, widgets=7 (slug=7), quiz=30 (v1=15, hard=15, expert=0)
- `class-field-theory` (Number theory) — concepts=6, widgets=8 (slug=8), quiz=36 (v1=18, hard=18, expert=0)
- `heights-arithmetic-geometry` (Number theory) — concepts=10, widgets=10 (slug=10), quiz=30 (v1=30, hard=0, expert=0)
- `analytic-number-theory` (Number theory) — concepts=10, widgets=10 (slug=10), quiz=30 (v1=30, hard=0, expert=0)
- `upper-half-plane-hyperbolic` (Modular forms & L-functions) — concepts=5, widgets=7 (slug=7), quiz=30 (v1=15, hard=15, expert=0)
- `modular-forms` (Modular forms & L-functions) — concepts=6, widgets=8 (slug=8), quiz=33 (v1=18, hard=15, expert=0)
- `theta-functions` (Modular forms & L-functions) — concepts=5, widgets=8 (slug=8), quiz=30 (v1=15, hard=15, expert=0)
- `partitions-generating-functions` (Modular forms & L-functions) — concepts=5, widgets=7 (slug=7), quiz=30 (v1=15, hard=15, expert=0)
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

- `aca-overview` (advanced-complex-analysis)
- `aca-picard-little` (advanced-complex-analysis)
- `aca-picard-great` (advanced-complex-analysis)
- `aca-weierstrass-factorization` (advanced-complex-analysis)
- `aca-mittag-leffler` (advanced-complex-analysis)
- `aca-phragmen-lindelof` (advanced-complex-analysis)
- `aca-hadamard-three-circles` (advanced-complex-analysis)
- `aca-hardy-spaces` (advanced-complex-analysis)
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

### Concepts missing a hard-tier quiz (top 20)

- `aca-overview` (advanced-complex-analysis)
- `aca-picard-little` (advanced-complex-analysis)
- `aca-picard-great` (advanced-complex-analysis)
- `aca-weierstrass-factorization` (advanced-complex-analysis)
- `aca-mittag-leffler` (advanced-complex-analysis)
- `aca-phragmen-lindelof` (advanced-complex-analysis)
- `aca-hadamard-three-circles` (advanced-complex-analysis)
- `aca-hardy-spaces` (advanced-complex-analysis)
- `aca-bloch-theorem` (advanced-complex-analysis)
- `aca-nevanlinna-theory` (advanced-complex-analysis)
- `aca-bergman-kernel` (advanced-complex-analysis)
- `aca-quasiconformal-beltrami` (advanced-complex-analysis)
- `aca-several-complex-variables` (advanced-complex-analysis)
- `ms-estimators` (mathematical-statistics)
- `ms-mle` (mathematical-statistics)
- `ms-cramer-rao` (mathematical-statistics)
- `ms-hypothesis-testing` (mathematical-statistics)
- `ms-bayesian` (mathematical-statistics)
- `ms-asymptotics` (mathematical-statistics)
- `na-floating-point` (numerical-analysis)
