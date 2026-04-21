# Roadmap

## Current state

- **56 topic pages** linked from [`index.html`](./index.html), grouped into 7 sections: Foundations · Algebra · Analysis · Geometry & topology · Number theory · Modular forms & L-functions · Algebraic geometry. Three new narrative side-quests shipped in fan-out #4: `zeta-values`, `adeles-and-ideles`, `quadratic-forms-genus-theory`.
- **56 concept graphs · 318 concepts total** registered in [`concepts/index.json`](./concepts/index.json) feeding [`pathway.html`](./pathway.html). Each concept carries an `anchor` field used by the pathway DAG to deep-link `page.html#anchor` into the topic page — all 318 anchors resolve to matching `id="..."` sections. The anchor contract is documented in [`AGENTS.md`](./AGENTS.md) and enforced by the smoke test.
- **22 capstones** in [`concepts/capstones.json`](./concepts/capstones.json), grouped by section for the pathway `<optgroup>`. Sections match the index: Algebra (2), Analysis (6), Geometry & topology (3), Number theory (3), Modular forms & L-functions (6), Algebraic geometry (2). All four Wave-4 arithmetic capstones (`sato-tate`, `bsd`, `etale-cohomology`, `modularity-and-flt`) ship 9-widget v2s. Ancestry breadth has been broadened: the previously-shallow capstones (`solvability-by-radicals`, `yoneda-limits-adjunctions`, `ramanujan-congruences`, `quadratic-reciprocity-law`) now thread cross-topic prereqs from foundational pages.
- **Pathway page UX** ([`pathway.html`](./pathway.html)) ships with: search (`/` to focus, matches dim non-matching nodes), "next up" chip (`n` cycles ready concepts in topological order, with a pulse animation), help panel (`?`), zoom (mousewheel, 0.4×–2.5×) + pan (click-drag), section-color left stripe on each node, and a per-topic `<details id="bytopic">` progress block showing v1 + hard mastery rings grouped by topic.
- **56 quiz banks** under [`quizzes/`](./quizzes/) — one per topic (full coverage). **843 v1 questions + 829 hard-tier questions** (1,672 total) wired via the mastery loop in [`js/quiz.js`](./js/quiz.js) + [`js/progress.js`](./js/progress.js).
- **Two-tier quiz schema, full coverage**: every concept with a quiz entry (281 of 318) now carries both `questions` (v1) and `hard` sibling arrays. `MVProgress` tracks `v1` and `hard` mastery independently; `js/quiz.js` renders a "Harder tier" gate after v1 mastery; [`pathway.html`](./pathway.html) shows dual mastery rings (inner green v1, outer violet hard).
- **Bidirectional cross-references**: 171 forward-direction cross-topic prereq edges surface as `<aside class="callback">` "See also" panels on the host section ([`scripts/audit-callbacks.mjs`](./scripts/audit-callbacks.mjs), idempotent). 227 concepts carry a reverse-direction `<aside class="related">` "Used in" block listing downstream consumers ([`scripts/insert-used-in-backlinks.mjs`](./scripts/insert-used-in-backlinks.mjs), idempotent, capped at 6 items + "… and N more.").
- **Per-page changelog footers**: every topic page carries a `<details class="changelog">` footer seeded from `git log --follow` via [`scripts/insert-changelog-footer.mjs`](./scripts/insert-changelog-footer.mjs). Re-runnable to pick up new commits. Three brand-new side-quest pages retain a `2026-04-20 · initial version` placeholder until their first commit lands.
- Bundles ([`concepts/bundle.js`](./concepts/bundle.js), [`quizzes/bundle.js`](./quizzes/bundle.js)) make everything work from `file://` without a dev server. Regenerate after edits with `node scripts/build-concepts-bundle.mjs` and `node scripts/build-quizzes-bundle.mjs`.
- Validator ([`scripts/validate-concepts.mjs`](./scripts/validate-concepts.mjs)) is clean: 0 errors, 0 warnings.
- Callback audit ([`scripts/audit-callbacks.mjs`](./scripts/audit-callbacks.mjs)) is clean: all 171 cross-topic edges covered.
- Backlink audit ([`scripts/insert-used-in-backlinks.mjs`](./scripts/insert-used-in-backlinks.mjs)) is clean: all 227 concepts with downstream consumers carry a `<aside class="related">` block.
- Page smoke test ([`scripts/smoke-test.mjs`](./scripts/smoke-test.mjs)) is clean: 0 errors, 0 warnings; guards exactly one changelog footer per page, at least one callback on pages with cross-topic prereqs, and at most one backlinks aside per section.
- CI ([`.github/workflows/verify.yml`](./.github/workflows/verify.yml)) runs bundle builds + validator + callback audit + backlink audit + smoke test on every push to `main` and on PRs.
- Offline bundle: `node scripts/package-offline.mjs` produces `math-viz-notebook.zip` with a `serve.sh` helper for workshops.

