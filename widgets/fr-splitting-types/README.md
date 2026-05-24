# fr-splitting-types

Bespoke module for **frobenius-and-reciprocity** §3 (Splitting types: completely
split, inert, partially split). Shows the splitting type $(r,f)$ of an
unramified prime and Frobenius as its cycle shape.

See [../README.md](../README.md) for the registry contract (schema + pure
render functions) and the bespoke-vs-shared distinction.

## What it does

Pick the degree $n=[K:\mathbb{Q}]$ and a divisor pair $(r,f)$ with $rf=n$. The
widget shows the factorization $p\mathcal{O}_K=\mathfrak{P}_1\cdots\mathfrak{P}_r$
into $r$ primes each of residue degree $f$, draws **Frobenius as $r$ disjoint
$f$-cycles** (its cycle shape on the $n$ roots, with directional arrows), and
reports that $\bar f(x)$ factors into $r$ distinct irreducibles of degree $f$
over $\mathbb{F}_p$, with $\operatorname{Frob}_p$ of order $f$. The named cases:
**completely split** ($r=n,f=1$, Frobenius = identity, cycle shape
$(1,\dots,1)$), **inert** ($r=1,f=n$, a single $n$-cycle), and **partially
split** ($1<r<n$).

## Params

See [`schema.json`](./schema.json) for the authoritative shape.

| field | type | purpose |
|---|---|---|
| `widgetId` | string | DOM id for the outer `<div class="widget">` wrapper. |
| `title`    | string | Display title (prose — `.ttl` is uppercased). |
| `hint`     | string (optional) | Short hint rendered next to the title. |

## Usage

```json
{ "type": "widget", "slug": "fr-splitting-types", "params": { "widgetId": "w-fr-splitting", "title": "Splitting types: split, inert, partially split" } },
{ "type": "widget-script", "ref": "w-fr-splitting" }
```

Then `node scripts/rebuild.mjs --only widget-params` to AJV-validate, and
`node scripts/rebuild.mjs` for the full byte-identical round-trip gate.
