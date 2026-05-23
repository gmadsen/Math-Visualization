# advanced-complex-analysis-phragmen-lindelof

Phragmén–Lindelöf explorer on the right half-plane, introduced on
`advanced-complex-analysis.html` §6. Bespoke semantic module — the function eval
is intrinsic (a `kind` enum); params carry only the case menu.

See [../README.md](../README.md) for the registry contract.

## What it does

Pick a function on the right half-plane and slide the ray angle $\alpha$ (0 = the
real-axis bisector, $\pi/2$ = the imaginary-axis boundary). The widget shows the
half-plane with the chosen ray, and plots $\log|f|$ along that ray against the
boundary and bisector references. $e^z$ is **bounded on the boundary**
($|e^z|=1$ on the imaginary axis) yet **blows up on the real axis**
($|e^z|=e^r$): the naive maximum principle fails on an unbounded domain.
Phragmén–Lindelöf restores it only by adding a growth bound (order $<1$ for a
half-plane), which $e^z$ (order $1$) sits on the borderline of. $e^{-\sqrt z}$
has order $\tfrac12$ and stays $\le 1$ everywhere, so it satisfies the
hypotheses and the boundary bound controls the interior.

## Params

| field | type | purpose |
|---|---|---|
| `widgetId` | string | DOM id; script derives `-sel/-a/-svg/-out`. |
| `title` | string | Header title. |
| `hint` | string (optional) | Short hint. |
| `functions` | array | Each: `id`, `label` (plain text), `kind` (`ez`/`decay`), optional `note`. |

## Usage

Add a `widget` block + ref-based `widget-script` block to
`content/advanced-complex-analysis.json`, then `node scripts/rebuild.mjs --only widget-params`
and `node scripts/rebuild.mjs`.
