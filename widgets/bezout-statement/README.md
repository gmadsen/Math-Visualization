# bezout-statement

Bespoke module for **bezout** §5 (Statement of Bézout's theorem). Makes the
headline equality $\sum_{P} I_P(C,D) = de$ tangible and shows what each of the
theorem's three hypotheses buys.

See [../README.md](../README.md) for the registry contract (schema + pure
render functions) and the bespoke-vs-shared distinction.

## What it does

Two button rows pick the curve degrees $d$ and $e$; the widget draws the $d\times e$
grid of $de$ intersection points and the verdict $\sum_P I_P(C,D) = d\cdot e$.
Three toggle chips turn each hypothesis off:

- **$k = \bar k$** — algebraically closed field,
- **$C,D \subset \mathbb{P}^2$** — projective ambient,
- **count $I_P$** — weight points by intersection multiplicity.

With all three on, the count is pinned to $de$ exactly (solid dots, "exact
equality"). Drop any one and the equality weakens to a strict inequality (dashed
dots, "actual count < de"), with the canonical counterexample named in the
readout — disjoint real circles for non-closed fields, parallel lines for the
affine ambient, a tangent line to a conic for multiplicity.

## Params

See [`schema.json`](./schema.json) for the authoritative shape.

| field | type | purpose |
|---|---|---|
| `widgetId` | string | DOM id for the outer `<div class="widget">` wrapper. |
| `title`    | string | Display title (prose — `.ttl` is uppercased). |
| `hint`     | string (optional) | Short hint rendered next to the title. |
| `maxDegree`| integer (optional, default 4, 2–6) | Highest degree offered for $d$ and $e$. |

## Usage

```json
{ "type": "widget", "slug": "bezout-statement", "params": { "widgetId": "w-bezout-statement", "title": "The de count and its three hypotheses" } },
{ "type": "widget-script", "ref": "w-bezout-statement" }
```

Then `node scripts/rebuild.mjs --only widget-params` to AJV-validate, and
`node scripts/rebuild.mjs` for the full byte-identical round-trip gate.
