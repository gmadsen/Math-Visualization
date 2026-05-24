# bezout-cayley-bacharach

Bespoke module for **bezout** §7 (Cayley–Bacharach and the associativity
miracle). Demonstrates Cayley–Bacharach through the dimension count that proves
it, rather than by rendering implicit cubic curves.

See [../README.md](../README.md) for the registry contract (schema + pure
render functions) and the bespoke-vs-shared distinction.

## What it does

The nine points of a 3×3 grid are the complete intersection of two cubics — the
three "row" lines ($C_1$) and the three "column" lines ($C_2$), each a
degenerate cubic. Click the points to toggle which are **imposed** as conditions
on the $\mathbb{P}^9$ of plane cubics. For the imposed set the widget builds the
evaluation matrix on the ten cubic monomials and computes its **rank** by
Gaussian elimination, reporting:

- the number of imposed points,
- the rank = number of *independent* conditions,
- the dimension $\mathbb{P}^{9-\mathrm{rank}}$ of the cubics through them,
- which non-imposed points are **forced** — a point lies on *every* cubic
  through the imposed set iff adding its row leaves the rank unchanged; such
  points are ringed.

The headline: any 8 of the 9 grid points have rank 8, and the 9th is forced —
the rank never reaches 9. That is Cayley–Bacharach, and (via the chord–tangent
construction) the reason the elliptic-curve group law is associative.

## Params

See [`schema.json`](./schema.json) for the authoritative shape.

| field | type | purpose |
|---|---|---|
| `widgetId` | string | DOM id for the outer `<div class="widget">` wrapper. |
| `title`    | string | Display title (prose — `.ttl` is uppercased). |
| `hint`     | string (optional) | Short hint rendered next to the title. |

## Usage

```json
{ "type": "widget", "slug": "bezout-cayley-bacharach", "params": { "widgetId": "w-bezout-cayley-bacharach", "title": "Cayley–Bacharach: eight points force the ninth" } },
{ "type": "widget-script", "ref": "w-bezout-cayley-bacharach" }
```

Then `node scripts/rebuild.mjs --only widget-params` to AJV-validate, and
`node scripts/rebuild.mjs` for the full byte-identical round-trip gate.
