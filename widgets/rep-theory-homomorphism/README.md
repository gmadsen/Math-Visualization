# rep-theory-homomorphism

Bespoke module for **representation-theory** §1 (What is a representation?).
Makes the defining property of a representation — that it is a group
*homomorphism* $\rho: G \to \mathrm{GL}(V)$ — concrete and checkable.

See [../README.md](../README.md) for the registry contract (schema + pure
render functions) and the bespoke-vs-shared distinction.

## What it does

Working with $S_3$ and three of its representations — trivial, sign, and the
3-dimensional permutation representation on $\mathbb{C}^3$ — pick two group
elements $g, h$ (in cycle notation). The widget draws the matrices $\rho(g)$,
$\rho(h)$, their product $\rho(g)\rho(h)$, and $\rho(gh)$ (with $gh$ computed by
permutation composition), confirming the homomorphism identity
$\rho(gh) = \rho(g)\rho(h)$. The character $\chi(g) = \operatorname{tr}\rho(g)$ is
read off each diagonal, along with the degree and the kernel (so the trivial and
sign reps are visibly unfaithful, the permutation rep faithful). The permutation
representation uses clean $0/1$ matrices, so the matrix arithmetic is transparent.

## Params

See [`schema.json`](./schema.json) for the authoritative shape.

| field | type | purpose |
|---|---|---|
| `widgetId` | string | DOM id for the outer `<div class="widget">` wrapper. |
| `title`    | string | Display title (prose — `.ttl` is uppercased, which turns a bare Greek `ρ` into a `Ρ`/`P` lookalike, so keep symbols out of it). |
| `hint`     | string (optional) | Short hint rendered next to the title. |

## Usage

```json
{ "type": "widget", "slug": "rep-theory-homomorphism", "params": { "widgetId": "w-rep-homomorphism", "title": "A representation is a homomorphism G → GL(V)" } },
{ "type": "widget-script", "ref": "w-rep-homomorphism" }
```

Then `node scripts/rebuild.mjs --only widget-params` to AJV-validate, and
`node scripts/rebuild.mjs` for the full byte-identical round-trip gate.
