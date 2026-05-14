# naive-set-theory — pedagogical audit (2026-05)

**Section:** Logic & Foundations
**Compared against:** zfc-and-ordinals, first-order-logic-and-completeness

## Summary
A clean, well-paced page that fits the section's voice — conversational hero, numbered worked sections, every concept gets a widget. A handful of forward-references to advanced concepts (limits, fundamental group, projective space) are dropped without prereq scaffolding, but they are flagged as "downstream" examples and don't block the prose.

## Findings
### Notation drift
- _None semantic._ All three pages use `\mathbb{Z}/N/Q/R`, `\mathcal{P}`, `\aleph_0`, `\operatorname{cf}`, `\Hom` macro consistently. naive-set-theory writes `\mathbb{Z}/n\mathbb{Z}` (line 687) and the shorter `\mathbb{Z}/n` (line 829) in the same section — minor cosmetic inconsistency, but both are standard.
- Cosmetic: naive-set-theory uses `\mathbb{Z}_{\ne 0}` (line 830) whereas the same set is written `\mathbb{Z}\setminus\{0\}` two lines below (line 689). Pick one in each section.

### Undefined jargon
- "your first glimpse of *limits*: products are limits in the category of sets" (line 636, §2) — `limits` and `category of sets` used as live phrases. No prereq callback; reader unfamiliar with category theory has nothing to grab. Either soften to "what category theorists call a *limit*" or add a callback to `category-theory.html#limits`. Compare zfc-and-ordinals, which similarly hand-waves toward Grothendieck universes but immediately defines them in §7.
- `$\mathbb{RP}^n$` and "Quotient is the fundamental group $\pi_1$" (lines 689–690, §3 examples list) — both appear as drive-by examples without a callback. Acceptable as "you've seen these elsewhere" namedrops, but the homotopy bullet in particular reads as if the reader should already know what a continuous deformation is. A one-line "see Algebraic topology" callback would close the loop.
- "$\sigma$-algebra" (line 648) used in passing without expansion. Naive readers may not know it; a parenthetical "closed under countable unions and complements" exists right there, so it's borderline OK.

### Tone mismatches
- _None._ Hero sub ("the quiet undergrowth beneath every other topic") matches the conversational register of the ZFC sub ("Cantor's naive set theory, made bulletproof") and the FOL sub ("the grammar mathematics writes itself in"). Second-person "you can't state…" / "you'll do" appears at appropriate density. No drift into dry textbook voice or meme tone.

### Missing worked examples
- §5 (axiom of choice) has **no widget** — it ends at the bullet list "Equivalents of AC" / "Consequences." The peers all keep widget-per-section discipline (zfc-and-ordinals §5 has the choice-function picker; FOL §5 has the compactness sketch). A small bin-picker widget here (or a "shoes vs socks" toggle) would fit the page rhythm. This is the only pedagogy gap of any size.
- §2 has no widget either — it leans on prose + the cheat-sheet bullets. Less critical than §5 because the Venn widget in §1 already drives products implicitly via $A\times B$, but worth noting.

### KaTeX macros / formatting
- `\Hom` (lines 636, 695) is used but is defined in the head macro block as `\operatorname{Hom}` — consistent with both reference pages, no drift.
- No bespoke macros introduced. All delimiters are `$…$` / `$$…$$` / `\(\)` / `\[\]` per house convention.
- Display equation at line 681 uses `<p style="text-align:center">$X/{\sim} = \{[x] : x\in X\}, \pi\colon X\to X/{\sim}, x\mapsto [x].$</p>` — this is an *inline* `$…$` styled as centered, not a real `$$…$$` display. Peers use proper `\[…\]` for display math (e.g. zfc-and-ordinals lines 370–380, 493–500). Minor — switch to `\[…\]` to render at display size.

## Severity
minor polish
