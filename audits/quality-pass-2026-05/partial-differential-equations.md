# partial-differential-equations — pedagogical audit (2026-05)

**Section:** Analysis
**Compared against:** sobolev-spaces-distributions, harmonic-analysis-fourier

## Summary
The page is solid analysis pedagogy with six well-paced sections, each grounded by an interactive widget that exposes the key knob (discriminant, $t$, initial data, boundary, $\alpha/p$). Most observations are minor polish: a few terms appear before any context, the tone is tighter than its peers' (less "you" voice, no widget sub-headings), and §3 uniquely lacks a "See also" callback.

## Findings
### Notation drift
- `\mathbb{D}` for the unit disk appears at §4 (`On the unit disk $\mathbb{D}\subset\mathbb{R}^2$`) without a prior gloss; neither `sobolev-spaces-distributions.html` nor `harmonic-analysis-fourier.html` uses `\mathbb{D}`. Cosmetic.
- The "$L$ is bounded by Cauchy–Schwarz" framing in `sobolev-spaces-distributions.html#variational` writes the linear functional as `L(v)`, while `partial-differential-equations.html#weak-solutions` uses `\langle f, v\rangle` and `\langle f, \phi_i\rangle` for the same object. Both are mathematically fine, but a reader following the cross-page Lax–Milgram thread sees the right-hand side change shape with no signposting. Low priority.
- Widget readouts mix Unicode (`σ`, `δ₀`, `↪`, `≈`, `π`) and ASCII (`b² − ac`, `K_t(x) = (4π t)^(−1/2) exp(−x²/4t)`). The two reference pages do the same — consistent with house style; not a drift, just worth noting as conscious convention.

### Undefined jargon
- **"Cauchy data on a non-characteristic curve"** appears in the §1 classification table before any of the words "Cauchy data", "characteristic curve", or "non-characteristic" have been introduced. The next paragraph explains characteristics, but the table reads cold. Quote: `<td>Cauchy data on a non-characteristic curve</td>`.
- **"distribution"** is used in §2 ("Even if $u_0$ is merely $L^1$ or a distribution …") with no glossary callback to `sobolev-spaces-distributions.html#test-functions`. Sobolev's own page is the obvious prereq link; the §2 callback list points at measure-theory and harmonic-functions instead.
- **"hat functions on a triangulation"** at §5 ("Picking $\phi_i$ to be hat functions on a triangulation gives the **finite element method**") — both phrases are introduced as the punchline rather than defined. A reader who hasn't seen FEM before gets no toehold. Low-priority for a graduate page, but the reference pages make a habit of one-sentence glosses for specialty terminology.
- **"BMO at the edge"** parenthetical in the §6 embedding table cites BMO with no expansion. Compare `sobolev-spaces-distributions.html#embeddings` which writes `borderline / Trudinger–Moser` and avoids unexplained acronyms in the same row.
- **"non-divergence form"**, **"Bochner, Bismut"**, **"de Giorgi–Nash–Moser"**, **"Cheeger–Colding"**, **"rough paths"** all land in the §7 outro without context. This is acceptable for a "frontiers" closer, but the Sobolev/Harmonic outros either link out to live pages or skip the proper-noun list entirely. Low priority.
- **"$H^k_{\mathrm{loc}}$"** is used in §6 elliptic regularity (`$f\in H^k_{\mathrm{loc}}(\Omega)$`) without any explanation that the subscript means "in $H^k$ on every compact subset". Sobolev's own page never uses the `_{\mathrm{loc}}` subscript on $H^k$, so a reader following the cross-page link doesn't have a parallel definition to fall back on.

### Tone mismatches
- The page is written almost entirely in the third person ("the heat equation describes…", "the bilinear form $a$ is bounded…"). `category-theory.html` and `harmonic-analysis-fourier.html` weave in second-person nudges ("Pay attention to the Gibbs overshoot…", "Click two composable arrows…", "Drag the right interval across the left"). The PDE widgets do have a `.hint` directing the reader, but the main prose never says "watch", "scrub", or "you" once the widget is set up. Result: drier than the section average. Low priority.
- `harmonic-analysis-fourier.html` uses sub-headings like `<h3>Widget — sliding partial sums</h3>` to introduce each interactive with a sentence of orientation; PDE jumps straight from the math into a `.widget` block with no glue paragraph in §1, §3, §4, §5, §6. The `.hint` line carries the orientation, but a reader scanning section structure sees no signpost.
- §3 ("Wave equation and d'Alembert") drops two `<p><strong>…</strong></p>` aside-style facts ("Finite speed of propagation", "Huygens' principle") that would sit better as `.note` blocks (matching how §2 boxes its three heat-equation properties and how Sobolev §6 calls out "How to remember the dimension"). Cosmetic.

### Missing worked examples
- **§3 wave equation** has the d'Alembert widget (good) but no `.note` boxes and no callback aside — it is the only section with neither. Sobolev's analogue §5 (trace) has a `.note` box for the trace theorem and the half-derivative explanation. Recommend at least an `.note` for finite-speed/Huygens.
- **§7 Connections** is a pure prose epilogue with four `<h3>` sub-bullets and no widget. This is consistent with how `harmonic-analysis-fourier.html#pontryagin` (its "teaser" finale) works and with `sobolev-spaces-distributions` having no §8 — so this is fine and not flagged.
- The §4 worked example "subtract any two solutions; the difference is harmonic with zero boundary data, hence zero by maximum principle" is one sentence; the parallel uniqueness story in `sobolev-spaces-distributions.html#variational` gets a full closing `.ok` block ("The chain in summary") tying steps to ingredients. PDE could use a similar wrap-up box per section.

### KaTeX macros / formatting
- The head macro block is byte-identical to `sobolev-spaces-distributions.html` and `category-theory.html` (`\Spec`, `\Gal`, `\Hom`, `\tr`, `\ad`, `\ind`). No new local macros are introduced — clean.
- `\bmod` shows up in §6's `(\bmod 1)` parenthetical; both reference pages also use it (or `\mod`). Consistent.
- No drift in delimiters: `$…$`, `$$…$$` only. No `\(…\)` or `\[…\]` in the body, matching reference usage.
- `\hookrightarrow` vs the Unicode `↪` in widget readouts: both appear in the body of all three pages (KaTeX-rendered) and in widget readouts (text). Consistent across the section.
- `\tfrac` is used liberally (§3, §4, §5) — same as the reference pages. No issue.
- The helper `<script>` block (`$`, `$$`, `SVG`, `ensureArrow`, `drawArrow`, `drawNode`) is byte-identical to both references — verified via `diff`. Helper-block hygiene clean.
- Widget chrome consistent: every widget uses `.widget / .hd / .ttl / .hint / .readout / .row`. No ad-hoc classes. The §4 widget uses `color-mix(...)` for theme-aware heatmap fills — same pattern as Sobolev's, no hex literals.

## Severity
minor polish
