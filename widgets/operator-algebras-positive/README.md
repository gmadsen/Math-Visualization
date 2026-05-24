# operator-algebras-positive

Bespoke module for **operator-algebras** §12 (Positive elements). The commutative
picture of positivity in a C\*-algebra: working in the self-adjoint part of
$C(\{1,2\}) \cong \mathbb{R}^2$, a self-adjoint element *is* its pair of
eigenvalues / function values $(\lambda_1,\lambda_2)$, so the abstract
order-theoretic structure becomes a plane picture.

See [../README.md](../README.md) for the registry contract (schema + pure
render functions) and the bespoke-vs-shared distinction.

## What it does

Two sliders move the element $a=(\lambda_1,\lambda_2)$ around the plane of
self-adjoints; preset buttons jump to canonical elements (the unit $1$, a
projection $p$, a generic positive element, an indefinite one). The plot shows:

- the **positive cone** $A_+$ as the first quadrant (green),
- the **Löwner up-set** $\{b : b \ge a\} = a + A_+$ as the translated cone (violet),
- the **order interval** $[0,1]$ as the unit square (cyan dashed),
- the **positive square root** $b=\sqrt{a}$ as a second point (cyan), drawn only when $a \ge 0$.

The verdict panel checks the three equivalent characterizations of positivity —
$a \ge 0 \iff a=a^* \wedge \sigma(a)\subseteq[0,\infty) \iff a=b^*b$ — and the
Löwner comparisons $a \le 1$ and $0 \le a \le 1$ (positive contraction). The
readout states the abstract theorem and flags the noncommutative caveat: for
non-commuting self-adjoints the cone and order are the same abstractly, but
$A_{\mathrm{sa}}$ is no longer a plane and eigenvalues of $b-a$ are not
differences of eigenvalues.

## Params

See [`schema.json`](./schema.json) for the authoritative shape.

| field | type | purpose |
|---|---|---|
| `widgetId` | string | DOM id for the outer `<div class="widget">` wrapper. |
| `title`    | string | Display title (prose — `.ttl` is uppercased, so a formula would be mangled). |
| `hint`     | string (optional) | Short hint rendered next to the title. |
| `lo`       | number (optional, default −1.5) | Lower bound of both eigenvalue axes and sliders. |
| `hi`       | number (optional, default 3) | Upper bound of both eigenvalue axes and sliders. |
| `step`     | number (optional, default 0.25) | Slider step for $\lambda_1,\lambda_2$. |
| `presets`  | array (optional) | Jump-to example elements, each `{ label, l1, l2 }` (`label` is KaTeX-processed). |

## Usage

Embed the widget by adding two blocks to `content/<topic>.json`:

```json
{ "type": "widget", "slug": "operator-algebras-positive", "params": { "widgetId": "w-operator-algebras-positive", "title": "The positive cone and the Löwner order" } },
{ "type": "widget-script", "ref": "w-operator-algebras-positive" }
```

Then run `node scripts/rebuild.mjs --only widget-params` to AJV-validate the
params against this widget's schema, and `node scripts/rebuild.mjs` for the
full chain (including the byte-identical round-trip gate).
