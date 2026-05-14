# simplicial-sets-and-nerve — math correctness audit (2026-05)

**Section:** Higher categories & toposes

## Verified claims

### Simplex category $\Delta$ (§1)

- **Objects $[n] = \{0 < 1 < \cdots < n\}$, morphisms = weakly order-preserving maps** (line 272) — standard.
- **Cofaces $d^i\colon [n-1] \to [n]$ are the unique injective order-preserving maps missing $i$** (line 273) — correct.
- **Codegeneracies $s^j\colon [n+1] \to [n]$ are the unique surjective order-preserving maps doubling $j$** (line 273) — correct (the convention is $s^j(i) = i$ for $i \le j$, $s^j(i) = i-1$ for $i > j$, so both $j$ and $j+1$ map to $j$).
- **Cosimplicial identities** (line 274): $d^j d^i = d^i d^{j-1}$ for $i < j$; $s^j s^i = s^i s^{j+1}$ for $i \le j$; the three-branch $s^j d^i$ identity. All standard and correct (verified by direct vertex-tracking).
- **Morphism count $|\Delta([m],[n])| = \binom{m+n+1}{m+1}$** (line 275): order-preserving maps $[m]\to[n]$ correspond to weakly increasing length-$(m+1)$ sequences in $\{0,\ldots,n\}$, equivalently multisets of size $m+1$ from $n+1$ elements. For $m=1, n=3$: $\binom{5}{2}=10$ ✓.
- **Presheaf-on-$\Delta$ ↔ simplicial-set duality** (line 276): a contravariant functor $\Delta^{\mathrm{op}}\to\mathbf{Set}$ is determined by sets $X_n$ with face/degeneracy operators $d_i, s_j$ satisfying the dualised simplicial identities — correct.

### Simplicial sets (§2)

- **$\mathbf{sSet} = \mathbf{Set}^{\Delta^{\mathrm{op}}}$ as presheaf topos with all small (co)limits, exponentials, subobject classifier** (line 432) — correct (any presheaf category on a small base is an elementary topos).
- **Standard simplices $\Delta^n = \Delta(-, [n])$ are the representables; Yoneda gives $X_n \cong \mathbf{sSet}(\Delta^n, X)$** (line 433) — correct.
- **Boundary $\partial \Delta^n$** as the union of the $n+1$ codimension-$1$ faces, i.e., simplices that factor through some $d^i\colon \Delta^{n-1}\to\Delta^n$ (line 434) — standard.
- **Horn $\Lambda^n_k$** as $\partial\Delta^n$ minus the face opposite vertex $k$; inner iff $0 < k < n$, outer otherwise (line 434) — standard.
- **Eilenberg–Zilber lemma** (line 435): every $\sigma \in X_n$ factors uniquely as $\sigma = X(\alpha)(\tau)$ for a unique surjection $\alpha\colon [n]\twoheadrightarrow[k]$ in $\Delta$ and a unique non-degenerate $\tau \in X_k$ — correct standard form.
- **CW-structure on $|X|$ has one $n$-cell per non-degenerate $n$-simplex** (line 542) — direct consequence of E–Z, correct.
- **Faces/degeneracies-of-$\Delta^2$ widget** (lines 467–532): all face/degeneracy formulas displayed are correct. E.g. `d₀(0,1,2)=(1,2), d₁(0,1,2)=(0,2), d₂(0,1,2)=(0,1)` — standard. `s₀(0,1)=(0,0,1), s₁(0,1)=(0,1,1)` — correct doubling.

### Geometric realization (§3)

