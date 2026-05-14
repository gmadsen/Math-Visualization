# semigroup-theory-evolution-equations — pedagogical audit (2026-05)

**Section:** Analysis
**Compared against:** partial-differential-equations, functional-analysis

## Summary
A strong, technically dense page that mostly fits the house style (helper block verbatim, widget chrome correct, color tokens used). The main pedagogical risks are (a) drift between TeX `C_0` and Unicode "C₀" in headings/captions, (b) several technical terms used as casual asides without callbacks (UMD spaces, Lebeau–Robbiano, geometric control condition, wavefront set in §4 prose), and (c) one widget readout — §6 control — that mixes "naive projection" with the "$e^{c/T}$ observability cost" in a way the reader is asked to take on faith.

## Findings
### Notation drift
- C-zero subscript is split across two encodings: TOC + `<h2>` + widget titles use Unicode "C₀" (e.g. line 209 `C₀ semigroups`, line 230 `(C₀) semigroups`, line 251 `C₀ semigroup law`), while every body paragraph uses TeX `$C_0$` (e.g. line 240, line 468, line 610). PDE/FA peers do not face this; the page's own tone says `$C_0$-semigroup` consistently in prose. Cosmetic drift, but heading-vs-body inconsistency is visible to the reader.
- Bold-namespace symbol style: target writes `\mathrm{Re}\langle Ax,x\rangle` and `\mathrm{range}(\lambda - A)` (line 618). Functional-analysis.html and the loader's macro list prefer `\operatorname{...}`; nothing else on this page uses `\mathrm` for an operator. Low-priority cosmetic, but the loader already exposes `\Hom`, `\tr`, `\ad` via `\operatorname` — `\Re` is a built-in KaTeX, and `\operatorname{range}` would match the house pattern.
- Subscripted norm tag inconsistency: `\|T(t)\|_{B(X)}` (line 244, line 614) vs unsubscripted `\|T(t)\|` everywhere else (e.g. line 248, line 616, line 776). PDE peer never tags `B(X)`; FA writes `T \in B(X)` but does not subscript norms with it. Low priority but the page is inconsistent with itself.
- The §1 readout uses ASCII `omega`, `lambda`, `Delta` and `<= 1` text in widget output (line 437–438, line 590, line 728–736, line 890); the body prose uses full TeX. Readouts in PDE and FA generally render arithmetic in plain text without giving up on `≤` / `σ` / `λ` Unicode. Cosmetic; no semantic risk.
- Unicode versus TeX collision in widget titles: `Duhamel's formula: u(t) = T(t)u₀ + ∫₀ᵗ T(t−s) f(s) ds` (line 926) sets the formula in raw Unicode while the surrounding hint (line 933, label `$t$:`) is TeX. PDE and FA put titles in plain English and put formulas in the body; this widget instead puts the formula in the title bar, which makes the Unicode/TeX seam visible.

### Undefined jargon
- "UMD space" (line 773): "If $A$ generates an analytic semigroup on a UMD space (a Banach space where the Hilbert transform is bounded — includes every $L^p$ with $1<p<\infty$)" — the parenthetical is the only definition. UMD is not a prereq from any other page in this section; the gloss is fine but the sentence also introduces "Hilbert transform" without callback, and "maximal $L^p$ regularity" is named as the concept of interest with no widget or worked example.
- "geometric control condition" (line 1053): named and credited to Bardos–Lebeau–Rauch in one parenthetical, no callback, no further explanation. A reader who does not already know what a billiard trajectory is in this context cannot use the sentence pedagogically.
- "Lebeau–Robbiano" (line 1184, in the §6 widget readout): "The exponential blow-up $e^{c/T}$ is the observability cost (Lebeau-Robbiano: short horizons need exponentially expensive controls)." Named in a readout the reader sees before any definition of observability.
- "wavefront set" (line 776) appears in body prose with the gloss "the phase-space record of singular directions" plus a link to `microlocal-analysis.html#wavefront`. This one is fine — the link IS the callback. Including it for completeness so reviewers don't re-flag.
- "Yosida approximation" / "Yosida approximant" (lines 620, 624) is defined locally — fine — but the §3 widget readout uses both "$A_\lambda$" and "Yosida approximant" interchangeably without a one-line tie-back to the definition above. A reader who scrolls straight to the widget sees `$A_\lambda$ = lambda^2 (lambda-A)^{-1} - lambda I` (line 729) without prose anchor.
- "blow-up criterion" (line 1051) is used as if standard. PDE peer doesn't define it, no link; first-time reader may not parse `$\limsup_{t\to T_{\max}}\|u(t)\|=\infty$` as the criterion's content.
- "Mild solutions of Kato" (line 1051) is a name-drop without definition; "Fujita's theorem on critical exponents" likewise. These are tolerable as breadcrumb references but they pile up in one sentence.

