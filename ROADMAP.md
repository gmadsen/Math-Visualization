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

1. Build the Wave 4 capstone pages.
2. Add concept maps for capstone topics so pathways can include them directly.
3. Add lightweight validation scripts for concept-graph integrity (ID resolution + cycle detection) to keep pathway metadata reliable.
