# naive-set-theory — math correctness audit (2026-05)

**Section:** Logic & Foundations

## Verified claims

- **Extensionality** (line 260): $X = Y \iff \forall x\,(x\in X \leftrightarrow x\in Y)$ — standard ZFC formulation, correct.
- **Inclusion–exclusion for two sets** (line 285): $|A\cup B| = |A| + |B| - |A\cap B|$ and $|A\triangle B| = |A| + |B| - 2|A\cap B|$ — both correct (the second follows from $|A\triangle B| = |A\cup B| - |A\cap B|$).
- **Symmetric difference identity** (line 276): $A\triangle B = (A\setminus B)\cup(B\setminus A) = (A\cup B)\setminus(A\cap B)$ — standard, correct.
- **Power-set size** (line 287, 642): $|\mathcal{P}(A)|=2^n$ for $|A|=n$, justified by the indicator-function bijection $\mathcal{P}(A)\cong\{0,1\}^A$ — correct.
- **Function as graph** (line 446): subset of $A\times B$ with totality + uniqueness — matches the standard ZFC definition.
- **Injective/surjective/bijective** (lines 450–456): all definitions standard; the one-to-one ⇔ onto ⇔ bijective collapse on finite sets (pigeonhole) is correctly stated and correctly noted to fail on infinite sets.
- **Symmetric group order** (line 622): $|S_A| = n!$ for $|A|=n$ finite — correct.
- **Composition closure**: injections compose to injections, surjections to surjections, bijections to bijections — correct.
- **Cartesian product cardinality** (line 634): $|A\times B|=|A|\cdot|B|$ — correct.
- **Universal property of products** (line 636): $\Hom(X, A\times B) \cong \Hom(X,A)\times\Hom(X,B)$ — correct categorical statement.
- **Function-set cardinality** (line 638): $|B^A| = |B|^{|A|}$ for finite — correct.
- **Equivalence-relation axioms** (lines 672–677): reflexive, symmetric, transitive — standard.
- **Equivalence classes partition the underlying set** (line 679): correct fundamental fact; converse (partitions ⇒ equivalence relation) also correct.
- **Z/n via congruence** (line 687): $a\sim b$ iff $n\mid a-b$, classes $\{[0],\dots,[n-1]\}$ — correct.
- **Q as quotient** (line 688): $(a,b)\sim(c,d)$ iff $ad=bc$ on $\mathbb{Z}\times(\mathbb{Z}\setminus\{0\})$ — standard construction.
- **Fraction addition** (line 830): $[a,b]+[c,d] := [ad+bc, bd]$ — correct (standard cross-multiplication formula); equivalence-class invariance is straightforward to verify.
- **Projective space** (line 689): $\mathbb{R}^{n+1}\setminus\{0\}$ modulo $v\sim\lambda v$ for $\lambda\ne 0$ — standard definition of $\mathbb{RP}^n$.
- **Universal property of quotient** (line 693): $\bar f([x]):=f(x)$ is well-defined exactly when $f$ is constant on $\sim$-classes — correct.
- **Cardinality is an equivalence relation on sets** (line 840) — correct.
- **Definition of countable** (line 842): $|S|\le|\mathbb{N}|$, with the surjection equivalent flagged correctly as requiring $S$ non-empty.
- **Cantor pairing formula** (line 847): $\langle i,j\rangle = \tfrac{(i+j)(i+j+1)}{2}+i$ matches the stated enumeration $(0,0); (0,1),(1,0); (0,2),(1,1),(2,0); \dots$ Spot-checked: $(0,0)\mapsto 0$, $(0,1)\mapsto 1$, $(1,0)\mapsto 2$, $(0,2)\mapsto 3$, $(1,1)\mapsto 4$, $(2,0)\mapsto 5$ — bijection $\mathbb{N}^2\to\mathbb{N}$ is correct.
- **Q countable via injection into Z²** (line 849): $p/q$ in lowest terms $\to (p,q)$ — standard (with the implicit $q>0$ convention).
- **Algebraic numbers countable** (line 849): countable union (over $\mathbb{Z}[x]$) of finite root-sets — correct.
- **Cantor's diagonal argument** (lines 852–856): flipping the $n$-th bit of $s_n$ produces $d \notin \{s_0, s_1, \dots\}$ — classical proof, correctly stated for $\{0,1\}^\mathbb{N}$ and lifted to $\mathbb{R}$.
- **Cantor's theorem** (line 993): $|\mathcal{P}(A)| > |A|$ for any $A$, proved via the diagonal set $D = \{a\in A : a\notin f(a)\}$ — standard, correct.
- **Cardinal notation** (line 993): $\aleph_0 = |\mathbb{N}|$, $\mathfrak{c} = |\mathbb{R}| = 2^{\aleph_0}$ — standard and correct (the equality $|\mathbb{R}| = 2^{\aleph_0}$ holds in ZFC).
- **Continuum hypothesis independent of ZFC** (line 993): correct — Gödel showed Con(ZFC) ⇒ Con(ZFC + CH); Cohen showed Con(ZFC) ⇒ Con(ZFC + ¬CH).
- **Cardinality cheat sheet** (lines 997–999): $|\mathbb{N}|=|\mathbb{Z}|=|\mathbb{Q}|=|\mathbb{N}^k|=\aleph_0$ and $|\mathbb{R}|=|\mathbb{C}|=|\mathcal{P}(\mathbb{N})|=|\{0,1\}^\mathbb{N}|=\mathfrak{c}$ — all correct. ($|\mathbb{C}| = \mathfrak{c}$ via $\mathbb{C}\cong\mathbb{R}^2$ and $\mathfrak{c}^2 = \mathfrak{c}$.)
- **Transcendentals have cardinality $\mathfrak{c}$** (line 999): correct — countable algebraic numbers cannot exhaust $\mathbb{R}$, so $|\mathbb{R}\setminus\overline{\mathbb{Q}}|=\mathfrak{c}$.
- **Axiom of choice** (line 1010): non-emptiness of $\prod_{i\in I} A_i$ for non-empty $A_i$ ⇔ existence of choice function — correct standard formulation.
- **Independence dates** (line 1014): Gödel 1938 (consistency), Cohen 1963 (independence) — historically correct.
- **Zorn's lemma** (line 1018): every non-empty poset in which every chain has an upper bound has a maximal element — standard, correct.
- **Tukey's lemma** (line 1020): every non-empty family of finite character has a $\subseteq$-maximal element — standard, correct.
- **Every vector space has a basis ⇔ AC** (line 1021): correct — the forward direction is standard Zorn; the converse is Blass (1984).
- **Tychonoff ⇔ AC** (line 1028): correct — Kelley (1950) showed Tychonoff for arbitrary products implies AC.
- **Banach–Tarski** (line 1029): closed unit ball in $\mathbb{R}^3$ decomposed into finitely many pieces and reassembled by rigid motions into two unit balls; pieces are non-measurable; AC essential — correct.
- **Cantor pairing widget arithmetic**: function classifier and Venn widget readout formulas (`|A∪B| = |A| + |B| − |A∩B|`, `|A△B| = |A∪B| − |A∩B|`) are correct identities.

