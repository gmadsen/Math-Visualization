# algebra-field-tower

Field-extension tower explorer, introduced on `algebra.html` §8 (*Field
extensions and minimal polynomials*). Bespoke semantic module — the extension
data is intrinsic; params carry only chrome.

See [../README.md](../README.md) for the registry contract.

## What it does

Four buttons — $\mathbb Q(\sqrt2)$, $\mathbb Q(\sqrt2,\sqrt3)$,
$\mathbb Q(\sqrt[3]2)$, $\mathbb Q(i)$ — draw the extension over $\mathbb Q$ as a
vertical tower with the step degree on each edge, the total degree
$[K:\mathbb Q]=\prod(\text{steps})$ (the **Tower Law**), the minimal
polynomial(s), and a $\mathbb Q$-basis. It makes concrete that the degree of a
simple algebraic extension $F(\alpha)$ equals $\deg m_\alpha$, and that
$[\mathbb Q(\sqrt2,\sqrt3):\mathbb Q]=2\cdot2=4$ with basis
$\{1,\sqrt2,\sqrt3,\sqrt6\}$. The $\mathbb Q(\sqrt[3]2)$ case also notes it is
*not* the splitting field of $x^3-2$.

## Params

| field | type | purpose |
|---|---|---|
| `widgetId` | string | DOM id; script derives `-svg/-out` and the four extension-button ids. |
| `title` | string | Header title. |
| `hint` | string (optional) | Short hint. |

## Usage

Add a `widget` block + ref-based `widget-script` block to `content/algebra.json`,
then `node scripts/rebuild.mjs --only widget-params` and
`node scripts/rebuild.mjs`.
