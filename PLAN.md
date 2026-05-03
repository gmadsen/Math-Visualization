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

## History page follow-ups

Items deferred from the multi-agent review of PRs #71, #72, #73. Not blocking;
land them when adjacent work brings the file open.

- **Bio-light lineage nodes.** 14 nodes across the calculus / groups /
  foundations / FLT lineages still resolve to "no further bio in the dataset"
  on click (cavalieri, jordan, lie, frege, peano, russell, zermelo, gentzen,
  hamilton, dirichlet, kummer, taniyama, frey, ribet). Each needs a
  one-paragraph `people[]` entry — purely additive.
- **Plimpton-322 toy primitive-conditions caveat.** The triple generator
  produces all primitive Pythagorean triples only when `gcd(p,q)=1` and `p,q`
  have opposite parity. The current readout doesn't say so. Add a one-line
  caveat or a small "primitive only ✓" indicator.
- **Gödel-numbering toy disclaimer.** The toy demonstrates *a* Gödel
  numbering, not Gödel's original (which encoded formula structure, not raw
  codepoints). Add a one-line caveat to the readout.
- **Era-toy CSS harmonisation.** The 9 inline toys were each scratch-styled.
  Promote a shared `.era-toy` ruleset (panel chrome, slider widths, readout
  spacing) so they read as one feature instead of nine.
- **Light-theme audit on the 4 dark-bg toys.** Euclid I.1, Ricci/curve-shortening,
  Plimpton-322, and a couple of others hardcode `#0a0d12` on the inner SVG
  for contrast with the bright stroke colours. In light theme the dark
  rectangle floats inside the white panel; either harmonize with `.tl-detail`'s
  always-dark pattern or theme-track the inner backgrounds.
- **Audit `history-link-coverage.md` zero-inbound list grouping.** 95-item
  flat list overwhelms. Group by `concepts/sections.json` so the report
  surfaces "every Probability & statistics page is zero-inbound" rather than
  scattering them through alphabetical order.
- **Scrubber discoverability.** The `aria-label` and keyboard nav land for
  AT users; sighted users still get only a static yellow grip. Consider a
  one-time animated "← drag me →" hint that fades after first interaction.
- **Eilenberg–Mac Lane 1945 location.** The event lists Bloomington as the
  city. Both authors had moved by 1945; verify against the actual paper's
  affiliation and update.

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