- **$|{-}|\colon \mathbf{sSet}\to\mathbf{Top}$ as left Kan extension of $[n]\mapsto |\Delta^n|$ along Yoneda** (line 538) — correct.
- **Coend formula $|X| = (\coprod X_n \times |\Delta^n|)/{\sim}$ with $(\sigma, \alpha_*(t)) \sim (\alpha^*\sigma, t)$** (lines 539–540) — correct standard form (verified: $\alpha\colon [m]\to[n]$ in $\Delta$ gives $\alpha^* = X(\alpha)\colon X_n\to X_m$ contravariantly and $\alpha_* = |\alpha|\colon |\Delta^m|\to|\Delta^n|$ covariantly on the topological side, so both sides of the relation are well-typed).
- **$|{-}|\dashv \mathrm{Sing}$** with $\mathrm{Sing}(Y)_n = \mathbf{Top}(|\Delta^n|, Y)$ (line 541) — correct.
- **Quillen equivalence $\mathbf{sSet}_{\mathrm{Kan}} \simeq_Q \mathbf{Top}$** (line 541) — correct (Quillen 1967).
- **$|\Delta^n|$ = standard topological $n$-simplex; $|\partial\Delta^n| \cong S^{n-1}$; $|\Lambda^2_k|$ = two segments meeting at a vertex** (line 542) — all correct.
- **Realization-stepper widget** (lines 567–633): the 5-step narrative (disjoint coproduct → glue via face maps → boundary as $S^1$ → attach 2-cell → degenerate simplices contribute nothing new via E–Z) is correct in substance. Step 5's claim "the relation $(\sigma, \alpha_*(t)) \sim (\alpha^*\sigma, t)$ collapses the entire copy of $|\Delta^n|$ above a degenerate $\sigma$ onto a copy of a lower-dim $|\Delta^k|$" is correct: writing $\sigma = \alpha^*\tau$ for $\alpha\colon[n]\twoheadrightarrow[k]$ and $\tau$ non-degenerate, $(\sigma, t) = (\alpha^*\tau, t) \sim (\tau, \alpha_*(t))$ identifies the $\sigma$-copy of $|\Delta^n|$ surjectively with the $\tau$-copy of $|\Delta^k|$.

### Nerve $N(C)$ (§4)

