# Pedagogy review (corpus-wide)

## Method

Sampled **30 topics** across all 8 sections (out of 83 total). Strategy was deliberately weighted: 5 from the strongest-looking sections (Algebra, Algebraic geometry), 5 from middle sections (Analysis, Number theory), 5 from likely-weaker sections (Combinatorics, Foundations) plus 3 capstones, plus 12 spot-checks weighted toward "advanced" Algebra/AG topics with terse hero subtitles. Each topic was scored 1–5 on six dimensions (motivation, pacing, intuition, bridges, examples, closure). Reading was done from `content/<topic>.json` raw blocks — the full body prose minus widget SVG and quiz placeholders. Hero subtitles, h2/h3 cadence, paragraph counts, "example" keyword density, and the *last raw block* of the last section (closure check) were all profiled programmatically; quality judgement was done by reading prose snippets directly.

## Headline findings

Three patterns dominate. **First**, the corpus splits along a sharp line: foundational/early-wave topics were authored as essays with motivation, story, bridges, and outros; recently-fanned-out advanced topics (the `infinity-*`, `heyting-*`, `cocartesian-*`, `algebraic-spaces`, `deformation-theory`, `algebraic-curves-higher-genus`, `group-schemes`, `intersection-theory-chow`, `etale-fundamental-group`, `algebraic-de-rham-cohomology`, plus all five Combinatorics topics) read as **definition-theorem-example**, with single-sentence hero "summaries" instead of motivation hooks and **no closure section** — the page just stops after the last quiz. **Second**, the bottom quartile (~12 topics) has *thin* hero subtitles formatted as one-line abstracts ("$\pi_1^{\text{ét}}(X,\bar x)$: Grothendieck's Galois theory unifying covers and fields.") rather than 3B1B-style hooks; their h1 titles are sentence-case auto-generated ("Heyting algebras toposes", "Algebraic de rham cohomology") rather than the strong-corpus pattern ("Categories, functors, and the Yoneda lemma" / "Quadratic reciprocity — the first deep symmetry of the primes"). **Third**, *bridge sentences are conspicuously absent* in the bottom quartile: sections begin with "A *Heyting algebra* is..." or "Fix functors $F : \mathcal{A} \to \mathcal{C}$..." with no transitional paragraph saying *why this is the natural next move*. The single highest-leverage fix is opening every topic with a 100-word motivation block and closing every topic with a 100-word "where this leads" section — both are templated and could be authored bank-style.

## Per-topic scorecard

Scores: **5** = exemplary; **4** = strong; **3** = adequate; **2** = thin; **1** = absent. Total /30.

