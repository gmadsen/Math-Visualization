# Widget families — clustering audit

Classifies all 452 widget blocks in `content/*.json` by structural signature (SVG tag profile, control-input combo, and driving-script verb fingerprint) to identify a small set of shared renderers that can absorb the corpus. Source of truth: `content/*.json` parsed with `node-html-parser`, one signature per `widget` block, driving script pulled from the adjacent `widget-script` block (matched by `forWidget`, or by section-level adjacency as a fallback) plus any inline `script` field on the widget block itself.

Produced from: `scripts/_tmp_cluster_widgets.mjs` (not committed; delete after this audit).

## 1. Corpus summary

| metric | count |
| --- | ---: |
| Total widget blocks | **452** |
| Registry-driven (`slug`-based) | 5 |
| Inline (raw HTML + adjacent script) | **447** |
| Topics with widgets | 58 |

Registry entries in use today:

- `clickable-diagram` — 3 widgets (all in category-theory: `w-proof`, `w-univ`, `w-mon`)
- `composition-explorer` — 1 widget (`w-cat` in category-theory)
- `natural-transformation-explorer` — 1 widget (`w-nat` in category-theory)

Top 10 topics by widget count:

| topic | widgets |
| --- | ---: |
| category-theory | 17 |
| real-analysis | 14 |
| representation-theory | 13 |
| algebra | 12 |
| commutative-algebra | 12 |
| dynamical-systems | 12 |
| measure-theory | 12 |
| operator-algebras | 12 |
| functional-analysis | 11 |
| homological | 11 |

## 2. Proposed families (17 total, 13 of substantive size)

Widgets are partitioned by a cascade: (1) registry short-circuit, (2) 3D drag/projection verb (`make3DDraggable` / `proj3`), (3) control-input combo on an SVG host, (4) control-only (no SVG) groups. The cascade is deterministic — every widget falls into exactly one family.

Cumulative coverage after the top N families:

| top-N | cumulative widgets | % of inline (447) |
| ---: | ---: | ---: |
| 1 | 81 | 18% |
| 3 | 186 | 42% |
| 5 | 264 | 59% |
| 7 | 327 | 73% |
| 9 | 372 | **83%** |
| 11 | 401 | 90% |
| 13 | 425 | 95% |
| 15 | 441 | 99% |

### family: `slider-plot`

Count: **81 widgets across 30 topics**
Structural signature: SVG host (100%) + only `<input type="range">` + `<label>` (avg 1.5 ranges, 1.5 labels; zero buttons/selects). Script verbs: `addEventListener('input')` (84%), `SVG(...)` helper or `createElementNS` path/circle draw (85%), `.innerHTML = ''` clear-then-redraw loop (60%). Classic "drag a slider, watch a curve redraw" pattern.
Existing registry coverage: none.
Example widgets: `w-eulerconv @ L-functions`, `w-tate @ adeles-and-ideles`, `w-clock @ algebra`, `w-germ @ analytic-continuation`, `w-chain @ analytic-continuation`, `w-mono @ analytic-continuation`, `w-schwarz @ analytic-continuation`, `w-lac @ analytic-continuation`, `w-linecircle @ bezout`, `w-twoconics @ bezout`.
Params shape candidates: `{ widgetId, title, hint, svgId, viewBox, sliders: [{id, label, min, max, step, init, format}], axes?: {...}, draw: { kind: 'curve'|'scatter'|'lattice', series: [...] } }`. A portable renderer needs a formula/data provider registered per widget OR a script body passed through; for the handwritten vanilla-HTML frontend, including a raw script body as an artifact field is acceptable.
Notes: two sub-variants — (a) single-parameter 1-D plot (`w-clock`, `w-eulerconv`), (b) two sliders drive a 2-D plot (`w-mono`, `w-schwarz`). Both use the same markup skeleton; the widget family can cover both if the slider array is variable-length. This is the single biggest bucket.

### family: `select-slider-plot`

