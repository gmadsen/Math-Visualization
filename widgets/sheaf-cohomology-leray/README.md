# sheaf-cohomology-leray

Leray / acyclic-cover explorer, introduced on `sheaf-cohomology.html` §5
(*Comparison: Čech = derived for Leray covers*). Bespoke semantic module — a
structural diagram; params carry only chrome.

See [../README.md](../README.md) for the registry contract.

## What it does

Three scenario tabs show when the canonical comparison map
$\check H^p(\mathcal U,\mathcal F)\to H^p(X,\mathcal F)$ is an isomorphism:

1. **$\mathbb P^1$ affine cover** $\{U_0,U_1\}$ — all intersections affine, hence
   $\mathcal F$-acyclic (Serre); Leray ⇒ iso.
2. **$\mathbb P^2$ affine cover** $\{U_0,U_1,U_2\}$ — pairwise and triple
   intersections affine; Leray ⇒ iso, with $H^2$ living in $\check C^2$.
3. **Trivial cover $\{\mathbb P^1\}$**, $\mathcal F=\mathcal O(-2)$ — the whole
   space is not acyclic ($H^1(\mathbb P^1,\mathcal O(-2))=k\neq 0$), so the
   one-set Čech misses $H^1$; NOT Leray ⇒ must refine.

Each tab lists the finite intersections with ✓/✗ acyclicity marks, draws the
comparison map annotated with $\cong$ or $\neq$, and states a verdict.

## Params

| field | type | purpose |
|---|---|---|
| `widgetId` | string | DOM id; script derives `-svg/-out` and the three scenario-button ids. |
| `title` | string | Header title. |
| `hint` | string (optional) | Short hint. |

## Usage

Add a `widget` block + ref-based `widget-script` block to
`content/sheaf-cohomology.json`, then `node scripts/rebuild.mjs --only widget-params`
and `node scripts/rebuild.mjs`.
