# matroid-flats-stepper

Bespoke widget for the §4 flats of M(K_4) on the
[`matroid-theory`](../../matroid-theory.html#closure) topic.

See [`../README.md`](../README.md) for the registry contract.

## What it does

Bespoke widget for the §4 flats-of-$M(K_4)$ stepper on the matroid-theory topic — prev/next buttons walking through ranks 0–3 of the geometric lattice, an SVG that highlights the flats at the current rank against $K_4$, and a readout listing them. The shape (prev/next + step indicator + SVG + readout) is bespoke (button-stepper has no SVG-redraw branch in the matroid section); this slug captures it as one unit and keeps the per-rank flat enumeration and highlight-rendering opaque in the bodyScript artifact.

## Params

See [`schema.json`](./schema.json) for the authoritative shape. Summary:

| field            | kind        | purpose |
|---|---|---|
| `widgetId`       | fundamental | DOM id for the outer `<div class="widget">`. |
| `title`          | fundamental | Header title. |
| `hint`           | fundamental | Header hint. |
| `bodyMarkup`     | *artifact*  | Verbatim inner-body HTML (prev/next buttons + step indicator span, SVG host, readout, trailing <div class="small"> note). |
| `sectionComment` | *artifact*  | Optional `/* ... */` banner above the IIFE. |
| `bodyScript`     | *artifact*  | Verbatim IIFE body — maintains the current rank, redraws the SVG on prev/next with the rank-$k$ flats highlighted, updates the readout. |

## Usage

```json
{ "type": "widget",        "slug": "matroid-flats-stepper", "params": { ... } },
{ "type": "widget-script", "slug": "matroid-flats-stepper", "params": { ... } }
```

Both blocks carry the same `params` object.
