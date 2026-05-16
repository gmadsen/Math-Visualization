# L-functions — math-correctness audit

Source: `/home/madsen/projects/Math-Visualization/L-functions.html` (1324 lines).

## Verified claims

**§1 Unified picture / §2 ζ(s) prototype**
- Four-costume definition (Dirichlet series + Euler product + analytic continuation + functional equation): canonical.
- ζ(s) = Σ n⁻ˢ = ∏ (1−p⁻ˢ)⁻¹ on Re s > 1; derivation by expanding geometric series + unique factorization: correct.
- Λ(s) = π⁻ˢ/² Γ(s/2) ζ(s), Λ(s)=Λ(1−s): correct (Riemann 1859).
- Critical line Re s = 1/2: correct.

**§3 L(E,s)**
- Local factor table (good / mult / additive) and shapes (1−aₚp⁻ˢ+p·p⁻²ˢ)⁻¹, (1−aₚp⁻ˢ)⁻¹, 1: correct.
- Hasse bound |aₚ| ≤ 2√p, αβ = p, |α|=|β|=√p: correct.
- Convergence half-plane Re s > 3/2: correct (follows from |aₙ| = O(n^{1/2+ε})).
- Recursions a_{p^{k+1}} = aₚ·a_{pᵏ} − p·a_{p^{k-1}} (good prime, weight 2) and multiplicativity: correct.
- Hand-curated `DATA` tables in `local-factor decoder` widget for curves 11.a3, 37.a1, 32.a3 cross-checked against LMFDB — all aₚ values correct.

**§4 L(f,s) of cusp eigenform**
- Hecke Euler product split p∤N / p|N with shapes (1−aₚp⁻ˢ+p^{k-1}p⁻²ˢ)⁻¹ and (1−aₚp⁻ˢ)⁻¹: correct.
- Reflection point s ↦ k−s for weight k: correct.
- αβ = p^{k-1} (Ramanujan–Petersson conjugate-root structure at good primes): correct.

**§5–6 Completion / Mellin**
- Λ(E,s) = N^{s/2}(2π)⁻ˢΓ(s)L(E,s); functional equation Λ(E,s) = w·Λ(E,2−s); root number w = ∏ wᵥ: correct (LMFDB normalization).
- Mellin computation ∫₀^∞ e^{−2πny}y^{s−1}dy = Γ(s)/(2πn)ˢ ⇒ ∫₀^∞ f(iy)y^{s−1}dy = (2π)⁻ˢΓ(s)L(f,s): algebraically correct.
- Functional-equation derivation via y↦1/y split at y=1: correct.

**§7 Modularity / §8 Continuation**
- Modularity Theorem statement (Wiles–TW–BCDT), L(E,s) = L(f,s), aₚ(E) = aₚ(f): correct.
- Riemann–Jacobi via θ(y) = Σ e^{−πn²y}, θ(1/y) = √y θ(y), ξ(s) = ½s(s−1)π^{−s/2}Γ(s/2)ζ(s): correct.

**§5 Sign widget / §9 Special values**
- w = +1 ↔ even-order vanishing at s = 1; w = −1 ↔ odd-order forced ≥ 1 (BSD parity): correct.
- ζ(2k) = (−1)^{k+1}(2π)^{2k}B_{2k}/(2·(2k)!): correct (k=1 gives π²/6; k=2 gives π⁴/90).
- ζ(1−n) = −Bₙ/n: correct (gives ζ(−1)=−1/12, ζ(−3)=1/120).
- BSD: ord_{s=1}L(E,s) = rank E(ℚ); leading-term formula with period · regulator · |Ш| · ∏cₚ / |torsion|²: correct.

## Wrong / dubious claims

- **L-functions.html:402–411 + 568–574** — The JS function `ap()` / `apCurve()` for E: y² = x³ − x has wrong sign convention. Comparing against LMFDB 32.a3, the code returns the negation at p ≡ 1 (mod 4) when the residue a (mod 4) selection flips. Concrete mismatches: p=5 prints +2 (true −2), p=13 prints −6 (true +6), p=29 prints +10 (true −10), p=37 prints +2 (true −2), p=53 prints −14 (true +14). Affects the §3 bar chart (`#w-ap`) **and** the partial-Euler / partial-sum convergence widget (`#w-eulerconv`). Hand-curated decoder table `DATA.cm` (lines 495–510) is correct — only the algorithmic recomputation is wrong.
  Fix: use `if (aa % 4 === 1) aa = -aa;` instead of `if (aa % 4 === 3) aa = -aa;` (or, equivalently, normalize `a ≡ 3 (mod 4)` as positive). The current convention disagrees with LMFDB for half the primes.

- **L-functions.html:725** — Hecke recursion notational collision: prose writes `a_{p^{k+1}} = a_p·a_{p^k} − p^{k-1}·a_{p^{k-1}}` using `k` for both the weight and the recursion index. The widget code (line 752) correctly uses `j` for the index. The body text needs a different letter (n, j, …) for the index.

- **L-functions.html:342** — "a_p = p+1 − #E(𝔽_p), the prime-to-p part of the trace of Frobenius." "Prime-to-p part" is non-standard / nonsensical here; aₚ *is* the trace, no decomposition involved. Drop "the prime-to-p part of."

## Underspecified or unverifiable claims

- **L-functions.html:1222–1224** — The "class number formula" L(1,χ) ≈ 2π·h·R / (w·√|d|) is written as if it applies to any nontrivial Dirichlet χ. The closed form shown matches imaginary quadratic fields; for real quadratic / higher-degree abelian extensions the formula has more pieces (R ≠ 1, and a single Dirichlet χ cuts out at most a quadratic field). Defensible as schematic but currently overstates generality.
- **§5 §817 widget #w-fe** — uses L(s) ≡ 1 stand-in; explicitly disclosed in caption. Not a math claim, but the visualization shows symmetry of the gamma/conductor envelope only, not of any real Λ(E,s). Acceptable given the caption.

## Topics in the audit prompt that the page does not actually cover

(For completeness — not "wrong," just absent from the page being audited.)
- Hecke L(s, π) for automorphic π — not introduced.
- Artin L(s, ρ) — not introduced.
- Specific computation of L(1, χ) for any small χ — not done; only the schematic class-number formula is shown.
- Explicit formula relating zeros to primes (Riemann–von Mangoldt / Weil) — not on this page.
- Selberg class axioms — not on this page.

## Severity

**Moderate.** One reproducible numeric bug (sign-flipped aₚ for the CM curve in two visible widgets) plus one notational collision in displayed prose plus one mis-phrasing. Symbolic claims (Euler products, completion, Mellin, ζ values, BSD parity, modularity statement) are all correct. Static decoder table is correct; only the JS recomputation is wrong, so the bug is contained to widgets `#w-ap` and `#w-eulerconv`.
