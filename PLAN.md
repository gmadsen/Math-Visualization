# Plan

Forward-looking priorities for the notebook. Daily-workflow commands, one-time setup, architecture, conventions, and the full quiz/progression/callback story all live in [`AGENTS.md`](./AGENTS.md) — especially § "Common pitfalls". Project overview is in [`README.md`](./README.md).

When something ships, delete its bullet here. The full step list of `rebuild.mjs` is in `scripts/rebuild.mjs` — refer to it rather than restating step names here.

## Corpus snapshot (2026-04-25)

From `audits/coverage-stats.md` and `audits/starter-concepts.md`:

- 73 topics, 506 concepts, 812 prereq edges (315 cross-topic), 23 capstones
- Per-section density (cross-out per concept): Foundations 0.00, Algebra 0.115, Analysis 0.119, Geometry & topology 0.122, Number theory 0.263, Algebraic geometry 0.385, Modular forms & L-functions 0.549
- 100 concepts lack a widget in their owning section
- THIN-NEW count: 13 (down from 40 across the prereq passes)
- Quiz tiers: v1 = 1454, hard = 1223, expert = 13 (intentionally bottom-of-list — see "Out of scope")

## Open on this branch: creative-improvements arc

After PR #33 merged, the next initiative is a wide creative-improvements push spanning content, interaction, and home-page surface. Each item below is in scope by default; nothing here is pre-deferred. The work splits into three tiers (foundation → parallel authoring → home-page surface).

- **Tier 0 / tag vocabulary** — `concepts/tags.json` introduces 15 cross-topic themes (duality, compactness, functoriality, universal-property, exact-sequence, cohomology, fibration, descent, moduli, lifting, finiteness, group-action, completion, classification, foundation). `validate-concepts.mjs` enforces `tags ⊂ vocabulary`.
- **Tier 0 / home-page polish (CSS)** — card hover lift bumped to −4px with accent-tinted shadow per `.y/.b/.p/.g/.c/.v`; section-jump bar made `position:sticky` with an `IntersectionObserver`-driven `.stuck` accent.
- **Tier 1 / Combinatorics & Graph Theory** — register section #8 in `concepts/sections.json` atomically with the first topic; author 5 anchors: `spectral-graph-theory`, `matroid-theory`, `probabilistic-method`, `extremal-combinatorics`, `simplicial-complexes-combinatorial`.
- **Tier 1 / new widget-registry entries** — `branching-proof-scrubber` (proof tree with branch-pick gestures), `diagram-editor` (drag-arrows-and-watch-properties), `julia-playground` (zoomable parameter explorer). Adopt each in 1–2 topic pages after authoring.
- **Tier 1 / filler topics in existing sections** — `heights-arithmetic-geometry`, `group-cohomology`, `sobolev-spaces-distributions`, `harmonic-analysis-fourier`, `automorphic-forms-adelic`.
- **Tier 1 / tagging pass** — methodical single-agent sweep over the 76 existing `concepts/*.json`, drawing only from the controlled vocabulary; 70%+ coverage target, with no obligation to tag every concept.
- **Tier 2 / hero live widget** — replace the static tagline on `index.html` with an interactive parametric curve or trimmed `julia-playground`; theme-aware, mobile-responsive, no extra HTTP.
- **Tier 2 / "Today's concept" rail** — under the pathway banner, surface a date-seeded ready-to-master concept (mastered prereqs, not yet attempted) plus a "continue where you left off" pin from `MVProgress`. Curated default for cold visitors.
- **Tier 2 / `tags.html` explorer page** — sister to `mindmap.html`; lists the vocabulary with concept counts and per-tag concept lists. Linked from the index hero ("Browse by theme").
- **Tier 2 / remaining polish** — mastery rings on section headers, skeleton loaders for "recently updated", breadcrumb chip from anywhere, `.progbtn` reveal-on-hover.

Parallelization protocol: cap at 3 concurrent agents, group by disjoint files (e.g. one agent per topic), commit checkpoint between batches. Branch will not open as a PR until the user confirms the surface is ready.

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

