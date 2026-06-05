# graph-edit-2d

Self-contained **"build the graph"** engine — the corpus's `graph-edit` gesture.
The reader edits a small graph by direct manipulation and an author-supplied
live invariant updates after every edit. First home:
`spectral-graph-theory §components` (build a graph, watch its connected
components recolour — the combinatorial face of $\dim\ker L = \#\text{components}$).

Use it whenever the lesson is *"change the graph and watch X respond"*:
connected components, a greedy colouring / chromatic number, the degree
sequence, a spanning forest (matroid independence), the Laplacian spectrum,
a max-matching, an Eulerian condition, etc.

## The three gestures

- **Add a vertex** — click empty space.
- **Toggle an edge** — drag from one vertex onto another (a rubber-band line
  follows the pointer); adds the edge if absent, removes it if present.
- **Delete a vertex** — click a vertex (and its incident edges go with it).

Plus a **Reset** button restoring the initial graph.

## Division of labor

- **Engine (this renderer):** owns the edit gesture — pointer hit-testing
  against vertex positions, the rubber-band drag, add / delete / toggle-edge,
  vertex-position clamping, and Reset — plus the mutable data model. jsdom-safe:
  `createSVGPoint`/`getScreenCTM` run only inside the pointer handlers, never at
  init.
- **Author (`params.bodyScript`):** defines `function draw(g){ … }`. On init,
  after every edit, and on Reset it clears + redraws the SVG group `G`
  (typically the edges, then the vertices coloured/annotated by whatever
  invariant the lesson is about) and writes the readout `out`. It receives the
  live model and the page-global `$`/`SVG`. It must **not** start a timer.

The model `g` passed to `draw`:

| field | meaning |
|---|---|
| `g.nodes` | `[{id, x, y}]` — vertices in **pixel** (viewBox) coords |
| `g.edges` | `[{u, v}]` — edges as ordered pairs of vertex ids (`u < v`) |
| `g.adj` | `{id: [neighbourId, …]}` adjacency, rebuilt each call |
| `g.deg(id)` | degree of a vertex |
| `g.n` / `g.m` | vertex / edge counts |
| `g.R` | vertex radius (px) — draw circles of this radius so they line up with hit-testing |

## Params

| param | required | default | meaning |
|---|---|---|---|
| `widgetId` | ✓ | — | outer `<div class="widget">` id; Reset id derives from it |
| `svgId` | ✓ | — | drawing-surface `<svg>` id |
| `outputId` | ✓ | — | `.readout` id |
| `title` | ✓ | — | `.ttl` text |
| `bodyScript` | ✓ | — | author JS defining `draw(g)` |
| `hint` / `svgTitle` | | — / `title` | hint text (explain the three gestures) / accessible SVG title |
| `viewBox` / `svgWidth` / `svgHeight` | | `0 0 640 380` / 640 / 380 | SVG geometry |
| `nodeRadius` | | 16 | vertex radius (px); also `g.R` |
| `pad` | | 24 | inner padding added vertices are clamped to |
| `initialNodes` | | `[]` | `[[x,y], …]` initial vertices (pixel coords) |
| `initialEdges` | | `[]` | `[[i,j], …]` initial edges as indices into `initialNodes` |
| `resetLabel` | | `↺ Reset` | Reset control label |
| `outputInitial` | | `&nbsp;` | readout HTML before first edit |

## Usage

Add a `widget` block plus a `widget-script` block referencing it **by `ref`**
(not slug+params — a ref-less `widget-script` renders nothing):

```json
{ "type": "widget",        "slug": "graph-edit-2d", "params": { "widgetId": "w-foo", "svgId": "foo-svg", "outputId": "foo-out", "title": "…", "bodyScript": "function draw(g){ /* … */ }" } },
{ "type": "widget-script", "ref": "w-foo" }
```

Then `node scripts/rebuild.mjs --only widget-params` (AJV) and
`node scripts/rebuild.mjs` (byte-identical round-trip).

## Authoring notes

- Draw edges first, then vertices on top: `g.edges.forEach(e => line(node(e.u), node(e.v)))` then `g.nodes.forEach(nd => circle(nd.x, nd.y, g.R))`.
- Look up a node by id once per draw: `const byId = {}; g.nodes.forEach(n => byId[n.id] = n);`.
- Colour tokens only (`var(--cyan)`, `var(--yellow)`, …), never hex.
- BFS/DFS over `g.adj` is the workhorse — components, bipartiteness, reachability all fall out of one traversal.
- Keep the invariant cheap: `draw` runs synchronously on every edit, so avoid anything worse than roughly `O(n·m)` for the small graphs a reader builds.
