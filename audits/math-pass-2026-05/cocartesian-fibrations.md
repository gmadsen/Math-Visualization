# cocartesian-fibrations — math correctness audit (2026-05)

**Section:** Higher categories & toposes

## Verified claims

### Left and right fibrations (§1)

- **Left fibration definition** (line 270): a map of simplicial sets $p\colon\mathcal{E}\to\mathcal{B}$ where every left horn $\Lambda^n_0\to\mathcal{E}$ together with a chosen $\Delta^n\to\mathcal{B}$ extension lifts. Correct (HTT 2.0.0.3 / Kerodon 4.2.1).
- **Right fibration as $\mathrm{op}$-dual** (line 270): $p$ left ⟺ $p^{\mathrm{op}}$ right. Correct (the $\mathrm{op}$ functor reverses every 1-simplex and so swaps $\Lambda^n_0$ with $\Lambda^n_n$).
- **Sanity check at $n=2$** (line 272): the $\Lambda^2_0$ filler picks out $\tilde{g}\colon \tilde{y}\to\tilde{z}$ together with the witnessing 2-simplex once $\tilde{f}$ is given upstairs. Correct.
- **$\mathcal{B}=\Delta^0$ specialisation** (line 274): a left fibration $\mathcal{E}\to\Delta^0$ is the same data as a Kan complex. Correct (over a point $\Lambda^n_0$-lifting forces all-horn lifting via degeneracy / opposite-functor manoeuvres; HTT 2.1.3.4).
- **Slogan** (line 274): "left fibrations over $\mathcal{B}$ ↔ functors $\mathcal{B}\to\mathcal{S}$" — correct headline of HTT 2.2.1.2 / Kerodon 5.5.
- **§1 widget Step 1** (line 290): $\Lambda^n_0$ at $n=2$ description (vertex $\tilde{x}$, edges $\tilde{x}\to\tilde{y}$ and $\tilde{x}\to\tilde{z}$, missing $\tilde{y}\to\tilde{z}$). Correct.
- **§1 widget Step 3** (line 300): $\mathrm{op}$ exchanges $\Lambda^n_0\leftrightarrow\Lambda^n_n$. Correct.
- **§1 widget Step 5** (line 310): $\mathrm{LFib}(\mathcal{B})\simeq\mathrm{Fun}(\mathcal{B},\mathcal{S})$, $\mathrm{RFib}(\mathcal{B})\simeq\mathrm{Fun}(\mathcal{B}^{\mathrm{op}},\mathcal{S})$. Correct.

### Cocartesian edges (§2)

- **Mapping-space pullback formulation of cocartesian** (line 357): $\mathrm{Map}_{\mathcal{E}}(y, z)\to\mathrm{Map}_{\mathcal{E}}(x, z)\times_{\mathrm{Map}_\mathcal{B}(\bar{x}, p(z))}\mathrm{Map}_\mathcal{B}(\bar{y}, p(z))$ is a homotopy equivalence (HTT 2.4.1.5 / Kerodon 5.1.2.1). Correct.
- **Equivalent horn formulation** (line 358): $\Lambda^{n+1}_0$-horn whose initial edge is $e$ admits a filler, unique up to contractible space. Correct.
- **Concrete $n=1$ unpacking** (line 360): the cocartesian condition presented as a $\Lambda^2_0$-lifting. Correct.
- **Fiber-internal cocartesian = equivalence** (line 362): an edge of $\mathcal{E}_{\bar{x}}$ is $p$-cocartesian iff it is an equivalence in the fiber (HTT 2.4.1.5 (2)). Correct.
- **§2 widget Step 1–4** (lines 376–392): chosen $2$-simplex downstairs, declared lift upstairs, $\Lambda^2_0$ horn presentation, contractible space of fillers. Correct.

### Cocartesian fibration definition (§3)

