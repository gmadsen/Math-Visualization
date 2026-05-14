# mathematical-chaos — math correctness audit (2026-05)

**Section:** Analysis (sequel to dynamical-systems)

## Verified claims

### Sensitive dependence and Lyapunov exponents (§1)

- **Devaney chaos triplet** (line 268): SDIC + topological transitivity + dense periodic orbits — correct as historically stated.
- **Lyapunov exponent** $\lambda(x_0;v) = \lim\tfrac1n\log\|Df^n(x_0)v\|$ (line 269), 1D reduction to $\tfrac1n\sum\log|f'(x_k)|$ (line 270) — correct via chain rule.
- **Oseledec multiplicative ergodic theorem** (1968, line 270): $\le n$ distinct exponents, exists $\mu$-a.e. — standard.
- **$f_4 \to$ tent via $h(x)=\sin^2(\pi x/2)$**, hence $\lambda(4)=\log 2$ (line 272) — correct.
- **Bifurcation values** $r=3$ (period-2), $r\approx 3.449$ (period-4), $r\approx 3.828$ (period-3 onset), $r_\infty\approx 3.5699$ (line 272) — all correct.

### Logistic map and Feigenbaum universality (§2)

- **Cascade** $r_2=1+\sqrt 6\approx 3.4495$, $r_\infty\approx 3.56995$ (line 306) — correct.
- **Feigenbaum constants**: $\delta\approx 4.66920\,16091\ldots$, $\alpha\approx 2.50290\,78750\ldots$ (lines 323–324) — both correct to displayed digits.
- **Universality class** depends only on order of critical point, quadratic gives this $(\delta,\alpha)$, quartic gives different (line 324) — correct (Coullet–Tresser, Feigenbaum).
- **Renormalization operator** $R(g)(x)=-\alpha g(g(-x/\alpha))$ with hyperbolic fixed point $g^*$, single unstable eigenvalue $\delta$ (line 326) — correct schematic.
- **Lanford 1982 computer-assisted proof** for quadratic case (line 326) — correct attribution.
- **Bifurcation widget** (lines 339–433): standard 600-column, 400-burnin-step construction; period-3 window correctly shown opening near $r\approx 3.828$.

### Strange attractors and the horseshoe (§3)

- **Lorenz equations** $\dot x=\sigma(y-x),\ \dot y=x(\rho-z)-y,\ \dot z=xy-\beta z$ (line 451) — correct.
- **Classical parameters** $(\sigma,\beta,\rho)=(10,8/3,28)$ — correct.
- **Three fixed points**: origin + $C_\pm = (\pm\sqrt{\beta(\rho-1)},\pm\sqrt{\beta(\rho-1)},\rho-1)$ (line 452) — verified.
- **Hopf threshold** $\rho_H=\sigma(\sigma+\beta+3)/(\sigma-\beta-1)\approx 24.74$ (line 464) — verified ($24.7368\ldots$).
- **Hausdorff dimension $\approx 2.062$** (line 452) — correct (Kaplan–Yorke from $(\lambda_1,\lambda_2,\lambda_3)\approx(0.9056,0,-14.5723)$ gives $D_{KY}\approx 2.0621$; explicitly verified).
- **Maximal Lyapunov exponent $\approx 0.906$** (line 464) — correct.
- **Tucker 1998/1999** rigorous proof (line 452) — correct (Warwick Tucker, computer-assisted, FoCM 2002).
- **Smale horseshoe** (line 543): stretch vertically by $\mu>2$, compress horizontally by $\lambda<1/2$, fold; invariant Cantor set $\Lambda \cong \{0,1\}^{\mathbb{Z}}$ via itinerary; $f|_\Lambda$ conjugate to two-sided shift — all correct.
- **Periodic orbits of every period** + **dense orbits** in shift (line 543) — correct.

### Symbolic dynamics and topological entropy (§4)

