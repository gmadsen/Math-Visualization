# d-modules — pedagogical audit (2026-05)

**Section:** Algebraic geometry
**Compared against:** microlocal-analysis, etale-cohomology

## Summary
A polished, conversational page that hits the genre's expected beats: 6 numbered sections each with a definition note, a worked example, and a widget; tone and notation track microlocal-analysis closely (both use `\mathrm{Char}`, `\mathrm{WF}`, `\mathcal{D}_X`, `\mathcal{O}_X` in the same style). A handful of low-priority undefined terms and one widget label that misrepresents its content are the only issues worth a follow-up pass.

## Findings
### Notation drift
- _None of significance._ `\mathrm{Char}(M)` and `\mathrm{Char}(P)` use the same wrapper as microlocal-analysis (line 401 here, line 584 there). `\mathcal{D}_X`, `\mathcal{O}_X`, `T^*X`, `\mathrm{Mod}_h`, `\mathrm{gr}^F` all match the references' conventions. KaTeX `macros` block at lines 22-29 is the standard six-macro set shared by both references — verbatim copy.
- Cosmetic only: section 4 uses `D^b_{\mathrm{rh}}(\mathcal{D}_X)` and `D^b_{qc}(\mathcal{D}_Y)` — the `qc` subscript is in plain text rather than `\mathrm{qc}` (line 373). Inconsistent within the same page versus the `\mathrm{rh}` next to it (line 469). Low priority.

### Undefined jargon
- "six-functor formalism" first appears at line 374 ("these are the six-functor formalism for D-modules") with no callback or one-line gloss. Not defined anywhere on the page. The reader either knows it from elsewhere or sees only a name. Compare microlocal-analysis, which always sketches the object before naming it (e.g. "parametrix" gets a full paragraph before the name lands at §4).
- "Gevrey class 0" appears once at line 460 in the regularity definition with no gloss. Microlocal-analysis avoids the term entirely; if the page wants it, a parenthetical "(formal-power-series solutions converge — no super-exponential coefficient growth)" would close the loop.
- "BBD decomposition theorem" appears in the connections list at line 632 with no expansion of the acronym. Etale-cohomology likewise mentions it but with "Beilinson-Bernstein-Deligne" once. Low priority.
- "indicial equation" / "indicial roots" appear at line 533 ("read off the indicial equation at each singular point") with no definition or callback to ODE / Frobenius method. The reader needing this is plausibly the same one needing the rest of section 5.
- "Sato-Kashiwara-Kawai involutivity" (line 411) and "argument of Gabber" (same line) are dropped without context. The Bernstein's-inequality proof sketch leans on three named results in one sentence.

### Tone mismatches
- _None significant._ Voice matches the references — second-person "we will see" (line 324), conversational "small in the right sense" (line 289), the "slogan of D-module theory" framing in the opening paragraph. No drift into dry-textbook or meme tone.
- Section 7 "Connections" is the densest paragraph on the page (line 627 is a 200-word run-on naming D'Agnolo-Kashiwara, Mochizuki, Kedlaya, Berthelot, Caro, Abe, Beilinson-Drinfeld, geometric Satake in one breath). Microlocal-analysis's connections section (read in the references) is a clean bulleted list. The bulleted `<ul>` that follows here is fine; the preamble paragraph could be split or trimmed.

### Missing worked examples
- Every numbered section (1-6) has a widget. Counts: 6 widgets, 6 quizzes, all section anchors match concept ids (weyl/dx/holonomic/riemann-hilbert/pde/bs-polynomial). Section 7 is the connections-only closer (no widget needed, matching microlocal-analysis §7).
- Section 4 RH widget (`w-rh-circle`) covers only the rank-1 case $z^\alpha$ on $\mathbb{C}^*$. The text claims "On a higher-dimensional $X$ the equivalence is genuinely structural" (line 490) but the reader has no toy for that. A second widget showing how a sub-perverse-sheaf chunk corresponds to a sub-D-module would land the higher-dim case; not blocking, just noting the asymmetry.

### KaTeX macros / formatting
- Helper script block (lines 187-239) is verbatim from the reference: `$`, `$$`, `SVG`, `ensureArrow`, `drawArrow`, `drawNode` all match microlocal-analysis lines 187-234. No deviations.
- Page declares no local KaTeX macros beyond the standard six (`\Spec`, `\Gal`, `\Hom`, `\tr`, `\ad`, `\ind`). Uses `\Hom` from the macro block (line 266, 438, 511) consistently.
- Widget chrome uses `.widget / .hd / .ttl / .hint / .readout / .row / .note` correctly throughout. No ad-hoc classes detected.
- `<select>` options in `#weyl-p`, `#weyl-q`, `#bf-pick` contain LaTeX (`$x$`, `$\partial^2$`, `$x^2 + y^3$ (cusp)`, etc.); `js/katex-select.js` is loaded at line 178 — wiring is correct.
- Plain-text fallbacks in widget readouts (`O_X`, `D / D · ∂`, `T*A^1`, `δ_0`, `α`) are ASCII-style for the `pre-wrap` `.readout` divs, which is the standard pattern across both references — fine.
- Cosmetic: the `w-charvar` widget's "zero" button is labeled `$M = \mathbb{C}[x]\,e^x$` (line 429) but the readout body (line 731-734) describes it as the irregular example with `Char = zero section` — the data-key `zero` matches the cotangent picture (zero section) but the user-facing button label is `e^x`. The label and the kind name are coherent if you read both, but the `data-mod="zero"` slug is confusing — easy to misread as "M = 0". Suggest renaming the data-key to `irreg` or `expx` for self-documentation. Cosmetic, no functional bug.

## Severity
minor polish
