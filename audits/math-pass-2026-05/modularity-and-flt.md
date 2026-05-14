# Math-correctness audit — modularity-and-flt.html

## Verified claims

**Frey curve (§1).** $E: y^2=x(x-a^p)(x+b^p)$, rational 2-torsion $(0,0),(a^p,0),(-b^p,0)$ ✓; root differences $a^p,b^p,c^p$ ✓; $\Delta_{\text{naive}}=16(abc)^{2p}$ and $\Delta_{\min}=(abc)^{2p}/2^8$ via $u=2$ scaling ✓; semistable away from 2 with $N_E=2\cdot\mathrm{rad}_{\text{odd}}(abc)$ ✓; $\mathrm{ord}_2(N_E)\le 8$ Tate-algorithm bound ✓.

**Modularity (§2).** Wiles + Taylor–Wiles 1995 (semistable), BCDT 2001 (general), $a_p(E)=a_p(f_E)$ for $p\nmid N_E$ ✓.

**11a1 (§2).** $E: y^2+y=x^3-x^2$, $f=\eta(\tau)^2\eta(11\tau)^2$. Direct counting reproduces `Ap_E11 = {2:-2,3:-1,5:1,7:-2,11:1,13:4,17:-2,19:0}` exactly; the $\eta$-product $q$-expansion to $q^{20}$ matches `F11` exactly ✓; $a_{11}=1$ → split multiplicative ✓.

**Genus at level 2 (§3).** Diamond–Shurman: $\mu=3,\nu_2=1,\nu_3=0$ (since $2\equiv 2\bmod 3$), $\nu_\infty=2 \Rightarrow g(X_0(2))=0$, $\dim S_2(\Gamma_0(2))=0$ ✓.

**Deformation theory + R=T (§§4–5).** Mazur 1989, representability for abs. irred. $\overline\rho$, tangent space = $H^1_\Sigma(G_\mathbb{Q},\mathrm{Ad}\,\overline\rho)$ ✓. Surjection $R_\Sigma\twoheadrightarrow\mathbb{T}_\Sigma$ from universal property; Taylor–Wiles patching ✓. Khare–Wintenberger 2009 ✓.

## Wrong / dubious claims

- **modularity-and-flt.html:265** — "the three roots $0, a^p, -b^p$ … are three integers that sum to $0$." Their sum is $a^p - b^p$, not zero. The structural Frey invariant is the root *differences* being perfect $p$-th powers, not the root sum.
- **modularity-and-flt.html:566** — `F32 = [1,0,0,0,0,0,0,0,0,0,0,0,-6,0,0,0,2,0,0,0]` is wrong at $a_5,a_9,a_{13}$. The CM newform 32.2.a.a (verified via $\eta(4\tau)^2\eta(8\tau)^2$ expansion) is `[1,0,0,0,-2,0,0,0,-3,0,0,0,6,0,0,0,2,0,0,0]`. Page's $a_5=0$ contradicts the page's own claim "supported on primes $p\equiv 1\bmod 4$" (since $5 \equiv 1 \bmod 4$ splits in $\mathbb{Z}[i]$).
- **modularity-and-flt.html:570** — `Ap_E32` has $a_{13}=-6$ for $E:y^2=x^3-x$. Direct counting: $\#E(\mathbb{F}_{13})=8 \Rightarrow a_{13}=+6$. The 2-isogenous companion $y^2=x^3+4x$ also gives $+6$; the quartic twist $y^2=x^3-4x$ gives $-6$. The widget's "match=✓" at $p=13$ holds only because newform and curve are wrong by the same sign.
- **modularity-and-flt.html:575** — $q$-expansion display "$+ q^{10}$"; actual $a_{10}=-2$. Likely typo for $+q^{11}$ ($a_{11}=1$).
- **modularity-and-flt.html:690** — Ribet: "newform of level $Np$ … unramified at every prime dividing the 'extra' $p$." Garbled — should be level $N\ell$ and "extra $\ell$"; $\ell\neq p$ is the prime being peeled off, $p$ is the residue characteristic. The Frey illustration that follows is correct, so this is a typo in the formal statement.

## Underspecified or unverifiable claims

- **modularity-and-flt.html:425, :489** — conductor widget uses $c = a+b$ as proxy for the Fermat $c=(a^p+b^p)^{1/p}$; the prime supports are unrelated in general. Disclaimer is on-page; widget is illustrative only.
- **modularity-and-flt.html:386** — "cap [$v_2(N_E)$] at the semistable value" doesn't state the cap is $v_2=1$.
- **modularity-and-flt.html:964** — Selmer formula uses $\mathrm{Ad}\,\overline\rho$; modularity-lifting context usually wants $\mathrm{Ad}^0$ with fixed determinant. Convention not pinned down.
- **modularity-and-flt.html:1077** — $n\ge 6$ as the $R=T$ "limit threshold" in the patching widget is a visualization choice, not a math claim.

## Severity

**Moderate.** Two genuine arithmetic errors in §2 worked data (`F32`, `Ap_E32`, lines 566/570) — the widget's $p=13$ "match" is wrong on both sides with cancelling signs, and `F32`'s $a_5=0$ violates the CM-splitting rule the page itself cites. One mis-stated Frey root-sum claim (line 265). One garbled Ribet statement that the surrounding text silently corrects (line 690). One $q$-expansion typo (line 575). Conceptual scaffolding (Frey + modularity + level-lowering + $R=T$ → contradiction) and §1/§3/§4/§5 theorem statements + dates are otherwise solid.
