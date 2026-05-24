# padic-newton-polygon

Bespoke module for **p-adic-numbers** §8 (Newton polygons). Reads the $p$-adic
valuations of the roots of a polynomial off the slopes of the lower convex hull
of its coefficient valuations.

See [../README.md](../README.md) for the registry contract (schema + pure
render functions) and the bespoke-vs-shared distinction.

## What it does

For $f(x)=a_0+a_1x+\cdots+a_nx^n\in\mathbb{Q}_p[x]$, the reader sets the
valuation $v_p(a_i)$ of each coefficient with per-coefficient cyclers (click to
cycle $0,1,2,3,\infty$; the endpoints $a_0,a_n$ are forced nonzero). The widget
plots the points $(i,v_p(a_i))$, draws their **lower convex hull** (the Newton
polygon), and labels each segment with its slope $-m_j$ and horizontal length
$\ell_j$. By the Newton-polygon theorem, $f$ has exactly $\ell_j$ roots of
$p$-adic valuation $m_j$ in $\overline{\mathbb{Q}_p}$ — the slopes read off the
root valuations without solving $f$. A single segment from $(0,h)$ to $(n,0)$ of
slope $-h/n$ with $\gcd(h,n)=1$ is the Eisenstein irreducibility test. Presets:
$x^3-x-p$ (the section's worked example), an Eisenstein polynomial, and a
two-slope example.

## Params

See [`schema.json`](./schema.json) for the authoritative shape.

| field | type | purpose |
|---|---|---|
| `widgetId` | string | DOM id for the outer `<div class="widget">` wrapper. |
| `title`    | string | Display title (prose — `.ttl` is uppercased). |
| `hint`     | string (optional) | Short hint rendered next to the title. |

## Usage

```json
{ "type": "widget", "slug": "padic-newton-polygon", "params": { "widgetId": "w-padic-newton", "title": "The Newton polygon reads root valuations off its slopes" } },
{ "type": "widget-script", "ref": "w-padic-newton" }
```

Then `node scripts/rebuild.mjs --only widget-params` to AJV-validate, and
`node scripts/rebuild.mjs` for the full byte-identical round-trip gate.
