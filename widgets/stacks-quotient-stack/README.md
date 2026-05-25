# stacks-quotient-stack

Bespoke widget for `stacks.html` (§6 *Quotient stacks $[X/G]$*, concept `quotient-stack`). It
makes $[X/G]$ concrete through its **action groupoid** $(G\times X\rightrightarrows X)$ on a
gallery of finite group actions. Single module, not part of a shared family.

See [../README.md](../README.md) for the registry contract and the bespoke-vs-shared
distinction.

## What it does

Buttons pick a finite action of $G$ on a finite set $X$:

| action | orbits → points of $[X/G]$ | groupoid cardinality $\sum_{\text{orbits}} 1/|\mathrm{Stab}|$ |
|---|---|---|
| $[\mathrm{pt}/(\mathbb{Z}/2)]=B(\mathbb{Z}/2)$ | one stacky point, $\mathrm{Aut}=\mathbb{Z}/2$ | $1/2$ |
| $\mathbb{Z}/2$ swap $\{a,b\}$ (free) | one honest point (a scheme) | $1$ |
| $\mathbb{Z}/2$ reflect $\{-1,0,1\}$ | $\{-1,1\}$ honest $+$ $\{0\}$ stacky $(\mathbb{Z}/2)$ | $3/2$ |
| $\mathbb{Z}/3$ rotate $\{0,1,2\}$ (free) | one honest point (a scheme) | $1$ |
| $\mathbb{Z}/3$ rotate $+$ fix $\{0,1,2,F\}$ | $\{0,1,2\}$ honest $+$ $\{F\}$ stacky $(\mathbb{Z}/3)$ | $4/3$ |

For each it draws the objects of $X$ grouped into $G$-orbits with a stabilizer self-loop badge,
then the points of $[X/G]$ below (stacky points double-ringed with their $\mathrm{Aut}$ group),
and reads off the three structural facts:

- **points** of $[X/G]$ are the $G$-**orbits** (the coarse space is $X/G$);
- the **automorphism group** of a point is the **stabilizer** of any representative;
- the **groupoid cardinality** $\sum_{\text{orbits}} 1/|\mathrm{Stab}| = |X|/|G|$ (orbit–stabilizer).

Special cases are flagged live: $X=\mathrm{pt}\Rightarrow BG$; a **free** action $\Rightarrow$
the honest scheme quotient $X/G$ (all stabilizers trivial); the trivial group $\Rightarrow
[X/\{e\}]=X$.

## Params

See [`schema.json`](./schema.json) for the authoritative shape. Required: `widgetId`, `title`;
optional `hint`. The action gallery is fixed inside the renderer; the buttons only select which
action is shown.

## Usage

Add a `widget` block plus its `widget-script` block to `content/stacks.json`:

```json
{ "type": "widget",        "slug": "stacks-quotient-stack", "params": { "widgetId": "w-quotstack", "title": "The action groupoid: points of [X/G] are orbits, automorphisms are stabilizers", "hint": "pick a G-action; orbits become points, fixed points become stacky" } },
{ "type": "widget-script", "ref": "w-quotstack" }
```

Then `node scripts/rebuild.mjs --only widget-params` (AJV) and `node scripts/rebuild.mjs` (full
round-trip gate).
