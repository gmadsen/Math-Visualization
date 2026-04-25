# Agent Guide

Read this file before making any change to the repository. Read [`PLAN.md`](./PLAN.md) immediately after to know what work is actually wanted — it defines current priorities, concrete next tasks, and the dependency spine.

`CLAUDE.md` is a symlink to this file — Claude and any other LLM agent that consults a name-specific entry point lands here.

## First-time setup per clone

```bash
git config core.hooksPath .githooks   # enable the pre-commit roundtrip guard
npm ci --prefix scripts               # install build-time deps (ajv, node-html-parser)
```

The hooks directory is versioned, so updates propagate with `git pull`. Bypass a hook with `git commit --no-verify` if you know what you're doing. The `scripts/` lockfile is committed; CI runs the same `npm ci` step.

## Daily workflow at a glance

`content/<topic>.json` is the source of truth — `<topic>.html` is regenerated from it. Edit JSON, then:

```bash
node scripts/rebuild.mjs              # full chain in fix-mode (writes derived files)
node scripts/rebuild.mjs --no-fix     # CI mirror — strict, fails on any drift
```

Per-step invocation and the full step enumeration are documented under § "Registering a new page" below. Direct edits to `<topic>.html` get overwritten on the next rebuild — to backport a legitimate HTML edit, run `node scripts/extract-topic.mjs <topic>` first to update the JSON.

Scaffolders for the two common "add a new thing" flows: [`scripts/new-topic.mjs <slug> <section>`](./scripts/new-topic.mjs) (new topic page) and [`scripts/new-widget.mjs <slug>`](./scripts/new-widget.mjs) (new widget registry entry). Prefer them over hand-authoring the multi-step boilerplate.

**Before adding a widget to a page, consult [`widgets/README.md`](./widgets/README.md) § "Choosing a widget when authoring a topic"** as the menu of available shared renderers. The corpus today is heavily skewed toward `button-stepper`; the registry has slug variety (proof-scrubber, parametric-plot, surface-viewer, recurrence-plotter, lattice-visualizer, modular-arithmetic-clock, constraint-bifurcation-explorer, counterexample-explorer, inline-code-cell, etc.) intended to be reached for when the gesture matches. `audits/coverage-stats.md` § "Per-slug registry adoption" shows which slugs are under-adopted.

## Project goal

A single-file, interactive graduate-mathematics notebook in the spirit of 3Blue1Brown for aesthetic and Brilliant.org for pedagogy:

- Each topic is one self-contained HTML file (embedded CSS + JS, KaTeX from CDN, hand-written SVG widgets).
- Every major concept has a toy you can poke: a slider, a clickable diagram, a live computation.
- Every page ends concepts with a short quiz. Passing the quiz marks the concept *mastered*.
- Mastery is tracked locally and gates downstream concepts on [`pathway.html`](./pathway.html) (locked → ready → mastered), exactly like Brilliant's progression.

## Architecture at a glance

```
index.html                    landing page with section grid
pathway.html                  capstone prerequisite explorer
<topic>.html                  one self-contained page per topic
concepts/                     concept graph JSONs + index.json + sections.json (topic→subject) + capstones.json + bundle.js
quizzes/                      quiz bank JSONs + bundle.js
content/                      per-topic block-level JSON (raw / widget / widget-script / quiz)
widgets/                      widget registry: schema.json + index.mjs + README.md per slug
schemas/                      JSON Schemas for concept graph + quiz banks
audits/                       generated graph-health reports (TSV + Markdown summary)
js/progress.js                mastery store (localStorage)
js/quiz.js                    quiz widget
js/katex-select.js            LaTeX-in-<option> shim
js/theme-toggle.js            dark/light theme toggle
js/display-prefs.js           reader-side widget/quiz hide toggle
scripts/                      validators, audits, bundle builders, packaging
scripts/lib/                  shared loader (content-model.mjs) + audit-utils.mjs
.github/workflows/verify.yml  CI entry point
AGENTS.md                     this file
PLAN.md                       forward priorities and next tasks
```

