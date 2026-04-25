# Plan

Forward-looking priorities for the notebook. Daily-workflow commands, one-time setup, architecture, conventions, and the full quiz/progression/callback story all live in [`AGENTS.md`](./AGENTS.md) — especially § "Common pitfalls". Project overview is in [`README.md`](./README.md).

When something ships, delete its bullet here. The full step list of `rebuild.mjs` is in `scripts/rebuild.mjs` — refer to it rather than restating step names here.

## Corpus snapshot (2026-04-25)

From `audits/coverage-stats.md`:

- 73 topics, 505 concepts, 459 widgets, 2690 quizzes
- Registry-driven widgets: 457 / 459 (99.6%)
- Quiz tiers: v1 = 1454, hard = 1223, **expert = 13** (still barely populated)
- 194 concepts lack a widget in their owning section
- 67 concepts lack a hard-tier quiz

The Algebra section grew from 5 → 13 topics this session (capstone arc + Kerodon Ch 5 fill); Algebraic geometry grew from 12 → 19 (Stacks-Project arc). 15 newly-authored topics still sit outside the source-of-truth flip — see "Architectural follow-ups" below.

## Architectural follow-ups (deferred but real)

These are blocking better authoring ergonomics; pick them up in the next non-content sprint.

- **`inject-*` ↔ JSON gap.** `inject-breadcrumb.mjs`, `inject-used-in-backlinks.mjs`, and `audit-callbacks.mjs --fix` write to HTML directly. Under the source-of-truth flip (2026-04-24), `test-roundtrip.mjs --fix` then overwrites HTML from JSON, clobbering whatever the injectors wrote. We mass-patched `__MV_SECTION_MAP` in 58 content/*.json three times this session (capstone scaffold, Stacks-Project scaffold, cocartesian-fibrations scaffold). The proper fix is to teach those injectors to update JSON's `rawHead` / `raw` blocks instead of HTML. Substantial refactor — touches each `inject-*` script.
- **`content/<slug>.json` migration for the 15 new topics.** They're HTML-only; `test-roundtrip.mjs` skips them. Run `node scripts/extract-topic.mjs <slug>` per topic to migrate. Memory: per-topic only, never wholesale (the corpus-wide form wipes slug substitutions). Each new topic uses inline widgets rather than the registry, so extraction is straightforward.
- **Cross-topic prereqs for the 15 new topics.** Intentionally empty in scaffolding because of the JSON-injection gap above. Each new concept whose prereq lives in another topic needs both the prereq edge AND the matching callback / backlink aside in the upstream/downstream JSONs. Worth doing once `inject-*` writes JSON natively.
- **Architectural fix: `inject-page-metadata.mjs`** has the same problem — writes HTML, not JSON. Same shape of fix.
- **`audit-doc-drift` heuristic noise.** The slug-name token-matching produces "shipped" false positives whenever a slug name appears in a commit subject (which is always, when adopting). Either scope the matcher to titles only, or move to an explicit-checked-in-PR mechanism.

## Near-term tasks

- **Hard-tier quiz pass over the 15 new topics.** 67 concepts corpus-wide lack hard tier; most are in the new topics where deep-author agents only covered the 2–4 deepest concepts per page.
- **Expert-tier authoring round.** Corpus has only 13 expert-tier questions total. One focused pass picking the 2 deepest concepts per topic would meaningfully grow this.
- **Migrate the 15 new topics to `content/<slug>.json`** via `extract-topic.mjs`, one topic at a time (memory: never wholesale).
- **Fix the `inject-*` ↔ JSON gap** so future scaffolds don't need the manual `__MV_SECTION_MAP` mass-patch (see Architectural follow-ups below).

## Authoring polish — small

- **`new-topic.mjs` should also append a README.md bullet** under the matching section. Currently a manual step (just done by hand for 15 topics; the scaffolder skipped this). Could also auto-update sections.json (currently scaffolder relies on user to add to sections.json).
- **`new-concept` scaffold** — adding a concept to an existing topic still means editing `concepts/<topic>.json`, the section in `<topic>.html`, the quiz bank, and re-extracting `content/<topic>.json`. A scaffold could do all four (`new-topic.mjs` and `new-widget.mjs` are the templates).
- **Index-card thumb art.** New-topic.mjs leaves placeholder colored thumbs in `index.html`; could replace with motif-appropriate SVGs.

## Content debt

- **67 concepts lack a hard-tier quiz** — most of them in the 15 new topics, where deep-author agents added hard tier only on the 2-4 deepest concepts per page. A focused pass to cover the rest is straightforward.
- **Expert tier at 13 across the entire corpus** — no new topic adds expert questions. Single dedicated round of "for each topic, pick its 2 deepest concepts and write expert-tier questions" would be high-value.
- **Cross-topic prereq edges** — once the architectural fix lands, the 15 new topics need real prereq wiring back into category-theory / schemes / etale-cohomology / homological / etc.

## Three.js / Pyodide / lighter prose-block authoring (long-running)

- **Full-topic React frontend.** `examples/react-consumer/` renders one widget; next is rendering a whole topic from `content/<topic>.json` + the registry. All 17 slugs should work since `renderMarkup` / `renderScript` are pure string functions.
- **Three.js adoption decision.** `examples/threejs-prototype/` validates the ceiling-raise for 3D-heavy topics. Would converge with `surface-viewer`. Requires AGENTS.md amendment on dependency policy.
- **Lighter prose-block authoring.** Now that `content/<topic>.json` is source of truth, prose blocks could move from raw HTML to mdx-lite. Needs reversibility for round-trip.
- **Inline code cells for live examples.** `inline-code-cell` is a Web Worker JS sandbox; could be extended to Pyodide for sieves / sympy demos at the cost of a ~10MB CDN load.

## Script audit — overlap to assess

47 scripts in `scripts/` (was 46 + `test-widget-renderers.mjs`). Non-consolidated ones still worth reviewing:

- **Candidates to merge or drop:** `audit-responsive.mjs` overlaps with `audit-accessibility.mjs`; `audit-notation.mjs`, `audit-worked-examples.mjs`, `audit-blurb-question-alignment.mjs` — low-usage, confirm signal value.
- **Consolidation candidates:** `validate-concepts.mjs`, `audit-widget-interactivity.mjs`, `audit-cross-page-consistency.mjs` all re-implement concept/topic loading. Could import `loadContentModel()`.

## NPM packages — candidates worth evaluating

- **`cheerio`** over `node-html-parser` — richer for DOM manipulation in `inject-*`/`fix-*` scripts.
- **`katex` as a dependency** — would let `validate-katex.mjs` do real rendering instead of heuristic checks.
- **`remark` + `rehype`** — if prose blocks ever convert to Markdown, the standard ecosystem.

## Shipped recently

Don't enumerate — see `git log --oneline -50`. The major arcs that landed this session: the widget unit-test framework + 7 novel widget slugs; 7 widget topic adoptions; 4 widget-promotion-to-dedicated-concepts; the capstone arc (6 topics: elementary-topos-theory through infinity-topoi); the Stacks-Project mini-arc + full arc (8 topics: derived-categories through algebraic-de-rham-cohomology); the Kerodon Ch 5 fill (cocartesian-fibrations); jsdom hydration + topic-boot tests + concept-LaTeX audit + pathway KaTeX rendering fix; browser verification of all 15 new topics + 7 widget-adopting topics on PR #32 (chrome MCP, all clean).
