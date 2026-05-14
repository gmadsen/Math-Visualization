# infinity-categories — pedagogical audit (2026-05)

**Section:** Higher categories & toposes
**Compared against:** simplicial-sets-and-nerve, cocartesian-fibrations

## Summary
Strong, well-paced page that genuinely uses the proof-scrubber widget the way the section's other pages do. Two **real KaTeX/math typos in §2** (rendered prose, not widget JS) are the only items that rise above polish — both in the same sentence at line 360.

## Findings

### Notation drift
- **`\colon` vs `:` for typed-arrow morphisms.** Target uses `\colon` consistently (e.g. `$F\colon \mathcal{C} \to \mathcal{D}$`, line 491); `simplicial-sets-and-nerve` does the same (`$d^i\colon [n-1] \to [n]$`, line 273). `cocartesian-fibrations` uses bare `:` throughout (`$p: \mathcal{E} \to \mathcal{B}$`, line 270). Target sides with the cleaner peer — no action needed on target; flagged only as a section-wide drift in cocartesian's direction.
- **`\Hom` macro discipline.** Target correctly uses the head-loader macro `\Hom_{h\mathcal{C}}` (line 361) but writes raw `\mathrm{Map}`, `\mathrm{Lan}`, `\mathrm{Ran}`, `\mathrm{Fun}`, `\mathrm{Ind}`, `\mathrm{Ob}`, `\mathrm{id}`, `\mathrm{Sing}`, `\mathrm{Top}`, `\mathrm{Ch}`, `\mathrm{qis}`. Both peers do the same — there is no shared `\Map`/`\Fun` macro defined in the loader, so this is house-consistent. No action.
- **Mapping-space ASCII vs `\mathrm{Map}` inside SVG.** Target SVG snippets render `Map_C(x, y)` as plain text (lines 348, 470) while prose uses `\mathrm{Map}_{\mathcal{C}}`. Peers do the same (cocartesian §6 line 832 uses `Map(...)` ASCII inside `svgInner`). Cosmetic only.
- **`\mathcal{P}(C)` vs `\mathcal{P}(\mathcal{C})`.** Backlink at line 302 reads `$\mathcal{P}(C)$: presheaf $\infty$-topoi` (plain `C`) while body line 497 uses `$\mathcal{P}(\mathcal{C})$`. Same object, two scripts. Low priority — the backlink text comes from `infinity-topoi.html`'s own concept blurb so the fix belongs there.

### Undefined jargon
- **"inner fibration"** appears in §5 widget Step 4 readout (line 731 area) and §4 prose ("the simplicial set… is fibrant in the Joyal model structure", §1 line 275) without ever being defined or callback'd. `cocartesian-fibrations` §3 line 429 *does* define inner fibration, but no callback in target points there.
- **"Joyal model structure" / "fibrant"** introduced at line 275 in the very first paragraph of §1 with no gloss and no callback to `model-categories.html`. First-time reader of the page hits "fibrant in the Joyal model structure on $\mathbf{sSet}$" before any of this is unpacked. The `Used in` panel at line 303 *does* link to `model-categories.html#bridge` but as a downstream edge, not an upstream prereq.
- **"Trivial Kan fibration"** (§1 widget Step 6 line 347) is used inside Joyal's recognition-theorem statement without definition.
- **"Dwyer–Kan"** dropped at line 368 ("it's the Dwyer–Kan / 'essentially surjective + fully faithful on $\pi_0$' data") with no definition or pointer. The phrase serves no pedagogical purpose for a reader who doesn't already know it; a parenthetical would be cheaper than a callback.
- **"Toda bracket / Massey product"** at line 366 and again in §2 widget Step 6 line 469 — same issue, used to describe what's lost without saying what they are. Acceptable as colour, but flag if a nervous reader asks "what's lost?".
- **"$\mathbb{E}_\infty$-ring spectrum"** is not introduced in target; cocartesian-fibrations does not define it either, but at least there it's tagged as an example. Target only says "Quillen adjunction between model categories" (line 677) without callback to `model-categories.html`. Add callback.
- **"presentable"** (§5 line 679, §6 line 580) — the inline gloss "(a localization of a presheaf $\infty$-category along a small set of morphisms)" at 580 is fine; the §5 use at 679 reads as if presentable were already defined. Reorder or repeat the parenthetical.

