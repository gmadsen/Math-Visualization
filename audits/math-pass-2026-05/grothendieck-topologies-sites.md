# grothendieck-topologies-sites — math correctness audit (2026-05)

**Section:** Higher categories & toposes

## Verified claims

### Sieves (§1)

- **Sieve definition** (line 270): a set of arrows with codomain $c$ closed under precomposition (if $f: d \to c \in S$ and $g: e \to d$ then $f \circ g \in S$) — standard, correct.
- **Sieve = subfunctor of $h_c$** (line 271): a subfunctor $S \hookrightarrow h_c$ assigns each $d$ a subset $S(d) \subseteq h_c(d)$ stable under reindexing along $g: e \to d$, which is exactly the precomposition-closure axiom — correct.
- **$\mathrm{Sub}(h_c)$ is a complete lattice in the presheaf topos $\widehat{C}$, with $\bigcup, \bigcap$ pointwise** (line 271) — correct.
- **Maximal sieve $\mathrm{max}_c = h_c$** and **empty sieve $\varnothing_c$** (line 272) — correct.
- **Family $\{f_i: d_i \to c\}$ generates a sieve** (line 272): smallest precomposition-closed family containing each $f_i$ — correct.
- **Poset case: sieve on $c$ = down-set of $\{d : d \le c\}$** (line 273): when $C$ is a poset (singleton or empty hom-sets), precomposition-closure reduces to down-set closure — correct. Maximal sieve = principal down-set $\downarrow\!c$ — correct.
- **Sieve widget** (lines 308–438): the `downClosed()` function correctly enumerates precomposition closure: for $(d \to c)$ in the sieve and any arrow $(e \to d)$, it adds $(e \to c)$. The poset transitive closure `le()` is correct (standard Floyd–Warshall-style breadth expansion). The widget's "is covering" test checks containment of all incoming arrows, i.e., max sieve.
- **Quiz Q1 sieves** (line 7): every listed family on $\{x, y, t\}$ is precomposition-closed because all hom-sets are singletons — correct.
- **Quiz Q3 sieves** (line 28): "subset of $\Hom(C, c)$ closed under precomposition" is the right generalization — correct.

### Grothendieck topology axioms (§2)

- **Three axioms (M, S, T)** (line 445):
  - (M) $\mathrm{max}_c \in J(c)$. ✓ standard.
  - (S) Stability: $S \in J(c), f: d \to c \Rightarrow f^*S = \{g: e \to d : f \circ g \in S\} \in J(d)$. ✓ matches MacLane–Moerdijk III.2.
  - (T) Transitivity: $S \in J(c)$, $T$ a sieve on $c$ such that $f^*T \in J(d)$ for every $f: d \to c$ in $S$, then $T \in J(c)$. ✓
