# lattice-visualizer

Visualizes a 2D lattice $\Lambda = \mathbb{Z}v_1 + \mathbb{Z}v_2$ in the
plane. The widget emits an empty host div; the page-global library
[`js/widget-lattice-visualizer.js`](../../js/widget-lattice-visualizer.js)
builds the chrome (header, four basis-component sliders, SVG, readout) at
runtime via `MVLatticeVisualizer.init('#widgetId', config)`.

The SVG draws lattice points $i v_1 + j v_2$ for every integer $(i, j)$
producing a point inside the visible window, highlights the **fundamental
parallelogram** with corners $0,\,v_1,\,v_1+v_2,\,v_2$, and reports the
covolume $|\det[v_1\ v_2]|$. An optional sublattice overlay draws
$\Lambda' = M\cdot\Lambda$ as larger pink dots and reports the index
$[\Lambda:\Lambda'] = |\det M|$.

## When to reach for it

Use `lattice-visualizer` when a topic builds intuition for lattices in
$\mathbb{R}^2$ — number theory (rings of integers, Minkowski's theorem),
crystallography (Bravais lattices), or modular forms (the modular surface
$\mathrm{SL}_2(\mathbb{Z}) \backslash \mathbb{H}$ acting on bases of a
fixed lattice). The four sliders let learners watch the lattice deform
under basis changes while the fundamental parallelogram tracks along.

If the geometry of interest is the action of a single matrix on the
plane (without lattice structure), reach for a more general transform
widget instead.

## Params

See [`schema.json`](./schema.json) for the authoritative definition.

| field          | required | type / shape                                                    |
|----------------|----------|-----------------------------------------------------------------|
| `widgetId`     | yes      | DOM id for the host `<div class="widget">`.                     |
| `title`        | yes      | Header title.                                                   |
| `hint`         | no       | Header hint.                                                    |
| `viewBox`      | no       | SVG viewBox (default `'0 0 360 320'`).                          |
| `basis`        | no       | `{ v1: {x,y}, v2: {x,y} }` (default identity basis).            |
| `sublattice`   | no       | `{ matrix: [[m11,m12],[m21,m22]] }` overlay; reports `\|det M\|`. |
| `viewWindow`   | no       | `{ xRange, yRange }` in lattice units (default `[-3,3]` both).  |
| `sectionComment` | no     | ARTIFACT — banner comment preserved when migrating sources.     |

### Sublattice convention

The 2×2 matrix $M = \begin{pmatrix} m_{11} & m_{12} \\ m_{21} & m_{22} \end{pmatrix}$
defines the sublattice via columns: $w_1 = m_{11} v_1 + m_{21} v_2$ and
$w_2 = m_{12} v_1 + m_{22} v_2$. The sublattice $\Lambda' = \mathbb{Z}w_1 +
\mathbb{Z}w_2$ has index $[\Lambda:\Lambda'] = |\det M|$.

## Alternate frontends

`basis`, `viewWindow`, and `sublattice.matrix` are pure data — a React
or SSR consumer can ignore `renderScript` and reimplement the lattice
enumeration directly from the schema fields.

## Example

A canonical hexagonal-lattice instance with an index-4 sublattice lives
at [`example.json`](./example.json) and is the test fixture in
`scripts/test-widget-renderers.mjs`.
