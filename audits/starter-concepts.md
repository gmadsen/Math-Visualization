# Concept-graph structural audit

Snapshot from `scripts/audit-starter-concepts.mjs`. Updated on every
`rebuild.mjs` run. Always advisory (does not gate CI).

## Per-section structural stats

Density = cross-topic out-edges per concept. Foundations should have 0
out-edges (purely a source); other sections vary based on whether they
reach into upstream foundations or stay within their own cluster.

| section | concepts | intra edges | cross out | cross in | density |
|---|---:|---:|---:|---:|---:|
| Logic & Foundations | 49 | 67 | 5 | 24 | 0.102 |
| Algebra & homological | 148 | 224 | 25 | 100 | 0.169 |
| Higher categories & toposes | 45 | 68 | 23 | 4 | 0.511 |
| Analysis | 223 | 382 | 46 | 82 | 0.206 |
| Probability & statistics | 76 | 124 | 20 | 49 | 0.263 |
| Geometry & topology | 160 | 268 | 33 | 101 | 0.206 |
| Number theory | 128 | 180 | 57 | 40 | 0.445 |
| Modular forms & L-functions | 116 | 172 | 64 | 28 | 0.552 |
| Algebraic geometry | 213 | 328 | 76 | 35 | 0.357 |
| Combinatorics & graph theory | 93 | 95 | 36 | 6 | 0.387 |
| Mathematical physics | 81 | 90 | 45 | 4 | 0.556 |
| Control theory & optimization | 58 | 62 | 23 | 9 | 0.397 |
| Learning theory & data science | 56 | 60 | 30 | 1 | 0.536 |

## EMPTY — concepts with no prereqs (5)

Concepts whose `prereqs` field is `[]` and whose owning topic is *not*
a foundation/prereq topic. Almost always indicates a missing cross-
topic upstream wiring; pathway.html will surface the concept as "ready"
at brand-new progress alongside genuine entry points like
`sets-functions` and `algebraic-structures`.

| topic | concept | title |
|---|---|---|
| advanced-complex-analysis | `aca-overview` | The graduate landscape |
| coding-theory | `ct-distance` | Hamming distance and the Singleton bound |
| convex-geometry | `cg-convex-bodies` | Convex bodies & supporting hyperplanes |
| game-theory | `gt-normal-form` | Normal-form games & dominance |
| tropical-geometry | `trop-semiring` | The tropical semiring |

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

Foundations excluded from the EMPTY check: `algebra`, `algebraic-topology`, `complex-analysis`, `graph-theory-fundamentals`, `naive-set-theory`, `point-set-topology`, `projective-plane`, `real-analysis`.
