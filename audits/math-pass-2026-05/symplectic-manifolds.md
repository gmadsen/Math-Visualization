# Math pass — `symplectic-manifolds.html`

## Verified claims (sections)

- **§1 Symplectic form** (L267–270): Closed + nondegenerate definition correct; nondegeneracy of an alternating form forcing even dimension via det of antisymmetric matrix correct; ω^n nowhere-vanishing → orientability correct.
- **§1 Examples** (L274–278): Liouville form λ = Σ p_i dq_i on T*N is standard; S^2 area form Lagrangian/symplectic; ℂP^n Fubini–Study Kähler; S^4 admits no symplectic form (H²(S^4)=0 ⇒ closed 2-form exact ⇒ ω² exact ⇒ ∫ω²=0) — argument correct.
- **§2 Darboux's theorem** (L319–321): Statement correct. Moser-trick proof sketch (L323) correct: linear normalisation at p, ω_t = (1−t)ω_0+tω, solve ι_{X_t}ω_t = −α with ω−ω_0 = dα — sign and identity check out.
- **§3 Energy conservation** (L362): Ḣ = ω(X_H,X_H) = 0 by antisymmetry — correct.
- **§3 Symplectic flow** (L363): Cartan formula derivation L_{X_H}ω = d(dH) + ι_{X_H}(dω) = 0 — correct.
- **§3 Harmonic oscillator widget** (L376, L719): For H=(p²+q²)/2 under the page's stated Hamilton's eqs, X_H = p∂_q − q∂_p; flow p(t)=p₀cos t − q₀ sin t, q(t)=p₀ sin t + q₀ cos t — internally consistent and correct given the page's convention.
- **§4 Bracket structural identities** (L411–415): Antisymmetry, Leibniz, Jacobi — correct, with the standard remark that Jacobi requires dω=0.
- **§4 Quantisation** (L418): Dirac's {f,g} ↦ [f̂,ĝ]/(iℏ) correspondence — correct.
- **§5 Lagrangian definition** (L441): dim L = n in M^{2n} with ω|_L = 0 — correct; isotropic-bound argument (L443) correct.
- **§5 Cotangent bundle Lagrangians** (L445): Graph of α Lagrangian iff α closed — correct (pullback of −dλ to graph(α) equals −dα).
- **§5 Graph of symplectomorphism** (L446): With ω₁⊖ω₂, graph_f Lagrangian iff f symplectomorphism — correct.
- **§6 Arnold conjecture statement** (L488): Non-degenerate Hamiltonian on closed (M,ω), #1-periodic orbits ≥ Σ b_k(M) — correct (Floer / Liu–Tian / Fukaya–Ono).
- **§6 Floer setup** (L493–500): Action functional critical points = 1-periodic orbits; gradient eqn ∂_s u + J(∂_t u − X_{H_t}) = 0; ∂² = 0; HF_* ≅ H_*(M); Lagrangian variant, Fukaya morphism space — all correct.
- **§7 Coadjoint orbits** (L543): KKS symplectic structure on coadjoint orbits — correct.

## Wrong / dubious claims (with file:line)

- **Sign-convention triple inconsistency** — symplectic-manifolds.html:274, 275, 356, 359.
  - L274 declares ω₀ = Σ dp_i ∧ dq_i.
  - L275 declares cotangent ω = −dλ with λ = Σ p_i dq_i. But −d(p_i dq_i) = −dp_i ∧ dq_i = +dq_i ∧ dp_i, i.e. **opposite sign** to L274.
  - With L274's ω = Σ dp∧dq and L356's ι_{X_H}ω = dH, computation gives X_H = (∂H/∂q) ∂_p − (∂H/∂p) ∂_q, hence q̇ = −∂H/∂p, ṗ = ∂H/∂q — the **negative** of the L359 statement q̇ = ∂H/∂p, ṗ = −∂H/∂q. Either ω₀ should be Σ dq∧dp, or ι_{X_H}ω = −dH, to make L274/L356/L359 mutually consistent.
