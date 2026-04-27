# Quiz + widget corpus audit

Read-only review across 83 topics, 575 concepts, 2901 quiz questions, 138 registered widget slugs (563 instances). Method: ran `audit-widget-interactivity`, `audit-blurb-question-alignment`, plus three `loadContentModel()` helpers under `/tmp/` for type-distribution, registry-adoption, and bespoke-vs-shared metrics. Sampled v1↔hard calibration on 5 topics, hand-checked 12 numeric answers, and examined every MCQ flagged for "all-pure-numeric" choices.

## Quiz headline findings

The bank is large (2901 questions) but **type-monoculture**: 93% are MCQ + numeric, and **38 of 83 topics use literally only those two types** — including high-traffic destinations like `naive-set-theory`, `differential-forms`, `riemannian-geometry`, `p-adic-numbers`, `theta-functions`, `L-functions`, `elliptic-curves`, and the entire BSD/Sato-Tate/modularity capstone trio. The seven richer types (`multi-select`, `matching`, `complex`, `ordering`, `proof-completion`, `spot-the-error`, `construction`, `guess-my-rule`) collectively account for 201 questions (6.9%) — `construction` and `guess-my-rule` exist as 2 instances each, essentially unused. Hard-tier coverage is uneven: 11 topics carry **0 hard questions** (all 5 Combinatorics topics + `group-cohomology`, `harmonic-analysis-fourier`, `heights-arithmetic-geometry`, `automorphic-forms-adelic`, `sobolev-spaces-distributions`, `simplicial-complexes-combinatorial`) — every one of these is a recently-fanned-out advanced topic. Distractor quality is genuinely good: only 12 of 1815 MCQs use bare-numeric distractors, and those 12 all hand-check as plausible misconception traps (wrong tower-law product, wrong order in $(\mathbb{Z}/n)^\times$, etc.). Only 1087/2901 questions (37.5%) carry `hint`; this is the highest-leverage v1 polish surface.

## Per-topic tier coverage table

`variety` is 1 + (distinct non-mcq/numeric types used), capped at 5. Bold rows = `variety ≤ 1` AND `≥ 12 v1 questions` (high-traffic mcq+numeric monocultures).

