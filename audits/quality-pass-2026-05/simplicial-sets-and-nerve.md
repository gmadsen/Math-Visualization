# simplicial-sets-and-nerve — pedagogical audit (2026-05)

**Section:** Higher categories & toposes
**Compared against:** infinity-categories, cocartesian-fibrations

## Summary
Strong page overall — clear structure, six well-paced sections, six purpose-built widgets, all the right §-references. The dominant issue is a notation split with the two peer pages on face/coface maps (`d_i`/`d^i` here vs. `\partial_i` in both peers); secondary issues are a couple of forward-references that name §6 / §3 concepts before they are introduced and one cross-page broken anchor that the peers point at.

## Findings
### Notation drift
- **Face-map symbol (semantic — high priority).** Target uses `d_i`, `d^i`, `d_0\sigma = d_1\sigma \circ d_2\sigma` throughout (lines 274, 276, 432, 666, 933). Both peers consistently use `\partial_i\sigma`: see `infinity-categories.html` line 278 (`\partial_0 \sigma = g, \partial_1\sigma = h, \partial_2\sigma = f`) and `cocartesian-fibrations.html` line 360 (`\partial_2 \bar{\sigma} = \bar{e}`). This is the same operator under two glyphs in the same section — readers crossing the §6 callback into infinity-categories will see the same data named differently. Recommendation: pick one convention; `\partial_i` is the more common modern usage and is already entrenched in the two peers.
- **Cosimplicial coface symbol.** Target uses `d^i` for cofaces in `\Delta` (line 274) and reuses `d_i` for face operators on simplicial sets (line 276). The visual disambiguation is just sub vs. super; consider explicit `\delta^i` / `\sigma^j` for the cofaces (a common Kerodon / Goerss–Jardine convention) so the reader doesn't have to track that "`d^i` lives in `\Delta`, `d_i` lives in `X_n`."
- **Hom-set in `\Delta`.** Target writes `\Delta([1],[3]) = \binom{5}{2} = 10` (line 275) — direct overloading of `\Delta` as both the category and its Hom. Peers prefer `\Hom_\Delta([m],[n])` or `\Delta(-, [n])`. Cosmetic, but `\Hom` is already in the macros block.
- **`\mathrm{op}` vs. `^{\mathrm{op}}`.** Consistent across all three pages — no drift here.
- **Composite naming.** Target writes `f_{i+1} \circ f_i` for nerve-face composition (line 665); the natural reading order in `[n]` is the other way and other pages would write `f_{i+1}\,f_i` or simply name it as a single composable arrow. Worth a sanity-check pass.

### Undefined jargon
- **"presheaf topos structure" / "subobject classifier"** appear at line 432 with no in-page definition or callback. The §2 callback only points to `elementary-topos-theory.html#presheaf-topos`, so a graduate reader already grounded is fine, but a Brilliant-style first-time reader is dropped here.
- **"Quillen equivalence of model categories"** appears at line 541 (and again 806) before model-categorical machinery is introduced anywhere on the page. Peers do this too (infinity-categories §1 mentions Joyal model structure with no definition), but at least there is a `model-categories.html` callback in the corpus that should be linked.
- **"Joyal model structure"** named at line 666 in §4 and again at 932 in §6, but never described — and §4's "Used in" has no callback to a Joyal-model anchor. Either describe in one line ("a model structure on `\mathbf{sSet}` whose fibrant objects are quasi-categories") or add a `See also` to `model-categories.html` / `infinity-categories.html#quasi-category`.
- **"$(\infty,1)$-categories"** dropped at line 933 with no gloss. Peer infinity-categories uses the same term but in context after "quasi-categories" has been built up.
- **"strong deformation retract"** at line 807 — fine for a topology audience but worth a one-clause unpack since this is graduate-but-cross-disciplinary.
- **"right lifting property"** introduced inline at line 806 with no expansion. Peers don't define it either, but on a page whose central business *is* horn lifting it deserves a sentence.

