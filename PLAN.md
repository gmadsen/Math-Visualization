# Plan

Forward-looking priorities for the notebook. Daily-workflow commands, one-time setup, architecture, conventions, and the full quiz/progression/callback story all live in [`AGENTS.md`](./AGENTS.md) — especially § "Common pitfalls". Project overview is in [`README.md`](./README.md).

When something ships, delete its bullet here. Don't keep a "Shipped recently" log — `git log` is the audit trail. The full step list of `rebuild.mjs` is in `scripts/rebuild.mjs` — refer to it rather than restating step names here.

## Corpus snapshot (2026-05-22)

From `audits/coverage-stats.md` and `audits/starter-concepts.md`:

- 205 topics, 1410 concepts, 34 capstones
- 150 concepts lack a widget in their owning section
- 1439 widgets, 100% registry-driven. Interactive baseline gated via `audits/static-widgets-baseline.json`
- Quiz tiers: v1 = 4186, hard = 1223, expert = 13 (intentionally bottom-of-list — see "Out of scope")
- Tag coverage: 99.1% across all 12 populated sections; tagging effort effectively complete
- 11 narrative-tour story pages on disk, all wired into Tours 1–11
- 13 sections registered; 12 have content — Control theory & optimization (section 12) has 9 topics. Section 13, **Learning theory & data science**, was opened empty on 2026-05-21; first topics queued under the breadth-expansion program below.

## Breadth-expansion program (locked 2026-05-21)

A 16-topic program agreed with the user to flesh out the thinnest sections (Combinatorics opened at the advanced level with no foundation layer; Control had only 5 topics) and add a 13th section for ML / learning theory. Dependency-ordered into three waves. **Delete each slug below as its page ships.** Always check existing coverage before drafting — see the per-section "already covered" notes.

### New section 13 — Learning theory & data science

**Opened empty in PR #248** — registered in `concepts/sections.json` (id `learning-theory-and-data-science`, color `b` blue), wired into `new-topic.mjs` (SECTIONS/palette/aliases + `CAPSTONES_GROUP_INDEX` 12→13), and the 12→13 references in AGENTS.md + the jsdom section-stats test bumped. The section's `index.html` `.sec` header + grid and the generated `sections/learning-theory-and-data-science.html` landing page debut with the **first topic card** (mirrors how Control opened in #171). Scaffold topics with `node scripts/new-topic.mjs <slug> learning-theory`; in the same PR, add the slug to the section's `topics` array in `sections.json` (new-topic.mjs doesn't touch sections.json) and replace the draft index card so `audit-draft-index-cards` (a CI gate) stays green.

- `information-geometry` — Fisher metric, natural gradient, exponential families as manifolds
- `diffusion-and-score-based-models` — score matching, reverse SDE; bridges `stochastic-calculus`
- `causal-inference` — do-calculus, structural causal models

### Combinatorics & graph theory — build the missing foundation layer


### Control theory & optimization — the decision-making half

Already covered, do **not** duplicate: LP/simplex/duality/network-flows/matching/polyhedral (`combinatorial-optimization`); Bellman/DP/stochastic-DP/HJB/Pontryagin/LQR (`optimal-control-and-dynamic-programming`); SGD/proximal/online/interior-point (`convex-optimization`).


### Sequencing

- **Wave 1 (floors): ✅ complete** — `statistical-learning-theory` #249, `graph-theory-fundamentals` #250, `markov-decision-processes` #251.
- **Wave 2 (build up): ✅ complete** — `ramsey-theory` #252, `order-theory-and-lattices` #253, `game-theory` #254, `kernel-methods-and-rkhs` #255, `reinforcement-learning` #256, `probabilistic-graphical-models` #257.
- **Wave 3 (integrative):** `information-geometry`, `diffusion-and-score-based-models`, `causal-inference`

### Follow-on (don't block the above)

- Lightweight **taxonomy audit** of existing placements once the new sections exist — e.g. `partitions-generating-functions` sits under Modular forms (eta-function link) but is core combinatorics; `topological-data-analysis` under Geometry vs the data cluster. Separate advisory pass.
- **Arithmetic geometry** is already covered in depth (~18 topics across Number theory + Algebraic geometry + Modular forms, incl. `heights-arithmetic-geometry`). No standalone page needed unless the corpus wants a connective landing.

