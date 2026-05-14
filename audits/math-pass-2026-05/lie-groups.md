# lie-groups.html — math-correctness audit

Scope: every mathematical claim in `lie-groups.html` (1393 lines). Pedagogy/widget UX skipped.

## Verified claims

**§1 Lie groups & dimensions table.** All entries correct: dim GL_n(R)=n², dim SL_n=n²-1, dim O(n)=dim SO(n)=C(n,2)=n(n-1)/2, dim U(n)=n², dim SU(n)=n²-1, dim Sp(2n,R)=n(2n+1). Compactness/connectedness columns all correct (GL_n(R) has 2 components by sign of det; O(n) likewise; SO(n), SU(n), U(n), Sp(2n,R) connected). Closed-subgroup theorem (Cartan/von Neumann) correctly stated. SO(3)≅RP³ correctly identified.

**§2 Lie algebras.** Linearisations all correct: tr X=0 for sl_n; X^⊤+X=0 for so(n); X*+X=0 for u(n); X^⊤J+JX=0 for sp(2n). Identification mfrak{o}(n)=mfrak{so}(n) is right (disconnected component does not change tangent space at I). su(2) basis (1/(2i))σ_k = -i/2 σ_k consistent throughout. so(3) skew-matrix↔R³ identification with bracket = cross product is correct (line 524–525). Lie's three theorems statement correct. Subalgebra/ideal/centre/derived/perfect/semisimple definitions all standard and correct.

**§3 Exponential map.** Series, d exp_0 = id, one-parameter subgroup characterisation, surjectivity onto identity component for connected compact G, "products of exponentials" caveat for general connected G — all correct. Rodrigues exp(θK) = I + sin θ K + (1-cos θ) K² with K^3=-K verified. SU(2) exp formula exp(tX) = cos(tρ/2) I - i sin(tρ/2) n̂·σ verified by direct computation: with X=-i M/2, M=Σ aᵢσᵢ, M²=ρ²I, so exp(tX)=cos(tρ/2)I - i sin(tρ/2) M/ρ. Period 4π/ρ correct (spinor sign). Stereographic projection note correct.

**§4 BCH & Jacobi.** Commutator identity exp(tX)exp(tY)exp(-tX)exp(-tY) = exp(t²[X,Y]+O(t³)) correct. BCH series X+Y+½[X,Y]+1/12([X,[X,Y]]+[Y,[Y,X]])+… correct (note [Y,[Y,X]] = -[Y,[X,Y]], matching standard form). Jacobi identity and ad_X derivation property correct. sl_2 relations [h,e]=2e, [h,f]=-2f, [e,f]=h correct. so(3) bracket [E_i,E_j]=ε_{ijk}E_k correct for the basis matrices given in the widget JS (E₁,E₂,E₃ are the standard skew generators).

**§5 SU(2)→SO(3) double cover.** π₁(SU(2))=0, π₁(SO(3))=Z/2, π₃(SU(2))=π₃(SO(3))=Z all correct. Quaternion conjugation v↦qvq⁻¹ giving SO(3), kernel ±1, correct. The 3×3 matrix R(q) in lines 965–969 matches the standard quaternion-to-rotation formula entry-by-entry. Belt/Dirac plate trick attribution correct.

**§6 Adjoint & Killing form.** Ad_g(X) = gXg⁻¹, ad_X = d/dt|₀ Ad_{exp(tX)} = [X,·] derivation — correct. Jacobi ⇔ ad is Lie homomorphism: correct. Killing form B(X,Y)=tr(ad_X ad_Y) — correct. Sign on so(3): ad_X has eigenvalues 0, ±i|X|, so tr(ad_X²)<0, negative definite — correct. sl_2(R) signature (2,1) verified by direct computation in basis (h,e,f): Killing matrix [[8,0,0],[0,0,4],[0,4,0]], eigenvalues 8,4,-4 → signature (2,1). Cartan's criterion (semisimple ⟺ Killing nondegenerate) correct. Adjoint orbits / KKS / orbit method note correct.

**§7 Root systems.** Cartan subalgebra & root-space decomposition correct. A_1 roots ±α with α(h)=2 correct. A_2: h = traceless diagonal in sl_3(C), 2-dim, six roots ε_i-ε_j forming regular hexagon — correct. Widget labelling: α₁ at 0°, α₂ at 120°, α₁+α₂ at 60° — verified (with α₁=(1,0), α₂=(-1/2,√3/2), sum=(1/2,√3/2) at 60°). Weyl reflection s_α(v)=v-2(v·α)/(α·α)α implemented correctly in `drawA2`'s reflection code (lines 1228–1234). Root-system table: A_n has n(n+1) roots ✓; B_n has 2n² ✓; D_n has 2n(n-1) ✓; E_8 has 240 roots, Weyl order 696,729,600 ✓. Weyl group of B_n = (Z/2)ⁿ⋊S_n ✓. Killing–Cartan classification (A_n B_n C_n D_n + G_2 F_4 E_6 E_7 E_8) correct.

**§8 Connections.** Maurer–Cartan equation dω+½[ω,ω]=0 for ω=g⁻¹dg correct sign convention for left MC form. π₃(G)=Z for compact simple G correct. One-parameter subgroups = geodesics for bi-invariant metric on compact G correct.

## Wrong / dubious claims

None found. (One borderline: see Underspecified.)

## Underspecified or unverifiable claims

- **lie-groups.html:354** — the parenthetical `(n̂,θ)∼(-n̂,2π-θ)` for the SO(3)≅RP³ identification with θ∈[0,π] is technically true only at θ=π (where 2π-θ=π is back inside the range). The standard statement is "(n̂,π)~(-n̂,π) on the boundary sphere of the radius-π ball." As written the relation is correct but vacuous away from θ=π and slightly misleading; not wrong, just imprecise.
- **lie-groups.html:525** — "Under this identification one computes [X,Y]↔X·v×w" reads as a typo/garble; the intended statement is "[X,Y] (as a matrix) corresponds to v×w (as a vector) where X↔v, Y↔w". The math is correct, the typography is off — small enough I'd call it editorial, not mathematical.
- **lie-groups.html:1264** — D_n Weyl group cell shows "—" (no entry). The actual answer is (Z/2)^{n-1}⋊S_n, order 2^{n-1} n!. Not wrong, just blank.
- **lie-groups.html:531** — "matrix commutator corresponds to the *left*-invariant convention." This is the conventional statement (and matches Warner, Knapp, etc.) but a few texts (e.g. some physics conventions) use the opposite. Statement is fine for a notebook.

## Severity

**Clean.** All mathematical content verified correct. Only nits are one editorial garble (line 525) and one vacuous-by-construction parenthetical (line 354). No mathematical errors require a fix.
