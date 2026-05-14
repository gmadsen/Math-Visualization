# operator-algebras — math correctness audit (2026-05)

**Section:** Analysis

## Verified claims

### §1 From a space to its algebra of functions

- $C(X) = \{f\colon X\to\mathbb{C}\text{ continuous}\}$ for compact Hausdorff $X$ is a unital commutative Banach $*$-algebra under sup norm with $f^* = \overline f$ (lines 328–332). Standard.
- The pointwise identity $|\overline{f(x)} f(x)| = |f(x)|^2$ giving $\|f^* f\|_\infty = \|f\|_\infty^2$ (lines 334–335). Standard derivation of the C*-identity for $C(X)$.
- Banach–Stone (line 341): two compact Hausdorff $X, Y$ are homeomorphic iff $C(X)$ and $C(Y)$ are isometrically isomorphic as Banach spaces. Correct (Banach–Stone, 1932/37).

### §2 Banach $*$-algebras and $C^*$-algebras

- $*$-algebra axioms (lines 348–352): conjugate linearity, anti-multiplicativity $(ab)^* = b^*a^*$, involutivity. Standard.
- Banach $*$-algebra: complete submultiplicative norm with $\|a^*\|=\|a\|$. C*-algebra: Banach $*$-algebra with $\|a^*a\| = \|a\|^2$ (lines 353–354). Standard.
- C*-norm uniqueness claim (line 355): "only one norm on a given $*$-algebra can ever satisfy [the C*-identity]". Correct (since $\|a\|^2 = \|a^*a\| = r(a^*a)$, and the spectral radius is purely algebraic on a Banach algebra; combined with the spectral-radius formula $r(b) = \lim\|b^n\|^{1/n}$ this pins down the C*-norm).
- Redundancy of $\|a^*\|=\|a\|$ given the C*-identity (line 355): the C*-identity gives $\|a\|^2 = \|a^*a\| \le \|a^*\|\|a\|$, so $\|a\| \le \|a^*\|$; symmetry yields equality. Correct standard argument.
- Examples table (lines 358–369): all correct standard $C^*$-algebras. $C(X)$ unital iff $X$ compact; $C_0(X)$ non-unital unless $X$ compact; $M_n(\mathbb{C})$ commutative iff $n=1$; $B(H)$ commutative iff $\dim H = 1$; $K(H)$ a closed two-sided ideal of $B(H)$; Calkin algebra $B(H)/K(H)$; $C^*(G), C^*_r(G)$ commutative iff $G$ abelian. All correct.
- Special elements (lines 374–378): self-adjoint, normal, unitary, positive, projection. Definitions and characterizations all standard and correct. "Spectrum is real" (self-adjoint), "spectrum lies in $\mathbb T$" (unitary), "spectrum $\subseteq[0,\infty)$" (positive normal) all correct.
- Automatic contractivity / isometric-on-injective for $*$-homomorphisms between $C^*$-algebras (line 382). Correct standard fact (uses spectral radius + spectral permanence).
- Note on GNS embedding (line 384): every $C^*$-algebra embeds isometrically into $B(H)$. Correct (noncommutative Gelfand–Naimark).

### §3 Spectrum in Banach algebras

- Spectrum definition $\sigma(a) = \{\lambda : a-\lambda\cdot 1\text{ not invertible}\}$ (line 418). Standard.
- Three foundational facts (lines 421–423):
  - $\sigma(a)$ non-empty compact subset of closed disk radius $\|a\|$. Correct.
  - Resolvent $\lambda\mapsto(a-\lambda)^{-1}$ is holomorphic $A$-valued on $\rho(a)$. Correct.
  - Spectral radius formula $r(a) = \lim\|a^n\|^{1/n}$, attributed to Gelfand 1941. Correct attribution.
- Riesz–Dunford holomorphic functional calculus (lines 427–429): $f(a) = (2\pi i)^{-1}\oint_\Gamma f(\lambda)(\lambda-a)^{-1}d\lambda$, satisfies spectral mapping $\sigma(f(a)) = f(\sigma(a))$ and is multiplicative. Correct.
- Note (line 431): $r(a) < \|a\|$ possible in general Banach algebra; nilpotent $N = \begin{pmatrix}0&1\\0&0\end{pmatrix}$ has $\|N\|=1$ (operator norm), $N^2=0$, so $r(N) = 0$. Correct.
- "On a $C^*$-algebra one gets $r(a) = \|a\|$ for every normal $a$" (line 431). Correct (proof: $\|a^{2^n}\| = \|a\|^{2^n}$ for normal $a$ via repeated C*-identity).
- §3 widget computes eigenvalues of 2×2 (quadratic formula) and 3×3 (Durand–Kerner) complex matrices (lines 437, 506–676). Spot-checked: characteristic polynomial of $A = \begin{pmatrix}a&b\\c&d\end{pmatrix}$ is $\lambda^2 - (\text{tr})\lambda + \det = 0$, code uses `roots2(C.scale(tr,-1), det)` correctly (passing $-\text{tr}$ as the linear coefficient in $x^2 + bx + c$). 3×3: characteristic poly $\lambda^3 - c_2\lambda^2 + c_1\lambda - c_0$ where $c_2 = \text{tr}$, $c_1 = $ sum of 2×2 principal minors, $c_0 = \det$; the code's `c1 = m1+m2+m3` is the sum of all three principal 2×2 minors (lines 568–571). Correct. Diagnostics for self-adjoint / normal / unitary correctly compute via conjugate-transpose comparison.

### §4 Continuous functional calculus

