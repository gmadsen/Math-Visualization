# algebraic-de-rham-cohomology — pedagogical audit (2026-05)

**Section:** Algebraic geometry
**Compared against:** sheaf-cohomology, hodge-theory

## Summary
Strong, well-structured page with one widget per concept, four hand-worked computations in §1's scrubber alone, and a final inline-code-cell sandbox. The two main issues are (a) consistent semantic notation drift from peers — italic `H^n_{dR}` vs the section-standard upright `H^n_{\mathrm{dR}}`, with the page itself flipping convention once at line 930 — and (b) zero use of `.note`/`.ok`/`.bad` callouts even though sheaf-cohomology uses 12 and hodge-theory uses 5.

## Findings
### Notation drift
- **Semantic — `dR` subscript:** target writes italic `H^n_{dR}` throughout (lines 378, 383, 417, 422, 481, 483, 492, 513, 514, 519, 568, 569, 573, 576, 598, 599, 608, 609, 613, 621, 837), but sheaf-cohomology line 314/481 writes `H^\bullet_{\mathrm{dR}}` and hodge-theory uses `H^n_\dR` (macro = `\mathrm{dR}`). The italic form reads as "`d` times `R`" — high-priority because it's a meaning-bearing operator name.
- **Self-inconsistency on the same page:** target line 930 (§7 Connections) suddenly writes `H^{p+q}_{\mathrm{dR}}(X)` — the upright peer convention — while every earlier section uses italic `dR`. Pick one.
- **Cosmetic — operator vs `\mathrm`:** target's `\mathrm{Der}_k`, `\mathrm{im}`, `\mathrm{gr}^p_F`, `\mathrm{Pic}` are all written ad hoc with `\mathrm{...}` instead of `\operatorname{...}`. Sheaf-cohomology uses `\operatorname` consistently for similarly-shaped names. Low priority but inconsistent with house style.
- **Punctured line spelled two ways:** the page calls it `\mathbb{C}^*` in prose (line 481) and prints "ℂ*" in step bodies (line 500), but the algebraic incarnation is `\mathbb{G}_m = \Spec\,k[z, z^{-1}]` (line 483) — three names within one section. Reference pages stick with one per page.

### Undefined jargon
- "Bott vanishing" appears as a load-bearing input twice — line 579 ("Bott vanishing gives $H^q(\mathbb{P}^n, \Omega^p) = \mathbb{C}$ if $p = q \le n$") and line 660 ("The Bott vanishing theorem gives...") — but is never defined and has no callback. Sheaf-cohomology defines its analogue ("Serre's affine vanishing") in a `.ok` callout at line 519.
- "GAGA" appears at lines 477, 479, 547, 934 with only an in-callback hint ("Zariski coherent vs. analytic coherent"); no in-page gloss. Reference pages would normally introduce-then-use.
- "second-kind form" used as a term of art at line 885 ("a 'second-kind' form — algebraic, with poles") with quotes but no real definition; first-time reader has nowhere to land.
- "Du Bois / mixed-Hodge complexes" line 485 — name-dropped as remediation for the singular case; fine as a forward pointer but the prose treats them as familiar.
- "Picard–Fuchs" appears only in callback link text (lines 460, 639); not introduced in body where periods are discussed (lines 540, 885).

### Tone mismatches
- **Hero tagline is a fragment, not a sentence** (line 268: "Hypercohomology of $\Omega^\bullet_{X/k}$: Hodge filtration, Betti comparison, Hodge diamond."). Hodge-theory's hero is a full conversational paragraph (line 263), sheaf-cohomology's likewise (line 280). Drift toward textbook-index-card voice.
- §3 last paragraph (line 540, "Period numbers and transcendence") is a wall of formula-laden prose with no enumerated structure or readout — reference pages typically chunk that into a `.note` or `<ul>`. Borderline "formulas-without-narration" by the page's own standards.
- §5 K3 paragraph (line 662–670) drops "Noether's formula" and "$\chi(\mathcal{O}_X) = 2$" as if the reader has them — ok in §5 of a graduate page, but the rest of the page narrates more carefully (cf. §1's slow build of the universal property).
- §7 sub-h3 paragraphs ("Smooth manifolds and forms" etc., lines 924–940) are one-sentence bullets in disguise; sheaf-cohomology §10 and hodge-theory §9 use either richer paragraphs or a list.

### Missing worked examples
- _None._ Every numbered section has at least one widget plus an inline worked computation:
  - §1 — proof-scrubber with four hand-worked examples (`A^1`, `P^1`, `Spec k[ε]/(ε²)`, cuspidal cubic).
  - §2 — proof-scrubber computing `H^*_{dR}(A^1)` and `H^*_{dR}(P^1)`.
  - §3 — proof-scrubber on `C^*` plus prose period-number example.
  - §4 — proof-scrubber on Hodge filtration with `P^1` worked at the end.
  - §5 — clickable Hodge-diamond + `P^n` slider widget with K3 prose example.
  - §6 — clickable curve-diamond + inline-code-cell sandbox with curves / `P^n` / K3 / abelian surface.

### KaTeX macros / formatting
- Macro block (lines 22–29) is the verbatim canonical set from category-theory.html — `\Spec`, `\Gal`, `\Hom`, `\tr`, `\ad`, `\ind`. Good.
- The peer hodge-theory.html adds `\dR`, `\Hdg`, `\MT`, `\HS`, `\MHS`, `\CH` — none of which the target adopts. Adopting `\dR` (= `\mathrm{dR}`) would fix the §"Notation drift" point above in one line.
- TOC anchor labels (lines 245–251) embed inline KaTeX (`$\Omega^1_{X/k}$`, `$F^\bullet$`, `$h^{p,q}(X)$`) — matches `js/katex-select.js` + sidetoc convention used by both references.
- Worked example IV in §1 (line 342) opens with **bold prose** numbered "IV" but lives outside the proof-scrubber widget that contains worked examples I–III. Discoverability hiccup: a reader skimming the widget will think there are three examples, not four.
- Hero `.sub` is missing a leading verb / sentence framing — see Tone mismatch.

## Severity
minor polish