### Tone mismatches
- Generally consistent with peers — conversational-precise, second-person occasional, worked examples in the prose ("`\Delta([1],[3]) = 10`. So...").
- **Mid-widget meta-comment is a small voice slip.** In §1's `delta-readout` (line 414) the readout text says: `'relation: sʲdⁱ = dⁱ⁻¹sʲ for i > j+1; with i=1, j=0 here: s⁰d¹ = d¹s⁰? not quite, check the third identity.'`. That's an author note left in a user-facing string. Peers' widgets do not do this. Quick fix.
- **§6 §-reference loop.** Line 771 (inside the nerve widget) reads "...exactly why N(C) is a quasi-category with unique inner-horn fillers (§6)." A widget caption in §4 referring forward to §6 by section number is fine; the same widget at line 1029 then says "a quasi-category X is the nerve of a 1-category iff every inner-horn filler is unique." — restated. Not a tone problem so much as a small redundancy.
- The §4 prose `"Two computations to keep in mind"` (line 667) is on tone with peers' `"Three canonical examples to test the definition against"` (cocartesian-fibrations line 433). Good.

### Missing worked examples
- All six numbered sections have a widget; none is pure-definition. Coverage is excellent.
- **§2 (`#simplicial-set`) could use a small concrete simplicial-set example beyond `\Delta^n`.** The widget on line 453 walks faces/degens of `\Delta^2` but never shows a non-representable example (e.g. `\partial \Delta^2`, the nerve of a 2-element poset, or a small quotient). The Eilenberg–Zilber lemma is stated abstractly at line 435 with no toy where you point at a degenerate simplex and watch it factor. Compare the peer `infinity-categories.html` §1 which uses `MVProofScrubber` to show a 2-simplex, then immediately a different filler — the same pattern would let a reader poke "non-degenerate vs. degenerate" here.
- **§5 (`#kan-complex`) widget shows the three horn shapes but never lets the reader try to fill an outer horn and fail.** The peers' scrubbers walk a step-by-step success/fail; the inner-horn widget in §6 lets you "fill" — adding a `try-fill outer` step here would close the loop.

### KaTeX macros / formatting
- Page imports the standard global macro set (`\Spec`, `\Gal`, `\Hom`, `\tr`, `\ad`, `\ind`) — identical to peers.
- **`\Hom` macro is loaded but unused on this page.** Target writes `\mathbf{Cat}([n], C)` (line 664) instead of `\Hom_{\mathbf{Cat}}([n], C)`. Cosmetic; pick a convention with the peers.
- **Manual `\xrightarrow{f_1}` for nerve-string display (line 664)** is fine but worth knowing the peers prefer `\to` with subscript labels for short strings.
- **No locally introduced macros.** Good.
- **No invented delimiters.** Good.
- **Two display-math blocks use `<p style="text-align:center">$...$</p>` rather than `$$...$$`** (lines 274, 664). Other pages on the corpus use `$$...$$` consistently for display equations — for instance `infinity-categories.html` line 278. Switching to `$$` would centre via KaTeX's display mode and lose the inline `style=` attribute, matching peer convention.
- Title-cased SVG label `Filling Λ²₁` (line 938) and the readout strings use unicode subscripts (`Λ²_0`, `d₀`, `s⁰`) instead of KaTeX in some widget readouts — readable, but inconsistent with peer widgets that re-render math via `renderMathInElement` after each click (see `infinity-categories.html` lines 420, 537). The simplicial-sets readouts emit plain text into `<div class="readout">` and never re-render; if a future edit drops `$...$` markers in there expecting KaTeX, they will leak.

### Cross-page consistency notes
- **Broken anchor on a peer (low priority for this page, but worth flagging upstream).** `cocartesian-fibrations.html` lines 270 and 335 link to `./simplicial-sets-and-nerve.html#horns`; the actual section ids are `#kan-complex` and `#horn-filling`. The deep-link silently 404s. Either add an `id="horns"` alias to the §5 or §6 section (anchors are cheap), or fix the peer. `audit-callbacks.mjs --fix` would not catch this since it is a hand-rolled inline link, not an auto-generated callback.

## Severity
minor polish — the page is solid; the face-map notation drift with both peers is the one finding worth a focused fix, the rest are cosmetic.