Count: **55 widgets across 23 topics**
Structural signature: SVG host (100%) + ≥1 `<select>` + ≥1 `<input type="range">`, no buttons. Select picks a mode (curve / surface / example); sliders tune that mode's parameter. Script verbs: `addEventListener('change')` (73%), `addEventListener('input')` (78%), full-redraw pattern (80% `SVG(...)`, 35% `.innerHTML=''`).
Existing registry coverage: none.
Example widgets: `w-cov @ algebraic-topology`, `w-cubic @ bezout`, `w-pc @ bsd`, `w-sha @ bsd`, `w-unit @ category-theory`, `w-dc @ complex-analysis`, `w-arg @ complex-analysis`, `w-plane @ differential-geometry`, `w-space @ differential-geometry`, `w-gmap @ differential-geometry`.
Params shape candidates: `{ widgetId, title, hint, svgId, viewBox, modes: [{ value, label, sliderDefaults, draw }], sliders: [{id, label, min, max, step}] }`. The "mode" key selects a closed-form or parametric formula family.
Notes: this is `slider-plot` + a mode picker. A shared renderer could subsume `slider-plot` by treating zero-length `modes` as "single default mode". That would take the combined count to 136.

### family: `select-diagram`

Count: **50 widgets across 29 topics**
Structural signature: SVG host (68%; the 32% without SVG use a `foreignObject`-hosted HTML block) + ≥1 `<select>` + zero ranges + zero/one button, with `<label>`-accompanied picker. Script verbs: `addEventListener('change')` (66%), `innerHTML` assignment (50%). Select drives a complete redraw of a diagram/example; no continuous parameter.
Existing registry coverage: conceptually the nearest sibling of the existing `clickable-diagram` "readout-only" mode (select + readout), though current `clickable-diagram` is SVG-less.
Example widgets: `w-fe @ L-functions`, `w-ff @ algebra`, `w-ram @ algebraic-number-theory`, `w-funit @ algebraic-number-theory`, `w-iunit @ algebraic-number-theory`, `w-mv @ algebraic-topology`, `w-chi @ algebraic-topology`, `w-multcalc @ bezout`, `w-res @ bezout`, `w-zoo @ bsd`.
Params shape candidates: `{ widgetId, title, hint, svgId, viewBox, pick: { id, label, options: [{value,label,selected?}] }, cases: { <value>: { diagram: {nodes,edges,labels}, readout: string } } }`. Widely portable.
Notes: this family has the clearest opportunity to extend the existing `clickable-diagram` shared renderer — the `readout-only` branch already handles `select → readout` mapping; adding an `svg-diagram` branch would absorb these.

### family: `button-stepper-svg`

Count: **45 widgets across 28 topics**
Structural signature: SVG host (82%) + ≥1 `<button>` (avg **3.4 buttons**, often "step", "reset", "randomize", "next") + zero ranges + zero selects. Script verbs: `addEventListener('click')` (82%), `drawArrow` (24%), `drawNode` (9%). State machine stepped by button clicks.
Existing registry coverage: the `clickable-diagram` proof-stepper mode already covers "prev/next/reset over a sequence of diagrams" (3 widgets); the remaining 42 are generalizations of that pattern.
Example widgets: `w-sign @ L-functions`, `w-class @ algebraic-number-theory`, `w-wind @ algebraic-topology`, `w-Lz @ bsd`, `w-2cat @ category-theory`, `w-langlands @ class-field-theory`, `w-frob @ frobenius-and-reciprocity`, `w-twist @ functor-of-points`, `w-profinite @ galois-representations`, `w-diagram @ galois-representations`.
Params shape candidates: `{ widgetId, title, hint, svgId, viewBox, buttons: [{id, label, action}], states: [{title, svg, readout}], initialState, transitions: {from: {action: to}} }`.
Notes: two variants — (a) linear step/reset sequence (proof steppers, covered by existing shared widget), (b) branching state machine where buttons trigger different transitions from a state. The shared proof-stepper schema probably cannot handle (b) without a redesign.

### family: `static-svg`

