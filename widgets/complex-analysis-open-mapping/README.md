# complex-analysis-open-mapping

Open-mapping-theorem explorer, introduced on `complex-analysis.html` §15. Bespoke
semantic module — the function eval and the winding count are intrinsic (a `kind`
enum); params carry only the case menu.

See [../README.md](../README.md) for the registry contract.

## What it does

A small open disk around $z_0$ is shown beside its image under $f$. For a
non-constant **holomorphic** $f$ ($z^2$, $z^3$, $e^z$) the image of the disk's
boundary winds around $f(z_0)$, so $f(z_0)$ lies in the **interior** of the image
— the image is open. The widget reports that winding number (and notes a winding
$>1$ as a local-degree / critical point, where the image is still open). The
non-holomorphic $\mathrm{Re}(z)$ and $|z|$ collapse the disk to a segment
(winding 0, $f(z_0)$ on the boundary): they are **not** open maps, showing the
open-mapping theorem genuinely needs holomorphy.

## Params

| field | type | purpose |
|---|---|---|
| `widgetId` | string | DOM id; script derives `-sel/-c/-r/-svg/-out`. |
| `title` | string | Header title. |
| `hint` | string (optional) | Short hint. |
| `functions` | array | Each: `id`, `label` (plain text), `kind` (`z2`/`z3`/`ez`/`re`/`abs`), optional `note`. |

## Usage

Add a `widget` block + ref-based `widget-script` block to
`content/complex-analysis.json`, then `node scripts/rebuild.mjs --only widget-params`
and `node scripts/rebuild.mjs`.
