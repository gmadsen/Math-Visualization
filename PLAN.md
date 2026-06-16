# Plan

Forward-looking priorities for the notebook. Daily-workflow commands, one-time setup, architecture, conventions, and the full quiz/progression/callback story all live in [`AGENTS.md`](./AGENTS.md) — especially § "Common pitfalls". Project overview is in [`README.md`](./README.md).

When something ships, delete its bullet here. Don't keep a "Shipped recently" log — `git log` is the audit trail. The full step list of `rebuild.mjs` is in `scripts/rebuild.mjs` — refer to it rather than restating step names here.

## Corpus snapshot (2026-06-10)

From `audits/coverage-stats.md` and `audits/starter-concepts.md`:

- 211 topics, 1446 concepts, 34 capstones
- 5 concepts lack a widget in their *own* span (langlands `global`/`functoriality`/`capstone`, motives `realization-functors`, hodge `hodge-as-realization`) — genuine gaps under the span-based metric (a sibling concept's widget sits elsewhere on the page); close with a correspondence/dictionary widget. See `audits/coverage-stats.md`.
- 1703 widgets, 100% registry-driven. Interactive baseline gated via `audits/static-widgets-baseline.json`
- Quiz tiers: v1 = 4294, hard = 1223, expert = 13 (intentionally bottom-of-list — see "Out of scope")
- Tag coverage: 99.1% across all 12 populated sections; tagging effort effectively complete
- 11 narrative-tour story pages on disk, all wired into Tours 1–11
- **All 13 sections now have content** — Control theory & optimization (section 12) has 9 topics, Learning theory & data science (section 13) has 9.

## Near-term tasks

The 2026-06-11 meta-layer audit program (defer-race fixes, validate-meta-pages gate, mastery-awareness on every meta page, who's-who, open-problems, tags theme bars) shipped in full over #512–#519 — `git log` is the record. The explicit open queue, roughly in value order:

1. **Meta-page candidates (not yet greenlit — ask before building):** counterexamples gallery (aggregate the existing counterexample widgets), syllabus builder (pathway copy-plan grown into a self-checking checklist page), exam mode (timed mixed quiz over mastered concepts — check review.html's role first).
2. **Feature-improvement backlog** (one small PR each, pick by appetite):
   - *Cross-cutting*: unify deep-link param conventions (`?goal=` / `?tour=` / `?q=` invented independently). Note: `history.html` now accepts both `?capstone=` and `?q=` (#540), and `search.html` uses `?q=` — a `?q=` convention is emerging.
3. **Themes / display polish:** light-theme widget eyeball pass (dark-tuned `fill-opacity`/glows wash out).

## Missing-topic candidates

Re-prime this list after the next Harvard / Princeton / MIT / Berkeley / Caltech catalog comparison. Vetted candidates from the 2026-06-11 catalog cross-check (strong tier first): **percolation theory** (glaring Probability gap; click-to-open bonds, giant cluster), **fluid dynamics / Navier–Stokes** (Math-physics gap + millennium-capstone tie-in), **online learning & bandits** (canonical Learning-theory gap, bridges to RL), **compressed sensing** (sparse recovery by L1 — great interactive story), **proof theory** (the Logic section description promises it; no topic delivers), **descriptive set theory**, **transcendence theory** (Liouville/Lindemann/Baker, very visualizable), **sieve methods**. Second tier: extreme value theory, stochastic PDEs, conformal field theory, combinatorial game theory (Sprague–Grundy is widget-friendly), Teichmüller theory, perfectoid spaces (hard to make interactive), approximation theory, queueing theory. Standing notes:

- **Arithmetic geometry** is already covered in depth (~18 topics across Number theory + Algebraic geometry + Modular forms, incl. `heights-arithmetic-geometry`). No standalone page needed unless the corpus wants a connective landing.
- **Microlocal sheaves and $\mathcal{D}$-modules connections** — partially covered by `d-modules` + `microlocal-analysis`; standalone page only if the corpus pursues a deeper sheaf-theoretic-analysis direction.
- **Mathematical biology stays under Probability & statistics** (user decision, 2026-05-12). Wright–Fisher / Moran / Kimura diffusion / Kingman coalescent dominate; Lotka–Volterra and replicator dynamics sit as a deterministic detour. The section question is closed.

## Quality-pass polish tier (advisory)

190 per-topic audits sit under `audits/quality-pass-2026-05/` (plus `_SUMMARY.md`); the real-bug tier is already actioned. What remains is lower-severity polish: notation drift (`\mathrm` vs `\operatorname`, category-font inconsistency), undefined jargon, raw-ASCII widget readouts (`V_λ`, `pi_1`, `K_0`, `>=` in `.textContent`). **~30–50% of remaining flags are already-fixed false positives — verify each claim before editing.** Mine this directory before proposing any new audit pass.

## Authoring polish — small

- **Index-card thumb art.** Placeholder cards are CI-gated (`audit-draft-index-cards.mjs`). Remaining surface is the midbody (~15 cards judged already-strong but could be sharpened).
- **Verbatim widget slugs — migration at its natural end.** Roughly 66 per-widget verbatim slugs remain on `widgets/_shared/verbatim-renderer.mjs` (opaque `bodyMarkup`/`bodyScript`). Every *structurable* shape was already migrated onto the shared `slider-svg-2d` / `clickable-diagram` renderers. The remaining ~66 are uniformly multi-blocker with irregular bodies (readout-before-row, styled rows, leading prose, multi-element legends, empty/missing scripts) where structuring is bespoke per-widget effort with no shared-renderer leverage — correctly left verbatim. **Don't chase a `--normalize`/ordered-block mode for the tail — analysis confirmed it unlocks ~0–2 per attempt.** Full per-cluster breakdown in the `project_verbatim_semantic_migration` memory.

## Widget-variety program (rollout phase)

**24 gesture engines ship** (play / draw / graph-edit / click-seed / drag-basis / drag-probe / drag-on-curve / drag-direction / drag-contour / drag-along-curve / dial / two-param-scrub / pour-update / step-state / shake-sample / construct-to-break / click-multiply / wind-loop / ladder-op / slide-band / compose-evaluate / drag-reflect / fold-glue / edit-grid), all jsdom-safe. The gesture-variety watchlist is **COMPLETE** (#476–#510): 87/211 topics offer a genuine direct-manipulation gesture; the remaining ~124 watchlist entries are scrub/pick-only **by design** (their objects have no spatial handle) — do NOT re-open the list from coverage-stats without a genuinely distinct gesture idea for a specific topic. Per-engine specs live in `widgets/<slug>/README.md`; program history in `git log` + the `project_gesture_variety_watchlist_program` / `project_widget_variety_*` memories. `vector-field-flow-2d` is saturated (8 homes covering every standard 2D flow type) — skip further deploys.

Open rollout ideas (one PR each; ship only where not duplicative — an existing static widget is the new gesture's HOME, not a blocker):

- `animated-svg-2d` → more "watch it evolve" concepts whose existing toy is static/structural (parametric-plot time-sliders already are manual animations).
- `sketch-curve-2d` → running-sup transform.
- `graph-edit-2d` → greedy colouring / chromatic number, degree sequences, Eulerian/matching conditions, expanders.
- `linear-transform-2d` → Jacobian (change of variables), change of basis, GL/SL group actions.
- `complex-map-2d` → Möbius / disk automorphisms, $e^z$, critical points.
- `contour-residue-2d` → argument principle (zeros−poles), winding number.
- `osculating-circle-2d` → evolute as a locus, parabola/spiral curvature, Frenet radius-of-curvature.
- `bifurcation-1d` → Hopf (2-D limit-cycle birth), saddle-node-of-cycles.
- `xy-parameter-pad` → discriminant planes, option-Greek surfaces, two-parameter bifurcation unfoldings.
- `bayes-mass-updater` → Gamma–Poisson conjugacy, PGM inference, Kalman/POMDP belief, observe-vs-intervene.
- `algorithm-stepper` → Gaussian elimination, Gram–Schmidt, simplex, Dijkstra, Buchberger, RSK.
- `sampling-box` → Buffon's needle, Monte-Carlo π.
- `shatter-arena` → axis-aligned rectangles (VC 4), intervals (VC 2), disks (VC 3); the ε–δ-duel sibling stays lower-tier.
- `eigenvector-explorer-2d` → quadratic-form principal axes, PCA/covariance, linearization invariant directions.
- **Close the 5 span-gaps** (see Corpus snapshot) with a correspondence/dictionary widget; `surface-3d` (5 instances) remains under-adopted for 3D landscapes.

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

