# optimal-control-and-dynamic-programming.html — math pass 2026-05

## Verified claims (sections)

- **§1 Problem setup** — Bolza cost, admissibility (measurable $u$), Kalman rank `rank[B|AB|…|A^{n-1}B] = n` for LTI controllability, Filippov existence (compact $U$, convex $f(x,U,t)$, bounded reachable) all stated correctly.
- **§3 Pontryagin** — `H = λᵀf − L` with maximize convention is internally consistent. Co-state eqn `λ̇ = −λᵀ ∂_x f + ∂_x L`, transversality `λ(T) = −∂_x Φ`, and bang-bang rule (when $H$ is affine in $u$ on a box) all correct. Identification `λ(t) = −∂_x V(x*(t), t)` (line 441) is consistent with the sign convention.
- **§4 HJB** — Derivation via Bellman + Taylor is correct. Boxed PDE `−∂_t V = inf_u {L + ∂_x V · f}`, terminal `V(·,T) = Φ`, viscosity-solution remark (Crandall–Lions 1983) all standard.
- **§4 HJB widget closed form** (line 471): plant $\dot x = u$, $|u|\le 1$, $L=u^2/2$, $\Phi=x^2/2$ gives $V(x,t) = x^2/(2(1+(T-t)))$. **Verified by substitution**: $V_t = x^2/(2(1+\tau)^2)$, $V_x^2/2 = x^2/(2(1+\tau)^2)$ with $\tau=T-t$. Note $|V_x|=|x|/(1+\tau)\le 1$ requires $|x|\le 1+\tau$ — fine for the displayed $x$-range, worth noting but not wrong.
- **§5 LQR Riccati ODE** (line 503): `−Ṗ = AᵀP + PA − PBR⁻¹BᵀP + Q`, $P(T)=S$. **Sign-correct** for the cost convention $J = \tfrac12\int(x^TQx+u^TRu)dt + \tfrac12 x(T)^TSx(T)$ with $Q,S\succeq 0$, $R\succ 0$. Optimal $u^* = -R^{-1}B^TP x$ matches. The post-dc194e53 fix is mathematically sound.
- **§5 Algebraic Riccati** (line 508): `AᵀP̄ + P̄A − P̄BR⁻¹BᵀP̄ + Q = 0` is the standard CARE.
- **§5 LQR widget closed form** (line 533): scalar $\dot x = Ax + u$, cost $\tfrac12\int(Qx^2 + Ru^2)dt$. ARE: $P^2/R - 2AP - Q = 0 \Rightarrow \bar P = R(A + \sqrt{A^2 + Q/R})$. Closed-loop pole $A - \bar P/R = -\sqrt{A^2+Q/R}<0$. **All verified.**
- **§6 Discrete DP** — Bellman recursion, $\gamma$-contraction proof (lines 558–560), value-iteration / Howard policy-iteration finite-step convergence on finite state spaces all standard and correctly stated.
- **§7 Stochastic HJB** — Generator $\mathcal{L}^u\phi = b\cdot\nabla\phi + \tfrac12 \mathrm{tr}(\sigma\sigma^T D^2\phi)$ correct. Boxed second-order PDE correct. Reduction to first-order HJB as $\sigma\to 0$ correct.
- **§7 Merton** — `u* = (μ−r)/(γσ²)` is the classical Merton fraction under CRRA $u(c)=c^{1-\gamma}/(1-\gamma)$, $\gamma>0$, $\gamma\ne 1$. Wealth-and-horizon independence is the well-known scale invariance of CRRA + GBM.

## Wrong / dubious claims (with file:line)

None of mathematical substance.

## Underspecified or unverifiable claims

- **Line 509** "Among all stabilising linear feedbacks, this one minimises the $\mathcal{H}_2$ cost." True under the standard interpretation (LQG/$\mathcal{H}_2$ duality with white-noise input), but the page never establishes the LQG/$\mathcal{H}_2$ link, so the claim arrives without scaffolding. Pedagogical, not mathematical.
- **Line 512** "for any controllable $(A,B)$ and weight $(Q,R)$" — strict left-half-plane closed-loop spectrum requires **detectability of $(A,Q^{1/2})$** in addition to stabilizability of $(A,B)$ (or $Q\succ 0$). With $Q\succeq 0$ only, controllability of $(A,B)$ alone is insufficient — there can be unobservable unstable modes. *Minor underspecification.*
- **Line 507** "$T\to\infty$ (with discount or a stabilisability hypothesis)" — finite-horizon Riccati convergence to ARE requires stabilizability + detectability; the parenthetical hand-waves but does not mislead.
- **Line 600** "$\gamma\in(0,1)\cup(1,\infty)$" — domain stated correctly (excludes $\gamma=1$ log-utility singularity); the closed-form $u^* = (\mu-r)/(\gamma\sigma^2)$ also covers $\gamma=1$ as a limit (log investor), which the page silently relies on but doesn't note. Minor.

## Severity

**clean** — Riccati sign is correct post-dc194e53; HJB closed form, Merton formula, contraction proof, Pontryagin sign convention, and stochastic-HJB generator all check out. The two stabilizability/detectability hedges (lines 507, 512) are standard textbook simplifications, not errors.
