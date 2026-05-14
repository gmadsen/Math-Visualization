# model-theory-basics — math-correctness audit (2026-05)

**Section:** Logic & Foundations
**Files audited:** `model-theory-basics.html`, `concepts/model-theory-basics.json`, `quizzes/model-theory-basics.json`
**Scope:** every theorem statement, formula, worked example, type-count, EF-game claim, transfer principle, and quantifier-elimination claim.

## Severity
**Major errors present.** Two outright wrong claims (one in a widget readout, one in a numeric quiz answer + its `explain`), plus several underspecified statements. The Łoś / ultraproduct / NIP / o-minimal classifications named in the audit prompt are *not on this page* — the page only covers structures, elementary equivalence, types/saturation, EF games, and ACF/Lefschetz/Ax–Grothendieck — so those checkboxes are inapplicable.

---

## Verified (correct as written)

These claims were checked carefully and are mathematically sound:

1. **Definitions.** Signature, structure, atomic-formula interpretation (§1, lines 269–287). Standard.
2. **Elementary equivalence definition** (§2 box, line 514): `𝔄≡𝔅 ⟺ Th(𝔄)=Th(𝔅)`. Standard.
3. **DLO is complete; (Q,<) ≡ (R,<)** (lines 518, 675–678). Correct — DLO is a textbook complete theory (Cantor + Vaught test).
4. **Cantor's theorem (back-and-forth, 1895)** (line 698): "any two countable DLOs without endpoints are isomorphic; DLO is ℵ₀-categorical." Statement, attribution, and date all correct.
5. **Coincidence theorem (finite case)** (line 694): "for finite structures over a finite signature, ≡ ⟺ ≅." Correct, and the page explicitly includes the *finite signature* hypothesis. (The concept-graph blurb omits this caveat; see Underspecified §1.)
6. **EF Theorem statement** (line 1004): Duplicator wins n-round game iff 𝔄 and 𝔅 agree on every sentence of quantifier rank ≤ n. Standard (Fraïssé 1954 / Ehrenfeucht 1961). Quantifier rank = max nesting depth of ∀/∃. Both correct.
7. **Type / saturation definitions** (§4 boxes, lines 845, 853): complete n-type = maximal consistent set of formulas with parameters from A₀; ω-saturated = every type over a *finite* parameter set is realised. Correct.
8. **Compactness ⇒ every type realised in some elementary extension** (line 847). Correct.
9. **Non-realised type example** in (Q,<) (lines 849–851): `p(x)={x>q : q∈Q}` is consistent (every finite subset has a witness), is omitted in (Q,<), and is realised in some elementary extension ("point at infinity"). Correct, modulo terminology slip — this is a *partial* type / a 1-type that extends uniquely to a complete type (the "+∞ type"); the page's looseness here is acceptable in an introductory context.
10. **(N,<) ≢ (Z,<)** (concept blurb `mt-isomorphism-vs-equivalence`): N has a minimum, Z doesn't — first-order separable. Correct.
11. **ACF_p is complete** (line 1213). Correct (Tarski / Robinson; consequence of QE + categoricity in uncountable powers).
12. **ACF admits quantifier elimination** (line 1213). Correct (Tarski). Atomic formulas in the ring language are polynomial equations p(x̄) = 0, so QE = "every formula is Boolean combination of polynomial equations" is the right phrasing.
13. **Lefschetz principle (model-theoretic form)** (line 1215): φ holds in C iff φ holds in F̄_p for all but finitely many primes p. Correct.
14. **Lefschetz proof sketch** (line 1217): if φ holds in C but fails in F̄_p for infinitely many p, then ACF_0 ∪ {¬φ} ∪ {char≠p : p prime} is consistent by compactness, contradiction. Correct (modulo the "char≠p" sloppy notation — the actual axioms are 1+1+⋯+1 ≠ 0 for each n, but the meaning is unambiguous).
15. **Ax–Grothendieck theorem statement** (line 1221): every injective polynomial map C^n → C^n is surjective. Correct (Ax 1968 / Grothendieck EGA IV).
16. **Ax–Grothendieck reduction** (lines 1224–1228, and Ax-transfer widget): F̄_p = ⋃ F_{p^k}; coefficients of any fixed-degree polynomial map lie in some F_{p^k}; injective map between equal-size finite sets is bijective; transfer to C via Lefschetz. The argument is correct and complete.
17. **ACF_0 is uncountably categorical, not ℵ₀-categorical** (quiz `mt-applications-to-algebra` Q1 `explain`): correct, Steinitz reason given is right (transcendence degree determines isomorphism type).
18. **Model-completeness ⇐ QE** (quiz `mt-applications-to-algebra` Q3): correct implication. (Page §6 only ever discusses "complete," never "model-complete" in body prose; the term appears in the concept blurb and the quiz only — see Underspecified §3.)
19. **Quizzes that are correct as stated:** `mt-structures` Q1 (ring signature), Q2 (16 binary relations on a 2-element set), Q3 (which sentence holds in 1<2<3); `mt-elementary-equivalence` Q1 (definition), Q2 ((Q,<) ≡ (R,<)); `mt-isomorphism-vs-equivalence` Q1 (finite case), Q2 ((Q,<) vs (R,<) example), Q3 (one isomorphism class of countable DLO); `mt-types-and-saturation` Q1 (complete-type definition), Q2 ((Q,<) "point at infinity" type), Q3 (DLO has 1 complete 1-type over ∅); `mt-ehrenfeucht-fraisse` Q1 (EF theorem statement), Q3 (connectivity not FO); `mt-applications-to-algebra` Q1, Q2, Q3 (all three).

