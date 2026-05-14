# forcing-and-independence — math-correctness audit (2026-05)

**Section:** Logic & Foundations
**Files audited:** `forcing-and-independence.html`, `concepts/forcing-and-independence.json`, `quizzes/forcing-and-independence.json`
**Scope:** every definition, theorem statement, forcing-relation claim, dense-set construction, cardinal-preservation argument, table entry in §5–§6, widget readout, concept blurb, quiz question + explanation. Specific focus per the audit prompt: generic-extension constructions, concrete forcing notions (Cohen / Laver / Mathias / Sacks / side-by-side), CH manipulations, Easton, MA / PFA / ◇ / □, named independence results (Suslin, Kurepa, Whitehead), Boolean-valued models.

## Severity
**Minor errors.** No outright wrong theorem on the central CH-independence proof; the construction, the truth lemma, and the cardinal-preservation arguments all check out. The defects are: (a) one quiz `explain` mis-attributes the iteration support used by Solovay–Tennenbaum (`countable-support` instead of `finite-support`); (b) the concept blurb for the side-by-side product writes the poset as the wrong Cartesian product; (c) the dependency-graph widget uses an arrow with a label asserting incompatibility, which inverts the implicational reading. Several of the prompt's checklist items (Laver / Mathias / Sacks forcings, Kurepa trees, PFA, □) are *not on this page* — Laver appears only in the supercompact-indestructibility row, the others are absent — so those boxes are inapplicable.

---

## Verified (correct as written)

These claims were each checked against Kunen *Set Theory* (1980/2011) and Jech *Set Theory* (3rd ed., 2003) standards:

### §1. Forcing posets and dense subsets
1. **Sign convention** (line 269 + note 271): `p ≤ q` ⇔ "p is stronger" (Cohen / Kunen). The disclaimer that other authors flip the order is correct and useful.
2. **Maximum element 1 = "no commitment"** (line 271). Standard.
3. **Cohen forcing $\mathbb P = 2^{<\omega}$** with extension order, root `⟨⟩`, two immediate extensions per node (line 273). Correct.
4. **Density definition** (line 275): `∀ p ∈ ℙ, ∃ q ∈ D, q ≤ p`. Standard.
5. **Compatibility / antichain / ccc** (line 289). All correct.
6. **Cohen forcing is ccc** (line 289). Correct — in fact $\mathbb P$ is countable, so it is trivially ccc; the page does not need the Δ-system lemma here, but the claim is sound.
7. **ccc preserves all cardinals** (line 289). Correct.
8. **Widget `bit2-equals-1` characterisation** (line 317): `s.length≥2 ∧ s[1]==='1'`. Note convention: "bit 2" is 1-indexed in the question label, mapped to the 0-indexed `s[1]` in the predicate. Internally consistent and correctly identified as dense (extend any short string by appending a '1' at position 2).
9. **Widget `length≥3` density** (line 318). Correct — every string can be padded.
10. **Widget `ends-in-01` density** (line 319). Correct — `p · "01"` is a length-`|p|+2` extension in $D$.
11. **Widget `differs-from-zero`** (line 320, predicate `s.indexOf('1')≥0`). Correctly encodes `D_s = {p : ∃ n, p(n) ≠ s(n)}` for `s = 000…`. The "extend by the bit opposite to s" remark gives the standard density witness.

### §2. Generic filters and the model M[G]
12. **Filter axioms** (line 393): upward-closed + downward-directed. Standard.
13. **M-generic ⇔ meets every dense $D ∈ M$** (display, line 395). Standard.
14. **Existence-of-G argument** (line 399): $M$ countable ⇒ countably many dense sets in $M$ ⇒ enumerate $D_0, D_1, \dots$ ⇒ pick $p_n \in D_n$ with $p_n \le p_{n-1}$ ⇒ upward closure of the chain is generic and lives outside $M$. Correct.
15. **$\mathbb P$-name evaluation** (line 412): $\dot x_G = \{\,\dot y_G : (\dot y, p)\in\dot x \text{ for some } p\in G\,\}$. Standard recursion.
16. **Three Cohen theorems** (line 414): generic exists, $M\subseteq M[G]$ and $G\in M[G]$, $M[G]\models$ ZFC. Correct (existence in $V$; transitivity + ZFC by recursion on names + the truth lemma).
17. **Generic-filter widget** (lines 441–566). Each $D_i$ is genuinely dense in $2^{<\omega}$ (every dense set listed is a length / pattern requirement that can be met by a finite extension), and the BFS in `extend()` deterministically picks the shortest extension witness. The chain `p_0 ≥ p_1 ≥ …` is descending in the strength order as required.

