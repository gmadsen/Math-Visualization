# Math correctness audit — `microlocal-analysis.html`

Audited 2026-05-14 (read-only). Pedagogy intentionally skipped.
Format per section: **Verified · Wrong/dubious · Underspecified · Severity**.

Convention adopted by the page (stated §2 line 447): $D = -i\partial$, so
$D^\alpha = (-i\partial)^\alpha$ and a differential operator $\sum a_\alpha D^\alpha$
has full symbol $\sum a_\alpha(x)\xi^\alpha$. All sign checks below use this.

---

## §1 The wavefront set (lines 259–442)
- **Verified.**
  - Phase-space-localization definition: cutoff $\phi\in C_c^\infty$ with $\phi(x_0)\ne0$, conical neighborhood $V\ni\xi_0$ of rapid decay $|\widehat{\phi u}(\xi)|\le C_N(1+|\xi|)^{-N}$. Standard Hörmander definition. ✓
  - WF closed and conic in $T^*\mathbb{R}^n\setminus 0$; projects onto $\mathrm{singsupp}$. ✓
  - $\mathrm{WF}(\delta_0)=\{0\}\times(\mathbb{R}^n\setminus0)$ — $\widehat{\phi\delta_0}(\xi)=\phi(0)$ constant. ✓
  - Heaviside $\mathbf{1}_{x_1>0}$: WF = conormal bundle of $\{x_1=0\}$ minus zero section, $\xi\propto e_1$. ✓
  - $u\in C^\infty\Leftrightarrow \mathrm{WF}(u)=\emptyset$. ✓
  - Coordinate-invariance + lift to $T^*M\setminus 0$. ✓
  - $\mathrm{WF}(Au)\subset\mathrm{WF}(u)$ for $A\in\Psi^m$ (microlocal pseudo-locality). ✓
  - **Widget WF table**: $\delta_0'$ same WF as $\delta_0$ (differentiation cannot enlarge or restrict the cone over a single isotropic point) ✓; rotated Heaviside $\mathbf{1}_{x+y>0}$ has conormal $(1,1)/\sqrt2$ ✓; $|x|^{-1}$ on $\mathbb{R}^n$ ($n\ge2$): homogeneous, singular only at $0$, WF $=\{0\}\times(\mathbb{R}^n\setminus0)$ ✓; corner indicator $\mathbf{1}_{x>0,y>0}$: conormal directions on the two open boundary rays, full fiber over the corner $(0,0)$ ✓.
  - Quiz `ml-wavefront` Q3: surface measure on unit sphere — WF = $N^*S^{n-1}\setminus 0$ (radial covectors). ✓
- **Wrong/dubious.** None.
- **Underspecified.**
  - "$\mathrm{WF}(Au)\subset\mathrm{WF}(u)$ for any pseudodifferential $A$" needs $A$ properly supported (or compactly supported kernel away from infinity) for the inclusion to make sense globally; standard caveat omitted but not misleading at this level.
  - $|x|^{-1}$ on $\mathbb{R}^1$ is *not* locally integrable, so its definition as a distribution requires regularization (Hadamard/principal-value); page doesn't pin a dimension. Drawing is 2D, so it's fine if read as $n\ge2$.
- **Severity.** None.

## §2 Pseudodifferential operators and symbol calculus (lines 444–573)
- **Verified.**
  - Differential operator → full symbol: $Pu = (2\pi)^{-n}\int e^{ix\cdot\xi}p(x,\xi)\hat u(\xi)d\xi$, $p=\sum a_\alpha(x)\xi^\alpha$. With $D=-i\partial$ this is correct (and the Fourier-inversion derivation of it is correct). ✓
  - Symbol class $S^m_{1,0}$: $|\partial_x^\alpha\partial_\xi^\beta p|\le C_{\alpha\beta}(1+|\xi|)^{m-|\beta|}$. ✓
  - Classical/polyhomogeneous expansion $p\sim\sum p_{m-j}$ with $p_{m-j}$ positively homogeneous of degree $m-j$ in $\xi$ for $|\xi|$ large. ✓
  - Principal symbol coordinate-invariant on $T^*\mathbb{R}^n\setminus 0$; lower-order terms are quantization-dependent. ✓
  - Composition $\Psi^{m_1}\cdot\Psi^{m_2}\subset\Psi^{m_1+m_2}$, principal symbol $p_{m_1}q_{m_2}$. ✓
  - Adjoint: $P^*\in\Psi^m$, principal symbol $\overline{p_m}$. ✓ (Standard Kohn–Nirenberg / left-quantization fact.)
  - Mapping $H^s\to H^{s-m}$. ✓ (Standard for properly supported / compact-manifold ΨDOs.)
  - Quiz `ml-pseudo-diff-ops` Q1, Q2 (selecting principal-symbol composition + boundedness + diff-op as ΨDO), Q3 (matching). ✓
