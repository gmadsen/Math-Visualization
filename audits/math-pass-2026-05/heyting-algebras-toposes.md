# heyting-algebras-toposes — math-correctness audit (2026-05)

**Section:** Higher categories & toposes
**Files audited:** `heyting-algebras-toposes.html`, `concepts/heyting-algebras-toposes.json`, `quizzes/heyting-algebras-toposes.json`
**Scope:** every Heyting-algebra axiom, every concrete HA computation (5-element open-set lattice, $\mathbb{R}$-opens), all $\Omega$-construction claims, the Mitchell–Bénabou dictionary, the Kripke–Joyal forcing clauses (presheaf and sheaf), the LEM-failure case library, the geometric-fragment preservation table, every quiz question + explanation, every concept blurb. Specific focus per the audit prompt: HA axioms, specific HAs (open sets / distributive lattice without complementation), Boolean vs Heyting distinction, Kripke semantics for IPC, internal HA in a topos = $\mathrm{Sub}(X)$ structure, Glivenko's theorem, HA structure of $\mathrm{Sub}(X)$ in a topos.

## Severity
**Minor errors with one concrete factual mistake about $\Omega$ in $G$-Set, plus a convention-direction inconsistency between two widgets.** No errors in the central HA axioms, the $\mathbb{R}$-opens computations, the Mitchell–Bénabou dictionary, the geometric-fragment table, Diaconescu's theorem, the regular-open characterization of $\neg\neg$-stable subobjects, or the 3-world Kripke double-negation calculation. The defects are: (a) the prose and case-explorer both describe $\Omega$ in $G$-Set as the subgroup lattice of $G$, but it is in fact $\{\bot,\top\}$ with trivial $G$-action — the "Boolean" verdict is independently correct but the supporting description is wrong; (b) sections 4 and 5 use opposite conventions for $\widehat{C}$ (covariant vs contravariant), with §4 line 631 setting up "restriction $F(b)\to F(a)$" (contravariant) but immediately using a valuation $\llbracket p\rrbracket(a)=\varnothing,\llbracket p\rrbracket(b)=\{*\}$ that requires the opposite direction; (c) the proof-scrubber Step 2 description of $\vee$-via-image uses source $1+1$ where $\Omega+\Omega$ is needed for the image to actually be the union of the two true-lines; (d) Glivenko's theorem (per the audit prompt) is not stated anywhere on the page — flagged as a coverage gap, not an error.

---

## Verified (correct as written)

### §1. Heyting algebras

1. **Adjunction definition** (line 278): $a \wedge b \le c \iff a \le b \Rightarrow c$ — the standard relative-pseudo-complement / Galois-connection axiom for $b \Rightarrow -$ as right adjoint to $b \wedge -$. Correct.
2. **"Largest $c$ with $b \wedge c \le c$" reformulation** (line 278). Correct restatement.
3. **Negation $\neg a := a \Rightarrow \bot$** (line 279). Standard.
4. **Tautologies $a \le \neg\neg a$, $\neg\neg\neg a = \neg a$, Heyting–De Morgan $\neg(a\vee b) = \neg a \wedge \neg b$** (line 279). All correct in any HA.
5. **LEM iff $\neg\neg a = a$ for all $a$ iff Boolean** (lines 279, 281). Correct: a HA is Boolean iff every element is regular ($\neg\neg a = a$) iff complemented iff LEM holds.
6. **Open-set HA formulas** (line 280): $U \Rightarrow V = \mathrm{int}(U^c \cup V)$, $\neg U = \mathrm{int}(U^c)$. Correct.
7. **Lindenbaum / free-HA paragraph** (line 280): filters ↔ consistent theories, primes ↔ propositional models, Lindenbaum algebra = free HA. Standard.
8. **Sierpiński as smallest non-Boolean HA** (line 281). The 3-element chain $\{\bot < m < \top\}$ is indeed the smallest non-Boolean HA, and the Sierpiński space's open-set lattice is exactly that chain. Correct (though the widget shows a 5-element example, not the 3-element minimum — see §1 widget below).
9. **Heyting calculator widget — the 5-element open-set lattice on $X=\{x,y,z\}$ with topology $\tau = \{\varnothing, \{x\}, \{y\}, \{x,y\}, X\}$** (lines 296–322):
   - Bitmask encoding (`x`=bit 0, `y`=bit 1, `z`=bit 2) with $a \le b$ iff `(a.mask & b.mask) === a.mask`. Correct realisation of the inclusion order on the 5 opens.
   - $\meet, \join$ as bitwise AND / OR. Correct because the topology is closed under finite intersections and arbitrary (here finite) unions, and the minimal open containing a union of opens is the union itself.
   - $a \Rightarrow b$ by brute-force search over the 5 elements for the largest $c$ with $\meet(a,c) \le b$. Correct algorithm. Spot-check: `imp({x},{y})`: largest $c$ with $\{x\}\cap c \subseteq \{y\}$ requires $x \notin c$; candidates $\varnothing, \{y\}$; largest is $\{y\}$. ✓ (matches quiz question 1.)
   - $\neg a = a \Rightarrow \varnothing$. Correct: $\neg\{x\} = \{y\}$, since $\{y\}$ is the largest open disjoint from $\{x\}$.
   - LEM-fails check: $\{x\} \vee \neg\{x\} = \{x\}\cup\{y\} = \{x,y\} \ne X$. Correctly flagged red. ✓

