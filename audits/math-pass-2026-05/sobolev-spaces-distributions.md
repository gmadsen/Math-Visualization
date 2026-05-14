# Math correctness audit — `sobolev-spaces-distributions.html`

Audited 2026-05-14 (read-only). Pedagogy intentionally skipped.
Format per section: **Verified · Wrong/dubious · Underspecified · Severity**.

---

## §1 Test functions and the space of distributions (lines 263–417)
- **Verified.**
  - $\mathcal{D}(\Omega) = C_c^\infty(\Omega)$ with the standard inductive-limit convergence (common compact support + uniform convergence of all $\partial^\alpha$).
  - Model bump $e^{-1/(1-|x|^2)}\mathbf{1}_{|x|<1}$ is the standard $C^\infty$ compactly-supported example.
  - $\mathcal{D}'(\Omega)$ as topological dual; $L^1_{\mathrm{loc}} \hookrightarrow \mathcal{D}'$ via $\phi \mapsto \int f\phi$, injective up to a.e. equality (fundamental lemma of calculus of variations).
  - $\delta_a$ is not regular (cannot concentrate $L^1_{\mathrm{loc}}$ mass on null set). ✓
  - Heaviside $H \in L^1_{\mathrm{loc}}$ ⇒ $\langle H,\phi\rangle = \int_0^\infty \phi$ regular. ✓
  - Principal value $\mathrm{p.v.}\,1/x$ as the continuous extension via $\lim_{\epsilon \to 0^+}\int_{|x|>\epsilon}\phi/x$. ✓ ($1/x \notin L^1_{\mathrm{loc}}(\mathbb{R})$.)
  - **§1 pairing widget**:
    - $\delta_0$: pairing $= \phi(0) = e^{-x_0^2}$ for $|x_0| < 1.5$, else $0$. Code: `phi(0,x0) = exp(-x0²)` for $|x_0| < 1.5$. ✓
    - Heaviside: pairing $= \int_0^\infty \phi$. Midpoint rule with $G=2000$ subintervals on $[-3,3]$ — adequate. ✓
    - $f = 1+x$: regular distribution $\int(1+x)\phi$. (Note: $1+x$ has polynomial growth, so it is also tempered — no issue here.)
- **Wrong/dubious.** None.
- **Underspecified.**
  - The pairing widget's $\phi(x) = e^{-(x-x_0)^2}\mathbf{1}_{|x-x_0|<1.5}$ has a jump discontinuity at the cutoff (it is $C^0$ but not $C^\infty$ at $|x-x_0|=1.5$ since $e^{-1.5^2} \approx 0.105 \ne 0$). For an honest $\phi \in C_c^\infty$ a smooth cutoff would be needed. Standard pedagogical compromise; doesn't change the pairing values shown.
- **Severity.** None.

## §2 Distributional and weak derivatives (lines 418–580)
- **Verified.**
  - Definition $\langle \partial^\alpha T,\phi\rangle = (-1)^{|\alpha|}\langle T,\partial^\alpha\phi\rangle$. ✓
  - Heaviside derivative: $\langle H',\phi\rangle = -\int_0^\infty \phi'(x)dx = \phi(0)$ ⇒ $H' = \delta_0$. ✓
  - $(\log|x|)' = \mathrm{p.v.}\,1/x$ in $\mathcal{D}'(\mathbb{R})$. ✓
  - Weak derivative on intervals: $u \in L^1_{\mathrm{loc}}(a,b)$ has weak derivative $v$ if $\int u\phi' = -\int v\phi$. ✓
  - "Every distribution is $C^\infty$" — informal but standard shorthand for "differentiable to all orders within $\mathcal{D}'$".
  - **§2 weak-derivative widget**:
    - `step` $H$: distributional derivative $\delta_0$, drawn as upward green arrow at origin with both sides at zero. ✓
    - `abs` $|x|$: weak derivative $\mathrm{sgn}(x)$, drawn $-1$ on $x<0$ and $+1$ on $x>0$. ✓ (Continuous, no point mass.)
    - `ramp` $\max(x,0)$: weak derivative $H(x)$, drawn 0 on $x<0$, 1 on $x>0$. ✓
    - `quadstep` $x^2 H(x)$: $C^1$ globally with $f' = 2xH(x)$, drawn $0$ on $x<0$, linear $2x$ on $x>0$. ✓ (Verified: $f$ has value 0, slope 0 at origin, no jump in either.)