- **Subshift of finite type** definition with transition matrix $A\in\{0,1\}^{k\times k}$, $A_{ij}=1\iff f(A_i)\supset A_j$ (line 662) — correct.
- **Topological entropy formulas**: $h_{\rm top}=\lim\tfrac1n\log\#{\rm Fix}(f^n)=\lim\tfrac1n\log\#\{n\text{-words}\}=\log\rho(A)$ (line 665) — correct for irreducible SFTs (Perron–Frobenius); the $\#{\rm Fix}$ form is the standard "Bowen formula" specialization and matches for the SFT case.
- **Horseshoe**: $A=\binom{1\ 1}{1\ 1}$, $\rho(A)=2$, $h_{\rm top}=\log 2$ (line 666) — correct.
- **Period-3 entropy bound** $h_{\rm top}\ge\log\bigl(\tfrac{1+\sqrt 5}{2}\bigr)$ (line 666) — correct (Block–Coppel; $\approx 0.481$).
- **Variational principle** $h_{\rm top}=\sup_\mu h_\mu$ (line 668) — correct (Goodman / Goodwyn / Dinaburg).
- **Ruelle's inequality** $h_\mu \le \sum_i \max(\lambda_i,0)$ (line 668) — correct.
- **Pesin's formula**: equality iff $\mu$ has absolutely continuous conditionals along unstables (≡ SRB) (line 668) — correct standard statement.
- **Doubling map widget** (lines 685–730): correctly demonstrates $D(0.b_1b_2\ldots_2)=0.b_2b_3\ldots_2$, itinerary = binary expansion, $h_{\rm top}=\log 2$.

### Ergodic theory and SRB measures (§5)

- **Birkhoff's ergodic theorem** (1931): time average = space average $\mu$-a.e. (line 750–751) — correct.
- **Logistic $r=4$ invariant density** $d\mu = \tfrac{1}{\pi\sqrt{x(1-x)}}dx$ (line 752) — correct (arcsine distribution; image of Lebesgue under $\sin^2(\pi y/2)$).
- **SRB definition**: invariant probability with conditional measures along unstable manifolds absolutely continuous w.r.t. unstable Lebesgue (line 754) — correct.
- **Attributions** Sinai 1972 / Ruelle 1976 / Bowen 1975 (line 754) — correct.
- **Physical-measure property**: Lebesgue-a.e. $x$ in basin gives $\tfrac1N\sum f(T^k x)\to\int f\,d\mu_{\rm SRB}$ (line 756) — correct.
- **Ergodic widget** (lines 770–830): doubling/tent → $f_4$ histogram correctly converges to invariant arcsine density; $L^1$ rate $1/\sqrt N$ — correct (CLT scaling).

### KAM theorem and Hamiltonian chaos (§6)

- **Liouville–Arnold**: $n$ Poisson-commuting integrals ⇒ regular compact level sets are tori $T^n$ with linear flow (line 845) — correct.
- **KAM hypothesis**: non-degeneracy $\det\partial^2 H_0/\partial I^2\ne 0$, small smooth $H_1$ (line 847) — correct (Kolmogorov 1954 form).
- **Diophantine condition** $|k\cdot\omega|\ge\gamma|k|^{-\tau}$ (line 848) — correct.
- **Diophantine $\omega$ have positive measure tending to full measure as $\varepsilon\to 0$** — correct.
- **Small-denominator problem defeated by Newton-style super-exponential iteration** — correct.
- **Poincaré–Birkhoff**: resonant tori shatter into elliptic/hyperbolic pairs (line 851) — correct.
- **Chirikov standard map** $p_{n+1}=p_n+K\sin\theta_n,\ \theta_{n+1}=\theta_n+p_{n+1}$ (line 854) — correct standard form.
- **Critical coupling $K_c\approx 0.971635$** for last KAM circle (golden) breakup (line 851, 863, 923) — correct (Greene 1979 residue criterion; MacKay 1982/Mather variational refinement).
- **Golden frequency $\omega = (\sqrt 5-1)/2$** — correct (most badly approximable in continued-fraction sense).

