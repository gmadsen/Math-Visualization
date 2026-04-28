# matroid-bases-rank-explorer

Bespoke widget for the §2 bases & rank on the
[`matroid-theory`](../../matroid-theory.html#bases) topic.

See [`../README.md`](../README.md) for the registry contract.

## What it does

Bespoke widget for the §2 bases & rank explorer on the matroid-theory topic — two range <input>s for $n$ and $r$ with their readout spans, a text <input> for the test subset $S$, an SVG host that draws every $r$-subset of $\{1,\ldots,n\}$ as a basis, and a readout that reports $r(S) = \min(|S|, r)$ plus submodularity witnesses. The combination of two slider rows + text-input + SVG + readout is unique on the page and not absorbed by any shared slug; this slug captures it as one unit with the basis enumeration and rank computation kept opaque in the bodyScript artifact.

## Params

See [`schema.json`](./schema.json) for the authoritative shape. Summary:

| field            | kind        | purpose |
|---|---|---|
| `widgetId`       | fundamental | DOM id for the outer `<div class="widget">`. |
| `title`          | fundamental | Header title. |
| `hint`           | fundamental | Header hint. |
| `bodyMarkup`     | *artifact*  | Verbatim inner-body HTML (two slider rows, text input + update button, SVG, readout, trailing <div class="small"> note). |
| `sectionComment` | *artifact*  | Optional `/* ... */` banner above the IIFE. |
| `bodyScript`     | *artifact*  | Verbatim IIFE body — enumerates all $r$-subsets of $\{1,\ldots,n\}$, draws them in the SVG, parses the user subset, computes $r(S)$, updates the readout. |

## Usage

```json
{ "type": "widget",        "slug": "matroid-bases-rank-explorer", "params": { ... } },
{ "type": "widget-script", "slug": "matroid-bases-rank-explorer", "params": { ... } }
```

Both blocks carry the same `params` object.
