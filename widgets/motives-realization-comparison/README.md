# motives-realization-comparison

Interactive realization-functor explorer, introduced on `motives.html` §1 (the
cohomology zoo) to give the page its first interactive widget. It complements
the section's static factorization diagram (SmProj → Mot(k) → realizations):
the diagram motivates *why* a universal cohomology should exist; this widget
lets the reader poke concrete varieties and watch the punchline — every
realization has the same Betti numbers, only the extra structure differs.

Bespoke semantic module — the Betti vectors and the four theory descriptors
live in `params`, so AJV validates the data and a non-HTML frontend can rebuild
the comparison from the schema alone.

See [../README.md](../README.md) for the registry contract.

## What it does

Pick a smooth projective variety $X/\mathbb{Q}$ (ℙ¹, ℙ², an elliptic curve,
ℙ¹×ℙ¹, a genus-2 curve). The widget shows its **shared Betti numbers** $b_i$ in
a row, then four colour-coded **realization cards** — Betti, algebraic de Rham,
ℓ-adic étale, crystalline. Clicking a card focuses the readout on that theory's
coefficient category and the extra structure it carries (Hodge structure,
Hodge filtration $F^\bullet$, Galois action, Frobenius $\varphi$), plus an
optional per-variety datum (e.g. for $E$, the rank-2 Tate module on the ℓ-adic
card). The recurring message: the dimensions never change — that invariant *is*
the motive.

## Params

See [`schema.json`](./schema.json) for the authoritative shape. Required:

| field | type | purpose |
|---|---|---|
| `widgetId` | string | DOM id; the script derives `${widgetId}-sel/-svg/-out`. |
| `title` | string | Header title. |
| `hint` | string (optional) | Short hint. |
| `varieties` | array | Each: `id`, `label` (plain text), `betti` (array $b_0…b_{2d}$), optional `note`, optional `theoryNotes` (per-theory datum keyed by theory `key`). |
| `theories` | array | The realization functors (constant): `key`, `name`, `coeff`, `structure`, `color` (palette token like `--cyan`). |

## Usage

Add a `widget` block plus a ref-based `widget-script` block to
`content/motives.json`, then `node scripts/rebuild.mjs --only widget-params`
to AJV-validate and `node scripts/rebuild.mjs` for the full round-trip gate.
