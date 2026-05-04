# aca-bloch-disk

Bespoke widget for **§9 Bloch's theorem** on the
[advanced-complex-analysis](../../advanced-complex-analysis.html#bloch) topic.

## What it does

Bloch's theorem says that for any holomorphic $f:\mathbb{D}\to\mathbb{C}$
normalized by $f(0)=0,\ f'(0)=1$, the image $f(\mathbb{D})$ contains a
**univalent sub-disk** of radius at least the Bloch constant
$B \ge \sqrt{3}/4 \approx 0.433$. This widget illustrates the universal
lower bound geometrically.

**Gesture.** A horizontal slider scrubs a candidate radius $r \in (0.05, 0.95]$.
A schematic on the left shows $f(\mathbb{D})$ as a violet dashed silhouette
with a filled circle of radius $\propto r$ representing the candidate
univalent sub-disk. A horizontal axis on the right marks the universal
lower bound $B \approx 0.433$ in cyan; the candidate marker (green if
$r \ge B$, pink if $r < B$) snaps along it as the slider moves.

**Readout.** Above the lower-bound threshold: "consistent with Bloch's
bound." Below the threshold: a one-line reminder that *every* normalized
$f$ must contain a univalent disk of radius $\ge \sqrt{3}/4$ — so the
candidate is impossible.

## Pedagogy

The widget exists to make the *universal* lower bound viscerally
quantitative — without it, "the image contains a disk" is a qualitative
hand-wave. By forcing the reader to compare a candidate radius to the
known lower bound, it sets up the stronger Schottky–Landau–Bloch chain
covered later in §9.

## Failure modes

- The visualization is **schematic**, not an actual conformal-image
  computation — the violet silhouette doesn't depend on a specific $f$.
  Pedagogically intended; readers chasing a real Bloch extremal example
  should compare to the upper bound $\approx 0.4719$ (Ahlfors–Grunsky)
  noted in the surrounding prose.
- The slider min is 0.05 (not 0) because $r=0$ collapses the marker.

## Params

See [`schema.json`](./schema.json) for the authoritative shape.

| field            | kind        | purpose |
|---|---|---|
| `widgetId`       | fundamental | DOM id for the outer `<div class="widget">`. |
| `title`          | fundamental | Header title (e.g. "Bloch's universal disk"). |
| `hint`           | fundamental | Header hint (e.g. "candidate radius vs. $B \ge \sqrt{3}/4$"). |
| `bodyMarkup`     | *artifact*  | Verbatim inner-body HTML (slider + readout + svg viewport). |
| `sectionComment` | *artifact*  | Optional `/* ... */` banner above the IIFE. |
| `bodyScript`     | *artifact*  | Verbatim IIFE body (the schematic redraw on slider input). |

## Usage

```json
{ "type": "widget",        "slug": "aca-bloch-disk", "params": { ... } },
{ "type": "widget-script", "slug": "aca-bloch-disk", "params": { ... } }
```

Both blocks carry the same `params` object (per the current registry
duplication — see widgets/README.md and the open infra task).
