# cup-product-grid

Self-contained **"click-to-multiply"** engine for a graded ring's multiplication
table — the corpus's `click-multiply` gesture, built for **cohomology rings** (the
cup product). The reader picks a space from a dropdown and **clicks a cell** of
the basis × basis grid; the engine shows the product $\alpha\smile\beta$ as an
element of the ring, with the **degrees adding** ($H^p\times H^q\to H^{p+q}$), the
**graded-commutativity sign** $(-1)^{pq}$ relating the cell to its transpose, and
products that **vanish** ($x^{n+1}=0$ past the top dimension, $a^2=0$ in an
exterior algebra) shown as $0$. It turns "cohomology is a ring" from a sentence
into a table you can read off. First home: `cohomology-and-duality
§cohomology-cup`.

## The gesture

- **Pick a space** from the dropdown, **click a cell** $(\alpha,\beta)$ — the
  readout names the product, the degree sum, and the graded-commutativity sign;
  the transpose cell $(\beta,\alpha)$ highlights pink as the sign partner.
  **Clear** deselects.

## Division of labor

- **Engine (this renderer):** owns the grid, the ring dropdown, cell selection +
  highlight (incl. the transpose/sign partner), and the readout. Pure DOM/table —
  jsdom-safe.
- **Author (`params.bodyScript`):** defines `function ring(ci){ return { basis:
  [{name, deg}, ...], prod: function(i, j){ return {c, k} | null; } }; }` — the
  additive basis (name + integer degree) and the product rule (coefficient `c`
  times basis index `k`, or `null` for 0) for the selected case `ci`.

## Params

| param | required | default | meaning |
|---|---|---|---|
| `widgetId` / `gridId` / `outputId` / `selectId` / `title` | ✓ | — | DOM ids + title |
| `cases` | ✓ | — | dropdown entries `[{label, ringLabel?}]` |
| `bodyScript` | ✓ | — | author JS: `ring(ci)` returning `{basis, prod}` |
| `hint` | | — | hint |
| `resetLabel` | | `↺ Clear` | clear-selection button label |

## Usage

```json
{ "type": "widget", "slug": "cup-product-grid", "params": {
  "widgetId": "w-cg", "gridId": "cg-table", "outputId": "cg-out", "selectId": "cg-sel",
  "title": "…",
  "cases": [
    { "label": "CP^3", "ringLabel": "H*(CP^3) = Z[x]/(x^4), |x|=2" },
    { "label": "T^2",  "ringLabel": "H*(T^2) = exterior(a,b), |a|=|b|=1" }
  ],
  "bodyScript": "function ring(ci){ if(ci===0) return { basis:[{name:'1',deg:0},{name:'x',deg:2},{name:'x\\u00b2',deg:4},{name:'x\\u00b3',deg:6}], prod:function(i,j){ return (i+j<=3)?{c:1,k:i+j}:null; } }; return { basis:[{name:'1',deg:0},{name:'a',deg:1},{name:'b',deg:1},{name:'ab',deg:2}], prod:function(i,j){ if(i===0)return{c:1,k:j}; if(j===0)return{c:1,k:i}; if(i===1&&j===2)return{c:1,k:3}; if(i===2&&j===1)return{c:-1,k:3}; return null; } }; }"
} },
{ "type": "widget-script", "ref": "w-cg" }
```

Then `node scripts/rebuild.mjs --only widget-params` (AJV) and
`node scripts/rebuild.mjs` (byte-identical round-trip).

## Authoring notes

- `prod(i,j)` must respect graded-commutativity: `prod(i,j)` and `prod(j,i)` must
  differ by exactly $(-1)^{\deg_i\deg_j}$ (the engine reads the sign off the
  degrees and shows the relation, but does not enforce it — get the rule right).
- Return `null` for products that vanish (top-dimension truncation, squares of
  odd classes). The engine renders them as `0`.
- Basis `name`s and `deg`s are plain text/integers; use Unicode (`x²`, `αβ`) not
  KaTeX in names. Colour tokens only.
- Good contrast pairs: $\mathbb{CP}^n$ (truncated polynomial, even degrees,
  commutes) vs $T^2$ (exterior, odd degrees, **anti**commutes) vs
  $S^2\times S^2$ (even-degree generators, commutes again).
