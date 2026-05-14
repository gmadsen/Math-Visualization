# Math correctness audit — `probability-theory.html`

Audited 2026-05-14 (read-only). Pedagogy intentionally skipped.
Format per section: **Verified · Wrong/dubious · Underspecified · Severity**.

---

## §1 Sample spaces, events, probability measures (lines 272–377)

- **Verified.** Probability-space triple $(\Omega,\mathcal{F},\mathbb{P})$, $\sigma$-algebra axioms, countable additivity, continuity of measure ($A_n\uparrow A\Rightarrow \mathbb{P}(A_n)\uparrow\mathbb{P}(A)$; dual for $\downarrow$). Two-dice example $\{$sum $\ge 10\}$ has 6 outcomes $(4,6),(5,5),(5,6),(6,4),(6,5),(6,6)$, $P=1/6$ ✓. Widget computes $|A|/36$ for each event ✓.
- **Wrong/dubious.** None.
- **Severity.** None.

## §2 Conditional probability and Bayes (lines 378–484)

- **Verified.** $P(A\mid B)$, independence as product, Bayes, law of total probability. Medical-test example: $P(D\mid +)=0.99\cdot 0.01/(0.99\cdot 0.01+0.05\cdot 0.99)=0.0099/0.0594\approx 0.1667$ ✓. Widget computes posterior correctly.
- **Severity.** None.

## §3 Random variables (lines 485–605)

- **Verified.** Measurable function definition, push-forward law $\mathbb{P}_X(B)=\mathbb{P}(X^{-1}(B))$, CDF non-decreasing/right-continuous, $\pi$-$\lambda$ uniqueness on half-lines, independence as factorization of joint law. Inverse-CDF transform: $X=F^{-1}(U)\Rightarrow F_X=F$ ✓.
- **Severity.** None.

## §4 Supports, distributions, densities (lines 606–836)

- **Verified.** PMF/PDF definitions; Lebesgue decomposition (ac + sc + discrete) mentioned correctly. Distribution table:
  - Bernoulli$(p)$ $p^k(1-p)^{1-k}$, mean $p$, var $p(1-p)$ ✓
  - Binomial$(n,p)$ mean $np$, var $np(1-p)$ ✓
  - Poisson$(\lambda)$ mean $=$ var $=\lambda$ ✓
  - Uniform$[a,b]$ mean $(a+b)/2$, var $(b-a)^2/12$ ✓
  - Exponential$(\lambda)$ mean $1/\lambda$, var $1/\lambda^2$ ✓
  - Gaussian$(\mu,\sigma^2)$ ✓
  - $U\sim U[0,1]\Rightarrow -\ln U\sim\mathrm{Exp}(1)$: $P(-\ln U\le x)=P(U\ge e^{-x})=1-e^{-x}$ ✓.
- **Severity.** None.

## §5 Expectation, variance, moments (lines 837–988)

- **Verified.** $\mathbb{E}[X]=\int X\,d\mathbb{P}$; linearity (no independence required); Var as $\mathbb{E}[X^2]-(\mathbb{E}X)^2$; Cov $=\mathbb{E}[XY]-\mathbb{E}X\mathbb{E}Y$; independent $\Rightarrow$ Cov $=0$, converse fails ✓; Markov inequality $P(X\ge a)\le \mathbb{E}X/a$; Chebyshev as Markov on $|X-\mu|^2$. Centre-of-mass widget computes $\mu=\sum w_i x_i/\sum w_i$ and $\sigma^2$ correctly.
- **Severity.** None.

## §6 Moment & characteristic functions (lines 989–1105)

- **Verified.** $M_X(t)=\mathbb{E}[e^{tX}]$ with Taylor coefficients $\mathbb{E}[X^k]/k!$ when finite on a neighborhood of 0. $\varphi_X(t)=\mathbb{E}[e^{itX}]$ always defined since $|e^{itX}|=1$. Lévy uniqueness + Lévy continuity correctly stated. $M_{X+Y}=M_X M_Y$, $\varphi_{X+Y}=\varphi_X\varphi_Y$ for independents ✓. Gaussian: $M_X(t)=e^{\mu t+\sigma^2 t^2/2}$, $\varphi_X(t)=e^{i\mu t-\sigma^2 t^2/2}$, $M'(0)=\mu$, $M''(0)=\mu^2+\sigma^2$ ✓. Bernoulli$(p)$, Poisson$(\lambda)$, Exponential$(\lambda)$, Gaussian MGFs all correct.
- **Underspecified.** Slogan "the Gaussian is the unique distribution whose CF has compact-support-like decay $e^{-ct^2}$" is a fuzzy paraphrase of Marcinkiewicz's theorem (the only distributions with $\varphi=e^P$ for $P$ polynomial have $\deg P\le 2$). Acceptable as motivation; not a claim to verify literally.
- **Severity.** None.