Vanilla HTML/CSS/JS, no framework. `scripts/` is the "build system": small Node scripts that (a) flatten `concepts/*.json` and `quizzes/*.json` into `*/bundle.js` so `file://` double-click opens still work (browsers block `fetch()` of local JSON), (b) idempotently insert forward/reverse cross-reference asides into topic pages, or (c) validate the concept graph. CI ([`.github/workflows/verify.yml`](./.github/workflows/verify.yml)) runs `node scripts/rebuild.mjs --no-fix` on every push and PR.

**Full script catalog: [`scripts/README.md`](./scripts/README.md)** — one row per `.mjs`, grouped by role (orchestration, builders, repair tools, injectors, validators, advisory audits, tests). The categories at a glance:

- **Quality gates** (`validate-concepts`, `validate-katex`, `validate-schema`, `validate-widget-params`, `test-widget-renderers`, `smoke-test`, `test-roundtrip`, `audit-callbacks`) — non-zero on failure; CI fails.
- **Injectors / fixers** that mutate HTML idempotently (`audit-callbacks --fix`, `inject-used-in-backlinks --fix`, `inject-breadcrumb --fix`, `inject-display-prefs --fix`, `inject-index-stats --fix`, `inject-changelog-footer`, `fix-a11y --fix`, `color-vars --fix`, `wire-katex-select --fix`, `repair-widget-scripts`).
- **Builders** that produce derived files (`build-concepts-bundle`, `build-quizzes-bundle`, `build-widgets-bundle`, `build-search-index`, `build-section-indexes`, `extract-topic`, `render-topic`, `package-offline`, `new-topic`, `new-widget`).
- **Advisory audits** that exit 0 and write `audits/*.md` (`stats-coverage`, `audit-graph-health`, `audit-stale-blurbs`, `audit-blurb-question-alignment`, `audit-worked-examples`, `audit-cross-topic-prereqs`, `audit-inline-links`, `audit-backlinks`, `audit-notation`, `audit-widget-interactivity`, `audit-accessibility`, `audit-responsive`, `audit-cross-page-consistency`, `audit-bundle-staleness`, `audit-draft-index-cards`, `audit-doc-drift`).
- **Tests** (`test-offline-bundle`, `test-mobile-perf`).
- **Shared libraries** in `scripts/lib/` — [`content-model.mjs`](./scripts/lib/content-model.mjs) (`loadContentModel()` returns memoized `concepts`, `quizBanks`, `byPrereq`, `crossTopicEdges`, `ownerOf`, etc.) + [`audit-utils.mjs`](./scripts/lib/audit-utils.mjs). New audits import these rather than re-parsing JSON.

One CLI front door: `node scripts/cli.mjs <space-separated-command>` routes by longest-prefix match (`cli.mjs audit backlinks` → `scripts/audit-backlinks.mjs`). Individual scripts remain directly callable; `rebuild.mjs` doesn't go through the CLI so CI stays dependency-free.

## Structured content pipeline

Alongside the handwritten topic HTML, every topic now has a structured counterpart under `content/<topic>.json`. This is a block-level decomposition of the page — an ordered array of `raw`, `widget`, `widget-script`, and `quiz` blocks. `raw` blocks are HTML strings copied verbatim; `widget` blocks reference an entry in the widget registry by `slug` and carry a `params` object; `widget-script` blocks hold the `<script>` tail that wires a widget up; `quiz` blocks name the concept id whose quiz placeholder belongs at that position. All 58 registered topics are extracted.

Two scripts round-trip between HTML and JSON:

- [`scripts/extract-topic.mjs`](./scripts/extract-topic.mjs) — parses `<topic>.html` into the block array and writes `content/<topic>.json`.
- [`scripts/render-topic.mjs`](./scripts/render-topic.mjs) — the reverse: reads `content/<topic>.json` and emits the HTML bytes.

The hard invariant is **byte-identical round-trip**: for every topic, `render-topic(<topic>.json)` must equal the on-disk `<topic>.html` exactly. [`scripts/test-roundtrip.mjs`](./scripts/test-roundtrip.mjs) enforces this.

