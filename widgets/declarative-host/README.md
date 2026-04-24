# declarative-host

Shared renderer for widgets that ship as an **empty host div**
(`<div class="widget" id="…"></div>`) plus a self-contained `<script>` that
calls a page-global library's `init(selector, config)` method. The library
does everything — header, SVG/DOM construction, event wiring, KaTeX pass.
The widget contributes no per-widget script body beyond that single init
call, so the `config` object is the entire declarative surface.

This factors out the three widgets that share the "empty div + shared
library + config object" pattern, dropping three near-identical
bespoke modules to one registry entry.

See [../README.md](../README.md) for the registry contract.

## Supported libraries

Two libraries are recognised today, validated by a `oneOf` on the top-level
`library` enum:

| `library`            | covers                                               | key `config` fields                                       |
|----------------------|------------------------------------------------------|-----------------------------------------------------------|
| `MVPatternInduction` | rule-induction grid (examples → hidden test cases)   | `examples`, `testCases`, `inputKind`, `canonicalLatex`    |
| `MVDiagramEditor`    | draggable commutative-diagram editor with path check | `objects`, `morphisms`, `commutes`, `width`, `height`     |

Each `config` branch uses `additionalProperties: true` so library-internal
flags (tolerances, display modes, autoplay intervals) pass through without
forcing the schema to track every option.

### Widgets on this pattern

- `power-sums-bernoulli/w-faul-triangular` — `MVPatternInduction`, induce $\sum k$.
- `power-sums-bernoulli/w-faul-cubic` — `MVPatternInduction`, induce $\sum k^3$.
- `category-theory/w-diagram-editor` — `MVDiagramEditor`, pullback-square editor.

A fourth widget (`galois/w-quintic-scrub`) was initially scoped for this
family but turned out to carry ~130 lines of bespoke pre-init JS (a shared
`drawFrame` helper, `NODES`/`EDGES` constants, and step `render(svg)`
functions that reference those closures). Representing it as a pure
declarative config would require embedding function bodies as strings,
which negates the portability story; it stays as an `{ type: "widget" }`
inline block and remains a bespoke skip for the round-trip renderer.

## Params

See [`schema.json`](./schema.json) for the authoritative shape. Summary:

| field | type | purpose |
|---|---|---|
| `widgetId` | string | DOM id for the outer `<div class="widget">` host. |
| `library` | enum | Name of the page-global library whose `.init()` is called. |
| `config` | object | Data passed as the second argument to `<library>.init(selector, config)`. Shape depends on `library`. |
| `title` | string (optional) | Pre-rendered `.hd > .ttl` on the host div (most widgets omit this — the library renders its own header from `config.title`). |
| `hint` | string (optional) | Pre-rendered `.hd > .hint`, same caveat. |
| `titleTag`, `hintTag` | `"div"` \| `"span"` (optional) | Layout-variant tags for the header pair. |
| `sectionComment` | string (optional) | Text placed between `<script>` and `(function(){` as `/* <here> */`. |

## Renderer output

`renderMarkup(params)`:
- Default (no `title`): `<div class="widget" id="{widgetId}"></div>`.
- With `title`: host div + `.hd` header row (rare).

`renderScript(params)`:
```html
<script>
(function(){
  if(!window.{library}) return;
  {library}.init('#{widgetId}', { …JSON-stringified config… });
})();
</script>
```

`config` is emitted via `JSON.stringify(config, null, 2)` indented two
spaces past the `.init(` call. Portable consumers parse the JSON directly
and ignore this script block entirely.

## Portability story

Alt frontends (React, SSR, Three.js-based prototypes) can read a
declarative-host params block and:
1. Read `library` to pick a component (`<PatternInductionGrid>`,
   `<DiagramEditor>`).
2. Pass `config` verbatim as props — no string parsing needed; the schema
   guarantees its shape.

The `MV*` libraries themselves are vanilla-site-specific DOM/SVG renderers
(they call `createElementNS`, `document.querySelector`, `renderMathInElement`
etc.) so they don't port — but the portability contract is that the
declarative `config` is universal and each frontend supplies its own
renderer. That mirrors the rest of the registry's shared-renderer story
(`button-stepper`'s `bodyScript`, `surface-viewer`'s `bodyMarkup`): an
artifact field for the current vanilla frontend, plus pure data for
everyone else. Here the "artifact" is just the library name and a
pointer-free init call — cleaner than most registry entries.

## Usage

Embed in `content/<topic>.json` with a block pair:

```json
{ "type": "widget",        "slug": "declarative-host", "id": "w-foo",
  "params": { "widgetId": "w-foo", "library": "MVPatternInduction",
              "config": { "examples": [[1,1],[2,3]], "testCases": [[3,6]] } } },
{ "type": "widget-script", "slug": "declarative-host", "forWidget": "w-foo",
  "params": { "widgetId": "w-foo", "library": "MVPatternInduction",
              "config": { "examples": [[1,1],[2,3]], "testCases": [[3,6]] } } }
```

The `config` object is duplicated between the two blocks (as with every
other registry entry) so each block is self-contained. Validate with
`node scripts/rebuild.mjs --only widget-params`; full round-trip with
`node scripts/rebuild.mjs`.
