# real-analysis — math correctness audit (2026-05)

**Section:** Analysis

## Verified claims

### Real numbers and completeness (§1)

- **LUB property as the distinguishing property of $\mathbb{R}$ over $\mathbb{Q}$** (lines 275–277): the set $\{q\in\mathbb{Q}: q>0, q^2<2\}$ is bounded above in $\mathbb{Q}$ but has no supremum there — correct standard motivating example.
- **Three equivalent forms of completeness over Archimedean ordered fields** (lines 280–284): LUB ⇔ Cauchy completeness ⇔ nested-interval property — correct.
- **Dedekind cut definition** (line 290): partition $(L,U)$ of $\mathbb{Q}$ with $L$ nonempty, bounded above, downward-closed, no maximum — correct.
- **Cauchy-construction equivalence** (line 290): both constructions yield the same complete ordered field up to ordered-field iso — correct.
- **Archimedean property derivation from completeness** (line 368): if $\mathbb{N}$ were bounded above, $s-1$ would be a smaller upper bound, contradiction — correct.
- **`bestRational` widget search** (lines 309–322): correctly identifies the best lower/upper rational with denominator $\le q$ by floor of $\sqrt 2 \cdot q$ and adjacent integer — correct.

### Continuity on $\mathbb{R}$ (§2)

- **$\varepsilon$–$\delta$ definition** (lines 393–394) — standard, correct.
- **IVT statement and bisection-proof sketch** (line 471); the rationals counterexample $f(q)=q^2-2$ on $\mathbb{Q}\cap[0,2]$ illustrates necessity of completeness — correct.
- **EVT via continuous image of compact** (line 473): continuous images of compact sets are compact, hence closed and bounded in $\mathbb{R}$ — correct.
- **Uniform continuity on compact $K$**, with $f(x)=x^2$ on $\mathbb{R}$ and $f(x)=1/x$ on $(0,1]$ as standard non-uniform-continuity examples on non-compact domains (line 475) — correct.
- **`eps-svg` widget** (lines 411–467): for $f=x^2$ at $a=1$, the actual range over $[a-d, a+d]$ is $[(a-d)^2, (a+d)^2]$ when $a-d\ge 0$ — correctly computed (lines 449–451). The pass/fail check `lo \ge fa-eps` and `hi \le fa+eps` verifies $f([a-d,a+d])\subseteq [f(a)-\varepsilon, f(a)+\varepsilon]$ — correct.

### Differentiation (§3)

- **Best-linear-approximation definition** (lines 506–507): $f(a+h)=f(a)+L(h)+r(h)$ with $|r(h)|/|h|\to 0$ — correct.
- **Chain rule via composition of best linear approximations** (line 606) — correct.
- **MVT statement** (lines 610–611) and Taylor-with-Lagrange-remainder (lines 616–617) — correct standard formulations.
- **MVT widget** (lines 527–602): scans the derivative $F.df$ minus the secant slope for sign change in $[0, 3]$ to locate $c$ — correct numerical bisection. Slopes $f'(x)$ for the three example functions are correct: $\cos x$, $x^2/2 - 1$, $\tfrac12 e^{x/2}$.

### Uniform convergence (§4)

- **Pointwise vs uniform definitions** (lines 645–646) — correct quantifier statements; the swap is precisely what defines the difference.
- **Continuity preservation via $3\varepsilon/3$ argument** (lines 737–739) — correct.
- **Integration swap under uniform convergence** (line 741) — correct standard statement.
- **Weierstrass M-test** (line 743) — correct.
- **`unif-svg` widget**: 
  - $x^n$ on $[0,1]$: pointwise limit is $0$ on $[0,1)$ and $1$ at $x=1$ — discontinuous at $1$, sup $|f_n - f| = 1$ for every $n$, so not uniform — correct.
  - $\sin(nx)/n$ on $[0,\pi]$: $|f_n(x)|\le 1/n\to 0$ uniformly — correct.
  - $f_n(x) = nx(1-x)^n$ on $[0,1]$: max occurs at $x^* = 1/(n+1)$ where $f_n(x^*) = (n/(n+1))^{n+1}$, which approaches $1/e$ from below as $n\to\infty$. Numerically verified ($n{=}1: 0.25$, $n{=}11: 0.352$, $n{=}51: 0.364$, vs $1/e \approx 0.368$). The widget's claim "sup $\to 1/e$" is correct — pointwise but not uniform.

### Riemann integral (§5)

