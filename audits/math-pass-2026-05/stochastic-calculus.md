# stochastic-calculus — math correctness audit (2026-05)

**Section:** Probability & statistics

## Verified claims

### Itô integral (§1)

- **Quadratic variation** $\sum (B_{t_{k+1}}-B_{t_k})^2 \to t$ in $L^2$ (line 273) — correct ($[B]_t = t$ standard).
- **Simple-process integral** $\sum \xi_k(B_{t_{k+1}\wedge t}-B_{t_k\wedge t})$ with $\xi_k$ $\mathcal{F}_{t_k}$-measurable (lines 275–276) — correct.
- **Itô isometry** $\mathbb{E}[(\int H\,dB)^2] = \mathbb{E}\int H^2\,ds$ (line 277) — correct.
- **Martingale property** via predictability (line 279) — correct.
- **Stratonovich = midpoint** convention obeys classical chain rule, not a martingale (line 281) — correct.
- **§1 widget limits** (lines 383–392): for $\int_0^T B_s\,dB_s$ on $[0,1]$,
  - left (Itô) → $(B_T^2-T)/2$ ✓ (Itô's identity on $B^2$).
  - midpoint (Stratonovich) → SL $+ T/2 = B_T^2/2$ ✓.
  - right → SL $+ T$ ✓ (right-endpoint sum exceeds left by $\sum(\Delta B)^2 \to T$).

### Itô's formula (§2)

- **Univariate Itô formula** $df(X) = f'\,dX + \tfrac{1}{2}f''(dX)^2$ with $(dX)^2 = \sigma^2\,dt$ (line 406) — correct.
- **$d(B_t^2) = 2B_t\,dB_t + dt$**, hence $B_t^2 = 2\int_0^t B_s\,dB_s + t$ (line 410) — correct.
- **Time-dependent version** $df(t,X) = \partial_t f\,dt + \partial_x f\,dX + \tfrac{1}{2}\partial_{xx}f\,(dX)^2$ (line 414) — correct ($C^{1,2}$ regularity stated).
- **Exponential martingale** $f(t,B) = \exp(\theta B - \tfrac{1}{2}\theta^2 t)$ gives $df = \theta f\,dB$ (line 415) — correct.
- **Mnemonic** $(dB)^2 = dt,\ dt\,dB = 0,\ (dt)^2 = 0$ (line 417) — correct.
- **Quiz q3** $d(e^{B_t}) = e^{B_t}\,dB_t + \tfrac{1}{2}e^{B_t}\,dt$ (line 88 of quiz bank) — correct.

### SDEs (§3)

- **Strong vs. weak solution** definitions (line 546) — correct.
- **Picard / Lipschitz uniqueness** sketch: Itô isometry on diffusion piece, Cauchy–Schwarz on drift; needs global Lipschitz + linear growth (line 548) — correct.
- **GBM closed form** $X_t = x_0\exp((\mu-\sigma^2/2)t + \sigma B_t)$ (line 551) — correct (Itô on $\log X$ gives $d\log X = (\mu-\tfrac{1}{2}\sigma^2)dt + \sigma dB$, integrate).
- **GBM mean** $\mathbb{E}[X_t] = x_0 e^{\mu t}$ (line 552) — correct (lognormal MGF: $\mathbb{E}[\exp(Y)] = \exp((\mu-\sigma^2/2)t + \sigma^2 t/2) = \exp(\mu t)$).
- **GBM median** $x_0 e^{(\mu-\sigma^2/2)t}$ (line 552) — correct (median of $e^Y$ for $Y$ Gaussian $=$ exponential of $Y$'s mean).
- **GBM positivity** a.s. (line 552) — correct (closed form is exponential).
- **§3 widget** uses the *exact* update $X_i = X_{i-1}\exp((\mu-\sigma^2/2)\Delta t + \sigma\sqrt{\Delta t}\,Z)$ (line 602) — correct exact-simulation step (not an Euler discretization, which would have bias).

### Girsanov (§4)

- **Novikov's condition** $\mathbb{E}\exp(\tfrac{1}{2}\int_0^T\theta_s^2\,ds) < \infty$ (line 681) — correct.
- **$dZ_t = Z_t\theta_t\,dB_t$** from Itô on $\log Z$ (line 683) — correct ($d\log Z = \theta\,dB - \tfrac{1}{2}\theta^2\,dt$ by construction; reversing via $Z = e^{\log Z}$ and Itô gives $dZ = Z(\theta dB - \tfrac{1}{2}\theta^2 dt) + \tfrac{1}{2}Z\theta^2 dt = Z\theta dB$).
- **$\mathbb{E}[Z_t] = 1$** (line 683) — correct under Novikov.
- **Girsanov statement** $\tilde B_t = B_t - \int_0^t\theta_s\,ds$ is BM under $\mathbb{Q}$ (line 684) — correct standard form.
- **Market price of risk** $\theta = (\mu-r)/\sigma$ shifts $dS = \mu S\,dt + \sigma S\,dB$ to $dS = rS\,dt + \sigma S\,d\tilde B$ (lines 687–688) — correct algebra: $\sigma S(\theta\,dt + d\tilde B) = (\mu-r)S\,dt + \sigma S\,d\tilde B$, so the total drift becomes $\mu S\,dt - (\mu-r)S\,dt + \sigma S\,d\tilde B$... wait: the substitution is $dB = d\tilde B + \theta\,dt$, so $\sigma S\,dB = \sigma S\,d\tilde B + (\mu-r)S\,dt$, total drift $= \mu S - (\mu - r)S = rS$? No: original is $\mu S\,dt + \sigma S\,dB$; substitute $dB = d\tilde B + \theta\,dt$ with $\theta = (\mu-r)/\sigma$: $\mu S\,dt + \sigma S(d\tilde B + (\mu-r)/\sigma\,dt) = \mu S\,dt + (\mu-r)S\,dt + \sigma S\,d\tilde B = (2\mu - r)S\,dt + \sigma S\,d\tilde B$. **This is the wrong sign for $\theta$.** See "Wrong / dubious claims" below.
- **Volatility invariance under measure change** (line 689) — correct (Girsanov is absolutely-continuous, leaves the quadratic variation intact).
- **§4 widget**: $B_T \sim \mathcal{N}(0,T)$ under $\mathbb{P}$, $\mathcal{N}(\theta T, T)$ under $\mathbb{Q}$ for constant $\theta$ (line 691) — correct (mean shifts by $\theta T$, variance unchanged).

### Feynman–Kac (§5)

- **Backward PDE** $\partial_t u + b\partial_x u + \tfrac{1}{2}\sigma^2\partial_{xx}u - ru = 0$, $u(T,x) = g(x)$ (line 804) — correct (signs: backward parabolic, terminal data).
- **Discounted feature**: applying Itô to $e^{-\int_0^s r\,du}\,u(s,X_s)$ yields a martingale (line 805) — correct outline.
- **Feynman–Kac formula** $u(t,x) = \mathbb{E}[e^{-\int_t^T r(X_s)\,ds}g(X_T) \mid X_t = x]$ (line 806) — correct.
- **Backward heat / Brownian convolution** (lines 809–810): $u(t,x) = \int g(y)\,\frac{e^{-(y-x)^2/2(T-t)}}{\sqrt{2\pi(T-t)}}\,dy$ — correct (Gaussian transition density).

### Applications (§6)

- **Black–Scholes formula** $C = S_0\Phi(d_1) - Ke^{-rT}\Phi(d_2)$, $d_{1,2} = [\log(S_0/K) + (r\pm\sigma^2/2)T]/(\sigma\sqrt T)$ (line 961) — correct standard form.
- **Black–Scholes PDE** $\partial_t C + \tfrac{1}{2}\sigma^2 S^2\partial_{SS}C + rS\partial_S C - rC = 0$, $C(T,S) = (S-K)^+$ (line 962) — correct.
- **CRR tree parameters** $u = e^{\sigma\sqrt{\Delta t}}$, $d = 1/u$, $p = (e^{r\Delta t}-d)/(u-d)$ (lines 1027–1029) — correct standard CRR risk-neutral probability.
- **§6 widget** backward induction $C[i][j] = e^{-r\Delta t}(p\,C[i+1][j+1] + (1-p)\,C[i+1][j])$ (line 1037) — correct; matches BS in the limit $N\to\infty$ as the readout reports.
- **Abramowitz–Stegun 7.1.26 erf approximation** for $\Phi$ (lines 1011–1017) — coefficients verified: $a_1=0.254829592, a_2=-0.284496736, a_3=1.421413741, a_4=-1.453152027, a_5=1.061405429, p=0.3275911$ are the standard A&S 7.1.26 coefficients.
- **Kalman–Bucy** description (lines 964–965) — correct outline; conditional Gaussianity of linear-Gaussian filtering is standard.
- **American option value function** $V(t,x) = \sup_{\tau\in[t,T]}\mathbb{E}_\mathbb{Q}[e^{-r(\tau-t)}g(X_\tau) \mid X_t = x]$ (line 969) — correct.
- **Variational PDE** $\min(-\partial_t V - \mathcal{L}V + rV,\ V - g) = 0$ (line 970) — correct standard obstacle / linear-complementarity formulation for American options.

### Quiz bank claims (cross-checked against the prose)

- **q1, sc-ito-integral**: left endpoint defines Itô — correct.
- **q2**: $\mathbb{E}\int_0^t H_s^2\,ds < \infty$ is the $L^2$ condition — correct (Itô isometry).
- **q3**: $\mathbb{E}[\int_0^t B_s\,dB_s] = 0$ — correct (martingale starting at 0).
- **q3 explain**: "$\int_0^t B_s\,dB_s = \tfrac{1}{2}B_t^2 - \tfrac{1}{2}t$, expectation 0" — correct ($\mathbb{E}[B_t^2] = t$ cancels).
- **sc-ito-formula q1**: $d(B_t^2) = 2B_t\,dB_t + dt$ — correct.
- **sc-ito-formula q3**: $d(e^{B_t}) = e^{B_t}\,dB_t + \tfrac{1}{2}e^{B_t}\,dt$, exponential martingale $\exp(B_t - t/2)$ — correct.
- **sc-sde-existence q1, q2, q3**: Lipschitz → strong solution; GBM closed form; weak vs. strong — all correct.
- **sc-girsanov q1, q2, q3**: $\tilde B$ is BM under $\mathbb{Q}$; $dZ = Z\theta\,dB$ with no drift; risk-neutral replaces $\mu$ with $r$ — all correct.
- **sc-feynman-kac q1, q2, q3**: parabolic / elliptic class; backward heat equation with terminal data; discount → $-ru$ potential term — all correct.
- **sc-applications q1, q2, q3**: discounted risk-neutral expectation; linear-Gaussian for Kalman; American = optimal stopping + free-boundary PDE — all correct.

## Wrong / dubious claims

- **Risk-neutral drift substitution sign (line 688).** The text writes
  $$dS_t = \mu S_t\,dt + \sigma S_t(d\tilde B_t + \theta\,dt) = rS_t\,dt + \sigma S_t\,d\tilde B_t$$
  with $\theta = (\mu - r)/\sigma$. This conflates the directionality of the substitution: under Girsanov with $\theta = (\mu-r)/\sigma$, $\tilde B_t = B_t - \int_0^t \theta\,ds$, so $dB_t = d\tilde B_t + \theta\,dt$. Substituting into $dS = \mu S\,dt + \sigma S\,dB$ gives $\mu S\,dt + \sigma S\,d\tilde B + (\mu-r)S\,dt = (2\mu - r)S\,dt + \sigma S\,d\tilde B$, **not** $rS\,dt + \sigma S\,d\tilde B$. To get the correct risk-neutral drift, one needs $\theta = -(\mu-r)/\sigma = (r-\mu)/\sigma$, i.e. $\tilde B_t = B_t + \int_0^t (\mu-r)/\sigma\,ds$. The standard convention in finance texts (Shreve II §5.2.3, Karatzas–Shreve) actually flips the sign of $\theta$ in the Girsanov density — i.e., $Z_t = \exp(-\int\theta\,dB - \tfrac{1}{2}\int\theta^2\,ds)$ for $\theta = (\mu-r)/\sigma$ — to match. As written, this is an internal sign inconsistency. The widget is unaffected because it only displays the density-shift picture for arbitrary $\theta$, not the asset-SDE substitution. **Severity: moderate** (qualitative conclusion is right — Girsanov shifts the drift to $r$ — but the explicit one-line algebra has a sign error).

## Underspecified or unverifiable claims

- **Multivariate Itô formula** is not stated. The page only treats the univariate Itô process and its time-dependent extension. The user's audit focus included multivariate Itô; this is a coverage gap, not an error.
- **BDG inequalities** are mentioned only by name in §7 (line 1105) as part of the martingale toolbox, with no statement. Coverage gap, not an error.
- **Ornstein–Uhlenbeck and CIR SDEs** are not treated. Only GBM gets a worked closed-form solution. Coverage gap, not an error.
- **Specific worked Itô integrations** beyond $\int_0^t B_s\,dB_s$: not given (e.g., $\int_0^t s\,dB_s$, $\int_0^t B_s^2\,dB_s$). Coverage gap.
- **Novikov's condition vs. Kazamaki** (line 681). The page states only Novikov; for completeness one might mention Kazamaki's weaker condition, but Novikov is the standard textbook entry point and the omission is fine.
- **Picard contraction** (line 548). The page asserts "the operator $T$ is a contraction in $L^2$ on $[0,T]$" without specifying the equivalent norm (typically $\|X\|^2 = \sup_{t\le T} e^{-\lambda t}\mathbb{E}|X_t|^2$ for $\lambda$ large enough); standard pedagogical elision.
- **§3 widget median curve** (line 634). Plotted as $x_0 e^{(\mu-\sigma^2/2)t}$ — correct, but this is the median of the *marginal distribution at time $t$*, not the median of the path-functional. Subtle but conceptually fine since the widget is about the marginal.

## Severity

**clean modulo one sign error.** All theorem statements (Itô isometry, Itô's formula in univariate / time-dependent form, Girsanov in its density-shift form, Feynman–Kac with discount, Black–Scholes formula and PDE, CRR tree parameters, American-option variational inequality) are correct. All worked computations (GBM closed form, mean / median, exponential martingale, $d(B^2) = 2B\,dB + dt$, $d(e^B) = e^B\,dB + \tfrac{1}{2}e^B\,dt$, CRR backward induction, A&S erf approximation, §1 widget Riemann-sum limits) check out. The §3 GBM widget uses the exact-simulation update rather than Euler-Maruyama, avoiding bias. Quiz answers are all correct.

The single substantive issue is the **risk-neutral drift substitution at line 688**: the algebra as written gives $(2\mu-r)S\,dt$, not $rS\,dt$. Either the sign convention for $\theta$ in §4 should be flipped (to $\theta = (r-\mu)/\sigma$), or the Girsanov density should be written as $\exp(-\int\theta\,dB - \tfrac{1}{2}\int\theta^2\,ds)$ to match the chosen $\theta = (\mu-r)/\sigma$. The qualitative content ("under $\mathbb{Q}$ the drift becomes $r$") is correct; the one-line algebraic substitution is not.

Coverage gaps relative to the user's audit focus: multivariate Itô, BDG, OU, CIR, and additional worked Itô integrations are absent from the page. These are scope choices, not errors.
