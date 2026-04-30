# group-cohomology-brauer-cheatsheet

Bespoke widget for the group-cohomology topic.

See [`../README.md`](../README.md) for the registry contract.

## What it does

Bespoke Brauer-group cheat sheet that maps a chosen field $ to $\mathrm{Br}(k)$. Lookup data is curated for the topic's exposition (local, global, finite, $\mathbb{R}$, $\mathbb{C}$ rows) and is not a candidate for a shared lookup-table widget.

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
{ "type": "widget",        "slug": "group-cohomology-brauer-cheatsheet", "params": { ... } },
{ "type": "widget-script", "slug": "group-cohomology-brauer-cheatsheet", "params": { ... } }
```

Both blocks carry the same `params` object.
