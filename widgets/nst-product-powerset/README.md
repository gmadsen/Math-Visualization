# nst-product-powerset

Bespoke module for **naive-set-theory** §2 (Cartesian products and power sets).
Two foundational constructions in one widget, switched by a mode toggle.

See [../README.md](../README.md) for the registry contract (schema + pure
render functions) and the bespoke-vs-shared distinction.

## What it does

**Cartesian-product mode:** sliders set $|A|$ and $|B|$ (1–6); the widget draws
the $|A|\times|B|$ grid of ordered pairs $(a_i,b_j)$, one dot per pair, making
$|A\times B|=|A|\cdot|B|$ — the product rule of counting — visible as a
rectangle.

**Power-set mode:** a slider sets $n=|A|$ (1–5) and clickable element chips build
a subset $S\subseteq A$. The widget shows $S$, its indicator vector
$\mathbf{1}_S\in\{0,1\}^n$, and a column of all $2^n$ indicator strings
(coloured by $|S|$) with the current one highlighted. This is the bijection
$\mathcal{P}(A)\cong\{0,1\}^A$ that explains $|\mathcal{P}(A)|=2^{n}$: choosing a
subset is $n$ independent binary choices.

## Params

See [`schema.json`](./schema.json) for the authoritative shape.

| field | type | purpose |
|---|---|---|
| `widgetId` | string | DOM id for the outer `<div class="widget">` wrapper. |
| `title`    | string | Display title (prose — `.ttl` is uppercased). |
| `hint`     | string (optional) | Short hint rendered next to the title. |

## Usage

```json
{ "type": "widget", "slug": "nst-product-powerset", "params": { "widgetId": "w-nst-prodpow", "title": "Cartesian products and power sets" } },
{ "type": "widget-script", "ref": "w-nst-prodpow" }
```

Then `node scripts/rebuild.mjs --only widget-params` to AJV-validate, and
`node scripts/rebuild.mjs` for the full byte-identical round-trip gate.
