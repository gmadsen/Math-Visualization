# continuity-band-2d

Self-contained **"slide-band"** engine for the $\varepsilon$–$\delta$ definition
of continuity **and** for uniform continuity — the corpus's `slide-band` gesture.
For a chosen function and tolerance $\varepsilon$, the reader **drags the point
$a$** along the domain; the engine draws the horizontal $\varepsilon$-band
$[f(a)-\varepsilon, f(a)+\varepsilon]$ and the largest symmetric $\delta(a)$ whose
interval $f$ maps into the band. Sliding $a$ shows $\delta(a)$ change — collapsing
toward $0$ for $1/x$ near the origin (**not** uniformly continuous), staying
healthy for a bounded-slope $f$. First home: `real-analysis §real-continuity`.

A direct-manipulation companion to the section's fixed-point clickable
$\varepsilon$–$\delta$ widget: it makes the **point** $a$ variable, so the
quantifier swap *(∀a ∃δ)* vs *(∃δ ∀a)* — i.e. uniform continuity — becomes a
thing you slide.

## The gesture

- **Drag the point $a$** across the domain; the cyan $\delta$-interval and green
  $\varepsilon$-band update, with the dashed box where they meet (the curve fits
  inside it). The **ε ±** buttons change the tolerance. The readout tracks the
  **smallest $\delta$ you've needed** — a positive floor means uniformly
  continuous; a collapse to $0$ means not.

## Division of labor

- **Engine (this renderer):** owns the plot, the draggable $a$, the band +
  $\delta$-interval + meeting box, the $\varepsilon$ control, the running
  min-$\delta$, and the readout. jsdom-safe.
- **Author (`params.cases`):** a dropdown of functions, each a `label`, a JS
  `expr` for $f(x)$, the domain `[x0, x1]`, the window `[y0, y1]`, and optional
  `aInit` / `eps` / `note`.

## Params

| param | required | default | meaning |
|---|---|---|---|
| `widgetId` / `svgId` / `outputId` / `selectId` / `title` | ✓ | — | DOM ids + title |
| `cases` | ✓ | — | functions: `{label, expr, x0, x1, y0, y1, aInit?, eps?, note?}` |
| `hint` / `svgTitle` | | — / `title` | hint / accessible SVG title |
| `viewBox` / `svgWidth` / `svgHeight` | | `0 0 600 420` / 600 / 420 | SVG geometry |
| `resetLabel` | | `↺ Reset` | Reset label |

## Usage

```json
{ "type": "widget", "slug": "continuity-band-2d", "params": {
  "widgetId": "w-cb", "svgId": "cb-svg", "outputId": "cb-out", "selectId": "cb-sel",
  "title": "…",
  "cases": [
    { "label": "x² on [−2,2]", "expr": "x*x", "x0": -2, "x1": 2, "y0": -0.3, "y1": 4.3, "aInit": 1, "eps": 0.6 },
    { "label": "1/x on (0,2]", "expr": "1/x", "x0": 0.12, "x1": 2, "y0": 0, "y1": 8.5, "aInit": 1, "eps": 0.6,
      "note": "not uniformly continuous: drag a toward 0 and δ collapses" }
  ]
} },
{ "type": "widget-script", "ref": "w-cb" }
```

Then `node scripts/rebuild.mjs --only widget-params` (AJV) and
`node scripts/rebuild.mjs` (byte-identical round-trip).

## Authoring notes

- `expr` is plain JS in `x` (Math.* available). The engine samples $f$ to find
  the band-exit distance on each side of $a$; keep $f$ continuous on the domain.
- The point $a$ is clamped a hair inside the domain so $\delta$ reflects the
  function's modulus, not a domain-edge artifact.
- Good trio: $x^2$ (bounded slope, $\delta$ smallest at the steep ends but never
  $0$), $1/x$ ($\delta\to0$ near the origin — not uniformly continuous), $\sqrt
  x$ (vertical tangent at $0$ yet $\delta$ stays healthy — uniformly continuous).
- Colour tokens only (`var(--green)` ε-band, `var(--cyan)` δ-interval,
  `var(--yellow)` meeting box / min-δ, `var(--pink)` curve), never hex.
