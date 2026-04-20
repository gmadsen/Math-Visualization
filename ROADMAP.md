# Roadmap

## Current state

- **48 topic pages** linked from [`index.html`](./index.html), grouped into 7 sections: Foundations · Algebra · Analysis · Geometry & topology · Number theory · Modular forms & L-functions · Algebraic geometry.
- **10 concept graphs** registered in [`concepts/index.json`](./concepts/index.json) feeding [`pathway.html`](./pathway.html).
- **8 capstones** in [`concepts/capstones.json`](./concepts/capstones.json), grouped by section for the pathway `<optgroup>`.
- **8 quiz banks** under [`quizzes/`](./quizzes/) wired via the mastery loop in [`js/quiz.js`](./js/quiz.js) + [`js/progress.js`](./js/progress.js).
- Bundles ([`concepts/bundle.js`](./concepts/bundle.js), [`quizzes/bundle.js`](./quizzes/bundle.js)) make everything work from `file://` without a dev server. Regenerate after edits with `node scripts/build-concepts-bundle.mjs` and `node scripts/build-quizzes-bundle.mjs`.
- Validator ([`scripts/validate-concepts.mjs`](./scripts/validate-concepts.mjs)) is clean: 0 errors, 0 warnings.

Pages ship as iteratively-improvable v1 drafts. "Published" means reachable from the index and passing basic verification — not "final."

## Outstanding

1. **Concept graphs for 38 remaining pages.** Only 10 of 48 topics have concept metadata; [`pathway.html`](./pathway.html) can't reflect the full notebook until the rest are graphed. Priority order is the dependency spine below.
2. **Quiz banks for 40 remaining pages.** Only 8 pages ship with the Brilliant-style mastery loop wired.
3. **Re-attach stripped prereqs.** Wave 4 graphs dropped 19 external prereqs (`elliptic-curve`, `schemes`, `sheaves`, `frobenius-trace`, `hasse-bound`, `L-function-elliptic`, `modular-form`, `galois-representation`, `newform`, `conductor`, `fermat-last-theorem`, `equidistribution`, `euler-product`, `rational-points`, `sheaf-cohomology`) that reference not-yet-graphed topics. Restore them as each source topic gets a concept graph.
4. **Backfill concept anchors** inside [`measure-theory.html`](./measure-theory.html) and [`algebraic-topology.html`](./algebraic-topology.html) so their `concepts/*.json` entries land on valid in-page `id="…"` targets.
5. **Wave 4 expansion.** The four capstones shipped as tight 3-widget v1s; a future pass can expand each to ~5 widgets with richer exposition.

## Proposed improvements

- **Narrative side quests** off the main arc: `power-sums-bernoulli.html`, `waring.html`, `partitions-generating-functions.html`, `moonshine.html`, `analytic-continuation.html`.
- **Cross-page callbacks** — small "see also" panels linking concepts across pages (e.g. Frobenius angle on `sato-tate.html` back to `frobenius-and-reciprocity.html`).
- **Difficulty scaling** on quizzes — currently one tier; a harder tier per concept would extend the mastery loop.
- **Per-page changelogs** as `<details>` footer blocks so regressions and polish passes stay visible to readers.
- **Printable / offline bundle** — zip of the folder plus a lightweight `serve.sh` for workshops.
- **Automated smoke test in CI** (jsdom parse + widget count + validator) so page drift is caught before merging.

## Dependency spine

A practical build order for the arithmetic arc when backfilling concept graphs:

1. `quadratic-reciprocity` → `frobenius-and-reciprocity`
2. `upper-half-plane-hyperbolic` → `modular-forms` → `hecke-operators`
3. `dirichlet-series-euler-products` + `modular-forms` + `elliptic-curves` → `L-functions`
4. `frobenius-and-reciprocity` + `representation-theory` → `galois-representations`
5. `algebraic-number-theory` + `galois` → `class-field-theory`

Organizational dependencies for narrative flow and cross-linking, not hard technical build constraints.
