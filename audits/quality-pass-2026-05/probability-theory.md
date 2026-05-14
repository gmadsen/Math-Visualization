# probability-theory — pedagogical audit (2026-05)

**Section:** Probability & statistics
**Compared against:** stochastic-processes-and-martingales, mathematical-statistics

## Summary
Probability-theory is structurally complete (12 sections, 10 widgets, every concept has a quiz placeholder) and tonally on-template, but it has a small number of crisp drift signals: it consistently uses `\text{Var}` while both section peers (and the rest of the corpus) use `\mathrm{Var}`, two sections lack worked widgets that every other section has, and §12 contains a leftover draft heading "Stays-a-preview." Polishable in one focused pass.

## Findings
### Notation drift
- **`\text{Var}` / `\text{Cov}` vs. `\mathrm{Var}` (semantic-cosmetic, high signal because it is corpus-wide).** probability-theory.html writes `$\text{Var}(X)=\mathbb{E}[(X-\mathbb{E}[X])^2]…$` (line 846) and `$\text{Cov}(X,Y)…$` (line 848), and continues with `\text{Var}` in §7 (line 1164), §8 (line 1171), §9 (lines 1304, 1306), and §12 (line 1678). The two section peers both use `\mathrm{Var}`: stochastic-processes-and-martingales.html line 421 `$\mathrm{Var}(X_i)=\sigma^2$`, mathematical-statistics.html line 301 `$\mathrm{Var}_\theta(\hat\theta_n)$`, line 554 `$\mathrm{Var}(W)=\mathbb{E}[\mathrm{Var}(W\mid T)]+\mathrm{Var}(\mathbb{E}[W\mid T])$`. Recommend: replace every `\text{Var}` / `\text{Cov}` with `\mathrm{Var}` / `\mathrm{Cov}` for cross-page consistency. (Or, even better, lift `\Var`/`\Cov` into the shared KaTeX macro block, since neither variant is currently a macro.)
- **`\overset{d}{=}` (cosmetic).** §12 line 1674 introduces `\overset{d}{=}` for "equal in distribution," a delimiter that appears in no other Probability & statistics page nor in category-theory.html. Modes-of-convergence (§7) already established `\xrightarrow{d}` for the directional version; consider `\stackrel{d}{=}` or, for symmetry with §7's arrow style, an explicit phrase `the processes have the same law`. Low priority — KaTeX renders both fine.
- **`\xrightarrow{\mathbb{P}}` is fine** and matches standard convention; just noting for the cross-check that probability-theory and stochastic-processes-and-martingales agree on this one (`\xrightarrow{a.s.}`, `\xrightarrow{d}`, `\xrightarrow{\mathbb{P}}`, `\xrightarrow{L^p}` all appear in both, consistently styled).
- **`\sqrt{\text{Var}}` (line 846) is semantically odd in addition to cosmetic** — the radicand is a function name with no argument. Reads correctly only because `\text{Var}` typesets as Roman text; in `\sqrt{\mathrm{Var}}` the same problem persists. Prefer `\sqrt{\mathrm{Var}(X)}` for the standard deviation gloss.

### Undefined jargon
- **"UI" appears un-glossed in §11 (Martingales).** Line 1631 "M is uniformly integrable (UI)" is the first definition — fine — but line 1635 then uses "UI" in a `<div class="note">` as if the reader has internalised it. Low priority because §11 is the first place the term appears in this page; just flagging that a single sentence in the convergence statement could expand "UI" rather than rely on the parenthetical 4 lines earlier. The reference page (stochastic-processes-and-martingales §5) gives a one-sentence definition with the limit `$\lim_{K\to\infty}\sup_n\mathbb{E}[|M_n|\mathbf{1}_{|M_n|>K}]=0$` — probability-theory could borrow this for parity.
- **"Triangular arrays $X_{n,k}$" in §9 Lindeberg note (line 1304)** is used without prior introduction. Mainstream measure-theoretic-probability readers know it, but the page is otherwise generous about definitions; one-clause gloss ("a doubly-indexed family where the $n$-th row has its own length") would match the rest of the page's care. Low priority.
- **§12 Black–Scholes worked example (lines 1684–1686)** uses "risk-neutral measure" and "Itô's formula applied to $e^{-rt}\ln S_t$" — both technical terms for which the page has no callback. The cross-page callback at the bottom of §12 already points to stochastic-calculus.html#ito-integral and mathematical-finance.html#black-scholes-model, but the prose-level Itô / risk-neutral mentions arrive ~10 lines before the reader sees those callback links. Low-medium priority — consider an inline `$\dagger$`-style "see also: stochastic calculus" parenthetical right at the term introduction, or soften the example to avoid leaning on "risk-neutral" as a technical term.
- **"$\alpha$-stable distributions" in §9 (line 1302)** is dropped without callback — there's no current page on stable distributions to link to. This is fair scope-control prose ("here's where the story continues") but flagging in case a future Lévy-processes page is added; it would deserve a callback then.

