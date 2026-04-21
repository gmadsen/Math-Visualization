# Plan

Forward-looking priorities and concrete next tasks for the notebook. For architecture and conventions, read [`AGENTS.md`](./AGENTS.md) first (especially § "Common pitfalls"); for project overview, see [`README.md`](./README.md) § "How the notebook is organized".

After any change, run:

```bash
node scripts/validate-concepts.mjs
node scripts/audit-callbacks.mjs
node scripts/insert-used-in-backlinks.mjs
node scripts/smoke-test.mjs
node scripts/build-concepts-bundle.mjs   # if concepts/*.json changed
node scripts/build-quizzes-bundle.mjs    # if quizzes/*.json changed
```

## Near-term tasks

- [ ] **Third-tier quiz schema wiring.** Two tiers (v1 + hard) are live. Extend `MVProgress` and `js/quiz.js` to support an optional `expert` sibling array per concept; add a third mastery ring to `pathway.html`; document the shape in `AGENTS.md § Quiz + progression`. No authoring required — just make the schema and UI accept a third tier.
- [ ] **Pathway study-plan export.** "Copy as study plan" button on `pathway.html` emitting a topologically-sorted Markdown reading list for the selected capstone's ancestors.
- [ ] **Stale-blurb audit.** Walk every concept in `concepts/*.json`, compare its blurb against the owning `<section>` content on its topic page, flag or rewrite any that drift. Small surface-area pass that meaningfully improves pathway preview text.
- [ ] **Color-var substitution audit.** Small script under `scripts/` that enumerates remaining hex literals in widget markup and flags matches against the palette vars. Prereq for a safe follow-up sweep past fan-out #4's substitutions.

## Exploratory / longer-term

- **Recency strip on `index.html`.** A "recently updated" module driven by the per-page `<details class="changelog">` footers.
- **Topic-page search.** Now that every page carries `data-section` / `data-level`, a small client-side filter on `index.html` becomes tractable.
- **Capstone story pages.** Some capstones (BSD, FLT, Sato–Tate) could ship a companion long-form narrative page distinct from the concept page — more essay, less widget.

## Dependency spine (reference)

When backfilling arithmetic-arc concept graphs, this ordering avoids cycles:

1. `quadratic-reciprocity` → `frobenius-and-reciprocity`
2. `upper-half-plane-hyperbolic` → `modular-forms` → `hecke-operators`
3. `dirichlet-series-euler-products` + `modular-forms` + `elliptic-curves` → `L-functions`
4. `frobenius-and-reciprocity` + `representation-theory` → `galois-representations`
5. `algebraic-number-theory` + `galois` → `class-field-theory`

Organizational, not technical — the validator checks cycles either way.