- **Wrong/dubious.**
  - **Composition asymptotic series sign.** Page gives
    $p\#q\sim\sum_\alpha (i^{|\alpha|}/\alpha!)\,\partial^\alpha_\xi p\,\partial^\alpha_x q$.
    With the page's stated convention $D=-i\partial$, the correct Kohn–Nirenberg
    left-quantization formula is
    $p\#q\sim\sum_\alpha \frac{1}{\alpha!}\,\partial^\alpha_\xi p\,D_x^\alpha q
        =\sum_\alpha \frac{(-i)^{|\alpha|}}{\alpha!}\,\partial^\alpha_\xi p\,\partial^\alpha_x q.$
    The coefficient should be $(-i)^{|\alpha|}$, not $i^{|\alpha|}$.
    Equivalent form $\sum_\alpha \frac{1}{\alpha!}\partial_\xi^\alpha p\,D_x^\alpha q$ (Hörmander vol. III, (18.1.15)) is the canonical statement. **Severity: low** (sign flips in odd-order terms, doesn't affect any downstream claim on the page; principal symbol and order count are unaffected; wave-equation and parametrix discussion only use the $|\alpha|=0$ term).
  - **Symbol widget readout** (line 538, 547):
    "lower-order remainder in $S^{m_1+m_2-1}$ from the i ∂_ξ p₁ · ∂_x p₂ term."
    Same sign issue; with $D=-i\partial$ the leading correction is
    $-i\partial_\xi p_1\,\partial_x p_2$ (or $\partial_\xi p_1\,D_x p_2$).
    **Severity: low** (cosmetic, but inconsistent within the page).
- **Underspecified.**
  - "Mapping: every $P\in\Psi^m$ is bounded $H^s\to H^{s-m}$" — strictly needs $P$
    properly supported or restricted to compact sets; on $\mathbb{R}^n$ with the
    global $S^m_{1,0}$ class this holds for $H^s_{\rm loc}$. Mentioned in audit
    of §1 too; standard pedagogical compromise.
  - "Egorov's theorem, an FIO-conjugation statement, gives the correction terms
    when needed" — vague but not incorrect; the page never restates Egorov as a
    formal theorem. Minor underspec.
- **Severity.** Low (sign error in displayed asymptotic series + widget readout).

## §3 Microlocal regularity and propagation of singularities (lines 575–703)
- **Verified.**
  - $\mathrm{WF}(Pu)\subset\mathrm{WF}(u)$ (microlocal pseudo-locality). ✓
  - $\mathrm{Char}(P)=\{p_m=0\}$, $\mathrm{Ell}(P) = (T^*\mathbb{R}^n\setminus0)\setminus\mathrm{Char}(P)$. ✓
  - Microlocal elliptic regularity: $\mathrm{WF}(u)\cap\mathrm{Ell}(P)\subset\mathrm{WF}(Pu)$, equivalently $\mathrm{WF}(u)\setminus\mathrm{WF}(Pu)\subset\mathrm{Char}(P)$. ✓
  - Hamiltonian vector field formula
    $X_{p_m}=\sum_j(\partial_{\xi_j}p_m\,\partial_{x_j}-\partial_{x_j}p_m\,\partial_{\xi_j})$. ✓ (sign convention $\omega = d\xi\wedge dx$).
  - Hörmander propagation: for $p_m$ real, $\mathrm{WF}(u)\setminus\mathrm{WF}(Pu)$ invariant under bicharacteristic flow inside $\mathrm{Char}(P)$. ✓
  - Bicharacteristics of $\Box$ project to null geodesics — light rays. ✓
  - Quiz `ml-microlocal-regularity` Q1, Q2 (counts $\tau=\pm1$), Q3 (spot-the-error: bicharacteristic flow does not project to a well-defined flow on the base). All correct. ✓
- **Wrong/dubious.**
  - **Wave-operator principal symbol sign.** Page (line 594 and quiz Q2):
    "$\Box=-\partial_t^2+\Delta_x$ has principal symbol $p_2(t,x;\tau,\xi)=-\tau^2+|\xi|^2$."
    With the page's $D=-i\partial$ convention: $-\partial_t^2 = D_t^2$ has symbol $\tau^2$;
    $\Delta_x = \sum\partial_{x_j}^2 = -\sum D_{x_j}^2$ has symbol $-|\xi|^2$.
    So $\sigma_2(\Box) = \tau^2 - |\xi|^2$, not $-\tau^2 + |\xi|^2$. **Sign is flipped.**
    The characteristic variety $\{\tau^2=|\xi|^2\}$ is unaffected, so the quiz "how many real $\tau$
    with $|\xi|=1$" answer of $2$ is still correct. The Hamiltonian vector field
    $X_{p_2}$ flips sign with the symbol, which only re-parameterizes bicharacteristics
    by $t\mapsto -t$ — bicharacteristic *curves* (and their projections to null
    geodesics) are unchanged.
    **Severity: low–medium.** Doesn't break any downstream conclusion but is
    inconsistent with the convention the page itself just adopted in §2.
- **Underspecified.**
  - Hörmander's theorem stated for "real principal symbol" — strictly for
    *real principal type* (also need $X_{p_m}$ not to be radial/proportional to
    Euler field on Char). Standard simplification.
  - Propagation widget readout for the point datum: "WF(u_t) sits on the circle
    $|x|=t$ with conormal pointing radially outward". For $\delta_0$ initial data
    in 2+1 dimensions the wavefront set is on the cone $|x|=t$, but Huygens'
    principle fails in even spatial dimension and the *singular support* is the
    whole disk $|x|\le t$ — the WF on the boundary circle is correct, but the
    interior may also carry WF. Page only displays the circle (correct as
    "front"). Minor underspec.
- **Severity.** Low–medium (sign error in $\sigma(\Box)$, no downstream damage).

## §4 Elliptic regularity via the parametrix (lines 705–808)
- **Verified.**
  - Ellipticity at $(x_0,\xi_0)$: $p_m(x_0,\xi_0)\ne 0$. ✓
  - $-\Delta$ has $p_2 = -|\xi|^2$ (consistent with §2 convention) — but the page writes "$p_2(x,\xi)=-|\xi|^2$ … $-\Delta$ is uniformly elliptic". With $D=-i\partial$, $\sigma_2(-\Delta) = +|\xi|^2$ (since $\Delta = -|D|^2$, so $-\Delta = |D|^2$ has symbol $|\xi|^2$). **The sign is wrong** — should be $+|\xi|^2$. Vanishing only on $\xi=0$ is the same either way, so ellipticity claim survives.
  - Parametrix relations $QP = I + R_1$, $PQ = I + R_2$, $R_i\in\Psi^{-\infty}$. ✓
  - Smoothing operators: $C^\infty$ Schwartz kernel, equivalently symbol Schwartz in $\xi$. ✓
  - Bootstrap: $u = Qf - R_1 u$, $Qf\in H^{s+m}$ for $f\in H^s$, $R_1u\in C^\infty$. ✓
  - Elliptic regularity $f\in H^s_{\rm loc}\Rightarrow u\in H^{s+m}_{\rm loc}$. ✓
  - Microlocal $\mathrm{WF}(u)=\mathrm{WF}(Pu)$ on $\mathrm{Ell}(P)$. ✓
  - Atiyah–Singer connection (parametrix as analytic input for Fredholm + index). ✓
  - Quiz `ml-elliptic-regularity` Q1 (parametrix definition), Q2 (consequences, with the $L^2\to L^2$ distractor correctly flagged), Q3 (build-order). All correct. ✓
- **Wrong/dubious.**
  - **Sign on $\sigma(-\Delta)$** as above (line 708). Says "$-\Delta$ has $p_2(x,\xi)=-|\xi|^2$"; with the page's $D=-i\partial$ convention, $\sigma_2(-\Delta)=+|\xi|^2$. **Severity: low** (only sign; no downstream consequence — ellipticity, parametrix, gain of $m=2$ derivatives all unaffected).
- **Underspecified.**
  - "Iterating ($R_1$ of $R_1 u$ is also smoothing, but already $C^\infty$) gives the elliptic regularity theorem" — bootstrap argument is genuinely $u\in H^{s+m}_{\rm loc}$ in one step, the iteration is for the $C^\infty$ corollary. Wording is loose but not wrong.
- **Severity.** Low (sign error only).

## §5 Fourier integral operators (lines 810–934)
- **Verified.**
  - FIO formula $Au(x) = (2\pi)^{-N}\int e^{i\phi(x,y,\xi)}a(x,y,\xi)u(y)dy\,d\xi$ with $a\in S^m$, $\phi$ phase function. ✓
  - Non-degenerate phase: homogeneous of degree 1 in $\xi$, $d\phi\ne 0$, differentials $d(\partial\phi/\partial\xi_j)$ linearly independent on $C_\phi$. ✓ (Standard Hörmander condition; equivalent forms exist but this one is correct.)
  - Lagrangian $\Lambda = \{(x,d_x\phi;\,y,-d_y\phi) : (x,y,\xi)\in C_\phi\}\subset T^*X\times T^*Y$. ✓ (Sign on the $Y$ side is the standard "twisted" convention making the relation Lagrangian for $\omega_X\ominus\omega_Y$.)
  - $\Lambda$ is Lagrangian for $\omega_{T^*X}\ominus\omega_{T^*Y}$. ✓
  - Wavefront propagation: $\mathrm{WF}(Au)\subset \Lambda\circ\mathrm{WF}(u)$ as composition of canonical relations. ✓
  - $\Lambda = \mathrm{graph}(\chi)$ collapses propagation to $\chi(\mathrm{WF}(u))$. ✓
  - ΨDO is special case $\phi=(x-y)\cdot\xi$, $\Lambda$ = diagonal of $T^*X$. ✓
  - Half-wave propagators $e^{\pm it\sqrt{-\Delta}}$ are FIOs whose canonical relations are time-$t$ Hamiltonian flows of the symbol $\pm|\xi|$. ✓
  - Maslov correction at caustics: half-integer phase shift accumulated at fold loci of $\pi:\Lambda\to X$. ✓
  - WKB ansatz $a\,e^{i\phi}$ as leading FIO term. ✓
  - Quiz `ml-fourier-integral-ops` Q1 (canonical relation), Q2 (multi-select; correctly flags that not every FIO is $L^2\to L^2$), Q3 (matching). All correct. ✓
- **Wrong/dubious.** None.
- **Underspecified.**
  - "Composition of FIOs whose canonical relations compose transversally gives another FIO" — in addition to transversality one needs the *clean intersection* / properness condition (Hörmander vol. IV, §25.2); transversality alone is the most common simplification, fine pedagogically.
  - "Solutions of $\Box u=0$ split as a sum of two FIOs (forward and backward half-waves)" — true for the Cauchy problem with smooth coefficients, but on a general manifold one needs a global time function or short-time restriction. Minor.
- **Severity.** None.

## §6 Scattering, Radon, inverse problems (lines 936–1035)
- **Verified.**
  - Helmholtz $(\Delta+k^2)u=f$ has principal symbol $-|\xi|^2 + k^2$ — wait, with $D=-i\partial$, $\Delta=-|D|^2$ has symbol $-|\xi|^2$, so $\sigma_2(\Delta+k^2)=-|\xi|^2$ (the $k^2$ is order 0). The page's "$-|\xi|^2+k^2$" (line 941) **conflates principal symbol with full symbol**; principal-symbol-wise only $-|\xi|^2$ matters and the characteristic variety $\{p_2=0\}$ is then $\xi=0$, the *zero section*, which is excluded — the operator is in fact *elliptic* in the strict principal-symbol sense. The classical "characteristic on $|\xi|=k$" statement comes from treating $\Delta+k^2$ as a *semiclassical* operator with $\hbar = 1/k$, or equivalently from requiring the *full symbol* to vanish. The paragraph is using the looser "characteristic set" of scattering theory, not the strict $\sigma_m=0$ definition introduced in §3. **Severity: medium**: the inconsistency with the §3 definition is genuine and would confuse a careful reader — these are different notions tied together only by semiclassical analysis (mentioned in passing in §7).
  - Sommerfeld radiation condition $r^{(n-1)/2}(\partial_r - ik)u\to 0$ — standard form for outgoing solutions. ✓
  - Radon transform canonical relation: WF singularity at $(x_0,\xi_0)$ detected by lines $L\ni x_0$ with $L\perp\xi_0$. ✓ (Quinto / Greenleaf–Uhlmann / Beylkin / Krishnan–Quinto; standard.)
  - Limited-angle missing-cone theorem. ✓
  - Calderón problem and Dirichlet-to-Neumann use FIO + parametrix. ✓ (Sylvester–Uhlmann etc.)
  - Cauchy-horizon propagation in GR via Hörmander on $\Box_g$. ✓
  - Radon widget: detection condition `|((phi - theta) mod π) - π/2| < 0.1` correctly tests for $L\perp\xi$ within tolerance. ✓
  - Quiz `ml-applications` Q1, Q2, Q3. All correct. ✓
- **Wrong/dubious.**
  - **Helmholtz "non-elliptic on $|\xi|=k$"** (line 941). With the strict principal-symbol definition the operator *is* elliptic. The widely used statement "non-elliptic on the characteristic sphere" is a *semiclassical* statement; the page silently switches frameworks. The quiz Q3 step list also says "Diagnose the failure: non-elliptic on $|\xi|=k$, no parametrix" — same conflation. **Severity: medium**, since §3 just defined ellipticity strictly via $p_m\ne 0$ on $T^*M\setminus 0$.
- **Underspecified.**
  - "Microlocally selects the half of the characteristic variety corresponding to outgoing bicharacteristics" — the precise semiclassical statement uses Melrose's scattering calculus or the radial-set formalism of Vasy; "outgoing half" is shorthand. Acceptable at this level.
- **Severity.** Medium (Helmholtz ellipticity / characteristic-set conflation).

## §7 Connections (lines 1037–1050)
- **Verified.**
  - Semiclassical $\hbar\to 0$ regime: $\xi$-derivatives weighted by $\hbar$. ✓
  - Analytic wavefront set: exponential decay strengthening of polynomial. ✓
  - FBI–Bargmann transform / second microlocalization. ✓
- **Wrong/dubious.** None.
- **Underspecified.** None.
- **Severity.** None.

---

## Summary table

| Section | Verified | Wrong | Severity |
|---|---|---|---|
| §1 wavefront set | All core defs + 6 examples | — | None |
| §2 ΨDO calculus | Symbol class, principal symbol, composition, adjoint, mapping | Sign on asymptotic series ($i^{|\alpha|}$ vs $(-i)^{|\alpha|}$); same sign in widget readout | Low |
| §3 propagation | Char, Ell, Hamilton, Hörmander, light rays | Sign on $\sigma(\Box)$ vs adopted convention | Low–medium |
| §4 elliptic regularity | Parametrix, smoothing, bootstrap, $H^{s+m}$ gain | Sign on $\sigma(-\Delta)$ vs adopted convention | Low |
| §5 FIO | Phase, $C_\phi$, $\Lambda$, propagation, half-wave propagators | — | None |
| §6 applications | Sommerfeld, Radon canonical relation, limited-angle | Helmholtz "non-elliptic" conflates principal-symbol vs semiclassical | Medium |
| §7 connections | Semiclassical, analytic WF, FBI | — | None |

## Highest-priority fixes

1. **Reconcile the $D=-i\partial$ convention with the wave / Laplace symbol signs in §3 and §4.** With the convention as stated in §2, $\sigma(-\Delta) = +|\xi|^2$ and $\sigma(\Box) = \tau^2 - |\xi|^2$. The page currently displays the opposite signs in both places. Fix is one character per occurrence.
2. **Composition asymptotic series coefficient (§2).** Change $i^{|\alpha|}/\alpha!$ to $(-i)^{|\alpha|}/\alpha!$ (or rewrite as $\sum (1/\alpha!)\partial_\xi^\alpha p\,D_x^\alpha q$). Also fix the symbol-widget readout `i ∂_ξ p₁ · ∂_x p₂` → `-i ∂_ξ p₁ · ∂_x p₂` (or equivalent).
3. **Helmholtz ellipticity wording (§6).** Either (a) note explicitly that "non-elliptic on $|\xi|=k$" is the *semiclassical* statement, distinct from the strict principal-symbol definition of §3 under which $\Delta+k^2$ is elliptic; or (b) reword to "$\Delta+k^2$ has full symbol vanishing on $|\xi|=k$, the characteristic sphere of scattering theory" without invoking the §3 ellipticity machinery. The quiz Q3 step text needs the matching tweak.

No structural / theorem-level errors. No erroneous WF computations. The corpus of pseudo-locality, elliptic regularity, propagation, FIO/Lagrangian, and Radon material is all correctly stated. The four flagged items are sign-convention drift between §2's announced convention and §3 / §4 / §6's casual choices.
