# aca-hartogs-shell

Bespoke widget for **§13 Several complex variables** on the
[advanced-complex-analysis](../../advanced-complex-analysis.html#scv) topic.

## What it does

The **Hartogs phenomenon** says that holomorphic functions on a
multivariate "shell" (an $n$-polydisk minus an interior sub-polydisk)
*automatically* extend to the full polydisk — there is no analog of an
isolated singularity for $n\ge 2$. The widget shows the Hartogs figure
in 2D as a schematic.

**Gesture.** A horizontal slider controls the inner-shell radius $r_{in}$
of the inner sub-polydisk; the SVG redraws the figure: an outer square
representing the unit polydisk in $\mathbb{C}^2$ minus an inner pink
square of side $\propto r_{in}$. An overlay shades the "forced extension
region" — the inner square — to dramatize that *any* holomorphic $f$ on
the shell is forced to extend across the inner gap.

**Readout.** A short caption naming the picture (e.g. "Hartogs figure:
shell $\{|z_1|<1\}\cup\{|z_2|<1, |z_1|>r_{in}\}$ in $\mathbb{C}^2$") and
restating the extension theorem.

## Pedagogy

The widget is purely *illustrative* — it primes the visual intuition
that "no isolated singularities in $n\ge 2$" without proving anything.
The Bochner–Martinelli boundary integral that actually does the
extension is referenced in the surrounding prose but not computed here.

## Known polish gap

The slider currently *only* resizes the inner pink square — the gesture
isn't tied to any numerical readout that scales with $r_{in}$. A
pedagogically-meaningful upgrade (tracked as a PLAN.md residue) would
tie the slider to a numeric like the Bochner–Martinelli boundary
integral $\int_{\partial K} f \cdot \omega_{BM}$ (which vanishes
as $r_{in}\to 0$ for the canonical extension), or simply the
inner-shell volume ratio $r_{in}^4 / 1$. Either ties the gesture to
the math instead of being decorative.

## Failure modes

- The visualization is **2D for an inherently 4-real-dimensional
  setting** ($\mathbb{C}^2 \cong \mathbb{R}^4$). The square-figure is
  metaphorical — readers should not try to read off a literal slice.
- $r_{in} = 0$ collapses the inner shell (no forced-extension region);
  $r_{in} = 1$ collapses the outer shell (no holomorphic data to
  extend from). The slider clamps inside an open subinterval.

## Params

See [`schema.json`](./schema.json) for the authoritative shape.

| field            | kind        | purpose |
|---|---|---|
| `widgetId`       | fundamental | DOM id for the outer `<div class="widget">`. |
| `title`          | fundamental | Header title (e.g. "Hartogs figure: forced extension"). |
| `hint`           | fundamental | Header hint (e.g. "drag the inner-shell radius"). |
| `bodyMarkup`     | *artifact*  | Verbatim inner-body HTML (slider + svg viewport + caption). |
| `sectionComment` | *artifact*  | Optional `/* ... */` banner above the IIFE. |
| `bodyScript`     | *artifact*  | Verbatim IIFE body (slider listener + svg redraw). |

## Usage

```json
{ "type": "widget",        "slug": "aca-hartogs-shell", "params": { ... } },
{ "type": "widget-script", "slug": "aca-hartogs-shell", "params": { ... } }
```

Both blocks carry the same `params` object (per the current registry
duplication — see widgets/README.md and the open infra task).
