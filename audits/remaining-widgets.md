# Remaining inline widgets — audit aggregate

Source: 5 parallel Phase C audit batches (A/B/C/D/E) each attempted migration on a disjoint set of topics and logged every skip with a blocker category. Aggregated here to tell us which blocker classes dominate the remaining 266 still-inline widgets.

Generated from /tmp/remaining-audit-{A..E}.jsonl — do not hand-edit.

## Totals

Total skipped: **266** widgets across **43** topics.
Current registry coverage: 174 / 452 widgets (38.5%).
Potential ceiling if every blocker below were fixed: 452 / 452 (100%).

## Blocker frequency

| blocker | count | share |
|---|---:|---:|
| `layout-mismatch` | 141 | 53.0% |
| `script-unfound` | 55 | 20.7% |
| `label-wrapped-input` | 23 | 8.6% |
| `bespoke` | 18 | 6.8% |
| `family-mismatch` | 15 | 5.6% |
| `static-svg` | 8 | 3.0% |
| `3d-viewer` | 6 | 2.3% |


## Intended family of skipped widgets

(What family each widget would have gone to had its blocker not existed.)

| family | count |
|---|---:|
| `parametric-plot` | 18 |
| `select-readout` | 15 |
| `static-svg` | 15 |
| `slider-plot` | 13 |
| `select-slider-plot` | 12 |
| `button-stepper-svg` | 11 |
| `slider-plot-like` | 11 |
| `parametric-plot-like` | 10 |
| `select-diagram` | 9 |
| `input-form` | 9 |
| `select-svg` | 9 |
| `input-calculator` | 9 |
| `button-stepper` | 8 |
| `clickable-graph` | 8 |
| `panel-mixed` | 6 |
| `select-diagram-actions` | 6 |
| `control-html` | 6 |
| `3d-viewer` | 6 |
| `clickable-diagram` | 6 |
| `input-form-like` | 6 |
| `slider-plot-actions` | 5 |
| `parametric-plot-multi` | 5 |
| `bespoke` | 4 |
| `input-plot-like` | 4 |
| `parametric-plot-actions` | 4 |
| `select-slider-svg` | 3 |
| `clickable-graph-drag` | 3 |
| `group-theory-table` | 3 |
| `bespoke-grid` | 3 |
| `toggle-illustration` | 2 |
| `pattern-induction` | 2 |
| `grid-svg` | 2 |
| `input-plot` | 2 |
| `bespoke-editor` | 2 |
| `button-stepper-range` | 2 |
| `bespoke-grid-layout` | 2 |
| `bespoke-table` | 2 |
| `select-only` | 1 |
| `select-buttons-svg` | 1 |
| `button-input-svg` | 1 |
| `button-stepper-like` | 1 |
| `button-checkbox-svg` | 1 |
| `slider-only` | 1 |
| `bespoke-set-functor` | 1 |
| `bespoke-pullback` | 1 |
| `bespoke-free-group` | 1 |
| `bespoke-pushout` | 1 |
| `bespoke-kleisli` | 1 |
| `bespoke-polynomial` | 1 |
| `button-stepper-variant` | 1 |
| `parametric-plot-single` | 1 |
| `bespoke-spectrum` | 1 |
| `bespoke-character` | 1 |
| `parametric-plot-no-svg` | 1 |
| `bespoke-linear-algebra` | 1 |
| `select-select-readout` | 1 |
| `bespoke-spec` | 1 |
| `clickable-graph-reveal` | 1 |
| `bespoke-strip` | 1 |
| `parametric-plot-buttons` | 1 |


## Per-topic skipped counts

