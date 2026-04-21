# Plan

Forward-looking priorities for the notebook. For architecture, conventions, and the full quiz/progression/callback story, read [`AGENTS.md`](./AGENTS.md) first — especially § "Common pitfalls". For the project overview, see [`README.md`](./README.md) § "How the notebook is organized".

After any change, run `node scripts/rebuild.mjs` (exits 0 on green, bails on the first non-zero child). `--no-fix` mirrors CI; `--only <step>` runs a single step. The full step list lives in `scripts/rebuild.mjs` — refer to it rather than duplicating step names here.

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
- **Markdown-first content pipeline.** Accept contributions as Markdown + `[WIDGET: slug]` placeholders; an agent compiles to HTML + concept JSON + quiz skeleton.
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
