# belief-grid-localization

Bespoke **"edit-grid"** widget for the **POMDP belief state and the Bayes update**,
shown as **grid localization** (a histogram filter / Markov localization). First
home: `pomdps-and-belief-states §belief`. The canonical multi-state belief example
behind the 2-state Tiger problem.

## What it does

A robot sits at a **hidden** true cell of a grid. The reader never sees it
directly — only the belief $b(s)=P(\text{true cell}=s)$, painted as a heatmap over
the free cells. Pressing a direction runs one belief update:

$$\textbf{predict: } b'(s')=\sum_s P(s'\mid s,a)\,b(s)\qquad
  \textbf{correct: } b''(s)\propto P(o\mid s)\,b'(s)\ \text{(renormalise)}.$$

The motion model moves the robot in the intended direction with probability
$1-\text{moveNoise}$ and otherwise stays put (walls and edges block), so the
predict step **spreads** the belief. A 4-neighbour wall sensor then returns a
reading whose bits each flip with probability $\text{sensorNoise}$, and the
correct step **sharpens** the belief by the observation likelihood. Over a few
moves the cloud collapses onto the true cell.

**Interaction:** the **↑ ↓ ← →** buttons each run one full move-and-sense update;
**sense only** runs a correct step without moving; **Reset belief** restores the
uniform prior. **Click a cell** to toggle a wall — this re-derives the motion and
observation models and restarts the belief uniform. The **move noise** and
**sensor noise** buttons tune the two noise sources. The readout shows the latest
sensed walls, the belief peak, the belief **entropy** (in bits — watch it fall as
the robot localizes), and whether the most-likely (argmax) cell is the true cell.

## Params

See [`schema.json`](./schema.json) for the authoritative shape.

| field | type | purpose |
|---|---|---|
| `widgetId` / `svgId` / `outputId` / `title` | string | required — DOM ids + title |
| `layout` | string[] | required — one string per row; chars `.` free, `#` wall (equal-length rows) |
| `moveNoiseInit` / `sensorNoiseInit` | number | initial motion-slip / per-bit sensor-flip probability (default 0.15 / 0.1) |
| `hint` / `svgTitle` | string | optional |
| `viewBox` / `svgWidth` / `svgHeight` | — | SVG geometry (auto-derived from the grid) |

## Usage

```json
{ "type": "widget", "slug": "belief-grid-localization", "params": {
  "widgetId": "w-bgl", "svgId": "bgl-svg", "outputId": "bgl-out",
  "title": "Grid localization: the Bayes filter as a belief over cells",
  "layout": [".....", ".##..", ".....", "..#.#", "....."]
} },
{ "type": "widget-script", "ref": "w-bgl" }
```

Then `node scripts/rebuild.mjs --only widget-params` (AJV) and
`node scripts/rebuild.mjs` (full byte-identical round-trip).

## Authoring notes

- **jsdom-safe / deterministic first paint:** the belief starts uniform, so the
  first `render()` is deterministic. All randomness (motion slip via `trueMove`,
  sensor-bit flips via `observe`) fires only inside the button handlers.
- The belief is a proper distribution: `predict` redistributes mass exactly and
  `correct` renormalises (falling back to uniform if an impossible observation
  zeroes everything). Verified to stay summed to 1 and to localize (entropy → 0).
- `dims()` rejects ragged layouts (rows of unequal length) so the build fails
  loudly rather than walking phantom cells.
- Colour tokens only: `var(--cyan)` belief heat, `var(--pink)` hidden true cell,
  `var(--yellow)` argmax cell outline, `var(--mute)` walls, `var(--ink)` numbers.
