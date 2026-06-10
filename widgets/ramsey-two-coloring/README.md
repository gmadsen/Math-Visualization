# ramsey-two-coloring

The **edge-color** gesture: click the edges of a complete graph $K_n$ to cycle
them grey → red → blue → grey, trying to avoid a monochromatic triangle.
Size buttons switch $K_n$ between the entries of `sizes` (boot = first entry).
Monochromatic triangles are shaded live in their colour; completing a
colouring yields a verdict — an escape proves $R(3,3) > n$, a trap on $K_6$
demonstrates $R(3,3) = 6$.

jsdom-safe: no pointer→viewBox math at all (edges carry their own click
handlers via generous invisible hit zones); no `Math.random`, no rAF.

## Params

| param | type | required | description |
|---|---|---|---|
| `widgetId` | string | ✓ | outer `<div class="widget">` id |
| `svgId` | string | ✓ | `<svg>` id |
| `outputId` | string | ✓ | `.readout` id |
| `title` | string | ✓ | header title |
| `hint` | string | | header hint (HTML + KaTeX) |
| `svgTitle` | string | | accessible `<title>`; defaults to `title` |
| `sizes` | int[] (3–8) | | $K_n$ toggle buttons; default `[5, 6]`, first is boot |
| `viewBox` | string | | default `0 0 560 480` |
| `svgWidth` / `svgHeight` | number | | default 560 / 480 |

## Home

- `ramsey-theory.html` §pigeonhole — $R(3,3) = 6$ played as a game the reader
  can win on $K_5$ and provably cannot win on $K_6$.
