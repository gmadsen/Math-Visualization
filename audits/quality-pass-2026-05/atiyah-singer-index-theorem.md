# atiyah-singer-index-theorem — pedagogical audit (2026-05)

**Section:** Geometry & topology
**Compared against:** k-theory, characteristic-classes

## Summary
A strong, well-paced page that aligns closely with section peers in voice, helper block, and KaTeX delimiters. The only meaningful issues are a single notation-clash with `k-theory.html` (`\hat A` vs `\widehat A`) and the omnibus §6 ("Heat kernel, families, equivariant, anomalies") which packs four sub-topics into one section but only has one widget.

## Findings
### Notation drift
- `\hat A` (target, e.g. §5 heading line 815, §5 box line 821, §6 instanton line 957) vs `\widehat A` in `k-theory.html` line 541 readout (`the $\widehat A$-genus`). Cosmetic, but two pages directly cross-link about the same genus and render it with different glyphs. Recommend settling on `\hat A` everywhere — it dominates both this page and `characteristic-classes.html` doesn't render the symbol at all.
- `\mathrm{coker}` vs `\dim\mathrm{coker}\,D` is consistent with `k-theory.html` line 518 — no drift here. Good.
- `[T^*M]` as the fundamental class in the boxed theorem (line 267) matches `k-theory.html` line 524 verbatim. No drift.
- Target writes `\hat A(K3)=2` as `the K3 surface has $\hat A=2$` in §5 line 828; references don't touch this so no comparison, but the abbreviation $\hat A=2$ for $\hat A(\text{K3})[\text{K3}]=2$ is mildly imprecise — the integer is the pairing, not the class.
- _Cosmetic only_, no semantic conflict (same symbol, different rendering): the macro `\ind` is used identically across all three.

### Undefined jargon
- "K-theory class on $T^*M$" appears in §1 line 264 (`viewed as a K-theory class on $T^*M$`) before §3 introduces $K^0_{\mathrm{c}}(T^*M)$. The cross-page callback after §1 points to `k-theory.html#applications`, which mitigates this — acceptable.
- "Whitney" embedding appears in §3 line 539 (`Choose a closed embedding $i\colon M\hookrightarrow\mathbb{R}^N$ (Whitney)`) with no callback or expansion. Reader unfamiliar with Whitney's embedding theorem gets only the parenthetical. Recommend a one-line gloss or a callback to `smooth-manifolds.html`.
- "Sobolev completions" §1 line 262 ("Fredholm as a map between Sobolev completions") with no link; the callback at §2-end does point to `sobolev-spaces-distributions.html` indirectly via the PDE callback, but the sentence in §1 has no contextual help.
- "Getzler's symbol calculus" §6 line 943 — name-dropped without explanation in a "miraculous algebraic identity" parenthetical. Acceptable as a pointer if the reader chases it, but the sentence currently asks the reader to take the calculation on faith twice.
- "APS boundary conditions", "Atiyah–Connes", "Connes–Higson–Roe", "$K$-homology" all appear in the §7 Connections paragraph (line 1048) as a frontier dump without definitions. This is a stylistic choice consistent with the references' Connections sections — acceptable.

### Tone mismatches
- Mostly aligned with the section peers. The voice is conversational-but-precise throughout: "The miracle is that…" (§1), "What makes the equation interesting is the asymmetry…" (§1), "deserves separate treatment" (§4) all match `category-theory.html` register.
- §6 line 943 "(a miraculous algebraic identity — Getzler's symbol calculus is the cleanest derivation)" is slightly hand-wavy but flagged honestly.
- §7 Connections paragraph (line 1048) is denser than the equivalent sections in the references — it bundles five frontier directions into one sentence with abbreviations (NCG, K-homology, eta invariants) where `k-theory.html` line 564 walks the reader through similarly broad territory more gently.

### Missing worked examples
- §6 ("Heat kernel, families, equivariant, anomalies") covers four distinct sub-topics under one numbered heading with `<h3>` subdividers (lines 938, 945, 950, 955), but only the last one (anomalies/instantons) has a widget. The heat-kernel proof, families index, and equivariant index sub-sections are pure prose with no concrete computation or interactive toy. This is the page's largest gap relative to the AGENTS.md "every numbered `<h2>` section should have at least one concrete computation or widget" rule — technically the section *does* have a widget, but three of its four sub-arcs do not. Recommend either splitting §6 into two or three numbered sections (each with its own widget) or adding small worked examples (e.g. McKean–Singer cancellation on $T^2$, $\ind_G$ on $S^1$ acting on $S^2$) to the prose-only subsections.
- All other numbered sections (§1, §2, §3, §4, §5) have a widget plus at least one concrete worked numerical example in prose (Gauss–Bonnet on $S^2$, $\chi(\mathbb{P}^1,\mathcal{O}(d))=d+1$, K3 has $\hat A=2$, etc.). Good.

### KaTeX macros / formatting
- Helper macros block (lines 22–29) is verbatim-identical to `k-theory.html` and `characteristic-classes.html` — `\Spec`, `\Gal`, `\Hom`, `\tr`, `\ad`, `\ind`. Good, no local re-definitions.
- Helper `<script>` at top of `<body>` (lines 187–236) — `$`, `$$`, `SVG`, `ensureArrow`, `drawArrow`, `drawNode` — matches `category-theory.html` and `k-theory.html` byte-for-byte. Good.
- KaTeX delimiters: only `$…$` and `$$…$$` used; no invented variants. Good.
- Widget chrome uses standard `.widget / .hd / .ttl / .hint / .readout / .row / .note / .ok / .bad` throughout; no ad-hoc classes. Good.
- The §1 "Connections" section (line 1046) is unnumbered, matching `k-theory.html` line 562 (`<h2>Connections</h2>`) but differing from `characteristic-classes.html` line 691 (`<h2>10. Connections</h2>`). Section-internal inconsistency in the corpus, not a target-specific problem.
- Some readouts mix LaTeX-rendered text with raw Unicode-escape strings: e.g. line 341 uses `D_λ = -i ∂_θ + λ on S¹` (Unicode), line 905 uses `D on S^${n} at r=${r.toFixed(2)}` (ASCII). The widget-script readouts use Unicode (because they are set via `.textContent` which doesn't go through KaTeX), while the static `.readout` HTML uses `$…$` math mode. This is a corpus-wide pattern (k-theory line 691 does the same with `0 → A → A⊕C → C → 0`) — not a drift, but the inconsistency between adjacent live and static readouts in the same widget could confuse readers visually.
- §1 hint `$1\times 1$ operators` (line 273) — plural "operators" with `1×1` is slightly odd because the family is built from a single operator $D_\lambda$, not a family of $1\times 1$ matrices in the usual sense. Cosmetic.

## Severity
minor polish
