# differential-geometry.html — math correctness audit (2026-05-14)

## Verified claims (sections)

- §1 Curves: arc-length reparametrization, signed curvature `κ = det(γ̇,γ̈)/|γ̇|³`, space-curve `κ = |γ̇×γ̈|/|γ̇|³`, `τ = (γ̇×γ̈)·γ⃛/|γ̇×γ̈|²`. Frenet–Serret matrix is correctly skew-symmetric and the standard sign convention `T'=κN, N'=−κT+τB, B'=−τN`. Helix `(a cos t, a sin t, bt)` yields `κ=a/(a²+b²), τ=b/(a²+b²)` — verified numerically (line 399). Cardioid algebraic derivatives at line 466–473 verified numerically against finite-difference at four sample t-values.
- §2 Evolute/involute facts (tangent of evolute = normal of curve; cusps at vertices; evolute of ellipse has 4 cusps; evolute of cycloid is a translated cycloid; center of curvature `p + (1/κ)N`). Standard.
- §3 Regular surface and tangent-plane definitions; `‖x_u × x_v‖ ≠ 0 ⇔ dx injective`; orientability/Möbius. Standard.
- §4 First fundamental form `I = E du² + 2F du dv + G dv²`, length/angle/area formulas, `dA = √(EG−F²) du dv`, isometry list (cylinder, cone, catenoid–helicoid). All standard and correct.
- §5 Shape operator matrix `[S] = I⁻¹ II`, self-adjointness, principal curvatures as eigenvalues, `K = (eg−f²)/(EG−F²)`, `H = (eG−2fF+gE)/(2(EG−F²))`. Classification table (elliptic/hyperbolic/parabolic/planar) correct. Numerically verified the K formulas in the heatmap widget for: torus `K=cos v/(r(R+r cos v))`, saddle `K=−4/(1+4u²+4v²)²`, hyperboloid `K=−1/cosh²(2u)`, pseudosphere `K≡−1`.
- §6 Theorema Egregium statement; Brioschi formula for orthogonal coords (verified against sphere giving `K=1/R²`); 2D identity `K = R₁₂₁₂/(EG−F²)`; angular-defect `α+β+γ−π=∫K dA`; spherical-octant computation `area = π/2`, `K(area) = π/2` ✓.
- §7 Geodesic equation `γ̈ᵏ + Γᵏ_{ij}γ̇ⁱγ̇ʲ = 0`, Christoffel formula `Γᵏ_{ij} = ½gᵏˡ(∂ᵢg_{jl}+∂ⱼg_{il}−∂ₗg_{ij})`, "γ̈ ⊥ S" extrinsic characterization, exponential map and normal coordinates. All standard.
- §8 Local Gauss–Bonnet `∫K dA + ∫κ_g ds + Σεᵢ = 2π`, global `∫K dA = 2π χ`. Worked sphere example correct. Descartes/discrete G–B with cube check `8·π/2 = 4π` correct. Platonic-solid defect formula `δ = 2π − k(n−2)π/n` correct. Latitude-loop holonomy `2π(1−cos θ)` correct.
- §10 Levi-Civita uniqueness via metric-compatibility + torsion-free; Christoffel formula; Riemann tensor `R(X,Y)Z = ∇_X∇_Y Z − ∇_Y∇_X Z − ∇_{[X,Y]}Z`; component formula; symmetries `R_{ijkl} = −R_{jikl} = −R_{ijlk} = R_{klij}`; component count `n²(n²−1)/12 = 1,6,20` for n=2,3,4 ✓; sectional curvature `K(σ) = g(R(u,v)v,u)`; scalar `R = gⁱʲRic_{ij}`; `R = 2K` in 2D.

## Wrong / dubious claims (with file:line)

- **differential-geometry.html:2289** — Only the **algebraic (first) Bianchi identity** `R_{i[jkl]} = 0` is mentioned; the **second (differential) Bianchi** `∇_{[a}R_{bc]de} = 0` is missing. The user's audit list explicitly calls out "Bianchi identities" (plural). Coverage gap, not a wrong statement.
- **differential-geometry.html:2240** — Holonomy = `∫K dA` is stated without the geodesic-or-smooth-loop caveat. For a piecewise-smooth loop with corners the full G–B form is `holonomy = ∫K dA + ∫κ_g ds + Σ(turning angles)`. The widget's three test cases happen to satisfy the simplification (geodesic boundary, or latitude where the cap formula absorbs κ_g), but the prose generalization is technically incomplete. Minor.
- **differential-geometry.html:2296** — `Ric_{ij} = R^k_{kij}`. Internally consistent with the (1,3) convention `R(∂ᵢ,∂ⱼ)∂ₖ = R^l{}_{ijk}∂_l` declared on line 2287, but most modern textbooks (do Carmo, Lee, Petersen) write `Ric_{ij} = R^k{}_{ikj}` (contraction with the second lower index). Either sign-convention works; flag for cross-page consistency only. Acceptable.
- **differential-geometry.html:774** — "A simple closed **convex** plane curve has at least four vertices." The four-vertex theorem extends to all simple closed plane curves (Osserman 1985), not just convex ones. The page's statement is the classical (Mukhopadhyaya 1909) version and is correct as written but unnecessarily restrictive. Minor.

## Underspecified or unverifiable claims

- **differential-geometry.html:1311** — "`K = R_{1212}/(EG−F²)` ... foreshadows the structure we will see in §10." The 2D identity uses the (0,4) Riemann tensor `R_{1212}`; the page lowers indices on line 2287 (`R_{lijk} = g_{lm} R^m{}_{ijk}`), which is consistent. No issue.
- **differential-geometry.html:2296** — Einstein equation written `Ric − ½ R g + Λ g = 8π T` (geometrized units `G = c = 1`); not a math error, just dimensional convention.
- **differential-geometry.html:1869** — Double-torus combinatorial datum `V=10, E=24, F=12 ⇒ χ=−2`. `10−24+12 = −2` ✓; this is one valid triangulation but not derived in-page.

## Severity

**clean** — All concrete formulas (Frenet–Serret, helix κ/τ, cardioid derivatives, surface K formulas, Christoffel, Riemann tensor, sectional/Ricci/scalar contractions, sphere/torus/pseudosphere worked examples, Gauss–Bonnet local & global, Descartes' polyhedral version, Brioschi) are mathematically correct. The only real gap is the missing **second Bianchi identity** (a coverage omission rather than a wrong claim). The other notes are conventional/stylistic.
