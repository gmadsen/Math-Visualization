# Math-correctness audit — `cohomology-and-duality.html`

Pass date: 2026-05-14. Scope: math claims only.

## Verified claims (sections)

- §1 Singular cochain definition, $\delta\varphi(\sigma)=\varphi(\partial\sigma)$, $\delta^2=0$, $H^n$ formula. Correct.
- §1 Alexander–Whitney cup formula via front $p$-face / back $q$-face. Correct.
- §1 Leibniz rule $\delta(\varphi\smile\psi)=(\delta\varphi)\smile\psi+(-1)^p\varphi\smile(\delta\psi)$. Correct sign.
- §1 Graded-commutativity $[\varphi]\smile[\psi]=(-1)^{pq}[\psi]\smile[\varphi]$. Correct.
- §1 $H^*(T^2;\mathbb Z)\cong\Lambda_{\mathbb Z}[\alpha,\beta]$ derivation (use $2\alpha^2=0$ + torsion-freeness). Correct.
- §1 Cup-product widget `prod()` table (αα=ββ=0, αβ=−βα, top×anything=0). Correct on the free part.
- §2 Mayer–Vietoris cochain SES $0\to C^*(X)\to C^*(U)\oplus C^*(V)\to C^*(U\cap V)\to 0$ and the LES with $\delta$ raising degree. Correct.
- §2 $H^*(\mathbb{CP}^n)\cong\mathbb Z[x]/(x^{n+1})$, $|x|=2$, with the MV cover sketch. Correct.
- §2 Künneth field-coefficient $H^n(X\times Y;k)\cong\bigoplus H^p(X)\otimes H^q(Y)$ via cross product $\pi_X^*\alpha\smile\pi_Y^*\beta$, and the $\mathbb Z$-coefficient SES with Tor (splits non-canonically). Correct.
- §2 $H^*(T^n;\mathbb Z)\cong\Lambda_{\mathbb Z}[\alpha_1,\dots,\alpha_n]$, $\dim H^k=\binom n k$. Correct.
- §2 Künneth widget Betti tables (S^1, S^2, T^2, CP^1) and antidiagonal sums. Correct (CP^1 = S^2 ✓).
- §3 Statement of PD: fundamental class $[M]\in H_n(M;\mathbb Z)$, cap product $H^k\otimes H_n\to H_{n-k}$, $\alpha\mapsto\alpha\frown[M]$. Correct.
- §3 Cup-pairing form $H^k\otimes H^{n-k}\to H^n\to\mathbb Q$ non-degenerate; palindromic Betti numbers. Correct.
- §3 PD widget Betti tables (S^1..S^3, T^2..T^3, Σ_2, CP^2..3, S^2×S^2, S^3 Hopf). All correct.
- §3 Σ_g cup pairing $\alpha_i\smile\beta_j=\delta_{ij}[\Sigma_g]^*$, $\alpha_i\alpha_j=\beta_i\beta_j=0$ (symplectic intersection form). Correct.
- §4 De Rham theorem as graded $\mathbb R$-algebra iso, wedge ↔ cup, integration pairing. Correct.
- §4 $H^1_{\rm dR}(S^1)=\mathbb R$ via $\oint d\theta=2\pi\ne 0$ + Stokes (∂S^1=∅). Correct.
- §4 Form-integration widget values: $\oint d\theta=2\pi$, $\oint 2d\theta=4\pi$, $\oint\cos\theta\,d\theta=\oint\sin\theta\,d\theta=0$. Correct.
- §4 De Rham PD: $\int_M\omega\wedge\eta$ pairing non-degenerate; harmonic representatives via Hodge. Correct.
- §5 Spectral-sequence shape: $d_r\colon E_r^{p,q}\to E_r^{p+r,q-r+1}$, $E_{r+1}=H(E_r,d_r)$, abutment as associated graded of a filtration. Correct.
- §5 Serre SS: $E_2^{p,q}=H^p(B;H^q(F))\Rightarrow H^{p+q}(E)$ for $B$ simply connected; local-coefficient version otherwise. Correct.
- §5 Hopf $S^1\to S^3\to S^2$ computation: only $(0,0),(0,1),(2,0),(2,1)=\mathbb Z$; $d_2$ from $E_2^{0,1}\to E_2^{2,0}$ is an iso (cup with Euler class of the Hopf bundle, Euler number 1); $E_3=E_\infty$ recovers $H^*(S^3)$. Correct.
- §6 Whitney sum $w(\xi\oplus\eta)=w(\xi)\smile w(\eta)$, $c$ analog; naturality. Correct.
- §6 $H^*(\mathbb{CP}^n;\mathbb Z)\cong\mathbb Z[c_1(\gamma)]/(c_1(\gamma)^{n+1})$. Correct (note: with the standard sign convention $c_1(\gamma)=-x$ where $x$ is the hyperplane class, but as ring generators they agree up to sign — page silently uses generator).

