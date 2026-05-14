# Math audit — `shimura-varieties.html` (2026-05-14)

## Verified claims (sections)

- **§1 Shimura datum.** Definition of $(G,X)$ with Deligne torus $\mathbb{S}=\mathrm{Res}_{\mathbb{C}/\mathbb{R}}\mathbb{G}_m$, axioms (SV1)–(SV3), Hodge-type $\{(-1,1),(0,0),(1,-1)\}$, Cartan involution / $K_h$ compact mod center, $X^+$ Hermitian symmetric domain, reflex field $E(G,X)$ as field of definition of the conjugacy class of $\mu_h$. All standard (Deligne, *Travaux de Shimura* / *Variétés de Shimura*). Hodge cocharacter $\mu_{\mathrm{GL}_2}=z\mapsto\mathrm{diag}(z,1)$, $\mu_{\mathrm{GSp}_{2g}}=\mathrm{diag}(z,\dots,z,1,\dots,1)$, $\mu_{\mathrm{GU}(2,1)}=\mathrm{diag}(z,z,1)$ all match the standard normalization.
- **Dimensions.** $\dim_{\mathbb{C}}\mathfrak{H}_g=\binom{g+1}{2}$ → 1, 3, 6 for $g=1,2,3$ ✓; Hilbert mod variety over deg-$d$ totally real $F$ has dim $d$ ✓; GU(2,1) ball $B^2$ has dim 2 ✓; type-IV domain for GO(2,n) has dim $n$ ✓.
- **§2 adelic double quotient.** $\mathrm{Sh}_K(G,X)=G(\mathbb{Q})\backslash(X\times G(\mathbb{A}_f)/K)$, finite decomp into $\Gamma_i\backslash X^+$, Baily–Borel + toroidal compactifications, special points = $h$ factoring through a $\mathbb{Q}$-torus, reciprocity via reflex norm. Standard.
- **§3 Siegel.** $\mathfrak{H}_g$ formula and $\mathrm{Sp}_{2g}(\mathbb{R})$ action by $(A\tau+B)(C\tau+D)^{-1}$ ✓; det Im $\tau>0$ characterization of $\mathfrak{H}_2$ ✓; moduli interpretation as PPAVs ✓; Hodge bundle, Faltings–Chai toroidal compactifications, Saito–Kurokawa lift mention all correct.
- **§4 Hilbert / quaternionic.** $G=\mathrm{Res}_{F/\mathbb{Q}}\mathrm{GL}_2$, $G(\mathbb{R})=\prod_\sigma\mathrm{GL}_2(\mathbb{R})$, $X^+=\mathbb{H}^d$ ✓. Quaternionic: $B\otimes\mathbb{R}\cong M_2(\mathbb{R})\times\mathbb{H}^{d-1}$ for B split at one infinite place ✓; non-split B → compact (no cusps) ✓; fake elliptic curves = abelian surfaces with QM ✓.
- **§5 Eichler–Shimura.** $\mathrm{tr}\,\rho_{f,\ell}(\mathrm{Frob}_p)=a_p$, $\det = p$ for weight-2 newform ✓. Tabulated $a_p$ for X_0(11), X_0(14), X_0(15), X_0(17): spot-checked against LMFDB (11.a, 14.a, 15.a, 17.a curves) — values agree.
- **§6 Langlands–Kottwitz.** Formula form, Kottwitz triples $(\gamma_0;\gamma,\delta)$, signs $\alpha(\gamma_0)$, Honda–Tate parametrization by Weil $q$-numbers (algebraic integers with all archimedean conjugates of absolute value $\sqrt{q}$), local-global compatibility via comparison with stable trace formula — all faithfully presented.
- **X_0(23) genus.** Genus 2 ✓; J_0(23) is a simple 2-dim abelian variety (one Galois-orbit of newform of dim 2). Tabulated $a_p$ trace values (sum of two conjugate eigenvalues) consistent with LMFDB 23.2.a.a.

## Wrong / dubious claims (with file:line)

1. **`shimura-varieties.html:477` — reflex field for K_1(N) is wrong.** The widget assigns reflex = `ℚ(ζ_N)` whenever `t==="K"||t==="K1"`. But the modular curve Y_1(N) is geometrically connected and defined over Q; the field of definition of the canonical model for K_1(N) is Q, not Q(ζ_N). Only K(N) (full level) has reflex / field-of-definition Q(ζ_N). Fix: drop `||t==="K1"`.

