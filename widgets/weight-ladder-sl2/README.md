# weight-ladder-sl2

Self-contained **"ladder-op"** engine for the irreducible $\mathfrak{sl}_2(\mathbb{C})$
representations $V_n$ — the corpus's `ladder-op` gesture. Set the highest weight
$n$ (so $\dim V_n = n+1$) and apply the **raising operator $e$** and **lowering
operator $f$** to walk a basis vector up and down the weight ladder $n, n-2,
\dots, -n$: $f$ lowers the weight by 2 ($f\cdot v_k = (k+1)\,v_{k+1}$, killed at
the bottom), $e$ raises by 2 ($e\cdot v_k = (n-k+1)\,v_{k-1}$, killed at the top),
with the integer action coefficients shown. Starting from the highest-weight
vector and dropping $f$ repeatedly **spawns the whole $(n+1)$-dimensional irrep**
— the $\mathfrak{sl}_2$ rule that classifies everything. First home:
`lie-algebras §sl2-roots`.

## The gesture

- **raise: $e\cdot$** moves the current vector up the ladder (weight $+2$);
  **lower: $f\cdot$** moves it down ($-2$); each shows the integer coefficient and
  dies at the appropriate end. **↥ highest weight** returns to $v_0$. The
  **dim** $\pm$ buttons change $n$.

## Division of labor

This widget is concept-specific (the $V_n$ family of $\mathfrak{sl}_2$); it has no
author `bodyScript`. The renderer owns the weight ladder, the current-vector
highlight, the $e/f$ action arrows + coefficients + kill-at-the-ends, the
dimension control, and the readout. jsdom-safe (button-driven; no
getScreenCTM/rAF).

## Params

| param | required | default | meaning |
|---|---|---|---|
| `widgetId` / `svgId` / `outputId` / `title` | ✓ | — | DOM ids + title |
| `nInit` | | 4 | initial highest weight $n$ (dim $n+1$) |
| `nMax` | | 7 | largest $n$ the dim control allows |
| `hint` / `svgTitle` | | — / `title` | hint / accessible SVG title |
| `viewBox` / `svgWidth` / `svgHeight` | | `0 0 460 420` / 460 / 420 | SVG geometry |

## Usage

```json
{ "type": "widget", "slug": "weight-ladder-sl2", "params": {
  "widgetId": "w-sl2l", "svgId": "sl2l-svg", "outputId": "sl2l-out",
  "title": "…", "nInit": 4
} },
{ "type": "widget-script", "ref": "w-sl2l" }
```

Then `node scripts/rebuild.mjs --only widget-params` (AJV) and
`node scripts/rebuild.mjs` (byte-identical round-trip).

## Authoring notes

- Normalization (Humphreys, $v_k = f^k v_0 / k!$): $h\cdot v_k=(n-2k)v_k$,
  $e\cdot v_k=(n-k+1)v_{k-1}$, $f\cdot v_k=(k+1)v_{k+1}$ — integer coefficients,
  $e\cdot v_0=0$, $f\cdot v_n=0$.
- Colour tokens only (`var(--cyan)` current vector, `var(--green)` $e$ /
  `var(--pink)` $f$, `var(--mute)`/`var(--line)` chrome), never hex.
