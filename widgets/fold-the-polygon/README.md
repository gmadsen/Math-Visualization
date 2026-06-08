# fold-the-polygon

Bespoke **"fold-glue"** widget for the **classification of compact surfaces** by
polygon edge identifications. First home: `riemann-surfaces §rh` ("Genus as the
universal invariant"), as the combinatorial counterpart to the Riemann–Hurwitz
route to genus. Self-contained (the surface-classification math is specific).

## What it does

A $2n$-gon is drawn with directed, labelled edges spelling a **gluing word** —
each letter appears exactly twice, and the arrow gives its orientation. The
widget *glues* the polygon and reports the resulting surface:

- **union-find over the $2n$ corners** identifies them per the edge gluings →
  the number of vertex classes $V$ (shown as the corner labels);
- $E$ = number of distinct letters, $F = 1$;
- $\chi = V - E + F$, **orientable** iff every letter appears once forward and
  once backward, and the **genus** from $\chi = 2 - 2g$ (orientable) or
  $\chi = 2 - k$ (non-orientable, $= k\cdot\mathbb{RP}^2$).

**Click an edge to flip its arrow** and watch the surface reclassify live — e.g.
flipping the third edge of the torus word $a\,b\,a^{-1}b^{-1}$ makes the pairing
$a\dots a$ (same direction) instead of $a\dots a^{-1}$, turning the torus into a
Klein bottle. Preset buttons load standard words.

Verified (Node): sphere $aa^{-1}$ ($\chi=2$), $\mathbb{RP}^2$ $aa$ ($\chi=1$),
torus $aba^{-1}b^{-1}$ ($\chi=0,g=1$), Klein $abab^{-1}$ ($\chi=0,k=2$), genus-2
$aba^{-1}b^{-1}cdc^{-1}d^{-1}$ ($\chi=-2,g=2$).

## Params

See [`schema.json`](./schema.json) for the authoritative shape.

| field | type | purpose |
|---|---|---|
| `widgetId` / `svgId` / `outputId` / `title` | string | required — DOM ids + title |
| `presets` | `[{label, word}]` | required — gluing-word buttons; `word` is space-separated edge labels, trailing `'` = inverse (e.g. `"a b a' b'"`) |
| `hint` / `svgTitle` | string | optional |
| `viewBox` / `svgWidth` / `svgHeight` | — | SVG geometry (default `0 0 420 360`) |
| `initial` | integer | index of the preset shown on load (default 0) |

## Usage

```json
{ "type": "widget", "slug": "fold-the-polygon", "params": {
  "widgetId": "w-fold", "svgId": "fold-svg", "outputId": "fold-out",
  "title": "Fold the polygon",
  "presets": [
    { "label": "torus", "word": "a b a' b'" },
    { "label": "Klein", "word": "a b a b'" }
  ]
} },
{ "type": "widget-script", "ref": "w-fold" }
```

Then `node scripts/rebuild.mjs --only widget-params` (AJV) and
`node scripts/rebuild.mjs` (full byte-identical round-trip).

## Authoring notes

- jsdom-safe: click-driven, no `getScreenCTM`/rAF. Edges are clicked via a wide
  transparent hit-line carrying `data-k`; the visible stroke/arrow/labels set
  `pointer-events:none` so only the hit-line receives the click.
- Colour tokens only: edges cycle `var(--cyan/pink/green/violet/yellow/blue)` by
  letter (the two copies of a letter share a colour, so you can see which edges
  glue); corner dots cycle the same palette by vertex class.
- The word in a preset must use each letter exactly twice, or the readout shows
  "(each letter must appear twice)" rather than a surface.