| topic | concepts | v1 | hard concepts | expert concepts | variety |
|---|--:|--:|--:|--:|--:|
| naive-set-theory | 5 | 15 | 5 | 0 | 1 |
| algebra | 12 | 36 | 12 | 0 | 2 |
| **category-theory** | 12 | 36 | 12 | 0 | 5 |
| **representation-theory** | 13 | 39 | 13 | 0 | 2 |
| commutative-algebra | 13 | 40 | 12 | 0 | 3 |
| homological | 12 | 36 | 12 | 0 | 3 |
| elementary-topos-theory | 7 | 21 | 3 | 0 | 4 |
| heyting-algebras-toposes | 6 | 18 | 3 | 0 | 3 |
| grothendieck-topologies-sites | 6 | 18 | 3 | 0 | 2 |
| simplicial-sets-and-nerve | 6 | 18 | 3 | 0 | 2 |
| infinity-categories | 6 | 18 | 3 | 0 | 3 |
| infinity-topoi | 7 | 21 | 4 | 0 | 3 |
| derived-categories | 7 | 21 | 4 | 0 | 5 |
| cocartesian-fibrations | 7 | 21 | 5 | 0 | 4 |
| group-cohomology | 7 | 21 | **0** | 0 | 2 |
| real-analysis | 14 | 42 | 14 | 0 | 4 |
| **measure-theory** | 12 | 36 | 12 | 0 | 2 |
| complex-analysis | 5 | 16 | 5 | 0 | 5 |
| functional-analysis | 12 | 36 | 12 | 0 | 5 |
| operator-algebras | 12 | 36 | 12 | 0 | 5 |
| dynamical-systems | 13 | 39 | 12 | 0 | 5 |
| probability-theory | 12 | 36 | 12 | **8** | 5 |
| sobolev-spaces-distributions | 7 | 21 | **0** | 0 | 1 |
| harmonic-analysis-fourier | 8 | 24 | **0** | 0 | 2 |
| point-set-topology | 6 | 18 | 6 | 0 | 1 |
| algebraic-topology | 6 | 18 | 5 | 0 | 2 |
| **smooth-manifolds** | 10 | 30 | 10 | 0 | 1 |
| differential-forms | 5 | 15 | 5 | 0 | 1 |
| differential-geometry | 5 | 15 | 5 | 0 | 2 |
| riemannian-geometry | 5 | 15 | 5 | 0 | 1 |
| **lie-groups** | 7 | 21 | 7 | 0 | 1 |
| riemann-surfaces | 5 | 15 | 5 | 0 | 2 |
| galois | 5 | 15 | 5 | 0 | 2 |
| quadratic-reciprocity | 6 | 18 | 5 | 0 | 1 |
| quadratic-forms-genus-theory | 5 | 15 | 5 | 0 | 1 |
| sums-of-squares | 5 | 15 | 5 | 0 | 2 |
| power-sums-bernoulli | 5 | 16 | 5 | 0 | 2 |
| waring | 5 | 15 | 5 | 0 | 1 |
| algebraic-number-theory | 5 | 15 | 5 | 0 | 2 |
| p-adic-numbers | 5 | 15 | 5 | 0 | 1 |
| adeles-and-ideles | 5 | 15 | 5 | 0 | 1 |
| frobenius-and-reciprocity | 5 | 15 | 5 | 0 | 1 |
| class-field-theory | 6 | 18 | 6 | 0 | 1 |
| heights-arithmetic-geometry | 7 | 21 | **0** | 0 | 1 |
| automorphic-forms-adelic | 7 | 21 | **0** | 0 | 2 |
| upper-half-plane-hyperbolic | 5 | 15 | 5 | 0 | 1 |
| modular-forms | 6 | 18 | 5 | 0 | 1 |
| theta-functions | 5 | 15 | 5 | 0 | 1 |
| partitions-generating-functions | 5 | 15 | 5 | 0 | 1 |
| hecke-operators | 5 | 15 | 5 | 0 | 1 |
| dirichlet-series-euler-products | 5 | 15 | 5 | 0 | 1 |
| analytic-continuation | 5 | 15 | 5 | 0 | 1 |
| zeta-values | 5 | 15 | 5 | 0 | 1 |
| L-functions | 5 | 15 | 5 | 0 | 1 |
| galois-representations | 5 | 15 | 5 | 0 | 1 |
| moonshine | 5 | 15 | 5 | 0 | 1 |
| sato-tate | 5 | 15 | 5 | 0 | 1 |
| bsd | 5 | 15 | 5 | 0 | 1 |
| modularity-and-flt | 5 | 15 | 5 | 0 | 2 |
| projective-plane | 5 | 15 | 5 | 0 | 1 |
| bezout | 5 | 15 | 5 | 0 | 2 |
| schemes | 10 | 30 | 10 | 0 | 1 |
| sheaves | 7 | 21 | 7 | 0 | 1 |
| morphisms-fiber-products | 5 | 15 | 5 | 0 | 1 |
| functor-of-points | 5 | 15 | 5 | 0 | 1 |
| elliptic-curves | 5 | 15 | 5 | 0 | 1 |
| singular-cubics-reduction | 5 | 15 | 5 | 0 | 1 |
| moduli-spaces | 5 | 15 | 5 | 0 | 2 |
| sheaf-cohomology | 5 | 15 | 5 | 0 | 1 |
| stacks | 5 | 15 | 5 | 0 | 1 |
| algebraic-spaces | 6 | 18 | 3 | 0 | 5 |
| intersection-theory-chow | 6 | 18 | 4 | 0 | 5 |
| etale-fundamental-group | 6 | 18 | 4 | 0 | 5 |
| algebraic-curves-higher-genus | 6 | 18 | 4 | 0 | 2 |
| group-schemes | 6 | 18 | 3 | 0 | 3 |
| deformation-theory | 6 | 18 | 3 | 0 | 2 |
| algebraic-de-rham-cohomology | 6 | 18 | 3 | 0 | 2 |
| etale-cohomology | 5 | 15 | 5 | 0 | 2 |
| spectral-graph-theory | 7 | 21 | **0** | 0 | 2 |
| matroid-theory | 7 | 21 | **0** | 0 | 2 |
| probabilistic-method | 7 | 21 | **0** | 0 | 2 |
| extremal-combinatorics | 6 | 18 | **0** | 0 | 2 |
| simplicial-complexes-combinatorial | 6 | 18 | **0** | 0 | 1 |