### §1 quiz claims

10. **Q1** "$\{x\} \Rightarrow \{y\} = \{y\}$ on $\tau$" (lines 9–17). Verified above. Explanation correct.
11. **Q2 multi-select: finite Heyting algebras = finite distributive lattices** (lines 21–32). Correct — for finite lattices, distributivity is equivalent to the existence of $\Rightarrow$ (define $b \Rightarrow c = \bigvee\{x : x \wedge b \le c\}$ — this is the largest such element iff finite-meet distributes over arbitrary join). $N_5$ and $M_3$ are precisely the forbidden sublattices of Birkhoff's distributivity criterion. Boolean algebras and chains are distributive. Answer set `[0,2,4]` correct.
12. **Q3 mcq: $\neg\neg\neg a = \neg a$ is the universal identity** (lines 35–46). Correct. The other three are LEM (false in general), DNE (false in general), or the trivial $a \Rightarrow \bot = \top$ (which would make $a = \bot$, not universal).

### §2. $\Omega$ as an internal Heyting algebra

13. **Universality argument** (line 426): a morphism $\Omega \times \Omega \to \Omega$ is, by classification, the characteristic map of a unique subobject of $\Omega \times \Omega$. Correct (Yoneda + subobject-classifier UP).
14. **$\meet$ classifies $\langle \mathrm{true}, \mathrm{true}\rangle: 1 \hookrightarrow \Omega\times\Omega$** (line 428). Correct: $(p,q) \mapsto \top$ exactly when $(p,q) = (\top,\top)$, and the meet of $(p,q)$ is $\top$ iff $p = q = \top$.
15. **$\Rightarrow$ classifies $\le \;\hookrightarrow\; \Omega\times\Omega$ as the equaliser of $\meet$ and $\pi_1$** (lines 428, 457). Correct: $p \le q \iff p \meet q = p$ (so the equaliser of $\meet, \pi_1$ is the $\le$-relation), and the classifying map of $\le$ sends $(p,q) \mapsto \top$ exactly when $p \le q$ — that's $p \Rightarrow q$.
16. **$\neg = \Omega \xrightarrow{\langle 1,!\circ\bot\rangle} \Omega\times\Omega \xrightarrow{\Rightarrow} \Omega$** (line 428, restated in Step 4 line 462). Correct: $\neg p = p \Rightarrow \bot$.
17. **External $\mathrm{Sub}(X)$ formulas** (line 429): $S \meet T = S \cap T$, $S \join T = S \cup T$, $S \Rightarrow T = \bigcup\{W : W \cap S \subseteq T\}$. Correct — these are the standard Heyting operations on the subobject lattice of any topos.
18. **In $\mathrm{Sh}(X)$, elements of $\Omega$ over $U$ are open subsets of $U$** (line 429). Correct — $\Omega$ in $\mathrm{Sh}(X)$ is the sheaf $U \mapsto \mathcal{O}(U)$.
19. **In $\widehat{C}$, elements of $\Omega$ over $c$ are sieves on $c$** (line 429). Correct under the convention $\widehat{C} = [C^{op}, \mathbf{Set}]$ — a sieve on $c$ is a set of arrows-into-$c$ closed under precomposition. (Caveat: this convention conflicts with what §4 actually uses — see "convention inconsistency" below.)

### §2 quiz claims

20. **Q1 mcq: $\Omega$ in $\mathbf{Set} = \{\bot,\top\}$** (lines 53–64). Correct.
21. **Q3 matching: the three classifiable subobjects** (lines 79–93). Correct — $\meet \leftrightarrow \langle\top,\top\rangle$, $\join \leftrightarrow$ image of the two true-lines, $\Rightarrow \leftrightarrow$ the order $\le$. Mac Lane–Moerdijk IV.8 reference is right (Heyting structure on $\Omega$ is in IV.8).
22. **Q1 hard mcq: $\Omega(U) = \mathcal{O}(U)$ in $\mathrm{Sh}(\mathbb{R})$** (lines 98–108). Correct, with the $V \Rightarrow W = \mathrm{int}(U \setminus V \cup W)$ formula (= $\mathrm{int}((U\setminus V) \cup W)$). Standard.
23. **Q2 hard mcq: $\neg = \langle 1,!\circ\bot\rangle$ then $\Rightarrow$** (lines 110–122). Correct. The "no canonical swap on $\Omega$ in non-Boolean toposes" remark is accurate — there is no well-defined complementation on a generic $\Omega$.

### §3. The Mitchell–Bénabou language

