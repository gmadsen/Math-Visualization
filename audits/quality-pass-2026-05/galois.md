# galois — pedagogical audit (2026-05)

**Section:** Number theory
**Compared against:** algebraic-number-theory, quadratic-reciprocity

## Summary
The page is unusually rich in worked widgets and reads in a confident, conversational voice consistent with section peers; structurally it is also one of the strongest in the corpus. The drift is concentrated in §7 and §8 (definition-only sections lacking the toy-to-poke that the rest of the page has trained the reader to expect) plus a handful of small notation/helper-block hygiene items that diverge from the section peers and the canonical template.

## Findings
### Notation drift
- Cyclic group rendered as raw Unicode "ℤ/4" / "ℤ/5" / "ℤ/8" inside the SVG-bound `note` strings (galois.html:914, 943, 960, 977, 993) but as KaTeX `$\mathbb{Z}/4$` in the §5 prose (galois.html:1130, 1148–1152). algebraic-number-theory.html and quadratic-reciprocity.html both use KaTeX `$\mathbb{Z}/p$` consistently in prose. **Cosmetic** — the Unicode `ℤ` survives only because those notes are written into `textContent` rather than KaTeX-rendered, but it makes the reader switch fonts mid-page.
- Quintic uses `S₅` (Unicode subscript) in widget option labels (galois.html:807, 1014, 1148–1152) and `$S_5$` (KaTeX) in prose (galois.html:1369, 1371). Same content, two glyphs side by side. quadratic-reciprocity.html keeps everything in KaTeX once the symbol enters the prose; algebraic-number-theory.html does the same with `\mathfrak{p}`.
- "Conjugacy class" sizes table (galois.html:1814–1820) writes cycle types as `'2²·1'`, `'3·1²'` — Unicode superscripts inside textContent. quadratic-reciprocity.html's tables stay in KaTeX (e.g. `(\tfrac{a}{p})`). **Cosmetic** but inconsistent.
- §6 widget config inlines `\\text{Gal}(L/K)` (galois.html:1386) instead of using the page macro `\Gal` declared in the head loader at galois.html:10. Prose elsewhere (galois.html:208, 793, 1130, 1367) uses `\Gal`. This is **semantic-adjacent**: the page declares a macro and then ignores it inside the proof-scrubber JSON, leaving two visually distinguishable renderings of the same operator.
- "$\sqrt[3]{2}$" (KaTeX, galois.html:656) coexists with "∛2" (Unicode glyph) inside the §2 widget readout (galois.html:313, 388, 396–400) and the impossibility table. Not wrong — but algebraic-number-theory.html keeps `\sqrt{d}` inside KaTeX everywhere, including widget readouts where feasible.

### Undefined jargon
- "Φ₅" / "Φ₇" appear in the §4 selector (galois.html:807–808) and the §6 dead-end branch (galois.html:1386, "the cyclotomic $\\Phi_5(x)$") **before** "cyclotomic polynomial" is ever defined or linked on the page. quadratic-reciprocity.html avoids this by deferring the cyclotomic name to §9 ("contained in the cyclotomic field $\mathbb{Q}(\zeta_{4a})$") only after Frobenius is on the table.
- "Perfect" (group-theory sense) is used inline at galois.html:1371 — *"Hence $A_5$ is perfect: $[A_5,A_5]=A_5$"* — without an inline gloss, despite being a less-common term than "simple" / "solvable" defined nearby.
- "Discriminant" appears as a Galois-group recipe input in the proof-scrubber (galois.html:1386, "the discriminant is non-square ($\\Delta = 2869$)") with no on-page definition. algebraic-number-theory.html defines its own discriminant in §1; galois.html could either link to it or gloss in one phrase.
- "Transitive subgroup" is used at galois.html:1787 *"transitive subgroup of $S_5$ containing a transposition and a $5$-cycle is all of $S_5$"* — the term is standard but the page never spells out what "transitive on the roots" means. Quadratic reciprocity is gentler with similarly-loaded terms (e.g. spends a sentence on "primitive root" before invoking it).
- Cycle notation `(123)`, `(12)(34)`, `(13524)` is introduced in widget buttons at galois.html:907–913, 1009–1011 with no on-page primer. The proof-scrubber prose later uses `(1\,2\,3)` etc. without explanation either. Most readers know it, but the page treats it as more obvious than the references treat the Legendre symbol.