As of 2026-04-24 **`content/<topic>.json` is the source of truth.** `rebuild.mjs` (default, fix mode) now passes `--fix` to `test-roundtrip.mjs`, which overwrites `<topic>.html` with the rendered output when drift is detected. `rebuild.mjs --no-fix` (CI) is still strict: any drift fails the build, so a hand-edited HTML without a matching JSON update breaks CI. The practical workflow is: edit `content/<topic>.json`, run `node scripts/rebuild.mjs` (local), commit both. Direct edits to `<topic>.html` get overwritten on the next rebuild — prefer `extract-topic.mjs` to backport legitimate HTML edits into the JSON side when that's actually what you need, but the normal flow is JSON-first.

A pre-commit hook at [`.githooks/pre-commit`](./.githooks/pre-commit) guards this invariant locally: when a topic HTML or its content JSON is staged, it runs `scripts/test-roundtrip.mjs` and fails the commit on drift, printing the exact remediation steps. Enable once per clone with `git config core.hooksPath .githooks` (the hooks directory is versioned so updates propagate with `git pull`). Bypass with `git commit --no-verify` if you know what you're doing.

Widgets live in a registry at `widgets/<slug>/` with three files:

- `schema.json` — JSON Schema 2020-12 for the widget's `params`.
- `index.mjs` — exports `renderMarkup(params)` and `renderScript(params)`, pure functions that produce the exact bytes a handwritten page would inline.
- `README.md` — param reference.

See [`widgets/README.md`](./widgets/README.md) for the current registry and the rules for adding a new entry. [`scripts/build-widgets-bundle.mjs`](./scripts/build-widgets-bundle.mjs) flattens every `widgets/<slug>/schema.json` into `widgets/bundle.js` for `file://` consumers (mirrors the concepts/quizzes bundle pattern). Because widgets are schema-described, non-HTML frontends can consume the same `content/<topic>.json` — see `examples/react-consumer/` for a proof-of-concept React renderer.

When a widget's driving `<script>` is inlined in a trailing `rawBodySuffix` block rather than in an adjacent `widget-script` block, [`scripts/repair-widget-scripts.mjs`](./scripts/repair-widget-scripts.mjs) splits it back out by DOM-id reference matching (bail-out safe: only acts when the script references exactly one widget's ids). This preserves byte-identity while exposing the widget ↔ script pairing to the migration pipeline, without the destructive wholesale re-extract.

One CLI front door: [`scripts/cli.mjs`](./scripts/cli.mjs) routes `node scripts/cli.mjs <space-separated-command>` to any script under `scripts/` by longest-prefix match (`cli.mjs audit backlinks` → `scripts/audit-backlinks.mjs`). Individual scripts remain directly callable; `rebuild.mjs` does not go through the CLI so CI stays dependency-free.

The canonical way for audit scripts to read content is [`scripts/lib/content-model.mjs`](./scripts/lib/content-model.mjs). A single `loadContentModel()` call returns a memoized normalized model: `concepts`, `quizBanks`, `byPrereq`, `crossTopicEdges`, `ownerOf`, parsed topic HTML, and more. Shared helpers live in [`scripts/lib/audit-utils.mjs`](./scripts/lib/audit-utils.mjs). New audits should consume these rather than re-parsing JSON or HTML.

## Style reference — always read first

Before drafting a new page or editing widget code, **read [`category-theory.html`](./category-theory.html)** end-to-end. It is the canonical style template:

- `<head>` block (KaTeX loader, `:root` CSS variables, widget/readout/note classes, sticky sidebar TOC)
- Helper `<script>` block at the top of `<body>` with `$`, `$$`, `SVG`, `ensureArrow`, `drawArrow`, `drawNode`
- `<nav class="toc">` + `<aside class="sidetoc">` pattern
- `<section class="hero">` with `<h1>` + `<p class="sub">`
- Numbered `<h2>` sections (`1. …`, `2. …`) each with a worked widget

When parallelizing: every agent spawned to draft or edit a page must read `category-theory.html` first so tone, markup, and helpers stay consistent across the notebook.

## Common pitfalls — read once, then refer back

Recurring gotchas collected from real fan-outs. Skim this list before editing; revisit after a test failure. Each item has a section below that goes deeper, but this is the pre-flight checklist.

