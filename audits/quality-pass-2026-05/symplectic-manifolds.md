# symplectic-manifolds — pedagogical audit (2026-05)

**Section:** Geometry & topology
**Compared against:** differential-forms, morse-theory

## Summary
The page is structurally sound, well-paced, and on-tone with its peers — every numbered section carries a worked widget, helper-block and chrome match category-theory.html, and notation generally tracks the Geometry & topology conventions. Two semantic-drift concerns warrant attention: a chunk of vocabulary in §6 (Floer) lands before any pre-emptive definition or callback, and one widget readout (§5) misrepresents the Lagrangian condition for a non-zero `f(θ)dθ`.

## Findings
### Notation drift
- `\mathcal{L}M` is used at line 492 as the **free loop space** ("$\mathcal{A}_H$ on the free loop space $\mathcal{L}M$"), but in the same section line 363 `\mathcal{L}_{X_H}` denotes the **Lie derivative**. Same `\mathcal{L}` glyph, two different meanings on adjacent pages of prose — semantic clash; consider `LM` or `\Lambda M` for the loop space, or rename the Lie derivative to `\mathrm{Lie}_{X_H}`.
- `\ind(p)` (Morse index) appears in morse-theory.html (line 270) using the page's `\ind` macro. The symplectic page also has the macro defined in its loader (line 28) but never uses it; this is fine in isolation but the Floer "preview" (§6) talks about `\mu(x,y) = 1` (Maslov-like grading) without ever defining `\mu` or relating it to `\ind`. Cosmetic on its own; semantic when paired with the Floer/Morse callback.
- `\omega_1\ominus\omega_2` (line 446) introduces a non-standard `\ominus` for "twisted product" of symplectic forms with no prior definition. differential-forms.html and morse-theory.html never use this glyph. Low-priority: the surrounding text spells it out as `\pi_1^*\omega_1 - \pi_2^*\omega_2`, so a reader can decode it, but the symbol is essentially ad-hoc to this page.
- Capital `L` for the Lagrangian submanifold (`L`, `L_0`, `L_1`) is consistent with the Floer-callback wording in morse-theory.html line 494 — good. But the §6 widget readout (line 895) writes `H_*(L_0; ℤ/2)` while the surrounding prose talks about `|H_*(S^1)| = 2` (line 511) without saying which coefficient field — minor inconsistency between widget caption and readout.

### Undefined jargon
- "Floer's loop-space construction" appears in the page hero (line 260) — the very first sentence of the sub. Acceptable in a hero teaser, but no prereq callback explains it; first concrete use is §6, which is fine.
- §5 line 446: "**Canonical relations** (general Lagrangians of $M_1\times M_2$) **compose to give a symplectic category**." Both *canonical relation* and *symplectic category* are introduced in the same parenthetical with no prior definition. Quote: *"Canonical relations (general Lagrangians of M₁×M₂) compose to give a symplectic category."* No callback, no widget — pure name-drop.
- §3 line 363: "By **Cartan's formula** $\mathcal{L}_{X_H}\omega = d\iota_{X_H}\omega + \iota_{X_H}d\omega = 0$". Cartan's magic formula is not defined on this page; differential-forms.html introduces $d$ and the wedge but never names Cartan's formula either. The reader has to know $\iota_v$ and $\mathcal{L}_X$ on sight. Minor — the formula is spelled out in full so a careful reader can re-derive — but a one-line "this is Cartan's magic formula relating Lie derivative to interior product and $d$" would help.
- §6 piles in deep terms with no callback or definition: "**non-degenerate** time-1-periodic Hamiltonian" (line 488 — what does non-degenerate mean for a Hamiltonian, vs the form?), "$L^2$-gradient", "**compatible** almost-complex structure $J$", "**Cauchy–Riemann operator**", "**pseudo-holomorphic cylinders**", "$\mu(x,y)$", `\widehat{\mathcal{M}}(x,y)`. These are all rapid-fire in two paragraphs (lines 488–500). Section 6 is labelled "a preview" so a survey tone is appropriate, but the density jump from §1–§5 is jarring; a single sentence "Floer's setup pulls in several heavy tools we won't define here — almost-complex structures and the Cauchy–Riemann PDE — but the chain-complex skeleton is the same as Morse" would soften the wall.
- "**Hamiltonian-isotopic** deformation" in the §6 widget caption (line 511) and "Hamiltonian isotopy of L₁" in the readout (line 895) — the term "Hamiltonian isotopy" never appears in §3 (Hamiltonian flows) where it would naturally be introduced. Lower priority.

