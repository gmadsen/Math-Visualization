# `ec-disc`

Bespoke semantic renderer for the **"Discriminant watch"** widget on `elliptic-curves` (§1 intro).

Two range sliders `a`, `b` drive the discriminant of $y^2 = x^3 + a x + b$,
$\Delta = -16(4a^3 + 27 b^2)$; the readout reports the value and classifies the real locus
($\Delta>0$: oval + unbounded component; $\Delta<0$: one unbounded component; $\Delta\approx0$:
node/cusp).

Migrated from a verbatim slug (opaque `bodyMarkup`/`bodyScript`) to this semantic renderer as the
first widget of the PLAN.md "hoist semantic params out of verbatim slugs" program. The slider
ranges/defaults (`params.a`, `params.b` = `{min,max,step,value}`), header `title`/`hint`, and DOM
`idPrefix` are now inspectable, AJV-validated params; the discriminant formula and classification
are the renderer's intrinsic behavior. Output is visually/behaviorally identical to the pre-migration
widget (the host div gained an `id`, the only convention gap the inline original had).

See [`schema.json`](./schema.json) for the param shape. Usage block in `content/elliptic-curves.json`:
`{ "type": "widget", "slug": "ec-disc", "params": { "widgetId": "disc", "title": …, "hint": …, "idPrefix": "disc", "a": {…}, "b": {…} } }` paired with `{ "type": "widget-script", "ref": "disc" }`.
