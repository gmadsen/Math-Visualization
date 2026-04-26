# Plan

Forward-looking priorities for the notebook. Daily-workflow commands, one-time setup, architecture, conventions, and the full quiz/progression/callback story all live in [`AGENTS.md`](./AGENTS.md) — especially § "Common pitfalls". Project overview is in [`README.md`](./README.md).

When something ships, delete its bullet here. The full step list of `rebuild.mjs` is in `scripts/rebuild.mjs` — refer to it rather than restating step names here.

## Corpus snapshot (2026-04-25)

From `audits/coverage-stats.md` and `audits/starter-concepts.md`:

- 73 topics, 505 concepts, ~770 prereq edges (~275 cross-topic), 23 capstones
- Per-section density (cross-out per concept): Foundations 0.00, Algebra 0.124, Analysis 0.119, Geometry & topology 0.122, Number theory 0.263, Algebraic geometry 0.385, Modular forms & L-functions 0.549
- 100 concepts lack a widget in their owning section
- Quiz tiers: v1 = 1454, hard = 1223, expert = 13 (intentionally bottom-of-list — see "Out of scope")

## Architectural follow-ups

Substantial items that aren't blocking anything immediate but should land when their leverage moment arrives.

- **`audit-doc-drift` heuristic noise.** The slug-name token-matching produces "shipped" false positives whenever a slug name appears in a commit subject. Either scope the matcher to titles only, or move to an explicit-checked-in-PR mechanism. Cosmetic for now — exits 0 either way.
- **Inline-widget topics.** The 15 topics migrated this session use inline widgets rather than the `widgets/<slug>/` registry. They render fine but don't get schema validation or React-side rendering parity. Migration would mean adding a registry entry per inline widget; substantial but low-urgency.
- **`audit-cross-topic-prereqs.mjs` heuristic.** Surface-form prose matching produces good leads but also false positives (e.g. "topological spaces" → `open-sets`). Could augment with a lightweight semantic-similarity pass against concept titles, or just move to a curated allow-list per topic.

## Near-term tasks

- **THIN-NEW pass three** — `audit-starter-concepts` currently flags 19 new-arc concepts whose `prereqs` all stay intra-topic. Most are transitively connected via siblings; the ~5 that aren't are worth a focused sweep.
- **Section-stats density follow-up** — Algebra is at 0.124 cross-out density, the lowest of any non-foundation section. Most legitimate cross-section deps are now wired (5 added this session); pushing further would invent dependencies. But the related `cross-page-consistency` audit may still surface real gaps.
- **Mindmap mobile** — fixed stage height (820px) and toolbar wrapping are unverified on small screens. Touch pan/zoom untested. Lower priority than this branch's a11y pass.
- **Mindmap polish round 3 (optional)** — search history, persisted filter state via URL, an in-browser "next THIN-NEW concept" cycle button to walk through audit results visually.

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

48 scripts in `scripts/` after this session (added `audit-starter-concepts`, `lib/json-block-writer`, `test-json-block-writer`). Items still worth reviewing:

- **Candidates to merge or drop:** `audit-responsive.mjs` overlaps with `audit-accessibility.mjs`; `audit-notation.mjs`, `audit-worked-examples.mjs`, `audit-blurb-question-alignment.mjs` — low-usage, confirm signal value.
- **Consolidation candidates:** `validate-concepts.mjs`, `audit-widget-interactivity.mjs`, `audit-cross-page-consistency.mjs` all re-implement concept/topic loading. Could import `loadContentModel()`.

## NPM packages — candidates worth evaluating

- **`cheerio`** over `node-html-parser` — richer for DOM manipulation in `inject-*`/`fix-*` scripts.
- **`katex` as a dependency** — would let `validate-katex.mjs` do real rendering instead of heuristic checks.

## Out of scope

Items the user has explicitly de-prioritized. **Don't suggest these as "what next" without prompting.**

- **Hard-tier quiz authoring** (67 concepts lack hard tier).
- **Expert-tier authoring** (13 questions corpus-wide).

These are real coverage gaps but not where the user wants to spend time. Per-session feedback memory: lowest-leverage direction, structural/architectural improvements come first.

## Shipped recently

Don't enumerate — see `git log --oneline -50`. Major arcs landed in the current branch (`feat/concept-graph-improvements`):

- **Mindmap** (`mindmap.html`): force-clustered concept-graph view of all 505 concepts with per-section stats, focus mode, gap-list, URL-persisted focus, a11y, jsdom test, print stylesheet.
- **`json-block-writer`**: source-of-truth-respecting equivalent of `html-injector`. Phase-2b refactor: `audit-callbacks --fix`, `inject-used-in-backlinks --fix`, `inject-breadcrumb --fix`, `inject-page-metadata --fix` all now write to `content/<topic>.json`.
- **All 73 topics now JSON-source-of-truth** (15-topic migration via `extract-topic.mjs`).
- **66+ cross-topic prereq edges added** across three passes (10 orphan-topic pass + 14 THIN-NEW first pass + 7 second pass + 5 Algebra-density pass + 7 EMPTY starter fixes + 14 phase-3 prereqs). Cross-topic edge count: 224 → ~275.
- **`audit-starter-concepts.mjs`**: new advisory step in rebuild's chain. Surfaces empty-prereq regressions and writes a per-section density snapshot to `audits/starter-concepts.md`.
- **`pathway.html` / mindmap section coloring** now derived from bundled `concepts/sections.json` instead of inline maps that drifted from the corpus.
- **Bug fixes**: `katex-select` optgroup preservation; breadcrumb HTML-entity decoding (`Adèles &amp; idèles` → `Adèles & idèles`); README ∞ unicode in two link texts where GitHub MathJax-in-link-text fails.
