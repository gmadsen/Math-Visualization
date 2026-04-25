# Widget registry

A widget is a framework-agnostic interactive element. Each entry under `widgets/` ships a JSON Schema describing its parameters, a vanilla-JS reference renderer, and a README. Any frontend — the existing hand-written HTML, a React app, a presentation mode, anything — can consume the same schema and render its own component.

## Directory layout

```
widgets/
  <slug>/
    schema.json    JSON Schema 2020-12 for the widget's params
    index.mjs      export function renderMarkup(params)  -> HTML string
                   export function renderScript(params)  -> <script>…</script> string
    README.md      what the widget does + param reference
```

Both `renderMarkup` and `renderScript` are **pure functions of params**. They produce exactly the bytes that would appear in a handwritten topic HTML file if the widget were inlined there. The current vanilla-HTML site uses these functions via `scripts/render-topic.mjs`; a React consumer ignores `index.mjs` entirely and renders its own component from the schema + params (see `examples/react-consumer/`).

## Current entries

| slug | kind | what it covers |
|---|---|---|
| `composition-explorer` | bespoke | category-theory `#cat` — functor-of-sets composition toy. |
| `natural-transformation-explorer` | bespoke | category-theory `#nat` — side-by-side naturality square. |
| `clickable-diagram` | shared | click-on-SVG widgets with readout / proof-stepper / static-diagram branches. Covers category-theory + the broader Phase C corpus. |
| `clickable-graph` | shared | click-on-SVG widgets whose interaction reads graph structure (nodes + edges) rather than a fixed diagram — covers the 9-widget cluster that `clickable-diagram` didn't fit. |
| `parametric-plot` | shared | slider-driven 2D plots. Single-mode (one plot) and multi-mode (select + plots) branches via `oneOf`; `labelWraps` flag handles the `<label>text <input></label>` markup variant. |
| `button-stepper` | shared | SVG + button-only widgets (no sliders) — step through a sequence of states. |
| `input-form` | shared | text/number form inputs driving a readout. `labelWraps` flag available. |
| `surface-viewer` | shared | 3D parametric-surface / polyhedron / trajectory viewers built on the page-global `make3DDraggable` + `proj3` helpers. `standard` interaction for the common header-controls-svg-readout layout; `bare` interaction carries idiosyncratic layouts as a `bodyMarkup` artifact. |
| `svg-illustration` | shared | static SVG figures with no driving script. Registered for `meta` + portability (alternate frontends can pick an illustration-appropriate rendering strategy). `renderScript` always returns `''`. |
| `declarative-host` | shared | empty host div + a single `<library>.init('#widgetId', config)` call. Today's libraries: `MVPatternInduction` (rule-induction grid), `MVDiagramEditor` (draggable commutative diagrams). Add a third by extending the schema's `library` enum. |
| `proof-scrubber` | shared | declarative wrapper over `MVProofScrubber` (`js/widget-proof-scrubber.js`). `steps: [{title, body, svgInner?}]` — slider + play-pause walks through proof steps with synchronized SVG. Per-step state is data, not closures. |
| `recurrence-plotter` | shared | declarative wrapper over `MVRecurrencePlotter` (`js/widget-recurrence-plotter.js`). Iterates `x_{n+1} = f(x_n)` (or two-term) for a curated `kind` whitelist (logistic, quadratic, linear-2term); shows trajectory + cobweb. |
| `modular-arithmetic-clock` | shared | declarative wrapper over `MVModularArithmeticClock` (`js/widget-modular-arithmetic-clock.js`). Z/n on a circular dial; `kind: addition` or `multiplication`; sliders for n, a, b. Highlights cycles and unit/zero-divisor structure. |
| `lattice-visualizer` | shared | declarative wrapper over `MVLatticeVisualizer` (`js/widget-lattice-visualizer.js`). 2D lattice with basis sliders, fundamental domain, optional sublattice + index `[Λ:Λ′] = │det M│`. |
| `constraint-bifurcation-explorer` | shared | declarative wrapper over `MVConstraintBifurcationExplorer` (`js/widget-constraint-bifurcation-explorer.js`). Per-pixel sampled feasible region for a curated constraint family (`circle-radius`, `ellipse-eccentricity`, `saddle-pitchfork`); slider for the parameter triggers the bifurcation. |
| `counterexample-explorer` | shared | declarative wrapper over `MVCounterexampleExplorer` (`js/widget-counterexample-explorer.js`). Author declares hypotheses + cases as data; widget renders dropdown + illustration + pass/fail checklist. Library never evaluates objects — pass/fail is curated. |
| `inline-code-cell` | shared | declarative wrapper over `MVInlineCodeCell` (`js/widget-inline-code-cell.js`). JS-only sandboxed REPL: textarea + Run button, code runs in a Web Worker (no DOM, 2-second timeout, network APIs deleted), captures `console.log` + return value. Number-theory prelude (`gcd`, `mod`, `factor`, `isPrime`, `primes`, `pow`). |

