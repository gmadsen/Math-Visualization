# resolution-applications-map

Bespoke widget for `resolution-of-singularities.html` (§6 *Applications and frontiers*, concept
`ros-applications`). A **clickable thread-map** of the applications and open frontiers of
resolution of singularities — the survey/landscape navigation pattern for a section that resists
a single computational toy (cf. `advanced-complex-analysis-landscape`,
`functional-analysis-bigfour`). Single module, not part of a shared family.

See [../README.md](../README.md) for the registry contract and the bespoke-vs-shared
distinction.

## What it does

A central hub — the resolution $\pi:Y\to X$ ($Y$ smooth) — with five spokes; buttons
(**Overview** + the five) select a node and the readout explains it:

- **Minimal Model Program** (Mori) — contract $K$-negative extremal rays and flip to a
  minimal/canonical model.
- **Motivic integration** (Kontsevich) — arc-space integrals pulled back to a log resolution,
  giving a stringy Euler characteristic that agrees on crepant resolutions (higher-dimensional
  McKay).
- **Weak factorisation** (Włodarczyk; Abramovich–Karu–Matsuki–Włodarczyk) — every birational map
  of smooth projectives is a sequence of smooth blow-ups and blow-downs.
- **Log resolution** — resolve a pair $(X,D)$ to a simple normal crossing divisor.
- **Frontier: characteristic $p$** — Hironaka (char 0, all dimensions); Abhyankar (surfaces) and
  Cossart–Piltant (threefolds) in char $p$; $\dim\ge 4$ **open**; de Jong **alterations** a
  weaker substitute in all characteristics.

## Params

See [`schema.json`](./schema.json). Required: `widgetId`, `title`; optional `hint`. The node
content is fixed inside the renderer; the buttons select which node is highlighted.

## Usage

```json
{ "type": "widget",        "slug": "resolution-applications-map", "params": { "widgetId": "w-rosapps", "title": "What resolution unlocks: a map of applications and the open frontier", "hint": "click a spoke — MMP, motivic integration, weak factorisation, log resolution, char p" } },
{ "type": "widget-script", "ref": "w-rosapps" }
```

Then `node scripts/rebuild.mjs --only widget-params` and `node scripts/rebuild.mjs`.
