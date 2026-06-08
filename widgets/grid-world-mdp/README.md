# grid-world-mdp

Bespoke **"edit-grid"** widget for a **grid-world Markov decision process** solved
by **value iteration**. First home: `markov-decision-processes §bellman-optimality`.
Self-contained (the VI solver and policy extraction are fixed). The canonical
grid-world that the decision-making topics (MDP / RL / POMDP) otherwise lacked —
they use 1-D chains and bar charts.

## What it does

The states are the cells of a grid: **empty** (a step reward), **goal** (positive
terminal), **pit** (negative terminal), **wall** (blocked). Actions are the four
moves; transitions are **stochastic** — the intended move succeeds with probability
$1-\text{noise}$ and slips to each perpendicular direction with probability
$\text{noise}/2$ (a wall or edge bounces back). The widget solves the **Bellman
optimality equation**

$$V^*(s) = \max_a\Big\{R + \gamma\sum_{s'}P(s'\mid s,a)\,V^*(s')\Big\}$$

by value iteration to convergence, then paints the optimal value $V^*$ (cell
shading + the number) and the **greedy policy** $\pi^*(s)=\arg\max_a Q^*(s,a)$ as an
arrow in each non-terminal cell.

**Interaction:** click a cell to cycle its type (empty → goal → pit → wall), and use
the **γ** and **noise** buttons; the value function and policy **re-solve live**. On
the default 3×4 world (γ=1, noise=0.2) it reproduces the classic Russell–Norvig
solution — including the cautious bottom-row policy that steers *away* from the pit;
raise the noise and the policy hugs the safe route even harder.

## Params

See [`schema.json`](./schema.json) for the authoritative shape.

| field | type | purpose |
|---|---|---|
| `widgetId` / `svgId` / `outputId` / `title` | string | required — DOM ids + title |
| `layout` | string[] | required — one string per row; chars `.` empty, `G` goal, `P` pit, `#` wall (equal-length rows) |
| `goalReward` / `pitReward` / `stepReward` | number | terminal + living rewards (default 1 / −1 / −0.04) |
| `gammaInit` / `noiseInit` | number | initial discount / slip noise (default 1 / 0.2) |
| `hint` / `svgTitle` | string | optional |
| `viewBox` / `svgWidth` / `svgHeight` | — | SVG geometry (auto-derived from the grid) |

## Usage

```json
{ "type": "widget", "slug": "grid-world-mdp", "params": {
  "widgetId": "w-gw", "svgId": "gw-svg", "outputId": "gw-out",
  "title": "Grid-world value iteration",
  "layout": ["...G", ".#.P", "...."]
} },
{ "type": "widget-script", "ref": "w-gw" }
```

Then `node scripts/rebuild.mjs --only widget-params` (AJV) and
`node scripts/rebuild.mjs` (full byte-identical round-trip).

## Authoring notes

- jsdom-safe: click-driven, no `getScreenCTM`/rAF. Each cell rect carries
  `data-r`/`data-c`; the value/policy texts are `pointer-events:none` so the click
  lands on the cell.
- Value iteration runs to a tight tolerance ($10^{-7}$, capped at 2000 sweeps) on
  every edit — cheap for the small grids this widget is meant for (a few dozen
  cells). It re-solves fully rather than incrementally, for clarity.
- Colour tokens only: `var(--green)` positive value / goal, `var(--pink)` negative
  value / pit, `var(--mute)` walls, `var(--ink)` arrows + numbers, `var(--line)`
  borders. Shading opacity scales with $|V^*|$ relative to the max.
- Stochastic transitions: intended action w.p. $1-\text{noise}$, each perpendicular
  w.p. $\text{noise}/2$; out-of-bounds or into-a-wall stays put.
