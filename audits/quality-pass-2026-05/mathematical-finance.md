# mathematical-finance — pedagogical audit (2026-05)

**Section:** Control theory & optimization
**Compared against:** optimal-control-and-dynamic-programming, convex-optimization

## Summary
The page is well-structured, generously illustrated, and tonally a strong fit for the notebook — eight numbered sections, every section has at least one interactive widget, and helper-block / chrome conventions match `category-theory.html` exactly. A handful of minor notation drifts and a few definition-order slips are worth tidying, but nothing structural needs rework.

## Findings
### Notation drift
- `\mathrm{tr}` used at `mathematical-finance.html:860` (`\tfrac{1}{2}\mathrm{tr}\bigl(\sigma\sigma^\top \nabla^2 V\bigr)`) vs `\operatorname{tr}` at `optimal-control-and-dynamic-programming.html:590,594` (`\tfrac12 \operatorname{tr}(\sigma\sigma^\top D^2 V)`). The page-defined macro `\tr` (`'\\tr':'\\operatorname{tr}'`, line 26) is loaded but unused. **Cosmetic but easy fix:** replace `\mathrm{tr}` with `\tr` (or `\operatorname{tr}`) for consistency with the section peer.
- Hessian written `\nabla^2 V` in mathematical-finance §5 (line 860) vs `D^2 V` in the optimal-control HJB section (`optimal-control-and-dynamic-programming.html:590,594`). Same operator, two notations within one section. **Cosmetic.** Recommend `D^2 V` since the optimal-control page is the upstream reference for the HJB formalism.
- HJB sign convention: target writes `\partial_t V + \sup_u\{\mathcal{L}^u V + f\} = 0` (max, reward-style; line 859); peer writes `-\partial_t V = \inf_u\{L + \partial_x V \cdot f\}` (min, cost-style; `optimal-control-and-dynamic-programming.html:440`). Both pages are internally consistent (finance maximises utility, control minimises cost) and the target's framing matches the Merton problem naturally — flag as **semantic-but-justified divergence**, not drift to "fix," but a one-line bridge sentence in §5 acknowledging the sign flip vs the optimal-control page would help readers traversing both.
- Brownian-motion driver letter inconsistent: target uses `B_t` throughout (e.g. line 285, 718) but the optimal-control reference uses `W_t` for the stochastic-control SDE (`optimal-control-and-dynamic-programming.html:584`). **Cosmetic, low priority** — both are standard, but cross-page reading flips the symbol.

### Undefined jargon
- "self-financing hedging portfolio" appears at line 294 (§1) — formal definition arrives only in §6 at line 1015. **Low-severity** because §6 explicitly catches it up; consider a parenthetical "(defined in §6)" or a forward-link in §1.
- "value function" used inline in §4 prose at line 723 (`the value function separates: $V(t,w) = \phi(t)\,w^{1-\gamma}/(1-\gamma)$`) before being formally introduced in §5 at line 856. **Low-severity, borderline** — readers can guess from context.
- "Sharpe ratio" first surfaces at line 725 (§4) without a one-clause gloss; the next mention at line 838 also assumes the term. A 5-word inline definition (`the Sharpe ratio $(\mu-r)/\sigma$, excess return per unit volatility`) would carry it for newcomers.
- "EMM" introduced at line 583 inside the FTAP `<div class="note">`. The acronym is expanded ("equivalent martingale measure (EMM)") on first use which is correct — but the prose then drops to "EMM" twice without re-glossing; fine.
- §8 "Connections" mentions "filtrations, stopping times, optional sampling" (line 1238) and "viscosity solutions" (line 1239) without on-page definition. These are linkout signposts to other topics, so this is **acceptable as scaffolding language** rather than undefined jargon — but the convex-optimization peer's §8 connections list does similar without flagging issue.

### Tone mismatches
- Section §1's `<div class="note"><strong>The thumb rule.</strong>` (line 296) — "useful for sanity-checking quotes in your head" — is a strong tonal asset, hits the conversational-but-precise register the canonical template prizes. Keep.
- Section §3's "the operating principle behind almost every modern derivatives desk" (line 581) and §7's "working empirical object that any post-Black–Scholes model must fit" (line 1113) read **slightly more market-practitioner than mathematics-pedagogy** vs the optimal-control peer's voice ("textbook autopilot is computing", `optimal-control-and-dynamic-programming.html:509`). The flavor difference is appropriate to the topic; not a problem, but the proportion of "what traders do" framing in §7 ("derivatives desk", "calibrated to market prices") is the highest of the three pages. **Minor polish:** one or two of these sentences could be reframed in mathematician's voice without losing the operational hook.
- The §6 prose intro "Three Itô-calculus facts do most of the work in derivatives pricing" (line 993) is bullet-list-as-recap — this is fine, but the bullets feel like a refresher of `stochastic-calculus.html` content rather than new pedagogy. Consider a cross-reference + one-line restatement instead of a full re-derivation block.
- No formulas-without-narration walls observed; every display equation has prose framing on at least one side.

### Missing worked examples
- Every numbered `<h2>` section §1–§7 has at least one widget (`#w-gbm-paths`, `#w-bs-surface`, `#w-mc-pricer`, `#w-merton`, `#w-hjb-tree`, `#w-bs-derivation`, `#w-vol-smile`). §8 Connections has none, which matches the convention of the peer pages (`optimal-control-and-dynamic-programming.html:637`, `convex-optimization.html` §8 also widget-free).
- §6 ("Itô diffusions in finance") has the proof-scrubber widget but no concrete numerical computation — it's a step-through of the BS PDE derivation, which is excellent pedagogy but is the second BS-PDE walkthrough on the page (the first being the §2 surface plot). **Minor:** consider whether §6's widget could surface a different "toy to poke" (e.g. quadratic-variation accumulator on a sample path, or Itô-isometry numerical verification).
- §5 (HJB) has the binomial-tree value-iteration widget — good. The "max(A, B, C)" three-action choice in the recompute() loop (line 925) is somewhat artificial since up/down are equivalent for a monotone payoff; the source comment (line 912) acknowledges this. **Minor pedagogical risk:** a reader might misread the widget as showing genuine action-choice when it's really illustrating the `sup_u` operator with redundant actions.

### KaTeX macros / formatting
- All KaTeX delimiters are standard (`$…$`, `$$…$$`); no invented delimiters.
- Page-defined macros (`\Spec`, `\Gal`, `\Hom`, `\tr`, `\ad`, `\ind`) are inherited verbatim from the canonical template loader. Most are unused on this page (no Spec / Gal / Hom / ad / ind references in finance content) — that's fine for byte-identical helper consistency, but `\tr` is defined and not used (see notation-drift bullet about `\mathrm{tr}` at line 860).
- No new local macros introduced beyond the template set. No re-invented delimiters.
- One **minor code-side hygiene** note (not strictly KaTeX): the §3 Monte Carlo widget defines `function normCdfLocal(x)` at `mathematical-finance.html:630` that duplicates the global `normCdf` already defined in the page-helper block at line 247. Cosmetic — the global is in scope.
- Helper block (`$`, `$$`, `SVG`, `ensureArrow`, `drawArrow`, `drawNode`) is verbatim from `category-theory.html`; the finance page extends it with `randn` and `normCdf` inside the same `<script>` (lines 240–253). This is a reasonable extension pattern and matches what other probability/stochastic pages do.
- Widget chrome is uniform: `.widget`, `.hd`, `.ttl`, `.hint`, `.row`, `.readout`, `.note` all conform to house conventions; no ad-hoc classes introduced.

## Severity
minor polish
