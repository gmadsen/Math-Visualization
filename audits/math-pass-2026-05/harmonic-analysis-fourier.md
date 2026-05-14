# Math correctness audit — `harmonic-analysis-fourier.html`

Audited 2026-05-14 (read-only). Pedagogy intentionally skipped.
Format per section: **Verified · Wrong/dubious · Underspecified · Severity**.

The page declares the convention $\hat f(\xi)=\int f(x)e^{-2\pi i\xi x}\,dx$ in §2 and adheres to it throughout — verified consistent in every formula below.

Note: the user-supplied focus list mentioned **Hardy–Littlewood maximal**, **Calderón–Zygmund**, **Hausdorff–Young**, and Pontryagin duality. Of those, only Pontryagin duality and the $L^1$-corner of Young's convolution inequality appear in this page. The other three are not present in the prose, widgets, or quizzes — nothing to audit.

---

## §1 Fourier series on the circle (lines 264–424)
- **Verified.**
  - Orthonormality $\int_0^1 e^{2\pi i(m-n)x}\,dx=\delta_{mn}$. ✓
  - Stone–Weierstrass density of trig polynomials in $C(\mathbb{T})$ ⇒ orthonormal basis of $L^2(\mathbb{T})$. ✓
  - Inversion / coefficient formulas $f=\sum\hat f(n)e_n$, $\hat f(n)=\int_0^1 f(x)e^{-2\pi inx}dx$, $L^2$-convergence. ✓
  - Parseval $\int_0^1|f|^2=\sum|\hat f(n)|^2$. ✓
  - Carleson 1966 (a.e. convergence on $L^2$), Hunt extension to $L^p$ for $p>1$, Kolmogorov $L^1$ everywhere-divergent counterexample. ✓
  - Smoothness $\to$ decay: $f\in C^k(\mathbb{T})\Rightarrow\hat f(n)=O(|n|^{-k})$ via integration by parts. ✓
  - **§1 widget**: numerical Fourier coefficients via midpoint quadrature on $M=4096$ samples; partial sum reconstructed by $\sum c_n e^{2\pi inx}$. Algebra correct. Square wave Gibbs constant ~9% (more precisely the Wilbraham–Gibbs overshoot is $\approx 8.95\%$ of the jump on each side). Triangle $|\hat f(n)|=O(1/n^2)$, sawtooth $O(1/n)$, Dirichlet midpoint at jump — all standard.
- **Wrong/dubious.**
  - **§1 widget "smooth bump" mean-zero offset is slightly off.** The bump is `exp(-30*(x-0.5)^2) − 0.32465247`. The exact mean of $e^{-30(x-0.5)^2}$ on $[0,1]$ is $\sqrt{\pi/30}\,\mathrm{erf}(\sqrt{30}/2)\approx 0.32365$, so the offset overshoots by $\sim 0.001$, leaving a tiny nonzero $\hat f(0)$. Cosmetic — the Fourier-coefficient decay claim (faster than any polynomial) is unaffected because the bump is not actually $C^\infty$ on $\mathbb{T}$ either (periodic gluing at $x=0,1$ has $f(0)\approx 5.5\times 10^{-4}\ne 0$); both small.
- **Underspecified.** None.
- **Severity.** None (cosmetic only).

