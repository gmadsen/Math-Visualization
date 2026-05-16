# Math-pass audit · ricci-flow.html

## Verified claims (sections)

**§1 Equation.**
- $\partial_t g_{ij} = -2 R_{ij}$ (Hamilton 1982 sign convention). Correct.
- Einstein ansatz $g(t)=\rho(t)g_0$, $\rho'=-2\lambda$, $\rho(t)=1-2\lambda t$. Correct (Ricci is invariant under constant rescaling).
- Round sphere $\lambda>0$ shrinks, extinct at $t=1/(2\lambda)$; flat torus stationary; hyperbolic expands. Correct.
- Harmonic-coord identity $-2R_{ij} = \Delta g_{ij} + Q(g,\partial g)$. Correct (DeTurck–Kazdan).

**§2 Short-time / DeTurck.**
- Hamilton 1982 short-time existence on closed $M^n$, continuation criterion via $|\mathrm{Rm}|$ blow-up. Correct (the Sesum 2005 sharpening to scalar curvature in dim 3 is omitted, fine for this level).
- Diffeomorphism invariance $\Rightarrow$ kernel along $\mathcal L_X g$, weakly parabolic. Correct.
- DeTurck vector field $W^k = g^{ij}(\Gamma^k_{ij}-\tilde\Gamma^k_{ij})$ and Ricci–DeTurck flow $\partial_t g = -2\mathrm{Ric}+\mathcal L_W g$. Correct.

**§3 Singularities.**
- Type I: $K(T-t)$ bounded; Type III: $T=\infty$, $Kt$ bounded. Correct.
- $\kappa$-noncollapsing statement (vol $\ge \kappa r^n$ on balls with $|\mathrm{Rm}|\le r^{-2}$). Correct in essence.
- Parabolic rescaling produces ancient solutions. Correct.

**§4 Solitons.**
- Soliton equation $\mathrm{Ric}+\tfrac12\mathcal L_X g = \lambda g$ with shrink/steady/expand sign convention. Correct.
- Self-similar formula $g(t)=\sigma(t)\phi_t^* g_0$, $\sigma=1-2\lambda t$, $\phi_t$ flow of $X/\sigma$. Correct.
- Hamilton cigar: $g=(1+x^2+y^2)^{-1}(dx^2+dy^2)$, $f=-\log(1+|x|^2)$, asymptotic to a cylinder. Correct.
- Bryant: unique rotationally symmetric steady gradient soliton on $\mathbb R^n$, $n\ge 3$, models Type II. Correct.
- Koiso/Cao non-Einstein shrinker on $\mathbb{CP}^2\#\overline{\mathbb{CP}^2}$. Correct.

**§5 Surgery.** $\epsilon$-neck definition, canonical neighbourhood theorem (3D), surgery construction, finiteness on bounded intervals. Correct.

**§6 Poincaré / geometrisation.**
- $\mathcal W$-entropy formula and conjugate-heat equation $\partial_t f=-\Delta f+|\nabla f|^2-R+n/(2\tau)$. Correct (with $\dot\tau=-1$).
- $\mathcal W$ monotone non-decreasing along the coupled system. Correct.
- Connected-sum $S^3$/$S^2\times S^1$ decomposition; $\pi_1=0$ kills $S^2\times S^1$ factors $\Rightarrow M\cong S^3$. Correct.
- Thurston's 8 model geometries enumerated correctly.

## Wrong / dubious claims

- **ricci-flow.html:746** — Gaussian shrinker widget metadata says `lambda:1`. For $g=g_E$ on $\mathbb R^n$ with $f=|x|^2/4$, $\mathrm{Ric}=0$ and $\mathrm{Hess}\,f=\tfrac12 g$, so the soliton constant is $\lambda=\tfrac12$, not $1$. The prose at line 419 wisely avoids stating $\lambda$, but the widget claim is wrong. (One could repair by changing $f$ to $|x|^2/2$, which gives $\lambda=1$, but the prose is wedded to $|x|^2/4$.) Severity: minor (numeric value in widget readout).

## Underspecified or unverifiable claims

- **ricci-flow.html:365** Type IIa rate written as "$K(t)\,(T-t)\to\infty$ (slower-than-parabolic blowup)" — the parenthetical is misleading; Type II is *faster*-than-parabolic blow-up of $K$ (the parabolic *natural* rate is $1/(T-t)$; Type II exceeds it). The phrase "slower-than-parabolic" inverts the comparison. Severity: minor wording bug.
- **ricci-flow.html:379** widget caption asserts the Type II model rate is $C/(T-t)^2$. Type II only requires $K(T-t)\to\infty$; the squared rate is one chosen illustrative profile, not the definition. Caption should say "e.g." or "model rate". Severity: minor.
- **ricci-flow.html:362–368** table omits Type IIb ($T=\infty$, $Kt\to\infty$) from Hamilton's classification. Coverage gap, not an error.
- **ricci-flow.html:493** "finite extinction time for 2-sphere homotopy classes (Colding–Minicozzi / Perelman)" — the result is real but the gloss is terse; non-experts may not parse "2-sphere homotopy classes" $=\pi_2$/min-max widths. Acceptable shorthand.
- Hamilton–Ivey pinching estimate: not mentioned anywhere on the page. The audit prompt asked about it; absence is a coverage gap, not a correctness issue.
- F-entropy ($\mathcal F$): not on the page, only $\mathcal W$. Coverage gap.
- Eguchi–Hanson: not on the page (it is a Ricci-flat 4-manifold; not a soliton). Coverage gap, expected.

## Severity

**Minor.** One numeric error in widget metadata (Gaussian shrinker $\lambda$ value, line 746), one inverted-comparison wording bug ("slower-than-parabolic", line 365), and one over-specific rate caption (line 379). Mathematical core — flow equation, DeTurck, soliton equation, self-similar formula, $\mathcal W$-entropy, surgery, geometrisation — is correct.
