# pde-wave-dalembert

Bespoke widget for the partial-differential-equations topic.

See [`../README.md`](../README.md) for the registry contract.

## What it does

Bespoke d'Alembert decomposition illustration for the §3 wave equation section on the partial-differential-equations topic — a time slider advances two counter-propagating wave packets that recompose into the full solution u(x,t)=½(f(x-ct)+f(x+ct)) plus an integrated g term. The split-traveling-waves visualization with synced packets doesn't fit a shared slug.

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
{ "type": "widget",        "slug": "pde-wave-dalembert", "params": { ... } },
{ "type": "widget-script", "slug": "pde-wave-dalembert", "params": { ... } }
```

Both blocks carry the same `params` object.
