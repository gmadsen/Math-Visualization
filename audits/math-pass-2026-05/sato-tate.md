# Math audit: sato-tate.html

## Verified claims

**Hasse + Frobenius angle (§1).** $T^2 - a_p T + p$, $\alpha_p\beta_p=p$, $\alpha_p+\beta_p=a_p$, $|a_p|\le 2\sqrt p \Leftrightarrow |\alpha_p|=\sqrt p$, $a_p = 2\sqrt p\,\cos\theta_p$ (line 258–264). Standard, correct. Saturation impossible at good primes because $2\sqrt p\notin\mathbb Z$ (line 268, hard-tier MCQ explain L52). Correct.

**Sato–Tate measure (§3).** $d\mu_{ST}=(2/\pi)\sin^2\theta\,d\theta$ integrates to 1 and is the conjugacy pushforward of Haar on $\mathrm{SU}(2)$ (line 553–556). CDF $F(\theta)=\theta/\pi-\sin(2\theta)/(2\pi)$ has derivative $(1-\cos 2\theta)/\pi = (2/\pi)\sin^2\theta$ (line 562). Correct. Newton-iteration sampler is exact.

**Equidistribution + Weyl (§2).** Chebyshev $U_n$ are $\mathrm{SU}(2)$-irreducible characters with $U_n(\cos\theta)=\sin((n+1)\theta)/\sin\theta$, orthonormal under $\mu_{ST}$ (line 1129–1131). Stable formula `U(n,θ) = sin((n+1)θ)/sinθ` with `(n+1)·(±1)^n` endpoint limit is correct.

**Symmetric power L-functions (§5).** Local factor $\prod_{k=0}^n(1-\alpha^{n-k}\beta^k p^{-s})^{-1}$ (line 1133–1134), trace $=p^{n/2}U_n(\cos\theta_p)$ (line 1137), Sato–Tate $\Leftrightarrow$ holomorphy + non-vanishing of every $L(\mathrm{Sym}^n E,s)$ on $\mathrm{Re}\,s\ge 1$ (line 1141). Correct (Wiener–Ikehara).

**CM (§4).** $E/\mathbb Q$ CM: split primes $\to$ uniform $(1/\pi)d\theta$ via Hecke Grössencharacter; inert primes $\to$ supersingular atom at $\pi/2$. Combined: $\tfrac12\delta_{\pi/2}+\tfrac12\cdot\tfrac{1}{\pi}d\theta$ (line 965–968). Sato–Tate group $N(T)\cong U(1)\rtimes\mathbb Z/2$ (line 974). Correct.

**Status (§3 line 551).** "Clozel, Harris, Shepherd-Barron, Taylor, Barnet-Lamb and Geraghty (2008–11)" attribution for non-CM ST over totally real fields — accurate. BLGHT-attribution in quiz (L163, L325) correct.

**Numerics.** Quiz `hasse-bound-angle` $\theta_{11}$ for $a_{11}=4$: $\arccos(2/\sqrt{11})\approx 0.9242$ — within tol 0.01 of stored answer 0.928 (explain text "≈0.9281" is the rounding error). Quiz hard $a_5=-2$ for $y^2=x^3-x$: hand-counted $\#E(\mathbb F_5)=8$ (incl. ∞) ⇒ $a_5=-2$ ✓; $\theta_5=\arccos(-1/\sqrt5)\approx 2.034$ ✓. Variance of $\cos\theta$ under $\mu_{ST}$ = 1/4 ✓ (L177). $\Pr[\theta\in(0,\pi/2)]=1/2$ ✓. $\chi_2(\pi/3)=4(1/4)-1=0$ ✓. $U_3(1/\sqrt2)=0$ ✓ (L317). Primes ≤100 with $p\equiv 1\pmod 4$: count = 11 ✓.

## Wrong / dubious claims

**MAJOR — `sato-tate.html:571,692`: $y^2 = x^3 + 1$ labeled as non-CM in §3 widget.** The curve has $j=0$, CM by $\mathbb Z[\zeta_3]$. Section 4's widget (L982) correctly labels it as CM. The §3 button text "non-CM · $y^2=x^3+1$" and the readout "mode: non-CM ( y² = x³ + 1 ) — Sato–Tate semicircle law" are wrong. Either swap the example (e.g. $y^2=x^3-x+1$ or $y^2=x^3-2$) or relabel as CM and flip the expected-density narrative.

**MODERATE — `sato-tate.html:781,783`: conductor labels.** "$y^2=x^3-x+1$ (non-CM, conductor 37)": discriminant $\Delta=-16(4(-1)^3+27)=-368=-2^4\cdot 23$, so bad primes are 2 and 23; conductor cannot be 37. (LMFDB curve 37.a1 has model $y^2+y=x^3-x$, a different short Weierstrass form.) "$y^2=x^3-43x+166$ (non-CM, conductor 26)": discriminant $\Delta=-2^{19}\cdot 13$, bad primes 2,13 — 26 is plausible but unverified; this is in fact a model of LMFDB 37.a1 (translation $x\to x+a, y\to 2y+\ldots$), so conductor 37, not 26. Both labels need cross-check against LMFDB; current values look incorrect.

**MINOR — `sato-tate.html:968`: "$N(T)/T$-conjugacy classes".** Phrasing doesn't parse: should read "Haar on $N(T)$ pushed to $N(T)$-conjugacy classes in $\mathrm{SU}(2)$". The measure given immediately before is correct.

**MINOR — `quizzes/sato-tate.json:264-268`: SO(3) explain.** Says "$\mathrm{SO}(3)$ is not a subgroup of $\mathrm{USp}(2)\cong\mathrm{SU}(2)$." Technically true but misleading: $SO(3)\cong PSU(2)=SU(2)/\{\pm I\}$ is a *quotient*, and $SO(3)$ does occur as a Sato–Tate group for symmetric-square motives (as the explain itself notes). Answer (D) is acceptable as "not for rank-2 motives" but the reason stated is the wrong reason.

## Underspecified or unverifiable claims

- **§1 line 268** "impossible at good primes because $\sqrt p\notin\mathbb Z$." Should say "$2\sqrt p\notin\mathbb Z$ for prime $p$"; the integer constraint is on $a_p\in\mathbb Z$ vs $\pm 2\sqrt p$. Quiz hard L47 phrases it correctly.
- **§5 line 1297** "the analytic conductor absorbs the $p^{n/2}$ factor; the widget plots $L_p$ with this centered normalization." The strip-widget normalization $r=p^{n/2-\sigma}$ (L1357) puts absolute convergence at $\sigma>n/2+1$ in raw form; "edge at $\sigma=1$" is the analytic-conductor normalization. The widget code matches the prose, but the diagnostic line "consistent with conjectured non-vanishing on Re(s)=1" (L1462) is heuristic — flag is rough, not proof.
- **Higher-rank generalizations (USp(2g)).** The Coda mentions "$\mathrm{GL}_n$ forms and higher-rank abelian varieties" but does not state the USp(2g)-for-genus-$g$ refinement explicitly. Not asserted, so not wrong; just absent from the audit checklist.
- **Mazur's torsion theorem.** Not mentioned on the page or in the bank. Out of scope here.

## Severity

**Moderate.** One major label error (CM curve sold as non-CM in §3 widget header + readout) plus two suspect conductor numbers in §3's "actual primes" widget. None of the analytic / probabilistic content is wrong; the numerics, characters, density, CDF, BLGHT attribution, and CM dichotomy are all correct. Fixes are local to widget option labels; no formula or theorem statement needs revision.
