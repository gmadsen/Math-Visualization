# Math correctness audit — `semigroup-theory-evolution-equations.html`

Audited 2026-05-14 (read-only). Pedagogy intentionally skipped.
Format per section: **Verified · Wrong/dubious · Underspecified · Severity**.

---

## §1 C₀ semigroups (lines 229–462)
- **Verified.**
  - Three axioms ($T(0)=I$, $T(s+t)=T(s)T(t)$, strong continuity) and rationale for strong vs. norm continuity.
  - Growth bound $\|T(t)\|\le M e^{\omega t}$, derivation via UBP + semigroup law on $[0,1]$.
  - Heat semigroup contraction on $L^2(\mathbb R^n)$ via Plancherel and the multiplier $e^{-t|\xi|^2}$.
  - Wave propagator on the energy space $H^1\times L^2$ as a $C_0$-group with energy-norm isometry; Schrödinger group $e^{-it\Delta}$ unitary on $L^2$.
  - **Widget `sg-c0`**: heat path uses $u_0=e^{-3x^2}$ (variance $1/6$), evolved variance $1/6+2t$, mass-preserving amplitude $\sqrt{(1/6)/\sigma^2}$ — matches $\partial_t = \partial_x^2$. Wave path is d'Alembert with $u_t(0)=0$, $c=1$. Schrödinger path uses the closed-form $u(t,x)=(1+4iat)^{-1/2}\exp(-ax^2/(1+4iat))$ with $a=3$; code stores Re part. Composed-vs-direct overlay genuinely demonstrates the semigroup law.
- **Wrong/dubious.** None.
- **Underspecified.** "Wave propagator $\|T(t)\|\le 1$ in the energy norm" — strictly an isometry/equality, not just $\le 1$ (consistent with the readout calling it an isometry).
- **Severity.** None.

## §2 Infinitesimal generator (lines 465–604)
- **Verified.**
  - Definition $Ax=\lim_{t\to0^+}(T(t)x-x)/t$, $D(A)$ dense, $A$ closed, generator is a complete invariant.
  - Density argument via $\frac{1}{t}\int_0^t T(s)x\,ds\to x$ with the integral in $D(A)$.
  - Differentiation identity $\frac{d}{dt}T(t)x=AT(t)x=T(t)Ax$ for $x\in D(A)$.
  - $A\in B(X)$ ⟺ $T$ uniformly continuous, with $T(t)=e^{tA}=\sum (tA)^k/k!$.
  - Heat: $A=\Delta$, $D(A)=H^2(\mathbb R^n)$. Translation $T(t)f(x)=f(x+t)$ on $L^p(\mathbb R)$: $A=d/dx$, $D(A)=W^{1,p}$.
  - **Widget `sg-gen`**: smooth case $u=e^{-2x^2}$, $u''=(16x^2-4)e^{-2x^2}$ ✓ (direct differentiation). Rough case (Heaviside) correctly diagnosed as not in $H^1\subset D(\Delta)$ on $L^2$, with the difference quotient blowing up.
- **Wrong/dubious.** None.
- **Underspecified.** None.
- **Severity.** None.

## §3 Hille–Yosida & Lumer–Phillips (lines 607–751)
- **Verified.**
  - Contraction Hille–Yosida: closed, densely defined, $(0,\infty)\subset\rho(A)$, $\|(\lambda-A)^{-1}\|\le 1/\lambda$.
  - General version: $\|(\lambda-A)^{-n}\|\le M/(\lambda-\omega)^n$ for all $n\ge1$, $\lambda>\omega$.
  - Lumer–Phillips: $A$ dissipative + range$(\lambda-A)=X$ for some $\lambda>0$ ⟺ contraction $C_0$-semigroup; Hilbert characterization $\mathrm{Re}\langle Ax,x\rangle\le 0$; sufficient condition $A$ closed and $A^*$ dissipative.
  - Yosida approximation $A_n=nA(n-A)^{-1}=n^2(n-A)^{-1}-nI$ — algebraic identity verified ($nA(n-A)^{-1}=n((A-n)+n)(n-A)^{-1}=-nI+n^2(n-A)^{-1}$). $\|n(n-A)^{-1}\|\le 1$ from the resolvent estimate, $A_nx\to Ax$ on $D(A)$, $e^{tA_n}\to T(t)$ strongly.
  - **Widget `sg-hy`**: dissipative case is $A=\partial^2$ on $2\pi$-periodic; Fourier resolvent divides mode $k$ by $(\lambda+k^2)$. For $f=\sin(3x)-0.5\sin(7x)$, $Af=-9\sin(3x)+24.5\sin(7x)$ ✓. Non-dissipative case $A=I$: $\|(\lambda-I)^{-1}\|=1/|\lambda-1|$, violating $\le 1/\lambda$ for $\lambda$ near or above $1$ ✓ (it generates $e^t I$, $\omega=1$).
- **Wrong/dubious.** None.
- **Underspecified.**
  - Dissipativity definition uses "$\|(\lambda-A)x\|\ge\lambda\|x\|$ for every $\lambda>0$"; the standard Lumer definition is "for some/all $\lambda>0$" — equivalent for closed operators, fine.
- **Severity.** None.