## §2 Fourier transform on $\mathbb{R}$ (lines 425–565)
- **Verified.**
  - Convention $\hat f(\xi)=\int f(x)e^{-2\pi i\xi x}dx$. ✓
  - $\|\hat f\|_\infty\le\|f\|_1$, $\hat f\in C_0$, Riemann–Lebesgue, $\mathcal{F}\colon L^1\to C_0$ continuous, image dense but not surjective. ✓
  - "Big four" table: translation $\tau_a f\to e^{-2\pi ia\xi}\hat f$ ✓; modulation $e^{2\pi ibx}f\to\hat f(\xi-b)$ ✓; dilation $f(\lambda x)\to\lambda^{-1}\hat f(\xi/\lambda)$ for $\lambda>0$ ✓ (change of variable $y=\lambda x$); $\overline{f(x)}\to\overline{\hat f(-\xi)}$ ✓; $f'\to 2\pi i\xi\hat f$ ✓; $-2\pi ix f\to\hat f'$ ✓ (differentiate under the integral).
  - Inversion $f=\int\hat f(\xi)e^{2\pi i\xi x}d\xi$ assuming both $f,\hat f\in L^1$. ✓
  - Plancherel: $\mathcal{F}\colon L^2\to L^2$ unitary, density-extended from $L^1\cap L^2$. ✓
  - **§2 widget — tent and sinc²**: $\Lambda(x)=\max(1-|x|,0)$ has $\hat\Lambda(\xi)=\mathrm{sinc}^2(\xi)$ with $\mathrm{sinc}(\xi)=\sin(\pi\xi)/(\pi\xi)$. Direct: $\Lambda=\mathbf 1_{[-1/2,1/2]}*\mathbf 1_{[-1/2,1/2]}$, $\widehat{\mathbf 1_{[-1/2,1/2]}}=\mathrm{sinc}$, convolution theorem. ✓
  - The widget actually plots $\Lambda_a(x)=\max(0,1-|x|/a)$ (half-width $a$), and uses transform $a\cdot\mathrm{sinc}^2(a\xi)$. By dilation, $\widehat{\Lambda(x/a)}=a\hat\Lambda(a\xi)=a\,\mathrm{sinc}^2(a\xi)$. ✓
  - First zeros of $a\,\mathrm{sinc}^2(a\xi)$ at $a\xi=\pm 1$, i.e. $\xi=\pm 1/a$ ✓; peak $a\cdot 1=a$ at $\xi=0$ ✓.
- **Wrong/dubious.** None.
- **Underspecified.** None.
- **Severity.** None.

## §3 Convolution and convolution theorem (lines 566–678)
- **Verified.**
  - $(f*g)(x)=\int f(y)g(x-y)dy$, $\|f*g\|_1\le\|f\|_1\|g\|_1$ via Fubini–Tonelli (Young at the corner $p=q=r=1$, since $1/1+1/1=1+1/1$). ✓
  - Commutative, associative, bilinear; $(L^1,*)$ commutative Banach algebra. ✓
  - Convolution theorem $\widehat{f*g}=\hat f\hat g$. ✓
  - Dual identity $\widehat{fg}=\hat f*\hat g$ (with appropriate hypotheses). ✓
  - "$L^1$ has no unit": if $e\in L^1$ were a unit, $\hat e\equiv 1$ contradicts Riemann–Lebesgue. ✓
  - Approximate identities $\varphi_\varepsilon(x)=\varepsilon^{-1}\varphi(x/\varepsilon)$ with $\int\varphi=1$, $\varphi_\varepsilon*f\to f$ in $L^p$. ✓
  - **§3 widget — box ★ box**: $\mathbf 1_{[-1,1]}*\mathbf 1_{[-1,1]}$ is the tent $\max(0,2-|t|)$ on $|t|\le 2$, peak value $2$ at $t=0$. Code: overlap interval $[\max(-1,t-1),\min(1,t+1)]$ has length $\max(0,2-|t|)$. ✓
- **Wrong/dubious.** None.
- **Underspecified.** None.
- **Severity.** None.

