# three-body-halo-orbits

Bespoke widget for the §6 halo-orbit / tadpole illustration on the
[`three-body-problem`](../../three-body-problem.html#applications) topic.

See [`../README.md`](../README.md) for the registry contract.

## What it does

Three preset buttons select among the $L_1$ halo, $L_2$ halo, and $L_4$
tadpole librations of the Sun–Earth circular restricted three-body problem.
An amplitude slider scales the orbit; the SVG animates a spacecraft on the
chosen libration orbit and a readout reports the amplitude in km (so JWST's
$\sim 10^5$-km halo amplitude becomes a tactile reference). A trailing
`<p class="small">` carries mission-context provenance.

## Params

See [`schema.json`](./schema.json) for the authoritative shape. Summary:

| field            | kind        | purpose |
|---|---|---|
| `widgetId`       | fundamental | DOM id for the outer `<div class="widget">`. |
| `title`          | fundamental | Header title. |
| `hint`           | fundamental | Header hint. |
| `bodyMarkup`     | *artifact*  | Verbatim inner-body HTML (controls row, SVG, readout div, trailing `<p class="small">`). |
| `sectionComment` | *artifact*  | Optional `/* ... */` banner above the IIFE. |
| `bodyScript`     | *artifact*  | Verbatim IIFE body — wires preset buttons + slider, locates $L_1$/$L_2$, animates the libration orbit. |

## Usage

```json
{ "type": "widget",        "slug": "three-body-halo-orbits", "params": { ... } },
{ "type": "widget-script", "slug": "three-body-halo-orbits", "params": { ... } }
```

Both blocks carry the same `params` object.
