# random-walks-and-mixing — pedagogical audit (2026-05)

**Section:** Probability & statistics
**Compared against:** probability-theory, stochastic-processes-and-martingales

## Summary
The page is in good shape — voice, structure, widget chrome, and notation are mostly aligned with the two section peers and the canonical `category-theory.html` template. A small handful of issues stand out: an inconsistent indicator-function macro (`\mathbb{1}` vs the section-standard `\mathbf{1}`), a couple of terms used before they are defined (`data-processing inequality`, `lazy walk`, `submultiplicativity`), `\mathcal{L}(X_t)` introduced without gloss, and a probability-helper (`gauss()`) defined locally inside §6 instead of being lifted into the page-global helper block that peers use (`randn()`).

## Findings
### Notation drift
- Indicator function: target uses `$\mathbb{1}[xy\in E]$` at §1 (`random-walks-and-mixing.html:271`); both peers use `\mathbf{1}` consistently — `\mathbf{1}_{[a,b]}` (`probability-theory.html:625-626`, also `:1123, :1132, :1171, :1304`) and `\mathbf{1}_{|M_n|>K}` (`stochastic-processes-and-martingales.html:825`). High-priority semantic-style drift inside the same section. Recommend `\mathbf{1}`.
- Law-of-a-process: target writes `$\|\mathcal{L}(X_t)-\mathcal{L}(Y_t)\|_{\mathrm{TV}}$` at §5 (`:804`); neither peer ever uses `\mathcal{L}` for "law" — `\mathcal{L}` in `random-walks-and-mixing.html:674` is even being recycled for the graph Laplacian, so the symbol carries two different meanings on the same page (semantic drift). Probability-theory writes the law as `\mathbb{P}_X` (`:490-498`). Recommend either dropping `\mathcal{L}` for the law (e.g. write `\|P^t(x,\cdot)-P^t(y,\cdot)\|_{\mathrm{TV}}` or `\mathbb{P}_x(X_t\in\cdot)`), or at minimum gloss "the law of $X_t$" the first time.
- Continuous-time generator: §1's `<div class="note">` mentions `$P_t=e^{tQ}$ with infinitesimal generator $Q$` (`:269`) — peers use no analogous symbol; minor cosmetic drift but worth a one-clause gloss since `Q` is reused later in §6 as the Metropolis proposal kernel `q` (lowercase, distinct, but visually close).
- Spectral-gap convention: the target distinguishes `relaxation gap γ = 1 − λ₂` from `absolute gap γ* = 1 − max(|λ₂|,|λₙ|)` (`:642, :785-786`); peers don't establish a precedent. Internally consistent — flag only as a glossary note for cross-page linking.
- Indicator-bracket form `\mathbb{1}[xy\in E]` uses Iverson brackets; peers use the subscript form `\mathbf{1}_{|X_n|>K}`. Cosmetic but worth aligning if you adopt `\mathbf{1}`.

### Undefined jargon
- "**data-processing inequality**" appears at §3 line 483 ("monotone non-increasing along the chain (the data-processing inequality)") with no definition or callback. The page never refers to information theory; either drop the parenthetical or add a one-line gloss ("contractivity of TV under any Markov kernel").
- "**lazy walk**" first appears as a SVG legend caption at §3 line 622 ("time t (lazy walk steps)") and a code comment at line 542 (`// lazy walk: P = (I + D⁻¹ A) / 2 to ensure aperiodicity`), but the term is never explained in prose. It is finally **defined** at §5 line 807 inside a `<div class="note">` ("the lazy walk picks a coordinate uniformly and randomises it") — two sections later. The §3 widget hint and the §4 readout (`spectrum of lazy walk P = (I + D⁻¹A)/2`) both rely on the reader knowing the term. Add a one-sentence definition the first time, ideally in §3 prose.
- "**submultiplicativity**" / "**submultiplicative**" appears in §3 (`:489, :491` "by submultiplicativity $d(s+t)\le 2d(s)d(t)$") with no derivation or callback. Either define it ("$d(s+t)\le 2d(s)d(t)$, the *submultiplicative* property of total-variation mixing") or motivate why $d$ submultiplies — currently it sits as a black-box justification for the $1/4$ convention.
- "**Cheeger / Cheeger's inequality**" is invoked twice (`:646` "near-disconnection ($\lambda_2\to 1$, Cheeger)", `:650` "Cheeger's inequality is the rigorous version") without definition or callback. There is no `<aside class="callback">` to `spectral-graph-theory.html#cheeger` in §4 even though the page links to that file in §7. Recommend either a callback at §4 end or a one-sentence gloss.
- "**absolute spectral gap**" is introduced cleanly (`:642`), but the §4 readout writes `t_mix ~ 1/γ* ≈ ${(1/gap).toFixed(2)} steps per ε-decade` — the phrase "per ε-decade" hasn't appeared in prose. Minor jargon-in-readout.
- "**path-coupling**" and "**conductance**" appear only in §7 outro (`:1050`) without callbacks — acceptable for a Connections section, but worth at least pointing at `spectral-graph-theory.html` / `expanders.html` if those concepts are owned there.

