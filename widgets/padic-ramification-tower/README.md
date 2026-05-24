# padic-ramification-tower

Bespoke module for **p-adic-numbers** §9 (Extensions of $\mathbb{Q}_p$ and
ramification). Visualises the canonical unramified-then-totally-ramified tower
and the tame/wild dichotomy.

See [../README.md](../README.md) for the registry contract (schema + pure
render functions) and the bespoke-vs-shared distinction.

## What it does

Pick the prime $p$ and the two invariants — ramification index $e$ and residue
degree $f$ — with steppers. The widget draws the tower
$\mathbb{Q}_p\subseteq L^{ur}\subseteq L$: the maximal unramified subextension
$L^{ur}$ has degree $f$ and residue field $\mathbb{F}_{p^f}$, and $L/L^{ur}$ is
totally ramified of degree $e$ (Eisenstein uniformizer $\pi$ with
$\pi^e\sim p$). It reports the fundamental identity $ef=[L:\mathbb{Q}_p]$, the
residue field, and classifies the extension as **tamely ramified**
($\gcd(e,p)=1$) or **wildly ramified** ($p\mid e$). Presets: an unramified
extension, a tame totally-ramified extension, and the wild $\mathbb{Q}_2(i)$.

## Params

See [`schema.json`](./schema.json) for the authoritative shape.

| field | type | purpose |
|---|---|---|
| `widgetId` | string | DOM id for the outer `<div class="widget">` wrapper. |
| `title`    | string | Display title (prose — `.ttl` is uppercased). |
| `hint`     | string (optional) | Short hint rendered next to the title. |

## Usage

```json
{ "type": "widget", "slug": "padic-ramification-tower", "params": { "widgetId": "w-padic-ram", "title": "Ramification of extensions of $\\mathbb{Q}_p$" } },
{ "type": "widget-script", "ref": "w-padic-ram" }
```

Then `node scripts/rebuild.mjs --only widget-params` to AJV-validate, and
`node scripts/rebuild.mjs` for the full byte-identical round-trip gate.
