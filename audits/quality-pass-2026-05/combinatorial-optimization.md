# combinatorial-optimization — pedagogical audit (2026-05)

**Section:** Control theory & optimization
**Compared against:** convex-optimization, optimal-control-and-dynamic-programming

## Summary
The page is well-structured, voice-matched to its section peers, and every numbered section (§1–§7) carries a substantive interactive widget. Two real semantic snags exist (BFS acronym overload; UGC and "complementary slackness" used before being defined), plus minor cosmetic drift against `convex-optimization`'s `\mathrm{sign}` convention.

## Findings
### Notation drift
- (Cosmetic.) Target writes `\operatorname{sign}(r\cdot v_i)` for the GW rounding rule (`combinatorial-optimization.html:1199`) while `convex-optimization.html` writes `\mathrm{sign}` for the *same* operator in the *same* GW context (lines 410, 734, 752, 864). Identical math, two notations, one section. Recommend `\mathrm{sign}` to match the reference.
- (Cosmetic.) Target uses `\operatorname{conv}{\chi_F : ...}` (`:1060`) and `\operatorname{cap}(S,T)` (`:573`), idiomatic. No conflict with refs, just call out for awareness.
- (Cosmetic.) Optimal-control reference uses `\operatorname*{arg\,min}` for argmin/argmax in display math; target uses prose-style "argmax" / "argmin" only inside SVG legends and readout text and never in display math, so there's no direct symbolic conflict — but should target ever introduce one in display math, prefer `\operatorname*{arg\,min}` per the optimal-control convention.
- All shared scalar/vector notation (`c^\top x`, `\mathbb{R}^{m\times n}`, `\{0,1\}`, `\succeq 0`, `\mathcal{N}(0,I)`) is consistent with both reference pages.

### Undefined jargon
- (Semantic, high priority.) **`BFS` is overloaded across the page.** First introduced in §1 (`:275`) as "basic feasible solutions (BFS)" and reused in §1 (`:277` "At each BFS we pick…"). Then §3 (`:579`) and the §3 widget readout (`:696`) and the §4 search comment (`:774`, `:828`) silently shift to BFS = breadth-first search. A reader following the abbreviation forward will conflate the two. Recommend spelling out "breadth-first search" on first use in §3 and dropping the abbreviation thereafter, or using "BFS-search" / "shortest-edge-count search".
- **"Complementary slackness" used before defined.** Appears in §1 (`:277` "optimality, via complementary slackness") with no forward-reference, then is defined in §2 (`:550`) as the equation pair $x_j(c_j-(A^\top y)_j)=0,\ y_i(b_i-(Ax)_i)=0$. Add a forward "(defined in §2)" or reorder.
- **"UGC" used before expansion.** First appearance is the abbreviation in §7 (`:1195` "the best known under UGC (Khot–Regev 2008)") and again at `:1199`; the spelled-out "Unique Games Conjecture" only appears later in §8 Connections (`:1307`). Backward order. Spell out on first use.
- (Minor.) "PCP" appears once in §8 (`:1307`) without expansion. Acceptable in a Connections paragraph aimed at downstream pointers, but flag for awareness.
- (Minor.) "smoothed analysis" (Spielman–Teng) is dropped in §1 (`:279`) without context. The reference name + year is enough for the level, but a half-sentence ("random perturbations smooth the worst case to polynomial") already provided makes this fine.
- (Minor.) "label cover" in §8 (`:1307`) is undefined and won't link anywhere meaningful; consider trimming or qualifying ("e.g. max-coverage variants, label cover (a PCP-style hardness witness)").

### Tone mismatches
- _None._ Voice matches the section peers — conversational hero, second-person "drag the sliders" / "pick any feasible primal" cues after each widget, mid-section min–max table mirrors the conic-cones table in `convex-optimization.html` (`:719`–`:728`) and the Bolza/Mayer/Lagrange table in `optimal-control-and-dynamic-programming.html` (`:330`–`:336`). No textbook-dry walls; no over-casual register; formulas are narrated.

### Missing worked examples
- _None._ §1 polytope, §2 weak/strong duality bar, §3 max-flow grid network, §4 bipartite augmenting paths + König witness, §5 TU subdeterminant audit (5 presets), §6 polytope stepper on $C_5$, §7 vertex-cover LP-rounding playground (3 instances) — every numbered section has a poke-it widget with a concrete instance. §8 Connections has no widget by section convention (matches both refs).

### KaTeX macros / formatting
- KaTeX loader macros (`\Spec`, `\Gal`, `\Hom`, `\tr`, `\ad`, `\ind`) are byte-identical with both refs. No new macros introduced on the target page.
- Delimiters block (`$…$`, `$$…$$`, `\(…\)`, `\[…\]`) is the canonical four; no invented delimiters.
- (Minor head-load drift.) Target loads `./js/widget-diagram-editor.js` in `<head>` (`:179`) but no widget on the page declares a `data-` attribute that the diagram-editor runtime hooks. Looks like a scaffolder leftover. Convex-optimization loads both `widget-diagram-editor.js` and `widget-inline-code-cell.js`, the latter actually used by §5; optimal-control loads neither. Cosmetic only — can be dropped, but doesn't break anything.
- All seven widgets use the canonical chrome (`.widget`, `.hd`, `.ttl`, `.hint`, `.row`, `.readout`, `.note`, `.pill`); no ad-hoc classes spotted.
- 2D helper block at top of `<body>` (`$`, `$$`, `SVG`, `ensureArrow`, `drawArrow`, `drawNode`) is verbatim with both refs.
- (Cosmetic.) §6 widget panel wraps annotation text by hard-splitting on a 32-char threshold inside SVG (`:1152`–`:1166`). Works, but is a one-off layout hack not seen in the two refs (which keep narration in HTML `<p>` siblings rather than inside the SVG). Consider lifting the panel text out of the SVG and into a sibling `<div class="readout">` for consistency with the rest of the page corpus.

## Severity
minor polish