Count: **33 widgets across 19 topics**
Structural signature: SVG host (91%) + **zero interactive controls**. Often rendered entirely from the HTML; sometimes a small script adds labels or decoration at load time. 27% call `drawArrow`, 15% call `drawNode`.
Existing registry coverage: none needed — these are illustrations, not widgets in the "toy you poke" sense. Candidate for removal from the widget count or relegation to an illustration asset type.
Example widgets: `w-schema @ L-functions`, `w-ap @ L-functions`, `w-mellin @ L-functions`, `w-mod @ L-functions`, `w-enr @ category-theory`, `w-s3 @ frobenius-and-reciprocity`, `w-motive @ hecke-operators`, `w-commute @ hecke-operators`, `w-eig @ hecke-operators`, `w-pet @ hecke-operators`.
Params shape candidates: trivially a single `svg` string; would not benefit from a renderer. Either leave bespoke or promote to an `illustration` block type distinct from `widget`.
Notes: flagged because they're counted as widgets today but violate the "every widget should be pokable" house principle. Worth a conversation with the project owner.

### family: `select-readout`

Count: **32 widgets across 14 topics**
Structural signature: **no SVG** + ≥1 `<select>` + zero ranges + optional button (avg 0.19) + a `.readout` div. Script verbs: `addEventListener('change')` (66%), `innerHTML` assignment (34%). Pure "choose a case, render a textual/tabular answer".
Existing registry coverage: `clickable-diagram.readout-only` (`w-univ`, `w-mon`) is exactly this pattern — 2 already absorbed; 30 more candidates.
Example widgets: `w-decoder @ L-functions`, `w-cayley @ algebra`, `w-cosets @ algebra`, `w-quot @ algebra`, `w-homog @ bezout`, `w-rad @ commutative-algebra`, `w-noeth @ commutative-algebra`, `w-int @ commutative-algebra`, `w-tr @ commutative-algebra`, `w-chartab @ dirichlet-series-euler-products`.
Params shape candidates: directly reuses `widgets/clickable-diagram/schema.json#$defs/readoutOnly`. The only addition needed is support for HTML (table/latex) output, not only text, so the readout slot becomes `innerHTML` capable — already de-facto used.
Notes: **highest-leverage expansion target** — the schema already exists and already ships to 2 widgets; lifting 30 more costs one schema tweak (richer readout) and one content-JSON rewrite per widget.

### family: `input-calculator`

Count: **31 widgets across 17 topics**
Structural signature: **no SVG** + `<input type="number">` or `<input type="text">` (avg 1.8 number, 0.3 text) + button(s) (avg 1.3, usually "compute") + select(s) (avg 0.4). Typed-entry "enter a number, hit compute, read the result" calculator.
Existing registry coverage: none.
Example widgets: `w-idele @ adeles-and-ideles`, `w-eucl @ algebra`, `w-sylow @ algebra`, `w-abelian @ algebra`, `w-poly @ algebra`, `w-artin @ class-field-theory`, `w-tens @ commutative-algebra`, `w-loc @ commutative-algebra`, `w-flat @ commutative-algebra`, `w-factor @ frobenius-and-reciprocity`.
Params shape candidates: `{ widgetId, title, hint, inputs: [{id, label, type: 'number'|'text', init, placeholder}], actions: [{id, label}], compute: <identifier>, readoutId }`. Hard to make portable because each widget's `compute` is bespoke (gcd, Sylow count, factorization). Portable variant: a sandboxed formula expression.
Notes: the compute logic is what distinguishes each widget, so a shared renderer only handles chrome — useful but lower leverage than `select-readout`.

### family: `slider-plot-actions`

Count: **23 widgets across 17 topics**
Structural signature: SVG host (83%) + sliders (avg 1.4) + buttons (avg 2.4, typically "reset", "apply", "randomize"). Superset of `slider-plot` with imperative actions.
Existing registry coverage: none.
Example widgets: `w-dih @ algebra`, `w-ring @ algebraic-number-theory`, `w-zeta @ analytic-continuation`, `w-pascal @ bezout`, `w-ball @ functional-analysis`, `w-gs @ functional-analysis`, `w-opnorm @ functional-analysis`, `w-spec @ functional-analysis`, `w-sub @ hecke-operators`, `w-lp @ measure-theory`.
Params shape candidates: same as `slider-plot` plus `buttons: [{id, label, action}]`. A unified `slider-plot` schema with optional `buttons` would absorb this family entirely.
Notes: sub-variant of `slider-plot` that the renderer should cover from day one.

### family: `select-diagram-actions`