24. **Types ↔ objects, terms ↔ morphisms, formulas ↔ characteristic maps / subobjects** (line 497). Standard.
25. **Logical operators via internal HA on $\Omega$** (line 498). Standard.
26. **Quantifiers as adjoints to pullback along projection: $\exists = \Sigma_\pi$ left adjoint, $\forall = \Pi_\pi$ right adjoint** (line 498, restated in dictionary entries). Correct — this is Lawvere's characterisation; Beck–Chevalley + locally cartesian closed structure of a topos guarantees both adjoints.
27. **Equality $t =_A s$ classifies the diagonal $\Delta_A$ pulled back along $\langle t,s\rangle$** (line 498). Correct.
28. **Provability $\Gamma \vdash \varphi$ iff $\llbracket\top_\Gamma\rrbracket \le \llbracket\varphi\rrbracket$ in $\mathrm{Sub}(\llbracket\Gamma\rrbracket)$** (line 498). Correct.
29. **LEM ↔ "every subobject has a complement", AC ↔ "every epi splits"** (line 499). Correct (the LEM equivalence is the Boolean condition; AC = internal-AC = "every internal epi has an internal section" is one of the standard formulations).
30. **Mitchell–Bénabou dictionary table entries** (lines 521–537):
    - `type`: types are objects; unit type = $1$, propositional type = $\Omega$, function types $A \to B$ = exponentials $B^A$, power type $\mathcal{P}A = \Omega^A = P(A)$. All correct.
    - `term`: terms are morphisms with codomain = type and domain = context; closed terms = global sections $1 \to \llbracket A\rrbracket$. Correct.
    - `formula`: morphism $\llbracket\Gamma\rrbracket \to \Omega$ = subobject $\{\Gamma \mid \varphi\} \hookrightarrow \llbracket\Gamma\rrbracket$. Provability iff $\llbracket\Gamma\rrbracket = \{\Gamma\mid\varphi\}$. Correct.
    - `and`: $\llbracket\varphi\meet\psi\rrbracket = \meet \circ \langle\llbracket\varphi\rrbracket,\llbracket\psi\rrbracket\rangle$, and $\{\varphi\meet\psi\} = \{\varphi\}\cap\{\psi\}$ as a pullback of subobjects. Correct.
    - `exists`: image along projection, $\Sigma_\pi$ left adjoint to $\pi^*$. Correct.
    - `forall`: $\Pi_\pi$ right adjoint to $\pi^*$. Correct.
    - `eq`: pullback of $\Delta_A$ along $\langle t,s\rangle$. Correct.
    - `impl`: relative pseudo-complement; $\{\varphi\to\psi\}$ = largest $W \subseteq \llbracket\Gamma\rrbracket$ with $W\cap\{\varphi\}\subseteq\{\psi\}$. Correct.

### §3 quiz claims

31. **Q1 matching** (lines 129–146). Correct: closed term ↔ global section; formula ↔ $\Gamma \to \Omega$; $\exists \leftrightarrow \Sigma_\pi$; $\forall \leftrightarrow \Pi_\pi$.
32. **Q2 mcq: $\forall x.(P(x)\to Q(x))$ as $\Pi_\pi(\{P\}\Rightarrow\{Q\})$** (lines 148–158). Correct. First compute the implication in $\mathrm{Sub}(A)$ (using the Heyting structure there), then quantify by the right adjoint $\Pi_\pi$ of $\pi^*: \mathrm{Sub}(1) \to \mathrm{Sub}(A)$.
33. **Q3 mcq: provability $\iff$ $\{\varphi\} = \llbracket\Gamma\rrbracket$ in $\mathrm{Sub}(\llbracket\Gamma\rrbracket)$** (lines 161–171). Correct.

### §4. Kripke–Joyal forcing semantics

34. **The five clauses** (lines 591–597). All correct standard Kripke–Joyal:
    - $\meet$ pointwise. ✓
    - $\vee$: there exists a cover $X = \bigsqcup X_i$ with each $X_i$ forcing one of the disjuncts. ✓
    - $\to$: for every $f: Y \to X$, $Y \Vdash \varphi \implies Y \Vdash \psi$. ✓
    - $\exists$: cover $\{f_i: X_i \to X\}$ and witnesses $b_i: X_i \to A$ with $X_i \Vdash \varphi(b_i)$. ✓
    - $\forall$: for every $f: Y \to X$, every $b: Y \to A$, $Y \Vdash \varphi(b)$. ✓
