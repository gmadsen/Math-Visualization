# Plan

Forward-looking priorities for the notebook. Daily-workflow commands, one-time setup, architecture, conventions, and the full quiz/progression/callback story all live in [`AGENTS.md`](./AGENTS.md) — especially § "Common pitfalls". Project overview is in [`README.md`](./README.md).

When something ships, delete its bullet here. Don't keep a "Shipped recently" log — `git log` is the audit trail. The full step list of `rebuild.mjs` is in `scripts/rebuild.mjs` — refer to it rather than restating step names here.

## Corpus snapshot (2026-05-12)

From `audits/coverage-stats.md` and `audits/starter-concepts.md`:

- 174 topics, 1208 concepts, 34 capstones
- 149 concepts lack a widget in their owning section
- 1233 widgets, 100% registry-driven. 1229 interactive, 4 baselined-static SVG/table illustrations (`audit-widget-interactivity.mjs` is CI-gated via `audits/static-widgets-baseline.json`)
- Quiz tiers: v1 = 3582, hard = 1223, expert = 13 (intentionally bottom-of-list — see "Out of scope")
- Tag coverage: 99.1% across all 11 sections; tagging effort effectively complete
- 11 narrative-tour story pages on disk, all wired into Tours 1–11

## Missing-topic candidates

Distilled from comparisons against the Harvard / Princeton / MIT / Berkeley / Caltech grad catalogs. The Tier 1 Harvard list (several complex variables, cluster algebras, mapping class groups, Khovanov, complex multiplication, arithmetic statistics) all shipped in PRs #131–#140; Random matrix theory shipped in PR #155 and GIT in #156. The residual next-priority batch:

1. **Heegaard Floer / knot Floer homology** — Princeton MAT568, multiple universities. Bridges `knot-polynomials` (extended via Khovanov) to `symplectic-manifolds` and 3-manifold topology. Companion to surgery theory.
2. **Coding theory & error-correcting codes** — Caltech Ma 127. Hamming, Reed–Solomon, BCH, LDPC; lattice codes. Bridges `information-theory`, `additive-number-theory`, `mathematics-and-cryptography`. Highly visualizable.
3. **Conformal & CR geometry** — Princeton MAT558/559. Bridges `complex-analysis`, `several-complex-variables`, `differential-geometry`. Q-curvature and conformally covariant operators.
4. **Mathematical biology / population genetics** (potentially a new 12th section). Wright–Fisher, Moran, coalescent theory, evolutionary game theory, replicator dynamics, Lotka–Volterra. Zero coverage today — open question whether to open as its own section (orange/green accent) or fold under *Probability & statistics*. Section architecture is worth discussing before drafting.
5. **Combinatorial optimization** — Princeton MAT572. Min-max theorems, network flows, LP, perfect graphs, polyhedral combinatorics. Foundational for a proposed *Optimization* section.
6. **Mathematical finance & stochastic control** — Caltech Ma 214. Itô calculus applied to derivatives pricing, optimal portfolio selection, HJB equations. Bridges `stochastic-calculus` to the proposed *Optimization* / *Control theory* sections.
7. **Brill–Noether theory (standalone)** — Princeton MAT539. Currently a sub-bullet in `algebraic-curves-higher-genus`; deserves its own page given how often it's cited downstream.
8. **Spectral methods for massive data sets** — Princeton MAT585. SVD, PCA, PageRank, spectral clustering. Bridges `spectral-graph-theory`, `high-dimensional-geometry`, `random-walks-and-mixing`. Practical applications anchor.
9. **Donaldson–Thomas / GW invariants** — Princeton MAT566/567. Hinted in `mirror-symmetry` and `gauge-theory` but no dedicated page; closes the enumerative-AG gap.
10. **Positive characteristic AG** — Harvard Math 260Z. Frobenius splittings, $F$-singularities, char-$p$ phenomena. Partially covered by `crystalline-cohomology`.

**Specialty / deferred**:
- **Microlocal sheaves and $\mathcal{D}$-modules connections** — partially covered by `d-modules` + `microlocal-analysis`.
- **Computational molecular biology** (MIT 18.417/418), **mathematical chaos** (Caltech Ma 104) — would fit inside the proposed *Mathematical biology* section.
- **Topological data analysis / persistent homology** — currently a sub-bullet in `simplicial-complexes-combinatorial`; deserves its own page if the corpus pursues an applied-topology direction.

## Content-gap audit — long-running

A systematic pass: for each section, compare against a canonical reference (PCM, nLab, Wikipedia) and flag the missing standard topics. Right cadence is one section at a time, after a topic-drafting batch lands.

## Authoring polish — small

- **Index-card thumb art.** First curation pass replaced the 12 weakest thumbs; new topic-batch PRs ship motif art on every new card. Remaining surface is the pre-existing midbody.
- **Hoist semantic params out of verbatim slugs.** Roughly 175 per-widget verbatim slugs share `widgets/_shared/verbatim-renderer.mjs` with opaque `bodyMarkup`/`bodyScript` strings. Migrating them to bespoke renderers with semantic params (slider ranges, color tokens, etc.) lets AJV validation and alt frontends actually inspect each widget. Worth doing in batches by topic.

## Three.js / Pyodide / alt frontends (long-running)

- **Three.js adoption decision.** `examples/threejs-prototype/` validates the ceiling-raise for 3D-heavy topics. Would converge with `surface-viewer`. Requires AGENTS.md amendment on dependency policy.
- **Inline code cells for live examples.** `inline-code-cell` is a Web Worker JS sandbox; could be extended to Pyodide for sieves / sympy demos at the cost of a ~10MB CDN load.

## NPM packages — candidates worth evaluating

- **`cheerio`** over `node-html-parser` — richer for DOM manipulation in `inject-*`/`fix-*` scripts.
- **`katex` as a dependency** — would let `validate-katex.mjs` do real rendering instead of heuristic checks.

## Deferred review items

- **KaTeX macro-loader expansion.** Notation reviewer flagged `\Re`, `\vol`, `\End` as candidates that just crossed the threshold where defining once in the loader pays off. Currently rendering correctly via `\mathrm{...}` so cosmetic, not a bug.

Quiz items from PR #36 / #37 review (type-variety, hint coverage, trivia rewrites, blurb undercoverage) are deferred per "Out of scope".

## Out of scope

Items the user has explicitly de-prioritized. **Don't suggest these as "what next" without prompting.**

- **Hard-tier quiz authoring** (770 concepts lack hard tier).
- **Expert-tier authoring** (13 questions corpus-wide).

These are real coverage gaps but not where the user wants to spend time. Per-session feedback memory: lowest-leverage direction, structural/architectural improvements come first.

