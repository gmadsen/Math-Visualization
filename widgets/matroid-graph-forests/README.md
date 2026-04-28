# matroid-graph-forests

Bespoke widget for the §3 graphic matroid (K4) on the
[`matroid-theory`](../../matroid-theory.html#examples) topic.

See [`../README.md`](../README.md) for the registry contract.

## What it does

Bespoke widget for the §3 graphic-matroid example on the matroid-theory topic — a clickable SVG of $K_4$ whose edges toggle in/out of the user-selected set $F$, two action buttons (clear $F$ / find a spanning tree), and a readout reporting whether $F$ is independent (a forest) and its rank in $M(K_4)$. The combination of click-on-SVG-edges + button row + readout is bespoke (clickable-graph drives node-click semantics, not edge-click); this slug captures the gesture as one unit and keeps the layout, cycle detection, and spanning-tree search opaque in the bodyScript artifact.

## Params

See [`schema.json`](./schema.json) for the authoritative shape. Summary:

| field            | kind        | purpose |
|---|---|---|
| `widgetId`       | fundamental | DOM id for the outer `<div class="widget">`. |
| `title`          | fundamental | Header title. |
| `hint`           | fundamental | Header hint. |
| `bodyMarkup`     | *artifact*  | Verbatim inner-body HTML (SVG host for $K_4$, button row (clear / find spanning tree), readout, trailing <div class="small"> legend). |
| `sectionComment` | *artifact*  | Optional `/* ... */` banner above the IIFE. |
| `bodyScript`     | *artifact*  | Verbatim IIFE body — lays out $K_4$, wires per-edge click handlers, runs union-find to detect cycles and tag forest edges, computes the rank, finds a spanning tree on demand. |

## Usage

```json
{ "type": "widget",        "slug": "matroid-graph-forests", "params": { ... } },
{ "type": "widget-script", "slug": "matroid-graph-forests", "params": { ... } }
```

Both blocks carry the same `params` object.
