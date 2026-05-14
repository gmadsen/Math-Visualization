# Math correctness audit — `functional-analysis.html`

Audited 2026-05-14 (read-only). Pedagogy intentionally skipped.
Format per section: **Verified · Wrong/dubious · Underspecified · Severity**.

---

## §1 Normed, Banach, Hilbert (lines 269–410)
- **Verified.**
  - Normed-space axioms (definiteness, absolute homogeneity, triangle) and the metric $d(x,y)=\|x-y\|$.
  - Banach = complete normed; Hilbert = complete inner-product. Sesquilinear convention $\langle x,y\rangle=\overline{\langle y,x\rangle}$ with $\|x\|=\sqrt{\langle x,x\rangle}$ derived from CS.
  - $\ell^p$ and $\ell^\infty$ definitions, completeness via Riesz–Fischer (fast-Cauchy subsequence with $\|f_{n_{k+1}}-f_{n_k}\|_p\le 2^{-k}$, Fatou tail), Minkowski as triangle inequality, Hölder with $1/p+1/q=1$.
  - $L^p(\Omega,\mu)$ definition modulo null functions; $C[a,b]$ Banach under sup norm but not under $L^2$ norm with completion $L^2[a,b]$.
  - Parallelogram law $\|x+y\|^2+\|x-y\|^2=2\|x\|^2+2\|y\|^2$ characterizes inner-product norms (Jordan–von Neumann).
  - Numerical check on $\ell^p$: $x=(1,0,\ldots), y=(0,1,\ldots)$ gives LHS $=2\cdot 2^{2/p}$ and RHS $=4$; equal iff $p=2$. ✓ ($p=2$: LHS $=2\cdot 2^1 = 4$.)
  - Norm-equivalence theorem in finite dim, $\|\cdot\|_\infty\not\sim\|\cdot\|_{L^2}$ on $C[0,1]$.
  - Separability of $\ell^p$ and $L^p[a,b]$ for $1\le p<\infty$, non-separability of $\ell^\infty$. Weierstrass / Stone–Weierstrass density.
  - Enflo (1973) on Banach spaces without Schauder basis.
  - **§1 unit-ball widget**: parametrizes $|c|^p+|s|^p$ with $r=(\cdot)^{-1/p}$ — algebraically gives $|x|^p+|y|^p=1$ correctly. Square for $p=\infty$ matches $\max(|x|,|y|)\le 1$. The $p<1$ branch correctly flags non-convexity / quasi-norm.
- **Wrong/dubious.** None.
- **Underspecified.**
  - "Minkowski is the key inequality behind completeness for $\ell^p$" (line 288) — Minkowski gives the triangle inequality so $\|\cdot\|_p$ is a norm at all; completeness is a separate Riesz–Fischer argument. Wording elision, not a math error.
  - Complex polarization formula at line 426 ($\langle x,y\rangle=\tfrac{1}{4}\sum_{k=0}^3 i^k\|x+i^k y\|^2$) is correct under the page's "linear in first slot" convention — verified by direct expansion using $\langle x,\alpha y\rangle=\bar\alpha\langle x,y\rangle$ and $\sum i^k=0$. The convention itself is left implicit.
- **Severity.** None.

## §2 Hilbert-space geometry (lines 414–745)
- **Verified.**
  - Cauchy–Schwarz, triangle, parallelogram, polarization (real and complex) all standard.
  - Pythagoras $x\perp y\Rightarrow\|x+y\|^2=\|x\|^2+\|y\|^2$.
  - Orthogonal projection onto a closed subspace $M\subset H$: existence, uniqueness, characterization $x-Px\perp M$, $P^2=P$, $P^*=P$, Pythagorean identity $\|x\|^2=\|Px\|^2+\|x-Px\|^2$, splitting $H=M\oplus M^\perp$. Uniqueness via parallelogram on $x-m_1, x-m_2$.
  - Orthonormal basis Fourier expansion $x=\sum\langle x,e_i\rangle e_i$, Parseval $\|x\|^2=\sum|\langle x,e_i\rangle|^2$, Bessel inequality, separable Hilbert $\cong\ell^2$.
  - Gram–Schmidt formula $u_n=v_n-\sum_{k<n}\langle v_n,e_k\rangle e_k$, $e_n=u_n/\|u_n\|$.
  - **§2 GS widget**: `dot`, `sub`, `scale`, `norm` correctly implement 2D arithmetic; `e1=v1/‖v1‖`; `u2=v2−⟨v2,e1⟩e1`, `e2=u2/‖u2‖`; `u3=v3−⟨v3,e1⟩e1−⟨v3,e2⟩e2`, vanishing in $\mathbb{R}^2$ as expected.
  - **§2 projection widget**:
    - `L1` projects onto span($e_1$): $(v_1,0,0)$. ✓
    - `P12` projects onto span($e_1,e_2$): $(v_1,v_2,0)$. ✓
    - Plane $x+y+z=0$: $n=(1,1,1)/\sqrt 3$, $Pv=v-\langle v,n\rangle n$. The code uses $c=\langle v,n\rangle$ and `sub3(v, sc3(n,c))`. ✓
    - Pythagoras + orthogonality readouts ($\langle Pv, v-Pv\rangle = 0$, $\|v\|^2=\|Pv\|^2+\|v-Pv\|^2$) check out.
