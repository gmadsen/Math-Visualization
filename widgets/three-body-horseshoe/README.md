# three-body-horseshoe

Bespoke widget for the §4 Smale-horseshoe symbolic-itinerary illustration on
the [`three-body-problem`](../../three-body-problem.html#poincare) topic.

See [`../README.md`](../README.md) for the registry contract.

## What it does

The widget renders the surviving rectangles of Smale's horseshoe map after
$n$ iterations forward (and $n$ back) — a $2^{2n}$-rectangle grid colored to
make the binary itinerary visible. Step / step-back / reset buttons advance
$n$; an iteration slider does the same continuously. A readout prints the
length-$n$ symbolic itinerary $\dots a_{-1}.a_0 a_1\dots$ that names a generic
point of the Cantor-set invariant $\Lambda$.

## Params

See [`schema.json`](./schema.json) for the authoritative shape. Summary:

| field            | kind        | purpose |
|---|---|---|
| `widgetId`       | fundamental | DOM id for the outer `<div class="widget">`. |
| `title`          | fundamental | Header title. |
| `hint`           | fundamental | Header hint. |
| `bodyMarkup`     | *artifact*  | Verbatim inner-body HTML (controls row, SVG, readout div, trailing `<p class="small">`). |
| `sectionComment` | *artifact*  | Optional `/* ... */` banner above the IIFE. |
| `bodyScript`     | *artifact*  | Verbatim IIFE body — wires controls, draws the rectangle grid, prints the example itinerary. |

## Usage

```json
{ "type": "widget",        "slug": "three-body-horseshoe", "params": { ... } },
{ "type": "widget-script", "slug": "three-body-horseshoe", "params": { ... } }
```

Both blocks carry the same `params` object.
