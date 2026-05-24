# lie-algebra-tangent

Bespoke module for **lie-groups** §2 (The Lie algebra: tangent space at the
identity). Makes concrete that g = T_e G is the solution set of the *linearised*
defining equation of G.

See [../README.md](../README.md) for the registry contract (schema + pure
render functions) and the bespoke-vs-shared distinction.

## What it does

Pick a matrix group (GL₂ℝ, SL₂ℝ, SO(2)). The widget shows its defining equation
and the condition obtained by differentiating along a curve $A(t)$ with
$A(0)=I$, $A'(0)=X$ — e.g. $\det A=1 \Rightarrow \operatorname{tr}X=0$,
$A^\top A=I \Rightarrow X^\top + X = 0$. It then tests a panel of six candidate
$2\times2$ matrices, marking each one $\in \mathfrak{g}$ (green) or
$\notin \mathfrak{g}$ (pink) by the linearised condition, and reports
$\dim\mathfrak{g}=\dim G$ with a basis. The recipe generalises verbatim to
$\mathfrak{so}(3)$, $\mathfrak{su}(n)$, etc.

## Params

See [`schema.json`](./schema.json) for the authoritative shape.

| field | type | purpose |
|---|---|---|
| `widgetId` | string | DOM id for the outer `<div class="widget">` wrapper. |
| `title`    | string | Display title (prose — `.ttl` is uppercased). |
| `hint`     | string (optional) | Short hint rendered next to the title. |

## Usage

```json
{ "type": "widget", "slug": "lie-algebra-tangent", "params": { "widgetId": "w-lie-tangent", "title": "The Lie algebra is the tangent space at the identity" } },
{ "type": "widget-script", "ref": "w-lie-tangent" }
```

Then `node scripts/rebuild.mjs --only widget-params` to AJV-validate, and
`node scripts/rebuild.mjs` for the full byte-identical round-trip gate.
