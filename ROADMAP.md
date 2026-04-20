# Roadmap

## Current state

- **48 topic pages** linked from [`index.html`](./index.html), grouped into 7 sections: Foundations · Algebra · Analysis · Geometry & topology · Number theory · Modular forms & L-functions · Algebraic geometry.
- **48 concept graphs · 184 concepts total** registered in [`concepts/index.json`](./concepts/index.json) feeding [`pathway.html`](./pathway.html). Each concept carries an `anchor` field used by the pathway DAG to deep-link `page.html#anchor` into the topic page — currently 184/184 anchors resolve to matching `id="..."` sections.
- **8 capstones** in [`concepts/capstones.json`](./concepts/capstones.json), grouped by section for the pathway `<optgroup>`.
- **18 quiz banks** under [`quizzes/`](./quizzes/) wired via the mastery loop in [`js/quiz.js`](./js/quiz.js) + [`js/progress.js`](./js/progress.js).
- Bundles ([`concepts/bundle.js`](./concepts/bundle.js), [`quizzes/bundle.js`](./quizzes/bundle.js)) make everything work from `file://` without a dev server. Regenerate after edits with `node scripts/build-concepts-bundle.mjs` and `node scripts/build-quizzes-bundle.mjs`.
- Validator ([`scripts/validate-concepts.mjs`](./scripts/validate-concepts.mjs)) is clean: 0 errors, 0 warnings.
- Page smoke test ([`scripts/smoke-test.mjs`](./scripts/smoke-test.mjs)) is clean: 0 errors, 4 warnings (orphan quiz banks — see Outstanding #2).

Pages ship as iteratively-improvable v1 drafts. "Published" means reachable from the index and passing basic verification — not "final."

## Outstanding

1. **Quiz banks for 30 remaining pages.** 18 of 48 pages ship with a quiz bank; the Brilliant-style mastery loop is wired on the 14 pages whose HTML carries `.quiz` placeholders.
2. **Orphan quiz banks.** 4 banks exist whose pages have no `.quiz` placeholders yet: `hecke-operators`, `modular-forms`, `quadratic-reciprocity`, `upper-half-plane-hyperbolic`. Add per-concept placeholders and an `MVQuiz.init('<topic>')` block to wire each.
3. **Wave 4 expansion.** The four capstones shipped as tight 3-widget v1s; a future pass can expand each to ~5 widgets with richer exposition.
4. **Under-resolved concept graphs.** 39 of 48 graphs ship with exactly 3 concepts — a cookie-cutter shape inherited from the initial Codex backfill. Distribution: 39 × 3, 4 × 4, 1 × 5, 2 × 6, 1 × 8, 1 × 26 (`complex-analysis`, hand-authored). Dense pages — `lie-groups`, `schemes`, `sheaves`, `modular-forms`, `algebraic-topology`, `commutative-algebra`, `smooth-manifolds`, `class-field-theory`, etc. — deserve 5–7 concepts so the pathway DAG exposes real prerequisite structure instead of a flat trio per topic.
5. **Concept → subsection links.** Every concept already carries an `anchor` field and `pathway.html` renders an "open page →" link to `topic.html#anchor`. Today all 184 anchors resolve, but there is no smoke-test guard — drift would fail silently. Worth baking an anchor-resolution check into `scripts/smoke-test.mjs`, and documenting the contract in [`AGENTS.md`](./AGENTS.md) so new concepts land with anchors that match an existing section id.

## Proposed improvements

- **Narrative side quests** off the main arc: `power-sums-bernoulli.html`, `waring.html`, `partitions-generating-functions.html`, `moonshine.html`, `analytic-continuation.html`.
- **Cross-page callbacks** — small "see also" panels linking concepts across pages (e.g. Frobenius angle on `sato-tate.html` back to `frobenius-and-reciprocity.html`).
- **Difficulty scaling** on quizzes — currently one tier; a harder tier per concept would extend the mastery loop.
- **Per-page changelogs** as `<details>` footer blocks so regressions and polish passes stay visible to readers.
- **Printable / offline bundle** — zip of the folder plus a lightweight `serve.sh` for workshops.
- **Wire smoke test + validator into CI** so page drift (truncated HTML, broken quiz wiring, unresolved prereqs) is caught before merging.

## Dependency spine

A practical build order for the arithmetic arc when backfilling concept graphs:

1. `quadratic-reciprocity` → `frobenius-and-reciprocity`
2. `upper-half-plane-hyperbolic` → `modular-forms` → `hecke-operators`
3. `dirichlet-series-euler-products` + `modular-forms` + `elliptic-curves` → `L-functions`
4. `frobenius-and-reciprocity` + `representation-theory` → `galois-representations`
5. `algebraic-number-theory` + `galois` → `class-field-theory`

Organizational dependencies for narrative flow and cross-linking, not hard technical build constraints.
