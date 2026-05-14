# category-theory — pedagogical audit (2026-05)

**Section:** Algebra & homological
**Compared against:** algebra, homological

## Summary
The page is in great shape and is correctly serving as the section's tone setter — every concept has a poke-able widget, the proof-stepper and naturality-square are some of the best widgets in the corpus, and the prose voice is unmistakably the house style. Findings below are minor polish; the only mildly load-bearing issue is one missing quiz placeholder in §7.

## Findings

### Notation drift
- _None of consequence._ `\Hom`, `\Spec`, `\mathbb{Z}`, `\mathcal{C}`, `\mathsf{Set}`, `\mathrm{op}` and `\mathrm{id}` are used identically across all three files (the macros block in `category-theory.html` is byte-identical to `homological.html`'s; `algebra.html`'s `onload=`-style loader still defines the same six macros).
- One stylistic asymmetry: `category-theory.html#cat` writes `$\operatorname{ob}\mathcal{C}$` (line 276) and `$\operatorname{Mor}\mathcal{J}$` (§5, line 1011) inline, while §1 also uses `$\Hom_{\mathcal{C}}(A,B)$`. The op-name is the convention; the asymmetry just means `\ob` and `\Mor` are spelled out where the other operators have macros. Cosmetic — consider adding `\ob` and `\Mor` to the macros list for parity.

### Undefined jargon
- §1 uses "**a class** of objects" without flagging the size distinction (sets vs. classes); §4 then opens with "**locally small** category" without prior callback. Low priority for an intermediate page, but a half-sentence aside ("'class' rather than 'set' to avoid Russell-style paradoxes; we'll only need this distinction when discussing locally small categories in §4") would close the loop.
- §6, "$F\colon\mathcal{C}\leftrightarrows\mathcal{D}:G$" uses the leftrightarrows-with-trailing-name notation without commentary; first-time readers of adjunction notation often parse this as a single biarrow rather than "F goes one way, G goes the other." A parenthetical would help.
- §10 says "**evaluation map**" $\Phi$ in the lemma block before the body explains what is being evaluated where. Rewording: "evaluate $\eta$ at $A$ on $\mathrm{id}_A$" inline in the bullet would pre-empt the question.
- §13 introduces "**monadic** forgetful functor" inline ("the pattern continues for every monadic forgetful functor") with no definition or callback — first appearance, no prior section discusses monadicity. Either drop the term or footnote.
- §14 invokes "(K↓b)" (the comma category) in the pointwise-formula display without prior definition; the colim-formula is the first appearance of comma-category notation on the page. Brief inline gloss recommended.

### Tone mismatches
- Tone is consistent with the house style throughout. Two micro-spots that lean drier than the rest:
  - §13's "**$T$-algebras and Eilenberg–Moore**" h3 is pure-textbook ("These assemble into the Eilenberg–Moore category $\mathcal{C}^T$, and the canonical $U^T\colon\mathcal{C}^T\to\mathcal{C}$ has a left adjoint $F^T$ with $U^T F^T=T$."). The peer page `homological.html#derived` does the same kind of definition-pile but breaks it with a "Why care?" sentence; §13 could use the same lift.
  - §15 (2-categories preview) — the prose is good, but the widget caption "Arrows-of-arrows / click objects / functors to build a 2-cell diagram" oversells: the widget only toggles between three pre-baked modes (base / vertical / horizontal). Either soften the hint or wire in actual click-to-build behavior.

### Missing worked examples
- **§7 "Proofs are diagrams that grow" has no `<div class="quiz">` placeholder** (verified: `data-concept` quizzes appear at end of §1, §3, §6, §8, §9, §10, §11, §12, §13, §14, §15, §16 — but not §7). Either add a quiz or, if §7 is intentionally a "rest stop" between §6 and §8, mention that explicitly. Section grading is currently "section without quiz" which `audit-graph-health` will treat as drift.
- §3 "natural transformations" — the worked example $V\to V^{**}$ is excellent, but the discussion of why there's no natural iso $\mathrm{id}\Rightarrow(-)^*$ is asserted rather than worked. Even one sentence concretizing it ("any candidate iso $V\cong V^*$ is forced to depend on a basis; the components don't satisfy the naturality square for a coordinate change $f$") would lift it from claim to demonstration.
- §9 (monoidal categories): the pentagon and triangle coherence diagrams are mentioned and named but never drawn. Peer pages in the section that name a structural diagram (snake lemma, five lemma in `homological.html`) draw it. A small SVG of the pentagon would be high-value.

### KaTeX macros / formatting
- All KaTeX macros used are either standard or in the shared `\Spec / \Gal / \Hom / \tr / \ad / \ind` macros block — no undeclared local macros.
- `category-theory.html` consistently uses `\operatorname{X}` for `Nat`, `Mor`, `End`, `ob`, `Lan`, `Ran` (e.g. lines 861, 1011, 1921, 2719, 2741) and `\mathrm{X}` only for fixed semantic decorations (`\mathrm{id}`, `\mathrm{op}`, `\mathrm{ev}`, `\mathrm{ab}`). This split matches the canonical convention.
- Cosmetic peer drift: `algebra.html` uses `\mathrm{im}\,\varphi`, `\mathrm{Stab}`, `\mathrm{Aut}`, `\mathrm{Fix}` (lines 1633, 1824–1827, 2419) where `\operatorname{im}`, `\operatorname{Stab}`, `\operatorname{Aut}`, `\operatorname{Fix}` would render with proper spacing. `homological.html` uses `\operatorname{im}` consistently (lines 395–397, 634–638). `category-theory.html` is on the `\operatorname` side of this split — the canonical side. Worth mentioning only because if `algebra.html` is later normalized to match, the convention `category-theory.html` already follows is the target.
- §1 widget readout uses `id_A`, `id_B`, `id_C` in the `<svg>`/JS layer rather than KaTeX-rendered `\mathrm{id}_A` — this is fine (the widget is monospace text inside an SVG label), but the prose right above the widget switches between `\mathrm{id}_A` (line 279) and "id_A" (line 314, the `.small` line). Tiny consistency nit; replace the `.small` row with `\mathrm{id}_A,\mathrm{id}_B,\mathrm{id}_C` in `$…$`.
- §3 SVG for the naturality square (lines 609–626) hand-writes `η_A`, `η_B`, `F(f)`, `G(f)` as SVG `<text>` rather than rendering KaTeX into a `<foreignObject>` (which the snake-lemma diagram in `homological.html#snake` does — see lines 1102–1115). Stylistically the CT version is fine and is older code; only worth noting if a later pass standardizes diagram-label rendering.

## Severity
minor polish (two genuine action items: missing §7 quiz placeholder; an SVG of the pentagon/triangle in §9).