### Sharkovsky's theorem and 1D order (§7)

- **Sharkovsky order** (line 945): $3\triangleright 5\triangleright\cdots\triangleright 2\cdot 3\triangleright 2\cdot 5\triangleright\cdots\triangleright 4\cdot 3\triangleright 4\cdot 5\triangleright\cdots\triangleright 2^n\triangleright\cdots\triangleright 16\triangleright 8\triangleright 4\triangleright 2\triangleright 1$ — correct (canonical form; powers-of-2 tail descends, terminating at $1$).
- **Sharkovsky 1964**: period-$m$ orbit forces orbits of every $n$ with $m\triangleright n$ (line 947) — correct.
- **"Period three implies chaos"** Li–Yorke 1975, preceded by Sharkovsky's stronger result (line 947) — correct historical attribution.
- **Brouwer for fixed point of continuous interval self-map** (line 947) — correct (1D IVT-equivalent argument).
- **Sharkovsky converse**: every initial segment of the order is realized by some continuous $f$ (line 980) — correct.
- **Failure on circle / higher dim / graphs** (line 980) — correct (the proof uses linear order of $\mathbb{R}$ via IVT on a directed graph of intervals).
- **Period-3 window onset $r\approx 3.8284$** (lines 308, 337, 975) — correct ($1+2\sqrt 2 = 3.82843\ldots$, exact saddle-node tangency).

### Quiz bank (cross-check)

- **`mchaos-lyapunov` v1**: q1 (chain-rule sum-of-logs), q2 ($f_4 \Rightarrow \log 2$), q3 (numerical robustness via Oseledec) — all correct.
- **`mchaos-feigenbaum` v1**: q1 ($\Delta_{n-1}/\Delta_n\to\delta$), q2 (universality is order-of-critical-point, not algebraic form), q3 (numeric: $r_6\approx 3.5699$) — all correct.
- **`mchaos-strange-attractors` v1**: q1 (Lorenz Hausdorff $\approx 2.06$ via Kaplan–Yorke), q2 (horseshoe ↔ full 2-shift), q3 (positive Lebesgue measure NOT a strange-attractor property — dissipativity contracts) — all correct.
- **`mchaos-symbolic-entropy` v1**: q1 ($\log\rho(A)$), q2 (Ruelle: $h_\mu\le\sum\max(\lambda_i,0)$), q3 (variational sup) — all correct.
- **`mchaos-ergodic-srb` v1**: q1 (Birkhoff a.e.), q2 (SRB = a.c. conditionals along unstables), q3 (physical = Lebesgue-typical $x$) — all correct.
- **`mchaos-kam` v1**: q1 (Kolmogorov non-degeneracy), q2 (Diophantine $\omega$), q3 (homoclinic tangles + Arnold diffusion in $n\ge 3$) — all correct.
- **`mchaos-sharkovsky` v1**: q1 (terminates at $1$), q2 (Li–Yorke uncountable scrambled set + SDIC), q3 (proof relies on IVT + linear order, fails on circle / higher dim) — all correct.

## Wrong / dubious claims

### 1. (Substantive) Lorenz Hopf is **subcritical**, not "supercritical" — incorrect labeling

Line 464 of `mathematical-chaos.html` (in the Lorenz widget caption):

> Below the **supercritical Hopf** $\rho_H = \sigma(\sigma+\beta+3)/(\sigma-\beta-1)\approx 24.74$ the symmetric pair $C_\pm$ is stable...

