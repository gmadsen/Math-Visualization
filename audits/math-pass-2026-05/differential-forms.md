# Math-correctness audit — `differential-forms.html`

Pass date 2026-05-14. Pedagogy ignored; only mathematical claims checked.

## Verified claims

- **Section 1 (Why forms?).** Definition of $k$-form as alternating multilinear map $T_pM^k\to\mathbb{R}$, table of "object / eats / integrates over" — correct.
- **Section 2 (1-forms, $df$).** $T^*M$ duality, $dx^i(\partial/\partial x^j)=\delta^i_j$, $df=\sum\partial_i f\,dx^i$, intrinsic definition $df_p(v)=v(f)$ — all standard. Widget `w1` evaluates $\omega_p(v)=a v_x + b v_y$ correctly for each preset (incl. `xdy-ydx` evaluated at the basepoint, giving $(-y_p, x_p)=(-0.8, 1.2)$).
- **Section 3 (Wedge, $k$-forms).** Definition $(\alpha\wedge\beta)(v,w)=\alpha(v)\beta(w)-\alpha(w)\beta(v)$ (Spivak/Lee no-$1/2$ convention, internally consistent with widget `w2`'s $c\cdot\det[v|w]$). Antisymmetry, bilinearity, associativity, graded-commutativity $\alpha\wedge\beta=(-1)^{k\ell}\beta\wedge\alpha$, basis $\{dx^{i_1}\wedge\cdots\wedge dx^{i_k}: i_1<\cdots<i_k\}$, $\dim\Omega^k(\mathbb{R}^n)=\binom{n}{k}$, $\Omega^n$ one-dimensional — all correct.
- **Section 4 (Exterior derivative).** Three axioms (extends $d$ on $\Omega^0$; graded derivation $d(\alpha\wedge\beta)=d\alpha\wedge\beta+(-1)^{|\alpha|}\alpha\wedge d\beta$; $d^2=0$) and the coordinate formula $d\omega=\sum_I\sum_j\partial_j\omega_I\,dx^j\wedge dx^I$ — correct. The grad/curl/div dictionary on $\mathbb{R}^3$ (Hodge star $\star dx=dy\wedge dz$, etc.) is verified by hand: $d\omega_X$ produces the correct curl coefficients $(R_y-Q_z, P_z-R_x, Q_x-P_y)$ in basis $(dy\wedge dz, dz\wedge dx, dx\wedge dy)$, and $d(\star\omega_X)=(\nabla\cdot X)\,dx\wedge dy\wedge dz$. Widget `w3` formulas all check out (incl. angle-form $d\omega=0$ via $((r^2-2x^2)+(r^2-2y^2))/r^4=0$).
- **Section 5 (Integration).** Pullback-based definition of $\int_\sigma\omega$, $\mathbb{Z}$-linear extension to chains, orientation-reversal sign — standard.
- **Section 5.1 (Pullback).** $f^*$ contravariance, $f^*(d\omega)=d(f^*\omega)$, $f^*(\omega\wedge\eta)=(f^*\omega)\wedge(f^*\eta)$ — DGA map, all correct.
- **Section 6 (Stokes).** Statement $\int_{\partial M}\omega=\int_M d\omega$ for compact oriented $k$-manifold-with-boundary (induced orientation noted). Specialization table to FTC/Green/classical-Stokes/Gauss is correct in each row. Widget `w4` numerics: hand-computed $\oint_{\partial D}(-y\,dx+x\,dy)=2\pi$ matches $\iint 2=2\pi$; $\oint x\,dy=\pi=\iint 1$; $\oint y^2\,dx=\iint -2y=0$ by symmetry. All four presets internally consistent.
- **Section 7 (de Rham).** Cochain complex, closed/exact, $H^k_{\mathrm{dR}}=\ker d/\operatorname{im} d$, de Rham theorem $H^k_{\mathrm{dR}}(M)\cong H^k(M;\mathbb{R})$ — correct.
- **Poincaré lemma.** Star-shaped open $U\subseteq\mathbb{R}^n\Rightarrow H^k_{\mathrm{dR}}(U)=0$ for $k\ge 1$, proof sketch via radial homotopy operator — correct.
- **Angle form.** $\omega=(-y\,dx+x\,dy)/(x^2+y^2)$ closed but not exact on $\mathbb{R}^2\setminus\{0\}$, $\oint=2\pi$ around origin once, generates $H^1_{\mathrm{dR}}\cong\mathbb{R}$, detects winding — correct. Widget `w5` numerically verifies $\oint=2\pi n$.
- **Cohomology table** ($\mathbb{R}^n$, $S^1$, $S^2$, $T^2$, $\mathbb{R}^2\setminus\{0\}$, $\mathbb{R}^3\setminus\{0\}$) — every entry correct (Künneth for $T^2$, deformation retract for the punctured spaces).
- **Section "Where this connects."** Riemann surface $\Sigma_g$ has $\dim H^1_{\mathrm{dR}}=2g$, Hodge decomposition $H^1=H^{1,0}\oplus H^{0,1}$ with $\dim H^{1,0}=g$ — correct. Maurer–Cartan equation $d\theta+\tfrac12[\theta,\theta]=0$ for left-invariant $\theta$ — correct sign convention. de Rham complex as fine resolution of $\underline{\mathbb{R}}$, Maxwell $d\star J=0$ — correct.

## Wrong / dubious claims

- None of substance.

## Underspecified or unverifiable claims

- **Hodge star definition is asserted, not built up** (line 629). The page uses $\star dx=dy\wedge dz$ etc. on $\mathbb{R}^3$ but never gives a general definition, never states $\star^2=\pm 1$ relation, never introduces the Hodge inner product or the Hodge codifferential. The user-asked items "Hodge star definition; relation to ⋆² = ±1", "Volume form, Hodge inner product" are essentially absent — only the ad-hoc 3D dictionary appears. Volume form is named in passing (line 468) but no orientation discussion ties it to integration of top forms.
- **"Forms on $S^n$, $T^n$" worked examples** — only $S^1$, $S^2$, $T^2$ appear in the table; no general $S^n$ or $T^n$ computation, no construction of generators (e.g. the volume form on $S^n$). This is a gap relative to the audit prompt rather than a wrong claim.
- **Section 6 proof sketch** (line 838) — the partition-of-unity reduction to a cube with one boundary face is correct as a high-level outline; details (sign of induced orientation, vanishing of corner contributions) are glossed but not misstated.

## Structural notes (not math errors but worth flagging)

- Two `<h2>` headings labeled "7." (lines 959 and 1112). The TOC shows §6 mislabeled "1." (`<a href="#pullback">6 1. Pullback…`) and §7/§8 collapsed in numbering. Pure numbering bug; no math content affected.

## Severity

**clean** — every mathematical statement on the page is correct as written. Coverage gaps relative to the audit prompt (Hodge star theory, $\star^2=\pm 1$, Hodge inner product, $S^n/T^n$ examples beyond low dimension) exist but are absences, not errors.