- **Three-tier quiz schema** — each concept entry in `quizzes/<topic>.json` carries a `questions` array (v1 tier) and may carry a `hard` sibling array and/or an `expert` sibling array. `MVProgress` tracks `v1`, `hard`, and `expert` independently; `js/quiz.js` unlocks `hard` after v1 mastery and `expert` after hard mastery. When authoring any higher-tier bank, drop it under the same concept key, not a separate file.
- **Anchor contract (silent 404)** — every `concepts/<topic>.json` concept's `anchor` must match an `id="…"` on the corresponding `<section>` in the topic HTML. Mismatches don't throw; the deep-link just doesn't jump. `scripts/smoke-test.mjs` refuses to exit 0 if any anchor drifts.
- **Quiz bundle order** — after editing `quizzes/*.json` or `concepts/*.json`, **always** run both `node scripts/build-quizzes-bundle.mjs` and `node scripts/build-concepts-bundle.mjs`. Browsers block `fetch()` of local JSON over `file://` (the double-click flow); without a fresh bundle, double-click opens "could not load" silently and pathway state desyncs.
- **Callback idempotency** — `scripts/audit-callbacks.mjs --fix` inserts `<aside class="callback">` blocks bounded by `<!-- callback-auto-begin -->` / `<!-- callback-auto-end -->` fences. Re-run the script after editing any `prereqs`; it strips and re-inserts so duplicate asides never accumulate. Same fence trick for `scripts/inject-used-in-backlinks.mjs` (`aside.related`, `backlinks-auto-*` fences) and `scripts/inject-changelog-footer.mjs` (`<details class="changelog">`).
- **3D decimation on drag** — any widget using `make3DDraggable` must cut mesh density (`NU`/`NV` or equivalent knob) while `view.dragging` is true, then redraw at full resolution on `pointerup`. Without this, heavy meshes chug visibly on rotation.
- **Legends in viewport coords, not data coords** — anchor legends at fixed viewport offsets (e.g. `translate(-230, 155)`). Anchoring to `(xmin, ymin+pad)` drifts with rotation because the bounding box shifts.
- **Changelog re-seed is safe** — `scripts/inject-changelog-footer.mjs` rebuilds each footer from `git log --follow`, so re-running picks up new commits without duplicating rows. Pages with no git history yet retain a `YYYY-MM-DD · initial version` placeholder until the first commit lands.
- **Cross-topic prereqs need callbacks** — adding a prereq that crosses topic boundaries is incomplete without the callback. Run `scripts/audit-callbacks.mjs --fix` after any `prereqs` edit; the audit mode (no flag) is a CI guard that fails if the forward-direction block is missing.
- **"Used in" backlinks are the reverse direction** — `scripts/inject-used-in-backlinks.mjs --fix` emits a `<aside class="related">` on the prereq side (downstream consumers of this concept). Audit mode enforces presence; re-run after any `prereqs` edit so both directions stay in sync.
- **Color tokens, never hex** — inside widget markup, reach for `var(--yellow)`, `var(--cyan)`, `var(--mute)`, etc. The `:root` declarations define the palette; inlining raw hex breaks theme swaps and the color-mix border rules on `.callback` / `.related` / `.changelog`. Run `node scripts/color-vars.mjs` to find offenders (exits 1 if any); `node scripts/color-vars.mjs --fix` does a one-shot hex→`var()` rewrite in SVG paint attrs (exact-match palette hits only), and adding `--pattern '<regex>'` extends the rewrite into `<style>` blocks whose `<selector> { <property>:` context key matches (no blanket style-block sweeps).
- **A11y backfill** — `node scripts/fix-a11y.mjs --fix` idempotently backfills SVG `<title>` elements and `<label for=>` wiring. Pair with `node scripts/audit-accessibility.mjs` to see what's still missing.
- **No ad-hoc localStorage keys** — `MVProgress` owns `mvnb.progress.v1`. Anything else goes in memory for the session. The legacy 2-arg form `setMastered(id, bool)` silently defaults `tier='v1'` for backwards compat, but new code should pass the tier explicitly.
- **Don't commit scratch verify scripts** — ad-hoc `_verify_*.js` files used for jsdom smoke-testing belong one level up from the repo (e.g. `/sessions/<id>/_verify_<page>.js`), not inside `Math-Visualization/`. The repo is public.
- **LaTeX inside `<option>` requires `js/katex-select.js`** — native `<select>` popups are drawn by the OS and render `<option>` labels as plain text, so raw `$\omega = dx$` leaks into the dropdown. Any widget with LaTeX-containing options must load `js/katex-select.js` (a hidden-native + custom-popup shim). Run `node scripts/wire-katex-select.mjs` (audit) or `--fix` after adding such options; the script inserts the loader after the `quiz.js` tag idempotently.
- **Round-trip invariant (JSON is the source)** — every `<topic>.html` is derived from `content/<topic>.json`. `rebuild.mjs` (default fix mode) auto-writes HTML from JSON via `test-roundtrip.mjs --fix`; CI's `rebuild.mjs --no-fix` is strict — any drift fails. **How to apply:** edit `content/<topic>.json`, run `node scripts/rebuild.mjs`, commit both. Direct HTML edits get overwritten on the next rebuild unless you also backport them into the JSON via `extract-topic.mjs <topic>` first.
- **Widget registry blocks carry `slug + params`** — in `content/<topic>.json`, `widget` blocks reference an entry under `widgets/<slug>/` rather than inlining markup. **Why:** `scripts/validate-widget-params.mjs` validates each block's `params` against `widgets/<slug>/schema.json` so schema violations surface in CI, and non-HTML frontends can render the same widget from the schema alone. **How to apply:** when you add a new interactive widget that you want registry-backed, add an entry under `widgets/` following [`widgets/README.md`](./widgets/README.md); otherwise the block stays as `raw` HTML and nothing changes.