## Question-type distribution corpus-wide

| type | count | share |
|---|--:|--:|
| `mcq` | 1815 | 62.6% |
| `numeric` | 885 | 30.5% |
| `multi-select` | 82 | 2.8% |
| `matching` | 30 | 1.0% |
| `complex` | 29 | 1.0% |
| `ordering` | 21 | 0.7% |
| `spot-the-error` | 21 | 0.7% |
| `proof-completion` | 14 | 0.5% |
| `construction` | 2 | 0.07% |
| `guess-my-rule` | 2 | 0.07% |

`construction` (drag a marker on a canvas) and `guess-my-rule` (inductive pattern fill-in) are essentially unused — these are the most pedagogically distinctive types and the renderer code paths sit ~unexercised. `proof-completion` (14) and `spot-the-error` (21) are deeply Brilliant-flavoured and underused. `matching` (30) is concentrated in 8 topics (mostly the Algebra cluster). `complex` (29) is concentrated in `complex-analysis` (4) + `dynamical-systems` (3) — a normal niche pattern, not a problem.

The **8 most-varied topics** (≥6 distinct types each): `dynamical-systems`, `probability-theory` (both 9), `complex-analysis`, `etale-fundamental-group` (both 7), `category-theory`, `derived-categories`, `functional-analysis`, `operator-algebras`, `intersection-theory-chow` (all 6). These are the exemplars to copy from when diversifying.

## Calibration spot-check

Sampled v1 vs hard on 5 topics. **Verdict: calibration is genuinely good — hard tiers escalate, they do not just rephrase.**

- `category-theory / functors-natural-transformations` — v1 asks "what equation does $F$ satisfy on composition?" (recall). Hard asks "why is there no natural iso $V \cong V^*$?" (forces you to identify variance — meaningfully harder). ✓
- `real-analysis / real-numbers` — v1 asks $\sup\{1-1/n\}$ (recognise sup ≠ max). Hard asks for the proof-step ordering of "Cauchy → bounded → B–W → convergent" (multi-step synthesis). ✓
- `modular-forms / sl2z-on-H` — v1 asks "compute $S(i)$" (one-step). Hard asks the orbit-equivalence on $\partial \mathcal{F}$ — both edges + arc (genuinely harder). ✓
- `galois / field-extensions-galois` — v1 asks $[\mathbb{Q}(\sqrt[3]{2}, \omega) : \mathbb{Q}]$. Hard asks the order of $\sigma : \zeta_5 \mapsto \zeta_5^2$ (forces working in $(\mathbb{Z}/5)^\times$). ✓
- `commutative-algebra / ideals-quotients-ca` — v1 counts ideals of $\mathbb{Z}/12$. Hard asks the chain $I \subseteq \sqrt{I} \subseteq \mathfrak{m}$ for $I = (x^2, xy, y^2)$ (radical computation). ✓

No "rephrased v1" instances spotted in the sample. This is a quality success worth preserving.

## Numeric-question correctness

Hand-checked 12 numeric questions across 12 topics — **all 12 stored answers match a pen-and-paper recomputation.** Spot-check passed: `r_2(5) = 8`, $4(-1)^3 + 27(0)^2 = -4$, $|3+4i| = 5$, $|\det\begin{pmatrix}2&1\\0&3\end{pmatrix}| = 6$, $\sup\{1-1/n\} = 1$, etc. No correctness issues found in this sample.

## Distractor / hint / blurb-alignment issues

`audit-blurb-question-alignment` flagged 18 concepts below the 0.30 coverage threshold (corpus mean 0.68). Worst offenders worth rewriting:

