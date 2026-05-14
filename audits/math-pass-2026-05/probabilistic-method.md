# probabilistic-method.html — math correctness audit

## Verified claims

- **§1 Hamilton-path expectation.** $\mathbb{E}[X] = n!\,2^{-(n-1)}$ for fair-coin orientations of $K_n$ — correct (each of $n!$ permutations needs $n-1$ forward edges, independent). Szele 1943 attribution correct.
- **§2 Ramsey upper bound.** $R(k,k) \le \binom{2k-2}{k-1} \sim 4^k$ — Erdős–Szekeres, correct.
- **§2 Erdős 1947 lower bound.** $\binom{n}{k}\,2^{1-\binom{k}{2}} < 1 \Rightarrow R(k,k) > n$. Monochromatic-$K_k$ probability $2^{1-\binom{k}{2}}$ is correct (2 colour choices × $2^{-\binom{k}{2}}$ matched edges). Setting $n = \lfloor 2^{k/2}\rfloor$ verifies for $k \ge 3$.
- **§2 Campos–Griffiths–Morris–Sahasrabudhe 2023.** Upper bound from $4^k$ to $(4-\varepsilon)^k$ — correct.
- **§3 $\alpha(G(n,1/2))$.** $\mathbb{E}[\#\text{indep $k$-sets}] = \binom{n}{k}\,2^{-\binom{k}{2}}$, threshold $k \approx 2\log_2 n$ — correct (sharp leading constant).
- **§3 Erdős 1959 high-girth / high-chromatic.** Sample $G(n, n^{\theta-1})$, expected short cycles polynomial in $n$, then alteration — correct argument and attribution.
- **§4 Caro–Wei / Turán bound.** $\alpha(G) \ge \sum_v 1/(d_v+1)$ — correct (called "Turán-type" here, more commonly Caro–Wei 1979/1981).
- **§5 Symmetric LLL.** $e\,p\,(d+1) \le 1$ — correct (Spencer's symmetric form). Asymmetric statement also correct.
- **§5 $k$-SAT.** $T \le 2^k/(ek)$ derivation: $d = k(T-1)$ is correct (each clause shares variables with at most $k(T-1)$ others); plugging into LLL and approximating $d+1 \approx kT$ gives the stated bound. Standard, correct.
- **§5 Moser–Tardos 2010.** Algorithmic LLL with expected resamplings $\sum x_i/(1-x_i)$ — correct.
- **§6 Triangle threshold.** $p_c = 1/n$, $\mathbb{E}[X_T] \sim n^3 p^3 / 6$, Poisson limit at $p=c/n$ with parameter $c^3/6$ — correct.
- **§6 Connectivity / Hamiltonicity / giant-component thresholds.** $\log n/n$, $\log n/n$, $1/n$ — correct at leading order (sharp Hamiltonicity threshold by Komlós–Szemerédi / Bollobás, leading term as stated).
- **§7 Concentration table.** Markov, Chebyshev, Hoeffding, Azuma statements all correct as written, including the constants $2t^2/\sum c_i^2$ (Hoeffding) and $t^2/(2\sum c_i^2)$ (Azuma).
- **§7 Shamir–Spencer 1987.** $\chi(G(n,p))$ concentrated in $O(\sqrt{n\log n})$ via vertex-exposure martingale and Azuma — correct.
- **§7 Talagrand 1995.** Configuration-function concentration on certificate scale — correct (Talagrand's inequality, Publ. IHÉS 1995).
- **Widget arithmetic.** Hamilton-path counter, union-bound log computation, LLL feasibility region $p = 1/(e(d+1))$, Hoeffding $\exp(-2t^2/n)$, Markov $\mu/(\mu+t)$, exact binomial tail — all numerically correct.

## Wrong / dubious claims

- **§6 Triangle variance "share 0" claim.** `probabilistic-method.html:910` — *"Above $p_c$ the dominant pair-type is 'share $0$', giving $\operatorname{Var} \sim \mathbb{E}[X]$"* is incorrect. Pairs sharing 0 edges have $\operatorname{Cov}(\mathbf{1}_T, \mathbf{1}_{T'}) = 0$ by independence and contribute **nothing** to the variance. The dominant variance contribution (above $p_c$, with $np \to \infty$) comes from triangle pairs sharing exactly one edge: $\sim n^4 p^5$, which is $o(\mathbb{E}[X]^2) = o(n^6 p^6)$ since $1/(n^2 p) \to 0$. Fix: replace "the dominant pair-type is 'share 0'" with "the dominant covariance contribution is from pairs sharing one edge".
- **§7 Chernoff statement.** `probabilistic-method.html:1037` — $\mathbb{P}(S_n \ge (1+\delta)\mu) \le e^{-\mu\delta^2/3}$ is correct **only for $0 < \delta \le 1$**. The page omits this regime restriction; for $\delta > 1$ the standard bound becomes $e^{-\mu\delta/3}$ (or use the Chernoff form $((e^\delta/(1+\delta)^{1+\delta})^\mu)$). Minor: add "for $\delta \in (0,1]$".

## Underspecified or unverifiable claims

- **§1 "$R(k,k) > 2^{k/2}$ has not been improved by more than a factor of 2 in the leading exponent since 1947"** (`:407`). Spencer 1975 improved the constant to $\sqrt{2}\,(k/e)\,2^{k/2}(1+o(1))$ via LLL, and the recent Conlon–Ferber 2021 / Sawin 2021 line gives an *exponential* improvement in the lower bound's pre-factor. The "leading exponent" stays $\sqrt{2}^k$, so the statement is technically defensible but elides the post-2020 progress; could read as misleadingly stagnant.
- **§3 Triangle-free high-chromatic step count.** Step (3): "$\alpha(G) < n^{1-\theta/2}$ w.h.p. via a Chebyshev-type bound" (`:527`) — the actual exponent in standard textbook proofs (Alon–Spencer ch. 3) is $\alpha < (3/p)\log n$, which equals $3 n^{1-\theta} \log n$, not $n^{1-\theta/2}$. The page's exponent appears off; verifying requires the precise definition of $\theta$ used, which is not pinned down. Either rewrite step (3) with explicit constants or cite the source.
- **§4 alteration optimisation.** "$q = 1/(np)$" giving $\alpha \ge n/(2\sqrt{p\binom{n}{2}})$ (`:645–647`) — the formula $nq - \binom{n}{2}q^2 p$ is correct, but optimising gives $q^* = 1/(np \cdot (n-1)/n) \approx 1/(np)$ and optimum value $\approx n/(2p(n-1)) \approx 1/(2p)$, which is $n^2/(2 \cdot pn^2 / 2)$ — the stated form $n/(2\sqrt{p\binom{n}{2}})$ has a stray square root and doesn't match the dimensional analysis. The Caro–Wei equivalence is real but the algebraic shortcut shown is muddled.

## Severity

**Minor** — one outright math error (§6 triangle variance attribution; the *conclusion* $\operatorname{Var} = o(\mathbb{E}[X]^2)$ is correct, only the explanation is wrong), one missing regime restriction (§7 Chernoff $\delta \le 1$), and two underspecified algebraic shortcuts (§3 exponent, §4 optimisation). All headline results — Erdős's $R(k,k) > 2^{k/2}$, the LLL statement and $k$-SAT corollary, the four concentration inequalities, the threshold table — are stated correctly. Worth a follow-up edit but no foundational claims need retraction.
