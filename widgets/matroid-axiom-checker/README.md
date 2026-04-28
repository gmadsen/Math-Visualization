# matroid-axiom-checker

Bespoke widget for the §1 independence-axiom checker on the
[`matroid-theory`](../../matroid-theory.html#axioms) topic.

See [`../README.md`](../README.md) for the registry contract.

## What it does

A ground-set `<input>` and a multi-line `<textarea>` carrying the family
$\mathcal{I}$ (one set per line, comma-separated elements between braces) feed
a "check axioms" button. A second pair of preset buttons loads the canonical
$U_{2,4}$ example or a deliberately-broken family. The readout runs the three
matroid independence axioms (I1) non-trivial, (I2) hereditary, (I3) exchange
against the edited family and reports pass/fail with witnesses.

The shape (text input + textarea + preset button row + readout + trailing
`<div class="small">` of provenance prose) is bespoke — no shared slug
absorbs the textarea-plus-button-row gesture. This slug captures it as one
unit and keeps the parser, the (I1)/(I2)/(I3) checker, and the preset wiring
opaque in the `bodyScript` artifact.

## Params

See [`schema.json`](./schema.json) for the authoritative shape. Summary:

| field            | kind        | purpose |
|---|---|---|
| `widgetId`       | fundamental | DOM id for the outer `<div class="widget">`. |
| `title`          | fundamental | Header title. |
| `hint`           | fundamental | Header hint. |
| `bodyMarkup`     | *artifact*  | Verbatim inner-body HTML (ground-set input, textarea, button row, readout, trailing `<div class="small">`). |
| `sectionComment` | *artifact*  | Optional `/* ... */` banner above the IIFE. |
| `bodyScript`     | *artifact*  | Verbatim IIFE body — parses E and $\mathcal{I}$, runs the three axiom checks, wires presets, updates the readout. |

## Usage

```json
{ "type": "widget",        "slug": "matroid-axiom-checker", "params": { ... } },
{ "type": "widget-script", "slug": "matroid-axiom-checker", "params": { ... } }
```

Both blocks carry the same `params` object.