- **Upper/lower Darboux sums** (line 767) — correct.
- **Darboux integral as $\sup L = \inf U$** when they agree (line 768) — correct.
- **Lebesgue's criterion**: bounded $f$ on $[a,b]$ is Riemann-integrable iff its set of discontinuities has Lebesgue measure zero (line 877) — correct.
- **FTC I** (line 881) and **FTC II** (line 883) — correct standard statements.
- **Riemann widget analytic values** (lines 797, 803–804):
  - smooth: $f(x)=(\sin\pi x+1)/2 + x/4$ has $\int_0^1 = 1/\pi + 1/2 + 1/8 \approx 0.9433$. Widget formula matches numerically (0.9433…). ✓
  - step: $f(x)=\lfloor 3x\rfloor/3 + 0.1$ has $\int_0^1 = 0.1 + 1/9 + 2/9 = 0.1 + 1/3 \approx 0.4333$. Widget formula `0.1 + (1/3)*1/3 + (2/3)*1/3` matches. ✓
  - dirichlet-like indicator: declared Riemann-non-integrable; widget'sub `inner` correctly returns $\sup=1$, $\inf=0$ on every interval, giving fixed gap 1.

### Multivariable differentiation (§6)

- **Total derivative as the unique linear $L$ with vanishing relative remainder** (lines 910–911) — correct.
- **Jacobian matrix conventions** (lines 912–913): rows = component gradients, columns = partial-derivative vectors — correct.
- **Counterexample $f(x,y)=xy/(x^2+y^2)$ with $f(0,0)=0$** (line 916): $\partial_x f(0,0) = \lim_{h\to 0}(f(h,0)-0)/h = 0$ (similarly $\partial_y$); along $y=x$, $f(x,x) = x^2/(2x^2) = 1/2 \not\to 0$, so $f$ is not continuous. Verified.
- **$C^1$ implies (totally) differentiable** (line 916) — correct standard sufficient condition.
- **Gradient–directional-derivative formula $D_v f = \nabla f \cdot v$** (line 921), steepest-ascent direction (line 922) — correct.
- **Chain rule** (line 1024): $J_{F\circ G}(a) = J_F(G(a))\cdot J_G(a)$ — correct.

### Multivariable integration (§7)

- **Box volume product, definition of Riemann-integrable on a box** (line 1046) — correct.
- **Fubini (Riemann form)** (lines 1050–1051): correct hypothesis (integrability on box plus integrability of slices); Tonelli reference for nonnegative measurable extension is correct.
- **Change-of-variables formula** with $|\det J_\varphi|$ scaling (line 1057) — correct.
- **Jacobian widget** (lines 1078–1143): determinants for the three maps:
  - polar $(r,\theta)\mapsto (r\cos\theta, r\sin\theta)$: $J = \det\begin{pmatrix}\cos\theta & -r\sin\theta\\ \sin\theta & r\cos\theta\end{pmatrix} = r$ — correct.
  - scale $(u,v)\mapsto (2u, 3v)$: det = 6 — correct.
  - shear $(u,v)\mapsto (u+v^2, v)$: $J = \det\begin{pmatrix}1 & 2v \\ 0 & 1\end{pmatrix} = 1$ — correct.
- Image-area-by-shoelace and `predicted ≈ |det J| · Δu·Δv` matches as $\Delta u, \Delta v \to 0$ — correct mathematical statement of differentiability.

### IFT / implicit function theorem (§8)

- **IFT statement** (lines 1156–1158) and **inverse derivative formula** (line 1158): $J_{F^{-1}}(F(a)) = J_F(a)^{-1}$ — correct.
- **Banach fixed-point sketch** (line 1160) — correct standard proof outline.
- **Implicit FT statement** with the $\partial F/\partial y$ block invertibility hypothesis (lines 1163–1165) — correct.
- **Implicit-differentiation derivative formula** $Dg(x) = -(\partial F/\partial y)^{-1}\cdot(\partial F/\partial x)$ (line 1166) — correct.
- **Reduction to inverse FT via $(x,y)\mapsto (x, F(x,y))$** (line 1166) — correct standard reduction.
- **`ift-svg` widget**:
  - circle: $\partial F/\partial y = 2y \to 0$ at $(\pm 1, 0)$, where IFT fails (curve vertical) — correctly handled.
  - cubic $y^3 + y - x = 0$: $\partial F/\partial y = 3y^2 + 1 > 0$ everywhere, so IFT applies for all $x_0$ — correct, curve is a graph.
  - folium: at origin both partials vanish, IFT fails — correct (self-intersection at the node).
- **Regular-value theorem reference** (line 1297): if $J_F$ has full rank on $F^{-1}(0)$, the level set is a $k$-dim submanifold ($k = N - (N{-}k) = N - \dim$ codomain) — correct.

