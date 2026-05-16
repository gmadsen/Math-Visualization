# Atiyah–Singer index theorem — math-correctness audit (2026-05)

Scope: `atiyah-singer-index-theorem.html` (1,115 lines, 6 numbered sections, 6 widgets).

## Verified claims (sections)

- **§1 statement.** Boxed `ind(D) = ⟨ch[σ(D)]·Td(TM⊗ℂ), [T*M]⟩`, `[σ(D)] ∈ K^0_c(T*M)`, spectral-flow widget for `−i∂_θ+λ` on `S¹` — all correct.
- **§2 ellipticity.** Symbol convention `σ_m = Σ a_α(iξ)^α`; `σ(−Δ)=|ξ|²`, `σ(∂̄)=(i/2)(ξ_1+iξ_2)`, wave `σ=−τ²+|ξ|²` (lightcone) — all correct. Parametrix/Fredholm sketch standard.
- **§3 topological side.** `K^0_c(T*M)` from compactly-supported difference, embed/Thom pushforward, Todd as R–R defect, Td power series `1+c_1/2+(c_1²+c_2)/12+c_1c_2/24+...`, curve χ(L)=deg L+1−g — all correct.
- **§4 specialisations.** `d+d*` has ind = χ via Hodge, integrand `e(TM)`, Gauss–Bonnet; signature on 4k-mfd has ind = σ, integrand `L(TM)`, `σ = p_1/3` in dim 4; HRR `χ(X,E) = ∫ch(E)·Td(TX)`, `χ(ℙ¹,O(d))=d+1` — all correct.
- **§5 Dirac.** `D = Σ e_i·∇_{e_i}`, symbol `iξ·` invertible (Clifford²=−|ξ|²); Â expansion `1−p_1/24+(7p_1²−4p_2)/5760+...`; spin 4-mfd ind = −p_1[M]/24 = −σ/8; Lichnerowicz `D²=∇*∇+R/4`, K3 has Â=2; Bär eigenvalues `±(k+n/2)` on `S^n`, `S²` mult `2(k+1)` — all correct.
- **§6 heat / families / equivariant.** McKean–Singer `ind = tr(e^{−tD*D})−tr(e^{−tDD*})`, eigenvalue cancellation, heat asymptotic `K(t,x,x)~Σt^{(k−n)/2}a_k(x)`, families ind in `K^0(B)`, Atiyah–Bott Lefschetz on `M^g`, chiral anomaly `∂_μj_5^μ = −(1/8π²)tr(F∧F)` — all correct.

## Wrong / dubious claims (with file:line)

- **`:649` — surface integrand readout double-counts `c_1(E)²`.** Reads `[ch(E)·Td(TM_ℂ)]_4 = (rk/12)(c₁(TM)²+c₂(TM)) + (1/2) c₁(E) c₁(TM) + (1/2) c₁(E)² + ch₂(E)`. But `ch_2(E) = (c_1²−2c_2)/2` already contains `c_1²/2`; including BOTH summands doubles it. Correct general-rank form: `(rk/12)(c_1(TM)²+c_2(TM)) + (1/2)c_1(E)c_1(TM) + ch_2(E)`. (Static line 557 is a rk-1 specialisation where `ch_2(L) = c_1(L)²/2`, internally consistent — but the dynamic readout fires for any rk and breaks at rk ≥ 2.)
- **`:957, :967, :1020, :1034` — sign on `c_2(V)`.** For `SU(N)` (implicit since instanton number is invoked), `c_1=0` ⟹ `ch_2(V) = −c_2(V)`, so `[Â·ch(V)]_4 = −c_2(V) − rk·p_1/24` and `ind(D_A) = −∫c_2(V) − rk·⟨p_1,[M]⟩/24`. Page writes `+∫c_2(V)`. With standard physics `k = (1/8π²)∫tr(F∧F) = −∫c_2(V)` for `SU(N)`, the right relation is `ind ≈ k`, not `ind ≈ ∫c_2`. Either flip the sign or redefine `k := ∫c_2` non-standardly (and flip BPST `k=1` accordingly).
- **`:822` — "recovering Rokhlin's σ ≡ 0 (mod 16)".** `ind(D) = −σ/8 ∈ ℤ` only gives `σ ≡ 0 (mod 8)`. Mod-16 needs the quaternionic structure on `S^+` in dim 4 (complex index automatically even). Text presents mod-16 as immediate; it isn't.

## Underspecified or unverifiable claims

- **`:380` — heat-operator "symbol" `iτ+|ξ|²`.** Mixed-order; the principal symbol of `∂_t−Δ` is `|ξ|²` alone (still non-elliptic). Pedagogical full-Fourier symbol, not the principal one used elsewhere.
- **`:826` — "consistent with `Â(S^n)=0` for `n ≥ 1`".** True but elliptical: Â lives in degrees 4k and spheres are rationally trivial in Pontryagin classes.
- **`:692` — "forces p₁ divisible by 3".** Correct (`p_1[M]=3σ ∈ 3ℤ`) but reads tautological without noting `p_1[M] ∈ ℤ` a priori.

## Severity

**Moderate.** One algebraic error (doubled `c_1(E)²` in §3 readout for rk > 1), one sign error repeated four places (`c_2(V)` in §6), one overstated reduction (Rokhlin mod-16). Patches: (a) drop redundant `(1/2)c_1(E)²` on 649; (b) flip `c_2(V)` sign on 957/967/1020/1034; (c) qualify mod-16 on 822 with a quaternionic-structure aside.
