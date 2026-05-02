# Plan

Forward-looking priorities for the notebook. Daily-workflow commands, one-time setup, architecture, conventions, and the full quiz/progression/callback story all live in [`AGENTS.md`](./AGENTS.md) — especially § "Common pitfalls". Project overview is in [`README.md`](./README.md).

When something ships, delete its bullet here. The full step list of `rebuild.mjs` is in `scripts/rebuild.mjs` — refer to it rather than restating step names here.

## Corpus snapshot (2026-04-30)

From `audits/coverage-stats.md` and `audits/starter-concepts.md`:

- 131 topics, 916 concepts, 1538 prereq edges (647 cross-topic), 24 capstones
- 160 concepts lack a widget in their owning section
- 0 inline widget blocks corpus-wide; 464 registry slugs (every `widget` block in `content/*.json` carries `slug + params`)
- THIN-NEW count: 13; EMPTY-prereq count: 3 (`ant-prime-counting`, `e-definition`, `adjacency-and-laplacian`)
- Quiz tiers: v1 = 2587, hard = 1223, expert = 13 (intentionally bottom-of-list — see "Out of scope")

## Shipped recently

This branch (`refactor/sidetoc-shared-and-hamiltonians-figure`, PR #45):

- **Sidetoc → shared `js/sidetoc.js`** (was inlined per topic page).
- **`hamiltonians-figure` shared slug** absorbing 6 per-widget `hamiltonians-*` slugs via `oneOf` over input control families.
- **Inline-widget migration corpus-wide.** 0 inline widget blocks remain (was ~250 across ~40 topics). 464 registry slugs total. 14 batches × 3 parallel agents.
- **`fix-a11y` JSON-side migration.** Patches now stick across rebuilds — 53 SVG titles + missing labels persist.
- **`audit-canvas-stub`** drift detection.
- **`migrate-inline-widget`** helper (handles 4 dialects: span/div ttl/hint, multi-line `.hd`, legacy `{html, script}`, leading-newline scripts).
- **`repair-widget-scripts --allow-drift`** for multi-IIFE-in-one-`<script>` topics.
- **Two audits migrated to `loadContentModel()`:** audit-widget-interactivity, audit-cross-page-consistency.
- **`new-topic.mjs` appends README bullet.**
- **`new-concept.mjs`** scaffolder.
- **`read-prose.mjs`** quality-pass tooling.
- **Tours card** on index.html alongside pathway banner.
- **Content materialization (audit-driven):** complex-analysis 8 chapters → 26 per-concept sections, galois 3 missing quiz placeholders added.
- **9 thin concepts expanded** (8 complex-analysis + 1 representation-theory) from <500 chars to 1100–1842 chars.
- **`advanced-complex-analysis` topic** in Analysis section: 8 grad concepts, ~22K chars (Picard little/great, Weierstrass factorization, Mittag-Leffler, Phragmén-Lindelöf, Hadamard 3-circles, Hardy spaces / Fatou boundary).
- **+12 grad concepts across 6 topics** (~24K chars): fixed-point-theorems (Caristi, KKM), wavelets (lifting, biorthogonal/CDF), information-theory (AEP, Fisher–Cramér-Rao), zeta-values (multiple-zeta, zeta-Mahler-measure), knot-polynomials (Vassiliev, Khovanov), p-adic-numbers (Newton polygons, ramification).
- **Stale-anchor cleanup** after complex-analysis materialization (24 callback `<li>` entries + 8 prose links).

## Near-term tasks

- **Tier 1 tagging pass — coverage tail.** ~200 of the 575 (creative-improvements–era) concepts remain untagged. The tagging agent reached 62.8 % with quality > coverage; a focused follow-up on Modular forms / L-functions / capstones could close real gaps. Number is pre–PCM-gap; recount before resuming.
- **Graduate complex analysis — missing concepts.** `complex-analysis` materialization (this session) split the 26 concepts into 26 sections, but the topic still lacks the standard graduate sequence: Picard's theorems (little + great), Weierstrass factorization, Mittag-Leffler, Phragmén-Lindelöf, Hadamard 3-circles/3-lines, Bloch's theorem, Hardy spaces / Fatou boundary, Bergman kernels, quasiconformal maps + Beltrami equation, several complex variables. Three repair shapes considered: fatten complex-analysis (~35 concepts, dense), new `advanced-complex-analysis` topic, or topic-cluster split (`picard-bloch`, `weierstrass-mittag-leffler`, `hardy-spaces`, `qc-and-beltrami`, `several-complex-variables`).
- **Math physics has no `hard` tier and Combinatorics has no `hard` tier.** 12 topics × ~6 concepts × 2-3 questions each = ~150 missing hard-tier questions. Per "Out of scope", de-prioritized — listed here so the gap is visible, not actioned.

## Authoring polish — small

- **Index-card thumb art.** `new-topic.mjs` leaves placeholder colored thumbs in `index.html`; could replace with motif-appropriate SVGs.

## Three.js / Pyodide / alt frontends (long-running)

- **Full-topic React frontend.** `examples/react-consumer/` renders one widget; next is rendering a whole topic from `content/<topic>.json` + the registry. Now that all 73 topics are JSON-source-of-truth, this becomes a clean target.
- **Three.js adoption decision.** `examples/threejs-prototype/` validates the ceiling-raise for 3D-heavy topics. Would converge with `surface-viewer`. Requires AGENTS.md amendment on dependency policy.
- **Inline code cells for live examples.** `inline-code-cell` is a Web Worker JS sandbox; could be extended to Pyodide for sieves / sympy demos at the cost of a ~10MB CDN load.

## Script audit — overlap to assess

50+ scripts in `scripts/` after this session. Items still worth reviewing:

- **Candidates to merge or drop:** `audit-responsive.mjs` overlaps with `audit-accessibility.mjs`; `audit-notation.mjs`, `audit-worked-examples.mjs`, `audit-blurb-question-alignment.mjs` — low-usage, confirm signal value.
- **Consolidation candidates:** `validate-concepts.mjs` still reads `index.json` directly because the validator is the gate before the loader runs — circular dependency that's intentional, leave it. `audit-widget-interactivity.mjs` and `audit-cross-page-consistency.mjs` were migrated to `loadContentModel()`.
- **Hoist depth-balanced div/section walkers into `lib/html-walk.mjs`.** `matchDivClose` (fix-a11y), `findScripts` (already in `lib/script-scan.mjs`), the section regex-fallback in audit-callbacks, and the inline div-balancers in `read-prose.mjs` + `audit-widget-interactivity.mjs` + `audit-utils.mjs` are subtly different copies of the same depth-balancing logic. One shared helper avoids future drift.
- **`splitMultiIife` (repair-widget-scripts.mjs) needs a fixture test.** The off-by-one fix in PR #45 commit a208609 shipped 6 broken bodyScripts before being caught; a small `scripts/test-*` fixture asserting the per-IIFE chunk contents would have surfaced it pre-merge.
- **Refactor `migrate-inline-widget.mjs` dialect dispatch into a declarative pipeline.** Today's 4 dialects (span/div ttl/hint, multi-line `.hd`, legacy `script` field, leading whitespace in legacy scripts) are handled by procedural cascade. A `extractWidgetShape(block, scriptBlock) → { title, hint, bodyMarkup, bodyScript, sectionComment, headerTag }` function with internal try-each-dialect would separate "what's the inline form" from "what gets written to disk."
- **Unify `fix-a11y` JSON-mode and HTML-mode pipelines.** The two parallel paths (JSON for topic pages with `content/<slug>.json`, HTML for landing/utility pages) build per-block deltas vs before/after counters in two places. A common `applyA11yToText(html, opts) → {newHtml, stats}` would halve the report-bookkeeping code.

## NPM packages — candidates worth evaluating

- **`cheerio`** over `node-html-parser` — richer for DOM manipulation in `inject-*`/`fix-*` scripts.
- **`katex` as a dependency** — would let `validate-katex.mjs` do real rendering instead of heuristic checks.

## Follow-ups from PR #36 / #37 review

Items raised by the review-team agents that were deferred at merge time. **All quiz/hint items here are de-prioritized per "Out of scope" until the user re-prioritizes.**

1. **Quiz type-variety on the new 27 topics.** 87% of v1 questions in PR #36 + PR #37 banks (~470 of 540) are `mcq` or `numeric`. Per the previous E1 batch (PR #35 phase 3i), replace ~3 questions per topic with `matching` / `multi-select` / `ordering` / `proof-completion` / `spot-the-error`.
2. **Hint coverage on the 14 hint-poor banks** (everything in PR #36 + #37 except `hamiltonians-classical-mechanics`).
3. **Trivia-as-question replacements.** A handful of v1 mcqs in PR #37 reduce to recall of a labeled fact (CdGP attribution, HMS history, LIGO strain, Cheeger Riemannian provenance). Quiz-review agent flagged them at comment 4183109392; rewrite to test the underlying concept.
4. **Blurb undercoverage instances.** `cnt-modular-arithmetic-algorithms` (only one of three blurb pillars tested), `ms-mle` (asymptotic normality / score equation untested despite being in the blurb). Quiz-review comment 4183111160.
5. **KaTeX macro-loader expansion.** Notation reviewer flagged `\Re`, `\vol`, `\End` as candidates that just crossed the threshold where defining once in the loader pays off. Currently rendering correctly via `\mathrm{...}` so cosmetic, not a bug.

## Out of scope

Items the user has explicitly de-prioritized. **Don't suggest these as "what next" without prompting.**

- **Hard-tier quiz authoring** (67 concepts lack hard tier).
- **Expert-tier authoring** (13 questions corpus-wide).

These are real coverage gaps but not where the user wants to spend time. Per-session feedback memory: lowest-leverage direction, structural/architectural improvements come first.

