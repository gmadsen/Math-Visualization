# functor-of-points-base-change

Bespoke widget for `functor-of-points.html` (§9 *Base change as pullback of functors*, concept
`base-change-interpretation`). It makes the pointwise fiber-product identity
$(X\times_S Y)(T)=X(T)\times_{S(T)}Y(T)$ concrete on the family $x^2=t$. Single module, not part
of a shared family.

See [../README.md](../README.md) for the registry contract and the bespoke-vs-shared
distinction.

## What it does

Representable functors preserve limits, so fiber products of schemes are computed **pointwise**:

$$ (X\times_S Y)(T) = X(T)\times_{S(T)} Y(T). $$

The widget takes the family $X=V(x^2-t)$ projecting to $S=\mathbb{A}^1_t$ and forms the **fiber**
over a point $t=a$ by base change along $\operatorname{Spec}k\to\mathbb{A}^1$, $t\mapsto a$, so the
fiber $X_a=X\times_{\mathbb{A}^1}\{a\}$ has $k$-points exactly $\{x\in k:x^2=a\}$.

- Buttons choose the base field $k\in\{\mathbb{F}_5,\mathbb{F}_7,\mathbb{R}\}$; a slider chooses $a$
  (the slider range tracks the field).
- The solutions are drawn on an $x$-axis and the fiber is classified: $a$ a **nonzero square** →
  two reduced points; $a=0$ → a single **non-reduced** point ($x^2=0$); $a$ a **non-square** → the
  empty fiber.

The readout states the pointwise fiber-product identity and explains the fiber as the pullback
of functors of points.

## Params

See [`schema.json`](./schema.json). Required: `widgetId`, `title`; optional `hint`. The family,
the base fields, and the fiber computation are fixed inside the renderer.

## Usage

```json
{ "type": "widget",        "slug": "functor-of-points-base-change", "params": { "widgetId": "w-basechange", "title": "Base change pointwise: the fiber X_a is { x : x² = a }", "hint": "pick a base field and a value a; the fiber is computed pointwise on functors" } },
{ "type": "widget-script", "ref": "w-basechange" }
```

Then `node scripts/rebuild.mjs --only widget-params` and `node scripts/rebuild.mjs`.
