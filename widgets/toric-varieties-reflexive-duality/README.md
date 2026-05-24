# toric-varieties-reflexive-duality

Bespoke widget for `toric-varieties.html` (§6 *Mirror symmetry preview*, concept `tv-mirror`).
It makes **reflexive polytopes** and **Batyrev polar duality** tangible in dimension 2, where
everything is drawable on the integer lattice. Single module, not part of a shared family.

See [../README.md](../README.md) for the registry contract (schema + pure render functions)
and the bespoke-vs-shared distinction.

## What it does

Buttons select a 2-D lattice polygon $\Delta\subset M_\mathbb{R}$ from a small gallery — the
reflexive $\mathbb{P}^2$ triangle, the $\mathbb{P}^1\times\mathbb{P}^1$ diamond, the square,
the $dP_3$ hexagon, and a deliberately **non-reflexive** contrast. The widget draws $\Delta$
on the left lattice and its **polar dual**

$$\Delta^\circ = \{\, v\in N_\mathbb{R} : \langle v,m\rangle \ge -1 \ \text{for all } m\in\Delta\,\}$$

on the right, computing $\Delta^\circ$ as the polygon whose vertices solve $\langle v,m_i\rangle
= \langle v,m_{i+1}\rangle = -1$ for consecutive vertices $m_i$ of $\Delta$. It then checks the
**reflexivity criterion live**: $0$ is the unique interior lattice point of $\Delta$ *and*
$\Delta^\circ$ is again a lattice polygon. Interior lattice points are dotted, and any
non-integer dual vertex is flagged in the non-reflexive case. The readout reports the
vertex/lattice-point counts, the involution $\Delta^{\circ\circ}=\Delta$, and ties the picture
to Batyrev's mirror construction (a reflexive $\Delta$ of dimension $n$ yields a mirror
Calabi–Yau pair with swapped Hodge numbers; there are 16 reflexive polygons in 2-D, 4319 in
3-D, and 473,800,776 in 4-D — the Kreuzer–Skarke list).

## Params

See [`schema.json`](./schema.json) for the authoritative shape. Required fields:

| field | type | purpose |
|---|---|---|
| `widgetId` | string | DOM id for the outer `<div class="widget">` wrapper (and the `-svg`/`-out`/`-btns` children). |
| `title`    | string | Display title rendered in the header. |
| `hint`     | string (optional) | Short hint rendered next to the title. |

The polygon gallery, the dual computation, and the lattice window are fixed inside the
renderer; the buttons only pick which polygon is shown.

## Usage

Add a `widget` block plus its `widget-script` block to `content/toric-varieties.json`:

```json
{ "type": "widget",        "slug": "toric-varieties-reflexive-duality", "params": { "widgetId": "w-tv-reflexive", "title": "Reflexive polygons and polar duality", "hint": "pick a polygon; compare it with its polar dual and check reflexivity" } },
{ "type": "widget-script", "ref": "w-tv-reflexive" }
```

Then run `node scripts/rebuild.mjs --only widget-params` to AJV-validate the params, and
`node scripts/rebuild.mjs` for the full chain (including the byte-identical round-trip gate).