### Numeric series (§9)

- **Absolute vs conditional convergence** (line 1318), Riemann rearrangement theorem reference — correct.
- **Convergence-test list** (lines 1322–1326): comparison, ratio, root, integral, Abel/Dirichlet — all correctly stated, including "root strictly stronger than ratio" (which follows from $\limsup |a_n|^{1/n} \le \limsup |a_{n+1}/a_n|$).
- **`ratio-svg` widget limits** (lines 1366–1391): all six families have correct ratio limits:
  - $1/n^p$: ratio $\to 1$.
  - $1/n!$: ratio $= 1/(n+1) \to 0$.
  - $n!/n^n$: ratio $= n^n/(n+1)^n \to 1/e$ — verified.
  - $(-1)^n/n$: $|a_{n+1}/a_n| = n/(n+1) \to 1$.
  - $n^n/n!$: ratio $= (1+1/n)^n \to e$.
  - $r^n/n^p$: ratio $\to r$.
- **Rearrangement note** (line 1458): correctly explains why the alternating harmonic can be reordered to any sum (positive and negative subseries both diverge).

### Power series (§10)

- **Cauchy–Hadamard formula $1/R = \limsup |c_n|^{1/n}$** (line 1480) — correct.
- **Uniform convergence on compact subsets of the open disk via M-test** (line 1481) — correct.
- **Term-by-term differentiation preserves $R$** (line 1579) — correct (standard consequence of Cauchy–Hadamard plus $n^{1/n} \to 1$).
- **`pseries-svg` widget coefficients** (lines 1508–1512):
  - exp $\sum x^n/n!$: $c_n = 1/n!$ — correct.
  - sin $\sum (-1)^n x^{2n+1}/(2n+1)!$: code generates $c_n = (-1)^{(n-1)/2}/n!$ for odd $n$, 0 for even — correctly produces $\sin x$ series.
  - cos $\sum (-1)^n x^{2n}/(2n)!$: code generates $c_n = (-1)^{n/2}/n!$ for even $n$, 0 for odd — correct.
  - geom $\sum x^n = 1/(1-x)$ for $|x|<1$ — correct.
  - log $\sum (-1)^{n+1} x^n/n = \ln(1+x)$: code yields $c_n = (-1)^{n+1}/n$ for $n\ge 1$ — correct.

### Metric completeness & Baire (§11)

- **$(0,1)$ homeomorphic to $\mathbb{R}$ but not complete** (line 1592) — correct (completeness is metric, not topological).
- **Cauchy-class completion construction** (line 1592) — correct.
- **Nowhere-dense / meager definitions** (line 1596) — correct.
- **Baire category theorem statement** (line 1596) and equivalent formulation about countable intersections of open dense sets (line 1596) — correct.
- **Baire fails on $\mathbb{Q}$ because $\mathbb{Q}$ is not complete** (line 1682) — correct (singletons in $\mathbb{Q}$ are nowhere dense in $\mathbb{Q}$, since between any two rationals lies another).
- **Baire as the engine of UBP / open-mapping / closed-graph** (line 1598) — correct.

### FTC both parts (§12)