Count: **22 widgets across 15 topics**
Structural signature: SVG host (68%) + ≥1 `<select>` + ≥1 `<button>` (avg 2.1 buttons) + zero ranges. Select picks the diagram; buttons run actions on it (iterate, randomize, step).
Existing registry coverage: partially — the `clickable-diagram.proof-stepper` branch covers "select + prev/next/reset", and 3 of these widgets (the three category-theory ones already migrated) are the template.
Example widgets: `w-crt @ adeles-and-ideles`, `w-simp @ algebraic-topology`, `w-mw @ bsd`, `w-ct @ bsd`, `w-fun @ category-theory`, `w-yo @ category-theory`, `w-yo2 @ category-theory`, `w-contour @ complex-analysis`, `w-repr @ functor-of-points`, `w-gln @ functor-of-points`.
Params shape candidates: same as `select-diagram` plus `actions: [{id, label, handler}]`.
Notes: merges with `select-diagram` if the handler/action slot is optional.

### family: `control-html`

Count: **15 widgets across 10 topics**
Structural signature: **no SVG** + sliders (avg 2.1) + labels + sometimes buttons/selects, driving an HTML readout (table, matrix, formula). Script verbs: `addEventListener('input')` (73%).
Existing registry coverage: none.
Example widgets: `w-leading @ bsd`, `w-jac @ etale-cohomology`, `w-lef @ etale-cohomology`, `w-adjoint @ functional-analysis`, `w-sym @ functional-analysis`, `w-res @ homological`, `w-comm @ lie-groups`, `w-cover @ lie-groups`, `w-id @ modular-forms`, `w-level @ modularity-and-flt`.
Params shape candidates: shares the `slider-plot` skeleton but swaps the SVG canvas for an HTML readout region. A generalized "parametric renderer" schema with a `canvas: 'svg'|'html'` switch would cover both.
Notes: often the computation is a matrix/formula rendered via KaTeX into an HTML slot.

### family: `panel-mixed`

Count: **14 widgets across 13 topics**
Structural signature: SVG host (86%) + **heterogeneous controls** — on average 1 select, 0.6 range, 1.2 number, 0.6 button, per widget. The "kitchen sink" widget.
Existing registry coverage: none, and by construction hard to give one.
Example widgets: `w-hecke @ L-functions`, `w-mink @ algebraic-number-theory`, `w-pb @ category-theory`, `w-tan @ commutative-algebra`, `w-cyc @ frobenius-and-reciprocity`, `w-cyclo @ galois-representations`, `w-cond @ modularity-and-flt`, `w-evx @ operator-algebras`, `w-gt @ operator-algebras`, `w6 @ p-adic-numbers`.
Params shape candidates: would require a generic control-panel schema: `controls: [{kind: 'range'|'select'|'number'|'button'|'checkbox', ...}]`. Doable but expressive — it's a widget DSL at that point.
Notes: the edge where shared-widget effort stops paying off. Likely candidates for case-by-case bespoke entries.

### family: `input-plot`

Count: **13 widgets across 12 topics**
Structural signature: SVG host (92%) + `<input type="number">` (avg 2.2) + button (avg 1.9) — "type a vector/polynomial, hit go, see the diagram". `innerHTMLAssign` 85%.
Existing registry coverage: none.
Example widgets: `w-places @ adeles-and-ideles`, `w-pushout @ category-theory`, `w-ngon @ galois`, `w-gen @ modular-forms`, `w1 @ p-adic-numbers`, `w-ram @ partitions-generating-functions`, `w-markov @ probability-theory`, `w-discriminant @ quadratic-forms-genus-theory`, `w-specz @ schemes`, `w-speckx @ schemes`.
Params shape candidates: `{ inputs: [...], actions: [...], svg: {...}, compute: <bespoke> }`. Like `input-calculator` but with an SVG output.
Notes: sister of `input-calculator`. The two share the "type-it-in" input pattern.

### family: `static-html`

