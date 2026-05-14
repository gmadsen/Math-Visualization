# projective-plane — pedagogical audit (2026-05)

**Section:** Algebraic geometry
**Compared against:** bezout, schemes

## Summary
The page is mostly well-aligned with the section: voice, KaTeX macros, color tokens, and helper block all match canon. Two real gaps: §7 (duality) and §8 (cross-ratio) are pure prose with no widget, and §8's last paragraph piles up several undefined terms (Klein four-group, $j(\lambda)$, hyperelliptic ramification, harmonic conjugates) in a single sentence.

## Findings

### Notation drift
- `\mathrm{PGL}_3(K)` / `\mathrm{GL}_3(K)` (projective-plane.html:789, 792) versus the corpus convention of `\operatorname{...}` for algebra-set names — `\Hom`, `\Spec`, `\Gal` are all defined as `\operatorname{...}` in the page macro list (projective-plane.html:22-29). Recommend `\operatorname{PGL}_3(K)` for symmetry; cosmetic.
- `\Spec` macro is defined in the head (projective-plane.html:23) but used only once in body (line 1051: "every scheme is locally $\Spec$ of a ring"). schemes.html and bezout.html both use the macro freely; here it is essentially dead. Low priority.
- `\bar{K}` (projective-plane.html:804) vs `\overline{k}` in bezout.html:309 ("$\overline{k}$, the algebraic closure"). Two different overlines for "algebraic closure" across sibling pages. Cosmetic.
- "$\mathbb{P}^2_{\mathbb{C}}$" (bezout.html:805 readout text) vs "$\mathbb{P}^2(\mathbb{C})$" (projective-plane.html:930). Both forms appear on projective-plane itself (it uses the functor-of-points form `\mathbb{P}^2(K)`). Pick one and stick with it; cosmetic.

### Undefined jargon
- "<strong>inflection point</strong>" appears in the hero subtitle (projective-plane.html:263) — "the elliptic curve grows an inflection point at infinity" — but is never defined; first quasi-definition is much later in §9 ("$9$ inflection points in $\mathbb{P}^2(\mathbb{C})$ (Bézout: $C$ meets its Hessian, also a cubic, in $3\cdot 3 = 9$ points)", projective-plane.html:933). Hessian is also used here without definition. Quote: "the elliptic curve grows an inflection point at infinity."
- "Pascal" and "Brianchon" (projective-plane.html:898) are stated as a duality example without ever defining what either theorem says in standalone form, beyond a single parenthetical: "(six points on a conic $\Rightarrow$ three collinear points)" / "(six tangents to a conic $\Rightarrow$ three concurrent lines)". The bezout.html page later does this properly with a hands-on Pascal widget (bezout.html:816-826). projective-plane should either gain a Pascal mini-widget or explicitly punt to bezout.
- §8 cross-ratio paragraph (projective-plane.html:907) chains: "Klein four-group $V_4\subset S_4$", "$S_4$-invariant", "$j$-invariant", "hyperelliptic map", "harmonic conjugates ($\lambda=-1$)" — none defined on this page, and only "elliptic-curves.html" is name-dropped. Quote: "permuting the four points changes the cross-ratio: only the Klein four-group $V_4\subset S_4$ of double-transpositions fixes $\lambda$." This is the densest jargon spike on the page; reads as a compressed summary rather than a working tour.
- "Bott formula" (projective-plane.html:1052) — single mention with no explanation in a "where to go next" bullet. Acceptable as a forward reference, but flagged because it's the only such bare term in that list.
- §3 transition-maps subsection mentions the construction is the "prototype of <em>algebraic-geometric gluing</em>" with "$\mathbb{P}^2$ is a scheme glued from three copies of $\mathbb{A}^2$" (projective-plane.html:470) — "scheme" is used without callback to schemes.html (the callback aside is on §2 / §8 only). Minor; readers landing on §3 cold won't know.

### Tone mismatches
- §8 (cross-ratio) drifts into compressed-textbook voice — two long paragraphs with formula-dense prose and no widget breaking the rhythm. Compare to §1 / §2 / §4 / §5 which all alternate prose ↔ widget every ~150 words. Same complaint applies to §7 (duality).
- "(This will get its own page in Wave 2.)" (projective-plane.html:930) and "<strong>Bézout</strong> (Wave 2)" (line 1049) — internal-roadmap tone leakage. Bezout exists now; "Wave 2" is stale dev jargon that shouldn't surface in reader prose. bezout.html and schemes.html have no equivalent.
- Hero subtitle is conversational and matches canon ("Add one point for each direction and the world snaps into place..." projective-plane.html:263). No issue there.
- Most mini-aside notes (.note / .ok / .bad blocks) follow house style — short title in bold + 1-2 sentence punch. §6 fundamental-theorem `.ok` box is a 4-bullet list-of-claims rather than the usual narrated ok-block; reads more like a reference sheet. Cosmetic.

