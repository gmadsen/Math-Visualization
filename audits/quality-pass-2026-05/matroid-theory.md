# matroid-theory — pedagogical audit (2026-05)

**Section:** Combinatorics & graph theory
**Compared against:** enumerative-combinatorics, extremal-combinatorics

## Summary
Matroid-theory is a strong, dense page that hews closely to the section's house style (8 numbered sections, 7 widgets, narrated definitions, helper-block verbatim copy). Most issues are minor polish: a handful of terms used a paragraph or two before they are formally defined, one `<h3>` ("Matroid intersection (sketch)") with no widget of its own, and a couple of cosmetic encoding quirks in widget titles.

## Findings

### Notation drift
- Power-set and ground-set: matroid-theory writes `$2^E$` and `$E = \{1,\ldots,n\}$` (#axioms, #bases, #closure); both peers prefer `$[n]$` shorthand (`enumerative-combinatorics` uses `$\sum_{S \subseteq [n]}$` in the inclusion-exclusion formula; `extremal-combinatorics` writes `$\{1, \ldots, S(r)\}$` only when emphasising the ordered range). Cosmetic — internally consistent on this page.
- Rank function codomain: matroid-theory specifies `$r : 2^E \to \mathbb{Z}_{\ge 0}$` (#bases). Both peers omit codomains for integer-valued combinatorial functions. Cosmetic, low priority.
- Set-difference glyph: prose uses `$E \setminus B$`, `$E \setminus S$`, `$J \setminus I$` (good, matches both peers). But widget readouts use a raw Unicode backslash — `'B(M*) = E \\ B'` (#duality `dual-out`) and `'(T chosen as first half of E\\S)'` (#bases `bases-out`). Cosmetic since these are inside `.readout` plain-text panels.
- `\operatorname{cl}` (#closure) vs `\mathrm{PG}` (#examples, #closure): the page mixes `\operatorname{}` for the closure operator but `\mathrm{}` for `PG(2,q)`. Both peers reach for `\mathrm{}` (`\mathrm{ex}`, `\mathrm{inv}`) and never `\operatorname{}` for these acronyms. Cosmetic.

### Undefined jargon
- "loops" and "coloops" appear at #duality but are never defined on the page. Quote: *"Loops of $M$ are coloops of $M^*$; circuits of $M^*$ are **cocircuits** of $M$, the minimal cuts that disconnect a basis."* The reader is asked to absorb three new terms in one sentence; only "cocircuit" gets a gloss. Both also reappear without definition at #closure ("simple matroids — those without loops or parallel elements") and at #tutte ("for an element $e \in E$ that is neither a loop nor a coloop"). Highest-priority gap on the page.
- "minor" in #examples (Tutte's binary characterisation): *"$M$ is binary $\iff$ $U_{2,4}$ is not a minor of $M$."* "Deletion" and "contraction" eventually get a gloss at #tutte, but "minor" itself is never explicitly defined ("a matroid obtained from $M$ by a sequence of deletions and contractions") and the term first appears two sections ahead of those glosses.
- "parallel elements" (#closure, in the Birkhoff-theorem paragraph): named, never defined.
- "atomistic" (#closure): the parenthetical *"every flat is the join of rank-1 flats"* glosses the term in passing — adequate, flagged only as borderline.
- "bond" (#duality, in the `dual-out` widget readout): given a parenthetical gloss "(minimal cuts)" — adequate.

### Tone mismatches
- Page is on-tone overall: numbered sections, conversational opens, italicized "you can swap one in, one out" (#bases), worked-example asides, well-narrated definitions. Matches the conversational-but-precise template better than `extremal-combinatorics` does in places.
- One sentence in #greedy slips toward textbook-formal voice without narration: *"Apply (I3) to extend $I_{<i}$ from $J_{<i+1}$ at each step; you discover $w(e_{i_t}) \ge w(e_{j_t})$ for every $t$, contradicting $w(J) > w(I)$."* The notation $I_{<i}$ is introduced only here and not unpacked; a one-clause aside ("the first $i-1$ elements taken by greedy") would match the page's standard rhythm.
- "Matroid intersection (sketch)" (#greedy) is a pure-narration `<h3>` with three results name-dropped (bipartite matching, arborescences, NP-hardness for three matroids) and no concrete computation. The "(sketch)" in the heading is honest but reads a bit like a placeholder.
- The #outro has terse `<h3>` paragraphs of 1–2 sentences each, but this matches the peer pages' outro style and is section-consistent rather than a drift.

### Missing worked examples
- The `<h3>` "Matroid intersection (sketch)" (#greedy) name-drops bipartite matching ↔ partition-matroid intersection without unfolding it. Either an example showing the two partition matroids of $K_{3,3}$ and the resulting common-independent set, or merging the sketch into the main #greedy widget, would close the gap.
- Section #8 "Connections" has no widget — but `enumerative-combinatorics` § 7 and `extremal-combinatorics` § 7 also skip the widget on the outro, so this is section-consistent rather than a drift.
- Numbered `<h2>` sections 1–7 each have at least one interactive widget — independence-axiom checker, bases & rank, graphic matroid editor, flats stepper, dual matroid explorer, greedy-vs-non-matroid, Tutte calculator. Strong widget density, on par with `enumerative-combinatorics` (6 widgets across 7 sections).

### KaTeX macros / formatting
- All three pages share the same six-macro loader (`\Spec, \Gal, \Hom, \tr, \ad, \ind`); matroid-theory introduces no new local macros.
- `\operatorname{cl}` is used inline rather than a local `\cl` shortcut — the right call (matches `extremal-combinatorics`'s `\mathrm{ex}` policy of not defining single-page-scoped macros).
- `\setminus`, `\mathcal{I}`, `\mathcal{B}` consistent across all three pages.
- Display math uses `$$...$$` everywhere — matches AGENTS.md house convention; no `\[...\]` drift.
- Encoding bug: widget titles "Bases &amp;amp; rank explorer" (#bases, line 440) and "Graphic matroid: forests &amp;amp; cycles" (#examples, line 610) carry a double-encoded `&amp;amp;` — should be `&amp;` (rendered "&"). Cosmetic but visible in the rendered uppercase title strip.
- SVG `<title>` elements contain raw KaTeX delimiters (e.g. `<title>Flats of $M(K_4)$</title>` at #closure line 751). Same pattern appears in `enumerative-combinatorics` line 535 (`<title>Generating-function coefficients $a_n$</title>`), so this is section-consistent and the auto-render extension's behaviour on inert SVG titles is not a matroid-specific issue.

### Helper-block / widget-chrome hygiene
- Top-of-body 2D helper script (`$`, `$$`, `SVG`, `ensureArrow`, `drawArrow`, `drawNode`) is byte-identical to `category-theory.html` and to both peer pages — verified by direct comparison of lines 188–238.
- All seven widgets use the standard `.widget` / `.hd` / `.ttl` / `.hint` / `.readout` / `.row` / `.note` chrome. No ad-hoc widget classes.
- Widget IDs (`w-axioms`, `w-bases`, `w-graph`, `w-flats`, `w-dual`, `w-greedy`, `w-tutte`) follow the section convention.

## Severity
minor polish

---
*Reminder:* the orchestrator runs `node scripts/rebuild.mjs` after any content changes.