### §3. The forcing relation and truth lemma
18. **$p \Vdash \varphi$ semantic gloss** (line 573): "every generic G containing p makes φ true in M[G]." Correct as a slogan; the actual definition is the syntactic recursion inside $M$.
19. **Three properties** (line 575): Definability (per-formula schema, not a single global predicate — the page's slogan is acceptable), Monotonicity (`q ≤ p, p ⊩ φ ⇒ q ⊩ φ` under "≤ means stronger"), Density (`{p : p ⊩ φ ∨ p ⊩ ¬φ}` is dense). All standard and correctly stated.
20. **Truth lemma** (display, line 583): `M[G] ⊨ φ ⇔ ∃ p ∈ G, p ⊩ φ`. Standard.
21. **"$\mathbb 1$ forces every ZFC axiom" ⇒ $M[G] \models$ ZFC** (line 605). Correct shape of argument; the actual proof is one axiom at a time (Foundation, Pairing, Union, Power, Replacement, Choice each verified separately).
22. **Forcing-table widget** (lines 621–629). For atomic statements about specific bits of $r_G$, "p forces φ" reduces to "p has decided enough bits to settle φ", and each atom's predicate is correct:
    - `r(0) = 0` / `r(0) = 1`: forced by p iff `p[0]` is set, with the obvious value mapping.
    - `r(1) = 0`: forced by p iff `p.length ≥ 2`, with value mapping. (For `p = '0'` of length 1, returns `?` — correct: bit 1 is undecided.)
    - `r starts 11`: for `p = '0'` returns `F` (cannot extend to start with 11); for `p = '1'` returns `?` (could extend either way); for length ≥ 2, decides by prefix match. All cases correct.

### §4. Cohen forcing for adding reals
23. **Cohen real $r_G = \bigcup_{p \in G} p \in 2^\omega$** (display line 683). Correct (chain in $G$ of finite strings cofinal in length).
24. **$r_G \notin M$ via $D_s = \{p : \exists n, p(n) \ne s(n)\}$** (line 687). Correct — for fixed $s \in (2^\omega)^M$, $D_s \in M$ is dense (any $p$ extends to disagree with $s$ at the next position), and genericity forces $r_G \ne s$. The diagonalisation runs over every old real, so $r_G$ is new.
25. **Side-by-side poset $\operatorname{Fn}(\aleph_2 \times \omega, 2)$** (display line 705). Correct — finite partial functions, ordered by reverse inclusion (the standard "extension" order).
26. **ccc by Δ-system on finite supports** (line 710). Correct — the standard proof for finite-support products of ccc posets, applied to the finite-support product of $\aleph_2$ copies of Cohen forcing.
27. **ccc preserves cardinals and cofinalities** (line 710). Correct — both, by the standard "every name for a function $\omega \to \kappa$ has a countable range of possible values per input" argument.
28. **$|2^\omega|^{M[G]} \ge \aleph_2^{M[G]} > \aleph_1^{M[G]}$ ⇒ ¬CH** (line 712). Correct.

### §5. Independence of CH
29. **Five-step table** (lines 805–814): generic-extension theorem, ccc + Δ-system, density of `D_{αβ}` to distinguish reals, lower bound on the continuum, ¬CH. Each step is correct and uses the right tool name.
30. **Independence statement** (line 816): combines Gödel (CH consistent via $L$) and Cohen (¬CH consistent via forcing) ⇒ CH independent of ZFC. Correct, with correct dates (1940, 1963).
31. **König as the only ZFC constraint on $2^{\aleph_0}$** (line 841). Correct — `cf(2^{ℵ₀}) > ω` is the only theorem; everything else is consistent (Solovay for $\aleph_0$; Easton for general regular cardinals).
32. **Easton's theorem** (lines 841, 927). Correctly attributed to Easton (1970) and correctly described as the extension of the freedom-up-to-monotonicity-and-cofinality story to all regular cardinals.
33. **Aleph widget options** (lines 829–835): $\aleph_1$ (CH), $\aleph_2$ (Cohen), $\aleph_3$, $\aleph_{\omega+1}$ all correctly marked consistent (each has uncountable cofinality — successor cardinals always do); $\aleph_\omega$ correctly marked forbidden by König.

### §6. Other independence results and Martin's axiom
34. **Solovay–Tennenbaum 1971: MA + ¬CH consistent** (table line 945, body line 953). Correct (1971 paper; finite-support iteration of ccc forcings of length $\aleph_2$).
35. **Jensen: $V = L \Rightarrow$ ¬SH** (table line 944). Correct — $V = L \Rightarrow \diamondsuit_{\omega_1} \Rightarrow$ a Suslin tree exists. (The intermediate step via $\diamondsuit$ is implicit; the page's slogan is fine.)
36. **Whitehead problem independent (Shelah 1974)** (table line 946). Correct, with the correct directions: under $\diamondsuit$ (or $V = L$), every Whitehead group of cardinality $\aleph_1$ is free; under MA + ¬CH, a non-free Whitehead group of cardinality $\aleph_1$ exists.
37. **Laver indestructibility (1978)** (table line 948 + quiz `forcing-applications` Q3): a "Laver preparation" makes a supercompact $\kappa$ indestructible under any further $<\kappa$-directed-closed forcing. Statement and date correct.
38. **MA statement** (line 953): for every ccc poset $\mathbb P$ and every family $\mathcal D$ of $<2^{\aleph_0}$ dense sets, a filter meeting every $D \in \mathcal D$ exists. Standard.
39. **MA trivial under CH** (line 953). Correct — under CH, $<2^{\aleph_0} = \aleph_0$, and the Rasiowa–Sikorski lemma supplies the filter for any countable family.
40. **MA + ¬CH consequences** (line 955): SH, $2^{\aleph_0}$ regular, every Aronszajn tree special. All correct (each is a textbook MA${}_{\aleph_1}$ consequence).

### Quiz bank — verified
41. **`forcing-posets` Q1**: Cohen/Kunen convention `p ≤ q` ⇔ "p stronger". Correct.
42. **`forcing-posets` Q2**: density definition. Correct.
43. **`forcing-posets` Q3 (numeric)**: each finite binary string has 2 immediate length-(n+1) extensions. Correct.
44. **`forcing-generic-extensions` Q1**: $G$ meets every dense $D \in M$ (not "every dense $D$"). Correct. The "Baire-category-style diagonalization outside $M$" remark is a fair characterisation.
45. **`forcing-generic-extensions` Q2**: countability of $M$ ⇒ countably many dense sets in $M$. Correct, and the Löwenheim–Skolem provenance of the countable model is correctly mentioned.
46. **`forcing-generic-extensions` Q3**: $M[G]$ = smallest transitive model of ZFC containing $M \cup \{G\}$. Correct.
47. **`forcing-truth-lemma` Q1, Q2, Q3**: truth lemma, monotonicity, "$\mathbb 1$ forces every ZFC axiom". All correct.
48. **`forcing-cohen-reals` Q1**: $r_G = \bigcup G \in 2^\omega$, the Cohen real. Correct.
49. **`forcing-cohen-reals` Q2**: density of $D_s$ ⇒ $r_G \ne s$ for every $s \in (2^\omega)^M$. Correct.
50. **`forcing-cohen-reals` Q3**: side-by-side $\operatorname{Fn}(\aleph_2 \times \omega, 2)$ adds $\aleph_2$ many distinct reals while preserving cardinals via ccc. Correct, and the explanation correctly identifies $\aleph_2^M = \aleph_2^{M[G]}$.
51. **`forcing-not-ch` Q1**: Cohen 1963 ⇒ ZFC does not prove CH. Correct.
52. **`forcing-not-ch` Q2**: Gödel + Cohen attribution. Correct.
53. **`forcing-not-ch` Q3 (numeric)**: $2^{\aleph_0} = \aleph_2$ in Cohen's original model. Correct (the lower bound $\ge \aleph_2$ comes from the $\aleph_2$ distinct generic reals; the upper bound $\le \aleph_2$ comes from the nice-name count $|\mathbb P|^{\aleph_0} = \aleph_2^{\aleph_0} = \aleph_2$ in the CH-satisfying ground model).
54. **`forcing-applications` Q2**: MA characterisation. Correct.
55. **`forcing-applications` Q3**: Laver indestructibility. Correct.

---

## Wrong / dubious claims

- **MINOR — `forcing-applications` Q1 `explain` says "Solovay–Tennenbaum forced SH using countable-support iterated forcing"** (`quizzes/forcing-and-independence.json` line 212). **Wrong support.** Solovay–Tennenbaum (1971) used **finite-support** iteration of ccc forcings of length $\aleph_2$. Countable-support iteration is a Shelah-era technique (proper forcing, late 1970s onward) and would not preserve ccc as Solovay–Tennenbaum needed. The body of the page (line 945) correctly says "ccc iterated forcing of length $\aleph_2$" without specifying the support, so the error is localised to the quiz `explain`. Suggested fix: replace "countable-support" with "finite-support".

- **MINOR — concept blurb for `forcing-cohen-reals` writes the side-by-side poset as "$2^{<\omega} \times \aleph_2$"** (`concepts/forcing-and-independence.json` line 50). This notation reads as a Cartesian product of a poset and an ordinal, which is not the side-by-side Cohen poset. The actual side-by-side poset is either $\operatorname{Fn}(\aleph_2 \times \omega, 2)$ (finite partial functions, as the body of the HTML correctly writes at line 705) or equivalently the **finite-support** product of $\aleph_2$ copies of $2^{<\omega}$. Suggested fix: replace with `\operatorname{Fn}(\aleph_2 \times \omega, 2)` to match the body, or explicitly "the finite-support product of $\aleph_2$ copies of $2^{<\omega}$".

- **MINOR — dependency-graph widget arrow `lc → l` labelled "(incompatible with measurable)"** (line 990). The arrow direction encodes "implies / settles", per the widget's own legend ("arrows mean 'implies / settles'"). But the relation between large cardinals and $V = L$ is the *opposite* of implication: a measurable cardinal *contradicts* $V = L$ (Scott 1961). Drawing an arrow with an "incompatible" annotation inverts the implicational reading. The dashed style is meant to flag the irregular semantics, but the arrow geometry still suggests the wrong direction. Suggested fix: either replace the arrow with a barred edge (e.g. an `⊥` glyph or an X-marker), or flip it to point `l → lc` with the label "ruled out by measurable", or drop the edge and put the incompatibility into the `lc` node's `explain` text.

- **MINOR — Boolean-valued / topological-forcing claim is overstated** (line 1062): "A forcing poset $\mathbb P$ is the same data as a complete Boolean algebra of regular open sets in a topology." This is true *up to passage to the separative quotient and Boolean completion*, but a generic poset $\mathbb P$ is not literally "the same data" as a CBA — a non-separative $\mathbb P$ has strictly more redundancy than its $\operatorname{ro}(\mathbb P)$. The standard statement is: every poset $\mathbb P$ has a unique (up to isomorphism) Boolean completion $\mathrm{B}(\mathbb P) = \operatorname{ro}(\mathbb P)$, into which $\mathbb P$ embeds densely after collapsing the equivalence "$p \sim q$ iff every extension of $p$ is compatible with $q$ and vice versa". Two posets force the same statements iff they have the same Boolean completion. Suggested fix: insert "(up to dense embedding into the regular-open Boolean completion)" or hedge with "every separative forcing poset is canonically a dense subset of a complete Boolean algebra".

- **MINOR — SH wording in §6 table** (line 944): "every Suslin tree is countable". A Suslin tree is *defined* to be uncountable (an $\omega_1$-tree with no uncountable chain or antichain), so "every Suslin tree is countable" is vacuous-iff-true and reads as a contradiction in terms. The standard statement is "no Suslin tree exists" or equivalently "every ccc complete dense linear order without endpoints is order-isomorphic to $\mathbb R$" (which the quiz `forcing-applications` Q1 uses correctly). Suggested fix: replace with "no Suslin tree exists" to match Jech / Kunen and the quiz wording.

---

## Underspecified or unverifiable claims

- **§3 "Definability" property** (line 577): "The relation $\Vdash$ is definable in $M$." Strictly, there is no single $M$-definable predicate $\Vdash$ over all formulas (it would let $M$ define its own truth, by restricting to $p = \mathbb 1$ and the trivial poset, contradicting Tarski). The correct statement is *per-formula*: for each formula $\varphi(\dot x_1, \dots, \dot x_n)$ in the meta-language, the relation $\{(p, \dot x_1, \dots, \dot x_n) : p \Vdash \varphi(\dot x_1, \dots, \dot x_n)\}$ is uniformly $M$-definable from $\varphi$. The slogan version on the page is acceptable for an introductory page but worth a one-line caveat.

- **§3 forcing-table widget commentary** (line 663): "p ⊩ φ iff every q ≤ p has the bits to make φ true." This is the *atomic* case of the forcing recursion (and only correct for atoms about specific bit positions of $r_G$, which is what the widget displays). The general definition is by recursion: e.g. $p \Vdash \exists x\, \varphi(x)$ iff $\{q : \exists \dot x,\ q \Vdash \varphi(\dot x)\}$ is dense below $p$, and $p \Vdash \neg \varphi$ iff no $q \le p$ forces $\varphi$. The widget gloss is fine for the on-screen examples but is not the general definition.

- **Borel determinacy refinement row** (table line 947): "requires more than ZFC for higher pointclasses". *Borel determinacy itself* is a ZFC theorem (D. A. Martin 1975), and the famous Friedman result is that it requires the powerset axiom iterated $\omega_1$ times — i.e. it is essentially the strongest determinacy result provable in ZFC. The "higher pointclasses" hedge is correct (analytic determinacy needs $0^\#$; projective determinacy needs infinitely many Woodins) but the row's wording is vague enough to be uninformative. Suggested fix: split into two rows — "Borel determinacy: ZFC theorem (Martin 1975)" and "Projective determinacy: requires infinitely many Woodin cardinals".

- **Whitehead-row "under $\diamondsuit$: yes"** (table line 946). Strictly, $\diamondsuit_{\omega_1}$ implies that every Whitehead group of cardinality $\aleph_1$ is free; the unrestricted statement (every Whitehead group is free, of any cardinality) needs more work and is more delicate. The page's wording is fine for an overview.

- **Cohen-real "uniformly random bit" widget** (lines 786–793): the widget extends $p$ by a coin-flipped bit. This is a fair *Monte-Carlo* visualisation of "successive bits get committed", but it is *not* a generic-filter construction — actual genericity meets specific dense sets in $M$, not arbitrary random extensions. A generic real is in particular not measurable in any natural way. The widget caption does not mislead, but a one-line "this is a random walk visualisation; actual genericity meets enumerated dense sets" note would help.

- **Outro mentions PFA / MM / inner-model program** (line 1068) but provides no math beyond names. Acceptable for a connections section; the audit prompt's PFA-consistency checkbox is therefore not testable on this page.

- **Mathias / Sacks / Laver forcings as named forcing notions** (audit prompt). These are *not* discussed on the page beyond Laver in the supercompact-indestructibility row (which is about a Laver-style preparation iteration, not the Laver forcing for adding a dominating real). Sacks forcing (perfect-tree forcing for adding a real of minimal degree) and Mathias forcing (for almost-disjoint families and Ramsey ultrafilters) are absent. Not a math error — a coverage gap relative to the audit prompt.

- **Kurepa trees and □** (audit prompt). Not mentioned on the page. Coverage gap, not an error.

---

## Items checked by exhaustive case analysis

- **All four dense-set predicates in the §1 widget** (`bit2-equals-1`, `length≥3`, `ends-in-01`, `differs-from-zero`): each one is genuinely dense in $2^{<\omega}$ and the description's witness extension is the shortest one. ✓
- **All eight dense sets in the §2 widget** (`bit 0 = 1`, `length ≥ 2`, `ends in 01`, `length ≥ 5`, `bit 5 = 0`, `length ≥ 7`, `contains 110`, `length ≥ 9`): each is dense; the BFS-based `extend()` correctly finds a witness in $\le 14$ extension steps. ✓
- **All four atoms in the §3 forcing-table widget** (`r(0) = 0`, `r(0) = 1`, `r(1) = 0`, `r starts 11`): the verdict on each of the seven displayed conditions (`⟨⟩`, `0`, `1`, `00`, `01`, `10`, `11`) is correct, including the asymmetric handling of `r starts 11` for `p = '1'` (returns `?`, since `'10'` falsifies and `'11'` confirms). ✓
- **Five aleph slots in the §5 widget** (`ℵ₁`, `ℵ₂`, `ℵ₃`, `ℵ_{ω+1}`, `ℵ_ω`): consistency / König-forbidden classification matches the only ZFC constraint $\operatorname{cf}(2^{\aleph_0}) > \omega$. ✓

---

## Severity (final)

**minor errors** — no central theorem is misstated, no widget produces a wrong answer, and the CH-independence proof in §5 is rigorously correct. The defects are: a single quiz-explanation error attributing the wrong support to Solovay–Tennenbaum's iteration; a concept-blurb notation slip for the side-by-side poset; an inverted-arrow semantic in the dependency-graph widget; an over-strong "same data" claim in the Boolean-valued models paragraph; and a vacuous-by-definition phrasing of the Suslin Hypothesis in the §6 table. Easton, König, Cohen, Gödel, Solovay–Tennenbaum, Jensen ($\diamondsuit$ + Suslin), Shelah (Whitehead), and Laver (indestructibility) are each correctly attributed and dated. Coverage gaps relative to the audit prompt (Mathias, Sacks, Kurepa, PFA, $\square$) are flagged but are not errors.
