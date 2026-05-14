# Mathematical biology — math-correctness pass

Scope note: page covers Wright–Fisher, Moran, Kimura diffusion, Kingman coalescent, Lotka–Volterra, replicator dynamics, mutation–selection balance. **No SIR/SEIR, no $R_0$, no Hardy–Weinberg, no Turing/reaction–diffusion** — those audit-checklist items are simply not in scope on this topic page.

## Verified claims

- **Wright–Fisher (§1).** Binomial transition $X_{n+1}\mid X_n \sim \text{Bin}(2N, X_n/(2N))$ is correct; martingale property $\mathbb{E}[X_{n+1}\mid X_n] = X_n$ and fixation probability $k/(2N)$ via optional stopping are right; per-generation heterozygosity decay factor $1 - 1/(2N)$ is the standard identity.
- **Moran (§2).** Symmetric birth–death rates $k(2N-k)/(2N)^2$ are correct under uniform-die / uniform-reproduce. Selection-modified fixation $\rho_k = (1-r^{-k})/(1-r^{-2N})$ and the Haldane corollary $\rho_1 \approx s/(1+s)$ derived from $1 - r^{-1} = s/(1+s)$ check out.
- **Kimura diffusion (§3).** SDE $dp = \sigma p(1-p)\,dt + \sqrt{p(1-p)}\,dW$, generator $\mathcal L = \tfrac12 p(1-p)\partial_p^2 + \sigma p(1-p)\partial_p$, and fixation $u(p) = (1-e^{-2\sigma p})/(1-e^{-2\sigma})$ are all consistent with the standard CLT scaling $s = \sigma/(2N)$, $t \mapsto 2Nt$. Solving $\mathcal Lu = 0$ with $u(0)=0, u(1)=1$ reproduces the closed form.
- **Coalescent (§4).** Pair coalescence rate $\binom{k}{2}/(2N)$, $T_k \sim \text{Exp}\!\left(\binom{k}{2}\right)$, telescoping $\sum_{k=2}^n 2/(k(k-1)) = 2(1-1/n) \to 2$ are all correct.
- **Lotka–Volterra (§5).** Fixed points $(0,0)$ and $(c/d, a/b)$; Jacobian at $(c/d, a/b)$ has off-diagonals $-bc/d$ and $ad/b$, diagonals $0$, eigenvalues $\pm i\sqrt{ac}$ — verified. Conserved $H = dx - c\ln x + by - a\ln y$ satisfies $\dot H = (dx-c)[(a-by)+(by-a)] = 0$. Saddle classification of $(0,0)$ from eigenvalues $a, -c$ is correct.
- **Replicator (§6).** Simplex preservation $\sum \dot x_i = \bar f - \bar f = 0$ and face invariance hold. RPS conserved quantity $H = -\sum\ln x_i$: for the antisymmetric $A$ given, $\sum_i f_i = 0$ (column sums vanish) and $\bar f = x^\top A x = 0$, so $\dot H = -\sum(f_i-\bar f) = 0$. Nash $\Leftrightarrow$ interior fixed point of replicator is the standard Bishop–Cannings folk theorem statement.
- **Mutation–selection (§7).** $\Delta q = u(1-q) - sq(1-q)$ factors as $(1-q)(u-sq)$, equilibria $q=1$ or $q = u/s$; under $u \ll s$, $\hat q \approx u/s$. Haldane–Muller load $L = s\hat q = u$ is correctly $s$-independent.

## Wrong / dubious claims

- **mathematical-biology.html:398 — absorption-time formula off by factor 2.** Readout prints `expected time to absorption ≈ -2N·(p₀ ln p₀ + (1-p₀) ln (1-p₀))`. The Kimura unconditional mean absorption time is $\bar t(p) = -4N_e[p\ln p + (1-p)\ln(1-p)]$ generations (in 2N-rescaled time it's $-2[\cdot]$, so converting back multiplies by $2N$, giving $-4N[\cdot]$). Coefficient should be $-4N$, not $-2N$.
- **mathematical-biology.html:564 — "fixation probability near $\sigma/(1-e^{-2\sigma})$" is dimensionally wrong.** From $u(p) \approx 2\sigma p/(1-e^{-2\sigma})$ near $p=0$, a *single* mutant at $p = 1/(2N)$ has fixation probability $\sim 2s/(1-e^{-2\sigma})$, or equivalently the *slope* $u'(0) = 2\sigma/(1-e^{-2\sigma})$. As written ("a single rare mutant has fixation probability near $\sigma/(1-e^{-2\sigma})$") it is missing the $\times p$ factor and the leading 2; it reads as if the probability itself is $\sim \sigma$.
- **mathematical-biology.html:825 — "centre (a degenerate spiral …)".** A centre is its own linear-classification class (purely imaginary eigenvalues, neutrally stable closed orbits); it is not a "degenerate spiral." Wording conflates two distinct phase-portrait categories.

## Underspecified or unverifiable claims

- **mathematical-biology.html:1014 / 1109 — hawk-dove-retaliator matrix.** The custom matrix $A = [[-0.5, 4, 1],[0, 2, 1.5],[2, 2, 1.5]]$ has rows 2 and 3 identical in their last two columns; whether the resulting interior fixed point is (a) interior, (b) unique, (c) an ESS in the Maynard Smith sense (and not merely a stable rest point) is not derived. Standard hawk-dove-retaliator (Maynard Smith 1973) uses cost/benefit parameters $V, C$, not these numbers — provenance of the entries is unclear. Claim "stable interior ESS" is asserted, not verified.
- **mathematical-biology.html:1142 — "replicator $\leftrightarrow$ Lotka–Volterra in $m=3$".** Hofbauer's conjugacy (replicator on $\Delta^{m-1}$ ↔ generalized LV on $\mathbb R_+^{m-1}$) is real, but the projection $(x_1,x_2,x_3)\mapsto(x_1/x_3,x_2/x_3)$ produces a *generalized* (Lotka–Volterra–Hofbauer) system, not the classical 2-species predator–prey LV that opened §5. The text elides this distinction.
- **mathematical-biology.html:560 — "$|\sigma|\le 1$ the curve is approximately the neutral diagonal".** Quantitatively the $O(\sigma)$ correction to $u(p) = p$ is $\sigma p(1-p)$, so deviations near $p=1/2$ reach $\sim \sigma/4$, i.e. $\sim 25\%$ at $\sigma=1$ — visually the curve is bowed, not "approximately diagonal." Threshold "$|\sigma|\le 1$" is loose.
- **mathematical-biology.html:1271 — "rate function is Kimura's $1-e^{-2Ns}$".** $1-e^{-2Ns}$ is the (denominator of the) fixation probability, not a large-deviation rate function. The phrasing conflates two quantities.

## Severity

**Minor.** The bulk of the math is correct and well-derived. One genuine numerical bug (absorption-time factor of 2 in a widget readout — line 398), one dimensionally-loose statement about Kimura fixation near $p=0$ (line 564), and a few imprecise / under-justified pedagogical asides. Nothing structurally wrong with the models or derivations.
