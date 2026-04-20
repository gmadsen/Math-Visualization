# Roadmap

## Current state

- **53 topic pages** linked from [`index.html`](./index.html), grouped into 7 sections: Foundations · Algebra · Analysis · Geometry & topology · Number theory · Modular forms & L-functions · Algebraic geometry.
- **53 concept graphs · 303 concepts total** registered in [`concepts/index.json`](./concepts/index.json) feeding [`pathway.html`](./pathway.html). Each concept carries an `anchor` field used by the pathway DAG to deep-link `page.html#anchor` into the topic page — all 303 anchors resolve to matching `id="..."` sections. The anchor contract is documented in [`AGENTS.md`](./AGENTS.md) and enforced by the smoke test. Distribution: 36 × 5-concept graphs, 6 × 6, 4 × 7, 1 × 8 (`real-analysis`), 1 × 26 (`complex-analysis`), plus the 5 new side-quest pages at 5 each. Zero topics at the old 3- or 4-concept floor.
- **8 capstones** in [`concepts/capstones.json`](./concepts/capstones.json), grouped by section for the pathway `<optgroup>`. All four Wave-4 capstones (`sato-tate`, `bsd`, `etale-cohomology`, `modularity-and-flt`) ship 9-widget v2s.
- **53 quiz banks** under [`quizzes/`](./quizzes/) — one per topic (full coverage), **798 questions** total — wired via the mastery loop in [`js/quiz.js`](./js/quiz.js) + [`js/progress.js`](./js/progress.js).
- **Two-tier quiz schema**: each concept may carry a sibling `"hard": [ ... ]` array in addition to the baseline `"questions": [ ... ]`. `MVProgress` tracks `v1` and `hard` mastery independently; `js/quiz.js` renders a "Harder tier" gate after v1 mastery; [`pathway.html`](./pathway.html) shows dual mastery rings (inner green v1, outer violet hard). v1 banks are full coverage; hard-tier authoring is the main outstanding item (see Outstanding).
- **Cross-page callbacks**: 149 cross-topic prereq edges surface as `<aside class="callback">` "See also" panels on the host section, idempotent under [`scripts/audit-callbacks.mjs`](./scripts/audit-callbacks.mjs).
- **Per-page changelog footers**: every topic page carries a `<details class="changelog">` footer seeded from `git log --follow` via [`scripts/insert-changelog-footer.mjs`](./scripts/insert-changelog-footer.mjs). Re-runnable to pick up new commits.
- Bundles ([`concepts/bundle.js`](./concepts/bundle.js), [`quizzes/bundle.js`](./quizzes/bundle.js)) make everything work from `file://` without a dev server. Regenerate after edits with `node scripts/build-concepts-bundle.mjs` and `node scripts/build-quizzes-bundle.mjs`.
- Validator ([`scripts/validate-concepts.mjs`](./scripts/validate-concepts.mjs)) is clean: 0 errors, 0 warnings.
- Callback audit ([`scripts/audit-callbacks.mjs`](./scripts/audit-callbacks.mjs)) is clean: all 149 cross-topic edges covered.
- Page smoke test ([`scripts/smoke-test.mjs`](./scripts/smoke-test.mjs)) is clean: 0 errors, 0 warnings; now guards that every page has exactly one changelog footer and pages with cross-topic prereqs carry at least one callback.
- CI ([`.github/workflows/verify.yml`](./.github/workflows/verify.yml)) runs bundle builds + validator + smoke test on every push to `main` and on PRs.
- Offline bundle: `node scripts/package-offline.mjs` produces `math-viz-notebook.zip` with a `serve.sh` helper for workshops.

Pages ship as iteratively-improvable v1/v2 drafts. "Published" means reachable from the index and passing basic verification — not "final."

## Outstanding

1. **Hard-tier quiz banks.** The schema is live but the content is not — 52 of the 53 topics still ship only v1 questions. Authoring a `"hard": [ ... ]` array per concept extends the mastery loop beyond the first pass. See [TODO.md](./TODO.md) § A.

## Proposed improvements

- **More narrative side quests** off the main arc: the five shipped in fan-out #3 (`power-sums-bernoulli`, `waring`, `partitions-generating-functions`, `moonshine`, `analytic-continuation`) could be followed by e.g. `zeta-values.html`, `adeles-and-ideles.html`, `quadratic-forms-genus-theory.html`.
- **Deeper cross-referencing.** The 149 callback edges cover *direct* prereqs; bidirectional "used in" backlinks or a page-level `<nav class="related">` block could turn the notebook into a dense graph.
- **Widget polish.** Some older pages still inline hex colors in SVG widgets; unify with CSS-variable references. See [TODO.md](./TODO.md) § F2.

## Dependency spine

A practical build order for the arithmetic arc when backfilling concept graphs:

1. `quadratic-reciprocity` → `frobenius-and-reciprocity`
2. `upper-half-plane-hyperbolic` → `modular-forms` → `hecke-operators`
3. `dirichlet-series-euler-products` + `modular-forms` + `elliptic-curves` → `L-functions`
4. `frobenius-and-reciprocity` + `representation-theory` → `galois-representations`
5. `algebraic-number-theory` + `galois` → `class-field-theory`
6. Side quests: `power-sums-bernoulli` + `dirichlet-series-euler-products` → `analytic-continuation`; `theta-functions` → `partitions-generating-functions`; `modular-forms` + `lie-groups` → `moonshine`.

Organizational dependencies for narrative flow and cross-linking, not hard technical build constraints.
