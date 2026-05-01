# computability-godel-encoding

Bespoke widget for the computability-and-decidability topic.

See [`../README.md`](../README.md) for the registry contract.

## What it does

Sketch of a Gödel encoding mapping symbol sequences to integer codes via prime factorization, with input symbols typed in and code recomputed live. Bespoke because the symbol palette and prime-power readout are tied to this introduction of arithmetization.

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
{ "type": "widget",        "slug": "computability-godel-encoding", "params": { ... } },
{ "type": "widget-script", "slug": "computability-godel-encoding", "params": { ... } }
```

Both blocks carry the same `params` object.