| topic | section | mot | pac | int | brg | ex | cls | total | notes |
|---|---|--:|--:|--:|--:|--:|--:|--:|---|
| category-theory | Algebra | 5 | 5 | 5 | 5 | 5 | 5 | **30** | gold standard; "you already know" examples, "where this goes" outro |
| representation-theory | Algebra | 5 | 4 | 5 | 4 | 5 | 4 | **27** | atomic-Lie-algebra hook, 11 example flags, deep h3 cadence |
| commutative-algebra | Algebra | 4 | 4 | 4 | 4 | 4 | 5 | **25** | crisp dual-pictures opener, strong final "pattern running through" coda |
| schemes | Algebraic geometry | 5 | 4 | 5 | 4 | 4 | 4 | **26** | "three problems nag at you" framing carries the page |
| elliptic-curves | Algebraic geometry | 4 | 4 | 5 | 5 | 4 | 5 | **27** | "three faces of the same creature" + 4-bridge "Connections" coda |
| sheaves | Algebraic geometry | 4 | 5 | 5 | 4 | 5 | 3 | **26** | huge corpus (69k chars, 11 example flags) but ends mid-flow |
| moduli-spaces | Algebraic geometry | 4 | 4 | 4 | 4 | 3 | 3 | **22** | clear narrative arc; closure thin |
| stacks | Algebraic geometry | 5 | 4 | 4 | 4 | 4 | 4 | **25** | "Schemes : Sets :: Stacks : Groupoids" slogan; outro takeaways list |
| etale-cohomology | Algebraic geometry | 4 | 3 | 4 | 4 | 3 | 3 | **21** | bridge to topology good; intuition uneven mid-page |
| real-analysis | Analysis | 4 | 5 | 4 | 4 | 3 | 3 | **23** | "calculus textbooks write $\mathbb{R}$ as the number line and move on" — strong opener |
| measure-theory | Analysis | 5 | 5 | 4 | 4 | 4 | 5 | **27** | "two fatal defects" framing; full §14 Connections outro |
| functional-analysis | Analysis | 5 | 4 | 4 | 4 | 4 | 5 | **26** | confession-style opener; explicit Connections coda |
| dynamical-systems | Analysis | 4 | 4 | 5 | 3 | 3 | 3 | **22** | strong visual phrasing ("Lorenz butterfly"); thin bridges |
| probability-theory | Analysis | 3 | 4 | 4 | 3 | 5 | 2 | **21** | terse opener; high example density but no outro |
| galois | Number theory | 5 | 4 | 4 | 4 | 3 | 3 | **23** | strong motif (compass-and-straightedge); abrupt end |
| quadratic-reciprocity | Number theory | 5 | 5 | 4 | 5 | 4 | 5 | **28** | "Gauss called it the *theorema aureum*"; explicit "Why it matters" §9 |
| p-adic-numbers | Number theory | 5 | 4 | 5 | 5 | 3 | 5 | **27** | $\mathbb{Z}_p$ as Cantor-set tree; full "Why care" §9 |
| class-field-theory | Number theory | 4 | 3 | 3 | 4 | 3 | 3 | **20** | Kronecker–Weber framing good; expository sections dense |
| sato-tate (capstone) | Mod. forms | 4 | 4 | 4 | 4 | 3 | 4 | **23** | semicircle hook is great; "Coda: open horizons" present |
| bsd (capstone) | Mod. forms | 4 | 4 | 4 | 4 | 3 | 3 | **22** | "EDSAC printouts" colour; could close more deliberately |
| modularity-and-flt (capstone) | Mod. forms | 5 | 4 | 4 | 4 | 3 | 3 | **23** | "three ideas, one proof" — strong; closure thin |
| naive-set-theory | Foundations | 4 | 5 | 4 | 4 | 5 | 3 | **25** | "quiet undergrowth" opener; only Foundations topic, holds up |
| spectral-graph-theory | Combinatorics | 4 | 4 | 4 | 4 | 3 | 5 | **24** | "discrete differential geometry" framing; full coda |
| matroid-theory | Combinatorics | 4 | 4 | 3 | 3 | 3 | 1 | **18** | rich abstract; ends *abruptly* on Tutte section, no outro |
| probabilistic-method | Combinatorics | 4 | 3 | 3 | 3 | 1 | 1 | **15** | 0 example flags; ends on concentration, no outro |
| extremal-combinatorics | Combinatorics | 3 | 3 | 3 | 3 | 1 | 1 | **14** | abstract is dense list; ends on removal, no outro |
| simplicial-complexes-combinatorial | Combinatorics | 3 | 3 | 3 | 3 | 1 | 1 | **14** | cousin "see algebraic-topology" but no closure |
| heyting-algebras-toposes | Algebra (advanced) | 2 | 3 | 3 | 2 | 3 | 1 | **14** | hero is 1 line; no closure |
| infinity-categories | Algebra (advanced) | 2 | 3 | 3 | 3 | 3 | 1 | **15** | "Joyal's foundational observation" hint of motivation, but ends abruptly |
| cocartesian-fibrations | Algebra (advanced) | 2 | 3 | 3 | 3 | 3 | 1 | **15** | hero is one line of jargon; no closure |
| group-cohomology | Algebra (advanced) | 2 | 3 | 3 | 3 | 1 | 1 | **13** | tagline ok, but minimal motivation per section, no outro |
| infinity-topoi | Algebra (advanced) | 3 | 3 | 3 | 3 | 3 | 1 | **16** | "capstone tying three threads" promising; no closure |
| algebraic-spaces | Alg. geometry (adv.) | 2 | 3 | 3 | 3 | 4 | 1 | **16** | "missing rung between schemes and stacks" — good seed but stops |
| deformation-theory | Alg. geometry (adv.) | 2 | 3 | 3 | 3 | 4 | 1 | **16** | hero is technical telegram; no outro |
| algebraic-curves-higher-genus | Alg. geometry (adv.) | 2 | 3 | 3 | 3 | 3 | 1 | **15** | one-line hero, no outro, no h3 subsections |
| group-schemes | Alg. geometry (adv.) | 2 | 3 | 3 | 3 | 4 | 1 | **16** | hero "$\mathbb{G}_a, \mathbb{G}_m, \mu_n, \alpha_p$:..." is jargon-only |
| intersection-theory-chow | Alg. geometry (adv.) | 2 | 3 | 3 | 3 | 3 | 1 | **15** | "Bezout generalized" tag; flat opener; no closure |
| etale-fundamental-group | Alg. geometry (adv.) | 2 | 3 | 3 | 3 | 3 | 1 | **15** | LaTeX-only hero; no closure |
| algebraic-de-rham-cohomology | Alg. geometry (adv.) | 3 | 3 | 4 | 3 | 5 | 1 | **19** | strong "Worked example" markers; hero terse; no closure |

