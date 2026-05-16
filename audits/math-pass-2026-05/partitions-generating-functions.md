# Math-correctness audit — partitions-generating-functions.html

Scope: every math claim relating to p(n), Euler's product, pentagonal number theorem, Jacobi triple product, Ramanujan congruences, η, Δ, and Hardy–Ramanujan / Rademacher asymptotics. Pedagogy skipped.

## Verified claims

- **§1 p(n) table.** p(1..10) = 1,2,3,5,7,11,15,22,30,42 ✓. p(20)=627 ✓. p(100)=190,569,292 ✓. p(0)=1 by convention ✓. The seven partitions of 5 listed (line 270) are correct and exhaustive.
- **Pentagonal recurrence cost** O(N^{3/2}) ✓.
- **§2 Euler product identity** `Σ p(n) q^n = ∏ 1/(1-q^n)` ✓.
- **§2 Glaisher chain** `∏ 1/(1-q^{2k-1}) = ∏(1-q^{2n})/(1-q^n) = ∏(1+q^n)` ✓ (telescoping via 1-q^{2n}=(1-q^n)(1+q^n)).
- **§3 Pentagonal expansion** `1 - q - q² + q⁵ + q⁷ - q^{12} - q^{15} + q^{22} + q^{26} - …` ✓. Generalized pentagonals 1,2,5,7,12,15,22,26,35,40 ✓ (k=±1,±2,±3,±4,±5 give k(3k-1)/2).
- **§3 Sign convention** `Σ_{k∈ℤ} (-1)^k q^{k(3k-1)/2}` ✓ (k=1 → -q, k=-1 → -q², k=±2 → +q⁵, +q⁷, …).
- **§3 Recurrence** `p(n) - p(n-1) - p(n-2) + p(n-5) + p(n-7) - …` and its boxed form with `(-1)^{k+1}[p(n-g_k)+p(n-g_{-k})]` ✓. Widget 3 implements the same and reproduces the known sequence.
- **§4 Jacobi triple product** statement ✓.
- **§4 Functional equation** `F(zq²) = z^{-1}q^{-1} F(z)` ✓ (direct shift `n → n+1` in `Σ z^n q^{n²}`).
- **§4 z = -1 specialization** `∏(1-q^{2n})(1-q^{2n-1})² = Σ(-1)^n q^{n²}` ✓.
- **§4 Two-square** `r_2(n) = 4(d_1(n) - d_3(n))` ✓ (Jacobi, divisors mod 4).
- **§5 Ramanujan congruences** `p(5n+4) ≡ 0 (mod 5), p(7n+5) ≡ 0 (mod 7), p(11n+6) ≡ 0 (mod 11)` ✓. p(4,9,14,19,24,29) = 5,30,135,490,1575,4565 all divisible by 5 ✓.
- **§5 Higher prime-power congruences** p(25n+24) ≡ 0 (mod 25), p(49n+47) ≡ 0 (mod 49) ✓ (Watson 1938, Atkin 1967).
- **§5 Ramanujan's mod-5 identity** `Σ p(5n+4) q^n = 5 ∏(1-q^{5n})^5 / ∏(1-q^n)^6` ✓.
- **§5 Ono's theorem** (2000) on congruences mod ℓ^k for every prime ℓ ≥ 5 ✓.
- **§6 η transformations** `η(τ+1) = e^{πi/12} η(τ)`, `η(-1/τ) = √(-iτ) η(τ)` ✓; η is a weight-1/2 modular form with multiplier.
- **§6 Δ = η^{24}** as the first cusp form of weight 12 on SL₂(ℤ), τ(1,2,3) = 1, -24, 252 ✓.
- **§6 Rademacher exact formula** form (with `√k A_k(n)` Kloosterman-sum coefficients, `d/dn[sinh(...)/√(n-1/24)]`, prefactor `1/(π√2)`) ✓.
- **§7 Hardy–Ramanujan asymptotic** `p(n) ~ exp(π√(2n/3)) / (4n√3)` ✓. Numerical: HR(100) ≈ 1.993·10⁸ vs p(100) = 1.906·10⁸, ~4% relative error ✓.
- **§7 Saddle point** τ_s ≈ i/√(24n) and exponent π√(2n/3) ✓ (verified analytically: exponent at saddle = π√(6n)/3 = π√(2n/3)).

## Wrong / dubious claims

- **partitions-generating-functions.html:387–390 — "Glaisher's theorem"** is misattributed. The statement "partitions into odd parts ↔ partitions into distinct parts" is **Euler's theorem** (1748). Glaisher's 1883 theorem is the strict generalization: partitions where no part appears ≥ k times ↔ partitions where no part is divisible by k. The Euler case is k=2. The page also calls the binary-multiplicity construction "Glaisher's bijection" (line 390) — that map is usually credited to **Sylvester** or simply called the "binary bijection"; Glaisher's bijection refers to a different combinatorial map. Severity: minor misattribution, math content is correct.
- **partitions-generating-functions.html:632 — Substitution to recover Euler's pentagonal from JTP.** Setting `z = -q` and "replacing q² → q³" does not produce ∏(1-q^n) on the product side. The correct standard substitution is `z = -q^{1/2}` together with `q² → q^3` (equivalently `q → q^{3/2}`). With `z = -q`: the product side becomes ∏(1-q^{3n})(1-q^{3n})(1-q^{3n-3}), which is not ∏(1-q^n). The result the page states is correct; the substitution recipe is not.
- **partitions-generating-functions.html:993 — Cauchy integral formula** is written `p(n) = (1/2πi) ∮ τ^{-n-1} Σ p(m) q^m dq`. The variable in the kernel should be `q^{-n-1}`, not `τ^{-n-1}` (τ and q are conflated; the integration is around |q| = const). Severity: typo, but in a derivation paragraph the reader is meant to follow.

## Underspecified or unverifiable claims

- **§6 "$25$th-power of η in disguise"** — narrative aside ("the jump from η⁻¹ to η^{24} is a 25th-power of η in disguise"). Mathematically inert / pedagogical metaphor; not a checkable claim. Flag only because a careful reader may try to interpret it as algebra.
- **§7 Coefficient-extraction prefactor** `(2π)^{-1/2} (τ/i)^{1/2} exp(πi/(12τ))` — the leading factor's precise constant depends on whether the η normalization or the partition g.f. normalization is being tracked. The exponential and the (τ/i)^{1/2} factor are correct; the `(2π)^{-1/2}` constant is at most off by an overall factor in the way the η-transform is written. As a derivation sketch (not a "boxed" identity), it lands within acceptable looseness — but a reader cross-checking the constants will not recover them precisely from what's printed.

## Severity

**Minor.** All headline boxed identities and all numerical values check out. The three flagged issues are: (i) a name attribution (Euler/Glaisher), (ii) a step in a triple-product specialization where the substitution is misstated though the conclusion is correct, and (iii) a typo conflating τ and q in the Cauchy integral. None of these are math-correctness blockers; all are worth a one-line fix.
