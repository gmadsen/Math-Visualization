# Slice C — widget audit summary (2026-05)

Audited 63 topics from `/tmp/slice_c.txt` (Number theory tail through Mathematical physics, Algebraic geometry tail, Combinatorics & graph theory, Control theory & optimization).

## Headline numbers

- **Topics audited:** 63 / 63
- **Total widgets detected:** 398
- **Topics with at least one structural issue:** 1
- **Total structural issues flagged:** 1
- **Console errors at load:** 0 across the entire slice (note: console-error capture relied on a `console.error` shim installed only inside the eval; the eval ran a single shot per page, so persistent post-load errors after navigation could be missed by this method — see "Methodology caveats" below)

The slice is overwhelmingly clean by the structural-heuristic standard (no NaN / undefined / Infinity in primary readouts, no controls without any output surface). The audit catches a single real structural problem.

## Topics with no widgets

These three topics returned `widgetCount: 0` — the page is loading but has no `.widget` blocks (likely text-heavy survey pages that should be flagged for richer interactive content):

- `langlands-program`
- `motives`
- `hodge-theory`

## Top "worst" topics

Ranked by structural-issue count, then by absence of widgets:

1. **singular-cubics-reduction** — 1 issue: `w-dtable` (Discriminant-mod-p table) has 1 input button but no readout text, no SVG, no canvas. Likely a button that mutates state but never renders an output panel — flagged as `controls-no-output`.
2. **langlands-program** — 0 widgets at all (only quizzes / prose).
3. **motives** — 0 widgets at all.
4. **hodge-theory** — 0 widgets at all.
5. **(none else)** — every other topic in the slice passes the structural heuristics on every widget.

## Topics with the largest widget counts (sanity check that pages are densely interactive)

| Topic | Widgets |
|---|---:|
| etale-cohomology | 9 |
| positive-characteristic-ag | 9 |
| algebraic-de-rham-cohomology | 8 |
| convex-optimization | 8 |
| elliptic-curves | 8 |
| group-schemes | 8 |
| schemes | 8 |
| singular-cubics-reduction | 8 |

The geometry / arithmetic-geometry portion of the slice is the most widget-dense. Mathematical physics topics consistently have 6–7 widgets each, as do combinatorics topics.

## Methodology caveats

- **Single-pass eval, no interaction.** The audit only inspects the *initial* DOM state after navigation; widgets that need an explicit user click to populate their readout will look empty. The `controls-no-output` heuristic (inputs > 0 AND zero SVG, canvas, and readout chars) is intentionally narrow to avoid this false positive.
- **`.widget` selector with quiz exclusion.** Quizzes are detected by `.quiz` class or by the presence of an `input[name^="q"]`. If a topic uses a different quiz convention, those quizzes might be counted as widgets.
- **Console errors.** The script attached a `console.error` shim, but only ran one shot per navigation; long-tail async errors could be missed.
- **Race conditions during the run.** Sibling auditing agents shared the same Chrome instance via the MCP server; my isolated tab (id 6, `audit-slice-c`) was selected immediately before each evaluate to avoid running on a sibling's page. The first attempt at `langlands-program` and `maass-forms` was incorrectly run on the wrong tab; both were re-audited from the correct tab and the reports reflect the second run.

## Suggested follow-up

The single actionable finding for this slice is `singular-cubics-reduction` `w-dtable`. The widget has the title "Discriminant-mod-p table" and a single button input. Open the page in a browser, inspect the widget, and either (a) add the missing output element, or (b) wire the button so its handler populates an existing panel.

For the three zero-widget topics (`langlands-program`, `motives`, `hodge-theory`), this audit only confirms the absence — it does not say whether widgets *should* be added. Those decisions belong to PLAN.md / topic-gap-analysis.
