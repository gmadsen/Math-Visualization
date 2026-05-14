# tropical-geometry — pedagogical audit (2026-05)

**Section:** Algebraic geometry
**Compared against:** algebraic-curves-higher-genus, toric-varieties

## Summary
Strong, well-paced page with six interactive widgets that hit the canonical arc (semiring → curves → tropicalization → Bernstein/stable intersection → Baker–Norine → Mikhalkin/SYZ); voice and chrome match the section peers. Drift is mostly cosmetic notation (`\mathrm{}` vs `\operatorname{}`), one mild jargon-before-definition slip in the §3 hero, and one §6 subsection that gestures at SYZ/Gross–Siebert with no widget anchor.

## Findings

### Notation drift
- `\mathrm{Trop}(X)`, `\mathrm{trop}(f)`, `\mathrm{Newt}(f)`, `\mathrm{conv}`, `\mathrm{val}`, `\mathrm{Sk}`, `\mathrm{stab}`, `\mathrm{MV}` (target lines 559–565, 710, 715, 1027) — all use `\mathrm{}`. Section peers prefer `\operatorname{}` for the same flavour: toric-varieties uses `\Spec` (page macro = `\operatorname{Spec}`) and algebraic-curves-higher-genus's audit explicitly flagged its own `\mathrm{Pic}` / `\mathrm{Jac}` drift as a cross-page inconsistency. Recommend: either switch to `\operatorname{Trop}` etc. or add `\Trop`, `\Newt`, `\MV`, `\Sk` macros to the page-head macro block alongside the existing `\Spec`/`\Gal`/`\Hom`/`\tr`/`\ad`/`\ind` (target lines 22–29). Cosmetic but cross-page-inconsistent.
- `\mathcal{M}^{\mathrm{trop}}_{g,n}` (target lines 869, 1138) uses superscript `\mathrm{trop}`; algebraic-curves-higher-genus writes the moduli space as `\mathcal{M}_g`, `\overline{\mathcal{M}}_g`, `\mathcal{M}_{1,1}` (no superscript decoration). Acceptable since `^{\mathrm{trop}}` is genuinely needed to disambiguate, but the surrounding prose mixes `M^{\mathrm{trop}}_{g,n}` (target line 869) with `M^{\mathrm{trop}}_{g,n}` and once writes "$\overline{\mathcal{M}}_{g,n}$" (line 869) — pick one. Cosmetic.
- `\mathrm{Gr}(2,n)^{\mathrm{trop}}` (line 1112) for the tropical Grassmannian is fine; toric-varieties uses `\mathrm{Bl}` for blowup with the same `\mathrm{}` flavour, so the page is internally consistent.
- Widget readouts and SVG text fall back to Unicode mid-page ("Σ w·u", "deg K_Γ = 2g − 2", "ε ≈ 0", "ℙ²", "ℝ²", "ℂ*", "ω₁") — algebraic-curves-higher-genus and toric-varieties do the same in their `<text>` and `<readout>` elements, so this is house-conformant. No drift.
- `\Z_{>0}` is written `\mathbb{Z}_{>0}` (target line 419), `\mathbb{Z}^2_{\ge 0}` (line 414), `\mathbb{Z}/2$` (line 633 of higher-genus) — target consistently uses `\mathbb{Z}` without a `\Z` macro; matches both peers. Consistent.

### Undefined jargon
- "Berkovich analytification" (target line 869, "It is the *skeleton* of the Berkovich analytification of $\overline{\mathcal{M}}_{g,n}$") drops cold in §5 with no in-page definition, no callback aside, and no glossary popover anchor. Same term reappears in §5 final paragraph ("by analytification, the picture lifts back to algebraic curves: a smooth projective curve $C$ over a non-archimedean field has a skeleton $\mathrm{Sk}(C^{\mathrm{an}})$") still without definition. The reader is asked to know what an analytification *is*. Compare toric-varieties §6 which introduces "reflexive polytope" with a full sentence of unpacking before using it. Medium severity for §5.
- "specialization inequality" (line 1027) is named once at the very end of §5 with the gloss "(the *specialization inequality*)" but no statement of what it inequates — `r_{\mathrm{trop}}(D) \ge r_{\mathrm{alg}}(D)` would be a one-line fix. Low severity.
- "$\psi$-class intersections on $\overline{\mathcal{M}}_{g,n}$" (line 1104) drops in §6 with no callback and no in-page definition; psi classes are not defined anywhere on the page. Compare algebraic-curves-higher-genus which names `\lambda` (Hodge class) without defining it, but flags this as a closing aside; here it's mid-section. Low–medium severity.
- "focus-focus points" (line 1107) is named in the SYZ subsection without defining "integral affine manifold" — the prior sentence mentions "integral affine manifold" but does not say what it is, and "focus-focus" is a singularity classification term from integrable-systems theory that has no callback. Low severity (the SYZ subsection is intentionally a preview).
- "$g^1_2$" / "$g^1_3$" notation is used on algebraic-curves-higher-genus but not on this page; tropical-geometry never uses Brill–Noether symbols, so no cross-page jargon-leak. Positive consistency.
- "Hopfield-Tank min-plus networks" (line 1113) is name-dropped in §6 with no link out and no in-page gloss. Acceptable for a Connections-style bullet but stretches the "preview is allowed to gesture" rule slightly. Low severity.

