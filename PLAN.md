# Plan

Forward-looking priorities for the notebook. Daily-workflow commands, one-time setup, architecture, conventions, and the full quiz/progression/callback story all live in [`AGENTS.md`](./AGENTS.md) — especially § "Common pitfalls". Project overview is in [`README.md`](./README.md).

When something ships, delete its bullet here. Don't keep a "Shipped recently" log — `git log` is the audit trail. The full step list of `rebuild.mjs` is in `scripts/rebuild.mjs` — refer to it rather than restating step names here.

## Corpus snapshot (2026-05-04)

From `audits/coverage-stats.md` and `audits/starter-concepts.md`:

- 148 topics, 1050 concepts, 34 capstones
- 177 concepts lack a widget in their owning section
- 1035 widgets, 100% registry-driven (PR #70 zero-baseline sweep — `audit-no-inline-widgets` now hard-fails on any non-registry widget)
- Quiz tiers: v1 = 3108, hard = 1223, expert = 13 (intentionally bottom-of-list — see "Out of scope")
- Tag coverage: **99.1%** across all 11 sections after PRs #84–#88 + #94–#98. The intentionally-untagged concepts are catalog/TOC blurbs (`*-applications`), single-result rigidity (Apéry's $\zeta(3)$ irrationality), or observation-shaped concepts (lem-failure, algebraic-connectivity Fiedler). Vocabulary expanded in PR #94 with `equidistribution`, `density`, `cancellation`, `refinement` to cover analytic-NT methods and $\infty$-topos refinement properties. Tagging effort effectively complete.

## Near-term tasks

Items below come out of the algebra/analysis comparative audit shipped in PR #49.

- **Math physics has no `hard` tier and Combinatorics has no `hard` tier.** 612 concepts lack a hard tier corpus-wide; 13 topics in those two sections × ~6 concepts × 2-3 questions each ≈ ~150 of the missing questions. Per "Out of scope", de-prioritized — listed here so the gap is visible, not actioned.

## Bigger missing-topic candidates (from the comparative audit)

The original list flagged `model-categories` (algebra), `microlocal-analysis` / `geometric-measure-theory` / `semigroup-theory-evolution-equations` (analysis), and `klein-gordon-equation` / `dirac-equation` / `quantum-field-theory` (math-physics) as the major gaps surfaced by the comparative audit. **All three sections have now drained.** With the algebra-side `model-categories` topic shipped (this session), the bigger-missing-topic list is empty. Future gap candidates would surface from a renewed sweep on number theory / algebraic geometry / geometry-and-topology / modular forms — see "Content-gap audit" below.

## Content-gap audit — long-running

A systematic pass: for each section, compare against a canonical reference (PCM, nLab, Wikipedia) and flag the missing standard topics. The sub-bullets above (algebra/analysis/math-physics) are partial outputs of such a pass; a more thorough sweep would surface gaps in number theory, algebraic geometry, geometry-and-topology, and modular forms too. Not actioned per session — the right cadence is one section at a time, after a topic-drafting batch lands.

## Authoring polish — small

- **Index-card thumb art.** `new-topic.mjs` leaves placeholder colored thumbs in `index.html`; could replace with motif-appropriate SVGs.
- **Hoist semantic params out of verbatim slugs.** PR #70 banked the inline-widget zero-baseline by minting 77 per-widget verbatim slugs that share `widgets/_shared/verbatim-renderer.mjs` — schemas just carry opaque `bodyMarkup`/`bodyScript` strings. The deeper migration is to convert these to bespoke renderers with semantic params (slider ranges, color tokens, etc.) so AJV validation and the React frontend can actually inspect each widget. Worth doing in batches by topic rather than corpus-wide.

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

- **Hard-tier quiz authoring** (612 concepts lack hard tier).
- **Expert-tier authoring** (13 questions corpus-wide).

These are real coverage gaps but not where the user wants to spend time. Per-session feedback memory: lowest-leverage direction, structural/architectural improvements come first.

