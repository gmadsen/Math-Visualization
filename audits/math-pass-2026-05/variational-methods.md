# variational-methods — math correctness audit (2026-05)

**Section:** Analysis

## Verified claims

### Functional derivative (§1)

- **Dirichlet energy** (line 267): $J(u)=\tfrac12\int_\Omega|\nabla u|^2\,dx$ on $H^1_0(\Omega)$ — standard.
- **Gateaux directional derivative formula** (line 272) and Dirichlet specialisation $\langle J'(u),h\rangle=\int\nabla u\cdot\nabla h$ (line 274) — correct, derivation via expanding $|\nabla(u+\varepsilon h)|^2$ is sound.
- **Fréchet differentiability** (line 279) with $o(\|h\|)$ remainder uniform in direction; "Fréchet implies Gateaux, converse fails" — correct.
- **Density notation** $\delta J/\delta u(x)$, with $-\Delta u$ for Dirichlet after one IBP — correct.
- **Widget** computes $\langle J'(u),h\rangle = p\int u^{p-1}h\,dx$ for $J=\int u^p$ (line 345) — correct (chain rule on $u^p$).
- **Quiz vm-functional-derivative**: Q1 answer $\int u'h'$ ✓; Q2 Fréchet uniformity ✓; Q3 $\delta J/\delta u=3u^2$ at $u=2$ gives $12$ ✓.

### Euler–Lagrange (§2)

