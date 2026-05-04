# aca-quasiconformal-warp

Bespoke widget for **§12 Quasiconformal maps and the Beltrami equation**
on the
[advanced-complex-analysis](../../advanced-complex-analysis.html#quasiconformal) topic.

## What it does

A quasiconformal map satisfies the Beltrami equation
$\partial_{\bar z} f = \mu(z)\,\partial_z f$
for a measurable Beltrami coefficient $\mu$ with $\|\mu\|_\infty < 1$.
Conformal $\Leftrightarrow$ $\mu \equiv 0$. The dilatation
$K = \dfrac{1+|\mu|}{1-|\mu|} \ge 1$
quantifies how far from conformal $f$ is — a $K$-quasiconformal map
takes infinitesimal circles to ellipses of axis-ratio $\le K$.

This widget shows the warp from a constant-$\mu$ map applied to a
reference circle and a square grid.

**Gesture.** Two sliders set $\mu_{re}$ and $\mu_{im}$ (real and
imaginary parts of $\mu$), each in $[-0.9, 0.9]$ so $|\mu|$ stays under
1. The SVG redraws:

- A reference unit circle on the left (cyan), with its image (yellow)
  on the right under the constant-$\mu$ affine map $z \mapsto z + \mu\bar z$.
- A square reference grid on the left, sheared into a parallelogram
  lattice on the right.

**Readout.** Reports $|\mu|$, $\arg\mu$ in degrees, and the dilatation
$K$. Watch $K\to\infty$ as $|\mu|\to 1^-$ — that's the well-known
"degeneration to non-quasiconformal" limit.

## Pedagogy

The widget gives a hands-on feel for what "quasiconformal" means:
infinitesimal circles → ellipses with bounded axis-ratio. By splitting
$\mu$ into real and imaginary sliders, the reader can independently
explore the *axis stretch* and the *axis rotation* directions of the
warp, and see how they combine into the dilatation $K$.

## Failure modes

- The map is **constant-$\mu$ affine** — not the general
  Beltrami-equation solution (which is much harder; the widget skips
  the existence theorem). For nonconstant $\mu$ readers should look
  to the prose, not the widget.
- $|\mu| < 0.9$ caps the slider range; the actual constraint is
  $|\mu| < 1$, but values near 1 produce arbitrarily flat ellipses
  that overlap visually.
- The SVG warps the grid by transforming each grid line endpoint
  individually — for true Beltrami solutions the warp is nonlinear.
  Pedagogical simplification; "constant Beltrami" is a useful first
  picture.

## Params

See [`schema.json`](./schema.json) for the authoritative shape.

| field            | kind        | purpose |
|---|---|---|
| `widgetId`       | fundamental | DOM id for the outer `<div class="widget">`. |
| `title`          | fundamental | Header title (e.g. "Quasiconformal warp"). |
| `hint`           | fundamental | Header hint (e.g. "drag $\\mu_{re}$, $\\mu_{im}$"). |
| `bodyMarkup`     | *artifact*  | Verbatim inner-body HTML (sliders + svg viewport + readout). |
| `sectionComment` | *artifact*  | Optional `/* ... */` banner above the IIFE. |
| `bodyScript`     | *artifact*  | Verbatim IIFE body (slider listeners + svg redraw + dilatation compute). |

## Usage

```json
{ "type": "widget",        "slug": "aca-quasiconformal-warp", "params": { ... } },
{ "type": "widget-script", "slug": "aca-quasiconformal-warp", "params": { ... } }
```

Both blocks carry the same `params` object (per the current registry
duplication — see widgets/README.md and the open infra task).
