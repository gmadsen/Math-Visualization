# hodge-theory-hodge-class-cases

Case browser for the status of the Hodge conjecture, introduced on
`hodge-theory.html` §6. Bespoke semantic module — each case's status and
explanation live in params.

See [../README.md](../README.md) for the registry contract.

## What it does

A clickable list of `(variety, codimension)` cases, each badged **known**,
**partial**, **open**, or **false** (colour-coded green/cyan/yellow/pink).
Clicking a case shows in the readout why — Lefschetz $(1,1)$ for $p=1$,
dimension reasons up to $\dim 3$, Deligne's absolute-Hodge theorem for abelian
varieties, the Atiyah–Hirzebruch/Totaro counterexamples to the *integral*
version, etc. The point: the conjecture is a landscape of proven corners around
a hard open core.

## Params

| field | type | purpose |
|---|---|---|
| `widgetId` | string | DOM id; script derives `-svg/-out`. |
| `title` | string | Header title. |
| `hint` | string (optional) | Short hint. |
| `cases` | array | Each: `id`, `variety` (plain text), `codim` (e.g. `p = 1`), `status` (`known`/`partial`/`open`/`false`), `reason` (shown on click). |

## Usage

Add a `widget` block + ref-based `widget-script` block to
`content/hodge-theory.json`, then `node scripts/rebuild.mjs --only widget-params`
and `node scripts/rebuild.mjs`.