The Hopf bifurcation of $C_\pm$ at $\rho_H\approx 24.74$ in the standard Lorenz system is **subcritical**: the unstable limit cycles emerging *below* $\rho_H$ collide with $C_\pm$ at $\rho=\rho_H$ and disappear, leaving $C_\pm$ unstable above. There is no stable periodic orbit born at $\rho_H$. This is the standard textbook conclusion (Sparrow 1982 *The Lorenz Equations*, Ch. 2; Marsden–McCracken; Strogatz §9.3). The first Lyapunov coefficient is positive at $\rho_H$ for the canonical $(\sigma,\beta)=(10,8/3)$.

The subcritical nature is the reason "preturbulence" exists in $\rho\in(24.06, 24.74)$ — the strange invariant set coexists with stable $C_\pm$ before $C_\pm$ destabilize, rather than forming through a smooth limit-cycle genesis.

The widget regime classification at lines 522–527 is *consistent with* subcritical behavior (the "preturbulent" and "coexisting strange invariant set + stable $C_\pm$" regimes between $\rho\approx 13.93$ and $\rho_H\approx 24.74$ are exactly the subcritical-Hopf signature) — only the prose label is wrong.

Fix: replace "supercritical Hopf" with "subcritical Hopf".

### 2. (Minor / dubious) "Lorenz attractor's transverse [structure] looks like a Cantor set in dimension $\approx 0.06$"

Line 543 (just before horseshoe section):

> The Lorenz attractor's geometry is a Cantor-set foliation: locally a 2D surface, transverse to which it looks like a Cantor set in **dimension $\approx 0.06$**.

The number $0.06$ comes from $D_{KY}\approx 2.062$ minus 2 (the surface direction). However, the transverse Cantor structure of the Lorenz attractor is *not* a self-similar Cantor set with a single well-defined Hausdorff dimension; it's the Cantor structure of a non-uniformly expanding 1D quotient, and the transverse fractional dimension is genuinely close to $0$ (the classical estimates give the transverse codim $\sim 10^{-2}$). Quoting "$\approx 0.06$" implies more precision than the literature supports, and Kaplan–Yorke is a Lyapunov-dimension estimate, not a Hausdorff-dimension theorem. Pedagogical loose end; it's the right order of magnitude.

### 3. (Minor) Topological entropy formula `h_top(f) = lim (1/n) log #Fix(f^n)` requires hypotheses

Line 665:

> $h_{\mathrm{top}}(f) = \lim_{n\to\infty}\dfrac{1}{n}\log\#\mathrm{Fix}(f^n) = \lim_{n\to\infty}\dfrac{1}{n}\log\#\{n\text{-words in }\Sigma_A\} = \log\rho(A)$

The first equality (entropy = exponential growth rate of periodic-point counts) is the Bowen / Artin–Mazur "zeta function" formulation and holds for axiom A diffeomorphisms and SFTs, but **fails in general** — there exist continuous maps with positive topological entropy and zero (or no) periodic points, and conversely (e.g., a map whose periodic points proliferate but the topological entropy as Bowen-defined is smaller). Bowen's actual definition is via $(n,\varepsilon)$-spanning / -separated sets. For the SFT context immediately introduced, the formula is correct. Pedagogical shortcut; flag for context, not a substantive error.

## Underspecified or unverifiable claims

- **Devaney's three conditions** (line 268): Banks–Brooks–Cairns–Davis–Stacey (1992) proved that for continuous maps on infinite metric spaces, topological transitivity + dense periodic orbits *implies* sensitive dependence — so the third Devaney condition is redundant in essentially all settings of interest. The page presents the three conditions as independent without flagging this. Not an error; standard pedagogical convention.

- **Stable conjugacy of $f_4$ and tent map via $h(x)=\sin^2(\pi x/2)$** (line 272): the conjugation is a topological semiconjugacy (degree-1, a.e. injective) — strictly a homeomorphism on $[0,1]$ but only $C^0$, not $C^1$ at the endpoints. The Lyapunov exponent is preserved because the conjugation is absolutely continuous w.r.t. the relevant invariant measures. Standard pedagogical phrasing.

