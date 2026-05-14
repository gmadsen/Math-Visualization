# elementary-topos-theory — math correctness audit (2026-05)

**Section:** Higher categories & toposes

## Verified claims

### §1 — What is a topos?

- **Definition** (line 275): "finitely complete + cartesian closed + subobject classifier $\Omega$" — standard Lawvere–Tierney elementary-topos axioms; matches Mac Lane–Moerdijk Ch. IV. ✓
- **Mikkelsen / Paré equivalence** (line 275): finitely complete + power objects $P(A)$ ⇒ topos — correct attribution (the result is Mikkelsen's, with Paré's contravariant-power-object monadicity providing the structural underpinning). ✓
- **Cartesian closure $\Hom(X\times A, B)\cong\Hom(X, B^A)$** (line 276): standard $(-)\times A\dashv (-)^A$. ✓
- **Sub-representability** (line 277): $\mathrm{Sub}(X)\cong\Hom(X,\Omega)$ naturally in $X$, equivalent to representability of $\mathrm{Sub}\colon\mathcal{E}^{\mathrm{op}}\to\mathbf{Set}$. ✓
- **$\Omega^A = P(A)$ identification** (line 277): correct given a topos. ✓
- **Examples list** (line 278): $\mathbf{Set}$, presheaf categories, $\mathrm{Sh}(X)$, $G\text{-}\mathbf{Set}$ — all are toposes. ✓
- **Non-examples** (line 278): $\mathbf{Top}$ fails cartesian closure (no exponentials in general — function spaces require additional structure such as compact-generation; correct standard fact); $\mathbf{Ab}$ has no subobject classifier (any candidate $\Omega$ would have to be an abelian group, which forces collapse — correct but not the cleanest formulation; see §"Wrong/dubious" for the actual obstruction). The non-existence claim itself is correct.
- **Scrubber widget** (lines 299–336): all 5 step bodies state correct facts (finite limits ⇒ pullbacks/equalisers/products; cartesian closure; pullback square defining $\Omega$; $\Omega^A = P(A)$ from currying; the synergy giving Heyting structure on $\mathrm{Sub}(X)$).

### §2 — The subobject classifier $\Omega$

- **Pullback square defining $\Omega$** (line 343): standard formulation. ✓
- **Bijection $\mathrm{Sub}(X)\to\Hom(X,\Omega)$, $S\mapsto\chi_S$, natural in $X$** (line 344): correct.
- **$\Omega = \{\bot,\top\}$ in $\mathbf{Set}$, $\chi_S$ = indicator** (line 345): correct, with $\chi_S^{-1}(\top)=S$ recovering $S$. ✓
- **Presheaf $\Omega(c)$ = sieves on $c$** (line 346): correct standard formula.
- **$\mathrm{Sh}(X)$ has $\Omega(U)$ = open subsets of $U$** (line 346): correct (subsheaves of the terminal sheaf restricted to $U$ are open subsets).
- **$\Omega$ has internal Heyting-algebra structure, generally non-Boolean** (line 346): correct.
- **Scrubber widget** (lines 347–388): all 6 step bodies state correct facts. The walking-arrow / sieves / opens triple in step 6 is the standard trio.

### §3 — Characteristic maps as truth values

- **Internal $\wedge\colon\Omega\times\Omega\to\Omega$ as $\chi$ of $\langle\mathrm{true},\mathrm{true}\rangle\colon 1\hookrightarrow\Omega\times\Omega$** (line 415): correct standard construction.
- **Internal $\Rightarrow$ as $\chi$ of $\{(p,q):p\le q\}\hookrightarrow\Omega\times\Omega$** (line 415): correct.
- **$\chi_{S\cap T}=\chi_S\wedge\chi_T$** (line 415): correct functoriality of the Heyting structure.
- **Pullback computation $\chi_{S\cap T}$ via $X\xrightarrow{\langle\chi_S,\chi_T\rangle}\Omega\times\Omega\xrightarrow{\wedge}\Omega$** (line 416): correct.
- **Mitchell–Bénabou linkage** (line 416): correct — the topos models higher-order intuitionist logic.
- **Characteristic-map explorer widget** (lines 417–511): the indicator-function display, the pullback diagram with $S$ at top-left, $1$ at top-right, $X$ at bottom-left, $\Omega$ at bottom-right, and the live mapping of $X$-elements to $\top/\bot$ via $\chi_S$ all correctly compute and display.