## House conventions

- **Colors** live in `:root`: `--bg`, `--panel`, `--panel2`, `--ink`, `--mute`, `--line`, plus accents `--yellow --blue --green --pink --violet --cyan`. Use these vars, never hex literals inside widgets.
- **KaTeX delimiters**: `$…$` inline, `$$…$$` display, plus `\(…\)` and `\[…\]`. Configured in the loader script — don't invent new ones.
- **Widget chrome**: wrap interactives in `<div class="widget">` with `<div class="hd"><div class="ttl">…</div><div class="hint">…</div></div>`. Use `.readout`, `.row`, `.note`, `.ok`, `.bad` for standard sub-elements.
- **Level badges** on index cards: `<span class="level prereq">prereq</span>`, `advanced`, or `capstone`. Match the roadmap's classification.
- **SVG**: use the shared helpers, include `viewBox`, let CSS size it. Text inherits `fill:var(--ink)` from the stylesheet.
- **Storage**: permitted `localStorage` keys are `mvnb.progress.v1` (mastery, `MVProgress`), `mvnb.theme` (dark/light), and `mvnb.display` (reader widget/quiz hide). Don't add other ad-hoc keys, cookies, or IndexedDB — anything else goes in memory for the session.
- **Reader display preferences**: `js/display-prefs.js` exposes `window.MVDisplay.toggleWidgets()`, `toggleQuizzes()`, `showAll()`, `current()`. Preference surfaces on `<html>` as `data-hide-widgets` / `data-hide-quizzes`. A `📖` button next to the theme toggle: click = widgets, shift-click = quizzes, Escape = restore all. Cross-tab sync via the `storage` event.
- **Hero-tagline counts in `index.html`**: the two `<span class="tg-num">` values (topics, concepts) are owned by `scripts/inject-index-stats.mjs`. Don't hand-edit — run the script (or just `node scripts/rebuild.mjs`) and the numbers will match the live corpus.
- **Index sections**: the canonical topic → subject mapping is `concepts/sections.json`. `validate-concepts` fails if a registered topic is missing from it. The 7 sections:
  1. **Foundations** (blue) — naive set theory.
  2. **Algebra** (yellow/pink/violet mix) — abstract algebra, category theory, representation theory, commutative algebra, homological algebra.
  3. **Analysis** (pink/cyan) — real analysis, measure theory, complex analysis, functional analysis, operator algebras.
  4. **Geometry & topology** (violet/green) — point-set topology, algebraic topology, smooth manifolds, differential forms, differential geometry, Riemannian geometry, Lie groups, Riemann surfaces.
  5. **Number theory** (yellow/pink) — Galois, quadratic reciprocity, sums of squares, algebraic number theory, p-adics, Frobenius & reciprocity, class field theory.
  6. **Modular forms & L-functions** (cyan/pink) — upper half-plane, modular forms, theta functions, Hecke operators, Dirichlet series, L-functions, Galois representations.
  7. **Algebraic geometry** (green/cyan/violet) — projective plane, Bézout, schemes, sheaves, morphisms & fiber products, functor of points, elliptic curves, singular cubics, moduli spaces, sheaf cohomology, stacks.
