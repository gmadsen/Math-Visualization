# general-relativity.html — math-pass 2026-05

## Verified claims (sections)

**1. Spacetime as a Lorentzian manifold** — Signature (−,+,+,+), Minkowski line element, timelike/null/spacelike classification by sign of g(v,v), light cone as Lorentz-invariant structure. All standard and correct.

**2. Einstein field equations** — Boxed equation `R_μν − ½ g_μν R + Λ g_μν = 8πG T_μν` is correct in **geometrized units** (c = 1); the c⁴ that the user expected is absorbed by convention (file does not state this explicitly, see below). Bianchi identity `∇^μ G_μν = 0` and induced conservation `∇^μ T_μν = 0` are correct. Trace identity at line 438 (`−R + 4Λ = 8πG T`) checks: tracing with g^μν gives R − 2R + 4Λ = 8πG T → −R + 4Λ = 8πG T. ✓

**3. Schwarzschild** — Line element (line 465) correct in G = c = 1 units. Birkhoff's theorem (uniqueness of static spherically symmetric vacuum) correct. Kretschmann scalar `R_μνρσ R^μνρσ = 48 M²/r⁶` (line 467) is the standard result in geometrized units. Coordinate vs. curvature singularity distinction correct.

**4. Kerr** — Outer horizon `r_+ = M + √(M²−a²)` and stationary-limit surface `r_SL(θ) = M + √(M²−a²cos²θ)` (lines 567–568) are the standard Boyer–Lindquist values. Ergosphere description (∂_t spacelike, frame dragging, Penrose process extracting rotational energy via negative Killing energy) is correct. Extremal limit a/M = 1 collapses r_± to M; widget readout matches. ✓

**5. FLRW** — Metric (line 648) correct. Friedmann equations (line 652) match standard form: `(ȧ/a)² = 8πG ρ/3 − k/a² + Λ/3` and `ä/a = −4πG(ρ + 3p)/3 + Λ/3`. Equation-of-state scalings a ∝ t^{2/3} (matter), a ∝ t^{1/2} (radiation), a ∝ e^{Ht} (Λ) all correct. Concordance values Ω_Λ ≈ 0.7, Ω_m ≈ 0.3 correct.

**6. Gravitational waves** — Trace-reversed perturbation `h̄_μν = h_μν − ½ η_μν h` and Lorenz-gauge wave equation `□ h̄_μν = −16πG T_μν` (line 741) correct. Two TT polarizations h_+, h_× correct. GW150914 figures (line 819: ~0.2 s chirp, h ~ 10⁻²¹, ~30 M_⊙ each, ~1.3 Gly) match the published parameters (M₁ ≈ 36, M₂ ≈ 29 M_⊙; luminosity distance ~410 Mpc ≈ 1.34 Gly).

## Wrong / dubious claims (with file:line)

- **general-relativity.html:438 — "leaving 6 propagating degrees of freedom — the seed of gravitational waves."** The DOF accounting is wrong. Linearized GR has **2** physical/propagating polarizations, not 6. The naive subtraction 10 − 4 (diffeomorphism gauge) = 6 omits the 4 first-class constraints (Hamiltonian + 3 momentum) that further reduce: 10 − 4 (gauge) − 4 (constraints) = 2. Equivalently, in canonical ADM: 12 phase-space (g_ij, π^ij) − 8 constraints = 4 phase = 2 configuration DoF. The 2 DoF are exactly the h_+, h_× modes featured in §6, so the page contradicts itself.

- **general-relativity.html:506–507 (Schwarzschild widget)** — Null-cone slope is hard-coded as `slope = f = 1 − 2M/r`. The actual null condition in (t, r) Schwarzschild coordinates is dt/dr = ±1/f, so cones should *close up* (slope → ∞) approaching the horizon, not *flatten*. Visualization gives the qualitatively wrong picture of cone tilting outside r = 2M. (Inside the horizon the swap of timelike/spacelike roles for t/r is depicted reasonably.)

## Underspecified or unverifiable claims

- **Units convention (general-relativity.html:380, 465, 467, 741)** — The page uses G = c = 1 (geometrized) units throughout but never tells the reader. A reader carrying the user's expected `8πG/c⁴` form will be briefly confused; same for the bare `2M` in Schwarzschild rather than `2GM/c²`. Not wrong, just unstated.

- **Sectional curvature dial (line 405, 430)** — Formula `K ≈ ρ + Λ/3` is a heuristic "sketch" with no derivation; reasonable as a visual cue but not a real identity.

- **Geodesic equation, Christoffel/Riemann/Ricci/Einstein tensors with explicit signs** — Not written out in component form on this page; only named. Nothing to verify.

- **Black hole entropy A/4** — Not present on this page; cannot audit.

- **Mercury perihelion shift / light bending angle** — Mentioned (line 543) but no numerical values given; nothing to check.

## Severity

**Minor.** All headline equations (Einstein, Friedmann, Schwarzschild, Kerr horizons, linearized GW wave equation, Kretschmann) are correct. Two real bugs: the "6 propagating DoF" line (should be 2) and the Schwarzschild widget's inverted null slope. One ambient documentation gap (geometrized units never stated).
