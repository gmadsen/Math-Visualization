# Math-correctness audit — `heegaard-floer.html`

## Verified claims (sections)

- **§1 Heegaard splittings**: Moise/Heegaard existence theorem, Heegaard genus of S^3 (=0), T^3 (=3), lens spaces (=1), and the Reidemeister–Singer move set (stabilization + handleslides + isotopy) are all stated correctly.
- **§1 Diagram conventions**: α-system bounds disks in U_g, β-system in U_g'; either system determines its handlebody up to diffeomorphism — standard and correct.
- **§2 Lagrangian Floer**: definition of CF(L_0,L_1) over F_2, index-1 disk count, Hamiltonian invariance, and Arnold-conjecture corollary all correct (modulo the deliberate hand-wave on technical hypotheses, flagged in-text).
- **§3 Sym^g(Σ_g)**: dimension 2g, complex-analytic structure via divisors, T_α and T_β as g-dimensional Lagrangian tori, generators as g-tuples (one per matched pair under permutation σ), Spin^c decomposition — all correct.
- **§3 Long exact sequence** (line 386): the sequence …→HF^−→HF^−→ĤF→… induced by the SES 0→CF^− →^U CF^− → ĈF → 0 is correct.
- **§5 d-invariant**: rational-valued grading of bottom of T^+ tower; Ozsváth–Szabó cobordism inequality d(Y,𝔰) ≥ (c_1(𝔱)^2 + b_2(W))/4 for negative-definite W — correct (note: this is the inequality, not equality).
- **§5 Lens-space recursion**: d(L(p,q),i) = ((2i+1−p−q)^2 − pq)/(4pq) − d(L(q,r),j) matches the standard Ozsváth–Szabó recursion; base d(S^3)=0 correct.
- **§5 L(p,1) closed form**: d(L(p,1),i) = (2i−p)^2/(4p) − 1/4 follows from the recursion with q=1 and is correct.
- **§4 Knot Floer properties**: categorifies Δ_K via signed Euler char; detects fiberedness (Ghiggini for genus 1, Ni in general); detects Seifert genus (max non-vanishing Alexander grading); detects unknot — all correct attributions.
- **§4 Trefoil ĤFK lattice** (line 753): generators at (M,A) = (−2,−1),(−1,0),(0,1) match the standard right-trefoil computation; Δ = t − 1 + t^{−1} matches the Euler characteristic.
- **§4 5_1 = T(2,5) ĤFK lattice** (line 755): generators (−4,−2),(−3,−1),(−2,0),(−1,1),(0,2) and Δ = t^2 − t + 1 − t^{−1} + t^{−2} are correct.
- **§7 τ for torus knots**: τ(T(p,q)) = (p−1)(q−1)/2 = g_4 (Milnor / Kronheimer–Mrowka via Floer) — correct.
- **§7 τ for alternating knots**: τ(K) = −σ(K)/2 — correct (Ozsváth–Szabó).
- **§7 τ slice-genus bound**: |τ(K)| ≤ g_4(K), τ a concordance homomorphism — correct.
- **§7 Knot table numerics**: trefoil (σ=−2, τ=1), 5_1=T(2,5) (σ=−4, τ=2), 5_2 (σ=−2, τ=1), 7_1=T(2,7) (σ=−6, τ=3) all check out; figure-8 (σ=0, τ=0, g_4=1) correctly flagged as a case where τ misses g_4.

## Wrong / dubious claims (with file:line)

- **`heegaard-floer.html:701`** — "HF^+ is the quotient HF^∞ / U·HF^−". The standard definition is HF^+ = HF^∞ / HF^− (cokernel of the inclusion HF^− → HF^∞). The factor U is spurious; HF^− already sits inside HF^∞ as a sub-F_2[U]-module without an extra U. **Severity: minor (definition off by a factor of U).**
- **`heegaard-floer.html:754`** — Figure-8 ĤFK lattice has only 3 generators (one per bigrading (−1,−1),(0,0),(1,1)). This is wrong: |Δ_{4_1}(−1)| = 5, and 4_1 is alternating so dim ĤFK = det = 5. The center bigrading (0,0) should carry rank 3 (or the correct decomposition has a generator at (0,0) of rank 3, or 5 generators across the three bigradings with the standard distribution 1+3+1). The widget undercounts. **Severity: moderate — visible numerical error in interactive widget.**
- **`heegaard-floer.html:700`** ("HF^∞ depends only on H_1(Y)") — for general Y this is the **Ozsváth–Szabó conjecture**, established for ℚ-homology spheres (where it's vacuous since b_1=0) but open for arbitrary Y. Asserting it as fact is incorrect. **Severity: minor — the page elsewhere correctly restricts to ℚ-HS, but the widget tooltip overstates.**
- **`heegaard-floer.html:380`** — calls 𝔽_2[U,U^{−1}]/U·𝔽_2[U] a "coefficient ring" for HF^+. This object is a module, not a ring (no unit; not closed under multiplication of its U^{−k} elements). The correct framing is that HF^+ is an 𝔽_2[U]-module with underlying group structure 𝔽_2[U,U^{−1}]/U·𝔽_2[U]. **Severity: minor terminology slip.**
- **`heegaard-floer.html:381`** — "HF^∞ for ℚ-HS is always 𝔽_2[U,U^{−1}]^{2^{b_1}}". Internally inconsistent: ℚ-HS forces b_1=0, so 2^{b_1}=1; the formula is correct only after collapsing the exponent. The 2^{b_1} formula is the *general* statement (conjectural for non-ℚ-HS, see above), not the ℚ-HS specialization. **Severity: minor wording.**

## Underspecified or unverifiable claims

- **`heegaard-floer.html:573`** ("|α∩β| ≥ 2^3 in a standard diagram for T^3") — dim ĤF(T^3) = 4 (concentrated in the torsion Spin^c structure, with summands at four Spin^c structures of total rank ≤ 8 depending on convention), so the lower bound of 8 from rank alone is not justified. May still be true diagram-by-diagram but the stated bound is loose.
- **`heegaard-floer.html:521`** — τ defined via "Alexander grading-τ(K) part of the U=0 quotient of HF^−". The signed convention τ = −max{A : ξ ∈ ĤFK(K,A) survives spectral sequence to ĤF(S^3)} is correct in result for the right trefoil (τ=1), but the prose conflates HFK^− subcomplexes, ĤFK quotients, and the U=0 spectral sequence. The formula's sign convention is non-uniform across the literature; reader needs to trust the numeric examples for grounding.
- **§6 Surgery triangle** (line 486): the triple (Y, Y_n(K), Y_{n+1}(K)) is identified with three Dehn-fillings at slopes pairwise distance 1; this is correct only if Y itself is read as the ∞-slope filling of the knot exterior. The widget step 2 makes this explicit, but the §6 prose blurs Y vs Y_∞.
- **Bordered HF** (line 551): mentioned in passing only; no concrete claim to verify.

## Severity

**Moderate.** One interactive widget (figure-8 ĤFK) undercounts a standard published rank — a learner copying the lattice will compute the wrong Alexander polynomial coefficient at A=0. The HF^+ definition slip (line 701) and the HF^∞-depends-only-on-H_1 overstatement (line 700) live inside widget tooltips where casual readers absorb them as fact. The L(p,q) recursion, L(p,1) closed form, τ for torus knots, τ for alternating knots, and all of the §7 knot-table numerics are correct. Recommend: fix the figure-8 widget data, soften the HF^+ definition and the H_1-only claim, and tighten the "coefficient ring" wording for HF^+.
