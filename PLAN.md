# Plan

Forward-looking priorities for the notebook. For architecture, conventions, and the full quiz/progression/callback story, read [`AGENTS.md`](./AGENTS.md) first — especially § "Common pitfalls". For the project overview, see [`README.md`](./README.md) § "How the notebook is organized".

After any change, run `node scripts/rebuild.mjs` (exits 0 on green, bails on the first non-zero child). `--no-fix` mirrors CI; `--only <step>` runs a single step. The full step list lives in `scripts/rebuild.mjs` — refer to it rather than duplicating step names here.

## Portable data model — what's landed, what's next

The structured-content pipeline is the big recent shift. See `widgets/README.md` for the widget registry and the `feat/portable-data-model` branch history (`git log --oneline --grep='Phase [0-9]'`) for the commit trail.

**Landed:**
- Explicit schemas for `concepts/<topic>.json` and `quizzes/<topic>.json` (`schemas/*.schema.json`).
- Shared content-model loader (`scripts/lib/content-model.mjs`) and audit utils (`scripts/lib/audit-utils.mjs`); seven audits migrated; ~1,200 lines of duplicated code deleted.
- Every topic has a `content/<topic>.json` — an ordered block decomposition (raw / widget / widget-script / quiz) that renders byte-identical to the handwritten HTML via `scripts/render-topic.mjs`.
- Widget registry with three entries (`composition-explorer`, `natural-transformation-explorer`, `clickable-diagram`); five widgets in category-theory now registry-driven (5 of 13).
- CI gates: `validate-schema`, `validate-widget-params`, `test-roundtrip` all wired into `rebuild.mjs`.
- Prototypes of alternate frontends: `examples/react-consumer/` (SSR via React+ajv), `examples/threejs-prototype/` (tangent bundle on S², Three.js from CDN).

**Next moves (in priority order):**
- Widen the registry: keep migrating widgets where a shared renderer is a clean fit. The 8 category-theory widgets skipped by `clickable-diagram` are domain-logic-heavy (randomized-functor tables, sets-and-maps blob renderers, group-theory computations); they want bespoke modules, not a shared abstraction.
- Full-topic React frontend: current POC renders one widget; next is rendering a whole topic from `content/<topic>.json` + the registry.
- Three.js adoption decision: the prototype validates the ceiling-raise for 3D-heavy topics (Riemannian geometry, Lie groups, Riemann surfaces, moduli). If you green-light it, first real use would be the Gauss-curvature surface in `differential-geometry.html`, behind a widget-registry slug. Requires an `AGENTS.md` amendment — the current rule is "no deps beyond KaTeX."
- Flip `content/` to the source of truth: currently `content/*.json` tracks `<topic>.html` and the roundtrip gate catches drift. The inverse — edit JSON, regenerate HTML — is one render-topic.mjs flag away.
- Markdown prose: reversibly convert raw HTML prose blocks to Markdown while preserving byte-identical round-trip on the restricted subset the notebook uses. This was the deferred Phase 3c — worth revisiting once the registry coverage is higher.

## Backlog — project health + standards (Apr 2026)

Honest self-review items raised while shipping Phase 2b/2c + reader-toggle + coverage-stats. Not urgent; most are judgment calls on where to invest next.

### Principle: authoring should be easy

Easy authoring *enforces* good decisions. If decomposing a concept or scaffolding a widget is tedious, authors skip the good practice — inconsistent theme, bundled concepts, stale links. If the common path is one command, consistency happens for free.

Concretely:

- `scripts/new-topic.mjs` already exists and is the gold standard.
- New-concept is handled by the `.claude/agents/content-scaffolder.md` skill (no script, no CLI).
- **New-widget is not scaffolded.** The current path is a 6-step manual process in `widgets/README.md`. Worth building a skill or a tiny scaffold command that creates `widgets/<slug>/{schema.json, index.mjs, README.md}` with filled-in `meta` block, picks a family from a small menu, and leaves the author only the params + render functions to write.
- **Adding a concept to an existing topic** currently means editing `concepts/<topic>.json`, the matching section in `<topic>.html`, and the quiz bank — plus re-extracting `content/<topic>.json`. A new-concept scaffold could do all four.

### Widget registry — is it paying off?

Honest read: the registry is at **5 of 452 widgets (1.1%)**. Three modules (`composition-explorer`, `natural-transformation-explorer`, `clickable-diagram`) maintained; clickable-diagram absorbed 3 category-theory widgets that genuinely shared structure. The other 8 category-theory widgets are domain-specific (randomized-functor tables, sets-and-maps blob renderers, group-theory computations) — bespoke modules if migrated at all.