- **Definition by inner-fib + cocartesian-lift existence** (line 429): $p$ inner fibration plus existence of a $p$-cocartesian lift starting at any $x \in \mathcal{E}_{\bar{x}}$ for every base edge. Matches HTT 2.4.2.1 / Kerodon 5.1.4.1.
- **Product projection** (line 437): $\pi_1\colon \mathcal{C}\times\mathcal{D}\to\mathcal{C}$ is cocartesian with constant fiber $\mathcal{D}$ and identity transport. Correct.
- **Modules over $\mathbb{E}_\infty$-rings** (line 436): $\mathrm{Mod}\to\mathrm{CAlg}$ is cocartesian with transport = derived base change. Correct (Lurie HA §4.5).
- **Diagonal / equalizer-inclusion non-examples** (line 439): not even inner fibrations in general. Correct.
- **biCartesian over $\Delta^1$ ⇔ ∞-adjunction** (line 441): correct (HTT 5.2.2.1).
- **§3 quiz cocartesian-fibration v1 Q1** (line 124): inner fib + cocartesian-lift existence. Correct.
- **§3 quiz cocartesian-fibration v1 Q3** (line 156): transport along $\bar{e}\colon c\to c'$ in product projection is $\mathrm{id}_\mathcal{D}$. Correct.
- **§3 quiz cocartesian-fibration hard Q1** (line 171): biCartesian over $\Delta^1$ encodes an ∞-adjunction (HTT 5.2.2.1). Correct.

### Fibers and transport (§4)

- **Fiber as pullback** (line 549): $\mathcal{E}_{\bar{x}}=\mathcal{E}\times_{\mathcal{B}}\{\bar{x}\}$ is an ∞-category by inner-fibration property. Correct.
- **Transport functor well-defined up to contractible choice** (lines 551–553): correct.
- **Composition functoriality $(\bar{f}\bar{e})_!\simeq \bar{f}_!\circ\bar{e}_!$** (line 556) and the corresponding v1 quiz Q2 (line 226): correct (composition order matches).
- **Source-map fiber = $\mathcal{C}_{x/}$, target-map fiber = $\mathcal{C}_{/y}$** (line 559) and the matching v1 quiz Q1 (line 213) and the spot-the-error hard Q2 (line 266): the fiber identifications themselves are correct ($\mathcal{C}_{x/}$ = arrows out of $x$; $\mathcal{C}_{/y}$ = arrows into $y$). The orientation/cartesian-vs-cocartesian assignment to source vs target is wrong — see "Wrong / dubious" below.
- **Equivalences in $\mathcal{B}$ transport to equivalences of fibers** (line 561) and the corresponding v1 quiz Q3 (line 238). Correct.
- **Hard quiz fibers-and-transport Q1** (line 252): cocartesian transport along $R\to S$ in $\mathrm{Mod}\to\mathrm{CAlg}$ is base change $S\otimes_R^\mathbb{L}-$. Correct (and the supplementary observation that restriction of scalars is the dual cartesian transport, with the two an adjoint pair, is correct).

### Straightening / unstraightening (§5)

- **Equivalence statement** (lines 668–670): $\mathrm{St}\colon\mathrm{coCart}(\mathcal{B})\xrightarrow\sim\mathrm{Fun}(\mathcal{B},\mathrm{Cat}_\infty)$ and inverse $\mathrm{Un}$, with morphisms on the cocartesian-fibration side being cocartesian-edge-preserving functors over $\mathcal{B}$. Correct (HTT 3.2.0.1 / Kerodon 5.5).
- **Classical Grothendieck recovery** (line 672): cocartesian fibrations of ordinary categories ↔ pseudofunctors $\mathcal{C}\to\mathrm{Cat}$ (SGA 1, Exp. VI). Correct.
- **Specialisation to left fibrations** (line 674): $\mathrm{LFib}(\mathcal{B})\simeq\mathrm{Fun}(\mathcal{B},\mathcal{S})$, $\mathrm{RFib}(\mathcal{B})\simeq\mathrm{Fun}(\mathcal{B}^{\mathrm{op}},\mathcal{S})$. Correct.
- **Straightening preserves limits** (line 678): $\mathrm{St}, \mathrm{Un}$ are equivalences hence preserve all (co)limits; fiber products of cocartesian fibrations ↔ pointwise products of functors; constant functor ↔ product projection. Correct.
- **§5 widget Steps 1–5** (lines 690–714): walk through $\mathrm{Un}$ on a $[1]$-shaped $F$ and recovery of $F$ via $\mathrm{St}$, leading to the equivalence. Correct.
- **v1 quiz grothendieck-construction Q1** (line 282): $\mathrm{St}\colon\mathrm{coCart}(\mathcal{B})\to\mathrm{Fun}(\mathcal{B},\mathrm{Cat}_\infty)$ is covariant. Correct.
- **v1 quiz grothendieck-construction Q2** (line 296): classical Grothendieck recovery as pseudofunctors $\mathcal{C}\to\mathrm{Cat}$. Correct.
- **v1 quiz grothendieck-construction Q3** (line 307): unstraightening of constant functor at $\mathcal{D}$ = $\mathcal{B}\times\mathcal{D}\to\mathcal{B}$. Correct.
- **Hard quiz grothendieck-construction Q1** (line 322): cocartesian-edge-preserving morphisms over $\mathcal{B}$ correspond to morphisms in $\mathrm{Fun}(\mathcal{B},\mathrm{Cat}_\infty)$ — i.e. natural transformations of the straightenings. Correct (HTT 3.2.0.1).
- **Hard quiz grothendieck-construction Q2** (line 335): straightening preserves fiber products / limits. Correct.