- **Wrong/dubious.** None.
- **Underspecified.** None.
- **Severity.** None.

## §3 Bounded operators and the operator norm (lines 746–903)
- **Verified.**
  - Three equivalent definitions of operator norm (sup over closed unit ball, sup over $x\ne 0$ of $\|Tx\|/\|x\|$, infimum of Lipschitz constants).
  - Linear: bounded $\iff$ continuous $\iff$ Lipschitz with constant $\|T\|$.
  - $B(X,Y)$ is Banach whenever $Y$ is (uniformity of Cauchy in $\|x\|\le 1$ upgrades pointwise to op-norm convergence).
  - On $\mathbb{R}^n$ with Euclidean norm, $\|T\|=\sigma_{\max}(T)=\sqrt{\lambda_{\max}(T^\top T)}$; for symmetric $T$, $\|T\|=\max|\lambda_i|$.
  - **§3 op-norm widget**: `svd2` computes eigenvalues of $T^\top T$ via the closed-form $\lambda_{1,2}=\mathrm{tr}/2\pm\sqrt{\mathrm{tr}^2/4-\det}$ on the Gram matrix, returns singular values. Sweep search for $\arg\max\|Tu\|$ over unit circle is consistent with $\sigma_1$. Frobenius norm $\sqrt{a^2+b^2+c^2+d^2}$ correct.
- **Wrong/dubious.** None.
- **Underspecified.** None.
- **Severity.** None.

## §4 Bounded linear operators (lines 904–969)
- **Verified.**
  - Bounded $\iff$ continuous $\iff$ continuous at $0$ for linear maps.
  - $X^*=B(X,\mathbb{K})$ Banach, scalars complete.
  - Examples table: unilateral right shift $\|S\|=1$ isometry not surjective ✓; multiplication $\|M_g\|=\|g\|_\infty$ ✓; integral op with $L^2$ kernel HS-bound $\le\|k\|_{L^2(\Omega^2)}$ ✓; differentiation $C^1\to C$ bounded with norm $1$ under $\|f\|_{C^1}=\|f\|_\infty+\|f'\|_\infty$ (verified: $\sin(nx)/n^2$ ratio approaches $1$) ✓; $C\to C$ unbounded ($f_n=\sin(nx)$, $\|f_n'\|_\infty=n\to\infty$) ✓.
  - Isometry, isometric isomorphism standard.
  - $C^*$-identity $\|T^*T\|=\|T\|^2$ on Hilbert space.
  - Self-adjoint / normal / unitary classification with corresponding spectral pictures.
  - On Banach spaces, dual operator $T^*:Y^*\to X^*$ via $(T^*\phi)(x)=\phi(Tx)$, $\|T^*\|=\|T\|$, no $C^*$-identity.
  - Pauli matrices $\sigma_x,\sigma_y,\sigma_z$ self-adjoint, unitary, traceless, spectrum $\{\pm 1\}$, projections $(I\pm\sigma_k)/2$.
- **Wrong/dubious.** None.
- **Underspecified.**
  - "(bounded — because of $C^1$ norm)" is correct only after the $C^1$ norm convention is made explicit; either of the two standard conventions yields op-norm $1$, but the page should ideally pin down which.
- **Severity.** None.

## §5 The adjoint operator (lines 971–1118)
- **Verified.**
  - Adjoint definition $\langle Tx,y\rangle=\langle x,T^*y\rangle$; existence via Riesz applied to $x\mapsto\overline{\langle Tx,y\rangle}$ (conjugate-linear functional).
  - Class table: self-adjoint $T^*=T$ → real spectrum; skew-adjoint $T^*=-T$ → imaginary spectrum; unitary $T^*T=TT^*=I$ → unit-circle spectrum; normal $T^*T=TT^*$ → general.
  - Polar decomposition $T=U|T|$ with $|T|=\sqrt{T^*T}$.
  - Cayley transform $U=(T-i)(T+i)^{-1}$ bijects (densely defined) self-adjoint with unitaries avoiding $1$.
  - **§5 adjoint widget** classification logic for real $2\times 2$:
    - `selfAdj`: $|b-c|<\epsilon$. ✓
    - `skewAdj`: $|a|<\epsilon \wedge |d|<\epsilon \wedge |b+c|<\epsilon$ (so $T^\top=-T$). ✓
    - `normal`: $|b^2-c^2|<\epsilon \wedge |(a-d)(c-b)|<\epsilon$. Direct expansion of $TT^\top$ vs $T^\top T$ confirms these are exactly the conditions for normality of a real $2\times 2$. ✓
    - `unitary`: $|a^2+b^2-1|<\epsilon \wedge |c^2+d^2-1|<\epsilon \wedge |ac+bd|<\epsilon$ (rows orthonormal). ✓
    - Eigenvalue branches (real vs complex pair) standard from $\det(T-\lambda I)=0$.
- **Wrong/dubious.** None.
- **Underspecified.** None.
- **Severity.** None.