## Wrong / dubious claims (with file:line)

- **`cohomology-and-duality.html:588`** — "The Möbius band and $\mathbb{RP}^2$ are obstructed in this way: they have integral Poincaré duality only after killing 2-torsion." The Möbius band has boundary, so plain Poincaré duality does not apply at all (Lefschetz duality does, but for a different reason than non-orientability). $\mathbb{RP}^2$ is the right example by itself; Möbius band is a category error here.
- **`cohomology-and-duality.html:600`** — "The intersection form has signature 0 (in the symmetric case via $\alpha\smile\beta+\beta\smile\alpha$ on $H^1$, but in dim 2 the natural form is alternating)." The symmetrized form $\alpha\smile\beta+\beta\smile\alpha$ on degree-1 classes is identically zero by graded commutativity, so it has no signature to speak of. The parenthetical is incoherent and should be deleted; the alternating $H^1\otimes H^1\to H^2$ form is the only natural one.
- **`cohomology-and-duality.html:280`** — "the unit is $1\in H^0(X)\cong\mathbb Z^{\#\pi_0}$." Underspecified for non-finite $\pi_0$ — should be $\mathbb Z^{\pi_0(X)}$ (product over components) or restrict to finite-component case. Minor; correct in the intended setting.

## Underspecified or unverifiable claims

- **UCT not stated.** §1 line 273 invokes the universal coefficient theorem ("packs both [hom + ext torsion] into one short exact sequence") and §3 line 584 reuses it, but the SES $0\to\operatorname{Ext}^1(H_{n-1}(X),G)\to H^n(X;G)\to\operatorname{Hom}(H_n(X),G)\to 0$ never appears. Also the cohomology UCT direction is the relevant one; the page should at least state it once.
- **Alexander duality absent.** Audit prompt explicitly listed it; the page does not cover $\tilde H^k(S^n\setminus K)\cong\tilde H_{n-k-1}(K)$ at all.
- **Verdier duality absent.** Mentioned only in §"Connections" outro line 1048 as a name; no statement.
- **Sheaf / Čech cohomology** not defined here — pointers to `sheaf-cohomology.html` exist but the page itself only uses "Čech–de Rham double complex" as a name in line 737.
- **$H^*(\mathbb{RP}^n)$ ring not given.** Standard worked example ($\mathbb F_2[x]/(x^{n+1})$, $|x|=1$) is missing despite being a canonical illustration of $\mathbb Z/2$-coefficient PD discussed in §3.
- **$H^*(S^n)$ ring not stated explicitly** (it appears only implicitly via Künneth widget for $S^1, S^2$). A one-line statement $H^*(S^n)=\mathbb Z[x]/(x^2)$, $|x|=n$, would close the loop.
- **Lefschetz duality** stated line 588 but only in the absolute form $H^k(M,\partial M)\cong H_{n-k}(M)$. The companion $H^k(M)\cong H_{n-k}(M,\partial M)$ is not given; orientability hypothesis is implicit, not stated.
- **§5 line 992**: "spectral sequences are how 80% of explicit cohomology calculations actually get done" — unverifiable rhetoric, not a math claim.

## Severity

**Minor.** No load-bearing theorem statement is wrong. The Möbius-band example (line 588) and the muddled signature parenthetical (line 600) are local errors that should be edited but do not propagate. Largest content gap is the absent UCT statement and missing Alexander/RP^n material, which are scope choices rather than incorrect claims.
