# Corpus analysis — synthesis & plan

Aggregates the six wave-1 + wave-2 reviewer reports under `audits/` into a single ranked plan. Each item below cites the originating report(s); the full reasoning lives in those files.

- `pedagogy-review.md` — prose quality, motivation, closures, intuition-building
- `section-taxonomy.md` — section cuts, topic placement, levels accuracy
- `dag-health.md` — concept-graph topology, missing edges, orphans
- `coverage-gaps.md` — vs canonical graduate curriculum (Hartshorne, Hatcher, Folland, Diamond–Shurman, …)
- `quiz-widget-audit.md` — quiz tier coverage, type variety, widget interactivity
- `consistency-review.md` — notation, jargon definedness, tone, KaTeX hygiene

## What the corpus is right now

83 topics, 575 concepts, 138 widgets, 2901 quiz questions, 8 sections. The 5-reviewer team converges on the same diagnosis: **the math is correct, the structure is sound, the recently-fanned-out advanced topics are technically right but pedagogically thin**. The gold-standard pages (`category-theory`, `complex-analysis`, `quadratic-reciprocity`, `schemes`, `elliptic-curves`, `commutative-algebra`) are widely seen as exemplars; the bottom quartile (~12 topics, mostly the ∞-topos + topos-theory cluster + the new Combinatorics anchors + a few AG advanced fillers) ship with auto-generated titles, no motivation hooks, no closure sections, and 60-90% static SVG widgets.

The DAG is **not over-wired but under-wired** — max fan-out is 5 across the entire corpus (implausibly flat for graduate math), 32% of concepts are dead-end, and one orphan (`sperner-lym`). 184 dead-ends — only 14 are legitimate capstones.

8 sections, but the cuts don't reflect actual learner audiences: Algebra silently houses both the classical-graduate core AND the entire ∞-topos arc; Foundations is a single-topic vestigial header; Algebraic geometry has 19 topics and would benefit from sub-banding.

Vs canonical curriculum: most-noticed gaps are **first-order-logic-and-completeness** (Foundations), **PDEs** (Analysis — the payoff topic for Sobolev/FA/distributions), **characteristic-classes** (Geometry & topology — bridges differential forms / algebraic topology / Chow), **analytic-number-theory**, **lie-algebras**.

## Initiative ranking (proposed)

Eight workstreams, ranked by leverage-per-unit-effort. Blocked-by relationships noted; some can run in parallel.

### Tier A — High-leverage / low-cost (ship first)

**A1. Pedagogical-polish bank on the bottom quartile (~12 topics)**
*Source: pedagogy-review (proposals 1, 2, 3, 8) + consistency-review (proposals 2, 4)*
- Add a templated **Closure / Connections** section (3–5 sibling-topic links + 1 paragraph "where this leads / open frontiers") to every bottom-quartile topic.
- Rewrite the ~10 fragmentary hero `<p class="sub">` blocks ("$\pi_1^{\text{ét}}(X,\bar x)$: Grothendieck's Galois theory…") into 2–3 sentences setting up *what's at stake*.
- Fix the 12+4 slug-flavored `<title>` and `<h1>` tags ("Heyting algebras toposes" → "Heyting algebras and the internal logic of toposes").
- Single most-cited recommendation across reviewers; templatable, mechanical, ships pure pedagogical lift.

**A2. Strip 36 duplicate callback asides + KaTeX hygiene pass**
*Source: consistency-review (proposals 1, 3, 5, 6, 8, 9, 10)*
- 30-line node helper to detect and remove unfenced `<aside class="callback">` blocks not preceded by the `<!-- callback-auto-begin -->` fence.
- Add shared KaTeX `\newcommand` block (`\Spec`, `\Hom`, `\Gal`, `\Frob`, `\Aut`, `\End`, `\Tr`, …) to the page header loader.
- Bezout → Bézout typo. Standardize `<strong>Worked example.</strong>`.
- Decide `\mathrm{Spec}` vs `\operatorname{Spec}` and migrate.

**A3. Hint-generation pass on v1 quiz tier (~1500 candidates)**
*Source: quiz-widget-audit (proposal 1)*
- Existing `generate-hints` skill auto-derives hints from `explain` for hard tier; extend to v1 questions where `explain` exists but `hint` does not.
- 37.5% → ~80% v1 hint coverage. Mechanical; respects the explicit de-prioritization of hard/expert authoring.

