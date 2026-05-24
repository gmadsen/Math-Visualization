# bezout-higherdim

Bespoke module for **bezout** §8 (Bézout in higher dimensions). Shows that $n$
hypersurfaces of degrees $d_1,\dots,d_n$ in $\mathbb{P}^n$, meeting properly,
intersect in $\prod d_i$ points — and that this is one line in the Chow ring.

See [../README.md](../README.md) for the registry contract (schema + pure
render functions) and the bespoke-vs-shared distinction.

## What it does

Buttons pick the ambient dimension $n$ (so there are $n$ hypersurfaces in
$\mathbb{P}^n$); sliders set each degree $d_i$ (the sliders past $n$ dim out).
The widget draws one degree-bar per hypersurface, the product
$\prod d_i = d_1\cdots d_n$, and the equivalent Chow-ring computation in
$A^*(\mathbb{P}^n) = \mathbb{Z}[H]/(H^{n+1})$:
$$[H_1]\cdots[H_n] = (d_1 H)\cdots(d_n H) = \Bigl(\textstyle\prod d_i\Bigr) H^n = \Bigl(\textstyle\prod d_i\Bigr)[\mathrm{pt}].$$
The case $n=2$ is annotated as the classical $\mathbb{P}^2$ Bézout theorem; the
readout names the $n$ generic-quadrics example ($2^n$ points) and the
proper-intersection (zero-dimensional) hypothesis.

## Params

See [`schema.json`](./schema.json) for the authoritative shape.

| field | type | purpose |
|---|---|---|
| `widgetId` | string | DOM id for the outer `<div class="widget">` wrapper. |
| `title`    | string | Display title (prose — `.ttl` is uppercased). |
| `hint`     | string (optional) | Short hint rendered next to the title. |
| `maxN`     | integer (optional, default 4, 2–5) | Largest ambient dimension $n$ offered. |
| `maxDegree`| integer (optional, default 4, 2–6) | Highest degree offered for each $d_i$. |

## Usage

```json
{ "type": "widget", "slug": "bezout-higherdim", "params": { "widgetId": "w-bezout-higherdim", "title": "Bézout in higher dimensions: the product of degrees" } },
{ "type": "widget-script", "ref": "w-bezout-higherdim" }
```

Then `node scripts/rebuild.mjs --only widget-params` to AJV-validate, and
`node scripts/rebuild.mjs` for the full byte-identical round-trip gate.
