# prob-convergence-modes

Bespoke module for **probability-theory** §7 (Modes of convergence). Visualizes
the one-directional implications between the four modes of convergence of random
variables.

See [../README.md](../README.md) for the registry contract (schema + pure
render functions) and the bespoke-vs-shared distinction.

## What it does

The widget draws the implication diagram — almost surely $\Rightarrow$ in
probability $\Rightarrow$ in distribution, and $L^p \Rightarrow$ in probability —
and colours each node green (the mode holds) or pink (it fails) for a selected
example sequence:

- the **spike** $X_n = n\mathbf{1}_{(0,1/n)}$ — converges a.s. but not in $L^1$
  ($\mathbb{E}|X_n|=1$);
- the **typewriter** $X_n = \mathbf{1}_{I_n}$ — converges in probability (and
  $L^1$) but not a.s.;
- an **i.i.d.** sequence — converges in distribution but not in probability;
- $X_n = X/n$ — converges in all four modes.

A chip strip echoes the four ✓/✗ verdicts, and the readout explains which
reverse implication the example breaks and what hypotheses bridge the gaps
(uniform integrability, a Borel–Cantelli rate, a constant limit).

## Params

See [`schema.json`](./schema.json) for the authoritative shape.

| field | type | purpose |
|---|---|---|
| `widgetId` | string | DOM id for the outer `<div class="widget">` wrapper. |
| `title`    | string | Display title (prose — `.ttl` is uppercased). |
| `hint`     | string (optional) | Short hint rendered next to the title. |

## Usage

```json
{ "type": "widget", "slug": "prob-convergence-modes", "params": { "widgetId": "w-prob-conv", "title": "Four modes of convergence — and which implications are one-way" } },
{ "type": "widget-script", "ref": "w-prob-conv" }
```

Then `node scripts/rebuild.mjs --only widget-params` to AJV-validate, and
`node scripts/rebuild.mjs` for the full byte-identical round-trip gate.
