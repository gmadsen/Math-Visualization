# geometric-measure-theory — pedagogical audit (2026-05)

**Section:** Analysis
**Compared against:** measure-theory, harmonic-analysis-fourier

## Summary
Strong page overall: notation matches both peers, every numbered section ships a working interactive widget, and the prose voice is recognizably the notebook's. The standout polish issues are dense expository walls in §6 (Applications) and one widget-hint that promises an interaction the renderer doesn't support.

## Findings
### Notation drift
- _None of consequence._ `\mathbb{R}` / `\mathcal{H}` / `\mathcal{L}` / `\mathbf{M}` / `\mathrm{BV}` are used identically in `measure-theory.html` (`\mathcal{H}^s`, `\mathcal{L}` etc., line 1714) and `harmonic-analysis-fourier.html` (`\mathcal{S}`, `\mathcal{F}` etc., line 683). `\restriction` (lines 272, 538, 540) is non-trivial but is a documented KaTeX macro (it appears in `latex-cheatsheet.html` line 518 and in `cohomology-and-duality.html` and `zfc-and-ordinals.html`) — not drift.
- Cosmetic: hyphenated proper-noun pairs are inconsistent within the page itself — "Federer–Fleming" with en-dash (line 1217 heading, line 243 TOC) coexists with "Federer-Fleming" with hyphen (lines 1219, 1425, 1622). Same for "Mumford–Shah" vs "Mumford-Shah" and "Ambrosio-Kirchheim". Low priority but jarring on the same page; reference pages standardize on en-dashes ("Riemann–Lebesgue", "Hausdorff–Young").

### Undefined jargon
- "distributional gradient" (§1, line 262, the very first sentence of body content) is used before any pointer to its meaning. The §1 callback does link to `sobolev-spaces-distributions.html#weak-derivative` further down (line 514), but a forward note at the point of first use would help. Quote: *"its distributional gradient is a finite vector-valued Radon measure"*.
- "Radon measure" (§1, line 262, same sentence) likewise appears with no callback to where it is defined. The measure-theory peer never uses the unqualified phrase "Radon measure" without prior buildup either, so the jargon-density at the page's opening sentence is the highest-load moment in the page.
- "Rellich-type embedding" (§1, line 276) is used parenthetically as a shorthand. No callback is wired to functional-analysis or sobolev-spaces; relies on the reader recognizing the name.
- "Grassmannian bundle" (§6, line 1427) introduced without definition, then immediately conscripted into the varifold definition. Reader without prior Grassmannian exposure has no fallback.
- "Sard's theorem" (§4, line 922) name-dropped parenthetically — fine if the audience is graduate, but a one-clause gloss ("almost every value is regular") would mirror the gentle voice elsewhere.

### Tone mismatches
- §6 (Applications) is the worst-offending wall on the page: paragraph at line 1427 packs varifolds, integral varifolds, stationary varifolds, Allard's regularity theorem, the dimensions-≤-7 chain, *and* the Simons cone into a single 7-line block with no whitespace. Compare to the rhythm of `measure-theory.html` §13, which paces with `<div class="ok">` panels and three short worked examples (Cantor / Koch / Sierpiński, lines 1722–1723) — each idea earns its own beat. The §6 paragraph at line 1433 (Mumford-Shah) repeats the same density problem.
- §6 also drops into terse name-shorthand: *"De Giorgi-Carriero-Leaci then close the singular set $K=\overline{J_u}$ via density estimates: GMT making a computer-vision functional rigorous."* (line 1433). The "GMT making X rigorous" coda is half-sentence and reads as a textbook paraphrase rather than the conversational gloss the reference pages cultivate.
- Otherwise tone is on-model: §1's *"Why widen $W^{1,1}$ to $\mathrm{BV}$?"* (line 270) and §3's *"measure-theoretic smoothness reduces to a one-dimensional limit at almost every point"* (line 703) match the second-person, motivation-first cadence of `measure-theory.html` §1 (line 268, *"Riemann's construction integrates a bounded function …"*).
- Light meta-tone tic: "(§5)" / "§2 and §4" cross-references in body prose (e.g. line 276, line 1425) replicate the section-pointer style fine, but the §3→§4 transition paragraph at line 705 reads more like a textbook bridge than a "now you can poke this" handoff.

### Missing worked examples
- _None._ All six numbered sections have an interactive widget: §1 BV decomposition splitter, §2 Koch-refinement perimeter, §3 rotating projection (rectifiable vs Cantor), §4 coarea Cavalieri sum, §5 click-to-build oriented chain, §6 Plateau / Mumford-Shah toggle. Each widget produces a numerical readout linked back to the formula in prose.
- One pseudo-issue: the §6 "Plateau" half of `gmt-plateau` shows fixed endpoints `A=[-130, 60]` and `B=[140, -50]` (lines 1574); the hint at line 1438 says *"drag boundary points; widget shows the minimal connecting curve, then toggle to MS edge detection"* — but no drag handler is wired up. Either the hint should be rewritten to match the static demo, or the drag should be implemented. This is interactivity-claim drift, not a missing-example issue.

### KaTeX macros / formatting
- The page declares the standard six-macro set in its loader (`\Spec`, `\Gal`, `\Hom`, `\tr`, `\ad`, `\ind`, lines 23–28) — verbatim copy of `measure-theory.html` and `harmonic-analysis-fourier.html`. None of those six are actually invoked in the body of `geometric-measure-theory.html`; harmless but worth knowing the loader is boilerplate-cloned.
- Operators are uniformly `\mathrm{div}` (lines 268, 530), `\mathrm{spt}` (line 1217), `\mathrm{BV}`, `\mathrm{SBV}`, `\mathrm{loc}`. Reference pages use the same `\mathrm{}` style (`\mathrm{div}` doesn't appear in either, but `\mathrm{p.v.}`, `\mathrm{id}`, `\mathrm{diam}` appear in harmonic and measure pages with the same `\mathrm{}` convention). No drift.
- Helper block (lines 187–235) is a verbatim copy of the `category-theory.html` 2D helper — `$`, `$$`, `SVG`, `ensureArrow`, `drawArrow`, `drawNode`. Spot-checked against `measure-theory.html` lines 187–234: byte-identical.
- Widget chrome conforms: `.widget` / `.hd` / `.ttl` / `.hint` / `.row` / `.readout` / `.small` used throughout (e.g. lines 278, 544, 707, 928, 1221, 1437). No ad-hoc classes introduced.
- Color tokens: all SVG fills/strokes use `var(--cyan)`, `var(--pink)`, `var(--violet)`, `var(--yellow)`, `var(--mute)`, `var(--line)`. No raw hex inside widgets.
- Cosmetic LaTeX-in-`<option>` hygiene: §4's coarea selector (lines 932–937) uses `$u = x^2 + y^2$` etc. inside `<option>`. The `js/katex-select.js` shim is loaded at line 178, so KaTeX in the dropdown should render — consistent with the AGENTS.md "LaTeX inside `<option>` requires `js/katex-select.js`" note.

## Severity
minor polish
