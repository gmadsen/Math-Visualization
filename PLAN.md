# Plan

Forward-looking priorities for the notebook. Daily-workflow commands, one-time setup, architecture, conventions, and the full quiz/progression/callback story all live in [`AGENTS.md`](./AGENTS.md) — especially § "Common pitfalls". Project overview is in [`README.md`](./README.md).

When something ships, delete its bullet here. Don't keep a "Shipped recently" log — `git log` is the audit trail. The full step list of `rebuild.mjs` is in `scripts/rebuild.mjs` — refer to it rather than restating step names here.

## Corpus snapshot (2026-06-05)

From `audits/coverage-stats.md` and `audits/starter-concepts.md`:

- 211 topics, 1446 concepts, 34 capstones
- 5 concepts lack a widget in their *own* span (langlands `global`/`functoriality`/`capstone`, motives `realization-functors`, hodge `hodge-as-realization`) — genuine gaps under the span-based metric (a sibling concept's widget sits elsewhere on the page); close with a correspondence/dictionary widget. See `audits/coverage-stats.md`.
- 1644 widgets, 100% registry-driven. Interactive baseline gated via `audits/static-widgets-baseline.json`
- Quiz tiers: v1 = 4294, hard = 1223, expert = 13 (intentionally bottom-of-list — see "Out of scope")
- Tag coverage: 99.1% across all 12 populated sections; tagging effort effectively complete
- 11 narrative-tour story pages on disk, all wired into Tours 1–11
- **All 13 sections now have content** — Control theory & optimization (section 12) has 9 topics, Learning theory & data science (section 13) has 9.

## Missing-topic candidates

Re-prime this list after the next Harvard / Princeton / MIT / Berkeley / Caltech catalog comparison. Standing notes:

- **Arithmetic geometry** is already covered in depth (~18 topics across Number theory + Algebraic geometry + Modular forms, incl. `heights-arithmetic-geometry`). No standalone page needed unless the corpus wants a connective landing.
- **Microlocal sheaves and $\mathcal{D}$-modules connections** — partially covered by `d-modules` + `microlocal-analysis`; standalone page only if the corpus pursues a deeper sheaf-theoretic-analysis direction.
- **Mathematical biology stays under Probability & statistics** (user decision, 2026-05-12). Wright–Fisher / Moran / Kimura diffusion / Kingman coalescent dominate; Lotka–Volterra and replicator dynamics sit as a deterministic detour. The section question is closed.

## Quality-pass polish tier (advisory)

190 per-topic audits sit under `audits/quality-pass-2026-05/` (plus `_SUMMARY.md`); the real-bug tier is already actioned. What remains is lower-severity polish: notation drift (`\mathrm` vs `\operatorname`, category-font inconsistency), undefined jargon, raw-ASCII widget readouts (`V_λ`, `pi_1`, `K_0`, `>=` in `.textContent`). **~30–50% of remaining flags are already-fixed false positives — verify each claim before editing.** Mine this directory before proposing any new audit pass.

## Authoring polish — small

- **Index-card thumb art.** Placeholder cards are CI-gated (`audit-draft-index-cards.mjs`). Remaining surface is the midbody (~15 cards judged already-strong but could be sharpened).
- **Verbatim widget slugs — migration at its natural end.** Roughly 66 per-widget verbatim slugs remain on `widgets/_shared/verbatim-renderer.mjs` (opaque `bodyMarkup`/`bodyScript`). Every *structurable* shape was already migrated onto the shared `slider-svg-2d` / `clickable-diagram` renderers. The remaining ~66 are uniformly multi-blocker with irregular bodies (readout-before-row, styled rows, leading prose, multi-element legends, empty/missing scripts) where structuring is bespoke per-widget effort with no shared-renderer leverage — correctly left verbatim. **Don't chase a `--normalize`/ordered-block mode for the tail — analysis confirmed it unlocks ~0–2 per attempt.** Full per-cluster breakdown in the `project_verbatim_semantic_migration` memory.

## Widget-variety program (in progress, 2026-06-05)

The corpus is gesture-skewed: ~83% click/slider, 99% 2D (`audits/coverage-stats.md` per-slug table). Goal: add new gesture *types* and deploy them across concepts to break the monotony (many pages — e.g. `dynamical-systems`, `probability-theory` — are ~all `button-stepper`).

- **`animated-svg-2d` (play gesture) — shipped** (#429). Self-contained play/pause + scrub timeline engine (author supplies `frame(t)`, `t∈[0,1]`). Homes: `convex-optimization §gradient-proximal` (#429), `markov-decision-processes §value-iteration` (#430), `combinatorial-optimization §lp-simplex` (simplex walk), `probability-theory §clt` (de Moivre–Laplace: exact standardized Binomial(n,½) PMF → 𝒩(0,1) as n grows), `numerical-analysis §quadrature` (trapezoid panels refine, sum → 2/π, error falls like 1/n² — animates what the static log–log plot measures). Roll out to more "watch it evolve" concepts where it isn't duplicative — note: parametric-plot time-sliders already *are* manual animations, so prefer concepts whose existing toy is static/structural/algebraic.
- **`sketch-curve-2d` (draw gesture) — shipped.** Self-contained "draw the input" engine: drag to sketch `f(x)`, a live transform responds (author supplies `draw(ys)`). Homes: `real-analysis §bounded-variation` (running total variation, #431), `convex-optimization §convex-sets-functions` (convexity test / convex envelope, #432), `real-analysis §ftc-both-parts` (running integral F(x)=∫₀ˣ f at true scale, F′=f live), `real-analysis §real-differentiation` (draw f, see f′ — smoothed + rescaled, steepest slope reported). Still open: running-sup transform.
- **`graph-edit-2d` (graph-edit gesture) — shipped.** Self-contained "build the graph" engine: click empty space to add a vertex, drag between two vertices to toggle an edge, click a vertex to delete it; the author's `draw(g)` re-renders the graph + a live invariant after each edit (reads `g.nodes`/`g.edges`/`g.adj`/`g.deg`/`g.n`/`g.m`/`g.R`). Homes: `spectral-graph-theory §kernel-components` (build a graph, watch components recolour — the manipulable face of dim ker L = #components), `spectral-graph-theory §bipartite-expanders` (live BFS 2-colouring — bipartite iff no odd cycle, conflict edge pink), `extremal-combinatorics §turan` (Mantel: build a triangle-free graph, race the bound ⌊n²/4⌋, triangles flagged pink), `graph-theory-fundamentals §trees` (spanning forest via union-find — tree edges green, cycle-closing edges pink, rank n−c = the graphic matroid). Roll out to greedy colouring / chromatic number, degree sequences, Eulerian/matching conditions, expanders.
- **`vector-field-flow-2d` (click-seed gesture) — shipped.** Self-contained "click to release a trajectory" engine for 2D autonomous flows: the reader clicks in the plane, the engine RK4-integrates the streamline (forward + backward) over a faint direction field; author supplies `field(x,y)` (+ optional `decorate(BG)` for fixed points / nullclines). Homes: `dynamical-systems §phase` (bistable flow ẋ=x−x³, ẏ=−y; two basins split by the y-axis separatrix), `dynamical-systems §limit-cycles` (Van der Pol — every orbit winds onto the same closed cycle), `dynamical-systems §conservative` (undamped pendulum ẋ=y, ẏ=−sin x — closed energy level-curves, center + saddles, no attractors), `mathematical-biology §lotka-volterra` (predator–prey ẋ=x(1−y), ẏ=y(x−1) — closed population cycles around coexistence, cross-topic), `deep-learning-theory §optimization` (gradient descent ẋ=−∇f on a four-well loss f=¼(x²−1)²+¼(y²−1)² — four basins, descent gets stuck in local minima, cross-topic). Roll out to spiral/saddle linear types and nullcline geometry — `dynamical-systems` is ~all `button-stepper` and the richest target.
- **Next gesture types to consider:** none queued — four new gesture engines now ship (play / draw / graph-edit / click-seed). Further variety comes from *rolling out* the four across the button-stepper-heavy pages (`dynamical-systems`, `probability-theory`), not new engines, unless a concept's gesture genuinely fits none. All four are jsdom-safe (no rAF/getScreenCTM at init); pattern per `widgets/animated-svg-2d` / `widgets/sketch-curve-2d` / `widgets/graph-edit-2d` / `widgets/vector-field-flow-2d`.
- **Close the 5 span-gaps** (above) with a correspondence/dictionary widget while broadening adoption of the existing `draggable-points-2d` (3 instances) and `surface-3d` (5) renderers.

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

- **Hard-tier quiz authoring** (1008 concepts lack hard tier).
- **Expert-tier authoring** (13 questions corpus-wide).

These are real coverage gaps but not where the user wants to spend time. Per-session feedback memory: lowest-leverage direction, structural/architectural improvements come first.

