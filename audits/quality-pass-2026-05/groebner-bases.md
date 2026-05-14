# groebner-bases — pedagogical audit (2026-05)

**Section:** Algebra & homological
**Compared against:** commutative-algebra, algebra

## Summary
Strong page — voice, notation, and worked-widget cadence all align with the peers; every numbered section has a non-trivial interactive that recomputes the claim made in the prose. Only nits: a few passing terms ("syzygy", "block order", advanced names in the §5 complexity paragraph and Connections outro) drop in without definition, and §8's plain-text readouts use Unicode `V_R(I) = ∅` once where the page elsewhere keeps everything inside KaTeX.

## Findings

### Notation drift
- `\mathrm{LT}, \mathrm{LM}, \mathrm{LC}, \mathrm{lcm}, \mathrm{Nil}` etc. used in target; matches peer practice (commutative-algebra:395 `\mathrm{Nil}(A)`, :713 `\mathrm{nil}(A)`, algebra:1824 `\mathrm{Stab}`). `\Spec`, `\Hom`, `\Gal` are reserved for the head-defined macros — target obeys this.
- `\overline{k}` (target:1158, 1236) is consistent — peers use the same form for algebraic closure.
- Cosmetic only: target uses `\dfrac` once in the S-polynomial display (line 739) where neither peer reaches for `\dfrac` in any prose context. `\frac` would render identically in `$$…$$` since the surrounding line is in inline `$…$`. Low priority — `\dfrac` is just forcing display style on an inline formula sitting on its own centered `<p>`.
- `V_R(I) = ∅` in §8 readout (line 1273) drops to plain Unicode subscript inside the JS string while the prose immediately above writes the same set as `V(I)\subset\overline{k}^n`. Inside a `.readout` block a plain-text rendering is acceptable (peers do similar in their `<pre>`-style readouts), so call this cosmetic.

### Undefined jargon
- **"syzygy"** (line 741) — appears in scare quotes inside the §4 motivating paragraph for S-polynomials. Not defined here or earlier. Light-touch flavor word; readers chasing it will hit the term cold. Either define ("a relation $\sum h_i f_i = 0$ among generators") in a parenthetical, or drop the word.
- **"block order"** (line 1143, §7 "Why lex" paragraph) — introduced in bold (`<strong>block order</strong>`) but with no definition beyond the immediately following clause "lex on the elimination block, grevlex on the rest". Reads ok in context, but the bold styling implies a defined term. Either soften the bold or expand to "a *block order* combines two orders by partitioning variables into blocks: lex …".
- **"signature-based algorithms"**, **"FGLM order conversion"**, **"homotopy continuation"**, **"SAGBI bases"**, **"tropical geometry as the logarithmic shadow of Gröbner degenerations"**, **"HFE, multivariate signature schemes"** — all appear in the §5 complexity paragraph (line 891) and the Connections outro (lines 1310, 1317) as a name-drop list. Acceptable as forward-pointers in a capstone outro, but none are defined and most have no callback link. Consider either pruning to two or three references, or wrapping each in a brief gloss ("FGLM, an algorithm for converting between monomial orders").
- **"primitive 6th roots of unity"** (line 1269) appears in the §8 readout without prior buildup; readers without complex-numbers background see it cold. Negligible — the surrounding "u = (1 ± √-3)/2" carries the meaning operationally.

### Tone mismatches
_None._ Voice matches the peers throughout: brief framing prose → boxed definition / theorem → consequences → widget → small-print followup. The §5 trio of bolded paragraphs (Termination / Correctness / Complexity) and §3's three pill-prefixed consequences (`generates` / `unique remainder` / `ideal membership`) both mirror commutative-algebra's repeated `<span class="pill">` rhythm in §1, §6, §11.

### Missing worked examples
_None._ All eight numbered sections plus §9 Connections carry an interactive widget. The two cases that could be flagged are not real gaps:
- §6 reduced Gröbner bases — widget is a static deterministic walkthrough rather than truly interactive (one button, one branch). Defensible because the value is "watch two messy bases land at the same canonical form", but a small input control (let the reader choose which non-canonical generator to add) would convert it from a slideshow into something to poke.
- §7 elimination — widget body shows pre-computed lex GB rather than running Buchberger live. Explicitly justified in the comment ("§5 widget computes it live from scratch") and the small-print note. Reasonable design; mention only because it is the lone widget that is essentially a pretty-printer rather than a calculation.

### KaTeX macros / formatting
- No locally-defined macros beyond the page-level head block (Spec, Gal, Hom, tr, ad, ind), which is verbatim identical to commutative-algebra and algebra. No drift.
- `\mathrm{LT}` etc. are written as `\mathrm{...}` rather than promoted to `\LT` macros — same choice the peers make for `\mathrm{nil}, \mathrm{Jac}, \mathrm{Stab}`. Consistent.
- §3 `<select id="st-pick">` has KaTeX inside `<option>` (lines 625-628). `js/katex-select.js` is loaded in `<head>` (line 178), so the popover renders correctly. Wired right.
- One minor: the inline display `$S(f,g) \;=\; \dfrac{\gamma}{\mathrm{LT}(f)} f \;-\; \dfrac{\gamma}{\mathrm{LT}(g)} g.$` (line 739) uses `\dfrac` inside a `$…$` inline pair on a centered `<p>`. The peers consistently switch to `$$…$$` (display delimiters) for any standalone equation; see commutative-algebra:1448 `<p style="text-align:center">$A \;\cong\; \prod_{i=1}^r A_{\mathfrak{m}_i}$</p>` for the same `style="text-align:center"`-with-inline-`$` pattern, so target is actually following peer convention here. Cosmetic — flag only because `\dfrac` is the workaround for inline display, while `$$…$$` would be more idiomatic for a centered standalone formula.

## Severity
minor polish
