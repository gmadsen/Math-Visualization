# convex-geometry — pedagogical audit (2026-05)

**Section:** Geometry & topology
**Compared against:** topological-data-analysis, differential-geometry

## Summary
Strong page overall: every section has a non-trivial widget, the conversational-but-precise voice matches both peers, and Brunn–Minkowski is clearly positioned as the spine. The only meaningful issues are a handful of `\mathrm{...}` operator names that the page-wide macro contract would render with `\operatorname{...}`, a couple of advanced terms used in passing without a one-clause gloss (Aleksandrov–Fenchel, KLS, Hanner polytopes), and a math-mode-vs-text drift in widget readouts and SVG legends.

## Findings

### Notation drift
- `\mathrm{vol}`, `\mathrm{surf}`, `\mathrm{diam}`, `\mathrm{conv}`, `\mathrm{Id}`, `\mathrm{int}` are written with `\mathrm` throughout (`vol(K)^{1/n}`, `\mathrm{surf}(K)`, etc.), while the page-wide KaTeX `macros` block already provides the `\operatorname` convention used by peer pages (`\Hom`, `\tr`, `\Spec`, `\ind`, `\ad`). topological-data-analysis uses `\mathrm{im}`, `\mathrm{Dgm}`, `\mathrm{diam}` in the same way, so the drift is at most cosmetic _within_ the section — but neither peer relies on `\mathrm{vol}` or `\mathrm{surf}`. Recommend either `\operatorname{vol}` / `\operatorname{surf}` or page-local `\vol`, `\surf` macros for consistency with the existing operator-macro vocabulary.
- `B^n` (unit ball, §5–§6) coexists with `B` (unit ball, §2 Steiner formula) and `\ell^2_n`, `\ell^p`, `\ell^\infty` ball notation in §6. differential-geometry uses `\mathbb{R}^n` consistently, and topological-data-analysis writes `\mathbb{R}^d`. Settle on `B^n` for the Euclidean ball throughout — §2's bare `B` reads as a generic body until you reach the Steiner clause.
- `\mathrm{vol}(\cdot)^{1/n}` (KaTeX) appears in prose, but inside SVG legends and readouts the same quantity is written as `vol(·)^{1/n}` and `vol((1−t)A + tB)^{1/n}` (raw text glyphs, no KaTeX). topological-data-analysis has the same plain-text fallback in widget readouts (`β₀ = …`), so this is consistent _across the corpus_ and not high-priority — but the BM widget's legend `t1.textContent = 'LHS = vol((1−t)A + tB)^{1/n}'` mixes a unicode minus with a literal `^{1/n}` that won't typeset. Either drop the brace notation in the legend or move the legend to an HTML overlay.
- "$\langle u,x\rangle$" inner product notation in §1 vs `a_i^\top x` in §4 (H-representation). Consistent with linear-algebra convention but worth a one-line gloss the first time `^\top` appears. Cosmetic.
- Cross-polytope is denoted `\{|x|_1\le 1\}` in the §6 table and `|x|+|y|\le 1` in the §5 widget caption; pick one (the `\ell^1`-ball framing is the cleaner connect-back to the table).

### Undefined jargon
- §2 introduces "**Aleksandrov–Fenchel inequality**" inside the §3 `<div class="ok">` consequence box ("the same one-line argument also produces the Aleksandrov–Fenchel inequality, the master inequality on mixed volumes") with no further unpacking. The reader is told it exists and is "master" but is never shown the inequality, even schematically. peer practice in TDA's stability section is to at least state the bound formally before naming the theorem.
- §6 closing paragraph uses "**Hanner polytopes**" once ("the cube–cross-polytope (and the Hanner polytopes more generally)") with no definition or link. First-time reader has no anchor.
- §7 mentions "**Lévy concentration**" and "1-Lipschitz function" in one sentence ("Milman's proof uses Lévy concentration on $S^{n-1}$ — the unit sphere concentrates around any 1-Lipschitz function"); concentration of measure is the load-bearing idea of the section but the term "concentration of measure" itself first appears in §8 Connections. Promote a one-sentence gloss into §7 prose.
- §8 lists "**KLS conjecture**" ("Mahler, the slicing conjecture, the variance / KLS conjecture") with no expansion. First (and only) mention. Either expand to "Kannan–Lovász–Simonovits" with a parenthetical or drop.
- §6 uses "**bipolar theorem**" parenthetically ("$(K^\circ)^\circ=K$ (this is the bipolar theorem)"). Acceptable — the equation _is_ the definition — but a reader scanning will see the name and not the content if they skip the math.
- §4 uses "**cyclic polytope $C(N,n)$**" inside the upper-bound theorem without a construction sketch. TDA's stability scrubber would have shown a four-step picture; here a one-line "vertices are $N$ points on the moment curve" would close the gap.