- **`measure-theory / lp-spaces` (0.11 coverage, 6 questions)** — blurb advertises Banach, Hilbert, Minkowski, integrability; questions only mention "space ×3". This is the single starkest drift.
- **`algebraic-topology / fundamental-group` (0.17, 6 q)** — blurb mentions basepoint, change-of-basepoint, concatenation, functoriality; questions just say "group ×3".
- **`power-sums-bernoulli / zeta-special-values` (0.17, 6 q)** — blurb advertises Bernoulli, closed form, functional equation, negative integers; questions only say "formula ×4, euler ×1".
- **`commutative-algebra / flatness-ca` (0.20)** — blurb advertises flatness, fibre, family, geometric meaning, change of base; questions only mention criterion/exact/local.
- **`naive-set-theory / sets-functions` (0.22)** — blurb mentions injec/surjec/intersec/union/membership; only func ×1, subset ×1 in questions.
- **`algebraic-number-theory / number-fields-integers` (0.25)** — blurb advertises arithmetic/extension/finite/rings; questions repeat "integer ×5, algebraic ×2".

Low-but-not-flagged drift to spot-check: `homological / chain-complexes` (0.22), `schemes / projective-scheme` (0.25), `singular-cubics-reduction / kodaira-néron-preview` (0.25).

**Hint coverage:** 1087 / 2901 (37.5%) carry `hint`. 29 hints are <30 chars. Only 2 hints are duplicates of `explain` start. Hint shape across the sample is good — they pose a probing question rather than restate the prompt (`"Find the order of 2 in (Z/5)^×"`, `"Is x ∈ I? Is x ∈ √I?"`). The gap is presence, not quality. This is the single most leveraged v1 polish surface — the `generate-hints` skill exists precisely for this.

**Distractor sanity:** of 1815 MCQs, only 12 use bare-numeric choices like `["1","2","3","4"]`, and **every one of those 12** has the correct numeric answer mixed in among other plausible numeric values (`Φ_5` degree 4, choices {3,4,6,9}; counting 1-D irreps of $D_4$, choices {1,2,4,5}; $r_2(5)$ count; ramification-index count). No "1,2,3,4" laziness pattern.

## Widget headline findings

**Static-SVG drag is concentrated.** `audit-widget-interactivity`: 603 interactive / 62 static across 26 pages with ≥1 static. The static-heavy clusters are the recent advanced fan-out: `infinity-topoi` (7 static of 9), `algebraic-de-rham-cohomology` (5/8), `cocartesian-fibrations` (5/8), `group-schemes` (5/8), `deformation-theory` (4/7), `infinity-categories` (4/7) — same topics as the pedagogy review's bottom quartile. **Registry adoption is healthier than expected**: of 138 registered slugs, only **3 are fixture-only** (`branching-proof-scrubber`, `diagram-editor`, `julia-playground`) — they ship renderers and schemas but no topic wires them in. **127 of 135 used slugs are single-topic bespoke** — explained by the deliberate slug-per-section migration done in the recent commits (`b06c3da`, `42d18d5`, `71150bd`), where a topic-specific schema replaced inline HTML to enable param validation. The 6 truly-shared infrastructure slugs carry 90% of total instances: `button-stepper` (340 of 563 = 60%), `clickable-diagram` (100), `declarative-host` (22), `proof-scrubber` (19), `parametric-plot` (18), `clickable-graph` (10). **Gesture vocabulary is dominated by `click` (469 of 563 = 83%)**: scrub 18, slider 9, drag 8 — sliders and drags remain rare despite the renderer support. **12 topics still have zero registered widgets in `content/<topic>.json`** (the Combinatorics 5 + advanced fanout topics) — these are inline-only and uncounted by the registry.

## Widget interactivity summary

`audit-widget-interactivity` (regex over `addEventListener`, `oninput`, `onclick` across all topic HTML):

| bucket | count | share |
|---|--:|--:|
| Fully interactive (≥1 listener wire-up in body script) | 603 | 90.7% |
| Static SVG (no listeners detected) | 62 | 9.3% |

Top static-heavy pages, with the recommended action:

| page | total | static | typical issue |
|---|--:|--:|---|
| `infinity-topoi.html` | 9 | 7 | mostly `clickable-diagram` slugs that ship a static SVG with hover-tooltip CSS but no actual `addEventListener` wiring |
| `algebraic-de-rham-cohomology.html` | 8 | 5 | 7 of 8 widgets are bespoke `algebraic-de-rham-*` scrubbers; some never had pointer wiring |
| `cocartesian-fibrations.html` | 8 | 5 | bespoke `cocartesian-*` widgets — some are dictionary-style click toggles |
| `group-schemes.html` | 8 | 5 | bespoke widgets ship axiom diagrams as static SVG |
| `deformation-theory.html` | 7 | 4 | similar pattern |
| `infinity-categories.html` | 7 | 4 | similar pattern |
| `algebraic-curves-higher-genus.html`, `elementary-topos-theory.html`, `etale-fundamental-group.html`, `heyting-algebras-toposes.html` | 6 | 3 each | similar |

