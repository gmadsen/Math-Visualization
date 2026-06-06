# bayes-mass-updater

Self-contained **"pour-and-update"** engine for sequential Bayesian inference
over a 1-D parameter — the corpus's `pour-update` gesture. The posterior density
over a parameter $\theta$ is drawn as a bar chart; the reader **(1) sculpts the
prior** by dragging across the bars and **(2) feeds data one datum at a time**
via author-defined action buttons. Each datum multiplies the posterior by the
author's `like(key, theta)` and renormalizes, so probability mass visibly
**pours** toward the $\theta$ consistent with the evidence. First home:
`probability-theory §bayes` (a coin's bias under sequential Heads/Tails).

Use it anywhere belief is updated by evidence: conjugate priors (Beta–Binomial,
Gamma–Poisson), graphical-model inference, Kalman / POMDP belief updates,
observe-vs-intervene in causal inference.

## The gesture

- **Drag across the chart** to sculpt the prior (each bar follows the pointer
  height). **Click a data button** to feed one observation — the posterior
  re-masses. **Clear data** returns the posterior to your prior; **Reset prior**
  restores the default prior.

## Division of labor

- **Engine (this renderer):** owns the bar chart, the drag-to-sculpt-prior
  gesture, the per-datum Bayesian update + renormalization, the faint prior
  outline, the posterior-mean marker, the mean/MAP/tally readout, and the two
  resets. jsdom-safe.
- **Author (`params.bodyScript`):** must define `function like(key, theta){
  return P(datum=key | theta); }`. May define `function prior0(theta){ return
  density; }` (initial prior, defaults to uniform) and `function summary(s){
  return 'html'; }` where `s = { mean, map, n, counts }` (e.g. to print the
  conjugate posterior).

## Params

| param | required | default | meaning |
|---|---|---|---|
| `widgetId` / `svgId` / `outputId` / `title` | ✓ | — | DOM ids + title |
| `actions` | ✓ | — | data buttons: `[{label, key, color?}]` |
| `bodyScript` | ✓ | — | author JS: `like` (+ optional `prior0`/`summary`) |
| `paramLabel` | | `θ` | parameter axis label |
| `x0` / `x1` | | 0 / 1 | parameter range |
| `bars` | | 30 | number of discretization bars |
| `hint` / `svgTitle` | | — / `title` | hint / accessible SVG title |
| `viewBox` / `svgWidth` / `svgHeight` | | `0 0 600 360` / 600 / 360 | SVG geometry |
| `resetLabel` / `resetPriorLabel` | | `↺ Clear data` / `Reset prior` | control labels |

## Usage

```json
{ "type": "widget", "slug": "bayes-mass-updater", "params": {
  "widgetId": "w-bm2", "svgId": "bm2-svg", "outputId": "bm2-out",
  "title": "…", "paramLabel": "θ (coin bias)",
  "actions": [
    { "label": "observe Heads", "key": "H", "color": "var(--pink)" },
    { "label": "observe Tails", "key": "T", "color": "var(--violet)" }
  ],
  "bodyScript": "function like(key,theta){ return key==='H'?theta:1-theta; } function summary(s){ var H=s.counts.H||0,T=s.counts.T||0; return 'flat-prior posterior \\u2261 Beta('+(1+H)+', '+(1+T)+')'; }"
} },
{ "type": "widget-script", "ref": "w-bm2" }
```

Then `node scripts/rebuild.mjs --only widget-params` (AJV) and
`node scripts/rebuild.mjs` (byte-identical round-trip).

## Authoring notes

- `like` need not be normalized in $\theta$ — only relative values matter (the
  engine renormalizes after each datum).
- The conjugate `summary` (Beta(1+H,1+T)) holds for the *default uniform* prior;
  once the reader sculpts a custom prior the bars diverge from it — which is
  itself instructive. Word the summary accordingly ("flat-prior posterior").
- Colour tokens only (`var(--cyan)` posterior, `var(--mute)` prior outline,
  `var(--yellow)` mean), never hex.
- Discrete-bar conjugacy is exact and event-driven (cheap); a continuous
  flow-arrow / mass-transport layer is a possible future enhancement.