- **Card color palette**: each card uses one of the six accent colors via the `.y`, `.b`, `.p`, `.g`, `.c`, `.v` classes on its thumb SVG. Pick a color that harmonizes with the section rather than strictly matching — variety inside a section is fine.
- **Cross-page callbacks**: when a concept's `prereqs` reference an id owned by another topic, the section ends with an `<aside class="callback">` listing "See also" links to the target anchors. Insertions are mechanical — run `node scripts/audit-callbacks.mjs --fix` after editing any `concepts/*.json` prereqs. The companion audit (`node scripts/audit-callbacks.mjs`, no flag) and a light smoke-test guard both enforce coverage.
- **Per-page changelog footers**: every topic HTML ends with a `<details class="changelog">` block seeded from `git log`. New content PRs that touch a topic page should prepend a changelog row via re-running `scripts/inject-changelog-footer.mjs` — it rebuilds the block in place, picking up any new commits to the page.

## Page-global helpers

Every topic page has a 2D helper block (`$`, `$$`, `SVG`, `drawArrow`, `drawNode`) at the top of `<body>`. Pages with rotatable 3D widgets add a second block (`vsub`/`vadd`/…, `proj3`, `curvColor`, `make3DDraggable`).

**Copy verbatim** from [`category-theory.html`](./category-theory.html) (2D) and [`differential-geometry.html`](./differential-geometry.html) (3D) — do not rewrite. **Full reference: [`widgets/README.md`](./widgets/README.md) § "Page-global helpers"** (API surface + the `make3DDraggable` usage pattern + the three recurring gotchas: drag decimation, legend coords, readout discoverability).

## Quiz + progression (Brilliant-style)

Every new topic ships with a `quizzes/<topic>.json` bank. **Full reference: [`quizzes/README.md`](./quizzes/README.md)** — bank schema, the eight question types (`mcq`, `numeric`, `complex`, `multi-select`, `ordering`, `proof-completion`, `matching`, `spot-the-error`, `construction`, `guess-my-rule`), three-tier mastery model, and the quiz widget's behaviour.

The minimum operational checklist:

- **Page wiring** — `<head>` loads `./js/progress.js`, `./js/quiz.js`, `./quizzes/bundle.js` (in that order); `<body>` ends with an `MVQuiz.init('<topic-id>')` IIFE. Copy from `category-theory.html`.
- **Placeholders** — `<div class="quiz" data-concept="<concept-id>"></div>` at the end of each concept's section. `data-concept` must match an `id` in `concepts/<topic>.json`.
- **Bank** — `quizzes/<topic>.json` keyed by concept id. Each entry has `questions` (v1 tier, required, ~3 questions); optional `hard` (2–3 questions chaining two concepts or probing counterexamples), unlocked after v1 mastery; optional `expert` (2–3 deepest-consequence questions), unlocked after hard.
- **Bundle rebuild** — after editing any bank, run `node scripts/build-quizzes-bundle.mjs` (or `node scripts/rebuild.mjs`). The `file://` flow reads `quizzes/bundle.js`, not the JSON.
- **Mastery API** — `MVProgress` (in [`js/progress.js`](./js/progress.js) — see JSDoc at top) tracks v1/hard/expert tiers under `localStorage.mvnb.progress.v1`. Only **v1** gates downstream concepts on `pathway.html`; hard/expert are visual-only rings.

## Concept graph

`concepts/<topic>.json` is the per-topic concept graph. Each concept has `id`, `title`, `anchor`, `prereqs`, `blurb`. Prereqs may reference ids from other topic files — cross-topic edges are the spine of [`pathway.html`](./pathway.html).

