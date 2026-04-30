# complexity-sat-verifier

Bespoke widget for the complexity-theory topic.

See [`../README.md`](../README.md) for the registry contract.

## What it does

Lets the reader paste a 3-SAT assignment and watch a polynomial-time verifier evaluate the formula clause-by-clause. Bespoke because the readout highlights NP's verifier semantics (witness in, accept/reject in poly time) rather than a generic logic evaluator.

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
{ "type": "widget",        "slug": "complexity-sat-verifier", "params": { ... } },
{ "type": "widget-script", "slug": "complexity-sat-verifier", "params": { ... } }
```

Both blocks carry the same `params` object.
