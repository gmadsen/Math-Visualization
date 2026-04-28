# three-body-lagrange-points

Bespoke widget for the §2 effective-potential / Lagrange-points illustration
on the [`three-body-problem`](../../three-body-problem.html#restricted) topic.

See [`../README.md`](../README.md) for the registry contract.

## What it does

A mass-ratio slider $\mu = m_2/(m_1+m_2)$ drives the rotating-frame
configuration of the circular restricted three-body problem. Two checkboxes
toggle the equipotential contours of $U_{\mathrm{eff}}$ and a highlight of the
Hill region for a fixed Jacobi constant. The SVG shows the two primaries
$m_1, m_2$ on the rotating axis and the five Lagrange points $L_1, \ldots, L_5$
sliding as $\mu$ changes; the readout lists their coordinates and notes
whether the Routh stability threshold ($m_1/m_2 > 24.96$) is met.

The slider-with-inline-span layout, the two-checkbox row, and the bespoke
contour + Hill-region rasterizer don't fit any shared slug; this slug captures
it as one unit.

## Params

See [`schema.json`](./schema.json) for the authoritative shape. Summary:

| field            | kind        | purpose |
|---|---|---|
| `widgetId`       | fundamental | DOM id for the outer `<div class="widget">`. |
| `title`          | fundamental | Header title. |
| `hint`           | fundamental | Header hint. |
| `bodyMarkup`     | *artifact*  | Verbatim inner-body HTML (slider row + span readout, checkbox row, SVG, readout div). |
| `sectionComment` | *artifact*  | Optional `/* ... */` banner above the IIFE. |
| `bodyScript`     | *artifact*  | Verbatim IIFE body — wires slider + checkboxes, computes Lagrange points, draws contours and the Hill region. |

## Usage

```json
{ "type": "widget",        "slug": "three-body-lagrange-points", "params": { ... } },
{ "type": "widget-script", "slug": "three-body-lagrange-points", "params": { ... } }
```

Both blocks carry the same `params` object.