### Tone mismatches
- Voice generally lands the conversational-but-precise target: hero ("watch algebraic geometry collapse into piecewise-linear combinatorics", line 259), §1 close ("One substitution — $(+,\cdot) \rightsquigarrow (\min,+)$ — promotes polynomial roots to corner loci", line 399), §3 close ("compresses an enormous moduli space onto a finite combinatorial gadget", line 694), §6 final bullet ("the ridiculously cheap combinatorial probe", line 1138). All match toric-varieties §1 ("varieties with torus symmetry baked in") and algebraic-curves-higher-genus §1 ("the same data wears two coats").
- §6 subsection "Mirror symmetry: the SYZ picture" (lines 1106–1107) is the only section that drifts toward textbook-abstract recital: a single dense paragraph naming Strominger–Yau–Zaslow, T-duality, special-Lagrangian torus fibrations, integral affine manifolds, focus-focus points, and the Gross–Siebert reconstruction program — all in five sentences, no widget, no concrete instance. Compare toric-varieties §6 which the sibling audit flagged as the same kind of textbook-recital drift; tropical-geometry's §6 SYZ subsection has the same shape. Medium severity.
- §6 closing list ("Outside enumerative geometry") is a bulleted name-drop of phylogenetics, optimization, auctions — fine for a closing list but the auction bullet ("Tomas Klimpel, Elizabeth Baldwin, Paul Klemperer", line 1114) reads like a citation footnote rather than an explanation. Low severity.

### Missing worked examples
- §6 "Mikhalkin's correspondence and mirror symmetry" has one widget (the $N_d$ bar chart at line 1046) for the enumerative half but **no widget for the SYZ / Gross–Siebert half** (lines 1106–1107). Per AGENTS.md "every numbered `<h2>` section should have at least one concrete computation or widget" — §6 satisfies this overall via the Mikhalkin bar chart, but the SYZ subsection is widget-free prose. A small interactive picker showing an integral affine base with a focus-focus singularity, or a clickable "tropical base ↔ smoothing" toy, would patch this. **Medium priority.**
- The §6 Mikhalkin widget (lines 1046–1102) is more of a static table-as-bar-chart than a computation — sliding $d$ just selects which precomputed $N_d$ to highlight. Compare the §3 Newton-polytope ↔ tropical-curve widget (lines 567–692) and §5 chip-firing widget (lines 875–1025) which are genuinely live computations. Toric-varieties §3 orbit-cone widget is the same style (lookup-by-click) and was not flagged, so this is acceptable, but the contrast with the live widgets in the same page is conspicuous. Low severity.
- §7 ("Connections") is intentionally narrative — matches both peers; not flagged.

### KaTeX macros / formatting
- Helper-block contents (target lines 187–238) are byte-identical to category-theory.html / algebraic-curves-higher-genus.html (`$`, `$$`, `SVG`, `ensureArrow`, `drawArrow`, `drawNode`). Good.
- KaTeX delimiter set in the loader (lines 14–20) matches house convention exactly.
- Macro list (lines 22–29) is the standard six-entry block; no locally-introduced macros. The page uses no `\Trop`, `\Newt`, `\MV` macros even though those operators recur ~10× — see Notation drift; either the page should add macros or convert to `\operatorname{}`.
- Widget chrome (`.widget / .hd / .ttl / .hint / .readout / .row`) used consistently across all six interactives; no ad-hoc class names. No reach for `.note` / `.ok` / `.bad` (the page uses `.note` once at line 274 for the "Why tropical?" aside and `.ok` once at line 399 for the §1 take-away — fine, parallel use to toric-varieties §3).
- SVGs include `viewBox` and `<title>` (lines 278, 433, 569, 719, 888, 1048) — a11y baseline met.
- Inline KaTeX inside `<select>` `<option>` text on line 879 (the chip-firing widget): `<option value="k4">$K_4$ (g=3)</option>`. The page loads `js/katex-select.js` (target line 178) so this is correctly wired — no drift. The other three options use plain text ("theta graph (g=2)", "3-banana (g=2)", "dumbbell (g=2)"), which is also fine.
- Slider value spans show raw text (`c_0 = 3` at line 282) rather than rendered KaTeX — consistent with peers (toric-varieties widget readouts do the same).
- Widget readout for §2 (line 535) emits `'<strong>Balanced</strong>'` with HTML — `out.innerHTML = ...`, fine. Emoji-style markers `'✓'` / `'✗ — UNBALANCED'` (line 533) match the `✓ mastered` motif used in `js/quiz.js`. Consistent.
- One minor display-math hygiene nit: §1 displays formulas using `<p style="text-align:center">$…$</p>` (lines 267, 271, 413, 419, 559, 562, 565, 711, 714, 871) rather than `$$…$$` blocks. Both render, but algebraic-curves-higher-genus consistently uses `$$…$$` at the start of a line (e.g. line 474, 555). Cosmetic — `$$…$$` would also let KaTeX align the equation correctly without the `text-align:center` CSS hack.
- Per-section callback / backlinks asides are all wrapped in the proper `<!-- callback-auto-begin -->` / `<!-- backlinks-auto-begin -->` fences — no duplicate-aside issue like the one toric-varieties had. Clean.

## Severity
minor polish (with one pedagogical gap: the §6 SYZ/Gross–Siebert subsection is widget-free and assumes Berkovich/analytification vocabulary; consider adding a small integral-affine-base picker and a one-line gloss for "Berkovich analytification" in §5)

---
_Orchestrator: run `node scripts/rebuild.mjs` after any content changes._