## §7 Modes of convergence (lines 1106–1158)

- **Verified.** Definitions (a.s., $L^p$, in probability, in distribution); chain a.s. $\Rightarrow$ in prob. $\Rightarrow$ in dist., $L^p\Rightarrow$ in prob.; counterexamples (typewriter, $n\mathbf{1}_{(0,1/n)}$, CLT-rescaled). Borel–Cantelli I (sum-finite $\Rightarrow$ i.o. has prob 0) and II (independent + sum-divergent $\Rightarrow$ i.o. has prob 1). Worked example $X_n=n\mathbf{1}_{A_n}$ with $\sum 1/n^2<\infty\Rightarrow X_n\to 0$ a.s. ✓.
- **Underspecified.** Parenthetical "the CLT gives convergence in distribution but NOT in probability — the sample mean itself does not converge (strongly)" conflates two objects. The CLT scaling $\sqrt N(\bar X_N-\mu)/\sigma$ converges in distribution but not in probability; the sample mean $\bar X_N$ itself converges a.s. (SLLN), hence in probability. The slogan reads as if $\bar X_N$ doesn't converge.
- **Severity.** Trivial.

## §8 Law of large numbers (lines 1159–1290)

- **Verified.** WLLN under finite variance via Chebyshev: $\mathrm{Var}(\bar X_N)=\sigma^2/N$, $P(|\bar X_N-\mu|\ge\varepsilon)\le\sigma^2/(N\varepsilon^2)$ ✓. SLLN (Kolmogorov) under $\mathbb{E}|X_1|<\infty$ ✓. Cauchy hypothesis sharpness: sample mean of i.i.d. Cauchy$(0,1)$ is again Cauchy$(0,1)$ ✓. Etemadi 1981 truncation sketch (pairwise independence suffices) ✓. Monte Carlo: $\frac{1}{N}\sum g(U_i)\to\int_0^1 g\,dx$ a.s. with $O(1/\sqrt N)$ CLT error ✓.
- **Severity.** None.

## §9 Central limit theorem (lines 1291–1435)

- **Verified.** Classical CLT statement ✓; Berry–Esseen rate $O(1/\sqrt N)$ in Kolmogorov distance ✓. CF proof: $\varphi_Y(t)=1-t^2/2+o(t^2)$, $(1-t^2/(2N)+o(1/N))^N\to e^{-t^2/2}$ ✓. Lindeberg condition correctly stated. Bernoulli$(1/2)$ example $N=100$: $\mathbb{E}S_{100}=50$, $\mathrm{Var}=25$, $Z=2$, $P(Z\ge 2)\approx 0.0228$ vs exact binomial $0.0284$ ✓ (Python check confirms both).
- **Severity.** None.

## §10 Markov chains (lines 1436–1613)

- **Verified.** Markov property, transition matrix with row sums 1, $n$-step matrix $P^n$, stationarity $\pi P=\pi$, ergodic theorem under irreducibility + aperiodicity, reversibility / detailed balance, reducible counterexample.
- **Wrong/dubious.**
  - **Weather chain stationary distribution (line 1457).** Page asserts $\pi\approx(0.47,0.28,0.25)$ for $P=\bigl(\substack{.7\,.2\,.1\\.3\,.4\,.3\\.2\,.3\,.5}\bigr)$. Solving $\pi P=\pi$ with $\sum\pi_i=1$ gives $\pi=(21/46,13/46,12/46)\approx(0.4565,0.2826,0.2609)$. Component-wise the page's third entry $0.25$ is rounded down too far (true value $0.2609$ rounds to $0.26$). Sum of page's values is $1.00$ only by coincidence; correct rounding to two decimals is $(0.46,0.28,0.26)$. The widget computes the true value via power iteration and displays it correctly, so the prose disagrees with what the user sees.
- **Severity.** Trivial (rounding error in prose; widget is correct).

## §11 Martingales (lines 1614–1656)