## Wrong / dubious claims

- **Well-ordering theorem definition** (line 1019). The page glosses "well-ordered" as "given a total order with no infinite descending chain." This is the definition of a *well-founded* total order. In ZFC the two conditions are equivalent, but the standard textbook definition of *well-order* is "every non-empty subset has a least element." The "no infinite descending chain" formulation is logically weaker in ZF without choice — proving the equivalence with the least-element definition requires (countable / dependent) choice. Since the page is itself listing this as an *equivalent of AC*, choosing the choice-dependent definition is mildly circular and pedagogically unfortunate. Suggested fix: replace the parenthetical with "(a total order in which every non-empty subset has a least element)." This is a minor wording issue, not a math error per se.

## Underspecified or unverifiable claims

- **"Q injects into Z² via $p/q$ in lowest terms to $(p,q)$"** (line 849). The injection requires the sign convention $q>0$ (otherwise $1/2$ and $-1/-2$ both map to the same lowest-terms fraction with two valid representatives). This is universally implicit in "lowest terms" but is not spelled out. Not wrong, just relies on a convention.
- **"For finite $I$ this is obvious… $|I|$ many times"** (line 1012). The justification "one picks $a_1\in A_1$, then $a_2$, … $|I|$ many times" is intuitive but technically uses finite induction, which doesn't need AC; the appeal to "obvious" is fine pedagogically.

## Severity

minor errors (one wording-level imprecision in the well-ordering definition; everything else checks out)