This is a focused, fixable list — 26 pages total, ~30 widgets that need a listener wire-up to graduate from "static figure" to "interactive toy".

## Per-section widget density + gesture mix

From `audits/coverage-stats.md` § "Per-subject", restated:

| section | topics | concepts | widgets | button-stepper share | gesture mix |
|---|--:|--:|--:|--:|---|
| Foundations | 1 | 5 | 4 | 25% | click 100% |
| Algebra | 14 | 121 | 129 | 32% | click 69%, scrub 8%, select 7%, interact 6% |
| Analysis | 9 | 116 | 92 | 51% | click 85%, slider 2%, unknown (inline) 13% |
| Geometry & topology | 8 | 49 | 50 | 68% | click 80%, drag 12%, static 4% |
| Number theory | 12 | 64 | 80 | 73% | click 79%, input 5%, interactive 3% |
| Modular forms & L-fns | 15 | 78 | 115 | 85% | click 85%, slider 5%, static 3% |
| Algebraic geometry | 19 | 109 | 126 | 48% | click 77%, interact 12%, scrub 6% |
| Combinatorics | 5 | 33 | 33 | (all inline) | unknown 100% |

**Modular forms & L-functions is the worst monoculture** (85% button-stepper across 15 topics). Number theory is close behind (73%). Algebra and Algebraic geometry diversified meaningfully via the recent slug-per-section migration. Combinatorics has 33 inline-only widgets that bypass the registry entirely.

## Underutilized widgets (zero or one consumer)

**Zero-consumer (fixture-only) — 3 slugs:**

- `branching-proof-scrubber` — proposed: this is a real upgrade over `proof-scrubber` for proofs with case splits. Candidate consumers: `quadratic-reciprocity / supplementary-laws` (proof-by-cases on $p \bmod 8$); `galois / fundamental-theorem-galois` (Galois correspondence has natural branch points); `commutative-algebra / nakayama` (statement bifurcates on whether $M$ is f.g.).
- `diagram-editor` — proposed: drag-and-toggle node editor. Best fit is a single capstone-quality landing widget on `category-theory` or `algebra` ("build your own commutative diagram"). If no clear use within 1 quarter, archive the renderer.
- `julia-playground` — proposed: clear fit on `dynamical-systems / julia-mandelbrot` (which currently uses a button-stepper). Wire and ship.

**Single-consumer with sibling-topic reuse opportunities** (selected from the 127):

