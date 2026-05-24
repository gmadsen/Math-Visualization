# galois-normal-separable

Bespoke module for **galois** §7 (Normal and separable extensions). Lets you read
the normal / separable / Galois status of an extension straight off the roots of
a minimal polynomial.

See [../README.md](../README.md) for the registry contract (schema + pure
render functions) and the bespoke-vs-shared distinction.

## What it does

Pick an extension $L/K$. For the field examples the widget plots the roots of a
generating element's minimal polynomial in the complex plane and fills the ones
that lie in $L$. The extension is **normal** iff every root lies in $L$ (the
polynomial splits), **separable** iff the roots are distinct, and **Galois** iff
both — equivalently iff $|\mathrm{Gal}(L/K)| = [L:K]$ (and otherwise
$|\mathrm{Gal}| < [L:K]$). The gallery includes $\mathbb{Q}(\sqrt2)$ (Galois),
$\mathbb{Q}(\sqrt[3]{2})$ (not normal — two roots escape to $\mathbb{C}$), its
splitting field $\mathbb{Q}(\sqrt[3]{2},\omega)$ (Galois, $|\mathrm{Gal}|=6$),
the cyclotomic $\mathbb{Q}(\zeta_5)$, and the inseparable
$\mathbb{F}_p(t)/\mathbb{F}_p(t^p)$ (rendered symbolically: $x^p-t^p=(x-t)^p$, a
single root of multiplicity $p$).

## Params

See [`schema.json`](./schema.json) for the authoritative shape.

| field | type | purpose |
|---|---|---|
| `widgetId` | string | DOM id for the outer `<div class="widget">` wrapper. |
| `title`    | string | Display title (prose — `.ttl` is uppercased). |
| `hint`     | string (optional) | Short hint rendered next to the title. |

## Usage

```json
{ "type": "widget", "slug": "galois-normal-separable", "params": { "widgetId": "w-galois-normsep", "title": "Normal, separable, Galois — read it off the roots" } },
{ "type": "widget-script", "ref": "w-galois-normsep" }
```

Then `node scripts/rebuild.mjs --only widget-params` to AJV-validate, and
`node scripts/rebuild.mjs` for the full byte-identical round-trip gate.