2. **`shimura-varieties.html:483` — Y_0/X_0 swap.** Output reads `Each component is X_0(${N}) (analytically Y_0(${N}))`. Reversed: the Shimura variety at level K_0(N) is the open curve **Y_0(N)**; **X_0(N)** is its compactification. The parenthetical should say "(compactified to X_0(N))" or similar.

3. **`shimura-varieties.html:489` — GSp_4 component count wrong for principal level.** Claim: "Strong approximation ⇒ 1 component over ℂ for principal level N≥1". Strong approximation in this form holds for Sp_{2g} (simply connected, Q-simple), but the GSp_{2g} Shimura variety has $|Z(\mathbb{Q})^+\backslash Z(\mathbb{A}_f)/\nu(K)|=|(\mathbb{Z}/N)^\times|=\varphi(N)$ geometric components for principal level K(N), not 1. Holds (=1) only for K_0(N) (where the similitude character $\nu$ surjects onto $\hat{\mathbb{Z}}^\times$).

4. **`shimura-varieties.html:941, 943` — Hasse–Weil bound for X_0(23) genus 2.** Widget displays `|a_p| ≤ 2√p` for the X_0(23) case where `a_p` is the trace of Frobenius on the 4-dimensional Tate module of J_0(23). The Weil bound for an abelian variety of dimension g is $|a_p|\le 2g\sqrt{p}$, so the correct bound for X_0(23) (genus 2) is **$|a_p|\le 4\sqrt{p}$**. Same string is reused as a fallback at `:943` for any level. Bound is correct only when the relevant Jacobian is an elliptic curve.

5. **`shimura-varieties.html:891-913` — "Siegel-like" label mislabels X_0.** The dropdown labels X_0(11) and X_0(17) as "Siegel-like, dim 1". X_0(N) is a modular curve (= Sh(GL_2,...) at K_0(N) level), not a Siegel-type Shimura variety. Minor wording issue, but on a page that distinguishes datum types it reads incorrectly.

## Underspecified or unverifiable claims

- **`:284` `\mathrm{GO}(2,n)` row.** The classical orthogonal Shimura datum is usually stated for $\mathrm{GSpin}(2,n)$ or $\mathrm{SO}(2,n)$; with $\mathrm{GO}(2,n)$ one must take a specific component / cover for the conjugacy class condition (SV3) to hold. Page glosses this; not wrong, just imprecise.
- **`:704-710` quaternion algebra "ramified at 2/4 places"** does not specify infinite vs finite ramification. For F totally real cubic (d=3), to obtain a Shimura curve B must ramify at exactly $d-1=2$ infinite places plus an even total of places — the widget's "2 places" is ambiguous in that context. Output text doesn't claim more than "Shimura curve over reflex E ⊂ F·Q^ab" so no concrete number is wrong; the model is just underspecified.
- **`:727` "even number of prime divisors with ord_p(N)=1"** is a slightly loose statement of the JL-applicability condition; standard wording is "an even number of primes exactly dividing N". Reader-friendly, not technically wrong.
- **`:404` "reflex norm and class field theory of E"** — the precise statement is that the reciprocity action on a special point $[h, g]$ is given by the **reflex norm** $r:\mathrm{Res}_{E/\mathbb{Q}}\mathbb{G}_m\to T$ composed with the class-field-theoretic Artin reciprocity. Page summarizes correctly without writing the formula.
- **`:317` `mu:"\\text{(see Deligne)}"` for GO(2,3)** — punted rather than wrong.

## Severity

**Minor.** Five concrete bugs, all in widget UI strings/computations rather than the prose: (1) K_1 reflex field swap, (2) Y_0 ↔ X_0 swap in widget output, (3) GSp_4 K(N) component count, (4) Hasse–Weil constant for genus 2, (5) "Siegel-like" mislabel of X_0. Prose body of all six sections (the actual exposition of Shimura data, Siegel/Hilbert/quaternionic varieties, étale cohomology, and Langlands–Kottwitz) is mathematically correct.
