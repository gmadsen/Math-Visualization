# functional-analysis-bounded-continuous

Bounded-vs-continuous explorer, introduced on `functional-analysis.html` §4.
Bespoke semantic module — the norm ratios are computed in closed form (a `kind`
enum); params carry the case menu. (Distinct from the §3 operator-norm widget,
which computes $\|T\|$ for a $2\times2$ matrix; this one is about the
bounded$\iff$continuous dichotomy and the existence of *unbounded* operators.)

See [../README.md](../README.md) for the registry contract.

## What it does

Pick a linear operator on a function space and step the test family
$x_n=\sin(nx)$ on $L^2[0,\pi]$. The widget plots the amplification ratio
$\|Tx_n\|/\|x_n\|$ against $n$. A **bounded** operator caps the ratio —
multiplication is flat at $2$, the Volterra integral $\int_0^x$ decays as
$\sqrt3/n\to0$ (both continuous) — while the **derivative** $d/dx$ grows the ratio
like $n$ with no bound, so it is unbounded, hence **discontinuous**. That a linear
map can be discontinuous is purely an infinite-dimensional phenomenon: every
operator on a finite-dimensional space is bounded.

## Params

| field | type | purpose |
|---|---|---|
| `widgetId` | string | DOM id; script derives `-sel/-n/-svg/-out`. |
| `title` | string | Header title. |
| `hint` | string (optional) | Short hint. |
| `operators` | array | Each: `id`, `label` (plain text), `kind` (`mult`/`volterra`/`deriv`), optional `note`. |

## Usage

Add a `widget` block + ref-based `widget-script` block to
`content/functional-analysis.json`, then `node scripts/rebuild.mjs --only widget-params`
and `node scripts/rebuild.mjs`.
