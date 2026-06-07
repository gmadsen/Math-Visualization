# algorithm-stepper

Self-contained **"step-the-algorithm"** engine — the corpus's `step-state`
gesture. Where `button-stepper` shows static prebuilt frames, this drives an
**author transition function over evolving state** and renders the running trace
as a table: press **Step** and one more row appears (the pivot moves, the
remainder shrinks, the convergent forms), with the latest row highlighted and an
invariant readout. **Run** plays to the halt; **Reset** restarts. First home:
`continued-fractions §convergents` (Euclid's algorithm / the continued fraction
of $\pi$, one convergent at a time).

One engine unifies the corpus's per-topic bespoke **table-traceable** steppers:
Euclid / continued fractions, Gaussian elimination, Gram–Schmidt, the simplex
*tableau*, Buchberger, RSK — algorithms whose lesson reads off a row of evolving
quantities. **Limitation:** the trace is a table only. Algorithms whose lesson
is *geometric or graph-structural* — Dijkstra (the graph lighting up), the
simplex *polytope walk* (already shipped as `animated-svg-2d` on
`combinatorial-optimization §lp-simplex`) — want a visual the table can't give;
those need a future optional `frame(state) -> SVG` hook before this engine
subsumes them.

## The gesture

- **Press Step** to apply one transition; the new state appears as a highlighted
  table row. **Run** advances to the halt; **Reset** restarts. The readout shows
  the step count, halt status, and an author invariant.

## Division of labor

- **Engine (this renderer):** owns the Step / Run / Reset controls, the state
  history, the trace-table rendering + latest-row highlight, halt detection, and
  the `maxSteps` cap. Pure DOM/table rendering — jsdom-safe.
- **Author (`params.bodyScript`):** defines `initial()` (start state),
  `step(state)` (next state, or `null` to halt), and `row(state)` (the table
  cells, length === `columns.length`). May define `note(state)` for an invariant
  line in the readout.

## Params

| param | required | default | meaning |
|---|---|---|---|
| `widgetId` / `tableId` / `outputId` / `title` | ✓ | — | DOM ids + title |
| `columns` | ✓ | — | trace-table header labels |
| `bodyScript` | ✓ | — | author JS: `initial`/`step`/`row` (+ optional `note`) |
| `maxSteps` | | 40 | hard cap on steps (halts runaway algorithms) |
| `hint` | | — | hint |
| `stepLabel` / `runLabel` / `resetLabel` | | `Step ▸` / `Run ⏭` / `↺ Reset` | control labels |

## Usage

```json
{ "type": "widget", "slug": "algorithm-stepper", "params": {
  "widgetId": "w-euclid", "tableId": "euclid-table", "outputId": "euclid-out",
  "title": "…", "columns": ["n", "aₙ", "pₙ", "qₙ", "pₙ/qₙ", "|α − pₙ/qₙ|"],
  "maxSteps": 8,
  "bodyScript": "function initial(){ var a=Math.PI, a0=Math.floor(a); return {n:0,x:a,an:a0,p:a0,q:1,p1:1,p2:0,q1:0,q2:1,xn:(a-a0>1e-9?1/(a-a0):null),al:a}; } function step(s){ if(s.xn==null) return null; var x=s.xn,an=Math.floor(x),p=an*s.p+s.p1,q=an*s.q+s.q1,f=x-an; return {n:s.n+1,x:x,an:an,p:p,q:q,p1:s.p,p2:s.p1,q1:s.q,q2:s.q1,xn:(f>1e-9?1/f:null),al:s.al}; } function row(s){ return [s.n,s.an,s.p,s.q,(s.p/s.q).toFixed(8),Math.abs(s.al-s.p/s.q).toExponential(2)]; }"
} },
{ "type": "widget-script", "ref": "w-euclid" }
```

Then `node scripts/rebuild.mjs --only widget-params` (AJV) and
`node scripts/rebuild.mjs` (byte-identical round-trip).

## Authoring notes

- `step` MUST eventually return `null` (or rely on `maxSteps`) — an algorithm
  that never halts is capped at `maxSteps` rows.
- `columns` headers are rendered as plain table `<th>` (not KaTeX) — use
  Unicode (`aₙ`, `pₙ/qₙ`) rather than `$…$`.
- `row` cells may be HTML strings (e.g. colour a pivot `<b style="color:var(--pink)">`).
  Colour tokens only.
- Floating-point algorithms (the $\pi$ continued fraction) drift after several
  steps; cap `maxSteps` where the trace is still exact (the famous convergents
  $22/7$ and $355/113$ appear well within the safe range).