---

## Wrong (must fix)

### W1 — §4 widget: types over a finite parameter set in (Q,<) are NOT omitted as "Dedekind cuts"
**Location:** `model-theory-basics.html` lines 935–937, 942–950, 961, 966–968 (the `Types over a parameter set in (Q,<)` widget).

The widget claims that for a finite parameter set A₀ = {a₁,…,a_n} ⊂ Q, the type space S₁(A₀) over (Q,<) splits as

> `|S₁(A₀)| = 2n+1`, of which `n` are algebraic (`x = aᵢ`), `n+1` are open-interval types (realised), **and `n+1` are "Dedekind-cut types" omitted in (Q,<)**.

This is mathematically wrong for two compounding reasons.

- **The arithmetic doesn't add up.** The widget computes `realised = nParams + nIntervals = n + (n+1) = 2n+1` and `omitted = n+1`, then displays `|S₁(A₀)| = 2n+1`. Realised + omitted = 3n+2 > total = 2n+1. The "cut types" are being double-counted as a separate category outside the 2n+1.
- **Substance: (Q,<) is ω-saturated, so over any finite A₀, every type in S₁(A₀) IS realised.** The complete 1-types in DLO over n parameters are exactly the 2n+1 listed (n algebraic + (n−1) bounded open intervals + 2 unbounded ends), and (Q,<) realises all of them — because between any two rationals there is a rational, and Q is unbounded above and below. Zero types are omitted. This is *the textbook example of an ω-saturated structure of cardinality ℵ₀.*

The "Dedekind-cut" types the widget is reaching for live in S₁(Q) — i.e., types over the *infinite* parameter set Q itself — not in S₁(A₀) for finite A₀. Over the infinite set Q one *does* get cut types like `{x > q : q < √2} ∪ {x < q : q > √2}` that are omitted in (Q,<) and realised only in proper elementary extensions (e.g. R, or non-standard models of DLO). Conflating S₁(A₀) (A₀ finite) with S₁(Q) is the error.

The widget's narration text "(Q,<) is ω-saturated for 'open' types but omits cut types" (line 966) reinforces the confusion: a fully ω-saturated structure realises *every* type over every finite set. There is no qualifier "for open types only."

The widget's hint at line 935 — "in DLO over a set of n parameters, |S_1(A)| = 2n+1 with n+1 of them omitted as Dedekind cuts at the endpoints" — is wrong: the count 2n+1 is right, the "n+1 omitted" claim is wrong.

**Correct statement:** In (Q,<), every complete 1-type over a finite parameter set A₀ ⊂ Q is realised; |S₁(A₀)| = 2|A₀| + 1 and *all* of these types are realised. To exhibit an omitted type one must pass to types over an infinite parameter set (Dedekind cuts in Q give such types in S₁(Q)).

### W2 — Quiz `mt-ehrenfeucht-fraisse` Q2: wrong answer to the EF rank for ({1,2,3},<) vs ({1,2,3,4},<)
**Location:** `quizzes/model-theory-basics.json`, `mt-ehrenfeucht-fraisse` Q2 (numeric, `answer: 1`, lines 165–170).

The question asks for the largest n such that Duplicator wins the n-round EF game on (3-element linear order) vs (4-element linear order). The recorded answer is **1**. The correct answer is **2**.

