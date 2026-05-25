# functor-of-points-groupoid-target

Bespoke widget for `functor-of-points.html` (§7 *Preview: the fix is to target groupoids*,
concept `stacky-obstructions`). It shows **why a moduli functor with automorphisms needs a
groupoid-valued target** — the functor-of-points reason for stacks. Single module, not part of a
shared family.

See [../README.md](../README.md) for the registry contract and the bespoke-vs-shared
distinction.

## What it does

A toggle switches the target of the moduli functor $\mathcal{M}$ of elliptic curves between
$\mathsf{Set}$ and $\mathsf{Grpd}$, evaluated on a field $R$ containing $i$ and a cube root of
unity. Three sample curves are shown: a generic one ($\mathrm{Aut}=\mathbb{Z}/2$), the $j=1728$
curve $y^2=x^3+x$ ($\mathrm{Aut}=\mathbb{Z}/4$), and the $j=0$ curve $y^2=x^3+1$
($\mathrm{Aut}=\mathbb{Z}/6$).

- **Target $\mathsf{Set}$:** $\mathcal{M}(R)$ records only the *set* of isomorphism classes —
  the automorphism loops are greyed out. This functor is **not a sheaf** (a family that is
  locally trivial but globally twisted by an automorphism is invisible to it), so $\mathcal{M}$
  is **not representable**.
- **Target $\mathsf{Grpd}$:** $\mathcal{M}(R)$ is the *groupoid* of curves with their
  isomorphisms — each object is drawn with its automorphism self-loop. Remembering the
  isomorphisms restores descent and makes $\mathcal{M}$ an **algebraic stack**.

The scheme / ordinary functor-of-points story is the special case where every object has trivial
automorphism group (a discrete groupoid), so $\mathsf{Set}$ loses nothing.

## Params

See [`schema.json`](./schema.json). Required: `widgetId`, `title`; optional `hint`. The curve
sample and automorphism data are fixed inside the renderer; the buttons only switch the target.

## Usage

```json
{ "type": "widget",        "slug": "functor-of-points-groupoid-target", "params": { "widgetId": "w-grpdtarget", "title": "If objects have automorphisms, Set is the wrong target — use Grpd", "hint": "toggle the target: Set forgets automorphisms (not a sheaf); Grpd is a stack" } },
{ "type": "widget-script", "ref": "w-grpdtarget" }
```

Then `node scripts/rebuild.mjs --only widget-params` and `node scripts/rebuild.mjs`.
