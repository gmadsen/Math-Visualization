# functor-of-points — pedagogical audit (2026-05)

**Section:** Algebraic geometry
**Compared against:** morphisms-fiber-products, schemes

## Summary
Strong page overall: voice is conversational-precise, every numbered section through §6 lands a worked widget, and the macros / chrome match the section template. Two real issues stand out — an unfinished self-correction left in the prose of §2, and several pieces of section-three jargon (Spec ⊣ Γ adjunction, Hilbert polynomial, fppf/fpqc descent, Hopf algebra) used without a definition or a callback.

## Findings
### Notation drift
- Ring-category font is inconsistent across the section: this page writes `\mathrm{CRing}` (lines 275, 283, 395, 533, 535), morphisms-fiber-products writes `\mathsf{Ring}` (line 349) and the same `\mathsf{Sch}` for schemes. `\mathsf{Sch}` is shared; the ring side should pick one convention. (Semantic-low / cosmetic.)
- `\Hom` subscript styling drifts within this page: `\Hom_{\mathsf{Sch}}` at line 272/1109 vs `\Hom_{\mathrm{CRing}}` at lines 395/535. Sit beside each other in the same display.
- Operator-name macro for matrix groups: `\mathrm{GL}_n`, `\mathrm{SL}_n`, `\mathrm{O}_n`, `\mathrm{Sp}_{2n}` (lines 243, 703, 820) all use `\mathrm`, while `\Spec`, `\Hom`, `\Gal` are `\operatorname` via macros. Either define `\GL` / `\SL` macros or convert to `\operatorname{GL}_n` to match the page's own pattern. (Cosmetic.)
- `\Spec` spacing drifts: `\Spec R` (lines 275, 393, 1140) vs `\Spec\,R` (line 1142, 1145) in the same paragraph. Pick one. (Cosmetic.)
- The script `\mathcal{M}_{1,1}` is fine in prose; inside the W6 SVG readout it is rendered as the Unicode `𝓜` (`𝓜`) escape (lines 1055-1056). Consistent with the corpus's "no KaTeX inside SVG `<text>`" practice, just flagging.

### Undefined jargon
- "by adjunction $\Spec \dashv \Gamma$" appears in §1 (line 273) with no definition of $\Gamma$ on this page and no callback. First-time reader of the page in isolation cannot decode it.
- "subschemes of $\mathbb{P}^n$ of Hilbert polynomial $P$" (line 283) — Hilbert polynomial used as the example clincher with no definition and no cross-page link.
- "fppf, fpqc, …" descent (line 1116) — acronym list in a §8 note with no expansion.
- "Hopf algebra" / "coaddition $t \mapsto t \otimes 1 + 1 \otimes t$" (line 848 inside the W4 readout) — Hopf algebra is undefined; this is the only place on the page it shows up, and it's also the only widget caption that introduces a new term.
- "lax-functorial" (line 1080) and "category fibered in groupoids" (line 1083) — both used in the §7 sketch with no callback. The §7 disclaimer is a "Preview", so a one-line "see stacks.html" would close the gap (the existing callback only points to `stacks.html#fib`, which is fine, but the prose itself never tells the reader that these terms are defined elsewhere).

### Tone mismatches
- §2, line 401: "Wait, check $(2,1)$: $1 = 8 + 1 = 9 \equiv 0 \not= 1$. Retract that. The widget below does the brute-force properly." This reads as authorial scratch work left in the prose — neither morphisms-fiber-products nor schemes nor category-theory ever "retract" inside the body text. Cleanest fix: drop the bad list entry and the apology; the widget already covers $\mathbb{F}_3$. (Semantic / pedagogical: planting an example a sentence later asks the reader to mentally undo, which is exactly the failure mode the corpus avoids elsewhere.)
- The "W1 ·", "W2 ·", … "W6 ·" widget-title prefixes are unique to this page. None of category-theory, schemes, or morphisms-fiber-products numbers its widgets in the title bar. Minor, but the page reads as more "lecture handout" because of it. (Cosmetic.)

### Missing worked examples
- §7 ("Preview: the fix is to target groupoids") has no widget — the §6 twist widget is reused-by-reference in the prose, but the section itself is pure exposition. A 2-state toggle showing "set fiber → groupoid fiber with isomorphism arrow" would land the reframe; without it the section is the only one with no toy to poke before the quiz.
- §8 ("The Yoneda embedding for schemes") is also pure prose + a note. The natural widget is "input: a natural transformation between two representable functors; output: the underlying scheme morphism" — i.e. exactly the bijection it's claiming. Currently the section relies on the §3 Yoneda visualizer for any interactivity.
- §9 ("Base change as pullback of functors") has only the `<div class="note">` worked fiber for $\Spec \mathbb{Z}[x]/(x^2 - p)$. Compare morphisms-fiber-products §4 fiber-product widget, which is the canonical interactive on this material; §9 should at minimum link to it (the callback does — fine — but a short widget showing $X(R) \times_{S(R)} Y(R)$ on a small example would close the loop).

### KaTeX macros / formatting
- Page-level macro block (lines 38-44) matches category-theory.html exactly. No locally invented macros.
- All delimiters used (`$…$`, `$$…$$`) match the loader contract; no invented forms.
- The `<select>` options in W2 and W4 contain Unicode math letters (`𝔸¹`, `𝔾ₘ`, `μ₂`, `μ₃`) instead of LaTeX. Because `js/katex-select.js` is loaded (line 23), these would render as native KaTeX if rewritten to `$\mathbb{A}^1$` etc. — currently they render as raw Unicode in both the popup and the widget readout. Low priority but a free upgrade.
- Auto-injected "Used in" backlinks at the end of §1 link to other anchors on functor-of-points.html itself (lines 377-379). This is the inject-used-in-backlinks audit doing what it's told, but the result reads as "see also: this same page". Worth checking whether the §1 concept's `prereqs` are over-broad.

## Severity
minor polish