35. **Asymmetry remark** (line 598): $\to, \forall$ quantify over all $f$ (persistence); $\vee, \exists$ require some cover. This asymmetry is exactly the point of intuitionist logic. Correct.
36. **Specialisation to Kripke models in $\widehat{C}$** (line 599): worlds = objects, accessibility = $\to$, persistence built into $\to,\forall$ clauses. Correct.
37. **Specialisation to $\mathrm{Sh}(X)$: forcing on covering families of opens** (line 599). Correct.
38. **Forcing $\neg p$ at $a$, $\neg p$ at $b$** (line 641): with valuation forcing $p$ at $b$ only, $a \Vdash \neg p$ (the only arrow $\mathrm{id}_a: a \to a$ doesn't force $p$); $b \not\Vdash \neg p$ (because $\mathrm{id}_b: b \to b$ does force $p$). Correct under the covariant convention being used in this widget (see "convention inconsistency" below for cross-section comparison).
39. **$p \vee \neg p$ fails at $a$** (line 645): $a$ has no proper cover, and $a$ forces neither disjunct. Correct.
40. **$\neg\neg p$ at $a$** (line 650): $a \Vdash \neg p$ already, so $a \not\Vdash \neg\neg p$ (because $\mathrm{id}_a: a\to a$ has $a \Vdash \neg p$). The vacuous "$\neg\neg p \to p$ at $a$" remark is correct (an implication is vacuously true when the antecedent is empty among accessible worlds).

### §4 quiz claims

41. **Q1 multi-select: forcings at world $b$** (lines 178–190). With $p$ at $b$ only:
    - $b \Vdash p$ ✓ (direct).
    - $b \not\Vdash \neg p$ (because $\mathrm{id}_b$ forces $p$). The choice not in answer set ✓.
    - $b \Vdash p \vee \neg p$ via the left disjunct (cover = $\{\mathrm{id}_b\}$, which forces $p$). ✓
    - $b \Vdash \neg\neg p \to p$ ✓ (the only $Y \to b$ that's actually accessible is $\mathrm{id}_b$, which forces $p$ directly, so the implication's antecedent is irrelevant here).
    - $b \Vdash p \to \neg\neg p$ ✓ (intuitionist tautology — provable at any $X$ in any topos).
    Answer `[0,2,3,4]` correct.
42. **Q2 mcq: K-J implication clause** (lines 193–203). Correct — the clause is "$\forall f: Y \to X$, $Y \Vdash \varphi \Rightarrow Y \Vdash \psi$", not just "$X \Vdash \varphi \Rightarrow X \Vdash \psi$". The persistence quantification is essential.
43. **Q3 mcq: K-J $\exists$ in $\mathrm{Sh}(X)$** (lines 206–217). Correct — sheaf existential = local existence on a covering family.
44. **Q1 hard mcq: 3-world model** (lines 222–231). Verified manually: with $C = \{a, b, c, \mathrm{id}, a\to b, a\to c\}$ and $p$ at $b$ only:
    - $\neg p$: $a \not\Vdash \neg p$ (since $a \to b$ forces $p$); $b \not\Vdash \neg p$ (since $\mathrm{id}_b$ forces $p$); $c \Vdash \neg p$ (only $\mathrm{id}_c$ accessible from $c$, doesn't force $p$).
    - $\neg\neg p$: $a \not\Vdash \neg\neg p$ (since $a \to c$ has $c \Vdash \neg p$); $b \Vdash \neg\neg p$ (only $\mathrm{id}_b$ accessible, doesn't force $\neg p$); $c \not\Vdash \neg\neg p$ (since $\mathrm{id}_c$ forces $\neg p$).
    Answer "Only at $b$" correct.
45. **Q2 hard mcq: cover of representable in $\widehat{C}$** (lines 234–245). Correct — without a Grothendieck topology, the only "cover" is $\{\mathrm{id}\}$, so K-J disjunction collapses to standard Kripke. The Grothendieck-topology / sheaf upgrade is what supplies real covers.

### §5. LEM failure and double negation

46. **Open-set example on $\mathbb{R}$** (line 685):
    - $U = (-\infty, 0)$, $\neg U = \mathrm{int}(U^c) = \mathrm{int}([0,\infty)) = (0,\infty)$. ✓
    - $U \cup \neg U = \mathbb{R} \setminus \{0\} \ne \mathbb{R}$, so LEM fails for this $U$. ✓
    - $\neg\neg U = \mathrm{int}(\overline{U}) = \mathrm{int}((-\infty,0]) = (-\infty,0) = U$. ✓ ($U$ is regular open.)
    - $V = \mathbb{R}\setminus\{0\}$: $\neg V = \mathrm{int}(\{0\}) = \varnothing$, $\neg\neg V = \mathrm{int}(\mathbb{R}) = \mathbb{R} \ne V$. ✓
47. **$\neg\neg$-topology is a Lawvere–Tierney topology** (line 686). Correct — $\neg\neg$ satisfies the three LT-topology axioms ($j \circ \top = \top$, $j \circ j = j$, $j \circ \meet = \meet \circ (j \times j)$).
48. **$\mathrm{Sh}_{\neg\neg}(\mathcal{E})$ is the largest Boolean subtopos** (line 686). Correct — $\neg\neg$ is the smallest LT-topology making the resulting subtopos Boolean, and smaller topology = more sheaves, so $\mathrm{Sh}_{\neg\neg}$ is the largest such subtopos. (Reference "Mac Lane–Moerdijk V.2" is approximate; the actual treatment is in MM Chapter VI, around §VI.1–§VI.3 for Lawvere–Tierney topologies and §VI.5 for the Boolean-subtopos result. Minor citation issue, not a math error.)
49. **Cohen-forcing $\iff$ $\neg\neg$-sheaves on names topos** (line 686). Correct, this is the topos-theoretic shadow of Cohen forcing.
50. **Boolean topos $\iff$ $\Omega$ internally Boolean $\iff$ every subobject complemented** (line 687). Correct.
51. **Presheaves on a non-groupoid are non-Boolean; sheaves on a non-discrete space are non-Boolean** (line 687). Both correct standard theorems.
52. **Case-explorer hypotheses** (lines 696–699): the four hypotheses (Boolean, LEM, DNE, AC) are well-defined and well-known to dissociate.

### §5 case-explorer per-case verdicts

53. **$\mathbf{Set}$** (lines 702–712): all four hypotheses pass. Correct (classical set theory in ZFC).
54. **$G$-Set** (lines 713–723):
    - **Boolean: pass** ✓ — every $G$-stable subset has a $G$-stable complement, so every subobject is complemented. This is correct *as a verdict*; the supporting description "$\Omega = \{\text{subgroups of } G\}$" is wrong (see "wrong claims" below).
    - **LEM: pass** ✓ — follows from Boolean.
    - **DNE: pass** ✓ — Boolean ⇒ DNE.
    - **AC: fail** ✓ — standard counterexample is a free orbit $G \cdot x$ which surjects onto $\{*\}$ but has no $G$-equivariant section.
55. **Presheaves on $a \to b$** (lines 725–733): all four hypotheses fail. Correct (the topos is not Boolean since the underlying category is not a groupoid; the size-3 fiber of $\Omega$ at one of the two objects gives the chain $\{\bot < m < \top\}$). The exact location of the 3-element fiber depends on the convention $\widehat{C} = [C, \mathbf{Set}]$ vs $[C^{op}, \mathbf{Set}]$ — see "convention inconsistency" below.
56. **$\mathrm{Sh}(\mathbb{R})$** (lines 736–744): all four hypotheses fail. Correct. The DNE entry "$\neg\neg U = \mathrm{int}(\overline{U})$" is correct.
57. **$\mathrm{Sh}_{\neg\neg}(\widehat{C})$** (lines 746–755): Boolean / LEM / DNE pass; AC fails. Correct (Boolean does not imply AC).

### §5 quiz claims

58. **Q1 mcq: $\widehat{(a\to b)}$ is the non-Boolean presheaf example** (lines 252–263). Correct — $\widehat{*} = \mathbf{Set}$ is Boolean; $\widehat{G}$ for $G$ a group/groupoid is Boolean; $\widehat{(a\to b)}$ is non-Boolean. Theorem "$\widehat{C}$ Boolean iff $C$ a groupoid" correctly cited.
59. **Q2 multi-select: Boolean toposes** (lines 266–278). Correct: $\mathbf{Set}$, $G$-Set, $\mathrm{Sh}_{\neg\neg}$, sheaves on a discrete space — all Boolean. $\mathrm{Sh}(\mathbb{R})$ and $\widehat{(a\to b)}$ — non-Boolean. Answer `[0,1,4,5]` correct.
60. **Q3 mcq: $\mathrm{Sh}_{\neg\neg}$ is the largest Boolean subtopos** (lines 280–290). Correct.
61. **Q1 hard mcq: $\neg\neg$-stable subobjects of $\mathbb{R}$ in $\mathrm{Sh}(\mathbb{R})$ are the regular opens** (lines 296–305). Correct — $U = \neg\neg U = \mathrm{int}(\overline{U})$ is exactly the definition of a regular open set; the regular opens form a complete Boolean algebra (the Booleanisation of the open-set HA). Standard.
62. **Q2 hard mcq: Diaconescu's theorem (AC ⇒ Boolean in any topos)** (lines 308–318). Correct — the construction uses a $\mathbb{Z}/2$-quotient of $\{0,1\}$ by an equivalence depending on a proposition $\varphi$; internal AC produces a section, which decides $\varphi$. The converse failure ($G$-Set Boolean but no AC) is correctly noted.

### §6. Geometric morphisms preserve geometric logic

63. **Geometric morphism = adjoint pair $f^* \dashv f_*$ with $f^*$ preserving finite limits** (line 765). Standard.
64. **Geometric logic fragment: $\top, \bot, \meet$ (binary), $\bigvee$ (arbitrary), $\exists, =$** (line 766). Correct.
65. **What is omitted: $\Rightarrow, \neg, \forall$, infinitary $\bigwedge$** (line 766). Correct.
66. **$f^*$ preserves $\meet, \bigvee, \exists, =$ — and not $\Rightarrow, \forall, \neg$** (line 767, restated in widget). All correct:
    - $\meet$ — $f^*$ preserves finite limits, hence pullbacks of subobjects. ✓
    - $\bigvee$ — $f^*$ is a left adjoint, preserves all colimits, hence images of coproducts (= unions of subobjects). ✓
    - $\exists$ — image along projection, preserved by left adjoints (Beck–Chevalley). ✓
    - $=$ — diagonal is a finite limit. ✓
    - $\Rightarrow, \forall$ — right-adjoint constructions; left adjoints don't commute with right adjoints in general. ✓
    - $\neg$ — inherits failure from $\Rightarrow$. ✓
67. **Geometric soundness** (line 768): geometric sequents valid in $\mathcal{E}$ are valid in $\mathcal{F}$ for any $\mathcal{F} \to \mathcal{E}$. Correct.
68. **Classifying topos $\mathrm{Set}[\mathcal{T}]$ for a geometric theory $\mathcal{T}$** (line 768). Correct — geometric morphisms $\mathcal{F} \to \mathrm{Set}[\mathcal{T}]$ correspond to $\mathcal{T}$-models in $\mathcal{F}$.
69. **Composition: $(g\circ f)^* = f^* \circ g^*$** (line 768). Correct.

### §6 quiz claims

70. **Q1 multi-select: $f^*$ preserves $\meet, \bigvee, \exists, =$** (lines 326–339). Answer `[0,2,4,5]` correct (matches the geometric fragment).
71. **Q2 mcq: $f^*$ preserves $\bigvee$ but not $\bigwedge$** (lines 343–352). Correct — $f^*$ preserves all colimits (left adjoint) but only finite limits.
72. **Q3 mcq: geometric soundness via $f^*$** (lines 355–365). Correct.

### Concept-graph blurbs

73. **`heyting-algebra` blurb** (line 13): "bounded lattice with $\Rightarrow$ satisfying $a\meet b \le c \iff a\le b\Rightarrow c$. Boolean = special case where double-negation is the identity; topological open-set lattices are generic." Correct.
74. **`omega-as-heyting-algebra` blurb** (line 27): "$\Omega$ carries an internal HA structure; $\mathrm{Sub}(X)$ becomes external HA pointwise." Correct.
75. **`internal-language` blurb** (line 41): "types ↔ objects, terms ↔ morphisms, formulas ↔ characteristic maps; provability tracks subobject inclusion; logic intuitionist." Correct.
76. **`kripke-joyal-semantics` blurb** (line 54): "stage-by-stage forcing; presheaf-topos special case = classical Kripke semantics." Correct.
77. **`lem-failure` blurb** (line 67): "most toposes non-Boolean; $\neg\neg$-topology = largest Boolean subtopos = topos-theoretic shadow of forcing." Correct.
78. **`geometric-morphisms-logic` blurb** (line 77): "$f^*$ preserves finite limits + arbitrary colimits = exactly geometric connectives." Correct.

---

## Wrong claims

### W1. $\Omega$ in $G$-Set is NOT the subgroup lattice — it is $\{\bot,\top\}$ with trivial action.

**Locations:**
- §2 prose, line 429: "in $G$-$\mathbf{Set}$ the elements of $\Omega$ are the $G$-stable subgroups of $G$ (the subgroup lattice ordered by inclusion)".
- §5 case-explorer entry, line 715: `latex: '\Omega = \{\text{subgroups of } G\}'`.
- §2 hard quiz Q1 mcq explanation, line 75: "the elements of $\Omega$ in $G$-$\mathbf{Set}$ are sieves on the unique object of the one-object groupoid $G$, which correspond to subgroups of $G$. The action of $g$ on $H \le G$ is conjugation $H \mapsto gHg^{-1}$."

**Why it's wrong:** Sieves on the unique object $*$ of the one-object groupoid $BG$ are subsets of $G$ (the arrows-into-$*$) closed under precomposition by all elements of $G$. In a *group* (i.e. when every arrow is invertible), the only such subsets are $\varnothing$ and $G$ itself: if $h \in S$ and $g \in G$, then $g = h \cdot h^{-1}g \in S$ by closure under precomposition by $h^{-1}g$. So sieves on $*$ in $BG$ form the 2-element set $\{\varnothing, G\}$, and $\Omega(*) = \{\bot, \top\}$ with trivial $G$-action. This is consistent with the verdict "$G$-Set is Boolean" — both because the 2-element BA is Boolean and because every $G$-stable subset of any $G$-set has a $G$-stable complement.

**What may have been confused:** The classification of *transitive* $G$-sets up to isomorphism is by subgroups of $G$ (up to conjugacy), via $G/H \leftrightarrow H$. That is a different theorem from "$\Omega$ has subgroups as its underlying set." A second possible source of confusion: in the topos $\mathbf{Set}/G$ (slice over a non-trivial $G$ regarded as a discrete set), $\Omega = \mathcal{P}(G)$ over the underlying point — but $\mathbf{Set}/G$ is a different topos from $G$-Set.

**Suggested fix:** in the prose at line 429, replace "in $G$-$\mathbf{Set}$ the elements of $\Omega$ are the $G$-stable subgroups of $G$ (the subgroup lattice ordered by inclusion)" with something like "in $G$-$\mathbf{Set}$ the lattice $\Omega$ is just $\{\bot,\top\}$ — the topos is Boolean, illustrating that the Heyting structure on $\Omega$ can collapse to a Boolean one when $C$ is a groupoid." In the case-explorer entry, replace `\Omega = \{\text{subgroups of } G\}` with `\Omega = \{\bot, \top\}` (trivial action) — this also makes the "Boolean" verdict locally self-evident. In the quiz Q1 hard mcq, the answer should change from "subgroups of $G$" to "$\{\bot, \top\}$ with trivial $G$-action," and the explanation should be rewritten accordingly.

### W2. §4 Kripke–Joyal scrubber Step "Setup" gets the restriction direction wrong (or is at odds with the valuation in the next step).

**Location:** lines 631–636.

**The setup says** (line 631): "Presheaves on $C$ are pairs of sets $F(a), F(b)$ together with a restriction $F(b) \to F(a)$." This is the standard contravariant convention $F: C^{op} \to \mathbf{Set}$, where $f: a \to b$ in $C$ becomes $F(f): F(b) \to F(a)$.

**The very next step says** (line 636): "Set $\llbracket p\rrbracket(a) = \varnothing$, $\llbracket p\rrbracket(b) = \{*\}$ ... Persistence (presheaf functoriality) is automatic since $\varnothing \to \{*\}$ is the only candidate."

**Why this is inconsistent:** Under the convention declared in line 631 (restriction $F(b)\to F(a)$), the required map is $\{*\} \to \varnothing$, which *does not exist*. So $\llbracket p\rrbracket$ as described cannot be a presheaf in the contravariant convention. The map $\varnothing \to \{*\}$ that line 636 cites would only be the right direction under the *covariant* convention $F: C \to \mathbf{Set}$ (copresheaves), where the restriction goes $F(a) \to F(b)$.

**Suggested fix:** Change line 631 to "Presheaves [resp. copresheaves] on $C$ are pairs of sets $F(a), F(b)$ together with a restriction $F(a) \to F(b)$" — or (more in line with Mac Lane–Moerdijk's convention) flip the example to $\llbracket p\rrbracket(a) = \{*\}$, $\llbracket p\rrbracket(b) = \varnothing$ and re-do the analysis (swapping $a, b$ throughout the rest of the section, including the case-explorer entry in §5 and the Q1 hard mcq in §4). The covariant convention is more common in Kripke-model presentations because persistence then matches the visual flow "future to the right"; the contravariant convention is what MM uses uniformly. Either is fine as long as it is consistent.

### W3. §2 proof-scrubber Step 2 source of $\vee$-image is $1+1$ but should be $\Omega+\Omega$.

**Location:** lines 451–453, scrubber step "$\vee$ classifies the union of the two true-lines".

**The text says:** "Construct it as the image of $1 + 1 \to \Omega \times \Omega$, $\iota_1(*) = (\top,q)$ and $\iota_2(*) = (p,\top)$."

**Why this is wrong:** The notation $\iota_1(*) = (\top, q)$ uses $q$ as a free variable, which can only mean $q$ ranges over $\Omega$. So the source must include $\Omega$ as a parameter, not just a single point. The standard description: $\vee$ is the classifying map of the image of
$$\langle\mathrm{true}_\Omega, \mathrm{id}_\Omega\rangle \sqcup \langle\mathrm{id}_\Omega, \mathrm{true}_\Omega\rangle\colon \Omega + \Omega \to \Omega \times \Omega,$$
sending the first copy of $\Omega$ to $\{\top\}\times\Omega$ and the second copy to $\Omega\times\{\top\}$. The image is indeed $\{\top\}\times\Omega \cup \Omega\times\{\top\}$, the "union of the two true-lines," whose classifying map is $\vee$. With source $1+1$ as stated, the image would be just two specific points, not the union of the lines.

**Suggested fix:** Change "$1+1 \to \Omega\times\Omega$" to "$\Omega + \Omega \to \Omega\times\Omega$" and replace "$\iota_1(*) = (\top, q)$, $\iota_2(*) = (p, \top)$" with "$\iota_1(q) = (\top, q)$, $\iota_2(p) = (p, \top)$".

---

## Underspecified or convention-flagged claims

### U1. Convention inconsistency between §2/§5 and §4 for "$\Omega(c)$ has 3 elements."

In §5 case-explorer (line 727): "$\Omega(a)$ = sieves on $a$ = $\{\varnothing, \{a\}, \{a, a\to b\}\}$" — three elements, listed as if at object $a$.

Under the standard MM convention $\widehat{C} = [C^{op}, \mathbf{Set}]$, sieves on $a$ in $C = \{a \xrightarrow{f} b\}$ are subsets of arrows-into-$a$ closed under precomposition; the only arrow into $a$ is $\mathrm{id}_a$, so sieves on $a$ form $\{\varnothing, \{\mathrm{id}_a\}\}$ — *two* elements, not three. The 3-element fiber of $\Omega$ in this presheaf topos lives at $b$, not $a$ ($\Omega(b) = \{\varnothing, \{f\}, \{f, \mathrm{id}_b\}\}$).

Under the covariant convention $\widehat{C} = [C, \mathbf{Set}]$ (copresheaves), $\Omega(c)$ = cosieves on $c$ = arrows-out-of-$c$ closed under postcomposition; $\Omega(a) = \{\varnothing, \{f\}, \{f, \mathrm{id}_a\}\}$ — three elements at $a$, two at $b$. This matches what the page says.

The page does not declare which convention it is using. It cites Mac Lane–Moerdijk repeatedly (which uses contravariant), but the Kripke–Joyal widget in §4 only works under the covariant convention (per W2 above), and the case-explorer in §5 only counts correctly under the covariant convention. So the working convention throughout these widgets is covariant — but the convention is not flagged, and the reader who tries to reconcile with MM will be confused.

**Suggested fix:** Add a one-line convention note where $\widehat{C}$ is first introduced (around line 429 or earlier), e.g. "Throughout this page we take $\widehat{C} = [C, \mathbf{Set}]$ (copresheaves) so that 'forcing persists into the future' matches the visual flow $a \to b$. This is the opposite of Mac Lane–Moerdijk's convention; readers comparing to that source should swap $C \leftrightarrow C^{op}$ throughout." Then the description "$\Omega(a)$ = sieves on $a$" should be reworded as "cosieves on $a$" (or "sieves on $a$ in $C^{op}$") for accuracy.

### U2. §1 prose "the 4-element diamond ... below" doesn't match the widget below.

The §1 prose at line 281 says "The 4-element diamond $\{\bot, a, b, \top\}$ below is the smallest Boolean algebra besides $\{\bot,\top\}$" — but the widget that immediately follows shows a 5-element open-set lattice (the topology on a 3-point space), not a 4-element diamond. The 4-element BA is mentioned only by name; the widget illustrates a non-Boolean 5-element example. Pedagogical mismatch but not a math error. Suggested fix: drop the "below" or add a short sentence clarifying that the widget illustrates a non-Boolean cousin of the 4-element diamond rather than the diamond itself.

### U3. Step 5 of §2 scrubber says "Boolean iff $X$ is decidable."

The scrubber Step 5 SVG label (line 468) reads: "Sub(X) = a Heyting algebra (Boolean iff X is decidable)."

In standard terminology, an object $X$ is *decidable* if its diagonal $\Delta_X: X \hookrightarrow X\times X$ is a complemented subobject of $X \times X$. The precise relationship to $\mathrm{Sub}(X)$ being Boolean is more subtle than the slogan suggests: $X$ decidable does imply that the diagonal subobject of $X\times X$ has a complement, and this gives some Boolean-ness on the level of $\mathrm{Sub}(X\times X)$, but $\mathrm{Sub}(X)$ being Boolean is a different (stronger? incomparable?) condition that follows immediately whenever the *whole topos* is Boolean. The slogan as stated isn't a proven equivalence — it's at best a heuristic. Suggested fix: replace with "Boolean iff $\mathcal{E}$ is a Boolean topos" (which is unambiguous and accurate at the level the scrubber operates).

### U4. §5 line 686 cites "Mac Lane–Moerdijk V.2" for the largest-Boolean-subtopos result.

The double-negation topology and its largest-Boolean-subtopos property are in MM Chapter VI (Lawvere–Tierney topologies in §VI.1, the $\neg\neg$-topology and its Boolean subtopos in §VI.1–§VI.5 region), not Chapter V. Minor citation slip.

### U5. Glivenko's theorem (audit prompt focus item) is not stated anywhere on the page.

Glivenko's theorem says: a propositional formula $\varphi$ is classically provable iff $\neg\neg\varphi$ is intuitionistically provable. This is the propositional-logic shadow of the $\mathrm{Sh}_{\neg\neg}$ construction — the page mentions the topos-theoretic version (the largest Boolean subtopos) but never states the propositional theorem that motivates the name "double-negation translation." Not an error of substance — the topic page is allowed to focus on the topos-theoretic side — but worth noting that the audit prompt's checklist item "Glivenko's theorem" is not covered. A one-line aside in §5 connecting "$\mathrm{Sh}_{\neg\neg}$ is the largest Boolean subtopos" to "this is the topos-theoretic shadow of Glivenko: classical theorems are intuitionistic theorems about $\neg\neg$-stable propositions" would make the connection visible. The §7 outro (line 852) does mention "double-negation translation embeds classical logic into intuitionistic logic" but doesn't name Glivenko.

### U6. §5 hard Q2 explanation: "Diaconescu's theorem (1975)."

The result that internal AC implies Boolean in any topos is due to Diaconescu in his 1975 paper. The date is correct. The constructive sketch in the explanation is correct but compressed; the standard proof builds the quotient $\{0,1\}/\sim$ where $\sim$ identifies $0\sim 1$ iff $\varphi$, and a section gives a representative that decides $\varphi$.

---

## Coverage of the audit prompt's focus list

- **HA axioms ($a \meet b \le c \iff a \le b\Rightarrow c$):** §1 line 278 — verified correct.
- **Specific HAs (open sets, distributive lattice without complementation):** §1 widget (5-element open-set lattice) — verified correct (item #9). $N_5, M_3$ as non-distributive non-Heyting in Q2 — correct.
- **Boolean vs Heyting distinction:** §1 line 281 + §5 throughout — verified correct.
- **Kripke semantics for IPC:** §4 — clauses correct (item #34); 2-world example correct (items #38–40); 3-world example correct (item #44). Convention inconsistency flagged (W2, U1).
- **Internal HA in a topos = subobject lattice:** §2 — verified correct (items #13–17).
- **HA structure of $\mathrm{Sub}(X)$ in a topos:** §2 line 429 + Step 5 of scrubber — verified correct, modulo the "decidable" slogan being loose (U3).
- **Glivenko's theorem:** Not on the page (U5). Coverage gap, not a math error.