- **Pullback sieve formula** $f^*S = \{g : f \circ g \in S\}$ — correct.
- **Trivial topology $J_{\mathrm{triv}}(c) = \{\mathrm{max}_c\}$ verifies M, S, T** (line 447): for S, $f^*\mathrm{max}_c = \mathrm{max}_d$ (every arrow $g: e \to d$ has $f \circ g \in \mathrm{max}_c$); for T, the only $T$ with $\mathrm{id}_c^*T = T \in J_{\mathrm{triv}}(c)$ is $\mathrm{max}_c$. ✓ Sheaves on $J_{\mathrm{triv}}$ = all presheaves. ✓
- **Discrete topology** "every sieve covers — only constant presheaf at terminal set is a sheaf" (line 447): for the empty sieve $\varnothing \in J(c)$, the sheaf condition forces $F(c) \cong \lim_\varnothing F = 1$, so $F$ is constant at $1$. ✓ (Terminology note: this is more often called the "chaotic" or "codiscrete" topology in the literature, with "discrete" sometimes reserved for the smallest topology making every sieve trivially closed; the page's terminology is non-standard but mathematically unambiguous.)
- **Worked-example walkthrough** (lines 464–522) on $\{x, y, t\}$ with $x, y \le t$, sieve $\{x \to t, y \to t\}$ generating cover:
  - Step 2 (M): max_t ⊇ {x→t, y→t}, and any sieve containing a covering sieve is itself covering. The closure-under-superset property is implicit in axiom M plus the standard convention that $J(c)$ is closed under sieve inclusion (this is automatic from S and T but worth flagging — see "Underspecified" below).
  - Step 3 (S, pullback to $x$): $f^*S = \{g: e \to x : (x \to t) \circ g = (e \to t) \in S\}$. The only arrow into $x$ is $\mathrm{id}_x$, and $(x \to t) \circ \mathrm{id}_x = (x \to t) \in S$. So $f^*S = \{\mathrm{id}_x\} = \mathrm{max}_x$. ✓ Then $\mathrm{max}_x \in J(x)$ by M. ✓
  - Step 4 (S, pullback to $y$): symmetric, $g^*S = \mathrm{max}_y$. ✓
  - Step 5 (T): the argument is a bit telescoped but correct in spirit — for a sieve $T$ with $f^*T \in J(d)$ for each $f \in S$, the only covering sieves on $x$ and $y$ are the maxima (since the topology was described only at $t$; on $x, y$ we can only invoke M). For $f^*T = \mathrm{max}_x$ to hold, $\mathrm{id}_x \in f^*T$ means $f \circ \mathrm{id}_x = (x\to t) \in T$. Symmetrically $(y \to t) \in T$. So $T \supseteq S$, hence $T$ is covering. ✓
- **Quiz hard Q1 (open-cover topology on $\mathrm{Open}(X)$)** (line 88): defining $J(U)$ as sieves whose member opens cover $U$ as point-sets satisfies M (max sieve includes $U \to U$, $\bigcup = U$), S (restricting cover to $V$ remains a cover of $V$), T (covers of pieces of a cover give a cover of the whole) — correct.
- **Quiz hard Q2 (one-object category $\{*\}$ with one identity)** (line 100): sieves on $*$ are $\varnothing$ or $\{\mathrm{id}_*\} = \mathrm{max}_*$. M forces $\mathrm{max}_*$ covering. The two choices "only max covers" (sheaves = presheaves = Set) or "both cover" (sheaves = terminal) both satisfy S and T trivially — correct, exactly two Grothendieck topologies on the one-object one-arrow category.
- **Quiz Q3 (three equivalent forms of a Grothendieck topology)** (line 72): GT on $C$ ↔ Lawvere–Tierney topology $j: \Omega \to \Omega$ on $\widehat{C}$ ↔ left-exact-reflective subcategory of $\widehat{C}$ — correct, the standard subtopos/topology equivalence of MacLane–Moerdijk Ch. V.

### Sheaves on a site (§4)

- **Sheaf condition as limit over covering sieve** (line 666): $F(c) \cong \lim_{f \in S} F(\mathrm{dom}(f))$, with matching family condition $F(g)(x_f) = x_{f \circ g}$ — correct standard formulation (existence + uniqueness = gluing + separation).
- **Sheafification $a: \widehat{C} \to \mathrm{Sh}(C, J)$ is left adjoint to inclusion $\iota$** (line 667) — correct.
- **Plus-construction $F^+(c) = \mathrm{colim}_{S \in J(c)} \mathrm{Match}(S, F)$, applied twice** (line 667) — correct. The colimit is a filtered colimit when $J(c)$ is filtered under reverse inclusion (refinement), which is automatic from the axioms. First $+$ produces a separated presheaf; second $+$ adds the missing gluings; further iterations are isomorphisms — correct standard fact (MacLane–Moerdijk III.5).
- **Constant presheaf on disconnected $X$ fails sheaf condition** (line 668): for $X = U_1 \sqcup U_2$, matching family $(a_1, a_2) \in A \times A$ has no amalgamation in $\underline{A}_{\mathrm{pre}}(X) = A$ unless $a_1 = a_2$ — correct.
- **Sheafification = locally constant sheaf $\underline{A}(U) = A^{\pi_0(U)}$** (line 668) — correct (one copy of $A$ per connected component).
- **Sheaf-cases widget verdicts** (lines 716–737):
  - Representable $h_T$ on Zariski/étale/fpqc: all correct (descent for morphisms is one of the Grothendieck/SGA cornerstones; representables are sheaves on the canonical topology, and Zariski/étale/fpqc are subcanonical).
  - Constant presheaf fails on all three: correct (disconnected covers exist on each).
  - Locally constant sheaf is a sheaf on all three: correct.
  - $\mu_3$ is a sheaf on all three because it is representable; "Zariski-locally trivial" on $\mathbb{Q}$ false (no $\zeta_3 \in \mathbb{Q}$), "étale-locally trivial" true after adjoining $\zeta_3$ (separable since $3$ is invertible) — correct.
- **Quiz Q1 sheaves-on-a-site** (line 162): structure-sheaf sections, representables, locally constant sheaves are sheaves on small Zariski; constant presheaf is not. ✓
- **Quiz Q2 sheafification on disconnected $X$** (line 175): $\underline{A}(X_1 \sqcup X_2) = A \times A$. ✓
- **Quiz Q3 $(F^+)^+$ is a sheaf** (line 188): correct, the standard idempotency-after-two-iterations result.
- **Quiz hard Q1 (one $+$ vs two $+$)** (line 203): $F^+$ is separated; $(F^+)^+$ is a sheaf — correct.
- **Quiz hard Q2 (which colimits/limits preserve sheaves)** (line 217): finite limits ✓ (computed pointwise); filtered colimits in Ab-valued sheaves on a coherent site ✓ (standard SGA result; coherence = coverings can be chosen finite); sheafification $a$ ✓ by definition; arbitrary colimits in $\widehat{C}$ do not preserve sheaves ✓ — correct.

### $\mathrm{Sh}(C, J)$ as a topos (§5)

- **Grothendieck topos = elementary topos with all small colimits + small generating set + Giraud's structural axioms** (line 763) — correct.
- **Giraud axioms (i)–(vi)** (line 763): one of several standard formulations. Strictly, axiom (ii) — "finite limits commute with filtered colimits" — is in many formulations a *corollary* rather than an axiom (it follows from the others plus the standard fact that $\mathsf{Set}$ has this property and sheafification is left exact). The classical SGA 4 / nLab formulation lists five axioms: (G1) small colimits, (G2) coproducts disjoint, (G3) equivalence relations effective, (G4) colimits universal, (G5) small generating set. The page's inclusion of (ii) matches Adámek–Rosický-style "locally finitely presentable" enhancements and is defensible as long as one understands it overdetermines the system. Hard quiz Q2 (line 289) explicitly ties (ii) to local presentability ("excludes large categories like Top"), which is the correct conceptual handle. Not an error, just a non-standard packaging.
- **Sober space $X \rightsquigarrow \mathrm{Sh}(X)$ recovers $X$** (line 764) — correct (sober spaces embed in toposes via the localic presentation).
- **$\mathsf{Set}$ as the terminal Grothendieck topos** (line 764) — correct (terminal in the 2-category of Grothendieck toposes with geometric morphisms; for any $\mathcal{E}$ there is an essentially unique geometric morphism $\Gamma \dashv \Delta : \mathcal{E} \to \mathsf{Set}$).
- **$BG$ presheaves = $G$-Set** (line 764) — correct ($BG$ as a one-object category, sheaves for trivial topology = presheaves = $G$-Set).
- **$\mathrm{Sh}_{\mathrm{ét}}(\Spec k) \simeq \Gal(k^{\mathrm{sep}}/k)\text{-}\mathsf{Set}_{\mathrm{cts}}$, collapsing to $\mathsf{Set}$ when $k$ separably closed** (line 764) — correct, the standard étale-topos-as-Galois-action equivalence for fields.
- **Presheaf topos $\widehat{C}$ as sheaves for trivial topology; sheafification $a \dashv \iota$ left exact, hence $\iota$ is a geometric embedding** (line 765) — correct.
- **Subtopos correspondence: geometric embeddings $\mathcal{E} \hookrightarrow \widehat{C}$ ↔ Lawvere–Tierney topologies on $\widehat{C}$ ↔ Grothendieck topologies on $C$** (line 765) — correct.
- **Quiz Q1 (defining property of Grothendieck toposes)** (line 234): "small generating set + all small colimits (Giraud)" is the right characterization among elementary toposes. ✓
- **Quiz Q2 (étale topos of separably closed field)** (line 247): $\mathsf{Set}$ for $k$ separably closed (trivial absolute Galois group). ✓ Note: the explanation correctly observes that the answer is wrong for general $k$, where it would be $\Gal(k^{\mathrm{sep}}/k)\text{-}\mathsf{Set}_{\mathrm{cts}}$.
- **Quiz Q3 (which are Grothendieck toposes)** (line 260): $\mathsf{Set}$, $G$-Set, $\widehat{C}$ are; $\mathsf{Top}$ is not (not cartesian closed in general). ✓
- **Quiz hard Q1 (three viewpoints in bijection)** (line 274) — correct.

### Geometric morphisms from morphisms of sites (§6)

- **Geometric morphism definition** $f^* \dashv f_*$ with $f^*$ left exact (line 816) — correct standard.
- **For continuous $\varphi: X \to Y$, $\mathrm{Sh}(\varphi)$ is geometric with $f^* = \varphi^{-1}$, $f_* = \varphi_*$** (line 816) — correct.
- **Continuous functor of sites** (line 817): the labeling $u: (D, K) \to (C, J)$ for the *map of sites* with underlying functor $u: C \to D$ matches the Stacks Project / SGA 4 convention (the morphism of sites and the functor go in opposite directions); the page flags this with "(note the direction!)". The "covering sieves to covering sieves" condition: $S \in J(c) \Rightarrow u(S)$ generates a covering sieve in $K(u(c))$ — correct as the *cover-preserving* (i.e., continuous) condition.
- **$u^p: \widehat{D} \to \widehat{C}$, $u^p F = F \circ u$, preserves the sheaf condition** — correct (this is essentially the definition of "continuous functor").
- **Induced geometric morphism $\mathrm{Sh}(D, K) \to \mathrm{Sh}(C, J)$, with $f^* = a_K \circ \mathrm{Lan}_u$ and $f_* = (-) \circ u$** (line 817) — correct. Lan is along $u: C \to D$, lifting from $\widehat{C}$ to $\widehat{D}$; sheafify in $K$. Quiz Q1 (line 307) restates this with the right adjointness reasoning ("precomposition is a right adjoint, so $f^*$ must be the Kan extension") — correct.
- **Functoriality of the construction** (line 818): $C \xrightarrow{u} D \xrightarrow{v} E$ continuous $\Rightarrow \mathrm{Sh}(E) \to \mathrm{Sh}(D) \to \mathrm{Sh}(C)$ — correct (contravariant in functors of sites).
- **Quiz Q2 (functoriality of composite)** (line 320) — correct.
- **Quiz Q3 (geometric morphism on étale toposes from $L/K$)** (line 333): $K \hookrightarrow L$ ring map gives $\Spec L \to \Spec K$, hence a geometric morphism $\mathrm{Sh}_{\mathrm{ét}}(\Spec L) \to \mathrm{Sh}_{\mathrm{ét}}(\Spec K)$. The Galois description $f^* = $ Res from $\Gal(K^{\mathrm{sep}}/K)$ to $\Gal(L^{\mathrm{sep}}/L) = \Gal(K^{\mathrm{sep}}/L)$ (subgroup of finite index $[L:K]$); $f_*$ is the right adjoint to restriction = induced (= co-induced for finite index) representation — correct.

## Wrong / dubious claims

### 1. fpqc / fppf containment direction reversed (§3, line 554)

The page states:

> "Even fpqc covers are subsumed by the much larger fppf site (faithfully flat + locally of finite presentation), but for descent of quasi-coherent sheaves the canonical choice is fpqc — this is the content of *fpqc descent*, the cornerstone of modern algebraic geometry."

**Both clauses of the first sentence are wrong:**
- "fpqc covers are subsumed by the fppf site" — this asserts fpqc ⊂ fppf as pretopologies. The correct containment is the opposite: every fppf cover is fpqc (faithfully flat + locally of finite presentation $\Rightarrow$ faithfully flat + quasi-compact at the source, after restricting to a quasi-compact open). So fppf ⊂ fpqc.
- "the much larger fppf site" — fppf is *smaller* (more restrictive cover condition = fewer covers = more sheaves), not larger.

**Direct internal contradiction with quiz Q3 (line 144)**: the answer-explanation correctly states the chain "Zariski $\subset$ Nisnevich $\subset$ étale $\subset$ smooth $\subset$ fppf $\subset$ fpqc" — i.e., fpqc is the loosest. The prose paragraph contradicts its own quiz.

The likely intended statement: "Even more permissive than fpqc is the (still larger) site obtained by dropping quasi-compactness — but for descent of quasi-coherent sheaves the canonical choice is fpqc." Or simply swap "fpqc" and "fppf": "Even fppf covers are subsumed by the much larger fpqc site." The clause "the canonical choice for QC descent is fpqc" is independently correct.

### 2. $\mu_2$ over $\Spec\mathbb{F}_2$ becoming étale-locally trivial (§3, line 555)

The page states:

> "a $\mu_n$-torsor … need not be Zariski-locally trivial: on $\Spec \mathbb{F}_2$, the field has only one square root of $1$ (namely $1$), so the trivialization $\mu_2 \xrightarrow{\sim} \mathbb{Z}/2$ is not Zariski-local. You have to pass to the étale site (extracting a separable closure) before $\mu_2$ becomes constant."

**Wrong**: $\mu_2$ over $\mathbb{F}_2$ is $\Spec \mathbb{F}_2[T]/(T^2 - 1) = \Spec \mathbb{F}_2[T]/(T-1)^2$, a non-reduced infinitesimal group scheme of length 2 (the kernel of Frobenius on $\mathbb{G}_m$). It is **never** étale-locally isomorphic to the constant group scheme $\underline{\mathbb{Z}/2} = \Spec(\mathbb{F}_2 \times \mathbb{F}_2)$, because étale base change preserves reducedness/length in a way that cannot turn a non-reduced fat point into two reduced points. Trivializing $\mu_2$ in characteristic 2 requires an *fppf* cover (e.g., extracting a $\sqrt{a}$ via $T \mapsto T^2 - a$), not étale.

The correct general statement: $\mu_n$ becomes étale-locally trivial on $X$ exactly when $n$ is invertible on $X$ (so that $T^n - 1$ is separable). At primes dividing $n$, étale-local trivialization fails, and one needs fppf.

The widget for $\mu_3$ over $\Spec \mathbb{Z}[1/n]$ at lines 583–593 is correct because $3$ is invertible (assuming $3 \mid n$), but the prose example of $\mu_2$ over $\mathbb{F}_2$ should have used a $\mu_n$ over a base where $n$ is invertible (e.g., $\mu_2$ over $\Spec \mathbb{F}_3$, where $T^2 - 1$ has only the root $1$ since $\mathbb{F}_3^\times$ has no element of order $2$ other than $-1 = 2$, oh wait, $-1 = 2$ *is* a primitive root of unity here, so this fails as an example too — the textbook example is $\mu_n$ over $\mathbb{Q}$ for $n \ge 3$, where $\zeta_n \notin \mathbb{Q}$).

### 3. Quiz answer + explanation on $\mu_2$ over $\mathbb{F}_2$ (§3, quiz line 119–129)

The quiz `examples-of-sites` Q1 asks which structures over $\Spec \mathbb{F}_2$ are Zariski-locally trivial / étale-locally trivial, with choices:

- (a) line bundle Zariski-locally trivial — **correct** (definition of locally free of rank 1)
- (b) $\mu_2$ Zariski-locally trivial — **wrong**, marked as correct
- (c) $\mu_2$ étale-locally trivial — **wrong**, marked as correct
- (d) fppf $\mathbb{Z}/2$-torsor étale-locally trivial — correct (since $\underline{\mathbb{Z}/2}$ is étale, fppf = étale cohomology)

The answer is given as `[0, 1, 2, 3]` (all four), but **(b) and (c) are false** for the reason in §2 above: $\mu_2$ in characteristic 2 is the infinitesimal Frobenius kernel and is never étale-locally constant.

The explanation tries to justify (b) by claiming "$\mu_2 \cong \underline{\mathbb{Z}/2}$ even Zariski-locally over $\mathbb{F}_2$" — this is mathematically wrong. The two group schemes are not even abstractly isomorphic (one is non-reduced of length 2, the other is reduced of length 2), let alone Zariski-locally.

The intended exercise is presumably the standard contrast: line bundles are Zariski-trivial, while $\mu_n$ over a base missing $n$th roots of unity is only étale-trivial (when $n$ is invertible). Replacing $\mathbb{F}_2$ with $\mathbb{Q}$ (or $\Spec \mathbb{Z}[1/n]$) and $\mu_2$ with $\mu_3$ — to match the widget — would make all four answers correct.

### 4. Step 2 wording in the axioms widget (§2, line 478)

Step 2 of the proof scrubber says:

> "max_t is the sieve of ALL arrows into t — namely $\{id_t, x \to t, y \to t\}$. We declared $\{x \to t, y \to t\}$ covering, and any sieve containing a covering sieve is itself covering, so max_t (which is even larger) is covering."

The conclusion is correct (max_t ∈ J(t) is exactly axiom M), but the justification — "any sieve containing a covering sieve is itself covering" — is invoked as if it were a separate axiom. In fact, this *closure-under-superset* property follows from S and T (it is essentially axiom T applied to the trivial pullback $\mathrm{id}_c^* T = T$), but the page never proves or even states it as an explicit lemma. A more direct route: $\mathrm{max}_t \in J(t)$ is just axiom M, full stop — no need to invoke superset-closure. Minor pedagogical wobble, not a math error.

## Underspecified or unverifiable claims

- **Sieve count quiz** (line 22, sieves Q2): the question asks for the number of sieves on $t$ in $\{x, y, t\}$, answer 4. The explanation is rambling and momentarily contradicts itself ("but a sieve on $t$ must contain $\mathrm{id}_t$ to make sense as a subfunctor of $h_t$ at $d = t$? Careful: actually every subset is a sieve …"). The final count (4 sieves: corresponding to the 4 subsets of $\{x, y\}$, with $\mathrm{id}_t$ optionally included if you want max — the 4 sieves are $\varnothing$, $\{x \to t\}$, $\{y \to t\}$, and the full sieve $\{x \to t, y \to t, \mathrm{id}_t\} = \mathrm{max}_t$) is correct, but the explanation should be cleaned up.

  Strictly: in the poset $\{x, y, t\}$ with $x, y < t$, sieves on $t$ correspond to *subfunctors of $h_t$*, which in this poset case correspond to down-sets of $\{d : d \le t\} = \{x, y, t\}$. Down-sets containing $t$ are forced to contain $x$ and $y$ (since $x, y < t$), so the only down-set containing $t$ is $\{x, y, t\}$ itself. Down-sets not containing $t$ are arbitrary subsets of $\{x, y\}$: $\varnothing, \{x\}, \{y\}, \{x, y\}$. Total: 4 + 1 = **5** sieves, not 4. Wait — let me re-check: actually a sieve on $t$ is a down-set in $\{d : d \le t\}$, which is $\{x, y, t\}$. A down-set $D$ has the property that $d \in D, d' \le d \Rightarrow d' \in D$. If $t \in D$, then all $d \le t$ must be in $D$, so $D = \{x, y, t\}$ (the maximal sieve = $\mathrm{max}_t$). If $t \notin D$, then $D \subseteq \{x, y\}$, and any subset works (since $x$ and $y$ are not below each other, no further constraint). So $D \in \{\varnothing, \{x\}, \{y\}, \{x, y\}\}$ — 4 down-sets. Total = 4 + 1 = 5.

  Wait — but a sieve on $t$ is a subset of the *arrows into $t$*, which in poset terms is a subset of $\{d : d \le t\}$ where $d$ corresponds to the unique arrow $d \to t$. The closure condition is "if $(d \to t) \in S$ and $e \le d$, then $(e \to t) \in S$." So if $t \to t$ is in $S$, then $x \to t$ and $y \to t$ are forced (since $x, y \le t$). So indeed:
   - $S = \varnothing$ (no arrows)
   - $S = \{x \to t\}$ (forces $x \to t$ only — but wait, are there arrows below $x$? No, $x$ is minimal. So no further closure needed.)
   - $S = \{y \to t\}$
   - $S = \{x \to t, y \to t\}$
   - $S = \{x \to t, y \to t, t \to t\} = \mathrm{max}_t$
   
   So **5 sieves on $t$**, not 4. The quiz answer is off by one.

   However, the explanation tries to defend the count of 4 by listing $\varnothing, \{x \to t\}, \{y \to t\}, \mathrm{max}_t$ and conflating $\{x \to t, y \to t\}$ (without identity) with $\mathrm{max}_t = \{x \to t, y \to t, \mathrm{id}_t\}$. In the strict subfunctor-of-$h_t$ formulation, $h_t(t) = \{\mathrm{id}_t\}$, so a sieve includes a subset of $h_t(t)$ — either empty or $\{\mathrm{id}_t\}$. The middle option $\{x \to t, y \to t\}$ is a legitimate sieve: it is closed under precomposition (no nontrivial precompositions exist because $x, y$ are minimal), and it does not contain $\mathrm{id}_t$. So this is a 5th distinct sieve.

   **The quiz answer 4 is wrong; it should be 5.** Demoting this to "underspecified" because the explanation acknowledges the confusion but resolves it incorrectly; arguably this should sit in the "wrong claims" section.

- **Glossing over "subcanonical"**: the §4 widget claims representables $h_T$ are sheaves on Zariski/étale/fpqc. This is true because each of these is *subcanonical* (i.e., the canonical topology is at least as fine as each, equivalently representables are sheaves). The page does not introduce the term subcanonical or state which topologies are subcanonical; readers may not realize this is a non-trivial theorem (Grothendieck FGA / Stacks Project Tag 023O for the étale/fpqc cases — fpqc descent for morphisms is the deep one).

- **Lawvere–Tierney topology framing** (line 765): the parenthetical "(Lawvere–Tierney's theorem on subtoposes — equivalently, on Lawvere–Tierney topologies $j: \Omega \to \Omega$)" is dense. The actual content — bijection between subtoposes (lex-reflective subcategories) of $\widehat{C}$ and LT topologies on $\widehat{C}$ — is correct but barely sketched. Hard quiz Q1 (line 277) explicates this and is correct.

- **"Geometric morphism on étale toposes recovers $\pi_1^{\mathrm{ét}}$"** (line 818): the slice-topos remark "the étale fundamental group $\pi_1^{\mathrm{ét}}(X)$ is recovered from the slice topos" is correct in spirit (locally constant sheaves on $X_{\mathrm{ét}}$ form a Galois category whose pro-finite automorphism group of the fiber functor at a geometric point is $\pi_1^{\mathrm{ét}}(X, \bar x)$), but this is a substantial unstated theorem (SGA 1) being invoked in passing.

## Severity

**moderate.** Three real errors:

1. **§3 line 554**: fpqc / fppf containment direction reversed and "much larger" applied to the wrong site — directly contradicts the page's own quiz answer at line 144.
2. **§3 line 555 + quiz line 119–129**: $\mu_2$ over $\Spec \mathbb{F}_2$ is presented as étale-locally trivial after passing to a separable closure. This is wrong in characteristic 2 ($\mu_2 = $ infinitesimal Frobenius kernel, never étale-locally constant). The corresponding multi-select quiz answer marks both "$\mu_2$ Zariski-locally trivial" and "$\mu_2$ étale-locally trivial" as correct over $\mathbb{F}_2$; both are false. The quiz explanation also offers a mathematically wrong justification (claiming $\mu_2 \cong \underline{\mathbb{Z}/2}$ over $\mathbb{F}_2$). Fix: replace the example with $\mu_n$ over a base where $n$ is invertible (e.g., $\mu_3$ over $\mathbb{Q}$, matching the widget).
3. **Quiz `sieves` Q2 line 22**: the count of sieves on $t$ in the 3-element poset $\{x, y, t\}$ with $x, y \le t$ should be 5, not 4. The five sieves are $\varnothing, \{x \to t\}, \{y \to t\}, \{x \to t, y \to t\}, \{x \to t, y \to t, \mathrm{id}_t\}$. The quiz explanation muddles this by conflating $\{x \to t, y \to t\}$ with $\mathrm{max}_t$.

The rest of the page — Grothendieck topology axioms, sheaf condition, plus-construction / sheafification, Giraud's theorem (with the caveat that axiom (ii) is non-standard packaging), geometric morphisms from continuous functors of sites, the étale topos of a field — is technically clean and matches the standard presentation. The widgets are mathematically faithful (sieves widget correctly enumerates precomposition closure; axioms walkthrough correctly verifies M, S, T on the worked example modulo the §2 step-2 wording wobble; sheaves verdict table correctly identifies which presheaves are sheaves on which sites except as noted).
