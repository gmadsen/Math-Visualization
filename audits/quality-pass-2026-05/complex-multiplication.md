# complex-multiplication — pedagogical audit (2026-05)

**Section:** Number theory
**Compared against:** class-field-theory, algebraic-number-theory

## Summary
A strong, voice-consistent page with a worked widget in every numbered section and a well-staged opening Reader's note that declares prereqs. The main issues are notational (mixed `\mathrm{...}` vs `\operatorname{...}` for operator names that the page-level macro block already provides) and a missing `aside.callback` CSS block that leaves cross-page callbacks unstyled.

## Findings
### Notation drift
- Target writes `\mathrm{End}(E)` (lines 254, 261, 263, 265, 436, 507) and `\mathrm{Cl}(\mathcal{O}_K)` (lines 440, 450, 534, 702), while `class-field-theory.html` consistently uses `\operatorname{Cl}(K)` (lines 492, 494, 626, 745, 749, 751, 886, 890) and `\operatorname{Frob}_\mathfrak{p}` (lines 733, 735, 737). Cosmetic but inconsistent across the section. (Note: `algebraic-number-theory.html` itself uses `\mathrm{Cl}(\mathcal{O}_K)` at line 530, so the section already has internal drift — settling on `\operatorname{Cl}` as the canonical CFT-style would unify all three; or wiring a `\Cl` macro into the head block.)
- Target writes `\mathrm{Frob}_\mathfrak{p}` (line 805) and `\mathrm{Tr}_{H/K}` (line 540) in display math, while CFT uses `\operatorname{Frob}_\mathfrak{p}`. The page-level KaTeX macro block (lines 22–29) already defines `\Gal`, `\Hom`, `\tr`, `\ad`, `\ind`, `\Spec` via `\operatorname` — extending it with `\End`, `\Cl`, `\Frob` would resolve the drift in one place.
- Argument-of-class-group convention drifts inside the target itself: `\mathrm{Cl}(\mathcal{O}_K)` in display math (lines 440, 534, 702) but `Cl(K)` in widget readout text (line 605, 837 are CFT, but target's widget at line 763 writes `Cl(O_K)` as text). Pick one (`Cl(K)` is shorter; references prefer it).
- Cosmetic: target's widget readouts use Unicode `𝔭`, `𝔞`, `Γ`, `σ`, `√`, `ω`, `ζ` etc. (lines 758, 763, 842), matching CFT's widget style. Consistent — no action.

### Undefined jargon
- "Néron–Tate height" appears at line 542 (`§3 cm-heegner`) inside the Gross–Zagier formula sentence with no parenthetical definition or callback. The Reader's note declares CFT and elliptic-curves as prereqs, but Néron–Tate height is not standard in either. Either gloss it (e.g. "the canonical quadratic height $\hat h$ on $E(K)$") or add a `<aside class="callback">` to `bsd.html#height` or `heights-arithmetic-geometry.html`.
- "Kolyvagin's Euler-system argument" (line 546) and "Kolyvagin's theorem (1989)" (line 895) appear without a one-line gloss of what an Euler system is or what Kolyvagin proved (bound on Selmer / finiteness of Sha for analytic rank ≤ 1). Reasonable for an advanced CM page, but a short parenthetical would help.
- The widget readout at line 635 emits `h_K · 2^{ω(N)} / |Pic(O_K)/N|` — `Pic(O_K)/N` is undefined and not standard notation; `ω(N)` (number of distinct prime factors) is also unintroduced. Surfacing this in a user-facing readout without explanation is jargony. Either replace with the simpler "≈ h_K · 2^{(# split primes of N)}" or define inline.
- "Weber function" (line 675) is named ("essentially the $x$-coordinate, normalized to be Galois-invariant…") — the gloss is enough for an advanced page, no action.
- "elliptic units" (line 895) is mentioned but never linked or defined; flagged as minor since it's in the closing summary of §6.

### Tone mismatches
- Voice is consistent with both references (conversational-but-precise, second-person occasional, mini-examples). Sentences like "No abstract Frobenius gymnastics — just compute one transcendental function at one quadratic irrationality" (line 450) and "the only way $e^{\pi\sqrt{|D|}}$ can land near an integer is if $j(\ldots)$ *is* an integer" (line 954) match CFT's tone register.
- _None._ flagged as drift.

### Missing worked examples
- Sections 1–6 each contain a working interactive widget (`cm-tau`, `cm-hcp`, `cm-heegner-w`, `cm-frob`, `cm-cmtype`, `cm-heeg-num`). Section 7 is "Connections" — pure crosslinks, matches house pattern (CFT §9, ANT §8 are similar).
- _None._ flagged as missing.

### KaTeX macros / formatting
- Target loads `js/widget-diagram-editor.js` (line 170) but no `data-diagram-editor` widget is present on the page. Dead include — drop it.
- Target's `<style>` block is missing the `aside.callback` CSS fence (`/* callback-css-auto-begin */ … /* callback-css-auto-end */`) that both references carry (CFT lines 127–142, ANT lines 127–142). Without it the four `<aside class="callback">` blocks in the body fall back to unstyled defaults (no border, no background, no `.ttl` uppercase tracking). This is a high-priority chrome bug — the cross-page callback aesthetic is a house convention.
- Macros block (target lines 22–29) is byte-identical to the references' macros block — good. No new locally-introduced macros, no re-invented delimiters.
- Helper script block at top of `<body>` (target lines 178–230) is verbatim from `category-theory.html` (`$`, `$$`, `SVG`, `ensureArrow`, `drawArrow`, `drawNode`). Good.
- Widget chrome (`.widget`, `.hd`, `.ttl`, `.hint`, `.row`, `.readout`, `.note`, `.ok`, `.bad`) is used consistently; no ad-hoc classes spotted.
- Hex literals appear inside `<style>` (e.g. `#0b0f16`, `#cbd5e1`, `#fff`) — matches references; these are inside the original-six CSS block and not flagged by `color-vars.mjs` for topic pages.

## Severity
minor polish
