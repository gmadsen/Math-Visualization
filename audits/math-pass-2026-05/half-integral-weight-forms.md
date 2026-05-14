# half-integral-weight-forms.html — math-correctness pass 2026-05

## Verified claims (sections)

- **§1 Metaplectic / theta multiplier**: `j(γ,τ) = θ(γτ)/θ(τ)` is a genuine cocycle on Γ₀(4), behaves like √(cτ+d) up to an 8th root of unity. The transformation law `f(γτ) = χ(γ) j(γ,τ)^(2k+1) f(τ)` is the standard Shimura-Kohnen convention. Level-Γ₀(4) restriction (c divisible by 4) is correct.
- **§2 Sums-of-squares formulas**:
  - `r₂(n) = 4(d₁(n) − d₃(n))` — Jacobi 2-square ✓
  - `r₄(n) = 8σ(n) − 32σ(n/4)` — Jacobi 4-square ✓
  - `r₈(n) = 16 Σ_{d|n} (−1)^{n−d} d³` — Jacobi 8-square ✓ (equivalent to the more common `(−1)^{n+d}` since `(−1)^{n−d}=(−1)^{n+d}`).
- **§3 Shimura lift datum**: weight `k+1/2 → 2k`, level `Γ₀(4N) → Γ₀(2N)`, character `χ²`, Euler-factor identity `a_F(p) = a_f(p²) + χ(p) p^{k−1}` is the standard normalized form (folding the `(−1)^k`-twist into χ).
- **§4 Kohnen plus space**: support condition `(−1)^k n ≡ 0,1 (mod 4)` is correct; widget odd-/even-`k` branching (even ⇒ n≡0,1; odd ⇒ n≡0,3) is correct.
- **§4 Kohnen–Zagier**: Hecke-equivariant iso `S⁺_{k+1/2}(Γ₀(4)) ≅ S_{2k}(SL₂(ℤ))` is correct (cusp-form version).
- **§5 Waldspurger / Kohnen–Zagier formula**: `|a_f(|D|)|² = C · |D|^{k−1/2} · L(F⊗χ_D, k)` with sign condition `(−1)^k D > 0` and central point `s=k` are correct under the chosen normalization.
- **§6 Tunnell (1983)**: ternary forms `2x²+y²+32z²` (=A) and `2x²+y²+8z²` (=B) for odd squarefree n, criterion `L(E_n,1) ≠ 0 ⟺ B(n) ≠ 2A(n)` ✓. Hand-checked: n=1 ⇒ A=B=2, B−2A=−2≠0 ⇒ non-congruent ✓; n=5 ⇒ A=B=0 ⇒ B=2A ⇒ L=0 ⇒ congruent ✓. Direction `L≠0 ⇒ non-congruent` is unconditional via Waldspurger; converse needs BSD ✓.

## Wrong / dubious claims (with file:line)

- **half-integral-weight-forms.html:745** — "they must all be non-negative (or zero)" said of the *Fourier coefficients* `a_f(|D|)`. Wrong: the coefficients themselves can be negative; what is non-negative is the central L-value `L(F⊗χ_D, k)` (and equivalently `|a_f(|D|)|²`). The previous paragraph (§5 line 750) gets this right; this bullet contradicts it.
- **half-integral-weight-forms.html:642** — "$E_4$ in $M_4$ ↔ a unique form in $M^+_{5/2}(\Gamma_0(4))$" listed under the Kohnen–Zagier table. Sloppy: Kohnen–Zagier is the *cusp-form* iso `S⁺_{k+1/2} ≅ S_{2k}`. `E_4` is not a cusp form; the natural plus-space partner is the Cohen–Eisenstein series `H(2,n)` (which the page never names). The other rows (Δ↔S⁺_{13/2}, weights 16/18/20) are all cuspidal and correct.
- **half-integral-weight-forms.html:847** — Suggested test inputs `n = 1, 5, 6, 7, 13, 21, 23, 41` include `n=6` even though the same line states the widget handles only odd n. Internally inconsistent (cosmetic-but-confusing).

## Underspecified or unverifiable claims

- **§3 widget default (line 545)** — `a_f(p²) = -72` at `k=6, p=11` is asserted to "correspond to Δ via the inverse" but Ramanujan τ(11)=534612, and the widget then computes `a_F(11)=160979`, neither of which matches τ(11). The disclaimer text admits the mismatch but the chosen `-72` is essentially arbitrary; if the intent was a real Δ-preimage, then `a_f(121) = 534612 − 11⁵ = 373561` (trivial char) is the value. Pedagogically it's labeled correctly but illustrates nothing concrete.
- **Cohen–Eisenstein series**: never named anywhere in the page despite appearing implicitly under §4's `M^+_{5/2}` row. The audit prompt asks specifically about this; the page has a gap.
- **Concrete weight-3/2 example with explicit Shimura lift**: not given. Tunnell's ternary theta series in §6 are weight-3/2 forms but the page never writes them as such or computes their Shimura image (which would land in weight-2, namely the modular form attached to E_n). The link "half-integral form ↔ E_n" is asserted in the prose but not exhibited.
- **Hecke operators on half-integral forms**: only the off-hand "T_{p²} acts at p², not p" remark in §3. No definition, no commutation relations, no statement of why Shimura is Hecke-equivariant — but this is a topical-depth gap, not a wrong claim.
- **§1 metaplectic group**: described as a Z/2 cover via "(γ, ε)" pairs. The composition law involves the Kubota cocycle (or theta-multiplier construction) and is not a literal direct product of SL₂ × {±1} — the page elides this; readers may walk away thinking the cover is trivial. Borderline acceptable as introductory framing.
- **Tunnell direction quoted (line 840)**: "vanishing ⇒ A/B identity (positive rank ⇒ Tunnell sums match) is unconditional via Waldspurger". The unconditional implication is `L(E_n,1) ≠ 0 ⇒ rank 0 ⇒ n non-congruent`, equivalently `B ≠ 2A ⇒ n non-congruent`. The phrasing in the page muddles the contrapositive ("vanishing ⇒ ..."). Reads as confused, even if it can be parsed correctly with effort.

## Severity

**Minor.** No outright math errors in the headline theorems (Shimura, Kohnen–Zagier, Waldspurger, Tunnell). Two real but localized bugs: line 745's "coefficients non-negative" is genuinely wrong (squares-vs-values confusion); line 642's `E_4` row mis-applies the cuspidal Kohnen–Zagier statement to a non-cusp form. Plus a contradictory hint string at line 847 and a pedagogically wasted default value at line 545. Cohen–Eisenstein is a missing-topic gap rather than an error.