- **Cantor-set foliation language** for Lorenz (line 543): the geometric Lorenz model (Guckenheimer–Williams) and Tucker's verification are about a *flow* with a 2D branched manifold and a Cantor structure transverse to the foliation. Saying "locally a 2D surface" elides the branching at the symmetry axis. Pedagogical simplification.

- **"Period 3 implies chaos"** attribution (line 947): the page correctly notes Sharkovsky preceded Li–Yorke by a decade; Li–Yorke independently reproved a special case (period-3) with the additional "scrambled set" content (uncountable SDIC). Conventional and accurate as stated.

- **Standard map $K_c$ as "exact threshold"** (line 863): Greene's residue criterion gives a numerical estimate $K_c\approx 0.971635406$; MacKay 1982 and Mather provide rigorous variational proofs that the golden circle is destroyed for some $K^*$ near this value, but the *exact* numerical value $K_c$ is not closed-form. The page calls it "one of the few exact thresholds" — slightly overstated; it's *one of the few rigorously known to exist* thresholds with a sharp numerical value.

- **Arnold diffusion** (line 851): mentioned only in the "global Arnold-style diffusion" phrasing — the actual Arnold diffusion phenomenon ($n\ge 3$ degrees of freedom, drift along resonance webs) is more subtle than "no invariant circle separates top from bottom" (which is the 2D standard-map cylinder phenomenon, properly called *transport*, not Arnold diffusion). The quiz `mchaos-kam` q3 is more careful, distinguishing homoclinic tangles in $n=2$ from Arnold diffusion in $n\ge 3$. Pedagogical loose end; the body text conflates the cylinder-transport mechanism with Arnold's original construction.

## Severity

**Low–moderate.** One substantive error:

1. **"Supercritical Hopf" at $\rho_H\approx 24.74$ is wrong**; the bifurcation is **subcritical** (unstable limit cycles emerge below $\rho_H$ and collide with $C_\pm$ from below; no stable cycle is born). Easy fix in line 464: change "supercritical" → "subcritical". The widget's regime taxonomy (preturbulent / coexistence) is already consistent with subcriticality; only the label conflicts.

The remaining items are minor pedagogical loose ends: the transverse Cantor dimension $\approx 0.06$ for Lorenz is order-of-magnitude correct but stated with more precision than the literature supports; the Bowen entropy formula via $\#{\rm Fix}(f^n)$ holds for the immediately-discussed SFT setting but not in general; Devaney's three conditions are not strictly independent (Banks et al. 1992); Arnold diffusion is conflated with cylinder transport in one sentence. None affect the body of mathematics presented.

All headline theorem statements (Oseledec multiplicative ergodic, Birkhoff ergodic, Sharkovsky, Li–Yorke, Liouville–Arnold, KAM, Poincaré–Birkhoff, Ruelle inequality, Pesin formula, variational principle) are correct. All numerical constants ($\delta\approx 4.6692$, $\alpha\approx 2.5029$, $r_\infty\approx 3.5699$, $r_2=1+\sqrt 6$, period-3 onset $1+2\sqrt 2\approx 3.8284$, $\rho_H=10\cdot 15.667/6.333=24.737$, Lorenz $D_{KY}\approx 2.06$, maximal Lyapunov $\approx 0.906$, $K_c\approx 0.9716$, golden $\omega=(\sqrt 5-1)/2$, period-3 entropy bound $\log\varphi\approx 0.481$, doubling/$f_4$/tent $\lambda=\log 2$) are correct. Widget computations (Lorenz RK1 integrator with $\sigma=10,\beta=8/3$; bifurcation diagram with 400-step burnin and 140 retained iterates; doubling-map symbolic itinerary; arcsine-density convergence histogram; standard-map cylinder iterates with periodic boundary in $p$ and $\theta$; horseshoe stage stripes with $\lambda\approx 0.42$ thinning) are mathematically faithful. The 7-section quiz bank (v1 tier across all concepts; no hard tier authored) is entirely correct.
