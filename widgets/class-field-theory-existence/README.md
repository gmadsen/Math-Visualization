# class-field-theory-existence

Bespoke widget for `class-field-theory.html` (§6 *Takagi's existence theorem*, concept
`existence-theorem-cft`). It shows the existence theorem as the **lattice anti-isomorphism**
between abelian extensions and finite-index subgroups, on cyclotomic examples. Single module,
not part of a shared family.

See [../README.md](../README.md) for the registry contract (schema + pure render functions)
and the bespoke-vs-shared distinction.

## What it does

Artin reciprocity gives a surjection from the idèle class group — here the unit group
$(\mathbb{Z}/m)^\times=\operatorname{Gal}(\mathbb{Q}(\zeta_m)/\mathbb{Q})$ — onto each Galois
group; **Takagi's existence theorem** makes the correspondence a *bijection*: finite abelian
$L/K$ correspond to finite-index subgroups $H$, with the lattice of extensions **anti-isomorphic**
to the lattice of subgroups ($L\subseteq L' \Leftrightarrow H\supseteq H'$).

Buttons pick $m\in\{8,12\}$ (where $(\mathbb{Z}/m)^\times$ is the Klein four-group). The widget
draws the subgroup lattice of $(\mathbb{Z}/m)^\times$ beside the subfield lattice of
$\mathbb{Q}(\zeta_m)$, connected by $H\leftrightarrow$ fixed field, with the **order-reversal**
visible: the whole group fixes $\mathbb{Q}$, the trivial subgroup fixes all of
$\mathbb{Q}(\zeta_m)$, and each index-2 subgroup — the kernel of a quadratic Dirichlet character —
fixes one quadratic subfield. Each level shows
$\operatorname{Gal}(L/\mathbb{Q})=(\mathbb{Z}/m)^\times/H$. The readout states the classical and
idelic forms of the existence theorem and notes that reciprocity $+$ existence turns class field
theory into an algorithm.

## Params

See [`schema.json`](./schema.json) for the authoritative shape. Required fields:

| field | type | purpose |
|---|---|---|
| `widgetId` | string | DOM id for the outer `<div class="widget">` wrapper (and the `-svg`/`-out`/`-btns` children). |
| `title`    | string | Display title rendered in the header. |
| `hint`     | string (optional) | Short hint rendered next to the title. |

The two cyclotomic examples (subgroups, subfields, characters) are fixed inside the renderer;
the buttons pick $m$.

## Usage

Add a `widget` block plus its `widget-script` block to `content/class-field-theory.json`:

```json
{ "type": "widget",        "slug": "class-field-theory-existence", "params": { "widgetId": "w-existence", "title": "Takagi existence: abelian extensions ↔ subgroups (anti-iso)", "hint": "pick m; the subgroup lattice of (ℤ/m)ˣ mirrors the subfield lattice of ℚ(ζₘ), reversed" } },
{ "type": "widget-script", "ref": "w-existence" }
```

Then run `node scripts/rebuild.mjs --only widget-params` to AJV-validate the params, and
`node scripts/rebuild.mjs` for the full chain.