- `modular-arithmetic-clock` — used in `quadratic-reciprocity` only. Natural reuse: `frobenius-and-reciprocity / cyclotomic-frobenius`, `class-field-theory / artin-symbol`, `galois / cyclotomic-extensions`.
- `lattice-visualizer` — used in `modular-forms`. Natural reuse: `theta-functions / theta-series-lattice`, `algebraic-number-theory / minkowski-bound`, `sums-of-squares / two-squares-theorem`.
- `parametric-plot` — used 18 instances but only across `analytic-continuation` (5) + `commutative-algebra` (9 fixture-style) + a handful. Underused on `complex-analysis`, `riemann-surfaces`, `dynamical-systems`, `theta-functions`.
- `recurrence-plotter` — used in `dynamical-systems` only. Natural reuse: `partitions-generating-functions`, `power-sums-bernoulli` (Bernoulli recursion).
- `inline-code-cell` — used in `p-adic-numbers` only. Natural reuse: `algebraic-number-theory` (norm/trace check), `quadratic-reciprocity` (Euler's criterion check), `sums-of-squares` (Jacobi formula check).
- `surface-viewer` — 6 instances across 2 topics. Natural reuse: `riemann-surfaces`, `riemannian-geometry / curvature`, `complex-analysis / riemann-sphere`.
- `counterexample-explorer` — used in `point-set-topology` + `infinity-topoi` + `group-schemes`. Strong fit on every "$X$ but not $Y$" concept (`measure-theory / vitali-set`, `commutative-algebra / non-noetherian`, `complex-analysis / weierstrass-counterexample`).
- `constraint-bifurcation-explorer` — used in `real-analysis` only. Natural fit on `dynamical-systems / bifurcations`, `commutative-algebra / specialization`.

The 100+ truly bespoke single-consumer slugs (the `algebraic-de-rham-*`, `cocartesian-fibrations-*`, `commutative-algebra-*`, etc.) are by-design — that's the registry-validation side of the migration. Accept them; they are not the problem.

## Concrete proposals (ranked, v1 + widget polish only)

1. **Close the hint gap on v1.** 1087/2901 (37.5%) carry hints. The `generate-hints` skill already exists for hard-tier; extend the same auto-derivation pass to **v1 questions where `explain` exists but `hint` does not** (~1500 candidates). High leverage, mostly mechanical.
2. **Wire listeners on the 62 static widgets across 26 pages.** Prioritise the 7 worst pages (`infinity-topoi`, `algebraic-de-rham-cohomology`, `cocartesian-fibrations`, `group-schemes`, `deformation-theory`, `infinity-categories`, `etale-fundamental-group`); ~30 widgets total, each is a short pointer-handler addition. `audit-widget-interactivity` is already a non-CI advisory — promoting it to a per-page warning would prevent regression.
3. **Diversify question types on the 38 mcq+numeric-only topics.** Target adding **one `multi-select` and one `ordering`/`spot-the-error`/`proof-completion` per topic** to the v1 tier. The 8 most-varied topics (`dynamical-systems`, `probability-theory`, `complex-analysis`, `etale-fundamental-group`, `category-theory`, etc.) are exemplars to copy from. Highest-priority targets by traffic: `naive-set-theory`, `differential-forms`, `riemannian-geometry`, `p-adic-numbers`, `elliptic-curves`, BSD/Sato-Tate/modularity capstones.
4. **Rewrite the 6 worst blurb-question alignment misses** (the bullets in the alignment section above): `measure-theory / lp-spaces`, `algebraic-topology / fundamental-group`, `power-sums-bernoulli / zeta-special-values`, `commutative-algebra / flatness-ca`, `naive-set-theory / sets-functions`, `algebraic-number-theory / number-fields-integers`. Each one is 6 questions; replace 2–3 of them so the bank actually probes what the blurb advertises.
5. **Reuse `modular-arithmetic-clock` on 3 number-theory topics.** Ship to `frobenius-and-reciprocity / cyclotomic-frobenius`, `class-field-theory / artin-symbol`, `galois / cyclotomic-extensions`. Same renderer, different params — the schema already supports it.
6. **Reuse `lattice-visualizer` on 3 lattice-flavoured topics.** Ship to `theta-functions / theta-series-lattice`, `algebraic-number-theory / minkowski-bound`, `sums-of-squares / two-squares-theorem`.
7. **Adopt `branching-proof-scrubber` on at least one proof-by-cases concept.** Best candidate: `quadratic-reciprocity / supplementary-laws` (the $p \bmod 8$ split is a textbook 4-branch case analysis). Removes the fixture-only stigma from the renderer.
8. **Wire `julia-playground` on `dynamical-systems / julia-mandelbrot`.** Replaces the existing button-stepper with a true gesture-rich widget. Fixture-only renderer becomes useful.
9. **Add a CI-light gate on the `construction` and `guess-my-rule` types.** They have 2 instances each — adopt **3 more `construction` instances** (best fit: `differential-geometry / geodesic-equation` "drop the marker on a geodesic", `complex-analysis / mobius-transformations` "fix the third anchor", `lie-groups / exponential-map`). Similarly for `guess-my-rule` on inductive concepts (`partitions-generating-functions`, `bernoulli`).
10. **Extend `audit-widget-interactivity` from advisory to PR-blocking.** The corpus is at 90.7%/9.3% interactive/static; gating new widgets at "must wire ≥1 listener" prevents the static-SVG concentration from spreading. Cost is small; the audit script already exists.

[quiz/widget reviewer]