## §4 Schwartz space and tempered distributions (lines 679–725)
- **Verified.**
  - Schwartz seminorm definition $\|f\|_{\alpha,\beta}=\sup_x|x^\alpha\partial^\beta f|<\infty$. ✓
  - Examples: $e^{-\pi x^2}\in\mathcal{S}$, polynomial × Gaussian ∈ $\mathcal{S}$; $1/(1+x^2)\notin\mathcal{S}$ (only $x^{-2}$ decay). ✓
  - $\widehat{x^\alpha f}=(-2\pi i)^{-|\alpha|}\partial^\alpha\hat f$ ✓; $\widehat{\partial^\beta f}=(2\pi i\xi)^\beta\hat f$ ✓.
  - $\mathcal{F}\colon\mathcal{S}\to\mathcal{S}$ topological iso, $\mathcal{F}^4=\mathrm{id}$. ✓
  - Distribution table:
    - $\hat\delta=1$ ✓; dually $\hat 1=\delta$ ✓ — both correct in this convention (in contrast to symmetric or no-$2\pi$ conventions where $\hat 1=(2\pi)^{n/2}\delta$ or $(2\pi)^n\delta$).
    - $\widehat{x}=\frac{1}{-2\pi i}\delta'$. Direct: $\widehat{x\cdot 1}=\frac{1}{-2\pi i}\partial\hat 1=\frac{1}{-2\pi i}\delta'$. ✓
    - $\widehat{\mathrm{p.v.}\,1/x}=-i\pi\,\mathrm{sgn}(\xi)$. Standard: with this convention the Hilbert transform is $\widehat{Hf}=-i\,\mathrm{sgn}(\xi)\hat f$ where $H=\frac{1}{\pi}\mathrm{p.v.}\,\frac{1}{x}*$, giving $\widehat{\mathrm{p.v.}\,1/x}=-i\pi\,\mathrm{sgn}(\xi)$. ✓
    - $\widehat{e^{2\pi ibx}}=\delta_b$ via modulation $\widehat{e^{2\pi ibx}\cdot 1}=\hat 1(\xi-b)=\delta(\xi-b)$. ✓
  - $\langle\hat T,\varphi\rangle:=\langle T,\hat\varphi\rangle$ extension to $\mathcal{S}'$. ✓
  - Sobolev space $H^s=\{f\in\mathcal{S}': (1+|\xi|^2)^{s/2}\hat f\in L^2\}$. ✓
- **Wrong/dubious.** None.
- **Underspecified.** None.
- **Severity.** None.

## §5 Heisenberg uncertainty (lines 727–832)
- **Verified.**
  - Statement (this convention, $\|f\|_2=1$): $\sigma_x\sigma_\xi\ge 1/(4\pi)$. ✓
  - Equality iff $f$ is a (centred) Gaussian $f(x)=ce^{-\pi ax^2}$. ✓
  - Proof sketch via $[d/dx,x]=1$, integration by parts, Cauchy–Schwarz, Plancherel and $\widehat{f'}=2\pi i\xi\hat f$ — gives factor $4\pi$ from $2\cdot 2\pi$. ✓
  - Translation $1/(4\pi)\leftrightarrow\hbar/2$ under the QM convention $\hat f(p)=\int f(x)e^{-ipx/\hbar}dx/\sqrt{2\pi\hbar}$. ✓
  - Gaussian family $f_a(x)=(2a)^{1/4}e^{-\pi ax^2}$:
    - $\|f_a\|_2^2=(2a)^{1/2}\int e^{-2\pi ax^2}dx=(2a)^{1/2}\cdot 1/\sqrt{2a}=1$. ✓
    - $\hat f_a(\xi)=(2/a)^{1/4}e^{-\pi\xi^2/a}$. Verify: $(2a)^{1/4}\cdot a^{-1/2}=2^{1/4}a^{-1/4}=(2/a)^{1/4}$. ✓
    - $\sigma_x^2=\int x^2|f_a|^2=(2a)^{1/2}\cdot\frac{1}{4\pi a\sqrt{2a}}=\frac{1}{4\pi a}$. ✓
    - $\sigma_\xi^2=a/(4\pi)$ (symmetric calculation). ✓
    - $\sigma_x\sigma_\xi=\sqrt{1/(16\pi^2)}=1/(4\pi)$ — saturates. ✓
  - Widget readout $1/(4\pi)\approx 0.0796$ ✓ ($1/(4\pi)=0.07957...$).
- **Wrong/dubious.** None.
- **Underspecified.**
  - "$|\hat f(\xi)|^2$ is also a probability density, by Plancherel and $\|f\|_2=1$" elides that the centred-mean assumption is implicit (the variance formulas $\sigma_x^2=\int x^2|f|^2$ assume mean zero in $x$ and $\xi$); standard textbook elision.
- **Severity.** None.

## §6 Poisson summation (lines 833–871)
- **Verified.**
  - $\sum_n f(n)=\sum_n\hat f(n)$ for Schwartz $f$ ✓; more general $\sum_n f(x+n)=\sum_n\hat f(n)e^{2\pi inx}$. ✓
  - Proof sketch: periodize, compute $\hat F(k)=\hat f(k)$ via folding, expand. ✓
  - $\widehat{e^{-\pi tx^2}}(\xi)=t^{-1/2}e^{-\pi\xi^2/t}$. ✓ (Standard $\widehat{e^{-\pi ax^2}}(\xi)=a^{-1/2}e^{-\pi\xi^2/a}$ with $a=t$.)
  - $\theta(t)=\sum_n e^{-\pi n^2 t}$, $\theta(1/t)=\sqrt t\,\theta(t)$. From Poisson: $\theta(t)=\sum_n t^{-1/2}e^{-\pi n^2/t}=t^{-1/2}\theta(1/t)$, equivalently $\theta(1/t)=\sqrt t\,\theta(t)$. ✓
  - Riemann's $\xi(s)=\pi^{-s/2}\Gamma(s/2)\zeta(s)$, $\xi(s)=\xi(1-s)$. ✓
  - Shannon–Nyquist: band-limited $\mathrm{supp}\,\hat f\subset[-W,W]$ ⇒ $f(x)=\sum_n f(n/(2W))\,\mathrm{sinc}(2Wx-n)$. ✓
- **Wrong/dubious.** None.
- **Underspecified.** None.
- **Severity.** None.

## §7 Heat kernel and Gaussian eigenfunction (lines 872–997)
- **Verified.**
  - $g(x)=e^{-\pi x^2}$, $\hat g=g$ (self-dual fixed point of $\mathcal{F}$ in this convention). ✓
  - ODE proof: $g'+2\pi xg=0$, transform to get $\hat g$ obeys same ODE, match values at $0$. ✓
  - Heat eq $\partial_t u=\partial_x^2 u$ becomes $\partial_t\hat u=-4\pi^2\xi^2\hat u$ ✓ (since $\widehat{\partial_x^2}=(2\pi i\xi)^2=-4\pi^2\xi^2$).
  - Solution $\hat u(t,\xi)=e^{-4\pi^2 t\xi^2}\hat f(\xi)$, inverse $u=K_t*f$ with $K_t(x)=(4\pi t)^{-1/2}e^{-x^2/(4t)}$. Verify: $\widehat{K_t}(\xi)=e^{-4\pi^2 t\xi^2}$ via $\widehat{e^{-\alpha x^2}}=\sqrt{\pi/\alpha}e^{-\pi^2\xi^2/\alpha}$ with $\alpha=1/(4t)$. ✓
  - $K_t$ Gaussian std deviation $\sigma=\sqrt{2t}$ (so $2\sigma^2=4t$ ✓), mass 1, $K_t\to\delta$ as $t\to 0^+$. ✓
  - Probability connection: standard BM at time $s$ has density $(2\pi s)^{-1/2}e^{-x^2/(2s)}$; $s=2t$ gives $K_t$. ✓
  - Hermite functions, eigenvalues $\{1,-i,-1,i\}=\{(-i)^n:n\ge 0\}$, $\mathcal{F}^4=\mathrm{id}$. ✓
  - **§7 widget**: numerical convolution $u(t,x)=\int K_t(y)f(x-y)dy$ on $[-6,6]$ with 600 samples; midpoint rule, normalization $C=1/\sqrt{4\pi t}$. Code is correct.
  - Variable `sigma2 = Math.max(t*4, 1e-7)` (line 946) is computed but never used downstream — dead code, not a math error. The inline comment correctly notes the $1/\sqrt{4\pi t}$ normalization.
- **Wrong/dubious.** None.
- **Underspecified.** None.
- **Severity.** None (one stale-but-harmless variable).

## §8 Pontryagin duality (lines 998–1024)
- **Verified.**
  - $\widehat G=\Hom_{\mathrm{cts}}(G,U(1))$ with compact-open topology, LCA. ✓
  - Pontryagin: $G\cong\widehat{\widehat G}$ canonically. ✓
  - Duality table:
    - $\widehat{\mathbb{R}}=\mathbb{R}$ via $\chi_\xi(x)=e^{2\pi i\xi x}$ ✓
    - $\widehat{\mathbb{T}}=\mathbb{Z}$ via $\chi_n(x)=e^{2\pi inx}$ ✓
    - $\widehat{\mathbb{Z}}=\mathbb{T}$ ✓
    - $\widehat{\mathbb{Z}/N}=\mathbb{Z}/N$ ✓
    - $\widehat{\mathbb{Q}_p}=\mathbb{Q}_p$ ✓
    - Adèles self-dual ✓
  - Plancherel on LCA: $\mathcal{F}\colon L^1(G)\cap L^2(G)\to L^2(\widehat G)$ extends to unitary iso with compatible Haar measures. Specializes correctly to $\mathbb{R}$ (Plancherel), $\mathbb{T}$ (Parseval), $\mathbb{Z}/N$ (DFT/$\sqrt N$ unitary). ✓
- **Wrong/dubious.** None.
- **Underspecified.** None.
- **Severity.** None.

---

# Quiz bank — `quizzes/harmonic-analysis-fourier.json`

## `fourier-series-circle`
- **q1 (mcq)** ✓ orthonormality + Stone–Weierstrass density.
- **q2 (numeric)** ✓. $f=3+4\cos(2\pi x)-2\sin(4\pi x)$. Decompose: $4\cos(2\pi x)=2(e_1+e_{-1})$ ✓; $-2\sin(4\pi x)=-2\cdot\frac{e_2-e_{-2}}{2i}=\frac{-1}{i}(e_2-e_{-2})=i(e_2-e_{-2})$ ✓. Coefficients $\hat f(0)=3,\hat f(\pm 1)=2,\hat f(2)=i,\hat f(-2)=-i$. Parseval: $9+4+4+1+1=19$. ✓
- **q3 (mcq)** ✓ Carleson 1966 a.e. for $L^2$.

## `fourier-transform-real-line`
- **q1 (mcq)** ✓ translation→modulation $e^{-2\pi ia\xi}\hat f(\xi)$.
- **q2 (mcq)** ✓ Riemann–Lebesgue (continuity + decay), with explanation correctly noting non-surjectivity onto $C_0$.
- **q3 (numeric)** ✓. $f=\mathbf 1_{[-1/2,1/2]}$, $\|f\|_2^2=1$, Plancherel ⇒ $\|\hat f\|_2^2=1$. ✓

## `convolution-theorem`
- **q1 (mcq)** ✓ $\widehat{f*g}=\hat f\hat g$.
- **q2 (mcq)** ✓ $L^1$ Banach algebra without unit.
- **q3 (numeric)** ✓. $\widehat{g*g}=\hat g\hat g=g^2=e^{-2\pi\xi^2}$; at $\xi=0$ gives $1$. ✓

## `schwartz-space-distributions`
- **q1 (mcq)** ✓ Schwartz definition.
- **q2 (mcq)** ✓ Paley–Wiener: $\widehat{C_c^\infty}\not\subset C_c^\infty$ (entire of exponential type).
  - The explanation contains $\widehat{x^a g}(\xi)=(2\pi i)^{-a}(-1)^a\hat g^{(a)}(\xi)$. Compare to the prose §4 form $\widehat{x^\alpha f}=\frac{1}{(-2\pi i)^{|\alpha|}}\partial^\alpha\hat f$. Note $(2\pi i)^{-a}(-1)^a=(-1)^a/(2\pi i)^a=1/(-2\pi i)^a$. Same identity. ✓
- **q3 (mcq)** ✓ $\hat\delta=1$, with hint+explain pairing duality.

## `uncertainty-principle`
- **q1 (mcq)** ✓ Heisenberg in this convention: $\|xf\|_2\|\xi\hat f\|_2\ge\|f\|_2^2/(4\pi)$.
- **q2 (mcq)** ✓ Gaussians saturate.
- **q3 (numeric)** ✓. For $f=e^{-\pi x^2}$: $\|f\|_2^2=\int e^{-2\pi x^2}dx=1/\sqrt 2$ ✓; bound $=1/(4\pi\sqrt 2)\approx 0.0562731434$ ✓ (matches stated answer 0.05627314338).

## `poisson-summation`
- **q1 (mcq)** ✓ statement.
- **q2 (mcq)** ✓ Poisson → modular θ → Riemann functional equation, $\xi(s)=\pi^{-s/2}\Gamma(s/2)\zeta(s)$.
- **q3 (numeric)** ✓. $\theta(t)=t^{-1/2}\theta(1/t)\Rightarrow\theta(4)=\frac{1}{2}\theta(1/4)$, ratio $1/2$. ✓

## `heat-kernel-gaussian`
- **q1 (numeric)** ✓. $\hat g(0)=\int e^{-\pi x^2}dx=1$. ✓
- **q2 (mcq)** ✓ $\partial_t\hat u=-4\pi^2\xi^2\hat u$, solution $e^{-4\pi^2 t\xi^2}\hat f$.
- **q3 (mcq)** ✓ Hermite functions diagonalize $\mathcal{F}$ with eigenvalues $(-i)^n\in\{1,-i,-1,i\}$, $\mathcal{F}^4=\mathrm{id}$.
  - The Hermite formula in the question prompt has a "(constant)" placeholder rather than the explicit $L^2$-normalization; the eigenvalue claim $(-i)^n$ is independent of that constant and is the only assertion being tested. Acceptable.

## `pontryagin-duality`
- **q1 (mcq)** ✓ $\widehat G=\Hom_{\mathrm{cts}}(G,U(1))$.
- **q2 (matching)** ✓. `answer=[2,0,3,1]` correctly maps:
  - $\mathbb{R}\to\mathbb{R}$ (right[2]) ✓
  - $\mathbb{T}\to\mathbb{Z}$ (right[0]) ✓
  - $\mathbb{Z}\to\mathbb{T}$ (right[3]) ✓
  - $\mathbb{Z}/N\to\mathbb{Z}/N$ (right[1]) ✓
- **q3 (mcq)** ✓ Plancherel on LCA $G$.

---

## Severity summary

**Major (0).** Nothing.

**Minor (0).** Nothing of mathematical substance.

**Cosmetic (2):**
- §1 widget "smooth bump" mean-zero offset constant `0.32465247` differs from the exact mean $\sqrt{\pi/30}\,\mathrm{erf}(\sqrt{30}/2)\approx 0.32365$ by ~0.001 — leaves a tiny nonzero $\hat f(0)$ that's invisible at plot resolution.
- §7 widget has a dead variable `sigma2` (line 946) that's computed but never read; the actual heat-kernel evaluation just below is correct.

**Patterns / corpus notes:**
- Convention discipline is exemplary: every formula across all eight sections, both the prose distribution table and the heat-kernel ODE, is internally consistent with the declared $\hat f(\xi)=\int f(x)e^{-2\pi i\xi x}\,dx$. This contrasts with the `functional-analysis.html` page where two conventions for $\hat\delta$ vs $\hat 1$ silently collided in §16.
- Quiz answer keys (including the matching question on Pontryagin duality) all agree with the prose. The matching-key inversion failure mode that recurs on many other topics (functional-analysis adjoint-hilbert hard q2, model-theory-basics, cluster-algebras, etc.) is not present here.
- The user's audit-focus mentions Hardy–Littlewood maximal, Calderón–Zygmund, and Hausdorff–Young — none appear on this page. These would naturally fit a "harmonic analysis II" sequel topic but are out of scope for the current corpus entry, which is a Fourier-theory introduction (Fourier series → transform → Schwartz → uncertainty → Poisson → heat → Pontryagin).
