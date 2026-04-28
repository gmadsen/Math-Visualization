# Plan

Forward-looking priorities for the notebook. Daily-workflow commands, one-time setup, architecture, conventions, and the full quiz/progression/callback story all live in [`AGENTS.md`](./AGENTS.md) — especially § "Common pitfalls". Project overview is in [`README.md`](./README.md).

When something ships, delete its bullet here. The full step list of `rebuild.mjs` is in `scripts/rebuild.mjs` — refer to it rather than restating step names here.

## Corpus snapshot (2026-04-27)

From `audits/coverage-stats.md` and `audits/starter-concepts.md`:

- 130 topics, 873 concepts, 1538 prereq edges (647 cross-topic), 24 capstones
- 160 concepts lack a widget in their owning section
- 306 widgets remain inline (registry-driven: 568) — concentrated in PCM-gap topics (math physics + combinatorics)
- THIN-NEW count: 13; EMPTY-prereq count: 3 (`ant-prime-counting`, `e-definition`, `adjacency-and-laplacian`)
- Quiz tiers: v1 = 2550, hard = 1223, expert = 13 (intentionally bottom-of-list — see "Out of scope")

## Near-term tasks

- **Tier 1 tagging pass — coverage tail.** ~200 of the 575 (creative-improvements–era) concepts remain untagged. The tagging agent reached 62.8 % with quality > coverage; a focused follow-up on Modular forms / L-functions / capstones could close real gaps. Number is pre–PCM-gap; recount before resuming.
- **PCM-gap topic widget structure.** All 12 PCM-gap-batch topics (4 math physics + 8 combinatorics) ship widgets that render fine, but they are stored as inline `<div class="widget">` inside `raw` blocks (math physics) or as `widget` blocks without a `slug` (combinatorics). Coverage audit reports them as "0 registry-driven". Promotion to bespoke `widgets/<slug>/` entries (passthrough `bodyMarkup` / `bodyScript`, mirroring the prior 18-topic batch) would close the report. No user-visible change.
- **Math physics has no `hard` tier and Combinatorics has no `hard` tier.** 12 topics × ~6 concepts × 2-3 questions each = ~150 missing hard-tier questions. Per "Out of scope", de-prioritized — listed here so the gap is visible, not actioned.

## Authoring polish — small

- **`new-topic.mjs` should also append a README.md bullet** under the matching section. Currently manual.
- **`new-concept` scaffold** — adding a concept to an existing topic still means editing `concepts/<topic>.json`, the section in `<topic>.html`, the quiz bank, and re-extracting `content/<topic>.json`. A scaffold could do all four.
- **Index-card thumb art.** `new-topic.mjs` leaves placeholder colored thumbs in `index.html`; could replace with motif-appropriate SVGs.
- **`read-prose <topic> [<concept-id>]` CLI.** Quality-pass tooling: returns just the `raw` blocks for a topic (or one concept's section), stripping widget SVG/script and quiz placeholders. ~50 lines on top of `loadContentModel`. Companion: split `extract-topic.mjs` `raw` blocks on `<h2>`/`<p>` boundaries for paragraph-level Edit targets without full-file reads. Lever for cross-topic style/notation passes where SVG/script bytes are noise.

## Three.js / Pyodide / alt frontends (long-running)

- **Full-topic React frontend.** `examples/react-consumer/` renders one widget; next is rendering a whole topic from `content/<topic>.json` + the registry. Now that all 73 topics are JSON-source-of-truth, this becomes a clean target.
- **Three.js adoption decision.** `examples/threejs-prototype/` validates the ceiling-raise for 3D-heavy topics. Would converge with `surface-viewer`. Requires AGENTS.md amendment on dependency policy.
- **Inline code cells for live examples.** `inline-code-cell` is a Web Worker JS sandbox; could be extended to Pyodide for sieves / sympy demos at the cost of a ~10MB CDN load.

## Script audit — overlap to assess

50 scripts in `scripts/` after this session. Items still worth reviewing:

- **Candidates to merge or drop:** `audit-responsive.mjs` overlaps with `audit-accessibility.mjs`; `audit-notation.mjs`, `audit-worked-examples.mjs`, `audit-blurb-question-alignment.mjs` — low-usage, confirm signal value.
- **Consolidation candidates:** `validate-concepts.mjs`, `audit-widget-interactivity.mjs`, `audit-cross-page-consistency.mjs` all re-implement concept/topic loading. Could import `loadContentModel()`. Note `validate-concepts` reads `index.json` directly because the validator is the gate before the loader runs — circular dependency that's intentional.

## NPM packages — candidates worth evaluating

- **`cheerio`** over `node-html-parser` — richer for DOM manipulation in `inject-*`/`fix-*` scripts.
- **`katex` as a dependency** — would let `validate-katex.mjs` do real rendering instead of heuristic checks.

## Follow-ups from PR #36 / #37 review

Items raised by the review-team agents that were deferred at merge time. **#1 is a real bug, the rest are quality gaps.**

1. **Orphan `<label>` a11y, corpus-wide pass.** PR #37 reviewer flagged unwrapped/unassociated `<label>` elements in `expanders.html` (and the same pattern recurs across many widget pages). Screen readers can't announce these controls. Wire every orphan `<label>` to its sibling `<input>`/`<select>` via `for=` attribute or wrap-the-control. Audit candidate: a one-shot script that finds all `<label>` without `for=` and not wrapping a control, then auto-fixes by matching to the nearest sibling.
2. **Quiz type-variety on the new 27 topics.** 87% of v1 questions in PR #36 + PR #37 banks (~470 of 540) are `mcq` or `numeric`. Per the previous E1 batch (PR #35 phase 3i), replace ~3 questions per topic with `matching` / `multi-select` / `ordering` / `proof-completion` / `spot-the-error`. Lever: `audit-blurb-question-alignment` plus the existing per-type schemas in `schemas/quiz-bank.schema.json`.
3. **Hint coverage on the 14 hint-poor banks** (everything in PR #36 + #37 except `hamiltonians-classical-mechanics`, which the agent authored with hints). Auto-derive from `explain` field's first sentence, the same way the A3 batch in PR #35 did. Drop hints that are byte-identical to the explain fallback (per the quiz-review agent's comment 4183105888).
4. **Trivia-as-question replacements.** A handful of v1 mcqs in PR #37 reduce to recall of a labeled fact (CdGP attribution, HMS history, LIGO strain, Cheeger Riemannian provenance). Quiz-review agent flagged them at comment 4183109392; rewrite to test the underlying concept.
5. **Blurb undercoverage instances.** `cnt-modular-arithmetic-algorithms` (only one of three blurb pillars tested), `ms-mle` (asymptotic normality / score equation untested despite being in the blurb). Quiz-review comment 4183111160.
6. **KaTeX macro-loader expansion.** Notation reviewer flagged `\Re`, `\vol`, `\End` as candidates that just crossed the threshold where defining once in the loader pays off. Currently rendering correctly via `\mathrm{...}` so cosmetic, not a bug.

## Out of scope

Items the user has explicitly de-prioritized. **Don't suggest these as "what next" without prompting.**

- **Hard-tier quiz authoring** (67 concepts lack hard tier).
- **Expert-tier authoring** (13 questions corpus-wide).

These are real coverage gaps but not where the user wants to spend time. Per-session feedback memory: lowest-leverage direction, structural/architectural improvements come first.

