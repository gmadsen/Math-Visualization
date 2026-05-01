# general-relativity-gw

Bespoke widget for the general-relativity topic.

See [`../README.md`](../README.md) for the registry contract.

## What it does

Bespoke gravitational-wave demonstrator: drag a binary inspiral's frequency; watch the strain h(t) chirp and a ring of test masses oscillate transversely. Concrete touch-point for the linearized GR + LIGO observation chain.

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
{ "type": "widget",        "slug": "general-relativity-gw", "params": { ... } },
{ "type": "widget-script", "slug": "general-relativity-gw", "params": { ... } }
```

Both blocks carry the same `params` object.
