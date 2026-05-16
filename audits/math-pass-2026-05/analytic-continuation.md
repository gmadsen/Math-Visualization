# analytic-continuation.html — math-correctness audit

Scope: every mathematical claim. Pedagogy skipped.

## Verified claims (sections)

- **§1 Germs / identity theorem.** Cauchy–Hadamard radius (line 265), identity theorem statement (line 270), uniqueness corollary, geometric-series re-expansion $1/(1-z) = \frac{1}{1-a}\sum ((z-a)/(1-a))^n$ with radius $|1-a|$ (lines 280–282) — all correct.
- **§2 Disk-chaining.** Re-expansion radius bound $R_1 \ge R_0 - |\gamma(t_1)-a|$ (line 379) is correct (it is a lower bound; the actual radius can be larger when the obstructing singularity sits on $\partial D_0$ on the far side). Statement that two subdivisions of one path give the same germ — correct.
- **§3 Monodromy.** Loop-integral formula $\log \gamma(t) = \int_0^t \gamma'/\gamma\, ds$ (line 497), $2\pi i$ jump per winding (line 498), monodromy theorem statement and proof sketch (line 500), $\pi_1(\mathbb{C}^*) = \mathbb{Z}$, $\log$-monodromy $n \mapsto 2\pi i n$, $\sqrt{z}$-monodromy generator $\mapsto -1$ (line 502) — all correct.
- **§4 Schwarz reflection.** Statement (lines 626–628), formula $\tilde f(z) = \overline{f(\bar z)}$, "two antiholomorphic maps compose to holomorphic" justification, Morera-glue argument (line 630), real-analytic-arc generalization (line 632), conformal-map boundary-regularity application (line 636) — all correct.
- **§6 Zeta functional equation.** Theta definition $\theta(x)=\sum_{n\in\mathbb Z}e^{-\pi n^2 x}$ (line 882), gamma identity $\Gamma(s/2)\pi^{-s/2}n^{-s} = \int_0^\infty e^{-\pi n^2 x}x^{s/2-1}dx$ (line 888), Mellin form $\pi^{-s/2}\Gamma(s/2)\zeta(s) = \int_0^\infty \omega(x) x^{s/2-1}dx$ (line 890), theta law $\theta(1/x)=\sqrt{x}\,\theta(x)$ (line 896), split-and-fold formula with $-1/(s(1-s)) = 1/(s(s-1))$ pole term (line 898), completed $\xi(s) = \frac12 s(s-1)\pi^{-s/2}\Gamma(s/2)\zeta(s)$ (line 903), $\xi(s)=\xi(1-s)$ (line 907), unsymmetric form $\zeta(s) = 2^s\pi^{s-1}\sin(\pi s/2)\Gamma(1-s)\zeta(1-s)$ (line 909), simple pole at $s=1$ residue 1, trivial zeros at $-2,-4,\ldots$, critical-strip symmetry about $\mathrm{Re}\,s=1/2$ (line 910) — all correct.
- **Widget integrand** (line 970): the expression $\theta(x)/2$-style integrand $(\theta(x)-1)/2 \cdot (x^{s/2-1} + x^{(1-s)/2 - 1})$ matches the derived formula and is genuinely $s\leftrightarrow 1-s$-symmetric.

## Wrong / dubious claims

- **`analytic-continuation.html:739` — "Ostrowski's gap theorem".** The classical theorem giving "natural boundary from sufficient gaps" with hypothesis $n_{k+1}/n_k \ge 1+\delta>1$ is the **Hadamard gap theorem** (1892), not Ostrowski's. Ostrowski's gap theorem is a different (overconvergence-flavored) result. Misattribution.
- **`analytic-continuation.html:742–744` — applying the gap theorem to $\sum z^{n^2}$.** With $n_k = k^2$, the ratio $n_{k+1}/n_k = (k+1)^2/k^2 \to 1$, so $\sum z^{n^2}$ does **not** satisfy Hadamard's (or "Ostrowski's") $n_{k+1}/n_k \ge 1+\delta>1$ hypothesis. The unit circle being a natural boundary for $\sum z^{n^2}$ is true but requires a separate argument (theta-modularity / Kronecker's theorem on equidistribution at roots of unity), not the cited gap theorem. The presented logic is invalid.
- **`analytic-continuation.html:744` — "$|F(r\zeta)|\to\infty$ … using the identity $F(z)^2 \approx$ number-theoretic counting of $n_1^2+n_2^2$".** $F(z)^2 = \sum_n r_2'(n) z^n$ where $r_2'(n)$ counts representations $n_1^2+n_2^2=n$ with $n_i\ge 0$ — this is an identity, not an "approximation." More importantly, the claim "$|F(r\zeta)| \to \infty$ at every root of unity" is the standard heuristic, but the rigorous mechanism is theta-modularity ($\theta_3$ near a cusp), not $r_2$-counting. The hand-wavy bridge is misleading.

## Underspecified or unverifiable claims

- **`analytic-continuation.html:744` — "$\eta(\tau) = q^{1/24}\prod(1-q^n)$ has the unit circle as natural boundary (from the $q$-side)."** True statement, but it is on the boundary of legitimate because $\eta$ is most naturally a function on the upper half-plane $\mathbb{H}$, not the unit disk in $q$. As a function of $q\in\mathbb{D}$ via $q=e^{2\pi i\tau}$, the assertion holds (no $\eta$-extension across $|q|=1$). Stated correctly with the caveat.
- **`analytic-continuation.html:632` — "reflection through the unique antiholomorphic involution that fixes the boundary arc."** The involution exists and is unique only after specifying the arc *as part of a real-analytic curve in some neighborhood* — for a generic real-analytic arc, the local antiholomorphic reflection is well-defined, but the global "unique involution" wording elides the local-vs-global distinction. Defensible as stated.
- **`analytic-continuation.html:898` — "after the dust settles (an exercise in careful bookkeeping)".** The pole term and the symmetric integrand are stated correctly; the elision is acceptable for the page level, just unverified inline.

## Severity

**Minor.** One misattribution (Hadamard → Ostrowski) and one logically invalid application of that gap theorem to $\sum z^{n^2}$, both isolated to §5 (natural boundaries). The flagship derivation in §6 is fully correct, the monodromy and Schwarz sections are clean, and no widget produces a wrong number. The §5 fixes are textual: rename "Ostrowski's gap theorem" to "Hadamard gap theorem", and replace the "by Ostrowski" justification for $\sum z^{n^2}$ with an explicit pointer to the theta-modular / Kronecker argument.
