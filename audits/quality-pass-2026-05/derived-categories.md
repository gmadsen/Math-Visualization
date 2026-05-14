# derived-categories — pedagogical audit (2026-05)

**Section:** Algebra & homological
**Compared against:** category-theory, homological

## Summary
Strong page overall — every numbered section has a worked example, every concept has a clickable diagram or scrubber, and the "$K$ before $D$" / "Ore conditions" / Fourier–Mukai narrative is well-paced for a derived-categories intro. The chief actionable issue is **systematic notation drift toward `\mathrm{...}` for operators that the rest of the corpus typesets via `\operatorname{...}` (or via the `\Hom` macro)** — Ext, Tor, Coh, Mod, Sh, Ch, Ab, im, coker, Cone, qis. A second cluster: §6 and §7 lean on terms (perverse sheaves, Riemann–Hilbert, Calabi–Yau, abelian variety) that are name-dropped without callbacks or one-line glosses.

## Findings

### Notation drift
- **`\mathrm{Ext}` / `\mathrm{Tor}` vs. `\operatorname{Ext}` / `\operatorname{Tor}`.** Derived-categories writes `\mathrm{Ext}_R^i(M, N)` (line 459), `\mathrm{Tor}_i^R(M, N)` (line 623), `\mathrm{Ext}^i(\mathcal{E}, \mathcal{F})` (line 767). Homological consistently uses `\operatorname{Ext}^i_A(M,N)` (line 2126) and `\operatorname{Tor}_i^A(M,N)` (line 2127). Semantic-priority drift: same symbol, two stylings on adjacent pages.
- **`\mathrm{Coh}` / `\mathrm{Mod}` / `\mathrm{Sh}` / `\mathrm{Ch}`.** Derived-categories at line 272 writes `$\mathrm{Mod}\,R$`, `$\mathrm{Sh}(X)$`, `$\mathrm{Ch}(\mathcal{A})$`; in homological line 2816 the chain-complexes category is `$\operatorname{Ch}(\mathcal{A})$`. (Coh has no peer reference but should follow the same `\operatorname{}` convention for consistency.) Recommend either define a `\Coh, \Mod, \Sh, \Ch` macro family or settle on `\operatorname{}`.
- **`\mathrm{Ab}` vs. `\mathsf{Ab}`.** Derived-categories writes `$\mathcal{A} = \mathrm{Ab}$` (line 378, scrubber lines 396, 421, 637, 642, 652). Both peers use `$\mathsf{Ab}$` (category-theory line 289, homological lines 2810, 2833, 2834, 2967, 2972). This is the standard sans-serif convention for category names across the corpus. **Semantic drift** — different rendered glyph for the same object.
- **`\mathrm{im}` / `\mathrm{coker}` / `\mathrm{id}` vs. `\operatorname{...}`.** Line 272 has `$\ker d^n / \mathrm{im}\,d^{n-1}$`; line 401 (scrubber) has `\mathrm{coker}(2)`. Homological writes `\operatorname{im}` and `\operatorname{coker}` consistently (lines 395–397, 803–804). Category-theory uses `\mathrm{id}` for identities, which derived-categories matches — `\mathrm{id}` is fine.
- **`\mathrm{Cone}` and `\mathrm{qis}`.** Both newly introduced as `\mathrm{...}` on this page (lines 380, 525, 570). No peer to align to, but the surrounding-page convention argues for `\operatorname{Cone}` and `\operatorname{qis}`. Cosmetic but compounds the drift above.

### Undefined jargon
- **"calculus of fractions"** (§1, line 278: "Quasi-isomorphisms in $\mathrm{Ch}(\mathcal{A})$ don't admit a calculus of fractions") — used three paragraphs before §2 line 380 introduces "Ore conditions" (which is the same idea), with no parenthetical gloss. A reader hitting this in §1 has nothing to grab.
- **"Ore conditions"** (line 380) — given a parenthetical, but the parenthetical itself ("closed under composition, the 'two-out-of-three' property, and a roof-completion property") name-drops "two-out-of-three" without saying *what* property is two-out-of-three. Worth one extra clause.
- **"perverse sheaves" / "constructible sheaves" / "Riemann–Hilbert correspondence" / "intersection cohomology"** (§6, line 703) — all four appear in a single sentence with no callback aside, no gloss, and no downstream link. Even one parenthetical ("perverse sheaves — a heart inside $D^b_c$ designed so simple objects are IC complexes") would land it.
- **"Calabi–Yau" / "abelian variety" / "general type"** (§7, lines 769, 805, 767) — name-dropped as the venues where derived equivalence is interesting, without a one-line description of why these classes specifically. Compare homological §15 which always glosses ("the global sections functor $\Gamma$ is left exact"). A `<aside class="callback">` to the abelian-varieties / Calabi–Yau pages, or a one-clause parenthetical, would fix it.
- **"divisibility lifting"** (scrubber step 2, line 642): "$\mathbb{Z}$ is not injective in $\mathrm{Ab}$ (it does not satisfy the divisibility lifting)" — "divisibility lifting" isn't standard terminology; the divisibility property of injective abelian groups is. Tighten to "is not divisible" or "fails the lifting criterion against $\mathbb{Z} \hookrightarrow \mathbb{Q}$."

