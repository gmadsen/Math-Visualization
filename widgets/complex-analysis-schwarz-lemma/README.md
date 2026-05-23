# complex-analysis-schwarz-lemma

Schwarz-lemma bound visualizer, introduced on `complex-analysis.html` §16.
Bespoke semantic module — the self-map evaluation and bound plot are intrinsic
(a `kind` enum); params carry the menu.

See [../README.md](../README.md) for the registry contract.

## What it does

For a holomorphic self-map $f:\mathbb{D}\to\mathbb{D}$ with $f(0)=0$, the lemma
gives $|f(z)|\le|z|$. The reader picks $f$ ($z^2$, $z^3$, the rotation
$e^{i\pi/4}z$, or the Blaschke product $z\cdot\frac{z-a}{1-\bar a z}$) and a ray
direction; the widget plots $|f(z)|$ against $|z|$ along that ray together with
the bound line $|f|=|z|$. The contractions stay strictly below the line; the
rotation lies exactly on it — Schwarz's rigidity (equality $\Rightarrow$
rotation). The readout reports $|f'(0)|$ and whether the curve touches the bound.

## Params

| field | type | purpose |
|---|---|---|
| `widgetId` | string | DOM id; script derives `-sel/-dir/-svg/-out`. |
| `title` | string | Header title. |
| `hint` | string (optional) | Short hint. |
| `functions` | array | Each: `id`, `label` (plain text), `kind` (`sq`/`cube`/`rot`/`blaschke0`), optional `fp0` (|f'(0)| text), `note`. |

## Usage

Add a `widget` block + ref-based `widget-script` block to
`content/complex-analysis.json`, then `node scripts/rebuild.mjs --only widget-params`
and `node scripts/rebuild.mjs`.
