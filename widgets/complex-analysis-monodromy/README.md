# complex-analysis-monodromy

Monodromy visualizer for multivalued functions, introduced on
`complex-analysis.html` §27 (analytic continuation). Bespoke semantic module —
the analytic continuation along the loop is intrinsic; params carry the menu +
monodromy text.

See [../README.md](../README.md) for the registry contract.

## What it does

Pick $\sqrt z$, $z^{1/3}$, or $\log z$ and sweep the angle of a point travelling
around the branch point $0$ (left panel). The analytically continued value —
$\sqrt z = \sqrt R\,e^{i\varphi/2}$, etc., with $\varphi$ *not* reduced mod
$2\pi$ — is traced in the $w$-plane (right). After one full loop the value
doesn't return to its start: $\sqrt z\mapsto-\sqrt z$, $z^{1/3}$ rotates by
$120°$, $\log z\mapsto\log z+2\pi i$ — the monodromy. The readout reports the
loop count, the start and current values, and the per-loop monodromy.

## Params

| field | type | purpose |
|---|---|---|
| `widgetId` | string | DOM id; script derives `-sel/-ang/-svg/-out`. |
| `title` | string | Header title. |
| `hint` | string (optional) | Short hint. |
| `functions` | array | Each: `id`, `label` (plain text), `kind` (`sqrt`/`cbrt`/`log`), `monodromy` (per-loop statement). |

## Usage

Add a `widget` block + ref-based `widget-script` block to
`content/complex-analysis.json`, then `node scripts/rebuild.mjs --only widget-params`
and `node scripts/rebuild.mjs`.