- Continuous functional calculus statement (lines 473–475): for normal $a$ in unital $C^*$-algebra $A$, there is a contractive $*$-hom $\Phi_a\colon C(\sigma(a))\to A$, $f\mapsto f(a)$, isometric onto $C^*(a,1)$. Correct.
- "Why normal is the right hypothesis" note (line 477): if $a$ commutes with $a^*$, the unital $*$-subalgebra it generates is commutative; Gelfand duality identifies it with $C(Y)$, then characters of $C^*(a,1)$ identify $Y \cong \sigma(a)$. Correct standard derivation.
- Square root of positive (line 481), absolute value $|a| := \sqrt{a^*a}$ (line 482), polar decomposition $a = v|a|$ with $v$ partial isometry (in $B(H)$ or any vN algebra) (line 483), Borel functional calculus / spectral projections $\chi_E(a)$ (line 484). All standard, correct.

### §5 Characters and the Gelfand spectrum

- Character definition $\varphi\colon A\to\mathbb{C}$, multiplicative, $\varphi(1)=1$ (lines 684–685). Standard.
- Maximal-ideal correspondence (line 686): kernel is a maximal ideal of codim 1; in commutative Banach setting every maximal ideal arises uniquely. Reason: $A/\mathfrak{m} \cong \mathbb{C}$ via Gelfand–Mazur (a complex Banach division algebra is $\mathbb{C}$). Correct.
- Character bounds (line 690): each character continuous with $\|\varphi\|\le 1$, since $\varphi(a)\in\sigma(a)\Rightarrow|\varphi(a)|\le r(a)\le\|a\|$. Correct.
- Spectrum-as-character-image (line 691): $\sigma(a) = \{\varphi(a):\varphi\in\hat A\}$ in commutative case. Correct.
- $\hat A$ compact Hausdorff (line 698): Banach–Alaoglu + closedness of multiplicativity under weak-$*$ convergence. Correct.
- Examples (lines 702–705): $\hat{\mathbb{C}^n}$ = $n$ coordinate projections; $\hat{C(X)} \cong X$ for compact Hausdorff $X$ via $\mathrm{ev}_x$; $\hat{\ell^1(\mathbb{Z})} = \mathbb{T}$ via $\varphi_z((a_n)) = \sum a_n z^n$ (Fourier transform); $\hat{A(\overline{\mathbb{D}})} = \overline{\mathbb{D}}$ for the disk algebra. All correct standard examples.

### §6 The Gelfand transform

- Gelfand transform $\Gamma\colon A\to C(\hat A)$, $\Gamma(a)(\varphi) = \varphi(a)$ (line 874). Standard.
- Properties (lines 877–879): unital algebra hom, contractive, $\|\Gamma(a)\|_\infty = r(a)$. Correct.
- Failure modes: kernel = Jacobson radical $\bigcap_\varphi\ker\varphi$; isometry fails iff $r(a) < \|a\|$ for some $a$ (line 882). Correct (Jacobson radical of a commutative Banach algebra equals the intersection of maximal ideals = intersection of character kernels).
- Commutative Gelfand–Naimark (line 884): for commutative unital $C^*$-algebra, $\Gamma$ is an isometric $*$-isomorphism onto $C(\hat A)$. Correct (Gelfand–Naimark 1943 attribution).
- Two-step proof (lines 887–889): characters preserve $*$ + Stone–Weierstrass density of the image, then C*-identity promotes to isometry. Standard outline. (See "Wrong / dubious" below for the subtle circularity in the way "characters preserve *" is justified.)

### §7 Gelfand duality as an equivalence of categories

- Functor pair (line 1083): $\mathsf{CHaus} \rightleftarrows \mathsf{cCAlg}_1^{\mathrm{op}}$ via $C(-)$ and $\hat{(-)}$; arrow reversal $\phi^*(f) = f\circ\phi$. Correct.
- Two unit/counit isomorphisms $X \cong \hat{C(X)}$ via $\mathrm{ev}_x$, and $A \cong C(\hat A)$ via $\Gamma$ (lines 1088–1089). Correct.
- Equivalence theorem (line 1092). Correct.
- Functoriality table (lines 1111–1114): surjective $\phi$ ↔ injective $\phi^*$; closed embedding ↔ surjective $\phi^*$ with kernel = ideal of vanishing functions; products ↔ tensor products $C(X)\otimes C(Y) = C(X\times Y)$ ("every reasonable cross-norm agrees on commutative $C^*$-algebras" — correct since commutative algebras are nuclear and min = max tensor norms agree); one-point compactification ↔ unitization, giving the locally-compact non-unital duality. All correct.
- §7 widget (lines 1140–1212): collapse $Y\to\{*\}$ becomes diagonal embedding $\mathbb{C}\hookrightarrow\mathbb{C}^3$; closed inclusion $\{1,2\}\hookrightarrow\{1,2,3\}$ becomes restriction $\mathbb{C}^3\twoheadrightarrow\mathbb{C}^2$ with kernel $\{(0,0,c)\}$; degree-2 covering $z\mapsto z^2$ on $\mathbb{T}$ becomes $f\mapsto f\circ\phi$ with image = even Fourier modes (i.e., $\hat g(2k+1)=0$). All three computations correct.

### §8 The noncommutative turn

