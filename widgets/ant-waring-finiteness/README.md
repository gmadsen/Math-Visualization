# ant-waring-finiteness

Bespoke module for **additive-number-theory** §9 (Hilbert–Waring theorem).
Makes the *finiteness* of $g(k)$ — the heart of Hilbert's 1909 theorem — visible.

See [../README.md](../README.md) for the registry contract (schema + pure
render functions) and the bespoke-vs-shared distinction.

## What it does

Pick an exponent $k$ (squares, cubes, or 4th powers). The widget computes, by
dynamic programming, the minimum number of $k$-th powers needed to write each
$n\le 100$ as a sum, and plots those counts as bars. The bars rise and fall but
**never exceed a fixed bound $g(k)$** (yellow line) — and that bound does not
grow with $n$. That bound is exactly what Hilbert (1909) proved finite for every
$k$. The widget marks the extremal $n$ that attains $g(k)$ (e.g. $7=2^2+1^2+1^2+1^2$
needs 4 squares; $23$ needs 9 cubes; $79$ needs 19 fourth powers), shows its
decomposition, and the formula $g(k)=2^k+\lfloor(3/2)^k\rfloor-2$
($g(2)=4$ Lagrange, $g(3)=9$, $g(4)=19$). The readout notes Hilbert's algebraic
identity proof and the Hardy–Littlewood circle method.

## Params

See [`schema.json`](./schema.json) for the authoritative shape.

| field | type | purpose |
|---|---|---|
| `widgetId` | string | DOM id for the outer `<div class="widget">` wrapper. |
| `title`    | string | Display title (prose — `.ttl` is uppercased). |
| `hint`     | string (optional) | Short hint rendered next to the title. |

## Usage

```json
{ "type": "widget", "slug": "ant-waring-finiteness", "params": { "widgetId": "w-ant-waring", "title": "Hilbert–Waring: g(k) is finite" } },
{ "type": "widget-script", "ref": "w-ant-waring" }
```

Then `node scripts/rebuild.mjs --only widget-params` to AJV-validate, and
`node scripts/rebuild.mjs` for the full byte-identical round-trip gate.
