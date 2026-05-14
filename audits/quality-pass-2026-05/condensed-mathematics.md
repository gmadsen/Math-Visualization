# condensed-mathematics — pedagogical audit (2026-05)

**Section:** Algebra & homological
**Compared against:** category-theory, derived-categories

## Summary
The page is intellectually strong, well-paced, and the four interactive widgets (Yoneda probe, snake-lemma comparison, solidity test, LTE timeline) are exactly the right gestures for the material. Two real bugs need fixing — an undefined `\liq` macro that breaks the rendered tensor symbol, and a milestone-button label/data desync in §5 — plus a handful of cosmetic notation drifts.

## Findings

### Notation drift
- **`\mathbb Z` (no braces) and `\mathbb{Z}` (braced) are mixed within the same paragraphs.** Examples: `\mathbb Z_{\mathrm{disc}} \to \mathbb Z_p` in the §1 intro (line 266), but `$\mathbb{Z}_p$ ($p$-adic integers)` in the adjacent widget button (line 286); §3 uses `$\mathbb Z[S]$` (line 591) and `$\mathbb{Z}[S]$` (line 618) on facing paragraphs. Peers are uniformly braced (`derived-categories.html` line 272 `$\mathbb{Z}$-graded`, category-theory throughout). Settle on `\mathbb{Z}` / `\mathbb{R}` / `\mathbb{Q}` everywhere.
- **`\mathrm{Hom}` vs the page's own `\Hom` macro.** The KaTeX header defines `'\\Hom':'\\operatorname{Hom}'` (line 25), and references use `\Hom` consistently (`category-theory.html` line 277, `derived-categories.html` line 459). The condensed page instead writes `\underline{\mathrm{Hom}}` (line 449) and `\mathrm{RHom}_{\mathrm{Solid}}` (line 615). Should be `\underline{\Hom}` and `\operatorname{RHom}_{\mathrm{Solid}}` (or define a local `\RHom` macro).
- **Solid-tensor symbol `\otimes^{\blacksquare}`** (line 613) — unique to this page; fine as-is since the literature uses `■`, but flag because no peer page uses `\blacksquare`.
- **Inconsistent script for "Solid" / "Liquid".** Both `\mathrm{Solid}(\mathrm{Ab})` and bare `\mathrm{Solid}` appear; `\mathrm{Liquid}_p(\mathbb R)` and `\mathrm{Liquid}(\mathbb R)` both occur (lines 760, 905). Pick one inflection per object.

### Undefined jargon
- **"pro-étale site"** is named in the §1 title and prose (line 264, 266) before it is defined. The actual definition arrives at line 268 ("Let $*$ be a point and consider its pro-étale site…"), which is fine, but the hero (line 260) leans on "sheaves on the pro-étale site of a point" with zero callback support — a reader landing here cold sees three undefined terms in one breath.
- **"Stonean"** is dropped parenthetically at line 268 ("extremally disconnected profinite sets (Stonean spaces — …)"). Good — definition is inline. No issue.
- **"compactly generated weak Hausdorff" / `CGWH`** (line 278) is named without expansion or callback; relies on the reader having met the convenient-category-of-spaces lore.
- **"six-functor formalism"** (line 451 then again line 1043) — invoked twice as a virtue but never sketched. Brilliant-style would benefit from a one-sentence "(roughly: $f_*, f^*, f_!, f^!, \otimes, \mathrm{RHom}$ all well-behaved)".
- **"prismatic cohomology" / `R\Gamma_\Delta`** (line 1047) — a paragraph-deep name-drop with no working definition. Acceptable in §6 as a survey gesture, but a one-sentence parenthetical would close the loop.
- **"bornological / quasi-abelian"** (line 765) — invoked as the foil that liquid replaces; "quasi-abelian" is glossed once at line 447 ("only quasi-abelian in Schneiders's sense") but "bornological" is never explained.

### Tone mismatches
- The page is a touch more lecture-formal than `category-theory.html` (which actively uses "you" and "see why?" prompts). Condensed leans on phrases like "as a working algebraist would expect" (line 615) and "this is precisely the kind of pathology" (widget readout, line 554). This is consistent with `derived-categories.html`'s slightly drier register, so it reads as section-coherent rather than off-key.
- Hero (line 260) is one ~60-word sentence with three semicolons and four undefined technical terms — denser than `category-theory.html`'s hero ("A disciplined way to say…") and `derived-categories.html`'s ("Inverting quasi-isomorphisms: triangulated structure…"). Consider splitting into two sentences and softening the "climaxing in" flourish.
- §5 closing paragraph dips into editorial-essay voice ("This was the first time a major living mathematician used Lean to gain confidence in a theorem they personally doubted." line 911). Excellent prose, but the bolded sentence is more punctuation-heavy than the surrounding section pattern. Keep the content; soften the bold.

### Missing worked examples
- §1, §2, §3, §4, §5, §6 each carry an interactive widget — coverage is complete.
- §3 (solid) would benefit from one explicit hand-computation, e.g. "let's verify $\mathbb{Z}_p \widehat\otimes^{\blacksquare} \mathbb{Z}_p = \mathbb{Z}_p$ end-to-end", parallel to derived-categories' line 459 worked-example paragraph. The widget shows iso/not-iso verdicts but never carries the reader through one full computation prose-side.
- §5 is timeline-only; no worked instance of the Ext-vanishing statement. Even a trivialised toy ("for $V = \mathbb{R}$ and $S = \{*\}$, the statement reduces to…") would anchor the abstract Ext claim before the timeline takes over.

### KaTeX macros / formatting
- **`\liq` is used but never defined.** Lines 762, 765, 780 contain `\otimes^{\liq}`. The page-local macro block (lines 22–29) defines only `\Spec, \Gal, \Hom, \tr, \ad, \ind`. With `throwOnError:false` this fails silently — the rendered glyph is blank or raw text. **Fix:** either add `'\\liq':'\\mathrm{liq}'` (or `'\\blacklozenge'`) to the macros block, or write `\otimes^{\mathrm{liq}}` inline.
- **`\bigoplus_{S(T)}` and `\widehat{\bigoplus}_{S}`** (line 595): the subscripts read fine, but the second is unusual — `\widehat\bigoplus` doesn't quite typeset cleanly in KaTeX; consider `\widehat{\bigoplus}_S`.
- **`R\Gamma_{\mathbb{\Delta}}`** (line 1047): `\mathbb{\Delta}` is a redundant double-style call — `\Delta` alone (or `\mathbb{\Delta}` if you really want blackboard-bold delta) compiles cleanly, but `\mathbb{\Delta}` is non-standard. Prismatic literature uses ▲ (`\blacktriangle`) or just `\Delta`.
- **Widget readout strings use ASCII fallback.** `Z_p`, `tensor`, `aleph_0`, `pi-tensor` (e.g. lines 343–345, 818, 856) — peers do this too inside JS string literals (it's the standard workaround for SVG `<text>` not auto-rendering KaTeX), so consistent. Just flagging that the §4 readout uses both `liquidTensor_p` and `liquid_p` for the same operator (line 861) — pick one.

## Severity
minor polish (plus one real bug: `\liq` macro is undefined, and the §5 button labelled "May 2022 — main thm" carries `date: 'May 28, 2021'` — label/data desync).
