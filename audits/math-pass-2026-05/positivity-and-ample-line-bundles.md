# positivity-and-ample-line-bundles.html — math-correctness audit (2026-05)

## Verified claims

- **§1 Picard / sections of O(D)** (266–273): div(f) total degree 0; H^0(O(D)) = {f : div(f)+D ≥ 0}∪{0}; Pic(X) = Cartier/principal ≅ line bundles; standard.
- **§1 widget P^1 cohomology** (332–337, 391–392): h^0(O(d)) = d+1 for d ≥ 0, 0 for d < 0; basis x^i y^{d-i}; div(generic section) = d points; "very ample for every d ≥ 1" correct (rational normal curve).
- **§2 very-ample / ample / Serre** (404–425): closed-embedding definition, ample = some power very ample, Serre's vanishing+ample equivalence — all standard.
- **§2 Serre widget P^2 cohomology** (484–528): h^0(O(d)) = (d+1)(d+2)/2 for d ≥ 0; h^2(O(d)) = (-d-1)(-d-2)/2 for d ≤ -3; h^1(O(d)) ≡ 0 — correct. Hard-coded h^*(Ω^1(d)) values for d ∈ {-4..8} all check via Bott / Euler sequence (3·binom(k+1,2) − binom(k+2,2) for k ≥ 1; Hodge numbers (0,1,0) at k=0; Serre dual h^0(T(-3-d)) for d ≤ -2). Formula h^2(Ω^1(d)) = d²−1 for "generic large negative d" matches d=-5 (24), d=-6 (35).
- **§3 Nakai–Moishezon** (591–596): "L^{dim Y}·Y > 0 for every irreducible Y ⊆ X of positive dimension" — standard form (dim Y > 0 includes Y = X).
- **§3 numerical equivalence / Néron–Severi** (602–604): D₁ ≡ D₂ iff D·C agrees on every curve; finite rank ρ(X). Standard (mild conflation: N^1 = NS/torsion, but page's "Pic/≡" is the standard shorthand).
- **§3 ample-cone widget on P^1×P^1** (697–706): (aH₁+bH₂)² = 2ab; ample iff a>0,b>0; nef iff a≥0,b≥0 — correct (H_i² = 0, H₁·H₂ = 1).
- **§4 nef + big definitions, Kodaira lemma, cone chain** (737–748): L nef ⟺ L·C ≥ 0 ∀ curve; big growth h^0 ≥ c·m^{dim X}; L big ⟺ L ≡ A+E (A ample Q-div, E effective Q-div); Amp ⊆ Nef and Amp ⊆ Big.
- **§4 Kleiman + duality** (754–765): Nef = Amp closure, Amp = int Nef; Nef = (NE-bar)∨ — standard (Kleiman 1966, projective hypothesis).
- **§5 Kodaira embedding** (886–895): curvature positivity definition; "X projective ⟺ X has positive line bundle"; complex tori projective ⟺ Riemann form on Λ; abelian varieties for g ≥ 1, generic non-projective for g ≥ 2 — standard.
- **§6 Kodaira vanishing** (1015–1018): H^i(K_X⊗L) = 0 for i > 0, L ample, char 0. Raynaud counterexample in char p — correct.
- **§6 Kawamata–Viehweg** (1028–1031): K_X + ⌈L⌉ vanishing for L nef-and-big Q-divisor with SNC fractional part — standard form.
- **§6 vanishing widget** (1077–1131): h^0(O(k)) = binom(k+n,n), h^n(O(k)) = binom(-k-1,n) for k ≤ -n-1 (Serre dual); K + O(d) = O(d-n-1); ample = (d ≥ 1) — all correct.

## Wrong / dubious claims

- **§2 elliptic-curve "two sections cannot separate P, -P" prose** (positivity-and-ample-line-bundles.html:416). Argument is offered as why a degree-1 line bundle on E is ample-but-not-very-ample, then says "two sections cannot separate P, -P; you need three." A degree-1 bundle has h^0 = 1 (Riemann–Roch: 1 − g + d = 1), so there is exactly one section up to scalar — the "two sections" picture is the degree-2 (hyperelliptic 2:1) case. Conclusion is right (deg 1 not very ample); the supporting sentence describes the wrong degree.
- **§6 Kodaira "counterexample" prose** (1020). Says "without K_X, H^i(X, L) can be nonzero (e.g. H^1(P^1, O(-2)) = C since K_{P^1} = O(-2))." The cited L = O(-2) is **not ample** — and Kodaira (with or without the K_X twist) requires L ample, so this isn't a counterexample to "Kodaira without K_X". A correct illustration would be e.g. L = O on an elliptic curve, where L is nef but not ample, with H^1(O) = C. Same issue echoes in quizzes/positivity-and-ample-line-bundles.json:212 (pal-vanishing q1 explain) which cites L = O(-1) on P^1 — also not ample.
- **§4 Mori contraction prose** (positivity-and-ample-line-bundles.html:767). "Mori's contraction theorem then says the K_X-negative extremal rays of NE-bar(X) admit geometric contractions" — true for smooth (or klt) projective X, not for an arbitrary projective variety as the immediately-preceding sentences imply. Should say "for X smooth (or klt) projective".

## Underspecified or unverifiable claims

- **§3 N^1 vs NS conflation** (603–604). Page writes N^1(X) = Pic(X)/≡ and calls this "Néron–Severi". Standard usage, but technically NS(X) = Pic/≡_alg has torsion, and N^1 = NS ⊗ R (or NS/torsion). Doesn't break anything downstream.
- **§4 pseudo-effective "moving curve" prose** (868). Schematic gloss invokes Boucksom–Demailly–Paun–Peternell duality without naming it; readers can't verify.
- **§5 Kodaira map "n sufficiently large"** (892). No explicit bound; standard, but no pointer to Matsusaka's effective bound for those who care.
- **§6 KV "klt singularities downstream"** (1031). Mentioned in passing without definition; reader must take on faith.

## Severity

**Minor.** All theorem statements (Nakai, Kleiman, Serre, Kodaira embedding, Kodaira vanishing, Kawamata–Viehweg) are stated correctly. All widget computations (P^1, P^2, Ω^1 on P^2, P^1×P^1, P^n) verified by hand. Two prose slips: (i) the elliptic-curve "two sections / P,-P" justification mismatches the degree-1 case it's attached to, and (ii) two non-ample line bundles (O(-2), O(-1) on P^1) are presented as illustrating "Kodaira can fail without the K_X twist" when they don't satisfy Kodaira's hypothesis at all. One scope hedge missing on Mori's contraction (smooth/klt). No widget bugs.