## §6 The big four theorems (lines 1119–1170)
- **Verified.**
  - Hahn–Banach (extension form) for sublinear $p$ on real vector space, extension on subspace dominated by $p$ to whole space dominated by $p$. Standard.
  - Norming corollary: every bounded functional on a subspace extends with the same norm; $X^*$ separates points.
  - Hahn–Banach (separation): disjoint convex with $A$ open separable by continuous $\ell$ and $c\in\mathbb{R}$; with $A$ compact and $B$ closed, strict separation.
  - Open Mapping (Banach): surjective bounded linear between Banach spaces is open. Inverse Mapping corollary.
  - Closed Graph: graph closed in $X\times Y$ implies $T$ bounded (Banach domain and codomain).
  - Banach–Steinhaus: pointwise $\sup_\alpha\|T_\alpha x\|<\infty$ on a Banach $X$ ⇒ uniform $\sup_\alpha\|T_\alpha\|<\infty$.
  - Baire-category proof sketch for Banach–Steinhaus: $E_n=\{x:\sup_\alpha\|T_\alpha x\|\le n\}$ closed, union $X$, Baire gives interior, dilation. ✓
- **Wrong/dubious.** None.
- **Underspecified.** None.
- **Severity.** None.

## §7 Compact operators and the spectrum (lines 1172–1326)
- **Verified.**
  - Compact = $T(B_X)$ relatively compact; equivalently bounded sequences have norm-convergent subsequence images.
  - Two-sided ideal in $B(X)$, closure of finite-rank on Hilbert / spaces with approximation property.
  - Examples: integral ops with continuous / $L^2$ kernels (Arzelà–Ascoli, Hilbert–Schmidt). Rellich $H^1[0,1]\hookrightarrow L^2[0,1]$ compact. Dirichlet Laplacian inverse compact.
  - Resolvent set / spectrum definition; $\sigma(T)$ compact non-empty $\subset\{|\lambda|\le\|T\|\}$.
  - Subdivision: point (not injective), continuous (injective, dense range, not closed), residual (injective, range not dense).
  - Riesz–Schauder: $0\in\sigma(T)$, every $\lambda\ne 0$ in $\sigma$ is eigenvalue of finite (geometric) multiplicity, $\sigma$ at most countable with $0$ as only accumulation point.
  - Fredholm alternative: $T-\lambda I$ Fredholm of index $0$, dichotomy bijection / $y\perp\ker(T^*-\bar\lambda I)$.
  - HS: $\|T\|_{HS}^2=\sum_n\|Te_n\|^2=\sum_{m,n}|\langle Te_m,e_n\rangle|^2$. Trace-class $\|T\|_1=\sum s_n(T)$, $\tr(T)=\sum\langle Te_n,e_n\rangle$ basis-independent.
  - Strict inclusions: finite rank ⊊ trace ⊊ HS ⊊ compact ⊊ bounded on infinite-dim Hilbert.
  - **§7 widget**: compact case eigenvalues $1/n$, non-compact $1+1/n$. For compact, $\sum 1/n^2=\pi^2/6$ finite ⇒ HS ✓. For non-compact, accumulation at $1$, not at $0$, so not compact (image of unit ball not relatively compact).
- **Wrong/dubious.**
  - Widget readout for the non-compact branch (line 1311) calls "$T-\lambda I$ for $\lambda$ near 1 has thick spectrum". Sloppy: the spectrum is $\{1+1/n\}\cup\{1\}$, a countable sequence accumulating at $1$. "Thick" overstates it. Wording slip, not a math error.
- **Underspecified.**
  - "$0<\lambda_1<\lambda_2\le\cdots\to\infty$" for Dirichlet Laplacian (line 1182): strictness $\lambda_1<\lambda_2$ requires $\Omega$ connected (Hopf max principle / Krein–Rutman); page does not flag this.
- **Severity.** None.

## §8 The spectral theorem (lines 1327–1398)
- **Verified.**
  - Rayleigh quotient definition; critical points = eigenvectors, critical values = eigenvalues.
  - Finite-dim normal-matrix theorem $A=UDU^*$; self-adjoint case real eigenvalues.
  - $A=\sum\lambda_i v_iv_i^*$ rank-one decomposition.
  - **§8 Jacobi widget**: standard symmetric-eigendecomposition iteration. Off-diagonal element zeroed via $\theta=(a_{qq}-a_{pp})/(2a_{pq})$, $t=\mathrm{sign}(\theta)/(|\theta|+\sqrt{1+\theta^2})$, $c=1/\sqrt{1+t^2}$, $s=tc$ — correct standard formulas. Reconstruction $\sum\lambda_iv_iv_i^\top$ verified by Frobenius residual.
  - Hilbert–Schmidt theorem: compact self-adjoint diagonalizable, $Tx=\sum\lambda_n\langle x,e_n\rangle e_n$.
  - Bounded self-adjoint via projection-valued measure $E$, $T=\int\lambda\,dE(\lambda)$, $f(T)=\int f\,dE$.
  - Spectral measure of $M_g$ on $L^2(X,\mu)$: $E(B)=M_{\mathbf 1_{g^{-1}(B)}}$.
  - Multiplication-operator form: every bounded self-adjoint on separable Hilbert space unitarily equivalent to $M_g$ on $L^2(X,\mu)$ for $\sigma$-finite $(X,\mu)$ and real $g\in L^\infty$.
  - Continuous functional calculus $C(\sigma(T))\to B(H)$, $\overline f(T)=f(T)^*$, $\|f(T)\|=\|f\|_{\sup}$.
  - Gelfand formula $r(T)=\lim\|T^n\|^{1/n}\le\|T\|$; equality $r(T)=\|T\|$ for normal; $\|T\|=\sup_{\|x\|=1}|\langle Tx,x\rangle|$ for self-adjoint.
  - Unbounded self-adjoint vs symmetric, deficiency-index theory mention.