### §4 — Power objects $P(A)$

- **$P(A) = \Omega^A$** (line 517): correct definition.
- **Composite bijection $\mathrm{Sub}(X\times A)\cong\Hom(X\times A,\Omega)\cong\Hom(X,\Omega^A)=\Hom(X,P(A))$** (line 518): both isomorphisms correct (universal property of $\Omega$ + currying).
- **$\mathrm{Sub}(A)\cong\Hom(1,P(A))$** (line 519): correct (set $X=1$).
- **$P(A)=\mathcal{P}(A)$ in $\mathbf{Set}$, with $|P(A)|=2^{|A|}$** (line 520): correct.
- **Membership relation $\in_A\subseteq A\times P(A)$ classified by $\mathrm{ev}\colon A\times P(A)\to\Omega$** (line 520): correct universal property (standard $\mathrm{ev}$ is the uncurry of $\mathrm{id}_{P(A)}$).
- **Presheaf-topos $P(A)(c)$ = subpresheaves of $A\times\Hom(-,c)$** (line 520): correct (this is the exponential-of-presheaves formula applied to $\Omega^A$; matches the formula stated in §5).
- **Mikkelsen / Paré / Tierney theorem reference** (line 521): correct attribution (Mikkelsen + Tierney's reformulation; Paré's monadicity perspective is also relevant). The claim that finitely complete + power objects ⇒ topos is the standard theorem.
- **Scrubber widget** (lines 522–559): the 5 steps all check out. The $|A|=3,|P(A)|=8=2^3$ enumeration is exact. The element-of relation classified by $\mathrm{ev}$, with comprehension as a global element $1\to P(A)$, is correct.

### §5 — Presheaf toposes $\hat{C} = [C^{\mathrm{op}}, \mathbf{Set}]$