**Full reference: [`concepts/README.md`](./concepts/README.md)** — schema, anchor contract, topic registration (in `concepts/index.json` + `concepts/sections.json`, plus `concepts/capstones.json` for capstones), validation flow, callback semantics.

The operational checklist after editing anything under `concepts/`:

- Run `node scripts/rebuild.mjs` (or at minimum `build-concepts-bundle.mjs` + `validate-concepts.mjs` + `smoke-test.mjs`).
- The **anchor contract** is a silent 404 if you break it: every concept's `anchor` field must match an `id="…"` on the corresponding `<section>` in the topic HTML. `smoke-test.mjs` is the gate.
- Adding a cross-topic prereq requires `audit-callbacks.mjs --fix` (forward direction) and `inject-used-in-backlinks.mjs --fix` (reverse). Both are in the rebuild chain.

## Page scaffolding — required on every topic page

Every topic HTML file must include, in order:

1. **Top-nav backlink** inside `<nav class="toc">`: `<a href="./index.html" style="color:var(--violet);font-weight:500">← Notebook</a>` as the first anchor. Without it there is no way back to the index from a deep link.
2. **Sidetoc scaffold**: `<aside class="sidetoc" aria-label="Table of contents"></aside>`. The shared helper populates it at page load.
3. **`MVQuiz.init('<topic-id>')` footer** at the bottom of `<body>`, exactly as shown in the Quiz + progression section below. Without it, quizzes render but do not wire up answer-checking or `MVProgress` calls.

Skipping any of these is a silent break — quizzes appear but do nothing, or the sidebar stays empty. Always copy the scaffolding from `category-theory.html` rather than reconstructing it.

## Registering a new page

Use the scaffolder: **`node scripts/new-topic.mjs <slug> <section>`**. It creates the stub topic HTML, `concepts/<slug>.json`, `quizzes/<slug>.json`, registers the slug in `concepts/index.json`, and inserts a placeholder `<a class="card">` into `index.html`. The structured `content/<slug>.json` is produced on the first `rebuild.mjs` run via `extract-topic.mjs`.

After scaffolding, you still need to:

1. **Replace the draft index card** — the scaffolder leaves literal "draft" text in the thumb SVG and a placeholder `.desc`. Both are flagged by `audit-draft-index-cards.mjs`. Replace with: (a) a motif SVG matching one of the topic's central diagrams, (b) a 1–2 sentence `.desc`, (c) a `.tag` with 3–4 dot-separated keywords. See `category-theory`'s card as the template.
2. Add a bullet to [`README.md`](./README.md) under the matching `###` section.
3. If it's a capstone, add an entry (with `section` field) to [`concepts/capstones.json`](./concepts/capstones.json).
4. **Run `node scripts/rebuild.mjs`** — the full 20-step chain. Bundles are rebuilt, validators run, HTML is rendered from JSON, and any drift is surfaced. **Step list + `--only` enumeration: [`scripts/README.md`](./scripts/README.md) § "All-in-one verification".**

`rebuild.mjs --no-fix` mirrors CI (read-only). `inject-changelog-footer.mjs` is intentionally outside the chain — run it manually before publishing.

## Registering a new widget

Quickstart: `node scripts/new-widget.mjs <slug> [--family <f>] [--dimension 2d|3d] [--gesture <g>] [--role <r>]` scaffolds `widgets/<slug>/` with `schema.json` (draft 2020-12, `meta` block, minimal `{ widgetId, title, hint? }` params), `index.mjs` (pure `renderMarkup` + `renderScript` stubs with `TODO(<slug>)` markers), and a short `README.md`. Re-runs are a no-op ("already exists", exit 0); `--force` overwrites. After editing the schema and renderer, add `{ "type": "widget", "slug": "<slug>", "params": {…} }` (plus a matching `widget-script` block) to the relevant `content/<topic>.json`, then run `node scripts/rebuild.mjs --only widget-params` to AJV-validate, and `node scripts/rebuild.mjs` for the full byte-identical round-trip gate. See [`widgets/README.md`](./widgets/README.md) for the registry contract and the 6-step manual reference.

