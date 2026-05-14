# gauge-theory.html — math-correctness audit

## Verified claims

**§1 Principal bundles & connections.** Defining axioms for a connection 1-form (verticality `A(ξ*)=ξ`, equivariance `R_g* A = Ad(g^{-1})A`) and the horizontal-lift ODE `dγ̃/dt = -A(γ̇)·γ̃` are stated correctly. The pullback `A^σ = σ*A` matches the physicist's `A_μ`.

**§2 Curvature & Yang-Mills.** Structure equation `F = dA + A∧A` (= `dA + ½[A∧A]`), Bianchi `d_A F = 0`, gauge tensoriality `F → g^{-1}Fg`, and the curvature-as-bracket formula `F(X,Y) = -A([X^h,Y^h])` are all standard. YM equations `d_A* F = 0`, `d_A F = 0` correct.

**§3 Gauge transformations & holonomy.** Inhomogeneous transformation `A → g^{-1}Ag + g^{-1}dg`, holonomy conjugacy class, and Wilson-loop trace cyclicity are correct. U(1) holonomy `exp(i∮A) = exp(i∫_D F)` (Stokes/Aharonov-Bohm) is right under physicist convention (real-valued A).

**§4 Instantons.** Hodge `*: Ω²→Ω²` with `*²=+1` in 4D Riemannian (line 617) — correct. ASD ⇒ YM derivation (`d_A* F = -*d_A*F = *d_A F = 0`) correct (line 627). BPST regular-gauge formula `A = Im(q̄ dq)/(|q|²+ρ²)` (line 631), curvature density `|F|² = 96ρ⁴/(|x|²+ρ²)⁴` (line 635), total `∫|F|² = 16π²k`, action `S_YM = 8π²k` saturating Bogomolny — all standard. Moduli dimensions `dim M_1(S⁴) = 5` (4 position + 1 size), `dim M_k(S⁴) = 8k-3` (line 639) ✓. General-X dimension `8k - 3(1+b₂⁺)` (line 1023) ✓.

**§5 Chern-Simons.** Form `ω_CS = tr(A∧dA + (2/3)A∧A∧A)` (line 711), transgression `dω_CS = tr(F∧F)` (line 715), normalization `S_CS = (k/4π)∫ω_CS` and level-quantization argument (`π_3(G)=ℤ` for simply-connected simple G) all correct. Jones polynomials of unknot, trefoil (right-handed), figure-8, and cinquefoil 5_1 (lines 770, 774, 792, 810) match standard tables exactly. Quantum-group root `q = e^{2πi/(k+2)}` is the standard SU(2)_k value (subject to the usual q vs t conventions — see §Underspecified).

**§6 Lattice gauge.** `U_{x,x+aμ̂} ≈ exp(aA_μ)`, plaquette holonomy `≈ exp(a²F_μν + O(a^4))`, Wilson action `β·Re tr(1-U_p)` with `β = 2N/g²` for SU(N), and the area-vs-perimeter law dichotomy are textbook-standard.

**§7 Donaldson / Seiberg-Witten.** ASD moduli definition, expected-dimension formula (line 1023), SW equations `F_A^+ = σ(φ)`, `D_A φ = 0`, compactness via spinor mass term, and basic-class machinery correct. Tabulated SW invariants for K3 (b₂⁺=3, σ=-16, single basic class 0 with SW=1) ✓ (line 1090). K3 #CP̄² blow-up formula giving SW=±1 on ±E ✓ (line 1102). Taubes 1987 / Donaldson diagonalizability statement ✓ (line 1059).

## Wrong / dubious claims

**E(3) basic-class parametrization (lines 1054, 1100).** The table writes "basic classes `(2k-n)F`, `|k|≤n-2`, SW `=C(n-2,k-1)·(±1)`". Standard Fintushel-Stern: basic classes of E(n) (n≥2) are `(n-1-2j)F` for `j = 0,…,n-2`, with `SW = (-1)^j · C(n-2, j)`. For E(3) this gives basics `±F` with SW `±1` — the *displayed* widget values for E(3) are correct, but the parametrization formula `(2k-n)F`, `|k|≤n-2` over-generates: for n=3 it allows `k ∈ {-1,0,1}` giving classes `-5F, -3F, -F` (not symmetric about 0 in the way the formula's binomial indexing implies). The clean statement is `(n-1-2j)F`, j=0..n-2. **Severity: minor — final numbers correct, formula label imprecise.**

**Dolgachev surface b₂⁺ = 1 disclaimer (line 1113).** The note says "E(1) has b₂⁺=1 — strictly speaking on the boundary of the SW domain; treated via wall-crossing." Correct that b₂⁺=1 needs wall-crossing, but "boundary of the SW domain" is loose: SW invariants for b₂⁺=1 are *defined* but chamber-dependent. Phrasing is acceptable but not crisp.

## Underspecified or unverifiable claims

**Sign convention for `k = (1/8π²)∫tr(F∧F)` (line 624).** With anti-hermitian Lie-algebra convention this should be `−(1/8π²)∫tr(F∧F)` to give positive instanton number for ASD configurations; with hermitian / iA convention the stated sign is right. The page does not declare which convention is in force. Not wrong, but conventions should be pinned for reproducibility.

**Jones-polynomial variable in §5.** Witten's formula gives `⟨W⟩ ∝ V_γ(t)` at `t = q² = e^{2πi/(k+2)}` in the standard convention (where Kauffman variable `q = e^{iπ/(k+2)}`). The text writes "evaluated at `q = e^{2πi/(k+2)}`" using `q` for the Jones t-variable; both conventions exist in literature, so this is convention-dependent rather than wrong, but a footnote would help.

**Wilson plaquette action normalization (line 875).** Written as `S_W = β·∑Re tr(1−U_p)` with `β = 2N/g²`. Common alternative is `S_W = (β/N)·∑Re tr(1−U_p)`. The continuum-limit calculation `≈ (β a^4 / 2)∑tr(F²)` requires the trace normalization `tr(T^a T^b) = ½δ^{ab}`; the page does not state this.

**Hopf-bundle widget integrand `A_0·(t + 0.5 sin t)` (line 350).** This is illustrative-only (not the literal horizontal lift of a U(1) connection) — fine pedagogically, but the readout text says "holonomy phase ∮A = -2πA₀" which only matches the constant-`A₀ dθ` connection, not the integrand actually plotted. Internal inconsistency between plotted curve and reported holonomy.

## Severity

**Minor.** No mathematically wrong central formula. The two real items: (i) E(n) parametrization formula label is imprecise though widget values are correct; (ii) hopf widget integrand-vs-readout mismatch is cosmetic. Convention ambiguities (instanton sign, Jones q vs t, plaquette normalization) are widespread in the literature and acceptable in a survey page, but pinning them would tighten the write-up.
