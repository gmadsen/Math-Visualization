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
- ~~Flip `content/` to the source of truth~~ — *shipped 2026-04-24.* `rebuild.mjs` (fix mode) now auto-writes HTML from JSON via `test-roundtrip.mjs --fix`; CI (`--no-fix`) still fails on drift.
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

### Novel widgets

- **Proof/construction scrubber.** Timeline slider that replays a multi-step proof with synchronized narrative and diagram state.
- **Constraint / bifurcation explorer.** Set equations or inequalities, watch the feasible region update; expose singularities.
- **Counterexample generator.** UI for constructing pathological objects (non-continuous-but-integrable, non-Hausdorff) and checking which hypotheses fail.
- **Inline code cells.** Tiny sandboxed cells (plain JS or Pyodide) for sieves, modular arithmetic, and other computational topics.

### Maintainability & tooling

- **Lighter prose-block authoring format.** `content/<topic>.json` is now the source of truth (as of 2026-04-24, roundtrip runs in `--fix` mode and writes HTML from JSON), so prose blocks could move from raw HTML to a lighter authoring format (e.g. an mdx-lite subset, or a tag-whitelist dialect). The conversion needs to be reversible so existing prose round-trips through without loss.

### Stretch

- **Challenge mode.** Timed mixed-concept gauntlet; competitive-against-self.
- **Learner profiles.** Multiple profiles per browser, each with its own `MVProgress` slice.
- **Anki deck export** per topic.

## Capstone arc — higher topoi / internal logic / categorical logic (backlog)

A user-requested capstone in the spirit of Lurie's *Higher Topos Theory* that joins three threads: (1) intuitionist logic inside a category (Heyting algebras, internal language, Kripke–Joyal semantics); (2) classical Grothendieck toposes and their role in algebraic geometry; (3) ∞-categories and ∞-topoi. The capstone page is only viable once a supporting prereq arc exists — it's the algebraic-geometry-arc-sized project for the topos/higher-categorical corner of the notebook.

**Prereq topics to author first, foundational → advanced:**

1. **Elementary topos theory** — finitely complete cartesian closed categories with a subobject classifier Ω. Concept skeleton: terminal/product/equalizer, exponentials $B^A$, power object $P(A)$, subobject classifier, characteristic maps $\chi_S\colon X \to \Omega$, examples (Set, G-Set, presheaf toposes). Bridges from `category-theory` into the rest of the arc.
2. **Heyting algebras & intuitionist logic in toposes** — the user's explicit interest. Heyting-algebra structure on Ω, the Mitchell–Bénabou internal language, geometric morphisms, LEM failure and double-negation topology, Kripke–Joyal semantics. Widget candidates: Heyting-truth-value explorer (pick a Kripke frame, see which formulas are forced), subobject-classifier diagram, forcing-in-presheaves demo.
3. **Grothendieck topologies & sites** — coverings, sheafification, small vs large sites, topoi as sheaves of sets on a site, geometric morphisms between topoi. Feeds `etale-cohomology` and `sheaf-cohomology` (both partly cover this; pull it up as its own page so the capstone arc can depend on it).
4. **Simplicial sets & the nerve** — Δ, simplicial objects, geometric realization, nerve of a category, Kan complexes vs categorical nerves. Prerequisite for any ∞-category definition.
5. **∞-categories (quasi-categories)** — Joyal's inner-horn-filling model, homotopy category, functors/natural transformations up to homotopy, (co)limits ∞-categorically, adjunctions. Widget candidates: horn-filling visualizer (click to fill a 2-horn, watch the unique-up-to-homotopy composite appear), 2-simplex composition, a simplicial-set builder.
6. **Capstone: ∞-topoi & higher topos theory (Lurie)** — (∞,1)-sheaves on an ∞-site, ∞-topoi via left-exact accessible localizations of presheaf ∞-categories, Giraud axioms ∞-categorically, descent, hypercompletion. Closing sections gesture at the three cross-connections the user wanted:
   - **Internal logic ↔ algebraic geometry:** the étale topos of a scheme internalizes the theory of its sheaves; classical stalk-local reasoning = geometric-sequent reasoning in the internal language.
   - **Higher categorical algebra:** E_∞-rings, stable ∞-categories, spectrum objects — how ∞-topoi underlie derived algebraic geometry. (Likely a separate downstream capstone rather than bundled here — call out the entry point, don't try to develop it.)
   - **Realizability & effective toposes** — optional aside tying intuitionist logic back to computability.

**Scope note.** The arc is ~6 topics, comparable to the algebraic-geometry arc. Each of items 1–3 stands alone pedagogically, so the arc can land in order without blocking on the later ∞-categorical machinery. Only items 5–6 require the simplicial/∞ apparatus; items 1–4 are squarely classical category theory + sheaf theory and could ship first as a "Categorical logic mini-arc" that's valuable on its own.

**Place in the notebook.** New subject group `Categorical logic & higher category theory`, sitting next to the existing algebra/topology groups in `concepts/sections.json`. Or fold items 1–3 into the existing `algebra` section and reserve the new section for items 4–6.

**Cross-topic wiring to verify before authoring.** `category-theory` defines functors, natural transformations, adjunctions, limits — the arc will lean on all of these and may need concept promotions (e.g., "Kan extension" currently lives inline; promote to a first-class concept so item 5 can prereq it).

## Shipped recently

Don't enumerate — see `git log --oneline -30`. If you're unsure whether an item is already done, `node scripts/audit-doc-drift.mjs` will cross-reference this file against recent commits.

## Removed from prior plans

- The previous "Dependency spine" section (ordering advice for backfilling arithmetic-arc concept graphs) is gone. Those graphs are all complete; the validator catches cycles regardless. If the advice resurfaces as needed authoring guidance, it belongs under AGENTS.md § "Parallelization protocol" as an authoring recipe, not here.
- The stale step-count prose that claimed a six-item rebuild pipeline is gone. `scripts/rebuild.mjs` is the source of truth; refer to its STEPS array rather than restating the count here.