- $M_n(\mathbb{C})$ has no characters for $n\ge 2$ because it is simple (line 1235). Correct.
- Translation table (lines 1245–1253): commutative concept ↔ $C^*$-algebraic counterpart. All standard dictionary entries (Gelfand, Serre–Swan, K-theory, Connes cyclic cohomology, spectral triples). Correct.
- Examples (lines 1259–1263): group $C^*$-algebras (commutative iff $G$ abelian; in that case $\hat{C^*(G)} = \hat G$ Pontryagin dual); Calkin algebra $B(H)/K(H)$ (Brown–Douglas–Fillmore home); AF algebras classified by ordered $K_0$ (Elliott); Cuntz algebras $\mathcal{O}_n$ generated by isometries $s_1,\ldots,s_n$ with $\sum s_i s_i^* = 1$ (the "isometries" qualifier covers $s_i^*s_i = 1$ implicitly; full Cuntz relations require both $s_i^*s_i = 1$ and $\sum s_is_i^* = 1$ — slightly under-stated but recoverable from "isometries"); foliation algebras (Connes). All correct.
- Noncommutative torus $A_\theta$ definition (line 1268): universal $C^*$-algebra generated by unitaries $u, v$ with $vu = e^{2\pi i\theta} uv$. Correct.
- $A_0 \cong C(\mathbb{T}^2)$ (commutative case); $\theta$ irrational gives simple algebra with unique trace and no characters (line 1269). Correct.
- §8 widget (lines 1304–1346):
  - $\theta = 0$: commutative, $A_0 = C(\mathbb{T}^2)$, classical spectrum $\mathbb{T}^2$. ✓
  - $\theta = p/q$ rational, $\gcd(p,q)=1$: "$A_{p/q}$ = sections of an $M_q$-bundle over $\mathbb{T}^2$" with center $\cong C(\mathbb{T}^2)$. Correct: $A_{p/q}$ is $M_q$-Azumaya over $\mathbb{T}^2$ when $\gcd(p,q)=1$, with center $\cong C(\mathbb{T}^2)$ (the "ordinary spectrum = $\mathbb{T}^2$ with multiplicity" annotation matches).
  - $\theta$ irrational: simple, unique trace, no characters; "$K_0(A_\theta) = \mathbb{Z} + \theta\mathbb{Z} \subset \mathbb{R}$ (Pimsner–Voiculescu)" — strictly speaking $K_0(A_\theta) \cong \mathbb{Z}^2$ as an abstract group; the displayed expression is the IMAGE of $K_0$ under the trace-pairing $\tau_*\colon K_0(A_\theta)\to\mathbb{R}$, $\tau_*([1])=1$, $\tau_*([\text{Rieffel projection}])=\theta$. The page's annotation "as an ordered subgroup of $\mathbb{R}$" makes this identification (the trace-image is the ordered $K_0$ in the Elliott picture). Acceptable shorthand. Pimsner–Voiculescu attribution correct.

### §9 Von Neumann algebras and the double commutant

- vN algebra definition (line 1359): unital $*$-subalgebra of $B(H)$, WOT-closed; equivalently $M = M''$. Correct (von Neumann 1929 bicommutant theorem).
- Double commutant theorem statement (line 1361): for unital $*$-subalgebra $M\subseteq B(H)$, $\overline M^{\text{SOT}} = \overline M^{\text{WOT}} = M''$. Correct (the unital hypothesis ensures non-degeneracy on $H$, which is what the bicommutant theorem actually requires).
- "Norm-closure in general strictly smaller" / "von Neumann contains spectral projections of normal elements" (line 1361). Correct.
- Examples (line 1363): $B(H)$, $L^\infty(X,\mu)$ acting on $L^2(X,\mu)$ as multiplication (prototype of abelian vN algebra), group vN $L(G) = (\lambda(\mathbb{C}G))''$, $M_n(\mathbb{C})$. $K(H)$ is a $C^*$-algebra but not vN (since $\overline{K(H)}^{\text{WOT}} = B(H)$). All correct.
- §9 widget (lines 1401–1433) computes $M, M', M''$ for three subalgebras of $M_3(\mathbb{C})$:
  - **Diagonal** subalgebra: $M$ = diag matrices, dim 3. Then $M' = M$ (maximal abelian), $M'' = M$. Correct.
  - **$\mathbb{C}\oplus M_2$ block**: $M = \mathbb{C}\cdot 1_{\langle e_1\rangle} \oplus M_2(\mathbb{C})_{\langle e_2,e_3\rangle}$, dim 5. Then $M' = $ scalars on each block = $\mathbb{C}\oplus\mathbb{C}$, dim 2. $M'' = M$. Correct.
  - **Scalars $\mathbb{C}\cdot 1$**: $M' = M_3(\mathbb{C})$ (everything commutes with the identity), dim 9; $M'' = $ centre of $M_3 = \mathbb{C}\cdot 1$, dim 1. Correct.

### §10 Factors and type classification

- Factor definition $Z(M) = M\cap M' = \mathbb{C}\cdot 1$ (line 1441). Direct integral decomposition into factors. Correct.
- Type classification (lines 1444–1448):
  - Type $\mathrm{I}_n$ ($n<\infty$): $M\cong M_n(\mathbb{C})$. Projection lattice has dimensions $\{0,1,\ldots,n\}$. Correct.
  - Type $\mathrm{I}_\infty$: $M\cong B(H)$ for $\dim H = \infty$. Has minimal projections (rank-one), semi-finite trace. Correct.
  - Type $\mathrm{II}_1$: faithful finite normal trace $\tau$, $\tau(1)=1$, no minimal projections, projection trace fills $[0,1]$. Hyperfinite II$_1$ factor $\mathcal{R}$ unique up to iso, arises as $(\bigotimes_n M_2(\mathbb{C}))''$. Correct.
  - Type $\mathrm{II}_\infty$: $\mathcal{R}\,\bar\otimes\,B(H)$, semi-finite trace unbounded. Correct.
  - Type $\mathrm{III}$: no semi-finite trace; every nonzero projection is infinite. QFT local algebras generically III$_1$. Correct.
- §10 widget (lines 1483–1525) reproduces the projection-dimension lattice for each type and the standard prototypes (Powers factors $R_\lambda$, free group factors $L(F_n)$). All correct.