### Tone mismatches
- §7 and §8 drop into dry-textbook voice — long uninterrupted paragraphs of definition-then-statement, no second-person prompts, no "try this", no widget. Compare quadratic-reciprocity.html §3 ("Try it. The widget below…") or algebraic-number-theory.html §5 (worked $\mathbb{Z}[\sqrt{-5}]$ tragedy with a side widget). The voice in galois.html §1–6 matches the references; §7–8 don't.
- The §1 closing line *"This page walks that story in six steps"* (galois.html:211) understates the actual page (eight sections). Minor but the reader who skims TOC first sees a contradiction.
- Anecdotes are otherwise charming and on-tone (galois.html:700 Hermes/Göttingen, galois.html:1793 Galois' duel) — these match the section-peer voice well.

### Missing worked examples
- **§7 Normal and separable extensions** — pure definition + criterion box, zero widget. The single concrete example ($\mathbb{Q}(\sqrt[3]{2})/\mathbb{Q}$ as not normal, restored by adjoining $\omega$) is told in prose at galois.html:1874, but the page already built a whole interactive ($x^3-2$ preset in the §4 explorer) that *is* this example — the section could explicitly callback to it or mount a stripped-down version.
- **§8 Primitive element theorem** — pure definition. The page does work the $\mathbb{Q}(\sqrt{2}+\sqrt{3})$ example in prose at galois.html:1902 with the polynomial $\theta^4-10\theta^2+1$, but offers no toy. A coefficient-slider for "pick $c$, watch when $\sqrt{2}+c\sqrt{3}$ stops being primitive" is the kind of thing the rest of the page has trained the reader to expect.
- §3 has a static table-as-widget (galois.html:643) but no interaction; the impossibility content is duplicated by the §2 stepper's `dblcube` preset, so this is fine — flagged only because the `<div class="widget">` chrome is used here for what is functionally a table (compare to algebraic-number-theory.html, which uses bare `table.plain` for static comparison content).

### KaTeX macros / formatting
- KaTeX loader uses the legacy one-shot `onload="renderMathInElement(...)"` form (galois.html:10) instead of the wrapped `renderAll()` retry pattern used by both references (algebraic-number-theory.html:25–50, quadratic-reciprocity.html:26–51) and by category-theory.html:10–35. Cosmetic for now, but the wrapped form is the de-facto template; the one-shot form has been observed to lose KaTeX renders if the auto-render contrib script arrives after the inline `onload` fires under flaky-network conditions.
- SVG title text contains a double-encoded ampersand: `<title>Compass &amp;amp; straightedge stepper</title>` (galois.html:239) — renders as literal `&amp;` in a screen-reader / hover tooltip. **Low priority** but a real bug.
- §6 proof-scrubber inlines its own KaTeX `renderMathInElement(...)` config block (galois.html:1619–1631) using `throwOnError:false` — this is consistent with the loader, but means the macros declared at galois.html:10 (`\Gal`, `\Hom`, etc.) are *not* in scope inside the scrubber prompts. That's why the scrubber uses `\\text{Gal}` instead of `\\Gal` (see Notation drift above). Either pass `macros:` into the inline render call, or use `\Gal` in the source and let the page-level loader handle re-render.
- No locally-defined macros in galois.html outside the head loader — the head macro list (`\Spec, \Gal, \Hom, \tr, \ad, \ind`) is identical to the references, which is good.

## Helper-block / widget-chrome hygiene
- **Helper block at top of `<body>` is a partial copy.** galois.html:160–182 defines `$`, `$$`, `SVG`, plus number-theory helpers (`gcd`, `mod`, `isPrime`, `factorizeInt`) — but **omits** `ensureArrow`, `drawArrow`, `drawNode`, the canonical 2D arrow/node helpers from category-theory.html:194–238 (also present verbatim in algebraic-number-theory.html:194–234 and quadratic-reciprocity.html:204–244). The §4 Galois-group widget then locally re-defines its own arrow marker plumbing (galois.html:1074–1079) — an avoidable reinvention. AGENTS.md flags exactly this as "Don't rewrite the helper block in a new style — copy from `category-theory.html`."
- Widget chrome is otherwise on-spec: `.widget`, `.hd`, `.ttl`, `.hint`, `.row`, `.readout`, `.note`, `.ok`, `.bad` are all used as defined.
- §6 quintic-branching widget uses ad-hoc inline `style="..."` on its readout (galois.html:1382) and crumb (galois.html:1383) instead of the standard `.note` / `.readout` classes. The widget functions but the inline styles drift from the chrome contract.

## Severity
minor polish
