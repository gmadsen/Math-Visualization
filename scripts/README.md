# scripts/

Node-based helpers for the notebook. All scripts are vanilla ESM (`.mjs`), Node ≥ 20. Run from the repo root. Runtime of the shipped site depends on **zero** of these; the only build-time npm deps live in `scripts/package.json` (`ajv`, `ajv-formats`, `node-html-parser`).

## One CLI, many tools

[`scripts/cli.mjs`](./cli.mjs) is a single entry point that routes to any script by its filename-as-space-separated-command. The individual `.mjs` files remain directly callable; the CLI is an ergonomic front door.

```bash
node scripts/cli.mjs                          # list all commands
node scripts/cli.mjs rebuild --no-fix         # → scripts/rebuild.mjs
node scripts/cli.mjs audit backlinks          # → scripts/audit-backlinks.mjs
node scripts/cli.mjs validate concepts        # → scripts/validate-concepts.mjs
node scripts/cli.mjs inject breadcrumb --fix  # → scripts/inject-breadcrumb.mjs
node scripts/cli.mjs render topic category-theory > /tmp/out.html
```

Longest-prefix match, so multi-word names work either `inject used-in-backlinks` or `inject used in backlinks`. Trailing args after the script name get passed through unchanged.

## Orchestration

[`rebuild.mjs`](./rebuild.mjs) runs the full 18-step chain. `--no-fix` mirrors CI; `--only <step>` runs one step. It invokes the individual scripts directly (not through `cli.mjs`) so no CLI dependency is forced on CI.

## Builders (derived files)

| Script | What it does |
|---|---|
| [`build-concepts-bundle.mjs`](./build-concepts-bundle.mjs) | `concepts/*.json` → `concepts/bundle.js` for `file://` use. |
| [`build-quizzes-bundle.mjs`](./build-quizzes-bundle.mjs) | `quizzes/*.json` → `quizzes/bundle.js`. |
| [`build-widgets-bundle.mjs`](./build-widgets-bundle.mjs) | `widgets/<slug>/schema.json` → `widgets/bundle.js` (registry snapshot for `file://` consumers, React POC, stats). |
| [`build-search-index.mjs`](./build-search-index.mjs) | Concepts + sections + quizzes → `search-index.json` for `search.html`. |
| [`build-section-indexes.mjs`](./build-section-indexes.mjs) | Generate `sections/<id>.html` per subject group. |
| [`extract-topic.mjs`](./extract-topic.mjs) | `<topic>.html` → `content/<topic>.json` (block decomposition, widget-script auto-pairing). |
| [`render-topic.mjs`](./render-topic.mjs) | `content/<topic>.json` → stdout HTML (resolves widget slugs via registry). |
| [`new-topic.mjs`](./new-topic.mjs) | Scaffold a new topic (HTML stub + concepts/ + quizzes/ + index card). |
| [`new-widget.mjs`](./new-widget.mjs) | Scaffold a new `widgets/<slug>/` directory with schema + renderer + README stubs; `--force` overwrites, flags pre-fill the `meta` block. |
| [`package-offline.mjs`](./package-offline.mjs) | Produce `math-viz-notebook.zip` for workshops. |

## One-shot repair tools

| Script | What it does |
|---|---|
| [`repair-widget-scripts.mjs`](./repair-widget-scripts.mjs) | Splits `<script>` tags out of monolithic `rawBodySuffix` / `raw` blocks in `content/*.json` into proper `widget-script` blocks with `forWidget` linkage, by DOM-id reference matching. Bail-out safe: only splits scripts that reference exactly one widget's ids. Preserves byte-identity. Never touches HTML; never re-extracts. |

## Injectors / fixers (mutate HTML idempotently)

| Script | What it does |
|---|---|
| [`inject-changelog-footer.mjs`](./inject-changelog-footer.mjs) | Rebuild `<details class="changelog">` from `git log --follow`. `--audit` mode for CI. |
| [`inject-used-in-backlinks.mjs`](./inject-used-in-backlinks.mjs) | Reverse-direction `<aside class="related">` on each concept section. `--fix` writes. |
| [`inject-breadcrumb.mjs`](./inject-breadcrumb.mjs) | Breadcrumb + prev/next-in-section in top nav. |
| [`inject-display-prefs.mjs`](./inject-display-prefs.mjs) | `<script src="./js/display-prefs.js">` + CSS for widget/quiz hide toggle. |
| [`inject-index-stats.mjs`](./inject-index-stats.mjs) | Keep `index.html` hero-tagline topic/concept counts live. |
| [`inject-page-metadata.mjs`](./inject-page-metadata.mjs) | `data-section` / `data-level` attributes on `<body>`. |
| [`fix-a11y.mjs`](./fix-a11y.mjs) | Backfill SVG `<title>` + `<label for=>` wiring. |
| [`color-vars.mjs`](./color-vars.mjs) | Audit (default, exits 1 on hits) + `--fix` rewrite for hex in paint attrs; `--fix --pattern '<regex>'` also covers hex inside `<style>` blocks. |
| [`wire-katex-select.mjs`](./wire-katex-select.mjs) | Wire `js/katex-select.js` into pages with LaTeX-in-`<option>`. |

## Validators (gate CI; non-zero on failure)

