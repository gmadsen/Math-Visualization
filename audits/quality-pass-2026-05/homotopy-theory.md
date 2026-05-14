# homotopy-theory — pedagogical audit (2026-05)

**Section:** Geometry & topology
**Compared against:** algebraic-topology, cohomology-and-duality

## Summary
Prose is strong, well-cross-linked, and matches house tone — but several widget SVGs render math as plain ASCII (`Z`, `Z/2`, `π_n`) where the surrounding prose uses `\mathbb{Z}`, and a handful of unstated terms in §§4–6 sit slightly above the page's own difficulty bar.

## Findings

### Notation drift
- `\mathrm{Hom}(\pi_n(X),\mathbb{Q})` at line 542 vs the page-defined macro `\Hom` (head, line 25) and `\Hom_{\mathbb{Z}}` in cohomology-and-duality.html:268. Cosmetic but inconsistent — the macro exists; use it.
- `\mathrm{colim}_n` at lines 461, 479, 578 — not in the shared macro list and absent from both references. Other pages spell out `\operatorname{colim}` or write a one-shot `\mathrm{colim}` only when nothing standard is available; here it appears three times so the macro would pay for itself, or at minimum stay consistent (currently `\mathrm{colim}_n\,\Omega^n E_n` and `\mathrm{colim}_k\,[\Sigma^k X,\,E_{n+k}]_*` use the same form, fine).
- `\mathrm{Sq}^i` (line 422) — fine on its own; no peer-page convention to drift from.
- Widget SVG text strings use raw ASCII `Z`, `Z/2`, `Z/24`, `Z/2 ⊕ Z/2` (homotopy-theory.html:828–834, 936–937) and bare unicode `π_n`, `H_n`, `S^2`, `X_∞`, `X_1 = pt` (lines 722–723, 793–797). The prose around these widgets uses `\mathbb{Z}`, `\mathbb{Z}/2`, `\pi_n`, `H_n`, etc. (lines 281–286, 396, 423). High priority — semantic drift inside the widget the reader is being asked to reconcile against the prose table.
- The `<select>` options in the Hurewicz widget (lines 363–369) carry LaTeX (`$S^2$`, `$K(\mathbb{Z}/3,1)$`); `js/katex-select.js` is loaded (line 178), so this should render — but worth re-eyeballing in a real browser since the registry-shimmed dropdown has been a recurring breakage.
- Section heading "Iterated loop spaces are $E_\infty$" (line 575) uses `$E_\infty$` while the body talks about `$E_n$-algebra` and "the homotopy-coherent commutative monoid structure that infinite loop spaces and the corresponding spectra carry." Consistent within the page; just flagging $E_n$/$E_\infty$ is a notation introduced without a Hopkins-style "$E_n$ means…" gloss (see Tone below).

