# q-learning-grid-world

Bespoke **"edit-grid"** widget for **model-free reinforcement learning** on a
grid-world: tabular **Q-learning**. First home: `reinforcement-learning
§q-learning`. The learning counterpart to [`grid-world-mdp`](../grid-world-mdp/) —
that widget *knows* the transition model and solves the Bellman optimality
equation by value iteration; this one knows nothing and **learns** $Q(s,a)$ from
sampled experience.

## What it does

States are grid cells: **empty** (a step reward), **start** (episodes begin
here), **goal** (positive terminal), **pit** (negative terminal), **wall**
(blocked). Transitions are **stochastic** — the intended move succeeds with
probability $1-\text{noise}$ and slips to each perpendicular direction with
probability $\text{noise}/2$ (walls and edges bounce). The agent follows an
$\varepsilon$-greedy behaviour policy and, after every step, applies the
off-policy Q-learning update

$$Q(s,a)\;\leftarrow\;Q(s,a)+\alpha\Big[\,r+\gamma\max_{a'}Q(s',a')-Q(s,a)\,\Big].$$

The widget paints the learned greedy value $\max_a Q$ (cell shading + number),
the greedy policy $\arg\max_a Q$ (an arrow per non-terminal cell; grey while a
cell is still unvisited), and the agent's current position.

**Interaction:** **Step** takes one $\varepsilon$-greedy action; **Episode** runs
to a terminal; **×50** runs 50 episodes; **Forget** clears $Q$. **Click a cell**
to cycle its type (empty → start → goal → pit → wall) — editing the world forgets
$Q$ and the agent relearns. The $\varepsilon$ / $\alpha$ / $\gamma$ buttons tune
exploration, learning rate, and discount. On the default world, running ×50 a few
times converges the greedy policy to the **same $\pi^*$ value iteration computes
on the known MDP** — reached here purely from trial and error.

## Params

See [`schema.json`](./schema.json) for the authoritative shape.

| field | type | purpose |
|---|---|---|
| `widgetId` / `svgId` / `outputId` / `title` | string | required — DOM ids + title |
| `layout` | string[] | required — one string per row; chars `.` empty, `S` start, `G` goal, `P` pit, `#` wall (equal-length rows) |
| `goalReward` / `pitReward` / `stepReward` | number | terminal + living rewards (default 1 / −1 / −0.04) |
| `gammaInit` / `epsilonInit` / `alphaInit` / `noiseInit` | number | initial discount / exploration / learning rate / slip (default 0.95 / 0.2 / 0.5 / 0.2) |
| `hint` / `svgTitle` | string | optional |
| `viewBox` / `svgWidth` / `svgHeight` | — | SVG geometry (auto-derived from the grid) |

## Usage

```json
{ "type": "widget", "slug": "q-learning-grid-world", "params": {
  "widgetId": "w-qlg", "svgId": "qlg-svg", "outputId": "qlg-out",
  "title": "Q-learning a grid-world from experience",
  "layout": ["S..G", ".#.P", "...."]
} },
{ "type": "widget-script", "ref": "w-qlg" }
```

Then `node scripts/rebuild.mjs --only widget-params` (AJV) and
`node scripts/rebuild.mjs` (full byte-identical round-trip).

## Authoring notes

- **jsdom-safe / deterministic first paint:** $Q$ initialises to 0, so the first
  `render()` is deterministic (all arrows tie → first action). All randomness
  ($\varepsilon$-greedy choice, stochastic transitions, exploratory action) fires
  only inside the Step / Episode / ×50 button handlers, never at init.
- Click-driven editing: each cell rect carries `data-r`/`data-c`; the value/policy
  texts and the agent circle are `pointer-events:none` so the click lands on the
  cell. Setting a new start clears the previous one (single-start invariant).
- Colour tokens only: `var(--green)` positive value / goal, `var(--pink)` negative
  value / pit, `var(--mute)` walls + unvisited arrows, `var(--cyan)` agent + start,
  `var(--ink)` learned arrows + numbers, `var(--line)` borders.
- Episodes cap at 400 steps so a not-yet-learned policy can't loop forever.
