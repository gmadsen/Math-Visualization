# torus-orbit-explorer

Bespoke **"click to seed"** widget for **ergodic theory on the 2-torus**. First
home: `ergodic-theory §ergodicity`. Birkhoff's theorem made visible: the
time-average spread of one orbit approaching (or failing to approach) the uniform
space average.

## What it does

The reader **clicks** a point in the unit square $[0,1)^2$ (the torus) to set an
initial condition and watches its forward orbit under a measure-preserving map.
A **next map** button cycles three canonical maps with different behaviour in the
ergodic hierarchy:

- an **irrational rotation** $(x,y)\mapsto(x+\alpha,\,y+\beta)\bmod 1$ — ergodic
  but not mixing; the orbit equidistributes evenly;
- **Arnold's cat map** $(x,y)\mapsto(2x+y,\,x+y)\bmod 1$ — mixing; the orbit
  scatters and covers the torus fast;
- a **rational rotation** — periodic; the orbit is a finite set and never
  equidistributes (the map is not ergodic).

A **+ steps** button extends the orbit; the readout reports how many cells of a
fine grid the orbit has visited, so the reader watches the time-average
distribution approach (ergodic / mixing) or stall (periodic) at the uniform space
average.

## Params

See [`schema.json`](./schema.json) for the authoritative shape.

| field | type | purpose |
|---|---|---|
| `widgetId` / `svgId` / `outputId` / `title` | string | required — DOM ids + title |
| `seedX` / `seedY` | number | initial seed in $[0,1)$ (default 0.31 / 0.27) |
| `stepBatch` | integer | points added per **+ steps** click (default 250) |
| `gridN` | integer | coverage-grid resolution `gridN × gridN` (default 20) |
| `hint` / `svgTitle` | string | optional |
| `viewBox` / `svgWidth` / `svgHeight` | — | SVG geometry (default `0 0 360 384`) |

## Usage

```json
{ "type": "widget", "slug": "torus-orbit-explorer", "params": {
  "widgetId": "w-torb", "svgId": "torb-svg", "outputId": "torb-out",
  "title": "Steer an orbit: equidistribution on the torus"
} },
{ "type": "widget-script", "ref": "w-torb" }
```

Then `node scripts/rebuild.mjs --only widget-params` (AJV) and
`node scripts/rebuild.mjs` (full byte-identical round-trip).

## Authoring notes

- **Fully deterministic / jsdom-safe:** the orbit iteration has no randomness, the
  first render shows the default seed, and the pointer→torus mapping uses
  `getBoundingClientRect` + the `viewBox` (read via `getAttribute`) **inside the
  click handler only**, never at init.
- Verified behaviour: irrational rotation and cat map reach 100% grid coverage by
  ~2000 steps; the rational rotation $(x+0.2,\,y+0.4)$ is period-5 and stalls at 5
  cells. Maps are chosen rationally-independent so the irrational rotation genuinely
  equidistributes.
- Colour tokens only: `var(--cyan)` / `var(--violet)` / `var(--orange)` orbit
  points per map, `var(--pink)` the seed, `var(--line)`/`var(--panel2)` the torus.
- The torus rect carries `data-torus`; orbit points and the seed are
  `pointer-events:none` so the click lands on the torus.
