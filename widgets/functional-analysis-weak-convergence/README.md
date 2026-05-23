# functional-analysis-weak-convergence

Weak-convergence explorer, introduced on `functional-analysis.html` §13. Bespoke
semantic module — the component values come from params.

See [../README.md](../README.md) for the registry contract.

## What it does

Pick a test vector $y\in\ell^2$ and slide the basis index $n$. The widget draws
$y$'s components as bars; the $n$-th bar is $\langle e_n,y\rangle=y_n$. As $n$
grows, $\langle e_n,y\rangle\to0$ for **every** $y$ (because
$\sum|y_n|^2=\|y\|^2<\infty$), so the orthonormal basis $e_n$ converges **weakly**
to $0$ — yet $\|e_n\|=1$ for all $n$ (the pink line), so it does **not** converge
in norm. Weak $\neq$ strong: the hallmark of infinite dimensions, and the reason
the closed unit ball is weakly (but not norm-) compact.

## Params

| field | type | purpose |
|---|---|---|
| `widgetId` | string | DOM id; script derives `-sel/-n/-svg/-out`. |
| `title` | string | Header title. |
| `hint` | string (optional) | Short hint. |
| `vectors` | array | Each: `id`, `label` (plain text), `comps` (the components $y_1,y_2,\dots$), optional `note`. |

## Usage

Add a `widget` block + ref-based `widget-script` block to
`content/functional-analysis.json`, then `node scripts/rebuild.mjs --only widget-params`
and `node scripts/rebuild.mjs`.
