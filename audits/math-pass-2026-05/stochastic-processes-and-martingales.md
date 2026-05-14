# stochastic-processes-and-martingales — math correctness audit (2026-05)

**Section:** Probability & statistics

## Verified claims

### Filtrations and adapted processes (§1)

- **Filtration definition** (line 270): increasing chain $\mathcal F_0\subseteq\mathcal F_1\subseteq\cdots\subseteq\mathcal F$ — standard.
- **Stopping-time defn** (line 279): $\{\tau\le n\}\in\mathcal F_n$ for all $n$ — standard.
- **First-hitting-time of measurable set is a stopping time** (line 280) — verified ($\{\tau\le n\}=\bigcup_{k\le n}\{X_k\in B\}$).
- **Quiz `sp-filtrations`**: q1 (filtration is increasing), q2 (first hit is stopping, last visit / argmax / future-dependent are not), q3 ($P(S_\tau=3)=2/5=0.4$ on $\{-2,3\}$ from $0$ via $(0-a)/(b-a)$) — all correct.

### Discrete-time martingales (§2)

- **Martingale identity** $E[M_{n+1}|\mathcal F_n]=M_n$ (line 414) — standard.
- **Equivalent increment form** $E[\Delta M_{n+1}|\mathcal F_n]=0$ — correct.
- **Mean-zero random walk is a martingale** — verified.
- **Doob martingale** $M_n=E[Z|\mathcal F_n]$ via tower (line 420) — verified.
- **$S_n^2-n\sigma^2$ is a martingale, $S_n^2$ only submartingale** (line 421) — verified.
- **Wald exponential** $M_n=e^{\theta S_n}/\varphi(\theta)^n$ (line 422) — verified ($E[e^{\theta S_{n+1}}|\mathcal F_n]=e^{\theta S_n}\varphi(\theta)$).
- **Biased walk: $S_n-n(p-q)$ and $(q/p)^{S_n}$ are martingales** (line 425) — verified ($E[(q/p)^{X}]=p\cdot(q/p)+q\cdot(p/q)=q+p=1$).
- **Quiz `sp-discrete-martingales`** q1–q3 — all correct ($S_n^2-n$ via $E[S_{n+1}^2|\mathcal F_n]=S_n^2+1$).

### Optional stopping theorem (§3)

- **Three-condition statement** (lines 549–557): bounded $\tau$ / UI $M$ / a.s.-finite $\tau$ with bounded stopped process — correct standard formulation.
- **Counter-example $\tau=\inf\{n:S_n=1\}$** for symmetric SRW (line 559): $\tau<\infty$ a.s. by recurrence, $E[S_\tau]=1\ne 0$, none of (1)–(3) hold — verified.
- **Gambler's ruin on $\{a,\ldots,b\}$** (line 562): $p=-a/(b-a)$ from $E[S_\tau]=0$ — verified.
- **Expected exit time** $E[\tau]=|a|\cdot b$ via $S_n^2-n$ (line 564): $pb^2+(1-p)a^2 = b\cdot(-a)/(b-a)\cdot b + (b/(b-a))a^2 = -a b(a+b)/(b-a)+\ldots$; clean check via the identity $pb^2+(1-p)a^2=-ab$ when $p=-a/(b-a)$ — verified.
- **Wald's identity** $E[S_\tau]=\mu E[\tau]$ (line 566) — correct.
- **Quiz `sp-optional-stopping`** q1 (3 sufficient conds), q2 ($P(S_\tau=5)=3/8=0.375$ on $\{-3,5\}$, hint $E[\tau]=15=3\cdot 5$), q3 (Wald) — all correct.

### Doob decomposition and quadratic variation (§4)

- **Doob decomposition** $X_n=X_0+M_n+A_n$ with $M$ martingale, $A$ predictable, $M_0=A_0=0$, $A_n=\sum_{k=1}^n E[X_k-X_{k-1}|\mathcal F_{k-1}]$ (lines 683–685) — correct, including uniqueness argument (a predictable martingale starting at $0$ is identically $0$).
- **Predictable quadratic variation** $\langle M\rangle_n=\sum_{k=1}^n E[(\Delta M_k)^2|\mathcal F_{k-1}]$ (line 690) — correct.
- **$M_n^2-\langle M\rangle_n$ is a martingale** — correct.
- **Worked example $S_n^2$**: $\langle S\rangle_n=n$ via $E[2S_{k-1}X_k|\mathcal F_{k-1}]=0$ and $E[X_k^2]=1$ (line 695) — verified.
- **Quiz `sp-doob-decomposition`** q1 (decomposition form), q2 ($E[A_{10}]=10$), q3 (predictable QV vs. pathwise optional QV $[M]_n=\sum(\Delta M_k)^2$ distinction — explanation correctly distinguishes them) — all correct.

### Martingale convergence theorem (§5)

- **Doob's a.s. convergence theorem** (line 820): $\sup_n E|M_n|<\infty\Rightarrow M_n\to M_\infty\in L^1$ a.s. via upcrossings — correct.
- **UI definition** $\lim_{K\to\infty}\sup_n E[|M_n|\mathbf 1_{|M_n|>K}]=0$ (line 825) — standard.
- **$L^1$-conv $\Leftrightarrow$ UI for martingales, with $M_n=E[M_\infty|\mathcal F_n]$** (line 826) — correct (closed-martingale statement).
- **Doubling-product counter-example** $X_i\in\{0,2\}$ each w.p. $1/2$ (line 828): $E[M_n]=E[X]^n=1$, $M_n\to 0$ a.s. once first $0$ appears (a.s. finite hitting), so $L^1$ convergence fails — verified.
- **Pólya urn widget** (line 873): $M_n=$ red fraction is a $[0,1]$-bounded martingale; limit $M_\infty\sim\text{Beta}(1,1)=\text{Uniform}[0,1]$ with $E[M_\infty]=1/2$ — verified.
- **Quiz `sp-martingale-convergence`** q1 (a.s. conv from $L^1$-bdd), q2 (doubling product), q3 (UI for $L^1$ conv) — all correct.

