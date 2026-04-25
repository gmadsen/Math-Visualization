# Plan

Forward-looking priorities for the notebook. Daily-workflow commands, one-time setup, architecture, conventions, and the full quiz/progression/callback story all live in [`AGENTS.md`](./AGENTS.md) — especially § "Common pitfalls". Project overview is in [`README.md`](./README.md).

When something ships, delete its bullet here. The full step list of `rebuild.mjs` is in `scripts/rebuild.mjs` — refer to it rather than restating step names here.

## Portable data model — what's next

Context: the widget registry covers 450/452 widgets across 10 shared renderer slugs (see `widgets/README.md`). `content/<topic>.json` is source of truth as of 2026-04-24; `rebuild.mjs --no-fix` enforces byte-identical roundtrip in CI. Two prototype alternate frontends live under `examples/`. For the full landing trail, see `git log --oneline --grep='Phase [0-9]'`.

**Remaining inline widgets (2/452, genuinely idiosyncratic — skip or custom-module):**

- `galois/w-quintic-scrub`: uses `MVProofScrubber` with per-step `render(svg)` JS closures over local helpers. Closures aren't data; can't migrate to declarative form.
- `class-field-theory/w-dict`: static `<div class="dict">` grid, no script, no svg. Would need a "static-grid" renderer — not worth a module for one widget.

**Next moves (non-content):**

- Full-topic React frontend: current POC under `examples/react-consumer/` renders one widget; next is rendering a whole topic from `content/<topic>.json` + the registry. All 10 slugs should work since `renderMarkup` / `renderScript` are pure string functions.
- Three.js adoption decision: the `examples/threejs-prototype/` validates the ceiling-raise for 3D-heavy topics (Riemannian geometry, Lie groups, Riemann surfaces, moduli). Would converge with the existing `surface-viewer` slug. Requires an `AGENTS.md` amendment — the current rule is "no deps beyond KaTeX."
- Lighter prose-block authoring format: prose blocks could move from raw HTML to an mdx-lite / tag-whitelist dialect. Needs reversibility so existing prose round-trips without loss.

## Authoring ergonomics — open

- **Adding a concept to an existing topic** currently means editing `concepts/<topic>.json`, the matching section in `<topic>.html`, the quiz bank, and re-extracting `content/<topic>.json`. A `new-concept` scaffold could do all four (`new-topic.mjs` and `new-widget.mjs` are the templates).

## Script audit — overlap to assess

46 scripts in `scripts/`. The non-consolidated ones should be reviewed for necessity and overlap:

- **Candidates to merge or drop:**
  - `audit-responsive.mjs` overlaps with `audit-accessibility.mjs`.
  - `audit-notation.mjs`, `audit-worked-examples.mjs`, `audit-blurb-question-alignment.mjs` — low-usage; confirm whether signal is worth the maintenance.
- **Consolidation candidates:** `validate-concepts.mjs`, `audit-widget-interactivity.mjs`, `audit-cross-page-consistency.mjs` all re-implement concept/topic loading. Could import `loadContentModel()`.

A one-afternoon pass could probably cut 5–8 scripts without losing signal.

## NPM packages — candidates worth evaluating

Hand-rolled code that has mature npm equivalents:

- **`cheerio`** over `node-html-parser` — cheerio is richer for DOM manipulation in the `inject-*`/`fix-*` scripts, though it's heavier (node-html-parser suits perf-sensitive parsing of 58 topic HTMLs).
- **`katex` as a dependency** (not just a CDN loader) — would let `validate-katex.mjs` do real rendering instead of heuristic structural checks. Catches more bugs but slower.
- **`remark` + `rehype`** — if we ever convert prose blocks to Markdown, this is the standard ecosystem. Not needed today.

## Content gaps

From `audits/coverage-stats.md`:

- 2298 total quizzes, 1160 v1 / 1125 hard / **only 13 expert** — the expert tier is barely populated.
- 100 concepts lack a widget in their section.
- 21 concepts lack a hard-tier quiz.

## Near-term tasks

### Novel widgets

- **Proof/construction scrubber.** Timeline slider that replays a multi-step proof with synchronized narrative and diagram state.
- **Constraint / bifurcation explorer.** Set equations or inequalities, watch the feasible region update; expose singularities.
- **Counterexample generator.** UI for constructing pathological objects (non-continuous-but-integrable, non-Hausdorff) and checking which hypotheses fail.
- **Inline code cells.** Tiny sandboxed cells (plain JS or Pyodide) for sieves, modular arithmetic, and other computational topics.

### Stretch

## Capstone arc — higher topoi / internal logic / categorical logic (backlog)

A user-requested capstone in the spirit of Lurie's _Higher Topos Theory_ that joins three threads: (1) intuitionist logic inside a category (Heyting algebras, internal language, Kripke–Joyal semantics); (2) classical Grothendieck toposes and their role in algebraic geometry; (3) ∞-categories and ∞-topoi. The capstone page is only viable once a supporting prereq arc exists — it's the algebraic-geometry-arc-sized project for the topos/higher-categorical corner of the notebook.

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