- **Wrong/dubious.**
  - **Courant–Fischer ordering convention is wrong (line 1333).** The page states the ordering "$\lambda_1\ge\lambda_2\ge\cdots$ (by absolute value, with multiplicity)" satisfies
    $\lambda_k=\max_{\dim V=k}\min_{x\in V,\|x\|=1}\langle Tx,x\rangle$.
    The min-max formula gives the $k$-th largest **signed** eigenvalue, not the $k$-th largest by absolute value. Counterexample: $T=\mathrm{diag}(1,-2)$ on $\mathbb{R}^2$. By absolute value the page would label $\lambda_1=-2$. But $\max_{\dim V=1}\min_{x\in V,|x|=1}\langle Tx,x\rangle = \max_v\langle Tv,v\rangle = 1$, not $-2$. The "(by absolute value)" parenthetical inverts the standard convention; either drop it or replace with "by signed value".
  - **`E(B_1\cap B_2)=E(B_1)E(B_2)` (line 1374)**: correct as stated, but the standard PVM property is the more general $E(B_1)E(B_2)=E(B_1\cap B_2)$ (and PVMs are *projection-valued* measures, with $E$ countably additive in the strong operator topology); the page's single equation is right but elides the multiplicativity direction. Minor.
- **Underspecified.**
  - "$f\mapsto f(T)=\int f\,dE$ ... satisfies $\overline f(T)=f(T)^*$ and $\|f(T)\|=\|f\|_{\sup,\sigma(T)}$" — strictly the sup-norm equality is for *normal* $T$ (true here since the page is in the self-adjoint case, but the calculus is being introduced more generally).
- **Severity.** Minor (one ordering-convention error in Courant–Fischer).

## §9 Spectrum classification (lines 1400–1604)
- **Verified.**
  - Three-way decomposition $\sigma(T)=\sigma_p\sqcup\sigma_c\sqcup\sigma_r$ with the standard "fail to be invertible because" criteria. ✓
  - $\sigma_r=\emptyset$ for self-adjoint; proof sketch via $\overline{\mathrm{ran}(T-\lambda)}^\perp=\ker(T-\bar\lambda)=\ker(T-\lambda)$ for real $\lambda$. ✓
  - For compact, spectrum $=\{0\}\cup\sigma_p$ outside $0$. ✓
  - Examples:
    - Multiplication by $x$ on $L^2[0,1]$: $\sigma=[0,1]$, all continuous. ✓ (No eigenvalues since $\{x=\lambda\}$ has measure zero; range is dense — smooth functions vanishing near $\lambda$ are dense — but not closed since $g(x)=x^{1/2}\notin\mathrm{ran}(M_x)$.)
    - Right shift $S$: $\sigma=\overline{D(0,1)}$, $\sigma_p=\emptyset$, $\sigma_c=\{|z|=1\}$, $\sigma_r=$ open unit disk (because $\bar\lambda$ is an eigenvalue of $S^*$). ✓
    - Left shift $S^*$: $\sigma_p=$ open unit disk (eigenvector $(1,\lambda,\lambda^2,\ldots)\in\ell^2$ when $|\lambda|<1$), $\sigma_c=$ unit circle, $\sigma_r=\emptyset$. ✓
    - Pauli $\sigma_z$: $\sigma=\{\pm 1\}$, all point. ✓
  - Duality $\sigma_r(S)\subseteq\overline{\sigma_p(S^*)}$. ✓
  - **§9 spec-classifier widget** classification logic for each operator:
    - `shift-R`: $|\lambda|<1\Rightarrow$ residual; $|\lambda|=1\Rightarrow$ continuous; outside ⇒ resolvent. ✓
    - `shift-L`: $|\lambda|<1\Rightarrow$ point (eigenvector $(1,\lambda,\lambda^2,\ldots)\in\ell^2$); $|\lambda|=1\Rightarrow$ continuous; outside ⇒ resolvent. ✓
    - `mult-x`: $\lambda\notin[0,1]$ or $\mathrm{Im}\,\lambda\ne 0\Rightarrow$ resolvent; $\lambda\in[0,1]\Rightarrow$ continuous. ✓
    - `sigma-z`: $\lambda=\pm 1\Rightarrow$ point; otherwise resolvent. ✓
    - `diag-1n`: $\lambda=1/n$ ⇒ point; $\lambda=0$ ⇒ continuous (in $\sigma$ as accumulation point but not eigenvalue; injective with dense but non-closed range — verified). ✓
- **Wrong/dubious.** None.
- **Underspecified.** None.
- **Severity.** None.

