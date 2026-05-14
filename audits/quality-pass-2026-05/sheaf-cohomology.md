# sheaf-cohomology — pedagogical audit (2026-05)

**Section:** Algebraic geometry
**Compared against:** sheaves, etale-cohomology

## Summary
sheaf-cohomology.html is well-paced and notation-aligned with `sheaves.html` for the most part, but two semantic notation drifts (étale-subscript style vs. `etale-cohomology.html`, and a malformed `\mathrm{\mathcal{H}\!om}` macro) and a handful of jargon-before-definition trip-ups in §§1–4 deserve a touch-up. Three numbered sections lack a worked widget despite having computable content.

## Findings
### Notation drift
- **Semantic — étale subscript inconsistent with the section's other capstone.** `sheaf-cohomology.html` writes `H^i_{\mathrm{\acute et}}` (e.g. lines 318, 805, 807, 816, 817, 818, 822, 825, 838) using `\mathrm{\acute et}`, while `etale-cohomology.html` consistently uses `H^i_{\text{ét}}` (e.g. lines 282, 341, 343, 345, 690, 696). Both render but produce visibly different glyphs (`\acute et` is upright "et" with a stacked acute on the second letter; `\text{ét}` uses the proper precomposed character). Recommend: settle on `\text{ét}` per the étale-cohomology page, since étale-cohomology owns that notation.
- **Cosmetic — malformed wrapper around the internal-Hom sheaf.** sheaf-cohomology line 740: `\mathrm{\mathcal{H}\!om}(\mathcal{F}, \mathcal{O}_X)`. The references in `sheaves.html` (lines 1197–1199, 1443, 1462, 1480, 1706, 1734) consistently write `\mathcal{H}\!om(\mathcal{F}, \mathcal{G})` without the surrounding `\mathrm{…}`. Wrapping `\mathcal` in `\mathrm` is redundant and will not render the calligraphic H reliably across themes. Recommend: drop the `\mathrm` wrapper.
- **Cosmetic — Pic / NS / Sym / Cl / Frac / Proj / GL all live as `\mathrm{…}` here.** This matches `sheaves.html`'s `\mathrm{Pic}` and `\mathrm{Sym}^k` (lines 1464, 1477, 1698) and the page is internally consistent, but note that `\Hom`, `\Spec`, `\Gal`, `\tr`, `\ad`, `\ind` are pre-defined as `\operatorname{…}` macros in the `<head>` loader (lines 22–29). New names (`Pic`, `NS`, `Sym`, `Cl`, `Frac`, `Proj`, `GL`, `Frob`) are not promoted to operator macros — sheaf-cohomology and the references all leave them as ad-hoc `\mathrm{…}`. Low-priority; flagged so a future macro pass treats them uniformly.
- **Cosmetic — `H^\bullet` vs `H^i_\bullet` mixed.** sheaf-cohomology hero (line 280) writes `H^\bullet(\mathbb{P}^n, \mathcal{O}(d))`; the body almost everywhere uses indexed `H^i`. References vary similarly. No action required.

