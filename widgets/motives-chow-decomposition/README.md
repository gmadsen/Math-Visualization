# motives-chow-decomposition

Chow-motive decomposition viewer, introduced on `motives.html` §3. Bespoke
semantic module — each variety carries its list of motive summands in params.

See [../README.md](../README.md) for the registry contract.

## What it does

Pick a variety and see its motive $h(X)$ split into pieces: Tate motives
$\mathbf{1}=\mathbb{Q}(0)$, $\mathbb{L}=\mathbb{Q}(-1)$, $\mathbb{L}^2$, …
(cyan — each 1-dimensional, pure type $(i,i)$) plus the transcendental $h^1$
pieces of curves (yellow). Each box shows which degree $H^d$ the piece realizes
into and its dimension; the readout writes the decomposition and recovers the
Betti numbers. Concretely realizes the §3 example
$h(\mathbb{P}^1)=\mathbf{1}\oplus\mathbb{L}$ and its higher analogues.

## Params

| field | type | purpose |
|---|---|---|
| `widgetId` | string | DOM id; script derives `-sel/-svg/-out`. |
| `title` | string | Header title. |
| `hint` | string (optional) | Short hint. |
| `varieties` | array | Each: `id`, `label` (plain text), optional `note`, and `pieces` — a list of `{label, degree, dim, mult, kind}` summands (`kind`: `tate` or `transcendental`). |

## Usage

Add a `widget` block + ref-based `widget-script` block to
`content/motives.json`, then `node scripts/rebuild.mjs --only widget-params`
and `node scripts/rebuild.mjs`.
