# Mostow rigidity — math-correctness audit (2026-05)

Scope: every mathematical claim in `mostow-rigidity.html` (904 lines, 7 sections, 6 widgets).

## Verified claims (sections)

- **§1.** Mostow rigidity for closed orientable hyperbolic n-manifolds (n ≥ 3), π₁-iso ⟹ isometric — correct (Mostow 1968). Teichmüller dim `6g − 6` for closed Σ_g, g ≥ 2, correct. Four-step proof outline (QI lift / QC boundary / ergodicity / Liouville → Möbius) matches the Gromov-streamlined argument.
- **§2.** `Isom⁺(ℍ³) ≅ PSL₂(ℂ)`, half-space metric `(dx²+dy²+dz²)/z²`, and closed M³ ↔ torsion-free discrete cocompact Γ ⊂ PSL₂(ℂ) all correct. Three constructions (quaternion arithmetic, Dehn surgery, pseudo-Anosov mapping tori) standard. Bianchi groups correctly noted as non-cocompact.
- **§3.** (K,C)-QI definition, Švarc–Milnor lift, boundary extension to QC homeomorphism of S^(n-1) — correct.
- **§4.** Hopf 1939 ergodicity correctly attributed. Diagonal Γ-action on `S^(n-1)² \ Δ` ergodic w.r.t. Lebesgue correct. Liouville/Gehring–Reshetnyak (1-QC of S^(n-1), n ≥ 3, is Möbius) correct.
- **§5.** Margulis arithmeticity (1974, rank ≥ 2) correctly stated modulo compact factor. Mostow/rank-1 vs Margulis/rank-≥2 framing correct. Gromov–Piatetski-Shapiro non-arithmetic lattices in every dim correct.
- **§6.** Volume rigidity, simplicial-volume definition (real chains rep'ing [M]), Gromov–Thurston `‖M‖ = Vol(M)/v_n`, `‖Sⁿ‖ = ‖Tⁿ‖ = 0`, eight Thurston geometries, Weeks ≈ 0.9427 smallest closed M³, `v₃ = 3·Λ(π/6) ≈ 1.0149` — all correct.

## Wrong / dubious claims (with file:line)

- **`mostow-rigidity.html:551` — "boundary K' ≈ K²".** No canonical square law; bulk→boundary QC dependence is non-elementary. Heuristic at best, misleading as a numerical claim.
- **`mostow-rigidity.html:563-565` — Dilatation tensor `μ = D∂f̃·D∂f̃ᵀ / det D∂f̃ − I`.** Non-standard and dimensionally wrong: standard distortion is `Dfᵀ Df / |det Df|^{2/n}`. Without the 2/n root, μ ≢ 0 for conformal maps in n > 2.
- **`mostow-rigidity.html:569` — "controls μ via Egoroff–Lusin".** Wrong attribution: those are measurability theorems. Mechanism is ergodicity (Γ-invariant measurable function on an ergodic action is a.e. constant).
- **`mostow-rigidity.html:790-795` — Volume-spectrum widget.** Heading says "closed hyperbolic 3-manifolds" but lists SnapPea **cusped** manifolds: `m003` (figure-8 sister, vol ≈ 2.0299) and `m004` (figure-8 knot complement, vol ≈ 2.0299) — both wrongly listed at 1.0149, and "m004 (fig-8 sister)" inverts the labeling (m003 is the sister; m004 IS the figure-8 complement). `s776`, `v3372` also cusped-census names. `Vol3 ≈ 5.0747` and "3-torus bundle ≈ 6.4520" unspecified.
- **`mostow-rigidity.html:268` — "isometry unique up to homotopy".** Vacuous: two homotopic isometries between closed hyperbolic manifolds are equal (cocompact π₁ has trivial centralizer in Isom⁺(ℍⁿ), n ≥ 2). Better: "unique within its homotopy class" or simply "unique".

## Underspecified or unverifiable claims

- **`mostow-rigidity.html:776` — "smallest known is the Weeks manifold".** It is **proven** smallest (Gabai–Meyerhoff–Milley 2009), not "smallest known". Out-of-date hedge.
- **`mostow-rigidity.html:809` — Axis label "in units where v₃ ≈ 1.0149".** Confusing: data values appear to be in absolute units; phrasing reads as a tautology.
- **Margulis lemma, Selberg's lemma, Bieberbach theorems, strong-rigidity-vs-Mostow.** Prompt asked to verify these; **none appear on the page**. Audit-scope miss, not a content error.
- **`mostow-rigidity.html:373` — pseudo-Anosov suspension.** Correct, but should note genus ≥ 2.

## Severity

**Moderate.** Core statements correct. But: volume-spectrum widget mislabels SnapPea cusped manifolds as closed (m003, m004 listed at 1.0149 instead of 2.0299); §4 dilatation tensor formula non-standard / dimensionally wrong; "Egoroff–Lusin" misnames the ergodicity argument; "K' ≈ K²" boundary readout has no basis. Fixes: correct census volume data, replace dilatation formula or prosify, swap Egoroff–Lusin → ergodicity, justify or remove K² readout, soften "unique up to homotopy" and "smallest known".
