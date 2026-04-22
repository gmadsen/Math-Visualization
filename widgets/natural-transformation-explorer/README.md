# natural-transformation-explorer

An interactive category-theory widget: renders the naturality square for
$F=\operatorname{Hom}(X,-)$, $G=\operatorname{Hom}(Y,-)$ with $\eta$ induced by a
fixed $u\colon Y\to X$ sending $y\mapsto x_1$. The four corners $\operatorname{Hom}(X,A)$,
$\operatorname{Hom}(X,B)$, $\operatorname{Hom}(Y,A)$, $\operatorname{Hom}(Y,B)$ are displayed as
cell grids; the reader drags two sliders (one for the morphism $f\colon A\to B$,
one for $\varphi\in\operatorname{Hom}(X,A)$) and the widget chases $\varphi$ both
ways around the square, highlighting the common endpoint in green whenever the
two routes agree — which is always. First introduced on `category-theory.html`
section `#nat` as `w-nat`.

The `schema.json` describes the params: DOM ids for the widget container, SVG,
readout, the two sliders and their label/button nodes; display strings `title`,
`hint`, `intro`, `fLabel`, `phiLabel`, `playLabel`; SVG `viewBox`, `width`,
`height`; `setA` and `setB` (display strings for the elements of $A$ and $B$
— the sizes $|X|=2$, $|Y|=1$, $|A|=3$, $|B|=2$ are baked into the widget's
enumeration logic); `grids`, a four-entry object (`HXA`, `HXB`, `HYA`, `HYB`)
each giving grid geometry and axis-header strings; initial slider indices;
and slider `min`/`max`/`step` triples. `sectionComment` is emitted verbatim
between `<script>` and the IIFE, so it can be either empty (w-nat) or a full
`/* banner */\n` line (w-cat-style).

`index.mjs` exports two pure string-returning functions: `renderMarkup(params)`
emits the `<div class="widget">…</div>` HTML, and `renderScript(params)` emits
the `<script>…</script>` IIFE. Both outputs are byte-identical to the original
inline source on `category-theory.html` for the w-nat params, which is how the
round-trip gate (`cmp -s /tmp/ct-rendered.html category-theory.html`) stays
green.
