# Roadmap

## Current state

- **48 topic pages** linked from [`index.html`](./index.html), grouped into 7 sections: Foundations · Algebra · Analysis · Geometry & topology · Number theory · Modular forms & L-functions · Algebraic geometry.
- **48 concept graphs · 200 concepts total** registered in [`concepts/index.json`](./concepts/index.json) feeding [`pathway.html`](./pathway.html). Each concept carries an `anchor` field used by the pathway DAG to deep-link `page.html#anchor` into the topic page — currently 200/200 anchors resolve to matching `id="..."` sections. The anchor contract is documented in [`AGENTS.md`](./AGENTS.md) and enforced by the smoke test.
- **8 capstones** in [`concepts/capstones.json`](./concepts/capstones.json), grouped by section for the pathway `<optgroup>`.
- **48 quiz banks** under [`quizzes/`](./quizzes/) — one per topic (full coverage), 489 questions total — wired via the mastery loop in [`js/quiz.js`](./js/quiz.js) + [`js/progress.js`](./js/progress.js).
- Bundles ([`concepts/bundle.js`](./concepts/bundle.js), [`quizzes/bundle.js`](./quizzes/bundle.js)) make everything work from `file://` without a dev server. Regenerate after edits with `node scripts/build-concepts-bundle.mjs` and `node scripts/build-quizzes-bundle.mjs`.
- Validator ([`scripts/validate-concepts.mjs`](./scripts/validate-concepts.mjs)) is clean: 0 errors, 0 warnings.
- Page smoke test ([`scripts/smoke-test.mjs`](./scripts/smoke-test.mjs)) is clean: 0 errors, 0 warnings.

Pages ship as iteratively-improvable v1 drafts. "Published" means reachable from the index and passing basic verification — not "final."

## Outstanding

1. **Wave 4 capstone expansion.** The four arithmetic capstones (`sato-tate`, `bsd`, `etale-cohomology`, `modularity-and-flt`) shipped as tight 3-widget v1s; a future pass can expand each to ~5 widgets with richer exposition. See [TODO.md](./TODO.md) § Section C for per-page candidates.
2. **Remaining under-resolved concept graphs.** 35 of 48 graphs still carry exactly 3 concepts (down from 39). Distribution: 35 × 3, 4 × 4, 1 × 5, 2 × 6, 4 × 7 (`lie-groups`, `schemes`, `sheaves`, `smooth-manifolds` — expanded in the 2026-04-20 overnight pass), 1 × 8, 1 × 26 (`complex-analysis`). Remaining dense candidates: `commutative-algebra`, `class-field-theory`, `homological`, `representation-theory`, and 31 others. See [TODO.md](./TODO.md) § Section D (D4, D6–D39) for the per-topic queue.
3. **Quiz depth.** Current banks ship ~3 questions per concept at one difficulty tier; a harder tier per concept would extend the mastery loop (see Proposed improvements).

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