Pages ship as iteratively-improvable v1/v2 drafts. "Published" means reachable from the index and passing basic verification — not "final."

## Outstanding

None — fan-out #4 closed the last Outstanding item (hard-tier quiz banks). Next wave is a fresh set of Proposed improvements; see below.

## Proposed improvements

- **Third-tier quizzes** — v1 and hard are live; a future "expert" tier could probe open-ended application (e.g. "given three Ramanujan congruences, derive the modular-form generating identity"). Schema-wise this is a sibling `"expert"` array, same as hard.
- **Pathway page: study-plan export** — a button on `pathway.html` that, given a capstone selection, exports a linear ordering of ancestors as Markdown or a `.ics` of suggested session blocks.
- **Widget polish** — 6-ish older pages still inline a handful of accent hex literals outside the color-var system (e.g. legacy `#58c4dd` matching `--blue`). A follow-up sweep could widen the substitution table once we're confident the palette rebind is stable.
- **Concept-level stale-blurb audit** — some blurbs predate anchor-contract enforcement; a one-pass review could tighten pathway preview text. Low priority; easy to grab when touching adjacent files.

## Recently shipped (fan-out #4, 2026-04-20)

- Hard-tier quiz banks across all 56 topics (A1–A53 + the three new side-quests), 281 concept entries, 829 hard questions.
- Three new narrative side-quest pages: `zeta-values.html`, `adeles-and-ideles.html`, `quadratic-forms-genus-theory.html`. Registered in `concepts/index.json`, `index.html`, and the concept-graph/quiz bundles.
- Capstone prereq-threading (G1–G4): `solvability-by-radicals`, `yoneda-limits-adjunctions`, `ramanujan-congruences`, `quadratic-reciprocity-law` now reach into cross-topic foundational concepts.
- Bidirectional "used in" backlinks shipped via `scripts/insert-used-in-backlinks.mjs`; 227 `<aside class="related">` blocks inserted.
- Color-token cleanup (F2): ~95 hex literals across 58 files replaced with `var(--*)` references; `.callback` and `.related` borders now use `color-mix` on palette vars.
- AGENTS.md consolidated "Common pitfalls" checklist (F3).

## Dependency spine (unchanged from previous wave)

A practical build order for the arithmetic arc when backfilling concept graphs:

1. `quadratic-reciprocity` → `frobenius-and-reciprocity`
2. `upper-half-plane-hyperbolic` → `modular-forms` → `hecke-operators`
3. `dirichlet-series-euler-products` + `modular-forms` + `elliptic-curves` → `L-functions`
4. `frobenius-and-reciprocity` + `representation-theory` → `galois-representations`
5. `algebraic-number-theory` + `galois` → `class-field-theory`
6. Side quests: `power-sums-bernoulli` + `dirichlet-series-euler-products` → `analytic-continuation`; `theta-functions` → `partitions-generating-functions`; `modular-forms` + `lie-groups` → `moonshine`.

Organizational dependencies for narrative flow and cross-linking, not hard technical build constraints.
