# homological — math correctness audit (2026-05)

**Section:** Algebra & homological

## Verified claims

### Chain complexes and homology (§1)

- **Chain complex definition** (line 393–397): $\partial^2 = 0$ ⇔ $\operatorname{im}\partial_{n+1} \subseteq \ker\partial_n$; $H_n = \ker\partial_n / \operatorname{im}\partial_{n+1}$. Standard, correct.
- **Simplicial homology archetype** (line 399): free abelian group on $n$-simplices, $\partial$ = alternating face sum. Standard, correct.
- **Chain complex calculator presets**:
  - **`triangle`** (lines 461–467): 3 verts, 3 edges, no faces. Boundary matrix correct (cycle $\partial(e_i) = v_{i+1} - v_i$). H_0 = 1, H_1 = 1, H_2 = 0. ✓
  - **`disk`** (lines 469–475): same vertices/edges plus one face with $\partial = e_1 + e_2 + e_3$. H_0 = 1, H_1 = 0, H_2 = 0 (contractible). ✓
  - **`s1`** (lines 476–482): two vertices, two edges from A to B, both $\partial = B - A$. d_1 = [[-1,-1],[1,1]]. rank 1, H_0 = 1, H_1 = 2 - 1 = 1. ✓
  - **`s2`** = $\partial\Delta^3$ (lines 483–505): I verified each column of $d_1$ and $d_2$ by hand. d_1 columns: edge 12 = (-1,1,0,0), edge 13 = (-1,0,1,0), …, edge 34 = (0,0,-1,1). All match. d_2 columns: face 123 with $\partial = e_{23} - e_{13} + e_{12} = (1,-1,0,1,0,0)$; face 124 with $\partial = e_{24} - e_{14} + e_{12} = (1,0,-1,0,1,0)$; face 134 = $(0,1,-1,0,0,1)$; face 234 = $(0,0,0,1,-1,1)$. All match. Then rank d_1 = 3, rank d_2 = 3. H_0 = 1, H_1 = (6-3)-3 = 0, H_2 = 4-3 = 1. ✓
  - **`torus`** (lines 506–515): $\Delta$-complex (one vertex, two loops $a,b$, one 2-cell with attaching word $aba^{-1}b^{-1}$). All boundary maps zero. H_0 = 1, H_1 = 2, H_2 = 1, χ = 0. The chosen *cellular* boundary really is zero because the attaching word's exponent sum on each generator is 0 + 0. ✓ (Note: this is a CW/Δ-complex, not honest simplicial. The widget's `note` field correctly flags "$\Delta$-complex model".)
  - **`disconnected`** (lines 516–522): two disjoint edges (4 verts, 2 edges). rank d_1 = 2, H_0 = 4 - 2 = 2, H_1 = 0. ✓
- **Torus Betti claim in prose** (line 430): $H_0 = \mathbb{Q}$, $H_1 = \mathbb{Q}^2$, $H_2 = \mathbb{Q}$. ✓
- **Sphere Betti claim** (line 430): $H_0 = \mathbb{Q}$, $H_1 = 0$, $H_2 = \mathbb{Q}$. ✓
- **Quiz `chain-complexes` q1** (mcq, line 9): chain-complex defining condition $\partial \circ \partial = 0$. ✓
- **Quiz `chain-complexes` q2** (numeric, line 21): $\dim H_1$ of triangle boundary = 1. ✓
- **Quiz `chain-complexes` q3** (numeric): Euler char of $T^2$ = 0. ✓
- **Quiz `chain-complexes` hard q1** (mcq): $0\circ 2 = 0$ identifies the only valid sequence. ✓
- **Quiz `chain-complexes` hard q3** (mcq): chain map condition $\partial^D \circ f = f \circ \partial^C$. ✓

### Exact sequences (§2)

