# homological-cartan-eilenberg

Mode-tabbed diagram of a Cartan–Eilenberg resolution, introduced on
`homological.html` §14. Bespoke semantic module — a structural diagram; params
carry only chrome.

See [../README.md](../README.md) for the registry contract.

## What it does

Three tabs reveal the construction in layers, building the double complex
$P^{\bullet,\bullet}$ that resolves a cochain complex $C^\bullet$:

1. **The complex $C^\bullet$** — the bottom row, with differential $d:C^p\to C^{p+1}$.
2. **Resolve each column** — over each $C^p$ a projective resolution
   $P^{p,\bullet}\twoheadrightarrow C^p$ (green augmentation arrows; each
   $P^{p,q}$ projective). On its own this is just a *rowwise* resolution.
3. **Resolve $Z,B,H$** — the distinguishing third condition: the horizontal
   cycles, boundaries, and homology $Z^p,B^p,H^p$ of $P^{\bullet,\bullet}$ are
   themselves projective resolutions of $Z^p(C),B^p(C),H^p(C)$. The readout adds
   the two payoffs: hyper-derived functors and the Grothendieck spectral sequence.

## Params

| field | type | purpose |
|---|---|---|
| `widgetId` | string | DOM id; script derives `-svg/-out` and the three mode-button ids. |
| `title` | string | Header title. |
| `hint` | string (optional) | Short hint. |

## Usage

Add a `widget` block + ref-based `widget-script` block to
`content/homological.json`, then `node scripts/rebuild.mjs --only widget-params`
and `node scripts/rebuild.mjs`.
