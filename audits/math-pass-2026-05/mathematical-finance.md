# mathematical-finance — math-correctness audit (2026-05)

## Verified claims (sections)

- **§1 GBM and Black–Scholes formula** — `dS = μS dt + σS dB`; closed form `S_t = s exp((μ−σ²/2)t + σB_t)`; mean `s e^{μt}`, median `s e^{(μ−σ²/2)t}`; "volatility drag" = mean−median (mathematical-finance.html:282–288). All correct. The BS call formula `C = S Φ(d_1) − Ke^{−r(T−t)} Φ(d_2)` with `d_{1,2} = [log(S/K) + (r ± σ²/2)(T−t)] / (σ√(T−t))` is exact (lines 290–294).
- **§1 ATM thumb rule** — `C ≈ 0.4 · S · σ · √T` (line 296). Derivation `C ≈ S · 2Φ'(0) · d_1 = 2/√(2π) · S · (σ√T/2) ≈ 0.3989 · S · σ√T` rounds to `0.4` correctly.
- **§1 numeric: 1y ATM, σ=0.2, r=0 → ~7.97** (quiz mf-black-scholes-model q3). Verified: `d_1=0.1, d_2=−0.1`, `100(0.5398−0.4602)=7.96 ≈ 7.97`.
- **§2 BS PDE** — `∂_t V + ½σ²S²∂_{SS}V + rS∂_S V − rV = 0` with terminal `V(T,S)=(S−K)^+` (line 431). Standard form; sign and coefficient on `½σ²S²` correct.
- **§2 delta-hedge derivation** — algebra in lines 428–432 (and §6 scrubber lines 1044–1075) consistent and correct: choosing `Δ = ∂_S V` cancels the `dB` term; risk-neutral growth `dΠ = rΠ dt` closes the loop.
- **§2 heat-equation reduction** — substitution `S=Ke^x, τ=½σ²(T−t), V=Ke^{−r(T−t)}e^{αx+βτ}u` collapsing to `∂_τ u = ∂_{xx}u` (line 434). Standard Wilmott reduction; correct.
- **§3 Girsanov / risk-neutral** — `dQ/dP = exp(−θB_T − ½θ²T)`, `θ = (μ−r)/σ`, gives `dS = rS dt + σS d\tilde B`, discounted price is Q-martingale, `V_0 = e^{−rT} E^Q[g(S_T)]` (lines 573–578). All correct.
- **§3 FTAP I/II box** (line 583) — both fundamental theorems stated correctly (no-arb ⇔ EMM exists; completeness ⇔ EMM unique).
- **§4 Merton wealth SDE and π\*** — `dW = [(r + π(μ−r))W − c]dt + πσW dB` (line 717) and `π\* = (μ−r)/(γσ²)` (line 723). Correct CRRA result.
- **§4 numeric: μ=0.08, r=0.02, σ=0.2, γ=2 → π\*=0.75** (quiz mf-merton-portfolio q3). `0.06/(2·0.04)=0.75`. ✓
- **§5 HJB equation** — `∂_t V + sup_u {L^u V + f} = 0`, with `L^u V = b·∇V + ½ tr(σσ^⊤ ∇²V)` (lines 859–860). Correct, including the `σσ^⊤` (not `σ²`) for the multidimensional generator.
- **§6 Itô identities** — `d⟨X⟩_t = σ²dt`, `df(X) = f'dX + ½f''d⟨X⟩`, Itô isometry `E[(∫θ dB)²] = E∫θ² dt` (lines 996–998). Standard, correct.
- **§7 Heston SDE** (line 1119) — `dS = μS dt + √v · S dB^{(1)}, dv = κ(θ−v)dt + ξ√v dB^{(2)}` with correlation. Variance follows CIR — correctly identified in quiz mf-beyond-bs matching (the quiz uses "mean-reverting CIR" to label Heston variance, which is right).
- **§7 Merton jump-diffusion** (line 1121) — `dS/S_{t−} = μdt + σdB + (J−1)dN`. Conventional `S_{t−}` and `(J−1)` both present and correct.
- **§7 incompleteness in Heston** (quiz mf-beyond-bs q3) — two BMs, one tradable ⇒ EMM non-unique. Correct.

## Wrong / dubious claims (with file:line)

- **mathematical-finance.html:1123 — Dupire formula missing rate/dividend terms.** Stated as `σ²_loc = 2 ∂_T C / (K² ∂_{KK} C)`. The full Dupire formula is `σ²_loc(K,T) = [∂_T C + (r−q)K ∂_K C + qC] / (½ K² ∂_{KK} C)`. The stated form is correct only when `r = q = 0`. The page does not flag the simplification. *Minor.*
- **quizzes/mathematical-finance.json:283 — "CIR" label on Heston variance is potentially confusing.** The Heston variance SDE `dv = κ(θ−v)dt + ξ√v dB` is *exactly* a CIR/Feller square-root process, so labeling it "mean-reverting CIR" is technically correct. No error, but a reader could misread it as "Heston = CIR for short rates." *Cosmetic; not a math error.*

## Underspecified or unverifiable claims

- **§1 line 282** — "(ii) trading is frictionless and continuous in time, (iii) there is a riskless bond earning rate r" omits the standard "no dividends" assumption. The formula `C = SΦ(d_1) − Ke^{−rT}Φ(d_2)` as written assumes `q = 0`; with continuous dividends the formula becomes `Se^{−qT}Φ(d_1) − Ke^{−rT}Φ(d_2)` with adjusted `d_{1,2}`. Not wrong, just incomplete.
- **§5 lines 851–864 — HJB verification theorem** is mentioned but the precise growth/transversality conditions are not stated. Quiz mf-hjb q2 picks the correct nuanced answer ("suitable growth conditions"), so the imprecision is intentional pedagogy rather than an error.
- **Greeks (Δ, Γ, Θ, ν, ρ) are absent.** The prompt asks to verify "specific Greeks"; the page only mentions `Δ = ∂_S V` implicitly in the hedging derivation and does not give closed forms for Γ, Θ, ν, ρ. Nothing to audit, but worth flagging coverage gap.
- **Put-call parity `C − P = S − Ke^{−rT}` is absent** from both prose and quiz. Coverage gap, not an error.
- **Term-structure models (Vasicek, CIR for short rates, HJM) are absent.** Only Heston's CIR-style variance appears. Coverage gap, not an error.
- **§7 "tractable closed-form for European options" under Merton jump-diffusion** (line 1121) — true (a Poisson-weighted sum of BS prices), but unverifiable without the explicit series. Standard textbook claim, accepted.

## Severity

**Clean** — every formula explicitly written on the page is mathematically correct. The one item worth surfacing is the Dupire simplification (line 1123); calling it `2∂_T C / (K² ∂_{KK} C)` without the `(r−q)K∂_K C + qC` correction terms is a minor pedagogical omission rather than an error, and is consistent with the page's `r = 0` working examples elsewhere. Greeks, put-call parity, and term-structure models are coverage gaps relative to the audit checklist but not bugs in what the page does claim.
