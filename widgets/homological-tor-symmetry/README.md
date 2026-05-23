# homological-tor-symmetry

Symmetry-of-Tor explorer over $\mathbb{Z}$, introduced on `homological.html` §13.
Bespoke semantic module — the gcd arithmetic is intrinsic; params carry only
chrome.

See [../README.md](../README.md) for the registry contract.

## What it does

Pick $m$ and $n$. The widget computes $\mathrm{Tor}_1^{\mathbb{Z}}(\mathbb{Z}/m,
\mathbb{Z}/n)$ two ways: by resolving $\mathbb{Z}/m$ (free resolution
$0\to\mathbb{Z}\xrightarrow{\times m}\mathbb{Z}\to\mathbb{Z}/m\to0$, tensor with
$\mathbb{Z}/n$, take $\ker(\times m)$ on $\mathbb{Z}/n$) and by resolving
$\mathbb{Z}/n$ (symmetric). **Both give $\mathbb{Z}/\gcd(m,n)$** — Tor doesn't care
which argument you resolve. The clean proof resolves both at once via the double
complex $P_\bullet\otimes Q_\bullet$, whose two filtrations are these two routes.

## Params

| field | type | purpose |
|---|---|---|
| `widgetId` | string | DOM id; script derives `-m/-n/-svg/-out`. |
| `title` | string | Header title. |
| `hint` | string (optional) | Short hint. |

## Usage

Add a `widget` block + ref-based `widget-script` block to
`content/homological.json`, then `node scripts/rebuild.mjs --only widget-params`
and `node scripts/rebuild.mjs`.