### Tone mismatches
- §3 readout label `d(t) = max_x ‖P^t(x,·) − π‖_TV` (`:621`) drops the LaTeX rendering inside SVG — that's a known constraint and matches peers, no action.
- §5 widget readout has a comma-spliced explanation: "not met yet · common-direction coupling preserves circular gap with prob 1/2" / "met at t = ${met} · the lazy step is the only way the gap changes; coupling inequality: ‖L(X_t)−L(Y_t)‖_TV ≤ P(τ>t)." (`:885-886`) — that final inequality, dumped into a readout without a verb, is denser than peer pages typically allow. Stochastic-processes-and-martingales readouts (`:532-535`) keep the inequality in prose and the readout in plain numerics. Minor.
- The opening of §1's Worked example ("the widget below lets you step a chip on a small graph and watches the running visit-frequency", `:271`) has a subject/verb agreement glitch ("watches" → "watch"). Cosmetic copy-edit.
- §6 hint copy ("tip: σ ≪ 0.5 → high acceptance but stuck in one mode (slow mixing); σ ≫ 3 → bold but rejected; the sweet spot is σ ~ width-of-mode.", `:1021`) is well-pitched — matches the conversational-precise voice of the canonical template. No issue.
- §7 closing line ("Open frontiers: rapid mixing of Glauber dynamics for Ising and hard-core models (recent breakthroughs via spectral independence); high-dimensional expansion (HDX) and local-to-global theorems; quantum walks and exotic mixing rates.", `:1056`) parallels stochastic-processes-and-martingales' "Open frontiers" line (`:1192`) — voice match is good.

### Missing worked examples
- §7 (Connections) has no widget. This **matches the section-peer pattern** — `stochastic-processes-and-martingales.html` §7 also has no widget, and `category-theory.html` outro sections similarly skip widgets. Not an issue.
- §1 through §6 each have a widget plus prose worked example. Coverage is solid.
- §4 (Spectral gap) lacks an explicit numerical walk-through — the reader gets the spectral-mixing-time bound `(γ*/2)·log(1/2ε) ≤ t_mix(ε) ≤ (1/γ*)·log(1/(π_min·ε))` (`:645`) and a widget that reports `mixing-rate floor: t_mix ~ 1/γ* ≈ {x} steps per ε-decade` — but no toy chain is plugged in by hand to show the bound is non-vacuous. Compare to probability-theory §10 (`:1455-1457`) where the 3-state weather chain is solved explicitly: `π≈(0.47,0.28,0.25)` is computed in prose. Adding one such "for the cycle $C_8$, $\lambda_2=\cos(2\pi/8)\approx 0.707$, so $t_{\rm mix}\sim 1/(1-\lambda_2)\approx 3.4$" line would cement the connection between §3's empirical curve and §4's spectral prediction.
- §6 (MCMC): the `<div class="ok">` cost-bound argument (`:907`) gives no concrete number; a one-line "for the bimodal target with σ matching mode width, t_mix is roughly the inter-mode gap divided by σ²" would let the reader test the bound against the widget's trace.

### KaTeX macros / formatting
- The `\mathbb{1}` used in the indicator at §1:271 is the only occurrence in the target; no local `\macros` block defines it, so it falls through to KaTeX's default (which renders fine but is non-standard versus the section). Already covered under Notation drift.
- The page's `<head>` macros block (`:22-30`) is a verbatim copy of the canonical template's macro set (`\Spec, \Gal, \Hom, \tr, \ad, \ind`) — none are actually used in this page's prose. Acceptable boilerplate; no action.
- Helper-block hygiene: target's top-of-body `<script>` (`:187-236`) defines `$, $$, SVG, ensureArrow, drawArrow, drawNode` — verbatim against `category-theory.html` and both peers. **However**, peers `probability-theory.html` (`:234-242`) and `stochastic-processes-and-martingales.html` (`:236-242`) extend the helper with `randn()` (and `phi()` in probability-theory). The target instead defines a one-off `gauss()` inside §6's `<script>` (`:937-940`). This is a minor section-helper-discipline drift: the random-walks page is the only Probability-section page that uses Box–Muller and yet keeps it local. Lifting `randn()` into the page-global helper would match peer convention.
- `<div class="hd">` `<div class="hint">` strings use mid-line LaTeX (`step the chip · running counts converge to $\pi_i\propto d_i$` at `:274`) and `\mathcal{L}` in `:286` — fine, all KaTeX-rendered; matches peer hint style.
- The §3 widget hint contains an escape sequence "Total-variation distance vs.\ time" with `\` before whitespace (`:494`) — peers use the same construct (e.g. `vs.\\ empirical histogram` `:992`); not a KaTeX issue, just a typesetting habit copied from LaTeX. Cosmetic.
- All math uses standard `$…$` / `$$…$$` delimiters — no invented delimiters. Compliant.
- Widget chrome (`.widget`, `.hd`, `.ttl`, `.hint`, `.row`, `.readout`, `.note`, `.ok`, `.bad`) — all six widgets use the standard classes; no ad-hoc class drift detected.

## Severity
minor polish
