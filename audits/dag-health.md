# Concept-graph DAG health audit

_Generated 2026-04-25 from `scripts/lib/content-model.mjs` over the live
corpus (83 topics, 575 concepts, 23 capstones)._

## Headline findings

- **Topology is healthy at the macro level**: validator runs clean (no cycles), only **1 true orphan**, mean fan-in/out is **1.6**, and all 23 capstones reach the foundations. There is no structural bug — the issues are all skews and gaps in the **mid-graph**.
- **Dead-ends dominate the leaf layer**: **184 of 575 concepts (32 %)** have no downstream consumers. Only **14 of those are capstone goals** — the remaining **170 are unfinished arcs**, concentrated in `representation-theory` (7), `infinity-topoi` (5), `real-analysis` (5), `complex-analysis` (5), `dynamical-systems` (5), `probabilistic-method` (5).
- **Fan-out is suspiciously flat**: only 10 concepts list ≥ 4 prereqs and **none ≥ 6**. Compared to the "implicit prereqs" already flagged in `audits/graph-health-summary.md` (129 candidates), this confirms wiring is systematically *under-stated* rather than overstated. The pathway will mark concepts "ready" too eagerly.
- **The Foundations bridge is missing**: `naive-set-theory` has **0 cross-topic out-edges and only 5 cross-topic in-edges** despite being the root of the entire notebook. Algebra, Analysis, Geometry, Number theory, Modular forms, AG, and Combinatorics are each connected to Foundations through ≤ 2 edges or none at all.
- **Combinatorics & graph theory is a satellite**: the section has **0 cross-topic in-edges** — nothing else in the notebook depends on any combinatorics concept — and only thin out-edges into Algebra/Analysis. It currently functions as a side-shelf, not part of the spine.

## Topology summary

| metric | value |
|---|---:|
| total concepts | 575 |
| total prereq edges | 923 |
| intra-topic edges | 567 (61 %) |
| cross-topic edges | 356 (39 %) |
| avg fan-in / fan-out | 1.61 |
| max fan-in | 11 (`algebraic-structures`, `exact-sequences`) |
| max fan-out | 5 (`quadratic-reciprocity-law`, `symmetric-power-l-functions`) |
| roots (empty prereqs) | 9 |
| dead-ends | 184 |
| orphans | 1 |
| sections | 8 |
| capstones | 23 |

### Depth histogram (longest path from any root)

```
 0:  9   ███
 1: 21   ███████
 2: 25   ████████
 3: 43   ██████████████
 4: 41   █████████████
 5: 33   ███████████
 6: 34   ███████████
 7: 39   █████████████
 8: 37   ████████████
 9: 23   ████████
10: 32   ██████████
11: 27   █████████
12: 26   ████████
13: 31   ██████████
14: 37   ████████████
15: 31   ██████████
16: 35   ███████████
17: 21   ███████
18: 13   ████
19:  7   ██
20:  5   ██
21:  4   █
22:  1   ▏
```

The distribution is bimodal-ish: a healthy mass at depths 3–8 (the "definitions + first theorems" layer) and a long tail to depth 22. Depths ≥ 18 (n=30) are dominated by **operator-algebras** (8 concepts) and **L-functions / sato-tate / bsd / zeta-values** chain (10). The OA chain depth is suspect — `gns-construction` at depth 21, `gelfand-duality-oa` at depth 19 — most graduate texts treat these as 6–8 prereqs deep. The L-function/BSD chain at depth 21–22 is genuine: it threads complex-analysis → modular-forms → hecke → L-functions → BSD legitimately.

### Root concepts (9)

| topic | concept(s) |
|---|---|
| naive-set-theory | `sets-functions` |
| algebra | `algebraic-structures` |
| real-analysis | `real-numbers` |
| complex-analysis | `complex-numbers` |
| point-set-topology | `metric-spaces` |
| spectral-graph-theory | `adjacency-and-laplacian` |
| extremal-combinatorics | `turan-theorem`, `sperner-lym` |
| simplicial-complexes-combinatorial | `abstract-simplicial-complex` |