| topic | skipped | dominant blocker |
|---|---:|---|
| representation-theory | 13 | `script-unfound` (13) |
| algebra | 10 | `layout-mismatch` (10) |
| L-functions | 9 | `static-svg` (4) |
| bsd | 9 | `family-mismatch` (4) |
| differential-geometry | 9 | `3d-viewer` (5) |
| etale-cohomology | 9 | `label-wrapped-input` (8) |
| galois-representations | 9 | `script-unfound` (9) |
| smooth-manifolds | 9 | `layout-mismatch` (7) |
| hecke-operators | 8 | `layout-mismatch` (8) |
| p-adic-numbers | 8 | `layout-mismatch` (8) |
| power-sums-bernoulli | 8 | `layout-mismatch` (6) |
| singular-cubics-reduction | 8 | `label-wrapped-input` (7) |
| functional-analysis | 8 | `layout-mismatch` (8) |
| homological | 8 | `layout-mismatch` (7) |
| modularity-and-flt | 7 | `layout-mismatch` (7) |
| complex-analysis | 7 | `script-unfound` (7) |
| modular-forms | 7 | `family-mismatch` (7) |
| partitions-generating-functions | 7 | `layout-mismatch` (7) |
| projective-plane | 7 | `bespoke` (3) |
| category-theory | 7 | `bespoke` (4) |
| lie-groups | 6 | `layout-mismatch` (5) |
| moduli-spaces | 6 | `script-unfound` (6) |
| quadratic-forms-genus-theory | 6 | `layout-mismatch` (6) |
| riemann-surfaces | 6 | `layout-mismatch` (6) |
| sheaf-cohomology | 6 | `script-unfound` (6) |
| upper-half-plane-hyperbolic | 6 | `layout-mismatch` (3) |
| class-field-theory | 5 | `layout-mismatch` (3) |
| adeles-and-ideles | 5 | `layout-mismatch` (5) |
| sheaves | 5 | `script-unfound` (4) |
| theta-functions | 5 | `layout-mismatch` (4) |
| galois | 5 | `layout-mismatch` (3) |
| quadratic-reciprocity | 5 | `layout-mismatch` (5) |
| riemannian-geometry | 4 | `layout-mismatch` (4) |
| morphisms-fiber-products | 4 | `layout-mismatch` (3) |
| algebraic-number-theory | 4 | `layout-mismatch` (4) |
| frobenius-and-reciprocity | 4 | `layout-mismatch` (3) |
| dirichlet-series-euler-products | 4 | `layout-mismatch` (4) |
| operator-algebras | 3 | `layout-mismatch` (2) |
| functor-of-points | 3 | `layout-mismatch` (3) |
| sato-tate | 2 | `label-wrapped-input` (2) |
| stacks | 2 | `static-svg` (1) |
| commutative-algebra | 2 | `layout-mismatch` (2) |
| measure-theory | 1 | `layout-mismatch` (1) |


## Recommendations

The blockers cluster into a few distinct fix patterns:

1. **`script-unfound` / `layout-mismatch` (dominant)** — these two together account for most skips. They have different remediation paths:
   - `script-unfound`: re-run auto-pair with a looser heuristic that looks for scripts anywhere in `rawBodySuffix`, not just in adjacent `widget-script` blocks. Would likely unblock 50+ widgets in one pass.
   - `layout-mismatch`: each sub-variant (trailing explainer paragraphs, readout-before-svg order, multi-line .hd, <span class="ttl">) needs a small schema extension in the relevant family renderer. Incremental per-variant work.

2. **`label-wrapped-input`** — widgets have `<label>text <input type=range></label>` instead of `<label>text</label><input>`. All five registry renderers emit the non-wrapping form. Extending the markup emitter to handle the wrapping variant via a schema flag would unblock these.

3. **`3d-viewer`** — widgets using `make3DDraggable`/`proj3`. No registry module covers them. A new `widgets/surface-viewer/` module would absorb all of them (concentrated in differential-geometry, smooth-manifolds, lie-groups).

4. **`static-svg`** — pure illustrations with no controls. These arguably shouldn't live in `.widget` blocks at all — consider reclassifying them out of widget-status into a different markup class, which would just subtract them from the denominator.

5. **`bespoke`** — genuinely idiosyncratic domain logic. No shared-renderer fix; each needs a one-off `widgets/<slug>/` module or stays inline.

The next round of migration (Phase D) should tackle `script-unfound` first (biggest bucket, cheapest fix), then pick one of the `layout-mismatch` sub-variants or ship a new 3D-viewer renderer.
