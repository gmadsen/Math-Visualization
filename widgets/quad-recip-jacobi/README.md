# quad-recip-jacobi

Bespoke module for **quadratic-reciprocity** §8 (The Jacobi symbol). Computes the
Jacobi symbol by factoring the denominator, and drives home the caveat that it
does **not** detect quadratic residues.

See [../README.md](../README.md) for the registry contract (schema + pure
render functions) and the bespoke-vs-shared distinction.

## What it does

Pick a numerator $a$ (slider) and an odd composite $n$ (buttons: 9, 15, 21, 25,
35, 45). The widget factors $n = \prod p_i^{e_i}$, evaluates each Legendre factor
$(a/p_i)$ by Euler's criterion, and multiplies to the Jacobi symbol
$(a/n) = \prod (a/p_i)^{e_i}$ (or $0$ when $\gcd(a,n)>1$). It then scans the
residues mod $n$ to report whether $a$ is **actually** a square mod $n$.

The headline is the **caveat**: $(a/n)=+1$ does not imply $a$ is a QR mod $n$.
The default $a=2,\ n=15$ shows $(2/15)=(2/3)(2/5)=(-1)(-1)=+1$ while $2$ is a
nonsquare mod $15$ — the Jacobi symbol only tracks the parity of the prime
factors at which $a$ is a nonsquare. What survives from Legendre is the
reciprocity identity, not the squareness interpretation.

## Params

See [`schema.json`](./schema.json) for the authoritative shape.

| field | type | purpose |
|---|---|---|
| `widgetId` | string | DOM id for the outer `<div class="widget">` wrapper. |
| `title`    | string | Display title (prose — `.ttl` is uppercased). |
| `hint`     | string (optional) | Short hint rendered next to the title. |

## Usage

```json
{ "type": "widget", "slug": "quad-recip-jacobi", "params": { "widgetId": "w-qr-jacobi", "title": "The Jacobi symbol" } },
{ "type": "widget-script", "ref": "w-qr-jacobi" }
```

Then `node scripts/rebuild.mjs --only widget-params` to AJV-validate, and
`node scripts/rebuild.mjs` for the full byte-identical round-trip gate.