### Tone mismatches
- **§12 has a leftover draft heading "Stays-a-preview."** Line 1682: `<div class="note"><strong>Stays-a-preview.</strong> Brownian motion here is a first-glance tour…`. This is almost certainly a typo / unedited heading that should read something like "Caveat — preview only." or "This is a preview." High priority — reads as unfinished copy. Recommend rewording to match the conversational-precise tone of, e.g., stochastic-processes-and-martingales §1's `<div class="note"><strong>Why filtrations?</strong>` (line 276).
- **Tone is otherwise on-template.** Hero subtitle (line 269) ends with "Every concept comes with a toy to poke" — exact mirror of the section peer's "Every concept is paired with a small simulator you can run" (stochastic-processes-and-martingales line 264). Worked-example bolded-leads, `.note` callouts, and per-section widgets all match the canonical category-theory.html cadence.

### Missing worked examples
- **§7 Modes of convergence has no widget.** All other §-headings on this page open with prose+definition then ship a `<div class="widget">`; §7 (lines 1107–1156) ends with a `<div class="quiz">` and no interactive. The natural toy is exactly the "typewriter sequence" / `n·1_{(0,1/n)}` counterexamples already named in the prose (line 1123) — a stepper that animates which mode each candidate converges in would close the gap. Medium priority because §7 is a pivotal section: the rest of the page (LLN, CLT, martingale convergence, Brownian) all rely on these modes.
- **§11 Martingales has no widget.** Lines 1614–1655 end with a quiz placeholder but no interactive. The peer page (stochastic-processes-and-martingales §2 "Discrete-time martingales") supplies a "biased random walk: raw $S_n$ vs. centered $S_n - n\mu$" widget that would translate directly. Cosmetic-but-real: every other section on probability-theory.html has a poke-able toy, and the §11 absence is conspicuous.
- §1, §2, §3, §4, §5, §6, §8, §9, §10, §12 all have one widget each — those sections are fine.

### KaTeX macros / formatting
- **No locally-introduced macros** (the page uses the standard repo-wide six: `\Spec`, `\Gal`, `\Hom`, `\tr`, `\ad`, `\ind`, identical to stochastic-processes-and-martingales.html and mathematical-statistics.html). No drift here.
- **Helper block (lines 185–243) matches the canonical category-theory.html / stochastic-processes-and-martingales.html block byte-for-byte** for `$`, `$$`, `SVG`, `ensureArrow`, `drawArrow`, `drawNode`, plus the page's own `randn` and `phi` — the latter two are reasonable page-local additions (math-statistics adds `Phi`, `logGamma`, `betaPdf` similarly). No deviation.
- **Widget chrome is uniform.** Every `<div class="widget">` uses `<div class="hd"><div class="ttl">…</div><div class="hint">…</div></div>` followed by SVG + `.row` controls + `.readout`. Matches house convention exactly.
- **`<title>` tags are present on every SVG** (e.g. line 287 `<title>Probability of events on rolling two dice</title>`) — a11y baseline is met.
- **Inline `\text{…}` for distribution names** (e.g. `$\text{Uniform}[0,1]$`, `$\text{Exp}(1)$`, `$\text{Bernoulli}(p)$`) is consistent within probability-theory.html and harmonises with mathematical-statistics.html's `$\mathrm{Exp}(\lambda)$` only on family — `\text{Bernoulli}` (probability-theory) vs. `\mathrm{Exp}` (mathematical-statistics §2 line 427) is a low-grade mismatch. Cosmetic.
- **Delimiters are standard** (`$`, `$$`, `\(`, `\)`, `\[`, `\]`); no invented delimiters. Good.

## Severity
minor polish

---
*Orchestrator reminder:* run `node scripts/rebuild.mjs` after any content changes so `content/probability-theory.json` and the rendered HTML stay in sync.
