# numerical-analysis — pedagogical audit (2026-05)

**Section:** Analysis
**Compared against:** partial-differential-equations, variational-methods

## Summary
The page reads well — clear concept-per-section progression, good widgets, voice consistent with the Analysis-section peers. Two real issues: every section's `<aside class="callback">` block appears *twice* (once auto-fenced, once duplicated raw), and a handful of FEM-specific terms (coercivity, bilinear form, $H^1_0$) appear without local definition or visible callback.

## Findings

### Notation drift
- `\mathbb{R}` consistently used (lines 374, 694, 966) — matches PDE and variational-methods, no drift.
- `^\top` for transpose (line 701, `LL^\top`) is consistent with the corpus convention; no drift here.
- §6 mixes display-math notation styles: stiffness matrix introduced as `K\mathbf{c}=\mathbf{b}` (boldface for vectors) but elsewhere on the same page, e.g. §4 line 694, vectors are plain italic (`Ax=b`, `x^{(k)}`). Cosmetic, low priority — pick one and use throughout.
- Final §7 heading is `<h2>Connections</h2>` (no number, line 1146); §1–§6 use the numbered `1. … 6. …` pattern. partial-differential-equations.html uses `<h2>7. Connections</h2>` (numbered); variational-methods uses unnumbered. Mixed convention across the section, but flagging as low-priority drift inside this page.

### Undefined jargon
- §4 "spectral radius of the iteration matrix is $<1$" (line 796) — *spectral radius* used without definition or callback to functional-analysis / spectral-theory. The Hilbert-space callback at line 803 only references "Banach & Hilbert spaces", not spectral radius.
- §6 first sentence introduces "the *weak* form of the PDE" and immediately uses `H^1_0` (line 966) before defining it. The PDE peer page (line 893) explicitly defines $H^1_0$ as "Sobolev functions with zero boundary trace, the natural home for Dirichlet conditions". The callback at line 1128 ("the $H^1_0$ home") is a hint, not a definition. A one-sentence prose nudge ("Sobolev space of $L^2$ functions with $L^2$ gradient and zero boundary trace — see callback") would close the gap.
- §6 invokes "Lax–Milgram" (line 968) one sentence after the weak form — no callback to PDE §6 (where it is the topic of the entire section, line 1046 of partial-differential-equations.html). Recommend adding a `partial-differential-equations.html#regularity` callback alongside the existing `weak-solutions` link.
- §6 "**continuity and coercivity constants** of the bilinear form" (line 1119) — *coercivity* and *bilinear form* both first appear here without prior mention; the PDE peer (line 897) defines them when it introduces $a(\cdot,\cdot)$. A half-sentence aside ("a continuous, coercive bilinear form — bounded above and below in the $H^1$ norm") would suffice.
- §6 "**Aubin–Nitsche duality argument**" (line 1121) appears as a named technique without explanation; even one sentence ("test the dual problem against the error") would orient the reader.

### Tone mismatches
- Voice is broadly consistent with the Analysis peers — confident, direct, occasional second-person ("watch the tangents", line 393), worked mini-arguments. No drift into dry textbook voice or over-casual register.
- Two micro-passages skew slightly drier than the peers' typical rhythm:
  - §4 "Direct factorizations" table (line 697) is presented bare without surrounding narration — the variational-methods §1 table (line 1131) and the PDE §1 table (line 270) both bracket their tables with at least one motivating prose line *and* a closing observation. Add a one-liner under the §4 table summarizing the moral ("which factorization to reach for is dictated by structure: symmetry favours Cholesky, rectangularity forces QR, etc.").
  - §3 jumps from the Newton–Cotes / Gauss–Legendre / Adaptive bullet list (line 522) directly into "Composite trapezoid and Simpson" without a transition. The PDE peer typically eases into each subsection with a one-line motivator.

### Missing worked examples
- All six numbered sections (§1–§6) have at least one interactive widget with a worked computation — `w-fp`, `w-newton`, `w-quad`, `w-cond`, `w-cfl`, `w-fem`. Coverage is solid.
- §4 "Iterative methods" subsection (line 795 onward) has no associated widget — the §4 widget covers Hilbert-matrix conditioning, but Jacobi / Gauss–Seidel / CG iterative convergence is described only in prose. A small "iterate Jacobi vs CG on a 2×2 SPD" toy would round out the section. (Low priority — §4 already has one widget, so no section is widgetless.)

### KaTeX macros / formatting
- Helper-block (lines 187–239) matches category-theory.html verbatim — `$`, `$$`, `SVG`, `ensureArrow`, `drawArrow`, `drawNode` all present. No drift.
- KaTeX macros block (lines 22–29) is the canonical `\Spec / \Gal / \Hom / \tr / \ad / \ind` set — identical to PDE and variational-methods. No new macros invented.
- §1 line 269 uses Unicode "ε_M" in widget readout text (acceptable — readouts are plain text), but the same prose paragraph mixes `\varepsilon_M` (KaTeX) and `ε_M` (plain Unicode in the SVG label "1/ε_M ≈ 10¹⁶", line 762). Cosmetic — preferred convention is KaTeX in math contexts, Unicode in SVG labels (which the page already follows). No action needed.
- Widget chrome (`.widget`, `.hd`, `.ttl`, `.hint`, `.row`, `.readout`, `.note`, `.bad`, `.pill`) — all standard. No ad-hoc classes invented.

### Callback / structural hygiene (semantic)
- **High priority:** every section §1–§6 emits its `<aside class="callback">` block twice — once inside `<!-- callback-auto-begin --> … <!-- callback-auto-end -->` fences (the canonical injector output), and again immediately after the quiz placeholder as an unfenced duplicate. Counts: numerical-analysis = 12 callback asides, partial-differential-equations = 5, variational-methods = 5. Examples in numerical-analysis.html: lines 347 + 362 (§1), 496 + 509 (§2), 674 + 682 (§3), 803 + 816 (§4), 944 + 953 (§5), 1124 + 1133 (§6). The duplicated copy is unfenced so `audit-callbacks.mjs --fix` will not strip it. Reader sees the same "See also" twice per section. Hand-deletion (or extending the fix script) required.

## Severity
minor polish — duplicated callback asides are the only must-fix; jargon callbacks in §6 are worth doing; remainder is cosmetic.