- **100% widget registry adoption.** 118 inline (slug-less) widgets across 18 topics promoted to bespoke `widgets/<slug>/` directories — schema + index.mjs + README per slug. Corpus is now 563 widget blocks / 135 unique slugs / 1104 AJV-validated params, 0 inline. Pattern: passthrough `renderMarkup` / `renderScript` over opaque `bodyMarkup` / `bodyScript` artifact strings (mirroring surface-viewer's `bare` interaction). Future passes can refine specific widgets toward structured params where data shape is regular.
- **Mindmap** (`mindmap.html`): force-clustered concept-graph view of all 506 concepts with per-section stats, focus mode (k-hop undirected by default; "full chain" toggle for the upstream transitive closure), gap-list with click + keyboard activation, URL-persisted focus, a11y, jsdom test, print stylesheet, friendly error banner, light-theme overlays, mobile responsiveness (`@media (max-width:720px)` switches stage to viewport-relative height, lets toolbar wrap).
- **`json-block-writer`**: source-of-truth-respecting equivalent of `html-injector`. Phase-2b refactor: `audit-callbacks --fix`, `inject-used-in-backlinks --fix`, `inject-breadcrumb --fix`, `inject-page-metadata --fix` all write to `content/<topic>.json` instead of HTML. Hardening: `upsertFencedBlock` auto-explodes co-mingled host blocks instead of silent wholesale-replace; `blockHasFence` uses an anchored regex; `updateCss(doc, fenceName, cssText)` for fenced CSS rule updates with malformed-fence detection. 68-assertion test suite (was 31).
- **All 73 topics now JSON-source-of-truth** (15-topic migration via `extract-topic.mjs`).
- **80+ cross-topic prereq edges added** across multiple passes. Cross-topic edge count: 224 → 315. EMPTY-prereq advanced concepts: 7 → 0. THIN-NEW: 40 → 13.
- **`audit-callbacks` consumer cleanup + Pass-4 partial drift.** `replaceFencedCallbackInPlace` and `inject-used-in-backlinks.explodeFencedBacklinks` removed (auto-explode in `upsertFencedBlock` covers the same case). Pass 4b detects per-href stale callback links a section carries among valid ones. CSS-fence migration: the `aside.callback` rule moved into a fenced `callback-css-auto` block managed by `updateCss`. 73 topics one-shot migrated; subsequent runs idempotent.
- **`audit-callbacks` additive regenerator** (earlier pass): existing aside `<li>` items (prereq-derived OR hand-authored "See also" prose) preserved verbatim across canonical regen. Stale-aside + per-section fidelity warnings on malformed `<li>`.
- **`audit-cross-topic-prereqs` confidence scoring.** Suggestions now carry `high` / `medium` / `low` labels. HIGH = matched phrase in source's blurb OR in a sentence with dependency-defining verb. `--min-confidence` flag filters output. `EXPLICIT_REJECTS` map records 10 semantic FPs where the surface match is misleading (Liouville's theorem in dynamics ≠ in complex analysis; etc.). Plus reverse-direction cycle suppression: if target depends on source transitively, don't suggest source → target. Output banded by tier.
- **`audit-doc-drift` verbatim-substring heuristic.** Old slug-name token-matching produced 8 false positives. New rule scans PLAN.md "Shipped recently" for the *exact* commit subject line. 0 false positives.
- **`audit-starter-concepts.mjs`**: new advisory step in rebuild's chain. Surfaces empty-prereq regressions, writes per-section density snapshot to `audits/starter-concepts.md`, warns on topics missing from sections.json.
- **`scripts/lib/section-stats.mjs`**: single source of truth for per-section concept/intra/cross-out/cross-in/density. mindmap.html reads precomputed `__MVConcepts.sectionStats`; audit-starter-concepts and audit-bundle-staleness use the lib directly.
- **`concepts/index.json`: data-driven `levels` + `newArc`.** Topic-difficulty as data (`prereq` / `standard` / `advanced` / `capstone`). `newArc` lists topics scaffolded recently with thin / known-incomplete cross-topic prereqs (drives audit-starter-concepts' THIN-NEW pass; meant to shrink to zero). Both live in the bundle; `validate-concepts.mjs` enforces drift detection in either direction; `audit-bundle-staleness.mjs` verifies `levels` + `newArc` + `sectionStats` + `sections` keys match.
- **`audit-cross-page-consistency` SPECIAL extension.** Six gaps were false positives for pages that legitimately deviate from the topic-page contract (mindmap, search, widgets, capstone story pages). SPECIAL set extended to skip them; 0 gaps now.
- **`pathway.html` / mindmap section coloring** now derived from bundled `concepts/sections.json` instead of inline maps that drifted from the corpus.
- **`artinian-local-ca` concept** authored under commutative-algebra (Akizuki–Hopkins, Artinian-local structure theorem, dual-numbers / fat-point / non-curvilinear test rings). `deformation-functor.prereqs`: `primes-maximals-ca` → `artinian-local-ca`.
- **Display-prefs icons** (`js/display-prefs.js`): replaced `🔧/❓/🌳` emoji glyphs with inline SVGs (the deciduous tree wasn't rendering on systems without a color emoji font; theme-aware via `currentColor`).
- **Bug fixes**: `katex-select` optgroup preservation + popup keyboard nav (real DOM focus, not just visual class) + light-theme overlays no longer invisible on white panel; breadcrumb HTML-entity decoding (`Adèles &amp; idèles` → `Adèles & idèles`); README ∞ unicode in two link texts where GitHub MathJax-in-link-text fails; `inject-used-in-backlinks.parentSectionIdFor` regex anchoring (no `id="paths"` ↔ `id="paths-derived"` collision); error-banner `[hidden]` rule preventing the SVG from being covered.
- **Two reviewer-batch passes**: 39 line-comment threads (25 first-pass + 14 second-pass) all addressed and resolved on the PR; ~5 acknowledged-with-rationale (architectural items deferred with explicit follow-up plans).
