# info-aep-typical-set

Bespoke module for **information-theory** §7 (Asymptotic equipartition
property). Shows the AEP as a *concentration* statement: the per-symbol
log-probability of a random source sequence narrows onto the entropy as the
block length grows.

See [../README.md](../README.md) for the registry contract (schema + pure
render functions) and the bespoke-vs-shared distinction.

## What it does

For an i.i.d. binary source with $P(1)=p$ (slider) and block length $n$
(slider), the per-symbol log-probability
$-\tfrac1n\log_2 p(x^n) = \tfrac{k}{n}(-\log_2 p) + \tfrac{n-k}{n}(-\log_2(1-p))$
is a random variable in the binomial number of ones $k$. The widget plots its
distribution (cyan), marks the entropy $H=h(p)$ (yellow) and the typical band
$[H-\varepsilon, H+\varepsilon]$ (green), and reports $P(\text{typical})$, the
typical-set size $\approx 2^{nH}$ against the total $2^{n}$, and the vanishing
fraction $2^{-n(1-H)}$. Sliding $n$ up shows the distribution spike onto $H$ and
$P(\text{typical})\to 1$ — almost every emitted sequence has probability
$\approx 2^{-nH}$, the basis of source coding at rate $H$.

## Params

See [`schema.json`](./schema.json) for the authoritative shape.

| field | type | purpose |
|---|---|---|
| `widgetId` | string | DOM id for the outer `<div class="widget">` wrapper. |
| `title`    | string | Display title (prose — `.ttl` is uppercased). |
| `hint`     | string (optional) | Short hint rendered next to the title. |

## Usage

```json
{ "type": "widget", "slug": "info-aep-typical-set", "params": { "widgetId": "w-aep-typical", "title": "Typical sequences concentrate at the entropy" } },
{ "type": "widget-script", "ref": "w-aep-typical" }
```

Then `node scripts/rebuild.mjs --only widget-params` to AJV-validate, and
`node scripts/rebuild.mjs` for the full byte-identical round-trip gate.
