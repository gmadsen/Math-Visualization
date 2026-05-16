# Algebraic topology — math-correctness audit (2026-05)

Scope: every mathematical claim in `algebraic-topology.html` (1,562 lines, 7 sections + Mayer–Vietoris and χ widgets).

## Verified claims (sections)

- **§1 Intro / classical corollaries.** Brouwer (retraction obstruction is correct in spirit; see flag below), Hairy Ball via Poincaré–Hopf with χ(S²)=2, Ham Sandwich from Borsuk–Ulam (no Z/2-equivariant Sⁿ→Sⁿ⁻¹).
- **§2 Fundamental group.** π₁(S¹)≅ℤ via universal cover proof sketch is correct. Table of standard π₁'s (ℝⁿ, S¹, Sⁿ for n≥2, T², S¹∨S¹, ℝPⁿ for n≥2, Σ_g) is all correct, including the surface group presentation ⟨a_i,b_i | ∏[a_i,b_i]⟩.
- **§3 Universal cover of S¹.** Proof-scrubber 7-step argument (claim, cover, lifting, winding, surjectivity, injectivity via discreteness of fibre, conclusion) is mathematically clean.
- **§4 Covering spaces.** Galois correspondence (subgroups H ≤ π₁ ↔ connected based covers; normal H ↔ regular covers with deck group π₁/H) is correctly stated under the right hypotheses (path-conn, locally path-conn, semilocally simply-conn). Universal cover of S¹∨S¹ as the 4-valent tree (Cayley graph of F₂) is correct.
- **§5 Singular/simplicial homology.** Boundary formula ∂[v₀,…,v_n] = Σ(−1)ⁱ[v₀,…,v̂_i,…,v_n] correct; ∂² = 0 correct; H_n = ker∂_n / im∂_{n+1} correct. Sanity values (point, S¹, S², T², ℝP²) all correct including the ℤ/2 torsion in H₁(ℝP²) and its rational invisibility.
- **§5 widget triangulations.** Tetrahedron-as-S² (4V/6E/4F), 3×3 torus grid (9V/27E/18F, χ=0), Möbius minimal ℝP² triangulation (6V/15E/10F, χ=1) all check out arithmetically and topologically. Boundary-matrix Q-rank computation of Betti numbers via b₀ = nV − r₁, b₁ = nE − r₁ − r₂, b₂ = nF − r₂ is correct for connected complexes (the standard formulas with d₀=0).
- **§6 Mayer–Vietoris.** Sequence formula with maps (ι_U, ι_V), j_U − j_V, ∂ correct. Inductive derivation of H_*(Sⁿ) by hemisphere cover is correct; widget computes H_k(Sⁿ) = ℤ for k∈{0,n}, else 0 (degenerating to ℤ² in degree 0 when n=0 is not exposed, but the widget restricts to n≥1 — fine).
- **§7 Euler characteristic.** χ = Σ(−1)ⁿc_n = Σ(−1)ⁿb_n correct (Hopf trace / Euler–Poincaré). χ(S²)=2 (Euler's formula); closed orientable surface χ = 2−2g; non-orientable χ = 2−k (crosscap count) all correct. Csaszar (7V/21E/14F, χ=0), Klein (8V/24E/16F, χ=0) numerics correct. Genus-2 minimal CW (1V/4E/1F with attaching word [a₁,b₁][a₂,b₂]) gives χ = 1−4+1 = −2 = 2−2·2, correct.
- **§7 Cohomology snippets.** H*(T²;ℤ) ≅ Λ[α,β] (deg 1) correct; H*(ℂPⁿ;ℤ) ≅ ℤ[x]/(xⁿ⁺¹), |x|=2 correct. Poincaré duality H^k(M) ≅ H_{n−k}(M) for closed oriented M correct; cap product with [M] iso correct; b_k = b_{n−k} duality table for T² (1,2,1) and Σ_g (1, 2g, 1) correct.
- **§7 Gauss–Bonnet.** ∫K dA = 2πχ correct; round sphere K=1/R², ∫K dA = 4π = 2π·2 correct; flat torus K=0, χ(T²)=0 correct.

## Wrong / dubious claims (with file:line)

- **`algebraic-topology.html:290` — Brouwer fixed-point retraction sketch.** "would produce a section of H_{n−1}(S^{n−1}) ↪ H_{n−1}(Dⁿ) = 0". Two issues: (a) "section" is the wrong word — what the retraction r∘i = id forces is that the inclusion-induced i_∗ is a split monomorphism, not that there is a *section*. (b) The hook-arrow ↪ implies i_∗ is injective, but it lands in 0; the actual contradiction is that an injection ℤ → 0 is impossible. The standard wording is "i_∗ would be split-injective with codomain 0, contradiction."
- **`algebraic-topology.html:339` — H-space/abelian slogan.** "true for any H-space, any product, and any space of dimension ≥ 2 in the sense of CW dimension if π₁ happens to commute." The third clause is circular ("π₁ commutes if it commutes"), and "any product" is ambiguous: π₁(X×Y) = π₁(X) × π₁(Y) is abelian *iff both factors are*. Recommend rewriting to: "true for any H-space (Eckmann–Hilton), and hence in particular for any topological group."

## Underspecified or unverifiable claims

- **`algebraic-topology.html:921` — "Möbius, 1861" attribution for the minimal 6-vertex ℝP² triangulation.** The triangulation itself (6V/15E/10F = K_6 / antipodal) is correct; the historical attribution to Möbius is conventional but the date varies in the literature (sometimes 1865, also Coxeter and others contributed). Not a math error, just a soft-cite.
- **`algebraic-topology.html:1262` — "knot complement π₁ distinguishes knots that H_∗ cannot tell apart".** True (any two knot complements have H₁ = ℤ), but the claim is a passing aside; no falsehood.
- **`algebraic-topology.html:1209` — Mayer–Vietoris widget prints "χ(Sⁿ) = (n%2===0 ? 2 : 0)".** This is χ(Sⁿ) = 1+(−1)ⁿ, which is 2 for even n and 0 for odd n — correct, just confirming the parity.

## Severity

**Minor.** Two presentational/wording issues (Brouwer "section"; H-space slogan), no incorrect computations, no wrong group/ring identifications. All widget arithmetic and topological invariants check out. Recommend a one-line copy-edit on lines 290 and 339; everything else is clean.