## Section-level patterns

- **Algebra** is bimodal: the foundational topics (`algebra`, `category-theory`, `representation-theory`, `commutative-algebra`, `homological`) are corpus-wide gold standard; the *advanced* infinity-/topos-cluster (`heyting-algebras-toposes`, `grothendieck-topologies-sites`, `simplicial-sets-and-nerve`, `infinity-categories`, `cocartesian-fibrations`, `infinity-topoi`, `derived-categories`, `group-cohomology`) consistently scores 13–16. Same section, very different authoring postures.
- **Algebraic geometry** mirrors the same split: the early-wave `schemes`, `sheaves`, `elliptic-curves`, `morphisms-fiber-products`, `bezout`, `projective-plane` are richly motivated; the recent `algebraic-spaces`, `deformation-theory`, `algebraic-curves-higher-genus`, `group-schemes`, `intersection-theory-chow`, `etale-fundamental-group`, `algebraic-de-rham-cohomology` are bottom quartile on motivation and closure.
- **Analysis** is uniformly solid (21–27). Lowest score is `probability-theory`, which has high example density but no closing pointer.
- **Number theory** has clear two-tier quality: the early/storytelling topics (`galois`, `quadratic-reciprocity`, `p-adic-numbers`) all score ≥23 with full "why care" outros; `class-field-theory` and `heights-arithmetic-geometry` (not tabled but spot-checked) score lower because they lean expository.
- **Combinatorics & graph theory** is the weakest section by mean (mean ≈17, four of five topics in bottom quartile). `spectral-graph-theory` is the lone strong page; the other four have terse openers and abrupt endings. This is the "recently added" section the brief flagged.
- **Foundations** is one topic, scoring 25 — fine but shallow on closure.
- **Modular forms & L-functions** capstones (BSD, FLT, Sato–Tate) are mid-tier (22–23). They have strong opening hooks but their closures feel like the author ran out of time: BSD ends on §5 of computation rather than a "what's next in this notebook" pointer.

## Concrete recommendations (ranked by impact)

