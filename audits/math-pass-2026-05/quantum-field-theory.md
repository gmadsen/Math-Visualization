# Math audit — `quantum-field-theory.html` (2026-05-14)

## Verified claims (sections)

- **§1 Canonical quantization.** ETCR `[φ(t,x),π(t,y)] = iℏδ³(x−y)` (l. 267); mode expansion with relativistic measure `d³p/((2π)³·2E_p)` and matching commutator `[a_p,a_q†] = (2π)³·2E_p·δ³(p−q)` (l. 271–273) are mutually consistent (Peskin–Schroeder §2.3 conventions). Hamiltonian normal-ordering as written is correct.
- **§2 Fock space.** `Sym^n` / `Λ^n` decomposition, Pauli exclusion as `(b†)²|0⟩ = 0`, spin-statistics attribution (Pauli 1940) correct.
- **§3 Path integral.** Lorentzian–Euclidean Wick rotation `iS → −S_E` and Boltzmann form correct; stationary-phase derivation of Euler–Lagrange correct.
- **§4 Feynman rules.** Mostly-minus signature explicitly declared (l. 665). Propagators `i/(p²−m²+iε)`, `i(p̸+m)/(p²−m²+iε)`, `−iη^{μν}/(p²+iε)` (l. 673) all correct in this convention. QED vertex `−ieγ^μ` correct.
- **§4 e+e− → μ+μ− tree cross section.** `σ = 4πα²/(3s)` is the canonical massless-fermion result. Numerical check at √s = 100 GeV: `(4π/3)(1/137)²/(10⁴ GeV²) × 3.894×10⁵ nb·GeV² ≈ 8.7×10⁻³ nb = 8.7 pb` — matches stated value (l. 678).
- **§5 RG one-loop coefficients.** QCD β `−(7/2π)α_s²` matches `b₀ = 11 − 2n_f/3 = 7` for n_f = 6; Gross–Wilczek–Politzer attribution correct (l. 802). SM `(b₁,b₂,b₃) = (41/10, −19/6, −7)` (l. 836) and `α_i⁻¹(M_Z) ≈ (59.0, 29.6, 8.5)` (l. 837) are textbook values. `α(M_Z) ≈ 1/128` vs `α(0) ≈ 1/137` (l. 909) consistent with PDG.
- **§6 Gauge sector.** Yang–Mills `F^a_{μν} = ∂_μ A^a_ν − ∂_ν A^a_μ + g f^{abc} A^b_μ A^c_ν` and infinitesimal `δA^a_μ = (1/g)∂_μ α^a + f^{abc}α^b A^c_μ` (l. 931–933) consistent with `D_μ = ∂_μ − ig A^a_μ T^a`. SM dimension count 8+3+1=12 correct. Mixing `γ = sin θ_W W³ + cos θ_W B`, `Z = cos θ_W W³ − sin θ_W B` (l. 941, 1024–1027), `M_Z = M_W/cos θ_W` correct. Higgs vev `v ≈ 246 GeV` correct. 't Hooft 1971 renormalizability attribution correct.

## Wrong / dubious claims

- **`quantum-field-theory.html:411` — microcausality sign error.** Says `[O(x),O(y)] = 0` for spacelike `(x−y)² > 0`. The page declares mostly-minus signature `(+,−,−,−)` at l. 665, in which spacelike separation has `(x−y)² < 0` (timelike is positive). This is a sign flip; either rewrite as `(x−y)² < 0` or drop the inequality and just say "for spacelike-separated x,y". Minor but wrong as stated.
- **`quantum-field-theory.html:752` — wrong coefficient on the "vertex" loop logarithm.** The widget readout writes the one-loop vertex correction as `(α/3π) ln(Λ/m_e)`. The `1/(3π)` coefficient is the **photon vacuum-polarization** (Π) running coefficient that drives `α(μ)` — it is not the QED vertex form factor. The actual one-loop QED vertex Z₁ divergence is `−(α/4π) ln(Λ²/m²) + …` (= `−(α/2π) ln(Λ/m)`). The Ward identity `Z₁ = Z₂` ties this to the wave-function renormalization, not to vacuum polarization. Either relabel as "vacuum polarization / running α" or use the correct vertex coefficient.

## Underspecified or unverifiable claims

- **`quantum-field-theory.html:802` — "QED β = +(2/3π)α²".** Correct for **one Dirac fermion** at one loop, but the page leaves the matter content implicit. Real running α to LEP includes all charged SM fermions, giving an effective coefficient much larger than `2/(3π)` once thresholds are crossed. The widget at l. 838–846 actually uses the GUT-normalized SM `b₁ = 41/10` (which is correct), so the prose-vs-widget mismatch could confuse readers. Not strictly wrong, but unstated assumption.
- **`quantum-field-theory.html:909` widget readout — "three GUT-normalized couplings nearly meet near 10¹⁵ GeV — textbook hint that supersymmetric extensions sharpen into actual unification."** Empirically the SM-only (no SUSY) curves miss meeting by a small but non-zero amount; the widget plots SM β-coefficients (b₁=41/10, b₂=−19/6, b₃=−7), so the lines actually shouldn't quite meet. The phrasing "nearly meet" is fair; "sharpen into actual unification" is a pedagogy claim, not a math claim — flagging only because the audit scope says "skip pedagogy" but this borders on a numerical assertion.
- **§4 LSZ.** Stated qualitatively as amputation + on-shell projection (l. 674); no formula given, so nothing to verify beyond the verbal description (which is correct).
- **§5 dim reg / counterterms.** Listed as a 3-step program (regulate / absorb / rewrite); no explicit counterterm computation to check.
- Wilson loops, lattice QFT, anomalies (chiral or gauge), and the explicit φ⁴ Lagrangian (`L = ½(∂φ)² − ½m²φ² − (λ/4!)φ⁴`) are **not present on this page** — page focuses on canonical quantization, Fock space, path integral, Feynman rules, RG, and the SM gauge sector. Out of scope for this audit but worth noting if those topics were expected.

## Severity

**Minor.** Two real defects (microcausality sign, wrong coefficient on the "vertex" loop-log readout); both are localized fixes. All major formulas — propagators, mode expansions, β-coefficients, the e+e− → μ+μ− cross section, electroweak mixing, SM dimension count — check out. No structural / load-bearing math errors.
