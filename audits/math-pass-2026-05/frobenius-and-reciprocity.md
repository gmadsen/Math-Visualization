# frobenius-and-reciprocity.md — math-correctness audit

## Verified claims

### §1 Setup
- `Q(ζ_8)/Q` Galois group `(Z/8)^× ≅ Z/2 × Z/2` — correct (line 490).
- `x³−x−1` has Galois group `S_3` and discriminant `−23`; splitting field contains `Q(√−23)` — correct.

### §2 Factoring mod p
- Cycle-shape definition + ramification at primes dividing disc(f) — correct.
- `x²+1`: shape `(1,1)` for `p≡1 (mod 4)`, `(2)` for `p≡3 (mod 4)` — correct (supplementary law for −1).

### §3 Splitting types
- For Galois `K/Q`: `efg = n`, all primes above `p` share residue degree `f` — correct.
- Three qualitative cases (split / inert / partially split / ramified) and Frobenius orders — correct.

### §4 Frobenius element
- `Frob_P(x) ≡ x^p (mod P)` definition — correct.
- Conjugation by `g∈G` carries `Frob_P` to `Frob_{gP}`; well-defined conjugacy class `Frob_p ⊂ G` — correct.
- Cycle shape of `Frob_p` on roots = factorisation pattern of `f̄ mod p` — correct (standard Dedekind).

### §5 Decomposition / inertia
- `|D(P)| = |G|/r = ef` from orbit–stabiliser — correct.
- SES `1 → I → D → Gal(F_{p^f}/F_p) → 1`; at unramified primes `D` cyclic of order `f` — correct.

### §6 Chebotarev
- `π_C(N)/π(N) → |C|/|G|` — correct statement of Chebotarev.
- `S_3` predicted densities `1/6, 1/2, 1/3` — correct.

### §7 Weak reciprocity
- Cyclotomic case: `Gal(Q(ζ_N)/Q) ≅ (Z/N)^×`, `Frob_p = p mod N`, cycle structure governed by `ord_N(p)` — correct.
- Quadratic case: `Frob_p` for `Q(√a)` matches Legendre symbol `(a/p)`, depends on `p mod 4|a|` — correct.
- Cyclotomic widget: `Φ_N mod p` factors into `φ(N)/ord` irreducibles each of degree `ord` — verified (`Φ_12 mod 11` has 0 linear factors, matches 2×deg-2).

### §8 Strong reciprocity
- Kronecker–Weber argument that abelian extensions ↔ cyclotomic, hence non-abelian extensions undetectable by congruences — correct.
- `Q(√−23)` has class number 3; principal form `x²+xy+6y²` has discriminant `1−24=−23` — correct.
- `η(z)η(23z)` is the canonical weight-1 cusp form of level 23 with character `(·/23)`. Independently computed q-expansion: `q − q² − q³ + q⁶ + q⁸ − q¹³ − q¹⁶ + q²³ − q²⁴ + q²⁵ + q²⁶ + q²⁷ − q²⁹ + …` — matches page exactly.
- `a_p` dictionary `{2 if Frob_p=1; 0 if transposition; −1 if 3-cycle}` — independently verified for primes ≤ 79 (first split prime is `p=59` → `a_59 = 2`; all `(3)`-type primes give `−1`; all `(2,1)` give `0`).
- "Strong reciprocity" slogan `tr ρ(Frob_p) = a_p(π_ρ)` — standard Langlands-conjecture form, correct.

## Wrong / dubious claims

None at the level of factual mathematical assertion.

## Underspecified or unverifiable claims

- §6 widget (line 840): labels Galois group of `x⁴+1` as `V₄` and lumps the three non-identity elements into one "type (2,2)" bucket of "size 3". Strictly, `V_4` is abelian so each of those elements is its own conjugacy class; the widget is computing cycle-shape density (3/4 total) rather than a per-class Chebotarev density. The displayed empirical-vs-predicted comparison is still correct, but a strict reading of "conjugacy class" + "size 3" misframes the group structure. Minor cosmetic.
- §4 widget (line 611) inserts a "Multiplication mod 5: Frobenius cycle shape" clock with no surrounding prose explicitly tying `a=2` to a specific reciprocity scenario. The connection (order of 2 mod 5 = 4 = Frob order in `Gal(Q(ζ_5)/Q)`) is correct but the widget context is thin.
- §5 (line 782): description "every `σ∈D(P)` descends to an automorphism of the residue field" elides the standard verification that `σ` preserves `O_K` (it does, as a ring automorphism of `K` fixing `Q`). Implicit but standard.

## Severity

**clean** — All substantive mathematical claims verified, including the non-trivial computation tying `η(z)η(23z)` Fourier coefficients to splitting behaviour of `x³−x−1` (verified against direct factorisation for primes ≤ 79). The two underspecified items are presentational, not errors.
