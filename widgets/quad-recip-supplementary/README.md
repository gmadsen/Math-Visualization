# quad-recip-supplementary

Bespoke module for **quadratic-reciprocity** §4 (The supplementary laws).
Evaluates the two supplements $(-1/p)$ and $(2/p)$ and exposes their periodic
dependence on $p \bmod 4$ and $p \bmod 8$.

See [../README.md](../README.md) for the registry contract (schema + pure
render functions) and the bespoke-vs-shared distinction.

## What it does

Slide an odd prime $p$. The widget shows two panels:

- **First supplement** $(-1/p) = (-1)^{(p-1)/2}$ — with $p \bmod 4$, the sign,
  and the verdict "$-1$ is a QR mod $p$ iff $p\equiv 1\pmod 4$";
- **Second supplement** $(2/p) = (-1)^{(p^2-1)/8}$ — with $p \bmod 8$, the sign,
  and "$2$ is a QR mod $p$ iff $p\equiv\pm 1\pmod 8$".

Each is cross-checked against a direct scan of the squares mod $p$ (a ✓/✗). Two
strips of primes coloured green/pink by each symbol make the period-4 and
period-8 patterns visible at a glance, with the selected prime outlined.

## Params

See [`schema.json`](./schema.json) for the authoritative shape.

| field | type | purpose |
|---|---|---|
| `widgetId` | string | DOM id for the outer `<div class="widget">` wrapper. |
| `title`    | string | Display title (prose — `.ttl` is uppercased). |
| `hint`     | string (optional) | Short hint rendered next to the title. |

## Usage

```json
{ "type": "widget", "slug": "quad-recip-supplementary", "params": { "widgetId": "w-qr-supp", "title": "The two supplementary laws" } },
{ "type": "widget-script", "ref": "w-qr-supp" }
```

Then `node scripts/rebuild.mjs --only widget-params` to AJV-validate, and
`node scripts/rebuild.mjs` for the full byte-identical round-trip gate.
