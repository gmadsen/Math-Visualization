# Characteristic classes — math-correctness audit (2026-05)

Scope: every mathematical claim in `characteristic-classes.html` (1,516 lines, 10 sections + 9 widgets).

## Verified claims (sections)

- **§2 Stiefel–Whitney axioms.** Naturality, Whitney sum w(E⊕F)=w(E)·w(F), normalisation w_1(γ_1)≠0 on RP^∞, vanishing past rank — standard ✓. Orientability ↔ w_1=0 and spin ↔ w_1=w_2=0 ✓.
- **§2 RP^n worked example.** TRP^n ⊕ ℝ ≅ (n+1)γ; w(TRP^n) = (1+a)^{n+1} in ℤ/2[a]/(a^{n+1}); RP^n orientable iff n odd ✓. The §2 RP^2 expansion (1+a)^3 = 1+a+a^2 (since 3 ≡ 1 mod 2 and a^3=0) is correct.
- **§3 Chern axioms + Pic(X) ≅ H^2(X;ℤ).** Topological line-bundle classification ✓. O(d) on CP^1 with degree d ✓.
- **§3 Splitting principle / Chern character.** c_k = e_k(x_i) ✓. ch(E) = Σe^{x_i} = n + c_1 + (1/2)(c_1^2 − 2c_2) + … ✓ (Newton: Σx_i^2 = c_1^2 − 2c_2). Multiplicativity ch(E⊗F) = ch(E)ch(F) and ring map K^0 → H^even(·;ℚ) ✓. e(E_ℝ) = c_n(E) for complex E ✓.
- **§4 Pontryagin definitions.** p_i(E) = (−1)^i c_{2i}(E⊗ℂ) ∈ H^{4i} ✓. Conjugation argument E⊗ℂ ≅ overline{E⊗ℂ} ⇒ 2c_{odd} = 0 is correct (uses c_k(F̄) = (−1)^k c_k(F)).
- **§4 worked Chern roots.** rank-2: roots {x,−x}, c_2 = −x^2, p_1 = x^2 ✓. rank-4: roots {x,−x,y,−y}, c_2 = −(x^2+y^2), c_4 = x^2 y^2, p_1 = x^2+y^2, p_2 = x^2 y^2 ✓ (verified e_2 by hand).
- **§5 Euler class.** Definition, Whitney for oriented bundles, e ≡ w_n mod 2, Poincaré–Hopf Σind = χ(M) = ⟨e(TM),[M]⟩ ✓. χ(S^2)=2, χ(T^2)=0 ✓.
- **§6 Chern–Weil.** c(E) = [det(I + (i/2π)F_∇)] ✓. Independence-of-connection via affine path + transgression ✓. Gauss–Bonnet χ(Σ) = (1/2π)∫K dA, sphere of radius R: ∫K dA = 4π, χ=2 ✓.
- **§7 Classifying spaces.** BU(n) = Gr_n(ℂ^∞), [X,BU(n)] ≅ rank-n bundles, H^*(BU(n);ℤ) = ℤ[c_1,…,c_n] (|c_i|=2i), H^*(BO(n);ℤ/2) = ℤ/2[w_1,…,w_n] (|w_i|=i), H^*(BU;ℤ) polynomial in infinitely many generators ✓.
- **§8 Hirzebruch L-genus.** L = ∏ x_i/tanh(x_i); L_1 = p_1/3, L_2 = (7p_2 − p_1^2)/45, L_3 = (62p_3 − 13p_1p_2 + 2p_1^3)/945 ✓ (matches Hirzebruch). σ(M^4) = p_1[M]/3 ✓. CP^2: p_1[CP^2] = 3, σ = 1 ✓ (verified via c(TCP^2) = (1+h)^3). HP^2: p_1^2[M]=4, p_2[M]=7, L_2 = 45/45 = 1 ✓.
- **§9 Equivariant cohomology.** Borel construction H^*_G(X) = H^*((X×EG)/G) ✓. H^*(BT) = ℤ[t_1,…,t_n], |t_i|=2 ✓. Atiyah–Bott statement (form) ✓.

## Wrong / dubious claims (with file:line)

