# best-response-explorer-2d

Bespoke **"drag"** widget for **mixed strategies and Nash equilibrium** in a 2×2
game, drawn as the **best-response correspondence** in the unit square. First
home: `game-theory §mixed`.

## What it does

The plane is the joint mixed strategy: $x = p = P(\text{Row plays its first
action})$, $y = q = P(\text{Col plays its first action})$. The widget draws

- **Row's best-response curve** (cyan): for each $q$, the $p$ that maximises
  Row's expected payoff — a vertical staircase that jumps at the $q$ making Row
  indifferent;
- **Column's best-response curve** (violet): for each $p$, the $q$ maximising
  Column's payoff — a horizontal staircase jumping at the $p$ making Column
  indifferent.

A **Nash equilibrium** is exactly a point on *both* curves (a mutual best
response), marked with a yellow ◯. The reader **drags** the joint strategy point;
the readout reports each player's expected payoff, each player's best response,
and whether the profile is Nash, and an orange **arrow** points toward the joint
better-response direction.

**Interaction:** drag the point anywhere in the square; **next game** cycles four
classic 2×2 games — Battle of the Sexes and Chicken (two pure + one mixed Nash),
Matching Pennies (a single interior mixed Nash), Prisoner's Dilemma (one
strictly-dominant corner) — so the reader sees the best-response topology change;
**snap to a Nash** jumps the point onto an equilibrium.

## Params

See [`schema.json`](./schema.json) for the authoritative shape.

| field | type | purpose |
|---|---|---|
| `widgetId` / `svgId` / `outputId` / `title` | string | required — DOM ids + title |
| `presets` | object[] | optional — games to cycle; each `{ name, A, B, rowLabels?, colLabels? }` with 2×2 payoff matrices `A[rowAction][colAction]` (Row) and `B` (Column). Defaults to the four classic games. |
| `initialGame` | integer | optional — index of the first preset (default 0) |
| `hint` / `svgTitle` | string | optional |
| `viewBox` / `svgWidth` / `svgHeight` | — | SVG geometry (default `0 0 460 384`) |

## Usage

```json
{ "type": "widget", "slug": "best-response-explorer-2d", "params": {
  "widgetId": "w-br", "svgId": "br-svg", "outputId": "br-out",
  "title": "Best-response correspondence: Nash as where the curves cross"
} },
{ "type": "widget-script", "ref": "w-br" }
```

Then `node scripts/rebuild.mjs --only widget-params` (AJV) and
`node scripts/rebuild.mjs` (full byte-identical round-trip).

## Authoring notes

- **Fully deterministic / jsdom-safe:** there is no randomness at all. The
  pointer→data mapping uses `getBoundingClientRect` + the `viewBox` (read via
  `getAttribute`) **inside the drag handlers only**, never at init, so the first
  render is deterministic and jsdom-clean.
- **Nash detection:** pure equilibria are the corners that are a mutual best
  response (a payoff comparison per player); the interior mixed equilibrium is the
  pair of indifference thresholds $(p^*, q^*)$ when both lie in $(0,1)$. Verified
  against the known equilibria of all four default games (BoS 3, Matching Pennies
  1, PD 1, Chicken 3).
- Colour tokens only: `var(--cyan)` Row BR, `var(--violet)` Col BR,
  `var(--yellow)` Nash markers, `var(--pink)` the dragged point, `var(--orange)`
  the better-response arrow, `var(--line)`/`var(--panel2)` axes.
