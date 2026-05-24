# galois-primitive-element

Bespoke module for **galois** §8 (Primitive element theorem). Demonstrates the
theorem on the canonical example $\mathbb{Q}(\sqrt2,\sqrt3) = \mathbb{Q}(\sqrt2+\sqrt3)$,
including its one-line proof idea.

See [../README.md](../README.md) for the registry contract (schema + pure
render functions) and the bespoke-vs-shared distinction.

## What it does

Slide the coefficient $c$ in $\theta = \sqrt2 + c\sqrt3$. The widget plots the
four conjugates $\pm\sqrt2 \pm c\sqrt3$ (the Galois orbit, from independent sign
flips on $\sqrt2$ and $\sqrt3$) on a number line, computes the minimal polynomial
$(x^2 - 3c^2 + 2)^2 - 8x^2 = x^4 - (4+6c^2)x^2 + (2-3c^2)^2$, and reports its
degree. For almost every $c$ the four conjugates are distinct, the minimal
polynomial has degree $4 = [\mathbb{Q}(\sqrt2,\sqrt3):\mathbb{Q}]$, and $\theta$
is a **primitive element**; only the bad value $c=0$ makes two pairs collide,
collapsing $\theta$ to $\sqrt2$ with minimal polynomial $x^2-2$. That is the
theorem's proof in miniature: $\theta = \alpha + c\beta$ fails to generate only
when two conjugates coincide, which rules out finitely many $c$.

## Params

See [`schema.json`](./schema.json) for the authoritative shape.

| field | type | purpose |
|---|---|---|
| `widgetId` | string | DOM id for the outer `<div class="widget">` wrapper. |
| `title`    | string | Display title (prose — `.ttl` is uppercased). |
| `hint`     | string (optional) | Short hint rendered next to the title. |

## Usage

```json
{ "type": "widget", "slug": "galois-primitive-element", "params": { "widgetId": "w-galois-primitive", "title": "Primitive element: ℚ(√2,√3) = ℚ(√2+√3)" } },
{ "type": "widget-script", "ref": "w-galois-primitive" }
```

Then `node scripts/rebuild.mjs --only widget-params` to AJV-validate, and
`node scripts/rebuild.mjs` for the full byte-identical round-trip gate.
