# shatter-arena

Self-contained **"construct-to-break"** arena for VC dimension / shattering —
the corpus's `construct-to-break` gesture. The reader **places points** and tries
to **shatter** them with a hypothesis class: the engine enumerates all $2^m$
labelings, asks the author's `realizes(plus, minus)` whether each is realizable,
and renders the verdict — **SHATTERED** if every labeling is realizable, else it
highlights the **forced witness** (the actual $\pm$ split no hypothesis can
produce). First home: `statistical-learning-theory §vc` (half-planes in
$\mathbb{R}^2$ — you can shatter 3 points but never 4, so $\mathrm{VC}=3$).

Unlike a passive counterexample gallery, it evaluates the reader's **own**
construction against a live predicate — placing a 4th point and discovering you
*can never* shatter it is how VC dimension stops being a definition and becomes
a thing your hands ran into.

## The gesture

- **Click empty space** to place a point (up to `maxPoints`), **drag** a point to
  move it, **click a point** to delete it. The verdict updates live: SHATTERED, or
  the impossible $\pm$ split highlighted (pink vs hollow). **Reset** restores the
  initial points.

## Division of labor

- **Engine (this renderer):** owns point placement (add/move/delete), the
  all-$2^m$-dichotomies enumeration, the witness highlight, the verdict + counts,
  and Reset. jsdom-safe.
- **Author (`params.bodyScript`):** defines `function realizes(plus, minus){
  return bool; }` — given the $+$ and $-$ point arrays of one dichotomy (each an
  array of `[x,y]`), whether some hypothesis realizes it (for half-planes:
  linear separability, e.g. via the separating-axis theorem). Must return `true`
  when `plus` or `minus` is empty.

## Params

| param | required | default | meaning |
|---|---|---|---|
| `widgetId` / `svgId` / `outputId` / `title` | ✓ | — | DOM ids + title |
| `bodyScript` | ✓ | — | author JS: `realizes(plus, minus)` |
| `className` | | `a hypothesis` | class name in the verdict sentence |
| `vcDim` | | — | VC dim; states the theorem once points > vcDim and not shattered |
| `maxPoints` | | 6 | cap on points (caps the $2^m$ enumeration) |
| `initialPoints` | | a triangle | initial point positions in data coords |
| `range` | | 5 | half-width of the square data window |
| `hint` / `svgTitle` | | — / `title` | hint / accessible SVG title |
| `viewBox` / `svgWidth` / `svgHeight` | | `0 0 560 420` / 560 / 420 | SVG geometry |
| `resetLabel` | | `↺ Reset` | Reset label |

## Usage

```json
{ "type": "widget", "slug": "shatter-arena", "params": {
  "widgetId": "w-vcs", "svgId": "vcs-svg", "outputId": "vcs-out",
  "title": "…", "className": "a half-plane", "vcDim": 3, "maxPoints": 5,
  "bodyScript": "function realizes(plus,minus){ if(!plus.length||!minus.length) return true; var all=plus.concat(minus); for(var i=0;i<all.length;i++)for(var j=i+1;j<all.length;j++){ var wx=-(all[i][1]-all[j][1]),wy=(all[i][0]-all[j][0]); if(!wx&&!wy)continue; var pm=1e9,pM=-1e9,mm=1e9,mM=-1e9; for(var a=0;a<plus.length;a++){var d=wx*plus[a][0]+wy*plus[a][1];if(d<pm)pm=d;if(d>pM)pM=d;} for(var b=0;b<minus.length;b++){var d=wx*minus[b][0]+wy*minus[b][1];if(d<mm)mm=d;if(d>mM)mM=d;} var e=1e-7*(Math.abs(wx)+Math.abs(wy)); if(pM<mm-e||mM<pm-e) return true; } return false; }"
} },
{ "type": "widget-script", "ref": "w-vcs" }
```

Then `node scripts/rebuild.mjs --only widget-params` (AJV) and
`node scripts/rebuild.mjs` (byte-identical round-trip).

## Authoring notes

- `realizes` runs $2^m$ times per redraw, so keep it cheap. The separating-axis
  test above is $O(m^3)$ — fine for `maxPoints` ≤ 6 (≤ 64·216 ops).
- The half-plane predicate assumes points in **general position** (no 3
  collinear); the strict-separation `eps` makes a labeling whose separating line
  would pass exactly through a point count as *not* realizable. For a pedagogical
  toy this is the right convention.
- Other classes: axis-aligned rectangles (VC = 4), intervals on a line (VC = 2),
  disks (VC = 3) — each is a different `realizes`.
- Colour tokens only (`var(--pink)` / `var(--blue)` witness split, `var(--cyan)`
  neutral, `var(--green)` shattered), never hex.