- **$\hat{C}$ is a topos for any small $C$** (line 572): correct standard fact.
- **Limits and colimits computed pointwise** (line 572): correct.
- **Exponential formula $G^F(c)=\Hom_{\hat C}(F\times\Hom(-,c),G)$** (line 572): correct (the standard Yoneda-flavored formula; the term $\Hom(-,c)$ is the representable, and the formula is forced by Yoneda + cartesian closure of $\hat C$).
- **$\Omega(c)$ = sieves on $c$** (line 573): correct.
- **Sieve = downward-closed set of arrows into $c$ under precomposition** (line 573): correct definition.
- **Sieve = subpresheaf of representable $\Hom(-,c)=よ(c)$** (line 573): correct.
- **$\mathrm{true}_c$ = maximal sieve** (line 573): correct.
- **Restriction $f^*S=\{g:f\circ g\in S\}$ along $f\colon c'\to c$** (line 573): correct.
- **Poset case: sieve on $c$ = down-set in principal filter $\{c'\le c\}$** (line 574): correct (in a poset there is at most one arrow between objects, so a sieve on $c$ is determined by which elements of the down-set are in it, and the closure condition becomes downward closure).
- **Lattice of sieves on $c$ = Heyting algebra of down-sets, generally non-Boolean** (line 574): correct.
- **Walking-arrow $\mathbf{Set}^{\to}$ has $\Omega$ a 3-element set** (line 575): correct (3 down-closed subsets of $\{a,b\}$ with $a\le b$: $\emptyset, \{a\}, \{a,b\}$).
- **Simplicial sets = $[\Delta^{\mathrm{op}}, \mathbf{Set}]$** (line 575): correct.
- **Giraud-style claim "every Grothendieck topos arises as a left-exact reflective subcategory of some $\hat{C}$"** (line 575): correct (Giraud's theorem characterizes Grothendieck toposes as exactly the left-exact-reflective subcategories of presheaf categories).
- **Sieve-enumeration widget** (lines 576–737): the `sievesOn` function correctly enumerates downward-closed subsets of the principal-down filter for each of `chain3`, `vee`, `diamond`. Sieve count $|\Omega(c)|$ is computed correctly:
  - chain3 on $c$: 4 down-sets ($\emptyset,\{a\},\{a,b\},\{a,b,c\}$). ✓
  - vee on $c$: 4 down-sets ($\emptyset,\{a\},\{b\},\{a,b\},\{a,b,c\}$ — actually 5; the widget should report 5 because both $\{a\}$ and $\{b\}$ are independently down-closed and incomparable). The widget computes correctly via the brute-force subset enumeration; my mental count of 4 was wrong.
  - diamond on $\top$: there are 6 down-sets — $\emptyset,\{\bot\},\{\bot,a\},\{\bot,b\},\{\bot,a,b\},\{\bot,a,b,\top\}$. The widget computes this correctly.

### §6 — The topos of $G$-sets

- **$\mathbf{B}G$ defined as one-object groupoid with $\Hom(*,*)=G$** (line 765): correct.
- **$G\text{-}\mathbf{Set}\simeq[\mathbf{B}G^{\mathrm{op}}, \mathbf{Set}]$** (line 765): correct (and indeed $\simeq[\mathbf{B}G,\mathbf{Set}]$ since $\mathbf{B}G$ is a groupoid).
- **Limits/colimits computed underlyingly in $\mathbf{Set}$ with the action carried along** (line 765): correct.
- **Exponential $Y^X$ = $G$-equivariant maps with conjugation action** (line 765): correct (the standard formula in $G\text{-}\mathbf{Set}$: $Y^X = \mathbf{Set}(X,Y)$ with $(g\cdot f)(x) = g\cdot f(g^{-1}\cdot x)$).
- **$\mathrm{Hom}_{G\text{-}\mathbf{Set}}(G/H, G/K)\cong (G/K)^H$ = $H$-fixed cosets, non-empty iff $H\le K$ up to conjugation** (line 766): the bijection itself is correct (a standard fact about transitive $G$-sets); the conjugacy condition $g^{-1}Hg\subseteq K$ is correct. (See "Wrong/dubious" for the issue with naming this "Frobenius reciprocity.")
- **Subgroup lattice for $\mathbb{Z}/6$ is the diamond $\{e\}<\mathbb{Z}/2,\mathbb{Z}/3<\mathbb{Z}/6$** (quiz q1, lines 297–306): correct.
- **Subgroup lattice for $S_3$ has $\{e\}, 3$ subgroups of order 2 ($\langle s\rangle,\langle sr\rangle,\langle sr^2\rangle$), one of order 3 ($\langle r\rangle = A_3$), and $S_3$** (widget data, lines 798–807): correct.
- **Subgroup lattice for $V_4$: $\{e\}, 3$ subgroups of order 2, $V_4$** (widget data, lines 812–820): correct.

### §7 — Geometric morphisms

- **Geometric morphism = adjoint pair $f^*\dashv f_*$ with $f^*$ left exact** (line 921): correct definition (Mac Lane–Moerdijk Def. VII.1).
- **Direction convention: $f_*\colon\mathcal{F}\to\mathcal{E}$ same direction as $f$; $f^*\colon\mathcal{E}\to\mathcal{F}$ goes backwards** (line 921): correct standard convention.
- **Continuous $f\colon X\to Y$ induces a geometric morphism $\mathrm{Sh}(X)\to\mathrm{Sh}(Y)$ with $f^*$ = sheaf-pullback (left exact because $f^{-1}$ preserves finite intersections of opens) and $f_*$ = pushforward** (line 922): correct.
- **Sober spaces are recovered from $\mathrm{Sh}(X)$** (line 922): correct (Stone duality / sobrification).
- **Point of a topos = geometric morphism $\mathbf{Set}\to\mathcal{E}$** (line 923): correct.
- **Points of $\mathrm{Sh}(X)$ for sober $X$ correspond to topological points** (line 923): correct.
- **Ring map $A\to B$ induces geometric morphism $\mathrm{Sh}(\Spec\,B)\to\mathrm{Sh}(\Spec\,A)$, same direction as the spec map** (line 923): correct (note $\Spec$ reverses arrows: $A\to B$ in CRing yields $\Spec B\to\Spec A$ in Sch, which yields the same-direction geometric morphism).
- **Embedding = $f_*$ full and faithful** (line 924): correct standard definition.
- **Surjection = $f^*$ faithful** (line 924): correct standard definition (Johnstone, *Elephant* C3.4; equivalent to $f^*$ being conservative on subobjects).
- **Essential = $f^*$ has a further left adjoint $f_!$, so $f_!\dashv f^*\dashv f_*$** (line 924): correct.
- **Sheafification inclusion $\mathrm{Sh}(C,J)\hookrightarrow\hat{C}$ is a geometric morphism with $f^*$ = sheafification** (line 924): correct (sheaves form a left-exact reflective subcategory; the geometric morphism points $\mathrm{Sh}(C,J)\to\hat C$ with sheafification $a$ as $f^*$, which is left exact — this is the content of "left-exact reflective").
- **Direction-explorer widget** (lines 925–1043): all three scenario explanations (`space`, `ring`, `point`) state the correct directionality and exactness facts. The "$f^*$ left exact, $f_*$ generally only left exact" framing is correct; the stalk/skyscraper adjunction for points is correct.

### Quiz bank claims (cross-checked against standard references)

- **topos-definition q1 (multi-select)**: $\mathbf{Set}$, $G\text{-}\mathbf{Set}$, presheaves are toposes; $\mathbf{Top}$ and $\mathbf{Ab}$ are not. ✓ Correct.
- **topos-definition q2 (mcq)**: small-cocompleteness is NOT one of the elementary axioms — correct (that is the Grothendieck-topos additional axiom).
- **topos-definition q3 (mcq)**: Mikkelsen–Paré–Tierney equivalent characterization via power objects. ✓ Correct.
- **subobject-classifier q1 (matching)**: $\mathbf{Set}\leftrightarrow\{\bot,\top\}$, presheaves $\leftrightarrow$ sieves, sheaves on $X\leftrightarrow$ opens of $U$, $G\text{-}\mathbf{Set}\leftrightarrow$ subgroups with conjugation. The first three are correct; the fourth is the systematic error discussed below.
- **subobject-classifier q2 (mcq)**: $\Omega$ represents the contravariant subobject functor; uniqueness up to canonical iso by Yoneda. ✓ Correct.
- **subobject-classifier q3 (mcq)**: in $\hat C$ for $C=\{a\le b\}$, $|\Hom(1,\Omega)|=3$. **Verified by direct count**: subobjects of the terminal presheaf $1$ assign $S(c)\subseteq\{*\}$ to each $c$ subject to compatibility under restriction. For $a\le b$, the restriction $1(b)=\{*\}\to 1(a)=\{*\}$ is forced, so if $S(b)=\{*\}$ then $S(a)=\{*\}$. Three options: $S(a)=S(b)=\emptyset$, $S(a)=\{*\},S(b)=\emptyset$, $S(a)=S(b)=\{*\}$. ✓ Correct.
- **subobject-classifier hard q2 (mcq)**: discrete category $\{a,b\}$ gives $\Omega(a)=\Omega(b)=\{\bot,\top\}$ with $|\Hom(1,\Omega)|=4$. Verified: subobjects of $1$ in $\mathbf{Set}\times\mathbf{Set}$ are pairs $(S_a, S_b)\in\{\emptyset,\{*\}\}^2$, giving 4. ✓ Correct.
- **characteristic-maps q1 (mcq)**: indicator $\chi_{\{2,4\}}(1)=\bot, \chi(2)=\top, \chi(3)=\bot, \chi(4)=\top$. ✓
- **characteristic-maps q2 (mcq)**: $\wedge=\chi$ of $\langle\mathrm{true},\mathrm{true}\rangle$. ✓
- **characteristic-maps q3 (ordering)**: identify subobject → universal property → verify pullback → name. The order is the standard construction order. ✓
- **power-objects q1 (numeric)**: $|P(\{a,b,c,d\})|=2^4=16$. ✓
- **power-objects q2 (mcq)**: bijection comes from cartesian closure. ✓
- **power-objects q3 (mcq)**: $\in_A$ is classified by evaluation. ✓
- **presheaf-topos q1 (numeric)**: chain $\{a\le b\le c\}$ has 4 sieves on $c$ ($\emptyset,\{a\},\{a,b\},\{a,b,c\}$). ✓
- **presheaf-topos q2 (mcq)**: exponentials in $\hat C$ are NOT pointwise; the Yoneda formula is correct. ✓
- **presheaf-topos q3 (mcq)**: $\mathrm{Sh}(X)$ for non-discrete $X$ is NOT a presheaf topos. ✓ Correct (it is a left-exact reflective subcategory).
- **presheaf-topos hard q1 (mcq)**: walking-iso category is equivalent to terminal category, so $\hat C\simeq\mathbf{Set}$. ✓ Correct (any equivalence $C\to D$ induces an equivalence $[D^{\mathrm{op}},\mathbf{Set}]\to[C^{\mathrm{op}},\mathbf{Set}]$).
- **presheaf-topos hard q2 (mcq)**: $\Hom_{\hat C}(1,\Omega)=\mathrm{Sub}_{\hat C}(1)$, the subobjects of the terminal presheaf, equivalently "global sieves on $C$." ✓ Correct.
- **g-set-topos q1 (mcq)**: $\mathbb{Z}/6$ subgroup lattice is the diamond $\{0\}<\mathbb{Z}/2,\mathbb{Z}/3<\mathbb{Z}/6$. ✓
- **g-set-topos q3 (mcq)**: $G\text{-}\mathbf{Set}\simeq\mathbf{Set}$ when $G$ trivial. ✓ (Result correct; explanation invokes the bogus "subgroup lattice" reasoning — see below.)
- **geometric-morphisms-intro q1 (mcq)**: $f^*\colon\mathcal{E}\to\mathcal{F}$ left exact, $f_*\colon\mathcal{F}\to\mathcal{E}$ direct image. ✓
- **geometric-morphisms-intro q2 (mcq)**: continuous $f\colon X\to Y$ gives $\mathrm{Sh}(X)\to\mathrm{Sh}(Y)$ with $f^*$ = sheaf-pullback. ✓
- **geometric-morphisms-intro q3 (mcq)**: a point is a geometric morphism $\mathbf{Set}\to\mathcal{E}$. ✓
- **geometric-morphisms-intro hard q1 (mcq)**: $\mathrm{Sh}(C,J)\hookrightarrow\hat C$, sheafification = $f^*$ (left exact), inclusion = $f_*$. ✓
- **geometric-morphisms-intro hard q2 (mcq)**: $f_!$ for an essential geometric morphism is NOT generally left exact (it preserves colimits as a left adjoint, but not finite limits). ✓ Correct.

## Wrong / dubious claims

### Major: subobject classifier of $G\text{-}\mathbf{Set}$ is **not** "the set of subgroups of $G$ with conjugation action"

This claim is repeated in three places — §6 prose (line 767), §6 widget readout (line 896), and the matching-quiz answer in subobject-classifier q1 (lines 63, 71–76) — and also propagated to `heyting-algebras-toposes.html` line 429.

**The actual subobject classifier of $G\text{-}\mathbf{Set}$ is $\Omega = \{0,1\}$ with the trivial $G$-action**. The topos $G\text{-}\mathbf{Set}$ (= functors $\mathbf{B}G\to\mathbf{Set}$, equivalently presheaves on the groupoid $\mathbf{B}G$) is **Boolean**.

**Verification by the universal property.** Subobjects of a $G$-set $X$ are exactly $G$-stable subsets — equivalently, unions of $G$-orbits. We check that $\Omega = \{0,1\}$ trivial works: a $G$-equivariant map $\chi\colon X\to\{0,1\}$ (with trivial action on the codomain) is a function constant on each $G$-orbit of $X$, and $\chi^{-1}(1)$ is a union of orbits — exactly a subobject. The bijection $\mathrm{Sub}(X)\cong\Hom_{G\text{-}\mathbf{Set}}(X,\{0,1\})$ holds with $\mathrm{true}\colon\{*\}\to\{0,1\}$ picking $1$.

**Verification via the sieve formula** (which the page invokes). Sieves on $*\in\mathbf{B}G$ are subsets of $\Hom(*,*)=G$ that are closed under precomposition: $h\in S$ and $g\in G$ ⇒ $h\circ g = hg\in S$. Since $G$ is a group, the only such subsets are $\emptyset$ and $G$. So $\Omega(*) = 2$, with the unique non-identity action being trivial because $\mathbf{B}G$ has no other arrows to act through. (This contradicts the page's "sieves on $*$ unwind to subgroups" claim, which would only be correct if "sieves" were redefined as "sub-actions of the right-regular action on $G$," which is *not* the same thing.)

Mac Lane–Moerdijk *Sheaves in Geometry and Logic* discusses this Boolean property of $G\text{-}\mathbf{Set}$ in §IV.1 / §IV.10.

**The correct statement that *is* in this neighborhood:** for a *topological* group $G$ acting *continuously* (with open stabilisers — i.e., the topos of continuous $G$-sets, sometimes denoted $BG_{\text{cts}}$ or the *Schanuel-style* topos), $\Omega$ is the set of *open* subgroups of $G$ with conjugation action. For a discrete group this collapses back to the all-subgroups picture only if you take a different topos than $G\text{-}\mathbf{Set}$ — typically the topos of $G$-sets with finite stabilisers. The page is conflating these two distinct toposes.

The "stabiliser-of-membership" formula $\chi_S(x) = \{g : gx\in S\}$ in line 767 is also wrong for the same reason: for a $G$-stable $S\hookrightarrow X$, this set is either all of $G$ (if $x\in S$) or $\emptyset$ (if $x\notin S$, since $S$ is $G$-stable: $gx\in S \iff x\in g^{-1}S = S$). So the formula collapses to the indicator function $\chi_S(x)\in\{\emptyset, G\}$, recovering $\Omega = \{0,1\}$ as expected. The page reads this as "an arbitrary subgroup of $G$," but in fact it always lands in $\{\emptyset, G\}$.

### Major: subobjects of $G/H$ in $G\text{-}\mathbf{Set}$ are *not* parameterised by intermediate subgroups

§6 line 766 claims "a subobject of $G/H$ is determined by an intermediate subgroup $H\le K\le G$, namely the image of $G/H\to G/K$." This is wrong for two reasons.

(a) The map $G/H\to G/K$ (when $H\le K$) is *surjective*, not injective. Its image is all of $G/K$, which is a different $G$-set, not a subobject of $G/H$.

(b) $G/H$ is a *transitive* $G$-set, so its $G$-stable subsets are only $\emptyset$ and $G/H$ itself. So $\mathrm{Sub}_{G\text{-}\mathbf{Set}}(G/H) = \{\emptyset, G/H\}$ — only two subobjects.

What intermediate subgroups $H\le K\le G$ actually parameterise are *quotients* $G/H\twoheadrightarrow G/K$ (in $G\text{-}\mathbf{Set}$), not subobjects. The lattice of subgroups containing $H$ is the lattice of $G$-equivariant *quotients* of $G/H$, i.e., the *quotient lattice*, dual to the subobject lattice in some sense.

### Major: the §6 widget "Subobjects of $G/H$ as intermediate subgroups" displays mathematically wrong data

The widget at lines 768–905 picks $H = 1$ so it works with the regular $G$-set $G/1 = G$ (with left translation), and it shows "the subgroup $K\subseteq G$ as a subset of $G$ lighting up." But $K\subseteq G$ is *not* a sub-$G$-set of $G$ under left translation unless $K\in\{\emptyset, G\}$.

**Concrete counter-example from the widget data.** With $G=\mathbb{Z}/6$ and $K = \langle 3\rangle = \{0,3\}$: the action of $1\in\mathbb{Z}/6$ sends $\{0,3\}\to\{1,4\}$, which is not contained in $\{0,3\}$. So $\{0,3\}$ is *not* a $G$-stable subset of $G$ under the regular action. The widget displays it as "the subobject" anyway.

Similarly for $S_3$ with $\langle s\rangle = \{e,s\}$: left multiplication by $r$ sends $\{e,s\}\to\{r, rs\}$, not contained in $\{e,s\}$. Not a sub-$S_3$-set.

The right thing the widget *could* display is the lattice of sub-$G$-sets of $G/1$, which has only two elements ($\emptyset$ and $G$), or the dual lattice of *quotients* $G\twoheadrightarrow G/K$, which is the subgroup lattice. The current visual is a category error.

### Minor: "Frobenius reciprocity" misnomer

§6 line 766 says equivariant maps $G/H\to G/K$ correspond to $H$-fixed cosets "by Frobenius reciprocity." The bijection itself ($\Hom_{G\text{-}\mathbf{Set}}(G/H, G/K)\cong (G/K)^H$) is correct, but it is more commonly called *the orbit-counting / fixed-point formula for transitive G-sets* or simply the universal property of $G/H$ as the free $G$-set on an $H$-fixed point. "Frobenius reciprocity" classically refers to the representation-theoretic adjunction $\Hom_G(\mathrm{Ind}_H^G V, W)\cong\Hom_H(V, \mathrm{Res}^G_H W)$. The two are related by linearisation, but using the name without that linkage is loose. A reader who looks up "Frobenius reciprocity" will find a different formula.

### Minor: the §1 reason $\mathbf{Ab}$ has no subobject classifier (also restated in subobject-classifier hard q1)

The page (line 278, also subobject-classifier hard q1 explanation at lines 117–119) frames this as "$\Omega$ would have to be additive, forcing collapse." This is informally correct — any candidate $\Omega$ in $\mathbf{Ab}$ must be an abelian group, and $\Hom_{\mathbf{Ab}}(X,\Omega)$ is a *group* of homomorphisms, not the set of arbitrary subgroups of $X$. But the cleaner argument (which the quiz answer D actually gestures at) is:

In $\mathbf{Ab}$, subobjects of $X$ are subgroups, and the classifying data is the projection $X\twoheadrightarrow X/S$. The cardinality $|\mathrm{Sub}(X)|$ varies with $X$ (e.g., $\mathbf{Z}$ has $\aleph_0$ subgroups but $\mathbf{Z}/p$ has 2), and for any single object $\Omega$, $|\Hom_{\mathbf{Ab}}(\mathbf{Z}, \Omega)| = |\Omega|$ but $|\Hom_{\mathbf{Ab}}(\mathbf{Z}/p, \Omega)| = $ number of $p$-torsion elements of $\Omega$. For these counts to match $|\mathrm{Sub}|$ for all $X$, no $\Omega$ can work. The page's "additive" framing is correct in spirit but the quiz q1 hard's claim "the only candidate $\mathbb{Z}/2$ fails" is a non-sequitur (there's no canonical "candidate $\mathbb{Z}/2$" in $\mathbf{Ab}$). Minor wording / framing issue, not an error.

### Minor: quiz "g-set-topos q3" explanation invokes the bogus subgroup-classifier reasoning

The result (G trivial ⇒ $G\text{-}\mathbf{Set}\simeq\mathbf{Set}$) is correct, but the explanation reasons via "$\Omega$ has more than 2 elements (the lattice of subgroups)" — which is the same erroneous claim from above. Under the correct ($\Omega = \{0,1\}$) interpretation, the trivial-group special case is just "$\mathbf{B}\{e\}$ is the terminal category, so $G\text{-}\mathbf{Set}\simeq\mathbf{Set}$" — the explanation should avoid the subgroup framing.

### Minor: "Mikkelsen / Paré / Tierney" attribution

§4 line 521 attributes the power-object characterization to "Mikkelsen / Paré / Tierney." The standard attribution is Mikkelsen (for the equivalence of definitions) and Paré (for the contravariant-power-object monadicity perspective). Tierney's contribution is the original axiomatization of the elementary topos rather than this specific theorem. Adding Tierney here is a minor over-attribution but not a factual error.

## Underspecified or unverifiable claims

- **Internal $\Rightarrow$ classifying $\{(p,q):p\le q\}$** (line 415). This is correct, but the order $\le$ on $\Omega$ is not yet defined at this point in the prose — the page implicitly invokes the canonical Heyting-algebra order. A reader following only this section would need to take "$\le$" on faith; standard textbooks define the order as $p\le q \iff p\wedge q = p$ (which requires $\wedge$, defined in the previous sentence, but the order itself is left implicit).
- **§5 line 572** "Limits and colimits are computed pointwise." Correct for a presheaf topos. (Worth flagging only because in subcategories like sheaves, only limits are pointwise; colimits require sheafification. The page handles this correctly in §7 but doesn't flag it here.)
- **§7 line 921** "$f^*$ is left exact" — this is the constraint *on the left adjoint*, which is non-trivial because right adjoints are automatically left exact but left adjoints are not. The page does flag this in the q1 explanation (line 348) but not in the prose.

## Severity

**major errors.** Three substantive errors cluster around the §6 treatment of $G\text{-}\mathbf{Set}$:

1. **The claimed identification $\Omega_{G\text{-}\mathbf{Set}} = \{$subgroups of $G$ with conjugation$\}$ is wrong.** The correct $\Omega$ is $\{0,1\}$ with trivial $G$-action; the topos is Boolean. The "subgroups" classifier is a feature of the topos of *continuous* $G$-sets for a topological group, not the abstract-$G$-Set topos $[\mathbf{B}G^{\mathrm{op}},\mathbf{Set}]$. (Also propagated to `heyting-algebras-toposes.html` line 429.)

2. **The claim that subobjects of $G/H$ are parameterised by intermediate subgroups $H\le K\le G$ is wrong.** Subobjects of a transitive $G$-set are only the empty set and the whole thing. Intermediate subgroups parameterise *quotients*, not subobjects.

3. **The §6 widget is mathematically wrong.** It displays subgroups $K\subseteq G$ as "subobjects of $G$ in $G\text{-}\mathbf{Set}$" — but generic subgroups are not stable under the regular left action (verified concretely with $\mathbb{Z}/6$ and $S_3$).

These are not pedagogical roundings or notation conventions: they are three mutually reinforcing errors that mis-state the structure of the most-discussed non-Set topos in the page. Two quiz answers (subobject-classifier q1 matching, g-set-topos q2 mcq) and one quiz explanation (g-set-topos q3) propagate the error to the assessment, and the cross-reference in `heyting-algebras-toposes.html` line 429 makes it page-spanning.

The remaining content is mathematically clean: the §1–5 treatment of finite limits, cartesian closure, $\Omega$ in $\mathbf{Set}$ / presheaf toposes / sheaf toposes, characteristic maps, power objects, sieves, the exponential formula in $\hat C$, and the §7 treatment of geometric morphisms (direction convention, $f^*$ left exactness, points, embeddings, surjections, essential morphisms, sheafification as $f^* $) are all correct standard formulations matching Mac Lane–Moerdijk and Johnstone's *Elephant*.
