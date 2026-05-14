# quantum-groups — math correctness audit (2026-05)

**Section:** Algebra & homological

## Verified claims

### §1 Hopf algebras
- **Five structure maps $(m,\eta,\Delta,\varepsilon,S)$ table** (line 264–269): types and roles standard.
- **Counit axiom** $(\varepsilon\otimes\mathrm{id})\Delta = (\mathrm{id}\otimes\varepsilon)\Delta = \mathrm{id}$ — correct (using the identification $k\otimes H = H = H\otimes k$).
- **Antipode axiom** $m\circ(S\otimes\mathrm{id})\circ\Delta = m\circ(\mathrm{id}\otimes S)\circ\Delta = \eta\circ\varepsilon$ (line 271, 358) — standard.
- **Antipode is anti-homomorphism** corollary (line 271) — correct theorem (Sweedler).
- **$\mathbb C[G]$ as Hopf algebra**: $\Delta(g)=g\otimes g$, $\varepsilon(g)=1$, $S(g)=g^{-1}$ (line 275) — standard; $\Delta$ extended linearly. Cocommutativity ✓.
- **$U(\mathfrak g)$ as Hopf algebra**: $\Delta(x)=x\otimes 1+1\otimes x$, $\varepsilon(x)=0$, $S(x)=-x$ for $x\in\mathfrak g$ (line 277) — standard (Lie elements are primitive). Cocommutativity ✓.
- **Hopf inspector diagrams** (lines 297–360):
  - associativity square — correct.
  - coassociativity square — correct.
  - bialgebra compatibility square with `(id⊗τ⊗id);(m⊗m)` as the long-edge composite — correct (this is the standard map $H^{\otimes 4}\to H^{\otimes 2}$ realizing $\Delta(ab)=\Delta(a)\Delta(b)$).
  - antipode pentagon: $\Delta;(S\otimes\mathrm{id});m = \varepsilon;\eta$ — correct.

### §2 Drinfeld–Jimbo $U_q(\mathfrak{sl}_2)$
- **Generators and Cartan relations** (lines 408–409):
  - $KK^{-1}=K^{-1}K=1$, $KEK^{-1}=q^2 E$, $KFK^{-1}=q^{-2}F$, $[E,F] = (K-K^{-1})/(q-q^{-1})$ — all standard.
- **Hopf structure** (lines 411–412):
  - $\Delta(K)=K\otimes K$ (grouplike) ✓.
  - $\Delta(E)=E\otimes 1+K\otimes E$, $\Delta(F)=F\otimes K^{-1}+1\otimes F$ — one of the two standard Drinfeld–Jimbo conventions; internally consistent with the antipode formulas below.
  - $\varepsilon(K)=1$, $\varepsilon(E)=\varepsilon(F)=0$ ✓.
  - $S(K)=K^{-1}$, $S(E)=-K^{-1}E$, $S(F)=-FK$ — verified compatible with $\Delta$ via the antipode axiom: e.g. for $E$, $m\circ(S\otimes\mathrm{id})\Delta(E) = S(E)\cdot 1 + S(K)\cdot E = -K^{-1}E + K^{-1}E = 0 = \eta\varepsilon(E)$ ✓; for $F$, $m\circ(S\otimes\mathrm{id})\Delta(F) = S(F)\cdot K^{-1} + S(1)\cdot F = -FK\cdot K^{-1} + F = 0$ ✓.
- **Classical-limit derivation** (lines 415–417):
  - $K=q^H$, $q=e^\hbar$: $(1+\hbar H)E(1-\hbar H) = E + \hbar[H,E]+O(\hbar^2)$, $q^2 E = (1+2\hbar)E + O(\hbar^2)$ ⇒ $[H,E]=2E$ ✓.
  - $(K-K^{-1})/(q-q^{-1}) = 2\sinh(\hbar H)/(2\sinh\hbar) \to H$ as $\hbar\to 0$ ✓.
- **q-deformation slider** (lines 428–507): plots $[n]_q = (q^n-q^{-n})/(q-q^{-1})$ vs classical $n$. Caption "[E,F] acts on the weight-$n$ vector by $[n]_q$" — correct: on a vector with $Kv = q^n v$, $(K-K^{-1})/(q-q^{-1})v = [n]_q v$. Bar-chart endpoints ($q\to 1$ collapse to $n$) verified.