### Left fibrations as presheaves (§6)

- **Statement of equivalence** (line 757): $\mathrm{LFib}(\mathcal{B})\simeq\mathrm{Fun}(\mathcal{B},\mathcal{S})$. Correct.
- **Universal left fibration $\mathcal{S}_{*/}\to\mathcal{S}$** (line 760, line 770, hard quiz Q2 line 405): correct (HTT 3.3.2 / nLab "universal left fibration"). The fiber over $X\in\mathcal{S}$ is $X$ itself, which is the universal feature.
- **Pullback square exhibiting any left fibration** (line 761): $\mathcal{E}\simeq\mathcal{B}\times_\mathcal{S}\mathcal{S}_{*/}$. Correct.
- **$\mathcal{B}=\Delta^0$ collapse** (line 768): a left fibration over a point = a Kan complex; $\mathrm{LFib}(\Delta^0)\simeq\mathcal{S}$. Correct, mirrored in hard quiz Q1 (line 392).
- **Slice $\mathcal{B}_{/b}\to\mathcal{B}$ has fiber $\mathrm{Map}_\mathcal{B}(a, b)$ over $a$** (line 766): correct (this is Lurie HTT 1.2.9 / Kerodon 4.3.6 for the right-fibration version of the slice).
- **v1 quiz left-fibrations-as-presheaves Q1** (line 352): $\mathrm{LFib}(\mathcal{B})\simeq\mathrm{Fun}(\mathcal{B},\mathcal{S})$. Correct.
- **v1 quiz left-fibrations-as-presheaves Q3** (line 378): left fibration = cocartesian fibration with Kan-complex fibers. Correct (HTT 2.1.1.2 / 2.4.2.4 — the cocartesian-edge-existence half is automatic once one has Kan-complex fibers + inner fibration in this setting because every edge of a left fibration is automatically cocartesian).

### Examples (§7)

- **Modules fibration** (line 832) repeats the §3 statement: $\mathrm{Mod}\to\mathrm{CAlg}$ is cocartesian, with transport = $S\otimes_R^\mathbb{L}-$, biCartesian with restriction of scalars. Correct.
- **$BG$-action / Borel construction** (line 836): a left fibration $\mathcal{E}\to BG$ corresponds to a functor $BG\to\mathcal{S}$, i.e. a $G$-action on the fiber $X = \mathcal{E}_*$; the total space is $X/\!\!/ G = EG\times_G X$. Correct (the standard $\infty$-categorical packaging of equivariant homotopy theory).
- **Cofiber sequences as fibrations over $\Delta^2$** (line 840): morally correct; the precise packaging is in HA §1.1.1 and Kerodon 7.2 (cofiber sequences as exact triangles). Acceptable as a high-level pointer.
- **Hard quiz left-fibrations-as-presheaves Q1** (line 392): "left fibration over $\Delta^0$" = Kan complex. Correct.
- **Hard quiz left-fibrations-as-presheaves Q2** (line 405): universal left fibration is $\mathcal{S}_{*/}\to\mathcal{S}$. Correct.
- **v1 quiz examples Q3** (line 462): why base change must be derived ($S\otimes_R^\mathbb{L}-$, not $S\otimes_R-$) for the modules fibration to be cocartesian — correct.