Open questions:
- The byte-identity requirement pushed us to add "artifact" params (`sectionComment`, `proofsLiteral`, `svgStyleAttr`, etc.) that exist only for reproducing the current hand-written source. That's technical debt. Worth revisiting once we decide whether byte-identity-with-today's-HTML is a forever requirement or just a migration-safety one.
- Registry value is largely speculative right now — it's a bet on alternate frontends (React, mobile, etc.) that may or may not ship. The React POC is 160 lines and works; it proves portability but nothing production uses it yet.
- **Decision point**: commit more widget migration (say, 30 of 452), or accept the registry as a sparse high-value subset serving cross-framework portability examples?

### Quizzes — do they need the same treatment?

No — quizzes are already well-factored:
- Structurally separated from topic HTML (live in `quizzes/<topic>.json`; only a `<div class="quiz" data-concept>` placeholder appears in HTML).
- Typed (9 question types) and tiered (v1/hard/expert), both machine-queryable.
- Rendered centrally by `js/quiz.js` — no per-quiz module needed.

`scripts/stats-coverage.mjs` gives the aggregate picture we were missing. The remaining questions are content-level: 2298 total quizzes, 1160 v1 / 1125 hard / only 13 expert — the expert tier is barely populated. Concept coverage: every concept has a v1 quiz; many lack hard.

### Script audit — are they all needed? Can we simplify?

29 scripts in `scripts/`. 8 share the content-model loader; 21 still don't. The non-consolidated ones should be reviewed for necessity and overlap:

- **Candidates to merge or drop:**
  - `audit-responsive.mjs` overlaps with `audit-accessibility.mjs`.
  - `audit-doc-drift.mjs` missed the PLAN.md/AGENTS.md/README.md drift that surfaced in April review — either fix it or replace it.
  - `audit-notation.mjs`, `audit-worked-examples.mjs`, `audit-blurb-question-alignment.mjs` — low-usage; confirm whether signal is worth the maintenance.
- **Consolidation candidates:** validate-concepts.mjs, audit-widget-interactivity.mjs, audit-cross-page-consistency.mjs all re-implement concept/topic loading. Could import `loadContentModel()`.

A one-afternoon pass could probably cut 5–8 scripts without losing signal.

### NPM packages — candidates worth evaluating

Hand-rolled code that has mature npm equivalents:

- **`cheerio`** over `node-html-parser` — cheerio is richer for DOM manipulation in the `inject-*`/`fix-*` scripts, though it's heavier (node-html-parser suits perf-sensitive parsing of 58 topic HTMLs).
- **`katex` as a dependency** (not just a CDN loader) — would let `validate-katex.mjs` do real rendering instead of heuristic structural checks. Catches more bugs but slower.
- **`remark` + `rehype`** — if we ever convert prose blocks to Markdown, this is the standard ecosystem. Not needed today.
- **`natural` or `compromise`** for prose analysis (stale-blurbs, cross-topic-prereqs) — probably overkill; current regex heuristics are good enough at this scale.

For brand-new functionality (stats-coverage, display-prefs) native Node / vanilla JS is adequate; no npm gain.

### Docs — currency check