### §3 Universal $R$-matrix and Yang–Baxter
- **Quasitriangularity** $\Delta^{\mathrm{op}}(x) = R\,\Delta(x)\,R^{-1}$ (line 532) — standard (Drinfeld).
- **Yang–Baxter** $R_{12}R_{13}R_{23} = R_{23}R_{13}R_{12}$ in $U_q(\mathfrak g)^{\otimes 3}$ (line 534) — standard.
- **Explicit $R$-matrix on $V_1\otimes V_1$** (line 536), basis $\{vv,vw,wv,ww\}$:
  $$R = \begin{pmatrix}q&0&0&0\\0&1&q-q^{-1}&0\\0&0&1&0\\0&0&0&q\end{pmatrix}.$$
  This is the standard six-vertex / Jimbo $R$-matrix up to an overall scalar (the "complete" universal $R$ on $V_1\otimes V_1$ carries an additional $q^{-1/2}$ prefactor coming from $q^{H\otimes H/2}$, often dropped). The matrix as written satisfies YBE — verified by direct computation: it's the unique-up-to-scalar solution with the six-vertex sparsity pattern. Eigenvalues of the *braiding* $c=\tau R$ on $V_1\otimes V_1$ are $q$ (mult 3, on $S^2 V_1\cong V_2$) and $-q^{-1}$ (mult 1, on $\Lambda^2 V_1\cong V_0$) — verified from char.poly. of the off-diagonal $2\times 2$ block: $\lambda^2-(q-q^{-1})\lambda-1=0\Rightarrow\lambda\in\{q,-q^{-1}\}$.
- **Reidemeister III interpretation** (line 539): YBE = third braid relation $\sigma_1\sigma_2\sigma_1 = \sigma_2\sigma_1\sigma_2$ ✓.
- **Braid representation $B_n\to\mathrm{End}(V^{\otimes n})$** ✓.
- **YBE braid widget** (lines 550–670): visual three-strand diagrams for both sides of YBE; the resulting permutation $(1\,2\,3)\to(3\,2\,1)$ is the same on both sides ✓.

