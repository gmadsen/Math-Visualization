# Plan

Forward-looking priorities for the notebook. Daily-workflow commands, one-time setup, architecture, conventions, and the full quiz/progression/callback story all live in [`AGENTS.md`](./AGENTS.md) — especially § "Common pitfalls". Project overview is in [`README.md`](./README.md).

When something ships, delete its bullet here. The full step list of `rebuild.mjs` is in `scripts/rebuild.mjs` — refer to it rather than restating step names here.

## Corpus snapshot (2026-04-30)

From `audits/coverage-stats.md` and `audits/starter-concepts.md`:

- 130 topics, 896 concepts, 1538 prereq edges (647 cross-topic), 24 capstones
- 160 concepts lack a widget in their owning section
- ~250 widgets remain inline (registry-driven: 619+) — PCM-gap topics fully migrated; the remaining inline widgets are spread across ~40 non-PCM topics
- THIN-NEW count: 13; EMPTY-prereq count: 3 (`ant-prime-counting`, `e-definition`, `adjacency-and-laplacian`)
- Quiz tiers: v1 = 2587, hard = 1223, expert = 13 (intentionally bottom-of-list — see "Out of scope")

## Near-term tasks

- **Tier 1 tagging pass — coverage tail.** ~200 of the 575 (creative-improvements–era) concepts remain untagged. The tagging agent reached 62.8 % with quality > coverage; a focused follow-up on Modular forms / L-functions / capstones could close real gaps. Number is pre–PCM-gap; recount before resuming.
- **Inline-widget migration — wider corpus.** ~250 inline `widget` blocks (no `slug`) remain across ~40 non-PCM-gap topics. Mechanically similar to the just-finished PCM-gap promotion: run `scripts/repair-widget-scripts.mjs --topic <t>` if the scripts merged into `rawBodySuffix`, then `scripts/migrate-inline-widget.mjs <topic> <widgetId> <slug> --description ...` per widget. Each topic ~15 minutes with the helper. Lower priority than PCM-gap because these topics already render correctly; the migration is purely registry-coverage hygiene.
- **Math physics has no `hard` tier and Combinatorics has no `hard` tier.** 12 topics × ~6 concepts × 2-3 questions each = ~150 missing hard-tier questions. Per "Out of scope", de-prioritized — listed here so the gap is visible, not actioned.

## Authoring polish — small

- **Index-card thumb art.** `new-topic.mjs` leaves placeholder colored thumbs in `index.html`; could replace with motif-appropriate SVGs.

## Three.js / Pyodide / alt frontends (long-running)

- **Full-topic React frontend.** `examples/react-consumer/` renders one widget; next is rendering a whole topic from `content/<topic>.json` + the registry. Now that all 73 topics are JSON-source-of-truth, this becomes a clean target.
- **Three.js adoption decision.** `examples/threejs-prototype/` validates the ceiling-raise for 3D-heavy topics. Would converge with `surface-viewer`. Requires AGENTS.md amendment on dependency policy.
- **Inline code cells for live examples.** `inline-code-cell` is a Web Worker JS sandbox; could be extended to Pyodide for sieves / sympy demos at the cost of a ~10MB CDN load.

## Script audit — overlap to assess

50 scripts in `scripts/` after this session. Items still worth reviewing:

- **Candidates to merge or drop:** `audit-responsive.mjs` overlaps with `audit-accessibility.mjs`; `audit-notation.mjs`, `audit-worked-examples.mjs`, `audit-blurb-question-alignment.mjs` — low-usage, confirm signal value.
- **Consolidation candidates:** `validate-concepts.mjs` still reads `index.json` directly because the validator is the gate before the loader runs — circular dependency that's intentional, leave it. `audit-widget-interactivity.mjs` and `audit-cross-page-consistency.mjs` were migrated to `loadContentModel()`.

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