`AGENTS.md` and `README.md` were stale by ~10 commits until the Apr 2026 refresh. An `audit-doc-drift.mjs` that actually catches this is worth the effort — or bake doc-mentioning-infrastructure checks into CI (e.g. fail if `AGENTS.md` doesn't mention any `scripts/*.mjs` added in the last N commits).

### Items added to the general backlog list that follows

Below — the existing near-term sections. Treat the above as the "judgment calls" tier; below are the "known specific tasks" tier.

## Near-term tasks

Grouped by theme. Each item is a short title plus one-line scope. No checkboxes — when something ships, delete its bullet.

### Content & pedagogy

- **Notation/terminology audit.** Advisory script flagging drift (`\mathbb{Z}` vs `\Z`, `\operatorname{Aut}` vs `\Aut`, ring-of-integers conventions, etc.) across topic HTML, concept blurbs, and quiz banks.
- **Worked-example audit.** Flag concept sections missing a `**Worked example:**` block; turn the pedagogical expectation into a gate.
- **Blurb / quiz-question alignment sweep.** Verify each question probes something actually named in its concept's blurb.
- **Capstone story pages.** Long-form companion narratives for BSD, FLT, and Sato–Tate — essay tone, not widget-heavy.
- **Topic splitting.** Complex analysis (26 concepts), real analysis, smooth manifolds, and differential geometry each read as mini-textbooks; split into 2–3 focused children once the audits above are in place.

### UX

- **Topic-page hotkeys.** `q` to the next unanswered quiz, `n`/`p` to next/prev section, `?` for a help overlay.
- **Widget-state URLs.** Encode slider/selector state in the URL hash so configurations are shareable.
- **Print CSS per topic.** `@media print` so every page exports cleanly to PDF.
- **Onboarding tour.** First-visit 4-step overlay explaining pathway + progress + quiz flow.
- **Concept lineage strip.** Small top-of-page DAG showing this topic's direct prereqs and downstream consumers, driven by `concepts/bundle.js`.
- **Spaced-repetition review page.** `review.html` surfaces concepts due for re-quiz, keyed off the timestamps `MVProgress` already stores.
- **Light theme.** Toggle via CSS custom properties; persist in localStorage.

### Novel widgets

- **Proof/construction scrubber.** Timeline slider that replays a multi-step proof with synchronized narrative and diagram state.
- **Constraint / bifurcation explorer.** Set equations or inequalities, watch the feasible region update; expose singularities.
- **Pattern-induction workbench.** Show first N terms; learner proposes a rule; system validates against hidden tests.
- **Counterexample generator.** UI for constructing pathological objects (non-continuous-but-integrable, non-Hausdorff) and checking which hypotheses fail.
- **Interactive commutative-diagram editor.** Drag objects and morphisms; live-check naturality and compositionality.
- **Inline code cells.** Tiny sandboxed cells (plain JS or Pyodide) for sieves, modular arithmetic, and other computational topics.
- **Sonification.** Map parameter changes to audio for Fourier-adjacent topics (frequency, phase).

### New quiz types

- **Proof completion.** First N lines given, learner fills the middle.
- **Matching (two-column).** Pair theorems ↔ consequences, objects ↔ categories.
- **Spot-the-error.** Present a proof with a planted flaw; learner identifies it.
- **Construction (draw-to-answer).** Canvas where the learner draws a curve/region; tolerance-based grading.
- **Guess-my-rule (inductive).** System shows N examples; learner proposes a formula, checked against hidden cases.

Quiz-type work serializes on `js/quiz.js` — schedule as one agent, not several.

### Maintainability & tooling

- **`.claude/agents/`.** Directory exists but is empty. Ship four: content-scaffolder, cross-topic-prereq recommender, quiz-difficulty calibrator, pedagogy/notation auditor.
- **Markdown-first content pipeline.** *Partially shipped:* structured content is now `content/<topic>.json` with `widget` blocks carrying `slug + params` references. Markdown (rather than raw HTML) for prose blocks is still deferred — would require a reversible HTML↔Markdown conversion that preserves byte-identity on the restricted subset the notebook uses.
- **Cross-page consistency audit.** Verify every topic page has identical `<head>` boilerplate, sidetoc scaffold, and `data-section`/`data-level` attributes.
- **Mobile widget performance audit.** Use the Playwright MCP to measure FPS on 3D rotation and SVG drag at a mobile viewport; wire as a gate.
- **Bundle-staleness guard.** Fast check that `concepts/bundle.js` and `quizzes/bundle.js` match their sources without running a full rebuild.

### Stretch

- **Global search.** Across concepts, blurbs, quiz questions, and section headings — new `search.html` with a pre-built index.
- **Challenge mode.** Timed mixed-concept gauntlet; competitive-against-self.
- **Learner profiles.** Multiple profiles per browser, each with its own `MVProgress` slice.
- **Anki deck export** per topic.
- **On-demand proof cards.** Per-theorem compile-down pulling from the concept graph and section prose.

## Shipped recently

Don't enumerate — see `git log --oneline -30`. If you're unsure whether an item is already done, `node scripts/audit-doc-drift.mjs` will cross-reference this file against recent commits.

## Removed from prior plans

- The previous "Dependency spine" section (ordering advice for backfilling arithmetic-arc concept graphs) is gone. Those graphs are all complete; the validator catches cycles regardless. If the advice resurfaces as needed authoring guidance, it belongs under AGENTS.md § "Parallelization protocol" as an authoring recipe, not here.
- The stale step-count prose that claimed a six-item rebuild pipeline is gone. `scripts/rebuild.mjs` is the source of truth; refer to its STEPS array rather than restating the count here.
