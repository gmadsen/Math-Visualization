# functional-analysis-banach-alaoglu

Banach–Alaoglu explorer, introduced on `functional-analysis.html` §14. Bespoke
semantic module — the $\ell^p$ ball geometry is intrinsic; params carry the norm
menu.

See [../README.md](../README.md) for the registry contract.

## What it does

Pick an $\ell^p$ norm on $X=\mathbb{R}^2$. The widget draws the **dual unit ball**
$B_{X^*}$ (the $\ell^q$ ball, $q$ the conjugate exponent) sitting inside the
compact "cube" $\prod[-\|e_i\|,\|e_i\|]=[-1,1]^2$ into which the Banach–Alaoglu
proof embeds it via $\ell\mapsto(\ell(e_i))$. Because the cube is compact
(Tychonoff) and $B_{X^*}$ is a closed subset of it, $B_{X^*}$ is compact — and
Banach–Alaoglu is exactly the statement that this weak-* compactness survives into
infinite dimensions, where the norm-ball is never compact. At $p=1$ the dual ball
fills the whole cube ($\ell^\infty$); at $p=\infty$ it is the inscribed diamond
($\ell^1$).

## Params

| field | type | purpose |
|---|---|---|
| `widgetId` | string | DOM id; script derives `-sel/-svg/-out`. |
| `title` | string | Header title. |
| `hint` | string (optional) | Short hint. |
| `norms` | array | Each: `id`, `label` (plain text), `p` (X's exponent), `q` (conjugate; use ≥50 for ∞), optional `note`. |

## Usage

Add a `widget` block + ref-based `widget-script` block to
`content/functional-analysis.json`, then `node scripts/rebuild.mjs --only widget-params`
and `node scripts/rebuild.mjs`.
