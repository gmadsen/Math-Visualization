# complex-multiplication.html — math correctness pass

## Verified claims

### CM elliptic curves over C (§1)
- `End(E) = {α ∈ C : αΛ ⊆ Λ}` for E = C/Λ — correct.
- CM ⟺ τ quadratic irrational in H — correct.
- CM-by-order-O ⊋ Z formulation — correct.
- j(τ) algebraic integer when E has CM — correct (classical Kronecker–Weber–Hasse; Schneider's 1937 contribution is the converse-flavored transcendence, see "dubious" below).
- j(i)=1728, j(ρ)=0, j((1+√−7)/2)=−3375, j(√−2)=8000 — all correct.

### Hilbert class polynomial (§2)
- Bijection {ideal classes of O_K} ↔ {iso classes of CM curves with End = O_K} via [a] ↦ C/a — correct.
- |Cl(O_K)| = h_K — correct.
- H_K(X) ∈ Z[X], degree h_K, minimal polynomial of j(E_a) over Q — correct.
- H = K(j(E)) is the Hilbert class field, Gal(H/K) ≅ Cl(O_K) — correct.
- Hand-tabulated H_K for D ∈ {−3,−4,−7,−8,−11,−15,−20,−23,−24,−31} all match standard tables (Cohen GTM 138 §5.10): e.g. H_{−15} = X² + 191025X − 121287375; H_{−23} = X³ + 3491750X² − 5151296875X + 12771880859375; H_{−24} = X² − 4834944X + 14670139392; H_{−31} = X³ + 39491307X² − 58682638134X + 1566028350940383. Class numbers match.

### Heegner numbers (§6)
- Gauss's class-number-1 list {−3,−4,−7,−8,−11,−19,−43,−67,−163} — correct.
- Heegner 1952 + Stark/Birch repair — correct attribution.
- j-values for the six d ∈ {−7,−11,−19,−43,−67,−163} all match standard tables: −3375, −32768, −884736, −884736000, −147197952000, −262537412640768000 = −640320³.
- e^(π√163) = 262 537 412 640 768 743.99999999999925… — verified to 50 digits; page's `744 − j` = 262537412640768744 and remainder ≈ −7.5×10⁻¹³ are correct.
- e^(π√67), e^(π√43), e^(π√19) remainders (−1.339113e−6, −2.225507e−4, −2.197901e−1) all match high-precision values within stated digits.
- q = e^(2πi(1+i√d)/2) = −e^(−π√d) derivation — correct.

### Main theorem of CM (§4)
- K(f) = K(j(E), h(E[f])), Weber function = normalized x-coordinate — correct.
- Galois action σ_a · j(C/b) = j(C/a⁻¹b), σ_a · P = a⁻¹·P — correct (matches Silverman, Advanced Topics, Ch. II Thm 8.2 / Ch. II §5).
- "j-values give unramified abelian (HCF); torsion gives ramified abelian; together exhaust K^ab" — correct.

### CM abelian varieties (§5)
- CM field = totally imaginary quadratic over totally real, [L:Q] = 2g — correct.
- CM type Φ ⊔ Φ̄ = Hom(L,C) — correct.
- Reflex field, Shimura–Taniyama Frobenius formula via reflex norm — correct in shape.
- Jacobian of y²=x⁵−1: genus 2, CM by Z[ζ_5] — correct.
- Jacobian of y²=x⁷−1: genus 3, CM by Z[ζ_7] — correct (genus = (7−1)/2 = 3 ✓).
- Q(√−2,√−7) biquadratic with totally real subfield Q(√14) — correct.

### Gross–Zagier (§3, §6)
- L′(E/K,1) = (8π²(φ,φ)/√|d_K|) · ĥ(y_K) — matches the standard normalization.
- Gross–Zagier (1986) + Kolyvagin (1989) ⇒ BSD when ord_{s=1} L(E/K,s) ≤ 1 — correct attribution & statement.
- Heegner hypothesis: every p | N splits in K — correct (the strictest "classical" form).

## Wrong / dubious claims

### Bug: Heegner-number widget remainders for D=−7 and D=−11 are garbage (lines 932–939)
File: `complex-multiplication.html:934–935`
```
'-7':   2.883494940237e+2,    // not near-integer
'-11':  6.27443666e+4,        // not near-integer
```
The widget then displays `e^(π√d) ≈ integerEst + remainder`. With these values the widget shows
`e^(π√7) ≈ 4407.35` and `e^(π√11) ≈ 96256` — actual values are 4071.93 and 33506.14. Both display lines are off by hundreds-to-tens-of-thousands. Correct remainders (so that integerEst + remainder = e^(π√d)):
`-7: −47.068` and `-11: −5.857`. The accompanying labels "not near-integer" are fine; only the magnitudes printed are wrong.

### Heegner-point count formula is malformed (line 636)
File: `complex-multiplication.html:636`
```
Number of Heegner points (mod Γ_0(N)) = h_K · 2^{ω(N)} / |Pic(O_K)/N|
```
The denominator `|Pic(O_K)/N|` is not standard notation and not a meaningful quantity in this count. The textbook formula for the number of Heegner points of discriminant d_K on X_0(N) (under the Heegner hypothesis) is `h_K · 2^{ω(N)}` (one factor of 2 per prime p | N from the choice of prime above p in O_K), with no denominator. Page's prose two paragraphs later contradicts the widget: "For N prime and split in K, the count is exactly h_K" — but with N prime split, 2^{ω(N)} = 2 gives 2·h_K, paired by Atkin–Lehner into h_K orbits if one quotients by w_N. The widget formula and the prose disagree, and the widget formula's denominator is spurious.

### Schneider 1937 attribution (line 269)
File: `complex-multiplication.html:269`
> "Theorem (Schneider 1937, classical CM theory): if E/C has CM, then j(E) ∈ Q̄ is an algebraic integer."
Schneider 1937 proved the *transcendence* statement (j(τ) is transcendental for algebraic non-CM τ); the algebraicity-and-integrality of j at CM points is the much earlier Kronecker–Weber line, refined by Hasse/Deuring. Misattribution, not a math error.

## Underspecified or unverifiable claims

- §5 widget: "Q(ζ_7): 3 types up to conjugation" — the count of CM types of Q(ζ_7) up to equivalence depends on which equivalence is taken (Galois of L, of L*, or just complex conjugation). Without a stated convention this is hard to pin down; "3" is one defensible answer. Mark as underspecified.
- §3 widget: `Pic(O_K)/N` undefined (see "Wrong" above). Even charitably, no standard reading of that quotient gives the right count.
- §3: "ω(N)" used in the widget formula without definition; standard meaning (number of distinct prime divisors) is presumably intended.
- §4 widget: the line `[𝔮²] = (1)` for K=Q(√−15) is correct (h=2 ⇒ 𝔮 has order 2 in Cl), but the trailing line `${data.nonprincipal}` is appended unconditionally — for a *principal* prime it still claims `[𝔮] generates Cl`, which can read as misleading.

## Severity

**Moderate.** Two real issues: (a) the Heegner-number widget's hardcoded remainders for D=−7 and D=−11 produce visibly wrong `e^(π√d)` displays — direct math drift visible to the reader; (b) the Heegner-points-count formula in §3 has a spurious denominator and contradicts the page's own prose. The textual mathematics (j-values, HCP coefficients, e^(π√163), Gross–Zagier formula, main theorem of CM, CM-type classification) is otherwise accurate to standard references.