### Missing worked examples
- **§7 Projective duality** — entirely prose plus a quiz placeholder (projective-plane.html:893-900). No widget. Natural candidates: a Fano-plane (q=2) interactive showing the 7-points-7-lines self-duality, or a "click a point to see all lines through it" toy.
- **§8 The cross-ratio** — entirely prose plus a quiz placeholder (projective-plane.html:902-918). No widget. The cross-ratio is the single most "poke-able" object on the page; a slider for four collinear points with the cross-ratio value updating live (and the Möbius-orbit chips $\{\lambda, 1-\lambda, 1/\lambda, ...\}$ lighting up under permutation) would slot in cleanly. This is the highest-value missing widget.
- §9 has a Weierstrass-two-charts widget that already covers part (b) but not parts (a) Bézout or (c) compactification. Acceptable, since (a) belongs on bezout.html anyway.
- §10 "Higher dimensions" is a long prose tail with three `<h3>` blocks and no widget — but reads as a deliberate epilogue, not a section that needs interactivity. Lower priority than §7/§8.

### KaTeX macros / formatting
- Page macro list (projective-plane.html:22-29) is the standard six (`\Spec, \Gal, \Hom, \tr, \ad, \ind`) — identical to bezout.html and category-theory.html. No locally invented macros. Good.
- `\mathbb{RP}^2` and `\mathbb{CP}^2` (projective-plane.html:1033, 1039, 1042) — these are standard KaTeX (`\mathbb` works on multi-letter args), not new macros. Fine.
- `\ell_\infty^{(Z)}` (projective-plane.html:564) — reasonable parenthetical superscript; only used once. Fine.
- `\bar K` (projective-plane.html:925) and `\bar{K}` (line 804) — same author, two spacings. Cosmetic.
- "$U_Z$" / "$U_Y$" / "$U_X$" in body prose are KaTeX'd, but the chartbox `<div class="lbl">` widget labels (projective-plane.html:484-486) write them as plain text "U_Z chart  (Z=1)". The lbl class is plain — no KaTeX delimiters. Acceptable; legend labels in widget chrome are commonly plain.
- §10 uses raw "ℓ∞" in SVG text (projective-plane.html:297, "line at infinity ℓ∞") — direct unicode rather than KaTeX. SVG `<text>` inside widgets across the corpus uses unicode glyphs by convention (KaTeX inside SVG is awkward). No action.

### Helper-block / widget-chrome hygiene
- Top-of-body helper block (projective-plane.html:190-239) is byte-equivalent to category-theory.html:187-238 modulo three stripped one-line comments (`// draw an arrow marker def once per svg (idempotent)`, `// curved arrow between two pixel points, with optional label`, `// shorten endpoints`). API surface (`$, $$, SVG, ensureArrow, drawArrow, drawNode`) intact. Cosmetic deviation.
- All widgets use the canonical `.widget > .hd > .ttl + .hint` chrome (projective-plane.html:272-274, 374-376, 481-483, 574-576, 672-674, 807-809, 940-942). All readouts use `.readout`. All sliders/inputs are inside `.row`. No ad-hoc classes.
- One non-standard chrome convention: §3 introduces a `.chartbox` class (projective-plane.html:113-116, 484-486) for clickable mini-chart cards. It's defined in the page's local `<style>` and only used in this widget. Consistent with how schemes.html introduces `.fbtn` / `.pbtn` / `.cbtn` for its field/preset/curve buttons (schemes.html:407-426, 839-846). Acceptable per-page extension pattern.
- `<title>` elements present on every `<svg>` (projective-plane.html:274, 376, 484-486, 576, 945, 949). Good a11y.
- Quiz placeholders present at expected concept anchors and align with `quizzes/projective-plane.json` keys: `projective-points-lines`, `homogeneous-coordinates`, `projective-transformations`, `projective-duality`, `cross-ratio` (projective-plane.html:408, 681, 819, 899, 917). Section 1 ("meet"), Section 3 ("charts"), Section 4 ("infty"), Section 9 ("why"), Section 10 ("higher") have NO quiz placeholders — a gap if those concepts exist in the bank, fine if they don't. Worth a one-line check by the orchestrator.

## Severity
minor polish (semantic gap = §7/§8 missing widgets + §8 jargon density; rest is cosmetic)

---

_Reminder: the orchestrator should run `node scripts/rebuild.mjs` after any content changes._
