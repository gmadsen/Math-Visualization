# Math correctness audit — `spectral-theory.html`

Audited 2026-05-14 (read-only). Pedagogy intentionally skipped.
Format per section: **Verified · Wrong/dubious · Underspecified · Severity**.

---

## §1 Spectrum of a bounded operator (lines 265–357)
- **Verified.** Spectrum definition $\sigma(T)=\{\lambda:T-\lambda I\notin\mathrm{GL}(B(H))\}$; three-way decomposition (point/continuous/residual) with correct closed-range / dense-range criteria; $\sigma(T)$ compact non-empty $\subset\overline{B(0,\|T\|)}$; spectral radius formula $r(T)=\lim\|T^n\|^{1/n}$. Widget: bilateral shift $S$ on $\ell^2(\mathbb{Z})$ unitary, $\sigma(S)=\mathbb{T}$ continuous, no eigenvectors (geometric sequences not $\ell^2$). $M_g$ on $L^2[-1,1]$, $g(x)=x$: $\sigma=[-1,1]$ continuous. Volterra norm $\|V\|=2/\pi$ ✓ (Halmos).
- **Wrong/dubious.** **Volterra spectrum classification (line 324).** Widget readout asserts "0 is in the *residual* spectrum — V is injective with non-dense range." For $V f(x)=\int_0^x f$ on $L^2[0,1]$: $V$ is injective (a.e. derivative zero ⇒ f=0), and its range $=\{g\in H^1[0,1]:g(0)=0\}$ which is **dense** in $L^2[0,1]$ (contains polynomials vanishing at 0). So 0 is in the **continuous** spectrum, not residual. The range is not closed (image of unit ball not relatively compact would contradict compactness of $V$, but range fails to be closed because $V$ is compact and infinite-rank). **Major.**
- **Underspecified.** None.
- **Severity.** Major (Volterra residual/continuous mislabel).

## §2 Self-adjoint spectrum on $\mathbb{R}$ (lines 359–494)
- **Verified.** $\sigma(T)\subset\mathbb{R}$ via $\|(T-\lambda)\varphi\|^2=\|(T-a)\varphi\|^2+b^2\|\varphi\|^2$. $r(T)=\|T\|$ via $\|T^2\|=\|T^*T\|=\|T\|^2$ + $2^k$ induction. Empty residual spectrum via $\overline{\mathrm{Ran}(T-\lambda)}^\perp=\ker(T-\lambda)^*=\ker(T-\lambda)$ for real $\lambda$. Random Hermitian widget: $4\times4$ Hermitian via $A=(B+B^*)/2$ logic OK, real $2n\times 2n$ embedding $[[\mathrm{Re},-\mathrm{Im}],[\mathrm{Im},\mathrm{Re}]]$ correct, eigenvalues come in pairs and are averaged. ✓
- **Wrong/dubious.** None.
- **Underspecified.** None.
- **Severity.** None.

## §3 Spectral theorem (compact self-adjoint) (lines 496–591)
- **Verified.** $K=\sum\lambda_n\langle\varphi_n,\cdot\rangle\varphi_n$, $\lambda_n\to 0$, finite-dim eigenspaces for $\lambda\ne 0$. HS integral op with symmetric $L^2$ kernel ⇒ compact self-adjoint. Mercer expansion. **Widget kernel $k(x,y)=\min(x,y)-xy$** is the Green's function for $-u''$ on $[0,1]$ Dirichlet; eigenfunctions $\sqrt 2\sin(n\pi x)$, eigenvalues $1/(n\pi)^2$ ✓ (since $K=(-\Delta_D)^{-1}$ on $[0,1]$). Code computes $\sum_{n\le N}\lambda_n\cdot 2\sin(n\pi x)\sin(n\pi y)$ — matches Mercer.
- **Wrong/dubious.** None.
- **Underspecified.** None.
- **Severity.** None.

## §4 Spectral theorem (bounded self-adjoint) (lines 593–679)
- **Verified.** PVM definition $E_\Omega$ orthogonal projection, $E_\Omega E_{\Omega'}=E_{\Omega\cap\Omega'}$, $T=\int\lambda\,dE_\lambda$, $f(T)=\int f\,dE$. Continuous functional calculus as isometric *-homomorphism $C(\sigma(T))\to C^*(T,1)$ via Gelfand–Naimark. Multiplication-operator form: every bounded self-adjoint unitarily equivalent to $M_g$ on some $L^2(X,\mu)$ with $g\in L^\infty$ real. PVM widget for $M_x$ on $L^2[0,1]$: $E_\Omega f=\mathbf 1_\Omega f$, $\langle E_\Omega f,f\rangle=\int_\Omega|f|^2$ ✓.
- **Wrong/dubious.** None.
- **Underspecified.** None.
- **Severity.** None.

