# conformal-and-cr-geometry — math correctness audit (2026-05)

**Section:** Analysis

## Verified claims

### Conformal class & curvature transformation (§1)
- **Conformal class** $[g] = \{e^{2u}g\}$ (line 273) — standard.
- **Conformal change of Levi-Civita** $\tilde\nabla_X Y = \nabla_X Y + (Xu)Y + (Yu)X - g(X,Y)\,\mathrm{grad}_g u$ (line 281) — standard correct.
- **Scalar curvature transformation** $R_{\tilde g} = e^{-2u}(R_g - 2(n-1)\Delta_g u - (n-1)(n-2)|\nabla_g u|^2)$ (line 283) — standard (geometer's positive-Laplacian convention).
- **n=2 linearization** ($n-2 = 0$ kills the $|\nabla u|^2$ term) — correct.

### Conformal Laplacian and Yamabe (§§2–3)
- **$L_g = -\Delta_g + \frac{n-2}{4(n-1)}R_g$** (line 368) — standard.
- **Conformal covariance** $L_{\tilde g}(\phi) = e^{-(n+2)u/2} L_g(e^{(n-2)u/2}\phi)$ (line 372) — standard; weights sum to $n$, differ by $2$.
- **Yamabe equation derivation** $L_g u = \frac{n-2}{4(n-1)}\tilde R\,u^{(n+2)/(n-2)}$ via $\tilde g = u^{4/(n-2)}g$ (line 483) — correct algebra.
- **Yamabe functional, critical Sobolev $2^* = 2n/(n-2)$** (line 514) — correct.
- **$Y(S^n) = \frac{n(n-2)}{4}\omega_n^{2/n}$** (line 602) — consistent with the conformal-Laplacian convention (constant $u=1$ on round $S^n$ with $R = n(n-1)$ gives $L_g(1) = n(n-2)/4$).
- **Historical attribution** Yamabe 1960, Trudinger 1968 (negative case), Aubin 1976 (n≥6 non-LCF), Schoen 1984 (3,4,5 + LCF via positive mass) — correct.
- **Conformal-Laplacian widget**: $c_6 = 4/20 = 0.2$ ✓, $2^* = 12/4 = 3$ at $n=6$ ✓, weights $(n-2)/2, (n+2)/2$ ✓.

### Q-curvature & Paneitz (§4)
- **Order-$2k$ GJMS weight pattern** $(n-2k)/2$ in, $(n+2k)/2$ out (line 373) — correct.
- **Q-transformation in dim 4** $Q_{\tilde g} = e^{-4u}(Q_g + P_g u)$ (line 644) — correct.
- **$\int Q\,dV$ conformal invariance** via integration of $P_g u$ against $dV$ (closed manifold, $P_g$ self-adjoint) — correct.
- **Chern–Gauss–Bonnet (dim 4)** $\int Q\,dV + \tfrac14\int|W|^2 dV = 8\pi^2\chi(M)$ (line 718) — correct standard.

### CR structure & Heisenberg (§5)
- **CR-manifold dimension count** $(2n+1)$, horizontal rank $2n$ (line 731) — correct.
- **Real-hypersurface horizontal distribution** $H_p = T_pM \cap J(T_pM)$ (line 743) — correct.
- **Heisenberg multiplication** $(z,t)(z',t') = (z+z',\,t+t'+2\,\mathrm{Im}\langle z,z'\rangle)$ (line 751) — standard.
- **Left-invariant frame** $X_j = \partial_{x_j}+2y_j\partial_t$, $Y_j = \partial_{y_j}-2x_j\partial_t$ (line 753) — verified by left-translation derivative at identity.
- **Heisenberg dilation** $\delta_\lambda(z,t) = (\lambda z, \lambda^2 t)$ — correct.
- **Heisenberg widget** `dt = -2*a*b`: with $a=(a,0)$ real, $b=(0,b)$ pure-imaginary, $\mathrm{Im}\langle a,b\rangle = \mathrm{Im}(a\overline{ib}) = -ab$, $t = 2\cdot(-ab) = -2ab$ ✓.

### Levi form & strict pseudoconvexity (§6)
- **Levi form rescaling** $\mathcal{L}_{\tilde\theta} = e^{2u}\mathcal{L}_\theta$ — correct.
- **Levi form on $\{\rho=0\}$** = restriction of $\partial^2\rho/\partial z_j\partial\bar z_k$ to $T^{1,0}M$ (line 854) — standard.
- **Levi-form widget (ellipsoid)**: $\rho = |z_1|^2 + |z_2|^2/e^2 - 1$ has complex Hessian $\mathrm{diag}(1, 1/e^2)$. At $p=(1,0)$ tangent is $(0,*)$ ⇒ Levi eigenvalue $1/e^2$ ✓; at $(0,e)$ tangent is $(*,0)$ ⇒ eigenvalue $1$ ✓; strict pseudoconvexity for all $e>0$ ✓.

### Webster connection & CR Yamabe (§7)
- **$L_b = -(2+2/n)\Delta_b + R^W$** (line 962) — Jerison–Lee normalization, correct.
- **Sublaplacian sub-elliptic + Hörmander hypoelliptic** — correct.
- **Heisenberg homogeneous dimension** $Q = 2n+2$ — correct.
- **Quiz matching `ccr-cr-yamabe` Q3** under impl convention `answer[i]=left-idx pairing right[i]`: `[1,0,3,2]` correctly pairs scalar↔Webster, $L_g\leftrightarrow L_b$, dim↔$Q$, $S^n\leftrightarrow$ Heisenberg/$S^{2n+1}$ ✓.

## Wrong / dubious claims

- **CR Yamabe RHS exponent is wrong** (line 970, prose). The page writes
  $$L_b u = \lambda\, u^{(n+1)/(n-1)} = \lambda\, u^{Q/(Q-2)}.$$
  With $Q = 2n+2$, $Q/(Q-2) = (n+1)/n$, NOT $(n+1)/(n-1)$. Both displayed exponents are wrong: the first equals neither $Q/(Q-2)$ nor the actual Jerison–Lee critical exponent. The correct CR Yamabe RHS exponent is $(Q+2)/(Q-2) = (n+2)/n = 1 + 2/n$ (the analog of Riemannian $(n+2)/(n-2)$). The dictionary widget at line 991 reports "critical $Q/(Q-2) = (n+1)/n$" — internally inconsistent with line 970, and itself off by one (still gives $Q/(Q-2)$ rather than $(Q+2)/(Q-2)$). **Severity: math error in the headline equation of §7.**

- **Paneitz-formula Ric coefficient is dimensionally suspect** (line 634). The page writes $P_g = \Delta^2 + \delta((n-2)Jg - 4\,\mathrm{Ric})d + \tfrac{n-4}{2}Q$. Standard (Branson) form uses the Schouten tensor $P = \tfrac{1}{n-2}(\mathrm{Ric} - Jg)$ with coefficient $-4$, equivalently Ric with coefficient $-4/(n-2)$ (and a corresponding adjustment to the $J$ coefficient). With $-4\,\mathrm{Ric}$ as written and the trace coefficient $(n-2)J$, the formula doesn't reduce to the conformally covariant Paneitz operator in dimensions $n\ne 6$. Either change `Ric` to the Schouten tensor (preferred) or rescale to $-\tfrac{4}{n-2}\mathrm{Ric}$. **Severity: incorrect formula as displayed.**

- **Chern–Gauss–Bonnet rearrangement has an arithmetic slip** (line 721). The page rewrites the Gauss–Bonnet relation as $\chi(M) = \tfrac{1}{32\pi^2}\int(|W|^2 + Q\cdot 8)\,dV$. Multiplying out the prior correct identity $\int Q\,dV + \tfrac14\int|W|^2\,dV = 8\pi^2\chi(M)$ by $4$ and dividing by $32\pi^2$ gives $\chi(M) = \tfrac{1}{32\pi^2}\int(|W|^2 + 4Q)\,dV$. The displayed coefficient should be $4Q$, not $8Q$. **Severity: arithmetic typo, internal contradiction with the immediately preceding line.**

## Underspecified or unverifiable claims

- **Webster theorem** (line 944) states three uniqueness conditions but omits the standard requirements that $\nabla^W\theta = 0$ and $\nabla^W$ preserves the Levi form. Condition (3) "prescribed torsion" is circular — the Tanaka–Webster torsion is what the theorem produces, not a prerequisite. As a sketch readable to someone who already knows the result, fine; as a definition, incomplete.

- **CR conformal-Laplacian covariance weights** (line 964): $L_{\tilde b}(\phi) = e^{-(n+1)u/n}L_b(e^{(n-1)u/n}\phi)$ for $\tilde\theta = e^{2u/n}\theta$ — the weights $(n\pm1)/n$ with the rescaled $u/n$ exponent are arithmetically equivalent to the Jerison–Lee weights $(n\mp1)$ under $\tilde\theta = u^{2/n}\theta$, but conventions vary across sources. The qualifier "Different sources use different normalizations" is honest; the structural content holds.

- **Conformal-Laplacian Q3 quiz** (`ccr-conformal-laplacian`, line 73): both option 0 ("sum equals $n$") and option 3 ("$w_1+w_2=n$ tied to critical exponent") are arithmetically true; the marked answer is 3. The explanation acknowledges this. Loose disambiguation, not an error.

## Severity

**bugs.** Three concrete math defects:

1. **CR Yamabe equation exponent** (line 970): replace $u^{(n+1)/(n-1)} = u^{Q/(Q-2)}$ with $u^{(n+2)/n} = u^{(Q+2)/(Q-2)}$.
2. **Paneitz formula Ric coefficient** (line 634): change $-4\,\mathrm{Ric}_g$ to $-4\,\mathrm{Sch}_g$ (Schouten) or to $-\tfrac{4}{n-2}\mathrm{Ric}_g$.
3. **Chern–Gauss–Bonnet rearrangement** (line 721): the coefficient on $Q$ should be $4$, not $8$ — change "$Q\cdot 8$" to "$4Q$".

Otherwise the §§1–6 prose mathematics (conformal class definition, Levi-Civita transformation, scalar-curvature law, conformal Laplacian and its covariance, Yamabe equation reduction, Yamabe functional and Aubin's $S^n$ inequality, four-step program with correct historical attributions, Q-curvature additive transformation, GJMS weight pattern, CR-manifold dimension count, Heisenberg multiplication and left-invariant frame, Heisenberg dilation, Levi form on a real hypersurface, strict-pseudoconvexity definition) is clean. All five widgets compute the math they advertise correctly: the conformal-stretch ratio, the $c_n$ and $2^*$ curves, the Yamabe step bar, the Heisenberg $t$-shift, and the ellipsoid Levi eigenvalues. Quiz answers are correct, including the matching question under the implementation convention.
