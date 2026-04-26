# Plan

Forward-looking priorities for the notebook. Daily-workflow commands, one-time setup, architecture, conventions, and the full quiz/progression/callback story all live in [`AGENTS.md`](./AGENTS.md) — especially § "Common pitfalls". Project overview is in [`README.md`](./README.md).

When something ships, delete its bullet here. The full step list of `rebuild.mjs` is in `scripts/rebuild.mjs` — refer to it rather than restating step names here.

## Corpus snapshot (2026-04-25)

From `audits/coverage-stats.md` and `audits/starter-concepts.md`:

- 73 topics, 505 concepts, 798 prereq edges (303 cross-topic), 23 capstones
- Per-section density (cross-out per concept): Foundations 0.00, Algebra 0.115, Analysis 0.119, Geometry & topology 0.122, Number theory 0.263, Algebraic geometry 0.385, Modular forms & L-functions 0.549
- 100 concepts lack a widget in their owning section
- THIN-NEW count: 18 (down from 40 across the prereq passes)
- Quiz tiers: v1 = 1454, hard = 1223, expert = 13 (intentionally bottom-of-list — see "Out of scope")

## Architectural follow-ups

Substantial items that aren't blocking anything immediate but should land when their leverage moment arrives.

- **`audit-callbacks` consumer cleanup.** Now that `upsertFencedBlock` auto-explodes co-mingled fences (commit `8cf323c`), `audit-callbacks.replaceFencedCallbackInPlace` and `inject-used-in-backlinks.explodeFencedBacklinks` are redundant — both work around the prior wholesale-replace footgun. Migrating consumers to plain `upsertFencedBlock` simplifies the JSON-mutation paths and makes `audit-callbacks` Pass 2 a one-liner. Same applies to the hand-positioned CSS splice in `audit-callbacks` lines ~600-614 — should move to `updateCss(doc, 'callback-css', CALLBACK_CSS_RULE)` once a fence wraps the existing rule.
- **`NEW_ARC_TOPICS` static list still hardcoded.** `concepts/index.json` `levels` is now the single source of truth for prereq/standard/advanced/capstone, but `NEW_ARC_TOPICS` is a separate "scaffolded recently with thin cross-topic prereqs" property that doesn't derive cleanly from `level`. Two paths: (a) add a `newArc: true` field per-topic in `index.json` once the THIN-NEW backfill is far enough along that the static set can shrink to zero, or (b) replace the THIN-NEW filter with an algorithmic threshold (e.g. cross-out density below 0.05). Decide once THIN-NEW count drops further (currently 18).
- **`audit-callbacks` Pass-4 partial-drift detection.** The current stale-aside warning catches whole-section drift (every prereq for a section was removed) but not partial drift (a section's aside lists one stale href among several still-valid ones). Detecting partial requires walking each `<li>` href and cross-checking against the per-concept prereq set; substantial code that mostly catches drift the human curator already sees in the rebuild diff. Filing as future work.
- **Author `artinian-local-ca` concept.** `deformation-functor`'s blurb requires an Artinian local ring concept that doesn't exist; the current prereq is `primes-maximals-ca` (which mentions Artinian in passing). A small dedicated concept under `commutative-algebra` would fit honestly. Same shape of issue exists elsewhere — when content review flags "right direction but wrong upstream concept," the right fix is sometimes to author the missing upstream rather than wire to an approximate one.
- **`audit-doc-drift` heuristic noise.** The slug-name token-matching produces "shipped" false positives whenever a slug name appears in a commit subject. Either scope the matcher to titles only, or move to an explicit-checked-in-PR mechanism. Cosmetic for now — exits 0 either way.
- **Inline-widget topics.** The 15 topics migrated this session use inline widgets rather than the `widgets/<slug>/` registry. They render fine but don't get schema validation or React-side rendering parity. Migration would mean adding a registry entry per inline widget; substantial but low-urgency.
- **`audit-cross-topic-prereqs.mjs` heuristic.** Surface-form prose matching produces good leads but also false positives (e.g. "topological spaces" → `open-sets`). Could augment with a lightweight semantic-similarity pass against concept titles, or just move to a curated allow-list per topic.

## Near-term tasks

- **THIN-NEW pass three** — `audit-starter-concepts` flags 18 new-arc concepts whose prereqs all stay intra-topic. Most are transitively connected via siblings; a short focused sweep on the strongest candidates remains.
- **Section-stats density follow-up** — Algebra is at 0.115 cross-out density, the lowest of any non-foundation section. Most legitimate cross-section deps are wired; pushing further would invent dependencies. The `audit-cross-page-consistency` audit may still surface real gaps worth wiring.
- **Mindmap mobile** — fixed stage height (820px) and toolbar wrapping are unverified on small screens. Touch pan/zoom untested. Lower priority than this branch's a11y pass; not blocking the PR.

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

## Out of scope

Items the user has explicitly de-prioritized. **Don't suggest these as "what next" without prompting.**

- **Hard-tier quiz authoring** (67 concepts lack hard tier).
- **Expert-tier authoring** (13 questions corpus-wide).

These are real coverage gaps but not where the user wants to spend time. Per-session feedback memory: lowest-leverage direction, structural/architectural improvements come first.

## Shipped recently

Don't enumerate — see `git log --oneline -50`. Major arcs landed in the current branch (`feat/concept-graph-improvements`):

- **Mindmap** (`mindmap.html`): force-clustered concept-graph view of all 505 concepts with per-section stats, focus mode (k-hop undirected by default; "full chain" toggle for the upstream transitive closure), gap-list with click + keyboard activation, URL-persisted focus, a11y, jsdom test, print stylesheet, friendly error banner, light-theme overlays.
- **`json-block-writer`**: source-of-truth-respecting equivalent of `html-injector`. Phase-2b refactor: `audit-callbacks --fix`, `inject-used-in-backlinks --fix`, `inject-breadcrumb --fix`, `inject-page-metadata --fix` all write to `content/<topic>.json` instead of HTML. Hardening pass added: `upsertFencedBlock` auto-explodes co-mingled host blocks instead of silent wholesale-replace; `blockHasFence` uses an anchored regex (no false-positive on encoded fence prose); new `updateCss(doc, fenceName, cssText)` for fenced CSS rule updates with malformed-fence detection. 68-assertion test suite (was 31).
- **All 73 topics now JSON-source-of-truth** (15-topic migration via `extract-topic.mjs`).
- **70+ cross-topic prereq edges added** across multiple passes. Cross-topic edge count: 224 → 303. EMPTY-prereq advanced concepts: 7 → 0. THIN-NEW: 40 → 18.
- **`audit-callbacks` additive regenerator**: existing aside `<li>` items (prereq-derived OR hand-authored "See also" with prose) are preserved verbatim across canonical regen. The first 15-topic migration silently destroyed 32 prose-bearing asides across 10 topics; restored from pre-migration HTML, and the additive logic prevents recurrence. Plus stale-aside warning + per-section fidelity warnings on malformed `<li>`.
- **`audit-starter-concepts.mjs`**: new advisory step in rebuild's chain. Surfaces empty-prereq regressions, writes per-section density snapshot to `audits/starter-concepts.md`, warns on topics missing from sections.json.
- **`scripts/lib/section-stats.mjs`**: single source of truth for per-section concept/intra/cross-out/cross-in/density. mindmap.html reads precomputed `__MVConcepts.sectionStats`; audit-starter-concepts and audit-bundle-staleness use the lib directly.
- **`concepts/index.json` `levels` map**: topic-difficulty as data. Single source of truth shared across pathway.html, mindmap.html, audit-starter-concepts. `validate-concepts.mjs` enforces drift detection. `audit-bundle-staleness.mjs` extended to verify `levels` + `sectionStats` + `sections` keys in the bundle match the source-of-truth derivation.
- **`pathway.html` / mindmap section coloring** now derived from bundled `concepts/sections.json` instead of inline maps that drifted from the corpus.
- **Display-prefs icons** (`js/display-prefs.js`): replaced `🔧/❓/🌳` emoji glyphs with inline SVGs (the deciduous tree wasn't rendering on systems without a color emoji font; fix is bulletproof, theme-aware via `currentColor`).
- **Bug fixes**: `katex-select` optgroup preservation + popup keyboard nav (real DOM focus, not just visual class) + light-theme overlays no longer invisible on white panel; breadcrumb HTML-entity decoding (`Adèles &amp; idèles` → `Adèles & idèles`); README ∞ unicode in two link texts where GitHub MathJax-in-link-text fails; `inject-used-in-backlinks.parentSectionIdFor` regex anchoring (no `id="paths"` ↔ `id="paths-derived"` collision); error-banner `[hidden]` rule preventing the SVG from being covered.
- **Two reviewer-batch passes**: 39 line-comment threads (25 first-pass + 14 second-pass) all addressed and resolved on the PR; ~5 acknowledged-with-rationale (architectural items deferred with explicit follow-up plans).