### Continuous-time martingales and Brownian motion (§6)

- **BM definition** (line 972): $W_0=0$, indep. increments $W_t-W_s\sim\mathcal N(0,t-s)$, a.s.-continuous paths — correct.
- **Three martingales over $W$** (lines 974–979): $W_t$, $W_t^2-t$, $\exp(\theta W_t-\theta^2 t/2)$ — all verified ($E[\exp(\theta W_t)|\mathcal F_s]=\exp(\theta W_s)\exp(\theta^2(t-s)/2)$).
- **$\langle W\rangle_t=t$** — correct (predictable and pathwise QV coincide for continuous BM).
- **Quadratic-variation convergence** $\sum(W_{t_{k+1}}-W_{t_k})^2\xrightarrow{P} t$, total variation $\to\infty$ (line 982) — standard, correct.
- **Variance estimate** $\text{Var}(Q_N)=2t^2/N$ (line 989) — verified: $\Delta W\sim\mathcal N(0,t/N)$ gives $\text{Var}((\Delta W)^2)=2(t/N)^2$, sum over $N$ independent terms is $2t^2/N$. Matches widget readout std $\sqrt{2/N}$ at $t=1$.
- **Burkholder–Davis–Gundy** (lines 985–987): $c_p E[[M]_t^{p/2}]\le E[\sup_{s\le t}|M_s|^p]\le C_p E[[M]_t^{p/2}]$ for continuous local martingales $M$ with $M_0=0$ and $p\ge 1$ — correct standard form. (BDG actually holds for $0<p<\infty$, but $p\ge 1$ is the textbook quote.)
- **Quiz `sp-continuous-martingales`** q1 (indep stationary Gaussian increments + continuity), q2 ($W_t^2$ is submartingale, not martingale), q3 ($[W]_T=2$ at $T=2$) — all correct.

### Connections (§7)

- **Continuous-time framing as càdlàg** (line 972, "right-continuity with left limits"): standard for general continuous-time martingales (BM is in fact continuous, a stronger property). Correct.
- **FTAP statement** (line 1190): no-arbitrage $\Leftrightarrow$ existence of equivalent martingale measure — standard, correct.

## Wrong / dubious claims

None found. Every theorem statement (Doob's a.s. convergence, Doob decomposition, optional stopping with three sufficient conditions, BDG, $\langle W\rangle_t=t$, FTAP), every worked computation (gambler's ruin probability $-a/(b-a)$, expected exit time $|a|b$, $\langle S\rangle_n=n$, exponential martingale normalization, $(q/p)^{S_n}$ for biased walk, doubling-product counterexample, Pólya-urn limit), every numeric quiz answer ($P(S_\tau=3)=2/5$, $P(S_\tau=5)=3/8$, $E[A_{10}]=10$, $[W]_2=2$), and every widget-readout target ($Q_N$ std $\sqrt{2/N}$, $E[M_n]=1$ for the doubling product, gambler's-ruin theory bars) is mathematically correct.

## Underspecified or unverifiable claims

- **OST condition (b) "$M$ is uniformly integrable"** (line 552): requires implicit choice of stopping rule semantics — the cleanest statement asks UI of $\{M_{n\wedge\tau}\}$, but since UI of $M$ implies UI of every stopped subsequence (and hence UI of $\{M_{n\wedge\tau}\}$), the page's formulation is sufficient and standard.
- **BDG range $p\ge 1$** (line 985): textbook-standard; the inequality in fact extends to $0<p<\infty$ with universal constants (Burkholder 1973). Pedagogically loose but not wrong.
- **"Right-continuity with left limits"** as the regularity for continuous-time (line 972): correct general framework (càdlàg) for arbitrary continuous-time martingales; BM-specific paths are continuous, so the page's framing covers more than is strictly needed for the §6 examples. Not an error.
- **Pólya-urn limit distribution** is stated only via $E[M_\infty]=1/2$ in the widget readout (line 950); the stronger fact $M_\infty\sim\text{Uniform}[0,1]$ is suppressed. Pedagogical choice, not an error.

## Severity

**clean.** All theorem statements (Doob convergence, Doob decomposition, optional stopping with 3 sufficient conditions, BDG, $\langle W\rangle_t=t$, Wald's identity, FTAP), all worked computations (gambler's ruin probability and expected exit time, $\langle S\rangle_n=n$, exponential martingale, $(q/p)^{S_n}$ biased-walk martingale, doubling-product counter-example, Pólya-urn martingale and limit mean), all numeric quiz answers, and all widget readouts (variance $2t^2/N$, hitting-probability bars, doubling-product mean $1$ vs. a.s. limit $0$) are correct. The page is a faithful textbook treatment of the discrete-to-continuous martingale arc, with no substantive mathematical errors. A handful of formulations (OST condition (b) as "$M$ UI", BDG quoted only for $p\ge 1$, càdlàg framing carrying more generality than the BM examples need) are slightly looser than the most general literature statement but are entirely standard pedagogical phrasings.
