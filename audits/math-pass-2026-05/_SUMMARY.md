# Math content audit 2026-05 — section index

Per-topic mathematical-correctness audits. Each report verifies every formula, theorem statement, worked example, and factual claim on the page. Distinct from `audits/quality-pass-2026-05/` (which audited pedagogy: notation drift, jargon, tone, missing widgets).

**Severity scale:** `no issues` / `minor errors` (typos, normalization conventions) / `major errors` (wrong formulas, broken proofs, false claims).

## Section progress

| Section | Topics | Audited | Status |
|---|---:|---:|---|
| Logic & Foundations | 8 | 8 | complete (3 major, 5 minor) |
| Algebra & homological | 17 | 17 | complete (10 major, 5 minor, 2 clean) |
| Higher categories & toposes | 7 | 7 | complete (4 major, 3 minor) |
| Analysis | 22 | 0 | pending |
| Probability & statistics | 12 | 0 | pending |
| Geometry & topology | 26 | 0 | pending |
| Number theory | 19 | 0 | pending |
| Modular forms & L-functions | 20 | 0 | pending |
| Algebraic geometry | 35 | 0 | pending |
| Combinatorics & graph theory | 9 | 0 | pending |
| Mathematical physics | 11 | 0 | pending |
| Control theory & optimization | 4 | 0 | pending |
| **Total** | **190** | **32** | **17%** |

## Higher categories & toposes — math findings (7/7)