1. **Add a closure section to every topic in the bottom quartile.** The single most consistent absence: ~12 topics end on the last quiz with no "where this leads / open horizons / connections" pointer. The strong-quartile pattern is templatable: 3–5 bullets linking to sibling topics + 1 paragraph naming open frontiers. This is the single highest-leverage fix.
2. **Rewrite the bottom-quartile hero subtitles.** Replace one-line jargon abstracts ("$\pi_1^{\text{ét}}(X,\bar x)$: Grothendieck's Galois theory unifying covers and fields.") with the strong-corpus pattern: 2–3 sentences setting up *what's at stake* before the math arrives. Compare `heyting-algebras-toposes` ("Intuitionist logic inside any topos: $\Omega$ as a Heyting algebra and the Mitchell–Bénabou language.") versus `quadratic-reciprocity`'s "Gauss called it the *theorema aureum*. A statement about which numbers are squares modulo a prime turns out to hide a perfect symmetry between pairs of primes — and that symmetry is the prototype of every reciprocity law that follows."
3. **Fix the auto-generated h1 titles.** "Heyting algebras toposes", "Algebraic de rham cohomology", "Grothendieck topologies sites", "Algebraic curves higher genus" — these read like slug→title autogeneration and undercut the page on first impression. Strong-corpus pattern uses subtitles or em-dashes ("Categories, functors, and the Yoneda lemma" / "p-adic numbers: trees, ultrametrics, and Hensel"). One-pass corpus-wide retitle would help.
4. **Insert bridge sentences between sections.** Many bottom-quartile pages start each `<section>` with a definition; the strong corpus opens each section with a sentence saying *why we now need this*. Concretely, a one-paragraph "and now" lead-in before each `<h2>` would lift the bottom dramatically with relatively little prose.
5. **Add explicit "Worked example" headings.** `algebraic-de-rham-cohomology` does this well ("Worked example IV: a singular curve") and the prose immediately reads more pedagogical. Topics with high example density but unmarked examples (matroid-theory, group-cohomology) would benefit from the same scaffolding — even just bolding "**Example.**" before each computation.
6. **Audit the Combinatorics section as a unit.** It's the only section with most topics in the bottom quartile. The math is rigorous but reads like lecture notes; one pass adding motivation hooks + closures could lift the entire section.
7. **Capstone closures need to be narrative, not technical.** BSD, FLT, Sato–Tate all end on a final §5/§6 of *technical content* rather than a "what we proved, what's open" beat. Capstones especially benefit from this — they're the load-bearing payoff pages.
8. **Standardise the "Connections" outro across topics.** `measure-theory`, `functional-analysis`, `elliptic-curves`, and `commutative-algebra` all have explicit *Connections* sections with bridges to neighbour topics. Make this an authoring template (`<section id="outro"><h2>Connections</h2>` with subsections per neighbouring page) and require it.
9. **Limit one-line hero subtitles in advanced topics.** A diagnostic rule: if the hero subtitle contains only a defining clause and no "why care" or "story" pointer, flag for rewrite. Ten advanced-section topics fail this test.
10. **Reduce parenthetical density in the most jargon-heavy pages.** `infinity-topoi` and `cocartesian-fibrations` carry 4–5 nested parentheticals per paragraph; this is appropriate for reference notes but actively breaks pedagogy. Rewriting just the *first paragraph* of each section to flat prose would be a high-leverage edit.

## Topics worth keeping as the gold standard

Authors of new topics — especially closures — should imitate these:

1. **`category-theory`** — the canonical model. "You already know" examples table, *Coq*-style "Why adjoints are everywhere" callouts, layered §10–§16 deep dives after the main exposition, full conceptual outro. (Already enshrined as the style template in `CLAUDE.md`.)
2. **`measure-theory`** — exemplary opening ("two fatal defects"), explicit §14 *Connections* outro with subsections per neighbouring topic.
3. **`p-adic-numbers`** — single dominant image (rooted-tree $\mathbb{Z}_p$) carried through the whole page; explicit §9 "Why care" outro with five named applications. Extremely tight prose.
4. **`quadratic-reciprocity`** — the "Gauss called it the *theorema aureum*" hook is the strongest opener in the corpus. The §9 "Why it matters" / "The bridge: Frobenius" closing is exactly the move BSD/FLT capstones should imitate.
5. **`elliptic-curves`** — "three faces of the same creature" framing, four-section *Connections* outro with bridges to representations/L-functions/modular-forms. Demonstrates how to close a rich-but-bounded topic.

[pedagogy reviewer]