- **`characteristic-classes.html:1448` — Localisation widget readout for n=1 evaluates to −1, not 1.** "$\frac{t_0}{t_1-t_0} + \frac{t_1}{t_0-t_1} = 1$" — direct computation: common denominator −(t_1−t_0)^2, numerator t_0(t_0−t_1) + t_1(t_1−t_0) = (t_0−t_1)^2, so the sum is **−1**. The convention error is consistent with §9 prose at line 661, which writes $\sum t_i^n / \prod_{j\ne i}(t_j - t_i) = 1$. With the standard sign convention where T = S^1 acts on CP^n with weights (a_0,…,a_n) and c_1^T(O(1))|_{p_i} = −t_i, e^T(T_{p_i}CP^n) = ∏_{j≠i}(t_j − t_i), localisation gives Σ(−t_i)^n / ∏(t_j − t_i) = (−1)^n · (page formula), and the LHS equals 1. So the page's formula is off by (−1)^n: correct for even n, **wrong for odd n** (n=1, n=3 widget readouts at lines 1448, 1450).  Fix: either flip the denominator to ∏_{j≠i}(t_i − t_j) (which removes the sign) or insert (−1)^n.
- **`characteristic-classes.html:1362` — K3 intersection form labelled "3·(−E_8) ⊕ 3H".** The K3 lattice is **2(−E_8) ⊕ 3H** (rank 16+6 = 22 = b_2(K3)). 3·(−E_8) ⊕ 3H would have rank 30. The σ = −16 and p_1 = −48 numbers are still correct (independent of this typo), but the lattice description is incorrect.
- **`characteristic-classes.html:795` — Klein-bottle parenthetical "$w_1 w_1 = w_2$ trivially".** The fact w_2(TK) = 0 is correct (χ(K)=0 mod 2, Wu formula). The aside "(not spin in the orientable sense, but $w_1 w_1 = w_2$ trivially)" is muddled: spin needs both w_1=0 and w_2=0, so K isn't spin regardless of w_2; and w_1^2 = w_2 on a closed surface is the Wu formula, not a triviality. Recommend either delete the parenthetical or replace with "w_2 = w_1^2 by Wu, and both vanish here."
- **`characteristic-classes.html:272` — Real line bundles classified by H^1(X;ℝ^×).** Topological real line bundles are classified by H^1(X;ℤ/2) (since BO(1) = RP^∞ and π_0(O(1)) = ℤ/2). The notation H^1(X;ℝ^×) is defensible if ℝ^× is treated as a topological group with π_0 = ℤ/2 and computed via Čech, but in any standard convention readers expect H^1(X;ℤ/2). Minor notational drift.
- **`characteristic-classes.html:508` — Gauss–Bonnet derivation note "F = −K dA".** The relation between the Levi-Civita curvature on the rank-2 oriented real tangent bundle and K dA goes through the Pfaffian (e(TΣ) = (1/2π)Pf(R) = (1/2π)K dA), not through c_1 of TΣ-as-line-bundle. The conclusion χ = (1/2π)∫K dA is correct; the intermediate sentence elides the Pfaffian-vs-c_1 distinction and is sign-ambiguous as written.

## Underspecified or unverifiable claims

- **`characteristic-classes.html:431` — "p_1[M] divisible by 3, 7p_2[M] − p_1^2[M] divisible by 45".** True as integrality consequences of Hirzebruch (since σ ∈ ℤ). Stated as an aside; correct.
- **`characteristic-classes.html:1309` — "TCP^1 classified by Veronese $[z_0:z_1]\mapsto[z_0^2:z_0 z_1:z_1^2:0:\ldots]$".** TCP^1 ≅ O(2) is correct, and O(2) is the pullback of O(1) under the degree-2 map CP^1 → CP^∞ (which factors through CP^2 via Veronese). The classifying-map description is hand-wavy but not wrong.
- **`characteristic-classes.html:1310` — sumLine widget "c_1 = 2−1 = 1".** Header text says "2 − 1 = 1" but the content is c_1(O(2)⊕O(−1)) = 2 + (−1) = 1, c_2 = 2·(−1) = −2 ✓. Cosmetic only.

## Severity

**Moderate.** One concrete numerical error (§9 localisation sum sign — the headline polynomial identity in the showcase widget is wrong by (−1)^n and evaluates to −1 not 1 at n=1) plus one factual lattice misidentification (§8 K3). Both are visible in widget readouts, not just narrative. Other items are minor wording/notation. Recommend: (a) fix sign convention or denominator orientation in §9 (lines 661, 1441, 1448, 1450); (b) correct K3 lattice to "2(−E_8) ⊕ 3H" at line 1362; (c) tidy the K-bottle parenthetical (line 795) and Gauss–Bonnet derivation sentence (line 508).