- **EL derivation** (lines 442–447): $\frac{d}{dx}\partial_{u'}L = \partial_u L$ via IBP on the second term and the fundamental lemma — correct, standard.
- **Brachistochrone Lagrangian** $L=\sqrt{1+(y')^2}/\sqrt{2gy}$, no explicit $x$, so Beltrami $L - y'\partial_{y'}L = C$ holds — correct. Cycloid $x=r(\theta-\sin\theta)$, $y=r(1-\cos\theta)$ — correct.
- **Widget cycloid solver**: ratio $(\theta-\sin\theta)/(1-\cos\theta)=2$ to hit $(2,1)$, then $r=1/(1-\cos\theta_{\text{end}})$ — algebraically correct.
- **Travel-time integral** $\int\sqrt{(dx^2+dy^2)/(2gy)}$ with $g=1$ — correct.
- **Quiz vm-euler-lagrange**: Q1 Beltrami ✓; Q2 EL form ✓; Q3 $u''=u$ with BC gives $u(x)=\sinh x/\sinh 1$, $u(1/2)=\sinh(0.5)/\sinh(1)\approx 0.5211/1.1752\approx 0.4434$ ✓.

### Direct method (§3)

- **Three Tonelli ingredients** (lines 643–645): coercivity, reflexivity (Banach–Alaoglu), weak lsc — correct.
- **Convexity ⇒ weak lsc** (line 653): $F$ convex = sup of affine minorants; supremum of weakly continuous = weakly lsc — standard.
- **Widget minimising sequence** $u_k(x)=x+\sin(k\pi x)/k$: $u_k'=1+\pi\cos(k\pi x)$, so $\int(u_k')^2 = 1 + 0 + \pi^2/2 \approx 5.935$ for all $k\ge 1$ (cross term integrates to $0$ over a full period). Weak limit $u(x)=x$ has $J(u)=1<5.935=\liminf J(u_k)$ — strict inequality, lsc satisfied ✓.
- **Quiz vm-direct-method**: Q1 strict convexity is uniqueness, not existence ✓; Q2 constant invariance kills coercivity on $H^1$ without BC ✓; Q3 $-\int(u')^2$ is concave, hence weakly upper-semicontinuous ✓.

### Mountain-pass (§4)

- **Statement** (lines 779–786): $(MP_1)$, $(MP_2)$, $(PS)$, and $c=\inf_\gamma\max_t J(\gamma(t))$ — correct Ambrosetti–Rabinowitz formulation.
- **Subcritical semilinear** $-\Delta u=|u|^{p-2}u$ for $p<2^*$, with $J=\tfrac12\int|\nabla u|^2-\tfrac1p\int|u|^p$ — correct (Sobolev compact embedding gives PS in subcritical regime).
- **Widget landscape** $J(x,y)=(x^2-1)^2+y^2-0.4x$. Critical points: $\partial_x J = 4x^3-4x-0.4=0$, $\partial_y J=2y=0$. Real roots $\approx -0.954, -0.101, 1.055$ ✓. $J_{xx}=12x^2-4$: positive at $x\approx\pm 1$ (valleys), negative at $x\approx -0.10$ (saddle) ✓. Saddle value $J(-0.101,0)\approx (0.0102-1)^2 + 0 + 0.0404 \approx 0.980 + 0.040 \approx 1.020$.

### Isoperimetric (§5)

- **Inequality** $4\pi A\le L^2$ (line 999) with equality iff disk — correct.
- **Variational setup** (lines 1004–1008): area as $\tfrac12\oint(x\,dy-y\,dx)$ ✓; first variation $\delta A=\int h\,ds$ along normal $h$ and $\delta L = \int\kappa\,h\,ds$ — sign-convention-correct (with inward normal $h$ flipped, this is the standard formula); stationarity ⇒ $\kappa\equiv\lambda$, hence circle ✓.
- **Bonnesen** $L^2-4\pi A\ge\pi^2(R-r)^2$ — correct standard form.
- **Widget** $r(\theta)=1+a\cos(n\theta)$: shoelace area, finite-difference perimeter — correct numerical computation. $a=0$ gives $A=\pi$, $L=2\pi$, defect $=0$ ✓.
- **Quiz vm-isoperimetric**: Q1 ✓; Q2 $A=L^2/(4\pi)=100/(4\pi)\approx 7.9577$ ✓; Q3 Lagrange-multiplier derivation of $\kappa=\lambda$ ✓.

### Applications (§6)

- **EL dictionary** (lines 1130–1135): geodesics from energy, $H=0$ for minimal surfaces, $\Delta^2 u=0$ for biharmonic, $d_A^*F_A=0$ for YM, $-\Delta\phi+V'(\phi)=0$ for scalar fields, $\tau(\phi)=0$ for harmonic maps — all correct standard EL equations.
- **Minimal-surface equation** $\nabla\cdot(\nabla u/\sqrt{1+|\nabla u|^2})=0$ — correct.
- **Yang–Mills**: $F_A=dA+A\wedge A$, $YM(A)=\int|F_A|^2$, EL is $d_A^*F_A=0$, Bianchi $d_AF_A=0$ holds automatically, self-dual $F_A=*F_A$ are absolute minima in 4D — all correct.
- **Geodesic widget**: great circle via slerp, length $=\omega=\arccos(A\cdot B)$ on unit sphere ✓; latitude-arc length $=\cos(\bar\phi)|\Delta\lambda|$ ✓.
- **Quiz vm-applications**: Q1 energy vs arc-length (energy fixes parametrisation) ✓; Q2 $H=0$ ✓; Q3 $d_A^*F_A=0$ ✓.

## Wrong / dubious claims

- **"Plateau, 1931; Douglas, 1939" earning "the first Fields Medal"** (line 1144). Wrong dates and a misattribution. Joseph Plateau (1801–1883) the physicist did not prove anything in 1931; the existence proof for Plateau's problem was given independently by **Jesse Douglas** and **Tibor Radó** in **1930–1931**. Douglas was awarded one of the **first two** Fields Medals in **1936** (jointly with Lars Ahlfors), not "1939". Suggested fix: "Existence in full generality (Douglas and Radó, 1930–31) earned Douglas one of the first two Fields Medals (1936)."

## Underspecified or unverifiable claims

- **Brachistochrone year** "Bernoulli's 1696 challenge" (line 451) vs quiz "Bernoulli's celebrated 1697 answer" (vm-euler-lagrange Q1 explain). Both are defensible: Johann Bernoulli posed the problem in June 1696 and published the solution in 1697. Minor inconsistency, not an error.
- **Sign of $\delta L$** (line 1007). Stated as $\delta L=\int\kappa\,h\,ds$. With $h$ the *outward* normal coefficient, the standard formula is $\delta L=-\int\kappa\,h\,ds$ (inward bulge shortens length when $\kappa>0$). The page absorbs the sign into the multiplier convention; the conclusion $\kappa=\lambda$ const is correct either way.
- **"For $G$ abelian"-style scope drift in widget readout** at line 764: `Jk>J0?"lsc holds":"contradiction"` — fine for $k\ge 1$ since $J_k\to 1+\pi^2/2$, but at $k=0$ the page suppresses output via the `k===0?"":...` ternary, so no issue surfaces. Cosmetic.
- **Free-of-boundary lsc claim** (Q3 of vm-direct-method): "the fourth ($\int\sqrt{1+(u')^2}$) is convex" — correct since $\xi\mapsto\sqrt{1+\xi^2}$ is convex; this is the relevant property, the parenthetical "concave-up integrand in $u'$" is consistent.
- **"Convexity… is the standard sufficient condition for weak lsc on $W^{1,p}$"** (line 650) implicitly invokes Tonelli's theorem; technically convexity *in the gradient slot* (quasi-convexity in the multidimensional case) is the precise statement. Standard textbook elision.

## Severity

**clean (one factual error to fix).** Mathematical content — EL derivation, Beltrami first integral, Tonelli direct-method ingredients, mountain-pass statement, isoperimetric variational derivation, Bonnesen inequality, EL-dictionary table, minimal-surface equation, Yang–Mills first variation, every quiz answer/computation — all check out. The widget computations (Dirichlet linear-response, brachistochrone cycloid solver, oscillating minimising sequence, mountain-pass landscape critical-point classification, shoelace area + perimeter, slerp geodesic length, latitude arc length) are all correctly implemented.

The single substantive error is the historical attribution at line 1144: Plateau didn't prove existence in 1931 (he died in 1883), Douglas's 1936 Fields Medal is misdated to 1939, and "the first Fields Medal" elides that the prize was jointly awarded to Douglas and Ahlfors. None of the mathematics is affected.
