# Plan

Forward-looking priorities for the notebook. Daily-workflow commands, one-time setup, architecture, conventions, and the full quiz/progression/callback story all live in [`AGENTS.md`](./AGENTS.md) — especially § "Common pitfalls". Project overview is in [`README.md`](./README.md).

When something ships, delete its bullet here. Don't keep a "Shipped recently" log — `git log` is the audit trail. The full step list of `rebuild.mjs` is in `scripts/rebuild.mjs` — refer to it rather than restating step names here.

## Corpus snapshot (2026-05-13)

From `audits/coverage-stats.md` and `audits/starter-concepts.md`:

- 181 topics, 1257 concepts, 34 capstones
- 149 concepts lack a widget in their owning section
- 1233 widgets, 100% registry-driven. 1229 interactive, 4 baselined-static SVG/table illustrations (`audit-widget-interactivity.mjs` is CI-gated via `audits/static-widgets-baseline.json`)
- Quiz tiers: v1 = 3708, hard = 1223, expert = 13 (intentionally bottom-of-list — see "Out of scope")
- Tag coverage: 99.1% across all 11 sections; tagging effort effectively complete
- 11 narrative-tour story pages on disk, all wired into Tours 1–11

## Missing-topic candidates

Distilled from comparisons against the Harvard / Princeton / MIT / Berkeley / Caltech grad catalogs. The Tier 1 Harvard list (several complex variables, cluster algebras, mapping class groups, Khovanov, complex multiplication, arithmetic statistics) shipped in PRs #131–#140; Random matrix theory in #155, GIT in #156; Brill–Noether (#159), Coding theory (#160), Conformal & CR geometry (#161), Mathematical biology (#162), Spectral methods (#163), Heegaard Floer (squash merge directly to main) all shipped together in a parallel batch. The residual next-priority batch:

1. **Combinatorial optimization** — Princeton MAT572. Min-max theorems, network flows, LP, perfect graphs, polyhedral combinatorics. **Lands in the new Control theory & optimization section.**
2. **Mathematical finance & stochastic control** — Caltech Ma 214. Itô calculus applied to derivatives pricing, optimal portfolio selection, HJB equations. Bridges `stochastic-calculus` into the new Control theory & optimization section.
3. **Optimal control & dynamic programming** — Pontryagin's maximum principle, Bellman equation, HJB PDE. Companion to math finance and the canonical opener for the new section.
4. **Donaldson–Thomas / GW invariants** — Princeton MAT566/567. Hinted in `mirror-symmetry` and `gauge-theory` but no dedicated page; closes the enumerative-AG gap.
5. **Positive characteristic AG** — Harvard Math 260Z. Frobenius splittings, $F$-singularities, char-$p$ phenomena. Partially covered by `crystalline-cohomology`.

**Mathematical biology stays under Probability & statistics** (user decision, 2026-05-12). Wright–Fisher / Moran / Kimura diffusion / Kingman coalescent are dominant; Lotka–Volterra and replicator dynamics sit as a deterministic detour. The section question is closed.

**Specialty / deferred**:
- **Microlocal sheaves and $\mathcal{D}$-modules connections** — partially covered by `d-modules` + `microlocal-analysis`.
- **Computational molecular biology** (MIT 18.417/418), **mathematical chaos** (Caltech Ma 104) — would fit inside the proposed *Mathematical biology* section.
- **Topological data analysis / persistent homology** — currently a sub-bullet in `simplicial-complexes-combinatorial`; deserves its own page if the corpus pursues an applied-topology direction.

## Content-gap audit — long-running

A systematic pass: for each section, compare against a canonical reference (PCM, nLab, Wikipedia) and flag the missing standard topics. Right cadence is one section at a time, after a topic-drafting batch lands.

## Authoring polish — small

- **Index-card thumb art.** First curation pass replaced the 12 weakest thumbs; new topic-batch PRs ship motif art on every new card. PR #169 cleared the 5 draft cards that had survived prior batches + the Kähler-geometry KaTeX-in-SVG thumb, and **promoted `audit-draft-index-cards.mjs` to a CI gate** so placeholder content can't ship again. Remaining surface is the pre-existing midbody (~15 cards that were judged already-strong but could still be sharpened).
- **Hoist semantic params out of verbatim slugs.** Roughly 210 per-widget verbatim slugs (was ~175 before the recent 5-topic batch added 35) share `widgets/_shared/verbatim-renderer.mjs` with opaque `bodyMarkup`/`bodyScript` strings. Migrating them to bespoke renderers with semantic params (slider ranges, color tokens, etc.) lets AJV validation and alt frontends actually inspect each widget. Worth doing in batches by topic — pick one whose widgets share a common gesture (slider + formula readout, click + reveal, etc.) and define a shared renderer that absorbs them all.
- **Color-only prose in widget readouts** (a11y). `audit-accessibility.mjs` flags 28 "color-only" references ("the orange dot is X"); fix by adding a non-color descriptor ("the dot at the upper-right"). Pure content review, no automation possible.
- **Remaining a11y input labels.** After PRs #167–#168 wired `for=` on 22 sliders with the `<label>text</label><input id=X>` pattern, ~24 inputs are still flagged — most are dynamically generated via createElement / template strings, needing `aria-label` in the script instead of a wrapping `<label>`.

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

- **Hard-tier quiz authoring** (812 concepts lack hard tier).
- **Expert-tier authoring** (13 questions corpus-wide).

These are real coverage gaps but not where the user wants to spend time. Per-session feedback memory: lowest-leverage direction, structural/architectural improvements come first.

