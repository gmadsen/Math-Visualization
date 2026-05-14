# zfc-and-ordinals — math correctness audit (2026-05)

**Section:** Logic & Foundations

## Verified claims

### §1. The ZFC axioms
- **Extensionality** (line 275): $\forall x\forall y\,[\forall z(z\in x\leftrightarrow z\in y)\to x=y]$ — standard ZFC formulation, correct.
- **Pairing** (line 276): existence of $\{a,b\}$, with the Kuratowski ordered pair $(a,b)=\{\{a\},\{a,b\}\}$ — standard, correct.
- **Union** (line 277): $\bigcup F = \{x : \exists A\in F,\ x\in A\}$ — standard, correct.
- **Power set** (line 278): $\mathcal{P}(A) = \{S : S\subseteq A\}$ — standard, correct.
- **Infinity** (line 279): $\exists I\,(\emptyset\in I \wedge \forall x\in I\,x\cup\{x\}\in I)$ — standard inductive-set form, correct.
- **Separation schema** (line 280): $\{x\in A : \varphi(x)\}$ — standard restricted-comprehension, correct.
- **Replacement schema** (line 281): image of a set under a definable functional class is a set — standard.
- **Regularity / Foundation** (line 282): $\forall A\ne\emptyset\,\exists x\in A\,(x\cap A=\emptyset)$ — standard, correct.
- **Choice** (line 283): every family of nonempty sets has a choice function — standard, correct.
- **Russell-paradox motivation** (line 287): Separation is restricted to a fixed ambient $A$, so $\{x\in A : x\notin x\}$ exists harmlessly while $\{x : x\notin x\}$ is never formed — correct.
- **Cumulative hierarchy** (line 289): $V_0 = \emptyset$, $V_{\alpha+1} = \mathcal{P}(V_\alpha)$, $V_\lambda = \bigcup_{\alpha<\lambda} V_\alpha$ at limits; $V = \bigcup_\alpha V_\alpha$ a proper class; every set has a least rank — all correct (regularity is what guarantees the rank function is total).
- **Widget readout: $|V_n|$ values** (line 321): $0, 1, 2, 4, 16, 65536, \ldots$ — correct ($|V_{n+1}| = 2^{|V_n|}$).

### §2. Von Neumann ordinals
- **Definition** (line 368): "transitive set well-ordered by $\in$" — standard, correct.
- **Von Neumann recursion** (lines 370–374): $0=\emptyset$, $\alpha+1 = \alpha\cup\{\alpha\}$, $\lambda = \bigcup_{\beta<\lambda}\beta$ — standard, correct.
- **Identity $\alpha = \{\beta : \beta < \alpha\}$** (line 376) — correct.
- **First few ordinals** (line 379): $0=\emptyset$, $1=\{\emptyset\}$, $2=\{0,1\}$, $3=\{0,1,2\}$, $\omega = \{0,1,2,\ldots\}$, $\omega+1 = \omega\cup\{\omega\}$ — correct.
- **Three-way coincidence** (line 382): $\alpha < \beta \iff \alpha \in \beta \iff \alpha \subsetneq \beta$ — standard ordinal fact, correct.
- **Transfinite induction** (line 401): standard, correct.
- **Transfinite recursion** (line 403): unique $F$ with $F(\alpha) = G(F\!\restriction\!\alpha)$ — standard schema; the remark that this is how $V_\alpha$, ordinal arithmetic, and Gödel's $L$ are built is correct.
- **Replacement justifies recursion** (line 405): correct — replacement is what guarantees $F\!\restriction\!\alpha$ is a set at each stage.
- **Widget readouts** (lines 470–474):
  - $\omega$ is the smallest limit ordinal, has no maximum, $\text{cf}(\omega)=\omega$, $|\omega|=\aleph_0$ — correct.
  - $\omega\cdot 2 = \omega+\omega$, $\omega\cdot 2 \ne 2\cdot\omega = \omega$, $\text{cf}(\omega\cdot 2)=\omega$, $|\omega\cdot 2|=\aleph_0$ — correct.
  - $\omega^2 = \omega\cdot\omega = \sup\{\omega\cdot n : n<\omega\}$, $\text{cf}(\omega^2)=\omega$, countable — correct.