### Undefined jargon
- **§1 invokes "fine resolution" before §4 defines fine sheaves.** Line 321: "On a smooth manifold with $\mathbb{R}$-valued forms (fine resolution), it reduces to de Rham." Fine / soft / flabby resolutions are introduced in §4 (line 460, line 481). A short forward-reference parenthetical (e.g. "see §4 for what 'fine' means") would defuse this.
- **§1 names "right derived functors" before §4 defines them.** Line 301: "the global-sections functor $\Gamma(X, -)$ is left-exact but not right-exact; its right derived functors $R^i\Gamma$ are what you want." This is then re-derived from scratch in §4 (line 442), which is fine, but a one-clause "(introduced in §4)" callback would help a reader who doesn't have homological algebra prereq freshly loaded.
- **§4 widget readout uses "Brauer group", "Dolbeault", "Stein" with no in-text gloss.** LES stepper (lines 970, 987) reads `'H²(𝒪×) = 0 — Brauer group vanishes here'` and `'H¹(𝒪) = 0 (𝒪 is fine, or: Dolbeault + Stein)'`. None of these terms is defined on the page, and there is no glossary popover wired here. For an "advanced" page that is acceptable hand-wave, but worth either (a) trimming the parenthetical or (b) adding a one-line note above the widget.
- **§8 mentions `\mathrm{Corr}(X,Y)` without defining "correspondence."** Line 686: `\mathrm{Pic}(X \times Y) = \mathrm{Pic}(X) \oplus \mathrm{Pic}(Y) \oplus \mathrm{Corr}(X,Y)`. The word "correspondence" appears once with no further explanation. A short "(the Künneth correction term)" parenthetical would suffice.
- **§9 invokes `\Omega^p` (sheaf of holomorphic / Kähler $p$-forms) cold.** Line 769 (Akizuki–Nakano bullet): `H^q(X, \Omega^p \otimes L) = 0`. Reader without algebraic-de-Rham background must take it on faith. Either parenthetical gloss or a callback link to `differential-forms.html`.
- **§9 "very ample" appears in a parenthetical without prior introduction.** Line 762: "Specialize to $L = \mathcal{O}(A)$ for a very ample divisor $A$." "Very ample" is mentioned in passing but never glossed; the linked positivity-and-ample-line-bundles backlink helps but is an external page.

### Tone mismatches
- **§5 "The 2-open cover of $S^1$ in §3 is not good (the overlap has two components); but a 3-open cover with three triply-overlapping arcs *is* good"** — fine conversational tone, matches the references.
- **§9 "Two structural theorems whose statements alone pay rent."** is a nice hook, on-brand with category-theory.html voice.
- **§5 counterexample paragraph is mildly self-undermining.** Line 537: "But the cover is not a cover! The overlap is empty, which isn't a Leray condition but does tell you the cover fails to cover." The double-back ("not a cover … fails to cover") muddies a clear pedagogical point — the lesson is just "Čech needs honest covers." A one-sentence trim would tighten it.
- **§7 has a wall of formula-without-narration in the "Intermediate $H^i$ vanish" paragraph (line 628).** The Koszul-decomposition argument is dense and ends with "Full details in Hartshorne III.5." — referring out instead of giving the reader something to internalise. Either expand by one sentence ("Each multi-degree behaves like a sub-cube of $\{0,1\}^{n+1}$ recording 'which variables are inverted'…") or add a small worked example like the existing $\mathbb{P}^2, \mathcal{O}(-3)$ check from §5.
- **§6 LES stepper notes mix `$\mathbb{Z}$` (KaTeX) and `ℤ` (literal Unicode) freely.** Lines 962–989 in the widget data use `'H⁰(ℤ) = ℤ'` rather than `'H^0(\mathbb{Z}) = \mathbb{Z}'`. The note panel is rendered as plain HTML (with reKatex sweep on the SVG-foreignObject group boxes only), so the literal Unicode is intentional — but it's a minor stylistic mismatch versus the rest of the page's KaTeX-everywhere voice. Acceptable; flagged.

### Missing worked examples
- **§2 Čech cohomology** (h2 line 325): definition-only section; the worked computations live in §3. The quiz fires on §2 but the only "toy to poke" is the §3 widget. Consider: either (a) move the §3 $S^1$ widget up to live alongside the §2 definition, or (b) a tiny inline example of computing $\check{C}^0 \to \check{C}^1$ for a 2-open cover of an interval, just to make the cocycle / coboundary indices concrete before the §3 worked computation.
- **§4 Derived functor cohomology** (h2 line 441): pure definition + §4.5 Leray spectral sequence formula. No widget; the closest "thing to poke" is the §6 LES stepper. A small Godement-resolution viewer (apply $\mathcal{G}$ to a stalk — show the product structure) would be on-brand.
- **§5 Comparison: Čech = derived for Leray covers** (h2 line 510): the $\mathbb{P}^2$ worked example at line 523 is good, but the section has no widget. Could re-use the §7 dimension-table widget by parameterising on $n$ early.
- **§9 Serre duality and Kodaira vanishing** (h2 line 734): table reflection is mentioned but not made interactive — the §7 `w-table` widget already shows the duality reflection visually; consider linking it explicitly from §9 ("Slide $n$ in the §7 table to watch the reflection $d \leftrightarrow -d - n - 1$ become the Serre-duality pairing"), or add a small "duality partner finder" widget.
- **§10 Coda** (h2 line 797): pure prose, no widget. Acceptable for a coda, mirrors `etale-cohomology.html`'s closing comparison section's tone.

