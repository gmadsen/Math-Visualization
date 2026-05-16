# Tier 3 widget audit — FULL SUMMARY (2026-05)

Comprehensive tier-3 functional verification: every topic with widgets was loaded in chrome, every triggerable control on every widget was exercised, the before/after state of the widget DOM was diffed, and widgets that registered control events but produced no observable change were flagged "unresponsive".

## Coverage

- **Topics audited:** 93
- **Total widgets:** 682
- **Responsive widgets:** 473
- **Unresponsive widgets:** 31 (across 19 topics)

## Methodology

For each widget the audit:
1. Waited 200ms after page load for hydration.
2. Captured before-state: SVG `outerHTML` byte length + first 80 chars of `.readout`/`.out`/`<pre>` text.
3. Exercised at most 2 of the widget's `<input type="range|number|checkbox">` or `<select>` controls (toggled to the opposite extreme and dispatched the appropriate event). Buttons were skipped to avoid alerts and long handlers.
4. Captured after-state and marked the widget `responsive` if the signature changed, `unresponsive` if every control was triggered without any visible change, `static` if the widget had no triggerable controls.

Sliders, color pickers, button-only widgets, and widgets driven entirely through `<table>`/custom-DOM readouts may legitimately appear `unresponsive` to the heuristic — each flag below was investigated.

## Topics with unresponsive widgets

| Topic | Total widgets | Unresponsive | Unresponsive ids |
|---|---:|---:|---|
| p-adic-numbers | 10 | 6 | `w1`, `w4`, `w2`, `w6`, `w5`, `w7` |
| group-cohomology | 7 | 3 | `w-fix`, `w-h90`, `w-tate` |
| moonshine | 8 | 3 | `w-j`, `w-rep`, `w-gz` |
| additive-number-theory | 20 | 2 |  |
| adeles-and-ideles | 5 | 2 |  |
| vertex-operator-algebras | 6 | 2 | `w-vir`, `w-zhu` |
| algebra | 16 | 1 |  |
| galois-representations | 9 | 1 | `w-hasse` |
| general-relativity | 6 | 1 | `w-gw` |
| hecke-operators | 8 | 1 | `w-mult` |
| heyting-algebras-toposes | 6 | 1 | `w-lem-cases` |
| homological | 12 | 1 | `w-flat` |
| quantum-field-theory | 6 | 1 | `qft-modes` |
| random-walks-and-mixing | 6 | 1 | `w-couple` |
| representation-theory | 13 | 1 | `w-chartbl` |
| riemann-surfaces | 7 | 1 | `w-rh` |
| sato-tate | 9 | 1 | `w-weyl` |
| three-body-problem | 6 | 1 | `w-tbp-sim` |
| tropical-geometry | 6 | 1 | `w-chipfire` |

## All topics (sorted by topic)

