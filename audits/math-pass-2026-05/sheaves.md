# Math audit — `sheaves.html`

## Verified claims (sections)

- **§1 Why sheaves** — preview table is correct: holomorphic functions on ℂ glue (sheaf); holomorphic logs on ℂ× obstructed by H¹(ℂ×, ℤ) = ℤ; constant sheaf ℤ on S⁰ has Γ = ℤ², on S¹ has Γ = ℤ. All accurate.
- **§2 Presheaves** — definition (contravariant functor on Open(X)), restriction axioms, examples (continuous, holomorphic, bounded continuous as non-sheaf, constant presheaf, sections of a map, cohomological presheaves with stalkwise-zero sheafification on locally contractible spaces) — all correct.
- **§3 Sheaves** — locality + gluing, equalizer reformulation, Čech extension to higher overlaps, sheafiness on a basis, F(∅) = terminal, descent for sheaves, three example presheaf-failure modes — all correct.
- **§4 Examples** — Sh(X) complete/cocomplete (limits pointwise, colimits sheafified); enough injectives via ∏ i_{x*} I_x; constant presheaf vs. constant sheaf on S¹/S⁰; skyscraper sheaf and i_{x*} construction; pushforward as right adjoint to f⁻¹; (j_!, j⁻¹, j_*) adjoint triple for open j with stalks (j_!F)_x = F_x or 0. Correct.
- **§5 Stalks** — filtered-colimit definition, separation through stalks, sheaf↪∏ stalks injection, exactness preserved by stalks (filtered colimits in Ab are exact), worked stalk of O_{A¹} at origin = k[t]_{(t)} (DVR, residue field k), espace étalé equivalence with local homeomorphisms. Correct.
- **§6 Morphisms** — stalkwise criteria for mono/iso, stalkwise surjective ≠ globally surjective, exp sheaf sequence on complex manifold with kernel underline{2πiℤ}, LES of cohomology continuing to Pic(X), winding-number coboundary on ℂ×. Correct.
- **§7 Sheafification** — left adjoint to forgetful, explicit "compatible families of germs" construction, stalk-preserving, +-construction (F⁺⁺ = F^#) for sites, exactness, reflective subcategory, monad. Correct.
- **§8 O_X-modules** — ringed/locally ringed spaces, locally free ↔ vector bundle dictionary, Pic(X) ≅ H¹(X, O×), pullback f* = f⁻¹ ⊗_{f⁻¹O_Y} O_X right exact, f_* preserves QCoh for qcqs morphisms. Correct.
- **§9 QCoh on affine** — basis construction of M̃ on D(f), equivalence R-Mod ≃ QCoh(Spec R), worked Z/6 table (mostly), table on Spec ℤ, P^n graded-module twist O(d), Serre vanishing H^i(P^n, O(d)) = 0 for i ≠ 0, n. Correct.
- **§10 Coda** — dictionary table (rings ↔ schemes), six-functor outlook, étale + derived + D-module gestures. Correct.

## Wrong / dubious claims (with file:line)

- **`sheaves.html:1529`** — "The stalk at $\mathfrak{p} = (5)$ is $(\mathbb{Z}/6)_{(5)} = \mathbb{Z}/6$ since neither $2$ nor $3$ is in $(5)$." **Wrong.** Localizing Z/6 at the prime (5) inverts every integer outside (5), in particular 2 and 3. Since 2·3 = 0 in Z/6 and both become units, the localization is the zero module. The bullet contradicts both line 1532 ("supported on V(6) = {(2),(3)}") and the table at line 1575 (which gives M̃_{(0)} = 0 for M = Z/6, by the same argument). Suggested fix: "(Z/6)_{(5)} = 0 since 2 (or 3) becomes a unit while 2·3 = 0, killing the module. The support of M̃ is exactly V(6) = {(2),(3)}; at any other prime the stalk vanishes."

- **`sheaves.html:833`** — "$(i_{x*}A)_y = A$ if $y$ is in the closure $\overline{\{x\}}$ (with the Zariski or analytic topology this can include generizations)". **Terminology flipped.** y ∈ closure({x}) means y is a *specialization* of x (every open containing y contains x). Generizations of x go the other way. Suggested fix: replace "generizations" with "specializations".

## Underspecified or unverifiable claims

- **`sheaves.html:437`** — "If $U = \bigcup_n U_n$ for an increasing chain ... then in many contexts ... $F(U) = \varprojlim_n F(U_n)$." Hedge ("in many contexts") is overly cautious — the equalizer condition for the nested cover gives this directly with no extra hypotheses on the target category (the parallel pair collapses by U_n ∩ U_m = U_min(n,m)). Not wrong, just under-stated.
- **`sheaves.html:333`** — i⁻¹F described as "sheafification of $V \mapsto \mathrm{colim}_{V \subseteq W} F(W)$ over opens $W$ of $X$ meeting $Y$ in $V$." For inclusion the colimit is over W ⊇ i(V), the standard formula; the "meeting Y in V" qualifier is imprecise but not incorrect.
- **`sheaves.html:1199`** — "Stalks of $\mathcal{H}\!om$ are *not* in general $\Hom(F_x, G_x)$ — the point-wise formula fails for infinite-rank modules. For coherent sheaves on a Noetherian scheme it does hold." True but worth noting the standard hypothesis is finite presentation of F (so Hom commutes with localization at p); coherent on Noetherian implies this.

## Severity

**Minor.** One genuine math error (line 1529, contradicted by the page's own table two paragraphs later) and one terminology flip (line 833, "generizations" should be "specializations"). The remaining body of claims — including the nontrivial cohomology computations (H¹(ℂ×, ℤ), Serre vanishing on P^n, exp sheaf sequence and Pic via H¹), the QCoh equivalence, the sheafification universal property, the (j_!, j⁻¹, j_*) adjoint triple, and the worked Spec ℤ table — checks out cleanly. Both bugs are local one-line fixes.
