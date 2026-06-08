# unroll-the-cover

Self-contained **"wind-loop"** engine for the universal cover $p:\mathbb{R}\to
S^1$, $t\mapsto e^{2\pi i t}$ — the corpus's `wind-loop` gesture. The reader
**drags a point around the base circle** $S^1$; the engine tracks the
**unwrapped** (continuous) angle, so going around once raises the lift by one. A
second panel draws the cover $\mathbb{R}$ as a vertical real line whose integer
ticks are exactly the **fibre $\mathbb{Z}$** over the basepoint, with the lifted
path climbing and its endpoint landing on an integer once the loop closes — that
integer **is** the **winding number**, the element of $\pi_1(S^1)=\mathbb{Z}$.
First home: `algebraic-topology §universal-cover-circle`.

A direct-manipulation companion to the section's path-lifting proof-scrubber: it
turns "lifting a loop converts continuous data into a single integer" into a
thing your hand does — wind, and watch the integer appear.

## The gesture

- **Drag the point $\gamma$ around the circle.** Each full loop raises the lift
  one integer level; drag clockwise to wind the other way (negative). **Close the
  loop** snaps $\gamma$ back to the basepoint (rounding the lift to the *nearest
  completed turn*) so it lands exactly on its integer; **Reset** returns to $0$.

## Division of labor

This widget is concept-specific (the universal cover of $S^1$); it has no author
`bodyScript`. The renderer owns the drag-to-wind gesture with angle unwrapping,
the base circle + nested winding spiral, the cover line + integer fibre + climbing
lift, the close-the-loop snap, and the readout. jsdom-safe.

## Params

| param | required | default | meaning |
|---|---|---|---|
| `widgetId` / `svgId` / `outputId` / `title` | ✓ | — | DOM ids + title |
| `maxTurns` | | 3 | integer levels of the cover shown above/below 0 |
| `hint` / `svgTitle` | | — / `title` | hint / accessible SVG title |
| `viewBox` / `svgWidth` / `svgHeight` | | `0 0 600 420` / 600 / 420 | SVG geometry |
| `closeLabel` / `resetLabel` | | `Close the loop` / `↺ Reset` | control labels |

## Usage

```json
{ "type": "widget", "slug": "unroll-the-cover", "params": {
  "widgetId": "w-unroll", "svgId": "unroll-svg", "outputId": "unroll-out",
  "title": "…", "maxTurns": 3
} },
{ "type": "widget-script", "ref": "w-unroll" }
```

Then `node scripts/rebuild.mjs --only widget-params` (AJV) and
`node scripts/rebuild.mjs` (byte-identical round-trip).

## Authoring notes

- The winding is tracked by **angle unwrapping** (each pointer step's angular
  delta is reduced to $(-\pi,\pi]$ and accumulated), so fast drags and multiple
  loops are counted correctly.
- The nested spiral (radius shrinks per turn) makes the winding visible on the
  base circle and "unrolls" to the straight lift on the cover.
- Colour tokens only (`var(--cyan)` loop + lift, `var(--mute)`/`var(--line)`
  chrome, `var(--green)` the closed-loop integer), never hex.
