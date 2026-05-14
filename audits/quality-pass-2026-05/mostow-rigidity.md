# mostow-rigidity — pedagogical audit (2026-05)

**Section:** Geometry & topology
**Compared against:** lie-groups, riemannian-geometry

## Summary
Strong, well-paced page; tone, helper block, and widget chrome match section peers. Real defects are confined to two surface-level concerns: a sphere-notation drift between body prose and the geometrisation table, and several widget SVG `<text>` nodes that ship raw `$…$` markup that KaTeX auto-render will not process.

## Findings
### Notation drift
- Spheres: body prose uses `$S^{n-1}$`, `$S^2$`, `$S^1$` consistently (matches riemannian-geometry's `$S^n$`, `$S^2$`), but the geometrisation table at #applications switches to `$\mathbb{S}^3$`, `$\mathbb{S}^2\times\mathbb{R}$`, and the connections list uses `$\mathbb{S}^n$`. Cosmetic but visible in the same scroll. Recommend: settle on `S^n` per riemannian-geometry's "model spaces" row.
- Cosmetic only: `\mathrm{Vol}` (mostow line 744, line 776) vs `\operatorname{Vol}` would have been the registered macro form; lie-groups and riemannian-geometry both use `\operatorname{…}` for free symbols (`\operatorname{Sym}^2`, `\operatorname{div}_g`, `\operatorname{Ric}`). `\mathrm{Vol}` reads fine; flag only if you want strict consistency with the surrounding pages.

### Undefined jargon
- "Švarc–Milnor" appears at #quasi-iso ("The first reduction is Švarc–Milnor.") with no parenthetical gloss and no callback. A reader who has not seen geometric group theory will not know this is the lemma turning a cocompact action into a quasi-isometry.
- "rank-one symmetric spaces" at #arithmetic ("Mostow's theorem covers the rank-one symmetric spaces…") is used before "rank" is itself anchored. The Margulis box then references "real rank ≥ 2"; "rank" never gets a one-line definition (it is the dimension of a maximal R-split torus / a maximal flat) — riemannian-geometry has no rank discussion to lean on, so a one-sentence gloss inline would help.
- "irreducible lattice" in the Margulis box is used without a definition of *lattice* on this page (cocompact discrete subgroup of finite covolume); reader infers it but the page never says it.
- "Egoroff–Lusin" at #ergodic appears in a parenthetical with no callback; readers without measure theory background may stall. The measure-theory callback under #ergodic mentions Lebesgue measure but not these named theorems.

### Tone mismatches
- Voice is generally punchy and conversational ("Then dimension 3 arrives, and freedom collapses." / "and ergodicity strikes."), matching lie-groups' "So our zoo is large." and riemannian-geometry's brisk lifts. No drift into dry-textbook or meme tone.
- Mild: the page never uses second person ("you", "we"); lie-groups uses "Move the sliders…" and riemannian-geometry uses "we now drop the ambient space". A single second-person nudge near a widget hint would lift the §3 / §4 widgets ("drag the bulk distortion…" is in the hint, but the surrounding prose stays third-person).
- §6 prose is dense ("Once the metric is a function of the topology, every metric quantity is too.") without a reader-side example to make the simplicial-volume formula concrete; this borders on formula-without-narration but the volume-spectrum widget rescues it.

### Missing worked examples
- §5 (Margulis arithmeticity) has a comparison table and a `#w-rank-tower` widget but the widget is a static labelled list, not an interactive toy — no slider, button, or input. It is the only top-level section without a poke-able control. (See KaTeX/widget note below — the widget is also where the raw-`$` text bug lives.)
- §6 (Volume / geometrisation): the volume-spectrum widget is also static (no controls). Two static "widgets" in a row weakens the "every section has a toy you can poke" pattern. lie-groups' tables are consistently followed by an interactive widget; riemannian-geometry has interactives in 8 of 11 sections.
- §1 (statement) widget #w-rigidity-table is interactive (slider) but the dial collapses to two states (n=2 vs n≥3); a small additional readout — e.g. "Teichmüller dim = 6g − 6 with g=2 gives 6" — would extract more pedagogical mileage from the widget than the current "= 6g − 6 (positive)" string.

### KaTeX macros / formatting
- No new macros introduced beyond the verbatim header set (`\Spec, \Gal, \Hom, \tr, \ad, \ind`); the only delimiters in use are `$…$` and `$$…$$`. Clean.
- **Real bug — raw `$…$` inside SVG `<text>`.** KaTeX auto-render does not descend into SVG text nodes; everything below will render literally on the page:
  - #w-boundary-extension, line 541: `arrL.textContent = "(K,C)-quasi-isometry $\\widetilde f$";`
  - same widget, line 544: `arrR.textContent = "K'-quasi-conformal $\\partial\\widetilde f$";`
  - #w-volume-spectrum, line 809: `xl.textContent = "hyperbolic volume (in units where $v_3 \\approx 1.0149$)";`
- **Related bug — escaped backslashes in SVG text.** #w-rank-tower (line 715) feeds desc strings like `"$\\mathrm{SL}_n(\\mathbb{R})/\\mathrm{SO}(n)$, $n\\ge 3$"` through `desc.textContent = r.desc.replace(/\$/g,"")`, which strips `$` but leaves raw `\mathrm{…}` and `\mathbb{R}` visible as backslashed source. Either render the row in HTML (a `<foreignObject>` or a sibling `<div>` overlay) or pre-format with unicode (`SLₙ(ℝ)/SO(n), n ≥ 3`).
- Helper block (lines 187–239) is verbatim copy of the 2D helpers from lie-groups; widget chrome (`.widget`/`.hd`/`.ttl`/`.hint`/`.readout`/`.row`/`.note`/`.ok`) all match conventions; no ad-hoc classes detected.

## Severity
minor polish (the SVG-text KaTeX bugs are user-visible and worth a single fix-pass; everything else is cosmetic)
