# Plan

Forward-looking priorities for the notebook. Daily-workflow commands, one-time setup, architecture, conventions, and the full quiz/progression/callback story all live in [`AGENTS.md`](./AGENTS.md) — especially § "Common pitfalls". Project overview is in [`README.md`](./README.md).

When something ships, delete its bullet here. Don't keep a "Shipped recently" log — `git log` is the audit trail. The full step list of `rebuild.mjs` is in `scripts/rebuild.mjs` — refer to it rather than restating step names here.

## Corpus snapshot (2026-05-13)

From `audits/coverage-stats.md` and `audits/starter-concepts.md`:

- 190 topics, 1320 concepts, 34 capstones
- 150 concepts lack a widget in their owning section
- 1349 widgets, 100% registry-driven. Interactive baseline gated via `audits/static-widgets-baseline.json`
- Quiz tiers: v1 = 3918, hard = 1223, expert = 13 (intentionally bottom-of-list — see "Out of scope")
- Tag coverage: 99.1% across all 12 sections; tagging effort effectively complete
- 11 narrative-tour story pages on disk, all wired into Tours 1–11
- All 12 sections open with content; Control theory & optimization (section 12) has 3 topics

## Cross-page parallelization fix — high priority

**Problem.** Every topic-add PR currently rewrites all 190 topic HTMLs + their `content/*.json` because `__MV_SECTION_MAP` is inlined into each page's `<head>` (see `scripts/inject-breadcrumb.mjs`). Adding one topic produces a ~440-file diff with `2 +-` per page. Parallel topic agents collide on every sibling file even though their actual changes are disjoint — this is the single biggest constraint on parallel topic authoring.

**Fix.** Extract the section map to a single shared file, e.g. `js/section-map.js` containing one `window.__MV_SECTION_MAP = {…}` assignment. Each topic page references it via `<script src="./js/section-map.js"></script>` instead of inlining. Adding a topic then touches ~3 files: `js/section-map.js` + the new topic + `index.html`. Idempotent, no per-page bytes change.

**Touches.** `scripts/inject-breadcrumb.mjs` (emit the shared file once, insert a small loader fence per page); `js/breadcrumb.js` (no change — still reads `window.__MV_SECTION_MAP`). Round-trip invariant preserved.

**Risk.** One-time large diff to migrate (every page loses its inline map and gains a loader). Subsequent PRs are tiny.

## Missing-topic candidates

The five Tier-1 catalog gaps (combinatorial optimization, math finance, optimal control, DT/GW, positive-characteristic AG) all shipped in PRs #173–#177. The "specialty" trio (TDA, mathematical chaos, computational molecular biology) shipped in PRs #180–#181. **The active candidate list is empty.** Re-prime it after the next Harvard / Princeton / MIT / Berkeley / Caltech catalog comparison.

Lone deferred item: **microlocal sheaves and $\mathcal{D}$-modules connections** — partially covered by `d-modules` + `microlocal-analysis`; standalone page only if the corpus pursues a deeper sheaf-theoretic-analysis direction.

**Mathematical biology stays under Probability & statistics** (user decision, 2026-05-12). Wright–Fisher / Moran / Kimura diffusion / Kingman coalescent dominate; Lotka–Volterra and replicator dynamics sit as a deterministic detour. The section question is closed.

## Quality audit — per-section pass

Systematic pedagogical-quality pass across the 190 topics. Per-topic dispatch is too expensive (190 agents); per-section batches (12 sections) are the right granularity. Each batch hands off to a `pedagogy-auditor` subagent that picks 2–3 representative topics in the section and cross-checks them against a reference topic for: notation drift, undefined jargon, tone mismatches, missing worked examples, unusual KaTeX macros. Findings collated under `audits/quality-pass-YYYY-MM.md`.

Cap at 5 concurrent agents (ethernet rule); 12 sections in 3 waves of ~4. Run after the section-map fix above so per-section recommendations don't collide with the migration diff.

## Authoring polish — small

- **Index-card thumb art.** First curation pass replaced the 12 weakest thumbs; new topic-batch PRs ship motif art on every new card. PR #169 cleared the 5 draft cards that had survived prior batches + the Kähler-geometry KaTeX-in-SVG thumb, and **promoted `audit-draft-index-cards.mjs` to a CI gate** so placeholder content can't ship again. Remaining surface is the pre-existing midbody (~15 cards that were judged already-strong but could still be sharpened).
- **Hoist semantic params out of verbatim slugs.** Roughly 405 per-widget verbatim slugs (was ~210 a few batches ago — count nearly doubled with the recent topic-add wave) share `widgets/_shared/verbatim-renderer.mjs` with opaque `bodyMarkup`/`bodyScript` strings. Migrating them to bespoke renderers with semantic params (slider ranges, color tokens, etc.) lets AJV validation and alt frontends actually inspect each widget. Worth doing in batches by topic — pick one whose widgets share a common gesture (slider + formula readout, click + reveal, etc.) and define a shared renderer that absorbs them all.
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

- **Hard-tier quiz authoring** (882 concepts lack hard tier).
- **Expert-tier authoring** (13 questions corpus-wide).

These are real coverage gaps but not where the user wants to spend time. Per-session feedback memory: lowest-leverage direction, structural/architectural improvements come first.

