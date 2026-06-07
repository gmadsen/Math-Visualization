# sampling-box

Self-contained **"shake-the-box"** engine — the corpus's `shake-sample` gesture.
The reader presses **Draw** to pull i.i.d. samples from an author-supplied
source; they pile into a running **histogram** that fills toward the true
density (pink overlay), while the running **sample mean** $\bar X_N$ (yellow)
visibly converges to the true mean $\mu$. It makes tangible the idea the
Probability section names everywhere but never shows: *a random mechanism,
repeated, produces a stable shape*. First home:
`probability-theory §lln` (the law of large numbers, with a bimodal source so
$\mu$ sits in the valley between the humps — where almost no single sample
lands).

This is the **emergence-from-repetition** half of the picture; it is distinct
from `bayes-mass-updater`, which reshapes a *belief* under evidence in closed
form rather than accumulating random draws.

## The gesture

- **Press a Draw button** (`+1`, `+100`, …) to pull that many samples — the
  histogram grows, the sample-mean marker settles. **Reset** empties the box.

## Division of labor

- **Engine (this renderer):** owns the binning, the histogram + density-overlay
  rendering, the running-mean marker + $\mu$ guideline, the Draw/Reset controls,
  and the readout. jsdom-safe (Math.random runs only inside the Draw handler).
- **Author (`params.bodyScript`):** must define `function sample(){ return
  oneDraw; }` (one i.i.d. observation; may use `Math.random`, Box–Muller, …). May
  define `function density(x){ return f(x); }` (the limiting pdf overlay).

## Params

| param | required | default | meaning |
|---|---|---|---|
| `widgetId` / `svgId` / `outputId` / `title` | ✓ | — | DOM ids + title |
| `xMin` / `xMax` | ✓ | — | histogram axis range |
| `bodyScript` | ✓ | — | author JS: `sample` (+ optional `density`) |
| `bins` | | 40 | histogram bins |
| `xLabel` | | `x` | axis label |
| `mu` / `muLabel` | | — / `μ` | true mean to mark + compare the sample mean against |
| `drawSizes` | | `[1,100,1000]` | batch sizes (one Draw button each) |
| `hint` / `svgTitle` | | — / `title` | hint / accessible SVG title |
| `viewBox` / `svgWidth` / `svgHeight` | | `0 0 600 360` / 600 / 360 | SVG geometry |
| `resetLabel` | | `↺ Reset` | Reset label |

## Usage

```json
{ "type": "widget", "slug": "sampling-box", "params": {
  "widgetId": "w-box", "svgId": "box-svg", "outputId": "box-out",
  "title": "…", "xMin": -3, "xMax": 3, "bins": 40, "mu": 0, "xLabel": "x",
  "drawSizes": [1, 25, 500],
  "bodyScript": "function g(){ var u1=Math.random(),u2=Math.random(); return Math.sqrt(-2*Math.log(u1+1e-12))*Math.cos(2*Math.PI*u2); } function sample(){ return (Math.random()<0.5?-1.2:1.2)+0.45*g(); } function density(x){ var s=0.45,p=function(z){return Math.exp(-z*z/2)/Math.sqrt(2*Math.PI);}; return 0.5*p((x+1.2)/s)/s+0.5*p((x-1.2)/s)/s; }"
} },
{ "type": "widget-script", "ref": "w-box" }
```

Then `node scripts/rebuild.mjs --only widget-params` (AJV) and
`node scripts/rebuild.mjs` (byte-identical round-trip).

## Authoring notes

- `sample()` may use `Math.random` freely — it is only ever called on a Draw
  click, so the widget stays jsdom-safe (no randomness at init).
- For a **CLT** deployment, make `sample()` return a *standardized mean of $k$*
  i.i.d. draws and set `density` to the standard normal — the histogram piles
  into the bell regardless of the source.
- Colour tokens only (`var(--cyan)` histogram, `var(--pink)` density,
  `var(--yellow)` sample mean), never hex.
- Samples outside `[xMin, xMax]` still count toward the running mean but bin into
  the nearest edge — pick the range to cover the bulk of the mass.
