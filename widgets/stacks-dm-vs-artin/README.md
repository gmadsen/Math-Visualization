# stacks-dm-vs-artin

Bespoke widget for `stacks.html` (§8 *Deligne–Mumford vs. Artin*, concept
`deligne-mumford-vs-artin`). It classifies a gallery of standard stacks by the **dimension of
their automorphism groups** and places each in a nested-ring **Schemes ⊂ Deligne–Mumford ⊂
Artin** diagram. Single module, not part of a shared family.

See [../README.md](../README.md) for the registry contract and the bespoke-vs-shared
distinction.

## What it does

Buttons pick an example; the widget marks it in the nested rings and shows its automorphism
group, that group's dimension, the atlas type, and the diagonal condition:

| example | Aut(point) | dim | class |
|---|---|---|---|
| $\mathbb{A}^1$ | $\{e\}$ | 0 | scheme |
| $B(\mathbb{Z}/2)$ | $\mathbb{Z}/2$ | 0 | Deligne–Mumford |
| $[\mathbb{A}^1/(\mathbb{Z}/2)]$ | $\mathbb{Z}/2$ at $0$, else $\{e\}$ | 0 | Deligne–Mumford |
| $\mathcal{M}_{1,1}$ | finite ($\le 6$ in char 0) | 0 | Deligne–Mumford |
| $B\,\mathbb{G}_m$ | $\mathbb{G}_m$ | 1 | Artin (not DM) |
| $[\mathbb{A}^1/\mathbb{G}_m]$ | $\mathbb{G}_m$ at $0$, else $\{e\}$ | 1 | Artin (not DM) |

The single discriminator the readout drives home: a stack is **Deligne–Mumford** exactly when
its automorphism groups are **finite** (equivalently an **étale** atlas exists, equivalently the
diagonal is **unramified**); a genuinely **Artin** stack allows **positive-dimensional**
stabilizers and only a **smooth** atlas. Schemes are the further special case where every point
has trivial automorphisms.

## Params

See [`schema.json`](./schema.json) for the authoritative shape. Required: `widgetId`, `title`;
optional `hint`. The example gallery is fixed inside the renderer; the buttons only select which
one is highlighted.

## Usage

Add a `widget` block plus its `widget-script` block to `content/stacks.json`:

```json
{ "type": "widget",        "slug": "stacks-dm-vs-artin", "params": { "widgetId": "w-dmartin", "title": "Deligne–Mumford vs. Artin: it's the dimension of the automorphism groups", "hint": "pick a stack; finite Aut → DM (étale atlas), positive-dimensional → Artin only" } },
{ "type": "widget-script", "ref": "w-dmartin" }
```

Then `node scripts/rebuild.mjs --only widget-params` (AJV) and `node scripts/rebuild.mjs` (full
round-trip gate).