## §10 Duality and Riesz representation (lines 1726–1905)
- **Verified.**
  - $(L^p)^*=L^q$ for $1<p<\infty$, $\sigma$-finite, via $g\mapsto\Lambda_g$, $\Lambda_g(f)=\int fg\,d\mu$, isometric isomorphism.
  - $(L^1)^*=L^\infty$ on $\sigma$-finite; $(L^\infty)^*\supsetneq L^1$ (finitely-additive measures); $L^p$ reflexive and uniformly convex for $1<p<\infty$.
  - Riesz on Hilbert: $\Phi:H\to H^*$, $(\Phi y)(x)=\langle x,y\rangle$, conjugate-linear isometric bijection.
  - Proof sketch using $M=\ker\ell$, $\dim M^\perp=1$, $y=\overline{\ell(z)}z$: verified by direct computation under "linear in first slot" convention.
  - Riesz–Markov–Kakutani: $C_0(X)^*\cong M(X)$ (finite complex regular Borel measures, TV norm), $\mu\mapsto\int\cdot\,d\mu$.
  - Hölder $|\int fg|\le\|f\|_p\|g\|_q$.
  - Reflexivity table values.
  - Weak / weak-* topology definitions.
  - **§10 Fourier-series widget**: $L^2$ partial sums $S_N f$. Coefficient computation $a_k=\frac{1}{\pi}\int f\cos(kx)$, $b_k=\frac{1}{\pi}\int f\sin(kx)$, with $a_0/2$ in expansion (real Fourier convention). $L^2$ norm $\|f\|_{L^2}^2=\pi(a_0^2/2+\sum a_k^2+b_k^2)$ — the standard Parseval identity for these conventions, with $\|S_N-f\|^2_{L^2}=\pi\sum_{k>N}(a_k^2+b_k^2)$. The estimate uses a fixed truncation tail of the actual coefficients, not an upper bound — accurate for the smooth tails seen here. Gibbs $\sim 9\%$ overshoot at jumps standard.
- **Wrong/dubious.** None.
- **Underspecified.**
  - "(L^∞)^* is finitely-additive measures" is informal; the precise (Yosida–Hewitt) statement is that $(L^\infty(\Omega,\mu))^*$ identifies with bounded finitely-additive signed measures absolutely continuous with respect to $\mu$. Standard textbook elision.
- **Severity.** None.

## §11 Riesz representation (theorem section) (lines 1908–1938)
- **Verified.**
  - Hilbert-space Riesz statement, conjugate-linear isometric bijection $H\cong H^*$.
  - $(L^p)^*\cong L^q$ for $1<p<\infty$ via Hölder.
  - Riesz–Markov–Kakutani for $C_0(X)$ on locally compact Hausdorff $X$.
  - Completeness needed for the splitting $H=M\oplus M^\perp$ in the proof — fails without it.
- **Wrong/dubious.** None.
- **Underspecified.** None.
- **Severity.** None.

## §12 Reflexivity (lines 1940–2042)
- **Verified.**
  - $J:X\to X^{**}$, $(Jx)(\ell)=\ell(x)$, isometric by Hahn–Banach.
  - Reflexive iff $J$ surjective.
  - Kakutani: $X$ reflexive iff $B_X$ weakly compact; via Eberlein–Šmulian, equivalent to "every bounded sequence has weakly convergent subsequence" in a Banach space.
  - Direct method in calculus of variations: bounded minimizing sequence + weak limit + weak lower semicontinuity.
  - Reflexivity table values check out.
  - $c_0\hookrightarrow c_0^{**}\cong\ell^\infty$ strict inclusion; $(1,1,1,\ldots)\in\ell^\infty\setminus J(c_0)$. Argument: take $\ell=e_n\in\ell^1$ then "$\ell(c)=\sum\ell_n=1$" forces $c_n=1$ for all $n$, contradicting $c\in c_0$. ✓
  - **§12 widget data**:
    - $\ell^p$ ($p=3$): dual $\ell^{3/2}$ since $1/3+1/q=1\Rightarrow q=3/2$. ✓
    - $c_0^*=\ell^1$, $c_0^{**}=\ell^\infty$. ✓
    - $L^1$ on $\sigma$-finite: dual $L^\infty$, double-dual ⊋ $L^1$. ✓
    - $L^\infty$: dual ⊋ $\ell^1$ (Banach limits etc.) — page note "(consider (0,0,…,0,1,0,…))" is hand-wavy: the standard non-weakly-sequentially-compact example for $\ell^\infty$ is the unit-vector sequence $\delta_n$, no weakly convergent subsequence. The page's $\delta_n$-style example is correct in spirit.
- **Wrong/dubious.** None.
- **Underspecified.** None.
- **Severity.** None.

## §13 Weak and weak-* topologies (lines 2044–2070)
- **Verified.**
  - Weak / weak-* definitions, Banach–Alaoglu statement.
- **Wrong/dubious.** None.
- **Underspecified.**
  - "(on reflexive spaces weak sequential compactness holds)" elides Eberlein–Šmulian: the theorem itself says weakly compact = weakly sequentially compact in any Banach space; the reflexivity is what gives weak compactness of $B_X$ (Kakutani). Wording slip.
- **Severity.** None.

## §14 Banach–Alaoglu (lines 2072–2092)
- **Verified.**
  - Statement: closed unit ball $B_{X^*}$ is weak-$*$ compact.
  - Proof sketch: embed in $\prod_x\overline D_{\|x\|}$, intersection of affine constraints, Tychonoff, closed in product → compact, product topology pulls back to weak-$*$. ✓
  - Metrizability when $X$ separable. ✓
- **Wrong/dubious.** None.
- **Underspecified.** None.
- **Severity.** None.