### Undefined jargon
- "$E_n$-algebra, encoded by the little $n$-cubes operad $\mathcal{C}_n$. As $n\to\infty$ the operadic structure approaches $E_\infty$" (line 576) — `operad`, `$E_n$`, `$E_\infty$`, `little $n$-cubes` all introduced in one sentence, none defined or callback-linked. The adjacent prose treats them as known. High priority for a "Loop spaces" section that a learner is reading because they want to *learn* this.
- "rationally formal" in §5 widget caption (line 555) — `formal` is technical (in Sullivan's sense) and never defined on the page. Minor.
- "Eilenberg–Steenrod axioms minus dimension" (line 481) — used as if known; cohomology-and-duality.html doesn't list the axioms either, so there is no in-corpus callback the reader can chase. Minor.
- "the chromatic filtration of stable homotopy by formal-group height (Morava $K$-theories, $tmf$, the $K(n)$-local sphere)" (line 631, Connections) — five undefined terms in a parenthetical. This is a "where this leads" outro so it is acceptable as gesture, but the density is high.
- `$\Omega^\infty\dashv\Sigma^\infty$ adjunction` (line 578) — `$\dashv$` symbol and the adjective "infinite loop space" used before the $\Omega^\infty$-spectrum picture is unpacked.

### Tone mismatches
- §6 paragraph at line 576 ("In general $\Omega^n X$ has the structure of an $E_n$-algebra…") shifts into name-checking mode — five capitalised concepts in 60 words with no example or explanatory unpacking. Compare to the §1 Eckmann–Hilton note (line 274) which carries its own micro-proof. Same chapter, two different voices.
- Line 631 (Connections opener) — "the engine room of modern topology" is fine; but the follow-on parenthetical lists "Morava $K$-theories, $tmf$, the $K(n)$-local sphere" with no narrator. Reads more like a graduate-syllabus index than the page's usual conversational gloss. Minor.
- Most §§1–3 prose matches the category-theory house voice well (worked computations interleaved with one-line slogans, e.g. line 301 "$\pi_n(S^1)$" worked computation note, line 351 "Whitehead trap" note).

### Missing worked examples
- §6 (Loop spaces and Bott periodicity) has the Bott-clock widget but no worked computation in prose between §6.1 ("Iterated loop spaces are $E_\infty$") and §6.3 ("James's splitting"). The Bott periodicity statement at line 583 jumps straight from theorem to numerical table — no derivation, no toy. Compare to algebraic-topology.html:1093 which derives $H_*(S^n)$ by Mayer–Vietoris induction in a `<div class="ok">`. Medium priority.
- §6 "James's splitting" (line 598–601) is two sentences and a formula, no example of `$X = S^1$` or similar to make the splitting concrete. Low priority.
- §3 "Brown representability for ordinary cohomology" — has the $K$-invariant / Postnikov widget but no worked example of $H^n(X;G) \cong [X,K(G,n)]_*$ for a concrete pair (e.g. computing $H^1(S^1;\mathbb{Z}) \cong [S^1,S^1] = \mathbb{Z}$). Low priority — the Postnikov widget partially compensates.
- §4 ("Stable homotopy and spectra") — sphere/EM/Thom/$KU$ spectrum bullets at lines 471–474 are listed as a menu, no walked-through computation that *uses* the spectrum view. The §4 widget is a numerical stabilisation table, not a spectrum-side calculation. Medium priority.

### KaTeX macros / formatting
- Helper block at top of `<body>` (lines 187–239) is a verbatim copy of category-theory.html — `$`, `$$`, `SVG`, `ensureArrow`, `drawArrow`, `drawNode` all match. Clean.
- KaTeX macro list in head (lines 22–29) is the standard six (`\Spec`, `\Gal`, `\Hom`, `\tr`, `\ad`, `\ind`) — verbatim shared across the references. Clean.
- The page uses `\mathrm{...}` in several spots where the predefined `\Hom` exists (line 542 `\mathrm{Hom}` should be `\Hom`). Cosmetic.
- Several SVG widget readouts call `renderMathInElement(svg, ...)` (lines 750, 800, 916) — KaTeX HTML output does not render inside SVG `<text>` elements; only `<foreignObject>`-wrapped HTML would. The Hurewicz widget cell-text is set to `'$'+d.pi[i]+'$'` (line 728) and *will display literal `$\mathbb{Z}$` source text* in browsers. **High priority — semantic bug, not cosmetic.** Verify in real browser; either drop to ASCII (`Z`) or wire `<foreignObject>`-ed `<div>`s through KaTeX.
- All six widget SVGs include `viewBox` and `<title>` (good a11y baseline). Standard widget chrome (`.widget`, `.hd`, `.ttl`, `.hint`, `.readout`, `.row`, `.note`, `.ok`, `.bad`, `.pill`) is used consistently — no ad-hoc classes spotted.

## Severity
minor polish — with one elevated item: the SVG `<text>` KaTeX rendering (Hurewicz, Postnikov, Stable, Bott widgets) needs a real-browser eyeball to confirm whether `$\mathbb{Z}$` actually renders or shows as raw source.

_(Orchestrator runs `node scripts/rebuild.mjs` after any content changes.)_