- **Wrong/dubious.** None.
- **Underspecified.** None.
- **Severity.** None.

## §3 Sobolev spaces $W^{k,p}$ and $H^s$ (lines 581–715)
- **Verified.**
  - $W^{k,p}(\Omega) = \{u \in L^p : \partial^\alpha u \in L^p, |\alpha| \le k\}$ with norm $(\sum_{|\alpha|\le k}\|\partial^\alpha u\|_p^p)^{1/p}$. ✓
  - $W^{k,p}$ Banach; $H^k = W^{k,2}$ Hilbert with $(u,v)_{H^k} = \sum_{|\alpha|\le k}\int \partial^\alpha u\,\overline{\partial^\alpha v}$. ✓
  - **Membership table (line 595–597)**:
    - $u(x) = x^{1/2}$ on $(0,1)$: $u' = \tfrac12 x^{-1/2}$, $\int_0^1 |u'|^p dx = (1/2)^p \int_0^1 x^{-p/2} dx$ converges iff $p < 2$. ✓
    - $u = \log\log(2/x)$: $u'(x) = 1/(x\log(2/x))$. $\int_0^{1/2}|u'|^p dx$ near $0$: substitution $t = \log(2/x)$ gives $\int dt/t$ at $t \to \infty$, diverges. So $u' \notin L^p$ for any $p \ge 1$. ✓
    - $u = |x-1/2|$: weak derivative $\mathrm{sgn}(x-1/2) \in L^\infty \subset L^p$ on bounded interval ⇒ $\in W^{1,p}$ for every $p$. ✓
  - **Fractional space**: $H^s(\mathbb{R}^n) = \{u \in \mathcal{S}' : (1+|\xi|^2)^{s/2}\hat u \in L^2\}$. ✓
  - $H^t \hookrightarrow H^s$ for $t > s$ on $\mathbb{R}^n$ since $(1+|\xi|^2)^{t/2} \ge (1+|\xi|^2)^{s/2}$. ✓
  - $\Lambda^s u = \mathcal{F}^{-1}[(1+|\xi|^2)^{s/2}\hat u]$ is an isometric isomorphism $H^s \to L^2$ (by definition). ✓
  - **§3 fractional-power widget**:
    - $\int_0^1 \alpha^p x^{p(\alpha-1)}dx$ converges iff $p(\alpha-1) > -1$, i.e. $p < 1/(1-\alpha)$ when $\alpha < 1$. ✓
    - Closed-form value $\alpha^p / (p(\alpha-1)+1)$. ✓
    - For $\alpha \ge 1$ the threshold is automatic ($u' = \alpha x^{\alpha-1}$ bounded on $(0,1)$); code reports "always". ✓
- **Wrong/dubious.** None.
- **Underspecified.** None.
- **Severity.** None.

## §4 Sobolev–Morrey–Rellich embeddings (lines 716–825)
- **Verified.**
  - Sobolev exponent $p^* = np/(n-kp)$ for $kp < n$. ✓
  - **Subcritical** $W^{k,p} \hookrightarrow L^{p^*}$. ✓
  - **Borderline** $kp = n$: $W^{k,p} \hookrightarrow L^q$ for all $q < \infty$, NOT $L^\infty$. ✓ (Trudinger–Moser improvement to exponential integrability.)
  - **Rellich–Kondrachov**: subcritical inclusion is compact for $q < p^*$, never compact at $q = p^*$. ✓
  - **Bubbling counterexample at the endpoint** (line 732): $u_\varepsilon(x) = \varepsilon^{-(n-p)/p}\eta(x/\varepsilon)$ for $W^{1,p} \hookrightarrow L^{p^*}$. Verified: with $\beta = (n-p)/p$, $\|u_\varepsilon\|_{L^{p^*}}^{p^*} = \varepsilon^{-\beta p^* + n}\|\eta\|_{p^*}^{p^*}$ and $n/p^* = (n-p)/p = \beta$ ⇒ bounded. $\|\nabla u_\varepsilon\|_{L^p}^p = \varepsilon^{-(\beta+1)p+n}\|\nabla\eta\|_p^p$ and $-(\beta+1)p+n = -(n-p)-p+n = 0$ ⇒ bounded. ✓
  - **§4 embedding-regime widget**:
    - Subcritical branch ($kp < n$): correct $p^*$ formula and correct compactness condition $q < p^*$. ✓
    - Borderline ($kp = n$): correct prose. ✓
    - Supercritical ($kp > n$): widget computes $\gamma = k - n/p$, then uses `intPart = floor(γ)`, `holderExp = γ - intPart`, reports $C^{intPart, holderExp}$. This is the correct Morrey breakdown for non-integer $\gamma$. ✓
- **Wrong/dubious.** None.
- **Underspecified.**
  - The §4 prose table (line 728) lists Morrey output as "$C^{0,\gamma}$ with $\gamma = k - n/p$ (mod 1)". The "(mod 1)" parenthetical attempts to handle $\gamma > 1$, but the true higher-order statement is $C^{m,\gamma'}$ with $m = \lfloor k - n/p \rfloor$ and $\gamma' = (k-n/p) - m$. The widget output is correct; the prose understates by always writing $C^{0,\gamma}$. Wording slip.
  - The supercritical branch breaks down when $k - n/p$ is exactly an integer (you get $C^{m-1, \alpha}$ for any $\alpha < 1$, not $C^{m,0}$). Edge-case omission, parameter-space measure zero.
- **Severity.** None (Morrey-prose understatement is wording, not error).

## §5 Trace theorem (lines 826–919)
- **Verified.**
  - Pointwise restriction is meaningless on $L^p$ since $\partial\Omega$ has measure zero. ✓
  - **Trace theorem statement**: $\mathrm{Tr}: W^{1,p}(\Omega) \to W^{1-1/p,p}(\partial\Omega) \hookrightarrow L^p(\partial\Omega)$, bounded, with image exactly $W^{1-1/p,p}(\partial\Omega)$ (surjective). ✓ (Standard Adams/Brezis statement for Lipschitz $\Omega$.)
  - For $p=2$: $\mathrm{Tr}: H^1(\Omega) \to H^{1/2}(\partial\Omega)$. ✓
  - **Loss of $1/p$ derivative** (here $1/2$ for $p=2$) — sharp, can't push to $W^{1,p}$ on the boundary.
  - **$H^1_0(\Omega) = \overline{C_c^\infty(\Omega)}^{H^1} = \ker\mathrm{Tr}$**. ✓ (Standard for Lipschitz $\Omega$.)
  - Half-space heuristic via tangential Fourier transform: $|\xi'|^{1/2}$ multiplier on the boundary corresponds to $H^{1/2}(\partial\mathbb{R}^n_+)$. ✓
  - **§5 widget**: $t = s - 1/2$; "$ok$" when $s > 1/2$. Output prose "$C_c^\infty(\Omega)$ is dense in $H^s$ for $s \le 1/2$" — correct for $\mathbb{R}^n_+$ / general Lipschitz domain (the well-known characterization $H^s_0 = H^s$ when $s \le 1/2$).
- **Wrong/dubious.** None.
- **Underspecified.**
  - The widget's $s = 1/2$ boundary case is lumped into the "no trace" branch. Strictly $s = 1/2$ has no $L^p$-bounded trace operator, so this is fine.
  - Strictly the Trace Theorem requires $1 \le p < \infty$ and Lipschitz $\partial\Omega$. The page does state Lipschitz; the $p$-range is implicit ($1 \le p < \infty$).
- **Severity.** None.

## §6 Fundamental solutions $\Delta E = \delta$ (lines 920–1011)
- **Verified.**
  - Definition: $LE = \delta_0$ in $\mathcal{D}'$; convolution $u = E * f$ formally inverts $L$. ✓
  - **General formula** $E_n(x) = -\frac{1}{(n-2)\omega_{n-1}}|x|^{2-n}$ for $n \ge 3$, with $\omega_{n-1} = $ surface area of unit sphere $S^{n-1} \subset \mathbb{R}^n$. ✓
  - $\omega_2 = 4\pi$ (surface area of $S^2$). ✓ Consistent with $E_3 = -\frac{1}{1 \cdot 4\pi}|x|^{-1} = -\frac{1}{4\pi|x|}$. ✓
  - **$n = 1$**: $E_1 = \tfrac12|x|$ for $\Delta = d^2/dx^2$. Verify: $u = |x|/2$, $u'(x) = \mathrm{sgn}(x)/2$, $u'' = \delta_0$. ✓
  - Direct flux verification: $\nabla(1/r) = -x/r^3$, magnitude $1/r^2$. $\nabla E_3 = (1/(4\pi))x/r^3$, magnitude $1/(4\pi r^2)$. Flux $= 4\pi r^2 \cdot 1/(4\pi r^2) = 1$ independent of $r$. ✓
  - $\Delta(|x|^{2-n}) = 0$ on $\mathbb{R}^n \setminus \{0\}$ — standard radial computation. ✓
  - Pairing computation: $\langle\Delta E_3,\phi\rangle = \langle E_3,\Delta\phi\rangle$ + Green's identity on $\mathbb{R}^3 \setminus B_\varepsilon$ → $\phi(0)$. ✓
  - **§6 Newtonian-potential widget**: $E_3(r) = -1/(4\pi r)$, $|\nabla E_3| = 1/(4\pi r^2)$, flux $= 1$. All correct. ✓
- **Wrong/dubious.**
  - **Line 933 wording bug.** The page asserts $E_2 = \tfrac{1}{2\pi}\log|x|$ "lives outside $L^1_{\mathrm{loc}}$ at infinity but is locally integrable." This is **internally contradictory**: "locally integrable" and "$L^1_{\mathrm{loc}}$" are synonyms. $\log|x|$ IS in $L^1_{\mathrm{loc}}(\mathbb{R}^2)$ — it's locally integrable everywhere including at $0$ (only logarithmic singularity). The intended meaning is presumably "not in $L^1(\mathbb{R}^2)$" (slow decay / unbounded at infinity). Wording slip, not a math error.
- **Underspecified.** None.
- **Severity.** Minor (one wording bug that may confuse readers).

## §7 Variational $-\Delta u = f$ via Lax–Milgram (lines 1012–1156)
- **Verified.**
  - Weak formulation: multiply $-\Delta u = f$ by $v \in C_c^\infty$, integrate by parts (boundary term vanishes), extend to $H^1_0$ by density. ✓
  - Bilinear form $a(u,v) = \int \nabla u \cdot \nabla v$, linear form $L(v) = \int fv$. ✓
  - Continuity of $a$ on $H^1_0 \times H^1_0$ via Cauchy–Schwarz. ✓
  - **Coercivity bound** (line 1025): $a(u,u) = \|\nabla u\|^2 \ge (1+C^2)^{-1}\|u\|_{H^1}^2$ where $C$ = Poincaré constant. Verified: $\|u\|_{H^1}^2 = \|u\|_{L^2}^2 + \|\nabla u\|^2 \le (1+C^2)\|\nabla u\|^2$. ✓
  - Lax–Milgram delivers unique $u \in H^1_0$. ✓ Symmetric case ⇒ minimiser of $J(v) = \tfrac12 a(v,v) - L(v)$. ✓
  - The "chain in summary" (§7 callout): correctly identifies the role of each ingredient.
  - **§7 widget energy formulas**:
    - $\frac12 a(u_a,u_a) = \frac12 \int_0^L (a\pi/L)^2 \cos^2(\pi x/L) dx = a^2\pi^2/(4L)$. Code: `term1 = a*a*PI*PI/(4*L)`. ✓
    - Optimum $a^* = \langle f, \sin(\pi x/L)\rangle / (\pi^2/(2L))$ (from $dJ/da = 0$). Code matches. ✓
  - **§7 widget exact-solution closed forms**:
    - $f = 1$: $u = x(L-x)/2$. Verify $-u'' = 1 = f$. ✓
    - $f = \sin(\pi x/L)$: $u = (L^2/\pi^2)\sin(\pi x/L)$. Verify $-u'' = (\pi/L)^2(L^2/\pi^2)\sin = \sin = f$. ✓
- **Wrong/dubious.**
  - **Line 1083 — sign error in `uExact` for the bump source.** Code returns
    
    `(2/(3*L))*x*x*x - (1/(3*L*L))*x*x*x*x - (L/3)*x`
    
    Direct check: $u'' = (4/L)x - (4/L^2)x^2 = (4/L)x(1-x/L) = +f(x)$. So this $u$ solves $u'' = +f$, equivalently $-u'' = -f$ — wrong by an overall sign. Boundary conditions $u(0)=u(L)=0$ are satisfied either way, masking the bug, but the value at $x = L/2$ comes out **negative** ($u(L/2,L=1) = -5/48$), violating the maximum principle (with $f \ge 0$ and zero Dirichlet data, the true $u$ must be $\ge 0$). The correct closed form is
    
    $u(x) = -\frac{2}{3L}x^3 + \frac{1}{3L^2}x^4 + \frac{L}{3}x.$
    
    Visually the widget will draw the yellow "exact $u$" curve flipped below the x-axis for the bump source, while the cyan trial curve $a^*\sin(\pi x/L)$ converges to a positive amplitude (since $\langle f,\sin\rangle > 0$ for non-negative $f$). The two curves won't agree visually for the bump option, even at the optimum $a^*$. The energy/optimum readouts are correct (they don't depend on `uExact`); only the displayed yellow curve is wrong. **Major.**
- **Underspecified.** None.
- **Severity.** Major (one sign-flipped widget closed-form solution).

---

# Quiz bank — `quizzes/sobolev-spaces-distributions.json`

## `test-functions-distributions`
- **Q1 (NOT a distribution)** ✓: $\sum_k \phi^{(k)}(0)$ is not continuous on $\mathcal{D}$ (controls finitely many derivatives, not all). The other three are $\delta_0$, $-\delta_0'$, and a regular distribution.
- **Q2** ✓: $\langle\delta_0,\phi\rangle = \phi(0) = e^0 \cdot 1 = 1$.
- **Q3** ✓: a.e. equality is the right equivalence; surjectivity onto $\mathcal{D}'$ fails ($\delta_0$ counterexample).

## `distributional-derivative`
- **Q1** ✓: $H' = \delta_0$ standard.
- **Q2** ✓: $T = \delta_0''$, $\phi = x^2 e^{-x^2}$, $\langle\delta_0'',\phi\rangle = \phi''(0) = 2$. Direct: $\phi' = (2x - 2x^3)e^{-x^2}$, $\phi'' = (2 - 10x^2 + 4x^4)e^{-x^2}$, at $0$ gives $2$. ✓
- **Q3** ✓: $|x|' = \mathrm{sgn}(x)$ (no point mass since $|x|$ continuous). The integration-by-parts identity in the explanation is correct.

## `sobolev-spaces-wkp`
- **Q1** ✓: $u = x^{1/2}$ on $(0,1)$, $\int |u'|^p$ converges iff $p < 2$. (At $p=2$ the integral $\int_0^1 x^{-1}dx$ diverges logarithmically — explanation correctly notes this.)
- **Q2** ✓: $H^1$ inner product is $\int u\bar v + \int \nabla u \cdot \overline{\nabla v}$ (sum over all $|\alpha|\le 1$).
- **Q3** ✓: Plancherel + the comparison $\sum_{|\alpha|\le k}|\xi^\alpha|^2 \asymp (1+|\xi|^2)^k$ is the right argument for equivalence of the two definitions.

## `sobolev-embeddings`
- **Q1** ✓: $p^* = (3 \cdot 2)/(3 - 2) = 6$.
- **Q2** ✓: Rellich–Kondrachov gives compactness for $q < p^* = 6$; never compact at $q = 6$ (bubbling).
- **Q3** ✓: Morrey exponent $\gamma = k - n/p = 1 - 2/4 = 1/2$.

## `trace-theorem`
- **Q1** ✓: $H^1 \to H^{1/2}$, sharp.
- **Q2** ✓: $H^1_0$ is the right space.
- **Q3** ✓: $H^{1/2}$ has multiplier $(1+|\xi'|^2)^{1/4}$ (since $H^s$ uses $(1+|\xi|^2)^{s/2}$, and $s/2 = 1/4$ for $s=1/2$).

## `fundamental-solution`
- **Q1** ✓: $c = -1/(4\pi) \approx -0.07957747$.
- **Q2** ✓: classical Laplacian misses point-mass singularities; distributional pairing detects the boundary contribution.
- **Q3** ✓: $\Delta(E_3 * f) = (\Delta E_3) * f = \delta_0 * f = f$. So $u = E_3 * f$ solves $\Delta u = f$ (with the page's sign convention $E_3 = -1/(4\pi|x|)$ negative). Explanation correctly notes that the "physicist sign" $-\Delta u = f$ uses $u = -E_3 * f = (1/(4\pi))\int f(y)/|x-y|dy$.

## `variational-poisson`
- **Q1** ✓: $\int \nabla u \cdot \nabla v = \int fv$.
- **Q2** ✓: bilinear + bounded + coercive (with explicit Poincaré-based coercivity bound).
- **Q3** ✓: minimiser of $J(v) = \tfrac12 a(v,v) - L(v)$ when $a$ symmetric.

---

## Severity summary

**Major (1):**
1. **§7 widget `uExact` for bump source has flipped sign** (line 1083). Code computes the antiderivative for $u'' = +f$ (with zero Dirichlet data) instead of $-u'' = f$. Boundary conditions still hold but interior values are negative, violating the maximum principle for non-negative $f$. The drawn yellow "exact $u$" curve sits below the x-axis where it should be above, breaking the visual comparison with the trial function. Energy and optimum-amplitude readouts are unaffected (they don't use `uExact`).

**Minor (1):**
- **§6 line 933 wording**: $E_2 = \frac{1}{2\pi}\log|x|$ described as "outside $L^1_{\mathrm{loc}}$ at infinity but locally integrable" — internally contradictory ($L^1_{\mathrm{loc}}$ ≡ locally integrable). Intended: "not in $L^1(\mathbb{R}^2)$" / "doesn't decay at infinity". Wording slip, not a math error.

**Wording / understatement (1):**
- **§4 line 728** Morrey embedding listed as "$C^{0,\gamma}$ with $\gamma = k - n/p$ (mod 1)" — the proper higher-order statement is $C^{m, \gamma - m}$ with $m = \lfloor \gamma \rfloor$. The widget computes this correctly; only the prose table understates.

**Patterns / corpus notes:**
- Mathematical exposition (definitions, theorems, embeddings, Lax–Milgram chain) is rigorous and clean throughout — an unusually solid analysis page in this respect.
- The single major issue is a widget closed-form sign error, fitting the recurring "widget computation differs from prose" pattern seen elsewhere in the corpus (e.g. functional-analysis.md hard-quiz q1, algebra.md widget bugs). The page's prose statements and computations all check out; only one of three closed-form `uExact` branches in §7 is sign-flipped.
- All seven quizzes (21 v1 questions) verified correct. No quiz answer-key bugs — contrast with most other audits in this batch where answer-key inversion was the dominant failure mode.
