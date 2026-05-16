# additive-number-theory.html — math-correctness audit (2026-05)

**Topical mismatch.** Page is sums-of-squares + Waring + Bernoulli/EM/ζ(2n). The brief's additive-combinatorics topics (sumsets, Plünnecke-Ruzsa, Freiman, Schnirelmann, Goldbach, Vinogradov three-prime, Roth, Szemerédi, Behrend) do **not** appear ("Vinogradov" is only the Wooley–Vinogradov G(k) bound). Audit covers what is present.

## Verified claims

- **§2 Fermat 2-squares + Brahmagupta–Fibonacci** (376–388): both directions and identity correct.
- **§3 Z[i] splitting** (435–446): ramified/split/inert by p mod 4 correct.
- **§4 Two-squares + Jacobi r₂=4(d₁−d₃)** (542, 549): correct; r₂(25)=12 verified.
- **§5 Legendre–Gauss + Gauss class-number formulas** (668, 672): standard.
- **§6 Lagrange + Jacobi r₄(n)=8 Σ_{d|n,4∤d} d** (784, 798): theorem, four-square identity, prime step all correct.
- **§8 Euler g(k)=⌊(3/2)ᵏ⌋+2ᵏ−2 + extremal n_k** (985–987): matches g(2..10) (verified).
- **§9 g/G table** (1084–1097): all g values, G(2)=4, G(4)=16 (Davenport), G(3)≤7 (Linnik), G(8)≥32 from n⁸∈{0,1} mod 32 (verified).
- **§10 Hilbert–Waring identity** (1198–1204): genuine 1909 identity.
- **§11–12 Circle method, Weyl exponent 2^{1−k}, Hardy–Littlewood asymptotic** (1391–1419): standard.
- **§13 Singular series Euler product, 2-adic obstruction** (1481–1492): correct.
- **§15 prose Bernoulli generating function** (1754–1762): t/(eᵗ−1)=Σ Bₙtⁿ/n!, B₁=−½, B_{2k+1}=0 (k≥1) correct.
- **§16 ζ(2n) Euler formula and ζ(−n)=−B_{n+1}/(n+1)** (1879, 1887): verified n=1..3.
- **§17–18 Euler–Maclaurin, ξ(s)=ξ(1−s), asymmetric form** (2004, 2170, 2176, 2180): standard.

## Wrong / dubious claims

- **CRITICAL — Akiyama–Tanigawa recurrence is mis-implemented in 5 widget scripts** (lines 1602, 1812, 1941, 2056, 2319). Inner update reads `rmul(rat(BigInt(i),1n), rsub(A[j],A[j+1]))` — uses row index `i`. Correct A–T multiplies by column index `(j+1)`. Executed: `B(n)` returns garbage from n=2: B(2)=2/3 (correct ⅙), B(3)=3/2 (0), B(4)=24/5 (−1/30). Downstream, verified by running JS:
  - **§14 Faulhaber widget** prints "✗ MISMATCH (bug!)" for every m≥2 (m=2,n=4: formula 32, direct 30).
  - **§15 Bernoulli table** shows wrong B_n; partial-sum vs t/(eᵗ−1) ≈2.83 vs true 0.58 at t=1, N=8.
  - **§16 ζ widget** outputs ζ(2)≈6.58, ζ(4)≈−155.8, ζ(6)≈4395 instead of 1.64, 1.08, 1.02; on-screen partial-sum truth check visibly contradicts.
  - **§17 EM H_n** and **§19 ζ-near-1** share the bug; B_{2k} corrections wrong from k≥2.
  - JS comments at 1594/1615 declare "convention B₁=−½" — doubly wrong: A–T (correctly implemented) yields B₁=+½, and the buggy code happens to also give B(1)=+½.
- **§9 G(3) shown as "4–7"** (1088, widget data 906): G(3)≥4 is the sharp known lower bound; "4, 5, 6, or 7" overstates uncertainty.

## Underspecified or unverifiable claims

- **§9 G(k) lower bounds for k=5,6,7,9,10** (1090–1095): standard p-adic bounds, unsourced.
- **§12 "minor-arc range M ≤ q ≤ M^{k−1}"** (1413): one reasonable cutoff; phrasing suggests uniqueness.
- **§14 prose** does not declare Bernoulli convention; the Faulhaber formula needs B₁=+½ but §15 uses B₁=−½. A reader carrying §15's sign into §14 derives the wrong n^m coefficient.

## Severity

**Major.** Prose math is essentially clean (one inter-section convention drift). All five Bernoulli-computing widgets share the recurrence bug and display visibly wrong values — Bernoulli table contradicts prose, MISMATCH flags in Faulhaber, ζ(2)≈6.58 in the Euler-formula widget. Fix: replace `BigInt(i)` with `BigInt(j+1)` in the inner `rmul` of each of the five `for(let i=1;i<=m;i++)` loops.