### §11 Murray–von Neumann equivalence and dimension

- MvN equivalence: $p\sim q$ iff exists partial isometry $v\in M$ with $v^*v = p$, $vv^* = q$ (lines 1532–1533). Standard. The geometric description (isometry from range of $p$ onto range of $q$, vanishing on the orthogonal complement) is correct.
- Subequivalence on a factor (line 1534): $p\preceq q$ iff $p\sim q'\le q$ — total order on a factor. Correct (Murray–von Neumann comparison theorem).
- Dimension function on II$_1$: $d(p) = \tau(p)$ takes every value in $[0,1]$ (line 1535). Correct.
- §11 widget (lines 1553–1579): two wedge-disks of fraction $d = \tau(p) = \tau(q)$, partial isometry $v$ between them with $v^*v = p$, $vv^* = q$. Visualization correct.

### §12 Positive elements

- Positivity: $a\ge 0$ iff $a = b^*b$ iff $a = a^*$ with $\sigma(a)\subseteq[0,\infty)$ (line 1587). Correct equivalences.
- $A_+$ closed cone, induces partial order (Löwner order in $B(H)$, pointwise in $C(X)$). Correct.
- State definition: positive linear functional with $\varphi(1) = 1$ (line 1589). Riesz–Markov identification with Borel probability measures on $X$ for $A = C(X)$. Correct.
- State space $S(A)$ weak-$*$ compact convex; pure states = extreme points play "noncommutative point" role. Correct (Krein–Milman).
- GNS construction reference + universal embedding $A\hookrightarrow B(H)$ via direct sum over states. Correct.

### §13 States and pure states

- State definition repeated (line 1608). Correct.
- $S(A)$ weak-$*$ closed convex compact in unit ball of $A^*$. Correct.
- Riesz–Markov for $A = C(X)$: states = Borel probability measures (line 1608). Correct.
- Pure states = extreme points; for $A = C(X)$, pure states = point evaluations $\mathrm{ev}_x$ = Dirac measures (line 1610). Correct.
- Krein–Milman: $S(A) = \overline{\text{conv}}(\partial_e S(A))$. Correct.
- §13 widget (lines 1644–1681): state space of $C(\{1,2,3\})$ as the probability simplex $\Delta^2\subset\mathbb{R}^3$; vertices = $\delta_1,\delta_2,\delta_3 = $ pure states. Pure-state detection via $p_i > 0.98$ proxy is a UI threshold (a pure state has exactly one $p_i = 1$, but the slider granularity makes the proxy reasonable for the demo). Math correct.

### §14 GNS construction