- **Verified.** Filtration / adapted / martingale definition; sub/super-martingale; stopping-time definition $\{\tau\le n\}\in\mathcal{F}_n$; OST under (bounded $\tau$) OR (UI) OR (a.s. finite $\tau$ + bounded stopped process); SRW $\tau=\inf\{n:S_n=1\}$ as canonical OST failure with $\mathbb{E}[S_\tau]=1\ne 0$ ✓. Doob martingale convergence: $L^1$-bounded $\Rightarrow$ a.s.; UI added gives $L^1$. Product-martingale counterexample $M_n=\prod X_i$ with $P(X_i=2)=P(X_i=0)=1/2$: $\mathbb{E}M_n=1$ but $M_n\to 0$ a.s. ✓. Doob's maximal $\|M^*_n\|_p\le(p/(p-1))\|M_n\|_p$ for sub-martingale, $p>1$ ✓. Random-walk worked example as martingale ✓.
- **Severity.** None.

## §12 Brownian motion (lines 1658–1817)

- **Verified.** Wiener-process axioms (start at 0, independent stationary $\mathcal{N}(0,t-s)$ increments, continuous paths). Existence sources (Kolmogorov + continuity, Lévy dyadic, Donsker) ✓. $W_t$ martingale; $W_t^2-t$ martingale; $e^{\theta W_t-\theta^2 t/2}$ exponential martingale ✓. Quadratic variation $\sum(W_{t_{k+1}}-W_{t_k})^2\to t$ in probability with infinite total variation ✓. Brownian scaling $W_{ct}\stackrel{d}{=}\sqrt c W_t$, $H=1/2$ ✓. Donsker formula correct (linear interpolation of $S_{\lfloor Nt\rfloor}/\sqrt N$). Black–Scholes call $C=S_0\Phi(d_1)-Ke^{-rT}\Phi(d_2)$ with $d_{1,2}=(\ln(S_0/K)+(r\pm\sigma^2/2)T)/(\sigma\sqrt T)$ ✓. Widget integrates Brownian path with $\sqrt{1/N}\cdot Z$ increments and reports quadratic variation $\to t=1$ ✓.
- **Underspecified.** "Itô's formula applied to $e^{-rt}\ln S_t$ gives the computation" is a hand-wavy attribution; the textbook derivation applies Itô to $e^{-rt}S_t$ (discounted price as martingale under risk-neutral measure). Not wrong, just loose.
- **Severity.** None.

---

## Quiz bank `quizzes/probability-theory.json`

Most answer keys verified. Sampled high-effort checks:

- `conditional-bayes` — medical-test posterior $0.1667$ ✓; Monty Hall $2/3$ ✓; pairwise-but-not-mutually-independent example correct ($P(A\cap B\cap C)=1/4\ne 1/8$).
- `random-variables` — push-forward singleton, Vitali non-Borel, $Y=-\ln U$ tail $e^{-1}\approx 0.3679$ all ✓.
- `expectation-moments` — uniform-on-six $\mathbb{E}[X^2]=91/6\approx 15.1667$ ✓; Var of density $2x$ on $[0,1]$ $=1/2-4/9=1/18\approx 0.0556$ ✓; Cauchy expectation undefined (Lebesgue) ✓; Jensen on $1/x$ ✓.
- `generating-functions` — $M_{\mathcal N(0,1)}(1)=e^{1/2}\approx 1.6487$ ✓; $\varphi_{\mathcal N(0,1)}(1)=e^{-1/2}\approx 0.6065$ ✓; Cauchy CF $e^{-|t|}$ ✓; Lévy-continuity expert Q has continuity-at-0 hypothesis correctly cited.
- `law-of-large-numbers` — Chebyshev bound $0.25/(10000\cdot 0.0025)=0.01$ ✓; DKW exponent $1/2$ ✓; Etemadi pairwise independence ✓.
- `central-limit-theorem` — Bernoulli$(1/2)$ $N=100$ Gaussian approx $\approx 0.023$ ✓; Cauchy $\bar X_N\sim$ Cauchy$(0,1)$ for every $N$ ✓; Berry–Esseen tight at $1/\sqrt N$ for lattice distributions ✓; Lindeberg condition correctly written.
- `markov-chains` — 2-state stationary $\pi_1=4/7\approx 0.5714$ ✓; Pólya $\mathbb Z^3$ return $\approx 0.3405$ ✓; reducible 2-class chain has 1-parameter family of stationary distributions ✓.
- `martingales` — random walk martingale ✓; OST conditions ✓; product-martingale failure ✓; Doob's $L^p$ inequality ✓.
- `brownian-motion` — $P(W_1>1.96)\approx 0.025$ ✓; quadratic variation $=t$ ✓; Donsker's invariance principle ✓; diffusive scaling $\sigma\sim N^{-1/2}$ ✓; $W_t^2-t$ martingale, Itô's $\frac12 f''$ correction ✓.