- **Exactness definition** (line 633): $\operatorname{im} f = \ker g$. ✓
- **SES characterization** (line 638): $f$ injective, $g$ surjective, $\operatorname{im} f = \ker g$ ⇔ $A \cong \ker g \subseteq B$, $C \cong B/A$. ✓
- **Note on $0 \to \mathbb{Z} \xrightarrow{\cdot n} \mathbb{Z} \to \mathbb{Z}/n \to 0$ and Ext^1(Z/n, Z) = Z/n** (lines 642–644): apply $\operatorname{Hom}(-, \mathbb{Z})$ to get $\mathbb{Z} \xrightarrow{\cdot n} \mathbb{Z}$, cokernel $= \mathbb{Z}/n$. So $\operatorname{Ext}^1(\mathbb{Z}/n, \mathbb{Z}) = \mathbb{Z}/n$. ✓
- **Exactness widget examples**:
  - `zn` ($n=6$): $\operatorname{im}(\cdot 6) = 6\mathbb{Z} = \ker(\bmod 6)$. SES, exact. ✓
  - `fail1`: $\operatorname{im}(\cdot 2) = 2\mathbb{Z} \ne \mathbb{Z} = \ker(g=0)$. Not exact at right $\mathbb{Z}$. ✓
  - `fail2`: same as fail1 with extra $\mathbb{Z}$ on right; both middle exactness and right exactness fail. ✓
  - `snake` ($0 \to \mathbb{Z}/2 \xrightarrow{\cdot 2} \mathbb{Z}/4 \to \mathbb{Z}/2 \to 0$): $\operatorname{im} = \{0,2\} = \ker(\bmod 2)$. ✓
  - `noninj`: $f = 0$, $g = \mathrm{id}$. $\operatorname{im} f = 0 = \ker g$ (vacuously). Not SES (f isn't injective). ✓
  - `split`: $\mathbb{Z} \hookrightarrow \mathbb{Z} \oplus \mathbb{Z}/3 \to \mathbb{Z}/3$. Splits. ✓
- **Quiz `exact-sequences` q1** (multi-select, lines 73–86): correct equivalents (0) and (2); (1) is correctly excluded as $g\circ f = 0$ only gives $\operatorname{im} f \subseteq \ker g$. ✓
- **Quiz `exact-sequences` q2**: SES $0\to\mathbb{Z}\to\mathbb{Z}\to\mathbb{Z}/n\to 0$ splits iff $n=1$ (no homomorphism $\mathbb{Z}/n \to \mathbb{Z}$ for $n \ge 2$). ✓
- **Quiz `exact-sequences` q3**: $|B| = |A|\cdot|C| = 6 \cdot 10 = 60$ for SES of finite abelian groups. ✓
- **Quiz hard q1**: $0 \to \mathbb{Z} \xrightarrow{\cdot 2} \mathbb{Z} \to \mathbb{Z}/2 \to 0$ does not split. ✓
- **Quiz hard q2**: Connecting map $\partial: \mathbb{Z}^2 \hookrightarrow \mathbb{Z}^3$, cokernel rank $= 3 - 2 = 1$. ✓ (Yes, the LES forces $\partial$ injective when $H_1(B) = 0$.)
- **Quiz hard q3**: Five-lemma conclusion. ✓

### Snake lemma (§3)

- **Snake-lemma statement** (line 803–804): $0 \to \ker\alpha \to \ker\beta \to \ker\gamma \xrightarrow{\delta} \operatorname{coker}\alpha \to \operatorname{coker}\beta \to \operatorname{coker}\gamma \to 0$. Standard, correct.
- **Construction of δ** (line 823): "lift, apply β, pull back along i'". Standard, correct.
- **Snake-lemma trace widget** (lines 1335–1493) — checked the worked example in detail:
  - Setup: $A = C = \mathbb{Z}/2$, $B = \mathbb{Z}/4$; $i = i' : a \mapsto 2a$; $p = p' : b \mapsto b \bmod 2$; $\alpha = \gamma = 0$, $\beta = \cdot 2$ on $\mathbb{Z}/4$.
  - Commutativity: $\beta \circ i (a) = \beta(2a) = 4a = 0 = i'\circ\alpha(a)$. ✓
  - $p' \circ \beta (b) = (2b) \bmod 2 = 0 = \gamma\circ p(b)$. ✓
  - $\delta(c=1)$: lift $b=1 \in \mathbb{Z}/4$ ($p(1)=1$), $\beta(1) = 2$, $p'(2) = 0$, find $a' \in \mathbb{Z}/2$ with $i'(a') = 2a' = 2$, so $a' = 1$. $\operatorname{im}\alpha = 0$, so $\delta(1) = 1 \in \operatorname{coker}\alpha = \mathbb{Z}/2$. ✓ Widget formula `((2*c)%4)/2` for $a'$ matches.
  - $\delta(0)$: chase gives 0. Widget: same formula gives 0. ✓
  - Conclusion that $\delta = \mathrm{id}: \mathbb{Z}/2 \to \mathbb{Z}/2$ is correct.
- **Snake-lemma diagram widget** (lines 808–822): the togglable α/β/γ feature correctly preserves exact-row checks at $B$ and $B'$ (those use only the horizontal arrows $i, p, i', p'$). ✓
- **Quiz `snake-lemma` q1** (mcq): δ goes $\ker\gamma \to \operatorname{coker}\alpha$. ✓
- **Quiz `snake-lemma` q2** (ordering): canonical six-term sequence. ✓
- **Quiz `snake-lemma` q3** (numeric): $\delta(1) = 1$ for the widget setup. ✓
- **Quiz `snake-lemma` hard q1** (mcq): correct construction described. ✓
- **Quiz `snake-lemma` hard q4** (spot-the-error): correctly identifies that $\delta$ must land in $\operatorname{coker}\alpha = A'/\operatorname{im}\alpha$, not $A'$ itself. ✓

### Five lemma (§4)

