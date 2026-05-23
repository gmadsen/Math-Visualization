# sheaf-cohomology-nerve

Nerve-of-a-cover explorer, introduced on `sheaf-cohomology.html` §2 (*Čech
cohomology*). Bespoke semantic module — the combinatorics are intrinsic; params
carry only chrome.

See [../README.md](../README.md) for the registry contract.

## What it does

Toggle between a cover of $S^1$ and of a contractible interval, and slide the
number of sets $N$. The widget draws the cover by $N$ overlapping sets (left),
its **nerve** $N(\mathcal U)$ — one vertex per set, one edge per pairwise
overlap, no triple overlaps (right) — and the **Čech cohomology of the constant
sheaf** $\underline{\mathbb Z}$, which equals the simplicial cohomology of the
nerve. For $S^1$ the nerve is a cycle graph, giving
$\check H^0=\mathbb Z,\ \check H^1=\mathbb Z=H^*(S^1)$; for the interval it is a
tree, giving $\check H^0=\mathbb Z,\ \check H^1=0$. Varying $N$ leaves the
cohomology fixed — the nerve theorem (a good cover's nerve is homotopy
equivalent to the space). Distinct from the §7 `w-cech-p1` widget, which does
the cover-dependent $\mathcal O(d)$ computation on $\mathbb P^1$.

## Params

| field | type | purpose |
|---|---|---|
| `widgetId` | string | DOM id; script derives `-svg/-out/-n` and the two topology-button ids. |
| `title` | string | Header title. |
| `hint` | string (optional) | Short hint. |

## Usage

Add a `widget` block + ref-based `widget-script` block to
`content/sheaf-cohomology.json`, then `node scripts/rebuild.mjs --only widget-params`
and `node scripts/rebuild.mjs`.