## Wrong / dubious claims

- **§3 line 435; §4 line 559 (implicitly); §7(a) line 830; §3 quiz multi-select Q2 (line 140) choice [0]; §3 hard quiz matching (line 184) and §7 matching quiz (line 422) — source/target evaluation maps reversed.** The page consistently asserts that the **source** map $s\colon\mathrm{Fun}(\Delta^1,\mathcal{C})\to\mathcal{C}$ (= evaluation at vertex $0$) is a **cocartesian** fibration and that the **target** map $t$ (= evaluation at $1$) is **cartesian**. This is exactly backwards. The standard reference (Lurie HTT Cor 2.4.7.11 / Kerodon Tag 01VK; nLab "coCartesian fibration" § Examples · Projections from comma categories) states: $\mathrm{ev}_0\colon\mathrm{Fun}(\Delta^1,\mathcal{C})\to\mathcal{C}$ is a **cartesian** fibration; $\mathrm{ev}_1$ is a **cocartesian** fibration. Conceptually: given $f\colon a\to b$ (an object over the source $a$) and $\bar{e}\colon a\to a'$, there is no canonical arrow out of $a'$ obtainable from this data without inverting $\bar{e}$, so the source map cannot admit canonical cocartesian transport; the natural lift is the cartesian one going from $g\colon a'\to b'$ over $a'$ back to $g\circ\bar{e}\colon a\to b'$ over $a$. Symmetrically, target map admits canonical $\bar{e}\circ f$-style cocartesian transport. The slice-functor straightening direction follows: $a\mapsto\mathcal{C}_{a/}$ is naturally **contravariant** (precomposition $\mathcal{C}_{a'/}\to\mathcal{C}_{a/}$ via $g\mapsto g\circ \bar{e}$), so it straightens a *cartesian* fibration on $\mathcal{C}^{\mathrm{op}}$, not a cocartesian one on $\mathcal{C}$. The fiber identifications themselves (source-fiber over $a$ = $\mathcal{C}_{a/}$, target-fiber over $b$ = $\mathcal{C}_{/b}$) are correct; only the cocart/cart classification and the implied straightening direction are reversed.

  Knock-on damage:
  - **§2 widget Step 5 (line 396)** worked example is internally inconsistent: it correctly identifies the cocartesian lift as the $2$-simplex with $\partial_2=\bar{e}$ and $\partial_1=f$, but then states "Transport $\bar{e}_!\colon\mathcal{C}_{a/}\to\mathcal{C}_{a'/}$ is precomposition with $\bar{e}^{-1}$", which only makes sense when $\bar{e}$ is invertible and gives the wrong direction in any case (precomposition would land in $\mathcal{C}_{a/}$, not $\mathcal{C}_{a'/}$).
  - **§7(a) line 830** says "Transport along $\bar{e}\colon a\to a'$: precomposition" without clarifying with what or in which direction; the formulation is muddled by the source/target swap.
  - **§7 examples-of-fibrations multi-select Q (line 446)** lists "$\mathcal{C}_{x/}\to\mathcal{C}$" as a left fibration with the description "the slice 'forget the source' map." The map exists and the projection is correct ($f\colon x\to a\mapsto a$, fiber over $a$ = $\mathrm{Map}_\mathcal{C}(x,a)$, hence a left fibration). The "forget the source" gloss is fine. But the analogous source map $s$ being labelled cocartesian elsewhere is inconsistent with $\mathcal{C}_{x/}\to\mathcal{C}$ being a left fibration — together with the correct fact that $\mathcal{C}_{/x}\to\mathcal{C}$ is a right fibration — because both slice projections are induced by the eval-at-target / eval-at-source structure of the arrow category and should match the source/target labels. The page's source/target reversal makes the §1, §6, §7 multi-select correctly identify $\mathcal{C}_{x/}\to\mathcal{C}$ as a left fibration while §3, §4, §7(a) incorrectly say the source map is cocartesian.

- **§1 widget Step 4 (line 305–306) — false equivalence.** The SVG asserts: "$p$ left fibration $\iff$ $p$ inner fibration AND every fiber $\mathcal{E}_b$ is a Kan complex $\iff$ every edge of $\mathcal{E}$ is $p$-cocartesian (§2). Joyal HTT 2.1.2.2 — three equivalent characterisations." The middle condition (inner fib + Kan-complex fibers) is **not** equivalent to being a left fibration — it omits the cocartesian-lift existence axiom. Counterexample: take $\mathcal{E}$ an ∞-category with two objects $0,1$ and $\mathrm{Map}_\mathcal{E}(0,1)\simeq S^1$, mapped to $\mathcal{B}=\Delta^1$ in the obvious way. Inner fibration ✓, fibers are points (Kan complexes) ✓, but no edge $0\to 1$ is cocartesian (the $S^1$ of choices means none is universal), so it is not a left fibration. The correct three-way equivalence is HTT 2.1.2.2 / Joyal: $p$ left fib ⟺ $p$ inner fib + every edge of $\mathcal{E}$ is $p$-cocartesian ⟺ horn extension $\Lambda^n_0$ for every $n\geq 2$ given the base extension. The "Kan-complex fibers" condition is a *consequence* (HTT 2.1.3.3) of being a left fibration, not part of the characterization.

- **§4 line 559 prose — orientation of $s$ vs $t$ as "source" vs "target".** The fiber identification is correct. But §4 doesn't explicitly say which of $s, t$ is cocartesian; the implicit assumption (carried through from §3 and §7) that $s$ is cocartesian and $t$ is cartesian is wrong (see top item).

- **§6 line 766 — Yoneda factorization through "the universal right fibration $\mathrm{ev}_1\colon\mathrm{Fun}(\Delta^1,\mathcal{B})\to\mathcal{B}$".** Two errors compounded: (a) $\mathrm{ev}_1$ is in fact a *cocartesian* fibration (HTT 2.4.7.11 / nLab), not a right fibration — its fibers are over-categories $\mathcal{B}_{/b}$ which are ∞-categories, not Kan complexes; (b) the actual "universal right fibration" is $\mathcal{S}_{*/}^{\mathrm{op}}\to\mathcal{S}^{\mathrm{op}}$ (the opposite of the universal left fibration; nLab "universal left fibration"), pulled back along the contravariant Grothendieck classifier of any individual right fibration. The Yoneda embedding factors through this: the right fibration $\mathcal{B}_{/b}\to\mathcal{B}$ (which IS a right fibration with mapping-space fibers) classifies the representable presheaf $\mathrm{Map}_\mathcal{B}(-,b)$, not $\mathrm{ev}_1$ itself.

- **§6 v1 quiz Q2 (line 366)** — same issue as the prose, packaged into a quiz: "Yoneda factors through the universal right fibration over $\mathcal{B}$ — i.e. the target map $\mathrm{tw}(\mathcal{B})\to\mathcal{B}$ of the twisted-arrow $\infty$-category projected onto its source-side." The mention of the twisted-arrow ∞-category is closer to right (the twisted-arrow construction $\mathrm{Tw}(\mathcal{B})\to\mathcal{B}^{\mathrm{op}}\times\mathcal{B}$ is a left fibration classifying the mapping-space functor; HTT 5.2.1 / Kerodon 8.1.1), but "$\mathrm{tw}(\mathcal{B})\to\mathcal{B}$ projected onto its source-side" is an unstandard description of the construction and conflates the target-projection of $\mathrm{Tw}$ with the universal right fibration. The closest correct statement: Yoneda factors through the universal right fibration restricted to $\mathcal{B}$, and a concrete model for that universal right fibration over $\mathcal{B}$ is the over-category fibration construction $b\mapsto\mathcal{B}_{/b}$ assembled into the family $\mathrm{Fun}(\Delta^1,\mathcal{B})\to\mathcal{B}$ via $\mathrm{ev}_1$ — but this last map is cocartesian, not a right fibration, and one passes to right fibrations by restricting to its sub-right-fibration consisting of *cartesian* edges.

- **§1 quiz hard Q2 (line 65–75) — Joyal's "trivial Kan fibration" recognition theorem.** The correct version (HTT 2.1.3.4 / Joyal): a left fibration $p\colon\mathcal{E}\to\mathcal{B}$ is a *trivial Kan fibration* iff every fiber is a contractible Kan complex. The quiz statement and answer are correct. (Listed here for completeness only — verified, not flagged.)

## Underspecified or unverifiable claims

- **§1 line 274 — "over a point $\Lambda^n_0$-lifting forces full $\Lambda^n_k$-lifting via degeneracies."** This is the "$\mathcal{B}=\Delta^0$ ⇒ Kan complex" claim. The argument is correct but more delicate than "via degeneracies" suggests; the standard proof uses the lifting-against-monomorphism / inner-anodyne machinery (HTT 2.1.3.1) rather than a one-step degeneracy reduction.

- **§2 line 358 — "every $\Lambda^{n+1}_0$-horn whose initial edge is $e$ admits a filler — and this filler is unique up to a contractible space of choices, given the data downstairs."** The statement is correct as a paraphrase of HTT 2.4.1.5 but the "given the data downstairs" qualifier is essential (without it the count of fillers is wrong); this is implicit in the displayed pullback but easily missed by a reader.

- **§4 line 553 — "These [different choices of cocartesian lifts] are themselves coherent (a higher choice)."** Correct in spirit but the precise statement (the space of choices forms a contractible Kan complex at each fiber object, and the assembled choices form a section of a contractible $\infty$-categorical bundle) is left informal. Acceptable for pedagogy.

- **§5 line 670 — "the lax colimit (the appropriate $\infty$-categorical Grothendieck-type construction)."** The total space $\mathrm{Un}(F)$ is the lax / oplax colimit depending on convention; cocartesian fibrations correspond to oplax colimits in Lurie's convention. The page's hand-wave is acceptable.

- **§5 line 678 — "Constant functors at $\mathcal{D}\in\mathrm{Cat}_\infty$ unstraighten to product projections $\mathcal{B}\times\mathcal{D}\to\mathcal{B}$."** Correct.

- **§6 line 760 — "every space, with its identity-classified-base-point."** The phrase "identity-classified-base-point" is non-standard; the intended meaning ("the fiber of $\mathcal{S}_{*/}\to\mathcal{S}$ over $X$ is $X$ itself, i.e. the space of basepoints") is correct.

- **§6 line 798 — `MVInlineCodeCell` toy example.** The 1-categorical Grothendieck construction sketch is correct as a toy but conflates the simplicial-set total space with a graph-of-objects-and-edges; a careful treatment would also need degeneracy and identity 1-simplices. Acceptable for an illustrative code cell.

- **§7(d) line 840 — "cofibration data assembles into a cocartesian fibration $\mathcal{E}\to\Delta^2$ where the three fibers are $A, X, X/A$ — and the transports realize the connecting maps."** This is morally correct (the "exact triangle" in a stable ∞-category is encoded by such a fibration over $\Delta^1\times\Delta^1$, or alternately a $\Delta^2$-shaped cone diagram; HA 1.1.1 / Kerodon 7.2.1), but the index $\Delta^2$ is sloppy: the standard formulation uses $\Delta^1\times\Delta^1$ (the 4-vertex pushout square) or $\Delta^3$ for the full exact-triangle data including the connecting map. Not a math error so much as imprecise indexing.

## Severity

**moderate to high.** The core definitions (left/right fibrations, cocartesian edges, cocartesian fibrations, fibers, transport, straightening / unstraightening) and the v1 quizzes for those concepts are all stated correctly, and the §5 Grothendieck-construction prose plus its widget walk-through (HTT 3.2.0.1 / Kerodon 5.5) are clean. However, three substantive defects appear in prominent positions and propagate across multiple sections:

1. **Source/target map orientation reversed (§3 line 435, §4 line 559 implicitly, §7(a) line 830, §3 multi-select Q2 line 140 choice [0], §3 hard matching Q line 184, §7 matching Q line 422, §2 widget Step 5 line 396).** The standard reference (HTT Cor 2.4.7.11; Kerodon Tag 01VK; nLab "coCartesian fibration") gives: $\mathrm{ev}_0$ (source map) is **cartesian**; $\mathrm{ev}_1$ (target map) is **cocartesian**. The page reverses this throughout. The v1 quiz "fibers-and-transport Q1" (line 213) only asks about the *fiber*, which is correctly identified as $\mathcal{C}_{x/}$, so it stays correct; but the matching Q in §3 hard tier and the matching Q in §7 both pair the slice functor $c\mapsto\mathcal{C}_{c/}$ with the source map, presenting it as a covariant cocartesian-fibration straightening — the slice functor is naturally **contravariant** ($c\mapsto\mathcal{C}_{c/}$ with $\bar{e}\colon a\to a'$ giving precomposition $\mathcal{C}_{a'/}\to\mathcal{C}_{a/}$), so it should pair with a cartesian fibration $\to$ contravariant straightening. Fix: globally swap source/target labels for $s, t$ on the arrow ∞-category, and rewrite §7(a) so $t$ is presented as the cocartesian fibration straightening to $b\mapsto\mathcal{C}_{/b}$ (and $s$ is the cartesian one).

2. **§1 widget Step 4 (line 305–306) — false equivalence "left fib ⟺ inner fib + Kan-complex fibers".** This omits the cocartesian-edge-existence axiom (a counterexample is $\Delta^1\to\Delta^0$-style edges where $\mathrm{Map}(0,1)\simeq S^1$ has no universal element; inner fib + Kan fibers, but no left fibration). The correct equivalence (HTT 2.1.2.2): inner fib + every edge cocartesian. Fix: replace "every fiber $\mathcal{E}_b$ is a Kan complex" with "every edge of $\mathcal{E}$ is $p$-cocartesian" in the middle clause, or otherwise rephrase the chain so the condition is (1)⟺(2)⟺(3) of HTT 2.1.2.2.

3. **§6 line 766 + v1 quiz Q2 line 366 — "$\mathrm{ev}_1\colon\mathrm{Fun}(\Delta^1,\mathcal{B})\to\mathcal{B}$ is the universal right fibration".** The map is in fact cocartesian, with over-category fibers (∞-categories, not spaces), so it isn't a right fibration at all. The Yoneda representable $\mathrm{Map}_\mathcal{B}(-, b)$ unstraightens to the slice $\mathcal{B}_{/b}\to\mathcal{B}$, which IS a right fibration with mapping-space fibers; the universal right fibration is $\mathcal{S}_{*/}^{\mathrm{op}}\to\mathcal{S}^{\mathrm{op}}$ (or its model via the twisted-arrow construction). Fix: either drop the "$\mathrm{ev}_1$" identification and just say Yoneda factors through the universal right fibration $\mathcal{S}_{*/}^{\mathrm{op}}\to\mathcal{S}^{\mathrm{op}}$ via the slice family $\{\mathcal{B}_{/b}\}_{b\in\mathcal{B}}$, or give the twisted-arrow-construction account (HTT 5.2.1).

Items 1 and 3 are systemic errors that mislead a learner about the canonical worked example and its relationship to Yoneda; item 2 is a single garbled equivalence in a widget step but is presented as a Joyal recognition theorem and would be quoted as such by anyone using the page.

All other content — the cocartesian-edge mapping-space pullback condition, the cocartesian-fibration definition, the transport-functor construction with contractible-choice well-definedness, the equivalence of the §5 Grothendieck construction with both directions explained, the universal left fibration $\mathcal{S}_{*/}\to\mathcal{S}$ with the pullback-square universal property, the modules/$\mathrm{CAlg}$ biCartesian fibration with derived base change, the $BG$-action / Borel construction picture — checks out and matches Lurie HTT / HA / Kerodon.
