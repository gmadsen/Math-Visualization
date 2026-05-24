# class-field-theory-conductor-discriminant

Bespoke widget for `class-field-theory.html` (§7 *The conductor-discriminant formula*, concept
`conductor-discriminant`). It computes $\operatorname{disc}(\mathbb{Q}(\zeta_n)/\mathbb{Q})$
character by character via the conductor-discriminant (Führerdiskriminantenproduktformel).
Single module, not part of a shared family.

See [../README.md](../README.md) for the registry contract (schema + pure render functions)
and the bespoke-vs-shared distinction.

## What it does

$\operatorname{Gal}(\mathbb{Q}(\zeta_n)/\mathbb{Q})=(\mathbb{Z}/n)^\times$, whose characters are
the Dirichlet characters mod $n$. The conductor-discriminant formula gives

$$|\operatorname{disc}(\mathbb{Q}(\zeta_n)/\mathbb{Q})| = \prod_{\chi}\mathfrak{f}(\chi)
   = \prod_{d\mid n} d^{\,P(d)},$$

where $\mathfrak{f}(\chi)$ is the conductor of $\chi$ and $P(d)$ is the number of characters of
conductor exactly $d$ — the number of **primitive** Dirichlet characters mod $d$, given by the
Möbius convolution $P=\mu * \varphi$. Buttons pick $n$; the widget tabulates each divisor $d\mid
n$ with $P(d)$ and the factor $d^{P(d)}$, forms the product, and checks it against the
closed-form discriminant. The trivial character has conductor $1$ and contributes $1^1$ (an
unramified prime sits in no conductor and no factor of the discriminant); ramified primes
contribute through the characters non-trivial on their inertia.

## Params

See [`schema.json`](./schema.json) for the authoritative shape. Required fields:

| field | type | purpose |
|---|---|---|
| `widgetId` | string | DOM id for the outer `<div class="widget">` wrapper (and the `-svg`/`-out`/`-btns` children). |
| `title`    | string | Display title rendered in the header. |
| `hint`     | string (optional) | Short hint rendered next to the title. |

The $P(d)=(\mu*\varphi)(d)$ computation and the closed-form discriminant are computed inside the
renderer; the buttons only pick $n$.

## Usage

Add a `widget` block plus its `widget-script` block to `content/class-field-theory.json`:

```json
{ "type": "widget",        "slug": "class-field-theory-conductor-discriminant", "params": { "widgetId": "w-conddisc", "title": "Conductor-discriminant: disc(ℚ(ζₙ)) = ∏ f(χ)", "hint": "pick n; the product of character conductors equals the discriminant" } },
{ "type": "widget-script", "ref": "w-conddisc" }
```

Then run `node scripts/rebuild.mjs --only widget-params` to AJV-validate the params, and
`node scripts/rebuild.mjs` for the full chain.
