# complex-analysis-normal-families

Montel's-theorem explorer, introduced on `complex-analysis.html` §24. Bespoke
semantic module — the sequence eval is intrinsic (a `kind` enum); params carry
only the case menu.

See [../README.md](../README.md) for the registry contract.

## What it does

Pick a sequence $(f_n)$ and step the index $n$. The widget plots $\operatorname{Re}
f_n$ along a compact slice $|x|\le 0.9$ of the disk, ghosting the earlier terms,
with the uniform bound drawn. **Montel:** a family uniformly bounded on compact
sets is *normal* — every sequence has a locally-uniformly-convergent subsequence.
The bounded families stay inside the bound: $z^n\to0$ and $z/n\to0$ converge
outright, while $e^{in}z$ is bounded (hence normal) but its *full* sequence never
converges — Montel still guarantees a convergent **subsequence**. The unbounded
$n\cdot z$ violates the hypothesis and marches off the chart: not normal.

## Params

| field | type | purpose |
|---|---|---|
| `widgetId` | string | DOM id; script derives `-sel/-n/-svg/-out`. |
| `title` | string | Header title. |
| `hint` | string (optional) | Short hint. |
| `families` | array | Each: `id`, `label` (plain text), `kind` (`zn`/`shrink`/`rot`/`unbounded`), optional `note`. |

## Usage

Add a `widget` block + ref-based `widget-script` block to
`content/complex-analysis.json`, then `node scripts/rebuild.mjs --only widget-params`
and `node scripts/rebuild.mjs`.