## §15 Krein–Milman (lines 2094–2109)
- **Verified.**
  - Extreme-point definition: $e=\tfrac{1}{2}(x+y)$ in $K$ ⇒ $x=y=e$.
  - Krein–Milman in locally convex TVS: $K=\overline{\mathrm{conv}}\,\mathrm{ext}(K)$.
  - Examples:
    - $\mathrm{ext}(B_{\ell^1})=\{\pm e_n\}$. ✓
    - $\mathrm{ext}(B_{L^\infty[0,1]})=$ measurable functions of modulus $1$ a.e. ✓ (If $|f|<1$ on positive-measure $E$, write $f\pm\epsilon\mathbf 1_E$ both in unit ball; converse via convexity of unit disk in $\mathbb{C}$.)
    - $B_{L^1[0,1]}$ has no extreme points: any $f$ of unit norm splits as $(g+h)/2$ with $g=2f\mathbf 1_E$, $h=2f\mathbf 1_{E^c}$ for $E\subset\mathrm{supp}\,f$ with $\int_E|f|=1/2$. ✓ Therefore $L^1$ not the dual of any Banach space (Krein–Milman + Banach–Alaoglu would force the unit ball to have extreme points).
  - Bauer maximum principle: convex upper semicontinuous functional on compact convex attains max at extreme point.
- **Wrong/dubious.** None.
- **Underspecified.** None.
- **Severity.** None.

## §16 Distributions and test functions (lines 2111–2256)
- **Verified.**
  - Test function space $\mathcal{D}(\Omega)=C_c^\infty(\Omega)$ with inductive-limit topology; convergence = supports stay in a common compact set + all derivatives converge uniformly.
  - $\mathcal{D}'(\Omega)$ = continuous linear functionals.
  - Embedding $L^1_{\mathrm{loc}}\hookrightarrow\mathcal{D}'$ via $\phi\mapsto\int f\phi$.
  - Dirac delta $\langle\delta_0,\phi\rangle=\phi(0)$.
  - Principal value $\langle\mathrm{p.v.}\,\frac{1}{x},\phi\rangle=\lim_{\epsilon\to 0^+}\int_{|x|>\epsilon}\phi/x$.
  - Distributional derivative $\langle T',\phi\rangle=-\langle T,\phi'\rangle$, every distribution $C^\infty$. $(\log|x|)'=\mathrm{p.v.}\,1/x$. $\mathrm{Heaviside}'=\delta_0$.
  - Tempered distributions $\mathcal{S}'$ as Fourier-stable subspace.
  - **§16 delta-bump widget**: Gaussian $f_\sigma(x)=e^{-x^2/(2\sigma^2)}/(\sqrt{2\pi}\sigma)$, integrated against test $\phi$ to estimate $\phi(0)$ as $\sigma\to 0$. Code correctly normalizes (mass $\to 1$ within cutoff). The four test functions $\phi$ have stated $\phi(0)$ values: bump $e^0=1$ ✓, cos $\cos 0=1$ ✓, quad $2-0=2$ ✓, shifted $e^{-1}\approx 0.368$ ✓.
- **Wrong/dubious.**
  - **Fourier convention inconsistency (line 2126).** The page asserts "$\hat\delta=1$, $\hat 1=(2\pi)^{n/2}\delta$" simultaneously. These cannot hold for the same Fourier convention:
    - $\hat f(\xi)=\int f(x)e^{-ix\cdot\xi}dx$: $\hat\delta=1$, $\hat 1=(2\pi)^n\delta$.
    - $\hat f(\xi)=(2\pi)^{-n/2}\int f(x)e^{-ix\cdot\xi}dx$ (symmetric): $\hat\delta=(2\pi)^{-n/2}$, $\hat 1=(2\pi)^{n/2}\delta$.
    - $\hat f(\xi)=\int f(x)e^{-2\pi ix\cdot\xi}dx$: $\hat\delta=1$, $\hat 1=\delta$.
    The pair as stated is internally inconsistent; either change the second formula to $(2\pi)^n\delta$, or the first to $(2\pi)^{-n/2}$. Minor.
- **Underspecified.**
  - The widget's $\phi$ choices (e.g. $\cos(x)\mathbf 1_{|x|<2}$) are not in $C_c^\infty$ — they have jump discontinuities at the cutoff. As tests for the convergence-of-bumps illustration this is fine (the integrand is supported away from the discontinuities for small $\sigma$), but rigorously $\phi\in C_c^\infty$ should be assumed.
- **Severity.** Minor (one Fourier-constant inconsistency).

---

# Quiz bank — `quizzes/functional-analysis.json`

## `banach-hilbert-spaces` — **major error** in hard q1
- **q1, q2, q3 (v1)** ✓ standard.
- **hard q1 — WRONG explanation/answer.** Choice 1 (correct per the answer key) claims: "$f_n(x)=x^n$ is Cauchy in $L^2$ but its $L^2$ limit is the indicator $\mathbf 1_{\{1\}}$, which is not continuous; the completion is $L^2[0,1]$." Direct check: $\|f_n\|_{L^2}^2=\int_0^1 x^{2n}dx=1/(2n+1)\to 0$, so $f_n\to 0$ in $L^2$, and $0$ is the continuous zero function. The "$L^2$ limit $\mathbf 1_{\{1\}}$" claim is also false in $L^2$: a single point has measure zero so $\mathbf 1_{\{1\}}=0$ in $L^2[0,1]$. Therefore $(f_n)$ does NOT witness incompleteness of $C[0,1]$ under $\|\cdot\|_{L^2}$ — its limit is in $C[0,1]$. The standard counterexample is something like $f_n=$ continuous piecewise-linear approximating $\mathbf 1_{[1/2,1]}$ (equals 0 on $[0,1/2]$, 1 on $[1/2+1/n,1]$, linear in between), which IS Cauchy in $L^2$ with non-continuous limit. The completion claim ("completion is $L^2[0,1]$") is correct, but the construction given to support it is wrong. **Major.**
- **hard q2 (Riesz–Fischer order)** ✓ standard fast-Cauchy / coordinatewise / norm-convergent steps.
- **hard q3** ✓: $\langle e_1+2e_2, 3e_1-e_2\rangle = 3-2 = 1$; polarization sanity: $\|x+y\|^2=17, \|x-y\|^2=13, (17-13)/4=1$. ✓

