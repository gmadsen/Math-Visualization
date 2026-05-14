# Math audit — `dirichlet-series-euler-products.html` (2026-05-14)

## Verified claims (sections)

- **§1 Half-plane of convergence.** Monotonicity argument for σ_a (line 264-266), the bound σ_a − σ_c ≤ 1 (line 267), and the limit formula `a_n = lim_{σ→∞} n^σ (D(σ) − Σ_{k<n} a_k/k^σ)` itself (line 271) are all correct.
- **§2 ζ.** Abscissa σ_a = 1 (365), Laurent expansion `ζ(s) = 1/(s−1) + γ + O(s−1)` (368), Euler-constant definition (369). Correct.
- **§3 Euler product.** Multiplicativity ⇒ product expansion (448) and the completely-multiplicative collapse to a geometric series (451-452) are textbook-correct. The sieve identity `ζ(s)·∏_p (1−p^{−s}) = 1` for Re s > 1 (459) is correct.
- **§4 Characters & L-functions.** `(Z/N)^× → C^×`, image in roots of unity, |χ(n)| ≤ 1 (645-646); χ_0 contribution removes the bad primes giving `L(s,χ_0) = ζ(s)·∏_{p|N}(1−p^{−s})` (653); for χ ≠ χ_0 conditional convergence on Re s > 0 via partial summation (654); the mod-4 Leibniz value `L(1,χ) = π/4` (660). All correct.
- **§5 Functional equation.** `Λ(s) = π^{−s/2}Γ(s/2)ζ(s)` (843), `Λ(s) = Λ(1−s)` (845), gamma representation (848), Jacobi-θ modular transform `θ(1/x) = √x θ(x)` (851), and the explanation that Γ(s/2)'s pole at s=0 cancels Λ's pole at s=0 leaving ζ regular there (852) are all correct. Λ(s,χ) = W(χ)·Λ(1−s, χ̄) with |W(χ)| = 1 (867) is correct for primitive χ.
- **§6 Mellin.** Definition (924), Fourier/Laplace conjugacy via x = e^u (925), gamma identity `∫₀^∞ e^{−nx} x^{s−1} dx = Γ(s)·n^{−s}` and consequent `Γ(s)ζ(s) = ∫₀^∞ x^{s−1}/(e^x−1) dx` (929-931). Correct.
- **§7 Perron.** Formula `Σ_{n<x} a_n = (2πi)^{−1}∫_{c−i∞}^{c+i∞} D(s) x^s/s ds` for x non-integer, c > σ_a (1075-1076). `ζ(0) = −1/2` (1079) and the `x − 1/2 + O(1)` floor expansion. Correct. The von Mangoldt sum `−ζ'/ζ = Σ Λ(n) n^{−s}` and the explicit-formula contribution `−x^ρ/ρ` per non-trivial zero (1081) are correct.
- **§8 Dirichlet's theorem.** Statement (1221), `log L(s,χ) = Σ χ(p)/p^s + O(1)` near s=1 (1226), orthogonality projector (1227), and `π(x;N,a) ~ (1/φ(N))·x/log x` (1237) are all correct. Non-vanishing of L(1, χ) phrased correctly (1233-1234).
- **§9 Forward links.** Modular L-function `L(f,s) = Σ a_n/n^s`, elliptic curve local factor `1 − a_p p^{−s} + p^{1−2s}` with `a_p = p+1 − #E(F_p)` (1351). Correct.

## Wrong / dubious claims (with file:line)

- **`dirichlet-series-euler-products.html:272`** — Explanation of the uniqueness limit is logically muddled. Text says "every term a_k/k^σ with k<n is killed by multiplication by n^σ (because (n/k)^σ → ∞ eats the tail)". Those k<n terms are *subtracted* in the expression; multiplying them by n^σ would make them *blow up*, not vanish. The correct argument: the subtraction removes them; what's left is `a_n + Σ_{k>n} a_k (n/k)^σ`, and for k>n we have n/k<1 so the tail decays. The conclusion is right; the parenthetical justification is wrong.
- **`dirichlet-series-euler-products.html:657-660`** — The non-trivial character mod 4 is labelled `χ_3`. Standard convention names it `χ_4` (the Kronecker symbol `(−4/·)` / unique non-trivial character of conductor 4) or simply "the odd character mod 4". The label `χ_3` (presumably "the character that sends 3 to −1") is non-standard and could confuse readers familiar with conductor-indexed naming. Mathematically still consistent with itself.
- **`dirichlet-series-euler-products.html:1346`** — `<h2>7. What comes next</h2>` but the previous section is also numbered 7 (Perron). Should be `9.` (or `8.` if §6 Mellin's separate numbering is reconciled). Numbering bug, not math.

## Underspecified or unverifiable claims

- **`dirichlet-series-euler-products.html:867`** — Functional equation `Λ(s,χ) = W(χ) Λ(1−s, χ̄)`. As stated this is correct only for **primitive** characters; the page never restricts to that case. For imprimitive χ one needs to pass to the inducing primitive character. Worth a parenthetical "for primitive χ".
- **`dirichlet-series-euler-products.html:1234`** — "For complex characters [non-vanishing] follows from comparing to ζ" — true via the standard `ζ(s) ∏_χ L(s,χ)` having a simple pole, but the page's elliptic phrasing leaves the argument opaque. Not wrong, just terse.
- **Items the prompt asked about that the page does NOT contain**, so cannot be audited here: convolution identity D_{f∗g} = D_f · D_g; Möbius inversion via 1/ζ(s) = Σ μ(n)/n^s; the r_2(n) identity ζ(s)L(s,χ_4) = Σ r_2(n)/n^s; Ramanujan–Petersson bound on Hecke eigenvalues. Section 9 only gestures at modular/elliptic L-functions without invoking RP.

## Severity

**Minor.** All headline mathematical claims (Euler product, functional equation, Perron, Dirichlet's theorem, all numerical constants) are correct. One genuine logical slip in the §1 uniqueness explanation (line 272), one non-standard character label (`χ_3` for the mod-4 odd character), one missing primitivity caveat on the L-function functional equation, and a duplicate `7.` heading. No moderate or major errors.