- Sesquilinear form $\langle a, b\rangle_\omega := \omega(b^*a)$ (line 1690). Standard convention (linear in first slot).
- $N_\omega = \{a : \omega(a^*a) = 0\}$ is a closed left ideal (line 1691). Correct (proof: Cauchy–Schwarz applied to $\omega(\cdot,\cdot)$ shows $N_\omega = \{a : \omega(b^*a) = 0\,\forall b\}$, which is a left ideal).
- Quotient $A/N_\omega$ inherits inner product; complete to $H_\omega$; left multiplication action $\pi_\omega$. Correct standard construction.
- "Every cyclic representation arises this way (up to unitary equivalence)" + universal representation embedding $A\hookrightarrow B(H)$ via direct sum over states (line 1693). Correct (noncommutative Gelfand–Naimark, 1943 / 1947).
- §14 widget (lines 1722–1758) computes GNS for three states on $M_2(\mathbb{C})$:
  - **Tracial state $\omega(a) = \tfrac12\tr(a)$**: faithful (so $N_\omega = 0$); $H_\omega = M_2(\mathbb{C})$ with the Hilbert–Schmidt inner product, dim 4; cyclic vector $\Omega_\omega = I/\sqrt{2}$ (normalization: $\langle I/\sqrt 2, I/\sqrt 2\rangle = \tfrac12\tr(I^*I)/2 \cdot 2 = $ — let's check: $\langle a, a\rangle_\omega = \omega(a^*a) = \tfrac12\tr(a^*a)$, so $\langle I/\sqrt 2, I/\sqrt 2\rangle = \tfrac12\cdot\tfrac12\tr(I) = \tfrac12$. Hmm, not 1.) — see "Wrong / dubious" below.
  - **Pure vector state $\omega_e(a) = \langle ae, e\rangle$ for unit $e$**: $N_\omega = \{a : ae = 0\}$; $H_\omega = M_2\cdot e \cong \mathbb{C}^2$; $\pi_\omega$ = defining (irreducible) rep; $\Omega_\omega = e$. Correct (up to vector-state vs state-as-positive-functional convention).
  - **Mixed state $\omega = \tfrac12\omega_{e_1} + \tfrac12\omega_{e_2}$**: equals $\tfrac12\tr$ on $M_2$ since $e_1, e_2$ form an orthonormal basis. GNS gives $\mathbb{C}^2\oplus\mathbb{C}^2$ = "id $\oplus$ id" with $\Omega_\omega = (e_1, e_2)/\sqrt 2$. Correct.
  - The note "in $M_2$ this mixture happens to equal $\tfrac12\tr$ but its GNS rep is distinct from the tracial one ... they differ by a unitary equivalence" (line 1751) is **internally contradictory**: if $\omega = \tfrac12\tr$ as a functional on $M_2$, the GNS construction is functorial in the state, so the GNS reps are unitarily equivalent (not "distinct"). Both reps have dim 4 with $\pi$ = left-regular rep, decomposing as 2 copies of the defining rep. The "distinct ... differ by a unitary equivalence" wording is self-contradictory. See "Wrong / dubious" below.

### §15 Approximate units and amenability

- Approximate unit definition (lines 1773–1778): increasing net of positive contractions with $e_\lambda a \to a$ and $a e_\lambda \to a$. Correct.
- Existence: every $C^*$-algebra has one. Correct (standard construction via positive cone).
- Concrete examples (line 1779): for $C_0(X)$, compactly supported bumps; for $K(H)$, finite-rank projections onto an increasing chain. Correct.
- Nuclearity (line 1781): identity factors approximately through matrix algebras via cp maps. Correct definition (CPAP / completely positive approximation property).
- "Discrete group $G$ amenable iff $C^*_r(G)$ is nuclear iff $L(G)$ hyperfinite" (line 1781). Correct (Lance, Connes).
- §15 widget (lines 1798–1844) plots smooth-step bump approximate unit on $\mathbb{R}$ vs target $f(x) = e^{-x^2/8} \in C_0(\mathbb{R})$, with sup-norm error decreasing to zero. Correct visualization.

### §16 The Grothendieck parallel

- Side-by-side table (lines 1858–1864): all correct entries.
  - $\mathrm{Spec}\,R$ = primes with Zariski topology (correct, distinguishing it from the "maximal spectrum" $\mathrm{Specm}$).
  - "Compact Hausdorff (always)" for $\hat A$ vs "quasi-compact, $T_0$, but generally not Hausdorff" for $\mathrm{Spec}\,R$. Correct.
  - "$A \cong C(\hat A)$ vs $R \cong \Gamma(\mathrm{Spec}\,R, \mathcal{O})$" — schemes need a structure sheaf. Correct.
- Three honest differences (lines 1869–1872): no generic point in $\hat{C(X)}$ (analytic; Stone–Weierstrass blocks landing in $\mathbb{C}(x)$); schemes need a structure sheaf (good example: cofinite topology on $\mathrm{Spec}\,\mathbb{Z}$); analytic data lets you go noncommutative cleanly. All correct in spirit.
- §16 widget compares $\hat{C(\{1,2,3\})}$ to $\mathrm{Spec}\,\mathbb{Z}$ (closed primes + generic $(0)$) and $\hat{C(\mathbb{T})}$ to $\mathrm{Spec}\,\mathbb{C}[x]$ (closed points $(x-a)$ for $a\in\mathbb{C}$ + generic $(0) = \mathbb{A}^1_\mathbb{C}$). Correct.

### Quiz bank — verified claims (cross-checked against prose)

- **`cstar-basics` v1**: C*-identity $\|a^*a\| = \|a\|^2$ (Q1); self-adjoints and unitaries are normal (Q2); $\|\mathrm{diag}(3,-4)\| = 4$ via spectral radius (Q3). All correct.
- **`banach-spectrum` v1**: spectrum non-empty compact bounded by $\|a\|$ (Q1); $r(N) = 0$ for the nilpotent (Q2); resolvent holomorphic (Q3). All correct, including the resolvent identity argument in the explanation.
- **`banach-spectrum` hard**: disk-algebra spectrum $\sigma(z) = \overline{\mathbb{D}}$, $r = \|\cdot\| = 1$ (Q1); $r(\delta_1) = 1$ in $\ell^1(\mathbb{Z})$ (Q2); spectral-radius-formula content (Q3). All correct.
- **`spectrum-of-element` v1**: spectrum properties (Q1); $r(a) = \|a\|$ for self-adjoint via C*-identity (Q2); CFC $C(\sigma(a))\cong C^*(a,1)$ (Q3). Correct.
- **`spectrum-of-element` hard**: spectral permanence $\sigma_B(b) = \sigma_A(b)$ for $C^*$-subalgebras (Q1); unitary norm $\|u\| = 1$ (Q2); $b = \sqrt{1-a^2}$ self-adjoint positive with $a^2 + b^2 = 1$ (Q3). Correct.
- **`positive-elements` v1**: positivity ↔ self-adjoint with $\sigma\subseteq[0,\infty)$ (Q1); pointwise order on $C(X)$ (Q2); $\mathrm{diag}(2,-1)$ has 1 eigenvalue in $[0,\infty)$ (Q3). Correct.
- **`positive-elements` hard**: $\mathrm{diag}(1,-1)$ self-adjoint not positive (Q1); $\|a_-\| = 4$ for $a = \mathrm{diag}(3,-4)$ via $a_- = \mathrm{diag}(0,4)$ (Q2); fourth equivalence option (norm $\le 1$) is FALSE — $-\tfrac12\cdot 1$ counterexample (Q3). All correct.
- **`gelfand-duality-oa` v1**: contravariant equivalence $\mathrm{cCAlg}_1 \simeq \mathrm{CHaus}^{\mathrm{op}}$ (Q1); $\chi(a)\in\sigma(a)$ (Q2); $|\hat{C(\{p_1,p_2,p_3\})}| = 3$ (Q3). Correct.
- **`gelfand-duality-oa` hard**: $\hat{C([0,1])} \cong [0,1]$ via evaluation; non-unital → $C_0(X)$ for locally compact $X$; $\|\hat a\|_\sup = 1$. Correct.
- **`von-neumann-and-nc` v1**: pure states as noncommutative points (Q1); $A_\theta$ irrational has no characters because $[u,v]\ne 0$ (Q2); $e^{2\pi i/4} = i$ (Q3). Correct.
- **`von-neumann-and-nc` hard**: $A_\theta$ simple via unique-trace argument (Q1); $\mathrm{Re}(e^{2\pi i/3}) = -1/2$ (Q2); points correspond to characters/pure states NOT to two-sided ideals (Q3). Correct.
- **`von-neumann-algebras` v1**: $M = M''$ characterization (Q1); commutant definition (Q2); $\dim S' = 2$ for $S = \{\mathrm{diag}(1,2)\}\subset M_2$ (Q3 — correct: commutant of a non-degenerate diagonal is the diagonal subalgebra, dim 2). Correct.
- **`von-neumann-algebras` hard**: Q1 multi-select on topology equivalences for convex bounded subsets — WOT, ultraweak, and strong-$*$ all coincide with SOT for closure of convex sets (Kaplansky density). Correct. Q2 widget computes $M''$ for the block subalgebra $\{\mathrm{diag}(a,a,b)\}$ in $M_3$: $M' \cong M_2(\mathbb{C})\oplus\mathbb{C}$ on the $\{e_1,e_2\}\oplus\{e_3\}$ split, so $M''\cong\mathbb{C}\oplus\mathbb{C} = M$. Correct. Q3 norm-closed vs WOT-closed distinction. Correct.
- **`factors-types` v1**: factor definition $Z(M) = \mathbb{C}$ (Q1); matching of types to standard examples (Q2 — $\mathrm{I}_n \leftrightarrow M_n$, $\mathrm{I}_\infty \leftrightarrow B(H)$, $\mathrm{II}_1 \leftrightarrow$ hyperfinite $R$, $\mathrm{III} \leftrightarrow$ Powers; correct); minimal-projection + trace-existence (Q3). Correct.
- **`factors-types` hard**: Connes spectrum $S(M)$ classification (Q1 — see "Wrong / dubious"); $L(\Gamma)$ for ICC group $\Gamma$ is II$_1$ factor (Q2); existence of comparison theorem + semifinite trace as classification engine (Q3). All correct except the III$_0$ S(M) detail.
- **`murray-vn-equivalence` v1**: partial isometry definition of $\sim$ (Q1); rank-2 = rank-2 ⇒ equivalent in $M_4$ (Q2); $d(p) = \tau(p)\in[0,1]$ on II$_1$ (Q3). Correct.
- **`murray-vn-equivalence` hard**: ordering argument (Q1); range $[0,1]$ in hyperfinite II$_1$ via SOT closure (Q2); continuity + range $[0,1]$ special to II$_1$ (Q3). All correct.
- **`states-pure-states` v1**: state = positive normalized linear functional (Q1); pure states = extreme points (Q2); $\tfrac12\tr\begin{pmatrix}3&i\\-i&5\end{pmatrix} = 4$ (Q3). Correct.
- **`states-pure-states` hard**: pure ↔ irreducible GNS (Q1); pure $\phi_\rho$ on $M_2$ with $\rho = \mathrm{diag}(1,0)$ gives $\phi_\rho(A) = A_{11} = 7$ (Q2); Riesz–Markov gives Borel probability measures, pure ↔ Dirac mass (Q3). Correct.
- **`gns-construction` v1**: ordering of GNS steps (Q1); $\dim H_\tau$ of normalized trace on $M_n$ (Q2 — see "Wrong / dubious" below); cyclic vector property (Q3). The dim-$H_\tau$ question has an `n` vs $n=3$ ambiguity.
- **`gns-construction` hard**: GNS properties multi-select (Q1: $*$-hom + cyclic always, irreducible iff pure, NOT always faithful); $\dim H_\chi = 1$ for character $\chi$ on $C(X)$ (Q2 — correct; $N_\chi = \{f : f(x) = 0\}$ codim 1); universal rep faithful + isometric (Q3). All correct.
- **`approximate-units-amenability` v1**: definition (Q1); $\|e_n\|_\infty = 1$ for $\chi_{\{1,\ldots,n\}}\in c_0$ (Q2); role in non-unital theory (Q3). Correct.
- **`approximate-units-amenability` hard**: $C^*_r(F_2)$ NOT nuclear because $F_2$ non-amenable (Q1); Connes/Haagerup amenability = nuclearity for $C^*$-algebras (Q2); $\lim\|e_n f - f\|_\infty = 0$ for $f(k) = 1/k$ in $c_0$ (Q3). All correct.

## Wrong / dubious claims

### Major

- **§14 GNS-formula sign/convention slip (line 1692)**. With the bracket defined at line 1690 as $\langle a, b\rangle_\omega := \omega(b^*a)$ (linear in the first slot $a$), the reconstruction formula
  $$\omega(a) = \langle\Omega_\omega, \pi_\omega(a)\Omega_\omega\rangle_\omega$$
  computes to
  $$\langle 1,\, a\rangle_\omega = \omega(a^*\cdot 1) = \omega(a^*),$$
  not $\omega(a)$. The correct formula given the page's convention is
  $$\omega(a) = \langle \pi_\omega(a)\Omega_\omega, \Omega_\omega\rangle_\omega = \omega(1^*\cdot a) = \omega(a). \checkmark$$
  Either the order of $\Omega$ and $\pi(a)\Omega$ in the inner product needs to be swapped, or the bracket convention at line 1690 needs to be redefined as $\langle a, b\rangle := \omega(a^*b)$ (linear in second slot — the physicists' convention often used in vN/GNS contexts). The same wrong-order formula propagates into:
  - **GNS quiz `gns-construction` ordering Q1, step 5** (line 768 of `quizzes/operator-algebras.json`): same formula $\omega(a) = \langle\Omega_\omega, \pi_\omega(a)\Omega_\omega\rangle$.
  - **§14 widget readout** (line 1756): `ω(a) = ⟨Ω_ω, π_ω(a) Ω_ω⟩`.
  
  Fix: either swap the slots in the formula (consistent with the linear-in-first-slot definition), or change the form definition to $\omega(a^*b)$ (consistent with the formula as written). The latter is the convention used by, e.g., Bratteli–Robinson; the former by Murphy and most modern $C^*$-algebra texts. Either is fine but the page mixes them.

- **§14 GNS widget tracial-state Hilbert space normalization claim (line 1736)**. "$\Omega_\omega = 1/\sqrt 2 \cdot I$" for the tracial state $\omega(a) = \tfrac12\tr(a)$ on $M_2$. Check: with the natural inner product induced by $\omega$ on $A/N_\omega$, $\langle a, a\rangle_\omega = \omega(a^*a) = \tfrac12\tr(a^*a)$. So $\langle I, I\rangle_\omega = \tfrac12\tr(I) = 1$. So $\Omega_\omega = [1+N_\omega]$ already has norm 1; the normalization $I/\sqrt 2$ in the widget is wrong — there is no $\sqrt 2$ to scale out. The correct cyclic vector is $\Omega_\omega = [I]$ with $\|[I]\| = 1$.

- **§14 GNS widget mixed-state self-contradiction (line 1751)**. The readout reads: "In $M_2(\mathbb{C})$ this mixture happens to equal $\tfrac12\tr$, but its GNS rep is **distinct** from the tracial one (Hilbert space has dim 4 either way but the algebras act differently — they **differ by a unitary equivalence**)." The two halves of this sentence contradict each other: GNS is functorial in the state, so equal states (which the page concedes here) give unitarily equivalent representations. Either the rep is "distinct" (wrong, since the states are equal), or it differs "by a unitary equivalence" (which means it is the same rep up to canonical iso — the standard GNS uniqueness statement). The statement should simply read: "In $M_2$ this mixture happens to equal $\tfrac12\tr$, so by GNS uniqueness the mixed-state GNS is unitarily equivalent to the tracial GNS — both decompose as $\pi_{\text{def}}\oplus\pi_{\text{def}}$ on $\mathbb{C}^2\oplus\mathbb{C}^2$."

### Minor

- **`cstar-basics` hard Q1 explanation contradicts its own question text** (lines 46–50 of `quizzes/operator-algebras.json`). Question text claims $\|A^*A\|_F = \sqrt 3$ for $A = \begin{pmatrix}1&1\\0&0\end{pmatrix}$, with $\|A\|_F^2 = 2$, "showing the C*-identity FAILS." But: $A^*A = \begin{pmatrix}1&1\\1&1\end{pmatrix}$ has Frobenius norm $\sqrt{1+1+1+1} = 2$, and $\|A\|_F = \sqrt 2$, so $\|A\|_F^2 = 2 = \|A^*A\|_F$ — for **this** matrix the C*-identity for the Frobenius norm holds. The explanation correctly recomputes $\|A^*A\|_F = \sqrt 4 = 2$ but then doesn't notice that this equals $\|A\|_F^2 = 2$, so doesn't actually witness the claimed failure. The Frobenius norm in general does NOT satisfy the C*-identity (e.g., for $A = e_{12}$ in $M_n$ with $n \ge 3$, $\|A^*A\|_F = \|e_{22}\|_F = 1$ while $\|A\|_F^2 = 1$ — that one also coincides; need a less degenerate example). A genuine counterexample: $A = I_2$ in $M_2$ has $\|A\|_F = \sqrt 2$, $\|A^*A\|_F = \|I_2\|_F = \sqrt 2$, while $\|A\|_F^2 = 2$ — so $\sqrt 2 \ne 2$, witnessing failure. Recommendation: replace the chosen matrix with $A = I_2$ (or any nonzero scalar multiple), or use $A = \mathrm{diag}(1, 2)\in M_2$ where $\|A\|_F = \sqrt 5$ and $\|A^*A\|_F = \|\mathrm{diag}(1,4)\|_F = \sqrt{17} \ne 5$.

- **`gns-construction` v1 Q2** (lines 781–786 of `quizzes/operator-algebras.json`). Question asks: "On $A = M_n(\mathbb{C})$ with the normalized trace ... the GNS Hilbert space $H_\tau$ has dimension equal to:" with answer 9. The question text uses "$M_n$" generically but the answer 9 implicitly requires $n=3$ (since $\dim H_\tau = n^2$). The explanation acknowledges the slip ("choose $n=3$ to get answer 9") but the question prompt should fix $n=3$ explicitly to be unambiguous.

- **`factors-types` hard Q1 explanation, S(M) for III$_0$** (line 574 of `quizzes/operator-algebras.json`). Reads "III$_0$ has $S(M) = \{1\}$." Strictly, the Connes spectrum $S(M)\subseteq[0,\infty)$ for type III contains 0 (since 0 is in the spectrum of every modular operator $\Delta_\varphi$ for type III); the multiplicative-subgroup classification is on $S(M)\cap(0,\infty)$, where:
  - III$_0$: $S(M)\cap(0,\infty) = \{1\}$
  - III$_\lambda$ ($0<\lambda<1$): $S(M)\cap(0,\infty) = \lambda^\mathbb{Z}$
  - III$_1$: $S(M)\cap(0,\infty) = (0,\infty)$
  
  The full $S(M)$ for III$_\lambda$ ($0\le\lambda<1$) includes 0; the page's "$S(M) = \{0\}\cup\lambda^\mathbb{Z}$" for III$_\lambda$ correctly includes 0, but "$S(M) = \{1\}$" for III$_0$ is missing the 0. Convention slip; not a substantive error.

- **§6 footnote 1 has a circular-feeling but ultimately sound argument** (line 888). "If $a = a^*$ in a commutative C*-algebra, then the spectrum is real (because the unital C*-subalgebra generated by $a$ is $C(\sigma(a))$, in which the involution is complex conjugation). So $\varphi(a)\in\sigma(a)\subset\mathbb{R}$." This invokes the continuous functional calculus (§4) which itself rests on commutative Gelfand–Naimark — being applied to subalgebras, where it is admissible by induction on the dimension/complexity of the algebra. Not strictly circular if interpreted as: "applying CFC to the subalgebra $C^*(a, 1)$, which is commutative and where Gelfand has been established at the previous step." The standard cleaner argument (e.g., Murphy §2.1) shows $\sigma(a)\subset\mathbb{R}$ for self-adjoint $a$ in any unital C*-algebra directly from $\|e^{ita}\|^2 = \|e^{-ita}e^{ita}\| = \|1\| = 1$ (so $\sigma(e^{ita})\subset\mathbb{T}$, hence $\sigma(a)\subset\mathbb{R}$ by spectral mapping). The page's argument works if §4 is treated as a free-standing theorem cited from §6, which is the order presented; reader doesn't lose anything but a short proof of self-adjoint $\Rightarrow$ real spectrum at the stage where it's needed.

- **§8 widget rational-$\theta$ description (line 1336)**. "$A_{p/q}$ = sections of an $M_q$-bundle over $\mathbb{T}^2$" lacks the $\gcd(p,q)=1$ qualifier. Strictly: for $\gcd(p,q) = d$, $A_{p/q}$ contains $A_{p/q'} \otimes M_d$ as a subalgebra where $q' = q/d$; the "Azumaya bundle" description requires $\gcd(p,q)=1$. Most readers will assume $p/q$ is in lowest terms but it's worth a parenthetical.

## Underspecified or unverifiable claims

- **§2 "every $*$-hom between $C^*$-algebras is automatically contractive; injective ⇒ isometric"** (line 382). True for *unital* $*$-homs between unital $C^*$-algebras and for $*$-homs between general $C^*$-algebras (using approximate units to extend to unitizations). The page doesn't specify unital, but this works in either case.
- **§7 "every reasonable cross-norm agrees on commutative $C^*$-algebras"** (line 1113). True (commutative $C^*$-algebras are nuclear, so min = max = any cross-norm in between). The "reasonable" qualifier is the standard hedge against pathological norms; reader should know this context.
- **§9 group vN algebra $L(G) = (\lambda(\mathbb{C}G))''\subseteq B(\ell^2(G))$** (line 1363). Correct for discrete $G$; for general locally compact $G$ one uses the integrated form. The page doesn't qualify "discrete" but that's the only setting where $\ell^2(G)$ makes literal sense.
- **§10 widget `(⊗_n M_2)″` notation for hyperfinite II$_1$** (lines 1446, 1478). Implicit: the GNS rep of $\bigotimes_n M_2$ on the trace state, then SOT closure. The bicommutant $(-)''$ presupposes an ambient $B(H)$, which here is the GNS Hilbert space of the unique trace on the algebraic infinite tensor product. Standard notational shorthand; not a math issue.
- **§11 dimension function "continuous"** (line 1535). Continuity is in the SOT/strong topology on projections, not just lattice-theoretically. The page doesn't unpack the topology, which is fine for the descriptive level.

## Severity

**minor errors.**

The substantive math content is correct throughout: Banach-algebra spectral theory, the C*-identity and uniqueness of the C*-norm, characters/Gelfand–Mazur/spectrum of an element, the Gelfand transform and commutative Gelfand–Naimark, the Gelfand-duality equivalence of categories, the noncommutative dictionary, the noncommutative torus example with $K_0$ pairing, the von Neumann bicommutant theorem, the Murray–vN type classification (I$_n$ / I$_\infty$ / II$_1$ / II$_\infty$ / III), MvN equivalence and the dimension function, positive elements and the partial order, states/pure states/Riesz–Markov, the GNS construction, approximate units/nuclearity/amenability, and the Grothendieck side-by-side comparison.

Issues found:

- **Two §14 GNS widget bugs that propagate into the prose and quiz**: (a) the inner-product slot order in $\omega(a) = \langle\Omega, \pi(a)\Omega\rangle$ is inconsistent with the page's chosen sesquilinear-form convention $\langle a,b\rangle = \omega(b^*a)$ (one slot or the other needs swapping), and (b) the tracial-state cyclic vector $I/\sqrt 2$ is mis-normalized (should be $I$, since $\langle I, I\rangle_\omega = \tfrac12\tr(I) = 1$), and (c) the "distinct rep ... differs by unitary equivalence" sentence about the mixed state is internally contradictory.
- **`cstar-basics` hard Q1**: the chosen matrix $A = \begin{pmatrix}1&1\\0&0\end{pmatrix}$ with the Frobenius norm doesn't actually witness the C*-identity failure (both sides equal 2). Question text's $\sqrt 3$ vs explanation's $\sqrt 4$ contradict.
- **`gns-construction` v1 Q2**: question statement uses "$M_n$" but answer 9 requires fixing $n = 3$; should pin $n$ in the question prompt.
- **`factors-types` hard Q1**: missing 0 in $S(M)$ for III$_0$ (convention slip; not substantively wrong).
- **§8 widget rational-$\theta$ description**: missing $\gcd(p,q) = 1$ qualifier on the Azumaya bundle description (minor, reader-implicit).

None of the prose claims about the underlying mathematics — C*-axioms, vN algebra definition, Murray–vN type classification, GNS construction at the conceptual level, K-theory of $A_\theta$, MvN equivalence, examples like $B(H)$, $L^\infty$, group algebras, AF algebras — contain mathematical errors. The errors are concentrated in two places: the §14 GNS widget (which has three internally inconsistent statements about a single example) and one quiz hard-tier explanation. Both are mechanically correctable without rethinking any of the page's mathematics.
