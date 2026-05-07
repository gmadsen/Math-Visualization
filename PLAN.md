# Plan

Forward-looking priorities for the notebook. Daily-workflow commands, one-time setup, architecture, conventions, and the full quiz/progression/callback story all live in [`AGENTS.md`](./AGENTS.md) — especially § "Common pitfalls". Project overview is in [`README.md`](./README.md).

When something ships, delete its bullet here. Don't keep a "Shipped recently" log — `git log` is the audit trail. The full step list of `rebuild.mjs` is in `scripts/rebuild.mjs` — refer to it rather than restating step names here.

## Corpus snapshot (2026-05-09)

From `audits/coverage-stats.md` and `audits/starter-concepts.md`:

- 163 topics, 1140 concepts, 34 capstones
- 177 concepts lack a widget in their owning section
- 1035 widgets, 100% registry-driven (PR #70 zero-baseline sweep — `audit-no-inline-widgets` now hard-fails on any non-registry widget)
- Quiz tiers: v1 = 3378, hard = 1223, expert = 13 (intentionally bottom-of-list — see "Out of scope")
- Tag coverage: **99.1%** across all 11 sections after PRs #84–#88 + #94–#98. The intentionally-untagged concepts are catalog/TOC blurbs (`*-applications`), single-result rigidity (Apéry's $\zeta(3)$ irrationality), or observation-shaped concepts (lem-failure, algebraic-connectivity Fiedler). Vocabulary expanded in PR #94 with `equidistribution`, `density`, `cancellation`, `refinement` to cover analytic-NT methods and $\infty$-topos refinement properties. Tagging effort effectively complete.
- 11 narrative-tour story pages on disk, all wired into Tours 1–11: BSD, FLT, Sato–Tate (Tour 11), Cohomology (Tour 3), Sets→∞-topoi (Tour 4), Sound→Wavelets (Tour 5), Local–Global (Tour 6), Solvability (Tour 7), Hodge (Tour 8), Langlands (Tour 9), Millennium Prizes (Tour 10).

## Near-term tasks

Items below come out of the algebra/analysis comparative audit shipped in PR #49.

- **Math physics has no `hard` tier and Combinatorics has no `hard` tier.** 702 concepts lack a hard tier corpus-wide; 13 topics in those two sections × ~6 concepts × 2-3 questions each ≈ ~150 of the missing questions. Per "Out of scope", de-prioritized — listed here so the gap is visible, not actioned.

## Bigger missing-topic candidates

The original [`audits/topic-gap-analysis.md`](./audits/topic-gap-analysis.md) recommendations (cohomology-and-duality, toric-varieties, iwasawa-theory) all shipped in PRs #121–#125, along with 18 other gap-audit topics. The next-generation candidates below come from a comparison against the **Harvard math grad course catalog** (https://www.math.harvard.edu/graduate/) — courses listed there for which our corpus has no dedicated page.

In priority order:

1. **Several complex variables & Stein manifolds** (Analysis / Algebraic geometry bridge). Hartogs phenomenon, plurisubharmonic functions, the ∂̄-equation, Stein manifolds, Levi pseudoconvexity, sheaf cohomology of $\mathcal{O}_X$. Currently `advanced-complex-analysis` mentions Hartogs in passing but the subject is one-variable; SCV is a distinct discipline that bridges to Kähler geometry, deformation theory, and crystalline / D-module work. Highly visualizable (boundary geometry, Reinhardt domains, Hartogs figures).

2. **Cluster algebras** (Combinatorics / Algebra bridge). Fomin–Zelevinsky theory, mutations and exchange relations, Y-systems, cluster categories, examples on the Grassmannian and Teichmüller space. Currently mentioned only in `enumerative-combinatorics` and `quantum-groups`; Harvard's Math 264Y is a full graduate course. Strong fit for the notebook's interactive aesthetic — mutations are click-by-click animations of quivers.

3. **Mapping class groups & low-dimensional topology** (Geometry & topology). Dehn twists, the Nielsen–Thurston classification, the Teichmüller-space link, 4-manifold fundamentals (smooth vs topological structures, Freedman, Casson invariant). Pairs nicely with `gauge-theory` (Donaldson / Seiberg–Witten 4-manifold invariants). Currently spread across `geometric-and-combinatorial-group-theory` and `riemann-surfaces` but no dedicated topology page.

4. **Khovanov homology & link homology** (Geometry & topology). Categorification of the Jones polynomial, Khovanov's chain complex, slice-genus and the Rasmussen invariant, Lee/Bar-Natan deformation, the foam category, applications to topology. Harvard runs three courses here (253Z, 254Z); we mention "Khovanov categorification" as a one-line bullet inside `knot-polynomials` but the actual subject is its own page. Strong category-theory tie-in.

5. **Mathematical biology / population genetics** (potentially a new 12th section). Wright–Fisher model, Moran process, coalescent theory, evolutionary game theory, replicator and replicator–mutator dynamics, Lotka–Volterra; Harvard's Math 242/243 is a recurring research-active line. Zero coverage today. Could open as a new section *Mathematical biology* (orange/green accent) or fold under *Probability & statistics* — section question is the architectural decision worth discussing before drafting.

6. **Arithmetic statistics** (Number theory). Bhargava-style results: density of binary cubic / quartic / quintic forms, average rank of elliptic curves, function-field analogues (Harvard 251Z). Bridges `algebraic-number-theory`, `heights-arithmetic-geometry`, and `analytic-number-theory`. Currently no dedicated page; bits live across those three.

Honourable mention: **Positive characteristic AG** (Math 260Z) — partially covered by `crystalline-cohomology` but a standalone topic on Frobenius splittings, $F$-singularities, and char-$p$ specific phenomena would close that gap.

## Content-gap audit — long-running

A systematic pass: for each section, compare against a canonical reference (PCM, nLab, Wikipedia) and flag the missing standard topics. The sub-bullets above (algebra/analysis/math-physics) are partial outputs of such a pass; a more thorough sweep would surface gaps in number theory, algebraic geometry, geometry-and-topology, and modular forms too. Not actioned per session — the right cadence is one section at a time, after a topic-drafting batch lands.

## Authoring polish — small

- **Index-card thumb art (continuing).** A first curation pass replaced the 12 visually weakest thumbs with motif-appropriate SVGs; ~15 cards were explicitly judged already-strong. New topic-batch PRs since (#118, #121-#125) ship motif art on every new card; this leaves the pre-existing midbody as the remaining surface.
- **Hoist semantic params out of verbatim slugs.** PR #70 banked the inline-widget zero-baseline by minting 77 per-widget verbatim slugs that share `widgets/_shared/verbatim-renderer.mjs` — schemas just carry opaque `bodyMarkup`/`bodyScript` strings. The deeper migration is to convert these to bespoke renderers with semantic params (slider ranges, color tokens, etc.) so AJV validation and the React frontend can actually inspect each widget. Worth doing in batches by topic rather than corpus-wide. Today's verbatim-slug count is roughly 175 (seven new batches × ~6 widgets each since the original 77).
- **Section progress bar empty state.** `index.html` `.sec-progress` renders a faded track for fresh visitors with no `mvnb.progress.v1` localStorage. The faded `data-empty` styling reads more as "loading" than "you haven't started". Options: hide entirely when `mastered === 0`, or accompany with a small `0/N` label so it's obvious the bar tracks the visitor's progress, not corpus completeness.
- **Promote `audit-widget-interactivity.mjs` to a CI gate.** The audit currently exits 0 with 100 static widgets across 39 pages, even when the static count grows. Promoting it to non-zero would have caught the bodyScript-storage regression in PR #125 (13 widgets shipped inert until review). Blocking move: those 100 pre-existing static widgets need scripts first. Plausible mitigation: lock the count via a baseline file (`audits/static-widgets-baseline.json`), fail only if the count grows. Pattern mirrors the inline-widgets baseline from PR #70.

## Three.js / Pyodide / alt frontends (long-running)

- **Three.js adoption decision.** `examples/threejs-prototype/` validates the ceiling-raise for 3D-heavy topics. Would converge with `surface-viewer`. Requires AGENTS.md amendment on dependency policy.
- **Inline code cells for live examples.** `inline-code-cell` is a Web Worker JS sandbox; could be extended to Pyodide for sieves / sympy demos at the cost of a ~10MB CDN load.

## NPM packages — candidates worth evaluating

- **`cheerio`** over `node-html-parser` — richer for DOM manipulation in `inject-*`/`fix-*` scripts.
- **`katex` as a dependency** — would let `validate-katex.mjs` do real rendering instead of heuristic checks.

## Follow-ups from PR #36 / #37 review

Items raised by the review-team agents that were deferred at merge time. **All quiz/hint items here are de-prioritized per "Out of scope" until the user re-prioritizes.**

1. **Quiz type-variety on the new 27 topics.** 87% of v1 questions in PR #36 + PR #37 banks (~470 of 540) are `mcq` or `numeric`. Per the previous E1 batch (PR #35 phase 3i), replace ~3 questions per topic with `matching` / `multi-select` / `ordering` / `proof-completion` / `spot-the-error`.
2. **Hint coverage on the 14 hint-poor banks** (everything in PR #36 + #37 except `hamiltonians-classical-mechanics`).
3. **Trivia-as-question replacements.** A handful of v1 mcqs in PR #37 reduce to recall of a labeled fact (CdGP attribution, HMS history, LIGO strain, Cheeger Riemannian provenance). Quiz-review agent flagged them at comment 4183109392; rewrite to test the underlying concept.
4. **Blurb undercoverage instances.** `cnt-modular-arithmetic-algorithms` (only one of three blurb pillars tested), `ms-mle` (asymptotic normality / score equation untested despite being in the blurb). Quiz-review comment 4183111160.
5. **KaTeX macro-loader expansion.** Notation reviewer flagged `\Re`, `\vol`, `\End` as candidates that just crossed the threshold where defining once in the loader pays off. Currently rendering correctly via `\mathrm{...}` so cosmetic, not a bug.

## Out of scope

Items the user has explicitly de-prioritized. **Don't suggest these as "what next" without prompting.**

- **Hard-tier quiz authoring** (702 concepts lack hard tier).
- **Expert-tier authoring** (13 questions corpus-wide).

These are real coverage gaps but not where the user wants to spend time. Per-session feedback memory: lowest-leverage direction, structural/architectural improvements come first.

