# Plan

Forward-looking priorities for the notebook. Daily-workflow commands, one-time setup, architecture, conventions, and the full quiz/progression/callback story all live in [`AGENTS.md`](./AGENTS.md) — especially § "Common pitfalls". Project overview is in [`README.md`](./README.md).

When something ships, delete its bullet here. Don't keep a "Shipped recently" log — `git log` is the audit trail. The full step list of `rebuild.mjs` is in `scripts/rebuild.mjs` — refer to it rather than restating step names here.

## Corpus snapshot (2026-05-02)

From `audits/coverage-stats.md` and `audits/starter-concepts.md`:

- 138 topics, 981 concepts, 31 capstones
- 177 concepts lack a widget in their owning section
- 1017 widgets, 100% registry-driven (PR #70 zero-baseline sweep — `audit-no-inline-widgets` now hard-fails on any non-registry widget)
- Quiz tiers: v1 = 2900, hard = 1223, expert = 13 (intentionally bottom-of-list — see "Out of scope")
- Tag coverage: ~80%. Worst remaining sections: number-theory 63%, higher-categories 71%, logic-and-foundations 76%, geometry-and-topology 78%, algebraic-geometry 78%. (Analysis/probability/modular-forms/combinatorics closed to 85–93% in PR #49.)

## History page expansion (in flight on `history-feature-batch`)

Distillate of three review-agent proposal reports run after the history.html
ship (PRs #71, #72). Goal: turn the page from a "good first cut" into the
site highlight the user wants. Items are ordered roughly by dependency, not
by impact; the bigger UX moments (#7, #8, #9) build on the smaller content +
infrastructure additions ahead of them. Delete bullets as they ship.

1. **Probability lineage tree.** Add a 6th lineage to `lineages[]`:
   Pascal/Fermat → Huygens → J. Bernoulli → de Moivre → Laplace →
   Chebyshev → Markov → Kolmogorov → Doob → Itō. Pure JSON.
2. **Concentric era rings on busy map clusters.** Today a cluster pin uses
   the era of its most recent event, hiding the multi-era depth of cities
   like Alexandria (4 events spanning 600 years). Replace the single circle
   in `widget-history-map.js` with concentric arcs colored by event era,
   sorted by year (innermost = oldest).
3. **Era-color scroll wash.** Tie a `--current-era-color` CSS variable to
   the era section currently in the viewport (via `IntersectionObserver`).
   A 3-px left stripe and the sidetoc `.active` color both follow that
   variable so prose, sidetoc, and visible widgets share a coordinated tint
   per era.
4. **Content gaps — missing people, events, lineage nodes.** Add JSON
   `people[]` entries for Mac Lane, Eilenberg, Kolmogorov, Faltings,
   Tarski, Julia Robinson, Conway, Seki Takakazu (wasan), Sophie Germain
   (already added narrative; ensure event coverage), Lawvere. Add events
   with `topicAnchor` for: Frobenius 1896 (representation theory),
   Hausdorff 1914 (point-set topology), Fisher 1925 (mathematical
   statistics), Cartan-Eilenberg 1956 (homological algebra), Langlands
   1967 (Langlands program). Each event closes a "zero-inbound" gap
   between an existing topic page and the history hub.
5. **Cross-widget selection bus.** Tiny `MVHistoryBus` (CustomEvent or
   shared dispatcher) wired through all three widget `init()` calls.
   Selecting a person on any surface (timeline dot, map pin, lineage
   node, inline `.person` card) highlights the same person across the
   other surfaces and the inline narrative anchor. Inline person cards
   gain `data-person-id` so they hook in. Foundation for #6 below.
6. **Timeline scrubber driving the map.** A vertical line over the
   timeline you can drag along the year axis; map pins fade to 10%
   outside ±50 years of the cursor, year readout floats above. The
   single most kinetic-delight change for the page's polish ceiling.
7. **Person-card sub-icons.** Replace the 2-letter glyph monogram for
   ~12–15 of the densest figures with a small (24×24) hand-drawn SVG
   icon: $\zeta$ for Riemann, Cantor-set strip for Cantor, $\partial$
   for Grothendieck, etc. Stored alongside `person.icon` in the JSON;
   render in `.person .glyph` when present, fall back to monogram.
8. **Per-era inline interactives.** One small widget per era (≤80 lines
   of inline JS each, no registry promotion):
   - Prehistory: tally counter (subitizing demo)
   - Ancient: Plimpton-322 triple generator $(p^2-q^2, 2pq, p^2+q^2)$
   - Classical: Euclid Book I prop. 1 animator (compass-arc construction)
   - Asian-Islamic: al-Khwārizmī completing-the-square slider
   - Medieval: Oresme harmonic-series dyadic-grouping visualiser
   - Renaissance: Cardano cubic dial $x^3 + px = q$ (with $\Delta<0$
     branch into imaginary)
   - Enlightenment: Euler's $\sin(x)/x$ partial-product convergence to
     $\zeta(2)=\pi^2/6$
   - 20th C: Gödel-numbering encoder
   - 21st C: Ricci flow on a 2D blob
9. **`audit-history-links.mjs` advisory script.** Walks every outbound
   `<a href="./*.html…">` and `events[].topicAnchor` in `history.html`,
   cross-references against the on-disk topic-page slug roster + per-page
   `id="…"` anchors, reports broken anchors / dead slugs / topic pages
   with zero inbound from history. Output to `audits/`. Without it the
   cross-link map silently rots as new pages ship.

## Near-term tasks

Items below come out of the algebra/analysis comparative audit shipped in PR #49.

- **Within-topic concept backfill on `complex-analysis`, `functional-analysis`, `commutative-algebra`, `homological`.** Named-theorem level: open-mapping (named), Phragmén-Lindelöf bridge, subharmonic backref; Banach-Alaoglu (named), Krein-Milman; completion, DVRs/Dedekind domains, Koszul complex; double complexes, Tor symmetry, Cartan-Eilenberg.
- **Tagging tail — remaining sections.** PR #49 closed the four worst (analysis 56→91%, probability 45→93%, modular-forms 51→85%, combinatorics 49→86%). Mid-tier follow-up: number-theory (63%), higher-categories (71%), logic-and-foundations (76%), geometry-and-topology and algebraic-geometry (78% each).
- **Math physics has no `hard` tier and Combinatorics has no `hard` tier.** 543 concepts lack a hard tier corpus-wide; 12 topics in those two sections × ~6 concepts × 2-3 questions each ≈ ~150 of the missing questions. Per "Out of scope", de-prioritized — listed here so the gap is visible, not actioned.

## Bigger missing-topic candidates (from the comparative audit)

Listed for the long view; each is a multi-session lift.

- **Algebra side:** `algebraic-K-theory-foundations` (homological cluster currently stops at derived categories); `model-categories` (bridge to higher-categories).
- **Analysis side:** `microlocal-analysis` (wavefront sets, pseudodifferential operators — natural sequel to `sobolev-spaces-distributions` + `pde`); `geometric-measure-theory` (BV, sets of finite perimeter, rectifiability, area-coarea); `semigroup-theory-evolution-equations` (Hille-Yosida, analytic semigroups).

## Authoring polish — small

- **Index-card thumb art.** `new-topic.mjs` leaves placeholder colored thumbs in `index.html`; could replace with motif-appropriate SVGs.
- **Hoist semantic params out of verbatim slugs.** PR #70 banked the inline-widget zero-baseline by minting 77 per-widget verbatim slugs that share `widgets/_shared/verbatim-renderer.mjs` — schemas just carry opaque `bodyMarkup`/`bodyScript` strings. The deeper migration is to convert these to bespoke renderers with semantic params (slider ranges, color tokens, etc.) so AJV validation and the React frontend can actually inspect each widget. Worth doing in batches by topic rather than corpus-wide.

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

- **Hard-tier quiz authoring** (543 concepts lack hard tier).
- **Expert-tier authoring** (13 questions corpus-wide).

These are real coverage gaps but not where the user wants to spend time. Per-session feedback memory: lowest-leverage direction, structural/architectural improvements come first.