## `operator-norm`
- All 3 v1 + 3 hard ✓. $\|\mathrm{diag}(3,-4)\|=4$ ✓; symmetric $(1,2;2,1)$ has eigs $\{-1,3\}$, op norm $3$ ✓. Hard q2 — $T=(3,4;0,0)$, $T^\top T=(9,12;12,16)$ has eigs $25,0$, $\|T\|=5$ ✓. Hard q3 (left shift strongly $\to 0$, op-norm $1$ for all $n$) ✓.

## `bounded-operators-fa`
- All ✓. $C^*$-identity $\|T^*T\|=\|T\|^2$ ✓; $\|S\|=1$ for unilateral right shift ✓.
- Hard q1: $S^*S=I$, $SS^*=I-P_{e_1}$ ✓.
- Hard q2: incomplete-domain inclusion $c_{00}\hookrightarrow\ell^2$ as Open-Mapping failure example ✓.
- Hard q3: $\|T\|=5$ for $T=(3,4;0,0)$ ✓.

## `adjoint-hilbert` — **major error** in hard q2 matching
- v1 q1 ✓ (defining identity), q2 multi-select ✓ (Pauli matrices Hermitian, $J$ skew), q3 numeric ✓ (adjoint conjugate transpose, $(T^*)_{12}=\bar 3=3$).
- **hard q1 (Hadamard)** ✓: $U^\top=U$ symmetric, $U^\top U=I$. Self-adjoint AND unitary ($U^2=I$, eigs $\pm 1$).
- **hard q2 — WRONG ANSWER KEY.** Matching question with `left = ["T*T=TT*", "T*=T", "T*T=TT*=I", "T*=-T"]` and `right = ["self-adjoint", "anti-self-adjoint", "normal", "unitary"]`. Convention (consistent with all other matching quizzes on the page, e.g. `spectrum-classification` q1): `answer[i]=j` ↔ `left[i]` matches `right[j]`. Correct mapping:
  - left[0] "$T^*T=TT^*$" → right[2] "normal"
  - left[1] "$T^*=T$" → right[0] "self-adjoint"
  - left[2] "$T^*T=TT^*=I$" → right[3] "unitary"
  - left[3] "$T^*=-T$" → right[1] "anti-self-adjoint"
  
  Correct answer key: `[2,0,3,1]`. The page has `[1,3,0,2]`, which is **all four entries wrong**. The `explain` block correctly states the right pairings, so the discrepancy is purely in the `answer` array. **Major.**
- **hard q3 (Volterra adjoint)** ✓: switch order of integration, $\langle Vf,g\rangle=\int_0^1 f(t)\int_t^1 g(x)\,dx\,dt$, so $(V^*g)(t)=\int_t^1 g$ ✓.

## `big-four-theorems`
- All ✓.
- Matching `[3,0,1,2]` correctly maps Hahn–Banach / Open Mapping / Closed Graph / Banach–Steinhaus to their taglines.
- Q2 "Hahn–Banach uses Zorn, not Baire" ✓.
- Q3 "$\ell_0(\alpha x)=\alpha\|x\|$ on $\mathbb{K}x$, extend by HB" ✓.
- Hard q1 (closed-graph contrapositive) ✓.
- Hard q2 (Lebesgue constants $\sim\log N$) ✓.
- Hard q3 (open ⇒ inverse continuous) ✓.

## `compact-operators`
- All ✓. Q3 Fredholm alternative on Hilbert. Multi-select $I$ not compact (infinite-dim), finite-rank compact, $\mathrm{diag}(1/n)$ compact, $\mathrm{diag}(1+1/n)$ not compact.
- Hard q1: spectrum of compact need not be connected ✓.
- Hard q2: Rellich + spectral theorem + $(-\Delta)^{-1}$ ✓.
- Hard q3: $\sum 1/n^2=\pi^2/6\approx 1.6449$ ✓.

## `spectral-theorem-fa`
- All ✓. Self-adjoint spectrum real ✓; multiplication form ✓.
- Complex Q3: $\sigma_y$ has product of eigenvalues $=\det\sigma_y=-1$ (since $0\cdot 0-(-i)\cdot i=0-(-i^2)=0-1=-1$). ✓
- Hard q1 (proof of real eigenvalues) ✓.
- Hard q2 ($M_x$ on $L^2[0,1]$ has $\sigma=[0,1]$, no eigenvalues) ✓.
- Hard q3 ($\|T\|^2=\|T^*T\|=\|I\|=1$ for $T=\mathrm{diag}(1,-1)$) ✓.