## §5 Unbounded operators and Stone's theorem (lines 681–761)
- **Verified.** Symmetric ($T\subset T^*$) vs self-adjoint ($T=T^*$) distinction. Spectral resolution on natural domain. **Stone**: SOT-continuous one-parameter unitary $U(t)=e^{itA}$ ↔ self-adjoint $A$ with $A\varphi=-i\,(d/dt)U(t)\varphi|_0$. Dirichlet Laplacian on $[0,1]$: $\sigma=\{(n\pi)^2\}$, eigenfunctions $\sqrt 2\sin(n\pi x)$, compact resolvent ✓. Heat semigroup $u(t,x)=\sum c_n e^{-\lambda_n t}\varphi_n$ ✓.
- **Wrong/dubious.** None.
- **Underspecified.** None.
- **Severity.** None.

## §6 Compact operators / Fredholm alternative (lines 763–849)
- **Verified.** Compact = bounded → precompact = norm-limit of finite-rank (separable Hilbert / approximation property). $\mathcal{K}(H)$ closed two-sided $*$-ideal of $B(H)$. Fredholm alternative for $K-\lambda I$, $\lambda\ne 0$: index 0, finite-dim ker = coker, closed range, solvability iff $y\perp\ker(K^*-\bar\lambda I)$. Index homotopy invariance under norm-continuous Fredholm path; $\mathrm{ind}(K-\lambda I)=0$ via $tK-\lambda I$ deformation. Widget: $\sigma_n=n^{-\alpha}$, best rank-$r$ truncation error $=\sigma_{r+1}$ (Eckart–Young / Schmidt) ✓.
- **Wrong/dubious.** None.
- **Underspecified.** None.
- **Severity.** None.

## §7 Schatten ideals (lines 851–935)
- **Verified.** $\mathcal{S}_p=\{T\in\mathcal{K}(H):\sum s_n(T)^p<\infty\}$. HS norm basis-independent: $\|T\|_{HS}^2=\sum\|Te_n\|^2=\sum s_n^2$, inner product $\langle T,S\rangle_{HS}=\mathrm{tr}(S^*T)$. Integral op HS iff kernel in $L^2(X^2)$ with $\|K_k\|_{HS}=\|k\|_2$. Trace $\mathrm{tr}(T)=\sum\langle Te_n,e_n\rangle$ absolutely convergent on $\mathcal{S}_1$, basis-independent, $\mathrm{tr}(AB)=\mathrm{tr}(BA)$ when one factor trace-class. Schatten Hölder $\|TS\|_r\le\|T\|_p\|S\|_q$ with $1/p+1/q=1/r$; HS·HS = trace-class ($p=q=2,r=1$). Schatten duality $\mathcal{K}(H)^*\cong\mathcal{S}_1$, $\mathcal{S}_1^*\cong B(H)$, $\mathcal{S}_p^*\cong\mathcal{S}_q$ via $\mathrm{tr}(TS)$. $\mathcal{S}_1$ predual of $B(H)$, normal states = density matrices.
- **Wrong/dubious.**
  - **Inclusion chain (line 861).** "finite-rank $\subset\mathcal{S}_1\subset\mathcal{S}_2\subset\mathcal{S}_p\subset\mathcal{K}(H)\subset B(H)$, $1\le p\le\infty$." The statement "$\mathcal{S}_2\subset\mathcal{S}_p$" only holds for $p\ge 2$ (smaller $p$ ⇒ stronger condition: $\mathcal{S}_p\subset\mathcal{S}_q$ for $p\le q$). The trailing "$1\le p\le\infty$" implies all $p$, including $p<2$ where the inclusion reverses. Should be $2\le p\le\infty$ (or write $\mathcal{S}_p\subset\mathcal{S}_q$ for $p\le q$). **Minor.**
  - **Widget label (line 922).** Stat reads `cls = ap > 1 ? (p<=1 ? "trace-class S_1" : ...)`. For $p<1$ (slider goes 0.5..4.0) and $\alpha p>1$, the operator is in $\mathcal{S}_p$ which is strictly smaller than $\mathcal{S}_1$ — labeling it "trace-class $S_1$" understates the membership and misnames the ideal. Cosmetic. **Minor.**
- **Underspecified.** None.
- **Severity.** Minor (Schatten chain direction; widget label).

