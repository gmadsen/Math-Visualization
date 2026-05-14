# hamiltonians-classical-mechanics.md — math-correctness pass

## Verified claims

**§1 Phase space.** Tautological 1-form θ = Σ p_i dq^i and ω = -dθ = Σ dq^i ∧ dp_i are mutually consistent (dθ = Σ dp_i ∧ dq^i = -Σ dq^i ∧ dp_i, so -dθ matches). ω is closed and non-degenerate; the canonical Darboux form is correctly identified. Phase-space cell widget integrates the rotation (q,p)↦(c·q+s·p, -s·q+c·p) from H = (p²+q²)/2, exactly area-preserving.

**§2 Hamilton's equations.** Defining identity ι_{X_H}ω = dH and the local form q̇ = ∂H/∂p, ṗ = -∂H/∂q are correct. Energy conservation derivation Ḣ = ω(X_H, X_H) = 0 is correct. Liouville's theorem via Cartan magic formula L_{X_H}ω = d(ι_{X_H}ω) + ι_{X_H}dω = d(dH) + 0 = 0 is correct. Vector-field widget RK4-integrates each H choice and conserves H to integrator order.

**§3 Canonical / HJ.** Type-1 generating-function relations p_i = ∂S/∂q^i, P_i = -∂S/∂Q^i correct. Hamilton-Jacobi PDE ∂S/∂t + H(q, ∂S/∂q, t) = 0 correct. Lagrangian-submanifold characterization in (T*Q × T*Q, ω⊖ω) correct. Linear-symplectic-map widget correctly classifies rotation, shear, squeeze (det J = 1) as canonical and (λq, p) as not.

**§4 Poisson / Noether.** {f,g} = Σ ∂_q f ∂_p g - ∂_p f ∂_q g and ḟ = {f, H} are standard sign conventions. "f conserved iff {f,H}=0" correct. Symmetry table entries (translation→momentum, rotation→L_i = ε_{ijk} q^j p^k, time→H) correct.

**§5 Integrability.** Liouville-Arnold statement (compact regular common level set ≅ T^n; action-angle ω = Σ dI_i ∧ dθ_i, H = H(I), θ̇_i = ∂H/∂I_i) correct. KAM Diophantine condition |k·ω| ≥ γ/|k|^τ correct.

**§6 Kepler.** LRL vector A = p×L - mk q̂ correct (sign matches H = -k/r convention). Bound-state hidden symmetry SO(4) and super-integrability claims correct. Kepler widget: semi-latus rectum L²/(mk), eccentricity e = √(1 + 2EL²/(mk²)), period 2π√(a³/k) all correct for H = p²/2m - k/r with m=1.

**§6 Harmonic oscillator action-angle.** I = E/ω, θ = ωt + θ₀ correct. Bertrand's theorem ("only Kepler and HO have all bounded orbits closed") correct.

## Wrong / dubious claims

None of consequence. Two minor sign-convention drifts the reader might trip on:

- **§1 vs §5 sign of ω** (line 271 vs 826): §1 uses ω = Σ dq^i ∧ dp_i; §5 writes ω = Σ dI_i ∧ dθ_i in action-angle. With θ_i playing the role of "position," the §5 form is the negative of the §1 convention applied to (I, θ). Both are standard but the page does not flag the sign change.

## Underspecified or unverifiable claims

- **Lagrangian / Euler-Lagrange equations** (line 373 aside): page invokes "Lagrangian L(q,q̇)," "p_i = ∂L/∂q̇^i," and "Legendre transform TQ → T*Q" without writing E-L equations or H = p_i q̇^i - L. Acceptable given the page is Hamiltonian-first, but a reader cross-checking L = T - V → H finds no formula.
- **Jacobi identity** for {·,·} is implied by "Lie algebra" (line 666) but never stated or motivated.
- **Double pendulum** (named in user audit prompt) appears only as a non-integrable example label in §6 "What's left out" (line 1044); no equations of motion, so nothing to verify.
- **Boost generator K_i** (table line 680): "centre-of-mass motion" is informal. The conserved quantity under Galilean boost is K_i = Σ_a (m_a x_a^i - t p_a^i), i.e. CoM position at t=0. Loose but not wrong.
- **§1 line 272**: "matrix [[0,I],[-I,0]] in canonical coordinates" — this is the matrix of ω in the basis (∂/∂q, ∂/∂p) with the §1 sign; reader should check the convention. Internally consistent with ω = Σ dq^i ∧ dp_i.

## Severity

**Clean.** All explicit equations and worked-example formulas (Hamilton's equations, Cartan derivation of Liouville, generating-function relations, HJ, Poisson bracket, action-angle for HO, Kepler eccentricity/period/LRL, KAM Diophantine bound) are correct. The only friction points are an unflagged sign-convention shift between §1 and §5's action-angle form, and the absence of Lagrangian/Legendre formulas — both pedagogical, not mathematical, gaps.
