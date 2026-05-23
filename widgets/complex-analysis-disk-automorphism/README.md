# complex-analysis-disk-automorphism

Visualizer for the conformal automorphisms of the unit disk, introduced on
`complex-analysis.html` §disk-automorphisms. Bespoke semantic module — the
Blaschke map and grid plotting are intrinsic; params carry only title/hint.

See [../README.md](../README.md) for the registry contract.

## What it does

The reader sets $a$ (the point sent to the centre, via $|a|$ and $\arg a$
sliders) and a rotation $\theta$. A polar grid in the unit disk (left) is mapped
by $\varphi(z)=e^{i\theta}\,\frac{z-a}{1-\bar a z}$ to its image (right), which
still fills the disk: the boundary maps to the boundary and $a\mapsto0$. The
readout states that these Blaschke maps are exactly the holomorphic
automorphisms of $\mathbb{D}$, and that conformality keeps the image grid
orthogonal.

## Params

| field | type | purpose |
|---|---|---|
| `widgetId` | string | DOM id; script derives `-mod/-arg/-rot/-svg/-out`. |
| `title` | string | Header title. |
| `hint` | string (optional) | Short hint. |

## Usage

Add a `widget` block + ref-based `widget-script` block to
`content/complex-analysis.json`, then `node scripts/rebuild.mjs --only widget-params`
and `node scripts/rebuild.mjs`.