**Standard fact** (e.g. Libkin, *Elements of Finite Model Theory*, Thm 3.6; Rosenstein, *Linear Orderings*): for finite linear orders of distinct sizes m < n, Duplicator wins the k-round EF game iff `min(m,n) ≥ 2^k − 1`. For m = 3 (k=2): 2² − 1 = 3 ≤ 3 ✓ — Duplicator wins. For k = 3: 2³ − 1 = 7 > 3 — Spoiler wins.

Equivalently the EF-rank of ({1,…,m}, <) vs ({1,…,n}, <) for m < n is `⌊log₂(m+1)⌋`; for m=3 this gives ⌊log₂ 4⌋ = 2.

**Concrete Duplicator strategy at round 2:** Whatever Spoiler picks (say x in B), Duplicator picks the element of A in the "matching position" — same number of elements strictly below and strictly above (with overflow rounding sensibly). On round 2 Duplicator preserves order locally. After 2 rounds the partial map is order-preserving in both directions.

**Spoiler win at round 3:** Spoiler picks 3 distinct elements in B forcing a configuration not realisable in the smaller A (e.g. successive elements 1,2,3 in B all having a successor — in A only 1,2 have a successor and they themselves don't form a length-3 ascending chain of "elements with successors").

The `explain` text — "With 2 rounds Spoiler picks the largest element in 𝔅, then the second-largest; in 𝔄 Duplicator runs out of distinct space" — is itself the error: Duplicator can match (largest, second-largest) → (largest, second-largest) in A, since both A and B have ≥ 2 elements with a maximum and a unique predecessor. This trivially preserves order. The hint stem "a sentence of quantifier rank n can count up to roughly 2^n elements; here a rank-2 sentence already separates them" is also misleading — a rank-2 sentence over linear orders separates sizes ≥ 2² = 4 from sizes < 4, but 3 < 4 is the boundary case where size 3 vs 4 are *not* separated at rank 2 (only at rank 3).

Required fix: change the answer to **2** and rewrite the `explain` to give a Duplicator strategy at round 2 plus a Spoiler win at round 3.

### W3 — Cycle EF-game claim in §5 has the parameters off by an exponential
**Location:** `model-theory-basics.html` line 1008 (the "Application: connectivity is not first-order" `note` box).

The page says:

> Take 𝔄 = C_{2n+1} (one cycle of length 2n+1, connected) and 𝔅 = C_n ⊔ C_{n+1} (two cycles, disconnected). For n rounds Duplicator can mirror Spoiler's moves locally — distances of order ≤ 2^n are visible to a rank-n formula, but the global topology isn't.

The two halves of this sentence are inconsistent. If "distances of order ≤ 2^n are visible to a rank-n formula" (which is correct: a rank-n formula can recognise distance ≤ 2^n − 1 in a graph), then the cycles must have *exponentially* larger circumference than n for Duplicator to survive n rounds. But the chosen cycles `C_{2n+1}` and `C_n ⊔ C_{n+1}` have linear (in n) circumference — at rank ≈ log₂(n), Spoiler can already detect a path of length n, distinguishing connected from disconnected.

**Standard correct example** (Libkin ch. 3, Ebbinghaus–Flum *Finite Model Theory* ch. 2): take cycles of length ≥ 2^k or 3·2^k to defeat the k-round game. Variants in the literature use C_{2^n} vs C_{2^n} ⊔ C_{2^n}, or `C_m vs C_m ⊔ C_m` with `m ≥ 2^{k+1}`, etc. The point is that the cycle length must be exponential in the number of rounds k.

The page's `n` is overloaded between "round count" and "cycle length parameter," which is the root of the bug. The fix is to rename: e.g.

> Take 𝔄 = C_{3·2^k} and 𝔅 = C_{3·2^k} ⊔ C_{3·2^k}. Duplicator wins the k-round EF game on 𝔄 vs 𝔅 (the local 2^k-balls around any chosen point look identical), so no rank-k sentence separates connected from disconnected. Letting k → ∞ shows connectivity is not first-order.

The conclusion ("connectivity isn't first-order") is correct; only the parameter encoding of the EF-argument is wrong.

### W4 — §5 EF-game widget readout exhibits a non-formula and a non-separator
**Location:** `model-theory-basics.html` line 1167 (`mt-ehrenfeucht-fraisse` widget readout, "Spoiler wins" branch).

When Spoiler wins, the widget claims:

> one such sentence: `∃x∃y(x<y ∧ ∀z(z<x ∨ z=x ∨ x<z<y ∨ z=y ∨ y<z))` — "there is an adjacent pair", which holds in {1,2,3} but the witness pattern in B is different.

Two issues:

- **The string `x<z<y` is not a formula** in the FO language `{<}`. It is a chained-comparison shorthand from informal mathematics, not first-order syntax. The intended formula `x < z ∧ z < y` should appear with explicit conjunction.
- **Even after that fix, the resulting sentence is not a separator.** Reading the displayed disjunction as `z ≤ x ∨ x < z < y ∨ z ≥ y` (i.e. "every z is below x, between x and y, or above y") together with `x < y` says "there exist x < y" — no constraint on adjacency, since the disjunction is a tautology over a linear order whenever x < y. (The disjuncts cover all cases trichotomously.) So the displayed sentence holds in *every* non-empty linear order with ≥ 2 elements, and in particular both ({1,2,3},<) and ({1,2,3,4},<) — it is not a separator.

To express "there is an adjacent pair" the intended formula is

`∃x ∃y (x < y ∧ ∀z (z ≤ x ∨ y ≤ z))`

(no element strictly between x and y). This holds in *both* ({1,2,3}, <) and ({1,2,3,4}, <) — every finite linear order of length ≥ 2 has adjacent pairs — so it is also not a separator. So the widget's choice of "adjacent pair" as the alleged separator is doubly wrong. (Compare: a real rank-2 separator between sizes 3 and 4 *does not exist* — see W2; size 3 and size 4 agree on all rank-2 sentences.)

Required fix: rewrite the readout to either drop the alleged "explicit separator" or replace it with a true rank-3 separator (if the widget is reframed as rank-3), e.g. `∃x∃y∃z(x<y ∧ y<z ∧ ∃u(z<u))` — "there is an ascending chain of length 4" — which holds in size 4 and fails in size 3. (That sentence has quantifier rank 2, actually — ∃x∃y∃z∃u φ_qf is rank 1, but `∃u(z<u)` nested inside gives rank 2. To get a rank-3 separator one needs deeper nesting; see standard references.)

---

## Underspecified (not wrong, but incomplete or imprecise)

### U1 — Concept blurb `mt-isomorphism-vs-equivalence` omits "finite signature"
`concepts/model-theory-basics.json` line 40: "For finite structures the two notions coincide: 𝔄≡𝔅 implies 𝔄≅𝔅, since the size and complete diagram pin down the isomorphism class."

The page body (line 694) correctly includes "over a finite signature" as a hypothesis. The concept blurb drops it. With an infinite relational signature (one new unary predicate per element) two finite structures of the same cardinality can be elementarily inequivalent. In the model-theoretic standard convention of countable signatures this is harmless, but the blurb is more precise on the page.

### U2 — `quiz mt-types-and-saturation` Q2 calls a partial type a "type"
The set `p(x) = {x > q : q ∈ Q}` is a *partial* type / set of formulas — it is consistent and extends uniquely to a complete type (the "+∞ type" over Q). The question and explain refer to it as "the type." This is harmless usage but pedagogically slips between "type" (often = complete) and "partial type" (any consistent set).

### U3 — Concept blurb `mt-applications-to-algebra` calls ACF "model-complete" but page body never uses the term
Page body §6 talks only about completeness of ACF_p. Quiz Q3 introduces "model-complete" and equates it with "every embedding between models is elementary." Concept blurb opens with the same phrase. In the body of §6 the term "model-complete" never appears — the reader reaches the quiz with the term undefined on this page. (FOL prereq does not define it either.) Either define model-completeness in §6 or weaken the quiz to use plain "complete + QE."

The Q3 `explain` paraphrases model-completeness as "every formula is equivalent to an ∃-formula whose existential witness, if it exists in any model, exists in any extension." The standard Robinson criterion is "every formula is equivalent to a Π₁-formula" *and* equivalently "every formula is equivalent to a Σ₁-formula." Saying *only* "every formula is equivalent to a ∃-formula" is strictly weaker than model-completeness — that one-sided property is just preservation under extensions and would not by itself give that embeddings are elementary. The explain is sloppy but in the right neighbourhood.

### U4 — "Cantor's theorem says every countable DLO is ω-saturated" (line 855) is anachronistic
What's true: DLO is ℵ₀-categorical, so its (unique) countable model is ω-saturated. Cantor's 1895 theorem proves the categoricity (isomorphism). Calling the saturation conclusion "Cantor's theorem" elides the saturation/categoricity bridge (Vaught) but is harmless.

### U5 — Quiz `mt-elementary-equivalence` Q3 ("count of theories of finite linear orders") uses `0` to mean "infinity"
The numeric question expects `0` as a sentinel for "unbounded," with an `tol_note` explaining the convention. Mathematically, the count is countably infinite. This is a UI/quiz-design issue rather than a math error, but readers who type `∞` or `infinite` (cannot — numeric input) or `1000` will fail. Internal `tol_note` field is a known author-side workaround, not a real fix.

### U6 — §5 `note` box conflates "first-order definable" properties on graphs
"The other three are FO-definable: count vertices, count edges in a triangle, count neighbours." (Quiz `mt-ehrenfeucht-fraisse` Q3 explain.)

- "Has at least 5 vertices" — definable: `∃x₁…x₅(⋀_{i≠j} xᵢ≠xⱼ)`. ✓
- "Contains a triangle" — definable: `∃x∃y∃z(E(x,y)∧E(y,z)∧E(x,z)∧x≠y∧y≠z∧x≠z)`. ✓
- "Every vertex has degree exactly 2" — definable in FO over `{E}` *with equality* by saying "for every x there exist y,z with y≠z, E(x,y), E(x,z), and for every w, E(x,w) → w=y∨w=z." ✓

So "the other three are FO-definable" is correct. The phrase "count neighbours" is loose (FO can fix any constant degree, but not "even degree" or "the same degree as another vertex" without parameters); for *exact* fixed degree it works. ✓

### U7 — Page omits the prerequisite assumption of "finite signature" for the model-theoretic Lefschetz statement
Lefschetz holds for sentences in the *language of rings* — a finite language. The page never specifies the language explicitly in the box (line 1215 says "first-order sentence φ in the language of rings" — actually it does, never mind). ✓ — already correctly stated.

---

## Out of scope for this page (named in the audit prompt but not on the page)

The audit prompt asks about Łoś's theorem, ultraproduct constructions, Tarski–Vaught test, omitting types theorem, NIP / stable / simple / o-minimal classification, theory of real closed fields, ACF of characteristic p (the page covers "ACF_p is complete" but not the QE construction at characteristic p specifically), and saturation back-and-forth arguments.

**None of these appear on `model-theory-basics.html`.** The page is a starter ("Model theory basics"); it covers structures, ≡, types, EF games, and the Lefschetz/Ax–Grothendieck application. So the corresponding correctness checks are vacuously not applicable here.

If the project wants those classifications audited, they would belong to a follow-on `model-theory-stability.html` / `o-minimality.html` / `ultraproducts.html` topic — none of which currently exists.

---

## Summary of required edits

| # | File | Change |
|---|------|--------|
| W1 | `model-theory-basics.html` (lines ~935, 961, 966–968) | Type-space widget: drop the "n+1 cuts omitted in (Q,<)" claim entirely; clarify that for finite A₀ all 2n+1 types are realised in (Q,<), and that omitted types appear only when A₀ is infinite (Dedekind cuts in S₁(Q)). |
| W2 | `quizzes/model-theory-basics.json` (`mt-ehrenfeucht-fraisse` Q2) | Change numeric answer from 1 to 2. Rewrite `explain` with a Duplicator strategy at round 2 and a Spoiler win at round 3. Adjust the hint about quantifier rank vs size accordingly. |
| W3 | `model-theory-basics.html` (line 1008, "Application: connectivity is not first-order" note) | Rename the EF-rounds variable away from `n`; use cycles of length exponential in the round count (e.g. C_{3·2^k} vs C_{3·2^k} ⊔ C_{3·2^k} for k rounds). |
| W4 | `model-theory-basics.html` (line 1167, EF widget Spoiler-wins branch) | Replace the bogus "adjacent pair" sentence with a real separator, or drop the explicit-formula sentence and just say "Duplicator's failure exhibits a rank-2 separator." Use `∧` not chained `<`. (Also note: per W2 there is no rank-2 separator on sizes 3 vs 4; consider removing this branch entirely or moving the widget to a 3-round setting.) |
| U1 | `concepts/model-theory-basics.json` (`mt-isomorphism-vs-equivalence` blurb) | Add "over a finite signature" hypothesis. |
| U3 | `quizzes/model-theory-basics.json` (`mt-applications-to-algebra` Q3) | Tighten `explain` — model-completeness is "every formula is equivalent to a Σ₁ formula AND a Π₁ formula"; or just cite Robinson's criterion. |

W1 and W2 are the load-bearing fixes (a wrong widget claim about saturation, and a wrong quiz answer with a wrong supporting argument). W3 and W4 are localised text errors in informal prose / widget readouts — incorrect-as-written but the surrounding section's main claim (connectivity not FO; EF games measure rank-n indistinguishability) remains true.
