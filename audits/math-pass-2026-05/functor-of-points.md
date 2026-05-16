# `functor-of-points.html` — math-correctness audit

## Verified claims (sections)

- **§1 Reframe.** `X(R) = Hom_Sch(Spec R, X)` is covariant in `R`; this hom-functor determines `X` up to unique iso (Yoneda). Restriction to affine test objects loses no information. (Adjunction nit below.)
- **§2 Affine cubic.** `X(R) = {(a,b) ∈ R² : b² = a³+1}`. Manual counts agree: `|X(F_2)| = 2` and `|X(F_3)| = 3` (the case-split `a=0,1,2` is right; squares mod 3 are {0,1}, so `b²=2` has no solution).
- **§3 Representable functors.** `A¹` represented by `Z[t]`, `G_m` by `Z[t,t⁻¹]`, `μ_n` by `Z[t]/(tⁿ−1)`. Yoneda uniqueness (`h_X ≅ h_Y ⇒ X ≅ Y`) is correctly stated.
- **§4 GL_n.** `GL_n` represented by `Z[x_{ij}, t]/(t·det(X) − 1)` ✓. Order formula `|GL_n(F_q)| = ∏_{i=0}^{n-1}(qⁿ − qⁱ)` ✓. The widget computes this correctly via BigInt. SL_n decoder ring `Z[x_{ij}]/(det(X)−1)` ✓. Hopf-algebra coaddition `t ↦ t⊗1 + 1⊗t` for `G_a` ✓.
- **§5–6 Moduli & failure.** `Δ = −16(4A³ + 27B²)` for `y² = x³ + Ax + B` ✓. `Aut(y²=x³+x) ≅ Z/4` (over fields containing `i`) ✓; `Aut(y²=x³+1) ≅ Z/6` (over fields containing `ζ_3`) ✓. The non-representability argument via twisted families is correct, as is the diagnosis that sheafification of isomorphism-class presheaf forgets gluing data.
- **§6 Rigidification.** `Y(N)` is a fine moduli scheme for `N ≥ 3` (over `Z[1/N]`), because `[−1]` does not preserve level-N structure for `N ≥ 3`. ✓
- **§8 Yoneda embedding.** `Nat(h_X, F) ≅ F(X)` with the iso `η ↦ η_X(id_X)` ✓; consequence `Nat(h_X, h_Y) ≅ Hom(X, Y)` ✓; full faithfulness ✓.
- **§9 Base change.** `(X ×_S Y)(T) = X(T) ×_{S(T)} Y(T)` ✓. Weil restriction `Res_{L/k}(X)(R) = X(R ⊗_k L)` ✓ (correct as a definition). Worked fiber: `Spec Z[x]/(x²−p) → Spec Z`, fiber over `ℓ` (with `p` a square mod `ℓ`) is `{±√p} ⊂ F_ℓ` ✓; over `ℓ = p` the fiber is `Spec F_p[x]/(x²)` ✓.

## Wrong / dubious claims (with file:line)

- **`functor-of-points.html:932` — `j`-invariant computation off by factor of 4 in the widget.** Code: `j = -1728 * (4*a*a*a) * 64 / disc` evaluates to `−1728·4a³·64/Δ = −1728·256a³/Δ`, but the correct formula `−1728·(4a)³/Δ = −1728·64a³/Δ`. The widget therefore reports `j` four times too large for any nonzero `t`. The prose just below (`j(E_t) = -1728 · (4t)³ / Δ`) is correct; only the JS is wrong. Sanity check at `t=1, B=1`: should give `j ≈ 222.97`; widget reports `≈ 891.87`.
- **`functor-of-points.html:1116` — "fully faithful ⇒ reflective subcategory" is incorrect.** The Yoneda embedding `Sch → PSh(Sch)` is fully faithful, but the inclusion of representables into presheaves is not a reflective embedding (it has no left adjoint in general; sheafification is a reflection of presheaves into sheaves, not into representables). The intended slogan ("Sch sits faithfully inside presheaves") survives if you delete "reflective".
- **`functor-of-points.html:1116` — "Presheaves that land in that subcategory are exactly the representable ones — equivalently, those satisfying … descent plus a local representability condition."** As written, this conflates "representable" with "representable by a scheme" and with "algebraic space / stack". Descent + local representability (in the étale/fppf topology) gives **algebraic spaces**, not schemes. The next sentence then correctly identifies algebraic spaces / stacks as non-representable but descent-satisfying — directly contradicting the "equivalently" clause.

## Underspecified or unverifiable claims

- **`functor-of-points.html:273` — "by adjunction `Spec ⊣ Γ`".** Convention-dependent: as functors `Γ: Sch → CRing^op` is left adjoint to `Spec: CRing^op → Sch`, so without the `op` the conventional way to write it is `Γ ⊣ Spec`. Many authors write `Spec ⊣ Γ` informally. Not wrong, just informal.
- **`functor-of-points.html:527` — "this curve has L-function tied to a modular form".** True (modularity theorem; `y² = x³+1` is CM by `Z[ζ_3]`, conductor 36), but unverifiable from the page itself. Fine as a teaser.
- **`functor-of-points.html:985-986`** — automorphism statements quietly need char `≠ 2, 3` (so the standard short Weierstrass form is the right model and the listed automorphisms exhaust `Aut`). Not stated. The page is implicitly working over `C` or `Q(i)`/`Q(ζ_3)`, which is fine.
- **§7 stacks preview** is a sketch and self-flagged as such; no specific claim to verify.
- **No mention of étale / fppf / fpqc sites** beyond a single parenthetical in §8 ("Zariski (or fppf, fpqc, …) descent"). The audit prompt asks about sheaves on these sites; the page does not develop this, which is a coverage gap rather than an error.

## Severity

**Minor.** One genuine numeric bug (widget `j`-invariant off by 4×) and one terminology slip ("reflective" / scope of "representable") in §8. All worked examples, the GL_n formula, the affine cubic counts, the moduli failure argument, Weil restriction, and the fiber example are correct. The numeric bug is user-visible in W5 and should be fixed; the §8 terminology slip is a one-line edit.