### Tone mismatches
- §3 final paragraph (line 497) ends "the engine of derived algebraic geometry" with no callback. Compare cocartesian §1 line 274 which says exactly "the slogan, made precise by … straightening … is that ___" and follows up. Target's flourish is fine but reads as drier reference-style.
- §1 line 283 closes with "References: Lurie HTT §1.1–1.2, Cisinski §3.1, Riehl–Verity Ch. 1." Inline reference list is unusual for the corpus — peers cite Lurie/Kerodon inline next to the specific claim (`HTT 2.4.1.5`, `Kerodon 5.1.1`) rather than dumping a bibliography at the end of a paragraph. Minor.
- §7 (Connections) is shorter and thinner than cocartesian-fibrations §8 (Connections) — four `<h3>` paragraphs of 1–2 sentences each, then a single `<p class="small">` of "open frontiers." Cocartesian's outro is denser and uses each sub-heading to actually situate the topic. Pedagogically OK but visibly less invested.

### Missing worked examples
- **§5 Adjunctions $\infty$-categorically.** The widget (`w-adjunction-triangles`) is a click-to-explain *legend* for the triangle identities, not a *worked* adjunction. Compare §4's `w-infty-cone` (three candidate apices, "click to test which is the limit") which forces a real comparison. A toy adjunction like `H_*(-) \dashv K(\pi, -)` or `\Sigma^\infty \dashv \Omega^\infty` carried through one triangle would lift this from "annotated diagram" to "worked example."
- **§6 $\infty$-categorical Kan extensions.** The pointwise-formula scrubber (`w-kan-pointwise`) is conceptual all the way down — every step talks about $\mathcal{C}/_d$ in the abstract, never instantiated. A 5-second sidebar like "$i$ = inclusion of a 2-element discrete category, $F$ = pair of objects in $\mathcal{E}$, then $\mathrm{Lan}_i F (d) =$ coproduct" would cement the formula. Both peers concretize at least one step (e.g., simplicial-sets §4 Step 2 of the nerve widget computes a real composition).
- **§7 Connections** has no worked content at all — it's the standard outro pattern, so this is by design, but it's worth noting that the page never demonstrates the Yoneda embedding equivalence from §3 line 497 ("$\mathrm{Map}_{\mathcal{P}(\mathcal{C})}(y(x), y(y)) \simeq \mathrm{Map}_{\mathcal{C}}(x, y)$") on any concrete $\mathcal{C}$.

### KaTeX macros / formatting
- **REAL BUG, §2 line 360.** `$1$-simplices $f, g\\colon x \to y$` — the doubled backslash is a JS-string escape that leaked into raw HTML. KaTeX with `throwOnError:false` will silently fail to render `\\colon`, leaving stray `\colon` text after the symbol pair. Should be `$f, g\colon x \to y$`.
- **REAL BUG, §2 line 360 (same sentence).** `$\partial_0 \sigma = g$, $\partial_1 \sigma = g$, $\partial_2 \sigma = f$` — both $\partial_0$ and $\partial_1$ are set to $g$, which is mathematically wrong. The intended boundary (matching widget text at line 411 and `w-h-construction` Step 2 line 449) is `\partial_0 \sigma = \mathrm{id}_y, \partial_1 \sigma = g, \partial_2 \sigma = f`. This is the *defining* sentence for the homotopy relation and it is broken.
- **Macro choice consistent with peers.** Target's `\mathbb{L}`, `\mathbb{R}`, `\mathbb{E}_\infty`, `\mathcal{P}`, `\mathbf{sSet}`, `\mathbf{Cat}`, `\mathbf{QCat}` all match peer usage. No drift.
- **`fibre` vs `fiber`.** Target mixes both (`fibres` at §5 line 675, `fiber` at §1 line 281). Cocartesian uses `fiber` exclusively. House-irrelevant but noticeable in two adjacent paragraphs.
- **Helper-block / widget-chrome hygiene.** Top-of-body helper `<script>` (lines 188–240) is verbatim from `category-theory.html`. All widgets use `<div class="widget"><div class="hd"><div class="ttl">…</div><div class="hint">…</div></div>` — chrome compliant. Color tokens used throughout (no raw hex inside widget markup). No ad-hoc classes detected.

## Severity
minor polish — except §2 line 360, which has two real math/KaTeX bugs in the page's most foundational sentence and should be fixed promptly.