| Script | What it checks |
|---|---|
| [`validate-concepts.mjs`](./validate-concepts.mjs) | Concept graph: duplicate ids, broken prereqs, cycles, missing fields, `concepts/index.json` ↔ `concepts/sections.json` coverage. |
| [`validate-schema.mjs`](./validate-schema.mjs) | `concepts/*.json` + `quizzes/*.json` against `schemas/*.json` via AJV 2020-12. |
| [`validate-widget-params.mjs`](./validate-widget-params.mjs) | `slug`-bearing widget blocks in `content/*.json` validate against `widgets/<slug>/schema.json`. |
| [`validate-katex.mjs`](./validate-katex.mjs) | Structural + macro-aware KaTeX checks on blurbs, prose, quiz questions. |
| [`smoke-test.mjs`](./smoke-test.mjs) | Per-page scaffolding: sidebar, nav, quiz wiring, anchors, changelog, callback/backlink invariants. |
| [`test-roundtrip.mjs`](./test-roundtrip.mjs) | `render-topic.mjs` output byte-identical to on-disk HTML for every `content/<topic>.json`. `--fix` mode (used by `rebuild.mjs`) writes rendered HTML to disk on drift — `content/*.json` is source of truth. `--no-fix` (CI) fails on drift. |
| [`audit-callbacks.mjs`](./audit-callbacks.mjs) | Cross-topic prereqs surface as `<aside class="callback">`. |

## Advisory audits (exit 0; write to `audits/`)

| Script | What it reports |
|---|---|
| [`stats-coverage.mjs`](./stats-coverage.mjs) | Per-subject/per-topic/per-concept widget + quiz counts + coverage gaps. Writes `audits/coverage-stats.md`. |
| [`audit-graph-health.mjs`](./audit-graph-health.mjs) | Concept-graph atomicity / multi-topic / implicit-prereq diagnostic plus a per-topic 🟢/🟡/🔴 scorecard. Writes `audits/graph-health.{tsv,md}`. |
| [`audit-stale-blurbs.mjs`](./audit-stale-blurbs.mjs) | Blurb-drift: LENGTH / MATCH / RECALL / OFFPAGE / DUP. |
| [`audit-blurb-question-alignment.mjs`](./audit-blurb-question-alignment.mjs) | Quiz questions not probing their concept's blurb. |
| [`audit-worked-examples.mjs`](./audit-worked-examples.mjs) | Concepts missing a `**Worked example:**` block. |
| [`audit-cross-topic-prereqs.mjs`](./audit-cross-topic-prereqs.mjs) | Suggested cross-topic prereq edges from prose/quiz co-mentions. |
| [`audit-inline-links.mjs`](./audit-inline-links.mjs) | Unlinked concept-title mentions. `--fix` wraps first per section. |
| [`audit-backlinks.mjs`](./audit-backlinks.mjs) | Backlink structure ("Used in" distribution: dead-ends, hubs, orphaned hubs) + coupling-depth scoring per (concept, consumer) pair. |
| [`audit-notation.mjs`](./audit-notation.mjs) | KaTeX macro / notation consistency. |
| [`audit-widget-interactivity.mjs`](./audit-widget-interactivity.mjs) | Static vs. interactive widget classifier. |
| [`audit-accessibility.mjs`](./audit-accessibility.mjs) | Heading order, SVG a11y, form wiring, color-only prose, viewport, `<html lang>`. |
| [`audit-responsive.mjs`](./audit-responsive.mjs) | Viewport meta, fixed widths, missing `viewBox`, overflow hazards. |
| [`audit-cross-page-consistency.mjs`](./audit-cross-page-consistency.mjs) | `<head>` + sidetoc + body-attr consistency across topic HTML. |
| [`audit-bundle-staleness.mjs`](./audit-bundle-staleness.mjs) | Fast check of `concepts/bundle.js` + `quizzes/bundle.js` vs source. |
| [`audit-doc-drift.mjs`](./audit-doc-drift.mjs) | `PLAN.md` / `AGENTS.md` / this `README.md` vs on-disk reality. Final rebuild step. |

## Tests and offline

| Script | What it does |
|---|---|
| [`test-offline-bundle.mjs`](./test-offline-bundle.mjs) | Smoke test for `math-viz-notebook.zip`. |
| [`test-mobile-perf.mjs`](./test-mobile-perf.mjs) | Playwright FPS check at mobile viewport on 3D drag + SVG rotation. |

## Shared libraries

| Module | Exports |
|---|---|
| [`lib/content-model.mjs`](./lib/content-model.mjs) | `loadContentModel()` — `topics`, `concepts`, `byPrereq`, `crossTopicEdges`, `quizBanks`, `quizByConcept`, `ownerOf`, `topicIds`, `capstones`, `sections`, `sectionOf(topicId)`. Plus `forEachSectionProse()`, `maskMathDelimiters()`. New audits should consume this rather than re-parse JSON. |
| [`lib/audit-utils.mjs`](./lib/audit-utils.mjs) | `escapeRe`, `buildTitleRegex`, `TITLE_BLOCKLIST`, `MIN_TITLE_LEN`, `maskRegion`, `buildSkipMask`, `buildSectionMap`. |

## Workflow

Default path after any content edit:

```bash
node scripts/rebuild.mjs           # 18 steps, fix-mode; bails on first failure
node scripts/rebuild.mjs --no-fix  # CI mirror (read-only; fails if anything drifted)
node scripts/rebuild.mjs --only <step>
```

CI ([`.github/workflows/verify.yml`](../.github/workflows/verify.yml)) runs `rebuild.mjs --no-fix`.
