# zeta-values.html — math-correctness audit

## Verified claims (sections)

**§1 Basel.** Weierstrass product `sin(πx) = πx ∏(1 − x²/n²)` ✓. Taylor coefficient match yielding `ζ(2) = π²/6` ✓. The "rigour note" correctly flags that Euler's coefficient-matching predates rigorous infinite-product convergence theory.

**§2 Even values.** Closed form `ζ(2n) = (−1)^{n+1} B_{2n} (2π)^{2n} / (2 (2n)!)` ✓. Generating function `t/(eᵗ−1) = Σ B_k tᵏ/k!` ✓. Bernoulli table `B_2 = 1/6`, `B_4 = −1/30`, `B_6 = 1/42` ✓. Closed-form table `ζ(4) = π⁴/90`, `ζ(6) = π⁶/945`, `ζ(8) = π⁸/9450`, `ζ(10) = π¹⁰/93555` ✓. Bernoulli column `B_8 = −1/30`, `B_{10} = 5/66` ✓. Numerical decimals 1.6449…, 1.0823…, 1.0173…, 1.0041…, 1.0009… ✓.

**§3 Apéry.** Apéry numbers `a_n = Σ C(n,k)² C(n+k,k)²` ✓ (standard form). Series `ζ(3) = (5/2) Σ (−1)^{n+1}/(n³ C(2n,n))` ✓ (Apéry 1978). `ζ(3) ≈ 1.20206` ✓. Rivoal 2001 (infinitely many odd ζ irrational) ✓.

**§4 Negative integers.** `ζ(−n) = −B_{n+1}/(n+1)` ✓. Specific values `ζ(0) = −1/2`, `ζ(−1) = −1/12`, `ζ(−2) = 0`, `ζ(−3) = 1/120`, `ζ(−4) = 0` ✓ (`ζ(−3) = −B_4/4 = −(−1/30)/4 = 1/120` ✓). Trivial-zeros explanation via `B_{2k+1} = 0` for `k ≥ 1` ✓. The "1+2+3+… = −1/12" framing as analytic-continuation shorthand (not actual sum) ✓.

**§5 Functional equation.** Completed `ξ(s) = π^{−s/2} Γ(s/2) ζ(s)` ✓. Symmetry `ξ(s) = ξ(1−s)` ✓. Asymmetric form `ζ(1−s) = 2(2π)^{−s} cos(πs/2) Γ(s) ζ(s)` ✓. Substitution at `s = 2n` yielding `ζ(1−2n) = −B_{2n}/(2n)` ✓ (matches `ζ(−n) = −B_{n+1}/(n+1)` at `n ↦ 2n−1`). Critical-line statement and zero-pairing `{ρ, 1−ρ}` ✓.

**§6 MZVs.** Iterated-sum convention `n_1 > … > n_k ≥ 1` with `s_1 ≥ 2` ✓. Euler `ζ(2,1) = ζ(3)` ✓. Stuffle `ζ(2)ζ(3) = ζ(2,3) + ζ(3,2) + ζ(5)` ✓. Shuffle `ζ(2)ζ(3) = ζ(2,3) + 3ζ(3,2) + 6ζ(4,1)` ✓ — verified by enumerating shuffles of `01` and `001` under the convention `ω₀^{s−1}ω₁` per slot; differencing gives the genuine relation `2ζ(3,2) + 6ζ(4,1) = ζ(5)` (numerically `1.036928…` both sides ✓). Zagier recursion `d_n = d_{n−2} + d_{n−3}` with seeds `d_0=1, d_1=0, d_2=1` produces `1,0,1,1,1,2,2,3,4,5,7,9,…` ✓. Plastic constant `ρ ≈ 1.3247` ✓ (root of `x³ = x + 1`). Goncharov–Terasoma upper bound, Hoffman {2,3}-basis conjecture, Brown 2012 spanning result ✓.

**§7 Mahler measure.** Jensen's formula in one variable ✓. Smyth `m(1+x+y) = (3√3/(4π)) L(χ_{−3}, 2)` ✓ (numerically 0.32307… both sides). Smyth `m(1+x+y+z) = (7/(2π²)) ζ(3) ≈ 0.4263` ✓. Boyd-conjecture form `m(P) ?= r · L'(E, 0)` for genus-1 ✓.

## Wrong / dubious claims (with file:line)

**zeta-values.html:411** — Widget `zetaFormula(n)` has an inverted sign. `const sign = ((n+1)%2===0) ? -1 : 1;` evaluates to `-1` whenever `n+1` is even, i.e., whenever `(-1)^{n+1} = +1`. Result: every `ζ(2n)` displayed by the widget is **negated**. Running it for n=1…8 produces `-1.6449, -1.0823, -1.0173, …`. The bare-eye contradiction with the boxed `ζ(2) = +π²/6` directly above is a math-correctness regression in the interactive. **Fix:** flip the ternary, `((n+1)%2===0) ? 1 : -1`. **Severity: major** (visible numerical contradiction with the page's own headline formula).

**zeta-values.html:504** — "in 2022 Wadim Zudilin showed at least one of ζ(5), ζ(7), ζ(9), ζ(11) is irrational." Zudilin's "one-of-four" theorem is **2001** (announced; published 2001/2004 in *Russian Math. Surveys* / *Uspekhi*), not 2022. Result and statement otherwise correct. **Severity: minor** (date attribution).

## Underspecified or unverifiable claims

- **§5, line 735** — Sketch "collecting powers of 2π gives ζ(1−2n) = −B_{2n}/(2n)" elides the Γ-reflection / sin(π·)·Γ algebra; the endpoint identity is correct (verified above), the one-line derivation is condensed but not wrong.
- **§6, line 913** — "Brown (2012) proved these *span* 𝒵_n; independence is the open half." Accurate; Brown's theorem is the upper-bound + spanning result, and Hoffman-basis independence remains conjectural.
- **§7, line 935** — Second equality `(3√3/(4π)) L(χ_{−3}, 2) = L'(χ_{−3}, −1)` invokes the χ_{−3} functional equation; numerical match holds, derivation not shown (acceptable for the page's level).

## Severity

**moderate.** Headline mathematics is uniformly correct — Basel, Bernoulli closed form, every entry of the ζ(2n) and ζ(−n) tables, functional equation, Apéry series, MZV stuffle/shuffle (including the non-trivial `ζ(2)ζ(3)` shuffle coefficients), Zagier recursion, both Smyth identities. The audit is moved off "clean" by one **major** widget bug (§2 interactive computes `ζ(2n)` with reversed sign, contradicting the boxed formula on the same page) and one **minor** date error (Zudilin's one-of-four theorem is 2001, not 2022).