### §3. Ordinal arithmetic
- **Recursive definitions** (lines 493–501): all three (sum, product, exponentiation) match standard textbook recursions on the second argument.
- **Non-commutativity** (line 503): $1+\omega=\omega\ne\omega+1$ and $2\cdot\omega=\omega\ne\omega\cdot 2$ — correct, standard examples.
- **Ordinal-calculator addition table** (lines 538–576). Spot-checked the non-trivial entries:
  - $1+\omega = \omega$, $\omega+1 = \omega+1$, $\omega+\omega = \omega\cdot 2$, $\omega+\omega^2 = \omega^2$ — correct (small terms absorbed into larger ones from the left in CNF).
  - $(\omega+1)+\omega = \omega + (1+\omega) = \omega+\omega = \omega\cdot 2$ — uses associativity of ordinal addition correctly.
  - $\omega\cdot 2 + \omega\cdot 2 = \omega\cdot 4$ — correct (factor $\omega$ on the left).
  - $\omega^2 + \omega^2 = \omega^2\cdot 2$ — correct.
- **Ordinal-calculator multiplication table** (lines 578–603). Spot-checked:
  - $2\cdot\omega = \omega$ (left-multiplying by 2 is sup of $\{2n\}$); $\omega\cdot 2 = \omega+\omega$ — correct.
  - $2\cdot(\omega+1) = 2\omega+2 = \omega+2$ — correct, uses left-distributivity $\alpha(\beta+\gamma)=\alpha\beta+\alpha\gamma$.
  - $(\omega+1)\cdot\omega = \sup\{(\omega+1)\cdot n\} = \omega^2$ (the trailing $+1$s collapse) — correct.
  - $(\omega+1)\cdot(\omega+1) = \omega^2+\omega+1$ — correct.
  - $(\omega\cdot 2)\cdot\omega = \omega^2$ (the 2 collapses) — correct.
  - $\omega^2\cdot\omega = \omega^3$, $\omega^2\cdot\omega^2 = \omega^4$ — correct.
- **Ordinal-calculator exponentiation table** (lines 605–631, with overrides at 634–635). Spot-checked:
  - $2^\omega = \omega$ (as ordinals; not the cardinal $2^{\aleph_0}$) — correct, the explanatory note distinguishing this from the cardinal continuum is correct.
  - $2^{\omega+1} = 2^\omega\cdot 2 = \omega\cdot 2$ — correct.
  - $2^{\omega\cdot 2} = (2^\omega)^2 = \omega^2$ — correct.
  - $2^{\omega^2} = \omega^\omega$ — correct ($2^{\omega\cdot\omega} = (2^\omega)^\omega = \omega^\omega$).
  - $\omega^2 = \omega\cdot\omega$ — correct.
  - $\omega^{\omega+1} = \omega^\omega\cdot\omega$ — correct.
  - $(\omega+1)^\omega = \omega^\omega$ (sup of $(\omega+1)^n$, which in CNF is $\omega^n + \omega^{n-1}+\cdots+1$) — correct.
  - $(\omega\cdot 2)^\omega = \omega^\omega$ (sup of $\omega^n\cdot 2$) — correct.
  - $(\omega^2)^\omega = \omega^\omega$ (override at line 634, sup of $\omega^{2n}$) — correct.
  - $(\omega^2)^{\omega+1} = (\omega^2)^\omega\cdot\omega^2 = \omega^\omega\cdot\omega^2$ (override at line 635) — correct.
- **Cantor normal form** (lines 526–528): every $\alpha < \varepsilon_0$ has a unique expression $\alpha = \omega^{\beta_1}n_1+\cdots+\omega^{\beta_k}n_k$ with $\beta_1>\cdots>\beta_k$ and $n_i\in\mathbb N_{>0}$ — standard, correct.
- **$\varepsilon_0$ characterisation** (line 528): $\varepsilon_0 = \sup\{\omega,\omega^\omega,\omega^{\omega^\omega},\dots\}$ = least fixed point of $\alpha\mapsto\omega^\alpha$ — standard, correct.
- **$\varepsilon_0$ is countable, $\omega_1$ is much larger** (line 528) — correct.
- **Gentzen's theorem** (line 530): PA cannot prove $\varepsilon_0$ is well-founded; adding it as an extra principle (Gentzen 1936) yields a consistency proof of PA — historically and mathematically correct ($\varepsilon_0$ is the proof-theoretic ordinal of PA).

