# complexity-cook-levin-tableau

Bespoke widget for the complexity-theory topic.

See [`../README.md`](../README.md) for the registry contract.

## What it does

Renders the Cook-Levin tableau showing a Turing machine's space-time grid with cell-, head-, and transition-consistency clauses lighting up as you scrub. Bespoke because the geometry of the tableau (rows = time, columns = tape) is the proof's punchline and isn't reusable elsewhere.

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
{ "type": "widget",        "slug": "complexity-cook-levin-tableau", "params": { ... } },
{ "type": "widget-script", "slug": "complexity-cook-levin-tableau", "params": { ... } }
```

Both blocks carry the same `params` object.
