# pp-cross-ratio

Bespoke module for **projective-plane** §8 (The cross-ratio). Demonstrates the
cross-ratio as the fundamental $\mathrm{PGL}_2$ invariant of four collinear
points.

See [../README.md](../README.md) for the registry contract (schema + pure
render functions) and the bespoke-vs-shared distinction.

## What it does

Sliders set the positions $a,b,c,d$ of four points $A,B,C,D$ on a projective
line (default $0,1,2,3\Rightarrow\lambda=\tfrac43$, the section's worked
example). The cross-ratio is

$$[A,B;C,D]=\frac{(a-c)(b-d)}{(a-d)(b-c)}.$$

A one-parameter Möbius slider applies $t\mapsto(t+s)/(\gamma t+1)$ (with
$\gamma=0.1s$, so $s=0$ is the identity) to all four points and draws their
images on a second line — the cross-ratio is **unchanged**, the invariance that
makes two quadruples projectively equivalent iff their cross-ratios agree. The
panel lists $\lambda$, the six-value permutation orbit
$\{\lambda,1-\lambda,1/\lambda,1/(1-\lambda),\lambda/(\lambda-1),(\lambda-1)/\lambda\}$,
the $S_4$-invariant $j(\lambda)=256(\lambda^2-\lambda+1)^3/(\lambda^2(\lambda-1)^2)$,
and flags the harmonic configuration $\lambda=-1$.

## Params

See [`schema.json`](./schema.json) for the authoritative shape.

| field | type | purpose |
|---|---|---|
| `widgetId` | string | DOM id for the outer `<div class="widget">` wrapper. |
| `title`    | string | Display title (prose — `.ttl` is uppercased). |
| `hint`     | string (optional) | Short hint rendered next to the title. |

## Usage

```json
{ "type": "widget", "slug": "pp-cross-ratio", "params": { "widgetId": "w-pp-crossratio", "title": "The cross-ratio is a projective invariant" } },
{ "type": "widget-script", "ref": "w-pp-crossratio" }
```

Then `node scripts/rebuild.mjs --only widget-params` to AJV-validate, and
`node scripts/rebuild.mjs` for the full byte-identical round-trip gate.