| Topic | Total | Responsive | Unresponsive |
|---|---:|---:|---:|
| L-functions | 9 | 4 | 0 |
| abelian-varieties | 6 | 3 | 0 |
| additive-number-theory | 20 | 15 | 2 |
| adeles-and-ideles | 5 | 2 | 2 |
| algebra | 16 | 15 | 1 |
| algebraic-curves-higher-genus | 6 | 6 | 0 |
| algebraic-number-theory | 6 | 6 | 0 |
| algebraic-spaces | 6 | 4 | 0 |
| arithmetic-statistics | 6 | 6 | 0 |
| atiyah-singer-index-theorem | 6 | 6 | 0 |
| automorphic-forms-adelic | 9 | 6 | 0 |
| brill-noether | 7 | 7 | 0 |
| bsd | 9 | 9 | 0 |
| characteristic-classes | 9 | 9 | 0 |
| class-field-theory | 8 | 6 | 0 |
| cobordism | 6 | 6 | 0 |
| cocartesian-fibrations | 8 | 4 | 0 |
| combinatorial-optimization | 7 | 7 | 0 |
| complex-multiplication | 6 | 6 | 0 |
| complexity-theory | 6 | 4 | 0 |
| computability-and-decidability | 6 | 2 | 0 |
| condensed-mathematics | 6 | 6 | 0 |
| conformal-and-cr-geometry | 7 | 6 | 0 |
| convex-optimization | 8 | 8 | 0 |
| d-modules | 6 | 6 | 0 |
| deformation-theory | 7 | 4 | 0 |
| derived-categories | 7 | 2 | 0 |
| dirichlet-series-euler-products | 9 | 9 | 0 |
| donaldson-thomas-and-gw-invariants | 7 | 7 | 0 |
| elementary-topos-theory | 7 | 6 | 0 |
| elliptic-curves | 8 | 7 | 0 |
| enumerative-combinatorics | 6 | 5 | 0 |
| etale-cohomology | 9 | 9 | 0 |
| frobenius-and-reciprocity | 9 | 5 | 0 |
| functor-of-points | 7 | 5 | 0 |
| galois-cohomology-and-brauer | 6 | 6 | 0 |
| galois-representations | 9 | 6 | 1 |
| gauge-theory | 7 | 6 | 0 |
| general-relativity | 6 | 4 | 1 |
| geometric-and-combinatorial-group-theory | 6 | 4 | 0 |
| groebner-bases | 8 | 2 | 0 |
| group-cohomology | 7 | 3 | 3 |
| hecke-operators | 8 | 3 | 1 |
| heegaard-floer | 7 | 4 | 0 |
| heyting-algebras-toposes | 6 | 2 | 1 |
| homological | 12 | 9 | 1 |
| homotopy-theory | 6 | 6 | 0 |
| infinity-categories | 7 | 3 | 0 |
| infinity-topoi | 9 | 6 | 0 |
| knot-polynomials | 6 | 1 | 0 |
| lie-algebras | 6 | 3 | 0 |
| mapping-class-groups | 6 | 5 | 0 |
| mathematical-biology | 7 | 6 | 0 |
| mathematical-chaos | 9 | 6 | 0 |
| microlocal-analysis | 6 | 6 | 0 |
| mirror-symmetry | 6 | 4 | 0 |
| model-categories | 6 | 3 | 0 |
| model-theory-basics | 6 | 2 | 0 |
| modular-curves | 9 | 5 | 0 |
| modularity-and-flt | 9 | 6 | 0 |
| moduli-spaces | 6 | 2 | 0 |
| moonshine | 8 | 4 | 3 |
| morse-theory | 8 | 6 | 0 |
| mostow-rigidity | 6 | 4 | 0 |
| operator-algebras | 12 | 6 | 0 |
| p-adic-numbers | 10 | 2 | 6 |
| positive-characteristic-ag | 9 | 6 | 0 |
| projective-plane | 7 | 3 | 0 |
| quantum-field-theory | 6 | 3 | 1 |
| random-matrix-theory | 7 | 3 | 0 |
| random-walks-and-mixing | 6 | 4 | 1 |
| representation-theory | 13 | 12 | 1 |
| resolution-of-singularities | 5 | 2 | 0 |
| ricci-flow | 6 | 4 | 0 |
| riemann-surfaces | 7 | 2 | 1 |
| sato-tate | 9 | 7 | 1 |
| several-complex-variables | 5 | 4 | 0 |
| sheaf-cohomology | 6 | 6 | 0 |
| shimura-varieties | 6 | 6 | 0 |
| simplicial-sets-and-nerve | 6 | 0 | 0 |
| sobolev-spaces-distributions | 7 | 7 | 0 |
| spectral-theory | 9 | 7 | 0 |
| stochastic-calculus | 6 | 6 | 0 |
| string-theory | 7 | 6 | 0 |
| symplectic-manifolds | 6 | 3 | 0 |
| three-body-problem | 6 | 4 | 1 |
| topological-data-analysis | 6 | 4 | 0 |
| tropical-geometry | 6 | 5 | 1 |
| type-theory-and-hott | 6 | 3 | 0 |
| upper-half-plane-hyperbolic | 7 | 3 | 0 |
| vertex-operator-algebras | 6 | 3 | 2 |
| zeta-values | 5 | 5 | 0 |
| zfc-and-ordinals | 7 | 2 | 0 |