## `spectrum-classification`
- All ✓. Matching $[2,0,1]$ assigns "not injective" → point, "dense range not closed" → continuous, "range not dense" → residual ✓.
- Q2 right shift point spectrum empty ✓.
- Q3 spectrum compact, in disk of radius $\|T\|$ ✓.
- Hard q1 (residual at $0$ for $S$, point at $0$ for $S^*$) ✓.
- Hard q2 (self-adjoint has empty residual) ✓ via $\overline{\mathrm{ran}}^\perp=\ker(T-\bar\lambda)=\ker(T-\lambda)$ for real $\lambda$.
- Hard q3 ($\sigma_p(M_x)=\emptyset$, measure 0) ✓.

## `riesz-representation`
- All ✓. Conjugate-linear isometric bijection ✓; $(L^p)^*=L^q$ pairing ✓.
- Q3: $\|y\|=\sqrt{4+1+4}=3$ ✓.
- Hard q1 (point-eval / Banach-limit type functional outside $L^1$) ✓ in spirit; the specific reference to "Banach limits ... on $\ell^\infty$" inside an $L^\infty[0,1]$ explanation is informal but correct in spirit.
- Hard q2 (uniqueness via $\|y_1-y_2\|^2=0$) ✓.
- Hard q3: $\int_0^1(3x^2-1)^2 dx = 9/5-2+1 = 4/5$, $\|y\|=\sqrt{4/5}=2/\sqrt 5\approx 0.6325$ ✓.

## `weak-topology`
- All ✓.
- Q3: $e_n\rightharpoonup 0$ in $\ell^2$, $\|w\|=0$ ✓.
- Hard q1 (Mazur) ✓.
- Hard q2 (weak-$*$ in $\ell^\infty$ = pointwise on $\ell^1$, $\delta_n\to^*0$) ✓.
- Hard q3: $\int_0^{2\pi}x\sin(nx)dx=-2\pi/n+0\to 0$ ✓.

## `reflexivity`
- All ✓.
- Q1 isometric embedding ✓.
- Multi-select Q2 ✓.
- Q3 Kakutani $B_X$ weakly compact ✓.
- Hard q1 ($c_0^{**}=\ell^\infty$ contains constants $\notin c_0$) ✓.
- Hard q2 (bounded sequences have weakly conv. subseq.) ✓.
- Hard q3 (best-approximation existence via weak comp + lsc norm + Mazur) ✓.

## `distributions`
- All ✓.
- Q1 ✓ definition of distribution.
- Q2 ($n\cdot\mathbf 1_{[0,1/n]}\to\delta_0$) ✓.
- Q3 ($\langle\delta_0',\phi\rangle=-\phi'(0)=3$ for $\phi=x^2-3x+5$) ✓.
- Hard q1 ($(\log|x|)'=\mathrm{p.v.}\,1/x$) ✓; boundary terms $\log\epsilon\cdot(\phi(\epsilon)-\phi(-\epsilon))=O(\epsilon\log\epsilon)\to 0$ ✓.
- Hard q2 (tempered distributions and Fourier) ✓.
- Hard q3 ($x\delta_0=0$) ✓.

## `banach-alaoglu`
- All 3 questions ✓ (weak-$*$ topology, Tychonoff backing, separability ⇒ metrizability).

## `krein-milman`
- All 3 questions ✓ (closed convex hull form, extreme-point characterization, $L^1$ has no extreme points ⇒ not a dual space).

---

## Severity summary

**Major (3):**
1. **§8 Courant–Fischer ordering convention reversed** (line 1333) — page says "(by absolute value)" but the min-max formula gives signed-eigenvalue order.
2. **`banach-hilbert-spaces` hard q1 explanation is mathematically wrong** — the proposed witness $f_n=x^n$ for non-completeness of $C[0,1]$ under $L^2$ converges in $L^2$ to the (continuous) zero function. The headline conclusion ("completion is $L^2[0,1]$") is correct, but the constructed witness fails to support it.
3. **`adjoint-hilbert` hard q2 matching answer key fully inverted** — the `answer` array `[1,3,0,2]` mismatches every left/right pair, while the `explain` block is correct. Should be `[2,0,3,1]`.

**Minor (4):**
- §1 line 288: "Minkowski is the key inequality behind completeness" elides Riesz–Fischer (Minkowski only gives the triangle inequality).
- §7 widget readout calls non-compact spectrum "thick" near $1$; really a sequence with one accumulation point.
- §7 line 1182: $\lambda_1<\lambda_2$ for Dirichlet Laplacian needs connected $\Omega$ (Hopf max principle); strict inequality is silent on this.
- §16 line 2126: Fourier convention inconsistency between $\hat\delta=1$ and $\hat 1=(2\pi)^{n/2}\delta$ — these constants come from different normalizations and cannot both hold.

**Patterns / corpus notes:**
- The matching-quiz answer-key inversion (adjoint-hilbert hard q2) parallels the Logic & Foundations / Algebra section pattern of *quiz answer-key correctness* being the most common failure mode (model-theory-basics EF-rank, homological H_1 questions, cluster-algebras counts, etc.).
- Hilbert space proofs and theorem statements in the prose are clean throughout — the page's mathematical exposition is solid; the issues are concentrated in three specific places.
