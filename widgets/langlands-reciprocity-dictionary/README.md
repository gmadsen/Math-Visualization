# langlands-reciprocity-dictionary

Interactive two-column dictionary for the Langlands correspondence, introduced
on `langlands-program.html` §1 (the philosophy) to give the page its first
interactive widget. It complements the section's static two-column figure
(arithmetic | analytic, "L-functions match"): the figure states the slogan, the
widget unpacks the specific correspondences row by row.

Bespoke semantic module — the column headers and matched rows live in `params`,
so AJV validates the data and a non-HTML frontend can rebuild the table from the
schema alone.

See [../README.md](../README.md) for the registry contract.

## What it does

Two columns — the arithmetic/Galois side and the automorphic side — with matched
rows connected by ↔. Clicking a row highlights the pair and the readout explains
what the correspondence asserts about it: local–global compatibility
(Frobenius ↔ Hecke), equal L-functions, $\mathrm{GL}_1$ = class field theory,
$\mathrm{GL}_2$ = modularity, conductor = ramification. The recurring message:
the columns are two views of one object, tested through L-functions.

## Params

See [`schema.json`](./schema.json) for the authoritative shape. Required:

| field | type | purpose |
|---|---|---|
| `widgetId` | string | DOM id; the script derives `${widgetId}-svg/-out`. |
| `title` | string | Header title. |
| `hint` | string (optional) | Short hint. |
| `left` / `right` | object | Column descriptor: `header` (text), `color` (palette token like `--yellow`). |
| `rows` | array | Matched pairs: `id`, `left` (short box label), `right` (short box label), `detail` (what the correspondence asserts — shown in the readout on click). |

## Usage

Add a `widget` block plus a ref-based `widget-script` block to
`content/langlands-program.json`, then `node scripts/rebuild.mjs --only widget-params`
to AJV-validate and `node scripts/rebuild.mjs` for the round-trip gate.