Count: **11 widgets across 8 topics**
Structural signature: **no SVG, no controls**. Pure declarative HTML — a table, a KaTeX-rendered formula, a paragraph. Often has a tiny click handler to toggle a detail or highlight a row (27% have `click` listener).
Existing registry coverage: none needed.
Example widgets: `w-orbits @ algebra`, `w-diagram-editor @ category-theory`, `w-dict @ class-field-theory`, `w-quintic-scrub @ galois`, `w-a5 @ galois`, `w-mon @ moonshine`, `w-faul-triangular @ power-sums-bernoulli`, `w-faul-cubic @ power-sums-bernoulli`, `w-pattern @ quadratic-reciprocity`, `w-table @ sums-of-squares`, `w-waring @ sums-of-squares`.
Params shape candidates: none — these are illustrations, same policy question as `static-svg`.
Notes: like `static-svg`, these are "widgets" in name only. Worth discussing whether they should remain in the widget count.

### family: `clickable-graph`

Count: **9 widgets across 8 topics**
Structural signature: SVG host (100%) + **zero controls** + script attaches `click` / `pointerdown` handlers (89% click). User clicks on SVG elements (nodes, regions, primes, charts) to drive the readout.
Existing registry coverage: none directly, though conceptually close to the proof-stepper — the proof-stepper just has explicit prev/next buttons instead of click-on-diagram.
Example widgets: `w-adele @ adeles-and-ideles`, `w-clsvis @ class-field-theory`, `w-compare @ functor-of-points`, `w-chain @ modularity-and-flt`, `w-scale @ probability-theory`, `w-charts @ projective-plane`, `w-classgroup @ quadratic-forms-genus-theory`, `w-spec @ schemes`, `w-glue @ schemes`.
Params shape candidates: `{ svgId, viewBox, targets: [{id, data}], readoutId, cases: {<target-id>: readoutHTML} }`.
Notes: click-on-SVG is a distinct UX affordance worth its own renderer; the data model is basically `select-readout` where the "select" is a click on a hotspot.

### family: `3d-viewer`

Count: **7 widgets across 3 topics**
Structural signature: `make3DDraggable` and/or `proj3` present (100%), SVG host (100%), usually sliders for surface parameters, drag handlers for rotation.
Existing registry coverage: none.
Example widgets: `w-defect @ differential-geometry`, `w-geo @ differential-geometry`, `w-gb @ differential-geometry`, `w-poly @ differential-geometry`, `w-hol @ differential-geometry`, `w-lor @ dynamical-systems`, `w-su2path @ lie-groups`.
Params shape candidates: `{ svgId, viewBox, surface: { kind, uRange, vRange }, overlays: [...], initialView: {yaw, pitch}, sliders: [...] }`. Non-trivial because the surface-to-render is widget-specific.
Notes: concentrated in 3 topics; AGENTS.md devotes a dedicated section to this pattern (decimation-on-drag, legend placement). A shared renderer here would pay back in maintainability of those three topics' files more than in widget count.

### family: `toggle-illustration`

Count: **4 widgets across 4 topics**
Structural signature: SVG host (50%) + checkbox and/or radio controls. Toggles layers on an illustration.
Example widgets: `w-mobius @ complex-analysis`, `w-stcircle @ etale-cohomology`, `w-apbar @ galois-representations`, `w-param @ singular-cubics-reduction`.
Notes: too small to justify dedicated shared renderer.

### family: `button-stepper-text`

Count: **2 widgets across 2 topics** — `w-sd @ algebra`, `w-def @ modularity-and-flt`.
Notes: same pattern as `button-stepper-svg` but output is HTML rather than SVG.

## 3. Uncovered tail (long-tail widgets unsuited to shared renderers)

Widgets in the three smallest inline families (17 total) are the working "tail" — they probably belong as bespoke `widgets/<slug>/` entries or stay inline:

