# etale-fundamental-group — pedagogical audit (2026-05)

**Section:** Algebraic geometry
**Compared against:** etale-cohomology, algebraic-topology

## Summary
Strong, well-paced page with worked examples in every section and thoughtful peer-reference structure. The main issues are notation inconsistency for the étale superscript (`\acute{e}t` vs `\text{ét}`) within the same page and across the section's peers, plus a handful of jargon terms (Galois category, torsor, primitive-element theorem, pro-objects, Tate-module, analytification) introduced without a one-clause definition.

## Findings
### Notation drift
- Page uses two different KaTeX renderings of the étale superscript in the same file. Sections 1–6 and the hero use `\pi_1^{\acute{e}t}` (e.g. line 268, 481, 559, 635); section 7 ("Connections") and the etale-cohomology peer use `\pi_1^{\text{ét}}` (line 766, 774; etale-cohomology line 282). Semantic drift — same symbol, two visibly different glyphs on the same page. Recommend settling on one (`\text{ét}` matches etale-cohomology and is the more standard rendering).
- `\mathrm{F\acute{E}t}/X` on line 277 vs. `\mathrm{F\acute{É}t}/X` (capital É with acute) on line 386, 490 — same category named two ways within three sections. Cosmetic but visible.
- The proof-scrubber SVG-inner text uses Unicode `π₁^ét`, `x̄`, `Ω` (lines 522, 527, 532) while surrounding prose uses KaTeX `\pi_1^{\acute{e}t}` and `\bar{x}`. Inconsistent rendering channels for identical symbols; etale-cohomology has the same mixed pattern, so it's a section-wide habit rather than a target-only issue.
- Hat-on-pi: the comparison-square hint reads `\hat{\pi_1^{\mathrm{top}}}` (line 688) but the body equation immediately above uses `\widehat{\pi_1^{\mathrm{top}}(X(\mathbb{C}), x)}` (line 678). `\widehat` is the right choice for multi-character bases; `\hat{...}` puts the hat over only the first token. Cosmetic.
- `\mathrm{Aut}` (h2 of §3, line 481) vs. macro-defined `\Hom` (used as `\Hom_X(\bar{x}, Y)` on line 385). Both are operator-name conventions; the page already has `\Hom`, `\Spec`, `\Gal` macros — adding a parallel `\Aut` macro and using it everywhere would match house style.

### Undefined jargon
- "Galois category" — first used in §1 prose (line 277: "It is a *Galois category* in Grothendieck's sense") with only the gloss "once we choose a geometric point: that structure is what powers the fundamental group." Re-cited in §2 (line 386) with an SGA-1 reference but still no axioms. A reader without prior exposure has no operational handle on what "Galois category" lets them do.
- "torsor" — line 279 ("a torsor under $\mu_n(\bar{k})$") and again in the §1 widget readout (line 353, "torsor under $\mathbb{Z}/3$ acting by deck transformation") with no definition. First-time reader sees an unfamiliar noun acting as the punchline of the worked example.
- "primitive-element theorem" — line 390 cites it as if known; algebraic-geometry-section readers may not have done the Galois prereq. A 4-word parenthetical would close it.
- "pro-objects" — line 490 ("they are *pro-objects* in $\mathrm{F\acute{É}t}/X$"); used to justify why the universal cover need not be a scheme, then dropped without ever being unpacked.
- "Tate-module data" — line 683 ("the finite étale covers are the $n^2$-fold ones $[n]\colon E\to E$, recovering Tate-module data") drops "Tate module" with no link or gloss.
- "analytification" — line 681 ("every such finite topological cover is the analytification of a finite étale cover"); used as a verb-noun in the central proof of the comparison theorem, undefined.
- "Artin–Schreier covers $y^p - y = f$" — line 685 introduces them by formula only, with no callback or one-sentence statement of why they make $\pi_1^{\text{ét}}(\mathbb{A}^1_{\mathbb{F}_p})$ nontrivial; the reader is expected to know "$y^p - y = f$ defines an étale Z/p-cover."
- "deck transformation" — line 353 widget readout uses it before §3 introduces "deck group" (line 531, in the proof-scrubber). The peer page algebraic-topology defines deck group in its §4 (line 588) but the etale-fundamental-group readout assumes it. A prereq callback to algebraic-topology #covers would be cheap.
- "anabelian", "section conjecture", "geometric Langlands" — closing line 780; acceptable as a teaser since they're explicitly framed as "open frontiers", not load-bearing.

### Tone mismatches
- The §1 widget readout dumps a string with naked `f_*O_Y` (line 353) — KaTeX is not invoked on `f_*O_Y` because it lacks `$…$` delimiters around that token, so it ships as raw ASCII while the same readout calls `renderMathInElement` on the rest. Cosmetic but reads as a tone hiccup (mixed-rendering blob).
- Section 7's "Connections" h3-subsection list (lines 764–778) reads more like a textbook reference list than the conversational mini-recap that category-theory.html and the rest of this page sustain. Four short paragraphs each ending with a one-sentence claim, no widget, no toy. Not bad, just dryer than §1–§6.
- The hint text "click any base point in $X$ to see the fiber in $Y$" (line 282) uses a casual lowercase imperative that matches house voice — fine.
- §6 "What goes wrong in characteristic $p$" (line 685) is a single dense paragraph cramming Artin–Schreier, wild ramification, tame quotients, and simply-connected affine line all in two sentences. Could be a `.note` block or split for breath.

### Missing worked examples
- Section 7 ("Connections") has no widget and no toy computation. Per AGENTS.md "every numbered `<h2>` should have at least one concrete computation or widget", this is a gap. The peer etale-cohomology has its own equivalent "Comparison theorems" section §5 with the comparison-square, so the convention is variable; still, §7 as the page's capstone could land a final integrating widget (e.g. "look up $\pi_1^{\text{ét}}$ for a small zoo of schemes" lookup table).
- §1 has the `w-fet-cover` widget (good); §2 has `w-fiber-fnctr` (good); §3 has the proof-scrubber (good); §4 has `w-galois-equiv` proof-scrubber (good); §5 has the modular-arithmetic-clock (good); §6 has the comparison-square (good). Only §7 is widget-free.
- §6's "What goes wrong in characteristic $p$" subtopic is a strong opportunity for an Artin–Schreier toy ("type a polynomial $f$, see the cover $y^p - y = f$ over $\mathbb{F}_p$"), but currently shipped as prose.

### KaTeX macros / formatting
- Page declares the standard macro set (`\Spec`, `\Gal`, `\Hom`, `\tr`, `\ad`, `\ind`) matching etale-cohomology verbatim — good. `\tr`, `\ad`, `\ind` are unused on this page (template carry-over); harmless.
- No new local macros beyond the canonical set. No re-invented delimiters. KaTeX hygiene clean.
- `\acute{e}t` is not a "macro" but a recurring literal compound that arguably should have been `\text{ét}` from the start (the latter is what etale-cohomology uses, and matches the URL/title spelling). Not strictly a macro issue; fold into Notation drift above.
- Helper-block scaffolding (`$`, `$$`, `SVG`, `ensureArrow`, `drawArrow`, `drawNode`) at lines 189–241 matches category-theory.html verbatim — good.
- Widget chrome (`.widget / .hd / .ttl / .hint / .readout / .row / .note / .ok / .bad`) used correctly throughout. No ad-hoc classes spotted.

## Severity
minor polish
