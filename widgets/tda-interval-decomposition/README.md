# tda-interval-decomposition

Bespoke widget for `topological-data-analysis.html` (§5 *Structure theorem — barcodes are
the complete invariant*, concept `structure-theorem-decomposition`). It makes the structure
theorem for persistence modules concrete through **H₀ sublevel-set persistence** of a fixed
1-D function. Single module, not part of a shared family.

See [../README.md](../README.md) for the registry contract (schema + pure render functions)
and the bespoke-vs-shared distinction.

## What it does

A fixed function $f$ on $[0,1]$ is drawn on top. Drag the **sublevel threshold** $t$ and a
horizontal line sweeps up the graph; the sublevel set $\{f \le t\}$ is shaded on the axis,
one coloured segment per connected component. As $t$ rises a component is **born** at each
local minimum and two components **merge** at each local maximum, where the *elder rule*
kills the younger one (the one with the higher birth value).

The bottom panel is the **barcode**: one horizontal bar per component, drawn from its birth
to its death along the filtration axis (the connected/global component gets the infinite
bar). A moving vertical marker shows the current $t$; bars that straddle it are highlighted,
and the readout reports $\dim M_t$ = the number of live bars = the number of components of
$\{f\le t\}$.

The takeaway is the **structure theorem** (Crawley-Boevey; Zomorodian–Carlsson): a
pointwise-finite persistence module over a field decomposes uniquely as a direct sum of
interval modules $M \cong \bigoplus_\alpha I[b_\alpha, d_\alpha)$, so the barcode (the
multiset of bars) is a *complete* invariant — two modules are isomorphic iff their barcodes
match. Bar length is persistence: the long/infinite bars are real features, tiny bars are
noise. The proof parallels the classification of f.g. modules over the PID $k[t]$, and there
is no such decomposition for multi-parameter persistence.

## Params

See [`schema.json`](./schema.json) for the authoritative shape. Required fields:

| field | type | purpose |
|---|---|---|
| `widgetId` | string | DOM id for the outer `<div class="widget">` wrapper (and the `-svg`/`-out`/`-t` children). |
| `title`    | string | Display title rendered in the header. |
| `hint`     | string (optional) | Short hint rendered next to the title. |

The function, sampling resolution, and the persistence computation are fixed inside the
renderer — there are no numeric params to tune. The barcode is computed once (union-find
sweep with the elder rule); the slider only moves the threshold marker and recolours the
live components.

## Usage

Embed the widget by adding a `widget` block plus its `widget-script` block to
`content/topological-data-analysis.json`:

```json
{ "type": "widget",        "slug": "tda-interval-decomposition", "params": { "widgetId": "w-tda-decomp", "title": "Structure theorem: the barcode as a complete invariant", "hint": "drag the threshold; watch components born/merge and the bars grow" } },
{ "type": "widget-script", "ref": "w-tda-decomp" }
```

Then run `node scripts/rebuild.mjs --only widget-params` to AJV-validate the params, and
`node scripts/rebuild.mjs` for the full chain (including the byte-identical round-trip gate).
