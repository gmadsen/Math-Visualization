# aca-bergman-kernel-disk

Bespoke widget for **§11 Bergman kernels** on the
[advanced-complex-analysis](../../advanced-complex-analysis.html#bergman) topic.

## What it does

The Bergman kernel of the unit disk $\mathbb{D}$ is
$K(z,w) = \dfrac{1}{\pi(1-\overline{w}z)^2}$
and induces the Bergman metric
$ds^2 = \dfrac{2}{(1-|z|^2)^2}|dz|^2$
(a constant multiple of the Poincaré metric). This widget visualizes
$|K(z,w)|^2 = \dfrac{1}{\pi^2|1-\overline{w}z|^4}$
as a heatmap on the disk, parameterized by a click-chosen source point $w$.

**Gesture.** Click anywhere inside the unit disk to set $w$. A circular
SVG heatmap redraws over the disk: cells inside the disk are colored by
$|K(z,w)|^2$ (cyan-to-yellow gradient — yellow near $w$, cool elsewhere).
The chosen source $w$ is marked with a yellow dot and crosshair.

**Readout.** Echoes back the $w$ coordinate and reports the metric
density $\dfrac{2}{(1-|w|^2)^2}$ at the click — so the reader sees how
the metric blows up as $|w|\to 1$, the geometric reason hyperbolic space
is complete.

## Pedagogy

The Bergman kernel is the canonical reproducing kernel for the $L^2$
holomorphic space $A^2(\mathbb{D})$. The widget makes two things
concrete:

1. **Localization at the source.** Holomorphic functions are
   "concentrated" near $w$ in the kernel sense — the heatmap is sharply
   peaked at $w$.
2. **The boundary blow-up.** Drag $w$ toward $|w|=1$; the metric
   density diverges, mirroring how the disk has infinite hyperbolic
   diameter despite finite Euclidean diameter.

## Failure modes

- Clicks outside the unit circle are clamped (or ignored — see the
  bodyScript). The heatmap only renders inside $\mathbb{D}$.
- The kernel is *only* well-defined for $|w|<1$; $|w|=1$ is a
  pole-on-the-boundary that blows the readout up. The widget caps
  $|w|$ at a small interior margin (e.g. $0.99$) to keep the metric
  density finite for display.
- Heatmap resolution is fixed (no slider) — chosen to render fast on
  mobile, not for color-precision.

## Params

See [`schema.json`](./schema.json) for the authoritative shape.

| field            | kind        | purpose |
|---|---|---|
| `widgetId`       | fundamental | DOM id for the outer `<div class="widget">`. |
| `title`          | fundamental | Header title (e.g. "Bergman kernel on the disk"). |
| `hint`           | fundamental | Header hint (e.g. "click in the disk to set $w$"). |
| `bodyMarkup`     | *artifact*  | Verbatim inner-body HTML (svg viewport + readout). |
| `sectionComment` | *artifact*  | Optional `/* ... */` banner above the IIFE. |
| `bodyScript`     | *artifact*  | Verbatim IIFE body (click handler + heatmap redraw). |

## Usage

```json
{ "type": "widget",        "slug": "aca-bergman-kernel-disk", "params": { ... } },
{ "type": "widget-script", "slug": "aca-bergman-kernel-disk", "params": { ... } }
```

Both blocks carry the same `params` object (per the current registry
duplication — see widgets/README.md and the open infra task).