- **Poisson identity sign** — symplectic-manifolds.html:407. {f,g} = ω(X_f,X_g) = X_f(g) does not hold under the page's own ι_{X_H}ω = dH convention: ω(X_f, X_g) = (ι_{X_f}ω)(X_g) = df(X_g) = X_g(f), i.e. equals X_g(f), not X_f(g). One sign of "{f,g} = ±ω(X_f,X_g)" with the matching sign of "= ±X_f(g)" must be chosen consistently.
- **Darboux Poisson formula sign** — symplectic-manifolds.html:409. Written as Σ(∂f/∂p ∂g/∂q − ∂f/∂q ∂g/∂p), opposite sign to the Arnold/Goldstein convention Σ(∂f/∂q ∂g/∂p − ∂f/∂p ∂g/∂q). Defensible only if the upstream conventions are fixed coherently; currently free-floating.
- **Floer widget contradicts itself / mis-states Arnold–Givental** — symplectic-manifolds.html:510–511, 884–895. Prose: "intersections … at least |H_*(S^1)| = 2 — the rank of the Floer chain complex … No matter how you wiggle L₁ by a Hamiltonian, you can't cancel both intersection points." Widget readout (L895) reports `|L₀ ∩ L₁| = 1`. The two are inconsistent: with L₀ = horizontal circle and L₁ = vertical circle on T², the algebraic intersection is 1 (one point), and the Arnold–Givental rank-of-H_*(L) lower bound applies to L₁ Hamiltonian-isotopic to L₀ (same homology class), which the vertical circle is not. The example as drawn has 1 intersection, not 2, and the "≥ 2" claim is the wrong theorem for this setup.
- **"Liouville's theorem" labelling** — symplectic-manifolds.html:363. Calling preservation of ω itself "Liouville's theorem" is loose; classically Liouville's theorem states preservation of the volume form ω^n. Implication is one-way trivial, but the names refer to different statements.

## Underspecified or unverifiable claims

- **Moment maps / symplectic reduction** — not developed on the page; backlinks (GIT § Kempf–Ness) reference symplectic reduction, but the page itself never defines a moment map µ : M → 𝔤* or the Marsden–Weinstein quotient µ⁻¹(0)/G. Coverage gap relative to the audit checklist.
- **Coisotropic submanifolds** — not mentioned. Only Lagrangian (and "isotropic" in passing, L443). The standard quartet isotropic / coisotropic / Lagrangian / symplectic is incomplete.
- **Almost-complex / Kähler structures** — only mentioned in passing (L277 ℂPⁿ, L494 "compatible J", L542 "almost-complex structures"). No definition of compatibility (ω(·,J·) symmetric positive-definite) or the J-tameness used in §6.
- **§2 Moser proof "any non-degenerate alternating form on ℝ^{2n} is ω₀ in suitable coordinates"** — true (linear-algebraic Darboux), but stated without citation; reader must take on faith.
- **§6 multivaluedness "mild and controlled"** (L493) — the bubbling/sphere-class indeterminacy of the action functional is a real subtlety (monotone / weakly exact / virtual fundamental class hypotheses); the hand-wave is fine for a preview but is unverifiable as written.

## Severity

**Moderate.** No catastrophic theorem misstatements; the Arnold conjecture, Darboux, Floer setup, KKS, Lagrangian theory are all correctly stated. But there is a coherent **sign-convention bug spanning §1–§4** (L274 vs L275 vs L356/L359 vs L407 vs L409) that any careful reader will trip over — five different equations need to be sign-aligned to a single convention. Additionally the §6 Floer widget (L510–511, L884–895) is internally contradictory and invokes the wrong lower bound for the configuration drawn. Both are content fixes (not pedagogy), and both should be repaired before this page is cited from downstream Floer / mirror-symmetry topics.