## Missing-topic candidates

The five Tier-1 catalog gaps (combinatorial optimization, math finance, optimal control, DT/GW, positive-characteristic AG) all shipped in PRs #173–#177. The "specialty" trio (TDA, mathematical chaos, computational molecular biology) shipped in PRs #180–#181. Beyond the locked breadth-expansion program above, re-prime this list after the next Harvard / Princeton / MIT / Berkeley / Caltech catalog comparison.

Lone deferred item: **microlocal sheaves and $\mathcal{D}$-modules connections** — partially covered by `d-modules` + `microlocal-analysis`; standalone page only if the corpus pursues a deeper sheaf-theoretic-analysis direction.

**Mathematical biology stays under Probability & statistics** (user decision, 2026-05-12). Wright–Fisher / Moran / Kimura diffusion / Kingman coalescent dominate; Lotka–Volterra and replicator dynamics sit as a deterministic detour. The section question is closed.

## Action the quality-pass-2026-05 audit findings

190 per-topic audits sit under `audits/quality-pass-2026-05/` (plus `_SUMMARY.md`). Per-PR fix loop is the standing workflow: pick a thematic bundle (callback dedup, helper-block restoration, silent 404s, notation drift, author-voice leaks, ...), verify each claim before editing (~30–50% of findings turn out already-fixed), ship as one PR with 3 read-only review agents posting on the PR. **Mine the directory before proposing a new audit pass.**

## Authoring polish — small

- **Index-card thumb art.** First curation pass replaced the 12 weakest thumbs; new topic-batch PRs ship motif art on every new card. PR #169 cleared the 5 draft cards that had survived prior batches + the Kähler-geometry KaTeX-in-SVG thumb, and **promoted `audit-draft-index-cards.mjs` to a CI gate** so placeholder content can't ship again. Remaining surface is the pre-existing midbody (~15 cards that were judged already-strong but could still be sharpened).
- **Hoist semantic params out of verbatim slugs.** Roughly 391 per-widget verbatim slugs share `widgets/_shared/verbatim-renderer.mjs` with opaque `bodyMarkup`/`bodyScript` strings. Migrating them to bespoke renderers with semantic params (slider ranges, color tokens, etc.) lets AJV validation and alt frontends actually inspect each widget. Worth doing in batches by topic — pick one whose widgets share a common gesture (slider + formula readout, click + reveal, etc.) and define a shared renderer that absorbs them all.

## Three.js / Pyodide / alt frontends (long-running)

- **Three.js adoption decision.** `examples/threejs-prototype/` validates the ceiling-raise for 3D-heavy topics. Would converge with `surface-viewer`. Requires AGENTS.md amendment on dependency policy.
- **Inline code cells for live examples.** `inline-code-cell` is a Web Worker JS sandbox; could be extended to Pyodide for sieves / sympy demos at the cost of a ~10MB CDN load.

## NPM packages — candidates worth evaluating

- **`cheerio`** over `node-html-parser` — richer for DOM manipulation in `inject-*`/`fix-*` scripts.
- **`katex` as a dependency** — would let `validate-katex.mjs` do real rendering instead of heuristic checks.

## Deferred review items

- **KaTeX macro-loader expansion.** Notation reviewer flagged `\Re`, `\vol`, `\End` as candidates that just crossed the threshold where defining once in the loader pays off. Currently rendering correctly via `\mathrm{...}` so cosmetic, not a bug.

Quiz items from PR #36 / #37 review (type-variety, hint coverage, trivia rewrites, blurb undercoverage) are deferred per "Out of scope".

## Out of scope

Items the user has explicitly de-prioritized. **Don't suggest these as "what next" without prompting.**

- **Hard-tier quiz authoring** (972 concepts lack hard tier).
- **Expert-tier authoring** (13 questions corpus-wide).

These are real coverage gaps but not where the user wants to spend time. Per-session feedback memory: lowest-leverage direction, structural/architectural improvements come first.