### Section grade summary
| section | status |
|---|---|
| 1. Why cohomology? | ok (intro, no widget expected; minor jargon-before-definition flagged) |
| 2. Čech cohomology | drift (definition-only, quiz with no widget; computations deferred to §3) |
| 3. Čech for simple spaces | ok (w-circle widget) |
| 4. Derived functor cohomology | missing-example (definition-only, no widget) |
| 5. Comparison: Čech = derived | drift (worked $\mathbb{P}^2$ example present, but no widget) |
| 6. Long exact sequence | ok (w-les stepper) |
| 7. Cohomology of $\mathcal{O}(d)$ | ok (w-cech-p1 + w-table) |
| 8. Picard group | ok (w-pic + w-monomials) |
| 9. Serre duality and Kodaira vanishing | missing-example (no widget; pure prose + sanity-check list) |
| 10. Coda | ok (forward-pointer section) |

### KaTeX macros / formatting
- **`\mathrm{\acute et}` is non-standard and inconsistent with the section sibling.** Three options to standardise: (a) match `etale-cohomology.html`'s `\text{ét}`; (b) promote to a `'\\et':'\\mathrm{\\acute et}'` (or `\\text{ét}`) head-loader macro and use across both pages; (c) leave as-is and accept the visual divergence. Recommend (b) at the corpus level.
- **`\mathrm{\mathcal{H}\!om}` (line 740) is a malformed wrapper.** `\mathcal` inside `\mathrm` is the wrong nesting. Use `\mathcal{H}\!om` directly, matching `sheaves.html`.
- **No new macros are introduced locally outside the head-loader.** Head-loader macros are the standard six (`\Spec`, `\Gal`, `\Hom`, `\tr`, `\ad`, `\ind`) — verbatim across all three files. No drift.
- **Delimiters clean.** `$…$`, `$$…$$`, `\(…\)`, `\[…\]` only; no invented delimiters in widget text or readouts.
- **`<select>` widget options contain LaTeX (lines 566–568, etc.) and `js/katex-select.js` is loaded (line 187).** No drift from the AGENTS.md "LaTeX inside `<option>` requires `js/katex-select.js`" rule.

## Helper-block / widget-chrome hygiene
- **Top-of-body helper block (lines 195–257) is a faithful copy of category-theory.html's, with two additions: `binom(n,k)` and `reKatex(el)`.** Both are local utilities used by the §6 LES stepper and the §7 dimension table; they don't conflict with the canonical helpers. Acceptable extension.
- **Widget chrome compliant.** Every widget uses `<div class="widget">` + `<div class="hd"><div class="ttl">…</div><div class="hint">…</div></div>` + `<div class="readout">…</div>`. No ad-hoc classes. SVG `<title>` elements are present on every `<svg>` (good for a11y).
- **Color tokens used throughout — no hex literals in widget markup.** SVG fills/strokes reach for `var(--blue)`, `var(--pink)`, `var(--yellow)`, `var(--green)`, `var(--violet)`, `var(--mute)`, `var(--ink)`, `var(--line)`, `var(--panel2)`. Two stray `'#fff'` literals (lab text in w-circle, etc.) and `'#111'` (button-inverted fill in w-pic dot stroke) — these are deliberate "always-bright" highlights, but `var(--ink)` would be more theme-portable. Low priority.
- **Quiz placeholders match concepts.** Placements: `cech-cohomology` (§2), `derived-functor-cohomology` (§4), `leray-acyclic-covers` (§5), `long-exact-sequence-cohomology` (§6), `applications-picard-serre` (§9). No quiz on §1 / §3 / §7 / §8 / §10 — slightly thin coverage given §7 and §8 are the computational heart; consider whether `cohomology-of-twisting-sheaves` and `picard-via-h1` deserve their own quiz placeholders.
- **Callback / used-in / changelog blocks all present and fenced correctly.** No drift from injector contracts.

## Severity
minor polish