The first five are legitimate entry points (`level: prereq` topics in `index.json`). The four combinatorics roots are anomalous — they sit in `level: standard` topics, none are foundational definitions in the curriculum, and `audit-starter-concepts.mjs` already flags three of them as `EMPTY`. **Recommend**: thread `turan-theorem` ← `simple-graphs` (or similar primitive); thread `abstract-simplicial-complex` ← `sets-functions` + `topological-space`; thread combinatorics roots into Algebra/Analysis where they actually depend on prior structure.

## Top-20 hub concepts (highest fan-in)

| rank | fan-in | concept | topic | why it's a hub |
|---:|---:|---|---|---|
| 1 | 11 | `algebraic-structures` | algebra | Group/ring/module language used everywhere |
| 1 | 11 | `exact-sequences` | homological | Snake/five-lemma machinery, threaded into AG, AT, NT |
| 3 | 10 | `prime-ideals-factorization-ant` | algebraic-number-theory | Class field theory, p-adic, Galois reps all consume it |
| 3 | 10 | `modular-form-definition` | modular-forms | Hecke, L-functions, Galois reps, theta, BSD all depend on it |
| 5 | 9 | `ideals-quotients-ca` | commutative-algebra | Bridge to schemes, AG, AT |
| 5 | 9 | `banach-hilbert-spaces` | functional-analysis | OA, harmonic analysis, spectral theorem all need it |
| 5 | 9 | `bounded-operators-fa` | functional-analysis | Same fan-out into spectral theory & PDE |
| 5 | 9 | `open-sets` | point-set-topology | Topology on schemes/manifolds/spectra |
| 9 | 8 | `functors-natural-transformations` | category-theory | Yoneda + adjunctions cite it everywhere |
| 9 | 8 | `lp-spaces` | measure-theory | Functional analysis, harmonic, probability |
| 9 | 8 | `fundamental-group` | algebraic-topology | Riemann surfaces, etale-π₁, monodromy |
| 9 | 8 | `spectrum-primes` | schemes | The whole AG arc |
| 13 | 7 | `sets-functions` | naive-set-theory | Roots of the curriculum |
| 13 | 7 | `categories-morphisms` | category-theory | Universal language hub |
| 13 | 7 | `real-differentiation` | real-analysis | Underpins manifolds, complex, ODE |
| 13 | 7 | `dirichlet-series-basics` | dirichlet-series-euler-products | L-functions backbone |
| 13 | 7 | `elliptic-curve-definition` | elliptic-curves | BSD, modularity, sato-tate |
| 13 | 7 | `cech-cohomology` | sheaf-cohomology | Sheaf theory + AG hubs |
| 19 | 6 | `cstar-basics` | operator-algebras | OA's local fan-out |
| 19 | 6 | `expectation-moments` | probability-theory | Probabilistic-method, harmonic ties |
| 19 | 6 | `fourier-transform-real-line` | harmonic-analysis-fourier | Modular forms, sobolev, complex |
| 19 | 6 | `compactness` | point-set-topology | Tychonoff / spec / Riemann surfaces |
| 19 | 6 | `singular-homology` | algebraic-topology | de Rham + cohomology arcs |
| 19 | 6 | `smooth-manifold-definition` | smooth-manifolds | Geometry + Lie + diff-forms |
| 19 | 6 | `frobenius-element` | frobenius-and-reciprocity | Galois reps, sato-tate, CFT |

The hub list looks correct: every entry corresponds to a concept a textbook would call "foundational." The fact that the top hub fan-in is only **11** (out of 575) means there is **no concept that is a single point of failure** — the graph is broad rather than tall, which is a plus.

## Orphans / dead-end / under-connected concepts

### Orphans (1)

- `sperner-lym` — Sperner's theorem and the LYM inequality (`extremal-combinatorics`). Empty prereqs and zero consumers. **Recommend: connect-via-edge** — Sperner depends on basic combinatorics (binomial coefficients, partial orders); add a prereq into `sets-functions` or a future `posets` concept. As a consumer, hook it into `probabilistic-method` (probabilistic Sperner is a standard application).

### Dead-ends — top problem topics

170 non-capstone dead-ends. The worst offenders (≥ 4):

