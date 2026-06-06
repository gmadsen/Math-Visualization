# bifurcation-1d

Self-contained **"turn the bifurcation dial"** engine — the corpus's `dial`
gesture. The reader picks a one-parameter normal form $\dot x = f(x;\mu)$ from a
dropdown and **drags a vertical $\mu$-line** across the bifurcation diagram. The
engine root-finds the fixed points of $f(x;\mu)=0$ at every $\mu$ (sign-change
bracketing + bisection), classifies each as **stable** ($\partial f/\partial x <
0$) or **unstable** ($\partial f/\partial x > 0$), and shows two linked panels:

- **top** — the bifurcation diagram $x^\*$ vs $\mu$, stable branches green,
  unstable branches pink, with the draggable yellow $\mu$-line;
- **bottom** — the live **phase line** at the current $\mu$: fixed points as
  filled (stable) / hollow (unstable) dots, with cyan flow arrows showing the
  sign of $f$ in each interval.

The readout names the fixed points and their stability and flags the
bifurcation as $\mu$ crosses the critical value. First home:
`dynamical-systems §bifurcation` (the saddle-node / transcritical / pitchfork
normal-forms table).

## The gesture

- **Drag the yellow $\mu$-line** left/right anywhere in the top panel — the
  phase line below morphs as fixed points are born, collide, exchange stability,
  or split. **Pick a different normal form** from the dropdown to reset $\mu$.

## Division of labor

- **Engine (this renderer):** owns root-finding, the stability test, the
  diagram, the phase line + flow arrows, the drag-the-$\mu$-line gesture, the
  dropdown wiring, and the readout. jsdom-safe (`createSVGPoint`/`getScreenCTM`
  only inside the pointer handlers).
- **Author (`params.cases`):** a list of normal forms, each a `label`, a JS
  `expr` for $f(x;\mu)$ in terms of `x` and `mu`, the $\mu$-window
  `[mu0, mu1]`, and optional `muInit` / `muCrit`.

## Params

| param | required | default | meaning |
|---|---|---|---|
| `widgetId` / `svgId` / `outputId` / `selectId` / `title` | ✓ | — | DOM ids + title |
| `cases` | ✓ | — | normal forms: `{label, expr, mu0, mu1, muInit?, muCrit?}` |
| `hint` / `svgTitle` | | — / `title` | hint / accessible SVG title |
| `viewBox` / `svgWidth` / `svgHeight` | | `0 0 600 460` / 600 / 460 | SVG geometry |
| `xmin` / `xmax` | | -2.2 / 2.2 | state ($x$) window, scanned for roots |
| `muVar` | | `μ` | parameter symbol in the readout/axis |

## Usage

```json
{ "type": "widget", "slug": "bifurcation-1d", "params": {
  "widgetId": "w-bd", "svgId": "bd-svg", "outputId": "bd-out", "selectId": "bd-sel",
  "title": "…",
  "cases": [
    { "label": "saddle-node:  x' = mu - x^2", "expr": "mu - x*x",     "mu0": -1.5, "mu1": 1.5, "muCrit": 0 },
    { "label": "transcritical:  x' = mu x - x^2", "expr": "mu*x - x*x", "mu0": -1.5, "mu1": 1.5, "muCrit": 0 },
    { "label": "pitchfork:  x' = mu x - x^3", "expr": "mu*x - x*x*x",  "mu0": -1.5, "mu1": 1.5, "muCrit": 0 }
  ]
} },
{ "type": "widget-script", "ref": "w-bd" }
```

Then `node scripts/rebuild.mjs --only widget-params` (AJV) and
`node scripts/rebuild.mjs` (byte-identical round-trip).

## Authoring notes

- `expr` is plain JS evaluated with `x` and `mu` in scope (`Math.*` available) —
  use it for any 1-D field, not just polynomials.
- `label` is rendered in a native `<option>`, so keep it **plain text** (no
  LaTeX `$…$` — native dropdowns draw `<option>` as plain text).
- Set `muCrit` to get the "at the bifurcation" flag; omit it for fields with no
  single critical value.
- Colour tokens only (`var(--green)` stable, `var(--pink)` unstable,
  `var(--yellow)` dial, `var(--cyan)` flow arrows), never hex.
