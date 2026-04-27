# Concept-graph structural audit

Snapshot from `scripts/audit-starter-concepts.mjs`. Updated on every
`rebuild.mjs` run. Always advisory (does not gate CI).

## Per-section structural stats

Density = cross-topic out-edges per concept. Foundations should have 0
out-edges (purely a source); other sections vary based on whether they
reach into upstream foundations or stay within their own cluster.

| section | concepts | intra edges | cross out | cross in | density |
|---|---:|---:|---:|---:|---:|
| Logic & Foundations | 49 | 56 | 4 | 11 | 0.082 |
| Algebra & homological | 88 | 126 | 13 | 61 | 0.148 |
| Higher categories & toposes | 45 | 68 | 23 | 2 | 0.511 |
| Analysis | 122 | 198 | 16 | 32 | 0.131 |
| Probability & statistics | 41 | 61 | 10 | 8 | 0.244 |
| Geometry & topology | 61 | 81 | 6 | 51 | 0.098 |
| Number theory | 78 | 101 | 30 | 24 | 0.385 |
| Modular forms & L-functions | 79 | 103 | 48 | 10 | 0.608 |
| Algebraic geometry | 109 | 138 | 47 | 14 | 0.431 |
| Combinatorics & graph theory | 39 | 34 | 17 | 1 | 0.436 |

## EMPTY — concepts with no prereqs (2)

Concepts whose `prereqs` field is `[]` and whose owning topic is *not*
a foundation/prereq topic. Almost always indicates a missing cross-
topic upstream wiring; pathway.html will surface the concept as "ready"
at brand-new progress alongside genuine entry points like
`sets-functions` and `algebraic-structures`.

| topic | concept | title |
|---|---|---|
| analytic-number-theory | `ant-prime-counting` | $\pi(x)$ and the prime number theorem |
| spectral-graph-theory | `adjacency-and-laplacian` | Adjacency, degree, and the Laplacian |

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