## §4 Analytic semigroups (lines 754–905)
- **Verified.**
  - Sector $\Sigma_\delta$, holomorphic extension $T\colon\Sigma_\delta\to B(X)$ with semigroup law and strong continuity at $0$ on subsectors.
  - Resolvent characterization: $\rho(A)\supset\{|\arg\lambda|<\pi/2+\delta\}$, $\|(\lambda-A)^{-1}\|\le M/|\lambda|$.
  - $\|A^k T(t)\|\le C_k/t^k$ ⟹ instant smoothing $T(t)L^2\subset C^\infty$ for $A=\Delta$.
  - Maximal $L^p$ regularity on UMD spaces ($1<p<\infty$); contrast with wave/Schrödinger non-analyticity (purely imaginary spectrum).
  - **Widget `sg-analytic`**: heat case uses $u_0(x)=\frac12(1+\mathrm{erf}(8x))$. Initial $u_0'=(8/\sqrt\pi)e^{-64x^2}$ has variance $1/128$; convolution with heat kernel of variance $2t$ gives $u(t,x)=\frac12(1+\mathrm{erf}(8x/\sqrt{1+256t}))$ ✓ (since $1/128+2t = (1+256t)/128$). Wave d'Alembert and Schrödinger Fourier-mode phase $e^{ik^2 t}$ correct.
- **Wrong/dubious.** None.
- **Underspecified.** None.
- **Severity.** None.

## §5 Abstract Cauchy problem (lines 908–1039)
- **Verified.**
  - Abstract form $u'=Au+f$. Wave first-order block $A=\begin{pmatrix}0&I\\\Delta&0\end{pmatrix}$ on $H^1\times L^2$ recovers $u_{tt}=\Delta u$. Schrödinger generator $-i\Delta$ matches $T(t)=e^{-it\Delta}$.
  - Strict vs. mild solution definitions; Duhamel $u(t)=T(t)u_0+\int_0^t T(t-s)f(s)\,ds$.
  - Promotion $f\in C^1$ or $f\in C([0,T];D(A))$ ⟹ classical; uniqueness from $A$ closed.
  - **Widget `sg-d`**: homogeneous part Gaussian widening; impulse case shifts onset at $s=0.2$; constant-forcing midpoint quadrature on $\int_0^t T(t-s)g\,ds$ — all consistent with Duhamel.
- **Wrong/dubious.** None.
- **Underspecified.** None.
- **Severity.** None.

## §6 Applications (lines 1042–1193)
- **Verified.**
  - Banach fixed point on Duhamel for $u'=Au+F(u)$, blow-up alternative, Fujita / Kato / NLS placement.
  - Heat-equation approximate controllability for any $T>0$ with $\omega$ open nonempty. Wave exact controllability under geometric control condition (Bardos–Lebeau–Rauch). ✓
  - Markov semigroup $T(t)f(x)=\mathbb E_x[f(X_t)]$, generator $Af=\frac12\sum(\sigma\sigma^\top)_{ij}\partial_i\partial_j f+\sum b_i\partial_i f$ from Itô. BM ($b=0,\sigma=I$): $A=\frac12\Delta$. Feynman–Kac $u(t,x)=\mathbb E_x[e^{\int_0^t V(X_s)ds}f(X_t)]$ for $u_t=Au+Vu$. ✓
  - Lebeau–Robbiano cost bound $\sim e^{C/T}$ for heat controllability ✓.
- **Wrong/dubious.**
  - Widget `sg-ctl` "naive projection-onto-$\omega$ controller" $u_{\rm ctrl}(T,x)=T(T)u_0+\mathbf 1_\omega(x)(u_T(x)-T(T)u_0(x))$ does NOT correspond to any actual control $v(s)$ acting through $\int_0^T T(T-s)Bv(s)\,ds$; it's a static pointwise blend, and the resulting state is not in general the endpoint of the controlled flow (one can't drop a discontinuity at $\partial\omega$ at time $T$ from a control acting through an analytic semigroup). Read as a residual visualizer it's fine, but the readout calls it the "controlled $u(T,x)$", which is misleading. **Severity:** moderate — diagnostic correct, label overstates.
  - The `controlCost` formula $e^{1/\max(T,0.05)}\cdot{\rm target}\cdot(1+|w-x_T|)/\sqrt{|\omega|}$ is heuristic (the $(1+|w-x_T|)$ factor is invented to make $w$ feel like a knob); not a derivable Lebeau–Robbiano constant. Labeled as "cost estimate" — acceptable but not a theorem.
- **Underspecified.**
  - "Reachable set is dense but not all of $L^2$ (instant smoothing means $u(T)\in\bigcap_k H^k$)" — true; could be sharpened to "$u(T)$ is real-analytic on $\omega^c$" but not wrong.
- **Severity.** Moderate (widget label).

## Coverage gaps vs. requested focus areas
- **Stone's theorem — absent.** The page mentions Schrödinger as unitary but never states Stone: a strongly continuous one-parameter unitary group $U(t)$ on Hilbert space has the form $U(t)=e^{itA}$ with $A$ self-adjoint (and conversely). The closest content is the $i\Delta$ generator example. **Severity:** moderate — focus-area gap.
- **Trotter–Kato approximation — absent.** Neither the Trotter product formula $e^{t(A+B)}=\lim_n(e^{tA/n}e^{tB/n})^n$ nor the Trotter–Kato convergence theorem (resolvent convergence ⟹ semigroup convergence) is stated. The Yosida approximation $T_n(t)\to T(t)$ is mentioned but is a different theorem. **Severity:** moderate — focus-area gap.

## Summary
- **No mathematical errors.** Every formula, generator, domain, theorem statement, and worked widget computation checks out (heat variance formula, Schrödinger Gaussian phase, Yosida algebraic identity, Itô generator, Lumer–Phillips Hilbert characterization).
- **One widget label overstates** (§6 "naive projection" is a residual visualizer, not a true controlled trajectory).
- **Two requested focus areas not covered**: Stone's theorem (unitary case) and Trotter–Kato approximation. These are real omissions vs. the audit charter.
