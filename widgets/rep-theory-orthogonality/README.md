# rep-theory-orthogonality

Bespoke module for **representation-theory** §6 (Characters and orthogonality).
Demonstrates the first orthogonality relation, $\langle\chi_\lambda,\chi_\mu\rangle = \delta_{\lambda\mu}$,
by direct computation on a character table. Distinct from §7's character-table
*explorer* — this widget is about the inner product, not the table.

See [../README.md](../README.md) for the registry contract (schema + pure
render functions) and the bespoke-vs-shared distinction.

## What it does

Pick a finite group ($S_3$ or the cyclic group $C_4$) and two of its irreducible
characters $\chi_\lambda, \chi_\mu$ (by row). The widget shows the character
table (rows = irreducibles, columns = conjugacy classes with sizes $|C|$) and
computes the class-weighted Hermitian inner product
$$\langle\chi_\lambda,\chi_\mu\rangle = \frac{1}{|G|}\sum_{C} |C|\,\chi_\lambda(C)\,\overline{\chi_\mu(C)}$$
term by term, landing on $1$ when $\lambda=\mu$ (orthonormal) and $0$ otherwise
(orthogonal). $C_4$ has genuinely complex characters (powers of $i$), so the
conjugate on the second factor is essential — the widget shows the conjugated
values in the sum.

## Params

See [`schema.json`](./schema.json) for the authoritative shape.

| field | type | purpose |
|---|---|---|
| `widgetId` | string | DOM id for the outer `<div class="widget">` wrapper. |
| `title`    | string | Display title (prose — `.ttl` is uppercased). |
| `hint`     | string (optional) | Short hint rendered next to the title. |

## Usage

```json
{ "type": "widget", "slug": "rep-theory-orthogonality", "params": { "widgetId": "w-rep-orthogonality", "title": "Orthogonality of irreducible characters" } },
{ "type": "widget-script", "ref": "w-rep-orthogonality" }
```

Then `node scripts/rebuild.mjs --only widget-params` to AJV-validate, and
`node scripts/rebuild.mjs` for the full byte-identical round-trip gate.