## Verification (required before claiming done)

Run a local server and exercise the page in a browser — type-checking or file existence is not enough:

```bash
python3 -m http.server 8000
# open http://localhost:8000/<page>.html
```

Check all of:

- **KaTeX**: no raw `$…$` visible; no red error badges from `throwOnError`.
- **Every widget**: interact with it — sliders, buttons, inputs. Confirm readouts update and SVG redraws.
- **Quizzes**: answer each question correctly once, confirm the `✓ mastered` badge appears, reload the page and confirm "already mastered" persists.
- **Links**: the top-nav "← Notebook" link resolves; internal `#anchor` links jump; the sidetoc highlights the active section on scroll.
- **Index card**: open [`index.html`](./index.html), find the new card in its section, click through.
- **Pathway**: if the page adds concepts with prereqs from other topics, load [`pathway.html`](./pathway.html) and confirm the new nodes appear in the right state.
- **Concept graph**: run `node scripts/validate-concepts.mjs` (exit 0 clean, exit 1 on errors) whenever you touch `concepts/*.json`. It catches duplicate ids, broken prereqs, cycles, and missing `anchor`/`blurb` fields.
- **Concept bundle**: after any edit to `concepts/*.json` or `concepts/capstones.json`, run `node scripts/build-concepts-bundle.mjs`. `pathway.html` will fall back to `fetch()` under a dev server but silently fail when opened by double-click if the bundle is stale.
- **Quiz bundle**: after any edit to `quizzes/*.json`, run `node scripts/build-quizzes-bundle.mjs`. Topic pages show "could not load ./quizzes/\<topic\>.json" under `file://` if the bundle is missing or stale.
- **Console**: no errors in the browser devtools console.

### Agent-environment fallback (no browser)

If you're running in an agent sandbox without a real browser, use **jsdom** as a partial substitute — it runs the page's top-of-body helper script and KaTeX and surfaces script errors, but does not exercise CSS layout or user interaction. **Full snippet + assertions: [`docs/agent-environment.md`](./docs/agent-environment.md).** A clean jsdom run is necessary but not sufficient — say so explicitly when reporting. If you can't run even jsdom, say so — do not claim a visual feature works.

## Parallelization protocol

You may spawn multiple agents to draft independent pages in parallel. Every such agent must:

1. Read `AGENTS.md` (this file) and `PLAN.md`.
2. Read `category-theory.html` for style before writing markup.
3. Read one page with similar subject matter (e.g. drafting `bsd.html` → also read `L-functions.html` and `elliptic-curves.html`) so notation and callbacks match.
4. Write only the assigned page plus its `concepts/` and `quizzes/` files. Do not touch `index.html`, `README.md`, or `PLAN.md` — the orchestrating session handles registration so edits don't conflict.

Side tasks that are safe to parallelize with page drafting: concept-graph validation scripts, concept-map JSON for an already-published page, CSS-only refactors scoped to a single file.

## What not to do

- Don't create new `.md` files for planning, status, or decisions. Work from conversation context.
- Don't introduce build tools, bundlers, TypeScript, or frameworks. The notebook is vanilla HTML/CSS/JS by design.
- Don't add external JS dependencies beyond the KaTeX CDN already in use.
- Don't rewrite the helper block in a new style — copy from `category-theory.html`.
- Don't claim a page is done without browser verification.
- Don't commit scratch verification scripts into the repo. Ad-hoc `_verify_*.js` files used for jsdom smoke-testing belong one level up from the workspace (e.g. `/sessions/<id>/_verify_<page>.js`), not inside `Math-Visualization/`. The repo is public; keep it free of throwaway instrumentation.
- Don't re-implement concept / quiz / topic-HTML parsing in a new audit script. Import `loadContentModel()` from [`scripts/lib/content-model.mjs`](./scripts/lib/content-model.mjs) — it memoizes a normalized model across all topics (concepts, quiz banks, reverse adjacency, cross-topic edges, parsed HTML). Shared audit helpers live in [`scripts/lib/audit-utils.mjs`](./scripts/lib/audit-utils.mjs). Bespoke `JSON.parse` loops in new audits are a code-smell the reviewer will flag.
