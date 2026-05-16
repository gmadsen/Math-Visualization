# arithmetic-statistics.html — math-correctness audit (2026-05)

## Verified claims

### §1 Counting number fields
- N₂(X) ~ (6/π²)X (line 242): correct when counting both real and imaginary quadratic fields together.
- Davenport–Heilbronn N₃(X) ~ X/(3ζ(3)) (line 244): standard, correct.
- Bhargava parametrizations (lines 253–254): quartic ↔ GL₂(Z)×SL₃(Z) on pairs of integer ternary quadratic forms; quintic ↔ GL₄(Z)×SL₅(Z) on quadruples of 5×5 skew-symmetric integer matrices. Standard, correct.
- Malle conjecture form X^(1/a(G))(log X)^(b(G)−1) (line 257): correct.

### §2 Cohen–Lenstra
- CL measure Pr(A) ∝ 1/|Aut(A)| · η∞ (line 379): correct.
- P(p ∤ h(K)) for imaginary quadratic = η∞(p) = ∏(1−p^(−k)); ≈ 0.5601 at p=3 (line 384): correct.
- Rank marginal Pr(rank=k) = p^(−k²)·η∞·∏_{i=1..k}(1−p^(−i))^(−2) (line 507, widget): correct (Cohen–Lenstra–Heine identity).
- P(p-rank ≤ 1) ≈ 0.980 at p=3 (line 386): recomputed 0.5601 + 0.4201 = 0.9802. Correct.
- EVW (2016) function-field CL theorem via Hurwitz cohomology (lines 393, 787): correct.

### §3 Selmer averages
- Bhargava–Shankar Sel_ℓ averages 3, 4, 7, 6 for ℓ = 2, 3, 4, 5 (table line 539–542): correct.
- Bhargava–Shankar–Skinner–Zhang ≥ 20.62% rank 0, ≥ 83.75% rank ≤ 1 (line 550): matches the BSZ "majority of E satisfy BSD" paper. Correct.

### §4–§5 average rank, function fields
- Goldfeld 50/50/density-zero, average analytic rank 1/2 (line 667): correct statement of conjecture.
- Bhargava–Skinner–Zhang ≥ 66.48% have analytic rank ≤ 1 + BSD (line 673): matches the published headline.
- Katz–Sarnak USp limit for hyperelliptic L-zero angles, density (2/π)sin²θ (lines 783, 803): correct.

### §6 L-symmetry
- Soundararajan ≥ 87.5% non-vanishing for L(½, χ_d) (line 933): correct (Soundararajan 2000, the 7/8 result).
- Widget kernels W(x) — U=1, USp=1−sinc(2πx), O+=1+sinc(2πx), O−=1−sinc(2πx)+δ₀ (lines 970–973): correct Katz–Sarnak 1-level densities.

## Wrong / dubious claims

- **arithmetic-statistics.html:391 — real-quadratic CL value is wrong.** Text claims ∏_{k≥2}(1−3^(−k)) ≈ 0.7544. Correct value is ≈ 0.8402 (computed: 0.8889·0.9630·0.9877·0.99588·… → 0.8402). The formula ∏_{k≥2} is right; only the numerical value is wrong.
- **arithmetic-statistics.html:924 — U-family 1-level density entry is wrong.** Table lists "1 − sin(πx)/(πx)" for unitary U; the correct U 1-level density is the constant 1 (which the widget itself uses correctly at line 970). The expression shown is neither the 1-level density nor the standard pair-correlation kernel R₂(x) = 1 − (sin(πx)/(πx))².
- **arithmetic-statistics.html:925 — USp family density entry is wrong.** Table lists "1 + sin(2πx)/(2πx) − cos(2πx)" for symplectic USp; the standard Katz–Sarnak USp 1-level density is W(x) = 1 − sin(2πx)/(2πx). The widget code (line 971) uses the correct kernel; the table contradicts it.
- **arithmetic-statistics.html:550 — minor numeric slip.** "If 5-Selmer rank were always ≥ 2 the average would be ≥ 1 + 5² = 26." Should be ≥ 5² = 25 (|Sel₅|=5^rank, so rank≥2 gives size ≥ 25). The conclusion is unaffected.
- **arithmetic-statistics.html:950 — widget caption mis-describes USp.** "USp rises ('attraction' to ½)" — USp in fact *repels* at the central point (W(0) = 0). It is O+ that has an *extra* eigenvalue near zero. The widget kernels are correct; only the caption is reversed.
- **arithmetic-statistics.html:1069 — "average rank … only proved ≤ 1.17 unconditionally"** is dubious. Bhargava–Shankar's unconditional bound on average analytic rank from 5-Selmer is ≈ 0.885; Brumer's pre-BS bound was 2.3. The 1.17 figure does not correspond to a standard headline result and looks like a confused reference.

## Underspecified or unverifiable claims

- §1 widget caption (line 267) describes the empirical curve as "tabulated counts of cubic fields … (LMFDB-style data, smoothed)". The renderer uses the closed form C_DH·X·(1 + 1.6/log X) — that is a hand-tuned model, not real LMFDB data. Caption is misleading about provenance.
- §4 widget claims small-height tables show avg rank ~0.85 descending toward ½ (line 691). The qualitative direction is right (Cremona-table average exceeds ½) but the specific 0.85 starting value and the 0.6/√log H functional form are illustrative only — neither is a published asymptotic.
- §3 widget "Bhargava–Shankar / Poonen–Rains limit law for 2-Selmer rank" tabulated probabilities (line 575): these are the standard Heath-Brown / Poonen–Rains limit moments, but the seven-term truncation gives empirical mean 2.9996 rather than exactly 3 — the script renormalises, so this is fine, but worth flagging that the widget shows a finite-truncation approximation.
- §4 reference to "Bhargava–Skinner–Zhang (2014)" (line 673) elides Bhargava–Shankar's separate role in supplying the Selmer averages; the joint BSZ paper plus the Skinner–Urban converse are the right citations as written.

## Severity

**Moderate.** Two specific numerical/formula errors (real-quadratic CL value 0.7544; the U and USp entries in the L-symmetry table) are mathematical mistakes a reader would propagate. One arithmetic slip (1+5²=26 vs 25) and one reversed widget caption (USp "attracts") are cosmetic but visible. The "≤1.17" unconditional average-rank claim in Connections is suspect and should be checked against a primary source. Widget code is largely correct; the Cohen–Lenstra rank formula, Selmer averages, and Katz–Sarnak kernels are implemented faithfully.