## §8 Weyl's law (lines 937–1044)
- **Verified.** $N(\lambda)\sim\omega_d|\Omega|(2\pi)^{-d}\lambda^{d/2}$ for Dirichlet Laplacian on bounded $\Omega\subset\mathbb{R}^d$. Heat-trace expansion $\mathrm{tr}\,e^{t\Delta}\sim|\Omega|/(4\pi t)^{d/2}-|\partial\Omega|/(4(4\pi t)^{(d-1)/2})+\cdots$ with **Dirichlet** boundary giving the $-$ sign on the perimeter term ✓ (Neumann gives $+$). Karamata Tauberian. Gordon–Webb–Wolpert (1992) isospectral non-isometric polygons ✓. Widget: $d=2$ rectangle, $\lambda_{m,n}=\pi^2(m^2/a^2+n^2/b^2)$, $N$ = lattice count, Weyl $\sim ab\lambda/(4\pi)=|\Omega|\lambda/(4\pi)$ ✓; boundary correction $-|\partial\Omega|\sqrt\lambda/(4\pi)$ for 2D Dirichlet rectangle ✓.
- **Wrong/dubious.**
  - **"Third coefficient gives the Euler characteristic" (line 950).** Holds in $d=2$ (Kac's $a_2$ on a smooth domain involves $\chi(\Omega)$ via Gauss–Bonnet-type integral). In general $d$, the next heat coefficient is $\int_\Omega R\,dx + \text{boundary mean-curvature integrals}$ (Minakshisundaram–Pleijel / McKean–Singer); $\chi$-only reading is dimension-2-specific. Page presents the chain $d, |\Omega|, |\partial\Omega|, \chi$ as if dimension-agnostic. **Minor.**
- **Underspecified.** None.
- **Severity.** Minor.

## §9 Applications (lines 1046–1130)
- **Verified.** QM observables = self-adjoint, spectrum = measured values, Born rule via spectral measure, $U(t)=e^{-itH/\hbar}$. Elliptic operators on bounded domains have compact resolvent. Translation-invariant ops on $L^2(\mathbb{R}^n)$ diagonalized by Fourier ($\widehat{Tf}=m\hat f$). Pontryagin duality framing. Harmonic oscillator $E_n=(n+\tfrac12)\hbar\omega$, ladder operators, Hermite × Gaussian eigenfunctions ✓.
- **Wrong/dubious.**
  - **Quiz `st-applications` q3 explain — Stone-generator sign.** Says "translations on $\mathbb{R}$ form a unitary group whose Stone generator is $-i\partial_x$." For $T_y f(x)=f(x-y)$, $(d/dy)|_{y=0}T_y f=-f'$, so writing $T_y=e^{iyA}$ (Stone form) forces $iA f=-f'$, i.e. $A=-i(-\partial_x)=i\partial_x$. The sign $-i\partial_x$ is the *momentum* operator $P$ (with $T_y=e^{-iyP}$ convention), but Stone's $U(t)=e^{itA}$ gives $A=i\partial_x$ for $T_y f(x)=f(x-y)$. Sign convention slip. **Minor.**
- **Underspecified.** None.
- **Severity.** Minor.

---

# Quiz bank — `quizzes/spectral-theory.json`

- `st-bounded-operators-spectrum` ✓ (3/3). q2 right shift on $\ell^2(\mathbb{N})$: $\sigma=\overline{\mathbb{D}}$, $|\lambda|<1$ residual, $|\lambda|=1$ continuous ✓ (consistent with `functional-analysis` audit).
- `st-self-adjoint-spectrum` ✓ (3/3).
- `st-spectral-theorem-compact` ✓ (3/3).
- `st-spectral-theorem-bounded` ✓ (3/3).
- `st-unbounded-operators` ✓ (3/3).
- `st-compact-fredholm` ✓ (3/3). q3 numeric: $K=\mathrm{diag}(1/n)$, $K-\tfrac12 I$ has $\ker=\mathbb{C}e_2$, cokernel also 1-D (self-adjoint), index $1-1=0$ ✓.
- `st-trace-class-hilbert-schmidt` ✓ (3/3). q2 numeric $\zeta(2)=\pi^2/6\approx 1.6449$ ✓; q1 explain: $s_n=1/\log(n+2)$ counterexample (compact, not HS) since $\sum 1/\log^2(n)$ diverges ✓.
- `st-weyl-laplacian` ✓ (3/3). q2 numeric $\lambda_1=2\pi^2\approx 19.7392$ ✓.
- `st-applications` — q3 explain has a sign-convention slip on the Stone generator (see §9). **Minor.**

---

## Severity summary

**Major (1):**
1. **§1 Volterra widget readout** (line 324) misclassifies $0\in\sigma(V)$ as residual spectrum. The Volterra operator $Vf(x)=\int_0^x f$ on $L^2[0,1]$ has dense range (it surjects onto $\{g\in H^1:g(0)=0\}$, dense in $L^2$) and is injective, so $0$ is in the **continuous** spectrum.

**Minor (3):**
- §7 line 861: Schatten inclusion chain "$\mathcal{S}_2\subset\mathcal{S}_p$" with quantifier "$1\le p\le\infty$" — direction reverses for $p<2$.
- §7 widget (line 922): labels $\mathcal{S}_p$ membership as "trace-class $\mathcal{S}_1$" whenever $p\le 1$; misnames the ideal for $p<1$.
- §8 line 950: "the third gives the Euler characteristic" is dimension-2-specific; in general $d$ the next heat coefficient mixes scalar curvature and boundary mean-curvature integrals. Quiz `st-applications` q3 explain: Stone generator written as $-i\partial_x$ (momentum convention) instead of $+i\partial_x$ matching $U(t)=e^{itA}$ with $T_y f(x)=f(x-y)$.

**Patterns / corpus notes.** Prose statements of the spectral theorem (compact, bounded, multiplication form), functional calculus, Schatten duality, trace-class characterization, and Weyl asymptotics are clean. The single substantive error is the Volterra spectrum-decomposition mislabel — same family of slip seen in the `functional-analysis` audit (§9 prose was right there; here the widget readout introduces it). All quiz answer keys checked correct.
