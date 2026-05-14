# analytic-number-theory.html — math-correctness audit

## Verified claims (sections)

**§1 PNT.** π(x) ~ x/log x (Hadamard, de la Vallée Poussin 1896) ✓. Li(x) asymptotic `x/log x + x/(log x)^2 + 2x/(log x)^3 + ⋯` ✓ (matches `Li(x) ~ (x/log x) Σ k!/(log x)^k`).

**§2 Explicit formula.** Euler product, definition of Λ, ψ(x) = Σ_{n≤x} Λ(n), and PNT ⇔ ψ(x) ~ x ✓. Riemann–von Mangoldt explicit formula
`ψ(x) = x − Σ_ρ x^ρ/ρ − log(2π) − ½ log(1 − x^{−2})` ✓ (standard form modulo the usual `ψ_0` jump convention at prime powers, which doesn't affect content here). Trivial-zero contribution `−½ log(1 − x^{−2})` derives correctly from `−Σ_{k≥1} x^{−2k}/(−2k)` ✓. Pole residue at s=1 gives main term x ✓. Von Koch's RH-equivalent bound ψ(x) − x = O(x^{1/2}(log x)^2) ✓.

**§3 Zero-free region.** Identity `3 + 4 cos θ + cos 2θ = 2(1 + cos θ)^2 ≥ 0` ✓. Hadamard–dlVP non-vanishing on Re s = 1 ✓. Classical region σ > 1 − c/log|t| ✓. Vinogradov–Korobov region σ > 1 − c/((log|t|)^{2/3}(log log|t|)^{1/3}) ✓ (current best unconditional). Effective remainder `O(x exp(−c √log x))` ✓.

**§4 Dirichlet.** Theorem statement (gcd(a,q)=1 ⇒ infinitely many primes in a mod q) ✓. Character orthogonality identity ✓. Reduction to L(1,χ) ≠ 0 ✓. Class-number formula L(1,χ) = 2π h_d/(w_d √|d|) is the imaginary-quadratic case (d < 0) ✓; the parenthetical "or analogous formula for Re > 0" hedges the real-quadratic case correctly.

**§5 Sieves.** Brun (1915) truncation ✓. Twin-prime upper bound π_2(x) ≪ x/(log x)^2 ✓. Brun's constant B_2 ≈ 1.902 ✓ (1.90216…). Selberg (1947) Λ²-sieve `(Σ λ_d)² ≥ 1[(n,P(z))=1]` with λ_1 = 1 ✓. Chen's theorem statement ✓.

**§6 Bombieri–Vinogradov (1965).** Statement with Q = x^{1/2}/(log x)^B and bound x/(log x)^A ✓. GRH-on-average framing ✓. Elliott–Halberstam conjecture (Q up to x^{1−ε}) ✓. Maynard–Tao bound 246 ✓ (current best as of 2025; the page's "as small as 12" under EH is the published Maynard bound).

**§7 Circle method.** Generating-function setup, orthogonality on [0,1], major/minor arcs ✓. Ternary Goldbach asymptotic `r_3(N) ~ S(N) · N²/(2(log N)³)` ✓. Waring values g(2)=4 (Lagrange), g(3)=9 (Wieferich), g(4)=19 (Balasubramanian–Deshouillers–Dress, 1986) ✓.

**§8 Exponential sums.** Weyl's criterion ✓. Weyl's inequality `|Σ e(αn^k)| ≪ N^{1+ε}(q^{−1} + N^{−1} + qN^{−k})^{1/2^{k−1}}` ✓ (standard form). Bourgain–Demeter–Guth ℓ²-decoupling 2016 ✓.

**§9 Selberg–Erdős.** Symmetry formula `Σ log²p + Σ_{pq≤x} log p log q = 2x log x + O(x)` ✓. Identity Λ*1 = log, Möbius inversion to Λ = μ*log ✓. Asymptotic `Σ_{n≤x} log²n = x log²x − 2x log x + 2x + O(log²x)` ✓.

**§10 Large sieve.** Bound `Σ_{q≤Q} Σ_χ^* |Σ a_n χ(n)|² ≤ (Q² + N) Σ|a_n|²` ✓ (Montgomery–Vaughan; some sources use Q² + N − 1 or N + Q²). Plancherel/dual form for δ-spaced frequencies ✓.

## Wrong / dubious claims (with file:line)

**analytic-number-theory.html:724** — "The number of primitive characters of conductors ≤ Q is ≍ Q²/ζ(2)." The asymptotic `Σ_{q≤Q} φ*(q) ~ Q²/(2ζ(2))` carries an extra factor of 1/2 (see e.g. Iwaniec–Kowalski Thm 3.4 / Montgomery). The order Q² is right and the heuristic point about sharpness survives, but the constant as written is off by 2. **Severity: minor** (asymptotic constant, not the operative bound).

**analytic-number-theory.html:672, 700** — "limsup |R(x)/x| ≤ ½ limsup |R(x)/x|, iterate to A=0." The Erdős averaging step does deliver self-improvement, but the genuine inequality has the form `A ≤ (1−δ)A + o(1)` after a more delicate Tauberian step (the explicit constant ½ is not standard and oversimplifies the Selberg–Erdős bootstrap). The conclusion R(x)=o(x) is correct; the one-line derivation reads as cleaner than the actual proof. **Severity: minor** (sketch-level, flagged "Erdős's averaging step").

## Underspecified or unverifiable claims

- **§7, line 532** — "Vinogradov's 1937 proof that every sufficiently large odd N is a sum of three primes." Vinogradov's 1937 theorem is correctly stated; the *full* ternary Goldbach (every odd N ≥ 7) was only established in 2013 (Helfgott). The page's "sufficiently large" hedge is accurate but doesn't note the resolved finite-case completion.
- **§3, line 363** — "with effective remainder ψ(x) = x + O(x exp(−c √log x))" — sign convention `+O` is standard; constant c unspecified (acceptable).
- **§7, line 532** — Wieferich's 1909 proof of g(3)=9 had a gap completed by Kempner (1912); attribution to Wieferich alone is the customary shorthand.

## Severity

**clean** (with two minor caveats above). All headline formulas — Euler product, explicit formula, RH-equivalent error, Vinogradov–Korobov region, Selberg symmetry, Bombieri–Vinogradov, Weyl, large sieve, ternary Goldbach singular series — check out. The only flagged items are a stray factor of 2 in the count of primitive characters and a one-line oversimplification of the Erdős bootstrap's self-improvement constant.
