# pp-duality

Bespoke module for **projective-plane** §7 (Projective duality). Realises the
point↔line duality of $\mathbb{P}^2$ concretely as the pole–polar
correspondence of a conic.

See [../README.md](../README.md) for the registry contract (schema + pure
render functions) and the bespoke-vs-shared distinction.

## What it does

With respect to the unit-circle conic $x^2+y^2=1$, a point $(p_x,p_y)$
corresponds to its polar line $p_x x+p_y y=1$, and the pairing $p_x X+p_y Y=1$
is symmetric — so $P$ lies on the polar of $Q$ iff $Q$ lies on the polar of $P$.

Three points $A,B,C$ are draggable; their three polar lines are drawn in
matching colours. The $3\times3$ determinant
$\det[[A_x,A_y,1],[B_x,B_y,1],[C_x,C_y,1]]$ that detects **collinearity** of the
points is *identical* to the one detecting **concurrency** of the polars, so
collinear points $\Leftrightarrow$ concurrent lines, exactly. Drag a point onto
the line through the other two (or press "make collinear") to watch the three
polars meet at one point — the pole of line $ABC$. This collinear↔concurrent
swap is the prototype of every dual theorem (Pascal ↔ Brianchon).

## Params

See [`schema.json`](./schema.json) for the authoritative shape.

| field | type | purpose |
|---|---|---|
| `widgetId` | string | DOM id for the outer `<div class="widget">` wrapper. |
| `title`    | string | Display title (prose — `.ttl` is uppercased). |
| `hint`     | string (optional) | Short hint rendered next to the title. |

## Usage

```json
{ "type": "widget", "slug": "pp-duality", "params": { "widgetId": "w-pp-duality", "title": "Projective duality: pole and polar" } },
{ "type": "widget-script", "ref": "w-pp-duality" }
```

Then `node scripts/rebuild.mjs --only widget-params` to AJV-validate, and
`node scripts/rebuild.mjs` for the full byte-identical round-trip gate.