| topic | dead-ends | sample concepts | recommendation |
|---|---:|---|---|
| `representation-theory` | 7 | likely all post-Schur material | **promote-to-capstone** for one (Peter–Weyl?), connect remainder into `lie-groups`, `harmonic-analysis-fourier`, `galois-representations` |
| `infinity-topoi` | 5 | `hypercompletion`, geometric-morphisms-infty | new-arc topic; legitimately terminal *for now*. **Leave-as-is**; will get consumers as derived-AG arc fills in |
| `real-analysis` | 5 | likely the higher theorems (`riemann-integral`, etc.) | wire forward into `measure-theory`, `complex-analysis`, `differential-forms` |
| `complex-analysis` | 5 | `domain-coloring`, `fta`, `rouche`, `conformal-map`, `riemann-mapping` | **4 of 5 are capstone goals** — this is mostly legitimate. `domain-coloring` is genuinely terminal aesthetic — leave-as-is or promote |
| `dynamical-systems` | 5 | `dyn-symbolic-dynamics`, `dyn-strange-attractors`, `dyn-ergodicity`, `dyn-conservative-dissipative`, `period-doubling-cascade` | section is currently a satellite — connect `dyn-ergodicity` → `measure-theory`, symbolic dynamics → number theory (continued fractions) |
| `probabilistic-method` | 5 | likely all of it | section has 0 in-edges (see § "Cross-section bridge gaps") — wire `probabilistic-method` consumers from `extremal-combinatorics`, `spectral-graph-theory` |
| `commutative-algebra` | 4 | `flatness-ca`, `nakayama-lemma-ca`, `transcendence-degree-ca`, `nilradical-jacobson-ca` | **promote-to-prereq-of**: flatness → `morphisms-fiber-products`; Nakayama → `tangent-space-zariski`; nilradical → schemes' radical-ideal use |
| `measure-theory` | 4 | likely radon-nikodym tier | wire forward into `lp-spaces` consumers + probability |
| `functional-analysis` | 4 | spectral material | most likely already capstone-bound; verify `spectrum-classification` reaches `spectral-theorem-fa` |
| `operator-algebras` | 4 | `factors-types`, `states-pure-states`, `approximate-units-amenability`, `murray-vn-equivalence` | the OA arc terminates at Gelfand and Murray–vN; legitimate dead-ends from a curricular standpoint |
| `harmonic-analysis-fourier` | 4 | likely Plancherel / Fourier-on-Z | wire into modular forms + sobolev + theta |
| `group-schemes` | 4 | new-arc topic, mostly leaves | will get consumers as moduli/derived arcs land |

**Net diagnosis**: representation-theory and probabilistic-method are the two genuinely under-connected outputs (terminate without feeding anything), commutative-algebra has high-leverage internal dead-ends that *should* be feeding schemes, and the rest are either capstone-justified or new-arc-pending.

## Heavy-prereq concepts (fan-out)

**No concept has fan-out ≥ 6.** The current heaviest-prereq concepts:

| fan-out | concept | topic |
|---:|---|---|
| 5 | `quadratic-reciprocity-law` | quadratic-reciprocity |
| 5 | `symmetric-power-l-functions` | sato-tate |
| 4 | `yoneda-limits-adjunctions` | category-theory |
| 4 | `flatness-ca` | commutative-algebra |
| 4 | `examples-of-fibrations` | cocartesian-fibrations |
| 4 | `solvability-by-radicals` | galois |
| 4 | `ramanujan-congruences` | partitions-generating-functions |
| 4 | `sato-tate-measure` | sato-tate |
| 4 | `bsd-rank-equality` | bsd |
| 4 | `modularity-theorem` | modularity-and-flt |

This is below what one would expect for a graduate-mathematics graph — the "implicit-prereq" audit (graph-health-summary) flagged **129** missing edges, with `harmonic-functions`, `analyticity`, `cstar-basics`, `continuity-topology`, `categories-morphisms` each understated by 3–4 prereqs. **The fan-out distribution is the strongest signal that the graph is under-wired, not over-wired.** A pass to materialize the top-20 implicit edges from `audits/graph-health-summary.md` would push five concepts past fan-out=6 and tighten the locked→ready transitions on `pathway.html`.

## Cross-section bridge gaps

8 sections × 7 = 56 directed pairs; **20 currently carry edges, 36 are empty**. Most empty pairs are legitimate (Foundations doesn't depend on AG; AG doesn't depend on combinatorics). The **conceptually-close pairs that are currently zero or thin**, ranked by reviewer judgment:

