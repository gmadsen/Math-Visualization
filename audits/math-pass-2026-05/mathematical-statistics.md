# mathematical-statistics — math-correctness pass

## Verified claims

**§1 Estimators / sufficiency.** MSE = bias² + variance ✓. Fisher–Neyman factorisation stated correctly. Joint sufficiency of $(\sum X_i, \sum X_i^2)$ for $\mathcal{N}(\mu,\sigma^2)$ ✓. Worked example: bias of $\hat\sigma^2_{MLE}$ is $-\sigma^2/n$ ($\mathbb{E}[\hat\sigma^2_{MLE}]=(n-1)\sigma^2/n$) ✓; $S^2$ unbiased ✓. Widget formulas $\mathrm{Var}(S^2)=2\sigma^4/(n-1)$ and $\mathrm{Var}(\hat\sigma^2_{MLE})=2(n-1)\sigma^4/n^2$ ✓.

**§2 MLE / score.** Score equation, mean-zero score, $\mathrm{Var}(\text{score})=I(\theta)$, equivalence of two Fisher-info forms under regularity ✓. Asymptotic normality $\sqrt n(\hat\theta_n-\theta)\Rightarrow\mathcal{N}(0,1/I)$ ✓. Empirical-KL identity $D(\hat p_n\|p_\theta)=\mathbb{E}_{\hat p_n}[\log\hat p_n]-\ell(\theta)/n$ ✓. Exponential MLE $\hat\lambda=1/\bar X$, $I(\lambda)=1/\lambda^2$ ✓. Widget: Bernoulli MLE $\hat\theta=k/n$, per-sample $I(\theta)=1/(\theta(1-\theta))$, asymptotic SD $1/\sqrt{nI}$ ✓.

**§3 CRLB / Rao–Blackwell / Lehmann–Scheffé.** CRLB $\mathrm{Var}\ge 1/(nI)$ ✓. Rao–Blackwell decomposition via law-of-total-variance ✓. Lehmann–Scheffé (complete sufficient ⇒ unique UMVU) ✓. Worked: CRLB for $\mu$ in $\mathcal{N}(\mu,\sigma^2)$ known-$\sigma^2$ is $\sigma^2/n$, achieved by $\bar X$ ✓; for $\sigma^2$ with $\mu$ known, CRLB $2\sigma^4/n$ achieved by $n^{-1}\sum(X_i-\mu)^2$ ✓.

**§4 Testing.** Size, power, NP lemma simple-vs-simple statement ✓. $p$-value definition + warning that $p\ne\mathbb{P}(H_0\mid x)$ ✓. One-sample $z$-test: critical value $1.645/\sqrt{25}=0.329$ ✓; power at $\mu=0.5$ is $\Phi(0.855)\approx 0.804$ ✓.

**§5 Bayesian.** Bayes-rule posterior, conjugate table (Beta/Binom, Gamma/Poisson, Normal/Normal) ✓. Posterior mean / median / mode under squared / absolute / 0-1 loss ✓. Worked: prior Beta(1,1), $k=7$, $n=10$ → posterior Beta(8,4); mean $8/12$, mode $7/10=$ MLE ✓. Widget posterior mode formula $(α-1)/(α+β-2)$ ✓.

**§6 Asymptotics.** Delta method, Slutsky, Wilks $-2\log\Lambda\Rightarrow\chi^2_r$ all stated correctly ✓. $r=\dim\Theta-\dim\Theta_0$ ✓. Worked delta example: $g(p)=p^2$ → asymptotic variance $4p^3(1-p)$; at $p=1/2$ gives $1/4$ ✓.

## Wrong / dubious claims

None of substance.

## Underspecified or unverifiable claims

- **mathematical-statistics.html:803** "MAP minimises a 0–1 loss" — strictly the 0–1-loss Bayes estimator is the mode only as a limit of $\varepsilon$-ball losses for continuous parameters; the page passes this off without the limiting caveat. Standard textbook informalism, not wrong.
- **mathematical-statistics.html:551** "Sample mean $\bar X$ is UMVU for $\mathcal{N}(\mu,\sigma^2)$'s mean — its variance $\sigma^2/n$ exactly equals $1/(nI)$." UMVU holds for $\sigma^2$ known *or* unknown, but the equality $\sigma^2/n = 1/(nI(\mu))$ uses $I(\mu)=1/\sigma^2$ which assumes $\sigma^2$ is the known scalar parameter. Mild conflation; conclusion still correct.
- **mathematical-statistics.html:313** "$\mathrm{MSE}(\hat\sigma^2_{MLE})<\mathrm{MSE}(S^2)$ for moderate $n$" — actually holds for *every* $n\ge 2$ in the Gaussian case (the $1/(n+1)$-divisor estimator dominates both). "Moderate $n$" is unnecessarily hedged but not wrong.
- **Bootstrap** — not covered on this page (prompt asked, but the page makes no bootstrap claims to verify).
- **Widget §3 "inefficient" point at $(n=10, v=1.5/(10I))$** is purely illustrative; no claim attached.

## Severity

**clean** — no math errors. Three minor stylistic loosenesses listed above; none change a result.
