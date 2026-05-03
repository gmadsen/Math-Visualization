# Plan

Forward-looking priorities for the notebook. Daily-workflow commands, one-time setup, architecture, conventions, and the full quiz/progression/callback story all live in [`AGENTS.md`](./AGENTS.md) — especially § "Common pitfalls". Project overview is in [`README.md`](./README.md).

When something ships, delete its bullet here. Don't keep a "Shipped recently" log — `git log` is the audit trail. The full step list of `rebuild.mjs` is in `scripts/rebuild.mjs` — refer to it rather than restating step names here.

## Corpus snapshot (2026-05-02)

From `audits/coverage-stats.md` and `audits/starter-concepts.md`:

- 137 topics, 973 concepts, 1728 prereq edges (714 cross-topic), 30 capstones
- 153 concepts lack a widget in their owning section
- 47 inline widget blocks (in three Mathematical-physics capstones from PR #55, authored before content/*.json round-trip stabilized); 469 registry slug directories
- Quiz tiers: v1 = 2876, hard = 1223, expert = 13 (intentionally bottom-of-list — see "Out of scope")
- Tag coverage: ~80%. Worst remaining sections: number-theory 63%, higher-categories 71%, logic-and-foundations 76%, geometry-and-topology 78%, algebraic-geometry 78%. (Analysis/probability/modular-forms/combinatorics closed to 85–93% in PR #49.)

## Near-term tasks

Items below come out of the algebra/analysis comparative audit shipped in PR #49.

- **Within-topic concept backfill on `complex-analysis`, `functional-analysis`, `commutative-algebra`, `homological`.** Named-theorem level: open-mapping (named), Phragmén-Lindelöf bridge, subharmonic backref; Banach-Alaoglu (named), Krein-Milman; completion, DVRs/Dedekind domains, Koszul complex; double complexes, Tor symmetry, Cartan-Eilenberg.
- **Tagging tail — remaining sections.** PR #49 closed the four worst (analysis 56→91%, probability 45→93%, modular-forms 51→85%, combinatorics 49→86%). Mid-tier follow-up: number-theory (63%), higher-categories (71%), logic-and-foundations (76%), geometry-and-topology and algebraic-geometry (78% each).
- **Math physics has no `hard` tier and Combinatorics has no `hard` tier.** 535 concepts lack a hard tier corpus-wide; 12 topics in those two sections × ~6 concepts × 2-3 questions each ≈ ~150 of the missing questions. Per "Out of scope", de-prioritized — listed here so the gap is visible, not actioned.

## Bigger missing-topic candidates (from the comparative audit)

Listed for the long view; each is a multi-session lift.

- **Algebra side:** `algebraic-K-theory-foundations` (homological cluster currently stops at derived categories); `model-categories` (bridge to higher-categories).
- **Analysis side:** `microlocal-analysis` (wavefront sets, pseudodifferential operators — natural sequel to `sobolev-spaces-distributions` + `pde`); `geometric-measure-theory` (BV, sets of finite perimeter, rectifiability, area-coarea); `semigroup-theory-evolution-equations` (Hille-Yosida, analytic semigroups).

## Follow-up: cohomology-fanout capstones (motives, Langlands, Hodge)

The corpus climbs the cohomology fanout (étale, sheaf, algebraic de Rham) and the modular-forms / Galois-rep / L-function tower, but stops one level short of the integration points where the modern arithmetic/geometric story actually lives. Three new capstone topics + three tours that thread through them, in priority order:

1. **`motives` (algebraic-geometry capstone).** Tate motives, Tannakian categories, the motivic Galois group, realizations (Betti / de Rham / ℓ-adic / crystalline), the standard conjectures. Caps the chain ending today at étale-cohomology / algebraic-de-Rham. Hooks: every existing cohomology topic, `etale-fundamental-group`, `galois-representations`, `L-functions`.
2. **`hodge-theory` (algebraic-geometry deep / capstone).** Pure Hodge decomposition for smooth projective varieties, the Hodge filtration in its own right, mixed Hodge structures (Deligne), period domains, the Hodge conjecture. The Hodge filtration appears as a sub-section in `algebraic-de-rham-cohomology` today; this promotes it. May want `kahler-manifolds` as a small companion prereq topic.
3. **`langlands-program` (modular-forms-and-L-functions capstone).** Reciprocity for GL_n: Galois representations ↔ automorphic forms via L-function matching. Hooks: `galois-representations`, `modular-forms`, `automorphic-forms-adelic`, `L-functions`, `frobenius-and-reciprocity`, `modularity-and-flt`, `sato-tate`.

### Matching tours

- **Tour 7 — "Solvability across mathematics."** Galois solvability → group cohomology classifying H² extensions → Postnikov towers (algebraic topology) → ∞-groupoids = homotopy types → motives capstone. Pedagogical bridges already drafted in a long external chat thread; harvest as the source for stop bridges.
- **Tour 8 — "What is Hodge theory?"** (~4–5 stops) algebraic-de-Rham → Kähler / complex differentials → Hodge decomposition → mixed Hodge → Hodge capstone.
- **Tour 9 — "Langlands philosophy."** galois-representations → modular-forms → L-functions → frobenius-and-reciprocity → automorphic-forms-adelic → Langlands capstone.

Sequencing: motives first (caps an existing chain and unlocks Tour 7); Hodge second (smaller scope, connects motives to de Rham); Langlands third (biggest, deserves its own focused PR with the matching tour). Each is its own PR with the new tour landing alongside the new capstone.

## Authoring polish — small

- **Index-card thumb art.** `new-topic.mjs` leaves placeholder colored thumbs in `index.html`; could replace with motif-appropriate SVGs.
- **Migrate 47 inline widgets in `statistical-mechanics`/`gauge-theory`/`string-theory` to registry slugs.** PR #55 shipped these three topics with inline `<div class="widget">` markup + per-page `<script>` tails because the parallel agents authored against the HTML directly. Round-trip via `extract-topic.mjs` preserved the inline form. Each could become a new `widgets/<slug>/` entry (schema + index.mjs) so `validate-widget-params.mjs` and the future React frontend can see them. ~21 widgets across the three pages; defer to a dedicated infra PR.

## Three.js / Pyodide / alt frontends (long-running)

- **Three.js adoption decision.** `examples/threejs-prototype/` validates the ceiling-raise for 3D-heavy topics. Would converge with `surface-viewer`. Requires AGENTS.md amendment on dependency policy.
- **Inline code cells for live examples.** `inline-code-cell` is a Web Worker JS sandbox; could be extended to Pyodide for sieves / sympy demos at the cost of a ~10MB CDN load.

## Script audit — overlap to assess

`scripts/` carries 50+ entries; items still worth reviewing:

- **Low-usage audits — confirm signal value:** `audit-worked-examples.mjs`, `audit-blurb-question-alignment.mjs`. Each has actionable output but isn't part of the rebuild chain or any current workflow. Decide whether to wire one in or document a quality-pass cadence for running them. (`audit-notation.mjs` shipped as advisory step 30 in PR #48.)
- **Consolidation candidates:** `validate-concepts.mjs` still reads `index.json` directly because the validator is the gate before the loader runs — circular dependency that's intentional, leave it. `audit-widget-interactivity.mjs` and `audit-cross-page-consistency.mjs` were migrated to `loadContentModel()`.
- **Unify `fix-a11y` JSON-mode and HTML-mode pipelines.** The two parallel paths (JSON for topic pages with `content/<slug>.json`, HTML for landing/utility pages) build per-block deltas vs before/after counters in two places. A common `applyA11yToText(html, opts) → {newHtml, stats}` would halve the report-bookkeeping code.

## NPM packages — candidates worth evaluating

- **`cheerio`** over `node-html-parser` — richer for DOM manipulation in `inject-*`/`fix-*` scripts.
- **`katex` as a dependency** — would let `validate-katex.mjs` do real rendering instead of heuristic checks.

## Follow-ups from PR #49 review

Items raised by review-team agents on the ACA-expansion / tagging-tail PR that were declined or deferred at merge time.

- **Stub-thin widget READMEs on the 5 new aca-* entries.** The README files just point at `schema.json` rather than describing the gesture / failure modes / readout meaning. Same pattern across most older registry entries; collapsing into a uniform README quality bar is its own polish pass.
- **Schema iteration to dedupe widget vs widget-script params.** Today both `widget` and `widget-script` blocks carry the same `params` (including `bodyMarkup` and `bodyScript`), duplicating ~12 KB per topic. Architectural change touching every existing widget pair; defer to a dedicated infra PR. Recorded in code-review thread on `content/advanced-complex-analysis.json:265`.
- **Hartogs widget pedagogically-meaningful slider.** Currently the inner-shell-radius slider only resizes the inner pink rectangle. Adding a numeric tied to the Hartogs phenomenon (e.g. a vanishing Bochner-Martinelli boundary integral, or the inner-shell volume ratio) would tie the gesture to the math. Low-priority polish.
- **Hardcoded `#0b0f16` sweep across older widgets.** PR #49 fixed the 5 new `aca-*` bodyScripts to use `var(--bg)` for canvas backdrops, but the same pattern appears in `characteristic-classes`, `mostow-rigidity`, `knot-polynomials`, etc. Theme-toggle correctness improves uniformly with a corpus-wide sweep.
- **Schwarz-Pick → Ahlfors-Schwarz pointer (§9 Bloch).** One-liner adding a "(generalized to comparison with curvature ≤ −1 metrics by Ahlfors-Schwarz)" parenthetical to help readers chase the proof technique. Cosmetic.

## Follow-ups from PR #36 / #37 review

Items raised by the review-team agents that were deferred at merge time. **All quiz/hint items here are de-prioritized per "Out of scope" until the user re-prioritizes.**

1. **Quiz type-variety on the new 27 topics.** 87% of v1 questions in PR #36 + PR #37 banks (~470 of 540) are `mcq` or `numeric`. Per the previous E1 batch (PR #35 phase 3i), replace ~3 questions per topic with `matching` / `multi-select` / `ordering` / `proof-completion` / `spot-the-error`.
2. **Hint coverage on the 14 hint-poor banks** (everything in PR #36 + #37 except `hamiltonians-classical-mechanics`).
3. **Trivia-as-question replacements.** A handful of v1 mcqs in PR #37 reduce to recall of a labeled fact (CdGP attribution, HMS history, LIGO strain, Cheeger Riemannian provenance). Quiz-review agent flagged them at comment 4183109392; rewrite to test the underlying concept.
4. **Blurb undercoverage instances.** `cnt-modular-arithmetic-algorithms` (only one of three blurb pillars tested), `ms-mle` (asymptotic normality / score equation untested despite being in the blurb). Quiz-review comment 4183111160.
5. **KaTeX macro-loader expansion.** Notation reviewer flagged `\Re`, `\vol`, `\End` as candidates that just crossed the threshold where defining once in the loader pays off. Currently rendering correctly via `\mathrm{...}` so cosmetic, not a bug.

## Out of scope

Items the user has explicitly de-prioritized. **Don't suggest these as "what next" without prompting.**

- **Hard-tier quiz authoring** (535 concepts lack hard tier).
- **Expert-tier authoring** (13 questions corpus-wide).

These are real coverage gaps but not where the user wants to spend time. Per-session feedback memory: lowest-leverage direction, structural/architectural improvements come first.

