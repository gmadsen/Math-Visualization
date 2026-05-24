# galois-representations-conductor

Bespoke widget for `galois-representations.html` (§9 *Inertia, ramification, and the conductor*,
concept `ramification-galois-rep`). It makes the **Artin conductor** concrete on elliptic
curves: each bad prime's reduction type fixes the inertia-invariant dimension, hence the
conductor exponent. Single module, not part of a shared family.

See [../README.md](../README.md) for the registry contract (schema + pure render functions)
and the bespoke-vs-shared distinction.

## What it does

A representation $\rho$ is **unramified at $p$** when $\rho(I_p)=1$ (then $\mathrm{Frob}_p$ is a
well-defined conjugacy class). The **Artin conductor exponent**

$$f_p(\rho) = \dim V - \dim V^{I_p} + (\text{wild term})$$

measures the ramification, and the global conductor is $N(\rho)=\prod_p p^{f_p(\rho)}$ over the
finitely many bad primes. Buttons pick an elliptic curve ($11a$, $14a$, $20a$, $27a$, $32a$);
the widget tabulates each bad prime with its **reduction type** — good (unramified, $f=0$),
multiplicative (tame, $\dim V^{I_p}=1$, $f=1$), additive ($\dim V^{I_p}=0$, $f=2$ plus a wild
term at $p=2,3$) — the inertia-invariant dimension, the exponent $f_p$, and the product
$N=\prod p^{f_p}$, matching the conductor in the curve's $L$-function. The readout defines the
decomposition and inertia groups, the unramified condition, the conductor exponent, and the
multiplicative-vs-additive dichotomy ($f_p=1$ multiplicative, $f_p\ge2$ additive).

## Params

See [`schema.json`](./schema.json) for the authoritative shape. Required fields:

| field | type | purpose |
|---|---|---|
| `widgetId` | string | DOM id for the outer `<div class="widget">` wrapper (and the `-svg`/`-out`/`-btns` children). |
| `title`    | string | Display title rendered in the header. |
| `hint`     | string (optional) | Short hint rendered next to the title. |

The curve gallery (bad primes, reduction types, conductor exponents) is fixed inside the
renderer; the buttons only pick the curve.

## Usage

Add a `widget` block plus its `widget-script` block to `content/galois-representations.json`:

```json
{ "type": "widget",        "slug": "galois-representations-conductor", "params": { "widgetId": "w-grcond", "title": "Inertia and the conductor: f_p = dim V − dim V^{I_p} + wild", "hint": "pick a curve; reduction type at each bad prime fixes f_p and the conductor N" } },
{ "type": "widget-script", "ref": "w-grcond" }
```

Then run `node scripts/rebuild.mjs --only widget-params` to AJV-validate the params, and
`node scripts/rebuild.mjs` for the full chain.
