# constraint-bifurcation-explorer

Visualizes a parameterized 2D inequality `g_a(x, y) <= 0` by shading the
feasible region on a coarse grid (marching-pixels), with a slider for the
parameter `a`. As `a` sweeps, the reader watches the feasible region grow /
shrink / split / collide — i.e., a topological bifurcation in the constraint
set. The widget emits an empty host div; the page-global library
[`js/widget-constraint-bifurcation-explorer.js`](../../js/widget-constraint-bifurcation-explorer.js)
builds chrome (header, slider, SVG with shaded cells, axes, readout) at
runtime via `MVConstraintBifurcationExplorer.init('#widgetId', config)`.

## When to reach for it

Use `constraint-bifurcation-explorer` for pages that motivate bifurcation,
catastrophe theory, parametric feasibility, or topological transitions in
sublevel sets — e.g., a chaos page exploring how a parameter changes the
shape of an attractor's basin, an optimization page introducing how a
constraint surface deforms with its parameter, or a dynamical-systems page
illustrating the pitchfork / transcritical / saddle-node patterns in a
2D phase-plane sketch.

The constraint family is selected from a curated whitelist (`kind`) — the
widget never evaluates user-typed expressions.

## Params

See [`schema.json`](./schema.json) for the authoritative definition.

| field        | required | type / shape                                                          |
|--------------|----------|-----------------------------------------------------------------------|
| `widgetId`   | yes      | DOM id for the host `<div class="widget">`.                           |
| `title`      | yes      | Header title.                                                         |
| `hint`       | no       | Header hint.                                                          |
| `viewBox`    | no       | SVG viewBox (default `'0 0 360 360'`).                                |
| `kind`       | yes      | `'circle-radius'` \| `'ellipse-eccentricity'` \| `'saddle-pitchfork'`. |
| `params`     | no       | `{ a: number }` — initial parameter value (library default per kind). |
| `domain`     | no       | `{ xRange: [number, number], yRange: [number, number] }` (default `[-3, 3]`). |

### Kinds

| kind                    | constraint                            | slider range       |
|-------------------------|---------------------------------------|--------------------|
| `circle-radius`         | `x^2 + y^2 <= a^2`                    | `a in [0, 4]`      |
| `ellipse-eccentricity`  | `x^2 / a^2 + y^2 / (2 - a)^2 <= 1`    | `a in [0.1, 1.9]`  |
| `saddle-pitchfork`      | `y^2 <= a*x^2 - x^4`                  | `a in [-1, 2]`     |

New kinds are added in `js/widget-constraint-bifurcation-explorer.js`'s
`KINDS` table and listed in this widget's schema enum.

## Rendering

The library samples the constraint at a coarse grid (~80x80 cells over the
viewBox) and emits one `<rect>` per feasible cell. The intentionally
pixelated aesthetic suits the dark 3B1B-inspired palette and keeps the SVG
small. Cells are filled with `var(--yellow)` at 0.5 opacity; axes use
`var(--mute)`; the formula readout uses KaTeX (`renderMathInElement` if
present).

## Alternate frontends

A React / SSR / Three.js consumer can ignore `renderScript` and reimplement
the sampler from `kind + params + domain` alone — the constraint catalog
in the library doubles as a spec.

## Example

A canonical saddle-pitchfork instance lives at
[`example.json`](./example.json) and is the test fixture in
`scripts/test-widget-renderers.mjs`.
