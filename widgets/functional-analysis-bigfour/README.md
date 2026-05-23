# functional-analysis-bigfour

Tab map of the big-four Banach-space theorems, introduced on
`functional-analysis.html` §6. Bespoke data-only module — params carry the
theorem cards; no math, just an orienting map.

See [../README.md](../README.md) for the registry contract.

## What it does

The reader clicks one of the four pillars of Banach-space analysis (Hahn–Banach,
Open Mapping, Closed Graph, Banach–Steinhaus) and sees its **input → output**
one-liner, full statement, and the engine behind it (Baire category or Zorn's
lemma) — turning the section's "one-minute summary" table into a navigable map.

## Params

| field | type | purpose |
|---|---|---|
| `widgetId` | string | DOM id; script derives `-tabs/-body`. |
| `title` | string | Header title. |
| `hint` | string (optional) | Short hint. |
| `theorems` | array | Each: `id`, `name` (tab label), `input`, `output`, `statement`, optional `poweredBy`. |

## Usage

Add a `widget` block + ref-based `widget-script` block to
`content/functional-analysis.json`, then `node scripts/rebuild.mjs --only widget-params`
and `node scripts/rebuild.mjs`.