### §4 Representations and crystal bases
- **Type-1 irreducibles $V_n$ for $n\in\mathbb Z_{\ge 0}$ at generic $q$, $\dim V_n = n+1$**, weight basis $\{v_n,v_{n-2},\ldots,v_{-n}\}$ — standard.
- **$Kv_k = q^k v_k$** ✓.
- **$q$-integer definition** $[m]_q = (q^m - q^{-m})/(q-q^{-1})$ ✓.
- **Quantum Clebsch–Gordan**: $V_m\otimes V_n \cong \bigoplus_{k=0}^{\min(m,n)} V_{m+n-2k}$ (line 687) — correct (matches classical CG at generic $q$).
- **Crystal-graph widget** (lines 701–749): the decomposition list $\{|m-n|, |m-n|+2,\ldots,m+n\}$ matches CG; dimension audit prints $(m+1)(n+1) = \sum(d+1)$ ✓.
- **$B(V_n) = \{v_n,\ldots,v_{-n}\}$ as an $f$-string crystal** for $\mathfrak{sl}_2$ — correct (single $f$-arrow string).
- **Kashiwara tensor-product rule** as combinatorial recipe — correct in the $q\to 0$ limit framework.
- **Lusztig canonical basis $\mathbf B$** (lines 752–757):
  - bar-invariant ($\overline q = q^{-1}$) ✓.
  - positive integer structure constants ✓ (Lusztig's deep theorem).
  - compatible with all highest-weight modules ✓.
- **KLR categorification provides positivity lift** ✓.

### §5 Reshetikhin–Turaev knot invariants
- **Tensor functor $F\colon \mathbf{Tang}_V\to\mathrm{Rep}(U_q(\mathfrak g))$** with crossing $\mapsto$ braiding $c=\tau R$, cup/cap $\mapsto$ ev/coev, framing $\mapsto$ ribbon element $\theta$ — standard (Reshetikhin–Turaev 1990).
- **$F(K)\in\mathbb Z[q^{\pm 1/2}]$** for closed knot/link — correct (the half-integer powers come from framing).
- **Three families table** (lines 793–798):
  - $U_q(\mathfrak{sl}_2)$ on $V_1$ → Jones $V_K(q)$ ✓.
  - $U_q(\mathfrak{sl}_n)$ on standard $\mathbb C^n$ → HOMFLY at $a=q^n$ ✓ (Murakami–Ohtsuki–Yamada / Reshetikhin).
  - $U_q(\mathfrak{so}_n), U_q(\mathfrak{sp}_{2n})$ → Kauffman two-variable ✓.
- **Unknot widget output**: "F(unknot) = qdim(V) = $[n+1]_q$ for $V=V_n$" (line 846) — correct: the q-dimension is $\sum_{k}q^k$ over weights $\{n,n-2,\ldots,-n\}$ which sums to $[n+1]_q$.
- **Hopf-link formula structure** (line 867): $F(\mathrm{Hopf}) = (\mathrm{qtr}\otimes\mathrm{qtr})(R_{21}R_{12})$ — correct (standard tangle-functor evaluation; $\tau R\tau = R_{21}$).
- **Trefoil $3_1$ Jones polynomial**: $V(3_1) = -q^{-4} + q^{-3} + q^{-1}$ (line 898) — correct for the right-handed trefoil in the Kauffman/Jones $q$-variable, as the page hedges with "(sign / normalization conventions vary)". Conventions: left-handed trefoil reverses the sign exponents.
- **Witten/Chern–Simons interpretation** with $q=e^{2\pi i/(k+2)}$ (line 910) — correct (level-$k$ $\mathfrak{su}(2)$ CS theory).

### §6 Affine quantum groups, KZ, categorification
- **Spectral parameter** $V(z) = V\otimes\mathbb C[z,z^{-1}]$, $R(z/w)$ — correct framing for evaluation modules of $U_q(\widehat{\mathfrak g})$.
- **Six-vertex/spectral YBE**: $R_{12}(u)R_{13}(u+v)R_{23}(v) = R_{23}(v)R_{13}(u+v)R_{12}(u)$ (line 925) — standard additive form; commuting transfer matrices ⇒ integrability ✓.
- **KZ connection** (line 929):
  $$\nabla = d - \hbar\sum_{i<j}\frac{\Omega_{ij}}{z_i-z_j}d(z_i-z_j).$$
  Equivalent to $d - \hbar\sum_{i<j}\Omega_{ij}\,d\log(z_i-z_j)$ — standard form. $\Omega = \sum_a x_a\otimes x^a$ is the split Casimir over dual bases of $\mathfrak g$ w.r.t. invariant form ✓.
- **Drinfeld–Kohno theorem**: KZ monodromy on $\mathrm{Conf}_n(\mathbb C)$ valued in $\mathfrak g^{\otimes n}$ ≡ braid-group rep from $R$-matrix at $q=e^{i\pi\hbar}$ ✓ (the standard normalization; some authors write $q=e^{2\pi i\hbar}$).
- **KLR Grothendieck-group identification** $K_0(\mathrm{KLR\text{-}mod}) = U_q(\mathfrak g)_{\mathbb Z[q,q^{-1}]}$ (line 933) ✓.
- **Khovanov homology categorifies Jones; detects unknot** ✓ (Kronheimer–Mrowka 2011).
- **Application-map widget**: descriptive text on each node is consistent with the cited literature.

### §7 Connections
- **Quantum geometric Langlands (Gaitsgory–Lurie)** — duality between $U_q$ and $U_{q^\vee}(\check{\mathfrak g})$-mod is the standard prediction ✓.
- **Rouquier 2-Kac–Moody** ✓.
- **Quantum cluster algebras + canonical bases (open in general type)** ✓.

### Quizzes (`quizzes/quantum-groups.json`)
Spot-checked all 18 quiz questions for `qg-hopf-algebras`, `qg-uq-sl2`, `qg-r-matrix`, `qg-representations`, `qg-knot-invariants`, `qg-applications`. Each MCQ stem and the marked-correct answer reflect standard textbook content (Kassel, Klimyk–Schmüdgen, Chari–Pressley). No mathematical errors found.

## Wrong / dubious claims

### Major

- **§4 line 685: $E$- and $F$-action coefficients on the weight basis are inconsistent with $[E,F]=(K-K^{-1})/(q-q^{-1})$.** The page writes
  $$Ev_k = [(n-k)/2 + 1]_q\,v_{k+2},\qquad Fv_k = [(n+k)/2]_q\,v_{k-2}.$$
  Apply these on $V_1$ (so $n=1$, basis $\{v_1, v_{-1}\}$):
  - $F v_1 = [(1+1)/2]_q v_{-1} = [1]_q v_{-1} = v_{-1}$.
  - $E v_{-1} = [(1-(-1))/2+1]_q v_1 = [2]_q v_1$.
  - $E v_1 = [(1-1)/2+1]_q v_3 = [1]_q v_3 = 0$ (out of range), so $FE v_1 = 0$.
  - $[E,F]v_1 = EF v_1 - FE v_1 = [2]_q v_1$.

  But the relation forces $[E,F]v_1 = (K-K^{-1})/(q-q^{-1})v_1 = (q^1 - q^{-1})/(q-q^{-1})v_1 = [1]_q v_1 = v_1$. The two disagree unless $[2]_q = 1$, i.e. only at the single value $q + q^{-1} = 1$ (a sixth root of unity), not on the generic $q$ the section assumes.

  Independent check on $V_2$ ($n=2$, $v_0$ at weight $0$): page's formulas give $Ev_0 = [2]_q v_2$, $Fv_2 = [2]_q v_0$, so $FE v_0 = [2]_q^2 v_0$; $Fv_0 = [1]_q v_{-2} = v_{-2}$, $Ev_{-2} = [3]_q v_0$, so $EF v_0 = [3]_q v_0$; $[E,F]v_0 = ([3]_q - [2]_q^2) v_0$. With $[3]_q = q^2+1+q^{-2}$ and $[2]_q^2 = q^2+2+q^{-2}$, this is $-1\cdot v_0\neq 0 = [0]_q v_0$.

  Boundary-condition tell: with the page's formulas, on the highest-weight vector $E v_n = [(n-n)/2+1]_q v_{n+2} = [1]_q v_{n+2} = 1\cdot v_{n+2}$, which is zero only by the convention "$v_{n+2}$ is out of range," not by the coefficient. On the lowest-weight vector $F v_{-n} = [(n+(-n))/2]_q v_{-n-2} = [0]_q v_{-n-2} = 0$ does vanish from the coefficient. The asymmetry is the smoking gun.

  **Correct standard formulas** (Kassel Prop. VI.3.5; Klimyk–Schmüdgen Thm 3.4.1), in the page's weight indexing:
  $$Ev_k = [(n+k)/2 + 1]_q\,v_{k+2},\qquad Fv_k = [(n-k)/2 + 1]_q\,v_{k-2}.$$
  Verification on $V_1$: $Fv_1 = [1]_q v_{-1} = v_{-1}$; $Ev_{-1} = [(1+(-1))/2+1]_q v_1 = [1]_q v_1 = v_1$; $EF v_1 = v_1$, $FE v_1 = 0$, $[E,F]v_1 = v_1 = [1]_q v_1$ ✓. Highest-weight: $Ev_n = [(n+n)/2+1]_q v_{n+2} = [n+1]_q v_{n+2}$ (still relies on out-of-range convention, but symmetrically with the lowest). Equivalent normalizations exist (e.g. $Fv_k = v_{k-2}$ unweighted with $Ev_k = [(n-k)/2]_q[(n+k)/2+1]_q v_{k+2}$); whichever is chosen, the two coefficients are not independent.

  **Fix:** swap which of $(n\pm k)/2$ each coefficient uses, and add the missing "+1" to the $F$ coefficient — i.e., the formulas above. The corresponding text "the irreducibles $V_n$ … look classical" is right; only the explicit coefficients are bugged.

### Minor

- **§3 inline note line 672**: "When $q=1$ the formula $R = q\,P_+ + q^{-1}P_- + (q-q^{-1})(\text{off-diag})$ collapses to the identity flip — symmetric monoidal, no braiding." The decomposition $R = q P_+ + q^{-1} P_-$ has the wrong sign on the $P_-$ piece for the *braiding* $c = \tau R$ — the eigenvalues of $c$ on $V_1\otimes V_1$ are $q$ and $-q^{-1}$, not $q$ and $+q^{-1}$ (verified above). The page's $R$ (six-vertex form) is in fact upper-triangular with eigenvalues $q,1,1,q$, so the $q P_+ + (\pm q^{-1}) P_-$ spectral form applies to $c=\tau R$, not $R$. The conclusion ("$q=1$ ⇒ identity flip ⇒ symmetric monoidal") is correct: at $q=1$ the matrix becomes $I$ and $c=\tau$ is the symmetric flip. **Fix:** state the decomposition for $c$, not $R$, and use $-q^{-1}P_-$.

- **§1 bialgebra-inspector caption (line 341)**: "The flip $\tau$ is the only obstruction to cocommutativity." Misleading. In the bialgebra-compatibility square the flip $\tau$ is a *structural ingredient* (it's how one identifies $H^{\otimes 4}\to H^{\otimes 2}$ inside $\Delta(ab)=\Delta(a)\Delta(b)$), not an obstruction. Cocommutativity is the separate axiom $\Delta = \tau\circ\Delta$. The two roles of $\tau$ are distinct; the caption conflates them. Pedagogical wording, no formula error.

- **§5 Hopf-link Jones value** (line 867): "$F(\mathrm{Hopf}) = q^2 + q^{-2}$ (Jones up to normalization)." Direct computation $\mathrm{qtr}_{V_1\otimes V_1}(R_{21}R_{12})$ in the standard normalization (with the $q^{-1/2}$ prefactor restored) gives $V(\mathrm{Hopf}_+) = -q^{-5/2}(1 + q^{-4})$ in the Jones $q$-variable, equivalently $-q^{-5/2}-q^{-9/2}$. The page's bare "$q^2 + q^{-2}$" is the renormalized "balanced" form (after dividing by qdim$(V_1)=[2]_q$ to set the unknot to $1$ and absorbing the $q^{1/2}$-frame factor). Acceptable given the explicit "(up to normalization)" hedge, but the precise normalization isn't stated.

- **§5 trefoil widget output line 898**: $V(3_1) = -q^{-4} + q^{-3} + q^{-1}$ is the right-handed trefoil's Jones polynomial in the standard $q$-variable; the left-handed trefoil $\bar 3_1$ gives $-q^4 + q^3 + q$. The page pictures a generic trefoil and hedges with "(sign / normalization conventions vary)" — fair, but the chirality should ideally be matched to the diagram (the parametric trefoil drawn at line 881 has no explicit over/under marking, so chirality is ambiguous).

- **§6 KZ–monodromy line 930**: "$q = e^{i\pi\hbar}$" is one common normalization; Drinfeld's original Kohno theorem is often stated as $q = e^{i\pi\hbar/d}$ with $d$ the lacing number, or equivalently $\hbar = \log q/(i\pi)$. Page's form is correct for simply-laced $\mathfrak g$; not noted but unlikely to mislead.

## Underspecified or unverifiable claims

- **§3 line 535 "$V_1$ the 2-dimensional standard rep"**: The §4 formulas (once corrected) make $V_1$ the spin-$1/2$ rep of dimension $2$ — consistent with this label. The convention that $V_n$ has dimension $n+1$ (rather than $V_n$ being $n$-dimensional) is used throughout, which is the highest-weight indexing standard.

- **§2 line 411 antipode signs and $K$-twists**: The choice $\Delta(E)=E\otimes 1+K\otimes E$ vs. the alternative $\Delta(E)=E\otimes K+1\otimes E$ is convention-dependent; both appear in the literature. Page picks one and is internally consistent.

- **§4 line 690 Kashiwara tensor rule**: The "explicit combinatorial rule on pairs of arrow strings" is correct as a high-level statement; the explicit $\mathfrak{sl}_2$ rule (signature rule on $+/-$ sequences) isn't spelled out in the prose, but the widget produces the right multiset of components, which is what matters.

- **§6 line 933 "each $q^k$ becomes a grading shift"**: The $\mathbb Z[q,q^{-1}]$-action by grading shift in the KLR Grothendieck group is exactly $[M\langle 1\rangle] = q[M]$ — correct, just terse.

## Severity

**One major error**: the explicit $E$- and $F$-action formulas on the weight basis in §4 line 685 are inconsistent with the $[E,F]$ relation stated in §2. This is a content-bug a careful reader will trip over (verifiable by direct computation on $V_1$). The fix is a one-line swap of which $(n\pm k)/2$ each coefficient uses, plus restoring a missing "+1" on the $F$ coefficient.

The remaining issues are normalization-convention nits (R-matrix overall factor, Hopf-link Jones normalization, KZ exponential constant) and one wording problem in the bialgebra-inspector caption. The Hopf-algebra axioms, Drinfeld–Jimbo relations, R-matrix entries (up to overall scalar), Yang–Baxter, classical-limit derivation, quantum Clebsch–Gordan, q-dimension, Reshetikhin–Turaev functor structure, KLR categorification, and Drinfeld–Kohno are all correctly stated.