### Tone mismatches
- Voice mostly matches the peer pages (conversational-precise, second-person prompts in widget paragraphs like "Drag the angle slider:", "Pick the homothetic options"). No drift into dry-textbook or meme-tone.
- Two passages lean closer to dense-prose-without-narration:
  - §6 paragraph "In the language of support functions, polarity exchanges $h_K$ and the gauge / Minkowski functional…in the language of polytopes, polarity exchanges the $V$- and $H$-representations…" — three reformulations stacked with no connective hand-hold. Compare TDA §3 which always pauses ("This is a persistence module: a sequence of vector spaces tied together by maps. The data we want from it: …"). Recommend splitting into two paragraphs with a bridge sentence.
  - §7 paragraph "The Lipschitz constant is controlled by the John ellipsoid (§5)" — single-sentence gesture at a deep technical link with no payoff. Either expand to two sentences explaining _how_ John bounds the Lipschitz constant, or cut.
- Hero subtitle uses "personalities" ("the same body acquires four different personalities") — playful, fits the corpus voice (TDA's hero has "watch how features are born and die"; differential-geometry has "Curvature is the throughline"). Keep.

### Missing worked examples
- Every numbered `<h2>` section has a widget. No section is pure-definition.
- §3 Brunn–Minkowski could use one explicit hand-computation in the prose (e.g. "for two disks of radii $r_1, r_2$, $\mathrm{vol}(D_1+D_2)^{1/2} = \sqrt\pi(r_1+r_2) = \mathrm{vol}(D_1)^{1/2}+\mathrm{vol}(D_2)^{1/2}$, equality") so the reader sees the homothetic-equality case with numbers before the widget. The widget hints at it ("'disk vs scaled disk' … is exact equality") but doesn't show the algebra.
- §5 John's theorem states the contact-frame condition $\sum c_i u_i u_i^\top = \mathrm{Id}$, $\sum c_i u_i = 0$ but no example is unpacked. The widget shows ratios (square saturates √2) but doesn't surface the contact points. Even a static SVG of "square: 4 axis-aligned contact points with weights ½ each" would land the abstraction.
- §8 Connections is the standard hub paragraph + bulleted list, not a quizzed section, which matches the TDA pattern. No issue.

### KaTeX macros / formatting
- The `<head>` macro block is the verbatim corpus default (`\Spec, \Gal, \Hom, \tr, \ad, \ind`). No new macros invented locally — good. The page never reaches for `\Hom` or `\tr` itself, so the macros are dead-weight but harmless (every peer carries the same block).
- `\boxed{…}` is used in §3 around Brunn–Minkowski. Standard KaTeX, consistent with TDA's note-class displays. OK.
- `\mathbf{1}_A` indicator-function notation in §3 — standard KaTeX, no drift.
- `$\Leftrightarrow$` inside a `<div class="note">` in §4 ("$n$-polytope $\Leftrightarrow$ ($n{-}1$)-simplex facet") reads as a typo for `\iff` or simply a comma — the implication direction is not what's meant; the note is _defining_ "simplicial" as facets being simplices. Consider `:` or `—` instead.
- Several display equations are wrapped as `<p style="text-align:center">$…$</p>` rather than `$$…$$` or `\[…\]`. Both render but the corpus is mixed; differential-geometry prefers `$$…$$` block delimiters for centred displays. Cosmetic.
- §1 widget caption mixes typeset `$\theta$` in the label with raw `θ=0.60` in the readout pill — same plain-text-in-readout pattern as TDA, acceptable.
- Helper `<script>` block at top of `<body>` (`$`, `$$`, `SVG`, `ensureArrow`, `drawArrow`, `drawNode`) is byte-identical to category-theory.html / topological-data-analysis.html. No deviations from the helper contract.
- Widget chrome (`.widget`, `.hd`, `.ttl`, `.hint`, `.row`, `.readout`, `.pill`, `.note`, `.ok`, `.bad`) is used correctly throughout. No ad-hoc classes spotted.

## Severity
minor polish
