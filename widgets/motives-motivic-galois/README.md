# motives-motivic-galois

Bespoke widget for `motives.html` (§6 *The motivic Galois group*, concept `motivic-galois-group`).
It realizes the section's prose-prescribed figure: the motivic Galois group as a central hub with
three realization-quotient spokes. Single module, not part of a shared family.

See [../README.md](../README.md) for the registry contract and the bespoke-vs-shared
distinction.

## What it does

$G_{\mathrm{mot}}(k)=\underline{\mathrm{Aut}}^{\otimes}(\omega_B)$ is the Tannakian fundamental
group of the category of numerical motives (Jannsen: $\mathbb{Q}$-linear, abelian, semisimple;
modulo the standard conjectures, Tannakian and pro-reductive), and motives over $k$ **are** the
finite-dimensional $\mathbb{Q}$-representations of $G_{\mathrm{mot}}$.

The widget draws $G_{\mathrm{mot}}$ at a hub with three quotient arrows descending to the classical
groups; buttons (**Overview** + the three) drive a readout:

- **étale** → the absolute Galois group $G_{\mathbb{Q}}$ (Artin motives make $G_{\mathrm{mot}}$
  generalize classical Galois theory);
- **Hodge** → the **Mumford–Tate group** (for an elliptic curve: $\mathrm{GL}_2$ non-CM, a rank-2
  torus for CM);
- **crystalline** → the **Frobenius** $\varphi$ (the same $\varphi$ acting by $p^{-n}$ on the Tate
  twist).

The Tate motives generate a copy of $G_m$ (the weight grading) inside $G_{\mathrm{mot}}$ — the
universal symmetry of which the three classical groups are shadows. (Rendered with plain `G_m`,
`G_Q`, `L` etc., since blackboard $\mathbb{G}$/$\mathbb{L}$ and the $\overline{\mathbb{Q}}$
overline are astral / combining glyphs.)

## Params

See [`schema.json`](./schema.json). Required: `widgetId`, `title`; optional `hint`.

## Usage

```json
{ "type": "widget",        "slug": "motives-motivic-galois", "params": { "widgetId": "w-gmot", "title": "The motivic Galois group: one universal symmetry, three realization-quotients", "hint": "click a spoke — Galois (étale), Mumford–Tate (Hodge), Frobenius (crystalline)" } },
{ "type": "widget-script", "ref": "w-gmot" }
```

Then `node scripts/rebuild.mjs --only widget-params` and `node scripts/rebuild.mjs`.