See each slug's `README.md` for its param reference and alternate-frontend porting notes.

## Choosing a widget when authoring a topic

**Read this section before defaulting to button-stepper.** Today's corpus
is heavily skewed (~77% of widgets are `button-stepper`); new topics
reach for it because it's familiar, not because it's the best fit.
Variety in the registry is there to be used — match the slug to the
pedagogical move.

Pick by what the reader *does*, not by what's easiest to wire:

| reader's gesture | reach for | when                                                                                          |
|------------------|-----------|-----------------------------------------------------------------------------------------------|
| **read** the diagram | `svg-illustration`        | Static figure — no interaction needed; the picture *is* the point.                                |
| **step** through a sequence | `button-stepper`           | Discrete states with prev/next/reset; default for "stages of a construction."                       |
| **scrub** through a proof | `proof-scrubber`           | Multi-step argument with synchronized prose + diagram; scrubber + play/pause; longer than a stepper. |
| **drag a slider** to vary one parameter | `parametric-plot`, `recurrence-plotter`, `modular-arithmetic-clock`, `lattice-visualizer`, `constraint-bifurcation-explorer` | Parameter sweep, bifurcation, iteration, basis change, region morphing. Pick by what's being plotted. |
| **drag a 3D view** | `surface-viewer`           | 3D surface, manifold, polyhedron, trajectory — yaw/pitch via `make3DDraggable`.                   |
| **click** a node / region of an SVG | `clickable-diagram`, `clickable-graph` | Selection-driven exploration: pick a morphism / pick a graph node, see consequences in a readout.  |
| **type / fill in** a number or expression | `input-form`               | Form-driven probes — "give me an n, I'll factor it" — no slider semantics fits.                     |
| **browse a curated case library** | `counterexample-explorer`  | "Here are 4 candidates and 4 hypotheses; for each pair, does it pass?" Pure data, no eval.        |
| **edit and run code** | `inline-code-cell`         | Computational asides — number-theory experiments, lattice searches, sieve playgrounds. JS in a Web Worker. |
| **everything else (rare)** | `declarative-host`         | Empty host div + `<library>.init` for `MVPatternInduction` / `MVDiagramEditor` etc. when the page-global library does the work. |

A single concept page generally benefits from **at least two different
gesture classes** — say, one slider widget and one click widget, or one
proof-scrubber and one inline-code-cell. Reach across the table when
the topic naturally has multiple "shapes" of insight (a static
illustration motivates the definition; a slider explores the
parameter space; a code cell verifies a special case numerically).

When nothing in the table fits, **don't extend `button-stepper` to
absorb it** — register a new slug via `node scripts/new-widget.mjs <slug>`
and add it to this table. The 7 newest slugs (proof-scrubber,
recurrence-plotter, modular-arithmetic-clock, lattice-visualizer,
constraint-bifurcation-explorer, counterexample-explorer,
inline-code-cell) all came from this rule. See `audits/coverage-stats.md`
§ "Per-slug registry adoption" for the live instance count per slug —
slugs at zero are infrastructure waiting for content.