- **$N(C)_n = \mathbf{Cat}([n], C)$ = composable strings $x_0 \xrightarrow{f_1} \cdots \xrightarrow{f_n} x_n$** (line 664) — correct ($[n]$ as poset / category with unique $i \to j$ when $i \le j$).
- **Face maps**: $d_0$ drops $f_1$; $d_n$ drops $f_n$; $0<i<n \Rightarrow d_i$ composes $f_{i+1} \circ f_i$ (line 665) — correct (and matches the widget's $d_1\sigma = g\circ f$ output).
- **Degeneracies $s_j$ insert an identity at position $j$** (line 665) — correct.
- **$N\colon \mathbf{Cat}\to\mathbf{sSet}$ is a fully faithful right adjoint, with left adjoint = homotopy/fundamental category $h$** (line 666) — correct.
- **$h(X)$ presentation: objects $X_0$, generating arrows $X_1$, relations $d_1\sigma = d_0\sigma \circ d_2\sigma$ for $\sigma \in X_2$** (line 666) — correct (verified: in $N(C)$, $\sigma = (f_1, f_2)$ gives $d_2\sigma = f_1$, $d_0\sigma = f_2$, $d_1\sigma = f_2\circ f_1$, matching the relation).
- **Joyal-equivalence-of-nerves ↔ equivalence-of-categories** (line 666) — correct (consequence of $N$ being fully faithful into the Joyal model).
- **$N(P)_n$ for poset $P$ = weakly increasing length-$(n+1)$ chains** (line 667) — correct.
- **$N(BG)_n = G^n$, $|N(BG)| \simeq BG$ a $K(G,1)$** (line 667) — correct (standard simplicial bar construction).
- **Nerve widget face readout** (lines 754, 766–771): for $f\colon a\to b$, $d_0 f = b$ (target), $d_1 f = a$ (source) ✓; for composable pair $\sigma=(f,g)$, $d_2\sigma = f, d_1\sigma = g\circ f, d_0\sigma = g$ ✓; non-composability check `g.src ≠ f.tgt` ✓.

### Kan complexes (§5)

- **Kan condition: every horn $\Lambda^n_k \to X$ extends to $\Delta^n \to X$, all $0\le k\le n$, $n\ge 1$** (line 804) — correct.
- **Equivalent: $X \to *$ has the right lifting property against horn inclusions** (line 806) — correct.
- **Kan complexes = fibrant objects in Kan–Quillen model on $\mathbf{sSet}$** (line 806) — correct.
- **$\mathrm{Sing}(Y)$ is Kan because $|\Lambda^n_k|$ is a strong deformation retract of $|\Delta^n|$** (line 807) — correct.
- **Quillen equivalence $\mathrm{Ho}(\mathbf{sSet}_{\mathrm{Kan}}) \simeq \mathrm{Ho}(\mathbf{Top})$** (line 807) — correct.
- **$N(C)$ is Kan iff $C$ is a groupoid** (line 808) — correct standard theorem.
- **Outer-horn $\Lambda^2_0$ filler**: pair $f\colon a\to b, h\colon a\to c$, asks for $g\colon b\to c$ with $h = g\circ f$ (line 808) — correct; the conclusion "this holds for every pair iff every morphism is invertible" is correct.

### Inner-horn / quasi-categorical nerves (§6)

- **Quasi-category = inner-horn fillers exist for every $\Lambda^n_k$, $0<k<n$** (line 932) — correct definition.
- **Joyal model structure on $\mathbf{sSet}$ has quasi-categories as fibrant objects** (line 932) — correct.
- **Fundamental theorem: $X = N(C)$ for some small $C$ iff $X$ is a quasi-category with unique inner-horn fillers** (line 934) — correct (Boardman–Vogt characterisation; restatement of Grothendieck's nerve theorem).
- **Kan complexes inside quasi-categories are the $\infty$-groupoids** (line 935) — correct.
- **Homotopy category $h\mathcal{C}$ of a quasi-category by quotienting $\mathcal{C}_1$ by 1-simplex homotopy; $h\dashv N$ Quillen pair Joyal–$\mathbf{Cat}$** (line 935) — correct.
- **Inner-horn widget** (lines 956–1035): the displayed inner-horn filler $\sigma$ with $d_0\sigma = g, d_2\sigma = f, d_1\sigma = g\circ f$ is correct, as is the "uniqueness ↔ 1-categorical" conclusion.

### Quiz bank claims (cross-checked)

- **`simplex-category` Q1**: coface from $[2]\to[3]$ missing vertex $2$ is $0\mapsto 0, 1\mapsto 1, 2\mapsto 3$ — correct ($d^2$ skips value 2).
- **`simplex-category` Q2**: $|\Delta([1],[3])| = 10$ — correct.
- **`simplex-category` Q3**: $d^j d^i = d^i d^{j-1}$ ($i<j$) interpreted as "two consecutive face inclusions are independent of order" — correct interpretation.
- **`simplicial-set` Q1**: non-degenerate 1-simplices of $\Delta^3$ count = $\binom{4}{2} = 6$ — correct (the six edges of a tetrahedron).
- **`simplicial-set` Q2**: $(\partial\Delta^2)_1 = (\Delta^2)_1$ = all order-preserving $[1]\to[2]$, including degenerate — correct (boundary differs from $\Delta^2$ only in dimension 2).
- **`simplicial-set` Q3**: simplicial set ↔ presheaf because the cosimplicial identities generate all relations in $\Delta$ — correct.
- **`simplicial-set` hard Q1 (E–Z)**: unique surjection $\alpha\colon[3]\twoheadrightarrow[k]$ and unique non-degenerate $\tau\in X_k$ with $\sigma = \alpha^*\tau$ — correct.
- **`simplicial-set` hard Q2**: $|(\Delta^1)_2| = 4$ — correct (sequences $(0,0,0), (0,0,1), (0,1,1), (1,1,1)$, also $\binom{2+1+1}{3}=\binom{4}{3}=4$).
- **`geometric-realization` Q1**: $|\Delta^n|$ as the simplex $\{(t_i): t_i\ge 0, \sum t_i = 1\} \subset \mathbb{R}^{n+1}$ — correct standard model.
- **`geometric-realization` Q2**: $|\partial\Delta^n| \cong S^{n-1}$ — correct.
- **`geometric-realization` Q3**: $|\Lambda^2_1|$ = two edges through vertex 1, contractible — correct.
- **`nerve-of-category` Q1**: For $C = \{a<b<c\}$, $|N(C)_2| = $ order-preserving $\{0,1,2\}\to\{a,b,c\}$ = $\binom{2+2+1}{3} = \binom{5}{3} = 10$ — correct.
- **`nerve-of-category` Q2**: For $G = \mathbb{Z}/2$, the unique non-degenerate 2-simplex of $N(BG)$ is $(g,g)$ (where $g$ is the non-identity), count = 1 — correct (an element of $G^n$ is non-degenerate iff every coordinate is $\ne e$).
- **`nerve-of-category` Q3**: $N(C)_2$ is empty only when $C$ has no objects — correct ($(\mathrm{id}_x, \mathrm{id}_x) = s_0 s_0 (x)$ is always present when $x$ is an object).
- **`nerve-of-category` hard Q1**: Joyal-equivalence-of-nerves = equivalence-of-categories — correct (and the Kan–Quillen direction is genuinely weaker, as the explanation notes with the initial-object example).
- **`nerve-of-category` hard Q2**: left adjoint to nerve is the homotopy category $h$ — correct.
- **`kan-complex` Q1 (multi-select)**: among the listed simplicial sets, Kan complexes are $N(\text{groupoid})$, $\mathrm{Sing}(X)$, and any constant simplicial set — correct (and $\Delta^n$ for $n\ge 1$ and $N(C)$ for non-groupoid $C$ are correctly excluded).
- **`kan-complex` Q2**: $\mathrm{Sing}$ is Kan because $|\Lambda^n_k|$ is a retract of $|\Delta^n|$ — correct.
- **`kan-complex` Q3**: Quillen equivalence with CW-complexes / $\mathbf{Top}$ at the homotopy-category level — correct.
- **`horn-filling` Q1**: $\Lambda^3_1$ is inner — correct (inner ⇔ $0 < k < n$).
- **`horn-filling` Q2**: $X$ has unique inner-horn fillers iff $X = N(C)$ for a uniquely determined small category — correct.
- **`horn-filling` Q3**: fibrant objects in Joyal = quasi-categories — correct.
- **`horn-filling` hard Q1**: in $N(C)$ the inner-horn filler is unique because composition is a function — correct.
- **`horn-filling` hard Q2**: $\Lambda^2_0$-extension corresponds to right-divisibility, holds for all $f$ iff $C$ is a groupoid — correct (and this quiz uses the right terminology, see the issue with the §5 widget below).

## Wrong / dubious claims

- **§1, line 275: "Two of these are degenerate (the constants); the rest split into compositions of the four cofaces and the lone $s^0\colon [1]\to[0]$"**. The count of constant maps $[1]\to[3]$ is **four**, not two — there is one constant per vertex of $[3]$ (namely $0,1,2,3$), each obtained as $d^k \circ s^0$ for $k = 0,1,2,3$. Of the 10 morphisms $[1]\to[3]$, six are injective (the cofaces, $\binom{4}{2}=6$ pairs $0\le a<b\le 3$) and four are constant; $6 + 4 = 10$. The "two" in the prose is wrong.

- **§1 widget extra annotation, line 410**: "relation: dⁱdʲ = dʲdⁱ⁻¹ for i<j (inserting two missing vertices is order-independent)". This is the cosimplicial identity with $i$ and $j$ **swapped**: the standard identity (correctly stated in the prose at line 274) is $d^j d^i = d^i d^{j-1}$ for $i < j$, with the **larger** index on the outer-left. The widget's version with the smaller index on the outer-left would, with $i=0, j=1$, claim $d^0 d^1 = d^1 d^{-1}$, but $d^{-1}$ is not a morphism in $\Delta$. The narrative gloss ("inserting two missing vertices is order-independent") is the right intuition for the correct identity; only the formula has the indices in the wrong place.

- **§1 widget extra annotation, line 412**: "relation: sⁱsʲ = sʲsⁱ⁺¹ for i≤j (doubling twice with adjacent indices commutes after a shift)". Same issue — the standard identity (correctly stated at line 274) is $s^j s^i = s^i s^{j+1}$ for $i \le j$, with the **larger** index on the outer-left. The widget's version with the smaller index outer-left is **false**: take $i=0, j=1$ and check on $[3]\to[1]$ in the standard convention $s^k(i) = i$ for $i\le k$, $s^k(i)=i-1$ for $i>k$. Then $s^0\circ s^1$ sends $(0,1,2,3)\mapsto (0,0,0,1)$ but $s^1\circ s^1$ sends $(0,1,2,3)\mapsto (0,1,1,1)$ — not equal.

- **§5 horn-stepper widget captions, lines 854, 866**: the captions for $\Lambda^2_0$ and $\Lambda^2_2$ assert that the extension property is equivalent to $f$ being **"right-cancellable"** (resp. $g$ **"left-cancellable"**). In standard terminology, "right-cancellable" = epi ($g_1 f = g_2 f \Rightarrow g_1 = g_2$) and "left-cancellable" = mono. Neither is what makes the extension property hold for every input pair: setting $h = \mathrm{id}_a$ in the $\Lambda^2_0$ filler "$\exists g$ with $g f = h$" forces $f$ to be a **split mono**, and varying $h$ over arbitrary morphisms with source $a$ promotes that to "every morphism is iso", i.e., $C$ is a groupoid. The intended notion is **right-divisibility** (any $h$ admits $h f^{-1}$ as a quotient), which is the term the hard-tier quiz at line 308 uses correctly. So the math conclusion ("⇒ groupoid") is right, only the intermediate term is wrong.

- **§1 widget extra at line 414, on $d^1\colon[2]\to[3]$**: the readout says "relation: sʲdⁱ = dⁱ⁻¹sʲ for i > j+1; with i=1, j=0 here: s⁰d¹ = d¹s⁰? not quite, check the third identity." The middle branch of the third cosimplicial identity (line 274) is precisely $i \in \{j, j+1\}$, and with $i = 1, j = 0$ we have $i = j+1 = 1$, so $s^0 d^1 = \mathrm{id}_{[1]}$ exactly. The widget correctly recognises that the $i > j+1$ branch doesn't apply, but instead of stating the correct conclusion ("$s^0 d^1 = \mathrm{id}$"), it just shrugs ("not quite, check"). Substantively non-wrong, but the "scratch-pad" phrasing should not have shipped — a reader who lands on this label is left with an unfinished thought.

## Underspecified or unverifiable claims

- **§3 step-2 widget caption, line 587**: "For each face map $d_i\colon X_n \to X_{n-1}$ we identify $(\sigma, d_i(t)) \in X_n \times |\Delta^n|$ with $(d_i \sigma, t) \in X_{n-1} \times |\Delta^{n-1}|$". The symbol $d_i$ is overloaded: on the left of $(\sigma, d_i(t))$, $d_i$ is the topological face inclusion $|\Delta^{n-1}|\hookrightarrow|\Delta^n|$ (also written $\delta_i$ or $|d^i|$), while on the right, $d_i$ is the face operator on the simplicial set. The two are dual, so the relation is correct as written under the ambient overloading, but a careful reader has to disambiguate. Notational sloppiness, not a math error.

- **§3 prose, line 540**: "every $\alpha\colon [m] \to [n]$ in $\Delta$" — the relation as written is over all morphisms $\alpha$ in $\Delta$, which is correct for the standard coend formula (cofaces and codegeneracies suffice as generators, but quotienting by all $\alpha$ is what the topos-theoretic colimit yields). This is the standard convention and not in conflict with the widget step-2 caption (which restricts attention to face maps for explanatory clarity).

- **§4 prose, line 666**: "two small categories are equivalent iff their nerves are equivalent in the Joyal model structure". Technically correct, with the implicit understanding that "Joyal-equivalent" between fibrant objects (= quasi-categories) means there is a sequence of trivial cofibrations and trivial fibrations connecting them, equivalently a Joyal weak equivalence (= categorical equivalence). For nerves of $1$-categories this descends to ordinary equivalence of categories, as the explanation in the hard-tier quiz at line 184 spells out.

- **§5 prose, line 808 — outer-horn explanation phrasing**: "filler asks for $g\colon b\to c$ with $h = g\circ f$ — this is right-divisibility, and it holds for every pair iff every morphism is invertible." The quiz at line 308 spells the same thing out more carefully, attaching the conclusion to "$f$ being right-invertible for every $f$" implying groupoid. The prose statement here is correct under the intended reading "this property, asked for every $f$, forces every $f$ to be invertible".

## Severity

**minor errors.** The page's main mathematical content — the cosimplicial identities (§1 prose), simplex/horn definitions, Eilenberg–Zilber lemma, geometric realization coend formula, $|{-}|\dashv\mathrm{Sing}$ adjunction, Quillen equivalence statements, nerve face/degeneracy formulas, characterisation $N(C)$-Kan-iff-groupoid, Boardman–Vogt characterisation of nerves of $1$-categories, $h\dashv N$ adjunction, Joyal model structure / quasi-category definitions — is all correct, and matches the standard treatment (Goerss–Jardine, Lurie HTT §1.1, Riehl's *Categorical Homotopy Theory*). Every quiz answer in both v1 and hard tiers is correct.

The defects are localised to: (a) one wrong count in the §1 prose ("two" should be "four" constants among $\Delta([1],[3])$); (b) two cosimplicial identities in the §1 widget's "extra" annotations stated with $i$ and $j$ swapped, contradicting the (correct) prose statement directly above them; (c) the §5 horn widget using "right-cancellable" / "left-cancellable" where the correct terms are "right-divisible" / "left-divisible" (and the hard-tier quiz uses the correct term); (d) a half-finished "not quite, check" remark in one widget readout. Items (b) and (c) are the most substantive — they're false formulas / wrong technical terms, even though the surrounding text states the correct version. They should be repaired by re-deriving the identity inside the widget code.
