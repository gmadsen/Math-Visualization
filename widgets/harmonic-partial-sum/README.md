# harmonic-partial-sum

Bespoke widget for the harmonic-analysis-fourier topic.

See [`../README.md`](../README.md) for the registry contract.

## What it does

Bespoke partial-Fourier-sum visualizer for the harmonic-analysis-fourier topic — target waveform <select> (square / triangle / sawtooth / smooth bump) plus an N slider drive an SVG plot of the partial sum S_N f. The discontinuous targets show the ~9% Gibbs overshoot regardless of N; the smooth bump converges exponentially. Slider+select+svg+readout combo doesn't fit a shared slug.

## Params

See [`schema.json`](./schema.json) for the authoritative shape. Summary:

| field            | kind        | purpose |
|---|---|---|
| `widgetId`       | fundamental | DOM id for the outer `<div class="widget">`. |
| `title`          | fundamental | Header title. |
| `hint`           | fundamental | Header hint. |
| `bodyMarkup`     | *artifact*  | Verbatim inner-body HTML (controls, SVG, readouts). |
| `sectionComment` | *artifact*  | Optional `/* ... */` banner above the IIFE. |
| `bodyScript`     | *artifact*  | Verbatim IIFE body. |

## Usage

```json
{ "type": "widget",        "slug": "harmonic-partial-sum", "params": { ... } },
{ "type": "widget-script", "slug": "harmonic-partial-sum", "params": { ... } }
```

Both blocks carry the same `params` object.