## Bespoke vs. shared

- **Bespoke** (`composition-explorer`, `natural-transformation-explorer`): one module per widget. Cheap to write, schema matches one widget's shape, no cross-widget abstraction. Use when the widget is irreducibly idiosyncratic.
- **Shared** (everything else): one module driving multiple widgets via a `oneOf` on an `interaction` param. Higher upfront design cost; pays off when three or more widgets share structure. The shared module's schema must fit every absorbed widget, with artifact fields (`bodyScript`, `bodyMarkup`, `sectionComment`) carrying per-widget bytes that don't generalize.

Empirical rule of thumb after Phase B+C+D: most of the 452 inline widgets fall into roughly eight shared families; the remaining bespoke-only widgets are genuinely domain-heavy (randomized-functor tables, sets-and-maps blob renderers, custom group-theory arithmetic) and belong in per-widget modules if they get registered at all.

## Adding a widget

Quickstart: `node scripts/new-widget.mjs <slug> [--family <f>] [--dimension 2d|3d] [--gesture <g>] [--role <r>]` stamps out `widgets/<slug>/` with `schema.json`, `index.mjs`, and `README.md` stubs pre-wired with the `meta` block, minimal `{ widgetId, title, hint? }` params, and `TODO(<slug>)` markers at the points you need to edit. Re-runs without `--force` exit 0 as a no-op; `--force` overwrites. The 6-step manual flow below is the reference for what the scaffolder produces and what you still have to fill in.

1. Read two or three existing `widgets/<slug>/index.mjs` files to pattern-match.
2. Write `widgets/<new-slug>/schema.json`. Required fields: `widgetId` and whatever structural ids the widget needs (`svgId`, `outputId`, etc.). Then the "data" fields the widget actually renders.
3. Write `widgets/<new-slug>/index.mjs` with `renderMarkup(params)` and `renderScript(params)` as pure functions. The output must be byte-identical to the widget as it currently appears in the handwritten topic HTML.
4. Replace the widget block in `content/<topic>.json`:
   - From `{ type: "widget", id: "w-foo", html: "…inline…" }`
   - To `{ type: "widget", slug: "<new-slug>", params: { … } }`
   - And the matching script block from `{ type: "widget-script", forWidget: "w-foo", html: "<script>…</script>" }` to `{ type: "widget-script", slug: "<new-slug>", params: { … } }` (same params object).
5. Verify round-trip: `node scripts/render-topic.mjs <topic> | md5sum` must match `md5sum <topic>.html`. The `roundtrip` step in `rebuild.mjs` gates this automatically.
6. `rebuild.mjs`'s `widget-params` step (via `scripts/validate-widget-params.mjs`) AJV-validates every slug-referenced params block against its schema on every run. Breaking the schema or omitting a required field is a hard CI failure.

## Presentational "artifact" params

Some fields exist purely to preserve byte-identical output from the current handwritten source (whitespace alignment inside script bodies, comment banners, inline style attributes that one widget uses but others don't). Mark them clearly in the schema and README as artifacts so a React / Three.js / any-frontend consumer knows to ignore them. Every other field is fundamental data that any renderer needs.

## Consumers

- Vanilla site: `scripts/render-topic.mjs` resolves `slug` via dynamic `import("./widgets/<slug>/index.mjs")` and calls `renderMarkup` / `renderScript`. Used by every topic that has a `content/<topic>.json` entry.
- React POC: `examples/react-consumer/` — `ReactDOMServer.renderToString` of a React component that takes params as props. Reads `schema.json` at runtime; AJV-validates; renders.
- Three.js (evaluation): `examples/threejs-prototype/` is not registry-integrated yet; it's a prototype comparing Three.js rendering to the current SVG approach for a new fiber-bundle widget.
