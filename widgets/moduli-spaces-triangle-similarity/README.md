# moduli-spaces-triangle-similarity

Bespoke widget for `moduli-spaces.html` (§1 *What is a moduli problem?*, concept
`moduli-problem`). It introduces the **moduli idea** on a warm-up with no algebraic geometry:
**labeled triangles up to orientation-preserving similarity**. Single module, not part of a
shared family.

See [../README.md](../README.md) for the registry contract and the bespoke-vs-shared
distinction.

## What it does

A triangle with ordered vertices $A,B,C$, taken up to translation, rotation, and scaling, is
completely described by the **shape parameter**

$$ \tau = \frac{C-A}{B-A}\in\mathbb{C}\setminus\mathbb{R} $$

(normalizing $A=0,B=1$ makes $\tau=C$). Sliders set the shape ($\operatorname{Re}\tau$,
$\operatorname{Im}\tau>0$) and a separate **rotation $\theta$** applies a similarity to the drawn
triangle.

- **Left panel:** the triangle, rotated by $\theta$ then scaled/centered to fit.
- **Right panel:** the **moduli space** $\mathbb{C}\setminus\mathbb{R}$ with $\tau$ plotted.

The demonstration: moving $\theta$ changes the **picture** but not $\tau$ (similar triangles share
one moduli point), while moving the shape sliders moves the moduli point. This is a **fine** moduli
space (labeled oriented triangles have no automorphisms), in bijection with $\mathbb{C}\setminus
\mathbb{R}$ — exactly paralleling the $j$-invariant bijection $\{\text{elliptic curves}\}/\cong\;
\xrightarrow{\sim}\mathbb{C}$. A family of triangles over a base ↦ a **path** in the moduli space.
The equilateral triangle is the special point $\tau=e^{i\pi/3}=(0.5,\,0.866)$.

## Params

See [`schema.json`](./schema.json). Required: `widgetId`, `title`; optional `hint`. The geometry
is fixed inside the renderer; the sliders set the shape and the display rotation.

## Usage

```json
{ "type": "widget",        "slug": "moduli-spaces-triangle-similarity", "params": { "widgetId": "w-trimoduli", "title": "A warm-up moduli space: triangles up to similarity ↔ a shape parameter τ", "hint": "shape sliders move the moduli point; rotation changes the picture, not τ" } },
{ "type": "widget-script", "ref": "w-trimoduli" }
```

Then `node scripts/rebuild.mjs --only widget-params` and `node scripts/rebuild.mjs`.
