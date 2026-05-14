# random-matrix-theory.html — math correctness pass

## Verified claims (sections)

- **§1 Ensembles / Dyson β.** GOE/GUE/GSE matrix spaces, entry algebras (R/C/H), β ∈ {1,2,4} are correct. Joint eigenvalue density `∝ ∏|λᵢ-λⱼ|^β · exp(-β/4 ∑λᵢ²)` (line 280) is the standard β-Hermite form. Threefold-way / Frobenius theorem attribution correct.
- **§1 Wigner surmise constants** (script lines 354–358):
  - β=1: `(π/2) s exp(-π s²/4)` ✓
  - β=2: `(32/π²) s² exp(-(4/π) s²)` ✓
  - β=4: `(2¹⁸/(3⁶π³)) s⁴ exp(-(64/(9π)) s²)` — `Math.pow(64/(9π),3) = 262144/(729π³) = 2¹⁸/3⁶π³` ✓
- **§2 Wigner semicircle.** `ρ_sc(x) = (1/2π)√(4-x²)·𝟙_[-2,2]` (line 488), moment-method derivation, Catalan numbers C_m as 2m-th moments, Carleman determinacy invocation — all correct.
- **§3 Marchenko–Pastur.** Formula `ρ_c(x) = (1/(2πcx))√((b-x)(x-a)) + max(0, 1-1/c)·δ₀` with `a,b = (1∓√c)²` (line 682) is the standard MP density. Atom mass `1-1/c` for c>1, support edges, 1/√x singularity at c=1 all correct.
- **§4 Tracy–Widom moments.** F₁ (mean ≈ -1.21, var ≈ 1.61, skew +0.29), F₂ (-1.77, 0.81, +0.22), F₄ (-2.31, 0.51, +0.17) match Bornemann tables to printed precision (lines 1024–1026, also 882).
- **§4 Painlevé II + Fredholm formula.** `F₂(s) = det(1 - K_Ai)|_[s,∞) = exp(-∫_s^∞ (x-s) q(x)² dx)` with `q'' = xq + 2q³`, `q ~ Ai` at +∞ (Hastings–McLeod) — correct (line 880–882).
- **§5 Free probability.** Freeness definition (alternating, centred, vanishing trace), R-transform `R_μ(z) = G_μ⁻¹(z) - 1/z`, additivity `R_{μ⊞ν} = R_μ + R_ν`, free CLT → semicircle — all correct. The widget's `r_free = √(r₁²+r₂²)` and `R_{ρ_r}(z) = (r²/4)z` are correct: semicircle of radius r has variance r²/4, R(z) = σ²z, variances add under ⊞.
- **§6 Sine kernel** `K(x,y) = sin π(x-y)/(π(x-y))` (line 1206), Erdős–Schlein–Yau / Tao–Vu universality routes (DBM + four-moment), edge universality of TW with sub-Gaussian tails — correct.
- **§7 Montgomery 1972** pair correlation `R₂(α) = 1 - (sin πα/πα)²` is the GUE pair correlation; Dyson tea-time recognition, Odlyzko numerics — historically and mathematically correct.

## Wrong / dubious claims (with file:line)

- **random-matrix-theory.html:876 — Tracy–Widom edge scaling exponent is wrong.**
  `ξ_N = N^{2/3}(λ_max - 2√N)` is dimensionally inconsistent. With the page's joint density (β/4 ∑λ², bulk on [-2√N, 2√N]), the correct scaling is `N^{1/6}(λ_max - 2√N) ⇒ F_β`. The `N^{2/3}` exponent only applies when eigenvalues are already rescaled by 1/√N so that bulk is on [-2,2] (then `N^{2/3}(λ_max/√N - 2) ⇒ F_β`). The widget caption at line 1006 ("s — fluctuation in units of N^{2/3}") inherits the same error.
- **random-matrix-theory.html:1448 — table conflates Montgomery pair correlation with one-level density.**
  Row "ζ(s) alone | U | 1 - (sin πx/πx)²" lists Montgomery's *pair correlation R₂* in a column whose other entries are *one-level densities* (USp: `1 - sin(2πx)/(2πx)`, O± analogous). The one-level density of unitary symmetry is `W_U(x) = 1` (constant), not `1 - (sinπx/πx)²`. The legend at line 1550 ("W_G(x) — one-level density") repeats the mislabel for the U curve. Same error in the readout at line 1555 ("W(x) = 1 - (sin πx/πx)²" labeled Montgomery–Odlyzko — but Montgomery's formula is two-point, not one-level).
- **random-matrix-theory.html:1493 — O⁻ density is missing the contribution that distinguishes it from USp.**
  Code returns `1 - sin(2πx)/(2πx)` for `mode==='om'` (O⁻), identical to the symplectic curve at line 1491. The standard O⁻ one-level density is `1 - sin(2πx)/(2πx) + δ_0(x)` (the comment acknowledges the δ but the curve omits even the implied notch — the visual "δ-atom indicator" at line 1522 is the only differentiator from USp). USp and O⁻ end up plotted identically; the only visible difference is the pink δ-bar.

## Underspecified or unverifiable claims

- **§1, line 286** — "associative division algebras over R are R, C, H by Frobenius theorem" then "the same list of three that classifies finite-dimensional real division algebras" — slightly imprecise: the *associative* finite-dimensional real division algebras are R/C/H (Frobenius); allowing non-associative pulls in O (Hurwitz), so the second clause needs the "associative" qualifier to be exactly right.
- **§2, line 646** — "Convergence rate: O(1/√N) on macroscopic scales (Bai–Yin)" — the Bai–Yin theorem is about the largest eigenvalue's almost-sure convergence to the edge, not about the macroscopic Kolmogorov rate of the spectral measure. The macroscopic CDF rate for Wigner is closer to O(N^{-1}) (Götze–Tikhomirov). Attribution likely wrong.
- **§4, line 891** — KPZ initial-data → TW assignment ("F₂ curved, F₁ flat") is the standard pairing but the page omits the third (F_GOE² for stationary / Baik–Rains for stationary droplet). Not wrong, just incomplete.
- **§7, line 1576** — "Soundararajan's ≥ 87.5% non-vanishing of L(½, χ_d)" — the headline Soundararajan 2000 result is "≥ 7/8 of quadratic Dirichlet L-functions are non-vanishing at the central point" via mollifier methods; the 87.5% figure is correct but worth double-checking that the precise statement is non-vanishing of *the central value*, which it is.
- **BBP transition / spike model** — the audit prompt asks about this; the page does not cover BBP. Not an error, just a gap.
- **Determinantal point processes** — sine kernel is invoked but the underlying DPP framework (correlation kernel / Fredholm determinant of the kernel) is asserted, not developed. Acceptable scope choice.

## Severity

**Moderate.** Two clear math errors:
(1) the Tracy–Widom edge exponent (N^{2/3} should be N^{1/6} for the unrescaled convention used) — this is the headline equation of §4 and visible in the widget axis label;
(2) the U one-level density / Montgomery pair-correlation conflation in §7's table, legend, and widget readout, plus the O⁻ continuous part being plotted identically to USp.

Both are correctable with small in-place edits; neither breaks any widget, but both teach the wrong formula. Other sections (Wigner surmise constants, MP density, free convolution, Painlevé-II identity) verified clean.
