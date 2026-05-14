# partial-differential-equations — math correctness audit (2026-05)

**Section:** Analysis

## Verified claims

### Classification (§1)

- **Symmetric form $a u_{xx}+2b u_{xy}+c u_{yy}$, discriminant $b^2-ac$**, sign → type table (lines 267–275) — standard, correct.
- **Characteristic ODE** $a\,dy^2-2b\,dx\,dy+c\,dx^2=0$ → $\lambda=(b\pm\sqrt\Delta)/a$, real iff $\Delta\ge 0$ (line 279) — correct.
- **Wave slopes $\pm 1/c$**, **heat degenerate $t=$const family** — correct.
- **Widget characteristic code** (lines 366–414): general / $a=0$ / $a=b=0$ branches plus parabolic-single-root, hyperbolic-two-root logic — correct.

### Heat equation (§2)

- **Heat kernel** $K_t(x)=(4\pi t)^{-n/2}e^{-|x|^2/4t}$ (line 460): $\partial_t K=K[-n/2t+|x|^2/4t^2]=\Delta K$. Correct.
- **Smoothing / infinite propagation / parabolic max principle** — correct.
- **Step solution** $u=\tfrac12(1+\mathrm{erf}(x/2\sqrt t))$ (line 525): substitute $z=(y-x)/\sqrt{4t}$ in $\int_0^\infty K_t(x-y)dy$. Correct.
- **Width $\sigma=\sqrt{2t}$** ($K_t\propto e^{-x^2/2\sigma^2}$, $\sigma^2=2t$) — correct.
- **A&S 7.1.26 erf coefficients** (lines 533–534) match Abramowitz–Stegun.

### Wave / d'Alembert (§3)

- **Operator factorisation** $\partial_t^2-c^2\partial_x^2=(\partial_t-c\partial_x)(\partial_t+c\partial_x)$ — correct.
- **d'Alembert** $u=\tfrac12[f(x-ct)+f(x+ct)]+\tfrac{1}{2c}\int_{x-ct}^{x+ct}g\,ds$ (line 617) — correct.
- **Backward light cone, finite speed, sharp Huygens odd $n\ge 3$** (line 622) — correct.
- **Widget split** $\tfrac12 f(x\mp ct)$ summed (lines 684–688) — d'Alembert with $g=0$.

### Laplace (§4)

- **Mean-value (sphere & ball forms), strong max principle, Dirichlet uniqueness** (lines 729–732) — correct.
- **Poisson kernel** $P_r(\alpha)=(1-r^2)/(1-2r\cos\alpha+r^2)$ with $\tfrac{1}{2\pi}$ integral (lines 736–737); $\int_{-\pi}^{\pi}P_r=2\pi$, concentrates at $\alpha=0$. Correct.
- **Neumann compatibility** $\int_{\partial\Omega}g\,dS=0$, unique up to constant — correct.
- **Widget**: midpoint quadrature of $u(0)=(1/2\pi)\int g$ (lines 868–878) — correct.

### Weak solutions (§5)

- **Weak form** $\int\nabla u\cdot\nabla v=\int fv$, **$H^1_0$**, **boundedness** (Cauchy–Schwarz), **coercivity** $\|\nabla u\|_{L^2}^2\ge C\|u\|_{H^1}^2$ via Poincaré (lines 892–897) — correct.
- **Galerkin → $Ac=b$** p.d., density ⇒ $u_n\to u$ in $H^1_0$ (lines 900–902) — correct.
- **Widget**: $u=x(1-x)$ ⇒ $-u''=2$; $\langle f,\phi\rangle=\int_0^1 2\sin\pi x\,dx=4/\pi$, equals $a(u,\phi)$ by IBP. Correct.

### Lax–Milgram / regularity / embedding (§6)

- **Lax–Milgram** + estimate $\|u\|\le\alpha^{-1}\|\ell\|$ (lines 1046–1051) — correct.
- **Interior regularity** $f\in H^k_{\rm loc}\Rightarrow u\in H^{k+2}_{\rm loc}$, bootstrap to $C^\infty$ — correct.
- **Sobolev table**: subcritical $p^*=np/(n-kp)$; critical $L^q\;\forall q<\infty$ (BMO at edge); supercritical $C^{0,\gamma}$ with $\gamma=k-n/p\bmod 1$ — correct.
- **Embedding widget**: `pstar=(n*p)/(n-k*p)`, `gamma=k-n/p`, critical line $kp=n$, sub/super shading — all correct.

### Quiz bank

All 18 questions across the 6 concepts mathematically correct: classification arithmetic ($u_{xx}+4u_{xy}+3u_{yy}$: $b=2,c=3,b^2-ac=1>0$ → hyperbolic ✓), heat-kernel formula and $\sigma=\sqrt{2t}$ width, parabolic-boundary max, d'Alembert with $g=0$, finite speed, sharp Huygens odd-$n$, Poisson integral on disk, Neumann compatibility $\int g\,dS=0$, $H^1_0$ home, weak form, Galerkin, continuous+coercive Lax–Milgram, two-derivative gain, $H^k\hookrightarrow C^0$ when $k>n/2$.

## Wrong / dubious claims

- **§1 widget "Tricomi" preset is mis-named** (line 343). True Tricomi is $y\,u_{xx}+u_{yy}=0$ with sign-flipping discriminant $-y$; the preset $(0.5,0,1)$ is constant-coefficient elliptic ($\Delta=-0.5$), losing the *defining* mixed-type property. The constant-coefficient template can't represent Tricomi at all — re-label as "elliptic example: $\tfrac12 u_{xx}+u_{yy}=0$". **Severity: misleading label, not a numeric error.**

- **§1 widget "Heat" preset/display mismatch** (line 342, dropdown line 289, readout line 433). Stored $(1,0,0)$ renders the template as $u_{xx}=0$, but the dropdown labels it "Heat: $u_{xx}-u_t=0$". The first-derivative-in-time term is unencodable in the pure second-order template. Discriminant tag is still "parabolic" and characteristics ($t=$const if $y$↔$t$) match heat, but the readout never shows the $-u_t$. **Severity: minor presentation gap.**

## Underspecified or unverifiable claims

- **Kirchhoff formula not present.** Audit prompt asks for it; page only states Huygens qualitatively. Gap relative to spec, nothing to verify.
- **§6 "symmetric Lax–Milgram = Riesz"** (line 1051): standard pedagogical shorthand — strictly, $a$ symmetric coercive defines an *equivalent* inner product on which Riesz applies. Not an error.
- **§6 supercritical row** only $C^{0,\gamma}$, not the full $C^{m,\gamma}$ ladder ($m=\lfloor k-n/p\rfloor$). Deliberate simplification.
- **§3 Huygens** addresses odd $n\ge 3$ vs. even $n$ but omits $n=1$ (also non-sharp).

## Severity

**Two minor presentation issues, no math-substance errors.** Both defects are §1 widget preset labels (Tricomi mislabel, Heat preset/label mismatch); neither affects classification logic or computed output. All §§1–6 prose mathematics — discriminant classification, characteristic ODE, heat kernel and width, smoothing/infinite-speed/max-principle trio, d'Alembert with cone dependency and Huygens, mean-value property, Poisson kernel + disk Dirichlet uniqueness, Neumann compatibility, $H^1_0$ weak formulation, Lax–Milgram, interior elliptic regularity, full Sobolev embedding table — checks out. All five widget numerical computations and all 18 quiz answers are correct.
