# computability-turing-increment

Bespoke widget for the computability-and-decidability topic.

See [`../README.md`](../README.md) for the registry contract.

## What it does

Step-by-step Turing machine that increments a binary string on a tape, animating head position and state transitions. Bespoke because it ships a custom tape/state-table renderer with a hand-coded transition function tied to this exact illustration.

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
{ "type": "widget",        "slug": "computability-turing-increment", "params": { ... } },
{ "type": "widget-script", "slug": "computability-turing-increment", "params": { ... } }
```

Both blocks carry the same `params` object.
