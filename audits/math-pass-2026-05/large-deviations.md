# large-deviations.html — math-correctness audit

## Verified claims (sections)

**§1 Cramér's theorem.** Hypothesis (finite log-MGF on a neighbourhood of 0) and statement of Cramér's theorem in i.i.d. real-valued case correct (lines 265–272). LDP packaging with closed/open inequalities $\inf_F I$, $\inf_G I$ correct. Tilt heuristic ("pick $\theta^*$ with $\Lambda'(\theta^*)=x$") correct (line 274).

- Gaussian: $\Lambda(\theta)=\theta^2/2$, $I(x)=x^2/2$ — correct (line 276).
- Bernoulli: $\Lambda(\theta)=\log(1-p+pe^\theta)$, $I(x) = x\log(x/p)+(1-x)\log((1-x)/(1-p))$ on $[0,1]$ — correct, equals $H(\text{Ber}(x)\|\text{Ber}(p))$ (lines 278–280).

**§2 Rate functions.** Good-rate-function definition (lsc, compact level sets, vanishing at $\mu$) correct (lines 437–440). $I(\mu)=0$ justification via $\theta=0$ optimal — correct.

- Gaussian general: $\Lambda(\theta)=\sigma^2\theta^2/2+\mu\theta$, $I(x)=(x-\mu)^2/(2\sigma^2)$ — correct (line 444).
- Exp(1): $\Lambda(\theta)=-\log(1-\theta)$ on $\theta<1$, $I(x)=x-1-\log x$ on $(0,\infty)$ — correct; matches Itakura–Saito $d_{IS}(x,1)$ (line 448).
- Poisson(1) (widget): $I(x)=x\log x - x + 1$ — correct.
- CLT-from-LDP linearisation: $I''(\mu)=1/\sigma^2$ via $I''(\mu)=1/\Lambda''(0)$ — correct (line 450).

**§3 Sanov.** Statement of Sanov LDP with rate $H(\nu\|\mu)$, definition of relative entropy with $+\infty$ off absolute continuity — correct (lines 579–583). Finite-alphabet form $\sum \nu_i\log(\nu_i/\mu_i)$ — correct. Pinsker $H \ge 2\|\nu-\mu\|_{TV}^2$ — correct in nats with TV $=\tfrac12\|\cdot\|_1$ (line 587). Contraction-principle statement and recovery of Cramér via Lagrange — correct (line 589). Numerical check of biased-coin KL: $H(\text{Ber}(0.9)\|\text{Ber}(0.5)) = 0.9\log 1.8 + 0.1\log 0.2 \approx 0.368$ — matches (line 591).

**§4 Gärtner–Ellis.** Hypotheses (limit $\Lambda(\theta)$ exists, finite on nbhd of 0, essentially smooth) and conclusion $I=\Lambda^*$ — correct (lines 709–711). AR(1) computation: stationary long-run variance of $\bar X_n$ is $1/(1-\rho)^2$, hence $\Lambda(\theta)=\theta^2/(2(1-\rho)^2)$ and $I(x)=(1-\rho)^2 x^2/2$ — correct (line 716). Essential-smoothness rationale (upper bound retained, lower bound can fail at exposed boundary points) — correct (line 719).

**§5 Schilder / Freidlin–Wentzell.** Schilder rate $\tfrac12\int_0^T|\dot\phi|^2\,dt$ for absolutely continuous $\phi$ with $\phi(0)=0$, $+\infty$ otherwise, speed $1/\varepsilon$ — correct (lines 842–844). Freidlin–Wentzell action $\tfrac12\int|\dot\phi - b(\phi)|^2\,dt$ for additive identity-diffusion SDE — correct (line 848). Quasi-potential definition and exit-time asymptotic $\mathbb{E}_{x_0}[\tau_D]\asymp\exp(V/\varepsilon)$ — correct (lines 849–850). Eyring–Kramers prefactor refinement and instanton concentration — correct.

**§5 Boltzmann / Gibbs.** $W\asymp e^{nS(\nu)}$ with $S=-H(\nu\|\mu)$ recovering $S=k\log W$ — correct in spirit (line 854). Gibbs measure as max of $S-\beta\langle E\rangle$ — correct (Gibbs variational principle).

## Wrong / dubious claims (with file:line)

None found. All verifiable mathematical statements check out against standard references (Dembo–Zeitouni; den Hollander; Varadhan).

## Underspecified or unverifiable claims

- **(Line 442) Fenchel–Moreau wording.** "$(\Lambda^*)^* = \Lambda$ holds wherever $\Lambda$ is convex and lsc" reads pointwise; the theorem requires proper + convex + lsc and concludes globally. Mathematically defensible but loose.
- **(Line 587) Pinsker constant.** "$H \ge 2\|\nu-\mu\|_{TV}^2$" is correct only when TV is the half-$L^1$ definition (range $[0,1]$); the alternative convention ($\|\cdot\|_1$, range $[0,2]$) would need $\tfrac12$ instead of $2$. Topic uses the standard probabilist's TV so fine, but convention is unstated.
- **(Line 716) AR(1) variance ambiguity.** Statement reads "stationary mean 0, variance $1/(1-\rho^2)$" (per-step variance) then asserts $\Lambda(\theta)=\theta^2/(2(1-\rho)^2)$ (long-run variance of the *average*). Both numbers are correct but the reader has to recognise the silent switch from per-step to long-run variance.
- **Out-of-scope per audit checklist.** Page does not cover Varadhan's lemma (only mentioned by name in hero), Chernoff bound, Hoeffding, or Bennett/Bernstein. The contraction principle is stated only inside a §3 note. Not errors — just gaps relative to the audit prompt's checklist.

## Severity

**Clean.** No mathematical errors. Three minor wording / convention issues worth tightening for precision but none misleading. The AR(1) variance/long-run-variance switch (§4) is the most likely to confuse a careful reader.
