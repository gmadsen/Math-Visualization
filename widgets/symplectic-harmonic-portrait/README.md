# symplectic-harmonic-portrait

Bespoke widget for the symplectic-manifolds topic.

See [`../README.md`](../README.md) for the registry contract.

## What it does

Energy slider sweeps level sets of the harmonic-oscillator Hamiltonian, stacking phase-portrait ellipses to show how Hamiltonian flow preserves H and traces nested closed orbits.

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
{ "type": "widget",        "slug": "symplectic-harmonic-portrait", "params": { ... } },
{ "type": "widget-script", "slug": "symplectic-harmonic-portrait", "params": { ... } }
```

Both blocks carry the same `params` object.
