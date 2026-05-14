# point-set-topology — pedagogical audit (2026-05)

**Section:** Geometry & topology
**Compared against:** algebraic-topology, smooth-manifolds

## Summary
A polished, near-canonical entry: every numbered section has a working widget, the metric→opens narrative arc is well paced, and the conventions match the section peers. Only minor polish issues — a couple of unintroduced terms, two parallel widgets in §6, and one odd `<aside>` placement.

## Findings
### Notation drift
- Empty set glyph mixes `\emptyset` (body prose, e.g. line 453 `$\emptyset\in\tau$`) with `\varnothing` (the §6 counterexample-explorer widget JSON, e.g. line 1239 `\\varnothing`). Both peers use `\emptyset` exclusively. Cosmetic; recommend settling on `\emptyset` to match the rest of the page and the section peers.
- `\mathsf{Top}` for the category of topological spaces appears here (line 639) and in `category-theory.html` — consistent. `\mathsf{GL}_n` (line 1009) is fine but note `smooth-manifolds.html` uses `\mathrm{GL}_n` (line 462). Low priority; the two are stylistic siblings and both peers tolerate the variant.
- "neighborhood" (US) vs "neighbourhood" (UK): target uses "neighborhood" throughout (lines 1122, 1217); `smooth-manifolds.html` uses "neighbourhood" (line 284). Each page is internally consistent — no fix needed unless the corpus standardises.

### Undefined jargon
- "net (or filter)" appears at line 822 ("every net (or filter) has a convergent subnet") with no definition or callback. Nets and filters are nontrivial machinery; they earn a one-line gloss or a "see functional analysis" pointer.
- "Stone duality, Gelfand duality" name-dropped at line 836 with no definition or link. Acceptable as a teaser, but a cross-page link to `commutative-algebra.html` or `functional-analysis.html` (where these arise) would be in keeping with the page's otherwise generous linking habit.
- "Zariski, étale, Stone–Čech" at line 636 listed as examples of "spaces where no natural metric exists" — étale and Stone–Čech are unintroduced. Étale gets a callback elsewhere on the page only via the related-block; Stone–Čech doesn't appear again. A parenthetical "(coming up in commutative algebra / etc.)" would help.
- "Lindelöf" (line 1140) defined inline ("every open cover has a countable subcover") — fine.
- "Jones' lemma" referenced in the §6 widget JSON (line 1395) without explanation. Acceptable in a deep-dive widget tooltip but worth flagging.

### Tone mismatches
- Tone is consistently in-voice: conversational lead-ins ("Which brings us to the first mind-stretch of the subject", "Time to sanity-check the axioms by hand", "The widget above gave away the punchline") match category-theory.html and the algebraic-topology peer well.
- §4 line 818 ("the single most useful property a space can have") is a slight swing toward sales-pitch but lands within house style.
- No dry-textbook walls and no over-casual / meme drift detected.

### Missing worked examples
- All six numbered sections have at least one widget. §6 actually has *three* interactive blocks back-to-back (the hierarchy box `#w-sep`, the `MVCounterexampleGenerator` at `#sep-counterex`, and the `MVCounterexampleExplorer` at `#w-separation-axioms`). Two of the three cover the same ground (separation-axiom verdicts on small finite topologies / classical pathology spaces). Consider trimming to the two strongest, or framing them as "free-form sandbox" vs "curated tour" so readers know why both exist.
- §3 (Continuity / homeomorphism) currently lacks a *non*-homeomorphism counterexample worked symbolically — the widget shows the inclusion `(0,1) ↪ S¹` but the prose argument for why `[0,1]` and `(0,1)` differ (line 648) is stranded outside the widget. Minor; could be promoted into the widget readout.

### KaTeX macros / formatting
- Macros block (lines 39–46) is the standard six (`\Spec`, `\Gal`, `\Hom`, `\tr`, `\ad`, `\ind`) — identical to algebraic-topology.html and smooth-manifolds.html. No locally invented macros.
- Delimiters use the four canonical (`$…$`, `$$…$$`, `\(…\)`, `\[…\]`). No custom delimiter inventions.
- Helper block (lines 188–236) matches the canonical 2D helper from category-theory.html (`$`, `$$`, `SVG`, `ensureArrow`, `drawArrow`, `drawNode`).
- Widget chrome uses `.widget / .hd / .ttl / .hint / .row / .readout / .note / .ok / .bad / .small` consistently — no ad-hoc classes detected.
- Color tokens used throughout SVG paint: `var(--blue)`, `var(--yellow)`, `var(--green)`, `var(--pink)`, `var(--cyan)`, `var(--mute)`, `var(--ink)`, `var(--line)`, `var(--panel2)`. RGBA fills (e.g. `rgba(88,196,221,0.18)`) are used for translucent shading, matching peer practice.

### Other
- §6 has an unusual structural quirk: the `<footer>` (line 1463) is placed *inside* `<section id="separation">` rather than after it; the `</section>` close appears on line 1465. Cosmetic — renders fine — but the other sections all close before any sibling content. Worth a glance during the next pass.
- The `<aside class="related">` "Used in" block under §1 (line 317) lists `point-set-topology.html#compact` and `#continuity` — i.e. the page links itself as a downstream consumer. The injector is doing what it's told, but those self-references add noise; consider whether `inject-used-in-backlinks.mjs` should suppress same-page edges. Out-of-scope for this audit.

## Severity
minor polish
