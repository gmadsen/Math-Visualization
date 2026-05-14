# hecke-operators.html — math-correctness audit

Spot-check focus: T_p definition (lattice + tau), q-expansion action, Hecke algebra relations, eigenform multiplicativity, Petersson, worked examples (Δ, E_4), Atkin–Lehner / SMO / Jacquet–Langlands.

## Verified claims (sections)

- §1 (`#why`, line 283–288): `dimMk` formula matches the standard `floor(k/12) + 1` (or `floor(k/12)` if `k ≡ 2 (mod 12)`) for even `k ≥ 4`. Bar-chart values agree with Diamond–Shurman Fig 3.3 / OEIS A001160.
- §2 (`#tp`, lines 332–344): `p+1` index-`p` sublattices — count matches `|P^1(F_p)|`. Two coset reps `Λ_∞ = Z(pω₁)+Zω₂` and `Λ_b = Z(ω₁+bω₂)+Z(pω₂)` are the standard Hermite-normal-form reps. Lattice formula `(T_p f)(Λ) = p^{k-1} Σ f(Λ')` and the τ-side formula `(T_p f)(τ) = p^{k-1} f(pτ) + (1/p) Σ_b f((τ+b)/p)` are mutually consistent (verified by direct lattice→τ derivation: scaling `Λ_b` by `1/(pω₂)` produces the `p^{k-1-k} = p^{-1}` factor).
- §3 (`#qexp`, lines 531–541): q-expansion derivation is sound. Inner sum `(1/p) Σ_b e^{2πinb/p}` collapses to `δ(p|n)`, giving `c_n = a_{pn} + p^{k-1} a_{n/p}`. Numerically verified on Δ at p=2 for n=1..4.
- §4 (`#algebra`, lines 675–684): general formula `(T_n f)_m = Σ_{d|gcd(m,n)} d^{k-1} a_{mn/d^2}`, commutativity, multiplicativity for coprime indices, and prime-power recursion `T_{p^{r+1}} = T_p T_{p^r} - p^{k-1} T_{p^{r-1}}` all match Diamond–Shurman Prop 5.3.1.
- §5 (`#eigen`): eigenvalue/coefficient identification `λ_p = a_p / a_1` and normalization-to-`a_1=1` correct. Recursion `a_{pn} = a_p a_n - p^{k-1} a_{n/p}` and Hecke multiplicativity verified numerically (`τ(2)·τ(3)=τ(6)`, `τ(3)²-3¹¹=τ(9)`, etc.). All `τ(p)` values for p ≤ 47 in `taup` (line 797–799) match OEIS A000594. Deligne bound `|τ(p)| ≤ 2p^{11/2}` satisfied for every listed prime.
- §6 (`#petersson`, lines 945–947): integrand `y^{k-2} dx dy` is correct — `f(τ)\bar{g(τ)} y^k` is `SL_2(Z)`-invariant and `dx dy / y^2` is the hyperbolic measure. Self-adjointness statement (line 1034) and the consequence (orthogonal eigenform basis) are standard at full level.
- §7 (`#forward`, lines 1071, 1080): Frobenius-trace identity `tr ρ_f(Frob_p) = a_p`, `det = p^{k-1}`, and Euler factor `(1 - a_p p^{-s} + p^{k-1} p^{-2s})^{-1}` are correct. Deligne bound `|a_p| ≤ 2p^{(k-1)/2}` correctly stated.
- Widget at line 1095 (`w-euler`): Euler-factor disc/root computation correct; complex roots of modulus `p^{-11/2}` agree with Ramanujan–Deligne.

## Wrong / dubious claims (with file:line)

- `hecke-operators.html:651–652` (E_4 widget readout): the equality chain `a_p = 240·σ_3(p) = 1 + p^3` is **false as written**. With the widget's unnormalized convention (`E4coeff(n) = 240·σ_3(n)`, line 570), `a_p = 240(1+p^3)`, not `1+p^3`. The eigenvalue `λ_p = 1+p^3` only equals `a_p` after normalizing by `a_1 = 240`. Suggested fix: either say `λ_p = a_p / a_1 = 1+p^3` or display the normalized form `E_4 / 240`.
- `hecke-operators.html:651` (E_4 widget readout): `c_0 = a_0 + p^{k-1}·0 = 1` is **wrong**. Since `p | 0`, the convention `a_{n/p} = 0 unless p | n` (line 539) gives `a_{0/p} = a_0`, so `c_0 = (1 + p^{k-1}) a_0 = 1 + p^3` for E_4 — which is required for `T_p E_4 = (1+p^3) E_4` to hold at q^0. The "= 1" is internally inconsistent with the eigenform claim made one line later.

## Underspecified or unverifiable claims

- Line 763 asserts each `T_p` is diagonalizable before §6 proves self-adjointness; the page hedges with "we will see next", which is acceptable but a forward dependency.
- Line 768: "for cusp forms… `a_1 = 0` forces `f = 0` by the q-expansion principle" — true but the cited reason is a stretch; the actual argument is that the recursion makes all `a_n` vanish from `a_1 = 0` for an eigenform.
- Line 1037: brief Atkin–Lehner mention is correct in spirit but elides the distinction between `T_p` (good primes), `U_p` (bad primes), and AL involutions `W_q` for `q ‖ N`. Acceptable as a footnote on a SL_2(Z)-focused page.
- Strong multiplicity one is **not** discussed by name; line 1042's "this basis is unique" is the weaker spectral-theorem uniqueness at full level (multiplicities are 1), not the SMO theorem on `Γ_0(N)` newforms. Audit prompt asked about SMO; page does not really cover it.
- Newforms / Atkin–Lehner involutions: not introduced beyond the parenthetical at line 1037.
- Jacquet–Langlands: not present at all; page scope is classical.

## Severity

**Minor.** The page is mathematically sound on the central content (T_p definition, lattice ↔ τ derivation, q-expansion action, eigenform identities, Petersson, Euler product, Deligne bound, Δ worked example). The two flagged errors are confined to the E_4 widget readout (lines 651–652) — a normalization conflation in the eigenvalue identification and a `c_0 = 1` claim that contradicts the page's own convention. Easy textual fix; no diagrams or core formulas need to change. SMO / newforms / Jacquet–Langlands gaps are scope choices, not errors.
