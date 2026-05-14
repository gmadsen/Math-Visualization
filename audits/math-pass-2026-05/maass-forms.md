# maass-forms.html — math-correctness audit

## Verified claims

**§1 Definition + Laplacian.** Definition (smooth, Γ-automorphic, Δ-eigenfunction, moderate growth at cusps) is the standard textbook definition. Sign convention Δ = -y²(∂ₓ² + ∂ᵧ²) is the positive Laplacian (matches Iwaniec, Bump). λ = 1/4 + r² parametrization with s = 1/2 + ir comes from λ = s(1-s) eval at s = 1/2 + ir. ✓

**§2 Spectral decomposition.** The L²(Γ\H) = L²_cusp ⊕ L²_res ⊕ L²_Eis split is correct. Hyperbolic measure dμ = y⁻² dx dy ✓. For SL₂(ℤ), residual spectrum = constants, residue of E(z,s) at s=1 equals 3/π ✓ (Roelcke). Eisenstein direct integral over Re s = 1/2 ✓.

**§3 Selberg eigenvalue conjecture.** λ₁ ≥ 1/4 statement ✓. Selberg 1965 = 3/16 ✓. Kim–Sarnak 975/4096 from θ = 7/64 via 1/4 − (7/64)² = 1024/4096 − 49/4096 = 975/4096 ✓. Non-congruence counterexamples (Sarnak/Phillips–Sarnak via Teichmüller deformation) ✓.

**§4 Eisenstein series.** Sum definition Σ_{Γ_∞\Γ} (Im γz)^s = ½ Σ_{(c,d)=1} y^s/|cz+d|^{2s} ✓. Δy^s = s(1−s)y^s ✓. Functional equation φ(s) = √π Γ(s−1/2) ζ(2s−1) / (Γ(s) ζ(2s)) ✓ (standard form). Fourier expansion line 443 with K_{s−1/2} and σ_{1−2s} matches Bump (3.4.1). ✓

**§5 L-function.** Whittaker expansion with √y K_{ir}(2π|n|y) ✓. Hecke Euler product (1 − a_p p^{−s} + p^{−2s})⁻¹ ✓ (level-1, weight-zero, trivial central character). Λ(s,f) gamma factors π^{−s} Γ((s+ε+ir)/2) Γ((s+ε−ir)/2) ✓; functional equation sign (−1)^ε ✓. K_{ir}(t) ~ √(π/(2t)) e^{−t} as t→∞ ✓; transition region at t ~ r ✓.

**§6 Trace formula + Weyl.** Selberg trace formula structure (spectral side = cuspidal sum + Eisenstein integral with φ′/φ; geometric side = identity + elliptic + hyperbolic with N(γ)) ✓. Weyl law N(T) ~ vol(Γ\H)/(4π) · T ✓. For SL₂(ℤ): vol = π/3 → N(T) ~ T/12 ✓. Prime geodesic theorem π_geod(X) ~ e^X / X ✓.

## Wrong / dubious claims

**maass-forms.html:352 + script line 655 + 924 — numerical eigenvalues from λ₄ onward are wrong.** The page lists the "first dozen" cuspidal Laplacian eigenvalues on SL₂(ℤ)\H as `[91.14, 148.4, 190.1, 226.0, 269.2, 296.4, 357.3, 384.4, 437.1, 461.5, 500.7, 540.0]`. Standard tabulated values (LMFDB, Hejhal, Then) give r-values 9.5337, 12.1730, 13.7798, 14.3585, 16.1381, 16.6442, 17.7386, 18.1809, 19.4235, 19.8847, 20.5238, 21.3158, hence λ = 1/4 + r² = **91.14, 148.43, 190.14, 206.42, 260.69, 277.43, 314.92, 330.79, 377.42, 395.61, 421.48, 454.61**. First three agree; from index 3 (file's 226.0 vs. correct 206.42) onward the values are systematically wrong. The duplicated list at line 924 (with extra decimals) carries the same errors.

**maass-forms.html:489 — Kim–Shahidi Ramanujan bound is misstated as `2 p^{1/9}`.** The 2002 Kim–Shahidi Sym³ result yields θ ≤ 5/34 ≈ 0.147, not 1/9 ≈ 0.111. The Selberg row at line 378 correctly uses 66/289 = 1/4 − (5/34)², which is internally inconsistent with the 1/9 reported for the same author/year on the Ramanujan table.

**maass-forms.html:488 — Bump–Duke–Hoffstein–Iwaniec 1995 / `2 p^{5/28}` attribution.** The 5/28 exponent is the **Luo–Rudnick–Sarnak (1995)** bound, not BDHI. BDHI (1992) gave θ ≤ 1/5. The dates and author would need fixing together.

**maass-forms.html:476 — "no pole at s=0".** For Maass-form L-functions, Λ(s,f) entire (cusp form) is correct, but the explicit "no pole at s=0" parenthetical is misleading — Λ(s,f) is entire automatically; the s=0 statement is vacuous unless qualified (e.g. by saying L(s,f) extends to all s without trivial zeros from gamma factors at s ≤ 0).

## Underspecified or unverifiable claims

**maass-forms.html:271 — Δ sign convention** is positive (eigenvalues ≥ 0); should be flagged for the reader since some references (PDE-leaning) use Δ = +y²(∂ₓ² + ∂ᵧ²) with negative spectrum. Not wrong, just a convention choice that interacts with every later formula.

**maass-forms.html:466 — "are real numbers (after a normalisation)".** True for SL₂(ℤ) Hecke–Maass forms because Hecke operators are self-adjoint and the spectrum is simple (conjecturally), so the eigenfunctions can be taken real-valued. The page understates the normalization (it's actually a Hecke-eigenform + parity choice).

**maass-forms.html:783 — Eisenstein widget δ phase.** Acknowledged as "toy proxy"; visualization only, not a math claim. OK.

**maass-forms.html:855 — `Math.cosh(0)` in K_ir approximation.** Returns 1; the comment says "envelope" — qualitative only. OK as a cartoon.

## Severity

**Moderate.** The conceptual content (definitions, spectral split, Selberg/Ramanujan story, trace formula, Weyl law, Eisenstein series) is solid and matches standard references. Two concrete issues need fixing:

1. **Numerical eigenvalue list** (line 352 prose + lines 655, 924 in widget data) — wrong from λ₄ onward; should be replaced with LMFDB-tabulated values. Affects the "famous Maass numerical data" claim and both spectrum + Weyl widgets.
2. **Kim–Shahidi Ramanujan exponent** (line 489) — `1/9` should be `5/34` for consistency with the Selberg row and the literature; BDHI/LRS attribution at line 488 also needs untangling.

No structural / pedagogical errors; once the numerics are corrected, the page is accurate.