### Tone mismatches
- §6 reads as a survey checklist (three lettered subsections (a), (b), (c) packed with eight named theorems — Fujita, Kato, Hahn–Banach, Bardos–Lebeau–Rauch, Itô, Feynman–Kac, Da Prato–Zabczyk plus the §7 hero — in roughly 25 lines). PDE peer §6 takes three theorems (Lax–Milgram, elliptic regularity, Sobolev embedding) and gives each its own `<h3>` and a paragraph with worked specifics. FA peer §6 ("the big four theorems") similarly individuates. Recommend breaking §6 into `<h3>` subheads or trimming the name-drop density to 1–2 per paragraph.
- §1 prose passage "signed time" (line 248: "$\|T(t)\|\le 1$ in the energy norm, signed time") — terse-poetic phrasing not seen in peers. PDE and FA prefer a full clause; here the reader has to guess "signed time" = group not just semigroup. Low priority.
- Widget readouts use casual "This IS the semigroup law made visible." (line 437) capitalization for emphasis. Peers achieve the same effect with em-dashes or italics; the all-caps "IS" is a one-off.
- §6 widget readout: "moving omega away from the target's center makes the cost worse" (line 1183) is conversational in a way that breaks the formal framing the rest of §6 establishes. The cost expression `Tcost = exp(1/T) * target * (1 + d) / sqrt(area)` (line 1134) is a heuristic dressed as LQR — the readout calls it "LQR-style" (line 1183) but the formula has none of the LQR structure (no Riccati, no `B^*`, no quadratic state cost). Semantic concern: a reader could come away thinking that formula IS the LQR control cost.

### Missing worked examples
- §6 (Applications) has one widget (`#sg-control`) covering only the control sub-application; the nonlinear-PDE and stochastic-flow subsections (a) and (c) get no toy. Per AGENTS.md ("every numbered `<h2>` section should have at least one concrete computation or widget"), §6 is technically covered, but two of three sub-stories run as text-only. PDE peer and FA peer typically pair every named theorem with either a widget or a numerical worked computation.
- §7 (Connections) is link-only — fine and matches PDE/FA convention.
- §4 (analytic semigroups) defines maximal $L^p$ regularity but doesn't show it on a single example; the §4 widget covers only "instant smoothing" (the first bullet), not maximal regularity. A small worked $L^2$-in-time computation, even on the heat equation, would close the loop.

### KaTeX macros / formatting
- No new macros are defined in the loader; the page reuses the standard six (`\Spec`, `\Gal`, `\Hom`, `\tr`, `\ad`, `\ind`) byte-identical with the peers. `\mathrm{Re}` and `\mathrm{range}` are inline `\mathrm{}` patterns rather than macros — see Notation drift above.
- Helper block (lines 156–205, `$`, `$$`, `SVG`, `ensureArrow`, `drawArrow`, `drawNode`) is byte-identical to the PDE peer (lines 187–238) and FA peer (lines 186–235). Spot-check passes.
- Widget chrome: every `<div class="widget">` has the standard `<div class="hd"><div class="ttl">…</div><div class="hint">…</div></div>` pattern; `.row`, `.readout`, `.small` are used as the house style requires; no ad-hoc classes detected.
- Color usage: every paint attribute reaches for `var(--cyan)`, `var(--violet)`, `var(--yellow)`, `var(--green)`, `var(--mute)`, `var(--ink)` — no raw hex inside widgets. `:root` palette declaration matches peers.
- Delimiters: only the four house delimiters (`$…$`, `$$…$$`, `\(…\)`, `\[…\]`) appear; no inventions.
- One small inline-LaTeX risk in §5 is the matrix `A=\begin{pmatrix}0&I\\\Delta&0\end{pmatrix}` (line 915). KaTeX should render this fine, but the triple-backslash before `\Delta` is the kind of thing worth eyeballing in a browser to confirm it doesn't render as `\Delta` literal text.

## Severity
minor polish