- **Wrong/dubious.**
  - **`martingales` hard Q1 explanation/hint (lines 815–826) — incorrect numerical claim about $\sup_n\mathbb{E}|S_{n\wedge\tau}|$.** The hint asks "is $\sup_n\mathbb{E}|S_{n\wedge\tau}|<\infty$?" and the explanation states "$\sup_n\mathbb{E}|S_{n\wedge\tau}|=\infty$." But for SRW $\tau=\inf\{n:S_n=1\}$, $S_{n\wedge\tau}\le 1$ a.s., $\mathbb{E}[S_{n\wedge\tau}]=0$ (OST applied to bounded $n\wedge\tau$), so $\mathbb{E}[S_{n\wedge\tau}^+]=\mathbb{E}[S_{n\wedge\tau}^-]\le P(\tau\le n)\le 1$, giving $\mathbb{E}|S_{n\wedge\tau}|\le 2$, bounded. The stopped process is **$L^1$-bounded** (sup $\le 2$); what fails is **uniform integrability** ($S_{n\wedge\tau}^-$ has unbounded tail mass). The chosen answer (option 2) and conclusion ("not UI") are correct, but the elaboration's diagnosis "sup mean is infinite" is mathematically wrong.
  - **`sample-spaces-events` hard Q1 (Bonferroni naming).** The page calls $\mathbb{P}(\bigcup A_i)\le\sum\mathbb{P}(A_i)$ "Bonferroni's inequality." Standard nomenclature is **Boole's inequality** (or "union bound"); Bonferroni's inequalities refer to the truncated inclusion–exclusion bounds. Nomenclature only — the math (equality iff disjoint) is correct.
  - **`convergence-rv` expert Q (Scheffé) explanation.** Says total-variation convergence "gives in-probability convergence as well." TV convergence of laws is strictly stronger than convergence in distribution, but does **not** give in-probability convergence of specific RVs (which requires a coupling, and the RVs may live on different spaces). Common textbook simplification, not a hard error.

- **Severity.** Minor (one quantitative slip in `martingales` hard Q1 explanation; two pedagogically-loose statements).

---

## Concept graph `concepts/probability-theory.json`

All 12 concepts have well-formed entries; anchor IDs match the `<section id="…">` values (sample, bayes, rv, supports, expectation, gen-fun, conv, lln, clt, markov, martingales, brownian). Prereq edges are coherent and the cross-topic edges to `measure-theory` (sigma-algebras, lebesgue-measure, measurable-functions, lebesgue-integral, lp-spaces, convergence-theorems) and `algebra` (algebraic-structures) all resolve.

---

## Summary

| Section | Severity | Notes |
|---|---|---|
| §1–§9 | none | Axioms, LLN, CLT, distribution table, MGF/CF, Berry–Esseen, modes-of-convergence chain all correct |
| §10 weather chain | trivial | Stated $\pi\approx(0.47,0.28,0.25)$; correct $(0.46,0.28,0.26)$; widget numerics fine |
| §11 martingales | none | Doob convergence, OST, product-martingale counterexample all correct |
| §12 Brownian | none | Wiener axioms, quadratic variation, scaling, Donsker, Black–Scholes all correct |
| `martingales` hard Q1 | minor | Explanation says $\sup\mathbb{E}|S_{n\wedge\tau}|=\infty$; actually $\le 2$. UI failure (the chosen answer) is right; the diagnostic is wrong |
| `sample-spaces-events` hard Q1 | trivial | Calls union bound "Bonferroni" instead of Boole |
| `convergence-rv` expert | trivial | "TV convergence gives in-probability" — needs coupling caveat |

**Overall severity: minor.** All major theorems (LLN, CLT, Berry–Esseen, Lévy uniqueness/continuity, Doob's OST/convergence/maximal, Donsker, Itô) are correctly stated with correct hypotheses. One numerical slip (weather $\pi_3$), one over-aggressive claim in a quiz explanation (sup-norm of stopped SRW), and two minor pedagogical loosenesses. Distribution table, MGFs, characteristic functions, and all worked-example computations check out arithmetically.
