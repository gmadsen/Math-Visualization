# advanced-complex-analysis-hardy-spaces

Fatou-boundary-values explorer, introduced on `advanced-complex-analysis.html`
§8. Bespoke semantic module — the function eval is intrinsic (a `kind` enum);
params carry only the case menu.

See [../README.md](../README.md) for the registry contract.

## What it does

Pick a bounded holomorphic $f$ on the unit disk and slide the boundary angle
$\theta$. The widget draws the radius to $e^{i\theta}$ and plots
$|f(re^{i\theta})|$ as $r\to1$, showing the radial limit converging to the
**Fatou boundary value** $f^*(e^{i\theta})$. A Blaschke factor is inner, so
$|f^*|=1$ at every $\theta$; $(1+z)/2$ has $|f^*|=|\cos(\theta/2)|$ (a genuine
non-constant boundary function); the singular inner function
$\exp\!\big(\tfrac{z+1}{z-1}\big)$ has $|f^*|=1$ for almost every $\theta$ yet its
radial limit at the single point $z=1$ ($\theta=0$) is $0$ — the measure-zero
exceptional set Fatou's theorem allows. (Set $\theta=0$ to see it.)

## Params

| field | type | purpose |
|---|---|---|
| `widgetId` | string | DOM id; script derives `-sel/-t/-svg/-out`. |
| `title` | string | Header title. |
| `hint` | string (optional) | Short hint. |
| `functions` | array | Each: `id`, `label` (plain text), `kind` (`blaschke`/`half`/`singInner`), optional `note`. |

## Usage

Add a `widget` block + ref-based `widget-script` block to
`content/advanced-complex-analysis.json`, then `node scripts/rebuild.mjs --only widget-params`
and `node scripts/rebuild.mjs`.
