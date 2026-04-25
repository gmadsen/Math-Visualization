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

See each slug's `README.md` for its param reference and alternate-frontend porting notes.

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
