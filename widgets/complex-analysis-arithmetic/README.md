# complex-analysis-arithmetic

Argand-plane arithmetic explorer, introduced on `complex-analysis.html` §1.
Bespoke semantic module — the arithmetic is intrinsic; params carry only the
initial $z$ and $w$.

See [../README.md](../README.md) for the registry contract.

## What it does

Adjust two complex numbers $z$ and $w$ by **modulus and argument**, and toggle
between $z+w$ and $z\cdot w$. The widget draws $z$ (blue), $w$ (green) and the
result (yellow) on the Argand plane. Addition is the parallelogram / tip-to-tail
translation of $\mathbb{R}^2$. Multiplication is the headline: $|zw|=|z||w|$ and
$\arg(zw)=\arg z+\arg w$ — multiplying by $w$ **rotates** $z$ by $\arg w$ and
**scales** it by $|w|$ (the default $w=i$ shows the clean $90°$ rotation). The
readout reports both cartesian and polar forms and the rotate-plus-scale rule.

## Params

| field | type | purpose |
|---|---|---|
| `widgetId` | string | DOM id; script derives `-mul/-add/-zr/-za/-wr/-wa/-svg/-out`. |
| `title` | string | Header title. |
| `hint` | string (optional) | Short hint. |
| `z0` | object (optional) | Initial $z$ as `{re,im}` (default $1.3+0.5i$). |
| `w0` | object (optional) | Initial $w$ as `{re,im}` (default $i$). |

## Usage

Add a `widget` block + ref-based `widget-script` block to
`content/complex-analysis.json`, then `node scripts/rebuild.mjs --only widget-params`
and `node scripts/rebuild.mjs`.