### Tone mismatches
- §6 ends with a near-textbook paragraph (lines 492–498) that defines $\mathcal{A}_H$, names its critical points, names its gradient lines, and asserts $\partial^2 = 0$ in five sentences with no narrative break. Compare morse-theory.html §5 / §7, which interleave each definition with a "why" sentence and a widget. The symplectic §6 has only one widget for the entire Floer treatment, after the wall of definitions.
- §7 (Connections) is a bare bulleted list of 5 cross-page links, each one sentence. morse-theory.html §9 (Connections) uses h3 sub-headings ("Differential geometry and gradient flow", "Algebraic topology and CW homology", "Lie groups and homogeneous spaces", "Symplectic and Floer-theoretic generalisations") and writes a short paragraph under each. differential-forms.html §9 also uses the prose pattern. The symplectic §7 reads more like a reference card than a walkthrough — drift toward terse style. Section 7 also lacks a quiz placeholder (no `<div class="quiz" data-concept="...">`) — consistent with the connections sections in the peers, so not a defect, just noting.
- §4 (Poisson) "Quantisation" note (line 417) adopts a slightly more breezy tone — "This is why classical mechanics is the limit of quantum mechanics" — that is on-brand for the corpus. No problem.

### Missing worked examples
- Every numbered section §1–§6 carries a widget with at least one knob; coverage is good.
- §6 widget (lines 502–512) is interactive but its readout text (line 895) hard-codes `|L₀ ∩ L₁| = 1` regardless of the slider position. The widget caption (line 511) tells the reader the count is *"at least 2"*, but the actual SVG only ever displays one intersection dot. Comment in the source at lines 882–887 confirms the author intentionally simplified to one point. **Semantic drift**: caption claims a lower bound of 2, widget shows 1. Either the caption needs to admit "we display only one of the two preimages under the torus identification" or the widget needs a second dot.
- §5 widget readout for the "constant α = 1 dθ" case (line 836) says *"integer p ∈ ℤ corresponds to degree of holonomy"* — accurate but lateral; the more pedagogically useful note (that any constant-coefficient $c\,d\theta$ is closed and gives a Lagrangian) is buried at the end. Low priority.
- §5 caption (line 459): *"Generic non-closed forms like f(θ)dθ with f non-constant give Lagrangian graphs only when f is a constant — that's the closedness obstruction."* Self-contradictory: "non-closed forms with f non-constant give Lagrangian graphs only when f is a constant" reduces to "they don't, except when they do" — should read "the graph of $f(\theta)d\theta$ is Lagrangian iff $f$ is constant (closedness)".

### KaTeX macros / formatting
- Helper block at top of `<body>` (lines 187–239) is byte-for-byte the canonical block from category-theory.html (`$`, `$$`, `SVG`, `ensureArrow`, `drawArrow`, `drawNode`). Clean.
- KaTeX loader macro list (lines 22–29) is the corpus-standard set: `\Spec`, `\Gal`, `\Hom`, `\tr`, `\ad`, `\ind`. No locally-introduced macros — good. `\ind` is loaded but unused on this page (used by morse-theory).
- Delimiters: `$…$`, `$$…$$`, `\(…\)`, `\[…\]` per house contract. No invented delimiters.
- `\hbar` (lines 418, 419, 425) is standard KaTeX, fine.
- `\widehat{\mathcal{M}}(x,y)` (line 497) and `\overline{u}` written as `\bar u` (line 493) — both standard KaTeX, no local macro abuse.
- Non-LaTeX glyphs in widget readouts (Unicode `ω`, `∂`, `∧`, `≡`, `ℤ`, `π`, `ℝ`, `½`, `·`, etc.) appear in raw `out.textContent =` strings (e.g. lines 592, 663, 832, 836, 895). This is the shared house pattern for `<div class="readout">` content (peers do the same), so not a drift — just noting that the readout text is intentionally KaTeX-bypassing.
- `\leadsto` (lines 418, 425) for the Dirac correspondence is supported KaTeX and pedagogically apt, but neither peer uses it. Cosmetic.

### Helper-block / widget-chrome hygiene
- Every widget uses the canonical chrome: `<div class="widget">` with `<div class="hd"><span class="ttl">…</span><span class="hint">…</span></div>`, `.row`, `.readout`, `<svg viewBox=…>` with `<title>` inside. Confirmed for all six widgets (`#w-form`, `#w-darboux`, `#w-ham`, `#w-poisson`, `#w-lag`, `#w-floer`).
- All SVGs include `viewBox` and an inner `<title>` element — passes the audit-accessibility convention.
- `.note`, `.ok`, `.bad` classes used in callouts (lines 272, 319, 355, 406, 417, 441, 488, 533) — consistent with peers. No ad-hoc class names spotted.
- `aside.callback`, `aside.related`, `details.changelog` blocks all present and bounded by the auto-fence comments — injectors will idempotently update.
- One peer (`differential-forms.html`) sources `./js/widget-diagram-editor.js` only because of legacy script injection in the `<head>`; the symplectic page also includes it (line 179) even though no diagram-editor widget is on the page. Same dead-script load in morse-theory.html — corpus-wide pattern, not a drift on this page.

## Severity
minor polish