| direction | edges | comment |
|---|---:|---|
| analysis → algebra | 2 | thin — `lp-spaces` should cite `vector-spaces` /  `inner-product`; `bounded-operators-fa` should cite category-of-Banach-spaces |
| algebraic-geometry → analysis | 0 | **gap** — sheaf-cohomology + Dolbeault should reference real/complex analysis; etale-cohomology touches `complex-analytic-comparison` |
| geometry-and-topology → algebraic-geometry | 0 | **gap** — Riemann surfaces ↔ algebraic curves bridge is unwired (riemann-surfaces section sits in geo-topo, not AG) |
| analysis → algebraic-geometry | 0 | gap — Hodge theory, cotangent complex consume analysis foundations |
| geometry-and-topology → modular-forms-and-l-functions | 0 | gap — upper-half-plane is hyperbolic geometry; needs hooks into `riemannian-geometry` / fundamental-domain |
| algebra → modular-forms-and-l-functions | 0 | gap — Hecke algebras are a representation-theory consumer in disguise |
| number-theory → modular-forms-and-l-functions | 4 | OK direction |
| number-theory → analysis | 2 | thin — analytic NT (Euler products, prime counting) should reach analysis |
| number-theory → geometry-and-topology | 2 | thin — adelic uniformization, p-adic upper-half-plane |
| algebra → foundations | 2 | very thin — every Algebra concept should *transitively* reach `sets-functions` but only 2 do directly |
| algebraic-geometry → foundations | 1 | same comment |
| combinatorics-and-graph-theory → modular-forms-and-l-functions | 0 | gap — `partitions-generating-functions` should consume `simple-graphs`; spectral-graph ↔ Ihara zeta is missing |
| combinatorics-and-graph-theory → algebraic-geometry | 0 | gap — `matroid-theory` is a chunk of toric/tropical AG |

**The single highest-leverage bridge to add: geometry-and-topology → algebraic-geometry**, specifically `riemann-surfaces` ↔ `algebraic-curves-higher-genus`. The two are the same theorem from two angles and the curriculum's "Riemann–Roch" capstone needs both sides.

## Capstone reachability assessment

All 23 capstone goals exist as concepts (no broken pointers). Sorted by reach-tree size (concepts upstream):

| capstone | section | tree size | depth | leaves | assessment |
|---|---|---:|---:|---:|---|
| `bsd-rank-equality` | M&L | **64** | 12 | 5 | massive — appropriate for a Clay problem; well-fed |
| `symmetric-power-l-functions` (Sato–Tate) | M&L | 59 | 11 | 5 | well-fed |
| `borcherds-proof-sketch` (moonshine) | M&L | 46 | 14 | 5 | well-fed; deepest at d=14 |
| `higher-genus-moduli` | AG | 40 | 9 | 5 | well-fed |
| `zeta-functional-equation` | M&L | 40 | 9 | 4 | OK |
| `ribet-level-lowering` (modularity-FLT) | M&L | 39 | 11 | 4 | OK |
| `riemann-mapping` | Analysis | 29 | 9 | 4 | OK |
| `ramanujan-congruences` | M&L | 28 | 11 | 4 | OK |
| `weil-frobenius-trace` (étale) | AG | 27 | 8 | 3 | adequate |
| `rouche` | Analysis | 26 | 10 | 4 | OK |
| `gelfand-duality-oa` | Analysis | 25 | 12 | 3 | OK |
| `residue-theorem` | Analysis | 24 | 8 | 4 | OK |
| `stokes-derham` | Geo&Top | 24 | 9 | 3 | OK |
| `spectral-theorem-fa` | Analysis | 23 | 8 | 3 | OK |
| `infty-topos-definition` | Algebra | 23 | 7 | 2 | thin leaves — only 2 root-paths feed it; expected for a new arc |
| `fta` | Analysis | 22 | 10 | 4 | OK |
| `riemann-roch` | Geo&Top | 21 | 10 | 4 | OK |
| `gauss-bonnet` | Geo&Top | 21 | 16 | 3 | depth=16 is suspicious — likely a duplicated-prereq chain through diff-geom; worth re-walking |
| `yoneda-limits-adjunctions` | Algebra | 16 | 4 | 3 | **shallow** — should be ~30+ given how foundational this is |
| `quadratic-reciprocity-law` | NT | 13 | 4 | 2 | **shallow** — known stub-quality, expand prereqs into Galois + Legendre + class group |
| `hilbert-class-field` | NT | 12 | 5 | 1 | **single leaf** = single root path; under-fed |
| `local-global-principle` | NT | 10 | 4 | 2 | **shallow** for a Hasse-principle capstone |
| `solvability-by-radicals` | Algebra | 8 | 2 | 1 | **WORST** — depth 2, 1 leaf, 8 concepts. Galois solvability needs solvable-groups, normal-subgroups, splitting-fields, group-actions, and Cardano — many missing |

