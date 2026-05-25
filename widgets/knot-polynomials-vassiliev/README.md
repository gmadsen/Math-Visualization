# knot-polynomials-vassiliev

Bespoke widget for `knot-polynomials.html` (§7 *Vassiliev (finite-type) invariants*, concept
`kp-vassiliev-invariants`). It introduces finite-type invariants and the simplest one, $v_2$, on
a gallery of small knots. Single module, not part of a shared family.

See [../README.md](../README.md) for the registry contract and the bespoke-vs-shared
distinction.

## What it does

An invariant is extended to singular knots by the **Vassiliev skein rule**
$v(K_\times)=v(K_+)-v(K_-)$ ($K_\times$ has a double point); it has **finite type of order
$\le n$** if it vanishes on every knot with $\ge n+1$ double points. The first non-trivial
Vassiliev invariant is $v_2$ (order 2), equal to $a_2$, the coefficient of $z^2$ in the **Conway
polynomial** $\nabla$.

Buttons pick a small knot; the widget shows its Conway polynomial and reads off $v_2=a_2$:

| knot | $\nabla(z)$ | $v_2=a_2$ |
|---|---|---|
| $0_1$ unknot | $1$ | $0$ |
| $3_1$ trefoil | $z^2+1$ | $1$ |
| $4_1$ figure-8 | $1-z^2$ | $-1$ |
| $5_1$ cinquefoil | $z^4+3z^2+1$ | $3$ |
| $5_2$ | $2z^2+1$ | $2$ |

It plots all five $v_2$ as a signed bar chart and draws the **unique order-2 chord diagram** (two
crossing chords) that generates the one-dimensional space of order-2 weight systems and
corresponds to $v_2$. The readout gives the finite-type definition, the $v_2=$ Conway-$a_2$
identity ($a_2\bmod 2=$ the Arf invariant), and the chord-diagram / weight-system picture.

## Params

See [`schema.json`](./schema.json). Required: `widgetId`, `title`; optional `hint`. The knot
gallery and invariants are fixed inside the renderer.

## Usage

```json
{ "type": "widget",        "slug": "knot-polynomials-vassiliev", "params": { "widgetId": "w-vass", "title": "Vassiliev v₂: the order-2 finite-type invariant = the Conway a₂", "hint": "pick a knot; v₂ is the z² coefficient of its Conway polynomial" } },
{ "type": "widget-script", "ref": "w-vass" }
```

Then `node scripts/rebuild.mjs --only widget-params` and `node scripts/rebuild.mjs`.
