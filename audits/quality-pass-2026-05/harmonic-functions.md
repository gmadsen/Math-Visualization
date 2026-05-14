# harmonic-functions — pedagogical audit (2026-05)

**Section:** Analysis
**Compared against:** complex-analysis, partial-differential-equations

## Summary
Strong page overall — six well-paced sections, each anchored by a working interactive widget, with tone and notation closely aligned with the two reference pages. One genuine semantic bug (literal `;=;` rather than the spacing macro `\;=\;` in the §1 display equation) and a small handful of cosmetic / pedagogical polish items. No structural rework needed.

## Findings
### Notation drift
- §1 line 287 uses `$\Delta u ;=; \sum_{i=1}^n \frac{\partial^2 u}{\partial x_i^2} ;=; 0.$` — the `;=;` tokens are *literal* characters, not the KaTeX spacing macro `\;=\;`. They render as semicolons in the page. **Semantic, high priority** (everywhere else on the page the macro is correctly written `\;=\;` — e.g. lines 423, 573, 888 — so this is a one-off typo, not a convention drift).
- §1 line 287 also uses single-`$…$` inline delimiters for what is structurally a display equation; cf. category-theory.html and partial-differential-equations.html which consistently bracket numbered equations in `$$…$$` (or use `\[…\]`). complex-analysis.html and PDE both keep their first defining Laplacian equation in display mode (PDE line 267, 459). Cosmetic-but-style-drift.
- `\mathrm{Re}\,z^2` / `\mathrm{Im}\,z^2` (§1 line 291) is fine; complex-analysis.html mixes `\Re z` (line 437) and `\mathrm{Im}\,z` (line 837), so the corpus has not standardised. The `\mathrm{}` form here is consistent with complex-analysis §17 and is the safer choice — no drift to flag, just note the inconsistency lives in the references.
- The Poisson kernel definition uses `P_r(\theta)` (line 721) consistently with PDE line 737 (`P_r(\alpha)`) — same name, slightly different dummy argument; harmless.
- §6 introduces `\mathcal{S}_g` for the Perron family (line 1037). Standard, matches Ahlfors / Garnett, no peer-page collision.

### Undefined jargon
- §1 hero/sub line 280 promises "the Dirichlet problem" before §1 has a chance to set up boundary-value-problem language. The term doesn't get a definition until §3 line 577 (`<div class="ok">`) and §4 §-title; an early-on cross-reference (or even a parenthetical "boundary-value problem $\Delta u = 0$ in $\Omega$, $u=g$ on $\partial\Omega$") would help. Low priority — readers arriving from the index almost always know the phrase.
- §2 line 426 says "This is the cleanest example of *elliptic regularity*" without defining the phrase or linking to PDE §6 (`#regularity`), which does. A cross-page callback aside or inline link would close the loop. Low-medium priority.
- §6 line 1042 introduces "regular boundary point" and "barrier" together; the definitions are co-located so this is fine, but the sentence "every boundary point is regular" wraps a load-bearing definition inside a concession clause — readers can miss it.
- §7 line 1199 ("Open frontiers") drops Krylov–Safonov, Wolff distortion, Calderón–Zygmund, Stefan, obstacle problem in a single paragraph. This is intentional pointer text in an outro and matches the "Connections" pattern from PDE §7 / complex-analysis outros — flag only as an observation.

### Tone mismatches
- The voice is consistently "conversational-but-precise," very close to category-theory.html and PDE.
- §1 line 285 opening rhetorical question ("What physical situations force…") is well-paced and mirrors the category-theory style.
- One small wrinkle: §2 §-heading boast "Here is the single property that distils what 'harmonic' really means" (line 421) and §6 line 1040 "Two near-miraculous facts" lean slightly more enthusiastic than complex-analysis or PDE. Not a problem; preserves character.
- No formula-walls; every display equation is followed by a one-sentence narration. No dry-textbook drift detected.

### Missing worked examples
- All six numbered sections (§§1–6) ship with an interactive widget. §7 "Connections" is intentionally pointer-only — matches PDE §7 and complex-analysis outro.
- §5 (Harnack) has the corridor visualizer, which is a good "see the bound shrink to a point" demo, but the page never explicitly works out a *toy numeric example* in prose ("for $u(x)=1+x_1$ on $B(0,1)$, $u(0)=1$, the Harnack corridor at $r=1/2$ is $[1/3,3]$ …"). Worth considering as a polish item — every other section has at least one inline example.
- §6 has the Perron supremum widget, which is excellent visually, but the "Lebesgue spine" pathology in the note (line 1044) isn't depicted; a small static SVG of the spike would be a nice polish.

### KaTeX macros / formatting
- The `\Spec / \Gal / \Hom / \tr / \ad / \ind` macros declared in the loader (lines 22–28) are never used on this page. Harmless — they're inherited from a shared template — but the page introduces no harmonic-specific macros (e.g. no `\Re/\Im/\dvg/\grad` shortcuts). complex-analysis and PDE are the same way; no drift to flag.
- §1 line 287 — see Notation drift above (literal `;=;`).
- §5 line 892 has `\text{Poisson kernel}(x, y) \;\le\; \text{(upper)}` — a placeholder right-hand side. It's intentional shorthand pointing at the structural form of the bound, but a reader expecting an explicit formula will be momentarily confused. A `\le \frac{R+r}{R-r}\frac{1}{R^{n-2}}` (or a footnote) would tighten it.
- Helper-block / widget-chrome hygiene: top-of-body helpers (lines 187–259) are functionally a verbatim copy of category-theory.html's, with two cosmetic differences — (a) double-quoted `'http://...'` namespace and attribute strings (vs. single-quoted in category-theory and PDE); (b) two extra heat-color helpers `hslToHex` and `heatColor` appended at the end (lines 237–258), which are page-specific utilities used by all six widgets and thus a defensible local extension. No deviation from the `$ / $$ / SVG / drawArrow / drawNode` API. Widget chrome (`.widget / .hd / .ttl / .hint / .row / .readout / .note / .ok / .bad`) is used correctly and consistently throughout; no ad-hoc classes.

## Severity
minor polish (one semantic KaTeX bug at line 287, plus 4–5 cosmetic / pedagogical polish items)
