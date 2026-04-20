# Roadmap

This roadmap tracks the arithmetic / automorphic expansion of the Interactive Mathematics Notebook, using:
- **Fearless Symmetry** (Ash & Gross)
- **Summing It Up** (Ash & Gross)
- **Elliptic Tales** (Ash & Gross)

## Current state (April 2026)

- **41 topic pages** are published and linked from [`index.html`](./index.html).
- The index is organized into **6 sections**:
  1. Algebra
  2. Analysis
  3. Geometry & topology
  4. Number theory
  5. Modular forms & L-functions
  6. Algebraic geometry
- Pathway prerequisites are now multi-topic via [`concepts/index.json`](./concepts/index.json), including:
  - [`concepts/complex-analysis.json`](./concepts/complex-analysis.json)
  - [`concepts/real-analysis.json`](./concepts/real-analysis.json)
  - [`concepts/topology.json`](./concepts/topology.json)
- A concept-graph validator lives at [`scripts/validate-concepts.mjs`](./scripts/validate-concepts.mjs) (run via `node scripts/validate-concepts.mjs`; exit 0 clean, exit 1 on errors).

## Page status and refinement

Pages ship as iteratively-improvable v1 drafts. Each page is a candidate for later passes that sharpen exposition, add widgets, or expand quizzes. Treat "published" as "reachable from the index and passing basic verification" — not "final."

Known gaps to close over time:

- **Concept graphs**: only 3 of 41 topics (`complex-analysis`, `real-analysis`, `topology`) have `concepts/<topic>.json` registered in [`concepts/index.json`](./concepts/index.json). The remaining 38 pages have no pathway metadata. Partial artifacts exist for `sato-tate` (JSON written, HTML pending).
- **Quizzes**: only `quizzes/complex-analysis.json` exists; most pages ship without the Brilliant-style mastery loop wired up.
- **Validator findings (as of 2026-04-20)**: `concepts/real-analysis.json` and `concepts/topology.json` are missing `anchor` and `blurb` on all 9 of their concepts. No duplicate ids, no broken prereqs, no cycles.
- **Wave 4 capstones**: listed in the Wave 4 section below — not yet drafted. Drafting a full capstone page (5 widgets, ~30KB HTML) in a single parallel agent has repeatedly tripped the stream-idle timeout; next attempts should chunk per-section or narrow scope.

Per-page refinement is tracked ad hoc: open an issue or a follow-up task rather than listing every page's wishlist here.

## Progress by wave

### Wave 1 — Classical gateways (completed)
- `quadratic-reciprocity.html`
- `sums-of-squares.html`
- `projective-plane.html`
- `p-adic-numbers.html`
- `upper-half-plane-hyperbolic.html`

### Wave 2 — Core machinery (completed)
- `bezout.html`
- `modular-forms.html`
- `singular-cubics-reduction.html`
- `frobenius-and-reciprocity.html`
- `dirichlet-series-euler-products.html`

### Wave 3 — Representations and analysis (completed)
- `galois-representations.html`
- `hecke-operators.html`
- `theta-functions.html`
- `L-functions.html`
- `class-field-theory.html`

### Wave 4 — Capstones (planned)
- `etale-cohomology.html`
- `modularity-and-flt.html`
- `bsd.html`
- `sato-tate.html`

## Optional side quests (planned)

- `power-sums-bernoulli.html`
- `waring.html`
- `partitions-generating-functions.html`
- `moonshine.html`
- `analytic-continuation.html`

## Dependency spine

A practical reading/build order for the arithmetic arc:

1. `quadratic-reciprocity` → `frobenius-and-reciprocity`
2. `upper-half-plane-hyperbolic` → `modular-forms` → `hecke-operators`
3. `dirichlet-series-euler-products` + `modular-forms` + `elliptic-curves` → `L-functions`
4. `frobenius-and-reciprocity` + `representation-theory` → `galois-representations`
5. `algebraic-number-theory` + `galois` → `class-field-theory`

These are organizational dependencies for narrative flow and cross-linking, not hard technical build constraints.

## Next priorities

1. Draft the Wave 4 capstone pages, chunked to fit agent time budgets (one section per pass, or narrower 3-widget v1s that later waves expand).
2. Backfill concept maps across the existing 41 pages so [`pathway.html`](./pathway.html) reflects the full notebook, not just analysis/topology.
3. Fill in the `anchor` and `blurb` fields flagged by `scripts/validate-concepts.mjs` in `real-analysis.json` and `topology.json`, then keep the validator green in CI-equivalent checks.
4. Refine published pages iteratively: quiz coverage, widget polish, cross-page callbacks.
