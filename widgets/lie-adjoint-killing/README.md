# lie-adjoint-killing

Bespoke module for **lie-groups** §6 (The adjoint representation). Builds the
adjoint matrices and the Killing form of a small Lie algebra and reads off the
signature — distinguishing compact from split real forms via Cartan's criterion.

See [../README.md](../README.md) for the registry contract (schema + pure
render functions) and the bespoke-vs-shared distinction.

## What it does

Pick a Lie algebra (so(3)≅su(2), or sl(2,ℝ)) and a basis element $X$. From the
structure constants the widget builds $\operatorname{ad}_X(Y) = [X,Y]$ as a
matrix on the algebra, then forms the **Killing form** $B(X,Y) = \operatorname{tr}(\operatorname{ad}_X \operatorname{ad}_Y)$
and diagonalises it (Jacobi rotations) to get its eigenvalue signature.

- **so(3)≅su(2)**: $B = -2I$, signature $(0,3)$ — negative-definite, so the group
  is **compact**.
- **sl(2,ℝ)**: signature $(2,1)$ — indefinite, so the group is **noncompact**
  (the split real form).

Either way $B$ is non-degenerate, so by **Cartan's criterion** the algebra is
semisimple. The readout notes that Jacobi's identity is exactly the statement
that $\operatorname{ad}$ is a Lie-algebra homomorphism.

## Params

See [`schema.json`](./schema.json) for the authoritative shape.

| field | type | purpose |
|---|---|---|
| `widgetId` | string | DOM id for the outer `<div class="widget">` wrapper. |
| `title`    | string | Display title (prose — `.ttl` is uppercased). |
| `hint`     | string (optional) | Short hint rendered next to the title. |

## Usage

```json
{ "type": "widget", "slug": "lie-adjoint-killing", "params": { "widgetId": "w-lie-killing", "title": "The adjoint representation and the Killing form" } },
{ "type": "widget-script", "ref": "w-lie-killing" }
```

Then `node scripts/rebuild.mjs --only widget-params` to AJV-validate, and
`node scripts/rebuild.mjs` for the full byte-identical round-trip gate.