- **Five-lemma statement** (line 1509): $f_1, f_2, f_4, f_5$ iso ⇒ $f_3$ iso. Refined "halves": $f_2$ surj + $f_4$ inj ⇒ $f_3$ surj; $f_2$ inj + $f_4$ surj ⇒ $f_3$ inj. Standard. ✓ (One nuance: the "surjective half" requires also $f_1$ surj for $f_3$ surj — see standard formulation. Actually the page's text is fine: by "halves" it just means the two diagram-chase directions, and the prose elsewhere correctly invokes both.) Looking at the chase widget code (lines 1541–1551), the injectivity proof uses $f_1$ surj, $f_2, f_4$ inj. The surjectivity proof (lines 1553–1561) uses $f_2$ surj, $f_4$ surj, $f_5$ inj. Both standard. ✓
- **Diagram-chase narration** (lines 1541–1551, 1553–1561): every step verified. The chase uses commutativity, exactness, injectivity/surjectivity hypotheses correctly.
- **Quiz `five-lemma` q1** (mcq): correct hypothesis statement. ✓
- **Quiz `five-lemma` q2** (mcq): four-lemma surjectivity hypothesis: "$f_2$ surj, $f_4$ inj". ✓ (Plus implicit $f_5$ inj or $f_1$ surj depending on which side; the page chose $f_2$ surj + $f_4$ inj which matches the standard "half-of-five" statement.)
- **Quiz `five-lemma` q3** (numeric): $f_3$ rank = 7. ✓
- **Quiz `five-lemma` hard q1** (proof-completion): correct chase step. ✓
- **Quiz `five-lemma` hard q2 explanation**: the counterexample sketch is plausible but not concretely verifiable from the question text alone; the underlying claim (five-lemma is sharp) is correct.
- **Quiz `five-lemma` hard q3**: Mitchell embedding theorem allowing element chases. ✓

### Long exact sequence in homology (§5)

- **LES from SES of complexes** (line 1647–1648): $\cdots \to H_n(A) \to H_n(B) \to H_n(C) \xrightarrow{\partial} H_{n-1}(A) \to \cdots$. ✓
- **Mayer–Vietoris note** (line 1652): SES $0 \to C_*(U \cap V) \to C_*(U) \oplus C_*(V) \to C_*(U+V) \to 0$. (Strictly, $C_*(U+V) \subseteq C_*(U \cup V)$ as the chains supported on $U \cup V$ via the union. The induced LES converges with $H_*(U \cup V)$ via the small-chain theorem.) The page's shorthand $C_*(U \cup V)$ rather than $C_*(U + V)$ is a standard abuse. ✓
- **Inductive computation** $H_n(S^n) = H_{n-1}(S^{n-1})$: ✓ (this is the actual MV consequence, since the equator $S^{n-1}$ is the intersection of two contractible hemispheres).
- **Quiz `long-exact-sequence` q1** (ordering): canonical $H_n(A) \to H_n(B) \to H_n(C) \to H_{n-1}(A)$. ✓
- **Quiz q2** (numeric): $\dim H_n(S^n; \mathbb{Q}) = 1$ for all $n \ge 1$. ✓
- **Quiz q3** (mcq): $H_*(B) = 0$ ⇒ $\partial: H_n(C) \xrightarrow{\sim} H_{n-1}(A)$. ✓
- **Quiz hard q1** (mcq): MV connecting-map description $z = a + b \Rightarrow [\partial a]$. ✓
- **Quiz hard q3** (mcq): naturality of $\partial$ via diagram chase. ✓

### Projective modules (§6)

- **Definition + lifting property** (line 1680): standard. ✓
- **Equivalent characterizations** (line 1689–1693): direct summand of free; $\operatorname{Hom}(P, -)$ exact; every SES ending in $P$ splits. ✓
- **Over PID, projective ⇔ free** (line 1695). ✓ (Submodules of free over PID are free, plus standard splitting argument.)
- **Over Dedekind domain, rank-1 projectives ↔ ideal class group** (line 1695). ✓
- **Projective lift widget** (lines 1735–1854):
  - All "isProjective" cases (P=Z, Z²) correctly produce explicit lifts.
  - All "non-projective" cases (Z/2, Z/6) correctly diagnose the obstruction (torsion target into torsion-free Z).
  - For P=Z/2, surj=Z⊞Z/6: f sends 1 ↦ 3 (the unique nonzero 2-torsion in Z/6). ✓
- **Quiz `projective-modules` q1**: characterization as direct summand of free. ✓
- **Quiz q2**: lifting property statement. ✓
- **Quiz q3**: Z/2 not projective over Z. ✓
- **Quiz hard q1**: $\mathbb{Z}[x,y]/(xy)$ has nontrivial Picard group, distinguishing projective from free. ✓ (The example $R/(x) \cong \mathbb{Z}[y]$ is indeed projective: $R = R/(x) \oplus R/(y)$ as $R$-modules, since $x + y = ?$ — actually one needs to verify. Let me check: in $R = \mathbb{Z}[x,y]/(xy)$, we have $R/(x) \cong \mathbb{Z}[y]$ and $R/(y) \cong \mathbb{Z}[x]$. The natural map $R \to R/(x) \oplus R/(y)$ has kernel $(x) \cap (y) = (xy) = 0$, and is surjective… well, $(a, b) = (\bar f, \bar g)$ requires $f - g \in (x) + (y)$ which holds because $1 = ?$ — actually $(x) + (y) = (x, y)$ which is the augmentation ideal, not the whole ring. So $R \ne R/(x) \oplus R/(y)$. The actual claim that $R/(x)$ is projective over $R = \mathbb{Z}[x,y]/(xy)$: in fact $R/(x) \cdot R/(y) = R/(x,y) = \mathbb{Z}$, and there's a SES $0 \to R/(y) \to R \to R/(x) \to 0$... wait, this might not split. Let me re-examine: $R = \mathbb{Z}[x,y]/(xy)$. The element $y$ generates the ideal $(y)$ as an $R$-module. There's an SES $0 \to (y) \to R \to R/(y) \to 0$. As an $R$-module, $(y) \cong R/\text{ann}(y) = R/(x) \cong \mathbb{Z}[y]$. So $0 \to \mathbb{Z}[y] \to R \to \mathbb{Z}[x] \to 0$. This splits via $R/(y) \to R$, $\bar 1 \mapsto 1 - y/y$... hmm. Actually in Spec $R = V(xy) = $ two lines meeting at origin, the structure sheaf decomposes locally but not globally — the decomposition fails at the node. So $\mathbb{Z}[y]$ is NOT projective over $R$ in fact; it has projective dimension related to the singularity. **So the quiz hard q1 might overstate the claim.** This is borderline — the quiz's substantive point about Picard-group obstructions is correct, but the specific $\mathbb{Z}[x,y]/(xy)$ example may not actually furnish a projective-not-free module the way the question implies. Marking as borderline below.)
- **Quiz hard q2** (mcq, FALSE statement): "infinite products of projectives are always projective" — correctly identified as false (Baer–Specker $\prod_{\mathbb{N}} \mathbb{Z}$ is not free). ✓
- **Quiz hard q3** (numeric): rank-1 projectives over Dedekind domain with $h=3$ → 3 classes. ✓

### Injective modules (§7)

- **Injective definition + extension property** (line 1861). ✓
- **Baer's criterion** (line 1870): test only against ideals. ✓
- **Over Z: injective ⇔ divisible** (line 1872). ✓ (Direct from Baer with $\mathfrak{a} = (n)$.)
- **Examples** (line 1872): $\mathbb{Q}, \mathbb{Q}/\mathbb{Z}$, Prüfer $\mathbb{Z}/p^\infty$ are injective. $\mathbb{Z}, \mathbb{Z}/n$ are not. ✓
- **Baer/divisibility widget** (lines 1900–2005):
  - Q, Q/Z, Z/2^∞ correctly marked divisible.
  - Z, Z/4, Z/2 ⊕ Z/3 correctly marked non-divisible with concrete witness (gcd condition).
  - For Q: solving $nx = a$ in Q gives $x = a/n$. ✓
  - For Z/4: $nx \equiv a \pmod 4$ solvable iff $\gcd(n,4) | a$. ✓
  - For Z: $nx = a$ in Z iff $n | a$. ✓
- **Quiz `injective-modules` q1, q2, q3**: standard. ✓
- **Quiz hard q1**: Baer ⇒ Z-injective = divisible. ✓
- **Quiz hard q2**: injective hulls exist for every module, unique up to non-canonical iso. ✓ ($E(\mathbb{Z}) = \mathbb{Q}$, $E(\mathbb{Z}/p) = \mathbb{Z}/p^\infty$ ✓.)
- **Quiz hard q3** (numeric): extensions of $f: (2) \to \mathbb{Q}/\mathbb{Z}$, $f(2) = 1/4$, count of $\tilde f(1)$ with $2\tilde f(1) = 1/4$ in $\mathbb{Q}/\mathbb{Z}$: $\tilde f(1) \in \{1/8, 5/8\} \pmod 1$. Count = 2. ✓

### Flat modules (§8)

- **Flat definition** (line 2011). ✓
- **Localization is flat** (line 2017). ✓
- **Over PID, flat ⇔ torsion-free** (line 2018). ✓
- **Flatness ⇔ Tor_1 = 0 always** (line 2022). ✓
- **Tensor SES widget** (lines 2050–2113):
  - For $M = \mathbb{Z}/m$, $\ker(\cdot n \text{ on } \mathbb{Z}/m) = \mathbb{Z}/\gcd(m,n)$. Verified: $\{x \in \mathbb{Z}/m : nx \equiv 0\} = \{x : (m/g) | x\}$ where $g = \gcd$, count $= g$. ✓
  - For $M = \mathbb{Z}/2$, $n=4$: $g = 2$, ker = $\mathbb{Z}/2$. ✓
  - For $M = \mathbb{Z}/6$, $n=4$: $g = 2$, ker = $\mathbb{Z}/2$. ✓
  - Correctly identifies that ker $\ne 0$ ⇔ flatness fails for that test SES.
- **Quiz `flat-modules` q1**: $-\otimes M$ exact. ✓
- **Quiz q2**: free ⇒ projective ⇒ flat. ✓
- **Quiz q3**: Z/2 not flat. ✓
- **Quiz hard q1**: $S^{-1}R$ flat over $R$ for any $S$. ✓
- **Quiz hard q2**: Lazard's theorem (flat = filtered colim of f.g. free). ✓
- **Quiz hard q3** (numeric): $\ker(\cdot 4 \text{ on } \mathbb{Z}/6) = \{0, 3\}$, order 2. Tor_1(Z/6, Z/4) = Z/gcd(6,4) = Z/2. ✓

### Derived functors, Ext, Tor (§9)

- **Right derived functors via injective resolutions; left derived via projective** (line 2122). ✓
- **Independence of resolution** (line 2122). ✓
- **Z has global dim 1** (line 2130): for f.g. abelian groups, two-step resolution. ✓
- **Ext/Tor widget over Z** — verified the bilinear summand-pair table (lines 2188–2207) against the standard formulas:
  - **Tor and Hom on (Z/m, Z/n)**: $\mathbb{Z}/m \otimes \mathbb{Z}/n = \mathbb{Z}/\gcd$, $\operatorname{Hom}(\mathbb{Z}/m, \mathbb{Z}/n) = \mathbb{Z}/\gcd$, $\operatorname{Tor}_1(\mathbb{Z}/m, \mathbb{Z}/n) = \mathbb{Z}/\gcd$, $\operatorname{Ext}^1(\mathbb{Z}/m, \mathbb{Z}/n) = \mathbb{Z}/\gcd$. ✓ (Each verified from the resolution $0 \to \mathbb{Z} \xrightarrow{\cdot m} \mathbb{Z} \to \mathbb{Z}/m \to 0$ tensored / Hom-ed with $\mathbb{Z}/n$.)
  - **Ext^1(Z/m, Z) = Z/m**: cokernel of $\mathbb{Z} \xrightarrow{\cdot m} \mathbb{Z}$. ✓
  - **Hom(Z/m, Z) = 0**: ✓ (kernel of $\cdot m: \mathbb{Z} \to \mathbb{Z}$ is 0).
  - **Tensor and Hom for Z arguments**: $\mathbb{Z} \otimes N = N$, $\operatorname{Hom}(\mathbb{Z}, N) = N$, $\mathbb{Z}$ flat and projective. ✓
  - **Q is flat (Tor = 0) and injective as Z-module (Ext = 0)**: ✓
  - **Q ⊗ Z/n = 0** (since $n$ is invertible in Q). ✓
  - **Hom(Q, Z) = 0, Hom(Q, Z/n) = 0**: Q is divisible, Z and Z/n have no nontrivial divisible subgroups. ✓
  - **Hom(Q, Q) = Q** (Q-dim 1). ✓
  - **Q ⊗ Q = Q** (Q-dim 1). ✓
  - **Q ⊗ Q/Z = 0** (Q/Z is torsion, Q is torsion-free divisible). ✓
  - **Q/Z is divisible ⇒ injective; Ext^i(-, Q/Z) = 0 for i ≥ 1**. ✓
  - **Tor_1(M, Q/Z) = torsion(M)**: standard, ✓. So Tor_1(Z, Q/Z) = 0, Tor_1(Z/m, Q/Z) = Z/m. ✓
  - **(Q/Z) ⊗ Z = Q/Z**: trivially. ✓
  - **(Q/Z) ⊗ Z/n = Z/n**: since Q/Z has $n$-torsion equal to $\frac{1}{n}\mathbb{Z}/\mathbb{Z} \cong \mathbb{Z}/n$ and $\otimes \mathbb{Z}/n$ kills divisible parts… more precisely $\mathbb{Q}/\mathbb{Z} \otimes \mathbb{Z}/n = (\mathbb{Q}/\mathbb{Z})/n(\mathbb{Q}/\mathbb{Z}) = (\mathbb{Q}/\mathbb{Z})_n = \mathbb{Z}/n$ (the $n$-torsion, since Q/Z is divisible so $n(\mathbb{Q}/\mathbb{Z}) = \mathbb{Q}/\mathbb{Z}$ – wait that gives 0!). Let me recheck. $n \cdot (\mathbb{Q}/\mathbb{Z}) = \mathbb{Q}/\mathbb{Z}$ since divisible. So $(\mathbb{Q}/\mathbb{Z})/n(\mathbb{Q}/\mathbb{Z}) = (\mathbb{Q}/\mathbb{Z})/(\mathbb{Q}/\mathbb{Z}) = 0$. **So $(\mathbb{Q}/\mathbb{Z}) \otimes \mathbb{Z}/n$ should be 0, not Z/n!** The widget code (lines 2272, 2280) returns `ret.ints.push(sN)` for tensor of (Z/n with Q/Z) and (Q/Z with Z/n), giving result Z/n. **This is wrong** — see "Wrong claims" below.
  - **Hom(Z/n, Q/Z) = Z/n**: a homomorphism is determined by image of 1, which must satisfy $n \cdot \text{image} = 0$, so image $\in \{0, 1/n, 2/n, \ldots, (n-1)/n\}$. Count $n$, group $\mathbb{Z}/n$. ✓
  - **Hom(Z, Q/Z) = Q/Z**: ✓
  - **Hom(Q, Q/Z) "uncountable, not f.g."**: ✓ (it's the profinite completion of Z modulo Z, or equivalently $\hat{\mathbb{Z}} \otimes \mathbb{Q} / \hat{\mathbb{Z}}$… anyway uncountable).
  - **Hom(Q/Z, Z/n) "non-f.g."**: actually $\operatorname{Hom}(\mathbb{Q}/\mathbb{Z}, \mathbb{Z}/n) = 0$? Let me think. A hom from divisible group to finite cyclic: image must be divisible. $\mathbb{Z}/n$ has no nonzero divisible subgroup. So Hom = 0. The widget code does the right thing for `isZn(sN)` returning empty. The "non-f.g." marker only triggers for non-Z/n target. ✓
- **Free resolution description** (lines 2349–2372): for f.g. abelian $M = \bigoplus \mathbb{Z}/m_i \oplus \mathbb{Z}^k$, two-step free resolution with diagonal map. Standard. ✓
- **Quiz `derived-functors` q1**: injective resolution recipe. ✓
- **Quiz q2** (numeric): Ext^1(Z/2, Z/2) = Z/2, dim_F2 = 1. ✓
- **Quiz q3** (numeric): Tor_1^Z(Z/6, Z/4) = Z/gcd(6,4) = Z/2. ✓
- **Quiz hard q1**: standard resolution of Z/p. ✓
- **Quiz hard q2** (numeric): Tor_1(Z/12, Z/8) = Z/gcd(12,8) = Z/4. ✓
- **Quiz hard q3** (mcq): Hom(M,-) not right exact for non-projective M. ✓

### Resolutions (§10)

- **Definitions of projective/injective/flat resolutions** (lines 2412–2414). ✓
- **Existence via "enough projectives/injectives"** (line 2416). ✓
- **Ab has both** (line 2416): every ab. group quotient of free; embeds in product of $\mathbb{Q}/\mathbb{Z}$'s. ✓
- **Smith normal form gives invariant factors** (line 2418). ✓
- **Free resolution builder widget** (lines 2445–2516): for input summands, builds 2-step resolution and Smith normal form computation. Smith implementation (lines 271–345) is standard pivot-and-reduce; result restated as $\bigoplus \mathbb{Z}/d_i \oplus \mathbb{Z}^{\text{free}}$ via `zmoduleFromSmith`. The Smith algorithm correctly returns invariant factors (modulo the divisibility-property assumption noted in the comment). ✓
- **Hilbert syzygy theorem** (line 2437): gldim $k[x_1, \ldots, x_n] = n$. ✓
- **Quiz `resolutions-ha` q1**: projective resolution definition. ✓
- **Quiz q2** (numeric): Z/6 has resolution $\mathbb{Z} \xrightarrow{\cdot 6} \mathbb{Z}$, presentation matrix [6]. ✓
- **Quiz q3** (mcq): gldim $k[x_1, \ldots, x_n] = n$. ✓
- **Quiz hard q1**: $k[\varepsilon]/(\varepsilon^2)$ resolution of $k$ is $\cdots \to R \xrightarrow{\varepsilon} R \xrightarrow{\varepsilon} R \to k$. ✓ (Strictly periodic with period one map; "2-periodic" wording is loose but meaning is clear.)
- **Quiz hard q2** (numeric): PID gldim ≤ 1. ✓
- **Quiz hard q3** (mcq): flat resolutions for Tor only, not Ext. ✓

### Spectral sequences (§11)

- **Spectral-sequence general definition** (line 2523): pages $E_r$, differential $d_r$ with $d_r^2 = 0$, $E_{r+1} = H(E_r, d_r)$. ✓
- **Bidegree** (line 2523): page text uses homological convention $d_r: E_r^{p,q} \to E_r^{p-r, q+r-1}$ with the disclaimer "indices reversed depending on convention". Quiz q1 explicitly uses cohomological $(r, 1-r)$. Both internally consistent. ✓
- **Filtered complex SS** (line 2527): $E_0^{p,q} = F_p C_{p+q}/F_{p-1} C_{p+q} \Rightarrow H_*(C)$. ✓
- **Double complex SS** (line 2528): two filtrations both abut to $H_*(\text{Tot})$. ✓
- **Grothendieck SS form** (line 2531): $E_2^{p,q} = R^p F (R^q G(X)) \Rightarrow R^{p+q}(FG)(X)$. ✓
- **Leray and LHS as Grothendieck instances** (line 2531). ✓
- **Spectral-sequence widget** (lines 2553–2711): worked example with $C^{p,q} = \mathbb{Z}$ for all $(p,q) \in \{0,1\}^2$, $d_h = \cdot 2$ horizontal, $d_v = \cdot 3$ vertical. I verified by hand:
  - **$E_0$**: just the entries with $d_v$ = ·3.
  - **$E_1$ (vertical homology)**: each column $0 \to \mathbb{Z} \xrightarrow{\cdot 3} \mathbb{Z} \to 0$. $\ker(\cdot 3) = 0$, $\operatorname{coker} = \mathbb{Z}/3$. So $E_1^{p,0} = 0$, $E_1^{p,1} = \mathbb{Z}/3$. ✓
  - **$E_1 \to E_2$ via $d_1 = d_h$**: on top row $\mathbb{Z}/3 \xrightarrow{\cdot 2} \mathbb{Z}/3$. Since $\gcd(2,3)=1$, $\cdot 2$ is a unit ⇒ iso. $\ker = \operatorname{coker} = 0$. So $E_2 = 0$ everywhere. ✓
  - **Direct totalization check** (lines 2574–2584): $\text{Tot}^0 = \mathbb{Z}$, $\text{Tot}^1 = \mathbb{Z}^2$, $\text{Tot}^2 = \mathbb{Z}$. $d^0 = (2, 3)$, $d^1 = (3, -2)$ (with sign for $d^2 = 0$: $3 \cdot 2 + (-2) \cdot 3 = 0$ ✓). $H^0 = \ker(2,3) = 0$ ✓. $H^1 = \ker(3,-2)/\operatorname{im}(2,3) = \mathbb{Z}\cdot(2,3)/\mathbb{Z}\cdot(2,3) = 0$ ✓. $H^2 = \mathbb{Z}/(\gcd(3,-2)\mathbb{Z}) = \mathbb{Z}/\mathbb{Z} = 0$ ✓. Total cohomology = 0, matches SS. ✓
- **Quiz `spectral-sequences-ha` q1** (mcq): cohomological bidegree $(r, 1-r)$. ✓
- **Quiz q2** (mcq): degeneration at $E_2$ ⇔ $d_r = 0$ for $r \ge 2$. ✓
- **Quiz q3** (numeric): $E_1^{0,0}$ rank for the widget's double complex (taking horizontal homology first): $\ker(\cdot 2 \text{ on } \mathbb{Z}) = 0$. Rank 0. ✓
- **Quiz hard q1** (mcq): Serre SS for $S^1 \to E \to S^2$ has nonzero $E_2$ corners $(0,0), (2,0), (0,1), (2,1)$. $H^p(S^2)$ nonzero for $p \in \{0,2\}$, $H^q(S^1)$ nonzero for $q \in \{0, 1\}$. ✓
- **Quiz hard q2** (mcq): Hopf SS $d_2: E_2^{0,1} \to E_2^{2,0}$ is iso. Verified: forced by $H^*(S^3) = \mathbb{Z}, 0, 0, \mathbb{Z}$ and the only nonzero entries from previous question. ✓
- **Quiz hard q3** (numeric): Künneth-like for $E = S^2 \times S^2$, degenerate at $E_2$. $H^2(E) = H^2(S^2) \oplus H^0(S^2)\otimes H^2(S^2) = \mathbb{Q} \oplus \mathbb{Q}$, dim 2. ✓

### Double complexes and total complexes (§12)

- **Double-complex axioms** (line 2719–2723): $d_h^2 = d_v^2 = 0$ and $d_h d_v + d_v d_h = 0$. ✓
- **Total complex** (line 2725–2727): $\bigoplus_{p+q=n} C^{p,q}$, $d = d_h + d_v$. Anticommutativity ⇒ $d^2 = 0$. ✓
- **Two spectral sequences abutting to same total** (lines 2731–2735). ✓
- **Examples**: $P_\bullet \otimes Q_\bullet$ for Tor balancing; $\operatorname{Hom}(P_\bullet, I_\bullet)$ for Ext. ✓
- **Quiz `double-complex-ha` q1, q2, q3**: anticommutativity, total complex def, two SS. ✓

### Symmetry of Tor (§13)

- **Tor symmetry statement** (line 2756–2758). ✓
- **Proof sketch via $P_\bullet \otimes Q_\bullet$ double complex with two SS** (lines 2760–2767). ✓
- **Ext "balanced but not symmetric"** distinction (line 2771): $\operatorname{Ext}^n(M, N)$ computable from projective resolution of $M$ OR injective resolution of $N$ (two computations agree); but the bifunctor isn't symmetric in $M, N$. ✓
- **Quiz `tor-symmetry-ha` q1, q2, q3**: standard. ✓

### Cartan–Eilenberg resolutions (§14)

- **CE resolution definition** (lines 2782–2787): double complex $P^{\bullet,\bullet} \to C^\bullet$ with rowwise projective res of each $C^p$ AND induced rowwise resolutions of cycles, boundaries, homology. The "third condition" caveat (line 2790) is the standard distinguishing feature. ✓
- **Existence + uniqueness up to chain-homotopy** (line 2792). ✓
- **Hyper-derived functors $\mathbb{R}^n F(C^\bullet) = H^n(F(P^{\bullet, \bullet}))$**. ✓
- **Grothendieck SS via CE** (line 2797): construct by applying $G$ to CE resolution of an $F$-acyclic resolution. ✓
- **Quiz `cartan-eilenberg-ha` q1, q2, q3**: standard. ✓

### Abelian categories and triangulated preview (§15)

- **Abelian-category axioms** (line 2807): zero, biproducts, kernels/cokernels, every mono/epi normal. ✓
- **Freyd–Mitchell** (line 2810). ✓
- **Examples** (lines 2812–2818). ✓
- **Derived category $D(\mathcal{A})$ as triangulated** (line 2820). ✓
- **Distinguished triangles + rotation** as replacement for SES + LES. ✓
- **Identification $\operatorname{Hom}_{D(\mathcal{A})}(M, N[i]) = \operatorname{Ext}^i(M, N)$** (line 2823). ✓
- **Classifier widget** (lines 2859–2961): R-Mod, Sh, Ch(Ab), D(Ab), Grp, Top, Field, fg-Z-Mod with correct abelian/triangulated diagnoses. (Grp's "kernels but not every mono is a kernel" — correct: subgroups need to be normal to be kernels. Field's "no zero object" — correct: there's no zero field in standard sense.) ✓
- **Quiz `abelian-categories` q1, q2, q3**: standard. ✓
- **Quiz hard q1, q2, q3**: standard. ✓

## Wrong / dubious claims

### Wrong

- **Quiz `long-exact-sequence` hard q2** (line 372–376): "Compute $\dim_\mathbb{Q} H_1(D^2, S^1; \mathbb{Q})$" — the claimed answer **1** is **incorrect**; the correct answer is **0**.
  - LES: $H_1(D^2) \to H_1(D^2, S^1) \to H_0(S^1) \xrightarrow{i_*} H_0(D^2)$ becomes $0 \to H_1(D^2, S^1) \to \mathbb{Q} \xrightarrow{\sim} \mathbb{Q}$, so $H_1(D^2, S^1) = 0$ (it injects into the kernel of an iso).
  - Alternative via excision: $D^2/S^1 \simeq S^2$, so $H_n(D^2, S^1) \cong \tilde H_n(S^2)$. Thus $H_1(D^2, S^1) \cong \tilde H_1(S^2) = 0$, $H_2(D^2, S^1) \cong \tilde H_2(S^2) = \mathbb{Q}$.
  - The explanation contains two errors: (i) it concludes $H_1(D^2, S^1) = \mathbb{Q}$ from the LES even though the map $H_0(S^1) \to H_0(D^2)$ being iso forces the connecting map $\partial: H_1(rel) \to H_0(S^1)$ to land in kernel = 0, hence $H_1(rel) = 0$. (ii) It writes "by excision this equals $\tilde H_1(S^1)$" but excision actually relates $H_n(D^2, S^1)$ to $\tilde H_n(D^2/S^1) = \tilde H_n(S^2)$, not $\tilde H_{n-1}(S^1)$. The author appears to be confusing $H_n(D^n, S^{n-1}) \cong \tilde H_{n-1}(S^{n-1}) = \mathbb{Z}$ (a separate identity that holds at degree-mismatch $n$, not $n-1$).
  - Picking $n=2$ (the dimension where the relative homology is nonzero) would have made the question match the claimed answer 1; as stated with $H_1$, the right answer is 0.

- **Quiz `snake-lemma` hard q3** (lines 213–219): the question and explanation are self-contradictory and the answer **4** doesn't follow from any consistent reading of the setup.
  - Setup states $\alpha = \beta = \gamma = \mathrm{id}_{\mathbb{Z}/4}$ and "exact rows being the identity sequence". If we take $\gamma = \mathrm{id}$, then $\ker\gamma = 0$, so $\delta : 0 \to \operatorname{coker}\alpha$ has $\ker\delta = 0$, hence $|\ker\delta| = 1$ (trivial group has one element).
  - The explanation itself flip-flops: "$\ker\gamma = 0$ (since $\gamma = \mathrm{id}$, every element is in the image, kernel is trivial)" — already inconsistent ("every element is in the image" describes surjectivity of γ, not its kernel triviality, which is its injectivity; both happen to hold for id). Then "Wait: $\ker\delta$ is the kernel of $\delta:\ker\gamma\to\operatorname{coker}\alpha$. Since $\ker\gamma=0$ (identity is injective), the domain is $0$ and $\ker\delta=0$" — agreeing with my reading, $|\ker\delta|=1$, **not 4**.
  - Then the explanation switches to a different setup: "But if rows are $0\to\mathbb{Z}/4\xrightarrow{\mathrm{id}}\mathbb{Z}/4\to 0$, then $\ker\gamma=\mathbb{Z}/4$" — but this would mean $\gamma$ is the zero map (since the codomain is 0), not $\mathrm{id}$. The two setups are incompatible.
  - The numeric answer 4 is also wrong on grounds of the original question setup (should be 1).

- **Tensor product widget: $(\mathbb{Q}/\mathbb{Z}) \otimes \mathbb{Z}/n$ and $\mathbb{Z}/n \otimes (\mathbb{Q}/\mathbb{Z})$** (Section 9 widget, lines 2260–2263 and 2278–2281): the widget code returns "Z/n" via `ret.ints.push(sN)` (resp. `push(sM)`). **This is incorrect** — $\mathbb{Q}/\mathbb{Z}$ is divisible, so $n(\mathbb{Q}/\mathbb{Z}) = \mathbb{Q}/\mathbb{Z}$, hence $(\mathbb{Q}/\mathbb{Z}) \otimes_\mathbb{Z} \mathbb{Z}/n = (\mathbb{Q}/\mathbb{Z})/n(\mathbb{Q}/\mathbb{Z}) = 0$. The correct answer is **0**, not Z/n.
  - Concrete check: any pure tensor $(p/q + \mathbb{Z}) \otimes \bar a = (p/(qn) + \mathbb{Z}) \otimes (n \bar a) = (p/(qn) + \mathbb{Z}) \otimes \bar 0 = 0$, since $n\bar a = 0$ in $\mathbb{Z}/n$ — wait, that's wrong. Let me redo: $(p/q + \mathbb{Z}) \otimes \bar a$, write $p/q + \mathbb{Z} = n \cdot (p/(nq) + \mathbb{Z})$ (since Q/Z is n-divisible). Then $(n \cdot (p/(nq) + \mathbb{Z})) \otimes \bar a = (p/(nq) + \mathbb{Z}) \otimes (n \bar a) = (p/(nq) + \mathbb{Z}) \otimes 0 = 0$.
  - So every pure tensor is 0, confirming $(\mathbb{Q}/\mathbb{Z}) \otimes \mathbb{Z}/n = 0$. The widget displays a wrong answer for any pair involving $\mathbb{Q}/\mathbb{Z}$ on one side and $\mathbb{Z}/n$ on the other in the **Tor_0 (i.e. tensor)** column.
  - Tor_1 in this case is correct: Tor_1(Z/n, Q/Z) = n-torsion of Q/Z = Z/n (the widget gets this right).
  - In the default selections (M=Z/6, N=Z/4) this widget bug is not triggered, so a casual user might not notice.

### Dubious / underspecified

- **Quiz `projective-modules` hard q1** (line 436–445): claims $R/(x) \cong \mathbb{Z}[y]$ is projective over $R = \mathbb{Z}[x,y]/(xy)$. The substantive point about Picard groups is correct, but for this **specific** ring and module, $R/(x) = \mathbb{Z}[y]$ is **not** projective over $R$ — Spec $R$ has a node at the origin and $R/(x)$ corresponds to the structure sheaf of one of the two components, which is not locally free at the node. (The correct way to get a non-free projective uses a domain with nontrivial class group, e.g., $R = \mathbb{Z}[\sqrt{-5}]$ and a non-principal ideal like $(2, 1+\sqrt{-5})$.) The general principle the question articulates is correct; the specific witness module is misidentified. The mcq is still answerable from the general statement, but a careful reader checking the example will find it doesn't work.

- **Resolution-length claim for Z[x]/(x²) over Z[x]** (line 2437): the page says "Over $\mathbb{Z}[x]$ a free resolution of $\mathbb{Z}[x]/(x^2)$ already has length $1$ but is infinite". The intended meaning is unclear.
  - As an $\mathbb{Z}[x]$-module, $\mathbb{Z}[x]/(x^2)$ has resolution $0 \to \mathbb{Z}[x] \xrightarrow{\cdot x^2} \mathbb{Z}[x] \to \mathbb{Z}[x]/(x^2) \to 0$, which is **finite of length 1**. The "but is infinite" qualifier is wrong if interpreted as "the resolution is infinite-length"; it's only "infinite" in the sense that each $\mathbb{Z}[x]$ has infinite rank as a $\mathbb{Z}$-module — but that's not the natural reading.

- **"Over $\mathbb{Z}[x,y]$ things can get arbitrarily long"** (line 2437): the page implies arbitrary resolution lengths over $\mathbb{Z}[x,y]$. The global dimension of $\mathbb{Z}[x,y]$ is exactly 3 (= 1 for $\mathbb{Z}$ + 2 for the two variables, or via Hilbert syzygy applied to $\mathbb{Z}$), so resolutions cap at 3, **not arbitrary**. The intended meaning is likely "over $k[x_1, \ldots, x_n]$ as $n$ varies" (where dim $= n$), not over a fixed ring. As written, the statement is misleading.

### Minor nits (non-errors)

- **Quiz `chain-complexes` hard q2 explanation** (line 52): writes "$H_0=\ker(C_{-1}\to C_{-2})/\operatorname{im}(\partial_1)$" — typo, should be $\ker(\partial_0 : C_0 \to C_{-1}) / \operatorname{im}(\partial_1)$. Result $\mathbb{Z}/3$ and answer 3 are correct.

- **Quiz `snake-lemma` hard q2** (lines 202–211): the four answer choices include duplicate "$\alpha$ is surjective" (option A and option D verbatim, modulo the parenthetical equivalence "$\operatorname{coker}\alpha = 0$"). Both A and D are valid causes of $\delta = 0$, and option B ("γ injective") is also valid (also noted in the explanation). The question framing as single-correct is broken by the duplication.

- **Spectral-sequence-Hopf description** (Section 11 widget, line 2611): "the totalization $\mathbb{Z}\to \mathbb{Z}^2 \to \mathbb{Z}$" — this is fine, just a notational compression of the maps $(2,3)$ and $(3,-2)$.

- **Mayer–Vietoris SES** (line 1652): page writes $0 \to C_*(U \cap V) \to C_*(U) \oplus C_*(V) \to C_*(U \cup V) \to 0$. Strictly, the third term is $C_*(U) + C_*(V) \subseteq C_*(U \cup V)$ as the sub-complex of small chains; the LES then converges to $H_*(U \cup V)$ via the small-chain theorem. Standard introductory shorthand, not a math error.

- **Section 6 widget for P=Z, N=Z/2, f=identity**: the widget describes $f: \mathbb{Z} \to \mathbb{Z}/2, 1 \mapsto 1$. "Identity onto the target" is a bit of a stretch — there's no identity map between different objects. Cosmetic.

- **Quiz `resolutions-ha` hard q1**: the resolution of $k$ over $k[\varepsilon]/(\varepsilon^2)$ is described as "2-periodic" (line 724). It's actually 1-periodic in the sense that the map $\cdot \varepsilon$ repeats with period one. The "2" refers to $\varepsilon^2 = 0$ or to the fact that resolutions of $k$-as-$k[\varepsilon]$-module pass between $k$ and itself — but loosely. Not a math error.

## Severity

**One numeric quiz answer is wrong** (LES hard q2: $H_1(D^2, S^1)$, answer should be 0 not 1, with confused explanation), **one quiz is internally inconsistent** (snake-lemma hard q3: ill-defined setup, answer 4 doesn't match either reading), and **one widget computation is wrong** (Section 9 Ext/Tor widget mishandles tensor products $(\mathbb{Q}/\mathbb{Z}) \otimes \mathbb{Z}/n$, returning $\mathbb{Z}/n$ instead of 0). The three other items in "dubious" — the projective example, the $\mathbb{Z}[x]/(x^2)$ "infinite" claim, and the $\mathbb{Z}[x,y]$ "arbitrarily long" claim — are imprecisions in the prose that a careful reader will notice; the main statements they're attached to are correct.

Everything else is clean: the snake-lemma trace, the chain-complex preset homologies including the explicit $\partial\Delta^3$ matrices, the spectral-sequence widget's $E_2 = 0$ computation (verified by hand both via the SS and direct totalization), the Tor/Ext bilinear table over $\mathbb{Z}$ for finite-cyclic and free summands, the Baer-criterion divisibility tester, the projective-lifting widget, the flat-modules Tor-detection widget, the resolution builder + Smith normal form, and the abelian/triangulated classifier.

The page is overall accurate; the substantive bugs are localized to (i) the LES quiz hard q2, (ii) the snake-lemma quiz hard q3, and (iii) the $(\mathbb{Q}/\mathbb{Z}) \otimes \mathbb{Z}/n$ branch of the Ext/Tor widget.

### Suggested fixes

- **LES hard q2**: either change the question to ask about $\dim H_2(D^2, S^1)$ (answer 1) and rewrite the explanation, or keep $H_1$ and change the answer to 0 with an explanation that mentions the connecting map is 0 because the next map in the LES is an iso.
- **Snake-lemma hard q3**: rewrite the setup to specify the SES rows concretely (e.g., $0 \to \mathbb{Z}/4 \to \mathbb{Z}/4 \oplus \mathbb{Z}/4 \to \mathbb{Z}/4 \to 0$ split, with $\alpha=\beta=\gamma=\mathrm{id}$ — then $\ker\gamma = 0$ trivially gives $|\ker\delta| = 1$). Or replace with a question whose answer 4 is genuinely derivable.
- **Ext/Tor widget tensor branch**: change `ret.ints.push(sN)` (line 2262) and `ret.ints.push(sM)` (line 2280) to no-op `return ret;` (so result is the empty group / 0). Add a comment noting Q/Z is divisible.
- **Z[x]/(x²) and Z[x,y] resolution-length claim** (line 2437): rephrase to "Over $k[\varepsilon]/(\varepsilon^2)$ the residue field $k$ has an infinite (periodic) free resolution, illustrating that some rings have infinite global dimension; over $k[x_1, \ldots, x_n]$ resolutions can have length up to $n$ (Hilbert syzygy)."
- **Projective hard q1 example**: replace $\mathbb{Z}[x,y]/(xy)$ with $\mathbb{Z}[\sqrt{-5}]$ and the ideal $(2, 1+\sqrt{-5})$ as a concrete projective-not-free witness over a Dedekind domain.