### Major (4)
- **`elementary-topos-theory`**: subobject classifier of G-Set claimed to be subgroups-with-conjugation (3 places — §6, §6 widget, quizzes); actually Ω = {0,1} with trivial G-action (the topos is Boolean). Plus wrong claim about subobjects of G/H via intermediate subgroups, and §6 widget displays subgroups as "subobjects of G" when they're not stable under regular left action.
- **`grothendieck-topologies-sites`**: §3 line 554 fpqc/fppf containment reversed (prose contradicts page's own quiz); μ_2 over F_2 misclassified as étale-locally constant (it's infinitesimal in char 2); sieve count 5 vs page's 4.
- **`infinity-categories`**: §6 Kan-extension widget Step 5 contradicts HTT 4.3.2.15 + page's own quiz (qualifier inverted on whether `i` fully faithful suffices); hard-tier quasi-category Q2 wrong answer key (claims pushout of two parallel edges has unfillable Λ²₁ — no such horn exists); §5 adjunction triangle SVG vertex labels swapped.
- **`cocartesian-fibrations`**: source/target eval-map cocart/cart classification reversed throughout (8+ locations). Per HTT/Kerodon: `ev_0` is cartesian, `ev_1` is cocartesian; page reverses. Plus §1 widget false equivalence on left fib characterization, and §6 "universal right fibration" wrongly identified with `ev_1` (it's `S_{*/}^{op} → S^{op}`).

### Minor (3)
- **`heyting-algebras-toposes`**: same G-Set Ω error from elementary-topos-theory (corpus pattern); §4 Kripke–Joyal scrubber convention inconsistency (covariant vs contravariant declared); §2 proof-scrubber Step 2 source-object wrong.
- **`simplicial-sets-and-nerve`**: §1 widget extras have cosimplicial identities `i,j` swapped relative to correct prose (verified false by direct computation); §5 horn widget captions confuse "right-cancellable" with "right-divisible"; line 414 has author "check the third identity" stub still shipped.
- **`infinity-topoi`**: 5 errors — Krull vs cohomological dim conflated for Spec(∏k_n); Brunerie/Ladelle attribution (Ladelle is fake); Lurie–Galois mis-cited at HTT 7.3 (actually Hoyois shape paper); 2 minor convention slips.

### Notable patterns continuing
- **G-Set Ω corpus bug**: same wrong claim in elementary-topos-theory AND heyting-algebras-toposes. (Like Hilbert 90 in Algebra section.)
- **Cocart/cart eval-map reversal**: propagates across 8 locations in cocartesian-fibrations (§3, §4, §7, §2 widget, multiple quizzes). Likely shared author convention bug.

## Algebra & homological — math findings (17/17)

### Clean (2)
- `category-theory`, `geometric-and-combinatorial-group-theory` (one minor widget reduction error in the latter).

### Major errors (10)
- **`algebra`**: 3 widget bugs — §13 invariant-factors widget violates d_1 | d_2 contract (n=72 example wrong); §15 semidirect classifier wrong cardinality formula (Z/4 × Z/2 = Z/4 instead of order 8); §18 S_4 lower central series listed `S_4, A_4, V_4, V_4` but actually stabilizes at A_4.
- **`representation-theory`**: §12 sl_2 capstone EF/FE formulas swapped (page even derives `H = FE - EF` with wrong sign); §9 induction widget Ind_{V_4}^{S_4}(𝟙) decomposition has dimensions summing > [S_4:V_4]=6.
- **`groebner-bases`**: §8 + quiz claim {t-x, y-x², z-x³} is the reduced lex GB of the twisted-cubic ideal — it's NOT (S-poly reduces to xy-z ≠ 0). Distractor describes union-of-curves as "surface".
- **`homological`**: 2 wrong quiz answers (H_1(D², S¹) recorded as 1, correct 0; |ker δ| in snake-lemma question 4 vs correct 1); §9 widget Q/Z ⊗ Z/n returns Z/n (correct: 0).
- **`derived-categories`**: §5 RF widget step-6 LES wrong (missing Ext¹(Z/2, Z) middle term); plus 3 minor.
- **`group-cohomology`**: 3 errors — Hilbert 90 widget gives wrong α (off by inversion); periodic-table note false ($H^{2k+1} ≠ 0$ for trivial action); LHS spectral seq C3⋊S3 over F_3 case wrong on column 0.
- **`lie-algebras`**: §2 ad(f) matrix wrong (rows swapped — gives nilpotent claim with eigenvalue 2); §6 attributes "27 lines on cubic surface" to E_7 (it's E_6; E_7 ↔ del Pezzo / 28 bitangents).
- **`galois-cohomology-and-brauer`**: Hilbert 90 widget sign-inversion bug (same root cause as group-cohomology).
- **`quantum-groups`**: §4 weight-basis E,F formulas inconsistent with [E,F] relation; direct check on V_1 fails.
- **`cluster-algebras`**: 3 quiz bugs — cyclohedron attributed to D_n (it's B/C); E_6,7,8 cluster *variable* counts (42/70/128) labeled as cluster (seed) counts (correct: 833/4160/25080); projective decomposition explanation muddled.

### Minor errors (5)
- **`commutative-algebra`** quiz: associated-prime count for k[x,y,z]/(x²,xy,yz,z²) listed as 1; correct is 2 (minimal (x,z) + embedded (x,y,z)).
- **`algebraic-k-theory-foundations`**: claim SK_1(Z[t,t^{-1}]) ≠ 0 is false (= 0 by Bass-Heller-Swan); suggested replacement: SK_1(Z[Q_8]).
- **`model-categories`**: §1 lifting widget uses z²: S¹→S¹ as a Quillen cofibration (it's not — covering map, not injective); contradicted by widget's own §2 classification. Plus quiz over-claim about kernel-projective.
- **`condensed-mathematics`**: 7 small wording slips, headline being LTE date inconsistency (May 2022 prose vs May 28, 2021 in code).
- **`quaternions-octonions-and-division-algebras`**: line 344 sign error in conjugation-via-dot-product formula; line 589 wrong octonion non-associativity example (uses an associating triple).

### Notable patterns
- **Hilbert 90 widget shared bug**: Same off-by-inversion bug (`α = 1+β` doesn't satisfy `σ(α)/α = β` for norm-1 β; correct is `α = 1/(1+β)`) appears in BOTH group-cohomology AND galois-cohomology-and-brauer §1 widgets — same author convention propagated. Worth a corpus-wide fix.
- **Quiz answer correctness** is the most common failure mode (commutative-algebra associated primes, homological 2 questions, cluster-algebras 3 questions, model-categories Q3, model-theory-basics EF-rank from L&F section). Suggests a separate "quiz answer key audit" pass would be high-value.

## Logic & Foundations — math findings (8/8)

### Major errors (3 topics)
- **`zfc-and-ordinals`**: (1) `(ω²)^(ω²)` calculator gives `ω^(ω²·2)`, correct is `ω^(ω²)`; (2) "2^aleph_0 at most aleph_{omega+1}" claim is **false** (Easton's theorem makes it consistently any cardinal of uncountable cofinality); (3) Grothendieck universe definition missing pairing-closure axiom (`{x,y}∈U`).
- **`model-theory-basics`**: (1) §4 types widget arithmetic broken (claims |S₁(A₀)|=2n+1 with n+1 omitted, but realized + omitted > total; (Q,<) over finite A₀ realizes ALL types); (2) **wrong quiz answer**: EF-rank for ({1,2,3},<) vs ({1,2,3,4},<) recorded as 1, correct is 2 (`min(m,n) ≥ 2^k − 1`); (3) §5 connectivity-not-FO note uses linear cycle sizes for n-round EF (must be exponential); (4) §5 EF widget Spoiler-wins branch is a tautology, not a separator.
- **`computability-and-decidability`**: (1) TM-increment widget labels all inputs "LSB-first" but the transition table implements MSB-first arithmetic — every example label is wrong; (2) "Multitape, two-counter, two-stack, RAM, NDTM all simulate one another with **polynomial overhead**" — two-counter (Minsky) is exponential; DTM-sim-NDTM is the open P=NP question; (3) First-incompleteness needs Σ₁-soundness for "true Σ₁" conclusion, not just consistency.

### Minor errors (5 topics)
- **`naive-set-theory`** line 1019: well-ordering theorem glossed as "no infinite descending chain" (well-founded definition); only AC-equivalent under (countable/dependent) choice.
- **`first-order-logic-and-completeness`** §7: Q_p QE language stated as "language of valued fields"; actually requires Macintyre language with P_n-predicates.
- **`complexity-theory`** SAT widget line 568: "satisfying witness" button uses w=(1,1,1,1) which makes C₄=(¬x₂∨¬x₃∨¬x₄) false → widget displays "rejected" while button claims "satisfying". A real satisfying assignment is e.g. (1,1,0,0).
- **`type-theory-and-hott`**: path-space widget conflates definitional with propositional equality at line 720; wrong reason given for univalence in simplicial model in `tt-models` blurb.
- **`forcing-and-independence`**: (1) Solovay–Tennenbaum used **finite**-support iteration, not countable-support; (2) Cohen poset blurb writes `2^<ω × ℵ_2`, should be `Fn(ℵ_2×ω, 2)`; (3) Boolean-valued model claim "P = CBA" needs separative-quotient + completion; (4) §6 "every Suslin tree is countable" is vacuous (should be "no Suslin tree exists").