### §4. Cardinals and cofinality
- **Cardinal as least ordinal in bijection** (line 665): correct, uses the well-ordering theorem (hence AC); for finite $X$ reduces to the integer, infinite cardinals are exactly the initial ordinals — all standard.
- **Aleph hierarchy** (lines 667–671): $\aleph_0 = \omega$, $\aleph_{\alpha+1} = \aleph_\alpha^+$, $\aleph_\lambda = \sup_{\beta<\lambda}\aleph_\beta$; alephs form a proper class — correct.
- **Regular vs singular** (line 688): $\kappa$ regular iff $\text{cf}(\kappa)=\kappa$; every successor cardinal is regular (uses AC); $\text{cf}(\aleph_\omega) = \omega$ — all correct.
- **König's theorem** (line 690): $\kappa^{\text{cf}(\kappa)} > \kappa$ — correct; the corollary $2^{\aleph_0} \ne \aleph_\omega$ (because $\text{cf}(\aleph_\omega) = \omega$ and so $\aleph_\omega^\omega > \aleph_\omega$, so if $2^{\aleph_0} = \aleph_\omega$ then $2^{\aleph_0}\cdot \omega = \aleph_\omega^\omega > \aleph_\omega$, contradiction) is correct.
- **$|\mathbb R| = 2^{\aleph_0}$** (line 693): correct; the two embeddings (Dedekind cuts into $\mathcal{P}(\mathbb Q)$ and $\{0,1\}^{\mathbb N}$ into $\mathbb R$ via binary expansions, modulo the $0.0\overline{1}=0.1\overline{0}$ identification) plus Cantor–Schröder–Bernstein give the equality — standard.
- **$2^{\aleph_0}$ is uncountable / $\geq \aleph_1$** (line 694): correct (Cantor's diagonal + the fact that $\aleph_1$ is the least uncountable cardinal).

### §5. The axiom of choice
- **AC ⇔ choice function exists** (line 754): standard, correct.
- **AC equivalents** (lines 757–763): Zorn's lemma, well-ordering, Tychonoff, every vector space has a basis — all correct (Tychonoff for arbitrary products is Kelley 1950; vector-space basis is Blass 1984).
- **Hahn–Banach strictly weaker than AC** (line 762) — correct (Hahn–Banach follows from BPI/Ultrafilter, which is strictly weaker than AC; this was proved in the Łoś–Ryll-Nardzewski / Luxemburg line of results).
- **Finite/countable products don't need AC** (line 765): correct — finite by induction; countable in fact still requires Countable Choice (CC), but the page elsewhere is comparing against full AC.
- **Banach–Tarski / Vitali require more than DC** (line 765): correct.

### §6. The continuum hypothesis
- **CH statement** (line 855): $2^{\aleph_0} = \aleph_1$ — standard.
- **Cantor 1874** (line 853): correct (Cantor's first uncountability proof, "On a property of the collection of all real algebraic numbers").
- **Hilbert Problem 1, 1900** (line 859) — historically correct.
- **Gödel 1940** (line 864): constructible universe $L \subseteq V$, inner model where CH (and GCH) hold, so Con(ZFC) ⇒ Con(ZFC + CH) — correct.
- **Cohen 1963** (line 865): forcing produces a model with $2^{\aleph_0} = \aleph_2$, so Con(ZFC) ⇒ Con(ZFC + ¬CH) — correct.
- **Independence claim** (line 869): "axioms simply do not pin the size of the continuum down beyond König's $\text{cf}(2^{\aleph_0}) > \omega$" — this part is correct and is a nice summary of Easton's theorem restricted to the continuum.
- **Widget candidate notes** (lines 887–891):
  - $2^{\aleph_0} = \aleph_0$ ruled out by Cantor — correct.
  - $2^{\aleph_0} = \aleph_1$ consistent (CH, Gödel) — correct.
  - $2^{\aleph_0} = \aleph_2$ consistent (Cohen) — correct.
  - $2^{\aleph_0} = \aleph_\omega$ ruled out by König (cofinality) — correct.
  - $2^{\aleph_0} = \aleph_{\omega+1}$ possible (regular successor) — correct.

### §7. Inaccessible cardinals
- **Strongly inaccessible definition** (lines 937–941): uncountable, regular, strong limit — standard (this is "strongly inaccessible"; the page correctly disambiguates with the parenthetical "(strongly)").
- **$V_\kappa \models$ ZFC for $\kappa$ inaccessible** (line 943): correct.
- **Gödel-II argument** (line 945): if ZFC + (∃ inaccessible) ⊢ Con(ZFC), then ZFC alone cannot prove the existence of an inaccessible — correct.
- **Reinhardt cardinals inconsistent with ZFC, Kunen 1971** (line 997): correct.
- **Scott (1961): measurable incompatible with V = L** (line 994): correct.
- **Universe axiom ⇔ proper class of inaccessibles** (line 955): correct.
- **Mahlo "inaccessibles below it form a stationary set"** (line 971, 992): correct (this is the "strongly Mahlo" definition; equivalent under standard conventions to the regular-cardinals-stationary version once the cardinal is itself inaccessible).

### §8. Connections — no math claims to verify (commentary only).

## Wrong / dubious claims

- **MAJOR — `(ω²)^(ω²)` exponentiation entry is wrong** (line 630):
  ```
  'ω²|ω²':['ω^(ω²·2)','this lives below ε₀']
  ```
  The correct value is $\omega^{\omega^2}$, not $\omega^{\omega^2 \cdot 2}$. Derivation: by the ordinal identity $(\alpha^\beta)^\gamma = \alpha^{\beta\cdot\gamma}$ (which DOES hold for ordinals, despite the elsewhere-cautious note at line 609),
  $$(\omega^2)^{\omega^2} = \omega^{2\cdot\omega^2}.$$
  Now $2\cdot\omega^2 = 2\cdot(\omega\cdot\omega) = (2\cdot\omega)\cdot\omega = \omega\cdot\omega = \omega^2$ (the leading "$2\cdot$" is absorbed). So $(\omega^2)^{\omega^2} = \omega^{\omega^2}$.
  Cross-check via sup: $(\omega^2)^{\omega^2} = \sup\{(\omega^2)^\beta : \beta<\omega^2\}$. For $\beta = \omega n + k$, $(\omega^2)^{\omega n+k} = (\omega^2)^{\omega n}\cdot(\omega^2)^k = ((\omega^2)^\omega)^n\cdot\omega^{2k} = (\omega^\omega)^n\cdot\omega^{2k} = \omega^{\omega n + 2k}$. Sup over $\omega n + k < \omega^2$ gives $\omega^{\omega^2}$. The displayed answer $\omega^{\omega^2\cdot 2}$ would require the exponent to grow to $\omega^2 + \omega^2$, which the calculation does not produce. Suggested fix: replace with `'ω²|ω²':['ω^(ω²)','(ω²)^(ω²) = ω^(2·ω²) = ω^(ω²) since 2·ω² = ω²']`.

- **MAJOR — "$2^{\aleph_0}$ is at most $\aleph_{\omega+1}$ in any sensible model"** (line 694). False. The only ZFC constraints on $2^{\aleph_0}$ are $2^{\aleph_0} \ge \aleph_1$ (Cantor) and $\text{cf}(2^{\aleph_0}) > \omega$ (König). By Solovay's theorem (and explicitly via Easton's theorem applied to $\aleph_0$), $2^{\aleph_0}$ can consistently be any cardinal of uncountable cofinality — including $\aleph_{17}$, $\aleph_{\omega_1}$, $\aleph_{\omega_1+5}$, and so on, far above $\aleph_{\omega+1}$. The hedge "in any sensible model" does not rescue the claim; standard forcing models routinely violate it. The very next paragraph (line 869) and the widget note at line 920 ("within that constraint, every aleph value is consistent with ZFC") get this right, so the line-694 claim is internally inconsistent with the rest of the page. Suggested fix: drop the upper-bound clause, leaving "$2^{\aleph_0}$ is uncountable, at least $\aleph_1$, but its exact aleph rank is the continuum hypothesis."

- **MINOR — Hedging on $(\alpha^\beta)^\gamma = \alpha^{\beta\cdot\gamma}$** (line 609, parenthetical "only when... be careful"). This identity DOES hold for ordinal exponentiation as defined on the page (and as standard). The hedge is misleading. The identity that genuinely fails for ordinals is *commutativity* (and right-distributivity of multiplication over addition); the power-of-a-power rule is fine. Suggested fix: drop the "be careful" caveat or replace with "(this rule holds for ordinal exponentiation, but $\alpha^\beta\cdot\alpha^\gamma = \alpha^{\beta+\gamma}$ requires writing the exponents in the right order)".

## Underspecified or unverifiable claims

- **Grothendieck universe definition** (lines 948–953) is missing the **pairing closure** axiom: $x,y\in\mathcal{U} \Rightarrow \{x,y\}\in\mathcal{U}$. Without it, $\mathcal{U} = \{\emptyset\}$ trivially satisfies the listed clauses (transitive ✓; $\mathcal{P}(\emptyset)=\{\emptyset\}\in\mathcal{U}$ ✓; family-union vacuous ✓), which contradicts the subsequent claim that nontrivial Grothendieck universes are exactly $V_\kappa$ for $\kappa$ inaccessible. Standard references (SGA 4 Exp. I, Bourbaki) include pairing as a fourth axiom (sometimes also $\omega\in\mathcal{U}$ to exclude the universe of hereditarily finite sets). The theorem on the next line ("$\mathcal{U} = V_\kappa$ for $\kappa$ inaccessible (in the uncountable case)") is then correct as stated.

- **Solovay (1970) "ZF + DC consistent with every set of reals being Lebesgue measurable"** (line 765). Solovay's construction *assumes the consistency of ZFC + an inaccessible cardinal*, and Shelah (1984) showed the inaccessible is necessary. The page's wording omits this large-cardinal hypothesis. Mild understatement of the equiconsistency strength but not technically wrong if read as "Con(ZFC + inaccessible) ⇒ Con(ZF + DC + LM)".

- **Cofinality formula** (line 685): $\operatorname{cf}(\alpha) = \min\{|S| : S\subseteq\alpha, \sup S = \alpha\}$ uses cardinality of $S$. Standard texts more often phrase cofinality as "least order type of an unbounded subset" (which is always a regular initial ordinal). Under AC the two definitions agree (both yield the regular cardinal $\text{cf}(\alpha)$). Convention choice, not an error; flagging in case it matters for the prereqs page on cofinality.

- **Weakly compact "tree property"** (lines 972, 993). Tree property alone does not characterise weak compactness — $\aleph_0$ has the tree property (König's lemma) but is not weakly compact. The full definition is "inaccessible + tree property" (or equivalently $\Pi^1_1$-indescribable). The widget descriptor is a slogan, not a definition; acceptable for a tower diagram but flagged for completeness.

- **Measurable "admits a κ-complete ultrafilter"** (line 973). Standard definition requires the ultrafilter to be *non-principal* (every principal ultrafilter on $\kappa$ is trivially $\kappa$-complete). Implicit but worth stating.

- **Supercompact "closed under j-elementary embeddings"** (line 975). The slogan is too vague to be a definition: $\kappa$ is supercompact iff for every $\lambda \ge \kappa$ there is an elementary embedding $j: V\to M$ with critical point $\kappa$, $j(\kappa) > \lambda$, and $M^\lambda \subseteq M$. The widget is decorative; flagged for accuracy of the tower's blurbs.

- **Choice-function widget readout** (line 825): displays `f(A_1, A_2, ..., A_5) = (1a, 2b, ...)` — minor notation slip. The page (correctly) defines $f: I \to \bigcup A_i$ with $f(i)\in A_i$, so the readout should be `f(1,2,3,4,5) = (1a, 2b, ...)` (the function's input is the index, not the bin). Cosmetic.

## Severity

**major errors** — two substantive issues: the `(ω²)^(ω²)` calculator entry returns the wrong ordinal, and the "$2^{\aleph_0} \le \aleph_{\omega+1}$ in any sensible model" claim is flatly false (and contradicted elsewhere on the same page). The Grothendieck-universe definition is missing the pairing axiom (without it the definition admits the trivial $\{\emptyset\}$). Everything else — the nine axioms, the von Neumann construction, the bulk of the ordinal-arithmetic table, cardinals/cofinality, the CH independence story, inaccessibles and the Gödel-II argument — checks out cleanly.