### Tone mismatches
- §3 line 446 — "By the same trick used in commutative algebra, $D(\mathcal{A})$ exists" hand-waves at a result the reader probably doesn't have in hand. Either drop the "by the same trick" or name the Ore-localization-of-a-category construction.
- §6 line 703 (the perverse-sheaf paragraph) is the most jargon-dense paragraph on the page; four named objects in two sentences. Mismatched against the rest of the page, which earns each name with a definition.
- §3 line 450 — "pick $Z'$ with $Z' \to Z$ a quasi-iso whose composition $Z' \to Z \to Y$ lifts to $W$" is dense formula-without-narration. One sentence of "morally, you fatten up $Z$ until it sees both directions" would soften it. (Compare category-theory §6 line 1011 which always couples a formal statement with its informal version.)
- Otherwise the voice is well-tuned to the peers — second-person "you" in §3 and §4, the "Why $K$ before $D$?" rhetorical hook in §1, and the "Beware:" aside in §4 all match category-theory's idiom.

### Missing worked examples
- **§3 (derived-category):** the prose carries an Ext example ("$\Hom_D(M[0], N[i]) \cong \mathrm{Ext}^i$"), and the roof widget is interactive, but neither shows a *concrete* roof — pick $X = \mathbb{Z}/2[0]$, $Y = \mathbb{Z}[1]$, exhibit a specific apex $Z$. The reader leaves §3 having seen the universal property but not having computed in $D$.
- **§6 (t-structures):** the colored-band widget illustrates the *picture* but the section has no concrete computation. Add one — e.g. take $X = (\mathbb{Z} \xrightarrow{2} \mathbb{Z})$ in degrees $-1, 0$, run $\tau_{\le -1}$ and $\tau_{\ge 0}$ explicitly, show the truncation triangle. The components carry over from §1's worked example for free.
- **§7 (Fourier–Mukai):** the diagram is clickable but no concrete Fourier–Mukai computation appears. The Poincaré-bundle case is named but not unpacked; a worked instance like "$\Phi_{\mathcal{P}}(\mathcal{O}_x) = \mathcal{L}_x$" (Poincaré bundle restricted to a point) would match the worked-example density of §1, §2, §5.
- §1, §2, §4, §5 each have a worked example or full scrubber — those sections are well-served.

### KaTeX macros / formatting
- The page's KaTeX `macros:` block is the standard verbatim copy (`\Spec, \Gal, \Hom, \tr, \ad, \ind`) — **but the page introduces no local macro for `\Coh, \Mod, \Sh, \Ch, \Cone, \Ext, \Tor, \Ab, \qis`** despite repeating them dozens of times. Either extend the macros block (cleanest fix to the notation drift above) or rewrite the call-sites with `\operatorname{}`.
- Line 525 — `\bigl(\begin{smallmatrix}-d_X & 0 \\ f & d_Y\end{smallmatrix}\bigr)` is fine standard KaTeX, but the surrounding mapping-cone description would benefit from a display equation rather than an inline `smallmatrix` — readability cost is real on mobile.
- Inside scrubber `svgInner` strings (lines 397–428, 638–663) the math is hand-typeset with Unicode glyphs (`ℤ`, `ℚ/ℤ`, `ℤ/2`, `H⁰`, `H¹`) rather than KaTeX. This is pragmatic since `<text>` elements inside a scrubber's inline SVG are not auto-rendered, but it does mean the *same* objects render in two different fonts in the same widget (KaTeX in `body`, Unicode in `svgInner`). Acceptable, but worth a comment in the scrubber registry README so authors stop reinventing the workaround.
- No raw-`$` / red-error-badge offenders spotted; helper-block 2D copy at lines 188–239 matches `category-theory.html` verbatim (`$, $$, SVG, ensureArrow, drawArrow, drawNode`).
- Widget chrome (`.widget / .hd / .ttl / .hint / .readout / .row / .note / .ok / .bad`) used correctly throughout — no ad-hoc classes introduced. Every clickable SVG carries a `<title>` for a11y (lines 282, 463, 537, 707, 779).

## Severity
minor polish — primarily a notation-consistency pass and 3–4 inline glosses for §6/§7 jargon; one extra worked example each in §3, §6, §7 would round it out.
