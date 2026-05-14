# partitions-generating-functions — pedagogical audit (2026-05)

**Section:** Modular forms & L-functions
**Compared against:** modular-forms, theta-functions

## Summary
A strong, well-paced page: every numbered section ships a worked widget, narration is conversational-precise in the house style, and the §6 hand-off into modular-forms / theta-functions feels earned rather than asserted. A small number of jargon-before-definition slips around §5 ("cusp", "$\Gamma_0(N)$", "mock modular forms") and one unique notational choice (`q^{n^2/2}`-flavored exponents elsewhere on the page versus the integer-exponent triple product here) are the only items worth touching.

## Findings
### Notation drift
- `\operatorname{Im}\tau` at line 992 of target matches theta-functions (e.g. line 262, 387) but differs from modular-forms which prefers `\mathrm{Im}\,\tau` (lines 268, 435, 842, 844). Cosmetic; the target is on the cleaner side. No change recommended unless the section is normalized globally.
- `\sum_{k \in \mathbb{Z}} (-1)^k\, q^{k(3k-1)/2}` at target line 505 vs. `\sum_{n \in \mathbb{Z}} (-1)^n\, q^{n(3n-1)/2}` at line 633 — same identity, two different summation indices on the same page. Pick one. Cosmetic, low priority.
- Jacobi triple product at line 628 uses `\sum_{n \in \mathbb{Z}} z^n q^{n^2}` (integer exponents), but the page later (line 869) and theta-functions (line 263) use the half-integer-exponent convention `q^{n^2/2}`. Both conventions are legitimate, but the choice is not flagged for the reader, and theta-functions does explicitly call this out in its "Variants and conventions" note (line 271). Minor — would benefit from a one-line "we use the integer-exponent normalization here" note before line 628 to keep cross-page reading frictionless.
- `\eta(\tau)^{-1}` (line 875) and `\eta(\tau)^{24}` (line 882) versus the bracket form `\Delta(\tau) = q\prod(1-q^n)^{24} = \sum \tau(n)q^n` in modular-forms line 832 — both consistent with house style; no drift.

### Undefined jargon
- "**cusp** of $\Gamma_0(N)$" (line 744, §5 Ramanujan) — first use of "cusp" and first use of `\Gamma_0(N)` on the page; neither defined nor linked to modular-forms§7 (`#cusps`) or to a `modular-curves` page. Quote: *"Each congruence can be rephrased as a statement about the $q$-expansion of $\eta(\tau)^{-1}$ at a particular cusp of $\Gamma_0(N)$ for $N = 5, 7, 11$."* The reader needs the modular-forms callback before this sentence, not after.
- "**mock modular forms**" (line 746) and "**mock theta functions**" — bolded as if defined, but only the historical sketch is given; reader is left to infer they are extensions of modular forms with a non-holomorphic completion. The forward-strip mention at line 1094 finally hand-waves "holomorphic parts of harmonic Maass forms" but introduces yet another undefined term ("harmonic Maass forms"). Either soften the bold (treat as forward pointer only) or add one-sentence definition.
- "**Kloosterman sum**" (line 878, §6) — appears in the displayed Rademacher formula with no gloss. Quote: *"where $A_k(n)$ is a certain Kloosterman sum."* A two-clause aside (e.g. "an exponential sum over residues mod $k$") would close the loop without inflating the section.
- "**multiplier system**" (line 871, §6) — *"Together they make $\eta$ a modular form of weight $\tfrac 12$ with a multiplier system."* First and only use; not defined; the modular-forms callback on the next line goes to `#forms` which doesn't introduce multipliers either. Worth a parenthetical: "(an extra cocycle that compensates the half-weight square root)".
- "**saddle-point**" (line 991, §7) — used twice in §7 with no definition or link to complex-analysis; readers who skipped the analytic-NT track will lose the explanatory "Why $\pi\sqrt{2n/3}$?" subsection.

### Tone mismatches
- §6 (Dedekind eta) opens with a punchy "All of this lives upstairs on the upper half-plane." which matches the house voice well — but the same section then drops the Rademacher exact formula at line 877 as a single dense displayed equation with no annotation of what each factor is contributing. Compare modular-forms §5 which always pairs a heavy display with a "what is going on" prose paragraph. Recommend a one-line gloss after the formula identifying $A_k(n)$ as a finite exponential sum and $\sinh(\dots)$ as the Hardy–Ramanujan main term in disguise.
- §7 hero paragraph is excellent (line 988); "Why $\pi\sqrt{2n/3}$?" subsection (line 990) compresses the saddle-point heuristic into one paragraph and is the densest passage on the page. It reads more like a Wikipedia summary than the conversational "let me show you" tone modular-forms maintains in §3 ("If a group acts, it is natural to ask…"). Splitting the paragraph into "the singular behavior at $\tau=0$" + "extracting the coefficient" would restore the rhythm.
- The hero paragraph quoting Ramanujan ("It appears that there are no equally simple properties…", line 741) is a great voice moment; keep it.

### Missing worked examples
- §6 (Dedekind eta) has its widget (`w-eta`) but the widget compares `q^{1/24}/\eta` against `p(n)`, which is a re-do of §2's widget rather than a new gesture. The "Discriminant $\Delta = \eta^{24}$" subsection introduces $\tau(n)$ values $1, -24, 252, \ldots$ in prose only — no visualization of the 24th-power transition or the multiplier-killing arithmetic. Not a missing-example failure (widget exists), more a missed opportunity. Status: ok.
- All other numbered sections have a concrete widget plus a worked specialization — no missing-example sections.

### KaTeX macros / formatting
- Macro block (lines 22–29) is the standard six (`\Spec`, `\Gal`, `\Hom`, `\tr`, `\ad`, `\ind`) — verbatim match with modular-forms and theta-functions. None used in the body of the page (no `\Hom` etc. needed for partition theory), so the block is dead weight but harmless and identical to peers.
- Helper block at lines 184–233 (`$`, `$$`, `SVG`, `ensureArrow`, `drawArrow`, `drawNode`) is verbatim from category-theory.html — clean.
- `\boxed{\;…\;}` used at lines 381, 505, 740, 987 — consistent with house convention; reads well visually.
- `\bigl(\,\ldots\,\bigr)` and `\Bigl(\dots\Bigr)` mixed; matches peer pages; no concerns.
- Widget chrome (`.widget / .hd / .ttl / .hint / .readout / .row / .note / .ok / .bad`) used uniformly across all seven widgets; no ad-hoc classes.
- `\#` used (line 261) for cardinality `\#\{\text{partitions of }n\}` — matches mathematical convention; theta-functions uses the same idiom (line 397).
- One light formatting nit: §4 widget (`w-jtp`, line 640) lacks a `<div class="quiz">` placeholder (no concept attached), while the other six sections all carry one. Likely intentional (Jacobi triple product folded into theta-functions' quiz), but worth confirming the concept-graph side.

## Severity
minor polish
