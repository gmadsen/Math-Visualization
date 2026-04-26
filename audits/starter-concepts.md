# Concept-graph structural audit

Snapshot from `scripts/audit-starter-concepts.mjs`. Updated on every
`rebuild.mjs` run. Always advisory (does not gate CI).

## Per-section structural stats

Density = cross-topic out-edges per concept. Foundations should have 0
out-edges (purely a source); other sections vary based on whether they
reach into upstream foundations or stay within their own cluster.

| section | concepts | intra edges | cross out | cross in | density |
|---|---:|---:|---:|---:|---:|
| Foundations | 5 | 5 | 0 | 5 | 0.000 |
| Algebra | 114 | 173 | 14 | 31 | 0.123 |
| Analysis | 101 | 143 | 12 | 19 | 0.119 |
| Geometry & topology | 49 | 58 | 6 | 42 | 0.122 |
| Number theory | 57 | 70 | 15 | 14 | 0.263 |
| Modular forms & L-functions | 71 | 92 | 39 | 5 | 0.549 |
| Algebraic geometry | 109 | 136 | 42 | 12 | 0.385 |

## EMPTY — concepts with no prereqs (0)

Concepts whose `prereqs` field is `[]` and whose owning topic is *not*
a foundation/prereq topic. Almost always indicates a missing cross-
topic upstream wiring; pathway.html will surface the concept as "ready"
at brand-new progress alongside genuine entry points like
`sets-functions` and `algebraic-structures`.

_Currently clean — no advanced concept lists `prereqs: []`._

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
