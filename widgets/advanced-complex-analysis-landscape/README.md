# advanced-complex-analysis-landscape

Thematic map for the overview/landscape section of
`advanced-complex-analysis.html` §1. Bespoke data-only module — params carry the
threads and their member theorems; no math, just navigation.

See [../README.md](../README.md) for the registry contract.

## What it does

The reader clicks one of the page's organizing **threads** (value distribution,
construction theorems, growth & maximum-modulus, boundary behavior) and sees its
one-line idea plus the member theorems as in-page anchor links — turning the prose
"four threads" overview into a navigable map of the page.

## Params

| field | type | purpose |
|---|---|---|
| `widgetId` | string | DOM id; script derives `-tabs/-body`. |
| `title` | string | Header title. |
| `hint` | string (optional) | Short hint. |
| `threads` | array | Each: `id`, `name` (tab label), `blurb` (≤240 chars), `members` (array of `{label, anchor}` in-page links). |

## Usage

Add a `widget` block + ref-based `widget-script` block to
`content/advanced-complex-analysis.json`, then `node scripts/rebuild.mjs --only widget-params`
and `node scripts/rebuild.mjs`.
