# Concept-graph structural audit

Snapshot from `scripts/audit-starter-concepts.mjs`. Updated on every
`rebuild.mjs` run. Always advisory (does not gate CI).

## Per-section structural stats

Density = cross-topic out-edges per concept. Foundations should have 0
out-edges (purely a source); other sections vary based on whether they
reach into upstream foundations or stay within their own cluster.

| section | concepts | intra edges | cross out | cross in | density |
|---|---:|---:|---:|---:|---:|
| Logic & Foundations | 12 | 5 | 0 | 5 | 0.000 |
| Algebra & homological | 78 | 107 | 9 | 50 | 0.115 |
| Higher categories & toposes | 45 | 66 | 21 | 1 | 0.467 |
| Analysis | 107 | 152 | 14 | 25 | 0.131 |
| Probability & statistics | 17 | 15 | 7 | 7 | 0.412 |
| Geometry & topology | 51 | 58 | 6 | 45 | 0.118 |
| Number theory | 70 | 87 | 20 | 21 | 0.286 |
| Modular forms & L-functions | 74 | 94 | 43 | 6 | 0.581 |
| Algebraic geometry | 109 | 137 | 42 | 14 | 0.385 |
| Combinatorics & graph theory | 34 | 28 | 12 | 0 | 0.353 |

## EMPTY — concepts with no prereqs (26)

Concepts whose `prereqs` field is `[]` and whose owning topic is *not*
a foundation/prereq topic. Almost always indicates a missing cross-
topic upstream wiring; pathway.html will surface the concept as "ready"
at brand-new progress alongside genuine entry points like
`sets-functions` and `algebraic-structures`.

| topic | concept | title |
|---|---|---|
| analytic-number-theory | `analytic-number-theory-intro` | Intro |
| characteristic-classes | `characteristic-classes-intro` | Intro |
| complexity-theory | `complexity-theory-intro` | Intro |
| computability-and-decidability | `computability-and-decidability-intro` | Intro |
| enumerative-combinatorics | `enumerative-combinatorics-intro` | Intro |
| extremal-combinatorics | `sperner-lym` | Sperner's theorem and the LYM inequality |
| extremal-combinatorics | `turan-theorem` | Turán's theorem and the Turán graph |
| first-order-logic-and-completeness | `first-order-logic-and-completeness-intro` | Intro |
| forcing-and-independence | `forcing-and-independence-intro` | Intro |
| galois-cohomology-and-brauer | `galois-cohomology-and-brauer-intro` | Intro |
| harmonic-functions | `harmonic-functions-intro` | Intro |
| information-theory | `information-theory-intro` | Intro |
| large-deviations | `large-deviations-intro` | Intro |
| lie-algebras | `lie-algebras-intro` | Intro |
| model-theory-basics | `model-theory-basics-intro` | Intro |
| modular-curves | `modular-curves-intro` | Intro |
| morse-theory | `morse-theory-intro` | Intro |
| partial-differential-equations | `partial-differential-equations-intro` | Intro |
| random-walks-and-mixing | `random-walks-and-mixing-intro` | Intro |
| simplicial-complexes-combinatorial | `abstract-simplicial-complex` | Abstract simplicial complexes |
| spectral-graph-theory | `adjacency-and-laplacian` | Adjacency, degree, and the Laplacian |
| spectral-theory | `spectral-theory-intro` | Intro |
| stochastic-calculus | `stochastic-calculus-intro` | Intro |
| stochastic-processes-and-martingales | `stochastic-processes-and-martingales-intro` | Intro |
| type-theory-and-hott | `type-theory-and-hott-intro` | Intro |
| zfc-and-ordinals | `zfc-and-ordinals-intro` | Intro |

## THIN-NEW — new-arc concepts with intra-topic-only prereqs (13)

New-arc topics (capstone arc + Stacks-Project arc + cocartesian-fibrations)
whose concepts list `prereqs` but every entry stays inside the same topic.
Often transitively reachable from foundations via siblings, but the direct
cross-topic dependencies should be wired in for clarity (audit-callbacks
uses these to populate "See also" asides).

| topic | concept | title | current prereqs |
|---|---|---|---|
| algebraic-spaces | `examples-of-algebraic-spaces` | Examples: free quotients and a non-scheme | `algebraic-space-definition` |
| cocartesian-fibrations | `cocartesian-edge` | Cocartesian edges | `left-right-fibrations` |
| cocartesian-fibrations | `cocartesian-fibration` | Cocartesian fibrations | `cocartesian-edge` |
| derived-categories | `derived-category` | The derived category $D(\mathcal{A})$ | `quasi-isomorphisms` |
| derived-categories | `quasi-isomorphisms` | Quasi-isomorphisms and localization | `homotopy-category-K` |
| elementary-topos-theory | `characteristic-maps` | Characteristic maps as truth values | `subobject-classifier` |
| elementary-topos-theory | `power-objects` | Power objects $P(A)$ | `subobject-classifier` |
| etale-fundamental-group | `comparison-topological` | Comparison with topological $\pi_1$ | `etale-pi1` |
| grothendieck-topologies-sites | `grothendieck-topology` | Grothendieck topology axioms | `sieves` |
| heyting-algebras-toposes | `lem-failure` | Why LEM fails: double negation in toposes | `internal-language`, `kripke-joyal-semantics` |
| infinity-topoi | `hypercompletion` | Hypercompletion and Whitehead's theorem | `infty-topos-definition` |
| simplicial-sets-and-nerve | `horn-filling` | Inner-horn filling and quasi-categorical nerves | `kan-complex`, `nerve-of-category` |
| simplicial-sets-and-nerve | `kan-complex` | Kan complexes | `simplicial-set` |

Foundations excluded from the EMPTY check: `algebra`, `algebraic-topology`, `complex-analysis`, `naive-set-theory`, `point-set-topology`, `projective-plane`, `real-analysis`.