**A4. Wire 30 static widgets on the 7 worst pages**
*Source: quiz-widget-audit (proposals 2, 7, 8) + pedagogy-review*
- Targets: `infinity-topoi` (7/9 static), `algebraic-de-rham-cohomology` (5/8), `cocartesian-fibrations` (5/8), `group-schemes` (5/8), `deformation-theory`, `infinity-categories`, `etale-fundamental-group`. Each widget is a short pointer-handler addition.
- Adopt the 3 fixture-only widgets in real topics: `julia-playground` → `dynamical-systems / julia-mandelbrot`; `branching-proof-scrubber` → `quadratic-reciprocity / supplementary-laws`; `diagram-editor` → an `infinity-topoi` or `derived-categories` concept.
- Promote `audit-widget-interactivity` from advisory to PR-blocking.

**A5. Levels-map + topic-placement corrections**
*Source: section-taxonomy (proposal 4) + DAG (item 7)*
- Relabel `galois-representations` from `capstone` → `advanced` (it's a bridge concept consumed by sato-tate + modularity-and-flt).
- Relabel `stacks` to match its actual capstone status in `capstones.json` (currently `level=capstone` but no entry there).
- Move `galois-representations` from Modular forms section → Number theory.

### Tier B — Structural refactor (medium cost, foundation for Tier C)

**B1. Section split: Algebra → "Algebra & homological" + "Higher categories & topos theory"**
*Source: section-taxonomy (proposal 1)*
- 7 topics each. Boundary at `derived-categories`/`group-cohomology` (classical) vs `elementary-topos-theory` onward (higher).
- Touches `concepts/sections.json`, `concepts/capstones.json`, `pathway.html`, `index.html`, `README.md`, `mindmap.html` `SECTION_ANCHOR`.
- Resolves the audience mismatch between `capstone-yoneda` and `capstone-infinity-topoi`.
- Color suggestion: keep Algebra `y`; give Higher cat/topos a free color.

**B2. Foundations rebrand or absorb**
*Source: section-taxonomy (proposal 2) + coverage-gaps (top recommendation)*
- Coverage-gap reviewer's top pick is to GROW Foundations into a proper **Logic & Foundations of Mathematics** section with 5–6 anchors (first-order-logic-and-completeness, ZFC-and-ordinals, model-theory, computability-and-incompleteness, type-theory-and-hott).
- Section-taxonomy reviewer's pick is to DEMOTE Foundations (1-topic vestigial section).
- These compete. The growth-path is higher-leverage but bigger investment; demotion is one config change. **Recommendation: pursue B2-grow; defer demotion**.

**B3. AG sub-banding via topic order**
*Source: section-taxonomy (proposal 6)*
- No schema change; just `concepts/index.json` order: AG-foundations → Curves & cohomology → Moduli & stacks → Arithmetic-geometry tools.
- Pure ordering nudge; lifts navigability of the largest section.

**B4. Recolor Combinatorics to break the `g` collision with AG**
*Source: section-taxonomy (proposal 3)*
- Mechanical fix to `concepts/sections.json` `color` field (now that we promoted color into the bundle in PR #34).

### Tier C — Content additions (highest impact, biggest cost)

**C1. Logic & Foundations section build-out** (couples with B2-grow)
*Source: coverage-gaps (top recommendation)*
- Anchors: `first-order-logic-and-completeness`, `zfc-and-ordinals`, `model-theory-basics`, `computability-and-incompleteness`, `type-theory-and-hott`.
- Each is a full topic page (5–7 concepts + widgets + quizzes). Estimated effort: same shape as the Combinatorics fan-out from PR #34 (5 topics × ~2 hours/agent = ~10 hours of agent time).

**C2. Top-10 individual topic additions** (one per existing section, ranked)
*Source: coverage-gaps (proposals 1–10)*
1. `partial-differential-equations` — Analysis
2. `characteristic-classes` — Geometry & topology
3. `analytic-number-theory` — Number theory
4. `lie-algebras` — Algebra
5. `enumerative-combinatorics` — Combinatorics
6. `morse-theory` — Geometry & topology
7. `modular-curves` — Modular forms
8. `galois-cohomology-and-brauer` — Algebra (overlaps `group-cohomology` — fold or ship)
9. `stochastic-processes-and-martingales` — Probability (currently 1 topic; see C3)
10. (reserve) — pick from the runner-up list per reviewer

**C3. Probability & statistics expansion** (deferred unless C1+C2 land first)
- The existing one-topic `probability-theory` is undersized. A second-pass new section ("Probability & statistics") with stochastic-processes, random-walks, statistical-inference, and entropy/information-theory could match Combinatorics in scope.
- Lower priority than C1 (Logic) per coverage-gaps reviewer.

### Tier D — DAG strengthening (cuts across all tiers)

**D1. High-confidence implicit prereq materialization** (~50 edges)
*Source: dag-health (proposal 2)*
- `audit-cross-topic-prereqs.mjs --min-confidence high` already lists 129 candidates. Hand-review the top 50 (matches `audit-graph-health` hub-fan-in expectations); land in batches of 10–15.

**D2. Targeted bridge edges**
*Source: dag-health (proposals 3–6)*
- `riemann-surfaces` ↔ `algebraic-curves-higher-genus`
- `dynamical-systems` ↔ `lebesgue-measure` + `birkhoff-ergodic-theorem`
- `extremal-combinatorics` + `spectral-graph-theory` → `probabilistic-method`
- Resolve `sperner-lym` orphan (connect to `partitions-generating-functions` or a posets concept)

**D3. Galois capstone tree expansion**
*Source: dag-health (proposal 1)*
- `solvability-by-radicals` is depth 2 / 1 leaf — needs `solvable-groups`, `normal-subgroup-tower`, `splitting-field`, `cardano-cubic-quartic`. Likely 1–2 new concepts on `algebra.html` or `galois.html`.

### Tier E — Polish + automation (ongoing)

**E1. Diversify question types on 38 mcq+numeric-only topics**
*Source: quiz-widget-audit (proposal 3)*
- Add 1 `multi-select` and 1 of `ordering`/`spot-the-error`/`proof-completion` per topic, v1 only.
- Shared template makes this batchable.

**E2. Reuse `modular-arithmetic-clock` and `lattice-visualizer` on 6 topics**
*Source: quiz-widget-audit (proposals 5, 6)*
- Existing widgets, no new code; just `content/<topic>.json` widget-block additions.

**E3. Standardize "Connections" outro into the new-topic scaffolder**
*Source: pedagogy-review (proposal 8)*
- `scripts/new-topic.mjs` should emit a templated `<section id="outro"><h2>Connections</h2>` block. Prevents the no-closure pattern from recurring.

**E4. CI gates**
*Source: quiz-widget-audit (proposal 10) + consistency*
- Promote `audit-widget-interactivity` from advisory → PR-blocking on new widgets.
- Slug-flavored title detector → blocking gate (catches "Algebraic de rham cohomology"-class drafts before merge).

### Cross-cutting

- **Templates over hand-authoring**: A1, A4 adoption, B3 ordering, C1+C2 new topics, E1, E3 should all use templated scaffolders so the lift is mechanical and the next contributor doesn't relitigate.
- **DAG strengthening (Tier D) is best done concurrently with C1+C2**: every new topic adds new edges; doing Tier D after C1+C2 means a second pass.

## Suggested execution order

If shipping in order of leverage:

```
1.  A1 + A2 + A5  (parallel — pedagogical polish + consistency cleanups)
2.  A3 + A4       (parallel — quiz hints + widget interactivity)
3.  B3 + B4       (mechanical structural — sub-banding + recolor)
4.  D1 + D2 + D3  (DAG strengthening)
5.  B1            (Algebra section split)
6.  C1            (Logic & Foundations section, w/ B2-grow)
7.  C2 ×10        (individual topic additions, parallel agents)
8.  C3            (Probability section, optional)
9.  E1 + E3 + E4  (templates + gates so the next pass doesn't regress)
```

Tier A is ~1 work session. Tier B is half a session. Tier C is multiple sessions of agent fan-out.

## Open questions for discussion

1. **Foundations: grow or demote?** Coverage-gap reviewer wants 6 anchor topics (Logic & Foundations); section-taxonomy reviewer wants the section dissolved entirely. They can't both win. Default recommendation: grow.

2. **Probability section: ship now or defer?** It's the second-most-requested missing section per coverage gaps; one existing topic (`probability-theory`) is the entire surface. A 4–6 anchor expansion would mirror Combinatorics, but C1 (Logic) is more often-cited as the gap.

3. **Algebra split: now or later?** Highest-leverage structural change but touches 5+ files including capstones.json + the README. Could land early (B1 → tightens the rest) or late (after C2 adds new Algebra topics that may belong on either side of the split).

4. **Hard-tier quiz expansion: stays out of scope?** `PLAN.md` says hard/expert is the lowest priority. The audit found 13 expert questions corpus-wide. Confirm: stays out of scope?

5. **Capstone narrative closures**: pedagogy reviewer flagged BSD/FLT/Sato-Tate as ending technically rather than narratively. Worth a focused capstone-prose pass, or leave alone?