- `w-orbits @ algebra` — tabular Orbit / Burnside explorer, pure HTML. (static-html)
- `w-diagram-editor @ category-theory` — a bespoke DOM editor for drawing commuting squares live. (static-html)
- `w-dict @ class-field-theory` — two-column dictionary of Galois ↔ ideals correspondences. (static-html)
- `w-mobius @ complex-analysis` — checkbox panel toggling Möbius-playground layers. (toggle-illustration)
- `w-stcircle @ etale-cohomology` — sweep Frobenius eigenvalues over the unit circle. (toggle-illustration)
- `w-apbar @ galois-representations` — `$a_p$` bar chart with checkbox filters. (toggle-illustration)
- `w-quintic-scrub @ galois` — interactive scrubber over quintic resolvents. (static-html)
- `w-a5 @ galois` — conjugacy-class table for $A_5$. (static-html)
- `w-def @ modularity-and-flt` — Widget 4 · deformation-ring dimension counter via buttons. (button-stepper-text)
- `w-mon @ moonshine` — Widget 2 · Monster irreducible dimensions table. (static-html)
- `w-faul-triangular @ power-sums-bernoulli` — Faulhaber triangular cascade. (static-html)
- `w-faul-cubic @ power-sums-bernoulli` — Faulhaber cubic cascade. (static-html)
- `w-pattern @ quadratic-reciprocity` — QR sign-pattern over prime pairs. (static-html)
- `w-sd @ algebra` — SES classifier, button-driven. (button-stepper-text)
- `w-param @ singular-cubics-reduction` — parametrize the smooth locus, toggles. (toggle-illustration)
- `w-table @ sums-of-squares` — `$r_k(n)$` table for small $n,k$. (static-html)
- `w-waring @ sums-of-squares` — Waring constants table. (static-html)

In addition, all **33 `static-svg`** widgets and **11 `static-html`** widgets are tail in a stricter sense: they're illustrations, not interactive toys. Those 44 widgets represent ~10% of the corpus and should either stay bespoke or be reclassified as an `illustration` block type.

## 4. Implementation priority

Ranking by (coverage × ease-of-implementation × leverage on existing registry work):

1. **Extend `clickable-diagram` to absorb `select-readout` (30 widgets) + `select-diagram` (50 widgets) + `select-diagram-actions` (22 widgets).** Combined: **102 widgets across 40 topics**. The schema already exists with `readout-only` and `proof-stepper` branches; adding a `select-svg-diagram` branch and relaxing the readout to allow HTML output unlocks a third of the corpus with minimal new design work. Biggest ROI by far.

2. **Build a new `parametric-plot` shared widget covering `slider-plot` (81) + `slider-plot-actions` (23) + `select-slider-plot` (55).** Combined: **159 widgets across ~45 topics**. Schema is a single `{ sliders: [...], modes?: [...], buttons?: [...], draw: { kind, series } }` with three optional arrays. The hard part is the `draw` description — many widgets compute series in bespoke JS. Tactically, start with a schema that treats the draw body as an artifact string (like `clickable-diagram` does with `proofsLiteral`/`dataLiteral`) so migration is lossless for the vanilla-HTML frontend, then incrementally replace artifact strings with portable formula descriptors.

3. **Build `button-stepper` shared widget covering `button-stepper-svg` (45) + `button-stepper-text` (2) + non-SVG half of existing `clickable-diagram.proof-stepper` pattern generalization.** Combined: **47+ widgets across 28+ topics**. The proof-stepper schema is nearly there; the main gap is supporting branching state machines in addition to linear sequences.

4. **Build `input-form` shared widget covering `input-calculator` (31) + `input-plot` (13).** Combined: **44 widgets across 25+ topics**. Lower-leverage because each widget's compute function is bespoke, but the chrome (labeled inputs, action buttons, readout slot) is identical. Good "bikeshed surface reduction" target.

5. **Build `clickable-graph` shared widget** (**9 widgets**) as a variant of the absorbed `select-readout` pattern where the "select" is a hotspot click on an SVG diagram. Small count but distinctive UX and probably easy given the existing `select-readout` schema.

Deferred: **`panel-mixed` (14)** and **`3d-viewer` (7)** are either too heterogeneous or too concentrated to justify shared-renderer investment ahead of the priority-1/2/3 wins. `static-svg` / `static-html` (44 combined) should get a policy decision on whether to be reclassified as illustrations rather than widgets.

**Top-three shared renderers, if built as described, cover 308 of 447 inline widgets = 69% of the inline corpus (plus the 5 already registry-driven = 70% of the whole 452).** Adding priorities 4 and 5 pushes coverage to **361 / 452 = 80%**, hitting the goal with exactly 5 shared renderers (4 new + the existing `clickable-diagram` extended).
