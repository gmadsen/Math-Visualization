# Math content audit 2026-05 — section index

Per-topic mathematical-correctness audits. Each report verifies every formula, theorem statement, worked example, and factual claim on the page. Distinct from `audits/quality-pass-2026-05/` (which audited pedagogy: notation drift, jargon, tone, missing widgets).

**Severity scale:** `no issues` / `minor errors` (typos, normalization conventions) / `major errors` (wrong formulas, broken proofs, false claims).

## Section progress

| Section | Topics | Audited | Status |
|---|---:|---:|---|
| Logic & Foundations | 8 | 8 | complete (3 major, 5 minor) |
| Algebra & homological | 17 | 0 | pending |
| Higher categories & toposes | 7 | 0 | pending |
| Analysis | 22 | 0 | pending |
| Probability & statistics | 12 | 0 | pending |
| Geometry & topology | 26 | 0 | pending |
| Number theory | 19 | 0 | pending |
| Modular forms & L-functions | 20 | 0 | pending |
| Algebraic geometry | 35 | 0 | pending |
| Combinatorics & graph theory | 9 | 0 | pending |
| Mathematical physics | 11 | 0 | pending |
| Control theory & optimization | 4 | 0 | pending |
| **Total** | **190** | **8** | **4%** |

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