**Three capstones are under-fed and merit deliberate prereq-tree expansion**:

1. `solvability-by-radicals` (8 concepts, depth 2)
2. `quadratic-reciprocity-law` (13, depth 4) — already known thin
3. `hilbert-class-field` (12, depth 5)

The Number theory section's three capstones occupy the bottom of the table. This is the single biggest section-level expansion target.

## Cycles

`scripts/validate-concepts.mjs` runs clean in the rebuild chain, and the depth computation succeeded without hitting the cycle guard. **No cycles present.**

## Concrete proposals (ranked)

1. **Expand the Galois capstone tree** — `solvability-by-radicals` has fan-out 4 but its upstream tree is depth 2. Add prereqs: `solvable-groups`, `normal-subgroup-tower`, `splitting-field`, `cardano-cubic-quartic`. Cascades into a bigger algebra root and feeds `quadratic-reciprocity-law` siblings.
2. **Materialize the top-20 implicit prereqs from `graph-health-summary.md`** — `harmonic-functions`, `analyticity`, `cstar-basics`, `continuity-topology`, `convergence-theorems`, `riemann-integral`, `categories-morphisms` are each understated by 2–4 prereqs. Apply `audit-cross-topic-prereqs.mjs --min-confidence high` and hand-review.
3. **Bridge `riemann-surfaces` ↔ `algebraic-curves-higher-genus`** — the highest-conceptual-leverage missing cross-section edge. `algebraic-curves-higher-genus` should list `riemann-surface-definition` (or the closest existing concept) as a prereq.
4. **Connect `dynamical-systems` to its consumers** — wire `dyn-ergodicity` → `lebesgue-measure` and `birkhoff-ergodic-theorem` (probability-theory). Currently this section is a leaf-only satellite.
5. **Make `probabilistic-method` non-orphan as a section** — add cross-topic edges from `extremal-combinatorics` and `spectral-graph-theory` *into* `probabilistic-method` concepts (Lovász Local Lemma is consumed by Ramsey/Turán proofs).
6. **Resolve the `sperner-lym` orphan** — connect upstream (basic posets / binomials) and downstream (probabilistic-method).
7. **Re-thread the four anomalous combinatorics roots** — `turan-theorem`, `sperner-lym`, `adjacency-and-laplacian`, `abstract-simplicial-complex`. None of these are genuine first-order definitions; each should depend on a primitive (graphs, posets, simplices-as-sets).
8. **Investigate `gauss-bonnet`'s depth=16 chain** — likely a duplicated-prereq path through `differential-geometry` → `riemannian-geometry`. Tighten if it's an artifact of redundant edges.
9. **Promote 1–2 representation-theory dead-ends to a Peter–Weyl mini-capstone** — currently 7 dead-ends in that topic, none capstone-tagged. Compact-Lie-group reps are a natural section terminus.
10. **Add `sets-functions` as direct-prereq on the 8 algebraic-structures siblings** that currently only reach foundations transitively — guarantees the pathway shows the right "ready" entry-point on a fresh user state.

Sign-off: the DAG is structurally sound (no cycles, no broken refs, only one orphan, 100 % capstone reachability) but **systematically under-wired**. The `pathway.html` "ready" state will be too eager and the `mindmap.html` clusters will look sparser than the actual conceptual proximity warrants. Items 1, 2, 3 above are the highest leverage; they together would materialize ~50 new edges and lift several hub-fan-ins by 2–3.

[dag reviewer]