- **Two halves** (lines 1712–1713) — correct (Part I: integration → differentiation for continuous integrands; Part II: evaluation for differentiable $F$ with $F'$ integrable).
- **Cantor function counterexample**: continuous, nondecreasing, $c(0)=0$, $c(1)=1$, $c'=0$ a.e., so $\int_0^1 c'\,d\lambda = 0 \neq 1 = c(1) - c(0)$ (lines 1716, 1824, 2402) — correct standard FTC II failure example.
- **`ftc-svg` widget**: $f(t)=t \Rightarrow F=x^2/2$; $f=\cos t \Rightarrow F=\sin x$; $f=3t^2 \Rightarrow F=x^3$ — all correct antiderivatives.

### Bump functions & mollification (§13)

- **Standard bump $\psi(x) = \exp(-1/(1-x^2))$** is $C^\infty$ on $\mathbb{R}$ (line 1844): all derivatives at $|x|=1^-$ vanish, so extension by 0 is smooth — correct.
- **Polynomials cannot be compactly supported** (line 1845): a polynomial vanishing on a nonempty open interval is identically zero (identity theorem for polynomials) — correct.
- **Mollification convergence**: $f_\varepsilon = f \ast \eta_\varepsilon$ is $C^\infty$, $f_\varepsilon \to f$ in $L^p$ for $1 \le p < \infty$, uniformly on compacts when $f$ continuous (line 1851) — correct.
- **Density of $C^\infty_c$ in $L^p$** for $1 \le p < \infty$ (line 1851 and quiz) — correct (note: this fails for $L^\infty$, where the closure is $C_0$; quiz correctly excludes $L^\infty$).
- **`bump-svg` widget**: bump normalization computed numerically; mollifier $\eta_\varepsilon(x) = \varepsilon^{-1} Z^{-1} \psi(x/\varepsilon)$ integrates to 1 by substitution — correct.
- **$\psi(0) = 1/e$** (line 1938) — correct.
- **Borel's theorem proof outline** in quiz (lines 766–781) — correct standard construction with $\lambda_n$ scaling.

### $C[a,b]$ and Arzelà–Ascoli (§14)

- **$C[a,b]$ is Banach under sup norm** (line 1996), and not Hilbert (parallelogram law fails) — correct.
- **Equicontinuity definition** (line 2000) — correct.
- **Arzelà–Ascoli statement** (line 2002): pointwise bounded + equicontinuous ⇔ relatively compact (in sup norm) — correct.
- **Applications** to Peano existence, Montel, calculus-of-variations existence (line 2004) — correct standard pointers.
- **`arz-svg` widget**:
  - shift family $\sin(x + n\pi/20)$: all members are 1-Lipschitz (uniform derivative bound 1), so equicontinuous — correct.
  - power family $x^{1+1/n}$ on $[0,1]$: derivative $(1+1/n) x^{1/n}$ is bounded by $1+1/n \le 2$, so uniformly Lipschitz constant 2, equicontinuous — correct.
  - $\sin(nx)$ on $[0,\pi]$: $|f'| = n|\cos(nx)|$ unbounded as $n\to\infty$; for any $\delta$, $\omega(\delta)$ stays near 2 — not equicontinuous, no convergent subseq — correct.
- **Boundedness independence note** (line 2090): $f_n = n$ constant family is equicontinuous (every $\delta$ works) but not pointwise bounded — correct.

### Bounded variation (§15)

- **Total variation definition** (lines 2106–2108) — correct.
- **Monotone $\Rightarrow$ TV $= |f(b)-f(a)|$, piecewise monotone $\Rightarrow$ BV** (line 2111) — correct.
- **$x\sin(1/x)$ on $(0,1]$ is continuous but not BV** (line 2111): at $x_k = 2/((2k+1)\pi)$ the values $|f(x_k)| = 2/((2k+1)\pi)$ alternate signs; partial-sum increments are $\sim 1/(2k+1)$, summing to $+\infty$. Numerically verified (TV grows under uniform refinement). Correct.
- **Jordan decomposition theorem** (line 2240): $f \in \mathrm{BV}$ iff $f = g_1 - g_2$ with $g_i$ nondecreasing; canonical via $g_1(x) = V_a^x(f)$ — correct.
- **Lebesgue-monotone-differentiability transferred to BV via Jordan** (line 2244) — correct.
- **`bv-svg` widget refTVs**: $x^2$ on $[0,1]$ has $V = 1$ (monotone); step function with values $0.1, 0.8, 0.4$ has $V = 0.7 + 0.4 = 1.1$ — both correct.

### Absolute continuity (§16)

- **AC definition** (lines 2262–2263) — correct.
- **Lebesgue's FTC** (line 2267): $f$ AC ⇔ $f' \in L^1$ a.e. and $f(x) = f(a) + \int_a^x f'$ — correct.
- **Lipschitz $\subsetneq$ AC** (line 2271): the AC sum is bounded by $L \sum (b_k - a_k)$ — correct.
- **AC $\subsetneq$ BV $\cap C$** (line 2271): AC functions are uniformly continuous (one-interval AC test) and have finite variation; the Cantor function is BV $\cap C$ but not AC — correct.
- **Cantor function widget pedagogical conclusion**: $c$ continuous, monotone, $c(0)=0$, $c(1)=1$, $c'=0$ a.e., so $\int_0^1 c' = 0 \ne 1$ (line 2402) — correct.
- **Bridge to Radon–Nikodym** (line 2404): AC functions ↔ indefinite integrals of $L^1$ functions; Cantor function carries a singular continuous measure — correct.

### Vitali covering lemma (§17)

- **Vitali cover definition** (line 2416): every $x \in E$ in arbitrarily short intervals — correct.
- **Vitali finite 3-times covering lemma** (line 2418): greedy disjoint subcollection whose triples cover the union; constant 3 in 1D, constant 5 for balls in $\mathbb{R}^n$ (line 2420) — correct.
- **Greedy proof outline** (line 2420) — correct (longest-first; any discarded interval lies inside the triple of the chosen one).
- **Coverage ratio bound $L/|U| \ge 1/3$** (line 2515) — correct, equivalent to $|U| \le 3L$.
- **Vitali a.e.-form** (line 2537): countable disjoint subfamily covers $E$ except for a null set — correct.

### Lebesgue differentiation (§18)

- **LDT statement** (lines 2556–2557): for $f \in L^1_{\mathrm{loc}}(\mathbb{R})$, the average over $[x-r, x+r]$ converges to $f(x)$ a.e. — correct.
- **Hardy–Littlewood maximal function definition and weak (1,1) bound** (lines 2560–2561) — correct standard inequality.
- **Density-point form** (line 2668): a.e. $x \in E$ is a density point of $E$ — correct (LDT applied to $\mathbf{1}_E$).
- **Monotone differentiability a.e. with $\int g' \le g(b) - g(a)$, equality iff AC** (line 2669) — correct.
- **Strong Lebesgue points: $\lim \frac{1}{2r}\int_{x-r}^{x+r} |f(t) - f(x)|\,dt = 0$ a.e.** (line 2670) — correct (the Lebesgue-point condition in its strong form).
- **`ldt-svg` widget**: averages of $\mathbf{1}_{[0.3, 0.7]}$ converge to $f(x)$ except at the jumps $0.3, 0.7$ where the average $\to 1/2$ (the midpoint). Quiz numeric for $\mathbf{1}_{[0,1]}$ at $x=1$: small-$r$ average $= r/(2r) = 1/2$ — correct.

### Quiz bank (cross-check)

- **`real-numbers` v1 q1**: LUB property — correct.
- **`real-numbers` v1 q2**: $\sup\{1 - 1/n\} = 1$ — correct.
- **`real-numbers` v1 q3**: Cauchy completeness ⇔ Cauchy sequences converge — correct.
- **`real-numbers` hard q1**: standard 3-step Cauchy-implies-convergent proof order — correct.
- **`real-numbers` hard q2**: $\sqrt 3 \notin \mathbb{Q}$, so 0 rational solutions to $x^2 = 3$ — correct.
- **`real-continuity` v1 q1 (IVT)**, **q2 ($\delta = \varepsilon/2 = 0.005$ for $f=2x+3$)**, **q3 (continuous $\not\Rightarrow$ differentiable)** — all correct.
- **`real-continuity` hard q1 (Cauchy proof ordering)**, **q2 ($|x|<\sqrt{\varepsilon}=0.01$ for $f=x^2 \sin(1/x)$)**, **q3 (IVT proof completion via continuity at $\sup S$)** — all correct.
- **`real-differentiation` v1 q1**: MVT $c$ for $f=x^3$ on $[0,3]$: $3c^2 = 9 \Rightarrow c = \sqrt 3 \approx 1.732$ — correct.
- **`real-differentiation` v1 q2 (best-linear-approximation interpretation)**, **q3 (Lagrange remainder $0.001/6 \approx 1.667\cdot 10^{-4}$)** — correct.
- **`real-differentiation` hard q1 (auxiliary-function MVT proof)**, **q2 ($e/2 \approx 1.35914$)** — correct.
- **`uniform-convergence` v1 q1, q3** correct; **q2** ($\sum 1/n^2 = \pi^2/6 \approx 1.6449$) — correct.
- **`uniform-convergence` hard q1** (uniform $\Rightarrow$ pointwise but not conversely) — correct; **q2** ($\sum (1/2)^n/n = -\ln(1 - 1/2) = \ln 2 \approx 0.6931$) — correct.
- **`riemann-integral` v1 q1 (Dirichlet not Riemann-integrable), q2 ($\int_1^2 (3x^2-1) = 6$), q3 ($U-L = 1/n = 0.1$ at $n=10$)** — all correct.
- **`riemann-integral` hard q1 (FTC I via MVT-for-integrals proof order)** — correct.
- **`multivariable-differentiation` v1 q1, q2 ($D_v f = 6/\sqrt 2 = 3\sqrt 2 \approx 4.2426$), q3 (partials don't imply continuity)** — all correct.
- **`multivariable-differentiation` hard q1**: counterexample $f = x^2 y/(x^4 + y^2)$ — verified directional derivatives all 0 yet $f(x, x^2) = 1/2$, hence not continuous — correct.
- **`multivariable-differentiation` hard q2**: mixed partial = 2 — correct (and Clairaut equality holds).
- **`multivariable-integration` v1 q1 ($4\pi \approx 12.566$), q2 (Fubini hypotheses), q3 (det = 6)** — all correct.
- **`multivariable-integration` hard q1**: Fubini counterexample $(x^2 - y^2)/(x^2+y^2)^2$ on $[0,1]^2$, with one iterated $= \pi/4$ and the other $= -\pi/4$ — correct (verified by direct computation: $\int_0^1 (x^2 - y^2)/(x^2+y^2)^2 \, dx = -1/(1+y^2)$, then integrated gives $-\pi/4$; symmetric swap gives $+\pi/4$).
- **`multivariable-integration` hard q2**: $\iint_D x \, dA = 1/3$ over the triangle $0 \le y \le x \le 1$ — correct.
- **`inverse-function-theorem` v1 q1, q2 ($-1/\sqrt 3 \approx -0.5774$), q3** — all correct.
- **`inverse-function-theorem` hard q1 (proof-step order)** correct; **q2 ($|\det J_F(1,1)| = 8$ for $F=(x^2-y^2, 2xy)$)** — correct.
- **`numeric-series` v1 q1 ($\sum 1/n!$ via ratio test), q2 ($L = 0$ for $3^n/n!$), q3 (alternating harmonic conditionally convergent)** — all correct.
- **`numeric-series` hard q1**: oscillating-ratio counterexample — verified ratios oscillate between 1 and 1/4, $|a_n|^{1/n} \to 1/2$. Correct.
- **`numeric-series` hard q2**: Abel summation steps in the standard order — correct.
- **`power-series-real` v1 q1 ($R = 1$), q2 ($R = \infty$ for $\sum x^n/n!$), q3 ($n^{1/n} \to 1$)** — all correct.
- **`power-series-real` hard q1 (boundary behavior at $\pm 1$)**, **q2 (Cauchy–Hadamard proof completion)** — correct.
- **`metric-completeness-baire` v1 q1, q2** correct.
- **`metric-completeness-baire` hard q1**: $\mathbb{Q}$ not complete (Cauchy sequence of rational $\sqrt 2$ approximants has no rational limit) — correct.
- **`metric-completeness-baire` hard q2 (UBP/surjectivity)**: spot-the-error correctly identifies step 4 (surjectivity does not pass to limits) — correct.
- **`ftc-both-parts` v1 q1 ($\int_1^e dx/x = 1$), q2 (Part II for evaluation), q3 ($F'(2) = 12$)** — all correct.
- **`ftc-both-parts` hard q1 (Cantor function FTC II failure), q2 (FTC I proof via MVT-for-integrals)** — all correct.
- **`bump-functions` v1 q1, q2 ($\psi(0) = 1/e \approx 0.3679$), q3 ($C^\infty_c$ dense in $L^p$ for $1 \le p < \infty$)** — all correct.
- **`bump-functions` hard q1 (Borel's theorem construction), q2 ($L^1$ convergence does not imply pointwise — only along a subsequence)** — both correct.
- **`c-space-arzela` v1 q1 (equicontinuity definition), q2 ($C[a,b]$ Banach), q3 ($\max_{[0,1]}(x - x^2) = 1/4$ at $x = 1/2$)** — all correct.
- **`c-space-arzela` hard q1**: spot-the-error correctly identifies that $\{x^n\}$ is not equicontinuous (Lipschitz constants $n$ grow unbounded) — correct.
- **`c-space-arzela` hard q2 (continuous-image-of-compact proof ordering)** — correct.
- **`bounded-variation` v1 q1 ($V_0^{2\pi}(\sin) = 4$ from monotone-pieces sum $1+2+1$)**, **q2 ($x\sin(1/x)$ has $V = +\infty$)** — correct.
- **`bounded-variation` v1 q3 (multi-select)**: Jordan decomposition, a.e. differentiability, and at-most-countably-many discontinuities are correct.
- **`vitali-covering` v1 q1, q2 (max ratio = 3 for the 3-times covering)**, **q3 multi-select (Lebesgue differentiation and a.e. differentiability of monotone functions are valid uses)** — all correct.
- **`lebesgue-differentiation` v1 q1 (a.e. $x$, not every $x$), q2 (limit $= 1/2$ at $x = 1$ for $\mathbf{1}_{[0,1]}$), q3 (multi-select)** — all correct.

## Wrong / dubious claims

### 1. (Substantive) `riemann-integral` hard quiz #2 — incorrect numeric answer

Lines 295–297 of `quizzes/real-analysis.json`:

> Compute $\int_{-1}^1 |x\sin(1/x)|\,dx$ to 4 decimal places. (Hint: the integral equals $2\int_0^1 x|\sin(1/x)|\,dx \approx 0.4538$.)
> `"answer": 0.4538, "tol": 0.005`

The integrand and substitution claim are correct ($f = x\sin(1/x)$ extended by 0 is even in $|f|$), but the numeric value is wrong. Numerical integration (midpoint rule with $N = 10^7$, cross-checked via the substitution $u = 1/x$ giving $\int_1^\infty |\sin u|/u^3\,du$):

```
∫_0^1 x|sin(1/x)|dx ≈ 0.42682
2 × 0.42682 ≈ 0.85364
```

The stated answer 0.4538 (with tolerance 0.005) accepts neither the correct doubled value 0.8536 nor the un-doubled 0.4268. Likely a transcription/computation slip.

### 2. (Substantive) `absolute-continuity` hard ordering quiz — false implication "Hölder ⇒ AC"

Lines 932–949 of `quizzes/real-analysis.json` ask students to order

```
Lipschitz, Hölder C^{0,α} (0<α<1), Absolutely continuous (AC), Bounded variation (BV)
```

from "STRONGEST to weakest", with the explanation:

> Hölder $C^{0,\alpha}$ on a compact interval implies uniform continuity and AC: cover the AC test windows by $\le \sum (b_k-a_k)^\alpha \le N^{1-\alpha}\delta^\alpha$ which $\to 0$ as $\delta \to 0$.

Both the ordering and the proof are wrong:

- **Ordering is wrong.** The Cantor function is the canonical counterexample: it is Hölder of order $\alpha = \log 2/\log 3 \approx 0.6309$ on $[0,1]$, yet not AC (since $c$ is continuous with $c' = 0$ a.e. but not constant — AC plus $f'=0$ a.e. would force constancy). So Hölder $\not\Rightarrow$ AC. In fact Hölder and AC are incomparable on $[a,b]$: there are AC functions that are not Hölder for any $\alpha < 1$ (e.g. the indefinite integral of an unbounded $L^1$ derivative).
- **The hint "proof" is mathematically invalid.** The bound $\sum (b_k - a_k)^\alpha \le N^{1-\alpha} \delta^\alpha$ (Jensen for the concave $x^\alpha$) is correct, but it does not approach 0 as $\delta \to 0$ when $N$ is allowed to grow; the AC definition allows $N$ to be any finite number, so $N^{1-\alpha} \delta^\alpha$ can stay bounded away from 0 by taking $N$ large.

The correct answer would replace "Hölder" with something like "Lipschitz $\subsetneq$ Hölder of order 1 = Lipschitz (incomparable with AC) ; Lipschitz $\subsetneq$ AC $\subsetneq$ BV $\cap C$ $\subsetneq$ BV". The Cantor function (Hölder + BV but not AC) sits in BV $\cap C \setminus$ AC.

### 3. (Substantive) `cantor-svg` AC widget — windows compute the wrong quantity

Lines 2354–2382 of `real-analysis.html`. The widget computes a list of "jump boundaries" between adjacent kept intervals at depth $k$ and, for each window of width $w + (\text{gap width})$ straddling the boundary, **adds `2^{-k}` (the value `b.jump`) to the AC sum**, claiming this is the AC contribution $|c(b_i) - c(a_i)|$.

But across each removed third, $c$ is constant, so $c(\text{right endpoint of left kept}) = c(\text{left endpoint of right kept})$. Numerically verified at depth $k=6$ (using `cantor(x, k+5)` to sample at deeper resolution): for every gap, $c(\text{right}) = c(\text{left})$ exactly. The actual AC contribution of a window $(\text{right} - w/2, \text{left} + w/2)$ is therefore the rise of $c$ on the *tails* of the two adjacent kept intervals, which $\to 0$ as $w \to 0$ (by continuity), not the constant $2^{-k}$.

For depth $k=6$ and $\delta = 0.05$, my reproduction yields:

```
widget claimed AC sum = 0.094 (Σ of "b.jump" over windows used)
actual AC sum across the same windows = 0.172 (≠ 0)
```

Neither value is $2^{-k}$ per window. The two numbers differ from each other, so the widget is *not* showing what its readout text claims.

A correct construction of the AC-failure demonstration would put the disjoint windows *inside* individual kept intervals (each rises by exactly $2^{-k}$, total rise $1$ even with $\sum |I| \le \delta \cdot 2^k \cdot 3^{-k}$ → 0 as depth grows). I verified that placing windows inside the first 36 kept intervals at depth 6 (total length 0.0494 ≤ 0.05) yields AC sum exactly 36/64 ≈ 0.5625 — exactly the kind of growing-with-$k$ contradiction the AC test is supposed to expose.

The pedagogical conclusion ("$c$ fails AC") is correct; the widget's specific numerical demonstration is mathematically incoherent and does not actually exhibit the AC violation it claims.

## Underspecified or unverifiable claims

- **`riemann-integral` widget Dirichlet `inner` returns `{lo:0, hi:1}` always** (line 816). This is right *in the limit* (every subinterval contains both rationals and irrationals densely) but the widget plots only "small-denominator" rationals (denominator $\le 8$), so the SVG drawing is a finite point cloud and not the full $\mathbf 1_{\mathbb Q}$. The pedagogical message ("upper sum stays at 1, lower sum stays at 0, gap stays 1") is correct as a limit statement; the readout phrases it correctly as "every subinterval contains both rationals and irrationals". The widget's `inner` function returning $\{0,1\}$ for *every* sub-interval is a deliberate stand-in for the limiting behavior, not the literal Riemann calculation on the plotted approximation.
- **`bounded-variation` v1 q3 multi-select**: option "BV functions have at most countably many discontinuities, all of jump type" is included in the answer set. Stricter formulation would say "all of *first kind*" (one-sided limits exist), which technically permits removable discontinuities (left limit $=$ right limit $\ne f(x)$) that BV does allow if you modify $f$ on a measure-zero set. Most textbooks elide this and call them "jump", so this is a wording quibble rather than a real error.
- **`metric-completeness-baire` v1 q3** asks "How many such singletons are there in the enumeration?" with `answer: 0, tol: 0.5`. The mathematical answer is "countably infinite"; the explanation admits this and encodes the answer as 0 to mean "not finite", which is a contrived numeric-tolerance hack. Not a math error, but a confusing question that risks being marked wrong by anyone who answers the literal question correctly.
- **`bv-svg` widget**: uniform partitioning under-counts the true TV of $x\sin(1/x)$ because uniform sampling misses the oscillation extrema near 0; the widget's TV "blows up" only slowly (≈ 2.5 at $n=600$, cf. true $V = +\infty$). The page text is honest about this ("infinite TV blows up"), and the widget caption does say "tightening oscillations near 0". Minor pedagogical limitation, not an error.
- **Tensor-Hom / R-Mod monoidal asides**: not applicable to real analysis. (no analog issues here)

## Severity

**moderate.** Three substantive errors:

1. The `riemann-integral` hard quiz numeric answer for $\int_{-1}^1 |x\sin(1/x)|\,dx$ is off by a factor — the stated 0.4538 is neither $2\int_0^1$ (≈ 0.8536) nor $\int_0^1$ (≈ 0.4268). Easy fix: replace `0.4538` with `0.8536` (and the hint with `≈ 0.8536`), or rephrase as $\int_0^1$ with the un-doubled value.
2. The `absolute-continuity` hard ordering puts Hölder strictly between Lipschitz and AC and explicitly defends the false implication "Hölder ⇒ AC". The Cantor function is α-Hölder for α = log2/log3 yet not AC, a textbook counterexample. The whole question and its explanation need to be rewritten — probably by removing Hölder from the chain or recasting it as "which of these chains is correct, with Hölder marked incomparable with AC?".
3. The Cantor `cantor-svg` widget's "AC test" computes a quantity that is not the AC sum it claims to be: across each gap, $c$ is constant, so the widget's `b.jump = 2^{-k}` overcount/undercount has no mathematical relation to the actual AC sum on the displayed windows. The conclusion "$c$ fails AC" is right; the demonstration is wrong. A faithful demonstration should put the disjoint windows inside individual kept intervals.

The narrative prose of all 18 sections is mathematically clean, including all theorem statements (LUB completeness equivalence, IVT, EVT, MVT, Taylor with Lagrange remainder, Weierstrass M-test, Lebesgue's criterion for Riemann integrability, FTC I/II in both Riemann and Lebesgue forms, Fubini, change of variables, IFT, implicit FT, regular-value theorem, Cauchy–Hadamard, Baire category theorem, Arzelà–Ascoli, Jordan decomposition, AC ⇔ Lebesgue FTC, Vitali 3r-covering, Hardy–Littlewood weak (1,1) bound, Lebesgue differentiation theorem, density-point and strong-Lebesgue-point forms). Worked widget computations are correct apart from the Cantor-AC widget. The rest of the quiz bank (v1 + hard tiers across 18 concepts) is correct apart from the two errors flagged above.
